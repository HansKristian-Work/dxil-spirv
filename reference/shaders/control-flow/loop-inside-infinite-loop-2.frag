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
        uint _37;
        _37 = V.x;
        bool _42;
        for (;;)
        {
            uint _41 = imageAtomicAdd(_8, int(0u), _37);
            _42 = V.y == 0u;
            if (!_42)
            {
                uint _50 = _37 & 3u;
                bool ladder_phi_16;
                uint _54 = _50;
                uint _55 = 0u;
                for (;;)
                {
                    if (_54 == 0u)
                    {
                        if (!((_37 & 7u) == 0u))
                        {
                            ladder_phi_16 = false;
                            break;
                        }
                        uint _69 = imageAtomicAdd(_8, int(0u), _37);
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
            uint _49 = imageAtomicAdd(_8, int(0u), _37);
            _37++;
            continue;
        }
        _71 = _37;
        _72 = V.y;
        _73 = V.z;
        _74 = V.w;
    }
    else
    {
        uint _35 = V.y ^ 4294967295u;
        uint _43;
        _43 = V.x ^ 4294967295u;
        bool _47;
        for (;;)
        {
            uint _46 = imageAtomicAdd(_8, int(0u), _43);
            _47 = V.y == 4294967295u;
            if (!_47)
            {
                uint _53 = _43 & 3u;
                bool ladder_phi_19;
                uint _58 = _53;
                uint _59 = 0u;
                for (;;)
                {
                    if (_58 == 0u)
                    {
                        if (!((_43 & 7u) == 0u))
                        {
                            ladder_phi_19 = false;
                            break;
                        }
                        uint _85 = imageAtomicAdd(_8, int(0u), _43);
                        uint _60 = _59 + 1u;
                        if (_60 < _35)
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
            uint _52 = imageAtomicAdd(_8, int(0u), _43);
            _43++;
            continue;
        }
        _71 = _43;
        _72 = _35;
        _73 = V.z ^ 4294967295u;
        _74 = V.w ^ 4294967295u;
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
%34 = OpConstant %5 4294967295
%39 = OpTypePointer Image %5
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
%37 = OpPhi %5 %20 %105 %38 %118
%40 = OpImageTexelPointer %39 %8 %19 %19
%41 = OpAtomicIAdd %5 %40 %22 %19 %37
%42 = OpIEqual %30 %23 %19
OpLoopMerge %114 %118 None
OpBranch %107
%107 = OpLabel
OpSelectionMerge %117 None
OpBranchConditional %42 %117 %108
%108 = OpLabel
%50 = OpBitwiseAnd %5 %37 %28
OpBranch %109
%109 = OpLabel
%54 = OpPhi %5 %50 %108 %19 %112
%55 = OpPhi %5 %19 %108 %56 %112
%57 = OpIEqual %30 %54 %19
OpLoopMerge %113 %112 None
OpBranchConditional %57 %110 %113
%110 = OpLabel
%62 = OpBitwiseAnd %5 %37 %63
%64 = OpIEqual %30 %62 %19
OpSelectionMerge %111 None
OpBranchConditional %64 %111 %113
%111 = OpLabel
OpBranch %112
%112 = OpLabel
%68 = OpImageTexelPointer %39 %8 %19 %19
%69 = OpAtomicIAdd %5 %68 %22 %19 %37
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
%48 = OpImageTexelPointer %39 %8 %19 %19
%49 = OpAtomicIAdd %5 %48 %22 %19 %37
%38 = OpIAdd %5 %37 %22
OpBranch %106
%114 = OpLabel
OpBranch %115
%92 = OpLabel
%33 = OpBitwiseXor %5 %20 %34
%35 = OpBitwiseXor %5 %23 %34
%36 = OpBitwiseXor %5 %26 %34
OpBranch %93
%93 = OpLabel
%43 = OpPhi %5 %33 %92 %44 %104
%45 = OpImageTexelPointer %39 %8 %19 %19
%46 = OpAtomicIAdd %5 %45 %22 %19 %43
%47 = OpIEqual %30 %23 %34
OpLoopMerge %101 %104 None
OpBranch %94
%94 = OpLabel
OpSelectionMerge %103 None
OpBranchConditional %47 %103 %95
%95 = OpLabel
%53 = OpBitwiseAnd %5 %43 %28
OpBranch %96
%96 = OpLabel
%58 = OpPhi %5 %53 %95 %19 %99
%59 = OpPhi %5 %19 %95 %60 %99
%61 = OpIEqual %30 %58 %19
OpLoopMerge %100 %99 None
OpBranchConditional %61 %97 %100
%97 = OpLabel
%65 = OpBitwiseAnd %5 %43 %63
%66 = OpIEqual %30 %65 %19
OpSelectionMerge %98 None
OpBranchConditional %66 %98 %100
%98 = OpLabel
OpBranch %99
%99 = OpLabel
%84 = OpImageTexelPointer %39 %8 %19 %19
%85 = OpAtomicIAdd %5 %84 %22 %19 %43
%60 = OpIAdd %5 %59 %22
%86 = OpULessThan %30 %60 %35
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
%51 = OpImageTexelPointer %39 %8 %19 %19
%52 = OpAtomicIAdd %5 %51 %22 %19 %43
%44 = OpIAdd %5 %43 %22
OpBranch %93
%101 = OpLabel
%67 = OpBitwiseXor %5 %29 %34
OpBranch %115
%115 = OpLabel
%71 = OpPhi %5 %37 %114 %43 %101
%72 = OpPhi %5 %23 %114 %35 %101
%73 = OpPhi %5 %26 %114 %36 %101
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
