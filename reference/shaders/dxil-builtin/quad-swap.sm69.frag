#version 460
#extension GL_KHR_shader_subgroup_quad : require

vec4 _17;

layout(location = 0) in vec4 A;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _16;
    _16.x = A.x;
    _16.y = A.y;
    _16.z = A.z;
    _16.w = A.w;
    vec4 _35 = ((_16 + subgroupQuadSwapHorizontal(_16)) + subgroupQuadSwapVertical(_16)) + subgroupQuadSwapDiagonal(_16);
    SV_Target.x = _35.x;
    SV_Target.y = _35.y;
    SV_Target.z = _35.z;
    SV_Target.w = _35.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 47
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%19 = OpConstant %13 1
%23 = OpConstant %13 2
%27 = OpConstant %13 3
%37 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%17 = OpUndef %6
OpBranch %45
%45 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpCompositeInsert %6 %15 %17 0
%18 = OpAccessChain %11 %8 %19
%20 = OpLoad %5 %18
%21 = OpCompositeInsert %6 %20 %16 1
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%25 = OpCompositeInsert %6 %24 %21 2
%26 = OpAccessChain %11 %8 %27
%28 = OpLoad %5 %26
%29 = OpCompositeInsert %6 %28 %25 3
%30 = OpGroupNonUniformQuadSwap %6 %27 %29 %14
%31 = OpFAdd %6 %29 %30
%32 = OpGroupNonUniformQuadSwap %6 %27 %29 %19
%33 = OpFAdd %6 %31 %32
%34 = OpGroupNonUniformQuadSwap %6 %27 %29 %23
%35 = OpFAdd %6 %33 %34
%36 = OpCompositeExtract %5 %35 0
%38 = OpAccessChain %37 %10 %14
OpStore %38 %36
%39 = OpCompositeExtract %5 %35 1
%40 = OpAccessChain %37 %10 %19
OpStore %40 %39
%41 = OpCompositeExtract %5 %35 2
%42 = OpAccessChain %37 %10 %23
OpStore %42 %41
%43 = OpCompositeExtract %5 %35 3
%44 = OpAccessChain %37 %10 %27
OpStore %44 %43
OpReturn
OpFunctionEnd
#endif
