#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

layout(set = 0, binding = 0, std140) uniform _10_12
{
    u64vec2 _m0[5];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    vec4 _m0[5];
} _18;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = ((_18._m0[1u].x + _18._m0[0u].x) + _18._m0[2u].x) + float(int64_t(_12._m0[3u].x));
    SV_Target.y = ((_18._m0[1u].y + _18._m0[0u].y) + _18._m0[2u].y) + float(int64_t(_12._m0[3u].y));
    SV_Target.z = ((_18._m0[1u].z + _18._m0[0u].z) + _18._m0[2u].z) + float(int64_t(_12._m0[4u].x));
    SV_Target.w = ((_18._m0[1u].w + _18._m0[0u].w) + _18._m0[2u].w) + float(int64_t(_12._m0[4u].y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpCapability Int64
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %16 ""
OpName %20 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %15 ArrayStride 16
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 0
OpDecorate %20 Location 0
OpDecorate %32 RelaxedPrecision
OpDecorate %33 RelaxedPrecision
OpDecorate %34 RelaxedPrecision
OpDecorate %35 RelaxedPrecision
OpDecorate %43 RelaxedPrecision
OpDecorate %44 RelaxedPrecision
OpDecorate %45 RelaxedPrecision
OpDecorate %46 RelaxedPrecision
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 5
%7 = OpTypeInt 64 0
%8 = OpTypeVector %7 2
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeFloat 32
%14 = OpTypeVector %13 4
%15 = OpTypeArray %14 %6
%16 = OpTypeStruct %15
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypePointer Output %14
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %14
%29 = OpConstant %5 1
%40 = OpConstant %5 2
%51 = OpConstant %5 3
%52 = OpTypePointer Uniform %8
%57 = OpConstant %5 4
%70 = OpTypePointer Output %13
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %75
%75 = OpLabel
%23 = OpAccessChain %22 %18 %21 %21
%24 = OpLoad %14 %23
%25 = OpCompositeExtract %13 %24 0
%26 = OpCompositeExtract %13 %24 1
%27 = OpCompositeExtract %13 %24 2
%28 = OpCompositeExtract %13 %24 3
%30 = OpAccessChain %22 %18 %21 %29
%31 = OpLoad %14 %30
%32 = OpCompositeExtract %13 %31 0
%33 = OpCompositeExtract %13 %31 1
%34 = OpCompositeExtract %13 %31 2
%35 = OpCompositeExtract %13 %31 3
%36 = OpFAdd %13 %32 %25
%37 = OpFAdd %13 %33 %26
%38 = OpFAdd %13 %34 %27
%39 = OpFAdd %13 %35 %28
%41 = OpAccessChain %22 %18 %21 %40
%42 = OpLoad %14 %41
%43 = OpCompositeExtract %13 %42 0
%44 = OpCompositeExtract %13 %42 1
%45 = OpCompositeExtract %13 %42 2
%46 = OpCompositeExtract %13 %42 3
%47 = OpFAdd %13 %36 %43
%48 = OpFAdd %13 %37 %44
%49 = OpFAdd %13 %38 %45
%50 = OpFAdd %13 %39 %46
%53 = OpAccessChain %52 %12 %21 %51
%54 = OpLoad %8 %53
%55 = OpCompositeExtract %7 %54 0
%56 = OpCompositeExtract %7 %54 1
%58 = OpAccessChain %52 %12 %21 %57
%59 = OpLoad %8 %58
%60 = OpCompositeExtract %7 %59 0
%61 = OpCompositeExtract %7 %59 1
%62 = OpConvertSToF %13 %55
%63 = OpConvertSToF %13 %56
%64 = OpConvertSToF %13 %60
%65 = OpConvertSToF %13 %61
%66 = OpFAdd %13 %47 %62
%67 = OpFAdd %13 %48 %63
%68 = OpFAdd %13 %49 %64
%69 = OpFAdd %13 %50 %65
%71 = OpAccessChain %70 %20 %21
OpStore %71 %66
%72 = OpAccessChain %70 %20 %29
OpStore %72 %67
%73 = OpAccessChain %70 %20 %40
OpStore %73 %68
%74 = OpAccessChain %70 %20 %51
OpStore %74 %69
OpReturn
OpFunctionEnd
#endif
