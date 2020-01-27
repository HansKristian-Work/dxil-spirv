/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "logging.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "dxil_converter.hpp"
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

static std::string get_string_metadata(const llvm::MDNode *node, unsigned index)
{
	return llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
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

bool Converter::Impl::emit_srvs(const llvm::MDNode *srvs)
{
	auto &builder = spirv_module.get_builder();
	unsigned num_srvs = srvs->getNumOperands();

	for (unsigned i = 0; i < num_srvs; i++)
	{
		auto *srv = llvm::cast<llvm::MDNode>(srvs->getOperand(i));
		unsigned index = get_constant_metadata(srv, 0);
		auto name = get_string_metadata(srv, 2);
		unsigned bind_space = get_constant_metadata(srv, 3);
		unsigned bind_register = get_constant_metadata(srv, 4);
		unsigned range_size = get_constant_metadata(srv, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(srv, 6));

		llvm::MDNode *tags = nullptr;
		if (srv->getNumOperands() >= 9 && srv->getOperand(8))
			tags = llvm::dyn_cast<llvm::MDNode>(srv->getOperand(8));

		spv::Id sampled_type_id = 0;
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

		sampled_type_id = get_type_id(component_type, 1, 1);

		spv::Id type_id =
		    builder.makeImageType(sampled_type_id, image_dimension_from_resource_kind(resource_kind), false,
		                          image_dimension_is_arrayed(resource_kind),
		                          image_dimension_is_multisampled(resource_kind), 1, spv::ImageFormatUnknown);

		if (range_size != 1)
		{
			if (range_size == ~0u)
			{
				type_id = builder.makeRuntimeArray(type_id);
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}
			else
				type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);

			if (resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			    resource_kind == DXIL::ResourceKind::RawBuffer ||
			    resource_kind == DXIL::ResourceKind::TypedBuffer)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityUniformTexelBufferArrayDynamicIndexingEXT);
			}
			else
				builder.addCapability(spv::CapabilitySampledImageArrayDynamicIndexing);
		}

		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		D3DBinding d3d_binding = { get_remapping_stage(execution_model), resource_kind, index, bind_space, bind_register, range_size };
		VulkanBinding vulkan_binding = { bind_space, bind_register };
		if (resource_mapping_iface && !resource_mapping_iface->remap_srv(d3d_binding, vulkan_binding))
			return false;

		// Not supported yet.
		if (vulkan_binding.bindless.use_heap)
			return false;

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.descriptor_set);
		builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.binding);
		srv_index_to_id.resize(std::max(srv_index_to_id.size(), size_t(index + 1)));
		srv_index_to_id[index] = var_id;
		handle_to_resource_meta[var_id] = { resource_kind, component_type, stride, var_id, 0u, false };
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
		auto name = get_string_metadata(uav, 2);
		unsigned bind_space = get_constant_metadata(uav, 3);
		unsigned bind_register = get_constant_metadata(uav, 4);
		unsigned range_size = get_constant_metadata(uav, 5);

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(uav, 6));

		bool globally_coherent = get_constant_metadata(uav, 7) != 0;
		bool has_counter = get_constant_metadata(uav, 8) != 0;
		bool is_rov = get_constant_metadata(uav, 9) != 0;
		assert(!is_rov);

		llvm::MDNode *tags = nullptr;
		if (uav->getNumOperands() >= 11 && uav->getOperand(10))
			tags = llvm::dyn_cast<llvm::MDNode>(uav->getOperand(10));

		spv::Id element_type_id = 0;
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

		element_type_id = get_type_id(component_type, 1, 1);

		spv::Id type_id = builder.makeImageType(element_type_id, image_dimension_from_resource_kind(resource_kind),
		                                        false, image_dimension_is_arrayed(resource_kind),
		                                        image_dimension_is_multisampled(resource_kind), 2, format);

		if (range_size != 1)
		{
			if (range_size == ~0u)
			{
				type_id = builder.makeRuntimeArray(type_id);
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}
			else
				type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);

			if (resource_kind == DXIL::ResourceKind::StructuredBuffer ||
			    resource_kind == DXIL::ResourceKind::RawBuffer ||
			    resource_kind == DXIL::ResourceKind::TypedBuffer)
			{
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityStorageTexelBufferArrayDynamicIndexingEXT);
			}
			else
				builder.addCapability(spv::CapabilityStorageImageArrayDynamicIndexing);
		}

		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		D3DUAVBinding d3d_binding = {};
		d3d_binding.counter = has_counter;
		d3d_binding.binding = { get_remapping_stage(execution_model), resource_kind, index, bind_space, bind_register, range_size };
		VulkanUAVBinding vulkan_binding = {{ bind_space, bind_register }, { bind_space + 1, bind_register }};
		if (resource_mapping_iface && !resource_mapping_iface->remap_uav(d3d_binding, vulkan_binding))
			return false;

		// Not supported yet.
		if (vulkan_binding.buffer_binding.bindless.use_heap)
			return false;

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer_binding.descriptor_set);
		builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer_binding.binding);

		if (globally_coherent)
			builder.addDecoration(var_id, spv::DecorationCoherent);

		uav_index_to_id.resize(std::max(uav_index_to_id.size(), size_t(index + 1)));
		uav_index_to_id[index] = var_id;

		spv::Id counter_var_id = 0;
		if (has_counter)
		{
			counter_var_id = builder.createVariable(spv::StorageClassUniformConstant, type_id,
			                                        name.empty() ? nullptr : (name + "Counter").c_str());

			// Not supported yet.
			if (vulkan_binding.counter_binding.bindless.use_heap)
				return false;

			builder.addDecoration(counter_var_id, spv::DecorationDescriptorSet, vulkan_binding.counter_binding.descriptor_set);
			builder.addDecoration(counter_var_id, spv::DecorationBinding, vulkan_binding.counter_binding.binding);
		}
		handle_to_resource_meta[var_id] = { resource_kind, component_type, stride, var_id, counter_var_id, false };
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
		auto name = get_string_metadata(cbv, 2);
		unsigned bind_space = get_constant_metadata(cbv, 3);
		unsigned bind_register = get_constant_metadata(cbv, 4);
		unsigned range_size = get_constant_metadata(cbv, 5);
		unsigned cbv_size = get_constant_metadata(cbv, 6);

		D3DBinding d3d_binding = { get_remapping_stage(execution_model), DXIL::ResourceKind::CBuffer, index, bind_space, bind_register, range_size };
		VulkanCBVBinding vulkan_binding = {};
		vulkan_binding.buffer = { bind_space, bind_register };
		if (resource_mapping_iface && !resource_mapping_iface->remap_cbv(d3d_binding, vulkan_binding))
			return false;

		cbv_index_to_id.resize(std::max(cbv_index_to_id.size(), size_t(index + 1)));
		cbv_push_constant_member.resize(std::max(cbv_push_constant_member.size(), size_t(index + 1)));

		if (vulkan_binding.push_constant)
		{
			if (root_constant_id == 0)
			{
				LOGE("Must have setup push constant block to use root constant path.\n");
				return false;
			}

			cbv_index_to_id[index] = root_constant_id;
			cbv_push_constant_member[index] = vulkan_binding.push.offset_in_words;
		}
		else
		{
			unsigned vec4_length = (cbv_size + 15) / 16;

			// It seems like we will have to bitcast ourselves away from vec4 here after loading.
			spv::Id member_array_type = builder.makeArrayType(builder.makeVectorType(builder.makeFloatType(32), 4),
			                                                  builder.makeUintConstant(vec4_length, false), 16);

			builder.addDecoration(member_array_type, spv::DecorationArrayStride, 16);

			spv::Id type_id = builder.makeStructType({member_array_type}, name.c_str());
			builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
			builder.addDecoration(type_id, spv::DecorationBlock);

			if (range_size != 1)
			{
				if (range_size == ~0u)
				{
					type_id = builder.makeRuntimeArray(type_id);
					builder.addExtension("SPV_EXT_descriptor_indexing");
					builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
				}
				else
					type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);

				builder.addCapability(spv::CapabilityUniformBufferArrayDynamicIndexing);
			}

			spv::Id var_id =
					builder.createVariable(spv::StorageClassUniform, type_id, name.empty() ? nullptr : name.c_str());


			builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.buffer.descriptor_set);
			builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.buffer.binding);

			cbv_index_to_id[index] = var_id;
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
		auto name = get_string_metadata(sampler, 2);
		unsigned bind_space = get_constant_metadata(sampler, 3);
		unsigned bind_register = get_constant_metadata(sampler, 4);
		unsigned range_size = get_constant_metadata(sampler, 5);

		spv::Id type_id = builder.makeSamplerType();

		if (range_size != 1)
		{
			// There does not seem to be any capability associated with sampler array dynamic indexing of any kind,
			// so we will have to validate that any index is constant.
			if (range_size == ~0u)
			{
				type_id = builder.makeRuntimeArray(type_id);
				builder.addExtension("SPV_EXT_descriptor_indexing");
				builder.addCapability(spv::CapabilityRuntimeDescriptorArrayEXT);
			}
			else
				type_id = builder.makeArrayType(type_id, builder.makeUintConstant(range_size), 0);
		}

		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		D3DBinding d3d_binding = { get_remapping_stage(execution_model), DXIL::ResourceKind::Sampler, index, bind_space, bind_register, range_size };
		VulkanBinding vulkan_binding = { bind_space, bind_register };
		if (resource_mapping_iface && !resource_mapping_iface->remap_sampler(d3d_binding, vulkan_binding))
			return false;

		// Not supported yet.
		if (vulkan_binding.bindless.use_heap)
			return false;

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, vulkan_binding.descriptor_set);
		builder.addDecoration(var_id, spv::DecorationBinding, vulkan_binding.binding);

		sampler_index_to_id.resize(std::max(sampler_index_to_id.size(), size_t(index + 1)));
		sampler_index_to_id[index] = var_id;
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
		VulkanBinding vulkan_binding = {};
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

		D3DUAVBinding d3d_binding = { { stage, resource_kind, index, bind_space, bind_register, range_size }, has_counter };
		VulkanUAVBinding vulkan_binding = {};
		if (iface && !iface->remap_uav(d3d_binding, vulkan_binding))
			return false;
	}

	return true;
}

void Converter::Impl::emit_root_constants(unsigned num_words)
{
	auto &builder = spirv_module.get_builder();

	// Root constants cannot be dynamically indexed in DXIL, so emit them as members.
	std::vector<spv::Id> members(num_words);
	for (auto &memb : members)
		memb = builder.makeUintType(32);

	spv::Id type_id = builder.makeStructType(members, "RootConstants");
	builder.addDecoration(type_id, spv::DecorationBlock);
	for (unsigned i = 0; i < num_words; i++)
		builder.addMemberDecoration(type_id, i, spv::DecorationOffset, 4 * i);

	root_constant_id = builder.createVariable(spv::StorageClassPushConstant, type_id, "registers");
	root_constant_num_words = num_words;
}

bool Converter::Impl::emit_resources()
{
	unsigned num_root_constant_words = 0;
	if (resource_mapping_iface)
		num_root_constant_words = resource_mapping_iface->get_root_constant_word_count();

	if (num_root_constant_words != 0)
		emit_root_constants(num_root_constant_words);

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
	default:
		return ShaderStage::Unknown;
	}
}

spv::Id Converter::Impl::get_id_for_constant(const llvm::Constant *constant, unsigned forced_width)
{
	auto &builder = spirv_module.get_builder();

	switch (constant->getType()->getTypeID())
	{
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
		switch (integer_width)
		{
		case 32:
			return builder.makeUintConstant(constant->getUniqueInteger().getZExtValue());

		default:
			return 0;
		}
	}

	case llvm::Type::TypeID::ArrayTyID:
	{
		std::vector<spv::Id> constituents;
		spv::Id type_id = get_type_id(constant->getType());

		if (llvm::isa<llvm::ConstantAggregateZero>(constant))
		{
			return builder.makeNullConstant(type_id);
		}
		else
		{
			auto *array = llvm::cast<llvm::ConstantDataArray>(constant);
			constituents.reserve(array->getType()->getArrayNumElements());
			for (unsigned i = 0; i < array->getNumElements(); i++)
			{
				llvm::Constant *c = array->getElementAsConstant(i);
				constituents.push_back(get_id_for_constant(c, 0));
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

static std::string get_entry_point_name(const llvm::Module &module)
{
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	return llvm::cast<llvm::MDString>(node->getOperand(1))->getString();
}

static spv::ExecutionModel get_execution_model(const llvm::Module &module)
{
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
	else
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
			return builder.makeIntegerType(type->getIntegerBitWidth(), false);

	case llvm::Type::TypeID::PointerTyID:
	{
		// Have to deal with this from the outside. Should only be relevant for getelementptr and instructions like that.
		LOGE("Cannot reliably convert LLVM pointer type, we cannot differentiate between Function and Private.\n");
		std::terminate();
	}

	case llvm::Type::TypeID::ArrayTyID:
		return builder.makeArrayType(get_type_id(type->getArrayElementType()),
		                             builder.makeUintConstant(type->getArrayNumElements(), false), 0);

	default:
		return 0;
	}
}

spv::Id Converter::Impl::get_type_id(DXIL::ComponentType element_type, unsigned rows, unsigned cols)
{
	auto &builder = spirv_module.get_builder();

	spv::Id component_type;
	switch (element_type)
	{
	case DXIL::ComponentType::I1:
		component_type = builder.makeBoolType();
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
	if (rows > 1)
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
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);

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
			variable_name += std::to_string(semantic_index);
		}

		spv::Id variable_id = builder.createVariable(storage, type_id, variable_name.c_str());
		patch_elements_meta[element_id] = { variable_id, element_type };

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
		spirv_module.get_entry_point()->addIdOperand(variable_id);
	}

	return true;
}

bool Converter::Impl::emit_stage_output_variables()
{
	auto &module = bitcode_parser.get_module();

	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);

	if (!node->getOperand(2))
		return true;

	auto &signature = node->getOperand(2);
	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &outputs = signature_node->getOperand(1);
	if (!outputs)
		return true;

	auto *outputs_node = llvm::dyn_cast<llvm::MDNode>(outputs);

	auto &builder = spirv_module.get_builder();

	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		auto element_id = get_constant_metadata(output, 0);
		auto semantic_name = get_string_metadata(output, 1);
		auto element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(output, 2));
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

		spv::Id type_id = get_type_id(element_type, rows, cols);

		if (system_value == DXIL::Semantic::Position)
		{
			type_id = get_type_id(element_type, rows, 4);
		}
		else if (system_value == DXIL::Semantic::Coverage)
		{
			type_id = builder.makeArrayType(type_id, builder.makeUintConstant(1), 0);
		}
		else if (system_value == DXIL::Semantic::ClipDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			unsigned num_elements = rows * cols;
			execution_mode_meta.stage_output_clip_distance_stride = cols;
			type_id = get_type_id(element_type, num_elements, 1);
		}

		if (execution_model == spv::ExecutionModelTessellationControl)
		{
			type_id = builder.makeArrayType(
			    type_id, builder.makeUintConstant(execution_mode_meta.stage_output_num_vertex, 0), 0);
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += std::to_string(semantic_index);
		}

		spv::Id variable_id = builder.createVariable(spv::StorageClassOutput, type_id, variable_name.c_str());
		output_elements_meta[element_id] = { variable_id, element_type };

		if (execution_model == spv::ExecutionModelVertex ||
		    execution_model == spv::ExecutionModelGeometry ||
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
				}
			}
			else
				builder.addDecoration(variable_id, spv::DecorationLocation, start_row);

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

			builder.addDecoration(variable_id, spv::DecorationLocation, start_row);
			if (start_col != 0)
				builder.addDecoration(variable_id, spv::DecorationComponent, start_col);
		}

		spirv_module.get_entry_point()->addIdOperand(variable_id);
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

	case DXIL::Semantic::RenderTargetArrayIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInLayer);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInLayer);
		else
		{
			spirv_module.register_builtin_shader_input(id, spv::BuiltInLayer);
			builder.addDecoration(id, spv::DecorationFlat);
		}
		builder.addCapability(spv::CapabilityGeometry);
		break;

	case DXIL::Semantic::ViewPortArrayIndex:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInViewportIndex);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInViewportIndex);
		else
			spirv_module.register_builtin_shader_input(id, spv::BuiltInViewportIndex);
		builder.addCapability(spv::CapabilityMultiViewport);
		break;

	case DXIL::Semantic::PrimitiveID:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPrimitiveId);
		if (storage == spv::StorageClassOutput)
			spirv_module.register_builtin_shader_output(id, spv::BuiltInPrimitiveId);
		else
			spirv_module.register_builtin_shader_input(id, spv::BuiltInPrimitiveId);
		builder.addCapability(spv::CapabilityGeometry);
		break;

	default:
		LOGE("Unknown DXIL semantic.\n");
		break;
	}
}

bool Converter::Impl::emit_global_variables()
{
	auto &module = bitcode_parser.get_module();
	auto &builder = spirv_module.get_builder();

	for (auto itr = module.global_begin(); itr != module.global_end(); ++itr)
	{
		llvm::GlobalVariable &global = *itr;

		spv::Id pointee_type_id = get_type_id(global.getType()->getPointerElementType());
		auto address_space = static_cast<DXIL::AddressSpace>(global.getType()->getAddressSpace());
		spv::Id initializer_id = 0;

		llvm::Constant *initializer = nullptr;
		if (global.hasInitializer())
			initializer = global.getInitializer();
		if (initializer && llvm::isa<llvm::UndefValue>(initializer))
			initializer = nullptr;

		// Workaround strange DXIL codegen where a resource is declared as an external constant.
		if (global.getType()->getPointerElementType()->getTypeID() == llvm::Type::TypeID::StructTyID)
			continue;

		if (address_space == DXIL::AddressSpace::GroupShared)
		{
			if (initializer)
			{
				LOGE("Global variable address space cannot have initializer! Ignoring ...\n");
				return false;
			}
		}
		else
		{
			if (!global.isConstant())
			{
				LOGE("Declaring LUT, but it must be constant.\n");
				return false;
			}
		}

		if (initializer)
			initializer_id = get_id_for_constant(initializer, 0);

		spv::Id var_id = builder.createVariableWithInitializer(
		    address_space == DXIL::AddressSpace::GroupShared ? spv::StorageClassWorkgroup : spv::StorageClassPrivate,
		    pointee_type_id, initializer_id, global.getName().data());
		value_map[&global] = var_id;
	}

	return true;
}

bool Converter::Impl::emit_stage_input_variables()
{
	auto &module = bitcode_parser.get_module();

	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
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

	for (unsigned i = 0; i < inputs_node->getNumOperands(); i++)
	{
		auto *input = llvm::cast<llvm::MDNode>(inputs_node->getOperand(i));
		auto element_id = get_constant_metadata(input, 0);
		auto semantic_name = get_string_metadata(input, 1);
		auto element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(input, 2));
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

		spv::Id type_id = get_type_id(element_type, rows, cols);
		if (system_value == DXIL::Semantic::Position)
		{
			type_id = get_type_id(element_type, rows, 4);
		}
		else if (system_value == DXIL::Semantic::IsFrontFace)
		{
			// Need to cast this to uint when loading the semantic input.
			type_id = builder.makeBoolType();
		}
		else if (system_value == DXIL::Semantic::ClipDistance)
		{
			// DX is rather weird here and you can declare clip distance either as a vector or array, or both!
			unsigned num_elements = rows * cols;
			execution_mode_meta.stage_input_clip_distance_stride = cols;
			type_id = get_type_id(element_type, num_elements, 1);
		}
		else if (system_value == DXIL::Semantic::PrimitiveID)
			arrayed_input = false;

		if (arrayed_input)
		{
			type_id =
			    builder.makeArrayType(type_id, builder.makeUintConstant(execution_mode_meta.stage_input_num_vertex), 0);
		}

		auto variable_name = semantic_name;
		if (semantic_index != 0)
		{
			variable_name += "_";
			variable_name += std::to_string(semantic_index);
		}

		spv::Id variable_id = builder.createVariable(spv::StorageClassInput, type_id, variable_name.c_str());
		input_elements_meta[element_id] = { variable_id, static_cast<DXIL::ComponentType>(element_type) };

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

		spirv_module.get_entry_point()->addIdOperand(variable_id);
	}

	return true;
}

spv::Id Converter::Impl::build_sampled_image(spv::Id image_id, spv::Id sampler_id, bool comparison)
{
	auto &builder = spirv_module.get_builder();
	spv::Id image_type_id = get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);
	bool multisampled = builder.isMultisampledImageType(image_type_id);
	spv::Id sampled_format = builder.getImageComponentType(image_type_id);

	image_type_id =
	    builder.makeImageType(sampled_format, dim, comparison, arrayed, multisampled, 2, spv::ImageFormatUnknown);

	Operation *op = allocate(spv::OpSampledImage, builder.makeSampledImageType(image_type_id));
	op->add_ids({ image_id, sampler_id });
	add(op);

	bool is_non_uniform = handle_to_resource_meta[image_id].non_uniform;
	if (is_non_uniform)
		builder.addDecoration(op->id, spv::DecorationNonUniformEXT);

	return op->id;
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

void Converter::Impl::fixup_load_sign(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value)
{
	if (component_type == DXIL::ComponentType::I32)
	{
		Operation *op = allocate(spv::OpBitcast, get_type_id(DXIL::ComponentType::U32, 1, components));
		op->add_id(get_id_for_value(value));
		add(op);
		value_map[value] = op->id;
	}
}

spv::Id Converter::Impl::fixup_store_sign(DXIL::ComponentType component_type, unsigned components, spv::Id value)
{
	if (component_type == DXIL::ComponentType::I32)
	{
		Operation *op = allocate(spv::OpBitcast, get_type_id(DXIL::ComponentType::I32, 1, components));
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
	else if (auto *binary_inst = llvm::dyn_cast<llvm::BinaryOperator>(&instruction))
		return emit_binary_instruction(*this, binary_inst);
	else if (auto *unary_inst = llvm::dyn_cast<llvm::UnaryOperator>(&instruction))
		return emit_unary_instruction(*this, unary_inst);
	else if (auto *cast_inst = llvm::dyn_cast<llvm::CastInst>(&instruction))
		return emit_cast_instruction(*this, cast_inst);
	else if (auto *getelementptr_inst = llvm::dyn_cast<llvm::GetElementPtrInst>(&instruction))
		return emit_getelementptr_instruction(*this, getelementptr_inst);
	else if (auto *load_inst = llvm::dyn_cast<llvm::LoadInst>(&instruction))
		return emit_load_instruction(*this, load_inst);
	else if (auto *store_inst = llvm::dyn_cast<llvm::StoreInst>(&instruction))
		return emit_store_instruction(*this, store_inst);
	else if (auto *compare_inst = llvm::dyn_cast<llvm::CmpInst>(&instruction))
		return emit_compare_instruction(*this, compare_inst);
	else if (auto *extract_inst = llvm::dyn_cast<llvm::ExtractValueInst>(&instruction))
		return emit_extract_value_instruction(*this, extract_inst);
	else if (auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(&instruction))
		return emit_alloca_instruction(*this, alloca_inst);
	else if (auto *select_inst = llvm::dyn_cast<llvm::SelectInst>(&instruction))
		return emit_select_instruction(*this, select_inst);
	else if (auto *atomic_inst = llvm::dyn_cast<llvm::AtomicRMWInst>(&instruction))
		return emit_atomicrmw_instruction(*this, atomic_inst);
	else if (auto *cmpxchg_inst = llvm::dyn_cast<llvm::AtomicCmpXchgInst>(&instruction))
		return emit_cmpxchg_instruction(*this, cmpxchg_inst);
	else if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(&instruction))
		return emit_phi_instruction(block, *phi_inst);

	current_block = nullptr;
	return false;
}

bool Converter::Impl::emit_execution_modes_compute()
{
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &builder = spirv_module.get_builder();

	if (node->getOperand(4))
	{
		auto *tag_values = llvm::cast<llvm::MDNode>(node->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			auto tag = static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i));
			if (tag == DXIL::ShaderPropertyTag::NumThreads)
			{
				auto *num_threads = llvm::cast<llvm::MDNode>(tag_values->getOperand(2 * i + 1));
				unsigned threads[3];
				for (unsigned dim = 0; dim < 3; dim++)
					threads[dim] = get_constant_metadata(num_threads, dim);

				builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeLocalSize, threads[0],
				                         threads[1], threads[2]);
			}
		}
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_pixel()
{
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &builder = spirv_module.get_builder();

	if (node->getOperand(4))
	{
		auto *tag_values = llvm::cast<llvm::MDNode>(node->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			auto tag = static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i));
			if (tag == DXIL::ShaderPropertyTag::ShaderFlags)
			{
				auto flags = get_constant_metadata<uint64_t>(tag_values, 2 * i + 1);
				if (flags & DXIL::ShaderFlagEarlyDepthStencil)
					builder.addExecutionMode(spirv_module.get_entry_function(), spv::ExecutionModeEarlyFragmentTests);
			}
		}
	}
	return true;
}

bool Converter::Impl::emit_execution_modes_domain()
{
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityTessellation);

	if (node->getOperand(4))
	{
		auto *tag_values = llvm::cast<llvm::MDNode>(node->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			auto tag = static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i));
			if (tag == DXIL::ShaderPropertyTag::DSState)
			{
				auto *arguments = llvm::cast<llvm::MDNode>(tag_values->getOperand(2 * i + 1));
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
			}
		}
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_hull()
{
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityTessellation);

	if (node->getOperand(4))
	{
		auto *tag_values = llvm::cast<llvm::MDNode>(node->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			auto tag = static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i));
			if (tag == DXIL::ShaderPropertyTag::HSState)
			{
				auto *arguments = llvm::cast<llvm::MDNode>(tag_values->getOperand(2 * i + 1));

				auto *patch_constant = llvm::cast<llvm::ValueAsMetadata>(arguments->getOperand(0));
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
			}
		}
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes_geometry()
{
	auto &module = bitcode_parser.get_module();
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &builder = spirv_module.get_builder();
	builder.addCapability(spv::CapabilityGeometry);

	if (node->getOperand(4))
	{
		auto *tag_values = llvm::cast<llvm::MDNode>(node->getOperand(4));
		unsigned num_pairs = tag_values->getNumOperands() / 2;
		for (unsigned i = 0; i < num_pairs; i++)
		{
			auto tag = static_cast<DXIL::ShaderPropertyTag>(get_constant_metadata(tag_values, 2 * i));
			if (tag == DXIL::ShaderPropertyTag::GSState)
			{
				auto *arguments = llvm::cast<llvm::MDNode>(tag_values->getOperand(2 * i + 1));

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
			}
		}
		return true;
	}
	else
		return false;
}

bool Converter::Impl::emit_execution_modes()
{
	auto &module = bitcode_parser.get_module();
	execution_model = get_execution_model(module);

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

	default:
		break;
	}

	return true;
}

CFGNode *Converter::Impl::build_hull_main(llvm::Function *func, CFGNodePool &pool,
                                          std::vector<ConvertedFunction::LeafFunction> &leaves)
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
	entry_node->name = entry->getName().data();
	entry_node->name += ".entry";
	metas.push_back(std::move(entry_meta));

	std::vector<llvm::BasicBlock *> to_process;
	std::vector<llvm::BasicBlock *> processing;
	to_process.push_back(entry);
	std::vector<llvm::BasicBlock *> visit_order;

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

					if (succ->getName().empty())
						succ_node->name = std::to_string(++fake_label_id);
					else
						succ_node->name = succ->getName().data();

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

	return entry_node;
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result = {};
	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	auto *module = &bitcode_parser.get_module();
	spirv_module.emit_entry_point(get_execution_model(*module), "main");

	if (!emit_execution_modes())
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

	llvm::Function *func = module->getFunction(get_entry_point_name(*module));
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

void Converter::Impl::add_capability(const OptionBase &cap)
{
	switch (cap.type)
	{
	case Option::ShaderDemoteToHelper:
		options.shader_demote = static_cast<const OptionShaderDemoteToHelper &>(cap).supported;
		break;

	case Option::DualSourceBlending:
		options.dual_source_blending = static_cast<const OptionDualSourceBlending &>(cap).enabled;
		break;

	default:
		break;
	}
}

void Converter::set_resource_remapping_interface(ResourceRemappingInterface *iface)
{
	impl->resource_mapping_iface = iface;
}

ShaderStage Converter::get_shader_stage(const LLVMBCParser &bitcode_parser)
{
	return Impl::get_remapping_stage(get_execution_model(bitcode_parser.get_module()));
}

void Converter::scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &bitcode_parser)
{
	Impl::scan_resources(iface, bitcode_parser);
}

void Converter::add_option(const OptionBase &cap)
{
	impl->add_capability(cap);
}

bool Converter::recognizes_option(Option cap)
{
	switch (cap)
	{
	case Option::ShaderDemoteToHelper:
	case Option::DualSourceBlending:
		return true;

	default:
		return false;
	}
}

} // namespace dxil_spv
