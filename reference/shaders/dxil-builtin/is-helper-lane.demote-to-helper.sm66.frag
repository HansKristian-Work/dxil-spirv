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
        _26 = subgroupExclusiveAdd(TEXCOORD.x);
        _29 = subgroupExclusiveAdd(TEXCOORD.y);
        _31 = subgroupExclusiveAdd(TEXCOORD.x * TEXCOORD.x);
        _33 = subgroupExclusiveAdd(TEXCOORD.y * TEXCOORD.y);
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
; Bound: 53
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpCapability DemoteToHelperInvocationEXT
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
OpBranch %44
%44 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %49 None
OpBranchConditional %21 %48 %45
%48 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %49
%45 = OpLabel
%23 = OpFOrdGreaterThan %20 %19 %24
OpSelectionMerge %47 None
OpBranchConditional %23 %46 %47
%46 = OpLabel
OpDemoteToHelperInvocationEXT
OpBranch %47
%47 = OpLabel
OpBranch %49
%49 = OpLabel
%25 = OpIsHelperInvocationEXT %20
OpSelectionMerge %51 None
OpBranchConditional %25 %51 %50
%50 = OpLabel
%42 = OpFMul %5 %16 %16
%43 = OpFMul %5 %19 %19
%28 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %16
%30 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %19
%32 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %42
%34 = OpGroupNonUniformFAdd %5 %41 ExclusiveScan %43
OpBranch %51
%51 = OpLabel
%26 = OpPhi %5 %27 %49 %28 %50
%29 = OpPhi %5 %27 %49 %30 %50
%31 = OpPhi %5 %27 %49 %32 %50
%33 = OpPhi %5 %27 %49 %34 %50
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
