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

#pragma once

#include "spirv_module.hpp"
#include "descriptor_qa.hpp"

namespace spv
{
class Function;
}

namespace dxil_spv
{
spv::Id build_validate_bda_load_store_function(SPIRVModule &module, uint32_t desc_set, uint32_t binding);
spv::Id build_allocate_invocation_id_function(SPIRVModule &module, uint32_t desc_set, uint32_t binding);
spv::Id build_assume_true_call_function(SPIRVModule &module, const InstructionInstrumentationState &instrumentation);
spv::Id build_nan_inf_instrument_call_function(
    SPIRVModule &module, const InstructionInstrumentationState &instrumentation, spv::Id type_id);
void emit_instrumentation_hash(SPIRVModule &module, const InstructionInstrumentationState &instrumentation,
                               spv::Function *func, spv::Id value_id, spv::Id instruction_id);
} // namespace dxil_spv
