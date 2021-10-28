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
        _29 = subgroupExclusiveAdd(TEXCOORD.x);
        _32 = subgroupExclusiveAdd(TEXCOORD.y);
        _34 = subgroupExclusiveAdd(TEXCOORD.x * TEXCOORD.x);
        _36 = subgroupExclusiveAdd(TEXCOORD.y * TEXCOORD.y);
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
; Bound: 68
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %57
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpName %24 "discard_state"
OpName %60 "discard_exit"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %57 BuiltIn HelperInvocation
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
%55 = OpConstantTrue %20
%56 = OpTypePointer Input %20
%57 = OpVariable %56 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %24 %25
OpBranch %47
%47 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %52 None
OpBranchConditional %21 %51 %48
%51 = OpLabel
OpStore %24 %55
OpBranch %52
%48 = OpLabel
%26 = OpFOrdGreaterThan %20 %19 %27
OpSelectionMerge %50 None
OpBranchConditional %26 %49 %50
%49 = OpLabel
OpStore %24 %55
OpBranch %50
%50 = OpLabel
OpBranch %52
%52 = OpLabel
%58 = OpLoad %20 %57
%59 = OpLoad %20 %24
%28 = OpLogicalOr %20 %58 %59
OpSelectionMerge %54 None
OpBranchConditional %28 %54 %53
%53 = OpLabel
%45 = OpFMul %5 %16 %16
%46 = OpFMul %5 %19 %19
%31 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %16
%33 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %19
%35 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %45
%37 = OpGroupNonUniformFAdd %5 %44 ExclusiveScan %46
OpBranch %54
%54 = OpLabel
%29 = OpPhi %5 %30 %52 %31 %53
%32 = OpPhi %5 %30 %52 %33 %53
%34 = OpPhi %5 %30 %52 %35 %53
%36 = OpPhi %5 %30 %52 %37 %53
%39 = OpAccessChain %38 %11 %15
OpStore %39 %29
%40 = OpAccessChain %38 %11 %18
OpStore %40 %32
%41 = OpAccessChain %38 %11 %42
OpStore %41 %34
%43 = OpAccessChain %38 %11 %44
OpStore %43 %36
%66 = OpFunctionCall %1 %60
OpReturn
OpFunctionEnd
%60 = OpFunction %1 None %2
%61 = OpLabel
%64 = OpLoad %20 %24
OpSelectionMerge %63 None
OpBranchConditional %64 %62 %63
%62 = OpLabel
OpKill
%63 = OpLabel
OpReturn
OpFunctionEnd
#endif
