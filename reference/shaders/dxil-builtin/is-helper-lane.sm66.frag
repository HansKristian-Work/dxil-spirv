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
    float _29;
    float _32;
    float _34;
    float _36;
    if (gl_HelperInvocation || discard_state)
    {
        _29 = 0.0;
        _32 = 0.0;
        _34 = 0.0;
        _36 = 0.0;
    }
    else
    {
        _29 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : TEXCOORD.x);
        _32 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : TEXCOORD.y);
        _34 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _36 = subgroupExclusiveAdd((gl_HelperInvocation || discard_state) ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _29;
    SV_Target.y = _32;
    SV_Target.z = _34;
    SV_Target.w = _36;
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 84
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %65
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpName %24 "discard_state"
OpName %76 "discard_exit"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %65 BuiltIn HelperInvocation
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
%63 = OpConstantTrue %20
%64 = OpTypePointer Input %20
%65 = OpVariable %64 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %24 %25
OpBranch %55
%55 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %60 None
OpBranchConditional %21 %59 %56
%59 = OpLabel
OpStore %24 %63
OpBranch %60
%56 = OpLabel
%26 = OpFOrdGreaterThan %20 %19 %27
OpSelectionMerge %58 None
OpBranchConditional %26 %57 %58
%57 = OpLabel
OpStore %24 %63
OpBranch %58
%58 = OpLabel
OpBranch %60
%60 = OpLabel
%66 = OpLoad %20 %65
%67 = OpLoad %20 %24
%28 = OpLogicalOr %20 %66 %67
OpSelectionMerge %62 None
OpBranchConditional %28 %62 %61
%61 = OpLabel
%45 = OpFMul %5 %16 %16
%46 = OpFMul %5 %19 %19
%68 = OpLoad %20 %65
%69 = OpLoad %20 %24
%47 = OpLogicalOr %20 %68 %69
%48 = OpSelect %5 %47 %30 %16
%31 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %48
%70 = OpLoad %20 %65
%71 = OpLoad %20 %24
%49 = OpLogicalOr %20 %70 %71
%50 = OpSelect %5 %49 %30 %19
%33 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %50
%72 = OpLoad %20 %65
%73 = OpLoad %20 %24
%51 = OpLogicalOr %20 %72 %73
%52 = OpSelect %5 %51 %30 %45
%35 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %52
%74 = OpLoad %20 %65
%75 = OpLoad %20 %24
%53 = OpLogicalOr %20 %74 %75
%54 = OpSelect %5 %53 %30 %46
%37 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %54
OpBranch %62
%62 = OpLabel
%29 = OpPhi %5 %30 %60 %31 %61
%32 = OpPhi %5 %30 %60 %33 %61
%34 = OpPhi %5 %30 %60 %35 %61
%36 = OpPhi %5 %30 %60 %37 %61
%39 = OpAccessChain %38 %11 %15
OpStore %39 %29
%40 = OpAccessChain %38 %11 %18
OpStore %40 %32
%41 = OpAccessChain %38 %11 %42
OpStore %41 %34
%43 = OpAccessChain %38 %11 %44
OpStore %43 %36
%82 = OpFunctionCall %1 %76
OpReturn
OpFunctionEnd
%76 = OpFunction %1 None %2
%77 = OpLabel
%80 = OpLoad %20 %24
OpSelectionMerge %79 None
OpBranchConditional %80 %78 %79
%78 = OpLabel
OpKill
%79 = OpLabel
OpReturn
OpFunctionEnd
#endif
