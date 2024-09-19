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

#include "dxil_resources.hpp"
#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"
#include "dxil_buffer.hpp"

namespace dxil_spv
{
static Converter::Impl::ClipCullMeta *input_clip_cull_distance_meta(Converter::Impl &impl, unsigned index)
{
	auto itr = impl.input_clip_cull_meta.find(index);
	if (itr != impl.input_clip_cull_meta.end())
		return &itr->second;
	else
		return nullptr;
}

static bool emit_load_clip_cull_distance(Converter::Impl &impl, const llvm::CallInst *instruction,
                                         const Converter::Impl::ClipCullMeta &meta)
{
	spv::Id ptr_id = get_clip_cull_distance_access_chain(impl, instruction, meta, spv::StorageClassInput);

	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(ptr_id);
	impl.add(op);
	return true;
}

static void fixup_builtin_load(Converter::Impl &impl, spv::Id var_id, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_input(var_id, &builtin))
	{
		if (builtin == spv::BuiltInInstanceIndex || builtin == spv::BuiltInVertexIndex)
		{
			// Need to shift down to 0-base.
			spv::Id base_id = impl.spirv_module.get_builtin_shader_input(
			    builtin == spv::BuiltInInstanceIndex ? spv::BuiltInBaseInstance : spv::BuiltInBaseVertex);
			{
				Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
				op->add_id(base_id);
				base_id = op->id;
				impl.add(op);
			}

			Operation *sub_op = impl.allocate(spv::OpISub, builder.makeUintType(32));
			sub_op->add_ids({ impl.get_id_for_value(instruction), base_id });
			impl.add(sub_op);
			impl.rewrite_value(instruction, sub_op->id);
			builder.addCapability(spv::CapabilityDrawParameters);
		}
		else if (builtin == spv::BuiltInFrontFacing)
		{
			Operation *cast_op = impl.allocate(spv::OpSelect, builder.makeUintType(32));
			cast_op->add_id(impl.get_id_for_value(instruction));
			cast_op->add_id(builder.makeUintConstant(~0u));
			cast_op->add_id(builder.makeUintConstant(0));
			impl.add(cast_op);
			impl.rewrite_value(instruction, cast_op->id);
		}
		else if (builtin == spv::BuiltInFragCoord)
		{
			auto *col = llvm::cast<llvm::ConstantInt>(instruction->getOperand(3));
			if (col->getUniqueInteger().getZExtValue() == 3)
			{
				// FragCoord.w is inverted in DX.
				Operation *op = impl.allocate(spv::OpFDiv, builder.makeFloatType(32));
				op->add_id(builder.makeFloatConstant(1.0f));
				op->add_id(impl.get_id_for_value(instruction));
				impl.add(op);
				impl.rewrite_value(instruction, op->id);
			}
		}
	}
}

static spv::Id get_builtin_load_type(Converter::Impl &impl, const Converter::Impl::ElementMeta &meta)
{
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_input(meta.id, &builtin) && builtin == spv::BuiltInFrontFacing)
		return impl.builder().makeBoolType();
	else
		return impl.get_effective_input_output_type_id(meta.component_type);
}

bool emit_load_input_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	// Need special handling for clip distance.
	auto *clip_cull_meta = input_clip_cull_distance_meta(impl, input_element_index);
	if (clip_cull_meta)
		return emit_load_clip_cull_distance(impl, instruction, *clip_cull_meta);

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id input_type_id = builder.getDerefTypeId(var_id);

	bool array_index = false;
	if (impl.execution_model == spv::ExecutionModelTessellationControl ||
	    impl.execution_model == spv::ExecutionModelGeometry ||
	    impl.execution_model == spv::ExecutionModelTessellationEvaluation ||
	    impl.llvm_attribute_at_vertex_indices.count(input_element_index) != 0)
	{
		input_type_id = builder.getContainedTypeId(input_type_id);
		array_index = true;
	}

	bool row_index = false;
	if (builder.isArrayType(input_type_id))
	{
		row_index = true;
		input_type_id = builder.getContainedTypeId(input_type_id);
	}

	uint32_t num_cols = builder.getNumTypeComponents(input_type_id);

	if (num_cols > 1 || row_index || array_index)
	{
		// Need to deal with signed vs unsigned here.
		Operation *op =
			impl.allocate(spv::OpAccessChain,
			              builder.makePointer(spv::StorageClassInput,
			                                  impl.get_effective_input_output_type_id(meta.component_type)));
		ptr_id = op->id;

		op->add_id(var_id);
		// Vertex array index for GS/DS/HS or barycentrics.
		if (array_index)
		{
			auto *index = instruction->getOperand(4);
			if (llvm::isa<llvm::UndefValue>(index))
			{
				// If we loadInput on a barycentric input, we get nointerpolation,
				// i.e. flat, i.e. provoking vertex, i.e. vertex 0.
				op->add_id(builder.makeUintConstant(0));
			}
			else
				op->add_id(impl.get_id_for_value(index));
		}
		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		if (num_cols > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
		ptr_id = var_id;

	// Need to deal with signed vs unsigned here.
	spv::Id load_type = get_builtin_load_type(impl, meta);

	Operation *op = impl.allocate(spv::OpLoad, instruction, load_type);
	op->add_id(ptr_id);
	impl.add(op);

	fixup_builtin_load(impl, var_id, instruction);

	// Need to bitcast after we load.
	impl.fixup_load_type_io(meta.component_type, 1, instruction);
	return true;
}

static spv::Id build_attribute_offset(spv::Id id, Converter::Impl &impl)
{
	auto &builder = impl.builder();
	{
		Operation *op = impl.allocate(spv::OpBitFieldSExtract, builder.makeUintType(32));
		op->add_id(id);
		op->add_id(builder.makeUintConstant(0));
		op->add_id(builder.makeUintConstant(4));
		id = op->id;
		impl.add(op);
	}

	{
		Operation *op = impl.allocate(spv::OpConvertSToF, builder.makeFloatType(32));
		op->add_id(id);
		id = op->id;
		impl.add(op);
	}

	{
		Operation *op = impl.allocate(spv::OpFMul, builder.makeFloatType(32));
		op->add_ids({ id, builder.makeFloatConstant(1.0f / 16.0f) });
		id = op->id;
		impl.add(op);
	}

	return id;
}

bool emit_interpolate_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

	if (num_rows > 1)
	{
		// Need to deal with signed vs unsigned here.
		Operation *op =
			impl.allocate(spv::OpAccessChain,
			              builder.makePointer(spv::StorageClassInput,
			                                  impl.get_effective_input_output_type_id(meta.component_type)));

		op->add_ids({ var_id, impl.get_id_for_value(instruction->getOperand(3), 32) });
		impl.add(op);
		ptr_id = op->id;
	}
	else
		ptr_id = var_id;

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	spv::Id aux_id = 0;

	if (opcode == GLSLstd450InterpolateAtOffset)
	{
		spv::Id offsets[2] = {};
		bool is_non_const = false;
		for (unsigned i = 0; i < 2; i++)
		{
			auto *operand = instruction->getOperand(4 + i);
			auto *constant_operand = llvm::dyn_cast<llvm::ConstantInt>(operand);

			// Need to do it the tedious way, extracting bits and converting to float ...
			if (!constant_operand)
			{
				offsets[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
				offsets[i] = build_attribute_offset(offsets[i], impl);
				is_non_const = true;
			}
			else
			{
				float off = float(constant_operand->getUniqueInteger().getSExtValue()) / 16.0f;
				offsets[i] = builder.makeFloatConstant(off);
			}
		}

		if (is_non_const)
			aux_id = impl.build_vector(builder.makeFloatType(32), offsets, 2);
		else
			aux_id = impl.build_constant_vector(builder.makeFloatType(32), offsets, 2);
	}
	else if (opcode == GLSLstd450InterpolateAtSample)
		aux_id = impl.get_id_for_value(instruction->getOperand(4));

	// Need to deal with signed vs unsigned here.
	Operation *op = impl.allocate(spv::OpExtInst, instruction,
	                              impl.get_effective_input_output_type_id(meta.component_type));
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(opcode);
	op->add_id(ptr_id);

	if (aux_id)
		op->add_id(aux_id);

	impl.add(op);

	// Need to bitcast after we load.
	impl.fixup_load_type_io(meta.component_type, 1, instruction);
	builder.addCapability(spv::CapabilityInterpolationFunction);
	return true;
}

static spv::Id build_load_invocation_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId);

	Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	op->add_id(var_id);

	impl.add(op);
	return op->id;
}

bool emit_store_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	// Need special handling for clip distance.
	auto *clip_cull_meta = output_clip_cull_distance_meta(impl, output_element_index);
	if (clip_cull_meta)
		return emit_store_clip_cull_distance(impl, instruction, *clip_cull_meta);

	if (impl.options.dual_source_blending)
	{
		// Mask out writes to unused higher RTs when using dual source blending.
		if (impl.output_elements_meta.count(output_element_index) == 0)
			return true;
	}

	const auto &meta = impl.output_elements_meta[output_element_index];

	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id output_type_id = builder.getDerefTypeId(var_id);
	bool is_control_point_output = impl.execution_model == spv::ExecutionModelTessellationControl;
	if (is_control_point_output)
		output_type_id = builder.getContainedTypeId(output_type_id);

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	if (num_cols > 1 || row_index || is_control_point_output)
	{
		Operation *op = impl.allocate(
		    spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
		ptr_id = op->id;

		op->add_id(var_id);
		if (is_control_point_output)
			op->add_id(build_load_invocation_id(impl));

		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));

		if (num_cols > 1)
		{
			unsigned col;
			if (!get_constant_operand(instruction, 3, &col))
			{
				LOGE("Column index to StoreOutput must be a constant.\n");
				return false;
			}

			// If we need to swizzle fragment shader outputs, do it here.
			if (impl.execution_model == spv::ExecutionModelFragment &&
			    meta.rt_index < impl.options.output_swizzles.size())
			{
				// Assume a 1:1 reversible mapping, so we don't need to splat the write or something like that.
				unsigned swiz = impl.options.output_swizzles[meta.rt_index];
				for (unsigned output_component = 0; output_component < 4; output_component++)
				{
					if (((swiz >> (2u * output_component)) & 3u) == col)
					{
						col = output_component;
						break;
					}
				}
			}

			op->add_id(builder.makeUintConstant(col));
		}

		impl.add(op);
	}
	else
		ptr_id = var_id;

	impl.register_externally_visible_write(instruction->getOperand(4));
	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	Operation *op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_type_io(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

bool emit_load_draw_parameter_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto& builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(builtin);

	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);

	builder.addCapability(spv::CapabilityDrawParameters);
	return true;
}

static spv::Id build_bindless_heap_offset(Converter::Impl &impl,
                                          spv::Id table_index_id,
                                          uint32_t base_offset,
                                          const llvm::Value *dynamic_offset)
{
	auto &builder = impl.builder();

	if (base_offset != 0 && dynamic_offset)
	{
		// Try to constant fold the offsets.
		// Works around some driver issues in some cases and makes the code neater.
		// It's very common for bindless to get counteracting - and + here, turning base_offset into 0 ...
		if (const auto *bin_op = llvm::dyn_cast<llvm::BinaryOperator>(dynamic_offset))
		{
			if (bin_op->getOpcode() == llvm::BinaryOperator::BinaryOps::Add)
			{
				auto *a = bin_op->getOperand(0);
				auto *b = bin_op->getOperand(1);
				if (const auto *a_const = llvm::dyn_cast<llvm::ConstantInt>(a))
				{
					base_offset += uint32_t(a_const->getUniqueInteger().getZExtValue());
					dynamic_offset = b;
				}
				else if (const auto *b_const = llvm::dyn_cast<llvm::ConstantInt>(b))
				{
					base_offset += uint32_t(b_const->getUniqueInteger().getZExtValue());
					dynamic_offset = a;
				}
			}
		}
	}

	if (base_offset != 0)
	{
		auto *heap_offset = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		heap_offset->add_id(table_index_id);
		heap_offset->add_id(builder.makeUintConstant(base_offset));
		impl.add(heap_offset);
		table_index_id = heap_offset->id;
	}

	if (dynamic_offset)
	{
		auto *offset = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		offset->add_id(table_index_id);
		offset->add_id(impl.get_id_for_value(dynamic_offset));
		impl.add(offset);
		table_index_id = offset->id;
	}

	return table_index_id;
}

static spv::Id build_bindless_heap_offset_shader_record(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference,
                                                        const llvm::Value *dynamic_offset)
{
	auto &builder = impl.builder();

	auto *descriptor_table = impl.allocate(
		spv::OpAccessChain,
		builder.makePointer(spv::StorageClassShaderRecordBufferKHR, builder.makeUintType(32)));
	descriptor_table->add_id(impl.shader_record_buffer_id);
	descriptor_table->add_id(builder.makeUintConstant(reference.local_root_signature_entry));
	descriptor_table->add_id(builder.makeUintConstant(0));
	impl.add(descriptor_table);

	auto *loaded_word = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	loaded_word->add_id(descriptor_table->id);
	impl.add(loaded_word);

	auto *shifted_word = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
	shifted_word->add_id(loaded_word->id);

	// Need to translate fake GPU VA to index.
	unsigned shamt = reference.resource_kind == DXIL::ResourceKind::Sampler ?
	    impl.options.sbt_descriptor_size_sampler_log2 : impl.options.sbt_descriptor_size_srv_uav_cbv_log2;
	shifted_word->add_id(builder.makeUintConstant(shamt));
	impl.add(shifted_word);
	loaded_word = shifted_word;

	return build_bindless_heap_offset(impl, loaded_word->id, reference.base_offset, dynamic_offset);
}

static spv::Id build_bindless_heap_offset_push_constant(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference,
                                                        const llvm::Value *dynamic_offset)
{
	auto &builder = impl.builder();
	if (reference.push_constant_member >= (impl.root_constant_num_words + impl.root_descriptor_count) ||
	    reference.push_constant_member < impl.root_descriptor_count ||
	    impl.root_constant_id == 0)
	{
		LOGE("Descriptor table offset is out of push constant range.\n");
		return 0;
	}

	auto *descriptor_table = impl.allocate(
		spv::OpAccessChain,
		builder.makePointer(impl.options.inline_ubo_enable ? spv::StorageClassUniform : spv::StorageClassPushConstant,
		                    builder.makeUintType(32)));
	descriptor_table->add_id(impl.root_constant_id);
	descriptor_table->add_id(builder.makeUintConstant(reference.push_constant_member));
	impl.add(descriptor_table);

	auto *loaded_word = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	loaded_word->add_id(descriptor_table->id);
	impl.add(loaded_word);

	return build_bindless_heap_offset(impl, loaded_word->id, reference.base_offset, dynamic_offset);
}

static spv::Id build_descriptor_qa_check(Converter::Impl &impl, spv::Id offset_id,
                                         DescriptorQATypeFlags type)
{
	// Only implemented for CBV_SRV_UAV heap.
	if (type == DESCRIPTOR_QA_TYPE_SAMPLER_BIT)
		return offset_id;

	if (impl.options.descriptor_qa.version != Version)
	{
		LOGE("Descriptor QA version is not %u.\n", Version);
		return offset_id;
	}

	auto &builder = impl.builder();
	auto *call_op = impl.allocate(spv::OpFunctionCall, builder.makeUintType(32));
	call_op->add_id(impl.spirv_module.get_helper_call_id(HelperCall::DescriptorQACheck));
	call_op->add_id(offset_id);
	call_op->add_id(builder.makeUintConstant(type));
	call_op->add_id(builder.makeUintConstant(++impl.descriptor_qa_counter));
	impl.add(call_op);
	return call_op->id;
}

static spv::Id build_descriptor_heap_robustness(Converter::Impl &impl, spv::Id offset_id)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(spv::OpArrayLength, builder.makeUintType(32));
	op->add_id(impl.descriptor_heap_robustness_var_id);
	op->add_literal(0);
	impl.add(op);

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	auto *clamp_op = impl.allocate(spv::OpExtInst, builder.makeUintType(32));
	clamp_op->add_id(impl.glsl_std450_ext);
	clamp_op->add_literal(GLSLstd450UMin);
	clamp_op->add_id(offset_id);
	clamp_op->add_id(op->id);
	impl.add(clamp_op);

	return clamp_op->id;
}

static spv::Id build_bindless_heap_offset(Converter::Impl &impl,
                                          const Converter::Impl::ResourceReference &reference,
                                          DescriptorQATypeFlags type,
                                          const llvm::Value *dynamic_offset)
{
	spv::Id offset_id;
	if (reference.local_root_signature_entry >= 0)
		offset_id = build_bindless_heap_offset_shader_record(impl, reference, dynamic_offset);
	else if (reference.push_constant_member != UINT32_MAX)
		offset_id = build_bindless_heap_offset_push_constant(impl, reference, dynamic_offset);
	else
	{
		if (reference.base_offset != 0)
		{
			LOGE("For SM 6.6 heaps, no constant offset can be applied.\n");
			return 0;
		}
		offset_id = impl.get_id_for_value(dynamic_offset);
	}

	if (impl.options.descriptor_qa_enabled)
		offset_id = build_descriptor_qa_check(impl, offset_id, type);
	else if (type != DESCRIPTOR_QA_TYPE_SAMPLER_BIT && dynamic_offset && impl.descriptor_heap_robustness_var_id)
		offset_id = build_descriptor_heap_robustness(impl, offset_id);

	return offset_id;
}

static spv::Id build_physical_address_indexing_from_ssbo(Converter::Impl &impl, spv::Id offset_id)
{
	auto &builder = impl.builder();

	if (impl.options.physical_address_descriptor_stride != 1)
	{
		auto *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		mul_op->add_id(builder.makeUintConstant(impl.options.physical_address_descriptor_stride));
		mul_op->add_id(offset_id);
		impl.add(mul_op);
		offset_id = mul_op->id;
	}

	if (impl.options.physical_address_descriptor_offset != 0)
	{
		auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(offset_id);
		add_op->add_id(builder.makeUintConstant(impl.options.physical_address_descriptor_offset));
		impl.add(add_op);
		offset_id = add_op->id;
	}

	return offset_id;
}

static spv::Id build_load_physical_pointer(Converter::Impl &impl, const Converter::Impl::ResourceReference &counter,
                                           const llvm::Value *offset, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);

	auto *chain_op = impl.allocate(spv::OpAccessChain,
	                               builder.makePointer(spv::StorageClassStorageBuffer, uvec2_type));
	chain_op->add_id(counter.var_id);
	chain_op->add_id(builder.makeUintConstant(0));

	spv::Id offset_id = build_bindless_heap_offset(
		impl, counter, DESCRIPTOR_QA_TYPE_RAW_VA_BIT,
		counter.base_resource_is_array ? offset : nullptr);

	offset_id = build_physical_address_indexing_from_ssbo(impl, offset_id);

	chain_op->add_id(offset_id);
	impl.add(chain_op);

	auto *load_op = impl.allocate(spv::OpLoad, uvec2_type);
	load_op->add_id(chain_op->id);
	impl.add(load_op);

	return load_op->id;
}

static spv::StorageClass get_resource_storage_class(Converter::Impl &impl, spv::Id base_resource_id)
{
	auto meta_itr = impl.handle_to_resource_meta.find(base_resource_id);
	auto storage = spv::StorageClassUniformConstant;
	if (meta_itr != impl.handle_to_resource_meta.end())
		storage = meta_itr->second.storage;

	return storage;
}

static bool build_load_resource_handle(Converter::Impl &impl, spv::Id base_resource_id,
                                       const Converter::Impl::ResourceReference &reference,
                                       DescriptorQATypeFlagBits descriptor_type,
                                       const llvm::CallInst *instruction,
                                       llvm::Value *instruction_offset_value, bool instruction_is_non_uniform,
                                       bool &is_non_uniform,
                                       spv::Id *ptr_id, spv::Id *value_id, spv::Id *bindless_offset_id)
{
	auto &builder = impl.builder();

	spv::Id resource_id = base_resource_id;
	spv::Id type_id = builder.getDerefTypeId(resource_id);

	auto storage = get_resource_storage_class(impl, base_resource_id);
	is_non_uniform = false;

	// If we index based on SBT, we must assume non-uniform, even for resources
	// which are not arrayed, since in theory, the dispatch can process different SBTs concurrently,
	// perhaps even within same subgroup, so have to be defensive.
	if (reference.local_root_signature_entry >= 0)
		is_non_uniform = true;

	if (reference.base_resource_is_array || reference.bindless)
	{
		if (reference.base_resource_is_array && instruction_offset_value && instruction_is_non_uniform)
			is_non_uniform = true;

		type_id = builder.getContainedTypeId(type_id);
		Operation *op =
		    impl.allocate(spv::OpAccessChain, builder.makePointer(storage, type_id));
		op->add_id(resource_id);

		spv::Id offset_id;

		if (reference.bindless)
		{
			offset_id = build_bindless_heap_offset(
			    impl, reference, descriptor_type, reference.base_resource_is_array ? instruction_offset_value : nullptr);

			if (offset_id == 0)
				return false;

			if (bindless_offset_id)
				*bindless_offset_id = offset_id;
		}
		else
		{
			offset_id = impl.get_id_for_value(instruction_offset_value);
			if (bindless_offset_id)
				*bindless_offset_id = 0;
		}

		op->add_id(offset_id);

		// Some compilers require the index to be marked as NonUniformEXT, even if it not required by Vulkan spec.
		// Avoid SPIR-V validation error if same index is used for multiple resources.
		if (is_non_uniform && instruction_offset_value)
			builder.addUniqueDecoration(offset_id, spv::DecorationNonUniformEXT);

		impl.add(op);
		resource_id = op->id;
	}

	if (ptr_id)
		*ptr_id = resource_id;

	if (value_id)
	{
		if (storage == spv::StorageClassUniformConstant)
		{
			Operation *op = impl.allocate(spv::OpLoad, instruction, type_id);
			op->add_id(resource_id);
			impl.id_to_type[op->id] = type_id;
			impl.add(op);
			if (is_non_uniform)
				builder.addDecoration(op->id, spv::DecorationNonUniformEXT);
			*value_id = op->id;
		}
		else
		{
			*value_id = resource_id;
			impl.rewrite_value(instruction, resource_id);

			// Generally, we want to add NonUniformEXT after access chain for UBO/SSBO,
			// but there is a special case in non-uniform OpArrayLength, where we will use this pointer
			// directly, so mark it as non-uniform here.
			if (is_non_uniform)
				builder.addDecoration(resource_id, spv::DecorationNonUniformEXT);
		}
	}

	return true;
}

static spv::Id build_shader_record_access_chain(Converter::Impl &impl, unsigned local_root_signature_entry)
{
	auto &builder = impl.builder();

	spv::Id array_type_id = impl.shader_record_buffer_types[local_root_signature_entry];
	spv::Id ptr_array_type_id = builder.makePointer(spv::StorageClassShaderRecordBufferKHR, array_type_id);
	auto *access_chain = impl.allocate(spv::OpAccessChain, ptr_array_type_id);
	access_chain->add_id(impl.shader_record_buffer_id);
	access_chain->add_id(builder.makeUintConstant(local_root_signature_entry));
	impl.add(access_chain);

	return access_chain->id;
}

static spv::Id build_root_descriptor_access_chain(Converter::Impl &impl, unsigned member_index)
{
	auto &builder = impl.builder();

	auto storage = impl.options.inline_ubo_enable ? spv::StorageClassUniform : spv::StorageClassPushConstant;

	spv::Id ptr_type_id = builder.makePointer(storage, builder.makeVectorType(builder.makeUintType(32), 2));
	auto *access_chain = impl.allocate(spv::OpAccessChain, ptr_type_id);
	access_chain->add_id(impl.root_constant_id);
	access_chain->add_id(builder.makeUintConstant(member_index));
	impl.add(access_chain);

	return access_chain->id;
}

static spv::Id build_root_descriptor_load_physical_pointer(Converter::Impl &impl,
                                                           const Converter::Impl::ResourceReference &reference)
{
	auto &builder = impl.builder();
	int local_root_signature_entry = reference.local_root_signature_entry;

	spv::Id ptr_id;
	if (local_root_signature_entry >= 0)
		ptr_id = build_shader_record_access_chain(impl, local_root_signature_entry);
	else
		ptr_id = build_root_descriptor_access_chain(impl, reference.push_constant_member);

	auto *load_ptr = impl.allocate(spv::OpLoad, builder.makeVectorType(builder.makeUintType(32), 2));
	load_ptr->add_id(ptr_id);
	impl.add(load_ptr);
	return load_ptr->id;
}

static spv::Id build_load_physical_rtas(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference,
                                        const llvm::Value *offset, bool non_uniform)
{
	auto &builder = impl.builder();
	spv::Id ptr_id;

	if (builder.getStorageClass(reference.var_id) == spv::StorageClassStorageBuffer)
	{
		spv::Id offset_id = build_bindless_heap_offset(impl, reference,
		                                               DESCRIPTOR_QA_TYPE_RT_ACCELERATION_STRUCTURE_BIT |
		                                               DESCRIPTOR_QA_TYPE_RAW_VA_BIT,
		                                               reference.base_resource_is_array ? offset : nullptr);

		if (!non_uniform)
		{
			builder.addCapability(spv::CapabilityGroupNonUniformBallot);
			auto *broadcast_op = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, builder.makeUintType(32));
			broadcast_op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
			broadcast_op->add_id(offset_id);
			impl.add(broadcast_op);
			offset_id = broadcast_op->id;
		}

		offset_id = build_physical_address_indexing_from_ssbo(impl, offset_id);

		spv::Id uvec2_type = builder.makeVectorType(builder.makeUintType(32), 2);
		auto *chain_op =
		    impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassStorageBuffer, uvec2_type));
		chain_op->add_id(reference.var_id);
		chain_op->add_id(builder.makeUintConstant(0));
		chain_op->add_id(offset_id);
		impl.add(chain_op);

		auto *load_op = impl.allocate(spv::OpLoad, uvec2_type);
		load_op->add_id(chain_op->id);
		impl.add(load_op);
		ptr_id = load_op->id;
	}
	else
	{
		ptr_id = build_root_descriptor_load_physical_pointer(impl, reference);
	}

	auto *convert_op = impl.allocate(spv::OpConvertUToAccelerationStructureKHR, builder.makeAccelerationStructureType());
	convert_op->add_id(ptr_id);
	impl.add(convert_op);
	return convert_op->id;
}

static bool resource_is_physical_rtas(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference)
{
	if (reference.resource_kind != DXIL::ResourceKind::RTAccelerationStructure)
		return false;

	bool physical_pointer_heap = impl.builder().getStorageClass(reference.var_id) == spv::StorageClassStorageBuffer;
	if (physical_pointer_heap)
		return true;

	if (reference.local_root_signature_entry >= 0)
		return impl.local_root_signature[reference.local_root_signature_entry].type == LocalRootSignatureType::Descriptor;
	else
		return reference.root_descriptor;
}

static bool resource_is_physical_pointer(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference)
{
	if (reference.local_root_signature_entry >= 0)
		return impl.local_root_signature[reference.local_root_signature_entry].type == LocalRootSignatureType::Descriptor;
	else
		return reference.root_descriptor;
}

static spv::Id build_load_buffer_offset(Converter::Impl &impl, Converter::Impl::ResourceReference &reference,
                                        Converter::Impl::ResourceMeta &meta,
                                        spv::Id offset_ssbo_id, spv::Id bindless_offset_id, bool non_uniform)
{
	auto &builder = impl.builder();

	if (!non_uniform)
	{
		// Allow scalar load of the offset if possible.
		Operation *scalar_op = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, builder.makeUintType(32));
		scalar_op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		scalar_op->add_id(bindless_offset_id);
		impl.add(scalar_op);
		bindless_offset_id = scalar_op->id;
		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	}

	bool untyped_buffer = meta.storage != spv::StorageClassUniformConstant &&
	                      meta.kind != DXIL::ResourceKind::TypedBuffer;
	unsigned layout_offset = untyped_buffer ? impl.options.offset_buffer_layout.untyped_offset :
	                         impl.options.offset_buffer_layout.typed_offset;

	if (impl.options.offset_buffer_layout.stride != 1)
	{
		Operation *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		scale_op->add_id(bindless_offset_id);
		scale_op->add_id(builder.makeUintConstant(impl.options.offset_buffer_layout.stride));
		impl.add(scale_op);
		bindless_offset_id = scale_op->id;
	}

	if (layout_offset)
	{
		Operation *bias_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		bias_op->add_id(bindless_offset_id);
		bias_op->add_id(builder.makeUintConstant(layout_offset));
		impl.add(bias_op);
		bindless_offset_id = bias_op->id;
	}

	spv::Id vec_type = builder.makeVectorType(builder.makeUintType(32), 2);

	Operation *chain_op = impl.allocate(spv::OpAccessChain,
	                                    builder.makePointer(spv::StorageClassStorageBuffer,
	                                                        vec_type));
	chain_op->add_id(offset_ssbo_id);
	chain_op->add_id(builder.makeUintConstant(0));
	chain_op->add_id(bindless_offset_id);
	impl.add(chain_op);

	Operation *load_op = impl.allocate(spv::OpLoad, vec_type);
	load_op->add_id(chain_op->id);
	impl.add(load_op);

	spv::Id offset_id = load_op->id;

	// Shift the offset buffer once if we can get away with it.
	if (untyped_buffer && !reference.aliased)
	{
		Operation *shift_op = impl.allocate(spv::OpShiftRightLogical, vec_type);
		shift_op->add_id(offset_id);

		unsigned ssbo_element_size =
			raw_vecsize_to_vecsize(meta.raw_component_vecsize) *
			raw_component_type_to_bits(meta.component_type) / 8;

		unsigned shamt = 0;
		while (ssbo_element_size > 1)
		{
			shamt++;
			ssbo_element_size >>= 1;
		}

		spv::Id const_2[2];
		const_2[0] = const_2[1] = builder.makeUintConstant(shamt);
		spv::Id const_vec = impl.build_constant_vector(builder.makeUintType(32), const_2, 2);

		shift_op->add_id(const_vec);
		impl.add(shift_op);

		offset_id = shift_op->id;
	}

	return offset_id;
}

static bool resource_kind_is_buffer(DXIL::ResourceKind kind)
{
	switch (kind)
	{
	case DXIL::ResourceKind::RawBuffer:
	case DXIL::ResourceKind::StructuredBuffer:
	case DXIL::ResourceKind::TypedBuffer:
	case DXIL::ResourceKind::CBuffer:
		return true;

	default:
		return false;
	}
}

static Converter::Impl::ResourceReference &get_resource_counter_reference(
	Converter::Impl &impl, const llvm::CallInst *instruction, unsigned resource_range)
{
	if (resource_range == UINT32_MAX)
		return impl.llvm_annotate_handle_uses[instruction].counter_reference;
	else
		return impl.uav_index_to_counter[resource_range];
}

static Converter::Impl::ResourceReference &get_resource_reference(
		Converter::Impl &impl, DXIL::ResourceType resource_type,
		const llvm::CallInst *instruction, unsigned resource_range)
{
	if (resource_range == UINT32_MAX)
	{
		return impl.llvm_annotate_handle_uses[instruction].reference;
	}
	else
	{
		switch (resource_type)
		{
		default:
		case DXIL::ResourceType::SRV:
			return impl.srv_index_to_reference[resource_range];
		case DXIL::ResourceType::UAV:
			return impl.uav_index_to_reference[resource_range];
		case DXIL::ResourceType::CBV:
			return impl.cbv_index_to_reference[resource_range];
		case DXIL::ResourceType::Sampler:
			return impl.sampler_index_to_reference[resource_range];
		}
	}
}

static spv::Id get_offset_buffer_variable(
		Converter::Impl &impl, DXIL::ResourceType resource_type,
		const llvm::CallInst *instruction, unsigned resource_range)
{
	if (resource_range == UINT32_MAX)
		return impl.llvm_annotate_handle_uses[instruction].offset_buffer_id;
	else if (resource_type == DXIL::ResourceType::SRV)
		return impl.srv_index_to_offset[resource_range];
	else
		return impl.uav_index_to_offset[resource_range];
}

static bool emit_create_handle(Converter::Impl &impl, const llvm::CallInst *instruction,
                               DXIL::ResourceType resource_type, unsigned resource_range,
                               llvm::Value *instruction_offset, bool non_uniform)
{
	auto &builder = impl.builder();
	switch (resource_type)
	{
	case DXIL::ResourceType::SRV:
	{
		auto &reference = get_resource_reference(impl, resource_type, instruction, resource_range);

		if (resource_is_physical_rtas(impl, reference))
		{
			spv::Id ptr_id = build_load_physical_rtas(impl, reference, instruction_offset, non_uniform);
			impl.rewrite_value(instruction, ptr_id);
			auto &meta = impl.handle_to_resource_meta[ptr_id];
			meta = {};
			meta.storage = spv::StorageClassGeneric;
			meta.kind = DXIL::ResourceKind::RTAccelerationStructure;
		}
		else if (resource_is_physical_pointer(impl, reference))
		{
			spv::Id ptr_id = build_root_descriptor_load_physical_pointer(impl, reference);
			impl.rewrite_value(instruction, ptr_id);
			auto &meta = impl.handle_to_resource_meta[ptr_id];
			meta = {};
			meta.stride = reference.stride;
			meta.storage = spv::StorageClassPhysicalStorageBuffer;
			meta.physical_pointer_meta.nonwritable = true;
			meta.kind = reference.resource_kind;
		}
		else
		{
			bool is_non_uniform = false;

			auto storage = get_resource_storage_class(impl, reference.var_id);
			DescriptorQATypeFlagBits descriptor_type;
			if (storage == spv::StorageClassStorageBuffer)
				descriptor_type = DESCRIPTOR_QA_TYPE_STORAGE_BUFFER_BIT;
			else if (resource_kind_is_buffer(reference.resource_kind))
				descriptor_type = DESCRIPTOR_QA_TYPE_UNIFORM_TEXEL_BUFFER_BIT;
			else if (reference.resource_kind == DXIL::ResourceKind::RTAccelerationStructure)
				descriptor_type = DESCRIPTOR_QA_TYPE_RT_ACCELERATION_STRUCTURE_BIT;
			else
				descriptor_type = DESCRIPTOR_QA_TYPE_SAMPLED_IMAGE_BIT;

			Vector<Converter::Impl::RawDeclarationVariable> raw_declarations;
			spv::Id loaded_id = 0;
			spv::Id offset_id = 0;
			spv::Id resource_id = 0;
			raw_declarations.reserve(reference.var_alias_group.size());

			if (reference.var_id)
			{
				resource_id = reference.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type, instruction,
												instruction_offset, non_uniform, is_non_uniform,
												nullptr, &loaded_id, &offset_id))
				{
					LOGE("Failed to load SRV resource handle.\n");
					return false;
				}
			}

			for (auto &alias : reference.var_alias_group)
			{
				resource_id = alias.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type,
												instruction, instruction_offset, non_uniform, is_non_uniform,
												nullptr, &loaded_id, &offset_id))
				{
					LOGE("Failed to load SRV resource handle.\n");
					return false;
				}

				raw_declarations.push_back({ alias.declaration, loaded_id });
			}

			auto &incoming_meta = impl.handle_to_resource_meta[resource_id];

			spv::Id offset_buffer_id = get_offset_buffer_variable(impl, resource_type, instruction, resource_range);
			if (offset_buffer_id)
			{
				offset_id = build_load_buffer_offset(impl, reference, incoming_meta,
				                                     offset_buffer_id, offset_id, non_uniform);
			}
			else
				offset_id = 0;

			auto &meta = impl.handle_to_resource_meta[loaded_id];
			meta = incoming_meta;
			meta.non_uniform = is_non_uniform;
			meta.index_offset_id = offset_id;
			meta.var_alias_group = std::move(raw_declarations);
			meta.aliased = reference.aliased;
			meta.physical_pointer_meta.nonwritable = true;

			// The base array variable does not know what the stride is, promote that state here.
			if (reference.bindless)
				meta.stride = reference.stride;

			if (is_non_uniform)
			{
				spv::Id type_id = builder.getDerefTypeId(resource_id);
				type_id = builder.getContainedTypeId(type_id);

				if (builder.getTypeClass(type_id) != spv::OpTypeAccelerationStructureKHR)
				{
					if (meta.storage == spv::StorageClassStorageBuffer)
						builder.addCapability(spv::CapabilityStorageBufferArrayNonUniformIndexing);
					else if (builder.getTypeDimensionality(type_id) == spv::DimBuffer)
						builder.addCapability(spv::CapabilityUniformTexelBufferArrayNonUniformIndexing);
					else
						builder.addCapability(spv::CapabilitySampledImageArrayNonUniformIndexingEXT);
				}
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
		}
		break;
	}

	case DXIL::ResourceType::UAV:
	{
		if (resource_range == impl.ags.uav_magic_resource_type_index)
		{
			// Resources tied to constant uints are considered "magic".
			if (impl.ags.magic_ptr_id == 0)
			{
				spv::Id dummy_value = impl.spirv_module.allocate_id();
				impl.ags.magic_ptr_id = dummy_value;
			}

			impl.rewrite_value(instruction, impl.ags.magic_ptr_id);
			break;
		}

		auto &reference = get_resource_reference(impl, resource_type, instruction, resource_range);

		if (resource_is_physical_pointer(impl, reference))
		{
			spv::Id ptr_id = build_root_descriptor_load_physical_pointer(impl, reference);
			impl.rewrite_value(instruction, ptr_id);
			auto &meta = impl.handle_to_resource_meta[ptr_id];
			meta = {};
			meta.stride = reference.stride;
			meta.storage = spv::StorageClassPhysicalStorageBuffer;
			meta.physical_pointer_meta.coherent = reference.coherent;
			meta.physical_pointer_meta.rov = reference.rov;
			meta.kind = reference.resource_kind;
			meta.rov = reference.rov;
		}
		else
		{
			bool is_non_uniform = false;

			auto storage = get_resource_storage_class(impl, reference.var_id);
			DescriptorQATypeFlagBits descriptor_type;
			if (storage == spv::StorageClassStorageBuffer)
				descriptor_type = DESCRIPTOR_QA_TYPE_STORAGE_BUFFER_BIT;
			else if (resource_kind_is_buffer(reference.resource_kind))
				descriptor_type = DESCRIPTOR_QA_TYPE_STORAGE_TEXEL_BUFFER_BIT;
			else
				descriptor_type = DESCRIPTOR_QA_TYPE_STORAGE_IMAGE_BIT;

			Vector<Converter::Impl::RawDeclarationVariable> raw_declarations;
			spv::Id loaded_id = 0;
			spv::Id offset_id = 0;
			spv::Id resource_id = 0;
			spv::Id resource_ptr_id = 0;
			raw_declarations.reserve(reference.var_alias_group.size());

			if (reference.var_id)
			{
				resource_id = reference.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type, instruction,
				                                instruction_offset, non_uniform, is_non_uniform, &resource_ptr_id,
				                                &loaded_id, &offset_id))
				{
					LOGE("Failed to load UAV resource handle.\n");
					return false;
				}
			}

			for (auto &alias : reference.var_alias_group)
			{
				resource_id = alias.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type,
												instruction, instruction_offset, non_uniform, is_non_uniform,
												nullptr, &loaded_id, &offset_id))
				{
					LOGE("Failed to load UAV resource handle.\n");
					return false;
				}

				raw_declarations.push_back({ alias.declaration, loaded_id });
			}

			auto &incoming_meta = impl.handle_to_resource_meta[resource_id];

			spv::Id offset_buffer_id = get_offset_buffer_variable(impl, resource_type, instruction, resource_range);
			if (offset_buffer_id)
			{
				offset_id = build_load_buffer_offset(impl, reference, incoming_meta,
				                                     offset_buffer_id, offset_id, non_uniform);
			}
			else
				offset_id = 0;

			auto &meta = impl.handle_to_resource_meta[loaded_id];
			meta = incoming_meta;
			meta.non_uniform = is_non_uniform;
			meta.index_offset_id = offset_id;
			meta.var_alias_group = std::move(raw_declarations);
			meta.aliased = reference.aliased;
			meta.rov = reference.rov;
			meta.physical_pointer_meta.coherent = reference.coherent;

			// Image atomics requires the pointer to image and not OpTypeImage directly.
			meta.var_id = resource_ptr_id;

			// The base array variable does not know what the stride is, promote that state here.
			if (reference.bindless)
				meta.stride = reference.stride;

			if (is_non_uniform)
			{
				spv::Id type_id = builder.getDerefTypeId(resource_id);
				type_id = builder.getContainedTypeId(type_id);

				if (meta.storage == spv::StorageClassStorageBuffer)
					builder.addCapability(spv::CapabilityStorageBufferArrayNonUniformIndexing);
				else if (builder.getTypeDimensionality(type_id) == spv::DimBuffer)
					builder.addCapability(spv::CapabilityStorageTexelBufferArrayNonUniformIndexing);
				else
					builder.addCapability(spv::CapabilityStorageImageArrayNonUniformIndexing);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}

			if (impl.llvm_values_using_update_counter.count(instruction) != 0)
			{
				auto &counter_reference = get_resource_counter_reference(impl, instruction, resource_range);

				if (counter_reference.bindless)
				{
					if (counter_reference.resource_kind == DXIL::ResourceKind::RawBuffer)
					{
						meta.counter_var_id = build_load_physical_pointer(impl, counter_reference, instruction_offset, instruction);
						meta.counter_is_physical_pointer = true;
					}
					else
					{
						if (!build_load_resource_handle(impl, counter_reference.var_id, reference,
						                                DESCRIPTOR_QA_TYPE_RAW_VA_BIT,
						                                instruction, instruction_offset, non_uniform,
						                                is_non_uniform, &meta.counter_var_id, nullptr, nullptr))
						{
							LOGE("Failed to load UAV counter pointer.\n");
							return false;
						}
						meta.counter_is_physical_pointer = false;
					}
				}
				else
				{
					meta.counter_var_id = counter_reference.var_id;
					meta.counter_is_physical_pointer = false;
				}
			}
		}
		break;
	}

	case DXIL::ResourceType::CBV:
	{
		auto &reference = get_resource_reference(impl, resource_type, instruction, resource_range);
		const LocalRootSignatureEntry *local_root_signature_entry = nullptr;
		if (reference.local_root_signature_entry >= 0)
			local_root_signature_entry = &impl.local_root_signature[reference.local_root_signature_entry];

		// Special case root constants since these resources point directly to
		// the push constant block or SBT and not to any concrete resource,
		// so we cannot deduce storage classes properly.

		if (resource_is_physical_pointer(impl, reference))
		{
			spv::Id ptr_id = build_root_descriptor_load_physical_pointer(impl, reference);
			auto &meta = impl.handle_to_resource_meta[ptr_id];
			meta = {};
			meta.stride = reference.stride;
			meta.storage = spv::StorageClassPhysicalStorageBuffer;
			meta.physical_pointer_meta.nonwritable = true;
			meta.kind = reference.resource_kind;
			impl.rewrite_value(instruction, ptr_id);
		}
		else if (reference.var_id != 0 && reference.var_id == impl.root_constant_id)
		{
			// Point directly to root constants.
			impl.rewrite_value(instruction, reference.var_id);
			unsigned member_offset = reference.push_constant_member;
			impl.handle_to_root_member_offset[instruction] = member_offset;
		}
		else if (local_root_signature_entry && local_root_signature_entry->type == LocalRootSignatureType::Constants)
		{
			// Access chain into the desired member once.
			spv::Id id = build_shader_record_access_chain(impl, reference.local_root_signature_entry);

			auto &meta = impl.handle_to_resource_meta[id];
			meta = {};
			meta.storage = spv::StorageClassShaderRecordBufferKHR;
			meta.kind = DXIL::ResourceKind::CBuffer;
			impl.handle_to_root_member_offset[instruction] = reference.local_root_signature_entry;
			impl.rewrite_value(instruction, id);
		}
		else
		{
			bool is_non_uniform = false;

			bool ssbo = reference.bindless && impl.options.bindless_cbv_ssbo_emulation;
			auto storage = ssbo ? spv::StorageClassStorageBuffer : spv::StorageClassUniform;
			auto descriptor_type = ssbo ? DESCRIPTOR_QA_TYPE_STORAGE_BUFFER_BIT : DESCRIPTOR_QA_TYPE_UNIFORM_BUFFER_BIT;

			Vector<Converter::Impl::RawDeclarationVariable> raw_declarations;
			spv::Id loaded_id = 0;
			spv::Id resource_id = 0;
			raw_declarations.reserve(reference.var_alias_group.size());

			if (reference.var_id)
			{
				resource_id = reference.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type, instruction,
												instruction_offset, non_uniform, is_non_uniform,
												nullptr, &loaded_id, nullptr))
				{
					LOGE("Failed to load CBV resource handle.\n");
					return false;
				}
			}

			for (auto &alias : reference.var_alias_group)
			{
				resource_id = alias.var_id;
				if (!build_load_resource_handle(impl, resource_id, reference, descriptor_type,
												instruction, instruction_offset, non_uniform, is_non_uniform,
												nullptr, &loaded_id, nullptr))
				{
					LOGE("Failed to load CBV resource handle.\n");
					return false;
				}

				raw_declarations.push_back({ alias.declaration, loaded_id });
			}

			auto &incoming_meta = impl.handle_to_resource_meta[resource_id];

			auto &meta = impl.handle_to_resource_meta[loaded_id];
			meta = incoming_meta;
			meta.non_uniform = is_non_uniform;
			meta.storage = storage;
			meta.var_alias_group = std::move(raw_declarations);
			meta.kind = DXIL::ResourceKind::CBuffer;

			if (is_non_uniform)
			{
				if (ssbo)
					builder.addCapability(spv::CapabilityStorageBufferArrayNonUniformIndexingEXT);
				else
					builder.addCapability(spv::CapabilityUniformBufferArrayNonUniformIndexingEXT);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
		}
		break;
	}

	case DXIL::ResourceType::Sampler:
	{
		auto &reference = get_resource_reference(impl, resource_type, instruction, resource_range);
		spv::Id base_sampler_id = reference.var_id;

		bool is_non_uniform = false;
		spv::Id loaded_id = 0;
		if (!build_load_resource_handle(impl, base_sampler_id, reference, DESCRIPTOR_QA_TYPE_SAMPLER_BIT, instruction,
		                                instruction_offset, non_uniform, is_non_uniform, nullptr, &loaded_id, nullptr))
		{
			LOGE("Failed to load Sampler resource handle.\n");
			return false;
		}

		auto &meta = impl.handle_to_resource_meta[loaded_id];
		meta = impl.handle_to_resource_meta[base_sampler_id];
		meta.non_uniform = is_non_uniform;

		if (is_non_uniform)
		{
			builder.addCapability(spv::CapabilitySampledImageArrayNonUniformIndexingEXT);
			builder.addExtension("SPV_EXT_descriptor_indexing");
		}
		break;
	}

	default:
		return false;
	}

	return true;
}

static bool resource_handle_needs_sink(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return impl.options.descriptor_qa_enabled &&
	       impl.options.descriptor_qa_sink_handles &&
	       impl.resource_handles_needing_sink.count(instruction);
}

bool emit_create_handle_for_lib_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Defer creating any handles since annotateHandle is actually going to do it.
	if (impl.llvm_annotate_handle_lib_uses.count(instruction))
		return true;

	if (resource_handle_needs_sink(impl, instruction))
	{
		impl.resource_handles_needing_sink.erase(impl.resource_handles_needing_sink.find(instruction));
		return true;
	}

	auto itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getOperand(1));
	if (itr == impl.llvm_global_variable_to_resource_mapping.end())
		return false;

	return emit_create_handle(impl, instruction, itr->second.type,
	                          itr->second.meta_index, itr->second.offset, itr->second.non_uniform);
}

bool emit_create_handle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (resource_handle_needs_sink(impl, instruction))
	{
		impl.resource_handles_needing_sink.erase(impl.resource_handles_needing_sink.find(instruction));
		return true;
	}

	uint32_t resource_type_operand, resource_range;

	if (!get_constant_operand(instruction, 1, &resource_type_operand))
		return false;
	if (!get_constant_operand(instruction, 2, &resource_range))
		return false;

	uint32_t non_uniform = 0;
	get_constant_operand(instruction, 4, &non_uniform);

	auto resource_type = static_cast<DXIL::ResourceType>(resource_type_operand);
	return emit_create_handle(impl, instruction, resource_type, resource_range,
	                          instruction->getOperand(3), non_uniform != 0);
}

bool emit_create_handle_from_heap_instruction(Converter::Impl &, const llvm::CallInst *)
{
	// Do nothing here. We cannot emit code before annotateHandle.
	return true;
}

bool emit_create_handle_from_binding_instruction(Converter::Impl &, const llvm::CallInst *)
{
	// Do nothing here. We cannot emit code before annotateHandle.
	return true;
}

bool get_annotate_handle_meta(Converter::Impl &impl, const llvm::CallInst *instruction,
                              AnnotateHandleMeta &meta)
{
	auto *handle = llvm::dyn_cast<llvm::CallInst>(instruction->getOperand(1));
	if (!handle)
		return false;

	uint32_t opcode;
	if (!get_constant_operand(handle, 0, &opcode))
		return false;

	meta.resource_op = DXIL::Op(opcode);
	uint32_t non_uniform_int = 0;

	if (meta.resource_op == DXIL::Op::CreateHandleFromHeap)
	{
		auto &annotation = impl.llvm_annotate_handle_uses[instruction];
		meta.resource_type = annotation.resource_type;
		meta.binding_index = UINT32_MAX; // Direct heap access.

		meta.offset = handle->getOperand(1);

		if (!get_constant_operand(handle, 3, &non_uniform_int))
			return false;
	}
	else if (meta.resource_op == DXIL::Op::CreateHandleFromBinding)
	{
		meta.offset = handle->getOperand(2);

		if (!get_constant_operand(handle, 3, &non_uniform_int))
			return false;

		if (auto *res_type = llvm::dyn_cast<llvm::ConstantAggregate>(handle->getOperand(1)))
		{
			if (res_type->getNumOperands() != 4)
				return false;

			uint32_t binding_range_lo = res_type->getOperand(0)->getUniqueInteger().getZExtValue();
			uint32_t binding_range_hi = res_type->getOperand(1)->getUniqueInteger().getZExtValue();
			uint32_t binding_space = res_type->getOperand(2)->getUniqueInteger().getZExtValue();
			meta.resource_type = DXIL::ResourceType(res_type->getOperand(3)->getUniqueInteger().getZExtValue());
			meta.binding_index = impl.find_binding_meta_index(
				binding_range_lo, binding_range_hi,
				binding_space, meta.resource_type);

			if (meta.binding_index == UINT32_MAX)
				return false;
		}
		else if (llvm::isa<llvm::ConstantAggregateZero>(handle->getOperand(1)))
		{
			meta.resource_type = DXIL::ResourceType(0);
			meta.binding_index = impl.find_binding_meta_index(0, 0, 0, meta.resource_type);
			if (meta.binding_index == UINT32_MAX)
				return false;
		}
		else
			return false;
	}
	else if (meta.resource_op == DXIL::Op::CreateHandleForLib)
	{
		auto itr = impl.llvm_global_variable_to_resource_mapping.find(handle->getOperand(1));
		if (itr == impl.llvm_global_variable_to_resource_mapping.end())
			return false;

		// Marks that the CreateHandleForLib is a dummy and should not actually emit a resource handle.
		impl.llvm_annotate_handle_lib_uses.insert(instruction->getOperand(1));

		meta.resource_type = itr->second.type;
		meta.binding_index = itr->second.meta_index;
		meta.offset = itr->second.offset;
		non_uniform_int = uint32_t(itr->second.non_uniform);
	}
	else
		return false;

	meta.non_uniform = non_uniform_int != 0;
	return true;
}

bool emit_annotate_handle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (resource_handle_needs_sink(impl, instruction))
	{
		impl.resource_handles_needing_sink.erase(impl.resource_handles_needing_sink.find(instruction));
		return true;
	}

	AnnotateHandleMeta meta = {};
	if (!get_annotate_handle_meta(impl, instruction, meta))
		return false;

	return emit_create_handle(impl, instruction, meta.resource_type,
	                          meta.binding_index, meta.offset, meta.non_uniform);
}

static bool build_bitcast_32x4_to_16x8_composite(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                 spv::Id loaded_id)
{
	auto &builder = impl.builder();

	Vector<spv::Id> member_types(8);
	spv::Id type_id = impl.get_type_id(instruction->getType()->getStructElementType(0));
	for (auto &type : member_types)
		type = type_id;

	spv::Id vec2_type_id = builder.makeVectorType(type_id, 2);

	spv::Id u32_composites[4];
	for (unsigned i = 0; i < 4; i++)
	{
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, builder.makeFloatType(32));
		extract_op->add_id(loaded_id);
		extract_op->add_literal(i);
		impl.add(extract_op);
		u32_composites[i] = extract_op->id;
	}

	spv::Id u16_composites[8];
	for (unsigned i = 0; i < 4; i++)
	{
		auto *bitcast_op = impl.allocate(spv::OpBitcast, vec2_type_id);
		bitcast_op->add_id(u32_composites[i]);
		impl.add(bitcast_op);

		for (unsigned j = 0; j < 2; j++)
		{
			auto *extract = impl.allocate(spv::OpCompositeExtract, type_id);
			extract->add_id(bitcast_op->id);
			extract->add_literal(j);
			impl.add(extract);
			u16_composites[2 * i + j] = extract->id;
		}
	}

	spv::Id struct_type_id = impl.get_struct_type(member_types, "CBVComposite16x8");
	auto *composite = impl.allocate(spv::OpCompositeConstruct, struct_type_id);
	for (auto &comp : u16_composites)
		composite->add_id(comp);
	impl.add(composite);
	impl.rewrite_value(instruction, composite->id);
	return true;
}

static bool emit_cbuffer_load_physical_pointer(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	bool scalar_load = instruction->getType()->getTypeID() != llvm::Type::TypeID::StructTyID;
	unsigned scalar_alignment;
	uint32_t alignment;

	const llvm::Type *result_component_type;

	if (!scalar_load)
	{
		result_component_type = instruction->getType()->getStructElementType(0);
		scalar_alignment = get_type_scalar_alignment(impl, result_component_type);
		alignment = 16;
	}
	else
	{
		// DXIL emits the alignment, but we cannot trust it, DXC is completely buggy here and emits
		// obviously bogus alignment values.
		// Use scalar alignment.
		result_component_type = instruction->getType();
		alignment = get_type_scalar_alignment(impl, instruction->getType());
		scalar_alignment = alignment;
	}

	// Handle min16float where we want FP16 value, but FP32 physical.
	spv::Op value_cast_op = spv::OpNop;
	spv::Id physical_type_id = 0;
	get_physical_load_store_cast_info(impl, result_component_type, physical_type_id, value_cast_op);

	spv::Id index_id;

	if (!scalar_load)
	{
		index_id = impl.get_id_for_value(instruction->getOperand(2));
	}
	else
	{
		unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, instruction->getType());
		index_id = build_index_divider(impl, instruction->getOperand(2), addr_shift_log2, 1);
	}

	auto *result_type = instruction->getType();
	unsigned physical_vecsize;
	spv::Id result_type_id;

	if (scalar_load)
	{
		result_type_id = impl.get_type_id(result_type);
		physical_vecsize = 1;
	}
	else
	{
		if (scalar_alignment != 2)
		{
			physical_vecsize = 16 / scalar_alignment;
			result_type_id = builder.makeVectorType(physical_type_id, physical_vecsize);
		}
		else
		{
			result_type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
			physical_vecsize = 4;
		}
	}

	Converter::Impl::PhysicalPointerMeta ptr_meta = {};
	ptr_meta.nonwritable = true;
	ptr_meta.stride = alignment;
	ptr_meta.size = 64 * 1024;
	spv::Id ptr_type_id = impl.get_physical_pointer_block_type(result_type_id, ptr_meta);

	spv::Id loaded_id;

	if (impl.options.robust_physical_cbv && !llvm::isa<llvm::ConstantInt>(instruction->getOperand(2)))
	{
		spv::Id call_id = impl.spirv_module.get_robust_physical_cbv_load_call_id(result_type_id, ptr_type_id, alignment);
		auto *call_op = impl.allocate(spv::OpFunctionCall, result_type_id);
		call_op->add_id(call_id);
		call_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		call_op->add_id(index_id);
		impl.add(call_op);
		loaded_id = call_op->id;
		impl.rewrite_value(instruction, loaded_id);
	}
	else
	{
		auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
		ptr_bitcast_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(ptr_bitcast_op);

		// Out of bounds is undefined behavior for root descriptors.
		// Allows a compiler to assume that the index is unsigned and multiplying by stride does not overflow 32-bit space.
		auto *chain_op = impl.allocate(spv::OpInBoundsAccessChain,
		                               builder.makePointer(spv::StorageClassPhysicalStorageBuffer, result_type_id));
		chain_op->add_id(ptr_bitcast_op->id);
		chain_op->add_id(builder.makeUintConstant(0));
		chain_op->add_id(index_id);
		impl.add(chain_op);

		auto *load_op = impl.allocate(spv::OpLoad, instruction, result_type_id);
		load_op->add_id(chain_op->id);
		load_op->add_literal(spv::MemoryAccessAlignedMask);
		load_op->add_literal(alignment);
		impl.add(load_op);
		loaded_id = load_op->id;
	}

	// Handle f16x8 loads.
	if (!scalar_load && scalar_alignment == 2)
		return build_bitcast_32x4_to_16x8_composite(impl, instruction, loaded_id);
	else if (value_cast_op != spv::OpNop)
	{
		spv::Id type_id = impl.get_type_id(result_component_type);
		if (physical_vecsize != 1)
			type_id = builder.makeVectorType(type_id, physical_vecsize);
		auto *cast_op = impl.allocate(value_cast_op, type_id);
		cast_op->add_id(impl.get_id_for_value(instruction));
		impl.add(cast_op);
		impl.rewrite_value(instruction, cast_op->id);
	}

	build_exploded_composite_from_vector(impl, instruction, 4);

	return true;
}

static bool emit_cbuffer_load_from_uints(Converter::Impl &impl, const llvm::CallInst *instruction,
                                         spv::Id base_ptr,
                                         spv::StorageClass storage,
                                         unsigned index_offset, unsigned num_elements)
{
	auto &builder = impl.builder();

	auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(2));
	if (!constant_int)
	{
		LOGE("Cannot dynamically index into root constants.\n");
		return false;
	}

	// CBufferLoad vs CBufferLoadLegacy
	bool scalar_load = instruction->getType()->getTypeID() != llvm::Type::TypeID::StructTyID;
	auto member_index = unsigned(constant_int->getUniqueInteger().getZExtValue());

	// In scalar load, we index by byte offset. Ignore alignment, we read from registers.
	if (scalar_load)
	{
		if (member_index % 4)
		{
			LOGE("Scalar CBufferLoad on root constant buffer is not aligned to 4 bytes.\n");
			return false;
		}
		member_index /= 4;

		if (get_type_scalar_alignment(impl, instruction->getType()) != 4)
		{
			LOGE("Attempting to use root constant buffer with non-32bit type.\n");
			return false;
		}
	}
	else
	{
		// In legacy load, we index in terms of float4[]s.
		member_index *= 4;

		if (get_type_scalar_alignment(impl, instruction->getType()->getStructElementType(0)) != 4)
		{
			LOGE("Attempting to use root constant buffer with non-32bit type.\n");
			return false;
		}
	}

	member_index += index_offset;

	if (member_index >= num_elements)
	{
		LOGE("Root constant CBV is accessed out of bounds. (%u > %u).\n", member_index, num_elements);
		return false;
	}

	unsigned num_words = std::min(scalar_load ? 1u : 4u, num_elements - member_index);

	auto *result_scalar_type = instruction->getType();
	if (!scalar_load)
		result_scalar_type = result_scalar_type->getStructElementType(0);

	// Root constants are emitted as uints as they are typically used as indices.
	bool need_bitcast = result_scalar_type->getTypeID() != llvm::Type::TypeID::IntegerTyID;

	spv::Id elements[4];
	for (unsigned i = 0; i < 4; i++)
	{
		if (i < num_words)
		{
			auto *op = impl.allocate(spv::OpAccessChain,
			                         builder.makePointer(storage == spv::StorageClassPushConstant && impl.options.inline_ubo_enable ?
			                                             spv::StorageClassUniform : storage,
			                                             builder.makeUintType(32)));

			op->add_id(base_ptr);
			op->add_id(builder.makeUintConstant(member_index + i));
			impl.add(op);

			auto *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
			load_op->add_id(op->id);
			impl.add(load_op);
			elements[i] = load_op->id;
		}
		else if (!scalar_load)
			elements[i] = builder.makeUintConstant(0);
	}

	spv::Id id;

	if (scalar_load)
		id = elements[0];
	else
		id = impl.build_vector(builder.makeUintType(32), elements, 4);

	spv::Op value_cast_op = spv::OpNop;
	spv::Id physical_type_id = 0;
	get_physical_load_store_cast_info(impl, result_scalar_type, physical_type_id, value_cast_op);

	if (need_bitcast)
	{
		spv::Id type_id = physical_type_id;
		if (!scalar_load)
			type_id = builder.makeVectorType(type_id, 4);

		auto *op = impl.allocate(spv::OpBitcast, instruction, type_id);
		op->add_id(id);
		impl.add(op);
		id = op->id;
	}
	else
	{
		impl.rewrite_value(instruction, id);
	}

	// To handle min16 types in root constants, we might have to narrow here.
	if (value_cast_op != spv::OpNop)
	{
		spv::Id type_id = impl.get_type_id(result_scalar_type);
		if (!scalar_load)
			type_id = builder.makeVectorType(type_id, 4);

		auto *cast_op = impl.allocate(value_cast_op, type_id);
		cast_op->add_id(id);
		impl.add(cast_op);
		impl.rewrite_value(instruction, cast_op->id);
	}

	build_exploded_composite_from_vector(impl, instruction, 4);

	return true;
}

static bool emit_cbuffer_load_shader_record(Converter::Impl &impl, const llvm::CallInst *instruction,
                                            unsigned local_root_signature_entry)
{
	auto &entry = impl.local_root_signature[local_root_signature_entry];
	return emit_cbuffer_load_from_uints(impl, instruction,
	                                    impl.get_id_for_value(instruction->getOperand(1)),
	                                    spv::StorageClassShaderRecordBufferKHR,
	                                    0, entry.constants.num_words);
}

static bool emit_cbuffer_load_root_constant(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_cbuffer_load_from_uints(impl, instruction,
	                                    impl.root_constant_id,
	                                    spv::StorageClassPushConstant,
	                                    impl.handle_to_root_member_offset[instruction->getOperand(1)],
	                                    impl.root_constant_num_words + impl.root_descriptor_count);
}

bool cbuffer_supports_gep_punchthrough(Converter::Impl &impl, const llvm::Value *cbv_handle)
{
	auto itr = impl.llvm_value_to_cbv_resource_index_map.find(cbv_handle);

	// Bindless, cannot be push constant or local root sig.
	if (itr == impl.llvm_value_to_cbv_resource_index_map.end())
		return true;

	auto &ref = impl.cbv_index_to_reference[itr->second];

	// Block root constants for local root signatures as well.
	if (ref.local_root_signature_entry >= 0)
	{
		auto &entry = impl.local_root_signature[ref.local_root_signature_entry];
		return entry.type != LocalRootSignatureType::Constants;
	}

	if (ref.var_id != 0 && ref.var_id == impl.root_constant_id &&
	    !resource_is_physical_pointer(impl, ref))
	{
		return false;
	}

	// Root descriptor and table descriptors are fine.
	return true;
}

bool emit_gep_as_cbuffer_scalar_offset(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction,
                                       const llvm::Value *cbv_handle, uint32_t scalar_index_offset, uint32_t stride)
{
	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(cbv_handle);
	if (!ptr_id)
		return false;

	auto &meta = impl.handle_to_resource_meta[ptr_id];

	// We should have guarded against this.
	// Guard against shader record buffer to avoid having to deal with bitcasting.
	if (ptr_id == impl.root_constant_id || meta.storage == spv::StorageClassShaderRecordBufferKHR)
		return false;

	spv::Id array_index_id = impl.get_id_for_value(instruction->getOperand(2));

	if (stride != 1)
	{
		auto *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		mul_op->add_id(array_index_id);
		mul_op->add_id(builder.makeUintConstant(stride));
		impl.add(mul_op);
		array_index_id = mul_op->id;
	}

	if (scalar_index_offset != 0)
	{
		auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(array_index_id);
		add_op->add_id(builder.makeUintConstant(scalar_index_offset));
		impl.add(add_op);
		array_index_id = add_op->id;
	}

	const auto *elem_type = instruction->getType()->getPointerElementType();
	spv::Id result_type_id = impl.get_type_id(elem_type);

	if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
	{
		Converter::Impl::PhysicalPointerMeta ptr_meta = {};
		ptr_meta.nonwritable = true;
		ptr_meta.stride = 4;
		ptr_meta.size = 64 * 1024;
		spv::Id ptr_type_id = impl.get_physical_pointer_block_type(result_type_id, ptr_meta);

		auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
		ptr_bitcast_op->add_id(ptr_id);
		impl.add(ptr_bitcast_op);

		auto *chain_op = impl.allocate(spv::OpInBoundsAccessChain, instruction,
		                               builder.makePointer(spv::StorageClassPhysicalStorageBuffer, result_type_id));
		chain_op->add_id(ptr_bitcast_op->id);
		chain_op->add_id(builder.makeUintConstant(0));
		chain_op->add_id(array_index_id);
		impl.add(chain_op);
	}
	else
	{
		RawType raw_type = elem_type->isIntegerTy() ? RawType::Integer : RawType::Float;
		ptr_id = get_buffer_alias_handle(impl, meta, ptr_id, raw_type, RawWidth::B32, RawVecSize::V1);

		Operation *access_chain_op = impl.allocate(
		    spv::OpAccessChain, instruction, builder.makePointer(meta.storage, impl.get_type_id(elem_type)));
		access_chain_op->add_ids({ ptr_id, builder.makeUintConstant(0), array_index_id });
		impl.add(access_chain_op);
	}

	return true;
}

bool emit_cbuffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// This always returns a scalar.
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	if (!ptr_id)
		return false;

	if (ptr_id == impl.root_constant_id)
	{
		return emit_cbuffer_load_root_constant(impl, instruction);
	}
	else
	{
		auto &meta = impl.handle_to_resource_meta[ptr_id];

		if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
		{
			return emit_cbuffer_load_physical_pointer(impl, instruction);
		}
		else if (meta.storage == spv::StorageClassShaderRecordBufferKHR)
		{
			return emit_cbuffer_load_shader_record(impl, instruction,
												   impl.handle_to_root_member_offset[instruction->getOperand(1)]);
		}

		// Handle min16float where we want FP16 value, but FP32 physical.
		spv::Op value_cast_op = spv::OpNop;
		spv::Id physical_type_id = 0;
		get_physical_load_store_cast_info(impl, instruction->getType(), physical_type_id, value_cast_op);

		unsigned addr_shift;
		RawWidth raw_width;
		switch (get_type_scalar_alignment(impl, instruction->getType()))
		{
		case 2:
			raw_width = RawWidth::B16;
			addr_shift = 1;
			break;

		case 4:
			raw_width = RawWidth::B32;
			addr_shift = 2;
			break;

		case 8:
			raw_width = RawWidth::B64;
			addr_shift = 3;
			break;

		default:
			return false;
		}

		RawType raw_type = instruction->getType()->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
		                   raw_width == RawWidth::B64 ?
		                   RawType::Integer : RawType::Float;

		unsigned raw_bits = raw_width_to_bits(raw_width);
		ptr_id = get_buffer_alias_handle(impl, meta, ptr_id, raw_type, raw_width, RawVecSize::V1);

		spv::Id array_index_id = build_index_divider(impl, instruction->getOperand(2), addr_shift, 1);

		spv::Id element_type_id = raw_type == RawType::Integer ?
		    builder.makeUintType(raw_bits) : builder.makeFloatType(raw_bits);

		Operation *access_chain_op = impl.allocate(
				spv::OpAccessChain, builder.makePointer(meta.storage, element_type_id));
		access_chain_op->add_ids({ ptr_id, builder.makeUintConstant(0), array_index_id });
		impl.add(access_chain_op);

		if (meta.non_uniform)
			builder.addDecoration(access_chain_op->id, spv::DecorationNonUniformEXT);

		bool need_bitcast = false;
		auto *result_type = instruction->getType();
		if (result_type->getTypeID() == llvm::Type::TypeID::IntegerTyID && raw_width != RawWidth::B64)
			need_bitcast = true;

		Operation *load_op = impl.allocate(spv::OpLoad, instruction, element_type_id);
		load_op->add_id(access_chain_op->id);
		impl.add(load_op);

		if (need_bitcast)
		{
			Operation *op = impl.allocate(spv::OpBitcast, builder.makeUintType(raw_bits));
			op->add_id(load_op->id);
			impl.add(op);
			impl.rewrite_value(instruction, op->id);
		}

		// Handle min16float4 value cast scenarios.
		if (value_cast_op != spv::OpNop)
		{
			auto *cast_op = impl.allocate(value_cast_op, impl.get_type_id(instruction->getType()));
			cast_op->add_id(impl.get_id_for_value(instruction));
			impl.add(cast_op);
			impl.rewrite_value(instruction, cast_op->id);
		}

		build_exploded_composite_from_vector(impl, instruction, 4);

		return true;
	}
}

bool emit_cbuffer_load_legacy_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// This function returns a struct, but ignore that, and just return a vec4 for now.
	// extractvalue is used to pull out components and that works for vectors as well.
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	if (!ptr_id)
		return false;

	if (ptr_id == impl.root_constant_id)
	{
		return emit_cbuffer_load_root_constant(impl, instruction);
	}
	else
	{
		auto &meta = impl.handle_to_resource_meta[ptr_id];

		auto *result_type = instruction->getType();

		if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
		{
			LOGE("CBufferLoadLegacy: return type must be struct.\n");
			return false;
		}

		if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
		{
			return emit_cbuffer_load_physical_pointer(impl, instruction);
		}
		else if (meta.storage == spv::StorageClassShaderRecordBufferKHR)
		{
			return emit_cbuffer_load_shader_record(impl, instruction,
			                                       impl.handle_to_root_member_offset[instruction->getOperand(1)]);
		}

		// Handle min16float where we want FP16 value, but FP32 physical.
		auto *result_component_type = result_type->getStructElementType(0);
		spv::Op value_cast_op = spv::OpNop;
		spv::Id physical_type_id = 0;
		get_physical_load_store_cast_info(impl, result_component_type, physical_type_id, value_cast_op);

		RawVecSize alias_vecsize;
		RawWidth alias_width;
		unsigned scalar_alignment = get_type_scalar_alignment(impl, result_component_type);
		unsigned bits, vecsize;

		if (scalar_alignment == 8)
		{
			alias_width = RawWidth::B64;
			alias_vecsize = RawVecSize::V2;
		}
		else
		{
			alias_width = RawWidth::B32;
			alias_vecsize = RawVecSize::V4;
		}

		bits = raw_width_to_bits(alias_width);
		vecsize = raw_vecsize_to_vecsize(alias_vecsize);

		RawType raw_type = result_component_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
		                   scalar_alignment == 8 ? RawType::Integer : RawType::Float;

		ptr_id = get_buffer_alias_handle(impl, meta, ptr_id, raw_type, alias_width, alias_vecsize);

		spv::Id vec4_index = impl.get_id_for_value(instruction->getOperand(2));

		spv::Id element_type_id = raw_type == RawType::Integer ?
		                          builder.makeUintType(bits) : builder.makeFloatType(bits);

		spv::Id vector_type_id = builder.makeVectorType(element_type_id, vecsize);
		Operation *access_chain_op = impl.allocate(spv::OpAccessChain, builder.makePointer(meta.storage, vector_type_id));
		access_chain_op->add_ids({ ptr_id, builder.makeUintConstant(0), vec4_index });
		impl.add(access_chain_op);

		if (meta.non_uniform)
			builder.addDecoration(access_chain_op->id, spv::DecorationNonUniformEXT);

		bool need_bitcast = false;
		if (result_type->getStructElementType(0)->getTypeID() == llvm::Type::TypeID::IntegerTyID && scalar_alignment < 8)
			need_bitcast = true;

		Operation *load_op = impl.allocate(spv::OpLoad, instruction, vector_type_id);
		load_op->add_id(access_chain_op->id);
		impl.add(load_op);

		if (scalar_alignment == 2)
		{
			// Special case, need to bitcast and build a struct with 8 elements instead.
			if (!build_bitcast_32x4_to_16x8_composite(impl, instruction, load_op->id))
				return false;
		}
		else if (need_bitcast)
		{
			spv::Id uint_vector_type_id = builder.makeVectorType(builder.makeUintType(bits), vecsize);
			Operation *op = impl.allocate(spv::OpBitcast, uint_vector_type_id);

			op->add_id(load_op->id);
			impl.add(op);
			impl.rewrite_value(instruction, op->id);
		}

		// If we have min-precision loads, we might have to truncate here.
		if (value_cast_op != spv::OpNop)
		{
			auto *cast_op = impl.allocate(value_cast_op, builder.makeVectorType(impl.get_type_id(result_component_type), vecsize));
			cast_op->add_id(impl.get_id_for_value(instruction));
			impl.add(cast_op);
			impl.rewrite_value(instruction, cast_op->id);
		}

		build_exploded_composite_from_vector(impl, instruction, 4);
	}

	return true;
}

bool resource_handle_is_uniform_readonly_descriptor(Converter::Impl &impl, const llvm::Value *value)
{
	spv::Id ptr_id = impl.get_id_for_value(value);
	if (!ptr_id)
		return false;

	auto &meta = impl.handle_to_resource_meta[ptr_id];

	// Root constants must be wave uniform unless waves are merged across different state calls which is ridiculous.
	// Anything loaded from record buffer is probably not wave uniform;
	// waves are merged arbitrarily, so we cannot assume anything.
	if (ptr_id == impl.root_constant_id)
		return true;

	// Only consider an untyped load to be uniform.
	// There are reasonable use cases for scalaizing a typed load,
	// since those tend to never go through scalar caches.
	if (meta.storage != spv::StorageClassPhysicalStorageBuffer &&
	    meta.storage != spv::StorageClassStorageBuffer &&
	    meta.storage != spv::StorageClassUniform)
	{
		return false;
	}

	auto *instruction = llvm::cast<llvm::CallInst>(value);
	Converter::Impl::ResourceReference *reference = nullptr;
	DXIL::ResourceType resource_type = {};

	if (value_is_dx_op_instrinsic(value, DXIL::Op::CreateHandle))
	{
		uint32_t resource_type_operand, resource_range;
		if (!get_constant_operand(instruction, 1, &resource_type_operand))
			return false;
		if (!get_constant_operand(instruction, 2, &resource_range))
			return false;

		resource_type = static_cast<DXIL::ResourceType>(resource_type_operand);
		reference = &get_resource_reference(impl, resource_type, instruction, resource_range);
	}
	else if (value_is_dx_op_instrinsic(value, DXIL::Op::CreateHandleForLib))
	{
		auto itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getOperand(1));
		if (itr == impl.llvm_global_variable_to_resource_mapping.end())
			return false;
		resource_type = itr->second.type;
		reference = &get_resource_reference(impl, itr->second.type, instruction, itr->second.meta_index);
	}
	else if (value_is_dx_op_instrinsic(value, DXIL::Op::AnnotateHandle))
	{
		AnnotateHandleMeta annotate_meta = {};
		if (!get_annotate_handle_meta(impl, instruction, annotate_meta))
			return false;
		resource_type = annotate_meta.resource_type;
		reference = &get_resource_reference(impl, annotate_meta.resource_type, instruction, annotate_meta.binding_index);
	}

	if (resource_type != DXIL::ResourceType::SRV && resource_type != DXIL::ResourceType::CBV)
		return false;

	if (!reference)
		return false;

	// Anything referencing local root signature is questionable to assume anything about.
	if (reference->local_root_signature_entry >= 0)
		return false;

	// For any array, be afraid. Even if the index is dynamically uniform, it might become not wave uniform
	// due to multi-draw shenanigans. A constant index would work, but that's going a bit too far for
	// a simple peephole ...
	if (reference->base_resource_is_array)
		return false;

	return true;
}
} // namespace dxil_spv
