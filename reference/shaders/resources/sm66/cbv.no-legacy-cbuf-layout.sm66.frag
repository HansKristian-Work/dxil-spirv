#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float16_t _m0[32];
} _11;

layout(set = 0, binding = 0, scalar) uniform _15_17
{
    float _m0[16];
} _17;

layout(set = 0, binding = 0, scalar) uniform _21_23
{
    double _m0[8];
} _23;

layout(set = 0, binding = 1, scalar) uniform _26_28
{
    float _m0[4];
} _28;

layout(set = 0, binding = 2, scalar) uniform _30_32
{
    double _m0[4];
} _32;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (((float(_11._m0[8u]) + _17._m0[0u]) + float(int64_t(doubleBitsToUint64(_23._m0[4u])))) + _28._m0[0u]) + float(_32._m0[0u]);
    SV_Target.y = (((float(_11._m0[10u]) + _17._m0[1u]) + float(int64_t(doubleBitsToUint64(_23._m0[5u])))) + _28._m0[1u]) + float(_32._m0[1u]);
    SV_Target.z = (((float(_11._m0[12u]) + _17._m0[2u]) + float(int64_t(doubleBitsToUint64(_23._m0[6u])))) + _28._m0[2u]) + float(_32._m0[2u]);
    SV_Target.w = (((float(_11._m0[14u]) + _17._m0[3u]) + float(int64_t(doubleBitsToUint64(_23._m0[7u])))) + _28._m0[3u]) + float(_32._m0[3u]);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 129
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability UniformAndStorageBuffer16BitAccess
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %21 ""
OpName %26 ""
OpName %30 ""
OpName %35 "SV_Target"
OpDecorate %8 ArrayStride 2
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 4
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %20 ArrayStride 8
OpMemberDecorate %21 0 Offset 0
OpDecorate %21 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %25 ArrayStride 4
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 1
OpDecorate %29 ArrayStride 8
OpMemberDecorate %30 0 Offset 0
OpDecorate %30 Block
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %35 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 32
%7 = OpTypeFloat 16
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 16
%13 = OpTypeFloat 32
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpConstant %5 8
%19 = OpTypeFloat 64
%20 = OpTypeArray %19 %18
%21 = OpTypeStruct %20
%22 = OpTypePointer Uniform %21
%23 = OpVariable %22 Uniform
%24 = OpConstant %5 4
%25 = OpTypeArray %13 %24
%26 = OpTypeStruct %25
%27 = OpTypePointer Uniform %26
%28 = OpVariable %27 Uniform
%29 = OpTypeArray %19 %24
%30 = OpTypeStruct %29
%31 = OpTypePointer Uniform %30
%32 = OpVariable %31 Uniform
%33 = OpTypeVector %13 4
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%36 = OpConstant %5 0
%37 = OpTypePointer Uniform %13
%40 = OpConstant %5 1
%43 = OpConstant %5 2
%46 = OpConstant %5 3
%49 = OpTypePointer Uniform %7
%52 = OpConstant %5 10
%55 = OpConstant %5 12
%58 = OpConstant %5 14
%69 = OpTypePointer Uniform %19
%72 = OpTypeInt 64 0
%74 = OpConstant %5 5
%78 = OpConstant %5 6
%82 = OpConstant %5 7
%122 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %127
%127 = OpLabel
%38 = OpAccessChain %37 %17 %36 %36
%39 = OpLoad %13 %38
%41 = OpAccessChain %37 %17 %36 %40
%42 = OpLoad %13 %41
%44 = OpAccessChain %37 %17 %36 %43
%45 = OpLoad %13 %44
%47 = OpAccessChain %37 %17 %36 %46
%48 = OpLoad %13 %47
%50 = OpAccessChain %49 %11 %36 %18
%51 = OpLoad %7 %50
%53 = OpAccessChain %49 %11 %36 %52
%54 = OpLoad %7 %53
%56 = OpAccessChain %49 %11 %36 %55
%57 = OpLoad %7 %56
%59 = OpAccessChain %49 %11 %36 %58
%60 = OpLoad %7 %59
%61 = OpFConvert %13 %51
%62 = OpFConvert %13 %54
%63 = OpFConvert %13 %57
%64 = OpFConvert %13 %60
%65 = OpFAdd %13 %61 %39
%66 = OpFAdd %13 %62 %42
%67 = OpFAdd %13 %63 %45
%68 = OpFAdd %13 %64 %48
%70 = OpAccessChain %69 %23 %36 %24
%71 = OpLoad %19 %70
%73 = OpBitcast %72 %71
%75 = OpAccessChain %69 %23 %36 %74
%76 = OpLoad %19 %75
%77 = OpBitcast %72 %76
%79 = OpAccessChain %69 %23 %36 %78
%80 = OpLoad %19 %79
%81 = OpBitcast %72 %80
%83 = OpAccessChain %69 %23 %36 %82
%84 = OpLoad %19 %83
%85 = OpBitcast %72 %84
%86 = OpConvertSToF %13 %73
%87 = OpConvertSToF %13 %77
%88 = OpConvertSToF %13 %81
%89 = OpConvertSToF %13 %85
%90 = OpFAdd %13 %65 %86
%91 = OpFAdd %13 %66 %87
%92 = OpFAdd %13 %67 %88
%93 = OpFAdd %13 %68 %89
%94 = OpAccessChain %37 %28 %36 %36
%95 = OpLoad %13 %94
%96 = OpAccessChain %37 %28 %36 %40
%97 = OpLoad %13 %96
%98 = OpAccessChain %37 %28 %36 %43
%99 = OpLoad %13 %98
%100 = OpAccessChain %37 %28 %36 %46
%101 = OpLoad %13 %100
%102 = OpFAdd %13 %90 %95
%103 = OpFAdd %13 %91 %97
%104 = OpFAdd %13 %92 %99
%105 = OpFAdd %13 %93 %101
%106 = OpAccessChain %69 %32 %36 %36
%107 = OpLoad %19 %106
%108 = OpAccessChain %69 %32 %36 %40
%109 = OpLoad %19 %108
%110 = OpAccessChain %69 %32 %36 %43
%111 = OpLoad %19 %110
%112 = OpAccessChain %69 %32 %36 %46
%113 = OpLoad %19 %112
%114 = OpFConvert %13 %107
%115 = OpFConvert %13 %109
%116 = OpFConvert %13 %111
%117 = OpFConvert %13 %113
%118 = OpFAdd %13 %102 %114
%119 = OpFAdd %13 %103 %115
%120 = OpFAdd %13 %104 %116
%121 = OpFAdd %13 %105 %117
%123 = OpAccessChain %122 %35 %36
OpStore %123 %118
%124 = OpAccessChain %122 %35 %40
OpStore %124 %119
%125 = OpAccessChain %122 %35 %43
OpStore %125 %120
%126 = OpAccessChain %122 %35 %46
OpStore %126 %121
OpReturn
OpFunctionEnd
#endif
