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

#include "dxil_buffer.hpp"
#include "opcodes/converter_impl.hpp"
#include "logging.hpp"
#include "dxil_sampling.hpp"

namespace DXIL2SPIRV
{
BufferAccessInfo build_buffer_access(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                     const llvm::CallInst *instruction, unsigned operand_offset)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];

	spv::Id index_id = impl.get_id_for_value(instruction->getOperand(2 + operand_offset));
	unsigned num_components = 4;

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		// For raw buffers, the index is in bytes. Since we only consider bytes, shift by 4.
		Operation op;
		op.op = spv::OpShiftRightLogical;
		op.id = impl.allocate_id();
		op.type_id = builder.makeUintType(32);
		op.arguments = { index_id, builder.makeUintConstant(2) };
		index_id = op.id;
		ops.push_back(std::move(op));
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		unsigned constant_offset = 0;
		spv::Id offset_id = impl.get_id_for_value(instruction->getOperand(3 + operand_offset));
		bool has_constant_offset = false;
		if (llvm::isa<llvm::ConstantInt>(instruction->getOperand(3 + operand_offset)))
		{
			constant_offset = unsigned(llvm::cast<llvm::ConstantInt>(
					instruction->getOperand(3 + operand_offset))->getUniqueInteger().getZExtValue());
			has_constant_offset = true;
		}

		num_components = std::min(4u, (meta.stride - constant_offset) / 4);

		Operation op;

		if (meta.stride != 4)
		{
			op.op = spv::OpIMul;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { index_id, builder.makeUintConstant(meta.stride / 4) };
			index_id = op.id;
			ops.push_back(std::move(op));
		}

		if (has_constant_offset)
		{
			if (constant_offset != 0)
			{
				op = {};
				op.op = spv::OpIAdd;
				op.id = impl.allocate_id();
				op.type_id = builder.makeUintType(32);
				op.arguments = { index_id, builder.makeUintConstant(constant_offset / 4) };
				index_id = op.id;
				ops.push_back(std::move(op));
			}
		}
		else
		{
			// Dynamically offset into the structured element.
			op = {};
			op.op = spv::OpShiftRightLogical;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { offset_id, builder.makeUintConstant(2) };
			offset_id = op.id;
			ops.push_back(std::move(op));

			op = {};
			op.op = spv::OpIAdd;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { index_id, offset_id };
			index_id = op.id;
			ops.push_back(std::move(op));
		}
	}

	return { index_id, num_components };
}

bool emit_buffer_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	bool is_uav = builder.isStorageImageType(image_type_id);
	const auto &meta = impl.handle_to_resource_meta[image_id];
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	auto access = build_buffer_access(ops, impl, builder, instruction);
	auto *result_type = instruction->getType();

	if (!is_typed)
	{
		// Unroll 4 loads. Ideally, we'd probably use physical_storage_buffer here, but unfortunately we have no indication
		// how many components we need to load here, and the number of components we load is not necessarily constant,
		// so we cannot reliably encode this information in the SRV.
		// The best we can do is to infer it from stride if we can.

		// For raw buffers, we have no stride information, so assume we need to load 4 components.
		// Hopefully compiler can eliminate loads which are never used ...
		unsigned conservative_num_elements = access.num_components;

		spv::Id component_ids[4] = {};

		spv::Id extracted_id_type = builder.makeUintType(32);
		spv::Id loaded_id_type = builder.makeVectorType(extracted_id_type, 4);

		for (unsigned i = 0; i < conservative_num_elements; i++)
		{
			spv::Id loaded_id = impl.allocate_id();
			spv::Id extracted_id = impl.allocate_id();

			Operation op;
			op.op = is_uav ? spv::OpImageRead : spv::OpImageFetch;
			op.id = loaded_id;
			op.type_id = loaded_id_type;
			op.arguments = { image_id, impl.build_offset(ops, access.index_id, i) };
			ops.push_back(std::move(op));

			op = {};
			op.op = spv::OpCompositeExtract;
			op.id = extracted_id;
			op.type_id = extracted_id_type;
			op.arguments = { loaded_id, 0 };
			ops.push_back(std::move(op));

			component_ids[i] = extracted_id;
		}

		bool need_bitcast = result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::IntegerTyID;
		spv::Id construct_id = need_bitcast ? impl.allocate_id() : impl.get_id_for_value(instruction);

		Operation op;
		op.op = spv::OpCompositeConstruct;
		op.id = construct_id;
		op.type_id = builder.makeVectorType(extracted_id_type, conservative_num_elements);
		op.arguments.insert(op.arguments.end(), component_ids, component_ids + conservative_num_elements);
		ops.push_back(std::move(op));

		if (need_bitcast)
		{
			op = {};
			op.op = spv::OpBitcast;
			op.id = impl.get_id_for_value(instruction);
			op.type_id = impl.get_type_id(result_type->getStructElementType(0));
			op.type_id = builder.makeVectorType(op.type_id, conservative_num_elements);
			op.arguments = { construct_id };
			ops.push_back(std::move(op));
		}
	}
	else
	{
		Operation op;
		op.op = is_uav ? spv::OpImageRead : spv::OpImageFetch;
		op.id = impl.get_id_for_value(instruction);

		op.type_id = impl.get_type_id(meta.component_type, 1, 4);
		op.arguments = { image_id, access.index_id };
		ops.push_back(std::move(op));

		// Deal with loads from signed resources.
		impl.fixup_load_sign(ops, meta.component_type, 4, instruction);
	}

	if (is_uav && is_typed)
		builder.addCapability(spv::CapabilityStorageImageReadWithoutFormat);

	return true;
}

bool emit_buffer_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	auto access = build_buffer_access(ops, impl, builder, instruction);

	spv::Id store_values[4] = {};
	unsigned mask = llvm::cast<llvm::ConstantInt>(instruction->getOperand(8))->getUniqueInteger().getZExtValue();
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	for (unsigned i = 0; i < 4; i++)
	{
		store_values[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
		if (!is_typed && (mask & (1u << i)))
		{
			if (instruction->getOperand(4 + i)->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
			{
				Operation op;
				op.op = spv::OpBitcast;
				op.type_id = builder.makeUintType(32);
				op.id = impl.allocate_id();
				op.arguments = { store_values[i] };
				store_values[i] = op.id;
				ops.push_back(std::move(op));
			}
		}
	}

	if (is_typed)
	{
		spv::Id element_type_id = impl.get_type_id(instruction->getOperand(4)->getType());

		Operation op;
		op.op = spv::OpImageWrite;
		op.arguments = {
				image_id, access.index_id,
				impl.build_vector(ops, element_type_id, store_values, 4)
		};

		// Deal with signed resource store.
		op.arguments[2] = impl.fixup_store_sign(ops, meta.component_type, 4, op.arguments[2]);
		ops.push_back(std::move(op));
	}
	else
	{
		spv::Id splat_type_id = builder.makeVectorType(builder.makeUintType(32), 4);
		for (unsigned i = 0; i < 4; i++)
		{
			if (mask & (1u << i))
			{
				spv::Id splat_id = impl.allocate_id();

				Operation op;
				op.op = spv::OpCompositeConstruct;
				op.type_id = splat_type_id;
				op.id = splat_id;
				op.arguments = { store_values[i], store_values[i], store_values[i], store_values[i] };
				ops.push_back(std::move(op));

				op = {};
				op.op = spv::OpImageWrite;
				op.arguments = {
						image_id, impl.build_offset(ops, access.index_id, i),
						splat_id,
				};
				ops.push_back(std::move(op));
			}
		}
	}

	if (is_typed)
		builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	return true;
}

bool emit_atomic_binop_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	auto binop =
			static_cast<DXIL::AtomicBinOp>(llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getZExtValue());

	spv::Id coords[3] = {};

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	if (num_coords_full > 3)
		return false;

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer || meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		auto access = build_buffer_access(ops, impl, builder, instruction, 1);
		coords[0] = access.index_id;
	}
	else
	{
		for (uint32_t i = 0; i < num_coords_full; i++)
			coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));
	}
	spv::Id coord = impl.build_vector(ops, builder.makeUintType(32), coords, num_coords_full);

	spv::Id counter_ptr_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpImageTexelPointer;
		op.type_id = builder.makePointer(spv::StorageClassImage, impl.get_type_id(meta.component_type, 1, 1));
		op.id = counter_ptr_id;
		op.arguments = { meta.var_id, coord, builder.makeUintConstant(0) };
		ops.push_back(std::move(op));
	}

	Operation op;

	switch (binop)
	{
	case DXIL::AtomicBinOp::Exchange:
		op.op = spv::OpAtomicExchange;
		break;

	case DXIL::AtomicBinOp::IAdd:
		op.op = spv::OpAtomicIAdd;
		break;

	case DXIL::AtomicBinOp::And:
		op.op = spv::OpAtomicAnd;
		break;

	case DXIL::AtomicBinOp::Or:
		op.op = spv::OpAtomicOr;
		break;

	case DXIL::AtomicBinOp::Xor:
		op.op = spv::OpAtomicXor;
		break;

	case DXIL::AtomicBinOp::IMin:
		op.op = spv::OpAtomicSMin;
		break;

	case DXIL::AtomicBinOp::IMax:
		op.op = spv::OpAtomicSMax;
		break;

	case DXIL::AtomicBinOp::UMin:
		op.op = spv::OpAtomicUMin;
		break;

	case DXIL::AtomicBinOp::UMax:
		op.op = spv::OpAtomicUMax;
		break;

	default:
		return false;
	}

	op.type_id = impl.get_type_id(meta.component_type, 1, 1);
	op.id = impl.get_id_for_value(instruction);
	op.arguments = {
			counter_ptr_id,
			builder.makeUintConstant(spv::ScopeDevice),
			builder.makeUintConstant(0), // Relaxed
			impl.fixup_store_sign(ops, meta.component_type, 1, impl.get_id_for_value(instruction->getOperand(6))),
	};

	ops.push_back(std::move(op));
	impl.fixup_load_sign(ops, meta.component_type, 1, instruction);
	return true;
}

bool emit_atomic_cmpxchg_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                     const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	spv::Id coords[3] = {};

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	if (num_coords_full > 3)
		return false;

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer || meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		auto access = build_buffer_access(ops, impl, builder, instruction);
		coords[0] = access.index_id;
	}
	else
	{
		for (uint32_t i = 0; i < num_coords_full; i++)
			coords[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	}

	spv::Id coord = impl.build_vector(ops, builder.makeUintType(32), coords, num_coords_full);

	spv::Id counter_ptr_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpImageTexelPointer;
		op.type_id = builder.makePointer(spv::StorageClassImage, impl.get_type_id(meta.component_type, 1, 1));
		op.id = counter_ptr_id;
		op.arguments = { meta.var_id, coord, builder.makeUintConstant(0) };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpAtomicCompareExchange;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(meta.component_type, 1, 1);

	spv::Id comparison_id = impl.get_id_for_value(instruction->getOperand(5));
	spv::Id new_value_id = impl.get_id_for_value(instruction->getOperand(6));
	comparison_id = impl.fixup_store_sign(ops, meta.component_type, 1, comparison_id);
	new_value_id = impl.fixup_store_sign(ops, meta.component_type, 1, new_value_id);

	op.arguments = {
			counter_ptr_id,
			builder.makeUintConstant(spv::ScopeDevice),
			builder.makeUintConstant(0), // Relaxed
			builder.makeUintConstant(0), // Relaxed
			new_value_id,
			comparison_id,
	};

	ops.push_back(std::move(op));
	impl.fixup_load_sign(ops, meta.component_type, 1, instruction);
	return true;
}

bool emit_buffer_update_counter_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                            const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	int direction = llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getSExtValue();

	spv::Id counter_ptr_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpImageTexelPointer;
		op.type_id = builder.makePointer(spv::StorageClassImage, builder.makeUintType(32));
		op.id = counter_ptr_id;
		op.arguments = { meta.counter_var_id, builder.makeUintConstant(0), builder.makeUintConstant(0) };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpAtomicIAdd;
	op.type_id = builder.makeUintType(32);
	op.id = direction > 0 ? impl.get_id_for_value(instruction) : impl.allocate_id();
	op.arguments = {
			counter_ptr_id,
			builder.makeUintConstant(spv::ScopeDevice),
			builder.makeUintConstant(0), // Relaxed.
			builder.makeUintConstant(direction)
	};

	spv::Id result_id = op.id;
	ops.push_back(std::move(op));

	if (direction < 0)
	{
		op = {};
		op.op = spv::OpISub;
		op.type_id = builder.makeUintType(32);
		op.id = impl.get_id_for_value(instruction);
		op.arguments = { result_id, builder.makeUintConstant(1) };
		ops.push_back(std::move(op));
	}

	return true;
}

}

