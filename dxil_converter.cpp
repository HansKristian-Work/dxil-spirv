/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */

#include "opcodes/converter_impl.hpp"
#include "opcodes/opcodes_dxil_builtins.hpp"
#include "opcodes/opcodes_llvm_builtins.hpp"

#include "dxil_converter.hpp"
#include "logging.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"

#include <utility>

namespace dxil_spv
{
Converter::Converter(LLVMBCParser &bitcode_parser_, SPIRVModule &module_)
{
	impl = std::make_unique<Impl>(bitcode_parser_, module_);
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

static dxil_spv::String get_string_metadata(const llvm::MDNode *node, unsigned index)
{
#ifdef HAVE_LLVMBC
	return llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
#else
	std::string tmp = llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
	String str(tmp.begin(), tmp.end());
	return str;
#endif
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

static spv::Id build_ssbo_runtime_array_type(Converter::Impl &impl, unsigned bits, unsigned vecsize,
                                             unsigned range_size, const char *name)
{
	auto &builder = impl.builder();
	spv::Id uint_type = builder.makeUintType(bits);
	if (vecsize > 1)
		uint_type = builder.makeVectorType(uint_type, vecsize);
	spv::Id uint_array_type = builder.makeRuntimeArray(uint_type);
	builder.addDecoration(uint_array_type, spv::DecorationArrayStride, vecsize * (bits / 8));
	spv::Id block_type_id = impl.get_struct_type({ uint_array_type }, name);
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

spv::Id Converter::Impl::create_bindless_heap_variable(const BindlessInfo &info)
{
	auto itr = std::find_if(bindless_resources.begin(), bindless_resources.end(), [&](const BindlessResource &resource) {
		return
		    resource.info.type == info.type &&
			resource.info.component == info.component &&
			resource.info.kind == info.kind &&
			resource.info.desc_set == info.desc_set &&
			resource.info.format == info.format &&
			resource.info.binding == info.binding &&
			resource.info.uav_read == info.uav_read &&
			resource.info.uav_written == info.uav_written &&
			resource.info.uav_coherent == info.uav_coherent &&
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
					type_id = build_ssbo_runtime_array_type(*this, 32, 2, 1, "RTASHeap");
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
				unsigned bits;
				if (info.component == DXIL::ComponentType::U16)
					bits = 16;
				else if (info.component == DXIL::ComponentType::U32)
					bits = 32;
				else
				{
					LOGE("Invalid component type for SSBO.\n");
					return 0;
				}

				if (info.offsets)
					type_id = build_ssbo_runtime_array_type(*this, 32, 2, 1, "SSBO_Offsets");
				else
					type_id = build_ssbo_runtime_array_type(*this, bits, 1, ~0u, "SSBO");
				storage = spv::StorageClassStorageBuffer;
			}
			else
			{
				if (info.component != DXIL::ComponentType::U32 &&
				    info.component != DXIL::ComponentType::I32 &&
				    info.component != DXIL::ComponentType::F32 &&
				    info.component != DXIL::ComponentType::UNormF32)
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
				if (!physical_counter_type)
				{
					spv::Id counter_type_id = get_struct_type({ builder().makeUintType(32) }, "AtomicCounter");
					builder().addDecoration(counter_type_id, spv::DecorationBlock);
					builder().addMemberDecoration(counter_type_id, 0, spv::DecorationOffset, 0);
					physical_counter_type =
					    builder().makePointer(spv::StorageClassPhysicalStorageBuffer, counter_type_id);
				}

				spv::Id runtime_array_type_id = builder().makeRuntimeArray(physical_counter_type);
				builder().addDecoration(runtime_array_type_id, spv::DecorationArrayStride, sizeof(uint64_t));

				type_id = get_struct_type({ runtime_array_type_id }, "AtomicCounters");
				builder().addDecoration(type_id, spv::DecorationBlock);
				builder().addMemberName(type_id, 0, "counters");
				builder().addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
				builder().addMemberDecoration(type_id, 0, spv::DecorationNonWritable);
				storage = spv::StorageClassStorageBuffer;
			}
			else if (info.descriptor_type == VulkanDescriptorType::SSBO)
			{
				unsigned bits;
				if (info.component == DXIL::ComponentType::U16)
					bits = 16;
				else if (info.component == DXIL::ComponentType::U32)
					bits = 32;
				else
				{
					LOGE("Invalid component type for SSBO.\n");
					return 0;
				}

				type_id = build_ssbo_runtime_array_type(*this, bits, 1, ~0u, "SSBO");
				storage = spv::StorageClassStorageBuffer;
			}
			else
			{
				if (info.component != DXIL::ComponentType::U32 &&
				    info.component != DXIL::ComponentType::I32 &&
				    info.component != DXIL::ComponentType::F32 &&
				    info.component != DXIL::ComponentType::UNormF32)
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
			type_id = builder().makeVectorType(builder().makeFloatType(32), 4);
			type_id = builder().makeArrayType(type_id, builder().makeUintConstant(64 * 1024 / 16), 16);
			builder().addDecoration(type_id, spv::DecorationArrayStride, 16);
			type_id = get_struct_type({ type_id }, "BindlessCBV");
			builder().addDecoration(type_id, spv::DecorationBlock);
			if (options.bindless_cbv_ssbo_emulation)
				builder().addMemberDecoration(type_id, 0, spv::DecorationNonWritable);
			builder().addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
			type_id = builder().makeRuntimeArray(type_id);
			storage = options.bindless_cbv_ssbo_emulation ? spv::StorageClassStorageBuffer : spv::StorageClassUniform;
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
		meta.var_id = resource.var_id;
		meta.storage = storage;

		builder().addDecoration(resource.var_id, spv::DecorationDescriptorSet, info.desc_set);
		builder().addDecoration(resource.var_id, spv::DecorationBinding, info.binding);

		if (info.type == DXIL::ResourceType::UAV && !info.counters)
		{
			if (!info.uav_read)
				builder().addDecoration(resource.var_id, spv::DecorationNonReadable);
			if (!info.uav_written)
				builder().addDecoration(resource.var_id, spv::DecorationNonWritable);
			if (info.uav_coherent)
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

static bool resource_meta_is_global_lib_variable(const llvm::MDNode *resource)
{
	if (!resource)
		return false;

	if (const auto *variable = llvm::dyn_cast<llvm::ConstantAsMetadata>(resource->getOperand(1)))
		return llvm::isa<llvm::GlobalVariable>(variable->getValue());
	else
		return false;
}

void Converter::Impl::register_resource_meta_reference(const llvm::MDOperand &operand, DXIL::ResourceType type, unsigned index)
{
	// In RT shaders, apps will load dummy structs from global variables.
	// Here we get the chance to redirect them towards the resource meta declaration.
	if (operand)
	{
		auto *value = llvm::cast<llvm::ConstantAsMetadata>(operand)->getValue();
		auto *global_variable = llvm::dyn_cast<llvm::GlobalVariable>(value);
		if (global_variable)
			llvm_global_variable_to_resource_mapping[global_variable] = { type, index, nullptr };
	}
}

bool Converter::Impl::emit_resources_global_mapping(DXIL::ResourceType type, const llvm::MDNode *node)
{
	unsigned num_resources = node->getNumOperands();
	for (unsigned i = 0; i < num_resources; i++)
	{
		auto *resource = llvm::cast<llvm::MDNode>(node->getOperand(i));
		unsigned index = get_constant_metadata(resource, 0);
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

	spv::Id block_type_id = builder().makeStructType({ base_type_id }, type.c_str());
	builder().addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	builder().addMemberName(block_type_id, 0, "value");
	builder().addDecoration(block_type_id, spv::DecorationBlock);

	if (meta.nonwritable)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonWritable);
	if (meta.nonreadable)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationNonReadable);
	if (meta.coherent)
		builder().addMemberDecoration(block_type_id, 0, spv::DecorationCoherent);

	spv::Id ptr_type_id = builder().makePointer(spv::StorageClassPhysicalStorageBuffer, block_type_id);
	PhysicalPointerEntry new_entry = {};
	new_entry.ptr_type_id = ptr_type_id;
	new_entry.base_type_id = base_type_id;
	new_entry.meta = meta;
	physical_pointer_entries.push_back(new_entry);
	return ptr_type_id;
}

bool Converter::Impl::emit_srvs(const llvm::MDNode *srvs)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_srvs = srvs->getNumOperands();

	for (unsigned i = 0; i < num_srvs; i++)
	{
		auto *srv = llvm::cast<llvm::MDNode>(srvs->getOperand(i));
		unsigned index = get_constant_metadata(srv, 0);
		bool is_global_lib_variable = resource_meta_is_global_lib_variable(srv);
		auto name = get_string_metadata(srv, 2);
		unsigned bind_space = get_constant_metadata(srv, 3);
		unsigned bind_register = get_constant_metadata(srv, 4);
		unsigned range_size = get_constant_metadata(srv, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(srv, 6));

		llvm::MDNode *tags = nullptr;
		if (srv->getNumOperands() >= 9 && srv->getOperand(8))
			tags = llvm::dyn_cast<llvm::MDNode>(srv->getOperand(8));

		DXIL::ComponentType component_type = DXIL::ComponentType::U32;
		unsigned stride = 0;

		if (tags && get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			component_type = static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1));
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
			return false;

		auto &access_meta = srv_access_tracking[index];
		if (access_meta.raw_access_16bit &&
		    vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::SSBO &&
		    vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::BufferDeviceAddress)
		{
			LOGE("Raw 16-bit load-store was used, which must be implemented with SSBO or BDA.\n");
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
		bindless_info.component = component_type;
		bindless_info.kind = resource_kind;
		bindless_info.desc_set = vulkan_binding.buffer_binding.descriptor_set;
		bindless_info.binding = vulkan_binding.buffer_binding.binding;
		bindless_info.descriptor_type = vulkan_binding.buffer_binding.descriptor_type;

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

				spv::Id var_id = create_bindless_heap_variable(bindless_info);

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				if (!is_global_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				auto &ref = srv_index_to_reference[index];
				ref.var_id = var_id;
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
			spv::Id var_id = create_bindless_heap_variable(bindless_info);
			spv::Id var_id_16bit = 0;

			if (access_meta.raw_access_16bit)
			{
				auto bindless_info_16bit = bindless_info;
				bindless_info_16bit.component = DXIL::ComponentType::U16;
				var_id_16bit = create_bindless_heap_variable(bindless_info_16bit);
			}

			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer_binding.bindless.heap_root_offset;
			if (range_size != 1 && !is_global_lib_variable)
				heap_offset -= bind_register;

			auto &ref = srv_index_to_reference[index];
			ref.var_id = var_id;
			ref.var_id_16bit = var_id_16bit;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.stride = stride;
			ref.bindless = true;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;
		}
		else
		{
			auto sampled_type_id = get_type_id(component_type, 1, 1);

			spv::Id type_id = 0;
			spv::Id type_id_16bit = 0;
			auto storage = spv::StorageClassUniformConstant;

			if (resource_kind == DXIL::ResourceKind::RTAccelerationStructure)
			{
				type_id = builder.makeAccelerationStructureType();
			}
			else if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				// TODO: Consider implementing aliased buffers which all refer to the same buffer,
				// but which can exploit alignment per-instruction.
				// This is impractical, since BufferLoad/Store in DXIL does not have alignment (4 bytes is assumed),
				// so just unroll.
				// To make good use of this, we'll need apps to use SM 6.2 RawBufferLoad/Store, which does have explicit alignment.
				// We'll likely need to mess around with Aliased decoration as well, which might have other effects ...

				type_id = build_ssbo_runtime_array_type(*this, 32, 1, range_size, "SSBO");
				if (access_meta.raw_access_16bit)
					type_id_16bit = build_ssbo_runtime_array_type(*this, 16, 1, range_size, "SSBO_16bit");
				storage = spv::StorageClassStorageBuffer;
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

			spv::Id var_id = create_variable(storage, type_id,
			                                 name.empty() ? nullptr : name.c_str());
			spv::Id var_id_16bit = 0;
			if (type_id_16bit)
				var_id_16bit = create_variable(storage, type_id_16bit, name.empty() ? nullptr : name.c_str());

			builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
			builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);
			if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				// Make it crystal clear this is a read-only SSBO which cannot observe changed from other SSBO writes.
				builder.addDecoration(var_id, spv::DecorationNonWritable);
				builder.addDecoration(var_id, spv::DecorationRestrict);
			}

			if (var_id_16bit)
			{
				builder.addDecoration(var_id_16bit, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
				builder.addDecoration(var_id_16bit, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);
				builder.addDecoration(var_id_16bit, spv::DecorationNonWritable);
				builder.addDecoration(var_id_16bit, spv::DecorationRestrict);
			}

			auto &ref = srv_index_to_reference[index];
			ref.var_id = var_id;
			ref.var_id_16bit = var_id_16bit;
			ref.base_resource_is_array = range_size != 1;
			ref.stride = stride;
			ref.resource_kind = resource_kind;

			auto &meta = handle_to_resource_meta[var_id];
			meta = {};
			meta.kind = resource_kind;
			meta.component_type = component_type;
			meta.stride = stride;
			meta.var_id = var_id;
			meta.storage = storage;

			if (var_id_16bit)
			{
				auto &meta_16bit = handle_to_resource_meta[var_id_16bit];
				meta_16bit = meta;
				meta_16bit.component_type = DXIL::ComponentType::U16;
				meta_16bit.var_id = var_id_16bit;
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

bool Converter::Impl::emit_uavs(const llvm::MDNode *uavs)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_uavs = uavs->getNumOperands();

	for (unsigned i = 0; i < num_uavs; i++)
	{
		auto *uav = llvm::cast<llvm::MDNode>(uavs->getOperand(i));
		unsigned index = get_constant_metadata(uav, 0);
		bool is_global_lib_variable = resource_meta_is_global_lib_variable(uav);
		auto name = get_string_metadata(uav, 2);
		unsigned bind_space = get_constant_metadata(uav, 3);
		unsigned bind_register = get_constant_metadata(uav, 4);
		unsigned range_size = get_constant_metadata(uav, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(uav, 6));

		bool globally_coherent = get_constant_metadata(uav, 7) != 0;
		bool has_counter = get_constant_metadata(uav, 8) != 0;
		//bool is_rov = get_constant_metadata(uav, 9) != 0;
		//assert(!is_rov);

		llvm::MDNode *tags = nullptr;
		if (uav->getNumOperands() >= 11 && uav->getOperand(10))
			tags = llvm::dyn_cast<llvm::MDNode>(uav->getOperand(10));

		unsigned stride = 0;
		spv::ImageFormat format = spv::ImageFormatUnknown;

		DXIL::ComponentType component_type = DXIL::ComponentType::U32;

		if (tags && get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			component_type = static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1));
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

		auto &access_meta = uav_access_tracking[index];
		if (resource_kind != DXIL::ResourceKind::RawBuffer && resource_kind != DXIL::ResourceKind::StructuredBuffer)
		{
			// For any typed resource, we need to check if the resource is being read.
			// To avoid StorageReadWithoutFormat, we emit a format based on the component type.
			if (access_meta.has_read)
			{
				if (options.typed_uav_read_without_format && !access_meta.has_atomic)
				{
					builder.addCapability(spv::CapabilityStorageImageReadWithoutFormat);
					format = spv::ImageFormatUnknown;
				}
				else
				{
					switch (component_type)
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

					default:
						break;
					}
				}
			}
		}

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
			return false;

		if (access_meta.raw_access_16bit &&
		    vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::SSBO &&
		    vulkan_binding.buffer_binding.descriptor_type != VulkanDescriptorType::BufferDeviceAddress)
		{
			LOGE("Raw 16-bit load-store was used, which must be implemented with SSBO or BDA.\n");
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
		bindless_info.component = component_type;
		bindless_info.kind = resource_kind;
		bindless_info.desc_set = vulkan_binding.buffer_binding.descriptor_set;
		bindless_info.binding = vulkan_binding.buffer_binding.binding;
		bindless_info.format = format;
		bindless_info.uav_read = access_meta.has_read;
		bindless_info.uav_written = access_meta.has_written;
		bindless_info.uav_coherent = globally_coherent;
		bindless_info.descriptor_type = vulkan_binding.buffer_binding.descriptor_type;

		// If we emit two SSBOs which both access the same buffer, we must emit Aliased decoration to be safe.
		bindless_info.aliased = access_meta.raw_access_16bit;

		BindlessInfo counter_info = {};
		if (options.physical_storage_buffer)
		{
			counter_info.type = DXIL::ResourceType::UAV;
			counter_info.component = DXIL::ComponentType::U32;
			counter_info.kind = DXIL::ResourceKind::Invalid;
			counter_info.desc_set = vulkan_binding.counter_binding.descriptor_set;
			counter_info.binding = vulkan_binding.counter_binding.binding;
			counter_info.counters = true;
		}
		else
		{
			counter_info.type = DXIL::ResourceType::UAV;
			counter_info.component = DXIL::ComponentType::U32;
			counter_info.kind = DXIL::ResourceKind::RawBuffer;
			counter_info.desc_set = vulkan_binding.counter_binding.descriptor_set;
			counter_info.binding = vulkan_binding.counter_binding.binding;
			counter_info.uav_read = true;
			counter_info.uav_written = true;
			counter_info.uav_coherent = globally_coherent;
			counter_info.format = spv::ImageFormatR32ui;
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

				spv::Id var_id = create_bindless_heap_variable(bindless_info);
				spv::Id var_id_16bit = 0;

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				if (!is_global_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				auto &ref = uav_index_to_reference[index];
				ref.var_id = var_id;
				ref.var_id_16bit = var_id_16bit;
				ref.base_offset = heap_offset;
				ref.stride = stride;
				ref.bindless = true;
				ref.base_resource_is_array = range_size != 1;
				ref.local_root_signature_entry = local_root_signature_entry;
				ref.resource_kind = resource_kind;

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
			spv::Id var_id = create_bindless_heap_variable(bindless_info);
			spv::Id var_id_16bit = 0;

			if (access_meta.raw_access_16bit)
			{
				auto bindless_info_16bit = bindless_info;
				bindless_info_16bit.component = DXIL::ComponentType::U16;
				var_id_16bit = create_bindless_heap_variable(bindless_info_16bit);
			}

			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer_binding.bindless.heap_root_offset;
			if (range_size != 1 && !is_global_lib_variable)
				heap_offset -= bind_register;

			auto &ref = uav_index_to_reference[index];
			ref.var_id = var_id;
			ref.var_id_16bit = var_id_16bit;
			ref.push_constant_member = vulkan_binding.buffer_binding.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.stride = stride;
			ref.bindless = true;
			ref.coherent = globally_coherent;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;

			if (has_counter)
			{
				if (vulkan_binding.counter_binding.bindless.use_heap)
				{
					spv::Id counter_var_id = create_bindless_heap_variable(counter_info);

					heap_offset = vulkan_binding.counter_binding.bindless.heap_root_offset;
					if (range_size != 1 && !is_global_lib_variable)
						heap_offset -= bind_register;

					auto &counter_ref = uav_index_to_counter[index];
					counter_ref.var_id = counter_var_id;
					counter_ref.push_constant_member = vulkan_binding.counter_binding.root_constant_index + root_descriptor_count;
					counter_ref.base_offset = heap_offset;
					counter_ref.stride = 4;
					counter_ref.bindless = true;
					counter_ref.base_resource_is_array = range_size != 1;
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
				}
			}
		}
		else
		{
			spv::Id var_id = 0;
			spv::Id var_id_16bit = 0;
			spv::StorageClass storage;

			if (vulkan_binding.buffer_binding.descriptor_type == VulkanDescriptorType::SSBO)
			{
				// TODO: Consider implementing aliased buffers which all refer to the same buffer,
				// but which can exploit alignment per-instruction.
				// This is impractical, since BufferLoad/Store in DXIL does not have alignment (4 bytes is assumed),
				// so just unroll.
				// To make good use of this, we'll need apps to use SM 6.2 RawBufferLoad/Store, which does have explicit alignment.
				// We'll likely need to mess around with Aliased decoration as well, which might have other effects ...

				spv::Id type_id = build_ssbo_runtime_array_type(*this, 32, 1, range_size, "SSBO");
				storage = spv::StorageClassStorageBuffer;
				var_id = create_variable(storage, type_id, name.empty() ? nullptr : name.c_str());

				if (access_meta.raw_access_16bit)
				{
					spv::Id type_id_16bit = build_ssbo_runtime_array_type(*this, 16, 1, range_size, "SSBO_16bit");
					var_id_16bit = create_variable(storage, type_id_16bit, name.empty() ? nullptr : name.c_str());
				}
			}
			else
			{
				// Treat default as texel buffer, as it's the more compatible way of implementing buffer types in DXIL.
				auto element_type_id = get_type_id(component_type, 1, 1);

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
			}

			auto &ref = uav_index_to_reference[index];
			ref.var_id = var_id;
			ref.var_id_16bit = var_id_16bit;
			ref.stride = stride;
			ref.coherent = globally_coherent;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = resource_kind;

			builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
			builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);

			if (!access_meta.has_read)
				builder.addDecoration(var_id, spv::DecorationNonReadable);
			if (!access_meta.has_written)
				builder.addDecoration(var_id, spv::DecorationNonWritable);
			if (globally_coherent)
				builder.addDecoration(var_id, spv::DecorationCoherent);

			if (var_id_16bit)
			{
				builder.addDecoration(var_id_16bit, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
				builder.addDecoration(var_id_16bit, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);

				if (!access_meta.has_read)
					builder.addDecoration(var_id_16bit, spv::DecorationNonReadable);
				if (!access_meta.has_written)
					builder.addDecoration(var_id_16bit, spv::DecorationNonWritable);
				if (globally_coherent)
					builder.addDecoration(var_id_16bit, spv::DecorationCoherent);

				builder.addDecoration(var_id, spv::DecorationAliased);
				builder.addDecoration(var_id_16bit, spv::DecorationAliased);
			}

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
			}

			auto &meta = handle_to_resource_meta[var_id];
			meta = {};
			meta.kind = resource_kind;
			meta.component_type = component_type;
			meta.stride = stride;
			meta.var_id = var_id;
			meta.storage = storage;

			if (var_id_16bit)
			{
				auto &meta_16bit = handle_to_resource_meta[var_id_16bit];
				meta_16bit = meta;
				meta_16bit.component_type = DXIL::ComponentType::U16;
				meta_16bit.var_id = var_id_16bit;
			}
		}
	}

	return true;
}

bool Converter::Impl::emit_cbvs(const llvm::MDNode *cbvs)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_cbvs = cbvs->getNumOperands();

	for (unsigned i = 0; i < num_cbvs; i++)
	{
		auto *cbv = llvm::cast<llvm::MDNode>(cbvs->getOperand(i));
		unsigned index = get_constant_metadata(cbv, 0);
		bool is_global_lib_variable = resource_meta_is_global_lib_variable(cbv);
		auto name = get_string_metadata(cbv, 2);
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

				spv::Id var_id = create_bindless_heap_variable(bindless_info);

				uint32_t heap_offset = local_table_entry.offset_in_heap;
				heap_offset += bind_register - local_table_entry.register_index;

				if (!is_global_lib_variable)
				{
					LOGE("Local root signature requires global lib variables.\n");
					return false;
				}

				auto &ref = cbv_index_to_reference[index];
				ref.var_id = var_id;
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
			spv::Id var_id = create_bindless_heap_variable(bindless_info);

			// DXIL already applies the t# register offset to any dynamic index, so counteract that here.
			// The exception is with lib_* where we access resources by variable, not through
			// createResource() >_____<.
			uint32_t heap_offset = vulkan_binding.buffer.bindless.heap_root_offset;
			if (range_size != 1 && !is_global_lib_variable)
				heap_offset -= bind_register;

			auto &ref = cbv_index_to_reference[index];
			ref.var_id = var_id;
			ref.push_constant_member = vulkan_binding.buffer.root_constant_index + root_descriptor_count;
			ref.base_offset = heap_offset;
			ref.base_resource_is_array = range_size != 1;
			ref.bindless = true;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;
		}
		else
		{
			unsigned vec4_length = (cbv_size + 15) / 16;

			// It seems like we will have to bitcast ourselves away from vec4 here after loading.
			spv::Id member_array_type = builder.makeArrayType(builder.makeVectorType(builder.makeFloatType(32), 4),
			                                                  builder.makeUintConstant(vec4_length, false), 16);

			builder.addDecoration(member_array_type, spv::DecorationArrayStride, 16);

			spv::Id type_id = get_struct_type({ member_array_type }, name.c_str());
			builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
			builder.addDecoration(type_id, spv::DecorationBlock);

			if (range_size != 1)
			{
				if (range_size == ~0u)
					type_id = builder.makeRuntimeArray(type_id);
				else
					type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
			}

			spv::Id var_id = create_variable(spv::StorageClassUniform, type_id, name.empty() ? nullptr : name.c_str());

			builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer.descriptor_set);
			builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer.binding);

			auto &ref = cbv_index_to_reference[index];
			ref.var_id = var_id;
			ref.base_resource_is_array = range_size != 1;
			ref.resource_kind = DXIL::ResourceKind::CBuffer;
		}
	}

	return true;
}

bool Converter::Impl::emit_samplers(const llvm::MDNode *samplers)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_samplers = samplers->getNumOperands();

	for (unsigned i = 0; i < num_samplers; i++)
	{
		auto *sampler = llvm::cast<llvm::MDNode>(samplers->getOperand(i));
		unsigned index = get_constant_metadata(sampler, 0);
		bool is_global_lib_variable = resource_meta_is_global_lib_variable(sampler);
		auto name = get_string_metadata(sampler, 2);
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
			return false;

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

			if (!is_global_lib_variable)
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
			if (range_size != 1 && !is_global_lib_variable)
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

	spv::Id type_id = get_struct_type(members, "RootConstants");
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

bool Converter::Impl::emit_shader_record_buffer()
{
	if (local_root_signature.empty())
		return true;

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
			spv::Id member_type_id =
				builder.makeArrayType(builder.makeUintType(32),
				                      builder.makeUintConstant(elem.constants.num_words), 4);
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

	type_id = get_struct_type(member_types, "SBTBlock");
	builder.addDecoration(type_id, spv::DecorationBlock);

	for (size_t i = 0; i < local_root_signature.size(); i++)
		builder.addMemberDecoration(type_id, i, spv::DecorationOffset, offsets[i]);

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

	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return true;

	auto *metas = resource_meta->getOperand(0);

	if (metas->getOperand(0))
		if (!emit_srvs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(0))))
			return false;
	if (metas->getOperand(1))
		if (!emit_uavs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(1))))
			return false;
	if (metas->getOperand(2))
		if (!emit_cbvs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(2))))
			return false;
	if (metas->getOperand(3))
		if (!emit_samplers(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(3))))
			return false;

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
	default:
		return ShaderStage::Unknown;
	}
}

spv::Id Converter::Impl::get_id_for_constant(const llvm::Constant *constant, unsigned forced_width)
{
	auto &builder = spirv_module.get_builder();

	switch (constant->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
	{
		auto *fp = llvm::cast<llvm::ConstantFP>(constant);
		return builder.makeFloat16Constant(fp->getValueAPF().bitcastToAPInt().getZExtValue() & 0xffffu);
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
	{
		Vector<spv::Id> constituents;
		spv::Id type_id = get_type_id(constant->getType());

		if (llvm::isa<llvm::ConstantAggregateZero>(constant))
		{
			return builder.makeNullConstant(type_id);
		}
		else
		{
			if (auto *array = llvm::dyn_cast<llvm::ConstantDataArray>(constant))
			{
				constituents.reserve(array->getType()->getArrayNumElements());
				for (unsigned i = 0; i < array->getNumElements(); i++)
				{
					llvm::Constant *c = array->getElementAsConstant(i);
					constituents.push_back(get_id_for_constant(c, 0));
				}
			}
			else if (auto *vec = llvm::dyn_cast<llvm::ConstantDataVector>(constant))
			{
				constituents.reserve(vec->getType()->getVectorNumElements());
				for (unsigned i = 0; i < vec->getNumElements(); i++)
				{
					llvm::Constant *c = vec->getElementAsConstant(i);
					constituents.push_back(get_id_for_constant(c, 0));
				}
			}

			return builder.makeCompositeConstant(type_id, constituents);
		}
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

spv::Id Converter::Impl::get_id_for_value(const llvm::Value *value, unsigned forced_width)
{
	assert(value);

	auto itr = value_map.find(value);
	if (itr != value_map.end())
		return itr->second;

	auto *cexpr = llvm::dyn_cast<llvm::ConstantExpr>(value);
	auto *constant = llvm::dyn_cast<llvm::Constant>(value);

	spv::Id ret;
	if (auto *undef = llvm::dyn_cast<llvm::UndefValue>(value))
		ret = get_id_for_undef(undef);
	else if (cexpr && cexpr != current_constant_expr)
		ret = build_constant_expression(*this, cexpr);
	else if (constant && !cexpr)
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

static bool is_identifier(char c)
{
	// We don't control the locale, so to be safe ...
	const auto is_lower = [](char c) -> bool { return c >= 'a' && c <= 'z'; };
	const auto is_upper = [](char c) -> bool { return c >= 'A' && c <= 'Z'; };
	return is_lower(c) || is_upper(c) || c == '_';
}

static bool is_mangled_entry_point(const char *user)
{
	// The mangling algorithm is intentionally left undefined in spec.
	// However, we'll just try to detect any non-identifier characters.
	while (*user != '\0')
	{
		if (!is_identifier(*user))
			return true;
		user++;
	}
	return false;
}

static String demangle_entry_point(const String &entry)
{
	// Demangling appears to work if we find first identifier character and delimit string to first non-identifier char.
	// This is undocumented, so just have to guess. :(
	auto itr = std::find_if(entry.begin(), entry.end(), [](char c) { return is_identifier(c); });
	if (itr == entry.end())
		return "";

	auto end_itr = std::find_if(itr, entry.end(), [](char c) { return !is_identifier(c); });
	return String(itr, end_itr);
}

bool Converter::entry_point_matches(const String &mangled, const char *user)
{
	if (is_mangled_entry_point(user))
		return mangled == user;
	else
		return demangle_entry_point(mangled) == user;
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

static const llvm::MDOperand *get_shader_property_tag(llvm::MDNode *func_meta, DXIL::ShaderPropertyTag tag)
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
			return spv::ExecutionModelGLCompute;
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
		auto *shader_model = module.getNamedMetadata("dx.shaderModel");
		auto *shader_model_node = shader_model->getOperand(0);
		auto model = llvm::cast<llvm::MDString>(shader_model_node->getOperand(0))->getString();
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
	}

	return spv::ExecutionModelMax;
}

spv::Id Converter::Impl::get_type_id(const llvm::Type *type)
{
	auto &builder = spirv_module.get_builder();
	switch (type->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		return builder.makeFloatType(16);
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
		// Have to deal with this from the outside. Should only be relevant for getelementptr and instructions like that.
		LOGE("Cannot reliably convert LLVM pointer type, we cannot differentiate between Function and Private.\n");
		std::terminate();
	}

	case llvm::Type::TypeID::ArrayTyID:
		if (type->getArrayNumElements() == 0)
			return 0;
		return builder.makeArrayType(get_type_id(type->getArrayElementType()),
		                             builder.makeUintConstant(type->getArrayNumElements(), false), 0);

	case llvm::Type::TypeID::StructTyID:
	{
		auto *struct_type = llvm::cast<llvm::StructType>(type);
		Vector<spv::Id> member_types;
		member_types.reserve(struct_type->getStructNumElements());
		for (unsigned i = 0; i < struct_type->getStructNumElements(); i++)
			member_types.push_back(get_type_id(struct_type->getStructElementType(i)));
		return get_struct_type(member_types, "");
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

spv::Id Converter::Impl::get_struct_type(const Vector<spv::Id> &type_ids, const char *name)
{
	auto itr = std::find_if(cached_struct_types.begin(), cached_struct_types.end(), [&](const StructTypeEntry &entry) -> bool {
		if (type_ids.size() != entry.subtypes.size())
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
		entry.id = builder().makeStructType(type_ids, entry.name.c_str());
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
	case DXIL::ComponentType::UNormF16:
	case DXIL::ComponentType::SNormF16:
		component_type = builder.makeFloatType(16);
		break;

	case DXIL::ComponentType::F32:
	case DXIL::ComponentType::UNormF32:
	case DXIL::ComponentType::SNormF32:
		component_type = builder.makeFloatType(32);
		break;

	case DXIL::ComponentType::F64:
	case DXIL::ComponentType::UNormF64:
	case DXIL::ComponentType::SNormF64:
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

	auto *patch_node = llvm::dyn_cast<llvm::MDNode>(patch_variables);

	auto &builder = spirv_module.get_builder();

	spv::StorageClass storage =
	    execution_model == spv::ExecutionModelTessellationControl ? spv::StorageClassOutput : spv::StorageClassInput;

	for (unsigned i = 0; i < patch_node->getNumOperands(); i++)
	{
		auto *patch = llvm::cast<llvm::MDNode>(patch_node->getOperand(i));
		auto element_id = get_constant_metadata(patch, 0);
		auto semantic_name = get_string_metadata(patch, 1);
		auto element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(patch, 2));
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(patch, 3));

		switch (element_type)
		{
		case DXIL::ComponentType::F16:
		case DXIL::ComponentType::I16:
		case DXIL::ComponentType::U16:
			builder.addCapability(spv::CapabilityStorageInputOutput16);
			break;

		default:
			break;
		}

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

		spv::Id type_id = get_type_id(element_type, rows, cols);

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += dxil_spv::to_string(semantic_index);
		}

		spv::Id variable_id = create_variable(storage, type_id, variable_name.c_str());
		patch_elements_meta[element_id] = { variable_id, element_type, 0 };

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
			builder.addDecoration(variable_id, spv::DecorationLocation, start_row + patch_location_offset);
			if (start_col != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, start_col);
		}

		builder.addDecoration(variable_id, spv::DecorationPatch);
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
		auto actual_element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(output, 2));
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

		if (execution_model == spv::ExecutionModelTessellationControl)
			patch_location_offset = std::max(patch_location_offset, start_row + rows);

		spv::Id type_id = get_type_id(effective_element_type, rows, cols);

		// For HS <-> DS, ignore system values.
		if (execution_model == spv::ExecutionModelTessellationControl)
			system_value = DXIL::Semantic::User;

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

		if (execution_model == spv::ExecutionModelTessellationControl)
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

		if (effective_element_type != actual_element_type &&
		    (actual_element_type == DXIL::ComponentType::F16 ||
		     actual_element_type == DXIL::ComponentType::I16 ||
		     actual_element_type == DXIL::ComponentType::U16))
		{
			builder.addDecoration(variable_id, spv::DecorationRelaxedPrecision);
		}

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
				if (start_row == 0 || start_row == 1)
				{
					if (rows != 1)
					{
						LOGE("For dual source blending, number of rows must be 1.\n");
						return false;
					}
					builder.addDecoration(variable_id, spv::DecorationLocation, 0);
					builder.addDecoration(variable_id, spv::DecorationIndex, start_row);
					output_elements_meta[element_id].rt_index = 0;
				}
				else
				{
					LOGE("For dual source blending, only RT 0 and 1 can be used.\n");
					return false;
				}
			}
			else
			{
				builder.addDecoration(variable_id, spv::DecorationLocation, start_row);
				output_elements_meta[element_id].rt_index = start_row;
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
			    execution_model == spv::ExecutionModelGeometry)
			{
				emit_interpolation_decorations(variable_id, interpolation);
			}

			unsigned effective_start_row = start_row;
			if (execution_model == spv::ExecutionModelGeometry && geometry_stream < 4)
				effective_start_row += start_row_for_geometry_stream[geometry_stream];

			builder.addDecoration(variable_id, spv::DecorationLocation, effective_start_row);
			if (start_col != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, start_col);
		}
	}

	if (clip_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, clip_distance_count, 1, true);
		if (execution_model == spv::ExecutionModelTessellationControl)
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
		if (execution_model == spv::ExecutionModelTessellationControl)
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
		break;

	default:
		break;
	}
}

void Converter::Impl::emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic, spv::StorageClass storage)
{
	auto &builder = spirv_module.get_builder();
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
		}
		break;

	case DXIL::Semantic::SampleIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInSampleId);
		spirv_module.register_builtin_shader_input(id, spv::BuiltInSampleId);
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
			spirv_module.register_builtin_shader_output(id, spv::BuiltInLayer);
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInLayer);
			if (execution_model == spv::ExecutionModelFragment)
				builder.addDecoration(id, spv::DecorationFlat);
		}
		builder.addCapability(spv::CapabilityGeometry);
		break;

	case DXIL::Semantic::ViewPortArrayIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInViewportIndex);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInViewportIndex);
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInViewportIndex);
			if (execution_model == spv::ExecutionModelFragment)
				builder.addDecoration(id, spv::DecorationFlat);
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
			if (execution_model == spv::ExecutionModelFragment)
				builder.addDecoration(id, spv::DecorationFlat);
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
		}
		builder.addExtension("SPV_KHR_fragment_shading_rate");
		builder.addCapability(spv::CapabilityFragmentShadingRateKHR);
		break;

	default:
		LOGE("Unknown DXIL semantic.\n");
		break;
	}
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
		value_map[&arg] = payload_var;
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
		value_map[&arg] = hit_attribute_var;
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

		{
			auto *elem_type = global.getType()->getPointerElementType();
			while (elem_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
				elem_type = elem_type->getArrayElementType();

			// Workaround strange DXIL codegen where a resource is declared as an external constant.
			// There should be a better way to detect these types.
			if (elem_type->getTypeID() == llvm::Type::TypeID::StructTyID)
				continue;
		}

		spv::Id pointee_type_id = get_type_id(global.getType()->getPointerElementType());

		// Happens for some global variables in DXR for some reason, benign.
		if (pointee_type_id == 0)
			continue;

		auto address_space = static_cast<DXIL::AddressSpace>(global.getType()->getAddressSpace());
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
			initializer_id = get_id_for_constant(initializer, 0);

		spv::Id var_id = create_variable_with_initializer(
		    address_space == DXIL::AddressSpace::GroupShared ? spv::StorageClassWorkgroup : spv::StorageClassPrivate,
		    pointee_type_id, initializer_id);
		value_map[&global] = var_id;
	}

	return true;
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

	bool arrayed_input = execution_model == spv::ExecutionModelGeometry ||
	                     execution_model == spv::ExecutionModelTessellationControl ||
	                     execution_model == spv::ExecutionModelTessellationEvaluation;

	auto *inputs_node = llvm::dyn_cast<llvm::MDNode>(inputs);

	auto &builder = spirv_module.get_builder();

	unsigned clip_distance_count = 0;
	unsigned cull_distance_count = 0;

	for (unsigned i = 0; i < inputs_node->getNumOperands(); i++)
	{
		auto *input = llvm::cast<llvm::MDNode>(inputs_node->getOperand(i));
		auto element_id = get_constant_metadata(input, 0);
		auto semantic_name = get_string_metadata(input, 1);
		auto actual_element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(input, 2));
		auto effective_element_type = get_effective_input_output_type(actual_element_type);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(input, 3));

		unsigned semantic_index = 0;
		if (input->getOperand(4))
			semantic_index = get_constant_metadata(llvm::cast<llvm::MDNode>(input->getOperand(4)), 0);

		auto interpolation = static_cast<DXIL::InterpolationMode>(get_constant_metadata(input, 5));
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

		if (arrayed_input)
		{
			type_id =
			    builder.makeArrayType(type_id, builder.makeUintConstant(execution_mode_meta.stage_input_num_vertex), 0);
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += dxil_spv::to_string(semantic_index);
		}

		spv::Id variable_id = create_variable(spv::StorageClassInput, type_id, variable_name.c_str());
		input_elements_meta[element_id] = { variable_id, actual_element_type, 0 };

		if (effective_element_type != actual_element_type &&
		    (actual_element_type == DXIL::ComponentType::F16 ||
		     actual_element_type == DXIL::ComponentType::I16 ||
		     actual_element_type == DXIL::ComponentType::U16))
		{
			builder.addDecoration(variable_id, spv::DecorationRelaxedPrecision);
		}

		if (system_value != DXIL::Semantic::User)
		{
			emit_builtin_decoration(variable_id, system_value, spv::StorageClassInput);
		}
		else
		{
			if (execution_model == spv::ExecutionModelFragment)
				emit_interpolation_decorations(variable_id, interpolation);

			VulkanVertexInput vk_input = { start_row };
			if (execution_model == spv::ExecutionModelVertex && resource_mapping_iface)
			{
				D3DVertexInput d3d_input = { semantic_name.c_str(), semantic_index, start_row, rows };
				if (!resource_mapping_iface->remap_vertex_input(d3d_input, vk_input))
					return false;
			}

			builder.addDecoration(variable_id, spv::DecorationLocation, vk_input.location);

			if (execution_model != spv::ExecutionModelVertex && start_col != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, start_col);
		}
	}

	if (clip_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, clip_distance_count, 1, true);
		if (arrayed_input)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_input_num_vertex, false), 0);
		}

		spv::Id variable_id = create_variable(spv::StorageClassInput, type_id);
		emit_builtin_decoration(variable_id, DXIL::Semantic::ClipDistance, spv::StorageClassInput);
		spirv_module.register_builtin_shader_input(variable_id, spv::BuiltInClipDistance);
	}

	if (cull_distance_count)
	{
		spv::Id type_id = get_type_id(DXIL::ComponentType::F32, cull_distance_count, 1, true);
		if (arrayed_input)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_input_num_vertex, false), 0);
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
		builder.addDecoration(op->id, spv::DecorationNonUniformEXT);

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

spv::Id Converter::Impl::build_vector(spv::Id element_type, spv::Id *elements, unsigned count)
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

spv::Id Converter::Impl::build_constant_vector(spv::Id element_type, spv::Id *elements, unsigned count)
{
	if (count == 1)
		return elements[0];

	auto &builder = spirv_module.get_builder();
	return builder.makeCompositeConstant(builder.makeVectorType(element_type, count), { elements, elements + count });
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

void Converter::Impl::repack_sparse_feedback(DXIL::ComponentType component_type, unsigned num_components, const llvm::Value *value)
{
	auto *code_id = allocate(spv::OpCompositeExtract, builder().makeUintType(32));
	code_id->add_id(get_id_for_value(value));
	code_id->add_literal(0);
	add(code_id);

	auto *texel_id = allocate(spv::OpCompositeExtract, get_type_id(component_type, 1, num_components));
	texel_id->add_id(get_id_for_value(value));
	texel_id->add_literal(1);
	add(texel_id);

	if (component_type == DXIL::ComponentType::I32)
	{
		Operation *op = allocate(spv::OpBitcast, get_type_id(DXIL::ComponentType::U32, 1, num_components));
		op->add_id(texel_id->id);
		add(op);
		texel_id = op;
		component_type = DXIL::ComponentType::U32;
	}

	spv::Id components[5];

	if (num_components > 1)
	{
		for (unsigned i = 0; i < num_components; i++)
		{
			auto *extract_op = allocate(spv::OpCompositeExtract, get_type_id(component_type, 1, 1));
			extract_op->add_id(texel_id->id);
			extract_op->add_literal(i);
			add(extract_op);
			components[i] = extract_op->id;
		}
	}
	else
	{
		for (auto &comp : components)
			comp = texel_id->id;
		num_components = 4;
	}

	components[num_components] = code_id->id;

	auto *repack_op = allocate(spv::OpCompositeConstruct, get_type_id(value->getType()));
	for (auto &comp : components)
		repack_op->add_id(comp);
	add(repack_op);
	value_map[value] = repack_op->id;
}

void Converter::Impl::fixup_load_type_io(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value)
{
	if (component_type == DXIL::ComponentType::I32 ||
	    (component_type == DXIL::ComponentType::I16 && options.storage_16bit_input_output))
	{
		DXIL::ComponentType uint_type = component_type == DXIL::ComponentType::I32 ?
		                                DXIL::ComponentType::U32 : DXIL::ComponentType::U16;
		Operation *op = allocate(spv::OpBitcast, get_type_id(uint_type, 1, components));
		op->add_id(get_id_for_value(value));
		add(op);
		value_map[value] = op->id;
	}
	else if ((component_type == DXIL::ComponentType::F16 ||
	          component_type == DXIL::ComponentType::I16 ||
	          component_type == DXIL::ComponentType::U16) &&
	         !options.storage_16bit_input_output)
	{
		spv::Op op;

		switch (component_type)
		{
		case DXIL::ComponentType::F16:
			op = spv::OpFConvert;
			break;

		case DXIL::ComponentType::I16:
			op = spv::OpSConvert;
			component_type = DXIL::ComponentType::U16;
			break;

		case DXIL::ComponentType::U16:
			op = spv::OpUConvert;
			break;

		default:
			return;
		}

		Operation *narrow_op = allocate(op, get_type_id(component_type, 1, components));
		narrow_op->add_id(get_id_for_value(value));
		add(narrow_op);
		value_map[value] = narrow_op->id;
	}
}

void Converter::Impl::fixup_load_type_buffer(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value)
{
	if (component_type == DXIL::ComponentType::I32 || component_type == DXIL::ComponentType::I16)
	{
		DXIL::ComponentType uint_type = component_type == DXIL::ComponentType::I32 ?
		                                DXIL::ComponentType::U32 : DXIL::ComponentType::U16;
		Operation *op = allocate(spv::OpBitcast, get_type_id(uint_type, 1, components));
		op->add_id(get_id_for_value(value));
		add(op);
		value_map[value] = op->id;
	}
}

spv::Id Converter::Impl::fixup_store_type_io(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	if (component_type == DXIL::ComponentType::I32 ||
	    (component_type == DXIL::ComponentType::I16 && options.storage_16bit_input_output))
	{
		DXIL::ComponentType int_type = component_type == DXIL::ComponentType::I32 ?
		                               DXIL::ComponentType::I32 : DXIL::ComponentType::I16;
		Operation *op = allocate(spv::OpBitcast, get_type_id(int_type, 1, components));
		op->add_id(value);
		add(op);
		return op->id;
	}
	else if ((component_type == DXIL::ComponentType::F16 ||
	          component_type == DXIL::ComponentType::I16 ||
	          component_type == DXIL::ComponentType::U16) &&
	         !options.storage_16bit_input_output)
	{
		DXIL::ComponentType target_type;
		spv::Op op;

		switch (component_type)
		{
		case DXIL::ComponentType::F16:
			target_type = DXIL::ComponentType::F32;
			op = spv::OpFConvert;
			break;

		case DXIL::ComponentType::I16:
			target_type = DXIL::ComponentType::I32;
			op = spv::OpSConvert;
			break;

		case DXIL::ComponentType::U16:
			target_type = DXIL::ComponentType::U32;
			op = spv::OpUConvert;
			break;

		default:
			return value;
		}

		Operation *expand_op = allocate(op, get_type_id(target_type, 1, components));
		expand_op->add_id(value);
		add(expand_op);
		return expand_op->id;
	}
	else
		return value;
}

spv::Id Converter::Impl::fixup_store_type_buffer(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	if (component_type == DXIL::ComponentType::I32 || component_type == DXIL::ComponentType::I16)
	{
		DXIL::ComponentType uint_type = component_type == DXIL::ComponentType::I32 ?
		                                DXIL::ComponentType::I32 : DXIL::ComponentType::I16;
		Operation *op = allocate(spv::OpBitcast, get_type_id(uint_type, 1, components));
		op->add_id(value);
		add(op);
		return op->id;
	}
	else
		return value;
}

bool Converter::Impl::emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction)
{
	PHI phi;
	phi.id = get_id_for_value(&instruction);
	phi.type_id = get_type_id(instruction.getType());

	unsigned count = instruction.getNumIncomingValues();
	for (unsigned i = 0; i < count; i++)
	{
		IncomingValue incoming = {};
		incoming.block = bb_map[instruction.getIncomingBlock(i)]->node;
		auto *value = instruction.getIncomingValue(i);
		incoming.id = get_id_for_value(value);
		phi.incoming.push_back(incoming);
	}

	block->ir.phi.push_back(std::move(phi));
	return true;
}

bool Converter::Impl::emit_instruction(CFGNode *block, const llvm::Instruction &instruction)
{
	if (instruction.isTerminator())
		return true;

	current_block = &block->ir.operations;

	if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&instruction))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
		{
			return emit_dxil_instruction(*this, call_inst);
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

bool Converter::Impl::emit_execution_modes_compute()
{
	auto &builder = spirv_module.get_builder();

	auto *num_threads_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::NumThreads);
	if (num_threads_node)
	{
		auto *num_threads = llvm::cast<llvm::MDNode>(*num_threads_node);
		unsigned threads[3];
		for (unsigned dim = 0; dim < 3; dim++)
		{
			threads[dim] = get_constant_metadata(num_threads, dim);
			execution_mode_meta.workgroup_threads[dim] = threads[dim];
		}

		builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeLocalSize, threads[0], threads[1],
		                         threads[2]);
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_pixel()
{
	auto &builder = spirv_module.get_builder();

	auto *flags_node = get_shader_property_tag(entry_point_meta, DXIL::ShaderPropertyTag::ShaderFlags);
	if (flags_node)
	{
		auto flags = llvm::cast<llvm::ConstantAsMetadata>(*flags_node)->getValue()->getUniqueInteger().getZExtValue();
		if (flags & DXIL::ShaderFlagEarlyDepthStencil)
			builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeEarlyFragmentTests);
	}

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

bool Converter::Impl::emit_execution_modes()
{
	auto &module = bitcode_parser.get_module();
	execution_model = get_execution_model(module, entry_point_meta);

	switch (execution_model)
	{
	case spv::ExecutionModelGLCompute:
		if (!emit_execution_modes_compute())
			return false;
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

	default:
		break;
	}

	return true;
}

CFGNode *Converter::Impl::build_hull_main(llvm::Function *func, CFGNodePool &pool,
                                          Vector<ConvertedFunction::LeafFunction> &leaves)
{
	// Just make sure there is an entry block already created.
	spv::Block *hull_entry, *patch_entry;
	auto *hull_func =
	    builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(), "hull_main", {}, {}, &hull_entry);
	auto *patch_func =
	    builder().makeFunctionEntry(spv::NoPrecision, builder().makeVoidType(), "patch_main", {}, {}, &patch_entry);

	// Set build point so alloca() functions can create variables correctly.
	builder().setBuildPoint(hull_entry);
	auto *hull_main = convert_function(func, pool);
	builder().setBuildPoint(patch_entry);
	auto *patch_main = convert_function(execution_mode_meta.patch_constant_function, pool);
	builder().setBuildPoint(spirv_module.get_entry_function()->getEntryBlock());

	leaves.push_back({ hull_main, hull_func });
	leaves.push_back({ patch_main, patch_func });

	auto *entry = pool.create_node();

	auto *call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
	call_op->add_id(hull_func->getId());
	entry->ir.operations.push_back(call_op);

	if (execution_mode_meta.stage_output_num_vertex > 1)
	{
		auto *load_op = allocate(spv::OpLoad, builder().makeUintType(32));
		load_op->add_id(spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId));
		entry->ir.operations.push_back(load_op);

		auto *cmp_op = allocate(spv::OpIEqual, builder().makeBoolType());
		cmp_op->add_ids({ load_op->id, builder().makeUintConstant(0) });
		entry->ir.operations.push_back(cmp_op);

		auto *barrier_op = allocate(spv::OpControlBarrier);
		// Not 100% sure what to emit here. Just do what glslang does.
		barrier_op->add_id(builder().makeUintConstant(spv::ScopeWorkgroup));
		barrier_op->add_id(builder().makeUintConstant(spv::ScopeInvocation));
		barrier_op->add_id(builder().makeUintConstant(0));
		entry->ir.operations.push_back(barrier_op);

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

		merge_block->ir.terminator.type = Terminator::Type::Return;
	}
	else
	{
		call_op = allocate(spv::OpFunctionCall, builder().makeVoidType());
		call_op->add_id(patch_func->getId());
		entry->ir.operations.push_back(call_op);
		entry->ir.terminator.type = Terminator::Type::Return;
	}

	return entry;
}

CFGNode *Converter::Impl::convert_function(llvm::Function *func, CFGNodePool &pool)
{
	auto *entry = &func->getEntryBlock();
	auto entry_meta = std::make_unique<BlockMeta>(entry);
	bb_map[entry] = entry_meta.get();
	auto *entry_node = pool.create_node();
	bb_map[entry]->node = entry_node;
	entry_node->name += ".entry";
	metas.push_back(std::move(entry_meta));

	Vector<llvm::BasicBlock *> to_process;
	Vector<llvm::BasicBlock *> processing;
	to_process.push_back(entry);
	Vector<llvm::BasicBlock *> visit_order;

	unsigned fake_label_id = 0;

	// Traverse the CFG and register all blocks in the pool.
	while (!to_process.empty())
	{
		std::swap(to_process, processing);
		for (auto *block : processing)
		{
			visit_order.push_back(block);
			for (auto itr = llvm::succ_begin(block); itr != llvm::succ_end(block); ++itr)
			{
				auto *succ = *itr;
				if (!bb_map.count(succ))
				{
					to_process.push_back(succ);
					auto succ_meta = std::make_unique<BlockMeta>(succ);
					bb_map[succ] = succ_meta.get();
					auto *succ_node = pool.create_node();
					bb_map[succ]->node = succ_node;
					succ_node->name = dxil_spv::to_string(++fake_label_id);
					metas.push_back(std::move(succ_meta));
				}

				bb_map[block]->node->add_branch(bb_map[succ]->node);
			}
		}
		processing.clear();
	}

	for (auto *bb : visit_order)
	{
		CFGNode *node = bb_map[bb]->node;
		combined_image_sampler_cache.clear();

		// Scan opcodes.
		for (auto &instruction : *bb)
		{
			if (!emit_instruction(node, instruction))
			{
				LOGE("Failed to emit instruction.\n");
				return {};
			}
		}

		auto *instruction = bb->getTerminator();
		if (auto *inst = llvm::dyn_cast<llvm::BranchInst>(instruction))
		{
			if (inst->isConditional())
			{
				node->ir.terminator.type = Terminator::Type::Condition;
				node->ir.terminator.conditional_id = get_id_for_value(inst->getCondition());
				assert(inst->getNumSuccessors() == 2);
				node->ir.terminator.true_block = bb_map[inst->getSuccessor(0)]->node;
				node->ir.terminator.false_block = bb_map[inst->getSuccessor(1)]->node;
			}
			else
			{
				node->ir.terminator.type = Terminator::Type::Branch;
				assert(inst->getNumSuccessors() == 1);
				node->ir.terminator.direct_block = bb_map[inst->getSuccessor(0)]->node;
			}
		}
		else if (auto *inst = llvm::dyn_cast<llvm::SwitchInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Switch;
			node->ir.terminator.default_node = bb_map[inst->getDefaultDest()]->node;
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

	return entry_node;
}

bool Converter::Impl::analyze_instructions(const llvm::Function *function)
{
	for (auto &bb : *function)
	{
		for (auto &inst : bb)
		{
			if (auto *load_inst = llvm::dyn_cast<llvm::LoadInst>(&inst))
			{
				if (!analyze_load_instruction(*this, load_inst))
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
			else if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&inst))
			{
				auto *called_function = call_inst->getCalledFunction();
				if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
				{
					if (!analyze_dxil_instruction(*this, call_inst))
						return false;
				}
			}
		}
	}
	return true;
}

bool Converter::Impl::composite_is_accessed(const llvm::Value *composite) const
{
	return llvm_composite_meta.find(composite) != llvm_composite_meta.end();
}

bool Converter::Impl::analyze_instructions()
{
	// Some things need to happen here. We try to figure out if a UAV is readonly or writeonly.
	// If readonly typed UAV, we emit an image format which corresponds to r32f, r32i or r32ui as to not
	// require StorageReadWithoutFormat capability. TODO: With FL 12, this might not be enough, but should be
	// good enough for time being.
	if (!analyze_instructions(get_entry_point_function(entry_point_meta)))
		return false;

	if (execution_model == spv::ExecutionModelTessellationControl)
		if (!analyze_instructions(execution_mode_meta.patch_constant_function))
			return false;

	return true;
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result = {};

	auto &module = bitcode_parser.get_module();
	entry_point_meta = get_entry_point_meta(module, options.entry_point.empty() ? nullptr : options.entry_point.c_str());
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
		auto *shader_model = module.getNamedMetadata("dx.shaderModel");
		if (shader_model)
		{
			auto *shader_model_node = shader_model->getOperand(0);
			if (shader_model_node)
			{
				uint32_t major = get_constant_metadata(shader_model_node, 1);
				uint32_t minor = get_constant_metadata(shader_model_node, 2);
				builder.setSource(spv::SourceLanguageUnknown, major * 100 + minor);
				builder.setSourceFile(options.shader_source_file);
			}
		}
	}

	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	spirv_module.emit_entry_point(get_execution_model(module, entry_point_meta), "main", options.physical_storage_buffer);

	if (!emit_resources_global_mapping())
		return result;

	if (!emit_execution_modes())
		return result;

	if (!analyze_instructions())
		return result;

	if (!emit_resources())
		return result;
	if (!emit_stage_input_variables())
		return result;
	if (!emit_stage_output_variables())
		return result;
	if (!emit_patch_variables())
		return result;
	if (!emit_global_variables())
		return result;

	llvm::Function *func = get_entry_point_function(entry_point_meta);
	assert(func);

	if (execution_model == spv::ExecutionModelTessellationControl)
		result.entry = build_hull_main(func, pool, result.leaf_functions);
	else
		result.entry = convert_function(func, pool);

	return result;
}

Operation *Converter::Impl::allocate(spv::Op op)
{
	return spirv_module.allocate_op(op);
}

Operation *Converter::Impl::allocate(spv::Op op, spv::Id id, spv::Id type_id)
{
	return spirv_module.allocate_op(op, id, type_id);
}

Operation *Converter::Impl::allocate(spv::Op op, spv::Id type_id)
{
	return spirv_module.allocate_op(op, spirv_module.allocate_id(), type_id);
}

Operation *Converter::Impl::allocate(spv::Op op, const llvm::Value *value)
{
	return spirv_module.allocate_op(op, get_id_for_value(value), get_type_id(value->getType()));
}

Operation *Converter::Impl::allocate(spv::Op op, const llvm::Value *value, spv::Id type_id)
{
	return spirv_module.allocate_op(op, get_id_for_value(value), type_id);
}

void Converter::Impl::add(Operation *op)
{
	assert(current_block);
	current_block->push_back(op);
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

DXIL::ComponentType Converter::Impl::get_effective_input_output_type(DXIL::ComponentType type)
{
	if (options.storage_16bit_input_output)
	{
		switch (type)
		{
		case DXIL::ComponentType::F16:
		case DXIL::ComponentType::I16:
		case DXIL::ComponentType::U16:
			builder().addCapability(spv::CapabilityStorageInputOutput16);
			break;

		default:
			break;
		}
	}
	else
	{
		// Expand/contract on load/store.
		// The only reasonable way this can break is if application relies on
		// lower precision in interpolation, but I don't think you can rely on that
		// kind of implementation detail ...
		switch (type)
		{
		case DXIL::ComponentType::F16:
			return DXIL::ComponentType::F32;
		case DXIL::ComponentType::I16:
			return DXIL::ComponentType::I32;
		case DXIL::ComponentType::U16:
			return DXIL::ComponentType::U32;
		default:
			break;
		}
	}

	return type;
}

spv::Id Converter::Impl::get_effective_input_output_type_id(DXIL::ComponentType type)
{
	return get_type_id(get_effective_input_output_type(type), 1, 1);
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

	default:
		break;
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
	switch (cap)
	{
	case Option::ShaderDemoteToHelper:
	case Option::DualSourceBlending:
	case Option::OutputSwizzle:
	case Option::RasterizerSampleCount:
	case Option::RootConstantInlineUniformBlock:
	case Option::BindlessCBVSSBOEmulation:
	case Option::PhysicalStorageBuffer:
	case Option::SBTDescriptorSizeLog2:
	case Option::SSBOAlignment:
	case Option::TypedUAVReadWithoutFormat:
	case Option::ShaderSourceFile:
	case Option::BindlessTypedBufferOffsets:
	case Option::BindlessOffsetBufferLayout:
	case Option::StorageInputOutput16:
		return true;

	default:
		return false;
	}
}

void Converter::set_entry_point(const char *entry)
{
	impl->options.entry_point = entry;
}
} // namespace dxil_spv
