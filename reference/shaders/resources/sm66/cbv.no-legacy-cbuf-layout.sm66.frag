#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    uint64_t _m0[8];
} _11;

layout(set = 0, binding = 0, scalar) uniform _15_17
{
    float16_t _m0[32];
} _17;

layout(set = 0, binding = 0, scalar) uniform _21_23
{
    float _m0[16];
} _23;

layout(set = 0, binding = 1, scalar) uniform _26_28
{
    float _m0[4];
} _28;

layout(set = 0, binding = 2, scalar) uniform _31_33
{
    double _m0[4];
} _33;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (((float(_17._m0[8u]) + _23._m0[0u]) + float(int64_t(_11._m0[4u]))) + _28._m0[0u]) + float(_33._m0[0u]);
    SV_Target.y = (((float(_17._m0[10u]) + _23._m0[1u]) + float(int64_t(_11._m0[5u]))) + _28._m0[1u]) + float(_33._m0[1u]);
    SV_Target.z = (((float(_17._m0[12u]) + _23._m0[2u]) + float(int64_t(_11._m0[6u]))) + _28._m0[2u]) + float(_33._m0[2u]);
    SV_Target.w = (((float(_17._m0[14u]) + _23._m0[3u]) + float(int64_t(_11._m0[7u]))) + _28._m0[3u]) + float(_33._m0[3u]);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability UniformAndStorageBuffer16BitAccess
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %36
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %21 ""
OpName %26 ""
OpName %31 ""
OpName %36 "SV_Target"
OpDecorate %8 ArrayStride 8
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 2
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %20 ArrayStride 4
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
OpDecorate %30 ArrayStride 8
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 2
OpDecorate %36 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 8
%7 = OpTypeInt 64 0
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 32
%13 = OpTypeFloat 16
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpConstant %5 16
%19 = OpTypeFloat 32
%20 = OpTypeArray %19 %18
%21 = OpTypeStruct %20
%22 = OpTypePointer Uniform %21
%23 = OpVariable %22 Uniform
%24 = OpConstant %5 4
%25 = OpTypeArray %19 %24
%26 = OpTypeStruct %25
%27 = OpTypePointer Uniform %26
%28 = OpVariable %27 Uniform
%29 = OpTypeFloat 64
%30 = OpTypeArray %29 %24
%31 = OpTypeStruct %30
%32 = OpTypePointer Uniform %31
%33 = OpVariable %32 Uniform
%34 = OpTypeVector %19 4
%35 = OpTypePointer Output %34
%36 = OpVariable %35 Output
%37 = OpConstant %5 0
%38 = OpTypePointer Uniform %19
%41 = OpConstant %5 1
%44 = OpConstant %5 2
%47 = OpConstant %5 3
%50 = OpTypePointer Uniform %13
%53 = OpConstant %5 10
%56 = OpConstant %5 12
%59 = OpConstant %5 14
%70 = OpTypePointer Uniform %7
%73 = OpConstant %5 5
%76 = OpConstant %5 6
%79 = OpConstant %5 7
%102 = OpTypePointer Uniform %29
%119 = OpTypePointer Output %19
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %124
%124 = OpLabel
%39 = OpAccessChain %38 %23 %37 %37
%40 = OpLoad %19 %39
%42 = OpAccessChain %38 %23 %37 %41
%43 = OpLoad %19 %42
%45 = OpAccessChain %38 %23 %37 %44
%46 = OpLoad %19 %45
%48 = OpAccessChain %38 %23 %37 %47
%49 = OpLoad %19 %48
%51 = OpAccessChain %50 %17 %37 %6
%52 = OpLoad %13 %51
%54 = OpAccessChain %50 %17 %37 %53
%55 = OpLoad %13 %54
%57 = OpAccessChain %50 %17 %37 %56
%58 = OpLoad %13 %57
%60 = OpAccessChain %50 %17 %37 %59
%61 = OpLoad %13 %60
%62 = OpFConvert %19 %52
%63 = OpFConvert %19 %55
%64 = OpFConvert %19 %58
%65 = OpFConvert %19 %61
%66 = OpFAdd %19 %62 %40
%67 = OpFAdd %19 %63 %43
%68 = OpFAdd %19 %64 %46
%69 = OpFAdd %19 %65 %49
%71 = OpAccessChain %70 %11 %37 %24
%72 = OpLoad %7 %71
%74 = OpAccessChain %70 %11 %37 %73
%75 = OpLoad %7 %74
%77 = OpAccessChain %70 %11 %37 %76
%78 = OpLoad %7 %77
%80 = OpAccessChain %70 %11 %37 %79
%81 = OpLoad %7 %80
%82 = OpConvertSToF %19 %72
%83 = OpConvertSToF %19 %75
%84 = OpConvertSToF %19 %78
%85 = OpConvertSToF %19 %81
%86 = OpFAdd %19 %66 %82
%87 = OpFAdd %19 %67 %83
%88 = OpFAdd %19 %68 %84
%89 = OpFAdd %19 %69 %85
%90 = OpAccessChain %38 %28 %37 %37
%91 = OpLoad %19 %90
%92 = OpAccessChain %38 %28 %37 %41
%93 = OpLoad %19 %92
%94 = OpAccessChain %38 %28 %37 %44
%95 = OpLoad %19 %94
%96 = OpAccessChain %38 %28 %37 %47
%97 = OpLoad %19 %96
%98 = OpFAdd %19 %86 %91
%99 = OpFAdd %19 %87 %93
%100 = OpFAdd %19 %88 %95
%101 = OpFAdd %19 %89 %97
%103 = OpAccessChain %102 %33 %37 %37
%104 = OpLoad %29 %103
%105 = OpAccessChain %102 %33 %37 %41
%106 = OpLoad %29 %105
%107 = OpAccessChain %102 %33 %37 %44
%108 = OpLoad %29 %107
%109 = OpAccessChain %102 %33 %37 %47
%110 = OpLoad %29 %109
%111 = OpFConvert %19 %104
%112 = OpFConvert %19 %106
%113 = OpFConvert %19 %108
%114 = OpFConvert %19 %110
%115 = OpFAdd %19 %98 %111
%116 = OpFAdd %19 %99 %112
%117 = OpFAdd %19 %100 %113
%118 = OpFAdd %19 %101 %114
%120 = OpAccessChain %119 %36 %37
OpStore %120 %115
%121 = OpAccessChain %119 %36 %41
OpStore %121 %116
%122 = OpAccessChain %119 %36 %44
OpStore %122 %117
%123 = OpAccessChain %119 %36 %47
OpStore %123 %118
OpReturn
OpFunctionEnd
#endif
