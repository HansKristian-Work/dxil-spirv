#version 460
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    bool _21 = helperInvocationEXT();
    float _38;
    float _39;
    float _40;
    float _41;
    if (_21)
    {
        _38 = 0.0;
        _39 = 0.0;
        _40 = 0.0;
        _41 = 0.0;
    }
    else
    {
        bool _26 = helperInvocationEXT();
        bool _30 = helperInvocationEXT();
        bool _33 = helperInvocationEXT();
        bool _36 = helperInvocationEXT();
        _38 = subgroupExclusiveAdd(_26 ? 0.0 : TEXCOORD.x);
        _39 = subgroupExclusiveAdd(_30 ? 0.0 : TEXCOORD.y);
        _40 = subgroupExclusiveAdd(_33 ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _41 = subgroupExclusiveAdd(_36 ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _38;
    SV_Target.y = _39;
    SV_Target.z = _40;
    SV_Target.w = _41;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 58
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformArithmetic
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpMemoryModel Logical Vulkan
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
%25 = OpConstant %14 3
%27 = OpConstant %5 0
%42 = OpTypePointer Output %5
%46 = OpConstant %14 2
%48 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %53
%53 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpIsHelperInvocationEXT %20
OpSelectionMerge %56 None
OpBranchConditional %21 %55 %54
%54 = OpLabel
%22 = OpFMul %5 %16 %16
%23 = OpFMul %5 %19 %19
%26 = OpIsHelperInvocationEXT %20
%28 = OpSelect %5 %26 %27 %16
%24 = OpGroupNonUniformFAdd %5 %25 ExclusiveScan %28
%30 = OpIsHelperInvocationEXT %20
%31 = OpSelect %5 %30 %27 %19
%29 = OpGroupNonUniformFAdd %5 %25 ExclusiveScan %31
%33 = OpIsHelperInvocationEXT %20
%34 = OpSelect %5 %33 %27 %22
%32 = OpGroupNonUniformFAdd %5 %25 ExclusiveScan %34
%36 = OpIsHelperInvocationEXT %20
%37 = OpSelect %5 %36 %27 %23
%35 = OpGroupNonUniformFAdd %5 %25 ExclusiveScan %37
OpBranch %56
%55 = OpLabel
OpBranch %56
%56 = OpLabel
%38 = OpPhi %5 %27 %55 %24 %54
%39 = OpPhi %5 %27 %55 %29 %54
%40 = OpPhi %5 %27 %55 %32 %54
%41 = OpPhi %5 %27 %55 %35 %54
OpBranch %57
%57 = OpLabel
%43 = OpAccessChain %42 %11 %15
OpStore %43 %38
%44 = OpAccessChain %42 %11 %18
OpStore %44 %39
%45 = OpAccessChain %42 %11 %46
OpStore %45 %40
%47 = OpAccessChain %42 %11 %25
OpStore %47 %41
OpReturn
OpFunctionEnd
#endif
