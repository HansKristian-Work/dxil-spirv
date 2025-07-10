/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
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

#include "module.hpp"
#include "context.hpp"
#include "metadata.hpp"
#include "cast.hpp"
#include "function.hpp"
#include "instruction.hpp"
#include <array>

#include "../dxil.hpp"
#include <assert.h>

// dxbc-spirv
#include "ir/ir.h"
#include "ir/ir_builder.h"
using namespace dxbc_spv;

namespace LLVMBC
{
template <typename Func>
static void for_all_opcodes(ir::Builder &builder, ir::OpCode opcode, const Func &func)
{
	for (auto &op : builder)
		if (op.getOpCode() == opcode)
			if (!func(op))
				return;
}

static const char *shader_stage_to_meta(ir::ShaderStage stage)
{
	switch (stage)
	{
	case ir::ShaderStage::eVertex:
		return "vs";
	case ir::ShaderStage::eHull:
		return "hs";
	case ir::ShaderStage::eDomain:
		return "ds";
	case ir::ShaderStage::eGeometry:
		return "gs";
	case ir::ShaderStage::ePixel:
		return "ps";
	case ir::ShaderStage::eCompute:
		return "cs";
	default:
		return "";
	}
}

static DXIL::ResourceKind convert_resource_kind(ir::ResourceKind kind)
{
	switch (kind)
	{
	case ir::ResourceKind::eBufferRaw:
		return DXIL::ResourceKind::RawBuffer;
	case ir::ResourceKind::eBufferStructured:
		return DXIL::ResourceKind::StructuredBuffer;
	case ir::ResourceKind::eBufferTyped:
		return DXIL::ResourceKind::TypedBuffer;
	case ir::ResourceKind::eImage1D:
		return DXIL::ResourceKind::Texture1D;
	case ir::ResourceKind::eImage1DArray:
		return DXIL::ResourceKind::Texture1DArray;
	case ir::ResourceKind::eImage2D:
		return DXIL::ResourceKind::Texture2D;
	case ir::ResourceKind::eImage2DArray:
		return DXIL::ResourceKind::Texture2DArray;
	case ir::ResourceKind::eImage3D:
		return DXIL::ResourceKind::Texture3D;
	case ir::ResourceKind::eImageCube:
		return DXIL::ResourceKind::TextureCube;
	case ir::ResourceKind::eImageCubeArray:
		return DXIL::ResourceKind::TextureCubeArray;
	case ir::ResourceKind::eImage2DMS:
		return DXIL::ResourceKind::Texture2DMS;
	case ir::ResourceKind::eImage2DMSArray:
		return DXIL::ResourceKind::Texture2DMSArray;
	default:
		LOGE("Unrecognized resource kind %d\n", int(kind));
		return DXIL::ResourceKind::Invalid;
	}
}

static DXIL::Op convert_builtin_opcode(ir::BuiltIn builtin)
{
	switch (builtin)
	{
	case ir::BuiltIn::eSampleCount:
		return DXIL::Op::RenderTargetGetSampleCount;
	case ir::BuiltIn::eWorkgroupId:
		return DXIL::Op::GroupId;
	case ir::BuiltIn::eGlobalThreadId:
		return DXIL::Op::ThreadId;
	case ir::BuiltIn::eLocalThreadId:
		return DXIL::Op::ThreadIdInGroup;
	case ir::BuiltIn::eLocalThreadIndex:
		return DXIL::Op::FlattenedThreadIdInGroup;

	default:
		return DXIL::Op::Count;
	}
}

static DXIL::Semantic convert_semantic(ir::BuiltIn builtin)
{
	switch (builtin)
	{
	case ir::BuiltIn::ePosition:
		return DXIL::Semantic::Position;
	case ir::BuiltIn::eClipDistance:
		return DXIL::Semantic::ClipDistance;
	case ir::BuiltIn::eCullDistance:
		return DXIL::Semantic::CullDistance;
	case ir::BuiltIn::eVertexId:
		return DXIL::Semantic::VertexID;
	case ir::BuiltIn::eInstanceId:
		return DXIL::Semantic::InstanceID;
	case ir::BuiltIn::ePrimitiveId:
		return DXIL::Semantic::PrimitiveID;
	case ir::BuiltIn::eLayerIndex:
		return DXIL::Semantic::RenderTargetArrayIndex;
	case ir::BuiltIn::eViewportIndex:
		return DXIL::Semantic::ViewPortArrayIndex;
	case ir::BuiltIn::eGsInstanceId:
		return DXIL::Semantic::GSInstanceID;
	case ir::BuiltIn::eTessControlPointId:
		return DXIL::Semantic::OutputControlPointID;
	case ir::BuiltIn::eTessCoord:
		return DXIL::Semantic::DomainLocation;
	case ir::BuiltIn::eTessFactorInner:
		return DXIL::Semantic::InsideTessFactor;
	case ir::BuiltIn::eTessFactorOuter:
		return DXIL::Semantic::TessFactor;
	case ir::BuiltIn::eSampleId:
		return DXIL::Semantic::SampleIndex;
	case ir::BuiltIn::eSampleMask:
		return DXIL::Semantic::Coverage;
	case ir::BuiltIn::eIsFrontFace:
		return DXIL::Semantic::IsFrontFace;
	case ir::BuiltIn::eDepth:
		return DXIL::Semantic::Depth;
	case ir::BuiltIn::eStencilRef:
		return DXIL::Semantic::StencilRef;

	default:
		return DXIL::Semantic::User;
	}
}

static DXIL::InterpolationMode convert_interpolation_mode(ir::InterpolationMode mode)
{
	switch (mode)
	{
	case ir::InterpolationMode::eCentroid:
		return DXIL::InterpolationMode::LinearCentroid;
	case ir::InterpolationMode::eNoPerspective:
		return DXIL::InterpolationMode::LinearNoperspective;
	case ir::InterpolationMode::eFlat:
		return DXIL::InterpolationMode::Constant;
	case ir::InterpolationMode::eSample:
		return DXIL::InterpolationMode::LinearSample;
	default:
		return DXIL::InterpolationMode::Undefined;
	}
}

static DXIL::AtomicBinOp convert_atomic_binop(ir::AtomicOp binop)
{
	switch (binop)
	{
	case ir::AtomicOp::eAdd:
		return DXIL::AtomicBinOp::IAdd;
	case ir::AtomicOp::eAnd:
		return DXIL::AtomicBinOp::And;
	case ir::AtomicOp::eOr:
		return DXIL::AtomicBinOp::Or;
	case ir::AtomicOp::eXor:
		return DXIL::AtomicBinOp::Xor;
	case ir::AtomicOp::eExchange:
		return DXIL::AtomicBinOp::Exchange;
	case ir::AtomicOp::eSMax:
		return DXIL::AtomicBinOp::IMax;
	case ir::AtomicOp::eSMin:
		return DXIL::AtomicBinOp::IMin;
	case ir::AtomicOp::eUMax:
		return DXIL::AtomicBinOp::UMax;
	case ir::AtomicOp::eUMin:
		return DXIL::AtomicBinOp::UMin;
	case ir::AtomicOp::eSub:
		return DXIL::AtomicBinOp::Sub;
	case ir::AtomicOp::eLoad:
		return DXIL::AtomicBinOp::Load;
	case ir::AtomicOp::eStore:
		return DXIL::AtomicBinOp::Store;
	default:
		return DXIL::AtomicBinOp::Invalid;
	}
}

struct ComponentMapping
{
	DXIL::ComponentType type = DXIL::ComponentType::Invalid;
	uint32_t num_rows = 1;
	uint32_t num_cols = 1;
};

static ComponentMapping convert_component_mapping(const ir::Type &type)
{
	ComponentMapping mapping = {};

	switch (type.getBaseType(0).getBaseType())
	{
	case ir::ScalarType::eF16:
		mapping.type = DXIL::ComponentType::F16;
		break;

	case ir::ScalarType::eI16:
		mapping.type = DXIL::ComponentType::I16;
		break;

	case ir::ScalarType::eU16:
		mapping.type = DXIL::ComponentType::U16;
		break;

	case ir::ScalarType::eF32:
		mapping.type = DXIL::ComponentType::F32;
		break;

	case ir::ScalarType::eI32:
		mapping.type = DXIL::ComponentType::I32;
		break;

	case ir::ScalarType::eU32:
		mapping.type = DXIL::ComponentType::U32;
		break;

	case ir::ScalarType::eF64:
		mapping.type = DXIL::ComponentType::F64;
		break;

	case ir::ScalarType::eI64:
		mapping.type = DXIL::ComponentType::I64;
		break;

	case ir::ScalarType::eU64:
		mapping.type = DXIL::ComponentType::U64;
		break;

	default:
		LOGE("Unrecognized component type.\n");
		break;
	}

	if (type.isArrayType())
		mapping.num_rows = type.getArraySize(0);

	if (type.isVectorType())
		mapping.num_cols = type.getBaseType(0).getVectorSize();

	return mapping;
}

struct DXILIntrinsicTable
{
	struct FunctionOverload
	{
		Function *func;
		// Either overloaded on return type, or the primary argument for e.g. stores.
		Type *overload_type;
	};

	struct FunctionEntry
	{
		// At most should be overload for i32/u32/f32 x 16/32/64
		std::array<FunctionOverload, 9> overloads;
		unsigned num_overloads;
	};

	FunctionEntry intrinsic_functions[int(DXIL::Op::Count)] = {};

	Function *get(Module &module, DXIL::Op op,
	              Type *return_type,
	              const Vector<Type *> &argument_types,
	              Type *overload_type, uint64_t &tween);
};

Function *DXILIntrinsicTable::get(
	Module &module, DXIL::Op op,
	Type *return_type, const Vector<Type *> &argument_types,
	Type *overload_type, uint64_t &tween)
{
	auto &entry = intrinsic_functions[int(op)];

	for (unsigned i = 0; i < entry.num_overloads; i++)
		if (entry.overloads[i].overload_type == overload_type)
			return entry.overloads[i].func;

	auto &context = module.getContext();

	assert(entry.num_overloads < entry.overloads.size());
	auto *func_type = context.construct<FunctionType>(context, return_type, argument_types);
	auto *func = context.construct<Function>(func_type, ++tween, module);
	// TODO: Can have a look-up for expected intrinsics name.
	module.add_value_name(tween, "dx.op.intrinsic");
	entry.overloads[entry.num_overloads++] = { func, overload_type };
	return func;
}

class ParseContext
{
public:
	ParseContext(LLVMContext &context_, ir::Builder &builder_, Module &module_)
	    : context(context_), builder(builder_), module(module_) {}

	bool emit_metadata();
	bool emit_entry_point();
	bool emit_function_bodies();

private:
	LLVMContext &context;
	ir::Builder &builder;
	Module &module;
	uint64_t metadata_tween_id = 0;
	uint64_t tween_id = 0;

	ConstantInt *get_constant_uint(uint32_t value);

	// Metadata wrangling
	ConstantAsMetadata *create_constant_uint_meta(uint32_t value);
	ConstantAsMetadata *create_constant_uint64_meta(uint32_t value);
	MDString *create_string_meta(const String &str);
	ConstantAsMetadata *create_constant_meta(Constant *c);

	template <typename... Ops>
	MDNode *create_md_node(Ops&&... ops)
	{
		Vector<MDOperand *> vops { std::forward<Ops>(ops)... };
		return create_md_node(std::move(vops));
	}

	void create_named_md_node(const String &name, MDNode *node);
	MDNode *create_md_node(Vector<MDOperand *> ops);

	MDNode *create_stage_io_meta();
	MDOperand *create_null_meta();

	struct MetadataMapping
	{
		Vector<MDOperand *> nodes;
		// TODO: Some mapping from SsaRef to index so we can translate load descriptor.
	};
	MetadataMapping srvs, uavs, cbvs, samplers, inputs, outputs, patches;

	uint32_t build_texture_srv(uint32_t space, uint32_t index, uint32_t size,
	                           DXIL::ResourceKind kind,
	                           DXIL::ComponentType type);

	uint32_t build_texture_uav(uint32_t space, uint32_t index, uint32_t size,
	                           DXIL::ResourceKind kind,
	                           DXIL::ComponentType type, bool coherent, bool rov);

	uint32_t build_buffer_uav(uint32_t space, uint32_t index, uint32_t size,
	                          DXIL::ResourceKind kind, uint32_t stride,
	                          bool coherent, bool counter, bool rov);

	uint32_t build_buffer_srv(uint32_t space, uint32_t index, uint32_t size,
	                          DXIL::ResourceKind kind, uint32_t stride);

	uint32_t build_cbv(uint32_t space, uint32_t index, uint32_t size, uint32_t cbv_size);

	uint32_t build_sampler(uint32_t space, uint32_t index, uint32_t size);

	uint32_t build_stage_io(MetadataMapping &mapping, ir::SsaDef ssa, const String &name,
	                        DXIL::ComponentType type,
	                        DXIL::Semantic semantic,
	                        uint32_t semantic_index,
	                        DXIL::InterpolationMode interpolation,
	                        uint32_t rows, uint32_t cols,
	                        uint32_t start_row, uint32_t start_col);

	// DXIL intrinsic build.
	DXILIntrinsicTable dxil_intrinsics;

	Instruction *build_load_input(
		uint32_t index, Type *type,
		Value *row, uint32_t col, Value *axis = nullptr);
	Instruction *build_store_output(uint32_t index, Value *row, uint32_t col, Value *value);
	Instruction *build_load_builtin(DXIL::Op opcode, ir::SsaDef addr);
	Instruction *build_descriptor_load(ir::SsaDef resource, ir::SsaDef index, bool nonuniform);
	bool build_buffer_load(const ir::Op &op);
	bool build_buffer_load_cbv(const ir::Op &op);
	bool build_buffer_load(const ir::Op &op, DXIL::ResourceKind kind);
	bool build_buffer_load_return_composite(const ir::Op &op, Value *value);
	bool build_buffer_size(const ir::Op &op);
	bool build_buffer_store(const ir::Op &op);
	bool build_buffer_store(const ir::Op &op, DXIL::ResourceKind kind);
	bool build_buffer_atomic(const ir::Op &op);
	bool build_buffer_atomic_binop(const ir::Op &op, DXIL::ResourceKind kind);

	Value *build_extract_vector_component(Value *value, unsigned component);

	// BasicBlock emission.
	BasicBlock *current_bb = nullptr;
	void push_instruction(Instruction *instruction, ir::SsaDef ssa = {});
	bool push_instruction(const ir::Op &op);

	// ir::Builder helpers.
	// Need ways to translate between ir::SsaDef <-> LLVM values for the most part.
	UnorderedMap<ir::SsaDef, Function *> function_map;
	UnorderedMap<ir::SsaDef, BasicBlock *> bb_map;
	UnorderedMap<ir::SsaDef, Type *> param_types;
	Vector<std::pair<ir::SsaDef, Type *>> params;
	UnorderedMap<ir::SsaDef, Value *> value_map;

	// Maps stage IO and resources since we need to resolve them back to type + metadata index
	// when loading descriptor.
	struct StageIOHandler
	{
		uint32_t index = UINT32_MAX;
		DXIL::Op op = DXIL::Op::Count;
	};
	UnorderedMap<ir::SsaDef, StageIOHandler> stage_io_map;

	struct ResourceHandler
	{
		DXIL::ResourceType resource_type;
		DXIL::ResourceKind resource_kind;
		uint32_t index;
		uint32_t binding_offset; // DXIL is weird.
	};
	UnorderedMap<ir::SsaDef, ResourceHandler> resource_map;

	Type *convert_type(const ir::Type &type);
	BasicBlock *get_basic_block(ir::SsaDef ssa);

	Value *get_value(const ir::Operand &op) const;
	Value *get_value(const ir::SsaDef &op) const;

	bool emit_constant(const ir::Op &op);
	uint32_t resolve_constant_uint(const ir::Operand &op) const;
};

bool ParseContext::emit_constant(const ir::Op &op)
{
	auto &type = op.getType();
	Value *value = nullptr;

	if (type.isBasicType())
	{
		auto *llvm_type = convert_type(type);
		if (type.isScalarType())
		{
			if (type.getBaseType(0).isIntType())
				value = ConstantInt::get(llvm_type, uint64_t(op.getOperand(0)));
			else if (type.getBaseType(0).isFloatType())
				value = ConstantFP::get(llvm_type, uint64_t(op.getOperand(0)));
			else
				return false;
		}
		else
		{
			Vector<Value *> constants;
			constants.reserve(op.getOperandCount());

			if (type.getBaseType(0).isIntType())
			{
				for (unsigned i = 0; i < op.getOperandCount(); i++)
					constants.push_back(ConstantInt::get(convert_type(type.getSubType(0)), uint64_t(op.getOperand(i))));
			}
			else if (type.getBaseType(0).isFloatType())
			{
				for (unsigned i = 0; i < op.getOperandCount(); i++)
					constants.push_back(ConstantFP::get(convert_type(type.getSubType(0)), uint64_t(op.getOperand(i))));
			}
			else
				return false;

			value = context.construct<ConstantDataVector>(convert_type(type), std::move(constants));
		}
	}
	else
	{
		// TODO:
		return false;
	}

	if (!value)
		return false;

	value_map[op.getDef()] = value;
	return true;
}

Type *ParseContext::convert_type(const ir::Type &type)
{
	if (type.isArrayType())
	{
		auto *llvm_type = convert_type(type.getSubType(0));
		for (unsigned dim = 0; dim < type.getArrayDimensions(); dim++)
			llvm_type = ArrayType::get(llvm_type, type.getArraySize(dim));
		return llvm_type;
	}
	else if (type.isStructType())
	{
		Vector<Type *> members;
		for (unsigned index = 0; index < type.getStructMemberCount(); index++)
			members.push_back(convert_type(type.getSubType(index)));
		return StructType::get(context, std::move(members));
	}
	else if (type.isVoidType())
	{
		return Type::getVoidTy(context);
	}
	else if (type.isBasicType())
	{
		Type *llvm_type;
		ir::BasicType base = type.getBaseType(0);
		switch (base.getBaseType())
		{
		case ir::ScalarType::eF16:
			llvm_type = Type::getHalfTy(context);
			break;

		case ir::ScalarType::eF32:
			llvm_type = Type::getFloatTy(context);
			break;

		case ir::ScalarType::eF64:
			llvm_type = Type::getDoubleTy(context);
			break;

		case ir::ScalarType::eI16:
		case ir::ScalarType::eU16:
			llvm_type = Type::getInt16Ty(context);
			break;

		case ir::ScalarType::eI32:
		case ir::ScalarType::eU32:
			llvm_type = Type::getInt32Ty(context);
			break;

		case ir::ScalarType::eI64:
		case ir::ScalarType::eU64:
			llvm_type = Type::getInt64Ty(context);
			break;

		default:
			LOGE("Unrecognized basic scalar type %u\n", unsigned(type.isBasicType()));
			return nullptr;
		}

		if (base.isVector())
			llvm_type = VectorType::get(base.getVectorSize(), llvm_type);

		return llvm_type;
	}
	else
	{
		LOGE("Unrecognized type.\n");
		return nullptr;
	}
}

void ParseContext::push_instruction(Instruction *instruction, ir::SsaDef ssa)
{
	assert(current_bb);
	instruction->set_tween_id(++tween_id);
	current_bb->add_instruction(instruction);
	if (ssa)
		value_map[ssa] = instruction;
}

uint32_t ParseContext::resolve_constant_uint(const ir::Operand &op) const
{
	auto *value = get_value(op);
	if (!value)
		return 0;

	if (auto *cint = llvm::dyn_cast<llvm::ConstantInt>(value))
		return cint->getUniqueInteger().getZExtValue();
	else
		return 0;
}

bool ParseContext::push_instruction(const ir::Op &op)
{
	switch (op.getOpCode())
	{
	case ir::OpCode::eInputLoad:
	{
		auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];

		// Redirect to magic opcode as needed.
		if (ref.op != DXIL::Op::Count)
		{
			auto *inst = build_load_builtin(ref.op, ir::SsaDef(op.getOperand(1)));
			push_instruction(inst, op.getDef());
			break;
		}

		auto *type = convert_type(op.getType());
		auto *scalar_type = type;

		unsigned components = 1;
		if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
		{
			components = vec->getVectorSize();
			scalar_type = vec->getElementType();
		}

		Instruction *insts[4] = {};

		uint32_t col = op.getOperand(1) ? resolve_constant_uint(op.getOperand(1)) : 0;

		for (unsigned c = 0; c < components; c++)
		{
			insts[c] = build_load_input(ref.index, scalar_type, get_constant_uint(0), col + c);
			push_instruction(insts[c], op.getDef());
		}

		if (components != 1)
		{
			auto *inst = context.construct<CompositeConstructInst>(
			    type, Vector<Value *>{ insts, insts + components });
			push_instruction(inst, op.getDef());
		}

		break;
	}

	case ir::OpCode::eOutputStore:
	{
		auto *store_value = get_value(op.getOperand(2));
		auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];
		unsigned components = 1;

		if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(store_value->getType()))
			components = vec->getVectorSize();

		uint32_t col = op.getOperand(1) ? resolve_constant_uint(op.getOperand(1)) : 0;

		if (components == 1)
		{
			push_instruction(build_store_output(ref.index, get_constant_uint(0), col, store_value));
		}
		else
		{
			for (unsigned c = 0; c < components; c++)
			{
				Vector<unsigned> indices { c };
				auto *value = build_extract_vector_component(store_value, c);
				push_instruction(build_store_output(ref.index, get_constant_uint(0), col + c, value));
			}
		}

		break;
	}

	case ir::OpCode::eCompositeConstruct:
	{
		auto *type = convert_type(op.getType());

		Vector<Value *> values;
		values.reserve(op.getOperandCount());

		for (unsigned i = 0; i < op.getOperandCount(); i++)
			values.push_back(get_value(op.getOperand(i)));

		auto *inst = context.construct<CompositeConstructInst>(type, std::move(values));
		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eCompositeExtract:
	{
		if (!llvm::isa<llvm::ConstantInt>(get_value(op.getOperand(1))))
		{
			LOGE("CompositeExtract must take a constant index.\n");
			return false;
		}

		auto *value = build_extract_vector_component(
		    get_value(op.getOperand(0)), resolve_constant_uint(op.getOperand(1)));
		value_map[op.getDef()] = value;
		break;
	}

	case ir::OpCode::eCompositeInsert:
	{
		auto *inst = context.construct<InsertElementInst>(
		    get_value(op.getOperand(0)), get_value(op.getOperand(2)), get_value(op.getOperand(1)));
		push_instruction(inst, op.getDef());
		break;
	}

	// Descriptor handling
	case ir::OpCode::eDescriptorLoad:
	{
		auto descriptor = ir::SsaDef(op.getOperand(0));
		auto &dcl_op = builder.getOp(descriptor);
		if (dcl_op.getOpCode() == ir::OpCode::eDclUavCounter)
			descriptor = ir::SsaDef(dcl_op.getOperand(1));

		auto *inst = build_descriptor_load(descriptor, ir::SsaDef(op.getOperand(1)),
		                                   bool(op.getFlags() & ir::OpFlag::eNonUniform));

		if (!inst)
			return false;
		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eBufferLoad:
	{
		if (!build_buffer_load(op))
			return false;
		break;
	}

	case ir::OpCode::eBufferStore:
	{
		if (!build_buffer_store(op))
			return false;
		break;
	}

	case ir::OpCode::eBufferAtomic:
	{
		if (!build_buffer_atomic(op))
			return false;
		break;
	}

	case ir::OpCode::eBufferQuerySize:
	{
		if (!build_buffer_size(op))
			return false;
		break;
	}

	// Plain instructions
	case ir::OpCode::eCast:
	{
		push_instruction(context.construct<CastInst>(
			                 convert_type(op.getType()),
			                 get_value(op.getOperand(0)),
			                 Instruction::CastOps::BitCast),
		                 op.getDef());
		break;
	}

#define BOP(irop, llvmop) case ir::OpCode::irop: push_instruction(context.construct<BinaryOperator>( \
    get_value(op.getOperand(0)),                                                                     \
    get_value(op.getOperand(1)),                                                                     \
    BinaryOperator::BinaryOps::llvmop), op.getDef()); break
	BOP(eIMul, Mul);
	BOP(eIAdd, Add);
#undef BOP

	default:
		LOGE("Unimplemented opcode %u\n", unsigned(op.getOpCode()));
		return false;
	}

	return true;
}

Instruction *ParseContext::build_load_input(
    uint32_t index, Type *type, Value *row, uint32_t col, Value *axis)
{
	auto *int_type = Type::getInt32Ty(context);
	auto *func = dxil_intrinsics.get(
		module, DXIL::Op::LoadInput, type,
		Vector<Type *> { int_type, int_type, int_type, int_type, int_type },
		type, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *>{
	        get_constant_uint(uint32_t(DXIL::Op::LoadInput)),
	        get_constant_uint(index),
	        row,
	        get_constant_uint(col),
	        axis ? axis : UndefValue::get(Type::getInt32Ty(context)),
	    });

	return inst;
}

Instruction *ParseContext::build_store_output(uint32_t index, Value *row, uint32_t col, Value *value)
{
	auto *int_type = Type::getInt32Ty(context);
	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::StoreOutput, Type::getVoidTy(context),
	    Vector<Type *> { int_type, int_type, int_type, int_type, value->getType() },
	    value->getType(), tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *>{
	        get_constant_uint(uint32_t(DXIL::Op::StoreOutput)),
	        get_constant_uint(index),
	        row,
	        get_constant_uint(col),
	        value
	    });

	return inst;
}

Instruction *ParseContext::build_load_builtin(DXIL::Op opcode, ir::SsaDef addr)
{
	auto *int_type = Type::getInt32Ty(context);

	Vector<Type *> types;
	if (addr)
		types.push_back(int_type);

	auto *func = dxil_intrinsics.get(module, opcode, int_type, types, nullptr, tween_id);

	Vector<Value *> args = {
		get_constant_uint(uint32_t(opcode)),
	};

	if (addr)
		args.push_back(get_value(addr));

	return context.construct<CallInst>(func->getFunctionType(), func, std::move(args));
}

Value *ParseContext::build_extract_vector_component(Value *value, unsigned component)
{
	// Common pattern where composites are constructed only to be extracted again.
	if (const auto *comp = dyn_cast<CompositeConstructInst>(value))
		return comp->getOperand(component);

	auto *extracted = context.construct<ExtractValueInst>(
	    cast<VectorType>(value->getType())->getElementType(), value, Vector<unsigned>{component});
	push_instruction(extracted);
	return extracted;
}

static VectorType *get_vec4_variant(Type *type)
{
	if (auto *vec = dyn_cast<VectorType>(type))
	{
		if (vec->getVectorSize() == 4)
			return vec;
		else
			return VectorType::get(4, vec->getElementType());
	}
	else
		return VectorType::get(4, type);
}

bool ParseContext::build_buffer_load_return_composite(const ir::Op &op, Value *value)
{
	unsigned num_elements = op.getType().getBaseType(0).getVectorSize();
	Value *values[4];

	for (unsigned c = 0; c < num_elements; c++)
		values[c] = build_extract_vector_component(value, c);

	if (num_elements != 1)
	{
		auto *result_type = convert_type(op.getType());
		auto *comp = context.construct<CompositeConstructInst>(
		    result_type, Vector<Value *> { values, values + num_elements });
		push_instruction(comp, op.getDef());
	}
	else
		value_map[op.getDef()] = values[0];

	return true;
}

bool ParseContext::build_buffer_load(const ir::Op &op, DXIL::ResourceKind kind)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto *int_type = Type::getInt32Ty(context);

	auto *addr_value = get_value(op.getOperand(1));

	Value *first;
	Value *second;

	// TODO: Adjust byte offset.
	if (kind == DXIL::ResourceKind::StructuredBuffer)
	{
		first = build_extract_vector_component(addr_value, 0);
		second = build_extract_vector_component(addr_value, 1);
	}
	else
	{
		first = addr_value;
		second = UndefValue::get(int_type);
	}

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = get_vec4_variant(result_type);

	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::BufferLoad, dxil_result_type,
	    Vector<Type *> {
	        int_type, get_value(descriptor)->getType(),
	        int_type, int_type,
	    }, dxil_result_type, tween_id);

	auto *inst = context.construct<CallInst>(
		func->getFunctionType(), func,
		Vector<Value *>{
			get_constant_uint(uint32_t(DXIL::Op::BufferLoad)),
			get_value(descriptor),
	        first, second,
		});

	push_instruction(inst);
	return build_buffer_load_return_composite(op, inst);
}

bool ParseContext::build_buffer_load_cbv(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto addr = ir::SsaDef(op.getOperand(1));
	auto *int_type = Type::getInt32Ty(context);
	Instruction *inst = nullptr;

	if (op.getType().isScalarType())
	{
		if (op.getType().byteSize() != 4)
		{
			LOGE("Only support 4 byte scalar CBV loads.\n");
			return false;
		}

		auto *result_type = convert_type(op.getType());
		auto *func = dxil_intrinsics.get(
		    module, DXIL::Op::CBufferLoad, result_type,
		    Vector<Type *> {
		        int_type, get_value(descriptor)->getType(), int_type,
		    }, result_type, tween_id);

		auto *addr_value = get_value(addr);
		if (!llvm::isa<llvm::VectorType>(addr_value->getType()))
		{
			LOGE("Expected a vector type addr for vectors.\n");
			return false;
		}

		auto *index16 = build_extract_vector_component(addr_value, 0);
		auto *index4 = build_extract_vector_component(addr_value, 1);

		auto *mul16 = context.construct<BinaryOperator>(index16, get_constant_uint(16), llvm::BinaryOperator::BinaryOps::Mul);
		auto *mul4 = context.construct<BinaryOperator>(index4, get_constant_uint(4), llvm::BinaryOperator::BinaryOps::Mul);
		auto *byte_addr = context.construct<BinaryOperator>(mul16, mul4, llvm::BinaryOperator::BinaryOps::Add);
		push_instruction(mul16);
		push_instruction(mul4);
		push_instruction(byte_addr);

		inst = context.construct<CallInst>(
			func->getFunctionType(), func,
			Vector<Value *>{
				get_constant_uint(uint32_t(DXIL::Op::CBufferLoad)),
				get_value(descriptor),
				byte_addr,
			});
	}
	else if (op.getType().isVectorType())
	{
		if (op.getType().getBaseType(0).getVectorSize() != 4 ||
		    op.getType().byteSize() != 16)
		{
			LOGE("We can only support vec4 or scalar loads from CBV.\n");
			return false;
		}

		auto *result_type = convert_type(op.getType());
		auto *func = dxil_intrinsics.get(
		    module, DXIL::Op::CBufferLoadLegacy, result_type,
		    Vector<Type *> {
		        int_type, get_value(descriptor)->getType(), int_type,
		    }, result_type, tween_id);

		auto *addr_value = get_value(addr);

		inst = context.construct<CallInst>(
			func->getFunctionType(), func,
			Vector<Value *>{
				get_constant_uint(uint32_t(DXIL::Op::CBufferLoadLegacy)),
				get_value(descriptor),
				addr_value,
			});
	}

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_buffer_load(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	// This function is overloaded, so need to figure out which type of load we should generate.
	if (itr->second.resource_type == DXIL::ResourceType::CBV)
		return build_buffer_load_cbv(op);
	else
		return build_buffer_load(op, itr->second.resource_kind);
}

bool ParseContext::build_buffer_store(const ir::Op &op, DXIL::ResourceKind kind)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto *int_type = Type::getInt32Ty(context);

	auto *addr_value = get_value(op.getOperand(1));

	Value *first;
	Value *second;

	// TODO: Adjust byte offset.
	if (kind == DXIL::ResourceKind::StructuredBuffer)
	{
		first = build_extract_vector_component(addr_value, 0);
		second = build_extract_vector_component(addr_value, 1);
	}
	else
	{
		first = addr_value;
		second = UndefValue::get(int_type);
	}

	auto *value = get_value(op.getOperand(2));
	Value *scalar_values[4];

	auto *scalar_type = value->getType();
	unsigned num_components = 1;
	if (const auto *vec = dyn_cast<VectorType>(scalar_type))
	{
		scalar_type = vec->getElementType();
		num_components = vec->getVectorSize();
	}

	unsigned mask = (1u << num_components) - 1u;

	for (unsigned c = 0; c < num_components; c++)
		scalar_values[c] = build_extract_vector_component(value, c);
	for (unsigned c = num_components; c < 4; c++)
		scalar_values[c] = UndefValue::get(scalar_type);

	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::BufferStore, Type::getVoidTy(context),
	    Vector<Type *> {
	        int_type, get_value(descriptor)->getType(),
	        int_type, int_type,
	        scalar_type, scalar_type, scalar_type, scalar_type,
	        int_type,
	    }, scalar_type, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *>{
	        get_constant_uint(uint32_t(DXIL::Op::BufferStore)),
	        get_value(descriptor),
	        first, second,
	        scalar_values[0], scalar_values[1], scalar_values[2], scalar_values[3],
	        get_constant_uint(mask),
	    });

	push_instruction(inst);
	return true;
}

bool ParseContext::build_buffer_store(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	return build_buffer_store(op, itr->second.resource_kind);
}

bool ParseContext::build_buffer_atomic_binop(const ir::Op &op, DXIL::ResourceKind kind)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto *int_type = Type::getInt32Ty(context);
	auto *addr_value = get_value(op.getOperand(1));

	Value *first;
	Value *second;

	// TODO: Adjust byte offset.
	if (kind == DXIL::ResourceKind::StructuredBuffer)
	{
		first = build_extract_vector_component(addr_value, 0);
		second = build_extract_vector_component(addr_value, 1);
	}
	else
	{
		first = addr_value;
		second = UndefValue::get(int_type);
	}

	auto atomic_op = ir::AtomicOp(op.getOperand(3));
	auto binop = convert_atomic_binop(atomic_op);

	Value *value;
	auto *return_type = convert_type(op.getType());

	if (binop == DXIL::AtomicBinOp::Load)
		value = UndefValue::get(int_type);
	else
	{
		value = get_value(op.getOperand(2));
		if (binop != DXIL::AtomicBinOp::Store && op.getType().isVoidType())
			return_type = int_type;
	}

	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::AtomicBinOp, return_type,
	    Vector<Type *> {
	        int_type, get_value(descriptor)->getType(),
	        int_type,
	        int_type, int_type, int_type,
	        int_type,
	    }, return_type, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *> {
	        get_constant_uint(uint32_t(DXIL::Op::AtomicBinOp)),
	        get_value(descriptor),
	        get_constant_uint(uint32_t(binop)),
	        first, second, UndefValue::get(int_type),
	        value,
	    });

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_buffer_atomic(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	if (ir::AtomicOp(op.getOperand(3)) != ir::AtomicOp::eCompareExchange)
		return build_buffer_atomic_binop(op, itr->second.resource_kind);
	else
		return false;
}

bool ParseContext::build_buffer_size(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto *result_type = convert_type(op.getType());
	auto *vec4_type = get_vec4_variant(result_type);

	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::GetDimensions, vec4_type,
	    Vector<Type *> {
	        result_type, get_value(descriptor)->getType(), result_type,
	    }, nullptr, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *> {
	        get_constant_uint(uint32_t(DXIL::Op::GetDimensions)),
	        get_value(descriptor),
	        UndefValue::get(Type::getInt32Ty(context)),
	    });

	push_instruction(inst);

	auto *value = build_extract_vector_component(inst, 0);

	if (itr->second.resource_kind == DXIL::ResourceKind::RawBuffer)
	{
		// dxbc-spirv expects result in u32 elements.
		push_instruction(
		    context.construct<BinaryOperator>(value, get_constant_uint(2), BinaryOperator::BinaryOps::LShr),
		    op.getDef());
	}
	else
	{
		value_map[op.getDef()] = value;
	}

	return true;
}

Instruction *ParseContext::build_descriptor_load(ir::SsaDef resource, ir::SsaDef index, bool nonuniform)
{
	auto itr = resource_map.find(resource);
	if (itr == resource_map.end())
		return nullptr;

	// Dummy pointer type which represents handles.
	// It's not directly used.
	auto *ptr_type = PointerType::get(Type::getVoidTy(context), 0);
	auto *int_type = Type::getInt32Ty(context);
	auto *bool_type = Type::getInt1Ty(context);
	auto *func = dxil_intrinsics.get(
		module, DXIL::Op::CreateHandle, ptr_type,
		Vector<Type *> {
	        int_type, int_type, int_type, bool_type,
	    }, nullptr, tween_id);

	Value *binding_offset;

	if (index)
	{
		auto *dynamic_offset = get_value(index);
		if (const auto *const_offset = llvm::dyn_cast<ConstantInt>(dynamic_offset))
		{
			binding_offset = get_constant_uint(
				const_offset->getUniqueInteger().getZExtValue() +
				itr->second.binding_offset);
		}
		else if (itr->second.binding_offset)
		{
			// SM 5.1 bindless.
			auto *add = context.construct<BinaryOperator>(dynamic_offset,
			                                              get_constant_uint(itr->second.binding_offset),
			                                              BinaryOperator::BinaryOps::Add);
			push_instruction(add);
			binding_offset = add;
		}
		else
		{
			binding_offset = dynamic_offset;
		}
	}
	else
	{
		// DXIL is a bit silly and takes effective register index instead of offset into binding space.
		binding_offset = get_constant_uint(itr->second.binding_offset);
	}

	Vector<Value *> args = {
		get_constant_uint(uint32_t(DXIL::Op::CreateHandle)),
		get_constant_uint(uint32_t(itr->second.resource_type)),
		get_constant_uint(itr->second.index),
		binding_offset,
		ConstantInt::get(bool_type, nonuniform),
	};

	return context.construct<CallInst>(func->getFunctionType(), func, std::move(args));
}

MDOperand *ParseContext::create_null_meta()
{
	return context.construct<MDOperand>(&module, MetadataKind::None);
}

MDNode *ParseContext::create_md_node(Vector<MDOperand *> ops)
{
	auto *node = context.construct<MDNode>(&module, std::move(ops));
	node->set_tween_id(++metadata_tween_id);
	module.add_unnamed_metadata(node);
	return node;
}

void ParseContext::create_named_md_node(const String &name, MDNode *node)
{
	Vector<MDNode *> vops { node };
	auto *n = context.construct<NamedMDNode>(&module, name, std::move(vops));
	module.add_named_metadata(name, n);
}

MDNode *ParseContext::create_stage_io_meta()
{
	struct IOOp
	{
		const ir::Op *op;
		std::string semantic;
		uint32_t index;
	};
	std::vector<IOOp> io_inputs, io_outputs, io_patch;

	for (auto &op : builder)
	{
		switch (op.getOpCode())
		{
		case ir::OpCode::eDclInput:
		case ir::OpCode::eDclInputBuiltIn:
			io_inputs.push_back({ &op });
			break;

		case ir::OpCode::eDclOutput:
		case ir::OpCode::eDclOutputBuiltIn:
			io_outputs.push_back({ &op });
			break;

		case ir::OpCode::eSemantic:
		{
			std::vector<IOOp> *sems[] = { &io_inputs, &io_outputs, &io_patch };
			for (auto *sem : sems)
			{
				for (auto &ioop : *sem)
				{
					if (ioop.op->getDef() == ir::SsaDef(op.getOperand(0)))
					{
						ioop.index = uint32_t(op.getOperand(1));
						ioop.semantic = op.getLiteralString(2);
					}
				}
			}
			break;
		}

		default:
			break;
		}
	}

	const struct
	{
		std::vector<IOOp> *ioop;
		MetadataMapping *mapping;
	} mappings[] = {
		{ &io_inputs, &inputs },
		{ &io_outputs, &outputs },
		{ &io_patch, &patches },
	};

	for (auto &mapping : mappings)
	{
		for (auto &io : *mapping.ioop)
		{
			DXIL::Semantic builtin = DXIL::Semantic::User;
			uint32_t location, component;

			bool is_input =
				io.op->getOpCode() == ir::OpCode::eDclInput ||
				io.op->getOpCode() == ir::OpCode::eDclInputBuiltIn;

			bool is_user =
				io.op->getOpCode() == ir::OpCode::eDclInput ||
				io.op->getOpCode() == ir::OpCode::eDclOutput;

			if (is_user)
			{
				location = uint32_t(io.op->getOperand(1));
				component = uint32_t(io.op->getOperand(2));
			}
			else
			{
				builtin = convert_semantic(ir::BuiltIn(io.op->getOperand(1)));
				location = UINT32_MAX;
				component = UINT32_MAX;

				// Some stage IO builtins are resolved through opcodes, not IO.
				auto op = convert_builtin_opcode(ir::BuiltIn(io.op->getOperand(1)));
				if (op != DXIL::Op::Count)
				{
					stage_io_map[io.op->getDef()] = { UINT32_MAX, op };
					continue;
				}
			}

			auto interpolation = DXIL::InterpolationMode::Invalid;
			if (is_input)
				interpolation = convert_interpolation_mode(ir::InterpolationMode(io.op->getOperand(3)));

			auto comp = convert_component_mapping(io.op->getType());
			build_stage_io(*mapping.mapping, io.op->getDef(), String(io.semantic),
			               comp.type, builtin, io.index, interpolation,
			               comp.num_rows, comp.num_cols, location, component);
		}
	}

	return create_md_node(
		inputs.nodes.empty() ? create_null_meta() : create_md_node(inputs.nodes),
		outputs.nodes.empty() ? create_null_meta() : create_md_node(outputs.nodes),
		patches.nodes.empty() ? create_null_meta() : create_md_node(patches.nodes));
}

bool ParseContext::emit_entry_point()
{
	const ir::Op *entry = nullptr;
	for_all_opcodes(builder, ir::OpCode::eEntryPoint, [&](const ir::Op &op) { entry = &op; return false; });
	if (!entry)
		return false;

	auto shader_stage = ir::ShaderStage(entry->getOperand(entry->getFirstLiteralOperandIndex()));
	Vector<MDOperand *> flag_ops;

	uint64_t shader_flags = 0;
	flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::ShaderFlags)));
	flag_ops.push_back(create_constant_uint64_meta(shader_flags));

	if (shader_stage == ir::ShaderStage::eCompute)
	{
		flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::NumThreads)));
		const ir::Op *threads = nullptr;
		for_all_opcodes(builder, ir::OpCode::eSetCsWorkgroupSize,
		                [&](const ir::Op &op) { threads = &op; return false; });

		if (!threads)
		{
			LOGE("Need to declare threads.\n");
			return false;
		}

		flag_ops.push_back(create_md_node(
		    create_constant_uint_meta(uint32_t(threads->getOperand(1))),
		    create_constant_uint_meta(uint32_t(threads->getOperand(2))),
		    create_constant_uint_meta(uint32_t(threads->getOperand(3)))));
	}

	for (uint32_t i = 0; i < entry->getFirstLiteralOperandIndex(); i++)
	{
		auto ssa = ir::SsaDef(entry->getOperand(i));

		Type *type = convert_type(entry->getType());

		// Entry points don't take arguments.
		auto *func_type = context.construct<FunctionType>(context, type, Vector<Type *>{});
		auto *func = context.construct<Function>(func_type, ++tween_id, module);
		module.add_value_name(tween_id, i == 0 ? "main" : "patchMain");

		// We're not barbarians.
		func->set_structured_control_flow();

		function_map[ssa] = func;

		if (i == 0)
		{
			create_named_md_node("dx.entryPoints",
			                     create_md_node(create_constant_meta(func), create_string_meta("main"),
			                                    create_stage_io_meta(), create_null_meta(),
			                                    flag_ops.empty() ? create_null_meta() : create_md_node(flag_ops)));
		}
	}

	auto *name = create_string_meta("dxbc-spirv");
	create_named_md_node("llvm.ident", create_md_node(name));

	const char *stage_str = shader_stage_to_meta(shader_stage);
	auto *stage_type = create_string_meta(stage_str);
	auto *major = create_constant_uint_meta(6);
	auto *minor = create_constant_uint_meta(0);
	create_named_md_node("dx.shaderModel", create_md_node(stage_type, major, minor));
	return true;
}

uint32_t ParseContext::build_texture_srv(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, DXIL::ComponentType type)
{
	uint32_t ret = srvs.nodes.size();
	auto *srv = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_null_meta(), // SRV sample count? We don't care about that.
	    create_md_node(
	        create_constant_uint_meta(0),
	        create_constant_uint_meta(uint32_t(type))));

	srvs.nodes.push_back(srv);
	return ret;
}

uint32_t ParseContext::build_texture_uav(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, DXIL::ComponentType type,
    bool coherent, bool rov)
{
	uint32_t ret = uavs.nodes.size();

	auto *uav = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_constant_uint_meta(coherent),
	    create_constant_uint_meta(false),
	    create_constant_uint_meta(rov),
	    create_md_node(
	        create_constant_uint_meta(0),
	        create_constant_uint_meta(uint32_t(type))));

	uavs.nodes.push_back(uav);
	return ret;
}

uint32_t ParseContext::build_buffer_uav(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, uint32_t stride,
    bool coherent, bool counter, bool rov)
{
	uint32_t ret = uavs.nodes.size();

	auto *uav = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_constant_uint_meta(coherent),
	    create_constant_uint_meta(counter),
	    create_constant_uint_meta(rov),
	    create_md_node(
	        create_constant_uint_meta(1),
	        create_constant_uint_meta(stride)));

	uavs.nodes.push_back(uav);
	return ret;
}

uint32_t ParseContext::build_buffer_srv(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, uint32_t stride)
{
	uint32_t ret = srvs.nodes.size();
	auto *srv = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_null_meta(), // SRV sample count? We don't care about that.
	    create_md_node(
	        create_constant_uint_meta(1),
	        create_constant_uint_meta(stride)));

	srvs.nodes.push_back(srv);
	return ret;
}

uint32_t ParseContext::build_sampler(uint32_t space, uint32_t index, uint32_t size)
{
	uint32_t ret = samplers.nodes.size();
	auto *sampler = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size));

	samplers.nodes.push_back(sampler);
	return ret;
}

uint32_t ParseContext::build_cbv(
    uint32_t space, uint32_t index, uint32_t size, uint32_t cbv_size)
{
	uint32_t ret = cbvs.nodes.size();
	auto *sampler = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(cbv_size));

	cbvs.nodes.push_back(sampler);
	return ret;
}

uint32_t ParseContext::build_stage_io(
    MetadataMapping &mapping, ir::SsaDef ssa,
	const String &name, DXIL::ComponentType type, DXIL::Semantic semantic, uint32_t semantic_index,
    DXIL::InterpolationMode interpolation,
    uint32_t rows, uint32_t cols,
    uint32_t start_row, uint32_t start_col)
{
	uint32_t ret = mapping.nodes.size();

	stage_io_map[ssa] = { ret, DXIL::Op::Count };

	auto *input = create_md_node(
		create_constant_uint_meta(ret),
		create_string_meta(name),
		create_constant_uint_meta(uint32_t(type)),
		create_constant_uint_meta(uint32_t(semantic)),
		semantic_index ? create_md_node(create_constant_uint_meta(semantic_index)) : create_null_meta(),
		create_constant_uint_meta(uint32_t(interpolation)),
		create_constant_uint_meta(rows),
		create_constant_uint_meta(cols),
		create_constant_uint_meta(start_row),
		create_constant_uint_meta(start_col),
		create_null_meta());

	mapping.nodes.push_back(input);
	return ret;
}

bool ParseContext::emit_metadata()
{
	UnorderedSet<ir::SsaDef> uav_counters;
	for (auto &op : builder)
		if (op.getOpCode() == ir::OpCode::eDclUavCounter)
			uav_counters.insert(ir::SsaDef(op.getOperand(1)));

	for (auto &op : builder)
	{
		switch (op.getOpCode())
		{
		case ir::OpCode::eDclCbv:
		{
			uint32_t space = uint32_t(op.getOperand(1));
			uint32_t binding = uint32_t(op.getOperand(2));
			uint32_t count = uint32_t(op.getOperand(3));
			if (!count)
				count = UINT32_MAX;

			uint32_t cbv_size = op.getType().byteSize();
			uint32_t index = build_cbv(space, binding, count, cbv_size);
			resource_map[op.getDef()] = { DXIL::ResourceType::CBV, DXIL::ResourceKind::CBuffer, index, binding };
			break;
		}

		case ir::OpCode::eDclSampler:
			return false;

		case ir::OpCode::eDclSrv:
		case ir::OpCode::eDclUav:
		{
			uint32_t space = uint32_t(op.getOperand(1));
			uint32_t binding = uint32_t(op.getOperand(2));
			uint32_t count = uint32_t(op.getOperand(3));
			if (!count)
				count = UINT32_MAX;

			auto kind = convert_resource_kind(ir::ResourceKind(uint32_t(op.getOperand(4))));
			bool srv = op.getOpCode() == ir::OpCode::eDclSrv;
			uint32_t index;

			ir::UavFlag uav_flags = {};
			if (!srv)
				uav_flags = ir::UavFlag(op.getOperand(5));

			if (kind == DXIL::ResourceKind::RawBuffer || kind == DXIL::ResourceKind::StructuredBuffer)
			{
				uint32_t stride = 0;

				if (kind == DXIL::ResourceKind::StructuredBuffer)
				{
					if (op.getType().getArrayDimensions() != 2)
					{
						LOGE("Expected 2 array dimensions.\n");
						return false;
					}

					stride = op.getType().getArraySize(0) * 4;
				}
				else
				{
					if (op.getType().getArrayDimensions() != 1)
					{
						LOGE("Expected 1 array dimension.\n");
						return false;
					}
				}

				if (op.getType().getArraySize(op.getType().getArrayDimensions() - 1) != 0)
				{
					LOGE("Last dimension must be unsized.\n");
					return false;
				}

				if (op.getType().getBaseType(0).byteSize() != 4)
				{
					LOGE("Expected 4 byte base type for raw buffers.\n");
					return false;
				}

				if (srv)
				{
					index = build_buffer_srv(space, binding, count, kind, stride);
				}
				else
				{
					index = build_buffer_uav(space, binding, count, kind, stride,
					                         bool(uav_flags & ir::UavFlag::eCoherent),
					                         uav_counters.count(op.getDef()) != 0,
					                         bool(uav_flags & ir::UavFlag::eRasterizerOrdered));
				}
			}
			else
			{
				auto mapping = convert_component_mapping(op.getType());

				if (srv)
				{
					index = build_texture_srv(space, binding, count, kind, mapping.type);
				}
				else
				{
					index = build_texture_uav(space, binding, count, kind, mapping.type,
					                          bool(uav_flags & ir::UavFlag::eCoherent),
					                          bool(uav_flags & ir::UavFlag::eRasterizerOrdered));
				}
			}

			resource_map[op.getDef()] = {
				srv ? DXIL::ResourceType::SRV : DXIL::ResourceType::UAV, kind, index, binding
			};

			break;
		}

		default:
			break;
		}
	}

	create_named_md_node("dx.resources", create_md_node(
		srvs.nodes.empty() ? create_null_meta() : create_md_node(srvs.nodes),
		uavs.nodes.empty() ? create_null_meta() : create_md_node(uavs.nodes),
		cbvs.nodes.empty() ? create_null_meta() : create_md_node(cbvs.nodes),
		samplers.nodes.empty() ? create_null_meta() : create_md_node(samplers.nodes)));

	return true;
}

bool ParseContext::emit_function_bodies()
{
	Vector<BasicBlock *> bbs;
	Function *func = nullptr;

	for (auto &op : builder)
	{
		switch (op.getOpCode())
		{
		case ir::OpCode::eEntryPoint:
		case ir::OpCode::eDebugName:
			break;

		case ir::OpCode::eDclInput:
		case ir::OpCode::eDclInputBuiltIn:
		case ir::OpCode::eDclOutput:
		case ir::OpCode::eDclOutputBuiltIn:
		case ir::OpCode::eDclSrv:
		case ir::OpCode::eDclUav:
		case ir::OpCode::eDclUavCounter:
		case ir::OpCode::eDclCbv:
		case ir::OpCode::eDclSampler:
		case ir::OpCode::eSemantic:
		case ir::OpCode::eSetCsWorkgroupSize:
			break;

		case ir::OpCode::eConstant:
			if (!emit_constant(op))
				return false;
			break;

		// Functions
		case ir::OpCode::eDclParam:
			param_types[op.getDef()] = convert_type(op.getType());
			break;

		case ir::OpCode::eFunction:
		{
			auto itr = function_map.find(op.getDef());
			if (itr == function_map.end())
			{
				Type *type = convert_type(op.getType());

				Vector<Type *> types;
				types.reserve(op.getOperandCount());
				params.clear();

				for (unsigned i = 0; i < op.getOperandCount(); i++)
				{
					auto *param_type = param_types[ir::SsaDef(op.getOperand(i))];
					types.push_back(param_type);
					params.emplace_back(ir::SsaDef(op.getOperand(i)), param_type);
				}

				auto *func_type = context.construct<FunctionType>(context, type, std::move(types));
				func = context.construct<Function>(func_type, ++tween_id, module);
				func->set_structured_control_flow();
				function_map[op.getDef()] = func;
			}
			else
			{
				func = itr->second;
			}
			break;
		}

		case ir::OpCode::eFunctionEnd:
		{
			if (!func)
			{
				LOGE("Cannot end function without a function.\n");
				return false;
			}

			func->set_basic_blocks(std::move(bbs));
			module.add_function_implementation(func);
			bbs = {};
			break;
		}

		// Basic Blocks
		case ir::OpCode::eLabel:
		{
			auto *bb = get_basic_block(op.getDef());
			current_bb = bb;
			bbs.push_back(bb);

			switch (ir::Construct(op.getOperand(op.getFirstLiteralOperandIndex())))
			{
			case ir::Construct::eStructuredSelection:
				bb->set_selection_merge(get_basic_block(ir::SsaDef(op.getOperand(0))));
				break;

			case ir::Construct::eStructuredLoop:
				bb->set_loop_merge(get_basic_block(ir::SsaDef(op.getOperand(0))),
				                   get_basic_block(ir::SsaDef(op.getOperand(1))));
				break;

			default:
				break;
			}

			break;
		}

		case ir::OpCode::eReturn:
		{
			if (!current_bb)
				return false;

			if (op.getOperand(0))
				push_instruction(context.construct<ReturnInst>(get_value(op.getOperand(0))));
			else
				push_instruction(context.construct<ReturnInst>(nullptr));

			current_bb = nullptr;
			break;
		}

		case ir::OpCode::eBranch:
		{
			if (!current_bb)
				return false;
			auto *target = get_basic_block(ir::SsaDef(op.getOperand(0)));
			current_bb->add_successor(target);
			push_instruction(context.construct<BranchInst>(target));
			current_bb = nullptr;
			break;
		}

		case ir::OpCode::eBranchConditional:
		{
			if (!current_bb)
				return false;
			auto *value = get_value(op.getOperand(0));
			auto *true_path = get_basic_block(ir::SsaDef(op.getOperand(1)));
			auto *false_path = get_basic_block(ir::SsaDef(op.getOperand(2)));
			current_bb->add_successor(true_path);
			current_bb->add_successor(false_path);
			push_instruction(context.construct<BranchInst>(true_path, false_path, value));
			current_bb = nullptr;
			break;
		}

		case ir::OpCode::eSwitch:
		{
			if (!current_bb)
				return false;
			auto *default_block = get_basic_block(ir::SsaDef(op.getOperand(1)));
			current_bb->add_successor(default_block);

			unsigned num_cases = (op.getOperandCount() - 2) / 2;
			auto *inst = context.construct<SwitchInst>(get_value(op.getOperand(0)), default_block, num_cases);
			for (unsigned i = 0; i < num_cases; i++)
			{
				auto *value = get_value(op.getOperand(2 * i + 2));
				auto *case_label = get_basic_block(ir::SsaDef(op.getOperand(2 * i + 3)));
				current_bb->add_successor(case_label);
				inst->addCase(value, case_label);
			}

			push_instruction(inst);
			current_bb = nullptr;
			break;
		}

		case ir::OpCode::eUnreachable:
			if (!current_bb)
				return false;
			push_instruction(context.construct<UnreachableInst>());
			current_bb = nullptr;
			break;

		// Opcodes
		default:
			if (!current_bb)
			{
				LOGE("No BB to insert instructions into.\n");
				return false;
			}

			if (!push_instruction(op))
				return false;
			break;
		}
	}

	return true;
}

Value *ParseContext::get_value(const ir::Operand &op) const
{
	return get_value(ir::SsaDef(op));
}

Value *ParseContext::get_value(const ir::SsaDef &op) const
{
	auto itr = value_map.find(op);
	return itr == value_map.end() ? nullptr : itr->second;
}

BasicBlock *ParseContext::get_basic_block(ir::SsaDef ssa)
{
	auto &bb = bb_map[ssa];
	if (!bb)
		bb = context.construct<BasicBlock>(context);
	return bb;
}

ConstantInt *ParseContext::get_constant_uint(uint32_t value)
{
	return ConstantInt::get(Type::getInt32Ty(context), value);
}

ConstantAsMetadata *ParseContext::create_constant_uint_meta(uint32_t value)
{
	return create_constant_meta(get_constant_uint(value));
}

ConstantAsMetadata *ParseContext::create_constant_uint64_meta(uint32_t value)
{
	return create_constant_meta(ConstantInt::get(Type::getInt64Ty(context), value));
}

ConstantAsMetadata *ParseContext::create_constant_meta(Constant *c)
{
	return context.construct<ConstantAsMetadata>(&module, c);
}

MDString *ParseContext::create_string_meta(const String &str)
{
	return context.construct<MDString>(&module, str);
}

// Parses the highly simplified and SSA-ified IR coming from dxbc-spirv.
Module *parseDXBCIR(LLVMContext &context, ir::Builder &builder)
{
	auto *module = context.construct<Module>(context);
	ParseContext ctx(context, builder, *module);
	if (!ctx.emit_entry_point())
		return nullptr;
	if (!ctx.emit_metadata())
		return nullptr;
	if (!ctx.emit_function_bodies())
		return nullptr;
	return module;
}
}