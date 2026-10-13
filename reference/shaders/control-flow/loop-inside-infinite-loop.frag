#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _67;
    float _68;
    float _69;
    float _70;
    if (V.x < 10u)
    {
        uint _74 = V.x;
        uint _47;
        bool _52;
        for (;;)
        {
            _47 = _74;
            uint _51 = imageAtomicAdd(_8, int(0u), _47);
            _52 = V.y == 0u;
            if (!_52)
            {
                uint _55 = _47 & 3u;
                uint _58;
                bool _77;
                uint _72 = _55;
                uint _73 = 0u;
                uint _57;
                bool _59;
                for (;;)
                {
                    _57 = _73;
                    _59 = _72 == 0u;
                    _77 = false;
                    if (!_59)
                    {
                        _77 = true;
                        break;
                    }
                    if (!((_47 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _64 = imageAtomicAdd(_8, int(0u), _47);
                    _58 = _57 + 1u;
                    if (_58 < V.y)
                    {
                        _72 = 0u;
                        _73 = _58;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_77)
                {
                    break;
                }
            }
            uint _54 = imageAtomicAdd(_8, int(0u), _47);
            _74 = _47 + 1u;
            continue;
        }
        _67 = float(_47);
        _68 = float(V.y);
        _69 = float(V.z);
        _70 = float(V.w);
    }
    else
    {
        _67 = 0.0;
        _68 = 0.0;
        _69 = 0.0;
        _70 = 0.0;
    }
    SV_Target.x = _67;
    SV_Target.y = _68;
    SV_Target.z = _69;
    SV_Target.w = _70;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 110
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
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
%35 = OpConstant %12 0
%42 = OpTypePointer Output %12
%49 = OpTypePointer Image %5
%61 = OpConstant %5 7
%66 = OpTypePointer Function %12
%71 = OpTypePointer Function %5
%75 = OpConstantTrue %30
%76 = OpTypePointer Function %30
%78 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
%67 = OpVariable %66 Function
%68 = OpVariable %66 Function
%69 = OpVariable %66 Function
%70 = OpVariable %66 Function
%72 = OpVariable %71 Function
%73 = OpVariable %71 Function
%74 = OpVariable %71 Function
%77 = OpVariable %76 Function
OpBranch %80
%80 = OpLabel
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
OpSelectionMerge %102 None
OpBranchConditional %31 %82 %81
%82 = OpLabel
OpStore %74 %20
OpBranch %83
%83 = OpLabel
%47 = OpLoad %5 %74
%50 = OpImageTexelPointer %49 %8 %19 %19
%51 = OpAtomicIAdd %5 %50 %22 %19 %47
%52 = OpIEqual %30 %23 %19
OpLoopMerge %98 %107 None
OpBranch %84
%84 = OpLabel
OpSelectionMerge %105 None
OpBranchConditional %52 %105 %85
%85 = OpLabel
%55 = OpBitwiseAnd %5 %47 %28
OpStore %72 %55
OpStore %73 %19
OpBranch %86
%86 = OpLabel
%57 = OpLoad %5 %73
%56 = OpLoad %5 %72
%59 = OpIEqual %30 %56 %19
OpStore %77 %78
OpLoopMerge %93 %91 None
OpBranch %87
%87 = OpLabel
OpSelectionMerge %89 None
OpBranchConditional %59 %89 %88
%88 = OpLabel
OpStore %77 %75
OpBranch %93
%89 = OpLabel
%60 = OpBitwiseAnd %5 %47 %61
%62 = OpIEqual %30 %60 %19
OpSelectionMerge %90 None
OpBranchConditional %62 %90 %93
%90 = OpLabel
%63 = OpImageTexelPointer %49 %8 %19 %19
%64 = OpAtomicIAdd %5 %63 %22 %19 %47
%58 = OpIAdd %5 %57 %22
%65 = OpULessThan %30 %58 %23
OpSelectionMerge %108 None
OpBranchConditional %65 %91 %92
%92 = OpLabel
OpBranch %93
%108 = OpLabel
OpUnreachable
%91 = OpLabel
OpStore %72 %19
OpStore %73 %58
OpBranch %86
%93 = OpLabel
%79 = OpLoad %30 %77
OpSelectionMerge %94 None
OpBranchConditional %79 %98 %94
%94 = OpLabel
OpBranch %95
%95 = OpLabel
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
OpBranch %105
%105 = OpLabel
OpBranch %106
%106 = OpLabel
OpBranch %107
%107 = OpLabel
%53 = OpImageTexelPointer %49 %8 %19 %19
%54 = OpAtomicIAdd %5 %53 %22 %19 %47
%48 = OpIAdd %5 %47 %22
OpStore %74 %48
OpBranch %83
%98 = OpLabel
OpBranch %99
%99 = OpLabel
OpBranch %100
%100 = OpLabel
%34 = OpConvertUToF %12 %47
%37 = OpConvertUToF %12 %23
%39 = OpConvertUToF %12 %26
%41 = OpConvertUToF %12 %29
OpStore %67 %34
OpStore %68 %37
OpStore %69 %39
OpStore %70 %41
OpBranch %101
%101 = OpLabel
OpBranch %102
%81 = OpLabel
OpStore %67 %35
OpStore %68 %35
OpStore %69 %35
OpStore %70 %35
OpBranch %102
%102 = OpLabel
OpBranch %103
%103 = OpLabel
OpBranch %104
%104 = OpLabel
%40 = OpLoad %12 %70
%38 = OpLoad %12 %69
%36 = OpLoad %12 %68
%33 = OpLoad %12 %67
%43 = OpAccessChain %42 %15 %19
OpStore %43 %33
%44 = OpAccessChain %42 %15 %22
OpStore %44 %36
%45 = OpAccessChain %42 %15 %25
OpStore %45 %38
%46 = OpAccessChain %42 %15 %28
OpStore %46 %40
OpReturn
OpFunctionEnd
#endif
