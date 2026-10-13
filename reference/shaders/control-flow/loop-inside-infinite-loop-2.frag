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
        uint _36;
        bool _41;
        for (;;)
        {
            _36 = _94;
            uint _40 = imageAtomicAdd(_8, int(0u), _36);
            _41 = V.y == 0u;
            if (!_41)
            {
                uint _50 = _36 & 3u;
                uint _56;
                bool _100;
                uint _92 = _50;
                uint _93 = 0u;
                uint _55;
                bool _57;
                for (;;)
                {
                    _55 = _93;
                    _57 = _92 == 0u;
                    _100 = false;
                    if (!_57)
                    {
                        _100 = true;
                        break;
                    }
                    if (!((_36 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _69 = imageAtomicAdd(_8, int(0u), _36);
                    _56 = _55 + 1u;
                    if (_56 < V.y)
                    {
                        _92 = 0u;
                        _93 = _56;
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
            uint _49 = imageAtomicAdd(_8, int(0u), _36);
            _94 = _36 + 1u;
            continue;
        }
        _88 = _36;
        _89 = V.y;
        _90 = V.z;
        _91 = V.w;
    }
    else
    {
        uint _33 = ~V.x;
        uint _34 = ~V.y;
        uint _97 = _33;
        uint _42;
        bool _46;
        for (;;)
        {
            _42 = _97;
            uint _45 = imageAtomicAdd(_8, int(0u), _42);
            _46 = V.y == 4294967295u;
            if (!_46)
            {
                uint _53 = _42 & 3u;
                uint _60;
                bool _103;
                uint _95 = _53;
                uint _96 = 0u;
                uint _59;
                bool _61;
                for (;;)
                {
                    _59 = _96;
                    _61 = _95 == 0u;
                    _103 = false;
                    if (!_61)
                    {
                        _103 = true;
                        break;
                    }
                    if (!((_42 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _85 = imageAtomicAdd(_8, int(0u), _42);
                    _60 = _59 + 1u;
                    if (_60 < _34)
                    {
                        _95 = 0u;
                        _96 = _60;
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
            uint _52 = imageAtomicAdd(_8, int(0u), _42);
            _97 = _42 + 1u;
            continue;
        }
        _88 = _42;
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
; Bound: 158
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
%47 = OpConstant %5 4294967295
%63 = OpConstant %5 7
%79 = OpTypePointer Output %12
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
OpSelectionMerge %149 None
OpBranchConditional %31 %129 %106
%129 = OpLabel
OpStore %94 %20
OpBranch %130
%130 = OpLabel
%36 = OpLoad %5 %94
%39 = OpImageTexelPointer %38 %8 %19 %19
%40 = OpAtomicIAdd %5 %39 %22 %19 %36
%41 = OpIEqual %30 %23 %19
OpLoopMerge %145 %154 None
OpBranch %131
%131 = OpLabel
OpSelectionMerge %152 None
OpBranchConditional %41 %152 %132
%132 = OpLabel
%50 = OpBitwiseAnd %5 %36 %28
OpStore %92 %50
OpStore %93 %19
OpBranch %133
%133 = OpLabel
%55 = OpLoad %5 %93
%54 = OpLoad %5 %92
%57 = OpIEqual %30 %54 %19
OpStore %100 %101
OpLoopMerge %140 %138 None
OpBranch %134
%134 = OpLabel
OpSelectionMerge %136 None
OpBranchConditional %57 %136 %135
%135 = OpLabel
OpStore %100 %98
OpBranch %140
%136 = OpLabel
%62 = OpBitwiseAnd %5 %36 %63
%64 = OpIEqual %30 %62 %19
OpSelectionMerge %137 None
OpBranchConditional %64 %137 %140
%137 = OpLabel
%68 = OpImageTexelPointer %38 %8 %19 %19
%69 = OpAtomicIAdd %5 %68 %22 %19 %36
%56 = OpIAdd %5 %55 %22
%70 = OpULessThan %30 %56 %23
OpSelectionMerge %156 None
OpBranchConditional %70 %138 %139
%139 = OpLabel
OpBranch %140
%156 = OpLabel
OpUnreachable
%138 = OpLabel
OpStore %92 %19
OpStore %93 %56
OpBranch %133
%140 = OpLabel
%102 = OpLoad %30 %100
OpSelectionMerge %141 None
OpBranchConditional %102 %145 %141
%141 = OpLabel
OpBranch %142
%142 = OpLabel
OpBranch %143
%143 = OpLabel
OpBranch %144
%144 = OpLabel
OpBranch %152
%152 = OpLabel
OpBranch %153
%153 = OpLabel
OpBranch %154
%154 = OpLabel
%48 = OpImageTexelPointer %38 %8 %19 %19
%49 = OpAtomicIAdd %5 %48 %22 %19 %36
%37 = OpIAdd %5 %36 %22
OpStore %94 %37
OpBranch %130
%145 = OpLabel
OpBranch %146
%146 = OpLabel
OpBranch %147
%147 = OpLabel
OpStore %88 %36
OpStore %89 %23
OpStore %90 %26
OpStore %91 %29
OpBranch %148
%148 = OpLabel
OpBranch %149
%106 = OpLabel
%33 = OpNot %5 %20
%34 = OpNot %5 %23
%35 = OpNot %5 %26
OpStore %97 %33
OpBranch %107
%107 = OpLabel
%42 = OpLoad %5 %97
%44 = OpImageTexelPointer %38 %8 %19 %19
%45 = OpAtomicIAdd %5 %44 %22 %19 %42
%46 = OpIEqual %30 %23 %47
OpLoopMerge %122 %128 None
OpBranch %108
%108 = OpLabel
OpSelectionMerge %126 None
OpBranchConditional %46 %126 %109
%109 = OpLabel
%53 = OpBitwiseAnd %5 %42 %28
OpStore %95 %53
OpStore %96 %19
OpBranch %110
%110 = OpLabel
%59 = OpLoad %5 %96
%58 = OpLoad %5 %95
%61 = OpIEqual %30 %58 %19
OpStore %103 %101
OpLoopMerge %117 %115 None
OpBranch %111
%111 = OpLabel
OpSelectionMerge %113 None
OpBranchConditional %61 %113 %112
%112 = OpLabel
OpStore %103 %98
OpBranch %117
%113 = OpLabel
%65 = OpBitwiseAnd %5 %42 %63
%66 = OpIEqual %30 %65 %19
OpSelectionMerge %114 None
OpBranchConditional %66 %114 %117
%114 = OpLabel
%84 = OpImageTexelPointer %38 %8 %19 %19
%85 = OpAtomicIAdd %5 %84 %22 %19 %42
%60 = OpIAdd %5 %59 %22
%86 = OpULessThan %30 %60 %34
OpSelectionMerge %155 None
OpBranchConditional %86 %115 %116
%116 = OpLabel
OpBranch %117
%155 = OpLabel
OpUnreachable
%115 = OpLabel
OpStore %95 %19
OpStore %96 %60
OpBranch %110
%117 = OpLabel
%104 = OpLoad %30 %103
OpSelectionMerge %118 None
OpBranchConditional %104 %122 %118
%118 = OpLabel
OpBranch %119
%119 = OpLabel
OpBranch %120
%120 = OpLabel
OpBranch %121
%121 = OpLabel
OpBranch %126
%126 = OpLabel
OpBranch %127
%127 = OpLabel
OpBranch %128
%128 = OpLabel
%51 = OpImageTexelPointer %38 %8 %19 %19
%52 = OpAtomicIAdd %5 %51 %22 %19 %42
%43 = OpIAdd %5 %42 %22
OpStore %97 %43
OpBranch %107
%122 = OpLabel
OpBranch %123
%123 = OpLabel
OpBranch %124
%124 = OpLabel
%67 = OpNot %5 %29
OpStore %88 %42
OpStore %89 %34
OpStore %90 %35
OpStore %91 %67
OpBranch %125
%125 = OpLabel
OpBranch %149
%149 = OpLabel
OpBranch %150
%150 = OpLabel
OpBranch %151
%151 = OpLabel
%74 = OpLoad %5 %91
%73 = OpLoad %5 %90
%72 = OpLoad %5 %89
%71 = OpLoad %5 %88
%75 = OpConvertUToF %12 %71
%76 = OpConvertUToF %12 %72
%77 = OpConvertUToF %12 %73
%78 = OpConvertUToF %12 %74
%80 = OpAccessChain %79 %15 %19
OpStore %80 %75
%81 = OpAccessChain %79 %15 %22
OpStore %81 %76
%82 = OpAccessChain %79 %15 %25
OpStore %82 %77
%83 = OpAccessChain %79 %15 %28
OpStore %83 %78
OpReturn
OpFunctionEnd
#endif
