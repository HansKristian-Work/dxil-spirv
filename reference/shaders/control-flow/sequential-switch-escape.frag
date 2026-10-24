#version 460

float _64;
float _66;
float _68;
float _70;
float _72;
float _73;
float _76;
float _77;
float _80;
float _81;
float _84;
float _85;

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[2];
} _12;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _30;
    bool transpose_ladder_phi_9_transpose;
    float frontier_phi_9_transpose;
    float frontier_phi_9_transpose_1;
    float frontier_phi_9_transpose_2;
    float frontier_phi_9_transpose_3;
    float frontier_phi_9_transpose_4;
    float frontier_phi_9_transpose_5;
    float frontier_phi_9_transpose_6;
    float frontier_phi_9_transpose_7;
    uint _29 = 0u;
    for (;;)
    {
        bool _89_ladder_break = false;
        switch (_29)
        {
            case 0u:
            {
                if (TEXCOORD.x > _12._m0[0u].x)
                {
                    _30 = 2u;
                    _29 = _30;
                    continue;
                }
                _30 = 3u;
                _29 = _30;
                continue;
            }
            case 1u:
            {
                _30 = 3u;
                _29 = _30;
                continue;
            }
            case 2u:
            {
                transpose_ladder_phi_9_transpose = false;
                frontier_phi_9_transpose = TEXCOORD.x;
                frontier_phi_9_transpose_1 = TEXCOORD.y;
                frontier_phi_9_transpose_2 = TEXCOORD.z;
                frontier_phi_9_transpose_3 = TEXCOORD.w;
                frontier_phi_9_transpose_4 = _72;
                frontier_phi_9_transpose_5 = _76;
                frontier_phi_9_transpose_6 = _80;
                frontier_phi_9_transpose_7 = _84;
                _89_ladder_break = true;
                break;
            }
            case 3u:
            {
                transpose_ladder_phi_9_transpose = false;
                frontier_phi_9_transpose = 0.0;
                frontier_phi_9_transpose_1 = 0.0;
                frontier_phi_9_transpose_2 = 0.0;
                frontier_phi_9_transpose_3 = 0.0;
                frontier_phi_9_transpose_4 = _73;
                frontier_phi_9_transpose_5 = _77;
                frontier_phi_9_transpose_6 = _81;
                frontier_phi_9_transpose_7 = _85;
                _89_ladder_break = true;
                break;
            }
            default:
            {
                transpose_ladder_phi_9_transpose = true;
                frontier_phi_9_transpose = _64;
                frontier_phi_9_transpose_1 = _66;
                frontier_phi_9_transpose_2 = _68;
                frontier_phi_9_transpose_3 = _70;
                frontier_phi_9_transpose_4 = 0.0;
                frontier_phi_9_transpose_5 = 0.0;
                frontier_phi_9_transpose_6 = 0.0;
                frontier_phi_9_transpose_7 = 0.0;
                _89_ladder_break = true;
                break;
            }
        }
        if (_89_ladder_break)
        {
            break;
        }
    }
    float _38 = frontier_phi_9_transpose;
    float _42 = frontier_phi_9_transpose_1;
    float _45 = frontier_phi_9_transpose_2;
    float _48 = frontier_phi_9_transpose_3;
    float _37;
    float _41;
    float _44;
    float _47;
    if (transpose_ladder_phi_9_transpose)
    {
        _37 = frontier_phi_9_transpose_4;
        _41 = frontier_phi_9_transpose_5;
        _44 = frontier_phi_9_transpose_6;
        _47 = frontier_phi_9_transpose_7;
    }
    else
    {
        float frontier_phi_7_switch_merge;
        float frontier_phi_7_switch_merge_1;
        float frontier_phi_7_switch_merge_2;
        float frontier_phi_7_switch_merge_3;
        switch (floatBitsToUint(_12._m0[1u]).x)
        {
            case 1u:
            {
                frontier_phi_7_switch_merge = 0.0;
                frontier_phi_7_switch_merge_1 = 0.0;
                frontier_phi_7_switch_merge_2 = 0.0;
                frontier_phi_7_switch_merge_3 = 0.0;
                break;
            }
            case 2u:
            {
                frontier_phi_7_switch_merge = _38 * _38;
                frontier_phi_7_switch_merge_1 = _42 * _42;
                frontier_phi_7_switch_merge_2 = _45 * _45;
                frontier_phi_7_switch_merge_3 = _48 * _48;
                break;
            }
            default:
            {
                frontier_phi_7_switch_merge = _38;
                frontier_phi_7_switch_merge_1 = _42;
                frontier_phi_7_switch_merge_2 = _45;
                frontier_phi_7_switch_merge_3 = _48;
                break;
            }
        }
        _37 = frontier_phi_7_switch_merge;
        _41 = frontier_phi_7_switch_merge_1;
        _44 = frontier_phi_7_switch_merge_2;
        _47 = frontier_phi_7_switch_merge_3;
    }
    SV_Target.x = _37;
    SV_Target.y = _41;
    SV_Target.z = _44;
    SV_Target.w = _47;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "TEXCOORD"
OpName %16 "SV_Target"
OpName %60 "transpose_ladder_phi_9.transpose"
OpName %63 "frontier_phi_9.transpose"
OpName %65 "frontier_phi_9.transpose"
OpName %67 "frontier_phi_9.transpose"
OpName %69 "frontier_phi_9.transpose"
OpName %71 "frontier_phi_9.transpose"
OpName %74 "frontier_phi_7.switch-merge"
OpName %75 "frontier_phi_9.transpose"
OpName %78 "frontier_phi_7.switch-merge"
OpName %79 "frontier_phi_9.transpose"
OpName %82 "frontier_phi_7.switch-merge"
OpName %83 "frontier_phi_9.transpose"
OpName %86 "frontier_phi_7.switch-merge"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 2
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %8
%14 = OpVariable %13 Input
%15 = OpTypePointer Output %8
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %7
%19 = OpConstant %5 0
%22 = OpConstant %5 1
%27 = OpConstant %5 3
%31 = OpTypePointer Uniform %8
%35 = OpTypeBool
%40 = OpConstant %7 0
%50 = OpTypePointer Output %7
%57 = OpTypeVector %5 4
%61 = OpConstantFalse %35
%62 = OpConstantTrue %35
%3 = OpFunction %1 None %2
%4 = OpLabel
%64 = OpUndef %7
%66 = OpUndef %7
%68 = OpUndef %7
%70 = OpUndef %7
%72 = OpUndef %7
%73 = OpUndef %7
%76 = OpUndef %7
%77 = OpUndef %7
%80 = OpUndef %7
%81 = OpUndef %7
%84 = OpUndef %7
%85 = OpUndef %7
OpBranch %87
%87 = OpLabel
%18 = OpAccessChain %17 %14 %19
%20 = OpLoad %7 %18
%21 = OpAccessChain %17 %14 %22
%23 = OpLoad %7 %21
%24 = OpAccessChain %17 %14 %6
%25 = OpLoad %7 %24
%26 = OpAccessChain %17 %14 %27
%28 = OpLoad %7 %26
OpBranch %88
%88 = OpLabel
%29 = OpPhi %5 %19 %87 %30 %95
OpLoopMerge %97 %95 None
OpBranch %89
%89 = OpLabel
OpSelectionMerge %103 None
OpSwitch %29 %96 0 %93 1 %92 2 %91 3 %90
%96 = OpLabel
OpBranch %97
%93 = OpLabel
%32 = OpAccessChain %31 %12 %19 %19
%33 = OpLoad %8 %32
%34 = OpCompositeExtract %7 %33 0
%36 = OpFOrdGreaterThan %35 %20 %34
OpSelectionMerge %94 None
OpBranchConditional %36 %95 %94
%94 = OpLabel
OpBranch %95
%92 = OpLabel
OpBranch %95
%91 = OpLabel
OpBranch %97
%90 = OpLabel
OpBranch %97
%103 = OpLabel
OpUnreachable
%95 = OpLabel
%30 = OpPhi %5 %6 %93 %27 %92 %27 %94
OpBranch %88
%97 = OpLabel
%60 = OpPhi %35 %61 %91 %61 %90 %62 %96
%63 = OpPhi %7 %20 %91 %40 %90 %64 %96
%65 = OpPhi %7 %23 %91 %40 %90 %66 %96
%67 = OpPhi %7 %25 %91 %40 %90 %68 %96
%69 = OpPhi %7 %28 %91 %40 %90 %70 %96
%71 = OpPhi %7 %72 %91 %73 %90 %40 %96
%75 = OpPhi %7 %76 %91 %77 %90 %40 %96
%79 = OpPhi %7 %80 %91 %81 %90 %40 %96
%83 = OpPhi %7 %84 %91 %85 %90 %40 %96
%38 = OpCopyObject %7 %63
%42 = OpCopyObject %7 %65
%45 = OpCopyObject %7 %67
%48 = OpCopyObject %7 %69
OpSelectionMerge %102 None
OpBranchConditional %60 %102 %98
%98 = OpLabel
%55 = OpAccessChain %31 %12 %19 %22
%56 = OpLoad %8 %55
%58 = OpBitcast %57 %56
%59 = OpCompositeExtract %5 %58 0
OpSelectionMerge %101 None
OpSwitch %59 %101 1 %100 2 %99
%100 = OpLabel
OpBranch %101
%99 = OpLabel
%39 = OpFMul %7 %38 %38
%43 = OpFMul %7 %42 %42
%46 = OpFMul %7 %45 %45
%49 = OpFMul %7 %48 %48
OpBranch %101
%101 = OpLabel
%74 = OpPhi %7 %38 %98 %40 %100 %39 %99
%78 = OpPhi %7 %42 %98 %40 %100 %43 %99
%82 = OpPhi %7 %45 %98 %40 %100 %46 %99
%86 = OpPhi %7 %48 %98 %40 %100 %49 %99
OpBranch %102
%102 = OpLabel
%37 = OpPhi %7 %71 %97 %74 %101
%41 = OpPhi %7 %75 %97 %78 %101
%44 = OpPhi %7 %79 %97 %82 %101
%47 = OpPhi %7 %83 %97 %86 %101
%51 = OpAccessChain %50 %16 %19
OpStore %51 %37
%52 = OpAccessChain %50 %16 %22
OpStore %52 %41
%53 = OpAccessChain %50 %16 %6
OpStore %53 %44
%54 = OpAccessChain %50 %16 %27
OpStore %54 %47
OpReturn
OpFunctionEnd
#endif
