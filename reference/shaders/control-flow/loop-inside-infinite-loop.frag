#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _68;
    float _69;
    float _70;
    float _71;
    if (V.x < 10u)
    {
        uint _75 = V.x;
        uint _33;
        bool _39;
        for (;;)
        {
            _33 = _75;
            uint _37 = imageAtomicAdd(_8, int(0u), _33);
            _39 = V.y == 0u;
            if (!_39)
            {
                uint _40 = _33 & 3u;
                uint _43;
                bool _78;
                uint _73 = _40;
                uint _74 = 0u;
                uint _42;
                bool _44;
                for (;;)
                {
                    _42 = _74;
                    _44 = _73 == 0u;
                    _78 = false;
                    if (!_44)
                    {
                        _78 = true;
                        break;
                    }
                    if (!((_33 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _63 = imageAtomicAdd(_8, int(0u), _33);
                    _43 = _42 + 1u;
                    if (_43 < V.y)
                    {
                        _73 = 0u;
                        _74 = _43;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_78)
                {
                    break;
                }
            }
            uint _66 = imageAtomicAdd(_8, int(0u), _33);
            _75 = _33 + 1u;
            continue;
        }
        _68 = float(_33);
        _69 = float(V.y);
        _70 = float(V.z);
        _71 = float(V.w);
    }
    else
    {
        _68 = 0.0;
        _69 = 0.0;
        _70 = 0.0;
        _71 = 0.0;
    }
    SV_Target.x = _68;
    SV_Target.y = _69;
    SV_Target.z = _70;
    SV_Target.w = _71;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 101
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "V"
OpName %15 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %5 0
%22 = OpConstant %5 1
%25 = OpConstant %5 2
%28 = OpConstant %5 3
%30 = OpTypeBool
%32 = OpConstant %5 10
%35 = OpTypePointer Image %5
%38 = OpConstant %5 5
%50 = OpConstant %12 0
%54 = OpTypePointer Output %12
%60 = OpConstant %5 7
%67 = OpTypePointer Function %12
%72 = OpTypePointer Function %5
%76 = OpConstantTrue %30
%77 = OpTypePointer Function %30
%79 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
%68 = OpVariable %67 Function
%69 = OpVariable %67 Function
%70 = OpVariable %67 Function
%71 = OpVariable %67 Function
%73 = OpVariable %72 Function
%74 = OpVariable %72 Function
%75 = OpVariable %72 Function
%78 = OpVariable %77 Function
OpBranch %81
%81 = OpLabel
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %11 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %11 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %17 %11 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %17 %11 %28
%29 = OpLoad %5 %27
%31 = OpULessThan %30 %20 %32
OpSelectionMerge %96 None
OpBranchConditional %31 %83 %82
%82 = OpLabel
OpStore %68 %50
OpStore %69 %50
OpStore %70 %50
OpStore %71 %50
OpBranch %96
%83 = OpLabel
OpStore %75 %20
OpBranch %84
%84 = OpLabel
%33 = OpLoad %5 %75
%36 = OpImageTexelPointer %35 %8 %19 %19
%37 = OpAtomicIAdd %5 %36 %38 %19 %33
%39 = OpIEqual %30 %23 %19
OpLoopMerge %95 %99 None
OpBranch %85
%85 = OpLabel
OpSelectionMerge %98 None
OpBranchConditional %39 %98 %86
%86 = OpLabel
%40 = OpBitwiseAnd %5 %33 %28
OpStore %73 %40
OpStore %74 %19
OpBranch %87
%87 = OpLabel
%42 = OpLoad %5 %74
%41 = OpLoad %5 %73
%44 = OpIEqual %30 %41 %19
OpStore %78 %79
OpLoopMerge %93 %92 None
OpBranch %88
%88 = OpLabel
OpSelectionMerge %90 None
OpBranchConditional %44 %90 %89
%89 = OpLabel
OpStore %78 %76
OpBranch %93
%90 = OpLabel
%59 = OpBitwiseAnd %5 %33 %60
%61 = OpIEqual %30 %59 %19
OpSelectionMerge %91 None
OpBranchConditional %61 %91 %93
%91 = OpLabel
%62 = OpImageTexelPointer %35 %8 %19 %19
%63 = OpAtomicIAdd %5 %62 %38 %19 %33
%43 = OpIAdd %5 %42 %22
%64 = OpULessThan %30 %43 %23
OpSelectionMerge %100 None
OpBranchConditional %64 %92 %93
%100 = OpLabel
OpUnreachable
%92 = OpLabel
OpStore %73 %19
OpStore %74 %43
OpBranch %87
%93 = OpLabel
%80 = OpLoad %30 %78
OpSelectionMerge %94 None
OpBranchConditional %80 %95 %94
%94 = OpLabel
OpBranch %98
%95 = OpLabel
%45 = OpConvertUToF %12 %33
%46 = OpConvertUToF %12 %23
%47 = OpConvertUToF %12 %26
%48 = OpConvertUToF %12 %29
OpStore %68 %45
OpStore %69 %46
OpStore %70 %47
OpStore %71 %48
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
%53 = OpLoad %12 %71
%52 = OpLoad %12 %70
%51 = OpLoad %12 %69
%49 = OpLoad %12 %68
%55 = OpAccessChain %54 %15 %19
OpStore %55 %49
%56 = OpAccessChain %54 %15 %22
OpStore %56 %51
%57 = OpAccessChain %54 %15 %25
OpStore %57 %52
%58 = OpAccessChain %54 %15 %28
OpStore %58 %53
OpReturn
%98 = OpLabel
OpBranch %99
%99 = OpLabel
%65 = OpImageTexelPointer %35 %8 %19 %19
%66 = OpAtomicIAdd %5 %65 %38 %19 %33
%34 = OpIAdd %5 %33 %22
OpStore %75 %34
OpBranch %84
OpFunctionEnd
#endif
