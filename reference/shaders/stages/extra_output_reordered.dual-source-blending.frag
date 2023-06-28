#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[3];
} _12;

layout(location = 0, index = 0) out vec4 SV_Target;
layout(location = 0, index = 1) out vec4 SV_Target_1;

void main()
{
    SV_Target.x = _12._m0[0u].x;
    SV_Target.y = _12._m0[0u].y;
    SV_Target.z = _12._m0[0u].z;
    SV_Target.w = _12._m0[0u].w;
    SV_Target_1.x = _12._m0[1u].x;
    SV_Target_1.y = _12._m0[1u].y;
    SV_Target_1.z = _12._m0[1u].z;
    SV_Target_1.w = _12._m0[1u].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "SV_Target"
OpName %15 "SV_Target_1"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
OpDecorate %14 Index 0
OpDecorate %15 Location 0
OpDecorate %15 Index 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 3
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Output %8
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpConstant %5 0
%17 = OpTypePointer Uniform %8
%24 = OpTypePointer Output %7
%27 = OpConstant %5 1
%29 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %47
%47 = OpLabel
%18 = OpAccessChain %17 %12 %16 %16
%19 = OpLoad %8 %18
%20 = OpCompositeExtract %7 %19 0
%21 = OpCompositeExtract %7 %19 1
%22 = OpCompositeExtract %7 %19 2
%23 = OpCompositeExtract %7 %19 3
%25 = OpAccessChain %24 %14 %16
OpStore %25 %20
%26 = OpAccessChain %24 %14 %27
OpStore %26 %21
%28 = OpAccessChain %24 %14 %29
OpStore %28 %22
%30 = OpAccessChain %24 %14 %6
OpStore %30 %23
%31 = OpAccessChain %17 %12 %16 %27
%32 = OpLoad %8 %31
%33 = OpCompositeExtract %7 %32 0
%34 = OpCompositeExtract %7 %32 1
%35 = OpCompositeExtract %7 %32 2
%36 = OpCompositeExtract %7 %32 3
%37 = OpAccessChain %24 %15 %16
OpStore %37 %33
%38 = OpAccessChain %24 %15 %27
OpStore %38 %34
%39 = OpAccessChain %24 %15 %29
OpStore %39 %35
%40 = OpAccessChain %24 %15 %6
OpStore %40 %36
%41 = OpAccessChain %17 %12 %16 %29
%42 = OpLoad %8 %41
%43 = OpCompositeExtract %7 %42 0
%44 = OpCompositeExtract %7 %42 1
%45 = OpCompositeExtract %7 %42 2
%46 = OpCompositeExtract %7 %42 3
OpReturn
OpFunctionEnd
#endif
