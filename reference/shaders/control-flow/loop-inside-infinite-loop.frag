#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _49;
    float _51;
    float _52;
    float _53;
    if (V.x < 10u)
    {
        uint _33;
        _33 = V.x;
        bool _39;
        for (;;)
        {
            uint _37 = imageAtomicAdd(_8, int(0u), _33);
            _39 = V.y == 0u;
            if (!_39)
            {
                uint _40 = _33 & 3u;
                bool _80;
                uint _41 = _40;
                uint _42 = 0u;
                bool _44;
                for (;;)
                {
                    _44 = _41 == 0u;
                    if (!_44)
                    {
                        _80 = true;
                        break;
                    }
                    if ((_33 & 7u) == 0u)
                    {
                        uint _63 = imageAtomicAdd(_8, int(0u), _33);
                        uint _43 = _42 + 1u;
                        if (_43 < V.y)
                        {
                            _41 = 0u;
                            _42 = _43;
                            continue;
                        }
                        else
                        {
                            _80 = false;
                            break;
                        }
                    }
                    else
                    {
                        _80 = false;
                        break;
                    }
                }
                if (_80)
                {
                    break;
                }
            }
            uint _66 = imageAtomicAdd(_8, int(0u), _33);
            _33++;
            continue;
        }
        _49 = float(_33);
        _51 = float(V.y);
        _52 = float(V.z);
        _53 = float(V.w);
    }
    else
    {
        _49 = 0.0;
        _51 = 0.0;
        _52 = 0.0;
        _53 = 0.0;
    }
    SV_Target.x = _49;
    SV_Target.y = _51;
    SV_Target.z = _52;
    SV_Target.w = _53;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 102
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
%76 = OpTypePointer Function %30
%78 = OpConstantTrue %30
%79 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
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
OpSelectionMerge %97 None
OpBranchConditional %31 %83 %82
%82 = OpLabel
OpBranch %97
%83 = OpLabel
OpBranch %84
%84 = OpLabel
%33 = OpPhi %5 %20 %83 %34 %100
%36 = OpImageTexelPointer %35 %8 %19 %19
%37 = OpAtomicIAdd %5 %36 %38 %19 %33
%39 = OpIEqual %30 %23 %19
OpLoopMerge %95 %100 None
OpBranch %85
%85 = OpLabel
OpSelectionMerge %99 None
OpBranchConditional %39 %99 %86
%86 = OpLabel
%40 = OpBitwiseAnd %5 %33 %28
OpBranch %87
%87 = OpLabel
%41 = OpPhi %5 %40 %86 %19 %92
%42 = OpPhi %5 %19 %86 %43 %92
%44 = OpIEqual %30 %41 %19
OpLoopMerge %93 %92 None
OpBranch %88
%88 = OpLabel
OpSelectionMerge %90 None
OpBranchConditional %44 %90 %89
%89 = OpLabel
OpBranch %93
%90 = OpLabel
%59 = OpBitwiseAnd %5 %33 %60
%61 = OpIEqual %30 %59 %19
OpSelectionMerge %101 None
OpBranchConditional %61 %92 %91
%101 = OpLabel
OpUnreachable
%91 = OpLabel
OpBranch %93
%92 = OpLabel
%62 = OpImageTexelPointer %35 %8 %19 %19
%63 = OpAtomicIAdd %5 %62 %38 %19 %33
%43 = OpIAdd %5 %42 %22
%64 = OpULessThan %30 %43 %23
OpBranchConditional %64 %87 %93
%93 = OpLabel
%80 = OpPhi %30 %79 %92 %79 %91 %78 %89
OpSelectionMerge %94 None
OpBranchConditional %80 %95 %94
%94 = OpLabel
OpBranch %99
%95 = OpLabel
%45 = OpConvertUToF %12 %33
%46 = OpConvertUToF %12 %23
%47 = OpConvertUToF %12 %26
%48 = OpConvertUToF %12 %29
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
%49 = OpPhi %12 %45 %96 %50 %82
%51 = OpPhi %12 %46 %96 %50 %82
%52 = OpPhi %12 %47 %96 %50 %82
%53 = OpPhi %12 %48 %96 %50 %82
OpBranch %98
%98 = OpLabel
%55 = OpAccessChain %54 %15 %19
OpStore %55 %49
%56 = OpAccessChain %54 %15 %22
OpStore %56 %51
%57 = OpAccessChain %54 %15 %25
OpStore %57 %52
%58 = OpAccessChain %54 %15 %28
OpStore %58 %53
OpReturn
%99 = OpLabel
OpBranch %100
%100 = OpLabel
%65 = OpImageTexelPointer %35 %8 %19 %19
%66 = OpAtomicIAdd %5 %65 %38 %19 %33
%34 = OpIAdd %5 %33 %22
OpBranch %84
OpFunctionEnd
#endif
