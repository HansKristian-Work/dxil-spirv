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

#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool get_constant_operand(const llvm::Instruction *value, unsigned index, uint32_t *operand)
{
	if (index >= value->getNumOperands())
	{
		LOGE("Operand index out of range.\n");
		return false;
	}

	auto *constant = llvm::dyn_cast<llvm::ConstantInt>(value->getOperand(index));
	if (!constant)
		return false;

	*operand = uint32_t(constant->getUniqueInteger().getZExtValue());
	return true;
}

spv::Id emit_u32x2_u32_add(Converter::Impl &impl, spv::Id u32x2_value, spv::Id u32_value)
{
	auto &builder = impl.builder();
	spv::Id uint_type = builder.makeUintType(32);

	auto *base_addr_lo = impl.allocate(spv::OpCompositeExtract, uint_type);
	base_addr_lo->add_id(u32x2_value);
	base_addr_lo->add_literal(0);
	impl.add(base_addr_lo);

	auto *base_addr_hi = impl.allocate(spv::OpCompositeExtract, uint_type);
	base_addr_hi->add_id(u32x2_value);
	base_addr_hi->add_literal(1);
	impl.add(base_addr_hi);

	auto *add_op = impl.allocate(spv::OpIAddCarry, impl.get_struct_type({ uint_type, uint_type }, 0, "AddCarry"));
	add_op->add_ids({ base_addr_lo->id, u32_value });
	impl.add(add_op);

	auto *lo_op = impl.allocate(spv::OpCompositeExtract, uint_type);
	lo_op->add_id(add_op->id);
	lo_op->add_literal(0);
	impl.add(lo_op);

	auto *carry_op = impl.allocate(spv::OpCompositeExtract, uint_type);
	carry_op->add_id(add_op->id);
	carry_op->add_literal(1);
	impl.add(carry_op);

	auto *hi_op = impl.allocate(spv::OpIAdd, uint_type);
	hi_op->add_id(base_addr_hi->id);
	hi_op->add_id(carry_op->id);
	impl.add(hi_op);

	spv::Id addr_elems[2] = { lo_op->id, hi_op->id };
	spv::Id addr_vec = impl.build_vector(uint_type, addr_elems, 2);
	return addr_vec;
}

unsigned get_type_scalar_alignment(Converter::Impl &impl, const llvm::Type *type)
{
	unsigned scalar_alignment;
	switch (type->getTypeID())
	{
	case llvm::Type::TypeID::IntegerTyID:
		scalar_alignment = type->getIntegerBitWidth() / 8;
		break;
	case llvm::Type::TypeID::HalfTyID:
		scalar_alignment = 2;
		break;
	case llvm::Type::TypeID::FloatTyID:
		scalar_alignment = 4;
		break;
	case llvm::Type::TypeID::DoubleTyID:
		scalar_alignment = 8;
		break;
	default:
		LOGE("Invalid type for scalar alignment query.\n");
		return 1;
	}

	if (!impl.execution_mode_meta.native_16bit_operations && scalar_alignment == 2)
		scalar_alignment = 4;

	return scalar_alignment;
}

spv::Id get_buffer_alias_handle(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
                                spv::Id default_id, RawType type, RawWidth width, RawVecSize vecsize)
{
	for (auto &alias : meta.var_alias_group)
	{
		if (alias.declaration.type == type &&
		    alias.declaration.width == width &&
		    alias.declaration.vecsize == vecsize)
		{
			default_id = alias.var_id;
			break;
		}
	}

	return default_id;
}

bool type_is_16bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::HalfTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 16);
}

bool type_is_64bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::DoubleTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 64);
}

void get_physical_load_store_cast_info(Converter::Impl &impl, const llvm::Type *element_type,
                                       spv::Id &physical_type_id, spv::Op &value_cast_op)
{
	bool using_native_16bit_arith =
		type_is_16bit(element_type) &&
		(element_type->getTypeID() == llvm::Type::TypeID::IntegerTyID || impl.support_native_fp16_operations());

	if (!impl.execution_mode_meta.native_16bit_operations && using_native_16bit_arith)
	{
		if (element_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
		{
			physical_type_id = impl.get_type_id(DXIL::ComponentType::F32, 1, 1);
			value_cast_op = spv::OpFConvert;
		}
		else
		{
			physical_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, 1);
			value_cast_op = spv::OpUConvert;
		}
	}
	else
	{
		physical_type_id = impl.get_type_id(element_type);
		value_cast_op = spv::OpNop;
	}
}

static spv::Id build_index_divider_fallback(Converter::Impl &impl, const llvm::Value *offset, unsigned addr_shift_log2)
{
	auto &builder = impl.builder();
	Operation *op = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
	op->add_id(impl.get_id_for_value(offset));
	op->add_id(builder.makeUintConstant(addr_shift_log2));
	impl.add(op);
	return op->id;
}

bool extract_raw_buffer_access_split(const llvm::Value *index, unsigned stride,
                                     uint32_t addr_shift_log2, unsigned vecsize,
                                     RawBufferAccessSplit &split)
{
	unsigned element_size = (1u << addr_shift_log2) * vecsize;

	// Base case first, a constant value.
	if (const auto *const_addr = llvm::dyn_cast<llvm::ConstantInt>(index))
	{
		int64_t constant_offset = const_addr->getUniqueInteger().getSExtValue();
		constant_offset *= stride;

		// Always pass scalar constant dividers through.
		// Building a fallback divider helps nothing.
		if (vecsize == 1 || constant_offset % int(element_size) == 0)
		{
			split = {};
			split.bias = constant_offset / element_size;
			return true;
		}
		else
			return false;
	}

	const llvm::ConstantInt *scale = nullptr;
	const llvm::ConstantInt *bias = nullptr;
	bool scale_log2 = false;
	bool bias_is_add = false;
	bool bias_negate = false;

	while (!scale && llvm::isa<llvm::BinaryOperator>(index))
	{
		auto *binop = llvm::cast<llvm::BinaryOperator>(index);
		auto *lhs = binop->getOperand(0);
		auto *rhs = binop->getOperand(1);
		if (!bias && (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Add ||
		              binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Sub ||
		              binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Or ||
		              binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Xor))
		{
			if (const auto *const_lhs = llvm::dyn_cast<llvm::ConstantInt>(lhs))
			{
				bias = const_lhs;
				index = rhs;
			}
			else if (const auto *const_rhs = llvm::dyn_cast<llvm::ConstantInt>(rhs))
			{
				bias = const_rhs;
				index = lhs;
			}
			else
				break;

			// DXC tends to be emit shift + or in some cases.
			// We can turn this back into mul + add in most cases.
			bias_negate = binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Sub;
			bias_is_add =
					binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Add ||
					bias_negate;
		}
		else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Shl)
		{
			if (const auto *const_rhs = llvm::dyn_cast<llvm::ConstantInt>(rhs))
			{
				scale = const_rhs;
				index = lhs;
			}
			else
				break;

			scale_log2 = true;
		}
		else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Mul)
		{
			if (const auto *const_lhs = llvm::dyn_cast<llvm::ConstantInt>(lhs))
			{
				scale = const_lhs;
				index = rhs;
			}
			else if (const auto *const_rhs = llvm::dyn_cast<llvm::ConstantInt>(rhs))
			{
				scale = const_rhs;
				index = lhs;
			}
			else
				break;

			scale_log2 = false;
		}
		else
			break;
	}

	if (!scale && !bias)
	{
		// We cannot split anything, but we might be able to vectorize if the stride alone carries us.
		if (stride % element_size == 0)
		{
			split = {};
			split.scale = stride / element_size;
			split.dynamic_index = index;
			return true;
		}
		else
			return false;
	}

	uint64_t scale_factor = 1;
	if (scale)
		scale_factor = scale->getUniqueInteger().getZExtValue();
	if (scale_log2)
		scale_factor = 1ull << scale_factor;

	int64_t bias_factor = 0;
	if (bias)
		bias_factor = bias->getUniqueInteger().getSExtValue();
	if (bias_negate)
		bias_factor = -bias_factor;

	// If there is no bit overlap between scale_factor and bias_factor
	// then the bitwise OR is equivalent to add.
	if (!bias_is_add && (scale_factor & bias_factor) != 0)
		return false;

	scale_factor *= stride;
	bias_factor *= stride;

	if (scale_factor % element_size == 0 && bias_factor % element_size == 0 && index)
	{
		split.scale = scale_factor / element_size;
		split.bias = bias_factor / int(element_size);
		split.dynamic_index = index;
		return true;
	}
	else
		return false;
}

spv::Id build_index_divider(Converter::Impl &impl, const llvm::Value *offset,
                            unsigned addr_shift_log2, unsigned vecsize)
{
	auto &builder = impl.builder();
	// Attempt to do trivial constant folding to make output a little more sensible to read.
	// Try to find an expression for offset which is "constant0 * offset + constant1",
	// where constant0 and constant1 are aligned with addr_shift_log2.

	spv::Id index_id;
	RawBufferAccessSplit split = {};

	if (extract_raw_buffer_access_split(offset, 1, addr_shift_log2, vecsize, split))
	{
		if (!split.dynamic_index)
			return builder.makeUintConstant(split.bias);

		spv::Op bias_opcode = split.bias > 0 ? spv::OpIAdd : spv::OpISub;
		if (bias_opcode == spv::OpISub)
			split.bias = -split.bias;

		spv::Id scaled_id;
		if (split.scale != 1)
		{
			Operation *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			scale_op->add_id(impl.get_id_for_value(split.dynamic_index));
			scale_op->add_id(builder.makeUintConstant(split.scale));
			impl.add(scale_op);
			scaled_id = scale_op->id;
		}
		else
			scaled_id = impl.get_id_for_value(split.dynamic_index);

		spv::Id bias_id;
		if (split.bias != 0)
		{
			Operation *bias_op = impl.allocate(bias_opcode, builder.makeUintType(32));
			bias_op->add_id(scaled_id);
			bias_op->add_id(builder.makeUintConstant(split.bias));
			impl.add(bias_op);
			bias_id = bias_op->id;
		}
		else
			bias_id = scaled_id;

		index_id = bias_id;
	}
	else
	{
		assert(vecsize == 1);
		index_id = build_index_divider_fallback(impl, offset, addr_shift_log2);
	}

	return index_id;
}

spv::Id build_load_invocation_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId);

	Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	op->add_id(var_id);

	impl.add(op);
	return op->id;
}

spv::Id get_clip_cull_distance_access_chain(Converter::Impl &impl, const llvm::CallInst *instruction,
                                            const Converter::Impl::ClipCullMeta &meta, spv::StorageClass storage)
{
	auto &builder = impl.builder();
	uint32_t var_id = storage == spv::StorageClassOutput ? impl.spirv_module.get_builtin_shader_output(meta.builtin) :
	                  impl.spirv_module.get_builtin_shader_input(meta.builtin);

	Operation *op = impl.allocate(spv::OpAccessChain, builder.makePointer(storage, builder.makeFloatType(32)));
	op->add_id(var_id);

	if (instruction->getNumOperands() >= 6 &&
	    storage == spv::StorageClassOutput &&
	    impl.execution_model == spv::ExecutionModelMeshEXT)
	{
		// Mesh shaders, need to index into per-vertex array.
		op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	}

	if (storage == spv::StorageClassInput)
	{
		if (impl.execution_model == spv::ExecutionModelGeometry ||
		    impl.execution_model == spv::ExecutionModelTessellationControl ||
		    impl.execution_model == spv::ExecutionModelTessellationEvaluation)
		{
			op->add_id(impl.get_id_for_value(instruction->getOperand(4)));
		}
	}
	else if (storage == spv::StorageClassOutput && impl.execution_model == spv::ExecutionModelTessellationControl)
	{
		op->add_id(build_load_invocation_id(impl));
	}

	auto *row = instruction->getOperand(2);
	auto *row_const = llvm::dyn_cast<llvm::ConstantInt>(row);

	uint32_t constant_col;
	if (!get_constant_operand(instruction, 3, &constant_col))
		return false;

	unsigned stride = meta.row_stride;

	if (row_const)
	{
		op->add_id(builder.makeUintConstant(row_const->getUniqueInteger().getZExtValue() * stride + constant_col +
		                                    meta.offset));
	}
	else if (stride == 1 && meta.offset == 0)
	{
		// Simple case, can just index directly into ClipDistance array.
		op->add_id(impl.get_id_for_value(row));
	}
	else if (stride == 1)
	{
		Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(impl.get_id_for_value(row));
		add_op->add_id(builder.makeUintConstant(meta.offset));
		impl.add(add_op);

		op->add_id(add_op->id);
	}
	else
	{
		// A more annoying case, flatten 2D to 1D.
		Operation *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		mul_op->add_id(impl.get_id_for_value(row));
		mul_op->add_id(builder.makeUintConstant(stride));
		impl.add(mul_op);

		Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(mul_op->id);
		add_op->add_id(builder.makeUintConstant(constant_col + meta.offset));
		impl.add(add_op);

		op->add_id(add_op->id);
	}

	impl.add(op);
	return op->id;
}

bool emit_store_clip_cull_distance(Converter::Impl &impl, const llvm::CallInst *instruction,
                                   const Converter::Impl::ClipCullMeta &meta)
{
	spv::Id ptr_id = get_clip_cull_distance_access_chain(impl, instruction, meta, spv::StorageClassOutput);

	impl.register_externally_visible_write(instruction->getOperand(4));
	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));
	Operation *store_op = impl.allocate(spv::OpStore);
	store_op->add_ids({ ptr_id, store_value });
	impl.add(store_op);
	return true;
}

Converter::Impl::ClipCullMeta *output_clip_cull_distance_meta(Converter::Impl &impl, unsigned index)
{
	auto itr = impl.output_clip_cull_meta.find(index);
	if (itr != impl.output_clip_cull_meta.end())
		return &itr->second;
	else
		return nullptr;
}

void build_exploded_composite_from_vector(Converter::Impl &impl, const llvm::Instruction *value, unsigned active_lanes)
{
	auto itr = impl.llvm_composite_meta.find(value);
	if (itr == impl.llvm_composite_meta.end())
		return;

	auto &m = *itr;
	if (m.second.forced_struct)
	{
		// This value will be consumed by something other than plain OpCompositeExtract, force output struct type.
		unsigned elems = value->getType()->getStructNumElements();
		spv::Id id = impl.get_id_for_value(value);

		spv::Id extracted[4] = {};
		for (unsigned i = 0; i < active_lanes; i++)
		{
			auto *ext = impl.allocate(spv::OpCompositeExtract, impl.get_type_id(value->getType()->getStructElementType(i)));
			ext->add_id(id);
			ext->add_literal(i);
			impl.add(ext);
			extracted[i] = ext->id;
		}

		auto *struct_op = impl.allocate(spv::OpCompositeConstruct, impl.get_type_id(value->getType()));
		for (unsigned i = 0; i < elems; i++)
		{
			if (i < active_lanes)
				struct_op->add_id(extracted[i]);
			else
				struct_op->add_id(extracted[active_lanes - 1]);
		}

		impl.add(struct_op);
		impl.rewrite_value(value, struct_op->id);
	}
}

bool value_is_dx_op_instrinsic(const llvm::Value *value, DXIL::Op op)
{
	auto *call = llvm::dyn_cast<llvm::CallInst>(value);
	if (!call)
		return false;

	auto *func = call->getCalledFunction();
	if (strncmp(func->getName().data(), "dx.op", 5) != 0)
		return false;

	// The opcode is encoded as a constant integer.
	uint32_t opcode;
	if (!get_constant_operand(call, 0, &opcode))
		return false;

	return op == DXIL::Op(opcode);
}

void emit_expect_assume_quad_uniform(Converter::Impl &impl)
{
	if (impl.options.instruction_instrumentation.enabled &&
	    impl.options.instruction_instrumentation.type == InstructionInstrumentationType::ExpectAssume)
	{
		spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::IsQuadUniformControlFlow);
		auto *call = impl.allocate(spv::OpFunctionCall, impl.builder().makeBoolType());
		call->add_id(call_id);
		impl.add(call);

		auto *assert_uniform = impl.allocate(spv::OpAssumeTrueKHR);
		assert_uniform->add_id(call->id);
		impl.add(assert_uniform);
	}
}

SplitScaleBias split_index_scale_bias(const llvm::Value *value)
{
	const auto *cint = llvm::dyn_cast<llvm::ConstantInt>(value);
	// Return UINT32_MAX as stride since we cannot reasonably know yet.
	if (cint)
		return { UINT32_MAX, nullptr, uint32_t(cint->getUniqueInteger().getZExtValue()) };

	const auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(value);
	if (!binop)
		return {};

	if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Add)
	{
		const auto *const0 = llvm::dyn_cast<llvm::ConstantInt>(binop->getOperand(0));
		const auto *const1 = llvm::dyn_cast<llvm::ConstantInt>(binop->getOperand(1));
		if (const0 && !const1)
		{
			auto split = split_index_scale_bias(binop->getOperand(1));
			split.elem += const0->getUniqueInteger().getZExtValue();
			return split;
		}
		else if (!const0 && const1)
		{
			auto split = split_index_scale_bias(binop->getOperand(0));
			split.elem += const1->getUniqueInteger().getZExtValue();
			return split;
		}
	}
	else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Mul)
	{
		const auto *const0 = llvm::dyn_cast<llvm::ConstantInt>(binop->getOperand(0));
		const auto *const1 = llvm::dyn_cast<llvm::ConstantInt>(binop->getOperand(1));
		if (const0 && !const1)
			return { uint32_t(const0->getUniqueInteger().getZExtValue()), binop->getOperand(1), 0 };
		else if (!const0 && const1)
			return { uint32_t(const1->getUniqueInteger().getZExtValue()), binop->getOperand(0), 0 };
	}

	return {};
}

void add_vkmm_access_qualifiers(Converter::Impl &impl, Operation *op, const ReferenceVkMemoryModel &vkmm)
{
	if (impl.execution_mode_meta.memory_model != spv::MemoryModelVulkan)
		return;

	uint32_t mm_argument_index = 0;
	uint32_t mm_flags = 0;

	switch (op->op)
	{
	case spv::OpLoad:
		if (vkmm.non_private)
			mm_flags |= spv::MemoryAccessNonPrivatePointerMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::MemoryAccessMakePointerVisibleMask;
		mm_argument_index = 1;
		break;

	case spv::OpStore:
		if (vkmm.non_private)
			mm_flags |= spv::MemoryAccessNonPrivatePointerMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::MemoryAccessMakePointerAvailableMask;
		mm_argument_index = 2;
		break;

	case spv::OpCooperativeMatrixLoadKHR:
		if (vkmm.non_private)
			mm_flags |= spv::MemoryAccessNonPrivatePointerMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::MemoryAccessMakePointerVisibleMask;
		mm_argument_index = 3;
		break;

	case spv::OpCooperativeMatrixStoreKHR:
		if (vkmm.non_private)
			mm_flags |= spv::MemoryAccessNonPrivatePointerMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::MemoryAccessMakePointerAvailableMask;
		mm_argument_index = 4;
		break;

	case spv::OpImageRead:
	case spv::OpImageSparseRead:
		if (vkmm.non_private)
			mm_flags |= spv::ImageOperandsNonPrivateTexelMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::ImageOperandsMakeTexelVisibleMask;
		mm_argument_index = 2;
		break;

	case spv::OpImageWrite:
		if (vkmm.non_private)
			mm_flags |= spv::ImageOperandsNonPrivateTexelMask;
		if (vkmm.auto_visibility)
			mm_flags |= spv::ImageOperandsMakeTexelAvailableMask;
		mm_argument_index = 3;
		break;

	default:
		return;
	}

	if (mm_flags)
	{
		if (op->num_arguments > mm_argument_index)
			op->arguments[mm_argument_index] |= mm_flags;
		else
			op->add_literal(mm_flags);

		if (vkmm.auto_visibility)
			op->add_id(impl.builder().makeUintConstant(spv::ScopeQueueFamily));
	}
}
} // namespace dxil_spv
