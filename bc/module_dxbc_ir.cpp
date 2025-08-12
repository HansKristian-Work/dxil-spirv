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
#include "dxbc/dxbc_api.h"
#include "util/util_log.h"
using namespace dxbc_spv;

class ScopedLogger : util::Logger
{

public:

	virtual void message(util::LogLevel severity, const char* text)
	{
		switch (severity)
		{
			case util::LogLevel::eDebug:
			case util::LogLevel::eInfo: LOGI("%s\n", text); break;
			case util::LogLevel::eWarn: LOGW("%s\n", text); break;
			case util::LogLevel::eError: LOGE("%s\n", text); break;
		}
	}

	virtual util::LogLevel getMinimumSeverity()
	{
		return util::LogLevel::eInfo;
	}

};

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

static DXIL::InputPrimitive convert_input_primitive_type(ir::PrimitiveType type)
{
	switch (type)
	{
	case ir::PrimitiveType::eLines:
		return DXIL::InputPrimitive::Line;
	case ir::PrimitiveType::eLinesAdj:
		return DXIL::InputPrimitive::LineWithAdjacency;
	case ir::PrimitiveType::ePoints:
		return DXIL::InputPrimitive::Point;
	case ir::PrimitiveType::eTriangles:
		return DXIL::InputPrimitive::Triangle;
	case ir::PrimitiveType::eTrianglesAdj:
		return DXIL::InputPrimitive::TriangleWithAdjaceny;
	default:
		return DXIL::InputPrimitive::Undefined;
	}
}

static DXIL::PrimitiveTopology convert_output_primitive_type(ir::PrimitiveType type)
{
	switch (type)
	{
	case ir::PrimitiveType::eLines:
		return DXIL::PrimitiveTopology::LineStrip;
	case ir::PrimitiveType::ePoints:
		return DXIL::PrimitiveTopology::PointList;
	case ir::PrimitiveType::eTriangles:
		return DXIL::PrimitiveTopology::TriangleStrip;
	default:
		return DXIL::PrimitiveTopology::Undefined;
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
	case ir::BuiltIn::eLocalThreadIndex:
		return DXIL::Op::FlattenedThreadIdInGroup;
	case ir::BuiltIn::eIsFullyCovered:
		return DXIL::Op::InnerCoverage;
	case ir::BuiltIn::eGsInstanceId:
		return DXIL::Op::GSInstanceID;
	case ir::BuiltIn::ePrimitiveId:
		return DXIL::Op::PrimitiveID;
	case ir::BuiltIn::eTessControlPointId:
		return DXIL::Op::OutputControlPointID;
	case ir::BuiltIn::eTessControlPointCountIn:
		return DXIL::Op::ExtendedSpirvControlPointCountIn;

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
	case ir::BuiltIn::eGlobalThreadId:
		return DXIL::Semantic::DispatchThreadID;
	case ir::BuiltIn::eLocalThreadId:
		return DXIL::Semantic::GroupThreadID;
	case ir::BuiltIn::eWorkgroupId:
		return DXIL::Semantic::GroupID;

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
	case ir::AtomicOp::eInc:
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
	case ir::AtomicOp::eDec:
		return DXIL::AtomicBinOp::Sub;
	case ir::AtomicOp::eLoad:
		return DXIL::AtomicBinOp::Load;
	case ir::AtomicOp::eStore:
		return DXIL::AtomicBinOp::Store;
	default:
		return DXIL::AtomicBinOp::Invalid;
	}
}

static AtomicRMWInst::BinOp convert_atomic_binop_llvm(ir::AtomicOp binop)
{
	switch (binop)
	{
	case ir::AtomicOp::eAdd:
	case ir::AtomicOp::eInc:
		return AtomicRMWInst::BinOp::Add;
	case ir::AtomicOp::eAnd:
		return AtomicRMWInst::BinOp::And;
	case ir::AtomicOp::eOr:
		return AtomicRMWInst::BinOp::Or;
	case ir::AtomicOp::eXor:
		return AtomicRMWInst::BinOp::Xor;
	case ir::AtomicOp::eExchange:
		return AtomicRMWInst::BinOp::Xchg;
	case ir::AtomicOp::eSMax:
		return AtomicRMWInst::BinOp::Max;
	case ir::AtomicOp::eSMin:
		return AtomicRMWInst::BinOp::Min;
	case ir::AtomicOp::eUMax:
		return AtomicRMWInst::BinOp::UMax;
	case ir::AtomicOp::eUMin:
		return AtomicRMWInst::BinOp::UMin;
	case ir::AtomicOp::eSub:
	case ir::AtomicOp::eDec:
		return AtomicRMWInst::BinOp::Sub;
	case ir::AtomicOp::eLoad:
		return AtomicRMWInst::BinOp::Or;
	case ir::AtomicOp::eStore:
		return AtomicRMWInst::BinOp::Xchg;
	default:
		return AtomicRMWInst::BinOp::Invalid;
	}
}

static DXIL::Op convert_round_mode(ir::RoundMode mode)
{
	switch (mode)
	{
	case ir::RoundMode::ePositiveInf:
		return DXIL::Op::Round_pi;
	case ir::RoundMode::eNegativeInf:
		return DXIL::Op::Round_ni;
	case ir::RoundMode::eZero:
		return DXIL::Op::Round_z;
	default:
		return DXIL::Op::Round_ne;
	}
}

struct ComponentMapping
{
	DXIL::ComponentType type = DXIL::ComponentType::Invalid;
	uint32_t num_rows = 1;
	uint32_t num_cols = 1;
};

static ComponentMapping convert_component_mapping(const ir::Type &type, bool need_axis)
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

	case ir::ScalarType::eBool:
		mapping.type = DXIL::ComponentType::I1;
		break;

	default:
		LOGE("Unrecognized component type.\n");
		break;
	}

	if (need_axis)
	{
		// Strip the outermost dimension.
		if (type.getArrayDimensions() >= 2)
			mapping.num_rows = type.getArraySize(type.getArrayDimensions() - 2);
	}
	else if (type.isArrayType())
	{
		mapping.num_rows = type.getArraySize(0);
		if (type.getArrayDimensions() != 1)
			LOGE("Unexpected number of array dimensions.\n");
	}

	mapping.num_cols = type.getBaseType(0).getVectorSize();

	return mapping;
}

static DXIL::TessellatorDomain convert_hull_domain(ir::PrimitiveType type)
{
	switch (type)
	{
	case ir::PrimitiveType::eTriangles:
		return DXIL::TessellatorDomain::Tri;
	case ir::PrimitiveType::eQuads:
		return DXIL::TessellatorDomain::Quad;
	case ir::PrimitiveType::eLines:
		return DXIL::TessellatorDomain::IsoLine;
	default:
		return DXIL::TessellatorDomain::Undefined;
	}
}

static DXIL::TessellatorPartitioning convert_hull_partitioning(ir::TessPartitioning part)
{
	switch (part)
	{
	case ir::TessPartitioning::eInteger:
		return DXIL::TessellatorPartitioning::Integer;
	case ir::TessPartitioning::eFractEven:
		return DXIL::TessellatorPartitioning::FractionalEven;
	case ir::TessPartitioning::eFractOdd:
		return DXIL::TessellatorPartitioning::FractionalOdd;
	default:
		return DXIL::TessellatorPartitioning::Undefined;
	}
}

static DXIL::TessellatorOutputPrimitive convert_hull_output_primitive(ir::PrimitiveType type, ir::TessWindingOrder winding)
{
	switch (type)
	{
	case ir::PrimitiveType::eTriangles:
		return winding == ir::TessWindingOrder::eCw ?
		       DXIL::TessellatorOutputPrimitive::TriangleCW :
		       DXIL::TessellatorOutputPrimitive::TriangleCCW;
	case ir::PrimitiveType::eLines:
		return DXIL::TessellatorOutputPrimitive::Line;
	case ir::PrimitiveType::ePoints:
		return DXIL::TessellatorOutputPrimitive::Point;
	default:
		return DXIL::TessellatorOutputPrimitive::Undefined;
	}
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

	ir::ShaderStage shader_stage = {};

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

	MDOperand *create_entry_point_meta(llvm::Function *patch_control_func);
	MDNode *create_stage_io_meta();
	MDOperand *create_null_meta();

	void set_function_attributes(Function *func);

	struct MetadataMapping
	{
		Vector<MDOperand *> nodes;
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
	                        uint32_t start_row, uint32_t start_col,
	                        uint32_t stream,
	                        bool need_axis);

	// DXIL intrinsic build.
	DXILIntrinsicTable dxil_intrinsics;

	template <typename... Values>
	Instruction *build_dxil_call(DXIL::Op op, Type *return_type, Type *overload_type, Values&&... values);
	Instruction *build_dxil_call(DXIL::Op op, Type *return_type, Type *overload_type, Vector<Value *> values);

	// Resource access hell.
	Instruction *build_load_input(
		uint32_t index, Type *type,
		Value *row, uint32_t col, Value *axis, bool patch);
	Instruction *build_load_output(
		uint32_t index, Type *type,
		Value *row, uint32_t col, Value *axis = nullptr);
	Instruction *build_store_output(uint32_t index, Value *row, uint32_t col, Value *value, bool patch);
	Instruction *build_load_builtin(DXIL::Op opcode, ir::SsaDef addr);
	Instruction *build_descriptor_load(ir::SsaDef resource, ir::SsaDef index, bool nonuniform);

	bool build_input_load(const ir::Op &op);
	bool build_output_load(const ir::Op &op);
	bool build_output_store(const ir::Op &op);
	bool build_gep_load(const ir::Op &op);
	bool build_gep_store(const ir::Op &op);
	bool build_composite_construct(const ir::Op &op);
	bool build_composite_extract(const ir::Op &op);
	bool build_composite_insert(const ir::Op &op);
	bool build_descriptor_load(const ir::Op &op);
	bool build_buffer_load(const ir::Op &op);
	bool build_buffer_load_cbv(const ir::Op &op);
	bool build_buffer_load(const ir::Op &op, DXIL::ResourceKind kind);
	bool build_buffer_load_return_composite(const ir::Op &op, Value *value);
	Instruction *build_extract_composite(const ir::Op &op, Value *value, unsigned num_elements);
	bool build_buffer_query_size(const ir::Op &op);
	bool build_buffer_store(const ir::Op &op);
	bool build_buffer_store(const ir::Op &op, DXIL::ResourceKind kind);
	bool build_buffer_atomic(const ir::Op &op);
	bool build_lds_atomic(const ir::Op &op);
	bool build_buffer_atomic_binop(const ir::Op &op, DXIL::ResourceKind kind);
	bool build_counter_atomic(const ir::Op &op);
	bool build_image_load(const ir::Op &op);
	bool build_image_store(const ir::Op &op);
	bool build_image_atomic(const ir::Op &op);
	bool build_image_query_size(const ir::Op &op);
	bool build_image_query_mips_samples(const ir::Op &op);
	bool build_image_sample(const ir::Op &op);
	bool build_image_gather(const ir::Op &op);
	bool build_image_compute_lod(const ir::Op &op);
	bool build_deriv(const ir::Op &op);
	bool build_check_sparse_access(const ir::Op &op);
	bool build_fround(const ir::Op &op);
	bool build_frcp(const ir::Op &op);
	bool build_binary_op(const ir::Op &op, BinaryOperator::BinaryOps binop);
	bool build_interpolate_at_centroid(const ir::Op &op);
	bool build_interpolate_at_sample(const ir::Op &op);
	bool build_interpolate_at_offset(const ir::Op &op);
	bool build_barrier(const ir::Op &op);
	bool build_demote(const ir::Op &op);

	template <DXIL::Op dxop>
	bool build_dxil_unary(const ir::Op &op);
	template <DXIL::Op dxop>
	bool build_dxil_constant_unary(const ir::Op &op);
	template <DXIL::Op dxop>
	bool build_dxil_binary(const ir::Op &op);
	template <DXIL::Op dxop>
	bool build_dxil_trinary(const ir::Op &op);
	template <DXIL::Op dxop>
	bool build_dxil_quaternary(const ir::Op &op);

	Value *get_extracted_composite_component(Value *value, unsigned component);
	Value *get_constant_mul(Value *value, uint32_t scale);

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
		bool need_axis = false;
	};
	UnorderedMap<ir::SsaDef, StageIOHandler> stage_io_map;

	struct StageIOAccess
	{
		Value *axis;
		Value *row;
		uint32_t col;
	};
	StageIOAccess build_stage_io_access(const StageIOHandler &handler, ir::SsaDef io_decl, ir::SsaDef addr);

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

	ir::OpFlags global_fp_flags = {};
};

static inline Type *get_value_type(Value *value)
{
	assert(value);
	return value->getType();
}

static Type *get_scalar_type(Type *type)
{
	if (auto *vec = dyn_cast<VectorType>(type))
		return vec->getElementType();
	else if (isa<StructType>(type))
		return type->getStructElementType(0);
	else
		return type;
}

template <typename... Values>
Instruction *ParseContext::build_dxil_call(DXIL::Op op, Type *return_type, Type *overload_type, Values&&... values)
{
	auto *func = dxil_intrinsics.get(
	    module, op, return_type,
	    Vector<Type *> { Type::getInt32Ty(context), get_value_type(values)... }, overload_type, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *> { get_constant_uint(uint32_t(op)), values... });

	return inst;
}

Instruction *ParseContext::build_dxil_call(DXIL::Op op, Type *return_type, Type *overload_type, Vector<Value *> values)
{
	Vector<Type *> types;
	types.reserve(values.size() + 1);
	types.push_back(Type::getInt32Ty(context));
	for (auto *v : values)
		types.push_back(v->getType());

	auto *func = dxil_intrinsics.get(module, op, return_type, types, overload_type, tween_id);
	values.insert(values.begin(), get_constant_uint(uint32_t(op)));
	auto *inst = context.construct<CallInst>(func->getFunctionType(), func, std::move(values));
	return inst;
}

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
			else if (type.getBaseType(0).isBoolType())
				value = ConstantInt::get(llvm_type, bool(op.getOperand(0)));
			else
				return false;
		}
		else
		{
			Vector<Value *> constants;
			constants.reserve(op.getOperandCount());

			auto *llvm_sub_type = get_scalar_type(llvm_type);

			if (type.getBaseType(0).isIntType())
			{
				for (uint32_t i = 0; i < op.getOperandCount(); i++)
					constants.push_back(ConstantInt::get(llvm_sub_type, uint64_t(op.getOperand(i))));
			}
			else if (type.getBaseType(0).isFloatType())
			{
				for (uint32_t i = 0; i < op.getOperandCount(); i++)
					constants.push_back(ConstantFP::get(llvm_sub_type, uint64_t(op.getOperand(i))));
			}
			else
				return false;

			value = context.construct<ConstantDataVector>(convert_type(type), std::move(constants));
		}
	}
	else if (type.isArrayType())
	{
		// This is quite flexible, but only support what we can reasonably expect to see. Extend and generalize if needed.
		auto elem_type = type.getSubType(0);
		if (!elem_type.isScalarType() && !elem_type.isVectorType())
			return false;

		uint32_t vecsize = elem_type.getBaseType(0).getVectorSize();
		assert(vecsize && op.getOperandCount() % vecsize == 0);
		uint32_t array_elements = op.getOperandCount() / vecsize;

		Vector<Value *> constants;
		Vector<Value *> values;

		values.reserve(array_elements);
		constants.reserve(vecsize);

		auto *llvm_sub_type = convert_type(elem_type);

		for (uint32_t elem = 0; elem < array_elements; elem++)
		{
			constants.clear();

			for (uint32_t c = 0; c < vecsize; c++)
			{
				if (elem_type.getBaseType(0).isIntType())
				{
					constants.push_back(ConstantInt::get(get_scalar_type(llvm_sub_type),
					                                     uint64_t(op.getOperand(elem * vecsize + c))));
				}
				else if (elem_type.getBaseType(0).isFloatType())
				{
					constants.push_back(ConstantFP::get(get_scalar_type(llvm_sub_type),
					                                    uint64_t(op.getOperand(elem * vecsize + c))));
				}
				else
					return false;
			}

			if (elem_type.isVectorType())
				values.push_back(context.construct<ConstantDataVector>(convert_type(elem_type), constants));
			else
				values.push_back(constants[0]);
		}

		auto *constant_value = context.construct<ConstantDataArray>(convert_type(op.getType()), values);
		auto *lut = context.construct<GlobalVariable>(
			PointerType::get(convert_type(op.getType()), uint32_t(DXIL::AddressSpace::Thread)),
			GlobalVariable::LinkageTypes::InternalLinkage, false);
		lut->set_initializer(constant_value);
		module.add_global_variable(lut);
		value = lut;
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

		case ir::ScalarType::eBool:
			llvm_type = Type::getInt1Ty(context);
			break;

		default:
			LOGE("Unrecognized basic scalar type %u\n", unsigned(base.getBaseType()));
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

ParseContext::StageIOAccess
ParseContext::build_stage_io_access(const StageIOHandler &handler, ir::SsaDef io_decl, ir::SsaDef addr)
{
	Value *axis = nullptr;
	Value *row = get_constant_uint(0);
	uint32_t col = 0;

	if (addr)
	{
		auto &decl = builder.getOp(io_decl);
		auto &addr_op = builder.getOp(addr);

		uint32_t chain_length = addr_op.getType().getBaseType(0).getVectorSize();
		uint32_t dim = 0;

		auto *addr_value = get_value(addr);

		if (handler.need_axis)
			axis = get_extracted_composite_component(addr_value, dim++);
		if (dim + 1 == decl.getType().getArrayDimensions())
			row = get_extracted_composite_component(addr_value, dim++);

		// This is optional if we're loading from a scalar, or we're loading the full vector.
		if (dim < chain_length)
		{
			assert(dim == chain_length - 1);

			// The last element is the column. It must be constant.
			if (const auto *c = dyn_cast<ConstantInt>(get_extracted_composite_component(addr_value, dim)))
			{
				col = c->getUniqueInteger().getZExtValue();
			}
			else
			{
				LOGE("Column index is not compile-time constant.\n");
				return {};
			}
		}
	}

	return { axis, row, col };
}

static bool io_decl_is_patch(ir::ShaderStage stage, const ir::Op &op)
{
	if (stage != ir::ShaderStage::eHull && stage != ir::ShaderStage::eDomain)
		return false;

	switch (op.getOpCode())
	{
	case ir::OpCode::eDclInput:
		return stage == ir::ShaderStage::eDomain && !op.getType().isArrayType();
	case ir::OpCode::eDclOutput:
		return stage == ir::ShaderStage::eHull && !op.getType().isArrayType();
	case ir::OpCode::eDclOutputBuiltIn:
		if (stage == ir::ShaderStage::eDomain)
			return false;
		break;
	default:
		break;
	}

	// For builtin-IO, there's tess factors and clip/cull distance that is a bit "special".
	auto builtin = ir::BuiltIn(op.getOperand(1));

	if (builtin == ir::BuiltIn::eTessCoord)
		return false;

	return builtin == ir::BuiltIn::eTessFactorOuter || builtin == ir::BuiltIn::eTessFactorInner ||
	       !op.getType().isArrayType();
}

bool ParseContext::build_input_load(const ir::Op &op)
{
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];

	// Redirect to magic opcode as needed.
	if (ref.op != DXIL::Op::Count)
	{
		auto *inst = build_load_builtin(ref.op, ir::SsaDef(op.getOperand(1)));
		push_instruction(inst, op.getDef());
		return true;
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

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));
	bool patch = io_decl_is_patch(shader_stage, builder.getOp(ir::SsaDef(op.getOperand(0))));

	for (unsigned c = 0; c < components; c++)
	{
		insts[c] = build_load_input(ref.index, scalar_type, access.row, access.col + c, access.axis, patch);
		push_instruction(insts[c], op.getDef());
	}

	if (components != 1)
	{
		auto *inst = context.construct<CompositeConstructInst>(
		    type, Vector<Value *>{ insts, insts + components });
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_output_load(const ir::Op &op)
{
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];

	auto *type = convert_type(op.getType());
	auto *scalar_type = type;

	unsigned components = 1;
	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
	{
		components = vec->getVectorSize();
		scalar_type = vec->getElementType();
	}

	Instruction *insts[4] = {};

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));

	for (unsigned c = 0; c < components; c++)
	{
		insts[c] = build_load_output(ref.index, scalar_type, access.row, access.col + c, access.axis);
		push_instruction(insts[c], op.getDef());
	}

	if (components != 1)
	{
		auto *inst = context.construct<CompositeConstructInst>(
		    type, Vector<Value *>{ insts, insts + components });
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_interpolate_at_centroid(const ir::Op &op)
{
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];
	auto *type = convert_type(op.getType());
	auto *scalar_type = type;

	unsigned components = 1;
	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
	{
		components = vec->getVectorSize();
		scalar_type = vec->getElementType();
	}

	Instruction *insts[4] = {};

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));

	for (unsigned c = 0; c < components; c++)
	{
		insts[c] = build_dxil_call(DXIL::Op::EvalCentroid, scalar_type, scalar_type,
		                           get_constant_uint(ref.index),
		                           access.row, get_constant_uint(access.col + c));
		push_instruction(insts[c], op.getDef());
	}

	if (components != 1)
	{
		auto *inst = context.construct<CompositeConstructInst>(
		    type, Vector<Value *>{ insts, insts + components });
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_interpolate_at_sample(const ir::Op &op)
{
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];
	auto *type = convert_type(op.getType());
	auto *scalar_type = type;

	unsigned components = 1;
	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
	{
		components = vec->getVectorSize();
		scalar_type = vec->getElementType();
	}

	Instruction *insts[4] = {};

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));

	for (unsigned c = 0; c < components; c++)
	{
		insts[c] = build_dxil_call(DXIL::Op::EvalSampleIndex, scalar_type, scalar_type,
		                           get_constant_uint(ref.index),
		                           access.row, get_constant_uint(access.col + c), get_value(op.getOperand(2)));
		push_instruction(insts[c], op.getDef());
	}

	if (components != 1)
	{
		auto *inst = context.construct<CompositeConstructInst>(
		    type, Vector<Value *>{ insts, insts + components });
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_interpolate_at_offset(const ir::Op &op)
{
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];
	auto *type = convert_type(op.getType());
	auto *scalar_type = type;

	unsigned components = 1;
	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
	{
		components = vec->getVectorSize();
		scalar_type = vec->getElementType();
	}

	Instruction *insts[4] = {};

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));

	for (unsigned c = 0; c < components; c++)
	{
		insts[c] = build_dxil_call(DXIL::Op::ExtendedEvalSnapped, scalar_type, scalar_type,
		                           get_constant_uint(ref.index),
		                           access.row, get_constant_uint(access.col + c), get_value(op.getOperand(2)));
		push_instruction(insts[c], op.getDef());
	}

	if (components != 1)
	{
		auto *inst = context.construct<CompositeConstructInst>(
		    type, Vector<Value *>{ insts, insts + components });
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_output_store(const ir::Op &op)
{
	auto *store_value = get_value(op.getOperand(2));
	auto &ref = stage_io_map[ir::SsaDef(op.getOperand(0))];
	unsigned components = 1;

	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(store_value->getType()))
		components = vec->getVectorSize();

	auto access = build_stage_io_access(ref, ir::SsaDef(op.getOperand(0)), ir::SsaDef(op.getOperand(1)));
	bool patch = io_decl_is_patch(shader_stage, builder.getOp(ir::SsaDef(op.getOperand(0))));

	if (components == 1)
	{
		push_instruction(build_store_output(ref.index, access.row, access.col, store_value, patch));
	}
	else
	{
		for (unsigned c = 0; c < components; c++)
		{
			auto *value = get_extracted_composite_component(store_value, c);
			push_instruction(build_store_output(ref.index, access.row, access.col + c, value, patch));
		}
	}

	return true;
}

bool ParseContext::build_gep_load(const ir::Op &op)
{
	auto *type = convert_type(op.getType());
	Vector<Value *> args;
	args.push_back(get_value(op.getOperand(0)));
	args.push_back(get_constant_uint(0));

	if (op.getOperand(1))
	{
		auto &addr = builder.getOp(ir::SsaDef(op.getOperand(1)));
		auto *addr_value = get_value(op.getOperand(1));
		for (uint32_t i = 0; i < addr.getType().getBaseType(0).getVectorSize(); i++)
			args.push_back(get_extracted_composite_component(addr_value, i));
	}

	auto addr_space = op.getOpCode() == ir::OpCode::eLdsLoad ?
	                  DXIL::AddressSpace::GroupShared : DXIL::AddressSpace::Thread;

	auto *gep = context.construct<GetElementPtrInst>(
		PointerType::get(type, uint32_t(addr_space)), std::move(args), true);
	auto *load = context.construct<LoadInst>(type, gep);
	push_instruction(gep);
	push_instruction(load, op.getDef());
	return true;
}

bool ParseContext::build_gep_store(const ir::Op &op)
{
	auto *type = convert_type(builder.getOp(ir::SsaDef(op.getOperand(2))).getType());
	Vector<Value *> args;
	args.push_back(get_value(op.getOperand(0)));
	args.push_back(get_constant_uint(0));

	if (op.getOperand(1))
	{
		auto &addr = builder.getOp(ir::SsaDef(op.getOperand(1)));
		auto *addr_value = get_value(op.getOperand(1));
		for (uint32_t i = 0; i < addr.getType().getBaseType(0).getVectorSize(); i++)
			args.push_back(get_extracted_composite_component(addr_value, i));
	}

	auto addr_space = op.getOpCode() == ir::OpCode::eLdsStore ?
	                  DXIL::AddressSpace::GroupShared : DXIL::AddressSpace::Thread;

	auto *gep = context.construct<GetElementPtrInst>(
	    PointerType::get(type, uint32_t(addr_space)), std::move(args), true);
	auto *store = context.construct<StoreInst>(gep, get_value(op.getOperand(2)));
	push_instruction(gep);
	push_instruction(store, op.getDef());
	return true;
}

bool ParseContext::build_composite_construct(const ir::Op &op)
{
	auto *type = convert_type(op.getType());

	Vector<Value *> values;
	values.reserve(op.getOperandCount());

	for (unsigned i = 0; i < op.getOperandCount(); i++)
		values.push_back(get_value(op.getOperand(i)));

	auto *inst = context.construct<CompositeConstructInst>(type, std::move(values));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_composite_extract(const ir::Op &op)
{
	auto &address = builder.getOpForOperand(op, 1);
	if (!address.isConstant())
	{
		LOGE("CompositeExtract must take a constant index.\n");
		return false;
	}

	auto *value = get_value(op.getOperand(0));

	for (unsigned i = 0; i < address.getOperandCount(); i++)
		value = get_extracted_composite_component(value, uint32_t(address.getOperand(i)));

	value_map[op.getDef()] = value;
	return true;
}

bool ParseContext::build_composite_insert(const ir::Op &op)
{
	auto *inst = context.construct<InsertElementInst>(
	    get_value(op.getOperand(0)), get_value(op.getOperand(2)), get_value(op.getOperand(1)));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_descriptor_load(const ir::Op &op)
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
	return true;
}

bool ParseContext::build_deriv(const ir::Op &op)
{
	auto *inst = build_dxil_call(DXIL::Op::ExtendedDeriv,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)),
	                             get_constant_uint(op.getOpCode() == ir::OpCode::eDerivY),
	                             get_constant_uint(uint32_t(op.getOperand(1))));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_check_sparse_access(const ir::Op &op)
{
	auto *inst = build_dxil_call(DXIL::Op::CheckAccessFullyMapped,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_fround(const ir::Op &op)
{
	auto dxop = convert_round_mode(ir::RoundMode(op.getOperand(op.getFirstLiteralOperandIndex())));
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_frcp(const ir::Op &op)
{
	Constant *const1;

	switch (op.getType().getBaseType(0).getBaseType())
	{
	case ir::ScalarType::eF16:
		const1 = ConstantFP::get(Type::getHalfTy(context), 0x3c00);
		break;

	case ir::ScalarType::eF32:
	{
		const float one = 1.0f;
		uint32_t v;
		memcpy(&v, &one, sizeof(one));
		const1 = ConstantFP::get(Type::getFloatTy(context), v);
		break;
	}

	case ir::ScalarType::eF64:
	{
		const double one = 1.0;
		uint64_t v;
		memcpy(&v, &one, sizeof(one));
		const1 = ConstantFP::get(Type::getDoubleTy(context), v);
		break;
	}

	default:
		return false;
	}

	if (op.getType().isVectorType())
	{
		unsigned num_components = op.getType().getBaseType(0).getVectorSize();
		Vector<Value *> values;
		values.reserve(num_components);
		for (unsigned i = 0; i < num_components; i++)
			values.push_back(const1);
		const1 = context.construct<ConstantDataVector>(VectorType::get(num_components, const1->getType()), std::move(values));
	}

	auto *inst = context.construct<BinaryOperator>(const1, get_value(op.getOperand(0)),
	                                               BinaryOperator::BinaryOps::FDiv);
	inst->setFast(!((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_binary_op(const ir::Op &op, BinaryOperator::BinaryOps binop)
{
	auto *inst = context.construct<BinaryOperator>(
	    get_value(op.getOperand(0)), get_value(op.getOperand(1)), binop);
	push_instruction(inst, op.getDef());
	if (op.getType().getBaseType(0).isFloatType())
		inst->setFast(!((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise));
	return true;
}

template <DXIL::Op dxop>
bool ParseContext::build_dxil_unary(const ir::Op &op)
{
	assert(op.getOperandCount() == 1);
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)));
	if ((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise)
		inst->setMetadata("dx.precise", create_md_node(create_null_meta()));
	push_instruction(inst, op.getDef());
	return true;
}

template <DXIL::Op dxop>
bool ParseContext::build_dxil_constant_unary(const ir::Op &op)
{
	assert(op.getOperandCount() == 1);
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_constant_uint(uint32_t(op.getOperand(0))));
	if ((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise)
		inst->setMetadata("dx.precise", create_md_node(create_null_meta()));
	push_instruction(inst, op.getDef());
	return true;
}

template <DXIL::Op dxop>
bool ParseContext::build_dxil_binary(const ir::Op &op)
{
	assert(op.getOperandCount() == 2);
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)), get_value(op.getOperand(1)));
	if ((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise)
		inst->setMetadata("dx.precise", create_md_node(create_null_meta()));
	push_instruction(inst, op.getDef());
	return true;
}

template <DXIL::Op dxop>
bool ParseContext::build_dxil_trinary(const ir::Op &op)
{
	assert(op.getOperandCount() == 3);
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)),
	                             get_value(op.getOperand(1)),
	                             get_value(op.getOperand(2)));
	if ((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise)
		inst->setMetadata("dx.precise", create_md_node(create_null_meta()));
	push_instruction(inst, op.getDef());
	return true;
}

template <DXIL::Op dxop>
bool ParseContext::build_dxil_quaternary(const ir::Op &op)
{
	assert(op.getOperandCount() == 4);
	auto *inst = build_dxil_call(dxop,
	                             convert_type(op.getType()), convert_type(op.getType()),
	                             get_value(op.getOperand(0)),
	                             get_value(op.getOperand(1)),
	                             get_value(op.getOperand(2)),
	                             get_value(op.getOperand(3)));
	if ((op.getFlags() | global_fp_flags) & ir::OpFlag::ePrecise)
		inst->setMetadata("dx.precise", create_md_node(create_null_meta()));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_barrier(const ir::Op &op)
{
	auto exec_scope = ir::Scope(op.getOperand(0));
	auto mem_scope = ir::Scope(op.getOperand(1));
	auto memory_type = ir::MemoryTypeFlags(op.getOperand(2));
	auto *void_type = Type::getVoidTy(context);

	uint32_t memory_flags = 0;
	uint32_t semantic_flags = 0;

	semantic_flags |= DXIL::GroupScopeBit;
	if (exec_scope != ir::Scope::eThread)
		semantic_flags |= DXIL::GroupSyncBit;
	if (mem_scope == ir::Scope::eGlobal)
		semantic_flags |= DXIL::DeviceScopeBit;

	if (memory_type & ir::MemoryType::eLds)
		memory_flags |= DXIL::MemoryTypeGroupSharedBit;
	if (memory_type & (ir::MemoryType::eUavBuffer | ir::MemoryType::eUavImage))
		memory_flags |= DXIL::MemoryTypeUavBit;

	auto *inst = build_dxil_call(DXIL::Op::BarrierByMemoryType, void_type, void_type,
	                             get_constant_uint(memory_flags),
	                             get_constant_uint(semantic_flags));

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_demote(const ir::Op &op)
{
	auto *void_type = Type::getVoidTy(context);
	auto *inst = build_dxil_call(DXIL::Op::Discard, void_type, void_type,
	                             get_constant_uint(1));
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::push_instruction(const ir::Op &op)
{
	switch (op.getOpCode())
	{
#define OPMAP(irop, llvmop) case ir::OpCode::e##irop: if (!build_##llvmop(op)) return false; break
	OPMAP(InputLoad, input_load);
	OPMAP(OutputLoad, output_load);
	OPMAP(OutputStore, output_store);
	OPMAP(CompositeConstruct, composite_construct);
	OPMAP(CompositeExtract, composite_extract);
	OPMAP(CompositeInsert, composite_insert);
	OPMAP(DescriptorLoad, descriptor_load);
	OPMAP(BufferLoad, buffer_load);
	OPMAP(BufferStore, buffer_store);
	OPMAP(BufferAtomic, buffer_atomic);
	OPMAP(CounterAtomic, counter_atomic);
	OPMAP(BufferQuerySize, buffer_query_size);
	OPMAP(ImageLoad, image_load);
	OPMAP(ImageStore, image_store);
	OPMAP(ImageAtomic, image_atomic);
	OPMAP(ImageQuerySize, image_query_size);
	OPMAP(ImageQueryMips, image_query_mips_samples);
	OPMAP(ImageQuerySamples, image_query_mips_samples);
	OPMAP(ImageSample, image_sample);
	OPMAP(ImageGather, image_gather);
	OPMAP(ImageComputeLod, image_compute_lod);
	OPMAP(DerivX, deriv);
	OPMAP(DerivY, deriv);
	OPMAP(CheckSparseAccess, check_sparse_access);
	OPMAP(FRound, fround);
	OPMAP(FAbs, dxil_unary<DXIL::Op::FAbs>);
	OPMAP(IAbs, dxil_unary<DXIL::Op::ExtendedIAbs>);
	OPMAP(FMad, dxil_trinary<DXIL::Op::Fma>);
	OPMAP(FRcp, frcp);
	OPMAP(FFract, dxil_unary<DXIL::Op::Frc>);
	OPMAP(FMin, dxil_binary<DXIL::Op::FMin>);
	OPMAP(FMax, dxil_binary<DXIL::Op::FMax>);
	OPMAP(SMin, dxil_binary<DXIL::Op::IMin>);
	OPMAP(SMax, dxil_binary<DXIL::Op::IMax>);
	OPMAP(UMin, dxil_binary<DXIL::Op::UMin>);
	OPMAP(UMax, dxil_binary<DXIL::Op::UMax>);
	OPMAP(FClamp, dxil_trinary<DXIL::Op::ExtendedFClamp>);
	OPMAP(SClamp, dxil_trinary<DXIL::Op::ExtendedIClamp>);
	OPMAP(UClamp, dxil_trinary<DXIL::Op::ExtendedUClamp>);
	OPMAP(FLog2, dxil_unary<DXIL::Op::Log>);
	OPMAP(FExp2, dxil_unary<DXIL::Op::Exp>);
	OPMAP(FSin, dxil_unary<DXIL::Op::Sin>);
	OPMAP(FCos, dxil_unary<DXIL::Op::Cos>);
	OPMAP(FSqrt, dxil_unary<DXIL::Op::Sqrt>);
	OPMAP(FRsq, dxil_unary<DXIL::Op::Rsqrt>);
	OPMAP(FIsNan, dxil_unary<DXIL::Op::IsNan>);
	OPMAP(ConvertF32toPackedF16, dxil_unary<DXIL::Op::ExtendedLegacyF32ToF16>);
	OPMAP(ConvertPackedF16toF32, dxil_unary<DXIL::Op::ExtendedLegacyF16ToF32>);
	OPMAP(InterpolateAtCentroid, interpolate_at_centroid);
	OPMAP(InterpolateAtSample, interpolate_at_sample);
	OPMAP(InterpolateAtOffset, interpolate_at_offset);
	OPMAP(UBitExtract, dxil_trinary<DXIL::Op::ExtendedSpirvUbfe>);
	OPMAP(SBitExtract, dxil_trinary<DXIL::Op::ExtendedSpirvIbfe>);
	OPMAP(IBitInsert, dxil_quaternary<DXIL::Op::ExtendedSpirvBfi>);
	OPMAP(EmitVertex, dxil_constant_unary<DXIL::Op::EmitStream>);
	OPMAP(EmitPrimitive, dxil_constant_unary<DXIL::Op::CutStream>);
	OPMAP(IBitCount, dxil_unary<DXIL::Op::Countbits>);
	OPMAP(IBitReverse, dxil_unary<DXIL::Op::Bfrev>);
	OPMAP(IFindLsb, dxil_unary<DXIL::Op::ExtendedSpirvFindLSB>);
	OPMAP(SFindMsb, dxil_unary<DXIL::Op::ExtendedSpirvIFindMSB>);
	OPMAP(UFindMsb, dxil_unary<DXIL::Op::ExtendedSpirvUFindMSB>);
	OPMAP(IAddCarry, dxil_binary<DXIL::Op::ExtendedSpirvIAddCarry>);
	OPMAP(ISubBorrow, dxil_binary<DXIL::Op::ExtendedSpirvISubBorrow>);
	OPMAP(SMulExtended, dxil_binary<DXIL::Op::ExtendedSpirvSMulExtended>);
	OPMAP(UMulExtended, dxil_binary<DXIL::Op::ExtendedSpirvUMulExtended>);
	OPMAP(ScratchLoad, gep_load);
	OPMAP(ScratchStore, gep_store);
	OPMAP(LdsLoad, gep_load);
	OPMAP(LdsStore, gep_store);
	OPMAP(ConstantLoad, gep_load);
	OPMAP(Barrier, barrier);
	OPMAP(LdsAtomic, lds_atomic);
	OPMAP(Demote, demote);
#undef OPMAP

	// Plain instructions
	case ir::OpCode::eCast:
	{
		if (convert_type(op.getType()) == convert_type(builder.getOp(ir::SsaDef(op.getOperand(0))).getType()))
		{
			// I <-> U casts are meaningless.
			value_map[op.getDef()] = get_value(op.getOperand(0));
		}
		else
		{
			push_instruction(context.construct<CastInst>(convert_type(op.getType()), get_value(op.getOperand(0)),
			                                             Instruction::CastOps::BitCast),
			                 op.getDef());
		}
		break;
	}

	case ir::OpCode::eSelect:
	{
		push_instruction(context.construct<SelectInst>(
			                 get_value(op.getOperand(1)),
			                 get_value(op.getOperand(2)),
			                 get_value(op.getOperand(0))),
		                 op.getDef());
		break;
	}

	case ir::OpCode::eFNeg:
	case ir::OpCode::eINeg:
	{
		push_instruction(context.construct<UnaryOperator>(
			                 op.getOpCode() == ir::OpCode::eFNeg ?
			                 UnaryOperator::UnaryOps::FNeg : UnaryOperator::UnaryOps::INeg,
			                 get_value(op.getOperand(0))),
		                 op.getDef());
		break;
	}

#define CMP(irop, type, llvmop) \
	case ir::OpCode::irop: \
		push_instruction(context.construct<type##CmpInst>( \
			                 CmpInst::Predicate::llvmop, \
			                 get_value(op.getOperand(0)), \
			                 get_value(op.getOperand(1))), \
		                 op.getDef()); break
	CMP(eFNe, F, FCMP_UNE);
	CMP(eFEq, F, FCMP_OEQ);
	CMP(eFGt, F, FCMP_OGT);
	CMP(eFGe, F, FCMP_OGE);
	CMP(eFLt, F, FCMP_OLT);
	CMP(eFLe, F, FCMP_OLE);
	CMP(eINe, I, ICMP_NE);
	CMP(eIEq, I, ICMP_EQ);
	CMP(eBNe, I, ICMP_NE);
	CMP(eBEq, I, ICMP_EQ);
	CMP(eSGt, I, ICMP_SGT);
	CMP(eSGe, I, ICMP_SGE);
	CMP(eSLt, I, ICMP_SLT);
	CMP(eSLe, I, ICMP_SLE);
	CMP(eUGt, I, ICMP_UGT);
	CMP(eUGe, I, ICMP_UGE);
	CMP(eULt, I, ICMP_ULT);
	CMP(eULe, I, ICMP_ULE);

#define BOP(irop, llvmop) case ir::OpCode::irop: if (!build_binary_op(op, BinaryOperator::BinaryOps::llvmop)) return false; break
	BOP(eFAdd, FAdd);
	BOP(eFSub, FSub);
	BOP(eFMul, FMul);
	BOP(eFDiv, FDiv);
	BOP(eIAdd, Add);
	BOP(eISub, Sub);
	BOP(eIMul, Mul);
	BOP(eUDiv, UDiv);
	BOP(eUMod, URem);
	BOP(eIAnd, And);
	BOP(eIOr, Or);
	BOP(eIXor, Xor);
	BOP(eBAnd, And);
	BOP(eBOr, Or);
	BOP(eIShl, Shl);
	BOP(eUShr, LShr);
	BOP(eSShr, AShr);
#undef BOP

	case ir::OpCode::eConvertFtoF:
	{
		auto &out_type = op.getType();
		auto &in_type = builder.getOp(ir::SsaDef(op.getOperand(0))).getType();

		if (out_type.byteSize() == in_type.byteSize())
		{
			value_map[op.getDef()] = get_value(op.getOperand(0));
			break;
		}

		bool ext = out_type.byteSize() > in_type.byteSize();
		auto *inst = context.construct<CastInst>(convert_type(out_type),
		                                         get_value(op.getOperand(0)),
		                                         ext ? Instruction::CastOps::FPExt : Instruction::CastOps::FPTrunc);
		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eConvertFtoI:
	{
		auto &out_type = op.getType();
		bool is_signed = out_type.getBaseType(0).isSignedIntType();
		auto *inst = context.construct<CastInst>(convert_type(out_type), get_value(op.getOperand(0)),
		                                         is_signed ? Instruction::CastOps::FPToSI : Instruction::CastOps::FPToUI);
		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eConvertItoF:
	{
		auto &out_type = op.getType();
		auto &in_type = builder.getOp(ir::SsaDef(op.getOperand(0))).getType();
		bool is_signed = in_type.getBaseType(0).isSignedIntType();
		auto *inst = context.construct<CastInst>(convert_type(out_type), get_value(op.getOperand(0)),
		                                         is_signed ? Instruction::CastOps::SIToFP : Instruction::CastOps::UIToFP);
		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eConvertItoI:
	{
		auto &out_type = op.getType();
		auto &in_type = builder.getOp(ir::SsaDef(op.getOperand(0))).getType();
		bool is_signed = in_type.getBaseType(0).isSignedIntType();
		bool ext = out_type.byteSize() > in_type.byteSize();

		if (out_type.byteSize() == in_type.byteSize())
		{
			value_map[op.getDef()] = get_value(op.getOperand(0));
			break;
		}

		if (!ext)
		{
			auto *inst = context.construct<CastInst>(convert_type(out_type), get_value(op.getOperand(0)), Instruction::CastOps::Trunc);
			push_instruction(inst, op.getDef());
		}
		else
		{
			auto *inst = context.construct<CastInst>(
				convert_type(out_type), get_value(op.getOperand(0)),
				is_signed ? Instruction::CastOps::SExt : Instruction::CastOps::ZExt);
			push_instruction(inst, op.getDef());
		}

		break;
	}

	case ir::OpCode::eINot:
	case ir::OpCode::eBNot:
	{
		auto *result_type = convert_type(op.getType());
		auto *scalar_type = result_type;
		Constant *constant_max;
		if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(result_type))
		{
			scalar_type = vec->getElementType();
			constant_max = ConstantInt::get(scalar_type, UINT64_MAX);
			// Only vec2 is supported.
			constant_max = context.construct<ConstantDataVector>(result_type, Vector<Value *>{ constant_max, constant_max });
		}
		else
		{
			constant_max = ConstantInt::get(scalar_type, UINT64_MAX);
		}

		auto *inst = context.construct<BinaryOperator>(get_value(op.getOperand(0)),
		                                               constant_max,
		                                               Instruction::BinaryOps::Xor);

		push_instruction(inst, op.getDef());
		break;
	}

	case ir::OpCode::eFunctionCall:
	{
		auto itr = function_map.find(ir::SsaDef(op.getOperand(0)));
		if (itr == function_map.end())
			return false;

		auto *func = itr->second;
		Vector<Value *> args;
		args.reserve(op.getOperandCount() - 1);

		for (uint32_t i = 1; i < op.getOperandCount(); i++)
			args.push_back(get_value(op.getOperand(i)));

		push_instruction(context.construct<CallInst>(func->getFunctionType(), func, std::move(args)),
		                 op.getDef());
		break;
	}

	default:
		LOGE("Unimplemented opcode %u\n", unsigned(op.getOpCode()));
		return false;
	}

	return true;
}

Instruction *ParseContext::build_load_input(
    uint32_t index, Type *type, Value *row, uint32_t col, Value *axis, bool patch)
{
	assert(index != UINT32_MAX);
	auto *inst = build_dxil_call(
		patch ? DXIL::Op::LoadPatchConstant : DXIL::Op::ExtendedSpirvLoadInput, type, type,
		get_constant_uint(index),
		row,
		get_constant_uint(col),
		axis ? axis : UndefValue::get(Type::getInt32Ty(context)));

	return inst;
}

Instruction *ParseContext::build_load_output(
    uint32_t index, Type *type, Value *row, uint32_t col, Value *axis)
{
	assert(index != UINT32_MAX);

	// This is slightly extended internally to allow loading outputs in general.
	auto *inst = build_dxil_call(
	    DXIL::Op::LoadOutputControlPoint, type, type,
	    get_constant_uint(index),
	    row,
	    get_constant_uint(col),
	    axis ? axis : UndefValue::get(Type::getInt32Ty(context)));

	return inst;
}

Instruction *ParseContext::build_store_output(uint32_t index, Value *row, uint32_t col, Value *value, bool patch)
{
	assert(index != UINT32_MAX);
	auto *inst = build_dxil_call(
		patch ? DXIL::Op::StorePatchConstant : DXIL::Op::StoreOutput, Type::getVoidTy(context), value->getType(),
		get_constant_uint(index),
		row,
		get_constant_uint(col),
		value);

	return inst;
}

Instruction *ParseContext::build_load_builtin(DXIL::Op opcode, ir::SsaDef addr)
{
	Type *type;

	if (opcode == DXIL::Op::InnerCoverage)
		type = Type::getInt1Ty(context);
	else
		type = Type::getInt32Ty(context);

	if (addr)
		return build_dxil_call(opcode, type, nullptr, get_value(addr));
	else
		return build_dxil_call(opcode, type, nullptr);
}

Value *ParseContext::get_extracted_composite_component(Value *value, unsigned component)
{
	if (!isa<VectorType>(value->getType()) && !isa<StructType>(value->getType()))
	{
		assert(component == 0);
		return value;
	}

	// Common pattern where composites are constructed only to be extracted again.
	if (const auto *comp = dyn_cast<CompositeConstructInst>(value))
		return comp->getOperand(component);
	if (const auto *vec = dyn_cast<ConstantDataVector>(value))
		return vec->getElementAsConstant(component);

	ExtractValueInst *extracted;
	if (const auto *vec_type = dyn_cast<VectorType>(value->getType()))
		extracted = context.construct<ExtractValueInst>(vec_type->getElementType(), value, Vector<unsigned>{ component });
	else if (const auto *struct_type = dyn_cast<StructType>(value->getType()))
		extracted = context.construct<ExtractValueInst>(struct_type->getStructElementType(component), value, Vector<unsigned>{ component });
	else
		return nullptr;

	push_instruction(extracted);
	return extracted;
}

Value *ParseContext::get_constant_mul(Value *value, uint32_t scale)
{
	// If there is already a multiplier, fold it in to help dxil-spirv analysis get proper vectorization.
	if (const auto *cint = dyn_cast<ConstantInt>(value))
	{
		return get_constant_uint(cint->getUniqueInteger().getZExtValue() * scale);
	}
	else if (const auto *bop = dyn_cast<BinaryOperator>(value))
	{
		if (bop->getOpcode() == BinaryOperator::BinaryOps::Mul)
		{
			auto *ca = dyn_cast<ConstantInt>(bop->getOperand(0));
			auto *cb = dyn_cast<ConstantInt>(bop->getOperand(1));

			if (ca && cb)
			{
				return get_constant_uint(
				    ca->getUniqueInteger().getZExtValue() * cb->getUniqueInteger().getZExtValue() * scale);
			}
			else if (ca || cb)
			{
				auto *c = ca ? ca : cb;
				auto *other = bop->getOperand(ca ? 1 : 0);
				auto *inst =
					context.construct<BinaryOperator>(
						get_constant_uint(
							c->getUniqueInteger().getZExtValue() * scale), other, BinaryOperator::BinaryOps::Mul);
				push_instruction(inst);
				return inst;
			}
		}
		else if (bop->getOpcode() == BinaryOperator::BinaryOps::Add)
		{
			if (isa<ConstantInt>(bop->getOperand(0)) || isa<ConstantInt>(bop->getOperand(1)))
			{
				// Avoid nested scaling. Scale each side. Probably only worth it if at least one of them is a constant.
				auto *scaled_a = get_constant_mul(bop->getOperand(0), scale);
				auto *scaled_b = get_constant_mul(bop->getOperand(1), scale);
				auto *inst = context.construct<BinaryOperator>(scaled_a, scaled_b, BinaryOperator::BinaryOps::Add);
				push_instruction(inst);
				return inst;
			}
		}
	}

	auto *inst = context.construct<BinaryOperator>(get_constant_uint(scale), value, BinaryOperator::BinaryOps::Mul);
	push_instruction(inst);
	return inst;
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

static StructType *get_sparse_feedback_variant(Type *type)
{
	auto *scalar_type = get_scalar_type(type->getStructElementType(1));
	return StructType::get(
		type->getContext(),
		{ scalar_type, scalar_type, scalar_type, scalar_type, Type::getInt32Ty(type->getContext()) });
}

static Type *get_composite_return_type(Type *type)
{
	if (isa<StructType>(type))
		return get_sparse_feedback_variant(type);
	else
		return get_vec4_variant(type);
}

Instruction *ParseContext::build_extract_composite(const ir::Op &op, Value *value, unsigned num_elements)
{
	if (!num_elements)
		num_elements = op.getType().getBaseType(0).getVectorSize();

	if (num_elements == 1)
		return context.construct<ExtractValueInst>(get_scalar_type(value->getType()), value, Vector<unsigned>{ 0 });

	Value *values[4];
	for (unsigned c = 0; c < num_elements; c++)
		values[c] = get_extracted_composite_component(value, c);

	assert(num_elements > 1);
	auto *result_type = VectorType::get(num_elements, get_scalar_type(value->getType()));
	auto *comp = context.construct<CompositeConstructInst>(
		result_type, Vector<Value *> { values, values + num_elements });
	return comp;
}

bool ParseContext::build_buffer_load_return_composite(const ir::Op &op, Value *value)
{
	if (op.getType().isStructType())
	{
		// Sparse feedback.
		auto *code = get_extracted_composite_component(value, 4);
		auto *sampled_value = build_extract_composite(op, value, op.getType().getBaseType(1).getVectorSize());
		push_instruction(sampled_value);
		auto *inst = context.construct<CompositeConstructInst>(convert_type(op.getType()), Vector<Value *>{ code, sampled_value });
		push_instruction(inst, op.getDef());
		return true;
	}
	else
	{
		unsigned num_elements = op.getType().getBaseType(0).getVectorSize();
		if (num_elements != 1)
			push_instruction(build_extract_composite(op, value, num_elements), op.getDef());
		else
			value_map[op.getDef()] = get_extracted_composite_component(value, 0);
	}

	return true;
}

bool ParseContext::build_buffer_load(const ir::Op &op, DXIL::ResourceKind kind)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto *int_type = Type::getInt32Ty(context);

	auto *addr_value = get_value(op.getOperand(1));

	Value *first;
	Value *second;

	if (kind == DXIL::ResourceKind::StructuredBuffer)
	{
		first = get_extracted_composite_component(addr_value, 0);
		second = get_extracted_composite_component(addr_value, 1);
		second = get_constant_mul(second, 4);
	}
	else
	{
		first = addr_value;
		if (kind == DXIL::ResourceKind::RawBuffer)
			first = get_constant_mul(first, 4);
		second = UndefValue::get(int_type);
	}

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = get_composite_return_type(result_type);

	auto *inst = build_dxil_call(
		DXIL::Op::BufferLoad, dxil_result_type, dxil_result_type,
		get_value(descriptor), first, second);
	push_instruction(inst);
	return build_buffer_load_return_composite(op, inst);
}

bool ParseContext::build_buffer_load_cbv(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));
	auto addr = ir::SsaDef(op.getOperand(1));
	Instruction *inst = nullptr;

	if (op.getType().isScalarType())
	{
		if (op.getType().byteSize() != 4)
		{
			LOGE("Only support 4 byte scalar CBV loads.\n");
			return false;
		}

		auto *result_type = convert_type(op.getType());

		auto *addr_value = get_value(addr);
		if (!llvm::isa<llvm::VectorType>(addr_value->getType()))
		{
			LOGE("Expected a vector type addr for vectors.\n");
			return false;
		}

		auto *index16 = get_extracted_composite_component(addr_value, 0);
		auto *index4 = get_extracted_composite_component(addr_value, 1);

		auto *mul16 = get_constant_mul(index16, 16);
		auto *mul4 = get_constant_mul(index4, 4);

		Value *byte_addr;

		if (isa<ConstantInt>(mul16) && isa<ConstantInt>(mul4))
		{
			byte_addr = get_constant_uint(cast<ConstantInt>(mul16)->getUniqueInteger().getZExtValue() +
			                              cast<ConstantInt>(mul4)->getUniqueInteger().getZExtValue());
		}
		else
		{
			auto *byte_addr_inst = context.construct<BinaryOperator>(mul16, mul4, llvm::BinaryOperator::BinaryOps::Add);
			push_instruction(byte_addr_inst);
			byte_addr = byte_addr_inst;
		}

		inst = build_dxil_call(DXIL::Op::CBufferLoad, result_type, result_type,
		                       get_value(descriptor),
		                       byte_addr);
	}
	else if (op.getType().isVectorType())
	{
		if (op.getType().getBaseType(0).getVectorSize() != 4 || op.getType().byteSize() != 16)
		{
			LOGE("We can only support vec4 or scalar loads from CBV.\n");
			return false;
		}

		auto *result_type = convert_type(op.getType());
		auto *addr_value = get_value(addr);

		inst = build_dxil_call(DXIL::Op::CBufferLoadLegacy, result_type, result_type,
		                       get_value(descriptor),
		                       addr_value);
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

bool ParseContext::build_image_store(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto layer = ir::SsaDef(op.getOperand(1));
	auto coord = ir::SsaDef(op.getOperand(2));
	auto value = ir::SsaDef(op.getOperand(3));

	Value *coords[3] = {};
	Value *values[4] = {};

	unsigned num_coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();
	unsigned num_value_components = builder.getOp(value).getType().getBaseType(0).getVectorSize();

	auto *scalar_type = get_scalar_type(get_value(value)->getType());
	auto *coord_value = get_value(coord);

	for (unsigned c = 0; c < num_coord_components; c++)
		coords[c] = get_extracted_composite_component(coord_value, c);
	for (unsigned c = num_coord_components; c < 3; c++)
		coords[c] = UndefValue::get(Type::getInt32Ty(context));

	switch (itr->second.resource_kind)
	{
	case DXIL::ResourceKind::Texture1DArray:
	case DXIL::ResourceKind::Texture2DArray:
		coords[num_coord_components] = get_value(layer);
		break;

	default:
		break;
	}

	for (unsigned c = 0; c < num_value_components; c++)
		values[c] = get_extracted_composite_component(get_value(value), c);
	for (unsigned c = num_value_components; c < 4; c++)
		values[c] = UndefValue::get(scalar_type);

	unsigned mask = (1u << num_value_components) - 1u;

	auto *inst = build_dxil_call(DXIL::Op::TextureStore, Type::getVoidTy(context),
	                             scalar_type,
	                             get_value(descriptor),
	                             coords[0], coords[1], coords[2],
	                             values[0], values[1], values[2], values[3],
	                             get_constant_uint(mask));

	push_instruction(inst);
	return true;
}

bool ParseContext::build_image_atomic(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto layer = ir::SsaDef(op.getOperand(1));
	auto coord = ir::SsaDef(op.getOperand(2));
	auto atomic_op = ir::AtomicOp(op.getOperand(op.getFirstLiteralOperandIndex()));

	Value *coords[3] = {};

	unsigned num_coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();

	auto *int_type = Type::getInt32Ty(context);

	for (unsigned c = 0; c < num_coord_components; c++)
		coords[c] = get_extracted_composite_component(get_value(coord), c);
	for (unsigned c = num_coord_components; c < 3; c++)
		coords[c] = UndefValue::get(Type::getInt32Ty(context));

	switch (itr->second.resource_kind)
	{
	case DXIL::ResourceKind::Texture1DArray:
	case DXIL::ResourceKind::Texture2DArray:
		coords[num_coord_components] = get_value(layer);
		break;

	default:
		break;
	}

	if (atomic_op == ir::AtomicOp::eCompareExchange)
	{
		auto *inst = build_dxil_call(
		    DXIL::Op::AtomicCompareExchange,
		    int_type, int_type,
		    get_value(descriptor),
		    coords[0], coords[1], coords[2],
		    get_extracted_composite_component(get_value(op.getOperand(3)), 0),
		    get_extracted_composite_component(get_value(op.getOperand(3)), 1));

		push_instruction(inst, op.getDef());
		return true;
	}

	auto binop = convert_atomic_binop(atomic_op);

	auto *return_type = convert_type(op.getType());
	Value *value;

	if (binop == DXIL::AtomicBinOp::Load)
	{
		value = UndefValue::get(int_type);
	}
	else if (atomic_op == ir::AtomicOp::eInc || atomic_op == ir::AtomicOp::eDec)
	{
		value = get_constant_uint(1);
	}
	else
	{
		value = get_value(op.getOperand(3));
		if (binop != DXIL::AtomicBinOp::Store && op.getType().isVoidType())
			return_type = int_type;
	}

	auto *inst = build_dxil_call(
		DXIL::Op::AtomicBinOp,
		return_type, return_type,
		get_value(descriptor), get_constant_uint(uint32_t(binop)),
		coords[0], coords[1], coords[2],
		value);

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_image_load(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto kind = itr->second.resource_kind;
	auto *int_type = Type::getInt32Ty(context);

	auto mip = ir::SsaDef(op.getOperand(1));
	auto layer = ir::SsaDef(op.getOperand(2));
	auto coord = ir::SsaDef(op.getOperand(3));
	auto sample = ir::SsaDef(op.getOperand(4));
	auto offset = ir::SsaDef(op.getOperand(5));

	Value *mip_or_sample = nullptr;
	Value *offsets[3] = {};
	Value *coords[3] = {};

	if (kind == DXIL::ResourceKind::TextureCube || kind == DXIL::ResourceKind::TextureCubeArray)
	{
		LOGE("Cubes not allowed for loads.\n");
		return false;
	}

	if (kind == DXIL::ResourceKind::Texture2DMS || kind == DXIL::ResourceKind::Texture2DMSArray)
		mip_or_sample = get_value(sample);
	else if (itr->second.resource_type == DXIL::ResourceType::SRV)
		mip_or_sample = get_value(mip);

	unsigned coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();

	for (unsigned c = 0; c < coord_components; c++)
	{
		coords[c] = get_extracted_composite_component(get_value(coord), c);
		if (offset)
			offsets[c] = get_extracted_composite_component(get_value(offset), c);
	}

	if (kind == DXIL::ResourceKind::Texture1DArray ||
	    kind == DXIL::ResourceKind::Texture2DArray ||
	    kind == DXIL::ResourceKind::Texture2DMSArray)
	{
		coords[coord_components] = get_value(layer);
	}

	if (!mip_or_sample)
		mip_or_sample = UndefValue::get(int_type);

	for (auto &off : offsets)
		if (!off)
			off = UndefValue::get(int_type);

	for (auto &c : coords)
		if (!c)
			c = UndefValue::get(int_type);

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = get_composite_return_type(result_type);

	auto *inst = build_dxil_call(
		DXIL::Op::TextureLoad, dxil_result_type, dxil_result_type,
		get_value(descriptor), mip_or_sample,
		coords[0], coords[1], coords[2],
		offsets[0], offsets[1], offsets[2]);
	push_instruction(inst);
	return build_buffer_load_return_composite(op, inst);
}

bool ParseContext::build_image_query_size(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = VectorType::get(4, Type::getInt32Ty(context));
	auto kind = itr->second.resource_kind;

	auto *inst = build_dxil_call(
		DXIL::Op::GetDimensions, dxil_result_type, dxil_result_type,
		get_value(descriptor),
		op.getOperand(1) ? get_value(op.getOperand(1)) : UndefValue::get(Type::getInt32Ty(context)));
	push_instruction(inst);

	unsigned num_dimensions = op.getType().getSubType(0).getBaseType(0).getVectorSize();

	auto *dims = build_extract_composite(op, inst, num_dimensions);
	push_instruction(dims);

	Value *layers;

	if (kind == DXIL::ResourceKind::Texture1DArray || kind == DXIL::ResourceKind::Texture2DArray ||
	    kind == DXIL::ResourceKind::Texture2DMSArray || kind == DXIL::ResourceKind::TextureCubeArray)
	{
		layers = get_extracted_composite_component(inst, num_dimensions);
	}
	else
	{
		layers = get_constant_uint(1);
	}

	inst = context.construct<CompositeConstructInst>(result_type, Vector<Value *>{ dims, layers });
	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_image_query_mips_samples(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto *dxil_result_type = VectorType::get(4, Type::getInt32Ty(context));

	auto *inst = build_dxil_call(
	    DXIL::Op::GetDimensions, dxil_result_type, dxil_result_type,
	    get_value(descriptor), get_constant_uint(0));
	push_instruction(inst);

	// Mips are encoded in the last structure element, for reasons.
	auto *value = get_extracted_composite_component(inst, 3);
	value_map[op.getDef()] = value;
	return true;
}

bool ParseContext::build_image_sample(const ir::Op &op)
{
	auto image_desc = ir::SsaDef(op.getOperand(0));
	auto &resource_op = builder.getOp(image_desc);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto layer = ir::SsaDef(op.getOperand(2));
	auto coord = ir::SsaDef(op.getOperand(3));
	auto offset = ir::SsaDef(op.getOperand(4));
	auto lod_index = ir::SsaDef(op.getOperand(5));
	auto lod_bias = ir::SsaDef(op.getOperand(6));
	auto lod_clamp = ir::SsaDef(op.getOperand(7));
	auto dx = ir::SsaDef(op.getOperand(8));
	auto dy = ir::SsaDef(op.getOperand(9));
	auto dref = ir::SsaDef(op.getOperand(10));

	auto opcode = DXIL::Op::Sample;
	if (lod_index)
		opcode = DXIL::Op::SampleLevel;
	else if (lod_bias)
		opcode = DXIL::Op::SampleBias;
	else if (dx && dy)
		opcode = DXIL::Op::SampleGrad;

	if (op.getType().isScalarType())
	{
		switch (opcode)
		{
		case DXIL::Op::Sample: opcode = DXIL::Op::SampleCmp; break;
		case DXIL::Op::SampleLevel: opcode = DXIL::Op::SampleCmpLevel; break;
		case DXIL::Op::SampleBias: opcode = DXIL::Op::SampleCmpBias; break;
		case DXIL::Op::SampleGrad: opcode = DXIL::Op::SampleCmpGrad; break;
		default: return false;
		}
	}

	unsigned num_coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();

	Value *coords[4] = {};
	Value *offsets[3] = {};
	Value *ddx[3] = {};
	Value *ddy[3] = {};

	for (unsigned c = 0; c < num_coord_components; c++)
	{
		coords[c] = get_extracted_composite_component(get_value(coord), c);
		if (offset)
			offsets[c] = get_extracted_composite_component(get_value(offset), c);
		if (dx)
			ddx[c] = get_extracted_composite_component(get_value(dx), c);
		if (dy)
			ddy[c] = get_extracted_composite_component(get_value(dy), c);
	}

	switch (itr->second.resource_kind)
	{
	case DXIL::ResourceKind::Texture1DArray:
	case DXIL::ResourceKind::Texture2DArray:
	case DXIL::ResourceKind::TextureCubeArray:
		coords[num_coord_components] = get_value(layer);
		break;

	default:
		break;
	}

	Vector<Value *> values;
	values.push_back(get_value(image_desc));
	values.push_back(get_value(op.getOperand(1))); // sampler
	for (auto *c : coords)
		values.push_back(c ? c : UndefValue::get(Type::getFloatTy(context)));
	for (auto *o : offsets)
		values.push_back(o ? o : UndefValue::get(Type::getInt32Ty(context)));

	if (op.getType().isScalarType())
		values.push_back(get_value(dref));

	if (opcode == DXIL::Op::SampleGrad || opcode == DXIL::Op::SampleCmpGrad)
	{
		for (auto *d : ddx)
			values.push_back(d ? d : UndefValue::get(Type::getFloatTy(context)));
		for (auto *d : ddy)
			values.push_back(d ? d : UndefValue::get(Type::getFloatTy(context)));
	}

	if (opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleCmpBias)
		values.push_back(get_value(lod_bias));

	if (opcode != DXIL::Op::SampleLevel && opcode != DXIL::Op::SampleCmpLevel)
		values.push_back(lod_clamp ? get_value(lod_clamp) : UndefValue::get(Type::getFloatTy(context)));
	else if (lod_index)
		values.push_back(get_value(lod_index));

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = get_composite_return_type(result_type);
	auto *inst = build_dxil_call(opcode, dxil_result_type, dxil_result_type, std::move(values));
	push_instruction(inst);
	return build_buffer_load_return_composite(op, inst);
}

bool ParseContext::build_image_gather(const ir::Op &op)
{
	auto image_desc = ir::SsaDef(op.getOperand(0));
	auto &resource_op = builder.getOp(image_desc);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto layer = ir::SsaDef(op.getOperand(2));
	auto coord = ir::SsaDef(op.getOperand(3));
	auto offset = ir::SsaDef(op.getOperand(4));
	auto dref = ir::SsaDef(op.getOperand(5));
	auto comp = uint32_t(op.getOperand(6));

	auto opcode = dref ? DXIL::Op::TextureGatherCmp : DXIL::Op::TextureGather;
	unsigned num_coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();

	Value *coords[4] = {};
	Value *offsets[2] = {};

	for (unsigned c = 0; c < num_coord_components; c++)
	{
		coords[c] = get_extracted_composite_component(get_value(coord), c);
		if (offset)
			offsets[c] = get_extracted_composite_component(get_value(offset), c);
	}

	switch (itr->second.resource_kind)
	{
	case DXIL::ResourceKind::Texture2DArray:
	case DXIL::ResourceKind::TextureCubeArray:
		coords[num_coord_components] = get_value(layer);
		break;

	default:
		break;
	}

	Vector<Value *> values;
	values.push_back(get_value(image_desc));
	values.push_back(get_value(op.getOperand(1))); // sampler
	for (auto *c : coords)
		values.push_back(c ? c : UndefValue::get(Type::getFloatTy(context)));
	for (auto *o : offsets)
		values.push_back(o ? o : UndefValue::get(Type::getInt32Ty(context)));
	values.push_back(get_constant_uint(comp));
	if (dref)
		values.push_back(get_value(dref));

	auto *result_type = convert_type(op.getType());
	auto *dxil_result_type = get_composite_return_type(result_type);
	auto *inst = build_dxil_call(opcode, dxil_result_type, dxil_result_type, std::move(values));
	push_instruction(inst);
	return build_buffer_load_return_composite(op, inst);
}

bool ParseContext::build_image_compute_lod(const ir::Op &op)
{
	auto image_desc = ir::SsaDef(op.getOperand(0));
	auto &resource_op = builder.getOp(image_desc);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto coord = ir::SsaDef(op.getOperand(2));
	unsigned num_coord_components = builder.getOp(coord).getType().getBaseType(0).getVectorSize();

	Value *coords[3] = {};
	for (unsigned c = 0; c < num_coord_components; c++)
		coords[c] = get_extracted_composite_component(get_value(coord), c);
	for (unsigned c = num_coord_components; c < 3; c++)
		coords[c] = UndefValue::get(Type::getFloatTy(context));

	// Alternate extended formulation since DXIL is weird.
	auto *inst = build_dxil_call(DXIL::Op::ExtendedCalculateLOD, convert_type(op.getType()), nullptr,
	                             get_value(image_desc), get_value(op.getOperand(1)),
	                             coords[0], coords[1], coords[2]);
	push_instruction(inst, op.getDef());
	return true;
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
		first = get_extracted_composite_component(addr_value, 0);
		second = get_extracted_composite_component(addr_value, 1);
		second = get_constant_mul(second, 4);
	}
	else
	{
		first = addr_value;
		if (kind == DXIL::ResourceKind::RawBuffer)
			first = get_constant_mul(first, 4);
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
		scalar_values[c] = get_extracted_composite_component(value, c);
	for (unsigned c = num_components; c < 4; c++)
		scalar_values[c] = UndefValue::get(scalar_type);

	auto *inst = build_dxil_call(DXIL::Op::BufferStore, Type::getVoidTy(context), scalar_type,
	                             get_value(descriptor),
	                             first, second,
	                             scalar_values[0], scalar_values[1], scalar_values[2], scalar_values[3],
	                             get_constant_uint(mask));

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
		first = get_extracted_composite_component(addr_value, 0);
		second = get_extracted_composite_component(addr_value, 1);
		second = get_constant_mul(second, 4);
	}
	else
	{
		first = addr_value;
		if (kind == DXIL::ResourceKind::RawBuffer)
			first = get_constant_mul(first, 4);
		second = UndefValue::get(int_type);
	}

	auto atomic_op = ir::AtomicOp(op.getOperand(op.getFirstLiteralOperandIndex()));

	Value *value;
	auto *return_type = convert_type(op.getType());

	if (atomic_op == ir::AtomicOp::eCompareExchange)
	{
		auto *inst = build_dxil_call(
		    DXIL::Op::AtomicCompareExchange,
		    int_type, int_type,
		    get_value(descriptor),
		    first, second, UndefValue::get(int_type),
		    get_extracted_composite_component(get_value(op.getOperand(2)), 0),
		    get_extracted_composite_component(get_value(op.getOperand(2)), 1));

		push_instruction(inst, op.getDef());
		return true;
	}

	auto binop = convert_atomic_binop(atomic_op);

	if (binop == DXIL::AtomicBinOp::Load)
	{
		value = UndefValue::get(int_type);
	}
	else if (atomic_op == ir::AtomicOp::eInc || atomic_op == ir::AtomicOp::eDec)
	{
		value = get_constant_uint(1);
	}
	else
	{
		value = get_value(op.getOperand(2));
		if (binop != DXIL::AtomicBinOp::Store && op.getType().isVoidType())
			return_type = int_type;
	}

	auto *inst = build_dxil_call(
		DXIL::Op::AtomicBinOp, return_type, return_type,
		get_value(descriptor),
		get_constant_uint(uint32_t(binop)),
		first, second, UndefValue::get(int_type),
		value);

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_lds_atomic(const ir::Op &op)
{
	auto *lds = get_value(op.getOperand(0));
	Vector<Value *> args;
	args.push_back(lds);
	args.push_back(get_constant_uint(0));

	if (op.getOperand(1))
	{
		auto &addr = builder.getOp(ir::SsaDef(op.getOperand(1)));
		auto *addr_value = get_value(op.getOperand(1));
		for (uint32_t i = 0; i < addr.getType().getBaseType(0).getVectorSize(); i++)
			args.push_back(get_extracted_composite_component(addr_value, i));
	}

	Type *type;
	if (!op.getType().isVoidType())
		type = convert_type(op.getType());
	else
		type = convert_type(builder.getOp(ir::SsaDef(op.getOperand(2))).getType());

	auto *gep = context.construct<GetElementPtrInst>(
		PointerType::get(type, uint32_t(DXIL::AddressSpace::GroupShared)), std::move(args), true);
	push_instruction(gep);

	auto *value = get_value(op.getOperand(2));
	auto atomic_op = ir::AtomicOp(op.getOperand(3));

	if (atomic_op == ir::AtomicOp::eCompareExchange)
	{
		auto *inst = context.construct<AtomicCmpXchgInst>(
			gep,
			get_extracted_composite_component(value, 0),
			get_extracted_composite_component(value, 1));
		push_instruction(inst, op.getDef());
	}
	else
	{
		if (atomic_op == ir::AtomicOp::eInc || atomic_op == ir::AtomicOp::eDec)
			value = get_constant_uint(1);
		else if (atomic_op == ir::AtomicOp::eLoad)
			value = get_constant_uint(0);

		assert(value);

		auto *inst = context.construct<AtomicRMWInst>(
		    type, gep, value, convert_atomic_binop_llvm(atomic_op));
		push_instruction(inst, op.getDef());
	}

	return true;
}

bool ParseContext::build_buffer_atomic(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	return build_buffer_atomic_binop(op, itr->second.resource_kind);
}

bool ParseContext::build_counter_atomic(const ir::Op &op)
{
	auto &load_desc_op = builder.getOp(ir::SsaDef(op.getOperand(0)));
	auto counter_descriptor = ir::SsaDef(load_desc_op.getOperand(0));
	auto *int_type = Type::getInt32Ty(context);

	auto &counter_resource_op = builder.getOp(counter_descriptor);
	auto descriptor = ir::SsaDef(counter_resource_op.getOperand(1));
	auto itr = resource_map.find(descriptor);
	if (itr == resource_map.end())
		return false;

	auto *inst = build_dxil_call(
	        DXIL::Op::BufferUpdateCounter, int_type, int_type,
	        get_value(load_desc_op.getDef()),
	        get_constant_uint(ir::AtomicOp(op.getOperand(1)) == ir::AtomicOp::eInc ? 1 : -1));

	push_instruction(inst, op.getDef());
	return true;
}

bool ParseContext::build_buffer_query_size(const ir::Op &op)
{
	auto descriptor = ir::SsaDef(op.getOperand(0));

	auto &resource_op = builder.getOp(descriptor);
	auto itr = resource_map.find(ir::SsaDef(resource_op.getOperand(0)));
	if (itr == resource_map.end())
		return false;

	auto *result_type = convert_type(op.getType());
	auto *vec4_type = get_vec4_variant(result_type);

	// Fold in the mul + div into a plain OpArrayLength.
	auto *inst = build_dxil_call(
		DXIL::Op::ExtendedGetDimensions, vec4_type, nullptr,
		get_value(descriptor),
		UndefValue::get(Type::getInt32Ty(context)),
	    get_constant_uint(itr->second.resource_kind == DXIL::ResourceKind::RawBuffer ? 4 : 1));

	push_instruction(inst);

	auto *value = get_extracted_composite_component(inst, 0);
	value_map[op.getDef()] = value;

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
	auto *bool_type = Type::getInt1Ty(context);

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

	return build_dxil_call(DXIL::Op::CreateHandle, ptr_type, nullptr,
	                       get_constant_uint(uint32_t(itr->second.resource_type)),
	                       get_constant_uint(itr->second.index),
	                       binding_offset,
	                       ConstantInt::get(bool_type, nonuniform));
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
			// For user-IO the general rule is that if it's an array it's a control point of some kind.
			// Multiple rows for stage IO is not used except for certain builtins.
			if (io_decl_is_patch(shader_stage, op))
				io_patch.push_back({ &op });
			else
				io_inputs.push_back({ &op });
			break;

		case ir::OpCode::eDclOutput:
		case ir::OpCode::eDclOutputBuiltIn:
			// For user-IO the general rule is that if it's an array it's a control point of some kind.
			// Multiple rows for stage IO is not used except for certain builtins.
			if (io_decl_is_patch(shader_stage, op))
				io_patch.push_back({ &op });
			else
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
			uint32_t stream = UINT32_MAX;

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
				if (!is_input && io.op->getOperandCount() == 4)
					stream = uint32_t(io.op->getOperand(3));
			}
			else
			{
				builtin = convert_semantic(ir::BuiltIn(io.op->getOperand(1)));
				location = UINT32_MAX;
				component = UINT32_MAX;

				if (!is_input && io.op->getOperandCount() == 3)
					stream = uint32_t(io.op->getOperand(2));

				if (builtin == DXIL::Semantic::Depth)
				{
					for_all_opcodes(builder, ir::OpCode::eSetPsDepthLessEqual,
					                [&](const ir::Op &op) { builtin = DXIL::Semantic::DepthLessEqual; return false; });
					for_all_opcodes(builder, ir::OpCode::eSetPsDepthGreaterEqual,
					                [&](const ir::Op &op) { builtin = DXIL::Semantic::DepthGreaterEqual; return false; });
				}

				if (io.op->getOpCode() == ir::OpCode::eDclInputBuiltIn)
				{
					// Some stage IO builtins are resolved through opcodes, not IO.
					auto op = convert_builtin_opcode(ir::BuiltIn(io.op->getOperand(1)));

					if (builtin == DXIL::Semantic::Coverage)
						op = DXIL::Op::Coverage;

					if (op != DXIL::Op::Count)
					{
						stage_io_map[io.op->getDef()] = { UINT32_MAX, op, false };
						continue;
					}
				}
			}

			auto interpolation = DXIL::InterpolationMode::Invalid;
			if (is_input)
				interpolation = convert_interpolation_mode(ir::InterpolationMode(io.op->getOperand(is_user ? 3 : 2)));

			bool is_geom = shader_stage == ir::ShaderStage::eGeometry;
			bool is_tess = shader_stage == ir::ShaderStage::eHull || shader_stage == ir::ShaderStage::eDomain;
			bool is_geom_tess_input = is_input && (is_geom || is_tess);
			bool is_hull_output = !is_input && shader_stage == ir::ShaderStage::eHull;

			// TessFactors is the exception since it's a patch array.
			bool need_axis = io.op->getType().isArrayType() &&
			                 (builtin != DXIL::Semantic::TessFactor && builtin != DXIL::Semantic::InsideTessFactor) &&
			                 (is_geom_tess_input || is_hull_output);

			auto comp = convert_component_mapping(io.op->getType(), need_axis);
			build_stage_io(*mapping.mapping, io.op->getDef(), String(io.semantic),
			               comp.type, builtin, io.index, interpolation,
			               comp.num_rows, comp.num_cols, location, component, stream, need_axis);
		}
	}

	return create_md_node(
		inputs.nodes.empty() ? create_null_meta() : create_md_node(inputs.nodes),
		outputs.nodes.empty() ? create_null_meta() : create_md_node(outputs.nodes),
		patches.nodes.empty() ? create_null_meta() : create_md_node(patches.nodes));
}

MDOperand *ParseContext::create_entry_point_meta(Function *patch_control_func)
{
	Vector<MDOperand *> flag_ops;

	uint64_t shader_flags = DXIL::ShaderFlagNativeLowPrecision;
	flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::ShaderFlags)));

	if (shader_stage == ir::ShaderStage::ePixel)
	{
		for_all_opcodes(builder, ir::OpCode::eSetPsEarlyFragmentTest, [&](const ir::Op &) {
			shader_flags |= DXIL::ShaderFlagEarlyDepthStencil;
			return false;
		});
	}

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
			return nullptr;
		}

		flag_ops.push_back(create_md_node(
		    create_constant_uint_meta(uint32_t(threads->getOperand(1))),
		    create_constant_uint_meta(uint32_t(threads->getOperand(2))),
		    create_constant_uint_meta(uint32_t(threads->getOperand(3)))));
	}
	else if (shader_stage == ir::ShaderStage::eGeometry)
	{
		flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::GSState)));

		ir::PrimitiveType input_primitive = {};
		ir::PrimitiveType output_primitive = {};
		uint32_t stream_mask = 0;
		uint32_t instances = 0;
		uint32_t output_vertices = 0;

		for (auto &op : builder)
		{
			switch (op.getOpCode())
			{
			case ir::OpCode::eSetGsInstances:
				instances = uint32_t(op.getOperand(1));
				break;

			case ir::OpCode::eSetGsOutputVertices:
				output_vertices = uint32_t(op.getOperand(1));
				break;

			case ir::OpCode::eSetGsInputPrimitive:
				input_primitive = ir::PrimitiveType(op.getOperand(1));
				break;

			case ir::OpCode::eSetGsOutputPrimitive:
				output_primitive = ir::PrimitiveType(op.getOperand(1));
				stream_mask = uint32_t(op.getOperand(2));
				break;

			default:
				break;
			}
		}

		flag_ops.push_back(create_md_node(
		    create_constant_uint_meta(uint32_t(convert_input_primitive_type(input_primitive))),
		    create_constant_uint_meta(output_vertices),
		    create_constant_uint_meta(stream_mask),
		    create_constant_uint_meta(uint32_t(convert_output_primitive_type(output_primitive))),
		    create_constant_uint_meta(instances)));
	}
	else if (shader_stage == ir::ShaderStage::eHull)
	{
		ir::PrimitiveType prim = {};
		ir::PrimitiveType domain = {};
		ir::TessWindingOrder winding = {};
		ir::TessPartitioning partitioning = {};
		uint32_t input_control_points = 0;
		uint32_t output_control_points = 0;

		for (auto &op : builder)
		{
			switch (op.getOpCode())
			{
			case ir::OpCode::eSetTessControlPoints:
				input_control_points = uint32_t(op.getOperand(1));
				output_control_points = uint32_t(op.getOperand(2));
				break;

			case ir::OpCode::eSetTessPrimitive:
				prim = ir::PrimitiveType(op.getOperand(1));
				winding = ir::TessWindingOrder(op.getOperand(2));
				partitioning = ir::TessPartitioning(op.getOperand(3));
				break;

			case ir::OpCode::eSetTessDomain:
				domain = ir::PrimitiveType(op.getOperand(1));
				break;

			default:
				break;
			}
		}

		flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::HSState)));
		flag_ops.push_back(create_md_node(
		    patch_control_func ? create_constant_meta(patch_control_func) : create_null_meta(),
		    create_constant_uint_meta(input_control_points),
		    create_constant_uint_meta(output_control_points),
		    create_constant_uint_meta(uint32_t(convert_hull_domain(domain))),
		    create_constant_uint_meta(uint32_t(convert_hull_partitioning(partitioning))),
		    create_constant_uint_meta(uint32_t(convert_hull_output_primitive(prim, winding)))));
	}
	else if (shader_stage == ir::ShaderStage::eDomain)
	{
		ir::PrimitiveType domain = {};
		for_all_opcodes(builder, ir::OpCode::eSetTessDomain, [&](const ir::Op &op) {
			domain = ir::PrimitiveType(op.getOperand(1));
			return false;
		});
		flag_ops.push_back(create_constant_uint_meta(uint32_t(DXIL::ShaderPropertyTag::DSState)));
		flag_ops.push_back(create_md_node(
		    create_constant_uint_meta(uint32_t(convert_hull_domain(domain))),
		    create_constant_uint_meta(32 /* somewhat irrelevant? */)));
	}

	return flag_ops.empty() ? create_null_meta() : create_md_node(std::move(flag_ops));
}

void ParseContext::set_function_attributes(Function *func)
{
	Vector<std::pair<String, String>> attrs;

	for_all_opcodes(builder, ir::OpCode::eSetFpMode, [&](const ir::Op &op) {
		auto round = ir::RoundMode(op.getOperand(1));
		auto denorm = ir::DenormMode(op.getOperand(2));

		const char *round_mode = nullptr;
		const char *denorm_mode = nullptr;

		switch (op.getType().getBaseType(0).getBaseType())
		{
		case ir::ScalarType::eF16:
			round_mode = "fp16-round-mode";
			denorm_mode = "fp16-denorm-mode";
			break;

		case ir::ScalarType::eF32:
			round_mode = "fp32-round-mode";
			denorm_mode = "fp32-denorm-mode";
			break;

		case ir::ScalarType::eF64:
			round_mode = "fp64-round-mode";
			denorm_mode = "fp64-denorm-mode";
			break;

		default:
			break;
		}

		if (round == ir::RoundMode::eZero)
			attrs.emplace_back(round_mode, "rtz");
		else if (round == ir::RoundMode::eNearestEven)
			attrs.emplace_back(round_mode, "rte");

		if (denorm == ir::DenormMode::eFlush)
			attrs.emplace_back(denorm_mode, "ftz");
		else if (denorm == ir::DenormMode::ePreserve)
			attrs.emplace_back(denorm_mode, "preserve");

		global_fp_flags |= op.getFlags();
		return true;
	});

	func->set_attributes(std::move(attrs));
}

bool ParseContext::emit_entry_point()
{
	const ir::Op *entry = nullptr;
	for_all_opcodes(builder, ir::OpCode::eEntryPoint, [&](const ir::Op &op) { entry = &op; return false; });
	if (!entry)
		return false;

	shader_stage = ir::ShaderStage(entry->getOperand(entry->getFirstLiteralOperandIndex()));

	Function *patch_control_func = nullptr;

	// Process patch constant func first so we can emit metadata.
	for (uint32_t i_plus1 = entry->getFirstLiteralOperandIndex(); i_plus1; i_plus1--)
	{
		auto i = i_plus1 - 1;
		auto ssa = ir::SsaDef(entry->getOperand(i));

		Type *type = convert_type(entry->getType());

		// Entry points don't take arguments.
		auto *func_type = context.construct<FunctionType>(context, type, Vector<Type *>{});
		auto *func = context.construct<Function>(func_type, ++tween_id, module);
		module.add_value_name(tween_id, i == 0 ? "main" : "patchMain");

		if (i == 1)
			patch_control_func = func;

		// We're not barbarians.
		func->set_structured_control_flow();

		function_map[ssa] = func;

		if (i == 0)
		{
			create_named_md_node("dx.entryPoints",
			                     create_md_node(create_constant_meta(func), create_string_meta("main"),
			                                    create_stage_io_meta(), create_null_meta(),
			                                    create_entry_point_meta(patch_control_func)));

			set_function_attributes(func);
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
    uint32_t start_row, uint32_t start_col, uint32_t stream, bool need_axis)
{
	uint32_t ret = mapping.nodes.size();

	stage_io_map[ssa] = { ret, DXIL::Op::Count, need_axis };

	MDOperand *stream_meta;

	if (stream != UINT32_MAX)
	{
		stream_meta = create_md_node(
			create_constant_uint_meta(uint32_t(DXIL::GSStageOutTags::Stream)),
			create_constant_uint_meta(stream));
	}
	else
		stream_meta = create_null_meta();

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
	    stream_meta);

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
		{
			uint32_t space = uint32_t(op.getOperand(1));
			uint32_t binding = uint32_t(op.getOperand(2));
			uint32_t count = uint32_t(op.getOperand(3));
			if (!count)
				count = UINT32_MAX;

			uint32_t index = build_sampler(space, binding, count);
			resource_map[op.getDef()] = { DXIL::ResourceType::Sampler, DXIL::ResourceKind::Sampler, index, binding };
			break;
		}

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
				auto mapping = convert_component_mapping(op.getType(), false);

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
		case ir::OpCode::eDebugMemberName:
			break;

		case ir::OpCode::eDclSpecConstant:
		case ir::OpCode::eDclPushData:
		case ir::OpCode::eDclTmp:
		case ir::OpCode::eScopedIf:
		case ir::OpCode::eScopedElse:
		case ir::OpCode::eScopedEndIf:
		case ir::OpCode::eScopedLoop:
		case ir::OpCode::eScopedLoopBreak:
		case ir::OpCode::eScopedLoopContinue:
		case ir::OpCode::eScopedEndLoop:
		case ir::OpCode::eScopedSwitch:
		case ir::OpCode::eScopedSwitchCase:
		case ir::OpCode::eScopedSwitchDefault:
		case ir::OpCode::eScopedSwitchBreak:
		case ir::OpCode::eScopedEndSwitch:
		case ir::OpCode::eConsumeAs:
		case ir::OpCode::eTmpLoad:
		case ir::OpCode::eTmpStore:
		case ir::OpCode::ePushDataLoad:
		case ir::OpCode::eMemoryLoad:
		case ir::OpCode::eMemoryStore:
		case ir::OpCode::eMemoryAtomic:
		case ir::OpCode::ePointer:
		case ir::OpCode::eFMulLegacy:
		case ir::OpCode::eFMadLegacy:
		case ir::OpCode::eFDot:
		case ir::OpCode::eFDotLegacy:
		case ir::OpCode::eUMSad:
		case ir::OpCode::eDrain:
			LOGE("Opcode %u should not appear in final IR at this point.\n", unsigned(op.getOpCode()));
			return false;

		case ir::OpCode::eDclXfb:
		case ir::OpCode::eRovScopedLockBegin:
		case ir::OpCode::eRovScopedLockEnd:
			// Should not appear, but we can just ignore it since it has no semantic impact at this stage.
			// ROV is done automatically by dxil-spirv path already, so ignore that here.
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
		case ir::OpCode::eSetPsDepthGreaterEqual:
		case ir::OpCode::eSetPsDepthLessEqual:
		case ir::OpCode::eSetGsInputPrimitive:
		case ir::OpCode::eSetGsOutputPrimitive:
		case ir::OpCode::eSetGsOutputVertices:
		case ir::OpCode::eSetGsInstances:
		case ir::OpCode::eSetTessControlPoints:
		case ir::OpCode::eSetTessDomain:
		case ir::OpCode::eSetTessPrimitive:
		case ir::OpCode::eSetFpMode:
		case ir::OpCode::eSetPsEarlyFragmentTest:
			break;

		case ir::OpCode::eConstant:
			if (!emit_constant(op))
				return false;
			break;

		case ir::OpCode::eUndef:
			value_map[op.getDef()] = UndefValue::get(convert_type(op.getType()));
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

				auto *func_type = context.construct<FunctionType>(context, type, types);
				func = context.construct<Function>(func_type, ++tween_id, module);

				for (unsigned i = 0; i < op.getOperandCount(); i++)
					func->add_argument(context.construct<Argument>(types[i], i));

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
			if (!func)
			{
				LOGE("Cannot end function without a function.\n");
				return false;
			}

			func->set_basic_blocks(std::move(bbs));
			module.add_function_implementation(func);
			bbs = {};
			break;

		case ir::OpCode::eParamLoad:
		{
			if (!func)
			{
				LOGE("Cannot get parameter without a function.\n");
				return false;
			}

			auto &func_op = builder.getOp(ir::SsaDef(op.getOperand(0)));
			auto param = ir::SsaDef(op.getOperand(1));

			auto arg_iter = func->arg_begin();
			for (uint32_t i = 0; i < func_op.getOperandCount(); i++, ++arg_iter)
				if (ir::SsaDef(func_op.getOperand(i)) == param)
					break;

			if (arg_iter == func->arg_end())
				return false;

			auto &arg = *arg_iter;
			value_map[op.getDef()] = const_cast<Argument *>(&arg);
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

		case ir::OpCode::ePhi:
		{
			// We might not have emitted all inputs yet. Defer that to a fixup pass later.
			auto *phi = context.construct<PHINode>(convert_type(op.getType()), op.getOperandCount() / 2);
			push_instruction(phi, op.getDef());
			break;
		}

		case ir::OpCode::eReturn:
			if (!current_bb)
				return false;

			if (op.getOperand(0))
				push_instruction(context.construct<ReturnInst>(get_value(op.getOperand(0))));
			else
				push_instruction(context.construct<ReturnInst>(nullptr));

			current_bb = nullptr;
			break;

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

		case ir::OpCode::eDclScratch:
		case ir::OpCode::eDclLds:
		{
			auto *type = convert_type(op.getType());

			auto *value = context.construct<GlobalVariable>(
				PointerType::get(type, uint32_t(
					op.getOpCode() == ir::OpCode::eDclLds ?
					DXIL::AddressSpace::GroupShared :
					DXIL::AddressSpace::Thread)),
				GlobalVariable::LinkageTypes::InternalLinkage, false);

			value_map[op.getDef()] = value;
			module.add_global_variable(value);
			break;
		}

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

	// Resolve PHI incoming values since we have value-defs for them now.
	for (auto &op : builder)
	{
		if (op.getOpCode() == ir::OpCode::ePhi)
		{
			auto *phi = cast<PHINode>(get_value(op.getDef()));
			for (uint32_t i = 0; i < op.getOperandCount(); i += 2)
				phi->add_incoming(get_value(op.getOperand(i + 1)), get_basic_block(ir::SsaDef(op.getOperand(i))));
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

Module *parseDXBCBinary(LLVMContext &context, const void* data, size_t size)
{
	ScopedLogger logger;

	dxbc::CompileOptions options;
	options.validateHash = false;

	options.convertOptions.includeDebugNames = false;

	options.arithmeticOptions.lowerDot = true;
	options.arithmeticOptions.lowerSinCos = false;
	options.arithmeticOptions.lowerMsad = true;
	options.arithmeticOptions.lowerF32toF16 = true;
	options.arithmeticOptions.lowerConvertFtoI = false;

	options.min16Options.enableFloat16 = true;
	options.min16Options.enableInt16 = true;

	options.resourceOptions.allowSubDwordScratchAndLds = false;
	options.resourceOptions.flattenLds = true;
	options.resourceOptions.flattenScratch = true;
	options.resourceOptions.structuredCbv = false;
	options.resourceOptions.structuredSrvUav = false;

	options.scalarizeOptions.subDwordVectors = true;

	auto builder = dxbc::compileShaderToLegalizedIr(data, size, options);

	if (!builder)
		return nullptr;

	return parseDXBCIR(context, *builder);
}

}
