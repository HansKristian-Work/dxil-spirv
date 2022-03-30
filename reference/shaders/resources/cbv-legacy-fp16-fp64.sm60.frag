#version 460
#extension GL_ARB_gpu_shader_int64 : require

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[5];
} _12;

layout(set = 0, binding = 0, std140) uniform _16_18
{
    dvec2 _m0[5];
} _18;

layout(location = 0) out vec4 SV_Target;

void main()
{
    u64vec2 _57 = doubleBitsToUint64(_18._m0[3u]);
    u64vec2 _63 = doubleBitsToUint64(_18._m0[4u]);
    SV_Target.x = ((_12._m0[1u].x + _12._m0[0u].x) + _12._m0[2u].x) + float(int64_t(_57.x));
    SV_Target.y = ((_12._m0[1u].y + _12._m0[0u].y) + _12._m0[2u].y) + float(int64_t(_57.y));
    SV_Target.z = ((_12._m0[1u].z + _12._m0[0u].z) + _12._m0[2u].z) + float(int64_t(_63.x));
    SV_Target.w = ((_12._m0[1u].w + _12._m0[0u].w) + _12._m0[2u].w) + float(int64_t(_63.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpCapability Float64
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
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 5
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeFloat 64
%14 = OpTypeVector %13 2
%15 = OpTypeArray %14 %6
%16 = OpTypeStruct %15
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypePointer Output %8
%20 = OpVariable %19 Output
%21 = OpConstant %5 0
%22 = OpTypePointer Uniform %8
%29 = OpConstant %5 1
%40 = OpConstant %5 2
%51 = OpTypeInt 64 0
%52 = OpConstant %5 3
%53 = OpTypePointer Uniform %14
%56 = OpTypeVector %51 2
%60 = OpConstant %5 4
%74 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%23 = OpAccessChain %22 %12 %21 %21
%24 = OpLoad %8 %23
%25 = OpCompositeExtract %7 %24 0
%26 = OpCompositeExtract %7 %24 1
%27 = OpCompositeExtract %7 %24 2
%28 = OpCompositeExtract %7 %24 3
%30 = OpAccessChain %22 %12 %21 %29
%31 = OpLoad %8 %30
%32 = OpCompositeExtract %7 %31 0
%33 = OpCompositeExtract %7 %31 1
%34 = OpCompositeExtract %7 %31 2
%35 = OpCompositeExtract %7 %31 3
%36 = OpFAdd %7 %32 %25
%37 = OpFAdd %7 %33 %26
%38 = OpFAdd %7 %34 %27
%39 = OpFAdd %7 %35 %28
%41 = OpAccessChain %22 %12 %21 %40
%42 = OpLoad %8 %41
%43 = OpCompositeExtract %7 %42 0
%44 = OpCompositeExtract %7 %42 1
%45 = OpCompositeExtract %7 %42 2
%46 = OpCompositeExtract %7 %42 3
%47 = OpFAdd %7 %36 %43
%48 = OpFAdd %7 %37 %44
%49 = OpFAdd %7 %38 %45
%50 = OpFAdd %7 %39 %46
%54 = OpAccessChain %53 %18 %21 %52
%55 = OpLoad %14 %54
%57 = OpBitcast %56 %55
%58 = OpCompositeExtract %51 %57 0
%59 = OpCompositeExtract %51 %57 1
%61 = OpAccessChain %53 %18 %21 %60
%62 = OpLoad %14 %61
%63 = OpBitcast %56 %62
%64 = OpCompositeExtract %51 %63 0
%65 = OpCompositeExtract %51 %63 1
%66 = OpConvertSToF %7 %58
%67 = OpConvertSToF %7 %59
%68 = OpConvertSToF %7 %64
%69 = OpConvertSToF %7 %65
%70 = OpFAdd %7 %47 %66
%71 = OpFAdd %7 %48 %67
%72 = OpFAdd %7 %49 %68
%73 = OpFAdd %7 %50 %69
%75 = OpAccessChain %74 %20 %21
OpStore %75 %70
%76 = OpAccessChain %74 %20 %29
OpStore %76 %71
%77 = OpAccessChain %74 %20 %40
OpStore %77 %72
%78 = OpAccessChain %74 %20 %52
OpStore %78 %73
OpReturn
OpFunctionEnd
#endif
