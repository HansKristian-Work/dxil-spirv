#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _71;
    uint _72;
    uint _73;
    uint _74;
    if (V.x < 10u)
    {
        uint _36;
        _36 = V.x;
        bool _41;
        for (;;)
        {
            uint _40 = imageAtomicAdd(_8, int(0u), _36);
            _41 = V.y == 0u;
            if (!_41)
            {
                uint _50 = _36 & 3u;
                bool ladder_phi_16;
                uint _54 = _50;
                uint _55 = 0u;
                for (;;)
                {
                    if (_54 == 0u)
                    {
                        if (!((_36 & 7u) == 0u))
                        {
                            ladder_phi_16 = false;
                            break;
                        }
                        uint _69 = imageAtomicAdd(_8, int(0u), _36);
                        uint _56 = _55 + 1u;
                        if (_56 < V.y)
                        {
                            _54 = 0u;
                            _55 = _56;
                            continue;
                        }
                        else
                        {
                            ladder_phi_16 = false;
                            break;
                        }
                    }
                    else
                    {
                        ladder_phi_16 = true;
                        break;
                    }
                }
                if (ladder_phi_16)
                {
                    break;
                }
            }
            uint _49 = imageAtomicAdd(_8, int(0u), _36);
            _36++;
            continue;
        }
        _71 = _36;
        _72 = V.y;
        _73 = V.z;
        _74 = V.w;
    }
    else
    {
        uint _34 = ~V.y;
        uint _42;
        _42 = ~V.x;
        bool _46;
        for (;;)
        {
            uint _45 = imageAtomicAdd(_8, int(0u), _42);
            _46 = V.y == 4294967295u;
            if (!_46)
            {
                uint _53 = _42 & 3u;
                bool ladder_phi_19;
                uint _58 = _53;
                uint _59 = 0u;
                for (;;)
                {
                    if (_58 == 0u)
                    {
                        if (!((_42 & 7u) == 0u))
                        {
                            ladder_phi_19 = false;
                            break;
                        }
                        uint _85 = imageAtomicAdd(_8, int(0u), _42);
                        uint _60 = _59 + 1u;
                        if (_60 < _34)
                        {
                            _58 = 0u;
                            _59 = _60;
                            continue;
                        }
                        else
                        {
                            ladder_phi_19 = false;
                            break;
                        }
                    }
                    else
                    {
                        ladder_phi_19 = true;
                        break;
                    }
                }
                if (ladder_phi_19)
                {
                    break;
                }
            }
            uint _52 = imageAtomicAdd(_8, int(0u), _42);
            _42++;
            continue;
        }
        _71 = _42;
        _72 = _34;
        _73 = ~V.z;
        _74 = ~V.w;
    }
    SV_Target.x = float(_71);
    SV_Target.y = float(_72);
    SV_Target.z = float(_73);
    SV_Target.w = float(_74);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "V"
OpName %15 "SV_Target"
OpName %87 "ladder_phi_16"
OpName %90 "ladder_phi_19"
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
%88 = OpConstantFalse %30
%89 = OpConstantTrue %30
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
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
OpSelectionMerge %115 None
OpBranchConditional %31 %105 %92
%105 = OpLabel
OpBranch %106
%106 = OpLabel
%36 = OpPhi %5 %20 %105 %37 %118
%39 = OpImageTexelPointer %38 %8 %19 %19
%40 = OpAtomicIAdd %5 %39 %22 %19 %36
%41 = OpIEqual %30 %23 %19
OpLoopMerge %114 %118 None
OpBranch %107
%107 = OpLabel
OpSelectionMerge %117 None
OpBranchConditional %41 %117 %108
%108 = OpLabel
%50 = OpBitwiseAnd %5 %36 %28
OpBranch %109
%109 = OpLabel
%54 = OpPhi %5 %50 %108 %19 %112
%55 = OpPhi %5 %19 %108 %56 %112
%57 = OpIEqual %30 %54 %19
OpLoopMerge %113 %112 None
OpBranchConditional %57 %110 %113
%110 = OpLabel
%62 = OpBitwiseAnd %5 %36 %63
%64 = OpIEqual %30 %62 %19
OpSelectionMerge %111 None
OpBranchConditional %64 %111 %113
%111 = OpLabel
OpBranch %112
%112 = OpLabel
%68 = OpImageTexelPointer %38 %8 %19 %19
%69 = OpAtomicIAdd %5 %68 %22 %19 %36
%56 = OpIAdd %5 %55 %22
%70 = OpULessThan %30 %56 %23
OpBranchConditional %70 %109 %113
%113 = OpLabel
%87 = OpPhi %30 %88 %110 %88 %112 %89 %109
OpSelectionMerge %116 None
OpBranchConditional %87 %114 %116
%116 = OpLabel
OpBranch %117
%117 = OpLabel
OpBranch %118
%118 = OpLabel
%48 = OpImageTexelPointer %38 %8 %19 %19
%49 = OpAtomicIAdd %5 %48 %22 %19 %36
%37 = OpIAdd %5 %36 %22
OpBranch %106
%114 = OpLabel
OpBranch %115
%92 = OpLabel
%33 = OpNot %5 %20
%34 = OpNot %5 %23
%35 = OpNot %5 %26
OpBranch %93
%93 = OpLabel
%42 = OpPhi %5 %33 %92 %43 %104
%44 = OpImageTexelPointer %38 %8 %19 %19
%45 = OpAtomicIAdd %5 %44 %22 %19 %42
%46 = OpIEqual %30 %23 %47
OpLoopMerge %101 %104 None
OpBranch %94
%94 = OpLabel
OpSelectionMerge %103 None
OpBranchConditional %46 %103 %95
%95 = OpLabel
%53 = OpBitwiseAnd %5 %42 %28
OpBranch %96
%96 = OpLabel
%58 = OpPhi %5 %53 %95 %19 %99
%59 = OpPhi %5 %19 %95 %60 %99
%61 = OpIEqual %30 %58 %19
OpLoopMerge %100 %99 None
OpBranchConditional %61 %97 %100
%97 = OpLabel
%65 = OpBitwiseAnd %5 %42 %63
%66 = OpIEqual %30 %65 %19
OpSelectionMerge %98 None
OpBranchConditional %66 %98 %100
%98 = OpLabel
OpBranch %99
%99 = OpLabel
%84 = OpImageTexelPointer %38 %8 %19 %19
%85 = OpAtomicIAdd %5 %84 %22 %19 %42
%60 = OpIAdd %5 %59 %22
%86 = OpULessThan %30 %60 %34
OpBranchConditional %86 %96 %100
%100 = OpLabel
%90 = OpPhi %30 %88 %97 %88 %99 %89 %96
OpSelectionMerge %102 None
OpBranchConditional %90 %101 %102
%102 = OpLabel
OpBranch %103
%103 = OpLabel
OpBranch %104
%104 = OpLabel
%51 = OpImageTexelPointer %38 %8 %19 %19
%52 = OpAtomicIAdd %5 %51 %22 %19 %42
%43 = OpIAdd %5 %42 %22
OpBranch %93
%101 = OpLabel
%67 = OpNot %5 %29
OpBranch %115
%115 = OpLabel
%71 = OpPhi %5 %36 %114 %42 %101
%72 = OpPhi %5 %23 %114 %34 %101
%73 = OpPhi %5 %26 %114 %35 %101
%74 = OpPhi %5 %29 %114 %67 %101
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
