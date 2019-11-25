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

#include "dxil_converter.hpp"
#include <utility>
#include "SpvBuilder.h"
#include "cfg_structurizer.hpp"
#include "node_pool.hpp"
#include "node.hpp"

#include <llvm/IR/BasicBlock.h>
#include <llvm/IR/CFG.h>
#include <llvm/IR/Instructions.h>

namespace DXIL2SPIRV
{
constexpr uint32_t GENERATOR = 1967215134;

struct Converter::Impl
{
	Impl(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_, SPIRVModule &module_)
		: container_parser(std::move(container_parser_)),
		  bitcode_parser(std::move(bitcode_parser_)),
		  spirv_module(module_)
	{
	}

	DXILContainerParser container_parser;
	LLVMBCParser bitcode_parser;
	SPIRVModule &spirv_module;

	struct BlockMeta
	{
		explicit BlockMeta(llvm::BasicBlock *bb_)
			: bb(bb_)
		{
		}

		llvm::BasicBlock *bb;
		CFGNode *node = nullptr;
	};
	std::vector<std::unique_ptr<BlockMeta>> metas;
	std::unordered_map<llvm::BasicBlock *, BlockMeta *> bb_map;
	std::unordered_map<const llvm::Value *, spv::Id> value_map;

	ConvertedFunction convert_entry_point();
	spv::Id get_id_for_value(const llvm::Value &value, unsigned forced_integer_width = 0);
	spv::Id get_id_for_constant(const llvm::Constant &constant, unsigned forced_width);
	spv::Id get_id_for_undef(const llvm::UndefValue &undef);

	void emit_stage_input_variables();
	void emit_stage_output_variables();

	void emit_resources();
	void emit_srvs(const llvm::MDNode *srvs);
	void emit_uavs(const llvm::MDNode *uavs);
	void emit_cbvs(const llvm::MDNode *cbvs);
	void emit_samplers(const llvm::MDNode *samplers);

	std::vector<spv::Id> srv_index_to_id;
	std::vector<spv::Id> uav_index_to_id;
	std::vector<spv::Id> cbv_index_to_id;
	std::vector<spv::Id> sampler_index_to_id;
	std::unordered_map<const llvm::Value *, spv::Id> handle_to_ptr_id;

	spv::Id get_type_id(unsigned element_type, unsigned rows, unsigned cols);
	spv::Id get_type_id(const llvm::Type &type);

	std::unordered_map<uint32_t, spv::Id> input_elements_ids;
	std::unordered_map<uint32_t, spv::Id> output_elements_ids;
	void emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic);

	void emit_instruction(CFGNode *block, const llvm::Instruction &instruction);
	void emit_builtin_instruction(CFGNode *block, const llvm::CallInst &instruction);
	void emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction);
	void emit_binary_instruction(CFGNode *block, const llvm::BinaryOperator &instruction);
	void emit_compare_instruction(CFGNode *block, const llvm::CmpInst &instruction);
	void emit_extract_value_instruction(CFGNode *block, const llvm::ExtractValueInst &instruction);

	static uint32_t get_constant_operand(const llvm::CallInst &value, unsigned index);
};

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
	return T(llvm::cast<llvm::ConstantAsMetadata>(node->getOperand(index))->getValue()->getUniqueInteger().getSExtValue());
}

static std::string get_string_metadata(const llvm::MDNode *node, unsigned index)
{
	return llvm::cast<llvm::MDString>(node->getOperand(index))->getString();
}

void Converter::Impl::emit_srvs(const llvm::MDNode *srvs)
{

}

void Converter::Impl::emit_uavs(const llvm::MDNode *uavs)
{

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
		spv::Id member_array_type = builder.makeArrayType(
				builder.makeVectorType(
						builder.makeFloatType(32), 4),
				builder.makeUintConstant(vec4_length, false),
				16);

		builder.addDecoration(member_array_type, spv::DecorationArrayStride, 16);

		spv::Id type_id = builder.makeStructType({ member_array_type }, name.c_str());
		builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
		builder.addDecoration(type_id, spv::DecorationBlock);
		spv::Id var_id = builder.createVariable(spv::StorageClassUniform, type_id, name.c_str());

		builder.addDecoration(var_id, spv::DecorationDescriptorSet, bind_space);
		builder.addDecoration(var_id, spv::DecorationBinding, bind_register);

		cbv_index_to_id.resize(std::max(cbv_index_to_id.size(), size_t(index + 1)));
		cbv_index_to_id[index] = var_id;
	}
}

void Converter::Impl::emit_samplers(const llvm::MDNode *samplers)
{

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

spv::Id Converter::Impl::get_id_for_constant(const llvm::Constant &constant, unsigned forced_width)
{
	auto &builder = spirv_module.get_builder();

	switch (constant.getType()->getTypeID())
	{
	case llvm::Type::TypeID::FloatTyID:
	{
		auto &fp = llvm::cast<llvm::ConstantFP>(constant);
		return builder.makeFloatConstant(fp.getValueAPF().convertToFloat());
	}

	case llvm::Type::TypeID::DoubleTyID:
	{
		auto &fp = llvm::cast<llvm::ConstantFP>(constant);
		return builder.makeDoubleConstant(fp.getValueAPF().convertToDouble());
	}

	case llvm::Type::TypeID::IntegerTyID:
	{
		unsigned integer_width = forced_width ? forced_width : constant.getType()->getIntegerBitWidth();
		switch (integer_width)
		{
		case 32:
			return builder.makeUintConstant(constant.getUniqueInteger().getZExtValue());

		default:
			return 0;
		}
	}

	default:
		return 0;
	}
}

spv::Id Converter::Impl::get_id_for_undef(const llvm::UndefValue &undef)
{
	auto &builder = spirv_module.get_builder();
	switch (undef.getType()->getTypeID())
	{
	case llvm::Type::TypeID::FloatTyID:
		return builder.createUndefined(builder.makeFloatType(32));

	default:
		return 0;
	}
}

spv::Id Converter::Impl::get_id_for_value(const llvm::Value &value, unsigned forced_width)
{
	auto itr = value_map.find(&value);
	if (itr != value_map.end())
		return itr->second;

	spv::Id ret;
	if (auto *constant = llvm::dyn_cast<llvm::Constant>(&value))
		ret = get_id_for_constant(*constant, forced_width);
	else if (auto *undef = llvm::dyn_cast<llvm::UndefValue>(&value))
		ret = get_id_for_undef(*undef);
	else
		ret = spirv_module.allocate_id();

	value_map[&value] = ret;
	return ret;
}

static std::string get_entry_point_name(const llvm::Module &module)
{
	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	return llvm::cast<llvm::MDString>(node->getOperand(1))->getString();
}


static void print_shader_model(const llvm::Module &module)
{
	auto *shader_model = module.getNamedMetadata("dx.shaderModel");
	auto *shader_model_node = shader_model->getOperand(0);
	fprintf(stderr, "Profile: %s_%u_%u\n", llvm::cast<llvm::MDString>(shader_model_node->getOperand(0))->getString().data(),
	        get_constant_metadata(shader_model_node, 1),
	        get_constant_metadata(shader_model_node, 2));
}

spv::Id Converter::Impl::get_type_id(const llvm::Type &type)
{
	auto &builder = spirv_module.get_builder();
	switch (type.getTypeID())
	{
	case llvm::Type::TypeID::FloatTyID:
		return builder.makeFloatType(32);

	case llvm::Type::TypeID::IntegerTyID:
		switch (type.getIntegerBitWidth())
		{
		case 1:
			return builder.makeBoolType();
		default:
			return builder.makeIntegerType(type.getIntegerBitWidth(), false);
		}

	default:
		return 0;
	}
}

spv::Id Converter::Impl::get_type_id(unsigned element_type, unsigned rows, unsigned cols)
{
	auto &builder = spirv_module.get_builder();

	spv::Id component_type;
	switch (static_cast<DXIL::ComponentType>(element_type))
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

void Converter::Impl::emit_stage_output_variables()
{
	auto &module = bitcode_parser.get_module();

	auto *ep_meta = module.getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	auto &signature = node->getOperand(2);
	auto *outputs_node = llvm::cast<llvm::MDNode>(llvm::cast<llvm::MDNode>(signature)->getOperand(1));

	auto &builder = spirv_module.get_builder();

	unsigned location = 0;

	for (unsigned i = 0; i < outputs_node->getNumOperands(); i++)
	{
		auto *output = llvm::cast<llvm::MDNode>(outputs_node->getOperand(i));
		auto element_id = get_constant_metadata(output, 0);
		auto semantic_name = get_string_metadata(output, 1);
		auto element_type = get_constant_metadata(output, 2);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(output, 3));

		// Semantic index?
		//auto interpolation = get_constant_metadata(input, 5);
		auto rows = get_constant_metadata(output, 6);
		auto cols = get_constant_metadata(output, 7);

#if 0
		auto start_row = get_constant_metadata(input, 8);
		auto col = get_constant_metadata(input, 9);
#endif

#if 0
		fprintf(stderr, "Semantic output %u: %s\n", element_id, semantic_name.c_str());
		fprintf(stderr, "  Type: %u\n", element_type);
		fprintf(stderr, "  System value: %u\n", system_value);
		fprintf(stderr, "  Interpolation: %u\n", interpolation);
		fprintf(stderr, "  Rows: %u\n", rows);
		fprintf(stderr, "  Cols: %u\n", cols);
		fprintf(stderr, "  Start row: %u\n", start_row);
		fprintf(stderr, "  Col: %u\n", col);
#endif

		spv::Id type_id = get_type_id(element_type, rows, cols);
		spv::Id variable_id = builder.createVariable(spv::StorageClassOutput, type_id, semantic_name.c_str());
		output_elements_ids[element_id] = variable_id;

		if (system_value != DXIL::Semantic::User)
			emit_builtin_decoration(variable_id, system_value);
		else
		{
			builder.addDecoration(variable_id, spv::DecorationLocation, location);
			location += rows;
		}

		spirv_module.get_entry_point()->addIdOperand(variable_id);
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
	auto *inputs_node = llvm::cast<llvm::MDNode>(llvm::cast<llvm::MDNode>(signature)->getOperand(0));

	auto &builder = spirv_module.get_builder();

	unsigned location = 0;

	for (unsigned i = 0; i < inputs_node->getNumOperands(); i++)
	{
		auto *input = llvm::cast<llvm::MDNode>(inputs_node->getOperand(i));
		auto element_id = get_constant_metadata(input, 0);
		auto semantic_name = get_string_metadata(input, 1);
		auto element_type = get_constant_metadata(input, 2);
		auto system_value = static_cast<DXIL::Semantic>(get_constant_metadata(input, 3));

		// Semantic index?
		//auto interpolation = get_constant_metadata(input, 5);
		auto rows = get_constant_metadata(input, 6);
		auto cols = get_constant_metadata(input, 7);

#if 0
		auto start_row = get_constant_metadata(input, 8);
		auto col = get_constant_metadata(input, 9);
#endif

#if 0
		fprintf(stderr, "Semantic output %u: %s\n", element_id, semantic_name.c_str());
		fprintf(stderr, "  Type: %u\n", element_type);
		fprintf(stderr, "  System value: %u\n", system_value);
		fprintf(stderr, "  Interpolation: %u\n", interpolation);
		fprintf(stderr, "  Rows: %u\n", rows);
		fprintf(stderr, "  Cols: %u\n", cols);
		fprintf(stderr, "  Start row: %u\n", start_row);
		fprintf(stderr, "  Col: %u\n", col);
#endif

		spv::Id type_id = get_type_id(element_type, rows, cols);
		spv::Id variable_id = builder.createVariable(spv::StorageClassInput, type_id, semantic_name.c_str());
		input_elements_ids[element_id] = variable_id;

		if (system_value != DXIL::Semantic::User)
			emit_builtin_decoration(variable_id, system_value);
		else
		{
			builder.addDecoration(variable_id, spv::DecorationLocation, location);
			location += rows;
		}

		spirv_module.get_entry_point()->addIdOperand(variable_id);
	}
}

uint32_t Converter::Impl::get_constant_operand(const llvm::CallInst &value, unsigned index)
{
	auto *constant = llvm::cast<llvm::Constant>(value.getOperand(index));
	return uint32_t(constant->getUniqueInteger().getZExtValue());
}

void Converter::Impl::emit_builtin_instruction(CFGNode *block, const llvm::CallInst &instruction)
{
	auto &builder = spirv_module.get_builder();
	// DXIL built-in call.

	// The opcode is encoded as a constant integer.
	auto opcode = static_cast<DXIL::Op>(get_constant_operand(instruction, 0));

	switch (opcode)
	{
	case DXIL::Op::LoadInput:
	{
		uint32_t var_id = input_elements_ids[get_constant_operand(instruction, 1)];
		uint32_t ptr_id;
		Operation op;

		uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

		if (num_rows > 1)
		{
			ptr_id = spirv_module.allocate_id();

			op.op = spv::OpInBoundsAccessChain;
			op.id = ptr_id;
			op.type_id = get_type_id(*instruction.getType());
			op.type_id = builder.makePointer(spv::StorageClassInput, op.type_id);
			op.arguments = {
				var_id,
				get_id_for_value(*instruction.getOperand(3), 32)
			};
			assert(op.arguments[0]);
			assert(op.arguments[1]);

			block->ir.operations.push_back(std::move(op));
		}
		else
			ptr_id = var_id;

		op = {};
		op.op = spv::OpLoad;
		op.id = get_id_for_value(instruction);
		op.type_id = get_type_id(*instruction.getType());
		op.arguments = { ptr_id };
		assert(op.arguments[0]);

		block->ir.operations.push_back(std::move(op));
		break;
	}

	case DXIL::Op::StoreOutput:
	{
		uint32_t var_id = output_elements_ids[get_constant_operand(instruction, 1)];
		uint32_t ptr_id;
		Operation op;

		uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

		if (num_rows > 1)
		{
			ptr_id = spirv_module.allocate_id();

			op.op = spv::OpInBoundsAccessChain;
			op.id = ptr_id;
			op.type_id = builder.getScalarTypeId(builder.getDerefTypeId(var_id));
			op.type_id = builder.makePointer(spv::StorageClassOutput, op.type_id);
			op.arguments = {
				var_id,
				get_id_for_value(*instruction.getOperand(3), 32)
			};
			assert(op.arguments[0]);
			assert(op.arguments[1]);

			block->ir.operations.push_back(std::move(op));
		}
		else
			ptr_id = var_id;

		op = {};
		op.op = spv::OpStore;
		op.arguments = {
			ptr_id,
			get_id_for_value(*instruction.getOperand(4))
		};
		assert(op.arguments[0]);
		assert(op.arguments[1]);

		block->ir.operations.push_back(std::move(op));
		break;
	}

	case DXIL::Op::CreateHandle:
	{
		auto resource_type = static_cast<DXIL::ResourceType>(get_constant_operand(instruction, 1));
		auto resource_range = get_constant_operand(instruction, 2);
		// 3 = index into range
		// 4 = non-uniform resource index
		switch (resource_type)
		{
		case DXIL::ResourceType::SRV:
			handle_to_ptr_id[&instruction] = srv_index_to_id[resource_range];
			break;

		case DXIL::ResourceType::UAV:
			handle_to_ptr_id[&instruction] = uav_index_to_id[resource_range];
			break;

		case DXIL::ResourceType::CBV:
			handle_to_ptr_id[&instruction] = cbv_index_to_id[resource_range];
			break;

		case DXIL::ResourceType::Sampler:
			handle_to_ptr_id[&instruction] = sampler_index_to_id[resource_range];
			break;

		default:
			break;
		}
		break;
	}

	case DXIL::Op::CBufferLoadLegacy:
	{
		// This function returns a struct, but ignore that, and just return a vec4 for now.
		// extractvalue is used to pull out components and that works for vectors as well.
		spv::Id ptr_id = handle_to_ptr_id[instruction.getOperand(1)];
		assert(ptr_id);

		spv::Id vec4_index = get_id_for_value(*instruction.getOperand(2));
		spv::Id access_chain_id = spirv_module.allocate_id();

		Operation op;
		op.op = spv::OpInBoundsAccessChain;
		op.id = access_chain_id;
		op.type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
		op.type_id = builder.makePointer(spv::StorageClassUniform, op.type_id);
		op.arguments = { ptr_id, builder.makeUintConstant(0), vec4_index };

		block->ir.operations.push_back(std::move(op));

		op = {};
		op.op = spv::OpLoad;
		op.id = get_id_for_value(instruction);
		op.type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
		op.arguments = { access_chain_id };

		block->ir.operations.push_back(std::move(op));

		break;
	}

	default:
		break;
	}
}

void Converter::Impl::emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction)
{
	PHI phi;
	phi.id = get_id_for_value(instruction);
	phi.type_id = get_type_id(*instruction.getType());

	unsigned count = instruction.getNumIncomingValues();
	for (unsigned i = 0; i < count; i++)
	{
		IncomingValue incoming = {};
		incoming.block = bb_map[instruction.getIncomingBlock(i)]->node;
		auto *value = instruction.getIncomingValue(i);
		incoming.id = get_id_for_value(*value);
		phi.incoming.push_back(incoming);
	}

	block->ir.phi.push_back(std::move(phi));
}

void Converter::Impl::emit_compare_instruction(CFGNode *block, const llvm::CmpInst &instruction)
{
	auto &builder = spirv_module.get_builder();

	Operation op;
	op.id = get_id_for_value(instruction);
	op.type_id = get_type_id(*instruction.getType());

	uint32_t id0 = get_id_for_value(*instruction.getOperand(0));
	uint32_t id1 = get_id_for_value(*instruction.getOperand(1));
	op.arguments = { id0, id1 };

	switch (instruction.getPredicate())
	{
	case llvm::CmpInst::Predicate::FCMP_OEQ:
		op.op = spv::OpFOrdEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UEQ:
		op.op = spv::OpFUnordEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGT:
		op.op = spv::OpFOrdGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGT:
		op.op = spv::OpFUnordGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGE:
		op.op = spv::OpFOrdGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGE:
		op.op = spv::OpFUnordGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLT:
		op.op = spv::OpFOrdLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULT:
		op.op = spv::OpFUnordLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLE:
		op.op = spv::OpFOrdLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULE:
		op.op = spv::OpFUnordLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ONE:
		op.op = spv::OpFOrdNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UNE:
		op.op = spv::OpFUnordNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_FALSE:
		// Why on earth is this a thing ...
		op.op = spv::OpCopyLogical;
		op.arguments = { builder.makeBoolConstant(false) };
		break;

	case llvm::CmpInst::Predicate::FCMP_TRUE:
		// Why on earth is this a thing ...
		op.op = spv::OpCopyLogical;
		op.arguments = { builder.makeBoolConstant(true) };
		break;

	case llvm::CmpInst::Predicate::ICMP_EQ:
		op.op = spv::OpIEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_NE:
		op.op = spv::OpINotEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLT:
		op.op = spv::OpSLessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLE:
		op.op = spv::OpSLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGT:
		op.op = spv::OpSGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGE:
		op.op = spv::OpSGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULT:
		op.op = spv::OpULessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULE:
		op.op = spv::OpULessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGT:
		op.op = spv::OpUGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGE:
		op.op = spv::OpUGreaterThanEqual;
		break;

	default:
		fprintf(stderr, "Unknown CmpInst predicate.\n");
		break;
	}

	block->ir.operations.push_back(std::move(op));
}

void Converter::Impl::emit_extract_value_instruction(CFGNode *block,
                                                     const llvm::ExtractValueInst &instruction)
{
	Operation op;
	op.op = spv::OpCompositeExtract;
	op.id = get_id_for_value(instruction);
	op.type_id = get_type_id(*instruction.getType());

	op.arguments.push_back(get_id_for_value(*instruction.getAggregateOperand()));
	for (unsigned i = 0; i < instruction.getNumIndices(); i++)
	{
		op.arguments.push_back(instruction.getIndices()[i]);
	}

	block->ir.operations.push_back(std::move(op));
}

void Converter::Impl::emit_binary_instruction(CFGNode *block, const llvm::BinaryOperator &instruction)
{
	Operation op;
	op.id = get_id_for_value(instruction);
	op.type_id = get_type_id(*instruction.getType());

	uint32_t id0 = get_id_for_value(*instruction.getOperand(0));
	uint32_t id1 = get_id_for_value(*instruction.getOperand(1));
	op.arguments = { id0, id1 };

	switch (instruction.getOpcode())
	{
	case llvm::BinaryOperator::BinaryOps::FAdd:
		op.op = spv::OpFAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::FSub:
		op.op = spv::OpFSub;
		break;

	case llvm::BinaryOperator::BinaryOps::FMul:
		op.op = spv::OpFMul;
		break;

	case llvm::BinaryOperator::BinaryOps::FDiv:
		op.op = spv::OpFDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Add:
		op.op = spv::OpIAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::Sub:
		op.op = spv::OpISub;
		break;

	case llvm::BinaryOperator::BinaryOps::Mul:
		op.op = spv::OpIMul;
		break;

	case llvm::BinaryOperator::BinaryOps::SDiv:
		op.op = spv::OpSDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::UDiv:
		op.op = spv::OpUDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Shl:
		op.op = spv::OpShiftLeftLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::LShr:
		op.op = spv::OpShiftRightLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::AShr:
		op.op = spv::OpShiftRightArithmetic;
		break;

	case llvm::BinaryOperator::BinaryOps::SRem:
		op.op = spv::OpSRem;
		break;

	case llvm::BinaryOperator::BinaryOps::FRem:
		op.op = spv::OpFRem;
		break;

	case llvm::BinaryOperator::BinaryOps::URem:
		// Is this correct? There is no URem.
		op.op = spv::OpUMod;
		break;

	case llvm::BinaryOperator::BinaryOps::Xor:
		op.op = spv::OpBitwiseXor;
		break;

	case llvm::BinaryOperator::BinaryOps::And:
		op.op = spv::OpBitwiseAnd;
		break;

	case llvm::BinaryOperator::BinaryOps::Or:
		op.op = spv::OpBitwiseOr;
		break;

	default:
		fprintf(stderr, "Unknown binary operator.\n");
		break;
	}

	block->ir.operations.push_back(std::move(op));
}

void Converter::Impl::emit_instruction(CFGNode *block, const llvm::Instruction &instruction)
{
	if (auto *call_inst = llvm::dyn_cast<llvm::CallInst>(&instruction))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
		{
			emit_builtin_instruction(block, *call_inst);
		}
		else
		{
			fprintf(stderr, "Normal function call ...\n");
		}
	}
	else if (auto *binary_inst = llvm::dyn_cast<llvm::BinaryOperator>(&instruction))
	{
		emit_binary_instruction(block, *binary_inst);
	}
	else if (auto *compare_inst = llvm::dyn_cast<llvm::CmpInst>(&instruction))
	{
		emit_compare_instruction(block, *compare_inst);
	}
	else if (auto *extract_inst = llvm::dyn_cast<llvm::ExtractValueInst>(&instruction))
	{
		emit_extract_value_instruction(block, *extract_inst);
	}
	else if (auto *phi_inst = llvm::dyn_cast<llvm::PHINode>(&instruction))
	{
		emit_phi_instruction(block, *phi_inst);
	}
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result;
	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	auto *module = &bitcode_parser.get_module();

	print_shader_model(*module);
	fprintf(stderr, "Entry point: %s\n", get_entry_point_name(*module).c_str());

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

	// Traverse the CFG and register all blocks in the pool.
	while (!to_process.empty())
	{
		std::swap(to_process, processing);
		for (auto *block : processing)
		{
			for (auto itr = succ_begin(block); itr != succ_end(block); ++itr)
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

	for (auto &key_value : bb_map)
	{
		llvm::BasicBlock *bb = key_value.first;
		CFGNode *node = key_value.second->node;

		// Scan opcodes.
		for (auto &instruction : *bb)
			emit_instruction(node, instruction);

		auto *instruction = bb->getTerminator();
		if (auto *inst = llvm::dyn_cast<llvm::BranchInst>(instruction))
		{
			if (inst->isConditional())
			{
				node->ir.terminator.type = Terminator::Type::Condition;
				node->ir.terminator.conditional_id = get_id_for_value(*inst->getCondition());
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
		else if (auto *inst = llvm::dyn_cast<llvm::ReturnInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Return;
			if (inst->getReturnValue())
				node->ir.terminator.return_value = get_id_for_value(*inst->getReturnValue());
		}
		else if (llvm::isa<llvm::UnreachableInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Unreachable;
		}
		else
			fprintf(stderr, "Unsupported terminator ...\n");
	}

#if 0
		BasicBlock &block = func->getEntryBlock();

		for (auto itr = succ_begin(&block); itr != succ_end(&block); ++itr)
		{
			fprintf(stderr, "Successor!\n");
		}

		//block.print(errs());

		for (auto itr = block.begin(); itr != block.end(); ++itr)
		{
			Instruction &inst = *itr;
			if (isa<llvm::CallInst>(inst))
			{
				fprintf(stderr, "Call!\n");
				auto &call = cast<llvm::CallInst>(inst);
				fprintf(stderr, "Calling %s\n", call.getCalledFunction()->getName().data());
				auto *constant = cast<llvm::ConstantInt>(call.getOperand(0));
				uint32_t value = constant->getZExtValue();
				fprintf(stderr, "Calling opcode: %u\n", value);

				call.setMetadata(0, MDNode::get(call.getContext(), MDString::get(call.getContext(), "OHAI")));
				fflush(stderr);
				cast<llvm::MDString>(call.getMetadata(0)->getOperand(0))->print(errs());
				fflush(stderr);
				//fprintf(stderr, "Value name: %s\n", call.getName().data());
			}
			else if (isa<llvm::ReturnInst>(inst))
				fprintf(stderr, "Return!\n");
			else if (isa<llvm::SelectInst>(inst))
				fprintf(stderr, "Select instruction!\n");
			else if (isa<llvm::CmpInst>(inst))
				fprintf(stderr, "Compare instruction!\n");
			else if (isa<llvm::BinaryOperator>(inst))
			{
				fprintf(stderr, "Binary operator!\n");
				auto &binop = cast<llvm::BinaryOperator>(inst);
				switch (binop.getOpcode())
				{
				case BinaryOperator::FAdd:
					fprintf(stderr, "FADD!\n");
					break;

				case BinaryOperator::FMul:
					fprintf(stderr, "FMul!\n");
					break;

				default:
					break;
				}
			}
			else
				fprintf(stderr, "? ...\n");
		}
	}
#endif

	return result;
}
} // namespace DXIL2SPIRV