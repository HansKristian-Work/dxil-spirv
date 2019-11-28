/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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

#include <utility>

namespace DXIL2SPIRV
{
Converter::Converter(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_, SPIRVModule &module_)
{
	impl = std::make_unique<Impl>(std::move(container_parser_), std::move(bitcode_parser_), module_);
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

void Converter::Impl::emit_srvs(const llvm::MDNode *srvs)
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
		// range_size = 5

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(srv, 6));

		auto *tags = srv->getNumOperands() >= 9 ? llvm::dyn_cast<llvm::MDNode>(srv->getOperand(8)) : nullptr;
		assert(tags);

		spv::Id sampled_type_id = 0;
		if (get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			sampled_type_id = get_type_id(static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1)), 1, 1);
		}
		else
		{
			// Structured/Raw buffers, just use uint for good measure, we'll bitcast as needed.
			// Field 1 is stride, but we don't care about that unless we will support an SSBO path.
			sampled_type_id = builder.makeUintType(32);
		}

		spv::Id type_id =
		    builder.makeImageType(sampled_type_id, image_dimension_from_resource_kind(resource_kind), false,
		                          image_dimension_is_arrayed(resource_kind),
		                          image_dimension_is_multisampled(resource_kind), 1, spv::ImageFormatUnknown);

		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, bind_space);
		builder.addDecoration(var_id, spv::DecorationBinding, bind_register);

		srv_index_to_id.resize(std::max(srv_index_to_id.size(), size_t(index + 1)));
		srv_index_to_id[index] = var_id;
	}
}

void Converter::Impl::emit_uavs(const llvm::MDNode *uavs)
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
		// range_size = 5

		auto resource_kind = static_cast<DXIL::ResourceKind>(get_constant_metadata(uav, 6));

		bool globally_coherent = get_constant_metadata(uav, 7) != 0;
		bool has_counter = get_constant_metadata(uav, 8) != 0;
		bool is_rov = get_constant_metadata(uav, 9) != 0;
		assert(!has_counter);
		assert(!is_rov);

		auto *tags = uav->getNumOperands() >= 11 ? llvm::dyn_cast<llvm::MDNode>(uav->getOperand(10)) : nullptr;
		assert(tags);

		spv::Id element_type_id = 0;
		if (get_constant_metadata(tags, 0) == 0)
		{
			// Sampled format.
			element_type_id = get_type_id(static_cast<DXIL::ComponentType>(get_constant_metadata(tags, 1)), 1, 1);
		}
		else
		{
			// Structured/Raw buffers, just use uint for good measure, we'll bitcast as needed.
			// Field 1 is stride, but we don't care about that unless we will support an SSBO path.
			element_type_id = builder.makeUintType(32);
		}

		spv::Id type_id =
		    builder.makeImageType(element_type_id, image_dimension_from_resource_kind(resource_kind), false,
		                          image_dimension_is_arrayed(resource_kind),
		                          image_dimension_is_multisampled(resource_kind), 2, spv::ImageFormatUnknown);

		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, bind_space);
		builder.addDecoration(var_id, spv::DecorationBinding, bind_register);

		if (globally_coherent)
			builder.addDecoration(var_id, spv::DecorationCoherent);

		uav_index_to_id.resize(std::max(uav_index_to_id.size(), size_t(index + 1)));
		uav_index_to_id[index] = var_id;
	}
}

void Converter::Impl::emit_cbvs(const llvm::MDNode *cbvs)
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
		// range_size = 5
		unsigned cbv_size = get_constant_metadata(cbv, 6);

		unsigned vec4_length = (cbv_size + 15) / 16;

		// It seems like we will have to bitcast ourselves away from vec4 here after loading.
		spv::Id member_array_type = builder.makeArrayType(builder.makeVectorType(builder.makeFloatType(32), 4),
		                                                  builder.makeUintConstant(vec4_length, false), 16);

		builder.addDecoration(member_array_type, spv::DecorationArrayStride, 16);

		spv::Id type_id = builder.makeStructType({ member_array_type }, name.c_str());
		builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
		builder.addDecoration(type_id, spv::DecorationBlock);
		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniform, type_id, name.empty() ? nullptr : name.c_str());

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, bind_space);
		builder.addDecoration(var_id, spv::DecorationBinding, bind_register);

		cbv_index_to_id.resize(std::max(cbv_index_to_id.size(), size_t(index + 1)));
		cbv_index_to_id[index] = var_id;
	}
}

void Converter::Impl::emit_samplers(const llvm::MDNode *samplers)
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
		// range_size = 5

		spv::Id type_id = builder.makeSamplerType();
		spv::Id var_id =
		    builder.createVariable(spv::StorageClassUniformConstant, type_id, name.empty() ? nullptr : name.c_str());

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, bind_space);
		builder.addDecoration(var_id, spv::DecorationBinding, bind_register);

		sampler_index_to_id.resize(std::max(sampler_index_to_id.size(), size_t(index + 1)));
		sampler_index_to_id[index] = var_id;
	}
}

void Converter::Impl::emit_resources()
{
	auto &module = bitcode_parser.get_module();
	auto *resource_meta = module.getNamedMetadata("dx.resources");
	if (!resource_meta)
		return;

	auto *metas = resource_meta->getOperand(0);

	if (metas->getOperand(0))
		emit_srvs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(0)));
	if (metas->getOperand(1))
		emit_uavs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(1)));
	if (metas->getOperand(2))
		emit_cbvs(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(2)));
	if (metas->getOperand(3))
		emit_samplers(llvm::dyn_cast<llvm::MDNode>(metas->getOperand(3)));
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
		return builder.makePointer(spv::StorageClassFunction, get_type_id(type->getPointerElementType()));

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

	if (rows == 1 && cols == 1)
		return component_type;
	else if (rows == 1)
	{
		auto vector_type = builder.makeVectorType(component_type, cols);
		return vector_type;
	}
	else
	{
		auto matrix_type = builder.makeMatrixType(component_type, rows, cols);
		return matrix_type;
	}
}

spv::Id Converter::Impl::get_type_id(spv::Id id) const
{
	auto itr = id_to_type.find(id);
	if (itr == id_to_type.end())
		return 0;
	else
		return itr->second;
}

void Converter::Impl::emit_stage_output_variables()
{
	auto &module = bitcode_parser.get_module();

	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &signature = node->getOperand(2);

	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &outputs = signature_node->getOperand(1);
	if (!outputs)
		return;

	auto *outputs_node = llvm::dyn_cast<llvm::MDNode>(outputs);

	auto &builder = spirv_module.get_builder();

	unsigned location = 0;

	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		auto element_id = get_constant_metadata(output, 0);
		auto semantic_name = get_string_metadata(output, 1);
		auto element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(output, 2));
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(output, 3));

		// Semantic index?
		auto interpolation = static_cast<DXIL::InterpolationMode>(get_constant_metadata(output, 5));
		auto rows = get_constant_metadata(output, 6);
		auto cols = get_constant_metadata(output, 7);

#if 0
		auto start_row = get_constant_metadata(input, 8);
		auto col = get_constant_metadata(input, 9);
#endif

#if 0
		LOGE("Semantic output %u: %s\n", element_id, semantic_name.c_str());
		LOGE("  Type: %u\n", element_type);
		LOGE("  System value: %u\n", system_value);
		LOGE("  Interpolation: %u\n", interpolation);
		LOGE("  Rows: %u\n", rows);
		LOGE("  Cols: %u\n", cols);
		LOGE("  Start row: %u\n", start_row);
		LOGE("  Col: %u\n", col);
#endif

		spv::Id type_id = get_type_id(element_type, rows, cols);
		spv::Id variable_id = builder.createVariable(spv::StorageClassOutput, type_id, semantic_name.c_str());
		output_elements_meta[element_id] = { variable_id, element_type };

		if (system_value == DXIL::Semantic::Target)
		{
			auto semantic_index = get_constant_metadata(output, 8);
			builder.addDecoration(variable_id, spv::DecorationLocation, semantic_index);
		}
		else if (system_value != DXIL::Semantic::User)
		{
			emit_builtin_decoration(variable_id, system_value);
		}
		else
		{
			emit_interpolation_decorations(variable_id, interpolation);
			builder.addDecoration(variable_id, spv::DecorationLocation, location);
			location += rows;
		}

		spirv_module.get_entry_point()->addIdOperand(variable_id);
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

void Converter::Impl::emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic)
{
	auto &builder = spirv_module.get_builder();
	switch (semantic)
	{
	case DXIL::Semantic::Position:
		builder.addDecoration(id, spv::DecorationBuiltIn, spv::BuiltInPosition);
		break;

	default:
		break;
	}
}

void Converter::Impl::emit_stage_input_variables()
{
	auto &module = bitcode_parser.get_module();

	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &signature = node->getOperand(2);

	auto *signature_node = llvm::cast<llvm::MDNode>(signature);
	auto &inputs = signature_node->getOperand(0);
	if (!inputs)
		return;

	auto *inputs_node = llvm::dyn_cast<llvm::MDNode>(inputs);

	auto &builder = spirv_module.get_builder();

	unsigned location = 0;

	for (unsigned i = 0; i < inputs_node->getNumOperands(); i++)
	{
		auto *input = llvm::cast<llvm::MDNode>(inputs_node->getOperand(i));
		auto element_id = get_constant_metadata(input, 0);
		auto semantic_name = get_string_metadata(input, 1);
		auto element_type = static_cast<DXIL::ComponentType>(get_constant_metadata(input, 2));
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(input, 3));

		// Semantic index?
		auto interpolation = static_cast<DXIL::InterpolationMode>(get_constant_metadata(input, 5));
		auto rows = get_constant_metadata(input, 6);
		auto cols = get_constant_metadata(input, 7);

#if 0
		auto start_row = get_constant_metadata(input, 8);
		auto col = get_constant_metadata(input, 9);
#endif

#if 0
		LOGE("Semantic output %u: %s\n", element_id, semantic_name.c_str());
		LOGE("  Type: %u\n", element_type);
		LOGE("  System value: %u\n", system_value);
		LOGE("  Interpolation: %u\n", interpolation);
		LOGE("  Rows: %u\n", rows);
		LOGE("  Cols: %u\n", cols);
		LOGE("  Start row: %u\n", start_row);
		LOGE("  Col: %u\n", col);
#endif

		spv::Id type_id = get_type_id(element_type, rows, cols);
		spv::Id variable_id = builder.createVariable(spv::StorageClassInput, type_id, semantic_name.c_str());
		input_elements_meta[element_id] = { variable_id, static_cast<DXIL::ComponentType>(element_type) };

		if (system_value != DXIL::Semantic::User)
			emit_builtin_decoration(variable_id, system_value);
		else
		{
			emit_interpolation_decorations(variable_id, interpolation);
			builder.addDecoration(variable_id, spv::DecorationLocation, location);
			location += rows;
		}

		spirv_module.get_entry_point()->addIdOperand(variable_id);
	}
}

spv::Id Converter::Impl::build_sampled_image(std::vector<Operation> &ops, spv::Id image_id, spv::Id sampler_id,
                                             bool comparison)
{
	auto &builder = spirv_module.get_builder();
	spv::Id image_type_id = get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);
	bool multisampled = builder.isMultisampledImageType(image_type_id);
	spv::Id sampled_format = builder.getImageComponentType(image_type_id);

	image_type_id =
	    builder.makeImageType(sampled_format, dim, comparison, arrayed, multisampled, 2, spv::ImageFormatUnknown);

	spv::Id id = spirv_module.allocate_id();
	Operation op;
	op.op = spv::OpSampledImage;
	op.id = id;
	op.type_id = builder.makeSampledImageType(image_type_id);
	op.arguments = { image_id, sampler_id };

	ops.push_back(std::move(op));
	return id;
}

spv::Id Converter::Impl::build_vector(std::vector<Operation> &ops, spv::Id element_type, spv::Id *elements,
                                      unsigned count)
{
	if (count == 1)
		return elements[0];

	uint32_t id = spirv_module.allocate_id();
	auto &builder = spirv_module.get_builder();

	Operation op;
	op.op = spv::OpCompositeConstruct;
	op.id = id;
	op.type_id = builder.makeVectorType(element_type, count);
	op.arguments.insert(op.arguments.end(), elements, elements + count);

	ops.push_back(std::move(op));
	return id;
}

spv::Id Converter::Impl::build_constant_vector(std::vector<Operation> &ops, spv::Id element_type, spv::Id *elements,
                                               unsigned count)
{
	if (count == 1)
		return elements[0];

	auto &builder = spirv_module.get_builder();
	return builder.makeCompositeConstant(builder.makeVectorType(element_type, count), { elements, elements + count });
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

	auto &ops = block->ir.operations;
	auto &builder = spirv_module.get_builder();

	if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&instruction))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
		{
			return emit_dxil_instruction(ops, *this, builder, call_inst);
		}
		else
		{
			LOGE("Normal function call currently unsupported ...\n");
			return false;
		}
	}
	else if (auto *binary_inst = llvm::dyn_cast<llvm::BinaryOperator>(&instruction))
		return emit_binary_instruction(ops, *this, builder, binary_inst);
	else if (auto *unary_inst = llvm::dyn_cast<llvm::UnaryOperator>(&instruction))
		return emit_unary_instruction(ops, *this, builder, unary_inst);
	else if (auto *cast_inst = llvm::dyn_cast<llvm::CastInst>(&instruction))
		return emit_cast_instruction(ops, *this, builder, cast_inst);
	else if (auto *getelementptr_inst = llvm::dyn_cast<llvm::GetElementPtrInst>(&instruction))
		return emit_getelementptr_instruction(ops, *this, builder, getelementptr_inst);
	else if (auto *load_inst = llvm::dyn_cast<llvm::LoadInst>(&instruction))
		return emit_load_instruction(ops, *this, builder, load_inst);
	else if (auto *store_inst = llvm::dyn_cast<llvm::StoreInst>(&instruction))
		return emit_store_instruction(ops, *this, builder, store_inst);
	else if (auto *compare_inst = llvm::dyn_cast<llvm::CmpInst>(&instruction))
		return emit_compare_instruction(ops, *this, builder, compare_inst);
	else if (auto *extract_inst = llvm::dyn_cast<llvm::ExtractValueInst>(&instruction))
		return emit_extract_value_instruction(ops, *this, builder, extract_inst);
	else if (auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(&instruction))
		return emit_alloca_instruction(ops, *this, builder, alloca_inst);
	else if (auto *select_inst = llvm::dyn_cast<llvm::SelectInst>(&instruction))
		return emit_select_instruction(ops, *this, builder, select_inst);
	else if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(&instruction))
		return emit_phi_instruction(block, *phi_inst);

	return false;
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result;
	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	auto *module = &bitcode_parser.get_module();
	spirv_module.emit_entry_point(get_execution_model(*module), "main");

	emit_resources();
	emit_stage_input_variables();
	emit_stage_output_variables();

	llvm::Function *func = module->getFunction(get_entry_point_name(*module));
	assert(func);

	auto *entry = &func->getEntryBlock();
	auto entry_meta = std::make_unique<BlockMeta>(entry);
	bb_map[entry] = entry_meta.get();
	result.entry = pool.create_node();
	bb_map[entry]->node = result.entry;
	result.entry->name = entry->getName().data();
	result.entry->name += ".entry";
	metas.push_back(std::move(entry_meta));

	std::vector<llvm::BasicBlock *> to_process;
	std::vector<llvm::BasicBlock *> processing;
	to_process.push_back(entry);
	std::vector<llvm::BasicBlock *> visit_order;

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

	return result;
}

spv::Id Converter::Impl::allocate_id()
{
	return spirv_module.allocate_id();
}
} // namespace DXIL2SPIRV