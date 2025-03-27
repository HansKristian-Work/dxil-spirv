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

#include <stdint.h>
#include "opcodes/opcodes.hpp"

namespace dxil_spv
{
// From https://github.com/GPUOpen-LibrariesAndSDKs/AGS_SDK/blob/master/ags_lib/hlsl/ags_shader_intrinsics_dx12.hlsl

//
// Copyright (c) 2023 Advanced Micro Devices, Inc. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

static constexpr uint32_t AgsUAVMagicRegisterSpace = 2147420894;

static constexpr uint32_t AmdExtD3DShaderIntrinsics_MagicCodeShift   = 28;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_MagicCodeMask    = 0xf;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_OpcodePhaseShift = 24;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_OpcodePhaseMask  = 0x3;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_DataShift        = 8;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_DataMask         = 0xffff;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_OpcodeShift      = 0;
static constexpr uint32_t AmdExtD3DShaderIntrinsics_OpcodeMask       = 0xff;

static constexpr uint32_t AmdExtD3DShaderIntrinsics_MagicCode        = 0x5;


/**
***********************************************************************************************************************
*   Intrinsic opcodes.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Readfirstlane          = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Readlane               = 0x02;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_LaneId                 = 0x03;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Swizzle                = 0x04;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Ballot                 = 0x05;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_MBCnt                  = 0x06;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Min3U                  = 0x07;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Min3F                  = 0x08;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Med3U                  = 0x09;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Med3F                  = 0x0a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Max3U                  = 0x0b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Max3F                  = 0x0c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BaryCoord              = 0x0d;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_VtxParam               = 0x0e;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Reserved1              = 0x0f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Reserved2              = 0x10;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Reserved3              = 0x11;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveReduce             = 0x12;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveScan               = 0x13;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_LoadDwAtAddr           = 0x14;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_DrawIndex              = 0x17;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_AtomicU64              = 0x18;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_GetWaveSize            = 0x19;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BaseInstance           = 0x1a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BaseVertex             = 0x1b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_FloatConversion        = 0x1c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_ReadlaneAt             = 0x1d;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_ShaderClock            = 0x1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_ShaderRealtimeClock    = 0x20;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Halt                   = 0x21;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_IntersectBvhNode            = 0x22;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BufferStoreByte             = 0x23;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BufferStoreShort            = 0x24;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_ShaderMarker                = 0x25;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_FloatOpWithRoundMode        = 0x26;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Reserved5                   = 0x27;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixMulAcc            = 0x28;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavLoad           = 0x29;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavStore          = 0x2a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixGlobalLoad        = 0x2b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixGlobalStore       = 0x2c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsLoad           = 0x2d;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsStore          = 0x2e;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementFill       = 0x2f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementExtract    = 0x30;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLength            = 0x31;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixCopy              = 0x32;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixFill              = 0x33;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_MatrixSparsityIndexLoad     = 0x34;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_MatrixElementWiseArithmetic = 0x35;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_Float8Conversion            = 0x36;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BuiltIn1                    = 0x37;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_BuiltInArg                  = 0x38;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcode_LastValidOpcode             = 0x38;
/**
***********************************************************************************************************************
*   Intrinsic opcode phases.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcodePhase_0   = 0x0;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcodePhase_1   = 0x1;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcodePhase_2   = 0x2;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsOpcodePhase_3   = 0x3;

/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsWaveOp defines for supported operations. Can be used as the parameter for the
*   AmdExtD3DShaderIntrinsicsOpcode_WaveOp intrinsic.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_AddF = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_AddI = 0x02;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_AddU = 0x03;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MulF = 0x04;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MulI = 0x05;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MulU = 0x06;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MinF = 0x07;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MinI = 0x08;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MinU = 0x09;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MaxF = 0x0a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MaxI = 0x0b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_MaxU = 0x0c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_And  = 0x0d;    // Reduction only
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_Or   = 0x0e;    // Reduction only
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_Xor  = 0x0f;    // Reduction only
/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsWaveOp masks and shifts for opcode and flags
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_OpcodeShift = 0;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_OpcodeMask  = 0xff;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_FlagShift   = 8;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_FlagMask    = 0xff;

/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsWaveOp flags for use with AmdExtD3DShaderIntrinsicsOpcode_WaveScan.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_Inclusive  = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsWaveOp_Exclusive  = 0x02;

/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsSwizzle defines for common swizzles.  Can be used as the operation parameter for the
*   AmdExtD3DShaderIntrinsics_Swizzle intrinsic.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_SwapX1     = 0x041f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_SwapX2     = 0x081f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_SwapX4     = 0x101f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_SwapX8     = 0x201f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_SwapX16    = 0x401f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_ReverseX2  = 0x041f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_ReverseX4  = 0x0c1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_ReverseX8  = 0x1c1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_ReverseX16 = 0x3c1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_ReverseX32 = 0x7c1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_BCastX2    = 0x003e;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_BCastX4    = 0x003c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_BCastX8    = 0x0038;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_BCastX16   = 0x0030;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsSwizzle_BCastX32   = 0x0020;

/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsBarycentric defines for barycentric interpolation mode.  To be used with
*   AmdExtD3DShaderIntrinsicsOpcode_IjBarycentricCoords to specify the interpolation mode.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_LinearCenter   = 0x1;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_LinearCentroid = 0x2;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_LinearSample   = 0x3;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_PerspCenter    = 0x4;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_PerspCentroid  = 0x5;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_PerspSample    = 0x6;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_PerspPullModel = 0x7;
/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsBarycentric defines for specifying vertex and parameter indices.  To be used as inputs to
*   the AmdExtD3DShaderIntrinsicsOpcode_VertexParameter function
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Vertex0       = 0x0;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Vertex1       = 0x1;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Vertex2       = 0x2;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param0        = 0x00;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param1        = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param2        = 0x02;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param3        = 0x03;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param4        = 0x04;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param5        = 0x05;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param6        = 0x06;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param7        = 0x07;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param8        = 0x08;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param9        = 0x09;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param10       = 0x0a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param11       = 0x0b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param12       = 0x0c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param13       = 0x0d;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param14       = 0x0e;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param15       = 0x0f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param16       = 0x10;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param17       = 0x11;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param18       = 0x12;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param19       = 0x13;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param20       = 0x14;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param21       = 0x15;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param22       = 0x16;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param23       = 0x17;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param24       = 0x18;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param25       = 0x19;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param26       = 0x1a;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param27       = 0x1b;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param28       = 0x1c;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param29       = 0x1d;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param30       = 0x1e;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_Param31       = 0x1f;

static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentX     = 0x0;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentY     = 0x1;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentZ     = 0x2;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentW     = 0x3;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ParamShift     = 0;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ParamMask      = 0x1f;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_VtxShift       = 0x5;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_VtxMask        = 0x3;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentShift = 0x7;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsBarycentric_ComponentMask  = 0x3;
/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsAtomic defines for supported operations. Can be used as the parameter for the
*   AmdExtD3DShaderIntrinsicsOpcode_AtomicU64 intrinsic.
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_MinU64     = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_MaxU64     = 0x02;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_AndU64     = 0x03;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_OrU64      = 0x04;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_XorU64     = 0x05;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_AddU64     = 0x06;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_XchgU64    = 0x07;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsAtomicOp_CmpXchgU64 = 0x08;

/**
***********************************************************************************************************************
*   AmdExtD3DShaderIntrinsicsFloatConversion defines for supported rounding modes from float to float16 conversions.
*   To be used as an input AmdExtD3DShaderIntrinsicsOpcode_FloatConversion instruction
***********************************************************************************************************************
*/
static constexpr uint32_t AmdExtD3DShaderIntrinsicsFloatConversionOp_FToF16Near    = 0x01;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsFloatConversionOp_FToF16NegInf  = 0x02;
static constexpr uint32_t AmdExtD3DShaderIntrinsicsFloatConversionOp_FToF16PlusInf = 0x03;

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsFloat8CvtOp enumeration to specify the conversion operation
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsFloat8CvtOp
{
	AmdExtD3DShaderIntrinsicsFloat8CvtOp_FP8_2_F32 = 0x0,
	AmdExtD3DShaderIntrinsicsFloat8CvtOp_BF8_2_F32 = 0x1,
	AmdExtD3DShaderIntrinsicsFloat8CvtOp_F32_2_FP8 = 0x2,
	AmdExtD3DShaderIntrinsicsFloat8CvtOp_F32_2_BF8 = 0x3,
};

/**
***********************************************************************************************************************
* @brief
*    Shifts and masks for the arguments required for AmdExtD3DShaderIntrinsicsFloat8Conversion
***********************************************************************************************************************
*/
constexpr unsigned int AmdExtD3DShaderIntrinsicsFloat8Conversion_CvtOpShift = 0;
constexpr unsigned int AmdExtD3DShaderIntrinsicsFloat8Conversion_CvtOpMask  = 0xff;
constexpr unsigned int AmdExtD3DShaderIntrinsicsFloat8Conversion_SatShift   = 8;
constexpr unsigned int AmdExtD3DShaderIntrinsicsFloat8Conversion_SatMask    = 0x1;
/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat enumeration for supported matrix element data format.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsWaveMatrixOpDataFormat
{
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_I4   = 0x0,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_U4   = 0x1,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_I8   = 0x2,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_U8   = 0x3,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16  = 0x4,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_BF16 = 0x5,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32  = 0x6,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_I32  = 0x7,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_U32  = 0x8,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_BF8  = 0x9,
	AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8  = 0xa,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsWaveMatrixType enumeration for supported wave matrix type.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsWaveMatrixOpMatrixType
{
	AmdExtD3DShaderIntrinsicsWaveMatrixType_A            = 0x0,
	AmdExtD3DShaderIntrinsicsWaveMatrixType_B            = 0x1,
	AmdExtD3DShaderIntrinsicsWaveMatrixType_Accumulator  = 0x2,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsWaveMatrixMatrixShape enumeration for supported wave matrix shape.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsWaveMatrixOpMatrixShape
{
	AmdExtD3DShaderIntrinsicsWaveMatrixShape_16X16 = 0x0,
	AmdExtD3DShaderIntrinsicsWaveMatrixShape_32X16 = 0x1,
	AmdExtD3DShaderIntrinsicsWaveMatrixShape_16X32 = 0x2,
	AmdExtD3DShaderIntrinsicsWaveMatrixShape_64X16 = 0x3,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsWaveMatrixOpcode enumeration to specify the wmma inst opcode.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsWaveMatrixOpcode
{
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_BF16_16X16X16_BF16     = 0x0,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F16_16X16X16_F16       = 0x1,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_BF16      = 0x2,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_BF8_BF8   = 0x3,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_BF8_FP8   = 0x4,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_F16       = 0x5,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_FP8_BF8   = 0x6,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_FP8_FP8   = 0x7,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_I4        = 0x8,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_U4        = 0x9,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_IU4       = 0xa,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_UI4       = 0xb,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_I8        = 0xc,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_U8        = 0xd,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_IU8       = 0xe,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X16_UI8       = 0xf,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X32_I4        = 0x10,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X32_U4        = 0x11,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X32_IU4       = 0x12,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_I32_16X16X32_UI4       = 0x13,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_BF16_16X16X32_BF16    = 0x14,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F16_16X16X32_F16      = 0x15,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_BF16     = 0x16,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_BF8_BF8  = 0x17,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_BF8_FP8  = 0x18,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_F16      = 0x19,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_FP8_BF8  = 0x1a,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_F32_16X16X32_FP8_FP8  = 0x1b,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_I4       = 0x1c,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_U4       = 0x1d,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_IU4      = 0x1e,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_UI4      = 0x1f,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_I8       = 0x20,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_U8       = 0x21,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_IU8      = 0x22,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X32_UI8      = 0x23,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X64_I4       = 0x24,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X64_U4       = 0x25,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X64_IU4      = 0x26,
	AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_SWMMA_I32_16X16X64_UI4      = 0x27,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsWaveMatrixRegType enumeration to specify the temp register.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsWaveMatrixRegType
{
	AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg          = 0x0,
	AmdExtD3DShaderIntrinsicsWaveMatrixRegType_A_TempReg           = 0x1,
	AmdExtD3DShaderIntrinsicsWaveMatrixRegType_B_TempReg           = 0x2,
	AmdExtD3DShaderIntrinsicsWaveMatrixRegType_Accumulator_TempReg = 0x3,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsMatrixElementWiseOp enumeration to specify the element-wise operation
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsMatrixElementWiseOp
{
	AmdExtD3DShaderIntrinsicsMatrixElementWiseOp_Add   = 0x1,
	AmdExtD3DShaderIntrinsicsMatrixElementWiseOp_Sub   = 0x2,
	AmdExtD3DShaderIntrinsicsMatrixElementWiseOp_Mul   = 0x3,
	AmdExtD3DShaderIntrinsicsMatrixElementWiseOp_Div   = 0x4,
	AmdExtD3DShaderIntrinsicsMatrixElementWiseOp_Times = 0x5,
};

/**
***********************************************************************************************************************
* @brief
*    AmdExtD3DShaderIntrinsicsSparsityIndexMem enumeration is used to specify where to read sparsity indexes.
***********************************************************************************************************************
*/
enum AmdExtD3DShaderIntrinsicsSparsityIndexMem
{
	AmdExtD3DShaderIntrinsicsSparsityIndexMem_UavBuffer    = 0x0,
	AmdExtD3DShaderIntrinsicsSparsityIndexMem_GroupShared  = 0x1,
	AmdExtD3DShaderIntrinsicsSparsityIndexMem_GlobalBuffer = 0x2,
};

/**
***********************************************************************************************************************
* @brief
*    Shifts and masks for the arguments required for AmdExtD3DShaderIntrinsicsWaveMatrixOpcode
***********************************************************************************************************************
*/
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsShift  = 0;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsMask   = 0x7f;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_FlagShift = 15;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_FlagMask  = 0x1;

/**
***********************************************************************************************************************
* @brief
*    Shifts and masks for the arguments required for AmdExtD3DShaderIntrinsicsWaveMatrixOpInOut
***********************************************************************************************************************
*/
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_ChannelShift        = 0;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_ChannelMask         = 0xf;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_SecondRegFlagShift  = 4;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_SecondRegFlagMask   = 0xf;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_MatRegTypeFlagShift = 8;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixInOut_MatRegTypeFlagMask  = 0xff;

/**
***********************************************************************************************************************
* @brief
*    Shifts and masks for the arguments required for AmdExtD3DShaderIntrinsicsWaveMatrixModifier
***********************************************************************************************************************
*/
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagShift = 0;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagMask  = 0xf;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagShift = 4;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagMask  = 0x7;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagShift     = 7;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagMask      = 0x1;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_ShapeShift          = 8;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_ShapeMask           = 0x7;
// Following flags only apply to AmdExtD3DShaderIntrinsicsOpcode_WaveMatrix*Load
// and AmdExtD3DShaderIntrinsicsOpcode_WaveMatrix*Store
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTileShift     = 11;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTileMask      = 0x1;
// Following flags only apply to AmdExtD3DShaderIntrinsicsOpcode_MatrixSparsityIndexLoad
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_IndexMemTypeShift   = 14;
constexpr unsigned int AmdExtD3DShaderIntrinsicsWaveMatrixModifier_IndexMemTypeMask    = 0x3;

static inline bool is_ags_magic(uint32_t v)
{
	return (v >> AmdExtD3DShaderIntrinsics_MagicCodeShift) == AmdExtD3DShaderIntrinsics_MagicCode;
}

static inline AgsInstruction decode_ags_instruction(uint32_t v)
{
	AgsInstruction inst = {};

	inst.opcode = (v >> AmdExtD3DShaderIntrinsics_OpcodeShift) & AmdExtD3DShaderIntrinsics_OpcodeMask;
	inst.phase = (v >> AmdExtD3DShaderIntrinsics_OpcodePhaseShift) & AmdExtD3DShaderIntrinsics_OpcodePhaseMask;
	inst.immediate = (v >> AmdExtD3DShaderIntrinsics_DataShift) & AmdExtD3DShaderIntrinsics_DataMask;

	return inst;
}

bool emit_magic_ags_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
}