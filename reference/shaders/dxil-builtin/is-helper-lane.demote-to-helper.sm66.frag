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
    float _53;
    float _54;
    float _55;
    float _56;
    if (_25)
    {
        _53 = 0.0;
        _54 = 0.0;
        _55 = 0.0;
        _56 = 0.0;
    }
    else
    {
        bool _30 = helperInvocationEXT();
        bool _34 = helperInvocationEXT();
        bool _37 = helperInvocationEXT();
        bool _40 = helperInvocationEXT();
        _53 = subgroupExclusiveAdd(_30 ? 0.0 : TEXCOORD.x);
        _54 = subgroupExclusiveAdd(_34 ? 0.0 : TEXCOORD.y);
        _55 = subgroupExclusiveAdd(_37 ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _56 = subgroupExclusiveAdd(_40 ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
    }
    SV_Target.x = _53;
    SV_Target.y = _54;
    SV_Target.z = _55;
    SV_Target.w = _56;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 70
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
%29 = OpConstant %14 3
%31 = OpConstant %5 0
%46 = OpTypePointer Output %5
%50 = OpConstant %14 2
%52 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%53 = OpVariable %52 Function
%54 = OpVariable %52 Function
%55 = OpVariable %52 Function
%56 = OpVariable %52 Function
OpBranch %57
%57 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%21 = OpFOrdGreaterThan %20 %16 %22
OpSelectionMerge %62 None
OpBranchConditional %21 %61 %58
%58 = OpLabel
%23 = OpFOrdGreaterThan %20 %19 %24
OpSelectionMerge %60 None
OpBranchConditional %23 %59 %60
%59 = OpLabel
OpDemoteToHelperInvocation
OpBranch %60
%60 = OpLabel
OpBranch %62
%61 = OpLabel
OpDemoteToHelperInvocation
OpBranch %62
%62 = OpLabel
OpBranch %63
%63 = OpLabel
OpBranch %64
%64 = OpLabel
%25 = OpIsHelperInvocationEXT %20
OpSelectionMerge %67 None
OpBranchConditional %25 %66 %65
%65 = OpLabel
%26 = OpFMul %5 %16 %16
%27 = OpFMul %5 %19 %19
%30 = OpIsHelperInvocationEXT %20
%32 = OpSelect %5 %30 %31 %16
%28 = OpGroupNonUniformFAdd %5 %29 ExclusiveScan %32
%34 = OpIsHelperInvocationEXT %20
%35 = OpSelect %5 %34 %31 %19
%33 = OpGroupNonUniformFAdd %5 %29 ExclusiveScan %35
%37 = OpIsHelperInvocationEXT %20
%38 = OpSelect %5 %37 %31 %26
%36 = OpGroupNonUniformFAdd %5 %29 ExclusiveScan %38
%40 = OpIsHelperInvocationEXT %20
%41 = OpSelect %5 %40 %31 %27
%39 = OpGroupNonUniformFAdd %5 %29 ExclusiveScan %41
OpStore %53 %28
OpStore %54 %33
OpStore %55 %36
OpStore %56 %39
OpBranch %67
%66 = OpLabel
OpStore %53 %31
OpStore %54 %31
OpStore %55 %31
OpStore %56 %31
OpBranch %67
%67 = OpLabel
OpBranch %68
%68 = OpLabel
OpBranch %69
%69 = OpLabel
%45 = OpLoad %5 %56
%44 = OpLoad %5 %55
%43 = OpLoad %5 %54
%42 = OpLoad %5 %53
%47 = OpAccessChain %46 %11 %15
OpStore %47 %42
%48 = OpAccessChain %46 %11 %18
OpStore %48 %43
%49 = OpAccessChain %46 %11 %50
OpStore %49 %44
%51 = OpAccessChain %46 %11 %29
OpStore %51 %45
OpReturn
OpFunctionEnd
#endif
