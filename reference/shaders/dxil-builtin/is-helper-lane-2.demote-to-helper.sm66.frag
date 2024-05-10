#version 460
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _22;
    float _25;
    float _27;
    float _29;
    if (gl_HelperInvocation)
    {
        _22 = 0.0;
        _25 = 0.0;
        _27 = 0.0;
        _29 = 0.0;
    }
    else
    {
        _22 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : TEXCOORD.x);
        _25 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : TEXCOORD.y);
        _27 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _29 = subgroupExclusiveAdd(gl_HelperInvocation ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _22;
    SV_Target.y = _25;
    SV_Target.z = _27;
    SV_Target.w = _29;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %52
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %52 BuiltIn HelperInvocation
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
%51 = OpTypePointer Input %20
%52 = OpVariable %51 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpLoad %20 %52
OpSelectionMerge %50 None
OpBranchConditional %21 %50 %49
%49 = OpLabel
%38 = OpFMul %5 %16 %16
%39 = OpFMul %5 %19 %19
%40 = OpLoad %20 %52
%41 = OpSelect %5 %40 %23 %16
%24 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %41
%42 = OpLoad %20 %52
%43 = OpSelect %5 %42 %23 %19
%26 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %43
%44 = OpLoad %20 %52
%45 = OpSelect %5 %44 %23 %38
%28 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %45
%46 = OpLoad %20 %52
%47 = OpSelect %5 %46 %23 %39
%30 = OpGroupNonUniformFAdd %5 %37 ExclusiveScan %47
OpBranch %50
%50 = OpLabel
%22 = OpPhi %5 %23 %48 %24 %49
%25 = OpPhi %5 %23 %48 %26 %49
%27 = OpPhi %5 %23 %48 %28 %49
%29 = OpPhi %5 %23 %48 %30 %49
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
