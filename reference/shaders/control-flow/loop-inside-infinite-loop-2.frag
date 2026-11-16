#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _68;
    uint _69;
    uint _70;
    uint _71;
    if (V.x < 10u)
    {
        uint _58;
        _58 = V.x;
        bool _62;
        for (;;)
        {
            uint _61 = imageAtomicAdd(_8, int(0u), _58);
            _62 = V.y == 0u;
            if (!_62)
            {
                uint _63 = _58 & 3u;
                bool _103;
                uint _64 = _63;
                uint _65 = 0u;
                bool _67;
                for (;;)
                {
                    _67 = _64 == 0u;
                    if (!_67)
                    {
                        _103 = true;
                        break;
                    }
                    if ((_58 & 7u) == 0u)
                    {
                        uint _84 = imageAtomicAdd(_8, int(0u), _58);
                        uint _66 = _65 + 1u;
                        if (_66 < V.y)
                        {
                            _64 = 0u;
                            _65 = _66;
                            continue;
                        }
                        else
                        {
                            _103 = false;
                            break;
                        }
                    }
                    else
                    {
                        _103 = false;
                        break;
                    }
                }
                if (_103)
                {
                    break;
                }
            }
            uint _87 = imageAtomicAdd(_8, int(0u), _58);
            _58++;
            continue;
        }
        _68 = _58;
        _69 = V.y;
        _70 = V.z;
        _71 = V.w;
    }
    else
    {
        uint _34 = ~V.y;
        uint _36;
        _36 = ~V.x;
        bool _42;
        for (;;)
        {
            uint _40 = imageAtomicAdd(_8, int(0u), _36);
            _42 = V.y == 4294967295u;
            if (!_42)
            {
                uint _44 = _36 & 3u;
                bool _105;
                uint _45 = _44;
                uint _46 = 0u;
                bool _48;
                for (;;)
                {
                    _48 = _45 == 0u;
                    if (!_48)
                    {
                        _105 = true;
                        break;
                    }
                    if ((_36 & 7u) == 0u)
                    {
                        uint _54 = imageAtomicAdd(_8, int(0u), _36);
                        uint _47 = _46 + 1u;
                        if (_47 < _34)
                        {
                            _45 = 0u;
                            _46 = _47;
                            continue;
                        }
                        else
                        {
                            _105 = false;
                            break;
                        }
                    }
                    else
                    {
                        _105 = false;
                        break;
                    }
                }
                if (_105)
                {
                    break;
                }
            }
            uint _57 = imageAtomicAdd(_8, int(0u), _36);
            _36++;
            continue;
        }
        _68 = _36;
        _69 = _34;
        _70 = ~V.z;
        _71 = ~V.w;
    }
    SV_Target.x = float(_68);
    SV_Target.y = float(_69);
    SV_Target.z = float(_70);
    SV_Target.w = float(_71);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 143
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
%99 = OpTypePointer Function %30
%101 = OpConstantTrue %30
%102 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
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
OpSelectionMerge %137 None
OpBranchConditional %31 %123 %107
%107 = OpLabel
%33 = OpNot %5 %20
%34 = OpNot %5 %23
%35 = OpNot %5 %26
OpBranch %108
%108 = OpLabel
%36 = OpPhi %5 %33 %107 %37 %122
%39 = OpImageTexelPointer %38 %8 %19 %19
%40 = OpAtomicIAdd %5 %39 %41 %19 %36
%42 = OpIEqual %30 %23 %43
OpLoopMerge %119 %122 None
OpBranch %109
%109 = OpLabel
OpSelectionMerge %121 None
OpBranchConditional %42 %121 %110
%110 = OpLabel
%44 = OpBitwiseAnd %5 %36 %28
OpBranch %111
%111 = OpLabel
%45 = OpPhi %5 %44 %110 %19 %116
%46 = OpPhi %5 %19 %110 %47 %116
%48 = OpIEqual %30 %45 %19
OpLoopMerge %117 %116 None
OpBranch %112
%112 = OpLabel
OpSelectionMerge %114 None
OpBranchConditional %48 %114 %113
%113 = OpLabel
OpBranch %117
%114 = OpLabel
%50 = OpBitwiseAnd %5 %36 %51
%52 = OpIEqual %30 %50 %19
OpSelectionMerge %141 None
OpBranchConditional %52 %116 %115
%141 = OpLabel
OpUnreachable
%115 = OpLabel
OpBranch %117
%116 = OpLabel
%53 = OpImageTexelPointer %38 %8 %19 %19
%54 = OpAtomicIAdd %5 %53 %41 %19 %36
%47 = OpIAdd %5 %46 %22
%55 = OpULessThan %30 %47 %34
OpBranchConditional %55 %111 %117
%117 = OpLabel
%105 = OpPhi %30 %102 %116 %102 %115 %101 %113
OpSelectionMerge %118 None
OpBranchConditional %105 %119 %118
%118 = OpLabel
OpBranch %121
%119 = OpLabel
%49 = OpNot %5 %29
OpBranch %120
%120 = OpLabel
OpBranch %137
%121 = OpLabel
OpBranch %122
%122 = OpLabel
%56 = OpImageTexelPointer %38 %8 %19 %19
%57 = OpAtomicIAdd %5 %56 %41 %19 %36
%37 = OpIAdd %5 %36 %22
OpBranch %108
%123 = OpLabel
OpBranch %124
%124 = OpLabel
%58 = OpPhi %5 %20 %123 %59 %140
%60 = OpImageTexelPointer %38 %8 %19 %19
%61 = OpAtomicIAdd %5 %60 %41 %19 %58
%62 = OpIEqual %30 %23 %19
OpLoopMerge %135 %140 None
OpBranch %125
%125 = OpLabel
OpSelectionMerge %139 None
OpBranchConditional %62 %139 %126
%126 = OpLabel
%63 = OpBitwiseAnd %5 %58 %28
OpBranch %127
%127 = OpLabel
%64 = OpPhi %5 %63 %126 %19 %132
%65 = OpPhi %5 %19 %126 %66 %132
%67 = OpIEqual %30 %64 %19
OpLoopMerge %133 %132 None
OpBranch %128
%128 = OpLabel
OpSelectionMerge %130 None
OpBranchConditional %67 %130 %129
%129 = OpLabel
OpBranch %133
%130 = OpLabel
%81 = OpBitwiseAnd %5 %58 %51
%82 = OpIEqual %30 %81 %19
OpSelectionMerge %142 None
OpBranchConditional %82 %132 %131
%142 = OpLabel
OpUnreachable
%131 = OpLabel
OpBranch %133
%132 = OpLabel
%83 = OpImageTexelPointer %38 %8 %19 %19
%84 = OpAtomicIAdd %5 %83 %41 %19 %58
%66 = OpIAdd %5 %65 %22
%85 = OpULessThan %30 %66 %23
OpBranchConditional %85 %127 %133
%133 = OpLabel
%103 = OpPhi %30 %102 %132 %102 %131 %101 %129
OpSelectionMerge %134 None
OpBranchConditional %103 %135 %134
%134 = OpLabel
OpBranch %139
%135 = OpLabel
OpBranch %136
%136 = OpLabel
OpBranch %137
%137 = OpLabel
%68 = OpPhi %5 %58 %136 %36 %120
%69 = OpPhi %5 %23 %136 %34 %120
%70 = OpPhi %5 %26 %136 %35 %120
%71 = OpPhi %5 %29 %136 %49 %120
OpBranch %138
%138 = OpLabel
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
%139 = OpLabel
OpBranch %140
%140 = OpLabel
%86 = OpImageTexelPointer %38 %8 %19 %19
%87 = OpAtomicIAdd %5 %86 %41 %19 %58
%59 = OpIAdd %5 %58 %22
OpBranch %124
OpFunctionEnd
#endif
