#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _88;
    uint _89;
    uint _90;
    uint _91;
    if (V.x < 10u)
    {
        uint _94 = V.x;
        uint _57;
        bool _61;
        for (;;)
        {
            _57 = _94;
            uint _60 = imageAtomicAdd(_8, int(0u), _57);
            _61 = V.y == 0u;
            if (!_61)
            {
                uint _62 = _57 & 3u;
                uint _65;
                bool _100;
                uint _92 = _62;
                uint _93 = 0u;
                uint _64;
                bool _66;
                for (;;)
                {
                    _64 = _93;
                    _66 = _92 == 0u;
                    _100 = false;
                    if (!_66)
                    {
                        _100 = true;
                        break;
                    }
                    if (!((_57 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _83 = imageAtomicAdd(_8, int(0u), _57);
                    _65 = _64 + 1u;
                    if (_65 < V.y)
                    {
                        _92 = 0u;
                        _93 = _65;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_100)
                {
                    break;
                }
            }
            uint _86 = imageAtomicAdd(_8, int(0u), _57);
            _94 = _57 + 1u;
            continue;
        }
        _88 = _57;
        _89 = V.y;
        _90 = V.z;
        _91 = V.w;
    }
    else
    {
        uint _33 = ~V.x;
        uint _34 = ~V.y;
        uint _97 = _33;
        uint _36;
        bool _41;
        for (;;)
        {
            _36 = _97;
            uint _40 = imageAtomicAdd(_8, int(0u), _36);
            _41 = V.y == 4294967295u;
            if (!_41)
            {
                uint _43 = _36 & 3u;
                uint _46;
                bool _103;
                uint _95 = _43;
                uint _96 = 0u;
                uint _45;
                bool _47;
                for (;;)
                {
                    _45 = _96;
                    _47 = _95 == 0u;
                    _103 = false;
                    if (!_47)
                    {
                        _103 = true;
                        break;
                    }
                    if (!((_36 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _53 = imageAtomicAdd(_8, int(0u), _36);
                    _46 = _45 + 1u;
                    if (_46 < _34)
                    {
                        _95 = 0u;
                        _96 = _46;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_103)
                {
                    break;
                }
            }
            uint _56 = imageAtomicAdd(_8, int(0u), _36);
            _97 = _36 + 1u;
            continue;
        }
        _88 = _36;
        _89 = _34;
        _90 = ~V.z;
        _91 = ~V.w;
    }
    SV_Target.x = float(_88);
    SV_Target.y = float(_89);
    SV_Target.z = float(_90);
    SV_Target.w = float(_91);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 140
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
%38 = OpTypePointer Image %5
%42 = OpConstant %5 4294967295
%50 = OpConstant %5 7
%75 = OpTypePointer Output %12
%87 = OpTypePointer Function %5
%98 = OpConstantTrue %30
%99 = OpTypePointer Function %30
%101 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
%88 = OpVariable %87 Function
%89 = OpVariable %87 Function
%90 = OpVariable %87 Function
%91 = OpVariable %87 Function
%92 = OpVariable %87 Function
%93 = OpVariable %87 Function
%94 = OpVariable %87 Function
%95 = OpVariable %87 Function
%96 = OpVariable %87 Function
%97 = OpVariable %87 Function
%100 = OpVariable %99 Function
%103 = OpVariable %99 Function
OpBranch %105
%105 = OpLabel
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
OpSelectionMerge %134 None
OpBranchConditional %31 %121 %106
%106 = OpLabel
%33 = OpNot %5 %20
%34 = OpNot %5 %23
%35 = OpNot %5 %26
OpStore %97 %33
OpBranch %107
%107 = OpLabel
%36 = OpLoad %5 %97
%39 = OpImageTexelPointer %38 %8 %19 %19
%40 = OpAtomicIAdd %5 %39 %22 %19 %36
%41 = OpIEqual %30 %23 %42
OpLoopMerge %118 %120 None
OpBranch %108
%108 = OpLabel
OpSelectionMerge %119 None
OpBranchConditional %41 %119 %109
%109 = OpLabel
%43 = OpBitwiseAnd %5 %36 %28
OpStore %95 %43
OpStore %96 %19
OpBranch %110
%110 = OpLabel
%45 = OpLoad %5 %96
%44 = OpLoad %5 %95
%47 = OpIEqual %30 %44 %19
OpStore %103 %101
OpLoopMerge %116 %115 None
OpBranch %111
%111 = OpLabel
OpSelectionMerge %113 None
OpBranchConditional %47 %113 %112
%112 = OpLabel
OpStore %103 %98
OpBranch %116
%113 = OpLabel
%49 = OpBitwiseAnd %5 %36 %50
%51 = OpIEqual %30 %49 %19
OpSelectionMerge %114 None
OpBranchConditional %51 %114 %116
%114 = OpLabel
%52 = OpImageTexelPointer %38 %8 %19 %19
%53 = OpAtomicIAdd %5 %52 %22 %19 %36
%46 = OpIAdd %5 %45 %22
%54 = OpULessThan %30 %46 %34
OpSelectionMerge %138 None
OpBranchConditional %54 %115 %116
%138 = OpLabel
OpUnreachable
%115 = OpLabel
OpStore %95 %19
OpStore %96 %46
OpBranch %110
%116 = OpLabel
%104 = OpLoad %30 %103
OpSelectionMerge %117 None
OpBranchConditional %104 %118 %117
%117 = OpLabel
OpBranch %119
%118 = OpLabel
%48 = OpNot %5 %29
OpStore %88 %36
OpStore %89 %34
OpStore %90 %35
OpStore %91 %48
OpBranch %134
%119 = OpLabel
OpBranch %120
%120 = OpLabel
%55 = OpImageTexelPointer %38 %8 %19 %19
%56 = OpAtomicIAdd %5 %55 %22 %19 %36
%37 = OpIAdd %5 %36 %22
OpStore %97 %37
OpBranch %107
%121 = OpLabel
OpStore %94 %20
OpBranch %122
%122 = OpLabel
%57 = OpLoad %5 %94
%59 = OpImageTexelPointer %38 %8 %19 %19
%60 = OpAtomicIAdd %5 %59 %22 %19 %57
%61 = OpIEqual %30 %23 %19
OpLoopMerge %133 %137 None
OpBranch %123
%123 = OpLabel
OpSelectionMerge %136 None
OpBranchConditional %61 %136 %124
%124 = OpLabel
%62 = OpBitwiseAnd %5 %57 %28
OpStore %92 %62
OpStore %93 %19
OpBranch %125
%125 = OpLabel
%64 = OpLoad %5 %93
%63 = OpLoad %5 %92
%66 = OpIEqual %30 %63 %19
OpStore %100 %101
OpLoopMerge %131 %130 None
OpBranch %126
%126 = OpLabel
OpSelectionMerge %128 None
OpBranchConditional %66 %128 %127
%127 = OpLabel
OpStore %100 %98
OpBranch %131
%128 = OpLabel
%80 = OpBitwiseAnd %5 %57 %50
%81 = OpIEqual %30 %80 %19
OpSelectionMerge %129 None
OpBranchConditional %81 %129 %131
%129 = OpLabel
%82 = OpImageTexelPointer %38 %8 %19 %19
%83 = OpAtomicIAdd %5 %82 %22 %19 %57
%65 = OpIAdd %5 %64 %22
%84 = OpULessThan %30 %65 %23
OpSelectionMerge %139 None
OpBranchConditional %84 %130 %131
%139 = OpLabel
OpUnreachable
%130 = OpLabel
OpStore %92 %19
OpStore %93 %65
OpBranch %125
%131 = OpLabel
%102 = OpLoad %30 %100
OpSelectionMerge %132 None
OpBranchConditional %102 %133 %132
%132 = OpLabel
OpBranch %136
%133 = OpLabel
OpStore %88 %57
OpStore %89 %23
OpStore %90 %26
OpStore %91 %29
OpBranch %134
%134 = OpLabel
OpBranch %135
%135 = OpLabel
%70 = OpLoad %5 %91
%69 = OpLoad %5 %90
%68 = OpLoad %5 %89
%67 = OpLoad %5 %88
%71 = OpConvertUToF %12 %67
%72 = OpConvertUToF %12 %68
%73 = OpConvertUToF %12 %69
%74 = OpConvertUToF %12 %70
%76 = OpAccessChain %75 %15 %19
OpStore %76 %71
%77 = OpAccessChain %75 %15 %22
OpStore %77 %72
%78 = OpAccessChain %75 %15 %25
OpStore %78 %73
%79 = OpAccessChain %75 %15 %28
OpStore %79 %74
OpReturn
%136 = OpLabel
OpBranch %137
%137 = OpLabel
%85 = OpImageTexelPointer %38 %8 %19 %19
%86 = OpAtomicIAdd %5 %85 %22 %19 %57
%58 = OpIAdd %5 %57 %22
OpStore %94 %58
OpBranch %122
OpFunctionEnd
#endif
