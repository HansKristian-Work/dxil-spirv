#version 460
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _49;
    float _50;
    float _51;
    float _52;
    if (gl_HelperInvocation)
    {
        _49 = 0.0;
        _50 = 0.0;
        _51 = 0.0;
        _52 = 0.0;
    }
    else
    {
        _49 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : TEXCOORD.x);
        _50 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : TEXCOORD.y);
        _51 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _52 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _49;
    SV_Target.y = _50;
    SV_Target.z = _51;
    SV_Target.w = _52;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %60
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %60 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%20 = OpTypeBool
%23 = OpConstant %5 0
%31 = OpTypePointer Output %5
%35 = OpConstant %14 2
%37 = OpConstant %14 3
%48 = OpTypePointer Function %5
%59 = OpTypePointer Input %20
%60 = OpVariable %59 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
%49 = OpVariable %48 Function
%50 = OpVariable %48 Function
%51 = OpVariable %48 Function
%52 = OpVariable %48 Function
OpBranch %53
%53 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpLoad %20 %60
OpSelectionMerge %56 None
OpBranchConditional %21 %55 %54
%55 = OpLabel
OpStore %49 %23
OpStore %50 %23
OpStore %51 %23
OpStore %52 %23
OpBranch %56
%54 = OpLabel
%38 = OpFMul %5 %16 %16
%39 = OpFMul %5 %19 %19
%40 = OpLoad %20 %60
%41 = OpSelect %5 %40 %23 %16
%24 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %41
%42 = OpLoad %20 %60
%43 = OpSelect %5 %42 %23 %19
%26 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %43
%44 = OpLoad %20 %60
%45 = OpSelect %5 %44 %23 %38
%28 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %45
%46 = OpLoad %20 %60
%47 = OpSelect %5 %46 %23 %39
%30 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %47
OpStore %49 %24
OpStore %50 %26
OpStore %51 %28
OpStore %52 %30
OpBranch %56
%56 = OpLabel
OpBranch %57
%57 = OpLabel
OpBranch %58
%58 = OpLabel
%29 = OpLoad %5 %52
%27 = OpLoad %5 %51
%25 = OpLoad %5 %50
%22 = OpLoad %5 %49
%32 = OpAccessChain %31 %11 %15
OpStore %32 %22
%33 = OpAccessChain %31 %11 %18
OpStore %33 %25
%34 = OpAccessChain %31 %11 %35
OpStore %34 %27
%36 = OpAccessChain %31 %11 %37
OpStore %36 %29
OpReturn
OpFunctionEnd
#endif
