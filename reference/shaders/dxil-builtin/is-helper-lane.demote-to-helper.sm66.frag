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
        bool _44 = helperInvocationEXT();
        bool _46 = helperInvocationEXT();
        bool _48 = helperInvocationEXT();
        bool _50 = helperInvocationEXT();
        _53 = subgroupExclusiveAdd(_44 ? 0.0 : TEXCOORD.x);
        _54 = subgroupExclusiveAdd(_46 ? 0.0 : TEXCOORD.y);
        _55 = subgroupExclusiveAdd(_48 ? 0.0 : (TEXCOORD.x * TEXCOORD.x));
        _56 = subgroupExclusiveAdd(_50 ? 0.0 : (TEXCOORD.y * TEXCOORD.y));
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
; Bound: 71
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
%61 = OpLabel
OpDemoteToHelperInvocation
OpBranch %62
%58 = OpLabel
%23 = OpFOrdGreaterThan %20 %19 %24
OpSelectionMerge %60 None
OpBranchConditional %23 %59 %60
%59 = OpLabel
OpDemoteToHelperInvocation
OpBranch %60
%60 = OpLabel
OpBranch %62
%62 = OpLabel
OpBranch %63
%63 = OpLabel
OpBranch %64
%64 = OpLabel
%25 = OpIsHelperInvocationEXT %20
OpSelectionMerge %67 None
OpBranchConditional %25 %66 %65
%66 = OpLabel
OpStore %53 %27
OpStore %54 %27
OpStore %55 %27
OpStore %56 %27
OpBranch %67
%65 = OpLabel
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
OpStore %53 %28
OpStore %54 %30
OpStore %55 %32
OpStore %56 %34
OpBranch %67
%67 = OpLabel
OpBranch %68
%68 = OpLabel
OpBranch %69
%69 = OpLabel
%33 = OpLoad %5 %56
%31 = OpLoad %5 %55
%29 = OpLoad %5 %54
%26 = OpLoad %5 %53
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
