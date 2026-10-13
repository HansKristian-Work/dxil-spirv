#version 460
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;
bool discard_state;

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    if (TEXCOORD.x > 10.0)
    {
        discard_state = true;
    }
    else
    {
        if (TEXCOORD.y > 20.0)
        {
            discard_state = true;
        }
    }
    float _56;
    float _57;
    float _58;
    float _59;
    if (gl_HelperInvocation || discard_state)
    {
        _56 = 0.0;
        _57 = 0.0;
        _58 = 0.0;
        _59 = 0.0;
    }
    else
    {
        _56 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : TEXCOORD.x);
        _57 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : TEXCOORD.y);
        _58 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _59 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _56;
    SV_Target.y = _57;
    SV_Target.z = _58;
    SV_Target.w = _59;
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 94
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %24 %75
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpName %24 "discard_state"
OpName %86 "discard_exit"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %75 BuiltIn HelperInvocation
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
%22 = OpConstant %5 10
%23 = OpTypePointer Private %20
%24 = OpVariable %23 Private
%25 = OpConstantFalse %20
%27 = OpConstant %5 20
%30 = OpConstant %5 0
%38 = OpTypePointer Output %5
%42 = OpConstant %14 2
%44 = OpConstant %14 3
%55 = OpTypePointer Function %5
%73 = OpConstantTrue %20
%74 = OpTypePointer Input %20
%75 = OpVariable %74 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
%56 = OpVariable %55 Function
%57 = OpVariable %55 Function
%58 = OpVariable %55 Function
%59 = OpVariable %55 Function
OpStore %24 %25
OpBranch %60
%60 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %65 None
OpBranchConditional %21 %64 %61
%64 = OpLabel
OpStore %24 %73
OpBranch %65
%61 = OpLabel
%26 = OpFOrdGreaterThan %20 %19 %27
OpSelectionMerge %63 None
OpBranchConditional %26 %62 %63
%62 = OpLabel
OpStore %24 %73
OpBranch %63
%63 = OpLabel
OpBranch %65
%65 = OpLabel
OpBranch %66
%66 = OpLabel
OpBranch %67
%67 = OpLabel
%76 = OpLoad %20 %75
%77 = OpLoad %20 %24
%28 = OpLogicalOr %20 %76 %77
OpSelectionMerge %70 None
OpBranchConditional %28 %69 %68
%69 = OpLabel
OpStore %56 %30
OpStore %57 %30
OpStore %58 %30
OpStore %59 %30
OpBranch %70
%68 = OpLabel
%45 = OpFMul %5 %16 %16
%46 = OpFMul %5 %19 %19
%78 = OpLoad %20 %75
%79 = OpLoad %20 %24
%47 = OpLogicalOr %20 %78 %79
%48 = OpSelect %5 %47 %30 %16
%31 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %48
%80 = OpLoad %20 %75
%81 = OpLoad %20 %24
%49 = OpLogicalOr %20 %80 %81
%50 = OpSelect %5 %49 %30 %19
%33 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %50
%82 = OpLoad %20 %75
%83 = OpLoad %20 %24
%51 = OpLogicalOr %20 %82 %83
%52 = OpSelect %5 %51 %30 %45
%35 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %52
%84 = OpLoad %20 %75
%85 = OpLoad %20 %24
%53 = OpLogicalOr %20 %84 %85
%54 = OpSelect %5 %53 %30 %46
%37 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %54
OpStore %56 %31
OpStore %57 %33
OpStore %58 %35
OpStore %59 %37
OpBranch %70
%70 = OpLabel
OpBranch %71
%71 = OpLabel
OpBranch %72
%72 = OpLabel
%36 = OpLoad %5 %59
%34 = OpLoad %5 %58
%32 = OpLoad %5 %57
%29 = OpLoad %5 %56
%39 = OpAccessChain %38 %11 %15
OpStore %39 %29
%40 = OpAccessChain %38 %11 %18
OpStore %40 %32
%41 = OpAccessChain %38 %11 %42
OpStore %41 %34
%43 = OpAccessChain %38 %11 %44
OpStore %43 %36
%92 = OpFunctionCall %1 %86
OpReturn
OpFunctionEnd
%86 = OpFunction %1 None %2
%87 = OpLabel
%90 = OpLoad %20 %24
OpSelectionMerge %89 None
OpBranchConditional %90 %88 %89
%88 = OpLabel
OpKill
%89 = OpLabel
OpReturn
OpFunctionEnd
#endif
