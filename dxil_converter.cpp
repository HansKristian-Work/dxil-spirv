/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include "opcodes/converter_impl.hpp"
#include "opcodes/opcodes_dxil_builtins.hpp"
#include "opcodes/opcodes_llvm_builtins.hpp"
#include "opcodes/dxil/dxil_common.hpp"
#include "opcodes/dxil/dxil_ags.hpp"
#include "opcodes/dxil/dxil_workgraph.hpp"

#include "dxil_converter.hpp"
#include "logging.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"

#include <utility>
#include <algorithm>

namespace dxil_spv
{
Converter::Converter(LLVMBCParser &bitcode_parser_, LLVMBCParser *bitcode_reflection_parser_, SPIRVModule &module_)
{
	impl = std::make_unique<Impl>(bitcode_parser_, bitcode_reflection_parser_, module_);
}

Converter::~Converter()
{
}

void Converter::add_local_root_constants(uint32_t register_space, uint32_t register_index, uint32_t num_words)
{
	LocalRootSignatureEntry entry = {};
	entry.type = LocalRootSignatureType::Constants;
	entry.constants.num_words = num_words;
	entry.constants.register_space = register_space;
	entry.constants.register_index = register_index;
	impl->local_root_signature.push_back(entry);
}

void Converter::add_local_root_descriptor(ResourceClass type, uint32_t register_space, uint32_t register_index)
{
	LocalRootSignatureEntry entry = {};
	entry.type = LocalRootSignatureType::Descriptor;
	entry.descriptor.type = type;
	entry.descriptor.register_space = register_space;
	entry.descriptor.register_index = register_index;
	impl->local_root_signature.push_back(entry);
}

void Converter::add_local_root_descriptor_table(Vector<DescriptorTableEntry> entries)
{
	LocalRootSignatureEntry entry = {};
	entry.type = LocalRootSignatureType::Table;
	entry.table_entries = std::move(entries);
	impl->local_root_signature.push_back(std::move(entry));
}

void Converter::add_local_root_descriptor_table(const DescriptorTableEntry *entries, size_t count)
{
	add_local_root_descriptor_table({ entries, entries + count });
}

void Converter::get_workgroup_dimensions(uint32_t &x, uint32_t &y, uint32_t &z) const
{
	x = impl->execution_mode_meta.workgroup_threads[0];
	y = impl->execution_mode_meta.workgroup_threads[1];
	z = impl->execution_mode_meta.workgroup_threads[2];
}

uint32_t Converter::get_patch_vertex_count() const
{
	return impl->execution_mode_meta.stage_input_num_vertex;
}

void Converter::get_compute_wave_size_range(uint32_t &min, uint32_t &max, uint32_t &preferred) const
{
	min = impl->execution_mode_meta.wave_size_min;
	max = impl->execution_mode_meta.wave_size_max;
	preferred = impl->execution_mode_meta.wave_size_preferred;
}

uint32_t Converter::get_compute_heuristic_max_wave_size() const
{
	if (impl->execution_mode_meta.wave_size_min)
		return 0;

	return impl->execution_mode_meta.heuristic_max_wave_size;
}

bool Converter::shader_requires_feature(ShaderFeature feature) const
{
	switch (feature)
	{
	case ShaderFeature::Native16BitOperations:
		return impl->builder().hasCapability(spv::CapabilityFloat16) ||
		       impl->builder().hasCapability(spv::CapabilityInt16);

	default:
		return false;
	}
}

bool Converter::get_driver_version(uint32_t &driver_id, uint32_t &driver_version) const
{
	if (impl->options.driver_version == 0)
		return false;

	driver_id = impl->options.driver_id;
	driver_version = impl->options.driver_version;
	return true;
}

ConvertedFunction Converter::convert_entry_point()
{
	return impl->convert_entry_point();
}

template <typename T = uint32_t>
static T get_constant_metadata(const llvm::MDNode *node, unsigned index)
{
	return T(
	    llvm::cast<llvm::ConstantAsMetadata>(node->getOperand(index))->getValue()->getUniqueInteger().getSExtValue());
}

static String get_string_metadata(const llvm::MDNode *node, unsigned index)
{
#ifdef HAVE_LLVMBC
	return llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
#else
	std::string tmp = llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
	String str(tmp.begin(), tmp.end());
	return str;
#endif
}

static String get_resource_name_metadata(const llvm::MDNode *node, const llvm::MDNode *reflections)
{
	if (reflections)
	{
		unsigned bind_space = get_constant_metadata(node, 3);
		unsigned bind_register = get_constant_metadata(node, 4);
		unsigned num_operands = reflections->getNumOperands();
		for (unsigned i = 0; i < num_operands; i++)
		{
			auto *refl_node = llvm::cast<llvm::MDNode>(reflections->getOperand(i));
			if (get_constant_metadata(refl_node, 3) == bind_space &&
			    get_constant_metadata(refl_node, 4) == bind_register)
			{
				return get_string_metadata(refl_node, 2);
			}
		}
	}

	return get_string_metadata(node, 2);
}

static spv::Dim image_dimension_from_resource_kind(DXIL::ResourceKind kind)
{
	switch (kind)
	{
	case DXIL::ResourceKind::Texture1D:
	case DXIL::ResourceKind::Texture1DArray:
		return spv::Dim1D;
	case DXIL::ResourceKind::Texture2D:
	case DXIL::ResourceKind::Texture2DMS:
	case DXIL::ResourceKind::Texture2DArray:
	case DXIL::ResourceKind::Texture2DMSArray:
	case DXIL::ResourceKind::FeedbackTexture2D:
	case DXIL::ResourceKind::FeedbackTexture2DArray:
		return spv::Dim2D;
	case DXIL::ResourceKind::Texture3D:
		return spv::Dim3D;
	case DXIL::ResourceKind::TextureCube:
	case DXIL::ResourceKind::TextureCubeArray:
		return spv::DimCube;

	case DXIL::ResourceKind::TypedBuffer:
	case DXIL::ResourceKind::StructuredBuffer:
	case DXIL::ResourceKind::RawBuffer:
		return spv::DimBuffer;

	default:
		return spv::DimMax;
	}
}

static bool image_dimension_is_arrayed(DXIL::ResourceKind kind)
{
	switch (kind)
	{
	case DXIL::ResourceKind::Texture1DArray:
	case DXIL::ResourceKind::Texture2DArray:
	case DXIL::ResourceKind::Texture2DMSArray:
	case DXIL::ResourceKind::TextureCubeArray:
	case DXIL::ResourceKind::FeedbackTexture2DArray:
		return true;

	default:
		return false;
	}
}

static bool image_dimension_is_multisampled(DXIL::ResourceKind kind)
{
	switch (kind)
	{
	case DXIL::ResourceKind::Texture2DMS:
	case DXIL::ResourceKind::Texture2DMSArray:
		return true;

	default:
		return false;
	}
}

static DXIL::ComponentType convert_16bit_component_to_32bit(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::F16:
		return DXIL::ComponentType::F32;
	case DXIL::ComponentType::I16:
		return DXIL::ComponentType::I32;
	case DXIL::ComponentType::U16:
		return DXIL::ComponentType::U32;
	default:
		return type;
	}
}

static DXIL::ComponentType convert_component_to_unsigned(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::I16:
		return DXIL::ComponentType::U16;
	case DXIL::ComponentType::I32:
		return DXIL::ComponentType::U32;
	case DXIL::ComponentType::I64:
		return DXIL::ComponentType::U64;
	default:
		return type;
	}
}

static DXIL::ComponentType normalize_component_type(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::UNormF16:
	case DXIL::ComponentType::SNormF16:
		return DXIL::ComponentType::F16;

	case DXIL::ComponentType::UNormF32:
	case DXIL::ComponentType::SNormF32:
		return DXIL::ComponentType::F32;

	case DXIL::ComponentType::UNormF64:
	case DXIL::ComponentType::SNormF64:
		return DXIL::ComponentType::F64;

	default:
		return type;
	}
}

static spv::Id build_ssbo_runtime_array_type(Converter::Impl &impl, RawType type, unsigned bits, unsigned vecsize,
                                             unsigned range_size, const String &name)
{
	auto &builder = impl.builder();
	spv::Id value_type = type == RawType::Integer ? builder.makeUintType(bits) : builder.makeFloatType(bits);
	if (vecsize > 1)
		value_type = builder.makeVectorType(value_type, vecsize);
	spv::Id element_array_type = builder.makeRuntimeArray(value_type);
	builder.addDecoration(element_array_type, spv::DecorationArrayStride, vecsize * (bits / 8));
	spv::Id block_type_id = impl.get_struct_type({ element_array_type }, 0, name.c_str());
	builder.addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	builder.addDecoration(block_type_id, spv::DecorationBlock);

	spv::Id type_id = block_type_id;
	if (range_size != 1)
	{
		assert(range_size != 0);
		if (range_size == ~0u)
			type_id = builder.makeRuntimeArray(type_id);
		else
			type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
	}

	return type_id;
}

Vector<Converter::Impl::RawDeclarationVariable>
Converter::Impl::create_bindless_heap_variable_alias_group(const BindlessInfo &base_info,
                                                           const Vector<RawDeclaration> &raw_decls)
{
	Vector<RawDeclarationVariable> decls;
	decls.reserve(raw_decls.size());

	for (auto &decl : raw_decls)
	{
		RawDeclarationVariable var = {};
		var.declaration = decl;

		auto info = base_info;
		info.component = raw_width_to_component_type(decl.type, decl.width);
		info.raw_vecsize = decl.vecsize;
		var.var_id = create_bindless_heap_variable(info);
		decls.push_back(var);
	}

	return decls;
}

spv::Id Converter::Impl::create_ubo_variable(const RawDeclaration &raw_decl, uint32_t range_size, const String &name,
                                             unsigned cbv_size)
{
	auto &builder = spirv_module.get_builder();

	unsigned element_size = raw_width_to_bits(raw_decl.width) * raw_vecsize_to_vecsize(raw_decl.vecsize) / 8;
	unsigned array_length = (cbv_size + element_size - 1) / element_size;

	// It seems like we will have to bitcast ourselves away from vec4 here after loading.
	spv::Id size_id = builder.makeUintConstant(array_length, false);

	unsigned bits = raw_width_to_bits(raw_decl.width);
	spv::Id element_type = raw_decl.type == RawType::Float ? builder.makeFloatType(bits) : builder.makeUintType(bits);

	if (raw_decl.vecsize != RawVecSize::V1)
		element_type = builder.makeVectorType(element_type, raw_vecsize_to_vecsize(raw_decl.vecsize));
	spv::Id member_array_type = builder.makeArrayType(element_type, size_id, element_size);

	builder.addDecoration(member_array_type, spv::DecorationArrayStride, element_size);

	auto ubo_block_name = name.empty() ? "" : (name + "UBO");
	spv::Id type_id = get_struct_type({ member_array_type }, 0, ubo_block_name.c_str());
	builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
	builder.addDecoration(type_id, spv::DecorationBlock);

	if (range_size != 1)
	{
		if (range_size == ~0u)
			type_id = builder.makeRuntimeArray(type_id);
		else
			type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
	}

	if (raw_decl.width == RawWidth::B16)
		builder.addCapability(spv::CapabilityUniformAndStorageBuffer16BitAccess);
	else if (raw_decl.width == RawWidth::B8)
	{
		builder.addExtension("SPV_KHR_8bit_storage");
		builder.addCapability(spv::CapabilityUniformAndStorageBuffer8BitAccess);
	}

	return create_variable(spv::StorageClassUniform,
	                       type_id, name.empty() ? nullptr : name.c_str());
}

spv::Id Converter::Impl::create_raw_ssbo_variable(const RawDeclaration &raw_decl, uint32_t range_size, const String &name)
{
	spv::Id type_id = build_ssbo_runtime_array_type(*this,
	                                                raw_decl.type,
	                                                raw_width_to_bits(raw_decl.width),
	                                                raw_vecsize_to_vecsize(raw_decl.vecsize),
	                                                range_size, name + "SSBO");

	if (raw_decl.width == RawWidth::B16)
		builder().addCapability(spv::CapabilityStorageBuffer16BitAccess);
	else if (raw_decl.width == RawWidth::B8)
	{
		builder().addExtension("SPV_KHR_8bit_storage");
		builder().addCapability(spv::CapabilityStorageBuffer8BitAccess);
	}

	return create_variable(spv::StorageClassStorageBuffer, type_id, name.empty() ? nullptr : name.c_str());
}

Vector<Converter::Impl::RawDeclarationVariable> Converter::Impl::create_raw_ssbo_variable_alias_group(
		const Vector<RawDeclaration> &raw_decls,
		uint32_t range_size, const String &name)
{
	Vector<RawDeclarationVariable> group;
	group.reserve(raw_decls.size());
	for (auto &decl : raw_decls)
		group.push_back({ decl, create_raw_ssbo_variable(decl, range_size, name) });
	return group;
}

Vector<Converter::Impl::RawDeclarationVariable> Converter::Impl::create_ubo_variable_alias_group(
		const Vector<RawDeclaration> &raw_decls,
		uint32_t range_size, const String &name, unsigned cbv_size)
{
	Vector<RawDeclarationVariable> group;
	group.reserve(raw_decls.size());
	for (auto &decl : raw_decls)
		group.push_back({ decl, create_ubo_variable(decl, range_size, name, cbv_size) });
	return group;
}

spv::Id Converter::Impl::create_bindless_heap_variable(const BindlessInfo &info)
{
	auto itr = std::find_if(bindless_resources.begin(), bindless_resources.end(), [&](const BindlessResource &resource) {
		return
			resource.info.type == info.type &&
			resource.info.component == info.component &&
			resource.info.raw_vecsize == info.raw_vecsize &&
			resource.info.kind == info.kind &&
			resource.info.desc_set == info.desc_set &&
			resource.info.format == info.format &&
			resource.info.binding == info.binding &&
			resource.info.uav_read == info.uav_read &&
			resource.info.uav_written == info.uav_written &&
			resource.info.uav_coherent == info.uav_coherent &&
			resource.info.relaxed_precision == info.relaxed_precision &&
			resource.info.aliased == info.aliased &&
			resource.info.counters == info.counters &&
			resource.info.offsets == info.offsets &&
			resource.info.descriptor_type == info.descriptor_type;
	});

	if (itr != bindless_resources.end())
	{
		return itr->var_id;
	}
	else
	{
		BindlessResource resource = {};
		resource.info = info;

		spv::Id type_id = 0;
		auto storage = spv::StorageClassMax;

		switch (info.type)
		{
		case DXIL::ResourceType::SRV:
		{
			if (info.kind == DXIL::ResourceKind::RTAccelerationStructure)
			{
				if (info.descriptor_type == VulkanDescriptorType::SSBO)
				{
					type_id = build_ssbo_runtime_array_type(*this, RawType::Integer, 32, 2, 1, "RTASHeap");
					storage = spv::StorageClassStorageBuffer;
				}
				else
				{
					type_id = builder().makeAccelerationStructureType();
					type_id = builder().makeRuntimeArray(type_id);
					storage = spv::StorageClassUniformConstant;
				}
			}
			else if (info.descriptor_type == VulkanDescriptorType::SSBO)
			{
				RawType raw_type = raw_component_type_to_type(info.component);
				unsigned bits = raw_component_type_to_bits(info.component);

				if (info.offsets)
					type_id = build_ssbo_runtime_array_type(*this, raw_type, 32, 2, 1, "SSBO_Offsets");
				else
					type_id = build_ssbo_runtime_array_type(*this, raw_type, bits, raw_vecsize_to_vecsize(info.raw_vecsize),
					                                        ~0u, "SSBO");
				storage = spv::StorageClassStorageBuffer;
				if (bits == 16)
					builder().addCapability(spv::CapabilityStorageBuffer16BitAccess);
				else if (bits == 8)
				{
					builder().addExtension("SPV_KHR_8bit_storage");
					builder().addCapability(spv::CapabilityStorageBuffer8BitAccess);
				}
			}
			else
			{
				if (info.component != DXIL::ComponentType::U32 &&
				    info.component != DXIL::ComponentType::I32 &&
				    info.component != DXIL::ComponentType::F32)
				{
					LOGE("Invalid component type for image.\n");
					return 0;
				}

				spv::Id sampled_type_id = get_type_id(info.component, 1, 1);
				type_id = builder().makeImageType(sampled_type_id, image_dimension_from_resource_kind(info.kind), false,
				                                  image_dimension_is_arrayed(info.kind),
				                                  image_dimension_is_multisampled(info.kind), 1, spv::ImageFormatUnknown);
				type_id = builder().makeRuntimeArray(type_id);
				storage = spv::StorageClassUniformConstant;
			}
			break;
		}

		case DXIL::ResourceType::UAV:
		{
			if (info.counters)
			{
				spv::Id uint_type = builder().makeUintType(32);
				spv::Id uvec2_type = builder().makeVectorType(uint_type, 2);

				spv::Id runtime_array_type_id = builder().makeRuntimeArray(uvec2_type);
				builder().addDecoration(runtime_array_type_id, spv::DecorationArrayStride, sizeof(uint64_t));

				type_id = get_struct_type({ runtime_array_type_id }, 0, "AtomicCounters");
				builder().addDecoration(type_id, spv::DecorationBlock);
				builder().addMemberName(type_id, 0, "counters");
				builder().addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
				builder().addMemberDecoration(type_id, 0, spv::DecorationNonWritable);
				storage = spv::StorageClassStorageBuffer;
			}
			else if (info.descriptor_type == VulkanDescriptorType::SSBO)
			{
				RawType raw_type = raw_component_type_to_type(info.component);
				unsigned bits = raw_component_type_to_bits(info.component);

				type_id = build_ssbo_runtime_array_type(*this, raw_type, bits, raw_vecsize_to_vecsize(info.raw_vecsize),
				                                        ~0u, "SSBO");
				storage = spv::StorageClassStorageBuffer;
				if (bits == 16)
					builder().addCapability(spv::CapabilityStorageBuffer16BitAccess);
				else if (bits == 8)
				{
					builder().addExtension("SPV_KHR_8bit_storage");
					builder().addCapability(spv::CapabilityStorageBuffer8BitAccess);
				}
			}
			else
			{
				if (info.component != DXIL::ComponentType::U32 &&
				    info.component != DXIL::ComponentType::I32 &&
				    info.component != DXIL::ComponentType::F32 &&
				    info.component != DXIL::ComponentType::U64)
				{
					LOGE("Invalid component type for image.\n");
					return 0;
				}

				spv::Id sampled_type_id = get_type_id(info.component, 1, 1);
				type_id = builder().makeImageType(sampled_type_id, image_dimension_from_resource_kind(info.kind), false,
				                                  image_dimension_is_arrayed(info.kind),
				                                  image_dimension_is_multisampled(info.kind), 2, info.format);
				type_id = builder().makeRuntimeArray(type_id);
				storage = spv::StorageClassUniformConstant;
			}
			break;
		}

		case DXIL::ResourceType::Sampler:
			type_id = builder().makeSamplerType();
			type_id = builder().makeRuntimeArray(type_id);
			storage = spv::StorageClassUniformConstant;
			break;

		case DXIL::ResourceType::CBV:
		{
			RawType raw_type = raw_component_type_to_type(info.component);
			unsigned bits = raw_component_type_to_bits(info.component);

			unsigned vecsize = raw_vecsize_to_vecsize(info.raw_vecsize);
			type_id = raw_type == RawType::Float ? builder().makeFloatType(bits) : builder().makeUintType(bits);
			if (vecsize > 1)
				type_id = builder().makeVectorType(type_id, vecsize);

			unsigned element_size = (bits / 8) * vecsize;
			unsigned num_elements = 0x10000 / element_size;

			type_id = builder().makeArrayType(type_id, builder().makeUintConstant(num_elements), element_size);
			builder().addDecoration(type_id, spv::DecorationArrayStride, element_size);
			type_id = get_struct_type({ type_id }, 0, "BindlessCBV");
			builder().addDecoration(type_id, spv::DecorationBlock);
			if (options.bindless_cbv_ssbo_emulation)
				builder().addMemberDecoration(type_id, 0, spv::DecorationNonWritable);
			builder().addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
			type_id = builder().makeRuntimeArray(type_id);
			storage = options.bindless_cbv_ssbo_emulation ? spv::StorageClassStorageBuffer : spv::StorageClassUniform;

			if (bits == 16)
			{
				if (options.bindless_cbv_ssbo_emulation)
					builder().addCapability(spv::CapabilityStorageBuffer16BitAccess);
				else
					builder().addCapability(spv::CapabilityUniformAndStorageBuffer16BitAccess);
			}
			else if (bits == 8)
			{
				builder().addExtension("SPV_KHR_8bit_storage");
				if (options.bindless_cbv_ssbo_emulation)
					builder().addCapability(spv::CapabilityStorageBuffer8BitAccess);
				else
					builder().addCapability(spv::CapabilityUniformAndStorageBuffer8BitAccess);
			}
			break;
		}

		default:
			return 0;
		}

		builder().addExtension("SPV_EXT_descriptor_indexing");
		builder().addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
		resource.var_id = create_variable(storage, type_id);

		auto &meta = handle_to_resource_meta[resource.var_id];
		meta = {};
		meta.kind = info.kind;
		meta.component_type = info.component;
		meta.raw_component_vecsize = info.raw_vecsize;
		meta.var_id = resource.var_id;
		meta.storage = storage;

		builder().addDecoration(resource.var_id, spv::DecorationDescriptorSet, info.desc_set);
		builder().addDecoration(resource.var_id, spv::DecorationBinding, info.binding);

		if (info.relaxed_precision)
		{
			builder().addDecoration(resource.var_id, spv::DecorationRelaxedPrecision);

			// Signal the intended component type.
			switch (meta.component_type)
			{
			case DXIL::ComponentType::F32:
				meta.component_type = DXIL::ComponentType::F16;
				break;

			case DXIL::ComponentType::I32:
				meta.component_type = DXIL::ComponentType::I16;
				break;

			case DXIL::ComponentType::U32:
				meta.component_type = DXIL::ComponentType::U16;
				break;

			default:
				break;
			}
		}

		if (info.type == DXIL::ResourceType::UAV && !info.counters)
		{
			if (!info.uav_read)
				builder().addDecoration(resource.var_id, spv::DecorationNonReadable);
			if (!info.uav_written)
				builder().addDecoration(resource.var_id, spv::DecorationNonWritable);
			if (info.uav_coherent && execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
				builder().addDecoration(resource.var_id, spv::DecorationCoherent);
		}
		else if (info.counters)
		{
			builder().addDecoration(resource.var_id, spv::DecorationAliasedPointer);
		}
		else if (info.type == DXIL::ResourceType::SRV && info.descriptor_type == VulkanDescriptorType::SSBO)
		{
			builder().addDecoration(resource.var_id, spv::DecorationNonWritable);
			builder().addDecoration(resource.var_id, spv::DecorationRestrict);
		}

		// The default in Vulkan environment is Restrict.
		if (info.aliased && info.type == DXIL::ResourceType::UAV)
			builder().addDecoration(resource.var_id, spv::DecorationAliased);

		bindless_resources.push_back(resource);
		return resource.var_id;
	}
}

Converter::Impl::ResourceVariableMeta Converter::Impl::get_resource_variable_meta(const llvm::MDNode *resource) const
{
	ResourceVariableMeta meta = {};

	if (!resource)
		return meta;

	if (const auto *variable = llvm::dyn_cast<llvm::ConstantAsMetadata>(resource->getOperand(1)))
	{
		const llvm::Value *val = variable->getValue();
		const auto *global = llvm::dyn_cast<llvm::GlobalVariable>(val);

		// It's possible that the variable is a constexpr bitcast, so resolve those ...
		while (!global && val)
		{
			auto *constexpr_op = llvm::dyn_cast<llvm::ConstantExpr>(val);
			val = nullptr;

			if (constexpr_op && constexpr_op->getOpcode() == llvm::UnaryOperator::BitCast)
			{
				val = constexpr_op->getOperand(0);
				global = llvm::dyn_cast<llvm::GlobalVariable>(val);
			}
		}

		if (global)
		{
			meta.is_lib_variable = true;
			meta.is_active = llvm_active_global_resource_variables.count(global) != 0;
			return meta;
		}
	}

	meta.is_active = true;
	return meta;
}

void Converter::Impl::register_resource_meta_reference(const llvm::MDOperand &operand, DXIL::ResourceType type, unsigned index)
{
	// In RT shaders, apps will load dummy structs from global variables.
	// Here we get the chance to redirect them towards the resource meta declaration.
	if (operand)
	{
		auto *value = llvm::cast<llvm::ConstantAsMetadata>(operand)->getValue();

		// In lib_6_6, this is somehow a bitcasted pointer expression, sigh ...
		// Drill deep until we actually find the original resource.
		while (auto *cexpr = llvm::dyn_cast<llvm::ConstantExpr>(value))
		{
			if (cexpr->getOpcode() == llvm::Instruction::BitCast)
				value = cexpr->getOperand(0);
			else
				break;
		}

		auto *global_variable = llvm::dyn_cast<llvm::GlobalVariable>(value);
		if (global_variable)
			llvm_global_variable_to_resource_mapping[global_variable] = { type, index, nullptr, global_variable, false };
	}
}

bool Converter::Impl::emit_resources_global_mapping(DXIL::ResourceType type, const llvm::MDNode *node)
{
	unsigned num_resources = node->getNumOperands();
	for (unsigned i = 0; i < num_resources; i++)
	{
		auto *resource = llvm::cast<llvm::MDNode>(node->getOperand(i));
		unsigned index = get_constant_metadata(resource, 0);

		if (type == DXIL::ResourceType::UAV)
		{
			unsigned bind_space = get_constant_metadata(resource, 3);
			auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(resource, 6));
			if (bind_space == AgsUAVMagicRegisterSpace && resource_kind == DXIL::ResourceKind::RawBuffer)
				ags.uav_magic_resource_type_index = index;
		}
		register_resource_meta_reference(resource->getOperand(1), type, index);
	}
	return true;
}

spv::Id Converter::Impl::get_physical_pointer_block_type(spv::Id base_type_id, const PhysicalPointerMeta &meta)
{
	auto itr = std::find_if(physical_pointer_entries.begin(), physical_pointer_entries.end(), [&](const PhysicalPointerEntry &entry) {
		return entry.meta.coherent == meta.coherent &&
		       entry.meta.nonreadable == meta.nonreadable &&
		       entry.meta.nonwritable == meta.nonwritable &&
		       entry.meta.size == meta.size &&
		       entry.meta.stride == meta.stride &&
		       entry.base_type_id == base_type_id;
	});

	if (itr != physical_pointer_entries.end())
		return itr->ptr_type_id;

	int vecsize = builder().getNumTypeComponents(base_type_id);
	int width = builder().getScalarTypeWidth(base_type_id);

	spv::Op op = builder().getTypeClass(base_type_id);
	if (op == spv::OpTypeVector)
		op = builder().getTypeClass(builder().getScalarTypeId(base_type_id));

	String type = "PhysicalPointer";
	switch (op)
	{
	case spv::OpTypeFloat:
		if (width == 16)
			type += "Half";
		else if (width == 32)
			type += "Float";
		else if (width == 64)
			type += "Double";
		break;

	case spv::OpTypeInt:
		if (width == 16)
			type += "Ushort";
		else if (width == 32)
			type += "Uint";
		else if (width == 64)
			type += "Uint64";
		break;

	default:
		break;
	}

	if (vecsize > 1)
		type += std::to_string(vecsize).c_str();

	if (meta.nonwritable)
		type += "NonWrite";
	if (meta.nonreadable)
		type += "NonRead";
	if (meta.coherent)
		type += "Coherent";

	spv::Id type_id = base_type_id;

	if (meta.stride > 0)
	{
		if (meta.size == 0)
		{
			type_id = builder().makeRuntimeArray(type_id);
			type += "Array";
		}
		else
		{
			type_id = builder().makeArrayType(type_id, builder().makeUintConstant(meta.size / meta.stride),
			                                  meta.stride);
			type += "CBVArray";
		}
		builder().addDecoration(type_id, spv::DecorationArrayStride, meta.stride);
	}

	spv::Id block_type_id = builder().makeStructType({ type_id }, type.c_str());
	builder().addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	builder().addMemberName(block_type_id, 0, "value");
	builder().addDecoration(block_type_id, spv::DecorationBlock);

	if (meta.nonwritable)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonWritable);
	if (meta.nonreadable)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonReadable);
	if (meta.coherent && execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationCoherent);

	spv::Id ptr_type_id = builder().makePointer(spv::StorageClassPhysicalStorageBuffer, block_type_id);
	PhysicalPointerEntry new_entry = {};
	new_entry.ptr_type_id = ptr_type_id;
	new_entry.base_type_id = base_type_id;
	new_entry.meta = meta;
	physical_pointer_entries.push_back(new_entry);
	return ptr_type_id;
}

static bool component_type_is_16bit(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::F16:
	case DXIL::ComponentType::I16:
	case DXIL::ComponentType::U16:
		return true;

	default:
		return false;
	}
}

bool Converter::Impl::analyze_aliased_access(const AccessTracking &tracking,
                                             VulkanDescriptorType descriptor_type,
                                             AliasedAccess &aliased_access) const
{
	bool raw_access_16bit = false;
	bool raw_access_64bit = false;

	for (int type_ = 0; type_ < int(RawType::Count); type_++)
	{
		for (int width_ = 0; width_ < int(RawWidth::Count); width_++)
		{
			auto width = RawWidth(width_);
			if (width == RawWidth::B16 && !execution_mode_meta.native_16bit_operations)
				continue;

			for (int vecsize_ = 0; vecsize_ < int(RawVecSize::Count); vecsize_++)
			{
				auto vecsize = RawVecSize(vecsize_);
				auto type = RawType(type_);
				// Non-native 16-bit SSBOs are declared as 32-bit, so avoid false aliases.
				bool has_decl = tracking.raw_access_buffer_declarations[type_][width_][vecsize_];
				if (!has_decl && RawWidth(width) == RawWidth::B32 && !execution_mode_meta.native_16bit_operations)
					has_decl = tracking.raw_access_buffer_declarations[type_][unsigned(RawWidth::B16)][vecsize_];

				if (has_decl)
				{
					if (width == RawWidth::B16)
						raw_access_16bit = true;
					else if (width == RawWidth::B64)
						raw_access_64bit = true;
					aliased_access.raw_declarations.push_back({ type, width, vecsize });

					aliased_access.primary_component_type = raw_width_to_component_type(type, width);
					aliased_access.primary_raw_vecsize = vecsize;
				}
			}
		}
	}

	if (raw_access_16bit &&
	    descriptor_type != VulkanDescriptorType::SSBO &&
	    descriptor_type != VulkanDescriptorType::UBO &&
	    descriptor_type != VulkanDescriptorType::BufferDeviceAddress)
	{
		LOGE("Raw 16-bit load-store was used, which must be implemented with SSBO, UBO or BDA.\n");
		return false;
	}

	if (raw_access_64bit &&
	    descriptor_type != VulkanDescriptorType::SSBO &&
	    descriptor_type != VulkanDescriptorType::UBO &&
	    descriptor_type != VulkanDescriptorType::BufferDeviceAddress)
	{
		LOGE("Raw 64-bit load-store was used, which must be implemented with SSBO, UBO or BDA.\n");
		return false;
	}

	// Only SSBO and UBO can be reclared with different types.
	// Typed descriptors are always scalar.
	aliased_access.requires_alias_decoration = (descriptor_type == VulkanDescriptorType::SSBO ||
	                                            descriptor_type == VulkanDescriptorType::UBO) &&
	                                           aliased_access.raw_declarations.size() > 1;

	// If we only emit one 16-bit or 64-bit SSBO/UBO, we need to override the component type of that meta declaration.
	aliased_access.override_primary_component_types = (descriptor_type == VulkanDescriptorType::SSBO ||
	                                                   descriptor_type == VulkanDescriptorType::UBO) &&
	                                                  aliased_access.raw_declarations.size() == 1;

	// If the SSBO is never actually accessed (UAV counters for example), fudge the default type.
	if (descriptor_type == VulkanDescriptorType::SSBO && aliased_access.raw_declarations.empty())
		aliased_access.raw_declarations.push_back({ RawType::Integer, RawWidth::B32, RawVecSize::V1 });

	// If the CBV is never actually accessed, fudge the default legacy CBV type.
	if (descriptor_type == VulkanDescriptorType::UBO && aliased_access.raw_declarations.empty())
		aliased_access.raw_declarations.push_back({ RawType::Float, RawWidth::B32, RawVecSize::V4 });

	// Safeguard against unused variables where we never end up setting any primary component type.
	if ((descriptor_type == VulkanDescriptorType::SSBO ||
	     descriptor_type == VulkanDescriptorType::UBO) &&
	    aliased_access.raw_declarations.size() == 1)
	{
		aliased_access.primary_component_type =
				raw_width_to_component_type(aliased_access.raw_declarations.front().type, aliased_access.raw_declarations.front().width);
		aliased_access.primary_raw_vecsize = aliased_access.raw_declarations.front().vecsize;
		aliased_access.override_primary_component_types = true;
	}

	return true;
}

bool Converter::Impl::emit_srvs(const llvm::MDNode *srvs, const llvm::MDNode *refl)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_srvs = srvs->getNumOperands();

	for (unsigned i = 0; i < num_srvs; i++)
	{
		auto *srv = llvm::cast<llvm::MDNode>(srvs->getOperand(i));

		auto var_meta = get_resource_variable_meta(srv);
		if (!var_meta.is_active)
			continue;

		unsigned index = get_constant_metadata(srv, 0);
		auto name = get_resource_name_metadata(srv, refl);
		unsigned bind_space = get_constant_metadata(srv, 3);
		unsigned bind_register = get_constant_metadata(srv, 4);
		unsigned range_size = get_constant_metadata(srv, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(srv, 6));

		llvm::MDNode *tags = nullptr;
		if (srv->getNumOperands() >= 9 && srv->getOperand(8))
			tags = llvm::dyn_cast<llvm::MDNode>(srv->getOperand(8));

		auto actual_component_type = DXIL::ComponentType::U32;
		auto effective_component_type = actual_component_type;

		unsigned stride = 0;

		if (tags && get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			actual_component_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1)));
			effective_component_type = get_effective_typed_resource_type(actual_component_type);
		}
		else
		{
			// Structured/Raw buffers, just use uint for good measure, we'll bitcast as needed.
			// Field 1 is stride, but we don't care about that unless we will support an SSBO path.
			if (tags)
				stride = get_constant_metadata(tags, 1);
		}

		unsigned alignment = resource_kind == DXIL::ResourceKind::RawBuffer ? 16 : (stride & -int(stride));

		DescriptorTableEntry local_table_entry = {};
		int local_root_signature_entry = get_local_root_signature_entry(
			ResourceClass::SRV, bind_space, bind_register, local_table_entry);
		bool need_resource_remapping = local_root_signature_entry < 0 ||
		                               local_root_signature[local_root_signature_entry].type == LocalRootSignatureType::Table;

		D3DBinding d3d_binding = {
			get_remapping_stage(execution_model), resource_kind, index, bind_space, bind_register, range_size, alignment,
		};
		VulkanSRVBinding vulkan_binding = { { bind_space, bind_register }, {} };
		if (need_resource_remapping && resource_mapping_iface && !resource_mapping_iface->remap_srv(d3d_binding, vulkan_binding))
		{
			LOGE("Failed to remap SRV %u:%u.\n", bind_space, bind_register);
			return false;
		}

		auto &access_meta = srv_access_tracking[index];

		AliasedAccess aliased_access;
		if (!analyze_aliased_access(access_meta,
		                            need_resource_remapping ?
		                            vulkan_binding.buffer_binding.descriptor_type :
		                            VulkanDescriptorType::BufferDeviceAddress, aliased_access))
		{
			return false;
		}

		bool rtas_bindless_ssbo = resource_kind == DXIL::ResourceKind::RTAccelerationStructure &&
		                          vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO &&
		                          vulkan_binding.buffer_binding.bindless.use_heap;

		if (range_size != 1 && !rtas_bindless_ssbo)
		{
			if (range_size == ~0u)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}

			if ((resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			     resource_kind == DXIL::ResourceKind::RawBuffer) &&
			    vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				builder.addCapability(spv::CapabilityStorageBufferArrayDynamicIndexing);
			}
			else if (resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			         resource_kind == DXIL::ResourceKind::RawBuffer || resource_kind == DXIL::ResourceKind::TypedBuffer)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityUniformTexelBufferArrayDynamicIndexingEXT);
			}
			else
				builder.addCapability(spv::CapabilitySampledImageArrayDynamicIndexing);
		}

		srv_index_to_reference.resize(std::max(srv_index_to_reference.size(), size_t(index + 1)));
		srv_index_to_offset.resize(std::max(srv_index_to_offset.size(), size_t(index + 1)));

		if (!get_ssbo_offset_buffer_id(srv_index_to_offset[index], vulkan_binding.buffer_binding,
		                               vulkan_binding.offset_binding, resource_kind, alignment))
			return false;

		BindlessInfo bindless_info = {};
		bindless_info.type = DXIL::ResourceType::SRV;
		bindless_info.component = effective_component_type;
		bindless_info.kind = resource_kind;
		bindless_info.desc_set = vulkan_binding.buffer_binding.descriptor_set;
		bindless_info.binding = vulkan_binding.buffer_binding.binding;
		bindless_info.descriptor_type = vulkan_binding.buffer_binding.descriptor_type;
		bindless_info.relaxed_precision = actual_component_type != effective_component_type &&
		                                  component_type_is_16bit(actual_component_type);

		if (local_root_signature_entry >= 0)
		{
			auto &entry = local_root_signature[local_root_signature_entry];
			if (entry.type == LocalRootSignatureType::Table)
			{
				if (!vulkan_binding.buffer_binding.bindless.use_heap)
				{
					LOGE("Table SBT entries must be bindless.\n");
					return false;
				}

				if (!var_meta.is_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				auto &ref = srv_index_to_reference[index];
				if (aliased_access.requires_alias_decoration)
				{
					ref.var_alias_group = create_bindless_heap_variable_alias_group(
						bindless_info, aliased_access.raw_declarations);
				}
				else if (aliased_access.override_primary_component_types)
				{
					auto tmp_info = bindless_info;
					tmp_info.component = aliased_access.primary_component_type;
					tmp_info.raw_vecsize = aliased_access.primary_raw_vecsize;
					ref.var_id = create_bindless_heap_variable(tmp_info);
				}
				else
				{
					ref.var_id = create_bindless_heap_variable(bindless_info);
				}

				ref.aliased = aliased_access.requires_alias_decoration;
				ref.base_offset = heap_offset;
				ref.base_resource_is_array = range_size != 1;
				ref.stride = stride;
				ref.bindless = true;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = resource_kind;
			}
			else
			{
				// Otherwise, we simply refer to the SBT directly to obtain a pointer.
				if (resource_kind != DXIL::ResourceKind::RawBuffer &&
				    resource_kind != DXIL::ResourceKind::StructuredBuffer &&
				    resource_kind != DXIL::ResourceKind::RTAccelerationStructure)
				{
					LOGE("SRV SBT root descriptors must be raw buffers, structured buffers or RTAS.\n");
					return false;
				}

				auto &ref = srv_index_to_reference[index];
				ref.var_id = shader_record_buffer_id;
				ref.stride = stride;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = resource_kind;

				if (range_size != 1)
				{
					LOGE("Cannot use descriptor array for root descriptors.\n");
					return false;
				}
			}
		}
		else if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::BufferDeviceAddress)
		{
			if (resource_kind != DXIL::ResourceKind::RawBuffer &&
			    resource_kind != DXIL::ResourceKind::StructuredBuffer &&
			    resource_kind != DXIL::ResourceKind::RTAccelerationStructure)
			{
				LOGE("BDA root descriptors must be raw buffers, structured buffers or RTAS.\n");
				return false;
			}

			auto &ref = srv_index_to_reference[index];
			ref.var_id = root_constant_id;
			ref.root_descriptor = true;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index;
			ref.stride = stride;
			ref.resource_kind = resource_kind;

			if (range_size != 1)
			{
				LOGE("Cannot use descriptor array for root descriptors.\n");
				return false;
			}
		}
		else if (vulkan_binding.buffer_binding.bindless.use_heap)
		{
			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer_binding.bindless.heap_root_offset;
			if (range_size != 1 && !var_meta.is_lib_variable)
				heap_offset -= bind_register;

			auto &ref = srv_index_to_reference[index];
			if (aliased_access.requires_alias_decoration)
			{
				ref.var_alias_group = create_bindless_heap_variable_alias_group(
					bindless_info, aliased_access.raw_declarations);
			}
			else if (aliased_access.override_primary_component_types)
			{
				auto tmp_info = bindless_info;
				tmp_info.component = aliased_access.primary_component_type;
				tmp_info.raw_vecsize = aliased_access.primary_raw_vecsize;
				ref.var_id = create_bindless_heap_variable(tmp_info);
			}
			else
			{
				ref.var_id = create_bindless_heap_variable(bindless_info);
			}

			ref.aliased = aliased_access.requires_alias_decoration;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.stride = stride;
			ref.bindless = true;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;
		}
		else
		{
			auto sampled_type_id = get_type_id(effective_component_type, 1, 1);

			spv::Id type_id = 0;
			auto storage = spv::StorageClassUniformConstant;

			if (resource_kind == DXIL::ResourceKind::RTAccelerationStructure)
			{
				type_id = builder.makeAccelerationStructureType();
			}
			else if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				storage = spv::StorageClassStorageBuffer;
				// Defer typing the SSBOs.
			}
			else
			{
				type_id =
				    builder.makeImageType(sampled_type_id, image_dimension_from_resource_kind(resource_kind), false,
				                          image_dimension_is_arrayed(resource_kind),
				                          image_dimension_is_multisampled(resource_kind), 1, spv::ImageFormatUnknown);
				if (range_size != 1)
				{
					if (range_size == ~0u)
						type_id = builder.makeRuntimeArray(type_id);
					else
						type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
				}
			}

			auto &ref = srv_index_to_reference[index];

			if (type_id)
				ref.var_id = create_variable(storage, type_id, name.empty() ? nullptr : name.c_str());
			else if (aliased_access.requires_alias_decoration)
				ref.var_alias_group = create_raw_ssbo_variable_alias_group(aliased_access.raw_declarations, range_size, name);
			else
			{
				assert(aliased_access.raw_declarations.size() == 1);
				ref.var_id = create_raw_ssbo_variable(aliased_access.raw_declarations.front(), range_size, name);
			}

			if (actual_component_type != effective_component_type && component_type_is_16bit(actual_component_type))
				builder.addDecoration(ref.var_id, spv::DecorationRelaxedPrecision);

			const auto decorate_variable = [&](spv::Id id) {
				builder.addDecoration(id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
				builder.addDecoration(id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);
				if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
				{
					// Make it crystal clear this is a read-only SSBO which cannot observe changed from other SSBO writes.
					// Do not emit Aliased here even for type aliases
					// since we cannot observe writes from other descriptors anyways.
					builder.addDecoration(id, spv::DecorationNonWritable);
					builder.addDecoration(id, spv::DecorationRestrict);
				}
			};

			if (ref.var_id)
				decorate_variable(ref.var_id);
			for (auto &var : ref.var_alias_group)
				decorate_variable(var.var_id);

			ref.aliased = aliased_access.requires_alias_decoration;
			ref.base_resource_is_array = range_size != 1;
			ref.stride = stride;
			ref.resource_kind = resource_kind;

			if (ref.var_id)
			{
				auto &meta = handle_to_resource_meta[ref.var_id];
				meta = {};
				meta.kind = resource_kind;
				meta.stride = stride;
				meta.var_id = ref.var_id;
				meta.storage = storage;
				meta.component_type = actual_component_type;

				if (aliased_access.override_primary_component_types)
				{
					meta.component_type = aliased_access.primary_component_type;
					meta.raw_component_vecsize = aliased_access.primary_raw_vecsize;
				}
			}

			for (auto &var : ref.var_alias_group)
			{
				auto &meta = handle_to_resource_meta[var.var_id];
				meta = {};
				meta.kind = resource_kind;
				meta.component_type = raw_width_to_component_type(var.declaration.type, var.declaration.width);
				meta.raw_component_vecsize = var.declaration.vecsize;
				meta.stride = stride;
				meta.var_id = var.var_id;
				meta.storage = storage;
			}
		}
	}

	return true;
}

bool Converter::Impl::get_ssbo_offset_buffer_id(spv::Id &buffer_id,
                                                const VulkanBinding &buffer_binding,
                                                const VulkanBinding &offset_binding,
                                                DXIL::ResourceKind kind, unsigned alignment)
{
	buffer_id = 0;

	bool is_buffer_type = kind == DXIL::ResourceKind::StructuredBuffer ||
	                      kind == DXIL::ResourceKind::RawBuffer ||
	                      kind == DXIL::ResourceKind::TypedBuffer;
	if (!is_buffer_type)
		return true;

	bool use_offsets = false;

	// If we're emitting an SSBO where we expect small alignment, we'll need to carry forward an "offset".
	if (buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
	{
		if (kind != DXIL::ResourceKind::TypedBuffer && (alignment & (options.ssbo_alignment - 1)) != 0)
		{
			if (!buffer_binding.bindless.use_heap)
			{
				LOGE("SSBO offset is only supported for bindless SSBOs.\n");
				return false;
			}

			if (offset_binding.bindless.use_heap)
			{
				LOGE("SSBO offset buffer must be a bindless buffer.\n");
				return false;
			}

			use_offsets = true;
		}
	}
	else if (options.bindless_typed_buffer_offsets && buffer_binding.bindless.use_heap)
	{
		use_offsets = true;
	}

	if (use_offsets)
	{
		BindlessInfo bindless_info = {};
		bindless_info.descriptor_type = VulkanDescriptorType::SSBO;
		bindless_info.type = DXIL::ResourceType::SRV;
		bindless_info.offsets = true;
		bindless_info.desc_set = offset_binding.descriptor_set;
		bindless_info.binding = offset_binding.binding;
		bindless_info.component = DXIL::ComponentType::U32;
		bindless_info.kind = DXIL::ResourceKind::RawBuffer;
		buffer_id = create_bindless_heap_variable(bindless_info);
	}

	return true;
}

bool Converter::Impl::get_uav_image_format(DXIL::ResourceKind resource_kind,
                                           DXIL::ComponentType actual_component_type,
                                           const AccessTracking &access_meta,
                                           spv::ImageFormat &format)
{
	if (resource_kind == DXIL::ResourceKind::FeedbackTexture2D ||
	    resource_kind == DXIL::ResourceKind::FeedbackTexture2DArray)
	{
		format = spv::ImageFormatR64ui;
		builder().addExtension("SPV_EXT_shader_image_int64");
		builder().addCapability(spv::CapabilityInt64ImageEXT);
		return true;
	}
	else if (resource_kind != DXIL::ResourceKind::RawBuffer &&
	         resource_kind != DXIL::ResourceKind::StructuredBuffer)
	{
		// For any typed resource, we need to check if the resource is being read.
		// To avoid StorageReadWithoutFormat, we emit a format based on the component type.
		if (access_meta.has_read)
		{
			if (options.typed_uav_read_without_format && !access_meta.has_atomic)
			{
				builder().addCapability(spv::CapabilityStorageImageReadWithoutFormat);
				format = spv::ImageFormatUnknown;
			}
			else
			{
				switch (actual_component_type)
				{
				case DXIL::ComponentType::U32:
					format = spv::ImageFormatR32ui;
					break;

				case DXIL::ComponentType::I32:
					format = spv::ImageFormatR32i;
					break;

				case DXIL::ComponentType::F32:
					format = spv::ImageFormatR32f;
					break;

				case DXIL::ComponentType::U64:
					format = spv::ImageFormatR64ui;
					builder().addExtension("SPV_EXT_shader_image_int64");
					builder().addCapability(spv::CapabilityInt64ImageEXT);
					break;

				default:
					LOGE("Reading from UAV, but component type does not conform to U32, I32, F32 or U64. "
					     "typed_uav_read_without_format option must be enabled.\n");
					return false;
				}
			}
		}
	}

	return true;
}

bool Converter::Impl::emit_uavs(const llvm::MDNode *uavs, const llvm::MDNode *refl)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_uavs = uavs->getNumOperands();

	for (unsigned i = 0; i < num_uavs; i++)
	{
		auto *uav = llvm::cast<llvm::MDNode>(uavs->getOperand(i));

		auto var_meta = get_resource_variable_meta(uav);
		if (!var_meta.is_active)
			continue;

		unsigned index = get_constant_metadata(uav, 0);
		auto name = get_resource_name_metadata(uav, refl);
		unsigned bind_space = get_constant_metadata(uav, 3);
		unsigned bind_register = get_constant_metadata(uav, 4);
		unsigned range_size = get_constant_metadata(uav, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(uav, 6));

		// Magic resource that does not actually exist.
		if (index == ags.uav_magic_resource_type_index)
			continue;

		bool has_counter = get_constant_metadata(uav, 8) != 0;
		bool is_rov = get_constant_metadata(uav, 9) != 0;

		// ROV implies coherent in Vulkan memory models.
		bool globally_coherent = get_constant_metadata(uav, 7) != 0 || is_rov;

		llvm::MDNode *tags = nullptr;
		if (uav->getNumOperands() >= 11 && uav->getOperand(10))
			tags = llvm::dyn_cast<llvm::MDNode>(uav->getOperand(10));

		unsigned stride = 0;
		spv::ImageFormat format = spv::ImageFormatUnknown;

		auto actual_component_type = DXIL::ComponentType::U32;
		auto effective_component_type = actual_component_type;

		auto &access_meta = uav_access_tracking[index];
		if (globally_coherent)
			execution_mode_meta.declares_globallycoherent_uav = true;
		if (is_rov)
			execution_mode_meta.declares_rov = true;

		// We shouldn't need this, but dxilconv is broken.
		if (access_meta.has_counter)
			has_counter = true;

		// If the shader has device-memory memory barriers, we need to support this.
		// GLSL450 memory model does not do this for us by default.
		//   coherent: memory variable where reads and writes are coherent with reads and
		//             writes from other shader invocations
		// We have two options:
		// - slap Coherent on it.
		// - Use Vulkan memory model and make use of MakeVisibleKHR/MakeAvailableKHR flags in a OpMemoryBarrier.
		//   This would flush and invalidate any incoherent caches as necessary.
		// For now, slapping coherent on all UAVs is good enough.
		// When we move to full Vulkan memory model we can do a slightly better job.
		// If no UAV actually needs globallycoherent we can demote any barriers to workgroup barriers,
		// which is hopefully more optimal if the compiler understands the intent ...
		// Only promote resources which actually need some kind of coherence.
		if (shader_analysis.require_uav_thread_group_coherence &&
		    access_meta.has_written && access_meta.has_read &&
		    execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
		{
			globally_coherent = true;
		}

		if (resource_kind == DXIL::ResourceKind::FeedbackTexture2D ||
		    resource_kind == DXIL::ResourceKind::FeedbackTexture2DArray)
		{
			// 64-bit atomics make things a bit nicer.
			actual_component_type = DXIL::ComponentType::U64;
			effective_component_type = get_effective_typed_resource_type(actual_component_type);
		}
		else if (tags && get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			actual_component_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1)));
			if (access_meta.has_atomic_64bit)
			{
				// The component type in DXIL is u32, even if the resource itself is u64 in meta reflection data ...
				// This is also the case for signed components. Always use R64UI here.
				actual_component_type = DXIL::ComponentType::U64;
			}
			effective_component_type = get_effective_typed_resource_type(actual_component_type);
		}
		else
		{
			// Structured/Raw buffers, just use uint for good measure, we'll bitcast as needed.
			// Field 1 is stride, but we don't care about that unless we will support an SSBO path.
			format = spv::ImageFormatR32ui;
			if (tags)
				stride = get_constant_metadata(tags, 1);
		}

		unsigned alignment = resource_kind == DXIL::ResourceKind::RawBuffer ? 16 : (stride & -int(stride));

		if (!get_uav_image_format(resource_kind, actual_component_type, access_meta, format))
			return false;

		DescriptorTableEntry local_table_entry = {};
		int local_root_signature_entry = get_local_root_signature_entry(
		    ResourceClass::UAV, bind_space, bind_register, local_table_entry);
		bool need_resource_remapping = local_root_signature_entry < 0 ||
		                               local_root_signature[local_root_signature_entry].type == LocalRootSignatureType::Table;

		D3DUAVBinding d3d_binding = {};
		d3d_binding.counter = has_counter;
		d3d_binding.binding = {
			get_remapping_stage(execution_model), resource_kind, index, bind_space, bind_register, range_size, alignment
		};
		VulkanUAVBinding vulkan_binding = { { bind_space, bind_register }, { bind_space + 1, bind_register }, {} };
		if (need_resource_remapping && resource_mapping_iface && !resource_mapping_iface->remap_uav(d3d_binding, vulkan_binding))
		{
			LOGE("Failed to remap UAV %u:%u.\n", bind_space, bind_register);
			return false;
		}

		AliasedAccess aliased_access;
		if (!analyze_aliased_access(access_meta,
		                            need_resource_remapping ?
		                            vulkan_binding.buffer_binding.descriptor_type :
		                            VulkanDescriptorType::BufferDeviceAddress, aliased_access))
		{
			return false;
		}

		uav_index_to_reference.resize(std::max(uav_index_to_reference.size(), size_t(index + 1)));
		uav_index_to_counter.resize(std::max(uav_index_to_counter.size(), size_t(index + 1)));
		uav_index_to_offset.resize(std::max(uav_index_to_offset.size(), size_t(index + 1)));

		if (!get_ssbo_offset_buffer_id(uav_index_to_offset[index], vulkan_binding.buffer_binding,
		                               vulkan_binding.offset_binding, resource_kind, alignment))
			return false;

		if (range_size != 1)
		{
			if (range_size == ~0u)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}

			if (has_counter)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityStorageTexelBufferArrayDynamicIndexingEXT);
			}

			if ((resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			     resource_kind == DXIL::ResourceKind::RawBuffer) &&
			    vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				builder.addCapability(spv::CapabilityStorageBufferArrayDynamicIndexing);
			}
			else if (resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			         resource_kind == DXIL::ResourceKind::RawBuffer ||
			         resource_kind == DXIL::ResourceKind::TypedBuffer)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityStorageTexelBufferArrayDynamicIndexingEXT);
			}
			else
				builder.addCapability(spv::CapabilityStorageImageArrayDynamicIndexing);
		}

		BindlessInfo bindless_info = {};
		bindless_info.type = DXIL::ResourceType::UAV;
		bindless_info.component = effective_component_type;
		bindless_info.kind = resource_kind;
		bindless_info.desc_set = vulkan_binding.buffer_binding.descriptor_set;
		bindless_info.binding = vulkan_binding.buffer_binding.binding;
		bindless_info.format = format;
		bindless_info.uav_read = access_meta.has_read;
		bindless_info.uav_written = access_meta.has_written;
		bindless_info.uav_coherent = globally_coherent;
		bindless_info.descriptor_type = vulkan_binding.buffer_binding.descriptor_type;
		bindless_info.relaxed_precision = actual_component_type != effective_component_type &&
		                                  component_type_is_16bit(actual_component_type);

		// If we emit two SSBOs which both access the same buffer, we must emit Aliased decoration to be safe.
		bindless_info.aliased = aliased_access.requires_alias_decoration;

		BindlessInfo counter_info = {};

		counter_info.type = DXIL::ResourceType::UAV;
		counter_info.component = DXIL::ComponentType::U32;
		counter_info.desc_set = vulkan_binding.counter_binding.descriptor_set;
		counter_info.binding = vulkan_binding.counter_binding.binding;

		if (options.physical_storage_buffer &&
		    vulkan_binding.counter_binding.descriptor_type != VulkanDescriptorType::TexelBuffer)
		{
			counter_info.kind = DXIL::ResourceKind::Invalid;
			counter_info.counters = true;
		}
		else
		{
			counter_info.kind = DXIL::ResourceKind::RawBuffer;
			counter_info.uav_read = true;
			counter_info.uav_written = true;
			counter_info.uav_coherent = globally_coherent;
			counter_info.format = spv::ImageFormatR32ui;
		}

		ReferenceVkMemoryModel vkmm = {};

		if (execution_mode_meta.memory_model == spv::MemoryModelVulkan)
		{
			// For UAV we just slap it on everything.
			vkmm.non_private = true;
			vkmm.auto_visibility = globally_coherent || is_rov;
		}

		if (local_root_signature_entry >= 0)
		{
			auto &entry = local_root_signature[local_root_signature_entry];
			if (entry.type == LocalRootSignatureType::Table)
			{
				if (!vulkan_binding.buffer_binding.bindless.use_heap)
				{
					LOGE("Table SBT entries must be bindless.\n");
					return false;
				}

				if (!var_meta.is_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				auto &ref = uav_index_to_reference[index];
				if (aliased_access.requires_alias_decoration)
				{
					ref.var_alias_group = create_bindless_heap_variable_alias_group(
						bindless_info, aliased_access.raw_declarations);
				}
				else if (aliased_access.override_primary_component_types)
				{
					auto tmp_info = bindless_info;
					tmp_info.component = aliased_access.primary_component_type;
					tmp_info.raw_vecsize = aliased_access.primary_raw_vecsize;
					ref.var_id = create_bindless_heap_variable(tmp_info);
				}
				else
				{
					ref.var_id = create_bindless_heap_variable(bindless_info);
				}

				ref.aliased = aliased_access.requires_alias_decoration;
				ref.base_offset = heap_offset;
				ref.stride = stride;
				ref.bindless = true;
				ref.base_resource_is_array = range_size != 1;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = resource_kind;
				ref.vkmm = vkmm;

				if (has_counter)
				{
					if (!vulkan_binding.counter_binding.bindless.use_heap)
					{
						LOGE("Table SBT entries must be bindless.\n");
						return false;
					}

					heap_offset = local_table_entry.offset_in_heap;
					heap_offset += bind_register - local_table_entry.register_index;
					spv::Id counter_var_id = create_bindless_heap_variable(counter_info);

					auto &counter_ref = uav_index_to_counter[index];
					counter_ref.var_id = counter_var_id;
					counter_ref.base_offset = heap_offset;
					counter_ref.stride = 4;
					counter_ref.bindless = true;
					counter_ref.base_resource_is_array = range_size != 1;
					counter_ref.local_root_signature_entry = local_root_signature_entry;
					// Signals the underlying type of the counter buffer.
					counter_ref.resource_kind =
						counter_info.counters ? DXIL::ResourceKind::RawBuffer : DXIL::ResourceKind::TypedBuffer;
				}
			}
			else
			{
				// Otherwise, we simply refer to the SBT directly to obtain a pointer.
				if (resource_kind != DXIL::ResourceKind::RawBuffer &&
				    resource_kind != DXIL::ResourceKind::StructuredBuffer)
				{
					LOGE("UAV SBT root descriptors must be raw buffers or structures buffers.\n");
					return false;
				}

				auto &ref = uav_index_to_reference[index];
				ref.var_id = shader_record_buffer_id;
				ref.stride = stride;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = resource_kind;
				ref.vkmm = vkmm;

				if (range_size != 1)
				{
					LOGE("Cannot use descriptor array for root descriptors.\n");
					return false;
				}
			}
		}
		else if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::BufferDeviceAddress)
		{
			if (resource_kind != DXIL::ResourceKind::RawBuffer &&
			    resource_kind != DXIL::ResourceKind::StructuredBuffer)
			{
				LOGE("BDA root descriptors must be raw buffers or structured buffers.\n");
				return false;
			}

			auto &ref = uav_index_to_reference[index];
			ref.var_id = root_constant_id;
			ref.root_descriptor = true;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index;
			ref.coherent = globally_coherent;
			ref.rov = is_rov;
			ref.stride = stride;
			ref.resource_kind = resource_kind;
			ref.vkmm = vkmm;

			if (range_size != 1)
			{
				LOGE("Cannot use descriptor array for root descriptors.\n");
				return false;
			}
		}
		else if (vulkan_binding.buffer_binding.bindless.use_heap)
		{
			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer_binding.bindless.heap_root_offset;
			if (range_size != 1 && !var_meta.is_lib_variable)
				heap_offset -= bind_register;

			auto &ref = uav_index_to_reference[index];
			if (aliased_access.requires_alias_decoration)
			{
				ref.var_alias_group = create_bindless_heap_variable_alias_group(
					bindless_info, aliased_access.raw_declarations);
			}
			else if (aliased_access.override_primary_component_types)
			{
				auto tmp_info = bindless_info;
				tmp_info.component = aliased_access.primary_component_type;
				tmp_info.raw_vecsize = aliased_access.primary_raw_vecsize;
				ref.var_id = create_bindless_heap_variable(tmp_info);
			}
			else
			{
				ref.var_id = create_bindless_heap_variable(bindless_info);
			}

			ref.aliased = aliased_access.requires_alias_decoration;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.stride = stride;
			ref.bindless = true;
			ref.coherent = globally_coherent;
			ref.rov = is_rov;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;
			ref.vkmm = vkmm;

			if (has_counter)
			{
				if (vulkan_binding.counter_binding.bindless.use_heap)
				{
					spv::Id counter_var_id = create_bindless_heap_variable(counter_info);

					heap_offset = vulkan_binding.counter_binding.bindless.heap_root_offset;
					if (range_size != 1 && !var_meta.is_lib_variable)
						heap_offset -= bind_register;

					auto &counter_ref = uav_index_to_counter[index];
					counter_ref.var_id = counter_var_id;
					counter_ref.push_constant_member = vulkan_binding.counter_binding.root_constant_index + root_descriptor_count;
					counter_ref.base_offset = heap_offset;
					counter_ref.stride = 4;
					counter_ref.bindless = true;
					counter_ref.base_resource_is_array = range_size != 1;

					// Signals the underlying type of the counter buffer.
					counter_ref.resource_kind =
					    counter_info.counters ? DXIL::ResourceKind::RawBuffer : DXIL::ResourceKind::TypedBuffer;
				}
				else
				{
					auto element_type_id = get_type_id(DXIL::ComponentType::U32, 1, 1);
					spv::Id type_id = builder.makeImageType(element_type_id, spv::DimBuffer, false, false, false, 2,
					                                        spv::ImageFormatR32ui);

					spv::Id counter_var_id = create_variable(spv::StorageClassUniformConstant,
					                                         type_id, name.empty() ? nullptr : (name + "Counter").c_str());

					builder.addDecoration(counter_var_id, spv::DecorationDescriptorSet,
					                      vulkan_binding.counter_binding.descriptor_set);
					builder.addDecoration(counter_var_id, spv::DecorationBinding,
					                      vulkan_binding.counter_binding.binding);

					auto &counter_ref = uav_index_to_counter[index];
					counter_ref.var_id = counter_var_id;
					counter_ref.stride = 4;
					counter_ref.base_resource_is_array = range_size != 1;
					counter_ref.resource_kind = DXIL::ResourceKind::TypedBuffer;
				}
			}
		}
		else
		{
			spv::Id var_id = 0;
			Vector<RawDeclarationVariable> var_alias_group;
			spv::StorageClass storage;

			if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				// TODO: Consider implementing aliased buffers which all refer to the same buffer,
				// but which can exploit alignment per-instruction.
				// This is impractical, since BufferLoad/Store in DXIL does not have alignment (4 bytes is assumed),
				// so just unroll.
				// To make good use of this, we'll need apps to use SM 6.2 RawBufferLoad/Store, which does have explicit alignment.
				// We'll likely need to mess around with Aliased decoration as well, which might have other effects ...

				storage = spv::StorageClassStorageBuffer;

				if (aliased_access.requires_alias_decoration)
					var_alias_group = create_raw_ssbo_variable_alias_group(aliased_access.raw_declarations, range_size, name);
				else
				{
					assert(aliased_access.raw_declarations.size() == 1);
					var_id = create_raw_ssbo_variable(aliased_access.raw_declarations.front(), range_size, name);
				}
			}
			else
			{
				// Treat default as texel buffer, as it's the more compatible way of implementing buffer types in DXIL.
				auto element_type_id = get_type_id(effective_component_type, 1, 1);

				spv::Id type_id =
				    builder.makeImageType(element_type_id, image_dimension_from_resource_kind(resource_kind), false,
				                          image_dimension_is_arrayed(resource_kind),
				                          image_dimension_is_multisampled(resource_kind), 2, format);

				if (range_size != 1)
				{
					if (range_size == ~0u)
						type_id = builder.makeRuntimeArray(type_id);
					else
						type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
				}

				storage = spv::StorageClassUniformConstant;
				var_id = create_variable(storage, type_id,
				                         name.empty() ? nullptr : name.c_str());

				if (actual_component_type != effective_component_type && component_type_is_16bit(actual_component_type))
					builder.addDecoration(var_id, spv::DecorationRelaxedPrecision);
			}

			auto &ref = uav_index_to_reference[index];
			ref.var_id = var_id;
			ref.var_alias_group = std::move(var_alias_group);
			ref.aliased = aliased_access.requires_alias_decoration;
			ref.stride = stride;
			ref.coherent = globally_coherent;
			ref.rov = is_rov;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;
			ref.vkmm = vkmm;

			const auto decorate_variable = [&](spv::Id id) {
				builder.addDecoration(id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
				builder.addDecoration(id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);
				if (!access_meta.has_read)
					builder.addDecoration(id, spv::DecorationNonReadable);
				if (!access_meta.has_written)
					builder.addDecoration(id, spv::DecorationNonWritable);
				if (globally_coherent && execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
					builder.addDecoration(id, spv::DecorationCoherent);
				if (aliased_access.requires_alias_decoration)
					builder.addDecoration(id, spv::DecorationAliased);
			};

			if (var_id)
				decorate_variable(var_id);
			for (auto &var : ref.var_alias_group)
				decorate_variable(var.var_id);

			spv::Id counter_var_id = 0;
			if (has_counter)
			{
				if (vulkan_binding.counter_binding.bindless.use_heap)
				{
					LOGE("Cannot use bindless UAV counters along with non-bindless UAVs.\n");
					return false;
				}

				// Treat default as texel buffer, as it's the more compatible way of implementing buffer types in DXIL.
				auto element_type_id = get_type_id(DXIL::ComponentType::U32, 1, 1);

				spv::Id type_id =
					builder.makeImageType(element_type_id, image_dimension_from_resource_kind(resource_kind), false,
					                      image_dimension_is_arrayed(resource_kind),
					                      image_dimension_is_multisampled(resource_kind), 2, format);

				counter_var_id = create_variable(spv::StorageClassUniformConstant, type_id,
				                                 name.empty() ? nullptr : (name + "Counter").c_str());

				builder.addDecoration(counter_var_id, spv::DecorationDescriptorSet,
				                      vulkan_binding.counter_binding.descriptor_set);
				builder.addDecoration(counter_var_id, spv::DecorationBinding, vulkan_binding.counter_binding.binding);

				auto &counter_ref = uav_index_to_counter[index];
				counter_ref.var_id = counter_var_id;
				counter_ref.stride = 4;
				counter_ref.base_resource_is_array = range_size != 1;
				counter_ref.resource_kind = DXIL::ResourceKind::TypedBuffer;
			}

			if (var_id)
			{
				auto &meta = handle_to_resource_meta[var_id];
				meta = {};
				meta.kind = resource_kind;
				meta.stride = stride;
				meta.var_id = var_id;
				meta.storage = storage;
				meta.component_type = actual_component_type;
				meta.vkmm = vkmm;

				if (aliased_access.override_primary_component_types)
				{
					meta.component_type = aliased_access.primary_component_type;
					meta.raw_component_vecsize = aliased_access.primary_raw_vecsize;
				}
			}

			for (auto &var : ref.var_alias_group)
			{
				auto &meta = handle_to_resource_meta[var.var_id];
				meta = {};
				meta.kind = resource_kind;
				meta.stride = stride;
				meta.var_id = var.var_id;
				meta.storage = storage;
				meta.component_type = raw_width_to_component_type(var.declaration.type, var.declaration.width);
				meta.raw_component_vecsize = var.declaration.vecsize;
				meta.vkmm = vkmm;
			}
		}
	}

	return true;
}

bool Converter::Impl::emit_cbvs(const llvm::MDNode *cbvs, const llvm::MDNode *refl)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_cbvs = cbvs->getNumOperands();

	for (unsigned i = 0; i < num_cbvs; i++)
	{
		auto *cbv = llvm::cast<llvm::MDNode>(cbvs->getOperand(i));
		auto var_meta = get_resource_variable_meta(cbv);
		if (!var_meta.is_active)
			continue;

		unsigned index = get_constant_metadata(cbv, 0);
		auto name = get_resource_name_metadata(cbv, refl);
		unsigned bind_space = get_constant_metadata(cbv, 3);
		unsigned bind_register = get_constant_metadata(cbv, 4);
		unsigned range_size = get_constant_metadata(cbv, 5);
		unsigned cbv_size = get_constant_metadata(cbv, 6);

		DescriptorTableEntry local_table_entry = {};
		int local_root_signature_entry = get_local_root_signature_entry(
		    ResourceClass::CBV, bind_space, bind_register, local_table_entry);
		bool need_resource_remapping = local_root_signature_entry < 0 ||
		                               local_root_signature[local_root_signature_entry].type == LocalRootSignatureType::Table;

		D3DBinding d3d_binding = { get_remapping_stage(execution_model),
			                       DXIL::ResourceKind::CBuffer,
			                       index,
			                       bind_space,
			                       bind_register,
			                       range_size, 0 };
		VulkanCBVBinding vulkan_binding = {};
		vulkan_binding.buffer = { bind_space, bind_register };
		if (need_resource_remapping && resource_mapping_iface && !resource_mapping_iface->remap_cbv(d3d_binding, vulkan_binding))
		{
			LOGE("Failed to remap CBV %u:%u.\n", bind_space, bind_register);
			return false;
		}

		auto &access_meta = cbv_access_tracking[index];
		AliasedAccess aliased_access;
		if (!analyze_aliased_access(access_meta, VulkanDescriptorType::UBO, aliased_access))
			return false;

		cbv_index_to_reference.resize(std::max(cbv_index_to_reference.size(), size_t(index + 1)));

		if (range_size != 1)
		{
			if (range_size == ~0u)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}

			if (vulkan_binding.buffer.bindless.use_heap && options.bindless_cbv_ssbo_emulation)
				builder.addCapability(spv::CapabilityStorageBufferArrayDynamicIndexing);
			else
				builder.addCapability(spv::CapabilityUniformBufferArrayDynamicIndexing);
		}

		BindlessInfo bindless_info = {};
		bindless_info.type = DXIL::ResourceType::CBV;
		bindless_info.kind = DXIL::ResourceKind::CBuffer;
		bindless_info.desc_set = vulkan_binding.buffer.descriptor_set;
		bindless_info.binding = vulkan_binding.buffer.binding;
		bindless_info.component = aliased_access.primary_component_type;
		bindless_info.raw_vecsize = aliased_access.primary_raw_vecsize;

		if (local_root_signature_entry >= 0)
		{
			auto &entry = local_root_signature[local_root_signature_entry];
			if (entry.type == LocalRootSignatureType::Table)
			{
				if (!vulkan_binding.buffer.bindless.use_heap)
				{
					LOGE("Table SBT entries must be bindless.\n");
					return false;
				}

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				if (!var_meta.is_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				auto &ref = cbv_index_to_reference[index];

				if (aliased_access.requires_alias_decoration)
				{
					ref.var_alias_group = create_bindless_heap_variable_alias_group(
							bindless_info, aliased_access.raw_declarations);
				}
				else
				{
					ref.var_id = create_bindless_heap_variable(bindless_info);
				}

				ref.base_offset = heap_offset;
				ref.base_resource_is_array = range_size != 1;
				ref.bindless = true;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = DXIL::ResourceKind::CBuffer;
			}
			else
			{
				auto &ref = cbv_index_to_reference[index];
				ref.var_id = shader_record_buffer_id;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = DXIL::ResourceKind::CBuffer;

				if (range_size != 1)
				{
					LOGE("Cannot use descriptor array for root descriptors.\n");
					return false;
				}
			}
		}
		else if (vulkan_binding.push_constant)
		{
			if (root_constant_id == 0)
			{
				LOGE("Must have setup push constant block to use root constant path.\n");
				return false;
			}

			auto &ref = cbv_index_to_reference[index];
			ref.var_id = root_constant_id;
			ref.push_constant_member = vulkan_binding.push.offset_in_words + root_descriptor_count;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;
		}
		else if (vulkan_binding.buffer.descriptor_type == VulkanDescriptorType::BufferDeviceAddress)
		{
			auto &ref = cbv_index_to_reference[index];
			ref.var_id = root_constant_id;
			ref.root_descriptor = true;
			ref.push_constant_member = vulkan_binding.buffer.root_constant_index;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;

			if (range_size != 1)
			{
				LOGE("Cannot use descriptor array for root descriptors.\n");
				return false;
			}
		}
		else if (vulkan_binding.buffer.bindless.use_heap)
		{
			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer.bindless.heap_root_offset;
			if (range_size != 1 && !var_meta.is_lib_variable)
				heap_offset -= bind_register;

			auto &ref = cbv_index_to_reference[index];

			if (aliased_access.requires_alias_decoration)
			{
				ref.var_alias_group = create_bindless_heap_variable_alias_group(
						bindless_info, aliased_access.raw_declarations);
			}
			else
			{
				ref.var_id = create_bindless_heap_variable(bindless_info);
			}

			ref.push_constant_member = vulkan_binding.buffer.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.base_resource_is_array = range_size != 1;
			ref.bindless = true;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;
		}
		else
		{
			auto &ref = cbv_index_to_reference[index];

			if (aliased_access.requires_alias_decoration)
			{
				ref.var_alias_group = create_ubo_variable_alias_group(
						aliased_access.raw_declarations, range_size, name, cbv_size);
			}
			else
			{
				assert(aliased_access.raw_declarations.size() == 1);
				ref.var_id = create_ubo_variable(aliased_access.raw_declarations.front(), range_size, name, cbv_size);
			}

			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;

			if (ref.var_id)
			{
				auto &meta = handle_to_resource_meta[ref.var_id];
				meta = {};
				meta.kind = ref.resource_kind;
				meta.var_id = ref.var_id;
				meta.storage = spv::StorageClassUniform;
				meta.component_type = aliased_access.primary_component_type;
				meta.raw_component_vecsize = aliased_access.primary_raw_vecsize;
				builder.addDecoration(meta.var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer.descriptor_set);
				builder.addDecoration(meta.var_id, spv::DecorationBinding, vulkan_binding.buffer.binding);
			}

			for (auto &var : ref.var_alias_group)
			{
				auto &meta = handle_to_resource_meta[var.var_id];
				meta = {};
				meta.kind = ref.resource_kind;
				meta.var_id = var.var_id;
				meta.storage = spv::StorageClassUniform;
				meta.component_type = raw_width_to_component_type(var.declaration.type, var.declaration.width);
				meta.raw_component_vecsize = var.declaration.vecsize;
				builder.addDecoration(meta.var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer.descriptor_set);
				builder.addDecoration(meta.var_id, spv::DecorationBinding, vulkan_binding.buffer.binding);
			}
		}
	}

	return true;
}

bool Converter::Impl::emit_samplers(const llvm::MDNode *samplers, const llvm::MDNode *refl)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_samplers = samplers->getNumOperands();

	for (unsigned i = 0; i < num_samplers; i++)
	{
		auto *sampler = llvm::cast<llvm::MDNode>(samplers->getOperand(i));

		auto var_meta = get_resource_variable_meta(sampler);
		if (!var_meta.is_active)
			continue;

		unsigned index = get_constant_metadata(sampler, 0);
		auto name = get_resource_name_metadata(sampler, refl);
		unsigned bind_space = get_constant_metadata(sampler, 3);
		unsigned bind_register = get_constant_metadata(sampler, 4);
		unsigned range_size = get_constant_metadata(sampler, 5);

		if (range_size != 1)
		{
			if (range_size == ~0u)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}

			// This capability also covers samplers.
			builder.addCapability(spv::CapabilitySampledImageArrayDynamicIndexing);
		}

		DescriptorTableEntry local_table_entry = {};
		int local_root_signature_entry = get_local_root_signature_entry(
			ResourceClass::Sampler, bind_space, bind_register, local_table_entry);
		bool need_resource_remapping = local_root_signature_entry < 0 ||
		                               local_root_signature[local_root_signature_entry].type == LocalRootSignatureType::Table;

		D3DBinding d3d_binding = { get_remapping_stage(execution_model),
			                       DXIL::ResourceKind::Sampler,
			                       index,
			                       bind_space,
			                       bind_register,
			                       range_size, 0 };
		VulkanBinding vulkan_binding = { bind_space, bind_register };
		if (need_resource_remapping && resource_mapping_iface && !resource_mapping_iface->remap_sampler(d3d_binding, vulkan_binding))
		{
			LOGE("Failed to remap sampler %u:%u.\n", bind_space, bind_register);
			return false;
		}

		sampler_index_to_reference.resize(std::max(sampler_index_to_reference.size(), size_t(index + 1)));

		BindlessInfo bindless_info = {};
		bindless_info.type = DXIL::ResourceType::Sampler;
		bindless_info.kind = DXIL::ResourceKind::Sampler;
		bindless_info.desc_set = vulkan_binding.descriptor_set;
		bindless_info.binding = vulkan_binding.binding;

		if (local_root_signature_entry >= 0)
		{
			// Samplers can only live in table entries.
			if (!vulkan_binding.bindless.use_heap)
			{
				LOGE("Table SBT entries must be bindless.\n");
				return false;
			}

			spv::Id var_id = create_bindless_heap_variable(bindless_info);

			uint32_t heap_offset = local_table_entry.offset_in_heap;
			heap_offset += bind_register - local_table_entry.register_index;

			if (!var_meta.is_lib_variable)
			{
				LOGE("Local root signature requires global lib variables.\n");
				return false;
			}

			auto &ref = sampler_index_to_reference[index];
			ref.var_id = var_id;
			ref.base_offset = heap_offset;
			ref.bindless = true;
			ref.local_root_signature_entry = local_root_signature_entry;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = DXIL::ResourceKind::Sampler;
		}
		else if (vulkan_binding.bindless.use_heap)
		{
			spv::Id var_id = create_bindless_heap_variable(bindless_info);

			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.bindless.heap_root_offset;
			if (range_size != 1 && !var_meta.is_lib_variable)
				heap_offset -= bind_register;

			auto &ref = sampler_index_to_reference[index];
			ref.var_id = var_id;
			ref.push_constant_member = vulkan_binding.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.bindless = true;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = DXIL::ResourceKind::Sampler;
		}
		else
		{
			spv::Id type_id = builder.makeSamplerType();

			if (range_size != 1)
			{
				if (range_size == ~0u)
					type_id = builder.makeRuntimeArray(type_id);
				else
					type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
			}

			spv::Id var_id = create_variable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

			builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.descriptor_set);
			builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.binding);

			auto &ref = sampler_index_to_reference[index];
			ref.var_id = var_id;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = DXIL::ResourceKind::Sampler;
		}
	}

	return true;
}

bool Converter::Impl::scan_srvs(ResourceRemappingInterface *iface, const llvm::MDNode *srvs, ShaderStage stage)
{
	unsigned num_srvs = srvs->getNumOperands();
	for (unsigned i = 0; i < num_srvs; i++)
	{
		auto *srv = llvm::cast<llvm::MDNode>(srvs->getOperand(i));
		unsigned index = get_constant_metadata(srv, 0);
		unsigned bind_space = get_constant_metadata(srv, 3);
		unsigned bind_register = get_constant_metadata(srv, 4);
		unsigned range_size = get_constant_metadata(srv, 5);
		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(srv, 6));

		D3DBinding d3d_binding = { stage, resource_kind, index, bind_space, bind_register, range_size };
		VulkanSRVBinding vulkan_binding = {};
		if (iface && !iface->remap_srv(d3d_binding, vulkan_binding))
			return false;
	}

	return true;
}

bool Converter::Impl::scan_samplers(ResourceRemappingInterface *iface, const llvm::MDNode *samplers, ShaderStage stage)
{
	unsigned num_samplers = samplers->getNumOperands();
	for (unsigned i = 0; i < num_samplers; i++)
	{
		auto *sampler = llvm::cast<llvm::MDNode>(samplers->getOperand(i));
		unsigned index = get_constant_metadata(sampler, 0);
		unsigned bind_space = get_constant_metadata(sampler, 3);
		unsigned bind_register = get_constant_metadata(sampler, 4);
		unsigned range_size = get_constant_metadata(sampler, 5);

		D3DBinding d3d_binding = { stage, DXIL::ResourceKind::Sampler, index, bind_space, bind_register, range_size };
		VulkanBinding vulkan_binding = {};
		if (iface && !iface->remap_sampler(d3d_binding, vulkan_binding))
			return false;
	}

	return true;
}

bool Converter::Impl::scan_cbvs(ResourceRemappingInterface *iface, const llvm::MDNode *cbvs, ShaderStage stage)
{
	unsigned num_cbvs = cbvs->getNumOperands();
	for (unsigned i = 0; i < num_cbvs; i++)
	{
		auto *cbv = llvm::cast<llvm::MDNode>(cbvs->getOperand(i));
		unsigned index = get_constant_metadata(cbv, 0);
		unsigned bind_space = get_constant_metadata(cbv, 3);
		unsigned bind_register = get_constant_metadata(cbv, 4);
		unsigned range_size = get_constant_metadata(cbv, 5);

		D3DBinding d3d_binding = { stage, DXIL::ResourceKind::CBuffer, index, bind_space, bind_register, range_size };
		VulkanCBVBinding vulkan_binding = {};
		if (iface && !iface->remap_cbv(d3d_binding, vulkan_binding))
			return false;
	}

	return true;
}

bool Converter::Impl::scan_uavs(ResourceRemappingInterface *iface, const llvm::MDNode *uavs, ShaderStage stage)
{
	unsigned num_uavs = uavs->getNumOperands();
	for (unsigned i = 0; i < num_uavs; i++)
	{
		auto *uav = llvm::cast<llvm::MDNode>(uavs->getOperand(i));
		unsigned index = get_constant_metadata(uav, 0);
		unsigned bind_space = get_constant_metadata(uav, 3);
		unsigned bind_register = get_constant_metadata(uav, 4);
		unsigned range_size = get_constant_metadata(uav, 5);
		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(uav, 6));
		bool has_counter = get_constant_metadata(uav, 8) != 0;

		D3DUAVBinding d3d_binding = { { stage, resource_kind, index, bind_space, bind_register, range_size },
			                          has_counter };
		VulkanUAVBinding vulkan_binding = {};
		if (iface && !iface->remap_uav(d3d_binding, vulkan_binding))
			return false;
	}

	return true;
}

void Converter::Impl::emit_root_constants(unsigned num_descriptors, unsigned num_constant_words)
{
	auto &builder = spirv_module.get_builder();

	// Root constants cannot be dynamically indexed in DXIL, so emit them as members.
	Vector<spv::Id> members(num_constant_words + num_descriptors);

	// Emit root descriptors as u32x2 to work around missing SGPR promotion on RADV.
	for (unsigned i = 0; i < num_descriptors; i++)
		members[i] = builder.makeVectorType(builder.makeUintType(32), 2);
	for (unsigned i = 0; i < num_constant_words; i++)
		members[i + num_descriptors] = builder.makeUintType(32);

	spv::Id type_id = get_struct_type(members, 0, "RootConstants");
	builder.addDecoration(type_id, spv::DecorationBlock);

	for (unsigned i = 0; i < num_descriptors; i++)
		builder.addMemberDecoration(type_id, i, spv::DecorationOffset, sizeof(uint64_t) * i);

	for (unsigned i = 0; i < num_constant_words; i++)
	{
		builder.addMemberDecoration(type_id, i + num_descriptors, spv::DecorationOffset,
		                            sizeof(uint64_t) * num_descriptors + sizeof(uint32_t) * i);
	}

	if (options.inline_ubo_enable)
	{
		root_constant_id = create_variable(spv::StorageClassUniform, type_id, "registers");
		builder.addDecoration(root_constant_id, spv::DecorationDescriptorSet, options.inline_ubo_descriptor_set);
		builder.addDecoration(root_constant_id, spv::DecorationBinding, options.inline_ubo_descriptor_binding);
	}
	else
		root_constant_id = create_variable(spv::StorageClassPushConstant, type_id, "registers");

	root_descriptor_count = num_descriptors;
	root_constant_num_words = num_constant_words;
}

static bool execution_model_is_ray_tracing(spv::ExecutionModel model)
{
	switch (model)
	{
	case spv::ExecutionModelRayGenerationKHR:
	case spv::ExecutionModelCallableKHR:
	case spv::ExecutionModelIntersectionKHR:
	case spv::ExecutionModelMissKHR:
	case spv::ExecutionModelClosestHitKHR:
	case spv::ExecutionModelAnyHitKHR:
		return true;

	default:
		return false;
	}
}

spv::Id Converter::Impl::emit_shader_record_buffer_block_type(bool physical_storage)
{
	if (local_root_signature.empty())
		return 0;

	auto &builder = spirv_module.get_builder();

	spv::Id type_id;
	Vector<spv::Id> member_types;
	Vector<uint32_t> offsets;
	member_types.reserve(local_root_signature.size());
	offsets.reserve(local_root_signature.size());
	shader_record_buffer_types.reserve(local_root_signature.size());

	uint32_t current_offset = 0;
	for (auto &elem : local_root_signature)
	{
		switch (elem.type)
		{
		case LocalRootSignatureType::Constants:
		{
			spv::Id array_size_id = builder.makeUintConstant(elem.constants.num_words);
			spv::Id u32_type = builder.makeUintType(32);
			spv::Id member_type_id =
			    builder.makeArrayType(u32_type, array_size_id, 4);
			builder.addDecoration(member_type_id, spv::DecorationArrayStride, 4);
			member_types.push_back(member_type_id);
			offsets.push_back(current_offset);
			current_offset += 4 * elem.constants.num_words;
			shader_record_buffer_types.push_back(member_type_id);
			break;
		}

		case LocalRootSignatureType::Descriptor:
		{
			// A 64-bit integer which we will bitcast to a physical storage buffer later.
			// Emit it as u32x2 as otherwise we don't get SGPR promotion on ACO as of right now.
			spv::Id member_type_id = builder.makeVectorType(builder.makeUintType(32), 2);
			member_types.push_back(member_type_id);
			current_offset = (current_offset + 7) & ~7;
			offsets.push_back(current_offset);
			current_offset += 8;
			shader_record_buffer_types.push_back(member_type_id);
			break;
		}

		case LocalRootSignatureType::Table:
		{
			spv::Id member_type_id = builder.makeVectorType(builder.makeUintType(32), 2);
			member_types.push_back(member_type_id);
			current_offset = (current_offset + 7) & ~7;
			offsets.push_back(current_offset);
			current_offset += 8;
			shader_record_buffer_types.push_back(member_type_id);
			break;
		}

		default:
			return false;
		}
	}

	type_id = get_struct_type(member_types, 0, "SBTBlock");
	builder.addDecoration(type_id, spv::DecorationBlock);

	for (size_t i = 0; i < local_root_signature.size(); i++)
	{
		builder.addMemberDecoration(type_id, i, spv::DecorationOffset, offsets[i]);
		if (physical_storage)
			builder.addMemberDecoration(type_id, i, spv::DecorationNonWritable);
	}

	return type_id;
}

bool Converter::Impl::emit_shader_record_buffer()
{
	spv::Id type_id = emit_shader_record_buffer_block_type(false);
	if (type_id)
		shader_record_buffer_id = create_variable(spv::StorageClassShaderRecordBufferKHR, type_id, "SBT");
	return true;
}

static bool local_root_signature_matches(const LocalRootSignatureEntry &entry,
                                         ResourceClass resource_class,
                                         uint32_t space, uint32_t binding,
                                         DescriptorTableEntry &local_table_entry)
{
	switch (entry.type)
	{
	case LocalRootSignatureType::Constants:
		return resource_class == ResourceClass::CBV &&
		       entry.constants.register_space == space &&
		       entry.constants.register_index == binding;

	case LocalRootSignatureType::Descriptor:
		return entry.descriptor.type == resource_class &&
		       entry.descriptor.register_space == space &&
		       entry.descriptor.register_index == binding;

	case LocalRootSignatureType::Table:
		for (auto &table_entry : entry.table_entries)
		{
			if (table_entry.type == resource_class && table_entry.register_space == space &&
			    table_entry.register_index <= binding &&
			    ((table_entry.num_descriptors_in_range == ~0u) ||
			     ((binding - table_entry.register_index) < table_entry.num_descriptors_in_range)))
			{
				local_table_entry = table_entry;
				return true;
			}
		}
		return false;

	default:
		return false;
	}
}

int Converter::Impl::get_local_root_signature_entry(ResourceClass resource_class, uint32_t space, uint32_t binding,
                                                    DescriptorTableEntry &local_table_entry) const
{
	auto itr = std::find_if(local_root_signature.begin(), local_root_signature.end(), [&](const LocalRootSignatureEntry &entry) {
		return local_root_signature_matches(entry, resource_class, space, binding, local_table_entry);
	});

	if (itr != local_root_signature.end())
		return int(itr - local_root_signature.begin());
	else
		return -1;
}

bool Converter::Impl::emit_resources_global_mapping()
{
	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return true;

	auto *metas = resource_meta->getOperand(0);

	if (metas->getOperand(0))
		if (!emit_resources_global_mapping(DXIL::ResourceType::SRV, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(0))))
			return false;
	if (metas->getOperand(1))
		if (!emit_resources_global_mapping(DXIL::ResourceType::UAV, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(1))))
			return false;
	if (metas->getOperand(2))
		if (!emit_resources_global_mapping(DXIL::ResourceType::CBV, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(2))))
			return false;
	if (metas->getOperand(3))
		if (!emit_resources_global_mapping(DXIL::ResourceType::Sampler, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(3))))
			return false;

	return true;
}

void Converter::Impl::get_shader_model(const llvm::Module &module, String *model, uint32_t *major, uint32_t *minor)
{
	auto *resource_meta = module.getNamedMetadata("dx.shaderModel");
	if (!resource_meta)
	{
		if (major)
			*major = 6;
		if (minor)
			*minor = 0;
		if (model)
			model->clear();
	}
	else
	{
		auto *meta = resource_meta->getOperand(0);

		if (model)
			*model = get_string_metadata(meta, 0);
		if (major)
			*major = get_constant_metadata(meta, 1);
		if (minor)
			*minor = get_constant_metadata(meta, 2);
	}
}

Converter::Impl::RawBufferMeta
Converter::Impl::get_raw_buffer_meta(DXIL::ResourceType resource_type, unsigned meta_index)
{
	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return { DXIL::ResourceKind::Invalid, 0 };

	auto *metas = resource_meta->getOperand(0);
	auto &resource_list = metas->getOperand(uint32_t(resource_type));
	if (!resource_list)
		return { DXIL::ResourceKind::Invalid, 0 };

	auto *entries = llvm::cast<llvm::MDNode>(resource_list);
	unsigned num_entries = entries->getNumOperands();
	for (unsigned i = 0; i < num_entries; i++)
	{
		auto *entry = llvm::cast<llvm::MDNode>(entries->getOperand(i));
		if (get_constant_metadata(entry, 0) == meta_index)
		{
			RawBufferMeta meta = {};
			meta.kind = DXIL::ResourceKind(get_constant_metadata(entry, 6));

			unsigned tag_index = resource_type == DXIL::ResourceType::SRV ? 8 : 10;

			llvm::MDNode *tags = nullptr;
			if (entry->getNumOperands() > tag_index && entry->getOperand(tag_index))
				tags = llvm::dyn_cast<llvm::MDNode>(entry->getOperand(tag_index));
			if (tags)
				meta.stride = get_constant_metadata(tags, 1);
			return meta;
		}
	}

	return { DXIL::ResourceKind::Invalid, 0 };
}

uint32_t Converter::Impl::find_binding_meta_index(uint32_t binding_range_lo, uint32_t binding_range_hi,
                                                  uint32_t binding_space, DXIL::ResourceType resource_type)
{
	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return UINT32_MAX;

	auto *metas = resource_meta->getOperand(0);
	auto &resource_list = metas->getOperand(uint32_t(resource_type));
	if (!resource_list)
		return UINT32_MAX;

	auto *entries = llvm::cast<llvm::MDNode>(resource_list);
	unsigned num_entries = entries->getNumOperands();
	for (unsigned i = 0; i < num_entries; i++)
	{
		auto *entry = llvm::cast<llvm::MDNode>(entries->getOperand(i));
		uint32_t index = get_constant_metadata(entry, 0);
		uint32_t bind_space = get_constant_metadata(entry, 3);
		uint32_t bind_register = get_constant_metadata(entry, 4);
		uint32_t range_size = get_constant_metadata(entry, 5);

		if (binding_space != bind_space)
			continue;

		if (binding_range_lo >= bind_register &&
		    (range_size == UINT32_MAX || (binding_range_hi < bind_register + range_size)))
		{
			return index;
		}
	}

	return UINT32_MAX;
}

bool Converter::Impl::emit_descriptor_heap_introspection_ssbo()
{
	// We need to know the size of the descriptor heap. Rather than passing this
	// through a separate descriptor, we can just query the SSBO size of the
	// side-band SSBO. It is designed to have a size equal to the descriptor heap.
	// Somewhat hacky is that we can ask for a global heap of RTAS, which gets us this descriptor.
	D3DBinding d3d_binding = {
		get_remapping_stage(execution_model), DXIL::ResourceKind::RTAccelerationStructure, 0,
		UINT32_MAX, UINT32_MAX, UINT32_MAX, 0,
	};
	VulkanSRVBinding vulkan_binding = {};

	if (!resource_mapping_iface->remap_srv(d3d_binding, vulkan_binding))
		return false;

	if (vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::SSBO &&
	    vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::Identity)
	{
		LOGE("Dummy SSBO must be an SSBO.\n");
		return false;
	}

	if (options.physical_address_descriptor_stride == 0)
	{
		LOGE("physical_address_descriptor_stride must be set.\n");
		return false;
	}

	spv::Id u32_type = builder().makeUintType(32);
	uint32_t elems = options.physical_address_descriptor_stride;

	if (options.instruction_instrumentation.enabled)
		u32_type = builder().makeVectorType(u32_type, 2);
	else
		elems *= 2;

	spv::Id u32_array_type = builder().makeArrayType(u32_type, builder().makeUintConstant(elems), 0);
	builder().addDecoration(u32_array_type, spv::DecorationArrayStride,
	                        options.instruction_instrumentation.enabled ? 8 : 4);

	spv::Id inner_struct_type = get_struct_type({ u32_array_type }, 0, "DescriptorHeapRawPayload");
	builder().addMemberDecoration(inner_struct_type, 0, spv::DecorationOffset, 0);

	spv::Id inner_struct_array_type = builder().makeRuntimeArray(inner_struct_type);
	builder().addDecoration(inner_struct_array_type, spv::DecorationArrayStride,
	                        8u * options.physical_address_descriptor_stride);

	bool sync_val =
		options.instruction_instrumentation.enabled &&
		options.instruction_instrumentation.type == InstructionInstrumentationType::BufferSynchronizationValidation;

	spv::Id block_type_id = get_struct_type({ inner_struct_array_type }, 0, "DescriptorHeapRobustnessSSBO");
	builder().addDecoration(block_type_id, spv::DecorationBlock);
	builder().addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	if (!sync_val)
	{
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonWritable);
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonReadable);
	}
	builder().addMemberName(block_type_id, 0, "descriptors");
	spv::Id var_id = create_variable(spv::StorageClassStorageBuffer, block_type_id, "DescriptorHeapRobustness");

	builder().addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
	builder().addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);

	// Take OpArrayLength of this variable's first member and we have it.
	instrumentation.descriptor_heap_introspection_var_id = var_id;

	if (sync_val)
	{
		instrumentation.invocation_id_var_id =
			create_variable(spv::StorageClassPrivate, builder().makeUintType(32), "InvocationID");
	}

	return true;
}

bool Converter::Impl::emit_global_heaps()
{
	Vector<AnnotateHandleReference *> annotations;
	for (auto &use : llvm_annotate_handle_uses)
		annotations.push_back(&use.second);

	// Ensure reproducible codegen since we iterate over an unordered map.
	std::sort(annotations.begin(), annotations.end(),
	          [](const AnnotateHandleReference *a, const AnnotateHandleReference *b) {
	              return a->ordinal < b->ordinal;
	          });

	for (auto *annotation : annotations)
	{
		BindlessInfo info = {};

		auto actual_component_type = DXIL::ComponentType::U32;
		info.format = spv::ImageFormatUnknown;
		if (annotation->resource_type != DXIL::ResourceType::CBV &&
		    annotation->resource_kind != DXIL::ResourceKind::RawBuffer &&
		    annotation->resource_kind != DXIL::ResourceKind::StructuredBuffer)
		{
			actual_component_type = normalize_component_type(annotation->component_type);
			if (annotation->tracking.has_atomic_64bit)
			{
				// The component type in DXIL is u32, even if the resource itself is u64 in meta reflection data ...
				// This is also the case for signed components. Always use R64UI here.
				actual_component_type = DXIL::ComponentType::U64;
			}
		}
		else if (annotation->resource_type == DXIL::ResourceType::UAV)
		{
			info.format = spv::ImageFormatR32ui;
		}

		auto effective_component_type = get_effective_typed_resource_type(actual_component_type);

		info.type = annotation->resource_type;
		info.component = effective_component_type;
		info.kind = annotation->resource_kind;
		info.relaxed_precision = actual_component_type != effective_component_type &&
		                         component_type_is_16bit(actual_component_type);

		if (info.type == DXIL::ResourceType::UAV)
		{
			// See emit_uavs() for details around coherent and memory model shenanigans ...
			if (annotation->coherent)
				execution_mode_meta.declares_globallycoherent_uav = true;
			if (annotation->rov)
				execution_mode_meta.declares_rov = true;

			// Do not attempt to track read and write here to figure out if this resource in particular needs to be coherent.
			// It's plausible that the write and read can happen across
			// two different accesses to ResourceDescriptorHeap[]. Don't take any chances here ...
			if (shader_analysis.require_uav_thread_group_coherence &&
			    execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
			{
				annotation->coherent = true;
			}

			if (annotation->resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			    annotation->resource_kind == DXIL::ResourceKind::RawBuffer)
			{
				// In case there is aliasing through different declarations,
				// we cannot emit NonWritable or NonReadable safely. Assume full read-write.
				// Be a bit careful with typed resources since it's not always supported with read-write + typed.
				annotation->tracking.has_read = true;
				annotation->tracking.has_written = true;
			}

			info.uav_coherent = annotation->coherent || annotation->rov;
			info.uav_read = annotation->tracking.has_read;
			info.uav_written = annotation->tracking.has_written;
			if (!get_uav_image_format(annotation->resource_kind, actual_component_type,
			                          annotation->tracking, info.format))
			{
				return false;
			}
		}

		unsigned stride = annotation->stride;
		unsigned alignment = info.kind == DXIL::ResourceKind::RawBuffer ? 16 : (stride & -int(stride));
		D3DBinding d3d_binding = {
			get_remapping_stage(execution_model), info.kind, 0,
			UINT32_MAX, UINT32_MAX, UINT32_MAX, alignment,
		};
		VulkanBinding vulkan_binding = {};

		bool remap_success = false;
		if (resource_mapping_iface)
		{
			switch (info.type)
			{
			case DXIL::ResourceType::SRV:
			{
				VulkanSRVBinding vulkan_srv_binding = {};
				remap_success = resource_mapping_iface->remap_srv(d3d_binding, vulkan_srv_binding);
				vulkan_binding = vulkan_srv_binding.buffer_binding;
				if (!get_ssbo_offset_buffer_id(annotation->offset_buffer_id, vulkan_srv_binding.buffer_binding,
				                               vulkan_srv_binding.offset_binding, annotation->resource_kind, alignment))
				{
					return false;
				}
				break;
			}

			case DXIL::ResourceType::UAV:
			{
				VulkanUAVBinding vulkan_uav_binding = {};
				D3DUAVBinding d3d_uav_binding = {};

				d3d_uav_binding.binding = d3d_binding;
				d3d_uav_binding.counter = annotation->counter;

				remap_success = resource_mapping_iface->remap_uav(d3d_uav_binding, vulkan_uav_binding);
				vulkan_binding = vulkan_uav_binding.buffer_binding;
				if (!get_ssbo_offset_buffer_id(annotation->offset_buffer_id, vulkan_uav_binding.buffer_binding,
											   vulkan_uav_binding.offset_binding, annotation->resource_kind, alignment))
				{
					return false;
				}

				if (annotation->counter)
				{
					auto &counter_binding = vulkan_uav_binding.counter_binding;
					BindlessInfo counter_info = {};

					annotation->counter_reference.base_resource_is_array = true;
					annotation->counter_reference.push_constant_member = UINT32_MAX;
					annotation->counter_reference.stride = 4;
					annotation->counter_reference.bindless = true;

					counter_info.type = DXIL::ResourceType::UAV;
					counter_info.component = DXIL::ComponentType::U32;
					counter_info.desc_set = counter_binding.descriptor_set;
					counter_info.binding = counter_binding.binding;

					if (options.physical_storage_buffer &&
					    counter_binding.descriptor_type != VulkanDescriptorType::TexelBuffer)
					{
						counter_info.kind = DXIL::ResourceKind::Invalid;
						counter_info.counters = true;
						annotation->counter_reference.resource_kind = DXIL::ResourceKind::RawBuffer;
					}
					else
					{
						counter_info.kind = DXIL::ResourceKind::RawBuffer;
						counter_info.uav_read = true;
						counter_info.uav_written = true;
						counter_info.uav_coherent = false;
						counter_info.format = spv::ImageFormatR32ui;
						annotation->counter_reference.resource_kind = DXIL::ResourceKind::TypedBuffer;
					}

					annotation->counter_reference.var_id = create_bindless_heap_variable(counter_info);
				}
				break;
			}

			case DXIL::ResourceType::CBV:
			{
				VulkanCBVBinding vulkan_cbv_binding = {};
				remap_success = resource_mapping_iface->remap_cbv(d3d_binding, vulkan_cbv_binding);
				if (vulkan_cbv_binding.push_constant)
				{
					LOGE("Cannot use push constants for SM 6.6 bindless.\n");
					return false;
				}
				vulkan_binding = vulkan_cbv_binding.buffer;
				vulkan_binding.descriptor_type = VulkanDescriptorType::UBO;
				break;
			}

			case DXIL::ResourceType::Sampler:
				remap_success = resource_mapping_iface->remap_sampler(d3d_binding, vulkan_binding);
				break;
			}
		}

		if (!remap_success)
			return false;

		if (!vulkan_binding.bindless.use_heap)
		{
			LOGE("SM 6.6 bindless references must be bindless.\n");
			return false;
		}

		AliasedAccess aliased_access;
		if (!analyze_aliased_access(annotation->tracking, vulkan_binding.descriptor_type, aliased_access))
			return false;

		info.desc_set = vulkan_binding.descriptor_set;
		info.binding = vulkan_binding.binding;
		info.descriptor_type = vulkan_binding.descriptor_type;
		info.aliased = aliased_access.requires_alias_decoration;

		annotation->reference.bindless = true;
		annotation->reference.base_resource_is_array = true;
		annotation->reference.push_constant_member = UINT32_MAX;
		annotation->reference.stride = annotation->stride;
		annotation->reference.resource_kind = annotation->resource_kind;
		annotation->reference.coherent = annotation->coherent || annotation->rov;
		annotation->reference.rov = annotation->rov;

		if (execution_mode_meta.memory_model == spv::MemoryModelVulkan)
		{
			annotation->reference.vkmm.non_private = info.type == DXIL::ResourceType::UAV;
			annotation->reference.vkmm.auto_visibility = annotation->coherent || annotation->rov;
		}

		if (aliased_access.requires_alias_decoration)
		{
			annotation->reference.var_alias_group = create_bindless_heap_variable_alias_group(
			    info, aliased_access.raw_declarations);
		}
		else if (aliased_access.override_primary_component_types)
		{
			auto tmp_info = info;
			tmp_info.component = aliased_access.primary_component_type;
			tmp_info.raw_vecsize = aliased_access.primary_raw_vecsize;
			annotation->reference.var_id = create_bindless_heap_variable(tmp_info);
		}
		else
			annotation->reference.var_id = create_bindless_heap_variable(info);

		annotation->reference.aliased = aliased_access.requires_alias_decoration;
	}

	return true;
}

bool Converter::Impl::emit_resources()
{
	unsigned num_root_descriptors = 0;
	unsigned num_root_constant_words = 0;

	if (resource_mapping_iface)
	{
		num_root_descriptors = resource_mapping_iface->get_root_descriptor_count();
		num_root_constant_words = resource_mapping_iface->get_root_constant_word_count();
	}

	if (num_root_constant_words != 0 || num_root_descriptors != 0)
		emit_root_constants(num_root_descriptors, num_root_constant_words);

	if (execution_model_is_ray_tracing(execution_model))
		if (!emit_shader_record_buffer())
			return false;

	if (!emit_global_heaps())
		return false;

	if (options.descriptor_heap_robustness)
	{
		if (!emit_descriptor_heap_introspection_ssbo())
			return false;
	}
	else if (options.instruction_instrumentation.enabled &&
	         (options.instruction_instrumentation.type == InstructionInstrumentationType::ExpectAssume ||
	          options.instruction_instrumentation.type == InstructionInstrumentationType::BufferSynchronizationValidation))
	{
		// Failure is not a big deal.
		emit_descriptor_heap_introspection_ssbo();
	}

	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return true;

	auto *metas = resource_meta->getOperand(0);

	llvm::MDNode *reflection_metas = nullptr;
	if (bitcode_reflection_parser)
	{
		auto &reflection_module = bitcode_reflection_parser->get_module();
		auto *reflection_resource_meta = reflection_module.getNamedMetadata("dx.resources");
		if (reflection_resource_meta)
			reflection_metas = reflection_resource_meta->getOperand(0);
	}

	const llvm::MDNode *reflection_type_metas[4] = {};
	const llvm::MDNode *type_metas[4] = {};

	for (unsigned i = 0; i < 4; i++)
	{
		if (metas->getOperand(i))
		{
			type_metas[i] = llvm::dyn_cast<llvm::MDNode>(metas->getOperand(i));
			if (reflection_metas)
				reflection_type_metas[i] = llvm::dyn_cast<llvm::MDNode>(reflection_metas->getOperand(i));
		}
	}

	if (type_metas[0])
		if (!emit_srvs(type_metas[0], reflection_type_metas[0]))
			return false;
	if (type_metas[1])
		if (!emit_uavs(type_metas[1], reflection_type_metas[1]))
			return false;
	if (type_metas[2])
		if (!emit_cbvs(type_metas[2], reflection_type_metas[2]))
			return false;
	if (type_metas[3])
		if (!emit_samplers(type_metas[3], reflection_type_metas[3]))
			return false;

	for (auto &alloc : alloca_tracking)
	{
		// Now that we have emitted resources, we can determine which alloca -> CBV punchthroughs to accept.
		if (!analyze_alloca_cbv_forwarding_post_resource_emit(*this, alloc.second))
			return false;
	}

	return true;
}

void Converter::Impl::scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &bitcode_parser)
{
	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return;

	auto *metas = resource_meta->getOperand(0);
	auto stage = get_shader_stage(bitcode_parser);

	if (metas->getOperand(0))
		if (!scan_srvs(iface, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(0)), stage))
			return;
	if (metas->getOperand(1))
		if (!scan_uavs(iface, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(1)), stage))
			return;
	if (metas->getOperand(2))
		if (!scan_cbvs(iface, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(2)), stage))
			return;
	if (metas->getOperand(3))
		if (!scan_samplers(iface, llvm::dyn_cast<llvm::MDNode>(metas->getOperand(3)), stage))
			return;
}

ShaderStage Converter::Impl::get_remapping_stage(spv::ExecutionModel execution_model)
{
	switch (execution_model)
	{
	case spv::ExecutionModelVertex:
		return ShaderStage::Vertex;
	case spv::ExecutionModelTessellationControl:
		return ShaderStage::Hull;
	case spv::ExecutionModelTessellationEvaluation:
		return ShaderStage::Domain;
	case spv::ExecutionModelGeometry:
		return ShaderStage::Geometry;
	case spv::ExecutionModelFragment:
		return ShaderStage::Pixel;
	case spv::ExecutionModelGLCompute:
		return ShaderStage::Compute;
	case spv::ExecutionModelIntersectionKHR:
		return ShaderStage::Intersection;
	case spv::ExecutionModelClosestHitKHR:
		return ShaderStage::ClosestHit;
	case spv::ExecutionModelMissKHR:
		return ShaderStage::Miss;
	case spv::ExecutionModelAnyHitKHR:
		return ShaderStage::AnyHit;
	case spv::ExecutionModelRayGenerationKHR:
		return ShaderStage::RayGeneration;
	case spv::ExecutionModelCallableKHR:
		return ShaderStage::Callable;
	case spv::ExecutionModelTaskEXT:
		return ShaderStage::Amplification;
	case spv::ExecutionModelMeshEXT:
		return ShaderStage::Mesh;
	default:
		return ShaderStage::Unknown;
	}
}

static inline float half_to_float(uint16_t u16_value)
{
	// Based on the GLM implementation.
	int s = (u16_value >> 15) & 0x1;
	int e = (u16_value >> 10) & 0x1f;
	int m = (u16_value >> 0) & 0x3ff;

	union {
		float f32;
		uint32_t u32;
	} u;

	if (e == 0)
	{
		if (m == 0)
		{
			u.u32 = uint32_t(s) << 31;
			return u.f32;
		}
		else
		{
			while ((m & 0x400) == 0)
			{
				m <<= 1;
				e--;
			}

			e++;
			m &= ~0x400;
		}
	}
	else if (e == 31)
	{
		if (m == 0)
		{
			u.u32 = (uint32_t(s) << 31) | 0x7f800000u;
			return u.f32;
		}
		else
		{
			u.u32 = (uint32_t(s) << 31) | 0x7f800000u | (m << 13);
			return u.f32;
		}
	}

	e += 127 - 15;
	m <<= 13;
	u.u32 = (uint32_t(s) << 31) | (e << 23) | m;
	return u.f32;
}

spv::Id Converter::Impl::get_padded_constant_array(spv::Id padded_type_id, const llvm::Constant *constant)
{
	auto &builder = spirv_module.get_builder();
	assert(constant->getType()->getTypeID() == llvm::Type::TypeID::ArrayTyID);
	Vector<spv::Id> constituents;

	if (llvm::isa<llvm::ConstantAggregateZero>(constant))
	{
		return builder.makeNullConstant(padded_type_id);
	}
	else if (auto *agg = llvm::dyn_cast<llvm::ConstantAggregate>(constant))
	{
		constituents.reserve(agg->getNumOperands() + 1);
		for (unsigned i = 0; i < agg->getNumOperands(); i++)
		{
			llvm::Constant *c = agg->getOperand(i);
			if (const auto *undef = llvm::dyn_cast<llvm::UndefValue>(c))
				constituents.push_back(get_id_for_undef_constant(undef));
			else
				constituents.push_back(get_id_for_constant(c, 0));
		}
	}
	else if (auto *array = llvm::dyn_cast<llvm::ConstantDataArray>(constant))
	{
		constituents.reserve(array->getType()->getArrayNumElements() + 1);
		for (unsigned i = 0; i < array->getNumElements(); i++)
		{
			llvm::Constant *c = array->getElementAsConstant(i);
			if (const auto *undef = llvm::dyn_cast<llvm::UndefValue>(c))
				constituents.push_back(get_id_for_undef_constant(undef));
			else
				constituents.push_back(get_id_for_constant(c, 0));
		}
	}
	else
		return 0;

	constituents.push_back(builder.makeNullConstant(get_type_id(constant->getType()->getArrayElementType())));
	return builder.makeCompositeConstant(padded_type_id, constituents);
}

spv::Id Converter::Impl::get_id_for_constant(const llvm::Constant *constant, unsigned forced_width)
{
	auto &builder = spirv_module.get_builder();

	switch (constant->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
	{
		auto *fp = llvm::cast<llvm::ConstantFP>(constant);
		auto f16 = uint16_t(fp->getValueAPF().bitcastToAPInt().getZExtValue());

		if (support_native_fp16_operations())
			return builder.makeFloat16Constant(f16);
		else
			return builder.makeFloatConstant(half_to_float(f16));
	}

	case llvm::Type::TypeID::FloatTyID:
	{
		auto *fp = llvm::cast<llvm::ConstantFP>(constant);
		return builder.makeFloatConstant(fp->getValueAPF().convertToFloat());
	}

	case llvm::Type::TypeID::DoubleTyID:
	{
		auto *fp = llvm::cast<llvm::ConstantFP>(constant);
		return builder.makeDoubleConstant(fp->getValueAPF().convertToDouble());
	}

	case llvm::Type::TypeID::IntegerTyID:
	{
		unsigned integer_width = forced_width ? forced_width : constant->getType()->getIntegerBitWidth();
		int physical_width = physical_integer_bit_width(integer_width);
		switch (physical_width)
		{
		case 1:
			return builder.makeBoolConstant(constant->getUniqueInteger().getZExtValue() != 0);

		case 16:
			return builder.makeUint16Constant(constant->getUniqueInteger().getZExtValue());

		case 32:
			return builder.makeUintConstant(constant->getUniqueInteger().getZExtValue());

		case 64:
			return builder.makeUint64Constant(constant->getUniqueInteger().getZExtValue());

		default:
			return 0;
		}
	}

	case llvm::Type::TypeID::VectorTyID:
	case llvm::Type::TypeID::ArrayTyID:
	case llvm::Type::TypeID::StructTyID:
	{
		Vector<spv::Id> constituents;
		spv::Id type_id = get_type_id(constant->getType());

		if (llvm::isa<llvm::ConstantAggregateZero>(constant))
		{
			return builder.makeNullConstant(type_id);
		}
		else if (auto *agg = llvm::dyn_cast<llvm::ConstantAggregate>(constant))
		{
			constituents.reserve(agg->getNumOperands());
			for (unsigned i = 0; i < agg->getNumOperands(); i++)
			{
				llvm::Constant *c = agg->getOperand(i);
				if (const auto *undef = llvm::dyn_cast<llvm::UndefValue>(c))
					constituents.push_back(get_id_for_undef_constant(undef));
				else
					constituents.push_back(get_id_for_constant(c, 0));
			}
		}
		else if (auto *array = llvm::dyn_cast<llvm::ConstantDataArray>(constant))
		{
			constituents.reserve(array->getType()->getArrayNumElements());
			for (unsigned i = 0; i < array->getNumElements(); i++)
			{
				llvm::Constant *c = array->getElementAsConstant(i);
				if (const auto *undef = llvm::dyn_cast<llvm::UndefValue>(c))
					constituents.push_back(get_id_for_undef_constant(undef));
				else
					constituents.push_back(get_id_for_constant(c, 0));
			}
		}
		else if (auto *vec = llvm::dyn_cast<llvm::ConstantDataVector>(constant))
		{
			constituents.reserve(vec->getType()->getVectorNumElements());
			for (unsigned i = 0; i < vec->getNumElements(); i++)
			{
				llvm::Constant *c = vec->getElementAsConstant(i);
				if (const auto *undef = llvm::dyn_cast<llvm::UndefValue>(c))
					constituents.push_back(get_id_for_undef_constant(undef));
				else
					constituents.push_back(get_id_for_constant(c, 0));
			}
		}
		else
			return 0;

		return builder.makeCompositeConstant(type_id, constituents);
	}

	default:
		return 0;
	}
}

spv::Id Converter::Impl::get_id_for_undef(const llvm::UndefValue *undef)
{
	auto &builder = spirv_module.get_builder();
	return builder.createUndefined(get_type_id(undef->getType()));
}

spv::Id Converter::Impl::get_id_for_undef_constant(const llvm::UndefValue *undef)
{
	auto &builder = spirv_module.get_builder();
	return builder.createUndefinedConstant(get_type_id(undef->getType()));
}

spv::Id Converter::Impl::get_id_for_value(const llvm::Value *value, unsigned forced_width)
{
	assert(value);

	// Constant expressions must be stamped out every place it is used,
	// since it technically lives at global scope.
	// Do not cache this value in the value map.
	if (auto *cexpr = llvm::dyn_cast<llvm::ConstantExpr>(value))
		return build_constant_expression(*this, cexpr);

	auto itr = value_map.find(value);
	if (itr != value_map.end())
		return itr->second;

	spv::Id ret;
	if (auto *undef = llvm::dyn_cast<llvm::UndefValue>(value))
		ret = get_id_for_undef(undef);
	else if (auto *constant = llvm::dyn_cast<llvm::Constant>(value))
		ret = get_id_for_constant(constant, forced_width);
	else
		ret = spirv_module.allocate_id();

	value_map[value] = ret;
	return ret;
}

static llvm::MDNode *get_entry_point_meta(const llvm::Module &module, const char *entry)
{
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	unsigned num_entry_points = ep_meta->getNumOperands();
	for (unsigned i = 0; i < num_entry_points; i++)
	{
		auto *node = ep_meta->getOperand(i);
		if (node)
		{
			auto &func_node = node->getOperand(0);
			if (func_node)
				if (!entry || (Converter::entry_point_matches(get_string_metadata(node, 1), entry)))
					return node;
		}
	}

	// dxilconv can emit null hull shader with non-null patch constant function ... *shrug*
	// I suppose we need to deal with that too.
	if (!entry && num_entry_points)
	{
		auto *node = ep_meta->getOperand(0);
		if (node)
			return node;
	}

	return nullptr;
}

static llvm::MDNode *get_null_entry_point_meta(const llvm::Module &module)
{
	// In DXR, a dummy entry point with null function pointer owns the shader flags for whatever reason ...
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	unsigned num_entry_points = ep_meta->getNumOperands();
	for (unsigned i = 0; i < num_entry_points; i++)
	{
		auto *node = ep_meta->getOperand(i);
		if (node)
		{
			auto &func_node = node->getOperand(0);
			if (!func_node)
				return node;
		}
	}

	return nullptr;
}

Vector<String> Converter::get_entry_points(const LLVMBCParser &parser)
{
	Vector<String> result;
	auto &module = parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");

	unsigned num_entry_points = ep_meta->getNumOperands();
	result.reserve(num_entry_points);

	for (unsigned i = 0; i < num_entry_points; i++)
	{
		auto *node = ep_meta->getOperand(i);
		if (node)
		{
			auto &func_node = node->getOperand(0);
			if (func_node)
				result.push_back(get_string_metadata(node, 1));
		}
	}

	return result;
}

bool Converter::entry_point_matches(const String &mangled, const char *user)
{
	if (is_mangled_entry_point(user))
		return mangled == user;
	else
		return demangle_entry_point(mangled) == user;
}

static String get_entry_point_name(llvm::MDNode *node)
{
	if (!node)
		return {};

	auto &name_node = node->getOperand(1);

	if (name_node)
	{
		auto *str_node = llvm::dyn_cast<llvm::MDString>(name_node);
		if (str_node)
			return get_string_metadata(node, 1);
	}

	return {};
}

static llvm::Function *get_entry_point_function(llvm::MDNode *node)
{
	if (!node)
		return nullptr;

	auto &func_node = node->getOperand(0);

	if (func_node)
		return llvm::dyn_cast<llvm::Function>(llvm::cast<llvm::ConstantAsMetadata>(func_node)->getValue());
	else
		return nullptr;
}

static const llvm::MDOperand *get_shader_property_tag(const llvm::MDNode *func_meta, DXIL::ShaderPropertyTag tag)
{
	if (func_meta && func_meta->getNumOperands() >= 5 && func_meta->getOperand(4))
	{
		auto *tag_values = llvm::dyn_cast<llvm::MDNode>(func_meta->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
			if (tag == static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i)))
				return &tag_values->getOperand(2 * i + 1);
	}

	return nullptr;
}

static bool get_execution_model_lib_target(const llvm::Module &module, llvm::MDNode *entry_point_meta)
{
	String model;
	Converter::Impl::get_shader_model(module, &model, nullptr, nullptr);
	return model == "lib";
}

static spv::ExecutionModel get_execution_model(const llvm::Module &module, llvm::MDNode *entry_point_meta)
{
	if (auto *tag = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::ShaderKind))
	{
		if (!tag)
			return spv::ExecutionModelMax;

		auto shader_kind = static_cast<DXIL::ShaderKind>(
		    llvm::cast<llvm::ConstantAsMetadata>(*tag)->getValue()->getUniqueInteger().getZExtValue());
		switch (shader_kind)
		{
		case DXIL::ShaderKind::Pixel:
			return spv::ExecutionModelFragment;
		case DXIL::ShaderKind::Vertex:
			return spv::ExecutionModelVertex;
		case DXIL::ShaderKind::Hull:
			return spv::ExecutionModelTessellationControl;
		case DXIL::ShaderKind::Domain:
			return spv::ExecutionModelTessellationEvaluation;
		case DXIL::ShaderKind::Geometry:
			return spv::ExecutionModelGeometry;
		case DXIL::ShaderKind::Compute:
		case DXIL::ShaderKind::Node:
			return spv::ExecutionModelGLCompute;
		case DXIL::ShaderKind::Amplification:
			return spv::ExecutionModelTaskEXT;
		case DXIL::ShaderKind::Mesh:
			return spv::ExecutionModelMeshEXT;
		case DXIL::ShaderKind::RayGeneration:
			return spv::ExecutionModelRayGenerationKHR;
		case DXIL::ShaderKind::Miss:
			return spv::ExecutionModelMissKHR;
		case DXIL::ShaderKind::ClosestHit:
			return spv::ExecutionModelClosestHitKHR;
		case DXIL::ShaderKind::Callable:
			return spv::ExecutionModelCallableKHR;
		case DXIL::ShaderKind::AnyHit:
			return spv::ExecutionModelAnyHitKHR;
		case DXIL::ShaderKind::Intersection:
			return spv::ExecutionModelIntersectionKHR;
		default:
			break;
		}
	}
	else
	{
		// Non-RT shaders tend to rely on having the shader model set in the shaderModel meta node.
		String model;
		Converter::Impl::get_shader_model(module, &model, nullptr, nullptr);

		if (model == "vs")
			return spv::ExecutionModelVertex;
		else if (model == "ps")
			return spv::ExecutionModelFragment;
		else if (model == "hs")
			return spv::ExecutionModelTessellationControl;
		else if (model == "ds")
			return spv::ExecutionModelTessellationEvaluation;
		else if (model == "gs")
			return spv::ExecutionModelGeometry;
		else if (model == "cs")
			return spv::ExecutionModelGLCompute;
		else if (model == "as")
			return spv::ExecutionModelTaskEXT;
		else if (model == "ms")
			return spv::ExecutionModelMeshEXT;
	}

	return spv::ExecutionModelMax;
}

spv::Id Converter::Impl::get_type_id(const llvm::Type *type, TypeLayoutFlags flags)
{
	auto &builder = spirv_module.get_builder();
	switch (type->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		return builder.makeFloatType(support_native_fp16_operations() ? 16 : 32);
	case llvm::Type::TypeID::FloatTyID:
		return builder.makeFloatType(32);
	case llvm::Type::TypeID::DoubleTyID:
		return builder.makeFloatType(64);

	case llvm::Type::TypeID::IntegerTyID:
		if (type->getIntegerBitWidth() == 1)
			return builder.makeBoolType();
		else
		{
			auto width = physical_integer_bit_width(type->getIntegerBitWidth());
			return builder.makeIntegerType(width, false);
		}

	case llvm::Type::TypeID::PointerTyID:
	{
		if (DXIL::AddressSpace(type->getPointerAddressSpace()) != DXIL::AddressSpace::PhysicalNodeIO ||
		    (flags & TYPE_LAYOUT_PHYSICAL_BIT) == 0)
		{
			// Have to deal with this from the outside. Should only be relevant for getelementptr and instructions like that.
			LOGE("Cannot reliably convert LLVM pointer type, we cannot differentiate between Function and Private.\n");
			std::terminate();
		}

		// This is free-flowing BDA in DXIL. We'll deal with it as-is.
		// Main complication is that we have to emit Offset information ourselves.
		spv::Id pointee_type = get_type_id(type->getPointerElementType(), flags);
		return builder.makePointer(spv::StorageClassPhysicalStorageBuffer, pointee_type);
	}

	case llvm::Type::TypeID::ArrayTyID:
	{
		if (type->getArrayNumElements() == 0)
			return 0;

		spv::Id array_size_id;
		spv::Id element_type_id;

		// dxbc2dxil emits broken code for TGSM. It's an array of i8 which is absolute nonsense.
		// It then bitcasts the pointer to i32, which isn't legal either.
		if ((flags & TYPE_LAYOUT_PHYSICAL_BIT) == 0 &&
		    type->getArrayElementType()->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
		    type->getArrayElementType()->getIntegerBitWidth() == 8 &&
		    type->getArrayNumElements() % 4 == 0)
		{
			array_size_id = builder.makeUintConstant(type->getArrayNumElements() / 4);
			element_type_id = builder.makeUintType(32);
		}
		else
		{
			array_size_id = builder.makeUintConstant(type->getArrayNumElements());
			element_type_id = get_type_id(type->getArrayElementType(), flags & ~TYPE_LAYOUT_BLOCK_BIT);
		}

		if ((flags & TYPE_LAYOUT_PHYSICAL_BIT) != 0)
		{
			auto size_stride = get_physical_size_for_type(element_type_id);
			uint32_t stride = size_stride.size;

			// We always use scalar layout.
			for (auto &cached_type : cached_physical_array_types)
				if (cached_type.element_type_id == element_type_id && cached_type.array_size_id == array_size_id)
					return cached_type.id;

			spv::Id array_type_id = builder.makeArrayType(element_type_id, array_size_id, stride);
			builder.addDecoration(array_type_id, spv::DecorationArrayStride, stride);
			cached_physical_array_types.push_back({ array_type_id, element_type_id, array_size_id });
			return array_type_id;
		}
		else
		{
			// glslang emitter deduplicates.
			return builder.makeArrayType(element_type_id, array_size_id, 0);
		}
	}

	case llvm::Type::TypeID::StructTyID:
	{
		auto *struct_type = llvm::cast<llvm::StructType>(type);
		Vector<spv::Id> member_types;
		member_types.reserve(struct_type->getStructNumElements());
		for (unsigned i = 0; i < struct_type->getStructNumElements(); i++)
			member_types.push_back(get_type_id(struct_type->getStructElementType(i), flags & ~TYPE_LAYOUT_BLOCK_BIT));
		return get_struct_type(member_types, flags, "");
	}

	case llvm::Type::TypeID::VectorTyID:
	{
		auto *vec_type = llvm::cast<llvm::VectorType>(type);
		return builder.makeVectorType(get_type_id(vec_type->getElementType()), vec_type->getVectorNumElements());
	}

	default:
		return 0;
	}
}

Converter::Impl::SizeAlignment Converter::Impl::get_physical_size_for_type(spv::Id type_id)
{
	SizeAlignment res = {};

	if (builder().isScalarType(type_id))
	{
		res.size = builder().getScalarTypeWidth(type_id) / 8;
		res.alignment = res.size;
	}
	else if (builder().isVectorType(type_id))
	{
		res = get_physical_size_for_type(builder().getContainedTypeId(type_id));
		res.size *= builder().getNumComponents(type_id);
	}
	else if (builder().isArrayType(type_id))
	{
		res = get_physical_size_for_type(builder().getContainedTypeId(type_id));
		uint32_t array_size = builder().getNumTypeConstituents(type_id);
		// Alignment is inherited from constituent, we do scalar block layout here.
		res.size *= array_size;
	}
	else if (builder().isStructType(type_id))
	{
		int num_members = builder().getNumTypeConstituents(type_id);
		for (int i = 0; i < num_members; i++)
		{
			uint32_t member_type_id = builder().getContainedTypeId(type_id, i);
			auto member_res = get_physical_size_for_type(member_type_id);
			res.size = (res.size + member_res.alignment - 1) & ~(member_res.alignment - 1);
			res.size += member_res.size;
			res.alignment = std::max<uint32_t>(res.alignment, member_res.alignment);
		}
		res.size = (res.size + res.alignment - 1) & ~(res.alignment - 1);
	}
	else if (builder().isPointerType(type_id))
	{
		res.size = sizeof(uint64_t);
		res.alignment = sizeof(uint64_t);
	}

	return res;
}

void Converter::Impl::decorate_physical_offsets(spv::Id struct_type_id, const Vector<spv::Id> &type_ids)
{
	uint32_t offset = 0;
	int member_index = 0;
	for (auto &type_id : type_ids)
	{
		// DXIL seems to imply scalar alignment for node payload.
		// It's simple and easy, so just roll with that.
		auto size_alignment = get_physical_size_for_type(type_id);
		assert(size_alignment.size != 0);
		offset = (offset + size_alignment.alignment - 1) & ~(size_alignment.alignment - 1);
		builder().addMemberDecoration(struct_type_id, member_index, spv::DecorationOffset, offset);
		offset += size_alignment.size;
		member_index++;
	}
}

spv::Id Converter::Impl::get_struct_type(const Vector<spv::Id> &type_ids, TypeLayoutFlags flags, const char *name)
{
	auto itr = std::find_if(cached_struct_types.begin(), cached_struct_types.end(), [&](const StructTypeEntry &entry) -> bool {
		if (type_ids.size() != entry.subtypes.size())
			return false;
		if (flags != entry.flags)
			return false;
		if ((!name && !entry.name.empty()) || (entry.name != name))
			return false;

		for (unsigned i = 0; i < type_ids.size(); i++)
			if (type_ids[i] != entry.subtypes[i])
				return false;

		return true;
	});

	if (itr == cached_struct_types.end())
	{
		StructTypeEntry entry;
		entry.subtypes = type_ids;
		entry.name = name ? name : "";

		if ((flags & TYPE_LAYOUT_BLOCK_BIT) != 0)
		{
			constexpr TypeLayoutFlags block_flags = TYPE_LAYOUT_BLOCK_BIT |
			                                        TYPE_LAYOUT_COHERENT_BIT |
			                                        TYPE_LAYOUT_READ_ONLY_BIT;
			spv::Id struct_type_id = get_struct_type(type_ids, flags & ~block_flags, entry.name.c_str());
			entry.id = builder().makeStructType({ struct_type_id }, entry.name.c_str());
			builder().addDecoration(entry.id, spv::DecorationBlock);
			builder().addMemberDecoration(entry.id, 0, spv::DecorationOffset, 0);
			if ((flags & TYPE_LAYOUT_COHERENT_BIT) != 0 && execution_mode_meta.memory_model == spv::MemoryModelGLSL450)
				builder().addMemberDecoration(entry.id, 0, spv::DecorationCoherent);
			if ((flags & TYPE_LAYOUT_READ_ONLY_BIT) != 0)
				builder().addMemberDecoration(entry.id, 0, spv::DecorationNonWritable);
			builder().addMemberName(entry.id, 0, "data");
		}
		else
		{
			entry.id = builder().makeStructType(type_ids, entry.name.c_str());
			if ((flags & TYPE_LAYOUT_PHYSICAL_BIT) != 0)
				decorate_physical_offsets(entry.id, type_ids);
		}

		entry.flags = flags;
		spv::Id id = entry.id;
		cached_struct_types.push_back(std::move(entry));
		return id;
	}
	else
		return itr->id;
}

spv::Id Converter::Impl::get_type_id(DXIL::ComponentType element_type, unsigned rows, unsigned cols, bool force_array)
{
	auto &builder = spirv_module.get_builder();

	spv::Id component_type;
	switch (element_type)
	{
	case DXIL::ComponentType::I1:
		// Cannot have bools in I/O interfaces, these are emitted as 32-bit integers.
		component_type = builder.makeUintType(32);
		break;

	case DXIL::ComponentType::I16:
		component_type = builder.makeIntegerType(16, true);
		break;

	case DXIL::ComponentType::U16:
		component_type = builder.makeIntegerType(16, false);
		break;

	case DXIL::ComponentType::I32:
		component_type = builder.makeIntegerType(32, true);
		break;

	case DXIL::ComponentType::U32:
		component_type = builder.makeIntegerType(32, false);
		break;

	case DXIL::ComponentType::I64:
		component_type = builder.makeIntegerType(64, true);
		break;

	case DXIL::ComponentType::U64:
		component_type = builder.makeIntegerType(64, false);
		break;

	case DXIL::ComponentType::F16:
		component_type = builder.makeFloatType(16);
		break;

	case DXIL::ComponentType::F32:
		component_type = builder.makeFloatType(32);
		break;

	case DXIL::ComponentType::F64:
		component_type = builder.makeFloatType(64);
		break;

	default:
		LOGE("Unknown component type.\n");
		return 0;
	}

	if (cols > 1)
		component_type = builder.makeVectorType(component_type, cols);
	if (rows > 1 || force_array)
		component_type = builder.makeArrayType(component_type, builder.makeUintConstant(rows), 0);
	return component_type;
}

spv::Id Converter::Impl::get_type_id(spv::Id id) const
{
	auto itr = id_to_type.find(id);
	if (itr == id_to_type.end())
		return 0;
	else
		return itr->second;
}

static bool module_is_dxilconv(llvm::Module &module)
{
	auto *ident_meta = module.getNamedMetadata("llvm.ident");
	if (ident_meta)
		if (auto *arg0 = ident_meta->getOperand(0))
			if (auto *str = llvm::dyn_cast<llvm::MDString>(arg0->getOperand(0)))
				if (str->getString().find("dxbc2dxil") != std::string::npos)
					return true;

	return false;
}

bool Converter::Impl::emit_patch_variables()
{
	auto *node = entry_point_meta;

	if (!node->getOperand(2))
		return true;

	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &patch_variables = signature_node->getOperand(2);
	if (!patch_variables)
		return true;

	// dxilconv is broken and emits patch the fork phase in a way that is non-sensical.
	// It assumes that you can write outside the bounds of a signature element.
	// To make this work, we need to lower the patch constant variables from Private variables instead.
	bool broken_patch_variables = false;
	if (execution_model == spv::ExecutionModelTessellationControl)
		broken_patch_variables = module_is_dxilconv(bitcode_parser.get_module());

	auto *patch_node = llvm::dyn_cast<llvm::MDNode>(patch_variables);

	auto &builder = spirv_module.get_builder();

	spv::StorageClass storage =
	    execution_model == spv::ExecutionModelTessellationEvaluation ? spv::StorageClassInput : spv::StorageClassOutput;

	unsigned num_broken_user_rows = 0;

	for (unsigned i = 0; i < patch_node->getNumOperands(); i++)
	{
		auto *patch = llvm::cast<llvm::MDNode>(patch_node->getOperand(i));
		auto element_id = get_constant_metadata(patch, 0);
		auto semantic_name = get_string_metadata(patch, 1);
		auto actual_element_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(patch, 2)));
		auto effective_element_type = get_effective_input_output_type(actual_element_type);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(patch, 3));

		unsigned semantic_index = 0;
		if (patch->getOperand(4))
			semantic_index = get_constant_metadata(llvm::cast<llvm::MDNode>(patch->getOperand(4)), 0);

		auto rows = get_constant_metadata(patch, 6);
		auto cols = get_constant_metadata(patch, 7);

		auto start_row = get_constant_metadata(patch, 8);
		auto start_col = get_constant_metadata(patch, 9);

		if (system_value == DXIL::Semantic::TessFactor)
			rows = 4;
		else if (system_value == DXIL::Semantic::InsideTessFactor)
			rows = 2;

		if (broken_patch_variables && system_value == DXIL::Semantic::User)
			num_broken_user_rows = std::max<unsigned>(num_broken_user_rows, start_row + rows);

		auto &meta = patch_elements_meta[element_id];

		// Handle case where shader declares the tess factors twice at different offsets.
		unsigned semantic_offset = 0;
		if (system_value == DXIL::Semantic::TessFactor || system_value == DXIL::Semantic::InsideTessFactor)
		{
			auto builtin = system_value == DXIL::Semantic::TessFactor ?
			               spv::BuiltInTessLevelOuter : spv::BuiltInTessLevelInner;
			if (spirv_module.has_builtin_shader_input(builtin))
			{
				meta = {};
				meta.id = spirv_module.get_builtin_shader_input(builtin);
				meta.component_type = actual_element_type;
				meta.semantic_offset = start_row;
				continue;
			}
		}

		spv::Id type_id;

		if (system_value == DXIL::Semantic::CullPrimitive)
			type_id = builder.makeBoolType();
		else
			type_id = get_type_id(effective_element_type, rows, cols);

		if (execution_model == spv::ExecutionModelMeshEXT)
		{
			type_id = builder.makeArrayType(
				type_id, builder.makeUintConstant(execution_mode_meta.stage_output_num_primitive, false), 0);
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += dxil_spv::to_string(semantic_index);
		}

		spv::Id variable_id = create_variable(storage, type_id, variable_name.c_str());
		meta.id = variable_id;
		meta.component_type = actual_element_type;
		meta.semantic_offset = semantic_offset;
		meta.start_row = start_row;
		meta.start_col = start_col;
		meta.lowering = broken_patch_variables && system_value == DXIL::Semantic::User;

		if (system_value != DXIL::Semantic::User)
		{
			emit_builtin_decoration(variable_id, system_value, storage);
		}
		else
		{
			// Patch constants are packed together with control point variables,
			// so we need to apply an offset to make this work in SPIR-V.
			// The offset is deduced from the control point I/O signature.
			// TODO: If it's possible to omit trailing CP members in domain shader, we will need to pass this offset
			// into the compiler.
			VulkanStageIO vk_io = { start_row + patch_location_offset, start_col, true };

			if (resource_mapping_iface)
			{
				D3DStageIO d3d_io = { semantic_name.c_str(), semantic_index, start_row, rows };

				if (execution_model == spv::ExecutionModelTessellationEvaluation)
				{
					if (!resource_mapping_iface->remap_stage_input(d3d_io, vk_io))
						return false;
				}
				else if (!resource_mapping_iface->remap_stage_output(d3d_io, vk_io))
					return false;
			}

			builder.addDecoration(variable_id, spv::DecorationLocation, vk_io.location);
			if (vk_io.component != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, vk_io.component);
		}

		builder.addDecoration(variable_id, execution_model == spv::ExecutionModelMeshEXT
		                                   ? spv::DecorationPerPrimitiveEXT : spv::DecorationPatch);
	}

	if (num_broken_user_rows)
	{
		spv::Id type_id = builder.makeArrayType(builder.makeVectorType(builder.makeUintType(32), 4),
		                                        builder.makeUintConstant(num_broken_user_rows), 0);
		execution_mode_meta.patch_lowering_array_var_id =
			create_variable_with_initializer(spv::StorageClassPrivate, type_id,
			                                 builder.makeNullConstant(type_id),
			                                 "PatchLoweringRows");
	}

	return true;
}

bool Converter::Impl::emit_other_variables()
{
	auto &builder = spirv_module.get_builder();

	if (execution_model == spv::ExecutionModelMeshEXT && execution_mode_meta.stage_output_num_primitive)
	{
		unsigned index_dim = execution_mode_meta.primitive_index_dimension;

		if (index_dim)
		{
			spv::Id type_id = builder.makeArrayType(
				get_type_id(DXIL::ComponentType::U32, 1, index_dim),
				builder.makeUintConstant(execution_mode_meta.stage_output_num_primitive, false), 0);
			primitive_index_array_id = create_variable(spv::StorageClassOutput, type_id, "indices");

			spv::BuiltIn builtin_id =
			    index_dim == 3 ? spv::BuiltInPrimitiveTriangleIndicesEXT : spv::BuiltInPrimitiveLineIndicesEXT;
			builder.addDecoration(primitive_index_array_id, spv::DecorationBuiltIn, builtin_id);
			spirv_module.register_builtin_shader_output(primitive_index_array_id, builtin_id);
		}
	}

	return true;
}

static unsigned get_geometry_shader_stream_index(const llvm::MDNode *node)
{
	if (node->getNumOperands() >= 11 && node->getOperand(10))
	{
		auto *attr = llvm::dyn_cast<llvm::MDNode>(node->getOperand(10));
		if (!attr)
			return 0;

		unsigned num_pairs = attr->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			if (static_cast<DXIL::GSStageOutTags>(get_constant_metadata(attr, 2 * i + 0)) == DXIL::GSStageOutTags::Stream)
				return get_constant_metadata(attr, 2 * i + 1);
		}
	}
	return 0;
}

static void build_geometry_stream_row_offsets(unsigned offsets[4], const llvm::MDNode *outputs_node)
{
	unsigned row_count_for_geometry_stream[4] = {};
	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		unsigned geometry_stream = get_geometry_shader_stream_index(output);
		if (geometry_stream < 4)
		{
			auto start_row = get_constant_metadata(output, 8);
			auto rows = get_constant_metadata(output, 6);
			auto end_rows = rows + start_row;
			if (end_rows > row_count_for_geometry_stream[geometry_stream])
				row_count_for_geometry_stream[geometry_stream] = end_rows;
		}
	}

	for (unsigned row = 0; row < 4; row++)
		for (unsigned i = 0; i < row; i++)
			offsets[row] += row_count_for_geometry_stream[i];
}

bool Converter::Impl::emit_stage_output_variables()
{
	auto *node = entry_point_meta;
	if (!node->getOperand(2))
		return true;

	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &outputs = signature_node->getOperand(1);
	if (!outputs)
		return true;

	auto *outputs_node = llvm::dyn_cast<llvm::MDNode>(outputs);

	auto &builder = spirv_module.get_builder();

	unsigned clip_distance_count = 0;
	unsigned cull_distance_count = 0;

	// If we have multiple geometry streams, need to hallucinate locations.
	// This is okay since we're not going to support multi-stream rasterization anyways.
	unsigned start_row_for_geometry_stream[4] = {};
	if (execution_model == spv::ExecutionModelGeometry)
		build_geometry_stream_row_offsets(start_row_for_geometry_stream, outputs_node);

	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		auto element_id = get_constant_metadata(output, 0);
		auto semantic_name = get_string_metadata(output, 1);
		auto actual_element_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(output, 2)));
		auto effective_element_type = get_effective_input_output_type(actual_element_type);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(output, 3));

		unsigned semantic_index = 0;
		if (output->getOperand(4))
			semantic_index = get_constant_metadata(llvm::cast<llvm::MDNode>(output->getOperand(4)), 0);

		auto interpolation = static_cast<DXIL::InterpolationMode>(get_constant_metadata(output, 5));
		auto rows = get_constant_metadata(output, 6);
		auto cols = get_constant_metadata(output, 7);

		auto start_row = get_constant_metadata(output, 8);
		auto start_col = get_constant_metadata(output, 9);

		if (options.dual_source_blending && start_row >= 2)
		{
			// Mask out writes to unused higher RTs when using dual source blending.
			continue;
		}

		if (execution_model == spv::ExecutionModelTessellationControl || execution_model == spv::ExecutionModelMeshEXT)
			patch_location_offset = std::max(patch_location_offset, start_row + rows);

		spv::Id type_id = get_type_id(effective_element_type, rows, cols);

		// For HS <-> DS, ignore system values.
		// Shading rate is also ignored in DS. RE4 hits this case. Just treat it as a normal user varying.
		if (execution_model == spv::ExecutionModelTessellationControl ||
		    (execution_model == spv::ExecutionModelTessellationEvaluation &&
		     system_value == DXIL::Semantic::ShadingRate))
		{
			system_value = DXIL::Semantic::User;
		}

		if (system_value == DXIL::Semantic::Position)
		{
			type_id = get_type_id(effective_element_type, rows, 4);
		}
		else if (system_value == DXIL::Semantic::Coverage)
		{
			type_id = builder.makeArrayType(type_id, builder.makeUintConstant(1), 0);
		}
		else if (system_value == DXIL::Semantic::ClipDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			output_clip_cull_meta[element_id] = { clip_distance_count, cols, spv::BuiltInClipDistance };
			output_elements_meta[element_id] = { 0, actual_element_type, 0 };
			clip_distance_count += rows * cols;
			continue;
		}
		else if (system_value == DXIL::Semantic::CullDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			output_clip_cull_meta[element_id] = { cull_distance_count, cols, spv::BuiltInCullDistance };
			output_elements_meta[element_id] = { 0, actual_element_type, 0 };
			cull_distance_count += rows * cols;
			continue;
		}

		if (execution_model == spv::ExecutionModelTessellationControl || execution_model == spv::ExecutionModelMeshEXT)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_output_num_vertex, false), 0);
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += dxil_spv::to_string(semantic_index);
		}

		spv::Id variable_id = create_variable(spv::StorageClassOutput, type_id, variable_name.c_str());
		output_elements_meta[element_id] = { variable_id, actual_element_type, 0 };

		if (effective_element_type != actual_element_type && component_type_is_16bit(actual_element_type))
			builder.addDecoration(variable_id, spv::DecorationRelaxedPrecision);

		if (execution_model == spv::ExecutionModelVertex || execution_model == spv::ExecutionModelGeometry ||
		    execution_model == spv::ExecutionModelTessellationEvaluation)
		{
			if (resource_mapping_iface)
			{
				VulkanStreamOutput vk_output = {};
				if (!resource_mapping_iface->remap_stream_output({ semantic_name.c_str(), semantic_index }, vk_output))
					return false;

				if (vk_output.enable)
				{
					builder.addCapability(spv::CapabilityTransformFeedback);
					builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeXfb);
					builder.addDecoration(variable_id, spv::DecorationOffset, vk_output.offset);
					builder.addDecoration(variable_id, spv::DecorationXfbStride, vk_output.stride);
					builder.addDecoration(variable_id, spv::DecorationXfbBuffer, vk_output.buffer_index);
				}
			}
		}

		unsigned geometry_stream = 0;
		if (execution_model == spv::ExecutionModelGeometry)
		{
			geometry_stream = get_geometry_shader_stream_index(output);
			if (geometry_stream != 0)
			{
				builder.addCapability(spv::CapabilityGeometryStreams);
				builder.addDecoration(variable_id, spv::DecorationStream, geometry_stream);
			}
		}

		if (system_value == DXIL::Semantic::Target)
		{
			if (options.dual_source_blending)
			{
				assert(start_row == 0 || start_row == 1);
				if (rows != 1)
				{
					LOGE("For dual source blending, number of rows must be 1.\n");
					return false;
				}
				builder.addDecoration(variable_id, spv::DecorationLocation, 0);
				builder.addDecoration(variable_id, spv::DecorationIndex, start_row);
				output_elements_meta[element_id].semantic_offset = 0;
			}
			else
			{
				builder.addDecoration(variable_id, spv::DecorationLocation, start_row);
				output_elements_meta[element_id].semantic_offset = start_row;
			}

			if (start_col != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, start_col);
		}
		else if (system_value != DXIL::Semantic::User)
		{
			emit_builtin_decoration(variable_id, system_value, spv::StorageClassOutput);
		}
		else
		{
			if (execution_model == spv::ExecutionModelVertex ||
			    execution_model == spv::ExecutionModelTessellationEvaluation ||
			    execution_model == spv::ExecutionModelGeometry ||
			    execution_model == spv::ExecutionModelMeshEXT)
			{
				emit_interpolation_decorations(variable_id, interpolation);
			}

			VulkanStageIO vk_output = { start_row, start_col };

			if (execution_model == spv::ExecutionModelGeometry && geometry_stream < 4)
				vk_output.location += start_row_for_geometry_stream[geometry_stream];

			if (resource_mapping_iface)
			{
				D3DStageIO d3d_output = { semantic_name.c_str(), semantic_index, start_row, rows };
				if (!resource_mapping_iface->remap_stage_output(d3d_output, vk_output))
					return false;
			}

			builder.addDecoration(variable_id, spv::DecorationLocation, vk_output.location);
			if (vk_output.component != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, vk_output.component);
		}
	}

	if (clip_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, clip_distance_count, 1, true);
		if (execution_model == spv::ExecutionModelTessellationControl || execution_model == spv::ExecutionModelMeshEXT)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_output_num_vertex, false), 0);
		}

		spv::Id variable_id = create_variable(spv::StorageClassOutput, type_id);
		emit_builtin_decoration(variable_id, DXIL::Semantic::ClipDistance, spv::StorageClassOutput);
		spirv_module.register_builtin_shader_output(variable_id, spv::BuiltInClipDistance);
	}

	if (cull_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, cull_distance_count, 1, true);
		if (execution_model == spv::ExecutionModelTessellationControl || execution_model == spv::ExecutionModelMeshEXT)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_output_num_vertex, false), 0);
		}

		spv::Id variable_id = create_variable(spv::StorageClassOutput, type_id);
		emit_builtin_decoration(variable_id, DXIL::Semantic::CullDistance, spv::StorageClassOutput);
		spirv_module.register_builtin_shader_output(variable_id, spv::BuiltInCullDistance);
	}

	return true;
}

void Converter::Impl::emit_builtin_interpolation_decorations(spv::Id variable_id,
                                                             DXIL::Semantic semantic,
                                                             DXIL::InterpolationMode mode)
{
	switch (semantic)
	{
	case DXIL::Semantic::Barycentrics:
	case DXIL::Semantic::InternalBarycentricsNoPerspective:
		emit_interpolation_decorations(variable_id, mode);
		break;

	case DXIL::Semantic::Position:
		// DXIL emits NoPerspective here, but seems weird to emit that since it's kinda implied.
		// Normalize the interpolate mode first, then emit.
		if (mode == DXIL::InterpolationMode::LinearNoperspective)
			mode = DXIL::InterpolationMode::Linear;
		else if (mode == DXIL::InterpolationMode::LinearNoperspectiveCentroid)
			mode = DXIL::InterpolationMode::LinearCentroid;
		else if (mode == DXIL::InterpolationMode::LinearNoperspectiveSample)
			mode = DXIL::InterpolationMode::LinearSample;
		emit_interpolation_decorations(variable_id, mode);
		break;

	default:
		break;
	}
}

void Converter::Impl::emit_interpolation_decorations(spv::Id variable_id, DXIL::InterpolationMode mode)
{
	auto &builder = spirv_module.get_builder();
	switch (mode)
	{
	case DXIL::InterpolationMode::Constant:
		builder.addDecoration(variable_id, spv::DecorationFlat);
		break;

	case DXIL::InterpolationMode::LinearCentroid:
		builder.addDecoration(variable_id, spv::DecorationCentroid);
		break;

	case DXIL::InterpolationMode::LinearSample:
		builder.addDecoration(variable_id, spv::DecorationSample);
		builder.addCapability(spv::CapabilitySampleRateShading);
		execution_mode_meta.per_sample_shading = true;
		break;

	case DXIL::InterpolationMode::LinearNoperspective:
		builder.addDecoration(variable_id, spv::DecorationNoPerspective);
		break;

	case DXIL::InterpolationMode::LinearNoperspectiveCentroid:
		builder.addDecoration(variable_id, spv::DecorationNoPerspective);
		builder.addDecoration(variable_id, spv::DecorationCentroid);
		break;

	case DXIL::InterpolationMode::LinearNoperspectiveSample:
		builder.addDecoration(variable_id, spv::DecorationNoPerspective);
		builder.addDecoration(variable_id, spv::DecorationSample);
		builder.addCapability(spv::CapabilitySampleRateShading);
		execution_mode_meta.per_sample_shading = true;
		break;

	default:
		break;
	}
}

void Converter::Impl::emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic, spv::StorageClass storage)
{
	auto &builder = spirv_module.get_builder();
	bool requires_flat_input = false;
	switch (semantic)
	{
	case DXIL::Semantic::Position:
		if (execution_model == spv::ExecutionModelFragment)
		{
			builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFragCoord);
			spirv_module.register_builtin_shader_input(id, spv::BuiltInFragCoord);
		}
		else if (storage == spv::StorageClassInput)
		{
			builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPosition);
			spirv_module.register_builtin_shader_input(id, spv::BuiltInPosition);
		}
		else if (storage == spv::StorageClassOutput)
		{
			builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPosition);
			spirv_module.register_builtin_shader_output(id, spv::BuiltInPosition);
			if (options.invariant_position)
				builder.addDecoration(id, spv::DecorationInvariant);
		}
		break;

	case DXIL::Semantic::SampleIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInSampleId);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInSampleId);
		builder.addCapability(spv::CapabilitySampleRateShading);
		execution_mode_meta.per_sample_shading = true;
		requires_flat_input = true;
		break;

	case DXIL::Semantic::VertexID:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInVertexIndex);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInVertexIndex);
		break;

	case DXIL::Semantic::InstanceID:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInInstanceIndex);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInInstanceIndex);
		break;

	case DXIL::Semantic::InsideTessFactor:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInTessLevelInner);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInTessLevelInner);
		break;

	case DXIL::Semantic::TessFactor:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInTessLevelOuter);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInTessLevelOuter);
		break;

	case DXIL::Semantic::Coverage:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInSampleMask);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInSampleMask);
		break;

	case DXIL::Semantic::Depth:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFragDepth);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDepthReplacing);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInFragDepth);
		break;

	case DXIL::Semantic::StencilRef:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFragStencilRefEXT);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeStencilRefReplacingEXT);
		builder.addExtension("SPV_EXT_shader_stencil_export");
		builder.addCapability(spv::CapabilityStencilExportEXT);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInFragStencilRefEXT);
		break;

	case DXIL::Semantic::DepthLessEqual:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFragDepth);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDepthReplacing);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDepthLess);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInFragDepth);
		break;

	case DXIL::Semantic::DepthGreaterEqual:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFragDepth);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDepthReplacing);
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDepthGreater);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInFragDepth);
		break;

	case DXIL::Semantic::IsFrontFace:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInFrontFacing);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInFrontFacing);
		break;

	case DXIL::Semantic::ClipDistance:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInClipDistance);
		builder.addCapability(spv::CapabilityClipDistance);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInClipDistance);
		else if (storage == spv::StorageClassInput)
			spirv_module.register_builtin_shader_input(id, spv::BuiltInClipDistance);
		break;

	case DXIL::Semantic::CullDistance:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInCullDistance);
		builder.addCapability(spv::CapabilityCullDistance);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInCullDistance);
		else if (storage == spv::StorageClassInput)
			spirv_module.register_builtin_shader_input(id, spv::BuiltInCullDistance);
		break;

	case DXIL::Semantic::RenderTargetArrayIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInLayer);
		if (storage == spv::StorageClassOutput)
		{
			spirv_module.register_builtin_shader_output(id, spv::BuiltInLayer);
			if (execution_model != spv::ExecutionModelGeometry)
			{
				builder.addExtension("SPV_EXT_shader_viewport_index_layer");
				builder.addCapability(spv::CapabilityShaderViewportIndexLayerEXT);
			}
		}
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInLayer);
			requires_flat_input = true;
		}
		builder.addCapability(spv::CapabilityGeometry);
		break;

	case DXIL::Semantic::ViewPortArrayIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInViewportIndex);
		if (storage == spv::StorageClassOutput)
		{
			spirv_module.register_builtin_shader_output(id, spv::BuiltInViewportIndex);
			if (execution_model != spv::ExecutionModelGeometry)
			{
				builder.addExtension("SPV_EXT_shader_viewport_index_layer");
				builder.addCapability(spv::CapabilityShaderViewportIndexLayerEXT);
			}
		}
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInViewportIndex);
			requires_flat_input = true;
		}
		builder.addCapability(spv::CapabilityMultiViewport);
		break;

	case DXIL::Semantic::PrimitiveID:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPrimitiveId);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInPrimitiveId);
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInPrimitiveId);
			requires_flat_input = true;
		}
		builder.addCapability(spv::CapabilityGeometry);
		break;

	case DXIL::Semantic::ShadingRate:
		if (storage == spv::StorageClassOutput)
		{
			builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPrimitiveShadingRateKHR);
			spirv_module.register_builtin_shader_output(id, spv::BuiltInPrimitiveShadingRateKHR);
		}
		else
		{
			builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInShadingRateKHR);
			spirv_module.register_builtin_shader_input(id, spv::BuiltInShadingRateKHR);
			requires_flat_input = true;
		}
		builder.addExtension("SPV_KHR_fragment_shading_rate");
		builder.addCapability(spv::CapabilityFragmentShadingRateKHR);
		break;

	case DXIL::Semantic::Barycentrics:
	case DXIL::Semantic::InternalBarycentricsNoPerspective:
	{
		if (options.khr_barycentrics_enabled)
			builder.addExtension("SPV_KHR_fragment_shader_barycentric");
		else
			builder.addExtension("SPV_NV_fragment_shader_barycentric");

		// These enums all alias.
		builder.addCapability(spv::CapabilityFragmentBarycentricKHR);
		auto builtin = semantic == DXIL::Semantic::Barycentrics ?
		               spv::BuiltInBaryCoordKHR : spv::BuiltInBaryCoordNoPerspKHR;
		builder.addDecoration(id, spv::DecorationBuiltIn, builtin);
		spirv_module.register_builtin_shader_input(id, builtin);
		break;
	}

	case DXIL::Semantic::CullPrimitive:
	{
		builder.addExtension("SPV_EXT_mesh_shader");
		builder.addCapability(spv::CapabilityMeshShadingEXT);
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInCullPrimitiveEXT);
		spirv_module.register_builtin_shader_output(id, spv::BuiltInCullPrimitiveEXT);
		break;
	}

	default:
		LOGE("Unknown DXIL semantic.\n");
		break;
	}

	// VUID-StandaloneSpirv-Flat-04744
	if (requires_flat_input && execution_model == spv::ExecutionModelFragment)
		builder.addDecoration(id, spv::DecorationFlat);
}

static bool execution_model_has_incoming_payload(spv::ExecutionModel model)
{
	return model != spv::ExecutionModelRayGenerationKHR && execution_model_is_ray_tracing(model);
}

static bool execution_model_has_hit_attribute(spv::ExecutionModel model)
{
	switch (model)
	{
	case spv::ExecutionModelAnyHitKHR:
	case spv::ExecutionModelClosestHitKHR:
	case spv::ExecutionModelIntersectionKHR:
		return true;

	default:
		return false;
	}
}

bool Converter::Impl::emit_incoming_payload()
{
	auto *func = get_entry_point_function(entry_point_meta);

	// The first argument to a RT entry point is always a pointer to payload.
	if (func->arg_end() - func->arg_begin() >= 1)
	{
		auto &arg = *func->arg_begin();
		if (!llvm::isa<llvm::PointerType>(arg.getType()))
			return false;
		auto *elem_type = arg.getType()->getPointerElementType();

		spv::StorageClass storage;
		if (execution_model == spv::ExecutionModelCallableKHR)
			storage = spv::StorageClassIncomingCallableDataKHR;
		else
			storage = spv::StorageClassIncomingRayPayloadKHR;

		// This is a POD. We'll emit that as a block containing the payload type.
		spv::Id payload_var = create_variable(storage, get_type_id(elem_type), "payload");
		handle_to_storage_class[&arg] = storage;
		rewrite_value(&arg, payload_var);
	}

	return true;
}

bool Converter::Impl::emit_hit_attribute()
{
	auto *func = get_entry_point_function(entry_point_meta);

	// The second argument to a RT entry point is always a pointer to hit attribute.
	if (func->arg_end() - func->arg_begin() >= 2)
	{
		auto args = func->arg_begin();
		++args;
		auto &arg = *args;
		if (!llvm::isa<llvm::PointerType>(arg.getType()))
			return false;
		auto *elem_type = arg.getType()->getPointerElementType();

		spv::Id hit_attribute_var = create_variable(spv::StorageClassHitAttributeKHR, get_type_id(elem_type), "hit");
		handle_to_storage_class[&arg] = spv::StorageClassHitAttributeKHR;
		rewrite_value(&arg, hit_attribute_var);
	}
	else if (execution_model == spv::ExecutionModelIntersectionKHR && llvm_hit_attribute_output_type)
	{
		auto *elem_type = llvm_hit_attribute_output_type->getPointerElementType();
		llvm_hit_attribute_output_value = create_variable(spv::StorageClassHitAttributeKHR,
		                                                  get_type_id(elem_type), "hit");
	}

	return true;
}

bool Converter::Impl::emit_global_variables()
{
	auto &module = bitcode_parser.get_module();

	if (execution_model_has_incoming_payload(execution_model))
		if (!emit_incoming_payload())
			return false;

	if (execution_model_has_hit_attribute(execution_model))
		if (!emit_hit_attribute())
			return false;

	for (auto itr = module.global_begin(); itr != module.global_end(); ++itr)
	{
		llvm::GlobalVariable &global = *itr;

		auto address_space = static_cast<DXIL::AddressSpace>(global.getType()->getAddressSpace());

		// Workarounds for DXR. RT resources tend to be declared with external linkage + structs.
		// Groupshared is also declared with external linkage, even if that is bogus.
		// Make sure we declare global internal struct LUTs at the very least ...
		if (global.getLinkage() == llvm::GlobalVariable::ExternalLinkage &&
		    address_space != DXIL::AddressSpace::GroupShared)
		{
			continue;
		}

		// Ignore @llvm.global_ctors(). Only observed once with dummy ctor.
		// It probably is not intended to work.
		if (global.getLinkage() == llvm::GlobalVariable::AppendingLinkage)
			continue;

		spv::Id pointee_type_id = 0;
		spv::Id scalar_type_id = 0;
		bool padded_composite = false;

		if (address_space == DXIL::AddressSpace::Thread &&
		    options.extended_robustness.constant_lut &&
		    global.hasInitializer() &&
		    global.isConstant())
		{
			if (auto *array_type = llvm::dyn_cast<llvm::ArrayType>(global.getType()->getPointerElementType()))
			{
				scalar_type_id = get_type_id(array_type->getArrayElementType());
				pointee_type_id = builder().makeArrayType(
					scalar_type_id, builder().makeUintConstant(array_type->getArrayNumElements() + 1), false);
				padded_composite = true;
			}
		}
		else if (address_space == DXIL::AddressSpace::GroupShared &&
		         shader_analysis.require_wmma)
		{
			// Workaround for bugged WMMA shaders.
			// The shaders rely on AMD aligning LDS size to 512 bytes.
			// This avoids overflow spilling into LDSTranspose area by mistake, which breaks some shaders.
			if (auto *array_type = llvm::dyn_cast<llvm::ArrayType>(global.getType()->getPointerElementType()))
			{
				scalar_type_id = get_type_id(array_type->getArrayElementType());
				uint32_t elem_count = array_type->getArrayNumElements();
				uint32_t alignment = (512 * 8) / array_type->getArrayElementType()->getIntegerBitWidth();
				elem_count = (elem_count + alignment - 1) & ~(alignment - 1);
				pointee_type_id = builder().makeArrayType(
					scalar_type_id, builder().makeUintConstant(elem_count), false);
			}
		}

		if (!pointee_type_id)
			pointee_type_id = get_type_id(global.getType()->getPointerElementType());

		// Happens for some global variables in DXR for some reason, benign.
		if (pointee_type_id == 0)
			continue;

		spv::Id initializer_id = 0;

		llvm::Constant *initializer = nullptr;
		if (global.hasInitializer())
			initializer = global.getInitializer();
		if (initializer && llvm::isa<llvm::UndefValue>(initializer))
			initializer = nullptr;

		if (address_space == DXIL::AddressSpace::GroupShared)
		{
			if (initializer)
			{
				// FIXME: Is this even legal DXIL?
				LOGW("Global variable address space cannot have initializer! Ignoring ...\n");
				initializer = nullptr;
			}
		}

		if (initializer)
		{
			if (padded_composite)
				initializer_id = get_padded_constant_array(pointee_type_id, initializer);
			else
				initializer_id = get_id_for_constant(initializer, 0);
		}

		spv::StorageClass storage_class = address_space == DXIL::AddressSpace::GroupShared
		                                  ? spv::StorageClassWorkgroup : spv::StorageClassPrivate;
		spv::Id var_id = create_variable_with_initializer(
			get_effective_storage_class(&global, storage_class),
			pointee_type_id, initializer_id);

		decorate_relaxed_precision(global.getType()->getPointerElementType(), var_id, false);
		rewrite_value(&global, var_id);
	}

	return true;
}

static void adjust_system_value(DXIL::Semantic &semantic, DXIL::InterpolationMode &interpolation)
{
	if (semantic == DXIL::Semantic::Barycentrics)
	{
		switch (interpolation)
		{
		case DXIL::InterpolationMode::LinearNoperspective:
			semantic = DXIL::Semantic::InternalBarycentricsNoPerspective;
			interpolation = DXIL::InterpolationMode::Linear;
			break;

		case DXIL::InterpolationMode::LinearNoperspectiveCentroid:
			semantic = DXIL::Semantic::InternalBarycentricsNoPerspective;
			interpolation = DXIL::InterpolationMode::LinearCentroid;
			break;

		case DXIL::InterpolationMode::LinearNoperspectiveSample:
			semantic = DXIL::Semantic::InternalBarycentricsNoPerspective;
			interpolation = DXIL::InterpolationMode::LinearSample;
			break;

		default:
			break;
		}
	}
}

bool Converter::Impl::emit_stage_input_variables()
{
	auto *node = entry_point_meta;
	if (!node->getOperand(2))
		return true;

	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &inputs = signature_node->getOperand(0);
	if (!inputs)
		return true;

	bool stage_arrayed_inputs = execution_model == spv::ExecutionModelGeometry ||
	                            execution_model == spv::ExecutionModelTessellationControl ||
	                            execution_model == spv::ExecutionModelTessellationEvaluation;

	uint32_t stage_input_vertices = execution_mode_meta.stage_input_num_vertex;
	if (execution_model == spv::ExecutionModelTessellationControl)
	{
		// The control point input arrays are effectively unsized. We have to give it something, so use upper bound.
		constexpr uint32_t MaxControlPoints = 32;
		stage_input_vertices = MaxControlPoints;
	}

	auto *inputs_node = llvm::dyn_cast<llvm::MDNode>(inputs);

	auto &builder = spirv_module.get_builder();

	unsigned clip_distance_count = 0;
	unsigned cull_distance_count = 0;

	for (unsigned i = 0; i < inputs_node->getNumOperands(); i++)
	{
		bool arrayed_input = stage_arrayed_inputs;
		auto *input = llvm::cast<llvm::MDNode>(inputs_node->getOperand(i));
		auto element_id = get_constant_metadata(input, 0);
		auto semantic_name = get_string_metadata(input, 1);
		auto actual_element_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(input, 2)));
		auto effective_element_type = get_effective_input_output_type(actual_element_type);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(input, 3));

		unsigned semantic_index = 0;
		if (input->getOperand(4))
			semantic_index = get_constant_metadata(llvm::cast<llvm::MDNode>(input->getOperand(4)), 0);

		auto interpolation = static_cast<DXIL::InterpolationMode>(get_constant_metadata(input, 5));
		adjust_system_value(system_value, interpolation);

		auto rows = get_constant_metadata(input, 6);
		auto cols = get_constant_metadata(input, 7);

		auto start_row = get_constant_metadata(input, 8);
		auto start_col = get_constant_metadata(input, 9);

		if (execution_model == spv::ExecutionModelTessellationEvaluation)
			patch_location_offset = std::max(patch_location_offset, start_row + rows);

		// For HS <-> DS, ignore system values.
		if (execution_model == spv::ExecutionModelTessellationEvaluation)
			system_value = DXIL::Semantic::User;

		spv::Id type_id = get_type_id(effective_element_type, rows, cols);
		if (system_value == DXIL::Semantic::Position)
		{
			type_id = get_type_id(effective_element_type, rows, 4);
		}
		else if (system_value == DXIL::Semantic::IsFrontFace)
		{
			// Need to cast this to uint when loading the semantic input.
			type_id = builder.makeBoolType();
		}
		else if (system_value == DXIL::Semantic::ClipDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			input_clip_cull_meta[element_id] = { clip_distance_count, cols, spv::BuiltInClipDistance };
			input_elements_meta[element_id] = { 0, actual_element_type, 0 };
			clip_distance_count += rows * cols;
			continue;
		}
		else if (system_value == DXIL::Semantic::CullDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			input_clip_cull_meta[element_id] = { cull_distance_count, cols, spv::BuiltInCullDistance };
			input_elements_meta[element_id] = { 0, actual_element_type, 0 };
			cull_distance_count += rows * cols;
			continue;
		}
		else if (system_value == DXIL::Semantic::PrimitiveID ||
		         system_value == DXIL::Semantic::ShadingRate)
		{
			arrayed_input = false;
		}

		bool per_vertex = llvm_attribute_at_vertex_indices.count(element_id) != 0;

		if (arrayed_input)
		{
			type_id =
			    builder.makeArrayType(type_id, builder.makeUintConstant(stage_input_vertices), 0);
		}
		else if (per_vertex)
		{
			// TODO: Does this change for barycentrics with lines?
			type_id = builder.makeArrayType(type_id, builder.makeUintConstant(3), 0);
			// Default. We should emit PerVertex instead of flat. Linear here is the default, don't emit anything.
			interpolation = DXIL::InterpolationMode::Linear;
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += dxil_spv::to_string(semantic_index);
		}

		spv::Id variable_id = create_variable(spv::StorageClassInput, type_id, variable_name.c_str());
		input_elements_meta[element_id] = { variable_id, actual_element_type, system_value != DXIL::Semantic::User ? start_row : 0 };

		if (per_vertex)
		{
			if (options.khr_barycentrics_enabled)
				builder.addExtension("SPV_KHR_fragment_shader_barycentric");
			else
				builder.addExtension("SPV_NV_fragment_shader_barycentric");
			builder.addCapability(spv::CapabilityFragmentBarycentricKHR);
			builder.addDecoration(variable_id, spv::DecorationPerVertexKHR);
		}

		if (effective_element_type != actual_element_type && component_type_is_16bit(actual_element_type))
			builder.addDecoration(variable_id, spv::DecorationRelaxedPrecision);

		if (system_value != DXIL::Semantic::User)
		{
			emit_builtin_decoration(variable_id, system_value, spv::StorageClassInput);
			if (execution_model == spv::ExecutionModelFragment)
				emit_builtin_interpolation_decorations(variable_id, system_value, interpolation);
		}
		else
		{
			if (execution_model == spv::ExecutionModelFragment)
				emit_interpolation_decorations(variable_id, interpolation);

			VulkanStageIO vk_input = { start_row, start_col };

			if (resource_mapping_iface)
			{
				D3DStageIO d3d_input = { semantic_name.c_str(), semantic_index, start_row, rows };

				if (execution_model == spv::ExecutionModelVertex)
				{
					if (!resource_mapping_iface->remap_vertex_input(d3d_input, vk_input))
						return false;
				}

				if (!resource_mapping_iface->remap_stage_input(d3d_input, vk_input))
					return false;
			}

			builder.addDecoration(variable_id, spv::DecorationLocation, vk_input.location);

			if (execution_model != spv::ExecutionModelVertex && vk_input.component != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, vk_input.component);

			if (execution_model == spv::ExecutionModelFragment && (vk_input.flags & STAGE_IO_PER_PRIMITIVE))
			{
				builder.addDecoration(variable_id, spv::DecorationPerPrimitiveEXT);
				builder.addExtension("SPV_EXT_mesh_shader");
				builder.addCapability(spv::CapabilityMeshShadingEXT);
			}
		}
	}

	if (clip_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, clip_distance_count, 1, true);
		if (stage_arrayed_inputs)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(stage_input_vertices, false), 0);
		}

		spv::Id variable_id = create_variable(spv::StorageClassInput, type_id);
		emit_builtin_decoration(variable_id, DXIL::Semantic::ClipDistance, spv::StorageClassInput);
		spirv_module.register_builtin_shader_input(variable_id, spv::BuiltInClipDistance);
	}

	if (cull_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, cull_distance_count, 1, true);
		if (stage_arrayed_inputs)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(stage_input_vertices, false), 0);
		}

		spv::Id variable_id = create_variable(spv::StorageClassInput, type_id);
		emit_builtin_decoration(variable_id, DXIL::Semantic::CullDistance, spv::StorageClassInput);
		spirv_module.register_builtin_shader_input(variable_id, spv::BuiltInCullDistance);
	}

	return true;
}

spv::Id Converter::Impl::build_sampled_image(spv::Id image_id, spv::Id sampler_id, bool comparison)
{
	bool is_non_uniform =
	    handle_to_resource_meta[image_id].non_uniform || handle_to_resource_meta[sampler_id].non_uniform;

	auto itr = std::find_if(combined_image_sampler_cache.begin(), combined_image_sampler_cache.end(),
	                        [&](const CombinedImageSampler &combined) {
		                        return combined.image_id == image_id && combined.sampler_id == sampler_id &&
		                               combined.non_uniform == is_non_uniform;
	                        });

	if (itr != combined_image_sampler_cache.end())
		return itr->combined_id;

	auto &builder = spirv_module.get_builder();
	spv::Id image_type_id = get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);
	bool multisampled = builder.isMultisampledImageType(image_type_id);
	spv::Id sampled_format = builder.getImageComponentType(image_type_id);

	image_type_id =
	    builder.makeImageType(sampled_format, dim, comparison, arrayed, multisampled, 1, spv::ImageFormatUnknown);

	Operation *op = allocate(spv::OpSampledImage, builder.makeSampledImageType(image_type_id));
	op->add_ids({ image_id, sampler_id });
	add(op);

	if (is_non_uniform)
	{
		builder.addDecoration(op->id, spv::DecorationNonUniformEXT);
		op->flags |= Operation::SinkableBit;
	}

	combined_image_sampler_cache.push_back({ image_id, sampler_id, op->id, is_non_uniform });
	return op->id;
}

spv::Id Converter::Impl::build_vector_type(spv::Id element_type, unsigned count)
{
	auto &builder = spirv_module.get_builder();
	if (count == 1)
		return element_type;
	else
		return builder.makeVectorType(element_type, count);
}

spv::Id Converter::Impl::build_vector(spv::Id element_type, const spv::Id *elements, unsigned count)
{
	if (count == 1)
		return elements[0];

	auto &builder = spirv_module.get_builder();

	Operation *op = allocate(spv::OpCompositeConstruct, builder.makeVectorType(element_type, count));
	for (unsigned i = 0; i < count; i++)
		op->add_id(elements[i]);

	add(op);
	return op->id;
}

spv::Id Converter::Impl::build_constant_vector(spv::Id element_type, const spv::Id *elements, unsigned count)
{
	if (count == 1)
		return elements[0];

	auto &builder = spirv_module.get_builder();
	return builder.makeCompositeConstant(builder.makeVectorType(element_type, count), { elements, elements + count });
}

spv::Id Converter::Impl::build_splat_constant_vector(spv::Id element_type, spv::Id value, unsigned count)
{
	spv::Id ids[4];
	for (unsigned i = 0; i < count; i++)
		ids[i] = value;
	return build_constant_vector(element_type, ids, count);
}

spv::Id Converter::Impl::build_offset(spv::Id value, unsigned offset)
{
	if (offset == 0)
		return value;

	auto &builder = spirv_module.get_builder();

	Operation *op = allocate(spv::OpIAdd, builder.makeUintType(32));
	op->add_ids({ value, builder.makeUintConstant(offset) });

	add(op);
	return op->id;
}

void Converter::Impl::repack_sparse_feedback(DXIL::ComponentType component_type, unsigned num_components, const llvm::Value *value,
                                             const llvm::Type *target_type, spv::Id override_value)
{
	auto *code_id = allocate(spv::OpCompositeExtract, builder().makeUintType(32));
	code_id->add_id(get_id_for_value(value));
	code_id->add_literal(0);
	add(code_id);

	auto effective_component_type = get_effective_typed_resource_type(component_type);
	spv::Id texel_id;

	if (override_value)
	{
		texel_id = override_value;
	}
	else
	{
		auto *texel = allocate(spv::OpCompositeExtract, get_type_id(effective_component_type, 1, num_components));
		texel->add_id(get_id_for_value(value));
		texel->add_literal(1);
		add(texel);
		texel_id = texel->id;
	}

	fixup_load_type_typed(component_type, num_components, texel_id, target_type);

	spv::Id components[5];

	if (num_components > 1)
	{
		for (unsigned i = 0; i < num_components; i++)
		{
			auto *extract_op = allocate(spv::OpCompositeExtract, get_type_id(component_type, 1, 1));
			extract_op->add_id(texel_id);
			extract_op->add_literal(i);
			add(extract_op);
			components[i] = extract_op->id;
		}
	}
	else
	{
		for (auto &comp : components)
			comp = texel_id;
		num_components = 4;
	}

	components[num_components] = code_id->id;

	auto *repack_op = allocate(spv::OpCompositeConstruct, get_type_id(value->getType()));
	for (auto &comp : components)
		repack_op->add_id(comp);
	add(repack_op);
	rewrite_value(value, repack_op->id);
}

bool Converter::Impl::support_native_fp16_operations() const
{
	return execution_mode_meta.native_16bit_operations || options.min_precision_prefer_native_16bit;
}

spv::Id Converter::Impl::build_value_cast(spv::Id value_id,
                                          DXIL::ComponentType input_type,
                                          DXIL::ComponentType output_type,
                                          unsigned components)
{
	// This path only hits for bitcasts or 16-bit <-> 32-bit casts.
	bool output_16bit = component_type_is_16bit(output_type);
	bool input_16bit = component_type_is_16bit(input_type);

	spv::Op opcode = spv::OpBitcast;

	if (output_16bit != input_16bit)
	{
		switch (input_type)
		{
		case DXIL::ComponentType::F16:
		case DXIL::ComponentType::F32:
			opcode = spv::OpFConvert;
			break;

		case DXIL::ComponentType::I16:
		case DXIL::ComponentType::I32:
			opcode = spv::OpSConvert;
			break;

		case DXIL::ComponentType::U16:
		case DXIL::ComponentType::U32:
			opcode = spv::OpUConvert;
			break;

		default:
			break;
		}

		// OpUConvert is not allowed on integer outputs.
		// We also need SConvert if we're doing 16 -> I32,
		// since what we actually want is I16 -> I32.
		switch (output_type)
		{
		case DXIL::ComponentType::I16:
		case DXIL::ComponentType::I32:
			opcode = spv::OpSConvert;
			break;

		default:
			break;
		}
	}

	Operation *op = allocate(opcode, get_type_id(output_type, 1, components));
	op->add_id(value_id);
	add(op);
	return op->id;
}

void Converter::Impl::fixup_load_type_io(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value)
{
	auto output_component_type = component_type;
	auto input_component_type = component_type;

	bool promote_fp16 = input_component_type == DXIL::ComponentType::F16 && !support_native_fp16_operations();

	if (!options.storage_16bit_input_output || promote_fp16)
		input_component_type = convert_16bit_component_to_32bit(input_component_type);
	if (promote_fp16)
		output_component_type = convert_16bit_component_to_32bit(output_component_type);

	output_component_type = convert_component_to_unsigned(output_component_type);

	if (output_component_type != input_component_type)
	{
		rewrite_value(value, build_value_cast(get_id_for_value(value), input_component_type,
		                                      output_component_type, components));
	}
}

void Converter::Impl::fixup_load_type_atomic(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value)
{
	auto output_component_type = component_type;
	auto input_component_type = component_type;

	output_component_type = convert_component_to_unsigned(output_component_type);

	if (output_component_type != input_component_type)
	{
		rewrite_value(value, build_value_cast(get_id_for_value(value), input_component_type,
		                                      output_component_type, components));
	}
}

void Converter::Impl::fixup_load_type_typed(DXIL::ComponentType &component_type, unsigned components, spv::Id &value_id,
                                            const llvm::Type *target_type)
{
	auto output_component_type = component_type;
	auto input_component_type = get_effective_typed_resource_type(component_type);

	if (output_component_type == DXIL::ComponentType::U64 && target_type->getIntegerBitWidth() == 32)
	{
		// If the component type is U64 it's used for atomics, but load/store interface is still 32-bit.
		// Bit-cast rather than value cast.
		auto *bitcast_op = allocate(spv::OpCompositeExtract, builder().makeUintType(64));
		bitcast_op->add_id(value_id);
		bitcast_op->add_literal(0);
		add(bitcast_op);

		auto *u32_cast_op = allocate(spv::OpBitcast, builder().makeVectorType(builder().makeUintType(32), 2));
		u32_cast_op->add_id(bitcast_op->id);
		add(u32_cast_op);
		output_component_type = DXIL::ComponentType::U32;

		if (components > 2)
		{
			auto *composite_op =
				allocate(spv::OpCompositeConstruct,
				         builder().makeVectorType(builder().makeUintType(32), components));
			composite_op->add_id(u32_cast_op->id);
			for (unsigned i = 2; i < components; i++)
				composite_op->add_id(builder().makeUintConstant(0));
			add(composite_op);
			value_id = composite_op->id;
		}
		else if (components == 1)
		{
			auto *extract_op = allocate(spv::OpCompositeExtract, builder().makeUintType(32));
			extract_op->add_id(u32_cast_op->id);
			extract_op->add_literal(0);
			add(extract_op);
			value_id = extract_op->id;
		}
		else
			value_id = u32_cast_op->id;
	}
	else
	{
		if (output_component_type == DXIL::ComponentType::F16 && !support_native_fp16_operations())
			output_component_type = convert_16bit_component_to_32bit(output_component_type);
		else if (target_type->getTypeID() == llvm::Type::TypeID::FloatTyID)
		{
			// Only convert if we actually want half here.
			// Certain operations always return float even if the resource type is half for some silly reason.
			output_component_type = DXIL::ComponentType::F32;
		}

		output_component_type = convert_component_to_unsigned(output_component_type);

		if (output_component_type != input_component_type)
			value_id = build_value_cast(value_id, input_component_type, output_component_type, components);
		component_type = output_component_type;
	}
}

void Converter::Impl::fixup_load_type_typed(DXIL::ComponentType component_type, unsigned components,
                                            const llvm::Value *value, const llvm::Type *target_type)
{
	spv::Id value_id = get_id_for_value(value);
	spv::Id new_value_id = value_id;
	fixup_load_type_typed(component_type, components, new_value_id, target_type);
	if (new_value_id != value_id)
		rewrite_value(value, new_value_id);
}

spv::Id Converter::Impl::fixup_store_type_io(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	auto output_component_type = component_type;
	auto input_component_type = component_type;

	if (!options.storage_16bit_input_output ||
	    (output_component_type == DXIL::ComponentType::F16 && !support_native_fp16_operations()))
	{
		output_component_type = convert_16bit_component_to_32bit(output_component_type);
	}

	if (input_component_type == DXIL::ComponentType::F16 && !support_native_fp16_operations())
		input_component_type = convert_16bit_component_to_32bit(input_component_type);

	input_component_type = convert_component_to_unsigned(input_component_type);

	if (output_component_type != input_component_type)
		value = build_value_cast(value, input_component_type, output_component_type, components);
	return value;
}

spv::Id Converter::Impl::fixup_store_type_atomic(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	auto output_component_type = component_type;
	auto input_component_type = component_type;

	input_component_type = convert_component_to_unsigned(input_component_type);

	if (output_component_type != input_component_type)
		value = build_value_cast(value, input_component_type, output_component_type, components);
	return value;
}

spv::Id Converter::Impl::fixup_store_type_typed(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	if (component_type == DXIL::ComponentType::U64)
	{
		// If the component type is U64 it's used for atomics, but load/store interface is still 32-bit.
		// Bit-cast rather than value cast.
		spv::Id u64_ids[4] = {};
		for (unsigned i = 0; i < components / 2; i++)
		{
			auto *shuffle_op = allocate(spv::OpVectorShuffle, builder().makeVectorType(builder().makeUintType(32), 2));
			shuffle_op->add_id(value);
			shuffle_op->add_id(value);
			shuffle_op->add_literal(2 * i + 0);
			shuffle_op->add_literal(2 * i + 1);
			add(shuffle_op);

			auto *cast_op = allocate(spv::OpBitcast, builder().makeUintType(64));
			cast_op->add_id(shuffle_op->id);
			add(cast_op);
			u64_ids[i] = cast_op->id;
		}

		for (unsigned i = components / 2; i < components; i++)
			u64_ids[i] = builder().makeUint64Constant(0);

		value = build_vector(builder().makeUintType(64), u64_ids, components);
	}
	else
	{
		auto output_component_type = get_effective_typed_resource_type(component_type);
		auto input_component_type = component_type;

		if (input_component_type == DXIL::ComponentType::F16 && !support_native_fp16_operations())
			input_component_type = convert_16bit_component_to_32bit(input_component_type);
		input_component_type = convert_component_to_unsigned(input_component_type);

		if (output_component_type != input_component_type)
			value = build_value_cast(value, input_component_type, output_component_type, components);
	}

	return value;
}

bool Converter::Impl::emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction)
{
	unsigned count = instruction.getNumIncomingValues();
	spv::Id override_type = 0;

	for (uint32_t i = 0; i < instruction.getNumIncomingValues() && override_type == 0; i++)
	{
		auto *incoming = instruction.getIncomingValue(i);
		auto itr = ags.coopmat_component_mapping.find(incoming);
		if (itr != ags.coopmat_component_mapping.end())
		{
			override_type = itr->second.type_id;
			ags.coopmat_component_mapping[&instruction] = { override_type, itr->second.component };
			if (itr->second.component != 0)
			{
				// Dummy value, will not actually emit a PHI. Just need to forward the mapping.
				return true;
			}
		}
	}

	if (count == 1)
	{
		// Degenerate PHI. Seems to happen in some bizarre cases with lcssa passes?
		auto *value = instruction.getIncomingValue(0);
		rewrite_value(&instruction, get_id_for_value(value));

		// This PHI node can actually be pointer or descriptor for whatever reason,
		// so inherit any such mappings.
		{
			auto itr = handle_to_storage_class.find(value);
			if (itr != handle_to_storage_class.end())
				handle_to_storage_class[&instruction] = itr->second;
		}

		{
			auto itr = handle_to_root_member_offset.find(value);
			if (itr != handle_to_root_member_offset.end())
				handle_to_root_member_offset[&instruction] = itr->second;
		}
	}
	else
	{
		PHI phi;
		phi.id = get_id_for_value(&instruction);
		phi.type_id = override_type ? override_type : get_type_id(instruction.getType());
		phi.relaxed = type_can_relax_precision(instruction.getType(), false);

		for (unsigned i = 0; i < count; i++)
		{
			IncomingValue incoming = {};
			auto bb_itr = bb_map.find(instruction.getIncomingBlock(i));

			// If the block was statically eliminated, it might not exist.
			if (bb_itr != bb_map.end())
			{
				incoming.block = bb_itr->second->node;
				auto *value = instruction.getIncomingValue(i);
				incoming.id = get_id_for_value(value);
				phi.incoming.push_back(incoming);
			}
		}

		if (phi.incoming.empty())
		{
			LOGE("PHI instruction has zero incoming blocks.\n");
			return false;
		}

		if (phi.incoming.size() > 1)
			block->ir.phi.push_back(std::move(phi));
		else
			rewrite_value(&instruction, phi.incoming.front().id);
	}

	return true;
}

static bool instruction_has_side_effects(const llvm::Instruction &instruction)
{
	if (llvm::isa<llvm::StoreInst>(&instruction) ||
	    llvm::isa<llvm::AtomicCmpXchgInst>(&instruction) ||
	    llvm::isa<llvm::AtomicRMWInst>(&instruction))
	{
		return true;
	}

	if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&instruction))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
			return dxil_instruction_has_side_effects(call_inst);
		else
			return true;
	}

	return false;
}

bool Converter::Impl::emit_instruction(CFGNode *block, const llvm::Instruction &instruction)
{
	if (instruction.isTerminator())
		return true;

	// We really shouldn't have to do this, but DXC misses some dead SSA ops.
	// Helps sanitize repro suite output in some cases.
	if (options.eliminate_dead_code &&
	    !instruction_has_side_effects(instruction) &&
	    llvm_used_ssa_values.count(&instruction) == 0)
	{
		return true;
	}

	current_block = &block->ir.operations;

	if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&instruction))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
		{
			return emit_dxil_instruction(*this, call_inst);
		}
		else if (strncmp(called_function->getName().data(), "llvm.", 5) == 0)
		{
			// lib_6_6 sometimes emits llvm.lifetime.begin/end for some bizarre reason.
			// Just ignore ...
			return true;
		}
		else
		{
			LOGE("Normal function call currently unsupported ...\n");
			return false;
		}
	}
	else if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(&instruction))
		return emit_phi_instruction(block, *phi_inst);
	else
		return emit_llvm_instruction(*this, instruction);

	current_block = nullptr;
	return false;
}

bool Converter::Impl::emit_execution_modes_node_output(llvm::MDNode *output)
{
	NodeOutputMeta output_meta = {};

	bool is_rw_sharing;
	output_meta.payload_stride = node_parse_payload_stride(output, is_rw_sharing);
	output_meta.spec_constant_node_index = builder().makeUintConstant(0, true);
	builder().addDecoration(output_meta.spec_constant_node_index, spv::DecorationSpecId,
	                        int(NodeSpecIdOutputBase + node_outputs.size()));

	uint32_t num_ops = output->getNumOperands();
	for (uint32_t i = 0; i < num_ops; i += 2)
	{
		auto tag = DXIL::NodeMetadataTag(get_constant_metadata(output, i));
		if (tag == DXIL::NodeMetadataTag::NodeOutputID)
		{
			auto *output_node = llvm::cast<llvm::MDNode>(output->getOperand(i + 1));
			String name = get_string_metadata(output_node, 0);
			builder().addName(output_meta.spec_constant_node_index, name.c_str());

			// FIXME: This is probably not accurate for arrayed nodes.
			// Can recursive nodes be arrayed? Seems very spicy ...
			output_meta.is_recursive =
				name == node_input.node_id &&
				node_input.node_array_index == get_constant_metadata(output_node, 1);
		}
	}

	node_outputs.push_back(output_meta);
	return true;
}

NodeDispatchGrid Converter::Impl::node_parse_dispatch_grid(llvm::MDNode *node_meta)
{
	uint32_t num_ops = node_meta->getNumOperands();
	for (uint32_t i = 0; i < num_ops; i += 2)
	{
		auto tag = DXIL::NodeMetadataTag(get_constant_metadata(node_meta, i));
		if (tag == DXIL::NodeMetadataTag::NodeRecordType)
		{
			auto *node_record_type = llvm::cast<llvm::MDNode>(node_meta->getOperand(i + 1));
			for (uint32_t j = 0; j < node_record_type->getNumOperands(); j += 2)
			{
				if (get_constant_metadata(node_record_type, j) == 1)
				{
					auto *dispatch_info = llvm::cast<llvm::MDNode>(node_record_type->getOperand(j + 1));
					uint32_t byte_offset = get_constant_metadata(dispatch_info, 0);
					auto component_type = DXIL::ComponentType(get_constant_metadata(dispatch_info, 1));
					uint32_t num_components = get_constant_metadata(dispatch_info, 2);
					return { byte_offset, component_type, num_components };
				}
			}
		}
	}

	return {};
}

uint32_t Converter::Impl::node_parse_payload_stride(llvm::MDNode *node_meta, bool &is_rw_sharing)
{
	uint32_t num_ops = node_meta->getNumOperands();
	uint32_t payload_stride = 0;
	is_rw_sharing = false;

	for (uint32_t i = 0; i < num_ops; i += 2)
	{
		auto tag = DXIL::NodeMetadataTag(get_constant_metadata(node_meta, i));
		if (tag == DXIL::NodeMetadataTag::NodeIOFlags)
		{
			uint32_t node_io_flags = get_constant_metadata(node_meta, i + 1);
			if ((node_io_flags & DXIL::NodeIOEmptyRecordBit) != 0)
				return 0;
			if ((node_io_flags & DXIL::NodeIOTrackRWInputSharingBit) != 0)
				is_rw_sharing = true;
		}
		else if (tag == DXIL::NodeMetadataTag::NodeRecordType)
		{
			auto *node_record_type = llvm::cast<llvm::MDNode>(node_meta->getOperand(i + 1));
			for (uint32_t j = 0; j < node_record_type->getNumOperands(); j += 2)
			{
				if (get_constant_metadata(node_record_type, j) == 0)
				{
					uint32_t input_node_size = get_constant_metadata(node_record_type, j + 1);
					payload_stride = input_node_size;
				}
			}
		}
	}

	if (is_rw_sharing)
	{
		// DXIL metadata does not account for the implied u32 used for group sharing.
		// In case the last member is u16, align to u32.
		payload_stride = (payload_stride + 3u) & ~3u;
		// Allocate space for magic word.
		payload_stride += 4;
	}

	return payload_stride;
}

bool Converter::Impl::emit_execution_modes_node_input()
{
	spv::Id u32_type_id = builder().makeUintType(32);
	spv::Id uvec2_type_id = builder().makeVectorType(u32_type_id, 2);
	spv::Id u64_type_id = builder().makeUintType(64);

	if (node_input.payload_stride)
	{
		node_input.private_bda_var_id = create_variable(
			spv::StorageClassPrivate, u64_type_id, "NodeInputPayloadBDA");
		node_input.private_stride_var_id = create_variable(
			spv::StorageClassPrivate, u32_type_id, "NodeInputStride");
	}

	// We have to rewrite global IDs. Local invocation should remain intact.
	spv::Id uvec3_type = builder().makeVectorType(u32_type_id, 3);
	spv::Id workgroup_id = create_variable(spv::StorageClassPrivate, uvec3_type, "WorkgroupID");
	spv::Id global_invocation_id = create_variable(spv::StorageClassPrivate, uvec3_type, "GlobalInvocationID");
	spirv_module.register_builtin_shader_input(workgroup_id, spv::BuiltInWorkgroupId);
	spirv_module.register_builtin_shader_input(global_invocation_id, spv::BuiltInGlobalInvocationId);

	// Emit binding model.
	// Push constants are our only option.
	if (!options.inline_ubo_enable)
	{
		LOGE("When compiling for nodes, inline UBO path must be enabled for root parameters.\n");
		return false;
	}

	node_input.shader_record_block_type_id = emit_shader_record_buffer_block_type(true);
	spv::Id ptr_shader_record_block_type_id = 0;
	if (node_input.shader_record_block_type_id)
	{
		ptr_shader_record_block_type_id =
			builder().makePointer(spv::StorageClassPhysicalStorageBuffer,
			                      node_input.shader_record_block_type_id);
	}
	else
	{
		// Dummy type
		ptr_shader_record_block_type_id = builder().makeVectorType(builder().makeUintType(32), 2);
	}

	// Declare the ABI for dispatching a node. This will change depending on the dispatch mode,
	// and style of execution (indirect pull or array).

	spv::Id u32_array_type_id = builder().makeRuntimeArray(u32_type_id);
	builder().addDecoration(u32_array_type_id, spv::DecorationArrayStride, 4);

	spv::Id u32_struct_type_id = builder().makeStructType({ u32_type_id }, "NodeReadonlyU32Ptr");
	builder().addDecoration(u32_struct_type_id, spv::DecorationBlock);
	builder().addMemberDecoration(u32_struct_type_id, 0, spv::DecorationOffset, 0);
	builder().addMemberDecoration(u32_struct_type_id, 0, spv::DecorationNonWritable);
	builder().addMemberName(u32_struct_type_id, 0, "value");
	spv::Id u32_ptr_type_id = builder().makePointer(spv::StorageClassPhysicalStorageBuffer, u32_struct_type_id);

	spv::Id u32_array_struct_type_id = builder().makeStructType({ u32_array_type_id }, "NodeReadonlyU32ArrayPtr");
	builder().addDecoration(u32_array_struct_type_id, spv::DecorationBlock);
	builder().addMemberDecoration(u32_array_struct_type_id, 0, spv::DecorationOffset, 0);
	builder().addMemberDecoration(u32_array_struct_type_id, 0, spv::DecorationNonWritable);
	builder().addMemberName(u32_array_struct_type_id, 0, "offsets");
	spv::Id u32_array_ptr_type_id = builder().makePointer(spv::StorageClassPhysicalStorageBuffer, u32_array_struct_type_id);

	const Vector<spv::Id> members = {
		u64_type_id,
		u32_ptr_type_id,
		u32_ptr_type_id,
		uvec2_type_id,
		u64_type_id,
		u64_type_id,
		ptr_shader_record_block_type_id,
		u32_type_id,
		u32_type_id,
	};

	spv::Id type_id = builder().makeStructType(members, "NodeDispatchRegisters");
	builder().addMemberDecoration(type_id, NodePayloadBDA, spv::DecorationOffset, 0);
	builder().addMemberDecoration(type_id, NodeLinearOffsetBDA, spv::DecorationOffset, 8);
	builder().addMemberDecoration(type_id, NodeEndNodesBDA, spv::DecorationOffset, 16);
	builder().addMemberDecoration(type_id, NodePayloadStrideOrOffsetsBDA, spv::DecorationOffset, 24);
	builder().addMemberDecoration(type_id, NodePayloadOutputBDA, spv::DecorationOffset, 32);
	builder().addMemberDecoration(type_id, NodePayloadOutputAtomicBDA, spv::DecorationOffset, 40);
	builder().addMemberDecoration(type_id, NodeLocalRootSignatureBDA, spv::DecorationOffset, 48);
	builder().addMemberDecoration(type_id, NodePayloadOutputOffset, spv::DecorationOffset, 56);
	builder().addMemberDecoration(type_id, NodeRemainingRecursionLevels, spv::DecorationOffset, 60);

	// For linear node layout (entry point).
	// Node payload is found at PayloadLinearBDA + NodeIndex * PayloadStride.
	builder().addMemberName(type_id, NodePayloadBDA, "PayloadLinearBDA");
	// With packed workgroup layout, need to apply an offset.
	builder().addMemberName(type_id, NodeLinearOffsetBDA, "NodeLinearOffsetBDA");
	// For thread and coalesce, need to know total number of threads to mask execution on edge.
	builder().addMemberName(type_id, NodeEndNodesBDA, "NodeEndNodesBDA");
	builder().addMemberName(type_id, NodePayloadStrideOrOffsetsBDA, "NodePayloadStrideOrOffsetsBDA");
	builder().addMemberName(type_id, NodePayloadOutputBDA, "NodePayloadOutputBDA");
	builder().addMemberName(type_id, NodePayloadOutputAtomicBDA, "NodePayloadOutputAtomicBDA");
	builder().addMemberName(type_id, NodeLocalRootSignatureBDA, "NodeLocalRootSignatureBDA");
	// For broadcast nodes. Need to instance multiple times.
	// Becomes WorkGroupID and affects GlobalInvocationID.
	builder().addMemberName(type_id, NodePayloadOutputOffset, "NodePayloadOutputOffset");
	builder().addMemberName(type_id, NodeRemainingRecursionLevels, "NodeRemainingRecursionLevels");
	builder().addDecoration(type_id, spv::DecorationBlock);
	node_input.node_dispatch_push_id =
	    create_variable(spv::StorageClassPushConstant, type_id, "NodeDispatch");
	builder().addDecoration(node_input.node_dispatch_push_id, spv::DecorationRestrictPointer);

	node_input.private_coalesce_offset_id =
		create_variable(spv::StorageClassPrivate, u32_type_id, "NodeCoalesceOffset");
	node_input.private_coalesce_count_id =
		create_variable(spv::StorageClassPrivate, u32_type_id, "NodeCoalesceCount");

	node_input.u32_ptr_type_id = u32_ptr_type_id;
	node_input.u32_array_ptr_type_id = u32_array_ptr_type_id;

	spv::Id u64_struct_type_id = builder().makeStructType({ u64_type_id }, "NodeReadonlyU64Ptr");
	builder().addDecoration(u64_struct_type_id, spv::DecorationBlock);
	builder().addMemberDecoration(u64_struct_type_id, 0, spv::DecorationOffset, 0);
	builder().addMemberDecoration(u64_struct_type_id, 0, spv::DecorationNonWritable);
	builder().addMemberName(u64_struct_type_id, 0, "value");
	node_input.u64_ptr_type_id = builder().makePointer(spv::StorageClassPhysicalStorageBuffer, u64_struct_type_id);

	return true;
}

NodeOutputData Converter::Impl::get_node_output(llvm::MDNode *output)
{
	NodeOutputData data = {};

	uint32_t num_ops = output->getNumOperands();
	for (uint32_t i = 0; i < num_ops; i += 2)
	{
		auto tag = DXIL::NodeMetadataTag(get_constant_metadata(output, i));
		if (tag == DXIL::NodeMetadataTag::NodeOutputID)
		{
			auto *output_node = llvm::cast<llvm::MDNode>(output->getOperand(i + 1));
			data.node_id = get_string_metadata(output_node, 0);
			data.node_array_index = get_constant_metadata(output_node, 1);
		}
		else if (tag == DXIL::NodeMetadataTag::NodeAllowSparseNodes)
			data.sparse_array = get_constant_metadata(output, i + 1) != 0;
		else if (tag == DXIL::NodeMetadataTag::NodeOutputArraySize)
			data.node_array_size = get_constant_metadata(output, i + 1);
		else if (tag == DXIL::NodeMetadataTag::NodeMaxRecords)
			data.max_records = get_constant_metadata(output, i + 1);
	}

	return data;
}

NodeInputData Converter::Impl::get_node_input(llvm::MDNode *meta)
{
	NodeInputData node = {};

	auto *launch_type_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeLaunchType);
	if (!launch_type_node)
		return {};

	node.launch_type = DXIL::NodeLaunchType(
	    llvm::cast<llvm::ConstantAsMetadata>(*launch_type_node)->getValue()->getUniqueInteger().getZExtValue());

	if (node.launch_type == DXIL::NodeLaunchType::Invalid)
		return {};

	auto *is_program_entry_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeIsProgramEntry);
	if (is_program_entry_node)
	{
		node.is_program_entry =
		    llvm::cast<llvm::ConstantAsMetadata>(*is_program_entry_node)->getValue()->getUniqueInteger().getZExtValue() != 0;
	}

	node.is_indirect_bda_stride_program_entry_spec_id = NodeSpecIdIndirectPayloadStride;
	node.is_entry_point_spec_id = NodeSpecIdIsEntryPoint;

	if (node.launch_type == DXIL::NodeLaunchType::Broadcasting)
	{
		node.dispatch_grid_is_upper_bound_spec_id = NodeSpecIdDispatchGridIsUpperBound;
		node.is_static_broadcast_node_spec_id = NodeSpecIdIsStaticBroadcastNode;
		node.max_broadcast_grid_spec_id[0] = NodeSpecIdMaxBroadcastGridX;
		node.max_broadcast_grid_spec_id[1] = NodeSpecIdMaxBroadcastGridY;
		node.max_broadcast_grid_spec_id[2] = NodeSpecIdMaxBroadcastGridZ;
	}
	else
	{
		node.dispatch_grid_is_upper_bound_spec_id = UINT32_MAX;
		node.is_static_broadcast_node_spec_id = UINT32_MAX;
		for (auto &spec_id : node.max_broadcast_grid_spec_id)
			spec_id = UINT32_MAX;
	}

	auto *recursion_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeMaxRecursionDepth);
	if (recursion_node)
	{
		node.recursion_factor =
			llvm::cast<llvm::ConstantAsMetadata>(*recursion_node)->getValue()->getUniqueInteger().getZExtValue();
	}

	if (node.launch_type == DXIL::NodeLaunchType::Broadcasting)
	{
		auto *max_grid = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeMaxDispatchGrid);
		const llvm::MDOperand *fixed_grid;

		if (max_grid)
		{
			node.dispatch_grid_is_upper_bound = true;
			fixed_grid = max_grid;
		}
		else
			fixed_grid = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeDispatchGrid);

		if (!fixed_grid)
			return {};

		for (uint32_t i = 0; i < 3; i++)
			node.broadcast_grid[i] = get_constant_metadata(llvm::cast<llvm::MDNode>(*fixed_grid), i);
	}

	node.thread_group_size_spec_id[0] = NodeSpecIdGroupSizeX;
	node.thread_group_size_spec_id[1] = NodeSpecIdGroupSizeY;
	node.thread_group_size_spec_id[2] = NodeSpecIdGroupSizeZ;

	auto *name_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeID);

	if (name_node)
	{
		auto *name_id = llvm::cast<llvm::MDNode>(*name_node);
		node.node_id = get_string_metadata(name_id, 0);
		node.node_array_index = get_constant_metadata(name_id, 1);
	}

	auto *inputs_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeInputs);

	llvm::MDNode *input = nullptr;
	if (inputs_node)
	{
		auto *inputs = llvm::cast<llvm::MDNode>(*inputs_node);
		// Current spec only allows one input node.
		if (inputs->getNumOperands() != 1)
			return {};
		input = llvm::cast<llvm::MDNode>(inputs->getOperand(0));
	}

	if (input)
	{
		uint32_t num_ops = input->getNumOperands();

		node.grid_buffer = node_parse_dispatch_grid(input);
		node.payload_stride = node_parse_payload_stride(input, node.node_track_rw_input_sharing);

		for (uint32_t i = 0; i < num_ops; i += 2)
		{
			auto tag = DXIL::NodeMetadataTag(get_constant_metadata(input, i));
			if (tag == DXIL::NodeMetadataTag::NodeMaxRecords)
				node.coalesce_factor = get_constant_metadata(input, i + 1);
		}

        // We seem to need a sensible default.
        if (node.coalesce_factor == 0 && node.launch_type == DXIL::NodeLaunchType::Coalescing)
            node.coalesce_factor = 1;
	}

	auto *share_input_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeShareInputOf);
	if (share_input_node)
	{
		auto *share_input = llvm::cast<llvm::MDNode>(*share_input_node);
		node.node_share_input_id = get_string_metadata(share_input, 0);
		node.node_share_input_array_index = get_constant_metadata(share_input, 1);
	}

	auto *local_argument_node = get_shader_property_tag(meta, DXIL::ShaderPropertyTag::NodeLocalRootArgumentsTableIndex);
	if (local_argument_node)
	{
		node.local_root_arguments_table_index =
		    llvm::cast<llvm::ConstantAsMetadata>(*local_argument_node)->getValue()->getUniqueInteger().getZExtValue();
	}
	else
		node.local_root_arguments_table_index = UINT32_MAX;

	return node;
}

NodeInputData Converter::get_node_input(const LLVMBCParser &parser, const char *entry)
{
	auto *entry_point_meta = get_entry_point_meta(parser.get_module(), entry);
	if (!entry_point_meta)
		return {};
	return Impl::get_node_input(entry_point_meta);
}

Vector<NodeOutputData> Converter::get_node_outputs(const LLVMBCParser &parser, const char *entry)
{
	Vector<NodeOutputData> output_data;
	auto *entry_point_meta = get_entry_point_meta(parser.get_module(), entry);
	if (!entry_point_meta)
		return {};

	auto *outputs_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::NodeOutputs);
	if (outputs_node)
	{
		auto *outputs = llvm::cast<llvm::MDNode>(*outputs_node);
		for (unsigned i = 0; i < outputs->getNumOperands(); i++)
		{
			auto *output = llvm::cast<llvm::MDNode>(outputs->getOperand(i));
			output_data.push_back(Impl::get_node_output(output));
		}
	}

	// Spec constant IDs are allowed incrementally.
	// Spec constant ID 0 is reserved for workgroup size spec constant.
	uint32_t spec_constant_id = NodeSpecIdOutputBase;
	for (auto &output : output_data)
	{
		output.node_index_spec_constant_id = spec_constant_id;
		spec_constant_id++;
	}

	return output_data;
}

String Converter::get_analysis_warnings() const
{
	String str;

	if (impl->shader_analysis.needs_auto_group_shared_barriers)
	{
		// This is a case that might just happen to work if the game assumes lock-step execution.
		// If the group size is larger, it's extremely unlikely the game works by chance on native drivers.
		// Some shaders seem to use groupshared as a sort of "scratch space" per thread, which
		// is a valid use case and does not require barriers to be correct.
		str += "- Has group shared access, but no group shared barrier anywhere.\n";
	}

	return str;
}

bool Converter::Impl::emit_execution_modes_node()
{
	// It will be necessary to override all this metadata through some API.
	// Not really needed to support this until we've implemented everything.
	NodeInputData node = get_node_input(entry_point_meta);
	if (node.launch_type == DXIL::NodeLaunchType::Invalid)
		return false;

	node_input.node_id = node.node_id;
	node_input.node_array_index = node.node_array_index;
	node_input.launch_type = node.launch_type;
	node_input.dispatch_grid = node.grid_buffer;
	node_input.payload_stride = node.payload_stride;
	node_input.coalesce_stride = node.coalesce_factor;

	if (!emit_execution_modes_node_input())
		return false;

	auto *outputs_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::NodeOutputs);
	if (outputs_node)
	{
		auto *outputs = llvm::cast<llvm::MDNode>(*outputs_node);

		for (unsigned i = 0; i < outputs->getNumOperands(); i++)
		{
			auto *output = llvm::cast<llvm::MDNode>(outputs->getOperand(i));
			if (!emit_execution_modes_node_output(output))
				return false;
		}
	}

	node_input.is_indirect_payload_stride_id = builder().makeBoolConstant(false, true);
	builder().addDecoration(node_input.is_indirect_payload_stride_id, spv::DecorationSpecId,
	                        int(node.is_indirect_bda_stride_program_entry_spec_id));
	builder().addName(node_input.is_indirect_payload_stride_id, "NodeEntryIndirectPayloadStride");

	node_input.is_entry_point_id = builder().makeBoolConstant(node.is_program_entry, true);
	builder().addDecoration(node_input.is_entry_point_id, spv::DecorationSpecId,
	                        int(node.is_entry_point_spec_id));
	builder().addName(node_input.is_entry_point_id, "NodeIsProgramEntry");

	if (node_input.launch_type == DXIL::NodeLaunchType::Broadcasting)
	{
		node_input.broadcast_has_max_grid_id = builder().makeBoolConstant(node.dispatch_grid_is_upper_bound, true);
		builder().addDecoration(node_input.broadcast_has_max_grid_id, spv::DecorationSpecId,
		                        int(node.dispatch_grid_is_upper_bound_spec_id));
		builder().addName(node_input.broadcast_has_max_grid_id, "DispatchGridIsUpperBound");

		node_input.is_static_broadcast_node_id = builder().makeBoolConstant(false, true);
		builder().addDecoration(node_input.is_static_broadcast_node_id, spv::DecorationSpecId,
		                        int(node.is_static_broadcast_node_spec_id));
		builder().addName(node_input.is_static_broadcast_node_id, "DispatchStaticPayload");

		spv::Id u32_type = builder().makeUintType(32);

		for (uint32_t i = 0; i < 3; i++)
		{
			node_input.max_broadcast_grid_id[i] = builder().makeUintConstant(node.broadcast_grid[i], true);
			builder().addDecoration(node_input.max_broadcast_grid_id[i], spv::DecorationSpecId,
			                        int(node.max_broadcast_grid_spec_id[i]));
			static const char *names[] = { "MaxBroadcastGridX", "MaxBroadcastGridY", "MaxBroadcastGridZ" };
			builder().addName(node_input.max_broadcast_grid_id[i], names[i]);

			node_input.max_broadcast_grid_minus_1_id[i] = builder().createSpecConstantOp(
			    spv::OpISub, u32_type, { node_input.max_broadcast_grid_id[i], builder().makeUintConstant(1) }, {});
			static const char *sub_names[] = { "GridXMinus1", "GridYMinus1", "GridZMinus1" };
			builder().addName(node_input.max_broadcast_grid_minus_1_id[i], sub_names[i]);
		}
	}

	return emit_execution_modes_compute();
}

bool Converter::Impl::emit_execution_modes_compute()
{
	auto *num_threads_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::NumThreads);
	if (num_threads_node)
	{
		auto *num_threads = llvm::cast<llvm::MDNode>(*num_threads_node);
		return emit_execution_modes_thread_wave_properties(num_threads);
	}
	else
		return false;
}

static bool entry_point_modifies_sample_mask(const llvm::MDNode *node)
{
	if (!node->getOperand(2))
		return false;
	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &outputs = signature_node->getOperand(1);
	if (!outputs)
		return false;

	auto *outputs_node = llvm::dyn_cast<llvm::MDNode>(outputs);
	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(output, 3));
		if (system_value == DXIL::Semantic::Depth ||
		    system_value == DXIL::Semantic::DepthLessEqual ||
		    system_value == DXIL::Semantic::DepthGreaterEqual ||
		    system_value == DXIL::Semantic::StencilRef ||
		    system_value == DXIL::Semantic::Coverage)
		{
			return true;
		}
	}

	return false;
}

static uint64_t get_shader_flags(const llvm::MDNode *entry_point_meta)
{
	auto *flags_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::ShaderFlags);
	if (flags_node)
		return llvm::cast<llvm::ConstantAsMetadata>(*flags_node)->getValue()->getUniqueInteger().getZExtValue();
	else
		return 0;
}

bool Converter::Impl::emit_execution_modes_pixel_late()
{
	auto &builder = spirv_module.get_builder();

	if (execution_mode_meta.declares_rov)
	{
		builder.addExtension("SPV_EXT_fragment_shader_interlock");
		if (execution_mode_meta.per_sample_shading)
		{
			builder.addCapability(spv::CapabilityFragmentShaderSampleInterlockEXT);
			builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeSampleInterlockOrderedEXT);
		}
		else
		{
			builder.addCapability(spv::CapabilityFragmentShaderPixelInterlockEXT);
			builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModePixelInterlockOrderedEXT);
		}
	}

	return true;
}

bool Converter::Impl::emit_execution_modes_pixel()
{
	auto &builder = spirv_module.get_builder();
	auto flags = get_shader_flags(entry_point_meta);
	bool early_depth_stencil = (flags & DXIL::ShaderFlagEarlyDepthStencil) != 0;

	if (options.descriptor_qa_enabled || options.instruction_instrumentation.enabled)
	{
		// If we have descriptor QA enabled, we will have side effects when running fragment shaders.
		// This forces late-Z which can trigger some horrible performance issues.
		// Make sure to enable early depth-stencil if nothing in the shader is early/late sensitive.
		if (!entry_point_modifies_sample_mask(entry_point_meta) &&
		    !shader_analysis.has_side_effects && !shader_analysis.discards)
		{
			early_depth_stencil = true;
		}
	}

	if (early_depth_stencil)
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeEarlyFragmentTests);

	// Avoid masking helper lanes when strict_helper_lane_waveops is used.
	// Execution modes to enable correct Vulkan behaviour are set up later.
	auto *func = get_entry_point_function(entry_point_meta);
	execution_mode_meta.waveops_include_helper_lanes =
	    func->hasFnAttribute("waveops-include-helper-lanes");

	// If helper lanes don't exist, don't bother trying to mask them out,
	// it will just confuse the compiler.
	spirv_module.set_helper_lanes_participate_in_wave_ops(
		!options.strict_helper_lane_waveops ||
	    execution_model != spv::ExecutionModelFragment ||
		execution_mode_meta.waveops_include_helper_lanes);

	return true;
}

bool Converter::Impl::emit_execution_modes_domain()
{
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityTessellation);

	auto *ds_state_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::DSState);
	if (ds_state_node)
	{
		auto *arguments = llvm::cast<llvm::MDNode>(*ds_state_node);
		auto domain = static_cast<DXIL::TessellatorDomain>(get_constant_metadata(arguments, 0));
		auto *func = spirv_module.get_entry_function();

		switch (domain)
		{
		case DXIL::TessellatorDomain::IsoLine:
			builder.addExecutionMode(func, spv::ExecutionModeIsolines);
			break;

		case DXIL::TessellatorDomain::Tri:
			builder.addExecutionMode(func, spv::ExecutionModeTriangles);
			break;

		case DXIL::TessellatorDomain::Quad:
			builder.addExecutionMode(func, spv::ExecutionModeQuads);
			break;

		default:
			LOGE("Unknown tessellator domain!\n");
			return false;
		}

		unsigned input_control_points = get_constant_metadata(arguments, 1);
		execution_mode_meta.stage_input_num_vertex = input_control_points;
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_hull()
{
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityTessellation);
	auto *hs_state_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::HSState);

	if (hs_state_node)
	{
		auto *arguments = llvm::cast<llvm::MDNode>(*hs_state_node);

		auto *patch_constant = llvm::cast<llvm::ConstantAsMetadata>(arguments->getOperand(0));
		auto *patch_constant_value = patch_constant->getValue();
		execution_mode_meta.patch_constant_function = llvm::cast<llvm::Function>(patch_constant_value);

		unsigned input_control_points = get_constant_metadata(arguments, 1);
		unsigned output_control_points = get_constant_metadata(arguments, 2);
		auto domain = static_cast<DXIL::TessellatorDomain>(get_constant_metadata(arguments, 3));
		auto partitioning = static_cast<DXIL::TessellatorPartitioning>(get_constant_metadata(arguments, 4));
		auto primitive = static_cast<DXIL::TessellatorOutputPrimitive>(get_constant_metadata(arguments, 5));

		auto *func = spirv_module.get_entry_function();

		switch (domain)
		{
		case DXIL::TessellatorDomain::IsoLine:
			builder.addExecutionMode(func, spv::ExecutionModeIsolines);
			break;

		case DXIL::TessellatorDomain::Tri:
			builder.addExecutionMode(func, spv::ExecutionModeTriangles);
			break;

		case DXIL::TessellatorDomain::Quad:
			builder.addExecutionMode(func, spv::ExecutionModeQuads);
			break;

		default:
			LOGE("Unknown tessellator domain!\n");
			return false;
		}

		switch (partitioning)
		{
		case DXIL::TessellatorPartitioning::Integer:
			builder.addExecutionMode(func, spv::ExecutionModeSpacingEqual);
			break;

		case DXIL::TessellatorPartitioning::Pow2:
			LOGE("Emulating Pow2 spacing as Integer.\n");
			builder.addExecutionMode(func, spv::ExecutionModeSpacingEqual);
			break;

		case DXIL::TessellatorPartitioning::FractionalEven:
			builder.addExecutionMode(func, spv::ExecutionModeSpacingFractionalEven);
			break;

		case DXIL::TessellatorPartitioning::FractionalOdd:
			builder.addExecutionMode(func, spv::ExecutionModeSpacingFractionalOdd);
			break;

		default:
			LOGE("Unknown tessellator partitioning.\n");
			return false;
		}

		switch (primitive)
		{
		case DXIL::TessellatorOutputPrimitive::TriangleCCW:
			builder.addExecutionMode(func, spv::ExecutionModeVertexOrderCcw);
			break;

		case DXIL::TessellatorOutputPrimitive::TriangleCW:
			builder.addExecutionMode(func, spv::ExecutionModeVertexOrderCw);
			break;

		case DXIL::TessellatorOutputPrimitive::Point:
			builder.addExecutionMode(func, spv::ExecutionModePointMode);
			// TODO: Do we have to specify CCW/CW in point mode?
			break;

		case DXIL::TessellatorOutputPrimitive::Line:
			break;

		default:
			LOGE("Unknown tessellator primitive.\n");
			return false;
		}

		builder.addExecutionMode(func, spv::ExecutionModeOutputVertices, output_control_points);

		execution_mode_meta.stage_input_num_vertex = input_control_points;
		execution_mode_meta.stage_output_num_vertex = output_control_points;
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_geometry()
{
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityGeometry);
	auto *gs_state_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::GSState);

	if (gs_state_node)
	{
		auto *arguments = llvm::cast<llvm::MDNode>(*gs_state_node);

		auto input_primitive = static_cast<DXIL::InputPrimitive>(get_constant_metadata(arguments, 0));
		unsigned max_vertex_count = get_constant_metadata(arguments, 1);

		auto *func = spirv_module.get_entry_function();

		auto topology = static_cast<DXIL::PrimitiveTopology>(get_constant_metadata(arguments, 3));
		unsigned gs_instances = get_constant_metadata(arguments, 4);

		execution_mode_meta.gs_stream_active_mask = get_constant_metadata(arguments, 2);

		builder.addExecutionMode(func, spv::ExecutionModeInvocations, gs_instances);
		builder.addExecutionMode(func, spv::ExecutionModeOutputVertices, max_vertex_count);

		switch (input_primitive)
		{
		case DXIL::InputPrimitive::Point:
			builder.addExecutionMode(func, spv::ExecutionModeInputPoints);
			execution_mode_meta.stage_input_num_vertex = 1;
			break;

		case DXIL::InputPrimitive::Line:
			builder.addExecutionMode(func, spv::ExecutionModeInputLines);
			execution_mode_meta.stage_input_num_vertex = 2;
			break;

		case DXIL::InputPrimitive::LineWithAdjacency:
			builder.addExecutionMode(func, spv::ExecutionModeInputLinesAdjacency);
			execution_mode_meta.stage_input_num_vertex = 4;
			break;

		case DXIL::InputPrimitive::Triangle:
			builder.addExecutionMode(func, spv::ExecutionModeTriangles);
			execution_mode_meta.stage_input_num_vertex = 3;
			break;

		case DXIL::InputPrimitive::TriangleWithAdjaceny:
			builder.addExecutionMode(func, spv::ExecutionModeInputTrianglesAdjacency);
			execution_mode_meta.stage_input_num_vertex = 6;
			break;

		default:
			LOGE("Unexpected input primitive (%u).\n", unsigned(input_primitive));
			return false;
		}

		switch (topology)
		{
		case DXIL::PrimitiveTopology::PointList:
			builder.addExecutionMode(func, spv::ExecutionModeOutputPoints);
			break;

		case DXIL::PrimitiveTopology::LineStrip:
			builder.addExecutionMode(func, spv::ExecutionModeOutputLineStrip);
			break;

		case DXIL::PrimitiveTopology::TriangleStrip:
			builder.addExecutionMode(func, spv::ExecutionModeOutputTriangleStrip);
			break;

		default:
			LOGE("Unexpected output primitive topology (%u).\n", unsigned(topology));
			return false;
		}
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_ray_tracing(spv::ExecutionModel model)
{
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityRayTracingKHR);
	if (options.ray_tracing_primitive_culling_enabled && shader_analysis.can_require_primitive_culling)
		builder.addCapability(spv::CapabilityRayTraversalPrimitiveCullingKHR);
	if (options.opacity_micromap_enabled && shader_analysis.can_require_opacity_micromap)
	{
		builder.addCapability(spv::CapabilityRayTracingOpacityMicromapEXT);
		builder.addExtension("SPV_EXT_opacity_micromap");
	}
	builder.addExtension("SPV_KHR_ray_tracing");
	builder.addExtension("SPV_EXT_descriptor_indexing");

	// For DXR, we'll need full bindless.
	builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);

	builder.addCapability(spv::CapabilitySampledImageArrayDynamicIndexing);
	builder.addCapability(spv::CapabilitySampledImageArrayNonUniformIndexing);
	builder.addCapability(spv::CapabilityStorageImageArrayDynamicIndexing);
	builder.addCapability(spv::CapabilityStorageImageArrayNonUniformIndexing);
	builder.addCapability(spv::CapabilityStorageBufferArrayDynamicIndexing);
	builder.addCapability(spv::CapabilityStorageBufferArrayNonUniformIndexing);
	builder.addCapability(spv::CapabilityUniformBufferArrayDynamicIndexing);
	builder.addCapability(spv::CapabilityUniformBufferArrayNonUniformIndexing);

	return true;
}

bool Converter::Impl::emit_execution_modes_thread_wave_properties(const llvm::MDNode *num_threads)
{
	auto &builder = spirv_module.get_builder();

	if (options.force_wave_size_enable && options.force_subgroup_size)
	{
		execution_mode_meta.wave_size_min = options.force_subgroup_size;
		execution_mode_meta.wave_size_max = 0;
		execution_mode_meta.wave_size_preferred = 0;
	}
	else
	{
		auto *wave_size_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::WaveSize);
		auto *wave_size_range_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::RangedWaveSize);

		if (wave_size_range_node)
		{
			auto *wave_size = llvm::cast<llvm::MDNode>(*wave_size_range_node);
			execution_mode_meta.wave_size_min = get_constant_metadata(wave_size, 0);
			execution_mode_meta.wave_size_max = get_constant_metadata(wave_size, 1);
			execution_mode_meta.wave_size_preferred = get_constant_metadata(wave_size, 2);
		}
		else if (wave_size_node)
		{
			auto *wave_size = llvm::cast<llvm::MDNode>(*wave_size_node);
			execution_mode_meta.wave_size_min = get_constant_metadata(wave_size, 0);
			execution_mode_meta.wave_size_max = 0;
			execution_mode_meta.wave_size_preferred = 0;
		}
	}

	unsigned threads[3];
	for (unsigned dim = 0; dim < 3; dim++)
		threads[dim] = get_constant_metadata(num_threads, dim);
	unsigned total_workgroup_threads = threads[0] * threads[1] * threads[2];

	if (execution_model == spv::ExecutionModelGLCompute)
	{
		if ((total_workgroup_threads <= 32 && shader_analysis.require_subgroups) ||
		    (shader_analysis.subgroup_ballot_reads_first && !shader_analysis.subgroup_ballot_reads_upper))
		{
			// Common game bug. Only reading the first scalar of a ballot probably means
			// the shader relies on WaveSize <= 32.
			suggest_maximum_wave_size(32);
		}
	}

	if (shader_analysis.require_compute_shader_derivatives)
	{
		if (execution_model != spv::ExecutionModelGLCompute &&
		    execution_model != spv::ExecutionModelTaskEXT &&
		    execution_model != spv::ExecutionModelMeshEXT)
		{
			LOGE("Derivatives only supported in compute, task and mesh shaders.\n");
			return false;
		}

		// For sanity, verify that dimensions align sufficiently.
		// Spec says that product of workgroup size must align with 4.
		if (total_workgroup_threads % 4 == 0)
		{
			if (options.compute_shader_derivatives)
			{
				builder.addExtension(options.compute_shader_derivatives_khr
					? "SPV_KHR_compute_shader_derivatives" : "SPV_NV_compute_shader_derivatives");
				builder.addCapability(spv::CapabilityComputeDerivativeGroupLinearNV);

				// It is technically not in spec to just assume this since subgroup lane mapping to local invocation index
				// is not defined without this. In practice on NV, this holds based on our testing.
				builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDerivativeGroupLinearNV);
			}

			// If the X and Y dimensions align with 2,
			// we need to assume that any quad op works on a 2D dispatch.
			execution_mode_meta.synthesize_2d_quad_dispatch = (threads[0] % 2 == 0) && (threads[1] % 2 == 0);
			if (execution_mode_meta.synthesize_2d_quad_dispatch)
			{
				threads[0] *= 2;
				threads[1] /= 2;
			}
		}
		else
		{
			// DXC is robust against this case.
			// Derivatives become meaningless now, so we have to fake the results.
			execution_mode_meta.synthesize_dummy_derivatives = true;
			LOGW("Invalid use of compute shader derivatives detected. Falling back to robust results.\n");
		}
	}

	for (unsigned dim = 0; dim < 3; dim++)
		execution_mode_meta.workgroup_threads[dim] = threads[dim];

	if (execution_model_lib_target)
	{
		threads[0] = builder.makeUintConstant(threads[0], true);
		threads[1] = builder.makeUintConstant(threads[1], true);
		threads[2] = builder.makeUintConstant(threads[2], true);
		builder.addDecoration(threads[0], spv::DecorationSpecId, NodeSpecIdGroupSizeX);
		builder.addDecoration(threads[1], spv::DecorationSpecId, NodeSpecIdGroupSizeY);
		builder.addDecoration(threads[2], spv::DecorationSpecId, NodeSpecIdGroupSizeZ);
		builder.addExecutionModeId(spirv_module.get_entry_function(),
		                           spv::ExecutionModeLocalSizeId,
		                           threads[0], threads[1], threads[2]);

		node_input.thread_group_size_id =
			builder.makeCompositeConstant(builder.makeVectorType(builder.makeUintType(32), 3),
			                              { threads[0], threads[1], threads[2] }, true);
		builder.addName(node_input.thread_group_size_id, "ThreadGroupSize");
	}
	else
	{
		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeLocalSize,
		                         threads[0], threads[1], threads[2]);
	}

	return true;
}

bool Converter::Impl::emit_execution_modes_amplification()
{
	auto &builder = spirv_module.get_builder();

	builder.addExtension("SPV_EXT_mesh_shader");
	builder.addCapability(spv::CapabilityMeshShadingEXT);

	auto *as_state_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::ASState);

	if (as_state_node)
	{
		auto *arguments = llvm::cast<llvm::MDNode>(*as_state_node);
		auto *num_threads = llvm::cast<llvm::MDNode>(arguments->getOperand(0));
		return emit_execution_modes_thread_wave_properties(num_threads);
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_mesh()
{
	auto &builder = spirv_module.get_builder();
	auto *func = spirv_module.get_entry_function();

	builder.addExtension("SPV_EXT_mesh_shader");
	builder.addCapability(spv::CapabilityMeshShadingEXT);

	auto *ms_state_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::MSState);

	if (ms_state_node)
	{
		auto *arguments = llvm::cast<llvm::MDNode>(*ms_state_node);
		unsigned max_vertex_count = get_constant_metadata(arguments, 1);
		unsigned max_primitive_count = get_constant_metadata(arguments, 2);
		auto topology = static_cast<DXIL::MeshOutputTopology>(get_constant_metadata(arguments, 3));
		unsigned index_count;

		builder.addExecutionMode(func, spv::ExecutionModeOutputVertices, std::max<int>(1, max_vertex_count));
		builder.addExecutionMode(func, spv::ExecutionModeOutputPrimitivesEXT, std::max<int>(1, max_primitive_count));

		switch (topology)
		{
		case DXIL::MeshOutputTopology::Undefined:
			index_count = 0;
			break;

		case DXIL::MeshOutputTopology::Line:
			builder.addExecutionMode(func, spv::ExecutionModeOutputLinesEXT);
			index_count = 2;
			break;

		case DXIL::MeshOutputTopology::Triangle:
			builder.addExecutionMode(func, spv::ExecutionModeOutputTrianglesEXT);
			index_count = 3;
			break;

		default:
			LOGE("Unexpected mesh output topology (%u).\n", unsigned(topology));
			return false;
		}

		execution_mode_meta.stage_output_num_vertex = max_vertex_count;
		execution_mode_meta.stage_output_num_primitive = max_primitive_count;
		execution_mode_meta.primitive_index_dimension = index_count;

		auto *num_threads = llvm::cast<llvm::MDNode>(arguments->getOperand(0));
		return emit_execution_modes_thread_wave_properties(num_threads);
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_fp_denorm()
{
	// Check for SM 6.2 denorm handling. Only applies to FP32.
	auto *func = get_entry_point_function(entry_point_meta);
	if (!func)
		return true;

	auto attr = func->getFnAttribute("fp32-denorm-mode");
	auto str = attr.getValueAsString();
	if (str == "ftz")
	{
		builder().addExtension("SPV_KHR_float_controls");
		builder().addCapability(spv::CapabilityDenormFlushToZero);
		builder().addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDenormFlushToZero, 32);
	}
	else if (str == "preserve")
	{
		builder().addExtension("SPV_KHR_float_controls");
		builder().addCapability(spv::CapabilityDenormPreserve);
		builder().addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDenormPreserve, 32);
	}

	return true;
}

bool Converter::Impl::analyze_execution_modes_meta()
{
	auto *meta = entry_point_meta;

	if (execution_model_lib_target)
		if (auto *null_meta = get_null_entry_point_meta(bitcode_parser.get_module()))
			meta = null_meta;

	auto flags = get_shader_flags(meta);
	execution_mode_meta.native_16bit_operations = (flags & DXIL::ShaderFlagNativeLowPrecision) != 0;
	return true;
}

void Converter::Impl::emit_execution_modes_post_code_generation()
{
	auto &b = builder();

	if (module_is_dxilconv(bitcode_parser.get_module()))
	{
		// We should use these globally, but don't want to invalidate all Fossilize archives just yet.
		// Shader instrumentation may declare its own preservation modes, so only declare execution modes
		// if we haven't done anything.
		if (!builder().hasCapability(spv::CapabilitySignedZeroInfNanPreserve))
		{
			b.addExtension("SPV_KHR_float_controls");
			b.addCapability(spv::CapabilitySignedZeroInfNanPreserve);
			b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeSignedZeroInfNanPreserve, 32);
			if (b.hasCapability(spv::CapabilityFloat64))
				b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeSignedZeroInfNanPreserve, 64);
		}

		// DXBC assumes flush-to-zero, but dxilconv doesn't explicitly emit that, since it's not in SM 6.0.
		if (!b.hasCapability(spv::CapabilityDenormFlushToZero) && !b.hasCapability(spv::CapabilityDenormPreserve))
		{
			b.addExtension("SPV_KHR_float_controls");
			b.addCapability(spv::CapabilityDenormFlushToZero);
			b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDenormFlushToZero, 32);
		}
	}

	// Float16 and Float64 require denorms to be preserved in D3D12.
	if (b.hasCapability(spv::CapabilityFloat16) &&
	    options.supports_float16_denorm_preserve)
	{
		b.addExtension("SPV_KHR_float_controls");
		b.addCapability(spv::CapabilityDenormPreserve);
		b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDenormPreserve, 16);
	}

	if (b.hasCapability(spv::CapabilityFloat64) &&
	    options.supports_float64_denorm_preserve)
	{
		b.addExtension("SPV_KHR_float_controls");
		b.addCapability(spv::CapabilityDenormPreserve);
		b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeDenormPreserve, 64);
	}

	// Opt into quad derivatives and maximal reconvergence for fragment shaders using
	// QuadAll/QuadAny intrinsics to get meaningful behaviour for quad-uniform control
	// flow, other quad ops are ignored for now.
	if (options.supports_quad_control && execution_model == spv::ExecutionModelFragment &&
	    execution_mode_meta.needs_quad_derivatives)
	{
		b.addExtension("SPV_KHR_quad_control");
		b.addCapability(spv::CapabilityQuadControlKHR);
		b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeRequireFullQuadsKHR);
		b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeQuadDerivativesKHR);
	}

	if (options.supports_maximal_reconvergence &&
	    (options.force_maximal_reconvergence ||
	     execution_mode_meta.waveops_include_helper_lanes ||
	     execution_mode_meta.needs_quad_derivatives ||
	     shader_analysis.need_maximal_reconvergence_helper_call))
	{
		b.addExtension("SPV_KHR_maximal_reconvergence");
		b.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeMaximallyReconvergesKHR);
	}
}

bool Converter::Impl::emit_execution_modes_late()
{
	switch (execution_model)
	{
	case spv::ExecutionModelFragment:
		if (!emit_execution_modes_pixel_late())
			return false;
		break;

	default:
		break;
	}

	return true;
}

bool Converter::Impl::emit_execution_modes()
{
	switch (execution_model)
	{
	case spv::ExecutionModelGLCompute:
		if (execution_model_lib_target)
		{
			if (!emit_execution_modes_node())
				return false;
		}
		else
		{
			if (!emit_execution_modes_compute())
				return false;
		}
		break;

	case spv::ExecutionModelGeometry:
		if (!emit_execution_modes_geometry())
			return false;
		break;

	case spv::ExecutionModelTessellationControl:
		if (!emit_execution_modes_hull())
			return false;
		break;

	case spv::ExecutionModelTessellationEvaluation:
		if (!emit_execution_modes_domain())
			return false;
		break;

	case spv::ExecutionModelFragment:
		if (!emit_execution_modes_pixel())
			return false;
		break;

	case spv::ExecutionModelRayGenerationKHR:
	case spv::ExecutionModelMissKHR:
	case spv::ExecutionModelIntersectionKHR:
	case spv::ExecutionModelAnyHitKHR:
	case spv::ExecutionModelCallableKHR:
	case spv::ExecutionModelClosestHitKHR:
		if (!emit_execution_modes_ray_tracing(execution_model))
			return false;
		break;

	case spv::ExecutionModelTaskEXT:
		if (!emit_execution_modes_amplification())
			return false;
		break;

	case spv::ExecutionModelMeshEXT:
		if (!emit_execution_modes_mesh())
			return false;
		break;

	default:
		break;
	}

	if (!emit_execution_modes_fp_denorm())
		return false;

	return true;
}

ConvertedFunction::Function
Converter::Impl::build_rov_main(const Vector<llvm::BasicBlock *> &visit_order,
                                CFGNodePool &pool,
                                Vector<ConvertedFunction::Function> &leaves)
{
	auto *code_main = convert_function(visit_order, true);

	// Need to figure out if our ROV use is trivial. If not, we will wrap the entire function in ROV pairs.
	CFGStructurizer cfg{code_main, pool, spirv_module};
	cfg.set_driver_version(options.driver_id, options.driver_version);
	bool trivial_rewrite = cfg.rewrite_rov_lock_region();

	if (trivial_rewrite)
		return { code_main, spirv_module.get_entry_function() };

	// If we need to fallback we need a wrapper function. Replace the entry point.

	spv::Block *code_entry;
	auto *code_func =
	    builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(), "code_main", {}, {}, &code_entry);

	code_func->moveLocalVariablesFrom(spirv_module.get_entry_function());

	auto *entry = pool.create_node();
	entry->ir.operations.push_back(allocate(spv::OpBeginInvocationInterlockEXT));
	auto *call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
	call_op->add_id(code_func->getId());
	entry->ir.operations.push_back(call_op);
	entry->ir.operations.push_back(allocate(spv::OpEndInvocationInterlockEXT));
	entry->ir.terminator.type = Terminator::Type::Return;
	leaves.push_back({ code_main, code_func });
	return { entry, spirv_module.get_entry_function() };
}


ConvertedFunction::Function
Converter::Impl::build_node_main(const Vector<llvm::BasicBlock *> &visit_order,
                                 CFGNodePool &pool,
                                 Vector<ConvertedFunction::Function> &leaves)
{
	spv::Block *node_entry;
	auto *node_func =
		builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(),
		                            "node_main", {}, {}, &node_entry);

	// Set build point so alloca() functions can create variables correctly.
	builder().setBuildPoint(node_entry);
	auto *node_main = convert_function(visit_order, true);
	leaves.push_back({ node_main, node_func });

	auto *entry = pool.create_node();
	current_block = &entry->ir.operations;
	entry->ir.terminator.type = Terminator::Type::Return;

	if (!emit_workgraph_dispatcher(*this, pool, entry, node_func->getId()))
		return {};

	return { entry, spirv_module.get_entry_function() };
}

void Converter::Impl::emit_patch_output_lowering(CFGNode *bb)
{
	auto *node = entry_point_meta;
	current_block = &bb->ir.operations;
	assert(node->getOperand(2));

	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &patch_variables = signature_node->getOperand(2);
	if (!patch_variables)
		return;

	auto *patch_node = llvm::dyn_cast<llvm::MDNode>(patch_variables);

	spv::Id u32_type = builder().makeUintType(32);
	spv::Id uvec4_type = builder().makeVectorType(u32_type, 4);

	for (unsigned i = 0; i < patch_node->getNumOperands(); i++)
	{
		auto *patch = llvm::cast<llvm::MDNode>(patch_node->getOperand(i));
		auto element_id = get_constant_metadata(patch, 0);
		auto actual_element_type = normalize_component_type(static_cast<DXIL::ComponentType>(get_constant_metadata(patch, 2)));
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(patch, 3));

		if (system_value != DXIL::Semantic::User)
			continue;

		auto rows = get_constant_metadata(patch, 6);
		auto cols = get_constant_metadata(patch, 7);
		auto start_row = get_constant_metadata(patch, 8);
		auto start_col = get_constant_metadata(patch, 9);

		auto &meta = patch_elements_meta[element_id];
		assert(meta.id);

		for (unsigned row = 0; row < rows; row++)
		{
			auto *chain = allocate(spv::OpAccessChain, builder().makePointer(spv::StorageClassPrivate, uvec4_type));
			chain->add_id(execution_mode_meta.patch_lowering_array_var_id);
			chain->add_id(builder().makeUintConstant(row + start_row));
			add(chain);

			auto *load_op = allocate(spv::OpLoad, uvec4_type);
			load_op->add_id(chain->id);
			add(load_op);

			spv::Id store_id;

			if (cols == 4)
			{
				store_id = load_op->id;
			}
			else if (cols > 1)
			{
				auto *shuffle_op = allocate(spv::OpVectorShuffle, get_type_id(DXIL::ComponentType::U32, 1, cols));
				shuffle_op->add_id(load_op->id);
				shuffle_op->add_id(load_op->id);
				for (unsigned c = 0; c < cols; c++)
					shuffle_op->add_literal(c + start_col);
				add(shuffle_op);
				store_id = shuffle_op->id;
			}
			else
			{
				auto *extract_op = allocate(spv::OpCompositeExtract, u32_type);
				extract_op->add_id(load_op->id);
				extract_op->add_literal(start_col);
				add(extract_op);
				store_id = extract_op->id;
			}

			if (actual_element_type != DXIL::ComponentType::U32)
			{
				auto *cast = allocate(spv::OpBitcast, get_type_id(actual_element_type, 1, cols));
				cast->add_id(store_id);
				add(cast);
				store_id = cast->id;
			}

			auto *store_op = allocate(spv::OpStore);

			if (rows > 1)
			{
				auto *store_chain = allocate(
					spv::OpAccessChain,
					builder().makePointer(spv::StorageClassOutput,
					                      get_type_id(actual_element_type, 1, cols)));

				store_chain->add_id(meta.id);
				store_chain->add_id(builder().makeUintConstant(row));
				add(store_chain);

				store_op->add_id(store_chain->id);
			}
			else
			{
				store_op->add_id(meta.id);
			}

			store_op->add_id(store_id);
			add(store_op);
		}
	}
}

ConvertedFunction::Function
Converter::Impl::build_hull_main(const Vector<llvm::BasicBlock *> &visit_order,
                                 const Vector<llvm::BasicBlock *> &patch_visit_order,
                                 CFGNodePool &pool,
                                 Vector<ConvertedFunction::Function> &leaves)
{
	// Just make sure there is an entry block already created.
	spv::Block *hull_entry = nullptr, *patch_entry = nullptr;
	spv::Function *hull_func = nullptr;
	if (!visit_order.empty())
	{
		hull_func =
			builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(), "hull_main", {}, {}, &hull_entry);
	}

	auto *patch_func =
	    builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(), "patch_main", {}, {}, &patch_entry);

	// Set build point so alloca() functions can create variables correctly.
	if (hull_entry)
		builder().setBuildPoint(hull_entry);
	CFGNode *hull_main = nullptr;
	if (!visit_order.empty())
		hull_main = convert_function(visit_order, true);

	builder().setBuildPoint(patch_entry);
	auto *patch_main = convert_function(patch_visit_order, false);
	builder().setBuildPoint(spirv_module.get_entry_function()->getEntryBlock());

	if (hull_main)
		leaves.push_back({ hull_main, hull_func });
	leaves.push_back({ patch_main, patch_func });

	auto *entry = pool.create_node();

	Operation *call_op;
	if (hull_func)
	{
		call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
		call_op->add_id(hull_func->getId());
		entry->ir.operations.push_back(call_op);
	}

	if (execution_mode_meta.stage_output_num_vertex > 1)
	{
		auto *load_op = allocate(spv::OpLoad, builder().makeUintType(32));
		load_op->add_id(spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId));
		entry->ir.operations.push_back(load_op);

		auto *cmp_op = allocate(spv::OpIEqual, builder().makeBoolType());
		cmp_op->add_ids({ load_op->id, builder().makeUintConstant(0) });
		entry->ir.operations.push_back(cmp_op);

		if (hull_main)
		{
			auto *barrier_op = allocate(spv::OpControlBarrier);
			// Not 100% sure what to emit here. Just do what glslang does.
			barrier_op->add_id(builder().makeUintConstant(spv::ScopeWorkgroup));

			if (execution_mode_meta.memory_model == spv::MemoryModelVulkan)
			{
				barrier_op->add_id(builder().makeUintConstant(spv::ScopeWorkgroup));
				barrier_op->add_id(builder().makeUintConstant(
				    spv::MemorySemanticsOutputMemoryMask | spv::MemorySemanticsAcquireReleaseMask));
			}
			else
			{
				barrier_op->add_id(builder().makeUintConstant(spv::ScopeInvocation));
				barrier_op->add_id(builder().makeUintConstant(0));
			}

			entry->ir.operations.push_back(barrier_op);
		}

		auto *patch_block = pool.create_node();
		auto *merge_block = pool.create_node();

		entry->add_branch(patch_block);
		entry->add_branch(merge_block);
		patch_block->add_branch(merge_block);

		entry->ir.terminator.type = Terminator::Type::Condition;
		entry->ir.terminator.true_block = patch_block;
		entry->ir.terminator.false_block = merge_block;
		entry->ir.terminator.conditional_id = cmp_op->id;

		patch_block->ir.terminator.type = Terminator::Type::Branch;
		patch_block->ir.terminator.direct_block = merge_block;

		call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
		call_op->add_id(patch_func->getId());
		patch_block->ir.operations.push_back(call_op);
		if (execution_mode_meta.patch_lowering_array_var_id)
			emit_patch_output_lowering(patch_block);

		merge_block->ir.terminator.type = Terminator::Type::Return;
	}
	else
	{
		call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
		call_op->add_id(patch_func->getId());
		entry->ir.operations.push_back(call_op);
		entry->ir.terminator.type = Terminator::Type::Return;
		if (execution_mode_meta.patch_lowering_array_var_id)
			emit_patch_output_lowering(entry);
	}

	return { entry, spirv_module.get_entry_function() };
}

void Converter::Impl::build_function_bb_visit_order_inner_analysis(
	Vector<llvm::BasicBlock *> &bbs, UnorderedSet<llvm::BasicBlock *> &visited,
	llvm::BasicBlock *bb)
{
	if (visited.count(bb))
		return;
	visited.insert(bb);

	// Check for special case where we optimize to direct branch.
	auto *term = bb->getTerminator();
	if (auto *inst = llvm::dyn_cast<llvm::BranchInst>(term))
	{
		if (inst->isConditional())
		{
			bool cond_value;
			if (can_optimize_conditional_branch_to_static(*this, inst->getCondition(), cond_value))
			{
				auto *succ = inst->getSuccessor(cond_value ? 0 : 1);
				build_function_bb_visit_order_inner_analysis(bbs, visited, succ);
				bbs.push_back(bb);
				return;
			}
		}
	}

	for (auto itr = llvm::succ_begin(bb); itr != llvm::succ_end(bb); ++itr)
	{
		auto *succ = *itr;
		build_function_bb_visit_order_inner_analysis(bbs, visited, succ);
	}

	bbs.push_back(bb);
}

Vector<llvm::BasicBlock *> Converter::Impl::build_function_bb_visit_order_analysis(llvm::Function *func)
{
	if (!func)
		return {};

	UnorderedSet<llvm::BasicBlock *> visited;
	Vector<llvm::BasicBlock *> visit_order;
	auto *entry = &func->getEntryBlock();
	build_function_bb_visit_order_inner_analysis(visit_order, visited, entry);
	// Get natural traverse order, input is post-traversal order.
	std::reverse(visit_order.begin(), visit_order.end());
	return visit_order;
}

void Converter::Impl::build_function_bb_visit_register(llvm::BasicBlock *bb, CFGNodePool &pool, String tag)
{
	auto entry_meta = std::make_unique<BlockMeta>(bb);
	bb_map[bb] = entry_meta.get();
	auto *entry_node = pool.create_node();
	bb_map[bb]->node = entry_node;
	entry_node->name = std::move(tag);
	metas.push_back(std::move(entry_meta));
}

// This only exists so that we can avoid nuking all existing Fossilize caches with completely new shaders.
// This traversal order is not a perfect reverse post-traversal,
// so we cannot use it for analysis with alloca() -> CBV forwarding checks.
// Once we are ready to consider doing large scale SPIR-V changes that invalidate all caches anyway,
// we might as well get rid of this path in the same update and use the common analysis path.
Vector<llvm::BasicBlock *> Converter::Impl::build_function_bb_visit_order_legacy(
    llvm::Function *func, CFGNodePool &pool)
{
	if (!func)
		return {};

	auto *entry = &func->getEntryBlock();
	build_function_bb_visit_register(entry, pool, ".entry");

	Vector<llvm::BasicBlock *> to_process;
	Vector<llvm::BasicBlock *> processing;
	to_process.push_back(entry);
	Vector<llvm::BasicBlock *> visit_order;

	unsigned fake_label_id = 0;

	const auto queue_visit_succ = [&](llvm::BasicBlock *block, llvm::BasicBlock *succ) {
		if (!bb_map.count(succ))
		{
			to_process.push_back(succ);
			build_function_bb_visit_register(succ, pool, dxil_spv::to_string(++fake_label_id));
		}

		bb_map[block]->node->add_branch(bb_map[succ]->node);
	};

	// Traverse the CFG and register all blocks in the pool.
	while (!to_process.empty())
	{
		std::swap(to_process, processing);
		for (auto *block : processing)
		{
			visit_order.push_back(block);

			auto *term = block->getTerminator();
			if (auto *inst = llvm::dyn_cast<llvm::BranchInst>(term))
			{
				if (inst->isConditional())
				{
					bool cond_value;
					if (can_optimize_conditional_branch_to_static(*this, inst->getCondition(), cond_value))
					{
						auto *succ = inst->getSuccessor(cond_value ? 0 : 1);
						queue_visit_succ(block, succ);
						continue;
					}
				}
			}

			for (auto itr = llvm::succ_begin(block); itr != llvm::succ_end(block); ++itr)
				queue_visit_succ(block, *itr);
		}
		processing.clear();
	}

	return visit_order;
}

void Converter::Impl::emit_write_instrumentation_invocation_id(CFGNode *node)
{
	current_block = &node->ir.operations;

	spv::Id alloc_id = spirv_module.get_helper_call_id(HelperCall::AllocateInvocationID);

	auto *call = allocate(spv::OpFunctionCall, builder().makeUintType(32));
	call->add_id(alloc_id);
	add(call);

	auto *store = allocate(spv::OpStore);
	store->add_id(instrumentation.invocation_id_var_id);
	store->add_id(call->id);
	add(store);
}

CFGNode *Converter::Impl::convert_function(const Vector<llvm::BasicBlock *> &visit_order, bool primary_code)
{
	bool has_partial_unroll = false;

	for (auto *bb : visit_order)
	{
		auto *meta = bb_map[bb];
		CFGNode *node = meta->node;
		combined_image_sampler_cache.clear();

		if (bb == visit_order.front() && instrumentation.invocation_id_var_id && primary_code)
			emit_write_instrumentation_invocation_id(node);

		auto sink_itr = bb_to_sinks.find(bb);
		if (sink_itr != bb_to_sinks.end())
		{
			for (auto *instruction : sink_itr->second)
			{
				auto itr = value_map.find(instruction);
				if (itr != value_map.end())
					value_map.erase(itr);

				if (!emit_instruction(node, *instruction))
				{
					LOGE("Failed to emit instruction.\n");
					return {};
				}
			}
		}

		// Scan opcodes.
		for (auto &instruction : *bb)
		{
			if (!emit_instruction(node, instruction))
			{
				LOGE("Failed to emit instruction.\n");
				return {};
			}
		}

		ags.reset();

		// We don't know if the block is a loop yet, so just tag every BB.
		// CFG will propagate the information as necessary.
		node->ir.terminator.force_flatten = options.branch_control.force_flatten;
		node->ir.terminator.force_branch = options.branch_control.force_branch;
		node->ir.terminator.force_unroll = options.branch_control.force_unroll;
		node->ir.terminator.force_loop = options.branch_control.force_loop;

		auto *instruction = bb->getTerminator();

		if (auto *inst = llvm::dyn_cast<llvm::BranchInst>(instruction))
		{
			// Loop information is attached to the back edge in LLVM.
			// Continue blocks can be direct branches or conditional ones, so make it generic.
			auto *loop_meta = instruction->getMetadata("llvm.loop");
			if (loop_meta && loop_meta->getNumOperands() >= 2)
			{
				auto *meta_node = llvm::dyn_cast<llvm::MDNode>(loop_meta->getOperand(1));
				if (meta_node)
				{
					auto *meta_name = llvm::dyn_cast<llvm::MDString>(meta_node->getOperand(0));
					if (meta_name)
					{
#ifdef HAVE_LLVMBC
						auto &str = meta_name->getString();
#else
						auto str = meta_name->getString();
#endif

						if (options.branch_control.use_shader_metadata)
						{
							if (str == "llvm.loop.unroll.disable")
							{
								node->ir.terminator.force_loop = true;
								node->ir.terminator.force_unroll = false;
							}
							else if (str == "llvm.loop.unroll.full")
							{
								node->ir.terminator.force_unroll = true;
								node->ir.terminator.force_loop = false;
							}
						}

						if (str == "llvm.loop.unroll.count")
							has_partial_unroll = true;
					}
				}
			}

			if (inst->isConditional())
			{
				// Works around some pathological unrolling scenarios where games may unroll based on WaveGetLaneCount().
				bool cond_value;
				if (can_optimize_conditional_branch_to_static(*this, inst->getCondition(), cond_value))
				{
					node->ir.terminator.type = Terminator::Type::Branch;
					node->ir.terminator.direct_block = bb_map[inst->getSuccessor(cond_value ? 0 : 1)]->node;
				}
				else
				{
					node->ir.terminator.type = Terminator::Type::Condition;
					node->ir.terminator.conditional_id = get_id_for_value(inst->getCondition());
					assert(inst->getNumSuccessors() == 2);
					node->ir.terminator.true_block = bb_map[inst->getSuccessor(0)]->node;
					node->ir.terminator.false_block = bb_map[inst->getSuccessor(1)]->node;

					if (options.branch_control.use_shader_metadata)
					{
						auto *branch_meta = inst->getMetadata("dx.controlflow.hints");
						if (branch_meta && branch_meta->getNumOperands() >= 3)
						{
							if (get_constant_metadata(branch_meta, 2) == 1)
							{
								node->ir.terminator.force_branch = true;
								node->ir.terminator.force_flatten = false;
							}
							else if (get_constant_metadata(branch_meta, 2) == 2)
							{
								node->ir.terminator.force_flatten = true;
								node->ir.terminator.force_branch = false;
							}
						}
					}
				}
			}
			else
			{
				node->ir.terminator.type = Terminator::Type::Branch;
				assert(inst->getNumSuccessors() == 1);
				node->ir.terminator.direct_block = bb_map[inst->getSuccessor(0)]->node;

				// If the shader uses partial unrolling, but we see loops anyway,
				// it's very likely we really want this to be a loop.
				// This is somewhat of a hack heuristic to work around a Mesa bug in Lords of the Fallen,
				// but it makes at least some sense ...
				if (has_partial_unroll)
					node->ir.terminator.force_loop = true;
			}
		}
		else if (auto *inst = llvm::dyn_cast<llvm::SwitchInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Switch;

			Terminator::Case default_case = {};
			default_case.is_default = true;
			default_case.node = bb_map[inst->getDefaultDest()]->node;
			node->ir.terminator.cases.push_back(default_case);

			node->ir.terminator.conditional_id = get_id_for_value(inst->getCondition());
			for (auto itr = inst->case_begin(); itr != inst->case_end(); ++itr)
			{
				Terminator::Case switch_case = {};
				switch_case.node = bb_map[itr->getCaseSuccessor()]->node;
				switch_case.value = uint32_t(itr->getCaseValue()->getUniqueInteger().getZExtValue());
				node->ir.terminator.cases.push_back(switch_case);
			}
		}
		else if (auto *inst = llvm::dyn_cast<llvm::ReturnInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Return;
			if (inst->getReturnValue())
				node->ir.terminator.return_value = get_id_for_value(inst->getReturnValue());
		}
		else if (llvm::isa<llvm::UnreachableInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Unreachable;
		}
		else
		{
			LOGE("Unsupported terminator ...\n");
			return {};
		}
	}

	// Rewrite PHI incoming values if we have to.
	if (!phi_incoming_rewrite.empty())
	{
		for (auto *bb : visit_order)
		{
			CFGNode *node = bb_map[bb]->node;
			for (auto &phi : node->ir.phi)
			{
				for (auto &incoming : phi.incoming)
				{
					auto itr = phi_incoming_rewrite.find(incoming.id);
					if (itr != phi_incoming_rewrite.end())
						incoming.id = itr->second;
				}
			}
		}
	}

	return bb_map[visit_order.front()]->node;
}

void Converter::Impl::mark_used_value(const llvm::Value *value)
{
	if (!llvm::isa<llvm::Constant>(value))
	{
		// Technically, we won't be able to eliminate a chain of SSA expressions
		// which are unused this way, but eeeeeeh. DXC really should handle that.
		// This is to deal with odd-ball edge cases where random single SSA instructions
		// were not eliminated for whatever reason.
		llvm_used_ssa_values.insert(value);
	}
}

void Converter::Impl::mark_used_values(const llvm::Instruction *instruction)
{
	if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(instruction))
	{
		for (unsigned i = 0, n = phi_inst->getNumIncomingValues(); i < n; i++)
		{
			auto *incoming = phi_inst->getIncomingValue(i);
			// Ignore self-referential PHI. Someone else need to refer to us.
			if (incoming != phi_inst)
				mark_used_value(incoming);
		}
	}
	else if (const auto *ret_inst = llvm::dyn_cast<llvm::ReturnInst>(instruction))
	{
		if (ret_inst->getReturnValue())
			mark_used_value(ret_inst->getReturnValue());
	}
	else if (const auto *cond_inst = llvm::dyn_cast<llvm::BranchInst>(instruction))
	{
		if (cond_inst->isConditional())
			mark_used_value(cond_inst->getCondition());
	}
	else if (const auto *switch_inst = llvm::dyn_cast<llvm::SwitchInst>(instruction))
	{
		mark_used_value(switch_inst->getCondition());
	}
	else
	{
		for (unsigned i = 0, n = instruction->getNumOperands(); i < n; i++)
			mark_used_value(instruction->getOperand(i));
	}
}

static bool instruction_is_precise_sensitive(const llvm::Instruction *value)
{
	if (auto *binary_op = llvm::dyn_cast<llvm::BinaryOperator>(value))
	{
		auto opcode = binary_op->getOpcode();
		switch (opcode)
		{
		case llvm::BinaryOperator::BinaryOps::FAdd:
		case llvm::BinaryOperator::BinaryOps::FSub:
		case llvm::BinaryOperator::BinaryOps::FMul:
		case llvm::BinaryOperator::BinaryOps::FDiv:
		case llvm::BinaryOperator::BinaryOps::FRem:
			return true;

		default:
			break;
		}
	}
	else if (value_is_dx_op_instrinsic(value, DXIL::Op::FMad) ||
	         value_is_dx_op_instrinsic(value, DXIL::Op::Dot2) ||
	         value_is_dx_op_instrinsic(value, DXIL::Op::Dot2AddHalf) ||
	         value_is_dx_op_instrinsic(value, DXIL::Op::Dot3) ||
	         value_is_dx_op_instrinsic(value, DXIL::Op::Dot4))
	{
		return true;
	}

	return false;
}

static bool instruction_requires_no_contraction(const llvm::Instruction *value)
{
	if (instruction_is_precise_sensitive(value))
	{
		if (auto *binary_op = llvm::dyn_cast<llvm::BinaryOperator>(value))
			return !binary_op->isFast();
		else
			return llvm::cast<llvm::CallInst>(value)->hasMetadata("dx.precise");
	}

	return false;
}

static void propagate_precise(UnorderedSet<const llvm::Instruction *> &cache, const llvm::Instruction *value);

static void mark_precise(UnorderedSet<const llvm::Instruction *> &cache, const llvm::Value *value)
{
	// Stop propagating when we hit something not an instruction, i.e. a constant or variable (alloca is very rare).
	if (auto *inst = llvm::dyn_cast<llvm::Instruction>(value))
	{
		if (instruction_is_precise_sensitive(inst) && !instruction_requires_no_contraction(inst))
		{
			if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(inst))
				const_cast<llvm::CallInst *>(call_inst)->setMetadata("dx.precise", nullptr);
			else if (auto *binary_op = llvm::dyn_cast<llvm::BinaryOperator>(inst))
				const_cast<llvm::BinaryOperator *>(binary_op)->setFast(false);
		}

		propagate_precise(cache, inst);
	}
}

static void propagate_precise(UnorderedSet<const llvm::Instruction *> &cache, const llvm::Instruction *value)
{
	if (cache.count(value) != 0)
		return;
	cache.insert(value);

	if (const auto *phi = llvm::dyn_cast<llvm::PHINode>(value))
	{
		for (unsigned i = 0, n = phi->getNumIncomingValues(); i < n; i++)
			mark_precise(cache, phi->getIncomingValue(i));
	}
	else
	{
		for (unsigned i = 0, n = value->getNumOperands(); i < n; i++)
			mark_precise(cache, value->getOperand(i));
	}
}

static void propagate_precise(llvm::Function *func)
{
	Vector<const llvm::Instruction *> precise_instructions;
	for (auto &bb : *func)
		for (auto &inst : bb)
			if (instruction_requires_no_contraction(&inst))
				precise_instructions.push_back(&inst);

	UnorderedSet<const llvm::Instruction *> visitation_cache;
	for (auto *inst : precise_instructions)
		propagate_precise(visitation_cache, inst);
}

void Converter::Impl::analyze_instructions_post_execution_modes()
{
	if (!shader_analysis.has_group_shared_barrier &&
	    shader_analysis.has_group_shared_access)
	{
		unsigned num_threads = execution_mode_meta.workgroup_threads[0] *
		                       execution_mode_meta.workgroup_threads[1] *
		                       execution_mode_meta.workgroup_threads[2];

		if (num_threads <= 32 && num_threads > 1)
		{
			// This is a case that might just happen to work if the game assumes lock-step execution on NV + AMD (rip Intel).
			// If the group size is larger, it's extremely unlikely the game "just works" by chance on native drivers.
			// Some shaders seem to use groupshared as a sort of "scratch space" per thread, which
			// is a valid use case and does not require barriers to be correct.
			shader_analysis.needs_auto_group_shared_barriers = true;
		}
	}
}

bool Converter::Impl::analyze_instructions(llvm::Function *func)
{
	// Need to analyze this in two stages.
	// In the first stage, we need to analyze:
	// - Load/GetElementPtr to handle lib global variables
	// - CreateHandle family to build LLVM access handles
	// - ExtractValue to track which components are used for BufferLoad.
	// In the second phase we analyze the buffer loads and stores and figure out
	// alignments of the loads and stores. This lets us build up a list of SSBO declarations we need to
	// optimally implement the loads and stores. We need to do this late, because we depend on results
	// of ExtractValue analysis.

	if (func && options.propagate_precise && !options.force_precise)
		propagate_precise(func);

	auto visit_order = build_function_bb_visit_order_analysis(func);

	for (auto *bb : visit_order)
	{
		if (options.eliminate_dead_code)
			mark_used_values(bb->getTerminator());

		for (auto &inst : *bb)
		{
			if (options.eliminate_dead_code)
				mark_used_values(&inst);

			if (auto *load_inst = llvm::dyn_cast<llvm::LoadInst>(&inst))
			{
				if (!analyze_load_instruction(*this, load_inst))
					return false;
			}
			else if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(&inst))
			{
				if (!analyze_phi_instruction(*this, phi_inst))
					return false;
			}
			else if (auto *store_inst = llvm::dyn_cast<llvm::StoreInst>(&inst))
			{
				if (!analyze_store_instruction(*this, store_inst))
					return false;
			}
			else if (auto *atomicrmw_inst = llvm::dyn_cast<llvm::AtomicRMWInst>(&inst))
			{
				if (!analyze_atomicrmw_instruction(*this, atomicrmw_inst))
					return false;
			}
			else if (auto *cmpxchg_inst = llvm::dyn_cast<llvm::AtomicCmpXchgInst>(&inst))
			{
				if (!analyze_cmpxchg_instruction(*this, cmpxchg_inst))
					return false;
			}
			else if (auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(&inst))
			{
				if (!analyze_alloca_instruction(*this, alloca_inst))
					return false;
			}
			else if (auto *getelementptr_inst = llvm::dyn_cast<llvm::GetElementPtrInst>(&inst))
			{
				if (!analyze_getelementptr_instruction(*this, getelementptr_inst))
					return false;
			}
			else if (auto *extractvalue_inst = llvm::dyn_cast<llvm::ExtractValueInst>(&inst))
			{
				if (!analyze_extractvalue_instruction(*this, extractvalue_inst))
					return false;
			}
			else if (auto *cmp_inst = llvm::dyn_cast<llvm::CmpInst>(&inst))
			{
				if (!analyze_compare_instruction(*this, cmp_inst))
					return false;
			}
			else if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&inst))
			{
				auto *called_function = call_inst->getCalledFunction();
				if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
				{
					if (!analyze_dxil_instruction(*this, call_inst, bb))
						return false;
				}
			}
		}

		// Reset AGS tracking for every BB.
		ags.reset();
	}

	for (auto *bb : visit_order)
	{
		for (auto &inst : *bb)
		{
			if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&inst))
			{
				auto *called_function = call_inst->getCalledFunction();
				if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
				{
					if (!analyze_dxil_buffer_access_instruction(*this, call_inst))
						return false;
				}
			}
		}

		// Reset AGS tracking for every BB.
		ags.reset();
	}

	for (auto &alloc : alloca_tracking)
	{
		// Mark required resource aliases before we emit resources. Defer some work until after resource creation.
		const auto *scalar_type =
		    alloc.first->getType()->getPointerElementType()->getArrayElementType();
		if (!analyze_alloca_cbv_forwarding_pre_resource_emit(*this, scalar_type, alloc.second))
			return false;
	}

	ags.reset_analysis();

	if (shader_analysis.require_wmma)
		execution_mode_meta.memory_model = spv::MemoryModelVulkan;

	return true;
}

bool Converter::Impl::composite_is_accessed(const llvm::Value *composite) const
{
	return llvm_composite_meta.find(composite) != llvm_composite_meta.end();
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result = {};

	auto &module = bitcode_parser.get_module();
	entry_point_meta = get_entry_point_meta(module, options.entry_point.empty() ? nullptr : options.entry_point.c_str());
	execution_model = get_execution_model(module, entry_point_meta);
	execution_model_lib_target = get_execution_model_lib_target(module, entry_point_meta);

	if (execution_model_lib_target && execution_model == spv::ExecutionModelGLCompute)
	{
		// Might as well go with SPIR-V 1.6. Then we get subgroup size control semantics for "free".
		// When we're willing to do a clean break with Fossilize all shaders should target SPIR-V 1.6.
		spirv_module.set_override_spirv_version(0x10600);
	}
	else if (execution_model == spv::ExecutionModelFragment &&
	         resource_mapping_iface && resource_mapping_iface->has_nontrivial_stage_input_remapping())
	{
		// Force SPIR-V 1.4 for fragment shaders if we might end up requiring mesh shader capabilities.
		// Non-trivial stage input remapping may require PerPrimitiveEXT decoration.
		spirv_module.set_override_spirv_version(0x10400);
	}

	if (!entry_point_meta)
	{
		if (!options.entry_point.empty())
			LOGE("Could not find entry point \"%s\".\n", options.entry_point.c_str());
		else
			LOGE("Could not find any entry point.\n");
		return result;
	}

	if (!options.shader_source_file.empty())
	{
		auto &builder = spirv_module.get_builder();
		uint32_t sm_major = 0, sm_minor = 0;
		get_shader_model(module, nullptr, &sm_major, &sm_minor);
		builder.setSource(spv::SourceLanguageUnknown, sm_major * 100 + sm_minor);
		builder.setSourceFile(options.shader_source_file);
	}

	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	bool need_bda =
		options.physical_storage_buffer ||
		(execution_model_lib_target &&
		 execution_model == spv::ExecutionModelGLCompute);

	spirv_module.set_descriptor_qa_info(options.descriptor_qa);
	options.instruction_instrumentation.fp16 =
	    options.min_precision_prefer_native_16bit || execution_mode_meta.native_16bit_operations;
	spirv_module.set_instruction_instrumentation_info(options.instruction_instrumentation);

	llvm::Function *func = get_entry_point_function(entry_point_meta);
	auto visit_order = build_function_bb_visit_order_legacy(func, pool);
	Vector<llvm::BasicBlock *> patch_visit_order;

	// dxilconv emits somewhat broken code for min16float for resource access.
	// Just use FP32 here since that's what we've tested and avoids lots of awkward workarounds.
	if (module_is_dxilconv(module))
		options.min_precision_prefer_native_16bit = false;

	// Need to analyze some execution modes early which affect opcode analysis later.
	if (!analyze_execution_modes_meta())
		return result;
	if (!emit_resources_global_mapping())
		return result;
	if (!analyze_instructions(func))
		return result;

	spirv_module.emit_entry_point(get_execution_model(module, entry_point_meta), "main", need_bda,
	                              execution_mode_meta.memory_model);

	if (!emit_execution_modes())
		return result;

	if (execution_mode_meta.patch_constant_function)
	{
		patch_visit_order = build_function_bb_visit_order_legacy(execution_mode_meta.patch_constant_function, pool);
		if (!analyze_instructions(execution_mode_meta.patch_constant_function))
			return result;
	}

	if (!emit_resources())
		return result;
	if (!emit_stage_input_variables())
		return result;
	if (!emit_stage_output_variables())
		return result;
	if (!emit_patch_variables())
		return result;
	if (!emit_other_variables())
		return result;
	if (!emit_global_variables())
		return result;

	// Some execution modes depend on other execution modes, so handle that here.
	if (!emit_execution_modes_late())
		return result;

	analyze_instructions_post_execution_modes();

	execution_mode_meta.entry_point_name = get_entry_point_name(entry_point_meta);

	if (execution_model == spv::ExecutionModelTessellationControl)
		result.entry = build_hull_main(visit_order, patch_visit_order, pool, result.leaf_functions);
	else if (execution_mode_meta.declares_rov)
		result.entry = build_rov_main(visit_order, pool, result.leaf_functions);
	else if (execution_model_lib_target && execution_model == spv::ExecutionModelGLCompute)
		result.entry = build_node_main(visit_order, pool, result.leaf_functions);
	else
	{
		result.entry.entry = convert_function(visit_order, true);
		if (shader_analysis.needs_auto_group_shared_barriers && options.quirks.group_shared_auto_barrier)
		{
			CFGStructurizer cfg{result.entry.entry, pool, spirv_module};
			cfg.rewrite_auto_group_shared_barrier();
		}

		if (shader_analysis.require_subgroup_shuffles)
		{
			CFGStructurizer cfg{result.entry.entry, pool, spirv_module};
			cfg.flatten_subgroup_shuffles();
		}

		result.entry.func = spirv_module.get_entry_function();
	}

	// Some execution modes depend on code generation, handle that here.
	emit_execution_modes_post_code_generation();

	return result;
}

Operation *Converter::Impl::allocate(spv::Op op)
{
	return spirv_module.allocate_op(op);
}

Operation *Converter::Impl::allocate(spv::Op op, spv::Id id, spv::Id type_id)
{
	assert(type_id != 0);
	assert(id != 0);
	return spirv_module.allocate_op(op, id, type_id);
}

Operation *Converter::Impl::allocate(spv::Op op, spv::Id type_id)
{
	assert(type_id != 0);
	return spirv_module.allocate_op(op, spirv_module.allocate_id(), type_id);
}

Operation *Converter::Impl::allocate(spv::Op op, const llvm::Value *value)
{
	// Constant expressions cannot have an associated opcode ID to them.
	assert(!llvm::isa<llvm::ConstantExpr>(value));
	return spirv_module.allocate_op(op, get_id_for_value(value), get_type_id(value->getType()));
}

Operation *Converter::Impl::allocate(spv::Op op, const llvm::Value *value, spv::Id type_id)
{
	// Constant expressions cannot have an associated opcode ID to them.
	assert(!llvm::isa<llvm::ConstantExpr>(value));
	assert(type_id != 0);
	return spirv_module.allocate_op(op, get_id_for_value(value), type_id);
}

void Converter::Impl::rewrite_value(const llvm::Value *value, spv::Id id)
{
	auto value_itr = value_map.find(value);
	if (value_itr != value_map.end())
	{
		if (value_itr->second != id)
		{
			// If a PHI node previously accessed the value ID map, it will now refer to a dead
			// ID. Remember to rewrite PHI incoming nodes as necessary.
			phi_incoming_rewrite[value_itr->second] = id;
			value_itr->second = id;
		}
	}
	else
		value_map[value] = id;
}

void Converter::Impl::add(Operation *op, bool is_rov)
{
	assert(current_block);
	if (is_rov)
		current_block->push_back(allocate(spv::OpBeginInvocationInterlockEXT));
	current_block->push_back(op);
	if (is_rov)
		current_block->push_back(allocate(spv::OpEndInvocationInterlockEXT));
}

void Converter::Impl::register_externally_visible_write(const llvm::Value *value)
{
	if (!options.instruction_instrumentation.enabled ||
	    options.instruction_instrumentation.type != InstructionInstrumentationType::ExternallyVisibleWriteNanInf)
		return;

	// Ignore undefs and intentional nan/inf writes.
	if (llvm::isa<llvm::Constant>(value))
		return;

	// Punch through any bitcasts.
	// Sometimes, shaders want to store floats as uints for practical reasons.
	while (llvm::isa<llvm::CastInst>(value))
	{
		auto *cast = llvm::cast<llvm::CastInst>(value);
		if (cast->getOpcode() == llvm::CastInst::CastOps::BitCast)
			value = cast->getOperand(0);
		else
			break;
	}

	switch (value->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
	case llvm::Type::TypeID::FloatTyID:
	case llvm::Type::TypeID::DoubleTyID:
	{
		auto *op = allocate(spv::PseudoOpInstrumentExternallyVisibleStore);
		op->add_id(get_id_for_value(value));
		add(op);
		break;
	}

	default:
		break;
	}
}

spv::Builder &Converter::Impl::builder()
{
	return spirv_module.get_builder();
}

spv::Id Converter::Impl::create_variable(spv::StorageClass storage, spv::Id type_id, const char *name)
{
	return spirv_module.create_variable(storage, type_id, name);
}

spv::Id Converter::Impl::create_variable_with_initializer(spv::StorageClass storage, spv::Id type_id,
                                                          spv::Id initializer, const char *name)
{
	return spirv_module.create_variable_with_initializer(storage, type_id, initializer, name);
}

spv::StorageClass Converter::Impl::get_effective_storage_class(const llvm::Value *value, spv::StorageClass fallback) const
{
	auto itr = handle_to_storage_class.find(value);
	if (itr != handle_to_storage_class.end())
		return itr->second;
	else
		return fallback;
}

bool Converter::Impl::get_needs_temp_storage_copy(const llvm::Value *value) const
{
	// We always need a temp storage copy if this isn't
	// directly the result of an alloca instruction.
	if (!llvm::dyn_cast<llvm::AllocaInst>(value))
		return true;

	// We'll also need a temp storage copy if this
	// alloca is directly referenced by
	// a TraceRay AND a CallShader.
	return needs_temp_storage_copy.count(value) != 0;
}

spv::Id Converter::Impl::get_temp_payload(spv::Id type, spv::StorageClass storage)
{
	for (const auto &temp_payload : temp_payloads)
	{
		if (temp_payload.type == type && temp_payload.storage == storage)
			return temp_payload.id;
	}

	spv::Id var_id = create_variable(storage, type);

	temp_payloads.push_back(TempPayloadEntry{ type, storage, var_id });
	return var_id;
}

DXIL::ComponentType Converter::Impl::get_effective_typed_resource_type(DXIL::ComponentType type)
{
	// Expand/contract on load/store.
	// DXIL can emit half textures for example,
	// but we need to contract or expand instead.
	return convert_16bit_component_to_32bit(type);
}

DXIL::ComponentType Converter::Impl::get_effective_input_output_type(DXIL::ComponentType type)
{
	bool supports_narrow_arith_type = type != DXIL::ComponentType::F16 || support_native_fp16_operations();
	if (options.storage_16bit_input_output && supports_narrow_arith_type)
	{
		if (component_type_is_16bit(type))
			builder().addCapability(spv::CapabilityStorageInputOutput16);
	}
	else
	{
		// Expand/contract on load/store.
		// The only reasonable way this can break is if application relies on
		// lower precision in interpolation, but I don't think you can rely on that
		// kind of implementation detail ...
		type = convert_16bit_component_to_32bit(type);
	}

	return type;
}

spv::Id Converter::Impl::get_effective_input_output_type_id(DXIL::ComponentType type)
{
	return get_type_id(get_effective_input_output_type(type), 1, 1);
}

bool Converter::Impl::type_can_relax_precision(const llvm::Type *type, bool known_integer_sign) const
{
	if (!options.arithmetic_relaxed_precision)
		return false;

	if (type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
		type = llvm::cast<llvm::ArrayType>(type)->getArrayElementType();
	if (type->getTypeID() == llvm::Type::TypeID::VectorTyID)
		type = llvm::cast<llvm::VectorType>(type)->getElementType();

	return (!execution_mode_meta.native_16bit_operations && !options.min_precision_prefer_native_16bit) &&
	       (type->getTypeID() == llvm::Type::TypeID::HalfTyID ||
	        (type->getTypeID() == llvm::Type::TypeID::IntegerTyID && type->getIntegerBitWidth() == 16 &&
	         known_integer_sign));
}

void Converter::Impl::decorate_relaxed_precision(const llvm::Type *type, spv::Id id, bool known_integer_sign)
{
	// Ignore RelaxedPrecision for integers since they are untyped in LLVM for the most part.
	// For texture loading operations and similar, we load in the appropriate sign, so it's safe to use RelaxedPrecision,
	// since RelaxedPrecision may sign-extend based on the OpTypeInt's signage.
	// DXIL is kinda broken in this regard since min16int and min16uint lower to the same i16 type ... :(
	if (type_can_relax_precision(type, known_integer_sign))
		builder().addDecoration(id, spv::DecorationRelaxedPrecision);
}

void Converter::Impl::set_option(const OptionBase &cap)
{
	switch (cap.type)
	{
	case Option::ShaderDemoteToHelper:
		options.shader_demote = static_cast<const OptionShaderDemoteToHelper &>(cap).supported;
		break;

	case Option::DualSourceBlending:
		options.dual_source_blending = static_cast<const OptionDualSourceBlending &>(cap).enabled;
		break;

	case Option::OutputSwizzle:
	{
		auto &swiz = static_cast<const OptionOutputSwizzle &>(cap);
		options.output_swizzles.clear();
		options.output_swizzles.insert(options.output_swizzles.end(), swiz.swizzles,
		                               swiz.swizzles + swiz.swizzle_count);
		break;
	}

	case Option::RasterizerSampleCount:
	{
		auto &count = static_cast<const OptionRasterizerSampleCount &>(cap);
		options.rasterizer_sample_count = count.count;
		options.rasterizer_sample_count_spec_constant = count.spec_constant;
		break;
	}

	case Option::RootConstantInlineUniformBlock:
	{
		auto &ubo = static_cast<const OptionRootConstantInlineUniformBlock &>(cap);
		options.inline_ubo_descriptor_set = ubo.desc_set;
		options.inline_ubo_descriptor_binding = ubo.binding;
		options.inline_ubo_enable = ubo.enable;
		break;
	}

	case Option::BindlessCBVSSBOEmulation:
	{
		auto &bindless = static_cast<const OptionBindlessCBVSSBOEmulation &>(cap);
		options.bindless_cbv_ssbo_emulation = bindless.enable;
		break;
	}

	case Option::PhysicalStorageBuffer:
	{
		auto &psb = static_cast<const OptionPhysicalStorageBuffer &>(cap);
		options.physical_storage_buffer = psb.enable;
		break;
	}

	case Option::SBTDescriptorSizeLog2:
	{
		auto &sbt = static_cast<const OptionSBTDescriptorSizeLog2 &>(cap);
		options.sbt_descriptor_size_srv_uav_cbv_log2 = sbt.size_log2_srv_uav_cbv;
		options.sbt_descriptor_size_sampler_log2 = sbt.size_log2_sampler;
		break;
	}

	case Option::SSBOAlignment:
	{
		auto &align = static_cast<const OptionSSBOAlignment &>(cap);
		options.ssbo_alignment = align.alignment;
		break;
	}

	case Option::TypedUAVReadWithoutFormat:
	{
		auto &uav = static_cast<const OptionTypedUAVReadWithoutFormat &>(cap);
		options.typed_uav_read_without_format = uav.supported;
		break;
	}

	case Option::ShaderSourceFile:
	{
		auto &file = static_cast<const OptionShaderSourceFile &>(cap);
		if (!file.name.empty())
			options.shader_source_file = file.name;
		else
			options.shader_source_file.clear();
		break;
	}

	case Option::BindlessTypedBufferOffsets:
	{
		auto &off = static_cast<const OptionBindlessTypedBufferOffsets &>(cap);
		options.bindless_typed_buffer_offsets = off.enable;
		break;
	}

	case Option::BindlessOffsetBufferLayout:
	{
		auto &off = static_cast<const OptionBindlessOffsetBufferLayout &>(cap);
		options.offset_buffer_layout = { off.untyped_offset, off.typed_offset, off.stride };
		break;
	}

	case Option::StorageInputOutput16:
	{
		auto &storage = static_cast<const OptionStorageInputOutput16 &>(cap);
		options.storage_16bit_input_output = storage.supported;
		break;
	}

	case Option::DescriptorQA:
	{
		auto &qa = static_cast<const OptionDescriptorQA &>(cap);
		options.descriptor_qa_enabled = qa.enabled;
		options.descriptor_qa.version = qa.version;
		options.descriptor_qa.shader_hash = qa.shader_hash;
		options.descriptor_qa.global_desc_set = qa.global_desc_set;
		options.descriptor_qa.global_binding = qa.global_binding;
		options.descriptor_qa.heap_desc_set = qa.heap_desc_set;
		options.descriptor_qa.heap_binding = qa.heap_binding;
		break;
	}

	case Option::MinPrecisionNative16Bit:
	{
		auto &minprec = static_cast<const OptionMinPrecisionNative16Bit &>(cap);
		options.min_precision_prefer_native_16bit = minprec.enabled;
		break;
	}

	case Option::ShaderI8Dot:
		options.shader_i8_dot_enabled = static_cast<const OptionShaderI8Dot &>(cap).supported;
		break;

	case Option::ShaderRayTracingPrimitiveCulling:
		options.ray_tracing_primitive_culling_enabled =
		    static_cast<const OptionShaderRayTracingPrimitiveCulling &>(cap).supported;
		break;

	case Option::InvariantPosition:
		options.invariant_position = static_cast<const OptionInvariantPosition &>(cap).enabled;
		break;

	case Option::ScalarBlockLayout:
		options.scalar_block_layout =
		    static_cast<const OptionScalarBlockLayout &>(cap).supported;
		options.supports_per_component_robustness =
		    static_cast<const OptionScalarBlockLayout &>(cap).supports_per_component_robustness;
		break;

	case Option::BarycentricKHR:
		options.khr_barycentrics_enabled = static_cast<const OptionBarycentricKHR &>(cap).supported;
		break;

	case Option::RobustPhysicalCBVLoad:
		// Obsolete option, use normal quirks instead.
		options.quirks.robust_physical_cbv = static_cast<const OptionRobustPhysicalCBVLoad &>(cap).enabled;
		break;

	case Option::ArithmeticRelaxedPrecision:
		options.arithmetic_relaxed_precision = static_cast<const OptionArithmeticRelaxedPrecision &>(cap).enabled;
		break;

	case Option::PhysicalAddressDescriptorIndexing:
		options.physical_address_descriptor_stride =
		    static_cast<const OptionPhysicalAddressDescriptorIndexing &>(cap).element_stride;
		options.physical_address_descriptor_offset =
			static_cast<const OptionPhysicalAddressDescriptorIndexing &>(cap).element_offset;
		break;

	case Option::ForceSubgroupSize:
		options.force_subgroup_size =
			static_cast<const OptionForceSubgroupSize &>(cap).forced_value;
		options.force_wave_size_enable =
			static_cast<const OptionForceSubgroupSize &>(cap).wave_size_enable;
		break;

	case Option::DenormPreserveSupport:
		options.supports_float16_denorm_preserve =
		    static_cast<const OptionDenormPreserveSupport &>(cap).support_float16_denorm_preserve;
		options.supports_float64_denorm_preserve =
		    static_cast<const OptionDenormPreserveSupport &>(cap).support_float64_denorm_preserve;
		break;

	case Option::StrictHelperLaneWaveOps:
		options.strict_helper_lane_waveops =
		    static_cast<const OptionStrictHelperLaneWaveOps &>(cap).enable;
		break;

	case Option::SubgroupPartitionedNV:
		options.nv_subgroup_partition_enabled =
		    static_cast<const OptionSubgroupPartitionedNV &>(cap).supported;
		break;

	case Option::DeadCodeEliminate:
		options.eliminate_dead_code =
			static_cast<const OptionDeadCodeEliminate &>(cap).enabled;
		break;

	case Option::PreciseControl:
		options.propagate_precise =
		    static_cast<const OptionPreciseControl &>(cap).propagate_precise;
		options.force_precise =
		    static_cast<const OptionPreciseControl &>(cap).force_precise;
		break;

	case Option::SampleGradOptimizationControl:
		options.grad_opt.enabled =
		    static_cast<const OptionSampleGradOptimizationControl &>(cap).enabled;
		options.grad_opt.assume_uniform_scale =
			static_cast<const OptionSampleGradOptimizationControl &>(cap).assume_uniform_scale;
		break;

	case Option::OpacityMicromap:
		options.opacity_micromap_enabled =
		    static_cast<const OptionOpacityMicromap &>(cap).enabled;
		break;

	case Option::BranchControl:
	{
		auto &c = static_cast<const OptionBranchControl &>(cap);
		options.branch_control.use_shader_metadata = c.use_shader_metadata;
		options.branch_control.force_branch = c.force_branch;
		options.branch_control.force_unroll = c.force_unroll;
		options.branch_control.force_loop = c.force_loop;
		options.branch_control.force_flatten = c.force_flatten;
		break;
	}

	case Option::SubgroupProperties:
	{
		auto &c = static_cast<const OptionSubgroupProperties &>(cap);
		options.subgroup_size.implementation_minimum = c.minimum_size;
		options.subgroup_size.implementation_maximum = c.maximum_size;
		break;
	}

	case Option::DescriptorHeapRobustness:
	{
		auto &c = static_cast<const OptionDescriptorHeapRobustness &>(cap);
		options.descriptor_heap_robustness = c.enabled;
		break;
	}

	case Option::ComputeShaderDerivativesNV:
	{
		auto &c = static_cast<const OptionComputeShaderDerivativesNV &>(cap);
		options.compute_shader_derivatives = c.supported;
		break;
	}

	case Option::QuadControlReconvergence:
	{
		auto &c = static_cast<const OptionQuadControlReconvergence &>(cap);
		options.supports_quad_control = c.supports_quad_control;
		options.supports_maximal_reconvergence = c.supports_maximal_reconvergence;
		options.force_maximal_reconvergence = c.force_maximal_reconvergence;
		break;
	}

	case Option::RawAccessChainsNV:
	{
		auto &c = static_cast<const OptionRawAccessChainsNV &>(cap);
		options.nv_raw_access_chains = c.supported;
		break;
	}

	case Option::DriverVersion:
	{
		auto &c = static_cast<const OptionDriverVersion &>(cap);
		options.driver_id = c.driver_id;
		options.driver_version = c.driver_version;
		break;
	}

	case Option::ComputeShaderDerivatives:
	{
		auto &c = static_cast<const OptionComputeShaderDerivatives &>(cap);
		options.compute_shader_derivatives = c.supports_nv || c.supports_khr;
		options.compute_shader_derivatives_khr = c.supports_khr;
		break;
	}

	case Option::InstructionInstrumentation:
	{
		auto &qa = static_cast<const OptionInstructionInstrumentation &>(cap);
		options.instruction_instrumentation.enabled = qa.enabled;
		options.instruction_instrumentation.version = qa.version;
		options.instruction_instrumentation.shader_hash = qa.shader_hash;
		options.instruction_instrumentation.fp16 = false;
		options.instruction_instrumentation.fp32 = true;
		options.instruction_instrumentation.fp64 = true;
		options.instruction_instrumentation.type = qa.type;
		options.instruction_instrumentation.control_desc_set = qa.control_desc_set;
		options.instruction_instrumentation.control_binding = qa.control_binding;
		options.instruction_instrumentation.payload_desc_set = qa.payload_desc_set;
		options.instruction_instrumentation.payload_binding = qa.payload_binding;
		break;
	}

	case Option::ShaderQuirk:
	{
		auto &quirk = static_cast<const OptionShaderQuirk &>(cap);
		switch (quirk.quirk)
		{
		case ShaderQuirk::ForceDeviceMemoryBarriersThreadGroupCoherence:
			// Dragon Age: Veilguard workaround.
			options.quirks.force_device_memory_barriers_thread_group_coherence = true;
			break;

		case ShaderQuirk::AssumeBrokenSub8x8CubeMips:
			// The First Descendant workaround. Importance sampling pass is broken since only mips down to 8x8
			// are populated with valid data.
			options.quirks.assume_broken_sub_8x8_cube_mips = true;
			break;

		case ShaderQuirk::RobustPhysicalCBVForwarding:
			// Gray Zone Warfare workaround. Does CBV forwarding with out of bounds access on the local array <_<.
			// Can trip page faults.
			options.quirks.robust_physical_cbv_forwarding = true;
			break;

		case ShaderQuirk::MeshOutputRobustness:
			options.quirks.mesh_outputs_bounds_check = true;
			break;

		case ShaderQuirk::AggressiveNonUniform:
			// Starfield workaround. Some shaders should have used nonuniform,
			// but the general pattern to detect it is quite complicated.
			options.quirks.aggressive_nonuniform = true;
			break;

		case ShaderQuirk::RobustPhysicalCBV:
			options.quirks.robust_physical_cbv = true;
			break;

		case ShaderQuirk::PromoteGroupToDeviceMemoryBarrier:
			options.quirks.promote_group_to_device_memory_barrier = true;
			break;

		case ShaderQuirk::GroupSharedAutoBarrier:
			options.quirks.group_shared_auto_barrier = true;
			break;

		default:
			break;
		}
		break;
	}

	case Option::ExtendedRobustness:
	{
		auto &robust = static_cast<const OptionExtendedRobustness &>(cap);
		options.extended_robustness.alloca = robust.robust_alloca;
		options.extended_robustness.constant_lut = robust.robust_constant_lut;
		options.extended_robustness.group_shared = robust.robust_group_shared;
		break;
	}

	case Option::MaxTessFactor:
	{
		auto &tess_factor = static_cast<const OptionMaxTessFactor &>(cap);
		options.max_tess_factor = tess_factor.max_tess_factor;
		break;
	}

	case Option::VulkanMemoryModel:
	{
		auto &vmm = static_cast<const OptionVulkanMemoryModel &>(cap);
		execution_mode_meta.memory_model = vmm.enabled ? spv::MemoryModelVulkan : spv::MemoryModelGLSL450;
		break;
	}

	default:
		break;
	}
}

void Converter::Impl::suggest_maximum_wave_size(unsigned wave_size)
{
	if ((execution_mode_meta.heuristic_max_wave_size == 0 ||
	     execution_mode_meta.heuristic_max_wave_size > wave_size) &&
	    options.force_subgroup_size == 0)
	{
		execution_mode_meta.heuristic_max_wave_size = wave_size;
	}
}

void Converter::Impl::push_ags_instruction(const llvm::CallInst *instruction)
{
	uint32_t op = 0;
	if (!get_constant_operand(instruction, 2, &op))
		return;

	if (!is_ags_magic(op))
		return;

	auto inst = decode_ags_instruction(op);

	switch (inst.opcode)
	{
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavLoad:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavStore:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixCopy:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsLoad:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsStore:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixMulAcc:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixFill:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementFill:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLength:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementExtract:
		shader_analysis.require_subgroups = true;
		shader_analysis.require_wmma = true;
		break;
	}

	// Reset if we're beginning a new instruction sequence.
	// New instruction type, reset.
	if (inst.phase < ags.current_phase ||
	    (ags.num_instructions && inst.opcode != ags.instructions[0].opcode))
	{
		ags.reset();
	}

	if ((inst.phase == ags.current_phase || (inst.phase == ags.current_phase + 1)) &&
	    inst.phase <= ags.num_instructions &&
	    ags.num_instructions < AgsInstruction::MaxInstructions)
	{
		ags.instructions[ags.num_instructions] = inst;
		ags.backdoor_instructions[ags.num_instructions] = instruction;
		ags.num_instructions++;
		ags.current_phase = inst.phase;
	}
}

void Converter::set_resource_remapping_interface(ResourceRemappingInterface *iface)
{
	impl->resource_mapping_iface = iface;
}

ShaderStage Converter::get_shader_stage(const LLVMBCParser &bitcode_parser, const char *entry)
{
	auto &module = bitcode_parser.get_module();
	return Impl::get_remapping_stage(get_execution_model(module, get_entry_point_meta(module, entry)));
}

void Converter::scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &bitcode_parser)
{
	Impl::scan_resources(iface, bitcode_parser);
}

void Converter::add_option(const OptionBase &cap)
{
	impl->set_option(cap);
}

bool Converter::recognizes_option(Option cap)
{
	return unsigned(cap) < unsigned(Option::Count);
}

void Converter::set_entry_point(const char *entry)
{
	impl->options.entry_point = entry;
}

const String &Converter::get_compiled_entry_point() const
{
	return impl->execution_mode_meta.entry_point_name;
}

const GlobalConfiguration &GlobalConfiguration::get()
{
	static GlobalConfiguration config;
	return config;
}

GlobalConfiguration::GlobalConfiguration()
{
	const char *env = getenv("DXIL_SPIRV_CONFIG");
	if (env)
	{
		if (strcmp(env, "wmma_fp8_hack") == 0)
			wmma_fp8_hack = true;
		else if (strcmp(env, "wmma_rdna3_workaround") == 0)
			wmma_rdna3_workaround = true;
	}
}
} // namespace dxil_spv
