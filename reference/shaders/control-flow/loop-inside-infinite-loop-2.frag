#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _89;
    uint _90;
    uint _91;
    uint _92;
    if (V.x < 10u)
    {
        uint _95 = V.x;
        uint _58;
        bool _62;
        for (;;)
        {
            _58 = _95;
            uint _61 = imageAtomicAdd(_8, int(0u), _58);
            _62 = V.y == 0u;
            if (!_62)
            {
                uint _63 = _58 & 3u;
                uint _66;
                bool _101;
                uint _93 = _63;
                uint _94 = 0u;
                uint _65;
                bool _67;
                for (;;)
                {
                    _65 = _94;
                    _67 = _93 == 0u;
                    _101 = false;
                    if (!_67)
                    {
                        _101 = true;
                        break;
                    }
                    if (!((_58 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _84 = imageAtomicAdd(_8, int(0u), _58);
                    _66 = _65 + 1u;
                    if (_66 < V.y)
                    {
                        _93 = 0u;
                        _94 = _66;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_101)
                {
                    break;
                }
            }
            uint _87 = imageAtomicAdd(_8, int(0u), _58);
            _95 = _58 + 1u;
            continue;
        }
        _89 = _58;
        _90 = V.y;
        _91 = V.z;
        _92 = V.w;
    }
    else
    {
        uint _33 = ~V.x;
        uint _34 = ~V.y;
        uint _98 = _33;
        uint _36;
        bool _42;
        for (;;)
        {
            _36 = _98;
            uint _40 = imageAtomicAdd(_8, int(0u), _36);
            _42 = V.y == 4294967295u;
            if (!_42)
            {
                uint _44 = _36 & 3u;
                uint _47;
                bool _104;
                uint _96 = _44;
                uint _97 = 0u;
                uint _46;
                bool _48;
                for (;;)
                {
                    _46 = _97;
                    _48 = _96 == 0u;
                    _104 = false;
                    if (!_48)
                    {
                        _104 = true;
                        break;
                    }
                    if (!((_36 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _54 = imageAtomicAdd(_8, int(0u), _36);
                    _47 = _46 + 1u;
                    if (_47 < _34)
                    {
                        _96 = 0u;
                        _97 = _47;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_104)
                {
                    break;
                }
            }
            uint _57 = imageAtomicAdd(_8, int(0u), _36);
            _98 = _36 + 1u;
            continue;
        }
        _89 = _36;
        _90 = _34;
        _91 = ~V.z;
        _92 = ~V.w;
    }
    SV_Target.x = float(_89);
    SV_Target.y = float(_90);
    SV_Target.z = float(_91);
    SV_Target.w = float(_92);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 141
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
%38 = OpTypePointer Image %5
%41 = OpConstant %5 5
%43 = OpConstant %5 4294967295
%51 = OpConstant %5 7
%76 = OpTypePointer Output %12
%88 = OpTypePointer Function %5
%99 = OpConstantTrue %30
%100 = OpTypePointer Function %30
%102 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
%89 = OpVariable %88 Function
%90 = OpVariable %88 Function
%91 = OpVariable %88 Function
%92 = OpVariable %88 Function
%93 = OpVariable %88 Function
%94 = OpVariable %88 Function
%95 = OpVariable %88 Function
%96 = OpVariable %88 Function
%97 = OpVariable %88 Function
%98 = OpVariable %88 Function
%101 = OpVariable %100 Function
%104 = OpVariable %100 Function
OpBranch %106
%106 = OpLabel
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
OpSelectionMerge %135 None
OpBranchConditional %31 %122 %107
%107 = OpLabel
%33 = OpNot %5 %20
%34 = OpNot %5 %23
%35 = OpNot %5 %26
OpStore %98 %33
OpBranch %108
%108 = OpLabel
%36 = OpLoad %5 %98
%39 = OpImageTexelPointer %38 %8 %19 %19
%40 = OpAtomicIAdd %5 %39 %41 %19 %36
%42 = OpIEqual %30 %23 %43
OpLoopMerge %119 %121 None
OpBranch %109
%109 = OpLabel
OpSelectionMerge %120 None
OpBranchConditional %42 %120 %110
%110 = OpLabel
%44 = OpBitwiseAnd %5 %36 %28
OpStore %96 %44
OpStore %97 %19
OpBranch %111
%111 = OpLabel
%46 = OpLoad %5 %97
%45 = OpLoad %5 %96
%48 = OpIEqual %30 %45 %19
OpStore %104 %102
OpLoopMerge %117 %116 None
OpBranch %112
%112 = OpLabel
OpSelectionMerge %114 None
OpBranchConditional %48 %114 %113
%113 = OpLabel
OpStore %104 %99
OpBranch %117
%114 = OpLabel
%50 = OpBitwiseAnd %5 %36 %51
%52 = OpIEqual %30 %50 %19
OpSelectionMerge %115 None
OpBranchConditional %52 %115 %117
%115 = OpLabel
%53 = OpImageTexelPointer %38 %8 %19 %19
%54 = OpAtomicIAdd %5 %53 %41 %19 %36
%47 = OpIAdd %5 %46 %22
%55 = OpULessThan %30 %47 %34
OpSelectionMerge %139 None
OpBranchConditional %55 %116 %117
%139 = OpLabel
OpUnreachable
%116 = OpLabel
OpStore %96 %19
OpStore %97 %47
OpBranch %111
%117 = OpLabel
%105 = OpLoad %30 %104
OpSelectionMerge %118 None
OpBranchConditional %105 %119 %118
%118 = OpLabel
OpBranch %120
%119 = OpLabel
%49 = OpNot %5 %29
OpStore %89 %36
OpStore %90 %34
OpStore %91 %35
OpStore %92 %49
OpBranch %135
%120 = OpLabel
OpBranch %121
%121 = OpLabel
%56 = OpImageTexelPointer %38 %8 %19 %19
%57 = OpAtomicIAdd %5 %56 %41 %19 %36
%37 = OpIAdd %5 %36 %22
OpStore %98 %37
OpBranch %108
%122 = OpLabel
OpStore %95 %20
OpBranch %123
%123 = OpLabel
%58 = OpLoad %5 %95
%60 = OpImageTexelPointer %38 %8 %19 %19
%61 = OpAtomicIAdd %5 %60 %41 %19 %58
%62 = OpIEqual %30 %23 %19
OpLoopMerge %134 %138 None
OpBranch %124
%124 = OpLabel
OpSelectionMerge %137 None
OpBranchConditional %62 %137 %125
%125 = OpLabel
%63 = OpBitwiseAnd %5 %58 %28
OpStore %93 %63
OpStore %94 %19
OpBranch %126
%126 = OpLabel
%65 = OpLoad %5 %94
%64 = OpLoad %5 %93
%67 = OpIEqual %30 %64 %19
OpStore %101 %102
OpLoopMerge %132 %131 None
OpBranch %127
%127 = OpLabel
OpSelectionMerge %129 None
OpBranchConditional %67 %129 %128
%128 = OpLabel
OpStore %101 %99
OpBranch %132
%129 = OpLabel
%81 = OpBitwiseAnd %5 %58 %51
%82 = OpIEqual %30 %81 %19
OpSelectionMerge %130 None
OpBranchConditional %82 %130 %132
%130 = OpLabel
%83 = OpImageTexelPointer %38 %8 %19 %19
%84 = OpAtomicIAdd %5 %83 %41 %19 %58
%66 = OpIAdd %5 %65 %22
%85 = OpULessThan %30 %66 %23
OpSelectionMerge %140 None
OpBranchConditional %85 %131 %132
%140 = OpLabel
OpUnreachable
%131 = OpLabel
OpStore %93 %19
OpStore %94 %66
OpBranch %126
%132 = OpLabel
%103 = OpLoad %30 %101
OpSelectionMerge %133 None
OpBranchConditional %103 %134 %133
%133 = OpLabel
OpBranch %137
%134 = OpLabel
OpStore %89 %58
OpStore %90 %23
OpStore %91 %26
OpStore %92 %29
OpBranch %135
%135 = OpLabel
OpBranch %136
%136 = OpLabel
%71 = OpLoad %5 %92
%70 = OpLoad %5 %91
%69 = OpLoad %5 %90
%68 = OpLoad %5 %89
%72 = OpConvertUToF %12 %68
%73 = OpConvertUToF %12 %69
%74 = OpConvertUToF %12 %70
%75 = OpConvertUToF %12 %71
%77 = OpAccessChain %76 %15 %19
OpStore %77 %72
%78 = OpAccessChain %76 %15 %22
OpStore %78 %73
%79 = OpAccessChain %76 %15 %25
OpStore %79 %74
%80 = OpAccessChain %76 %15 %28
OpStore %80 %75
OpReturn
%137 = OpLabel
OpBranch %138
%138 = OpLabel
%86 = OpImageTexelPointer %38 %8 %19 %19
%87 = OpAtomicIAdd %5 %86 %41 %19 %58
%59 = OpIAdd %5 %58 %22
OpStore %95 %59
OpBranch %123
OpFunctionEnd
#endif
