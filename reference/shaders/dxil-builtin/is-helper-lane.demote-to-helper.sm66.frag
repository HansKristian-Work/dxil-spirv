#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    if (TEXCOORD.x > 10.0)
    {
        demote;
    }
    else
    {
        if (TEXCOORD.y > 20.0)
        {
            demote;
        }
    }
    bool _25 = helperInvocationEXT();
    float _26;
    float _29;
    float _31;
    float _33;
    if (_25)
    {
        _26 = 0.0;
        _29 = 0.0;
        _31 = 0.0;
        _33 = 0.0;
    }
    else
    {
        bool _44 = helperInvocationEXT();
        bool _46 = helperInvocationEXT();
        bool _48 = helperInvocationEXT();
        bool _50 = helperInvocationEXT();
        _26 = subgroupExclusiveAdd(_44 ? 0.0 : TEXCOORD.x);
        _29 = subgroupExclusiveAdd(_46 ? 0.0 : TEXCOORD.y);
        _31 = subgroupExclusiveAdd(_48 ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _33 = subgroupExclusiveAdd(_50 ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _26;
    SV_Target.y = _29;
    SV_Target.z = _31;
    SV_Target.w = _33;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
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
%24 = OpConstant %5 20
%27 = OpConstant %5 0
%35 = OpTypePointer Output %5
%39 = OpConstant %14 2
%41 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %52
%52 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %57 None
OpBranchConditional %21 %56 %53
%56 = OpLabel
OpDemoteToHelperInvocation
OpBranch %57
%53 = OpLabel
%23 = OpFOrdGreaterThan %20 %19 %24
OpSelectionMerge %55 None
OpBranchConditional %23 %54 %55
%54 = OpLabel
OpDemoteToHelperInvocation
OpBranch %55
%55 = OpLabel
OpBranch %57
%57 = OpLabel
%25 = OpIsHelperInvocationEXT %20
OpSelectionMerge %59 None
OpBranchConditional %25 %59 %58
%58 = OpLabel
%42 = OpFMul %5 %16 %16
%43 = OpFMul %5 %19 %19
%44 = OpIsHelperInvocationEXT %20
%45 = OpSelect %5 %44 %27 %16
%28 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %45
%46 = OpIsHelperInvocationEXT %20
%47 = OpSelect %5 %46 %27 %19
%30 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %47
%48 = OpIsHelperInvocationEXT %20
%49 = OpSelect %5 %48 %27 %42
%32 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %49
%50 = OpIsHelperInvocationEXT %20
%51 = OpSelect %5 %50 %27 %43
%34 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %51
OpBranch %59
%59 = OpLabel
%26 = OpPhi %5 %27 %57 %28 %58
%29 = OpPhi %5 %27 %57 %30 %58
%31 = OpPhi %5 %27 %57 %32 %58
%33 = OpPhi %5 %27 %57 %34 %58
%36 = OpAccessChain %35 %11 %15
OpStore %36 %26
%37 = OpAccessChain %35 %11 %18
OpStore %37 %29
%38 = OpAccessChain %35 %11 %39
OpStore %38 %31
%40 = OpAccessChain %35 %11 %41
OpStore %40 %33
OpReturn
OpFunctionEnd
#endif
