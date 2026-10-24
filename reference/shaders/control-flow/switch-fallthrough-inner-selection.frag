#version 460
#extension GL_EXT_spirv_intrinsics : require

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[1];
} _12;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) in vec4 TEXCOORD_1;
layout(location = 2) in vec4 TEXCOORD_2;
layout(location = 0) out vec4 SV_Target;

spirv_instruction(set = "GLSL.std.450", id = 79) float spvNMin(float, float);
spirv_instruction(set = "GLSL.std.450", id = 79) vec2 spvNMin(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 79) vec3 spvNMin(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 79) vec4 spvNMin(vec4, vec4);
spirv_instruction(set = "GLSL.std.450", id = 80) float spvNMax(float, float);
spirv_instruction(set = "GLSL.std.450", id = 80) vec2 spvNMax(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 80) vec3 spvNMax(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 80) vec4 spvNMax(vec4, vec4);

void main()
{
    float _32;
    float _34;
    float _36;
    float _38;
    uint _40;
    float _62;
    float _63;
    float _64;
    float _65;
    float _30 = 0.0;
    float _33 = 0.0;
    float _35 = 0.0;
    float _37 = 0.0;
    uint _39 = 0u;
    uint _41 = 0u;
    for (;;)
    {
        uint _55;
        bool _91_ladder_break = false;
        if (_41 == 1)
        {
            _32 = _30;
            _34 = _33;
            _36 = _35;
            _55 = _39;
        }
        switch (_41)
        {
            case 0u:
            {
                uvec4 _47 = floatBitsToUint(_12._m0[0u]);
                uint _48 = _47.x;
                uint _50 = (_48 >> 1u) & 1u;
                if ((_48 & 1u) == 0u)
                {
                    _32 = TEXCOORD_1.x;
                    _34 = TEXCOORD_1.y;
                    _36 = TEXCOORD_1.z;
                    _55 = _50;
                    bool _56 = _55 == 0u;
                    if (!_56)
                    {
                        _38 = _37;
                        _40 = _55;
                        _30 = _32;
                        _33 = _34;
                        _35 = _36;
                        _37 = _38;
                        _39 = _40;
                        _41 = 3u;
                        continue;
                    }
                    float _80 = 1.0 / TEXCOORD_2.z;
                    float _82 = spvNMax(_80, -3.3999999521443642490773241379936e+38);
                    float _84 = spvNMin(_82, 3.3999999521443642490773241379936e+38);
                    _38 = _84;
                    _40 = 0u;
                    _30 = _32;
                    _33 = _34;
                    _35 = _36;
                    _37 = _38;
                    _39 = _40;
                    _41 = 3u;
                    continue;
                }
                else
                {
                    bool _72 = TEXCOORD_1.x >= 0.25;
                    _32 = ((_72 ? 2.0 : 1.0) * TEXCOORD_1.x) + (_72 ? (-0.5) : 0.0);
                    _34 = TEXCOORD_1.y;
                    _36 = TEXCOORD_1.z;
                    _55 = _50;
                    bool _56 = _55 == 0u;
                    if (!_56)
                    {
                        _38 = _37;
                        _40 = _55;
                        _30 = _32;
                        _33 = _34;
                        _35 = _36;
                        _37 = _38;
                        _39 = _40;
                        _41 = 3u;
                        continue;
                    }
                    float _80 = 1.0 / TEXCOORD_2.z;
                    float _82 = spvNMax(_80, -3.3999999521443642490773241379936e+38);
                    float _84 = spvNMin(_82, 3.3999999521443642490773241379936e+38);
                    _38 = _84;
                    _40 = 0u;
                    _30 = _32;
                    _33 = _34;
                    _35 = _36;
                    _37 = _38;
                    _39 = _40;
                    _41 = 3u;
                    continue;
                }
            }
            case 1u:
            {
                bool _56 = _55 == 0u;
                if (!_56)
                {
                    _38 = _37;
                    _40 = _55;
                    _30 = _32;
                    _33 = _34;
                    _35 = _36;
                    _37 = _38;
                    _39 = _40;
                    _41 = 3u;
                    continue;
                }
                float _80 = 1.0 / TEXCOORD_2.z;
                float _82 = spvNMax(_80, -3.3999999521443642490773241379936e+38);
                float _84 = spvNMin(_82, 3.3999999521443642490773241379936e+38);
                _38 = _84;
                _40 = 0u;
                _30 = _32;
                _33 = _34;
                _35 = _36;
                _37 = _38;
                _39 = _40;
                _41 = 3u;
                continue;
            }
            case 3u:
            {
                if (!(floatBitsToUint(_12._m0[0u]).y == 1u))
                {
                    _62 = _30;
                    _63 = _33;
                    _64 = _35;
                    _65 = _37;
                    _91_ladder_break = true;
                    break;
                }
                _62 = _30;
                _63 = _33;
                _64 = _35;
                _65 = _12._m0[0u].z * _37;
                _91_ladder_break = true;
                break;
            }
            default:
            {
                _62 = 0.0;
                _63 = 0.0;
                _64 = 0.0;
                _65 = 0.0;
                _91_ladder_break = true;
                break;
            }
        }
        if (_91_ladder_break)
        {
            break;
        }
    }
    SV_Target.x = _62;
    SV_Target.y = _63;
    SV_Target.z = _64;
    SV_Target.w = _65;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 103
; Schema: 0
OpCapability Shader
%81 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %15 %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "TEXCOORD"
OpName %15 "TEXCOORD_1"
OpName %16 "TEXCOORD_2"
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
OpDecorate %15 Location 1
OpDecorate %16 Location 2
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %8
%14 = OpVariable %13 Input
%15 = OpVariable %13 Input
%16 = OpVariable %13 Input
%17 = OpTypePointer Output %8
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %7
%21 = OpConstant %5 2
%24 = OpConstant %5 0
%31 = OpConstant %7 0
%42 = OpConstant %5 3
%43 = OpTypePointer Uniform %8
%46 = OpTypeVector %5 4
%52 = OpTypeBool
%67 = OpTypePointer Output %7
%73 = OpConstant %7 0.25
%75 = OpConstant %7 -0.5
%77 = OpConstant %7 2
%78 = OpConstant %7 1
%83 = OpConstant %7 -3.39999995e+38
%85 = OpConstant %7 3.39999995e+38
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%20 = OpAccessChain %19 %16 %21
%22 = OpLoad %7 %20
%23 = OpAccessChain %19 %15 %24
%25 = OpLoad %7 %23
%26 = OpAccessChain %19 %15 %6
%27 = OpLoad %7 %26
%28 = OpAccessChain %19 %15 %21
%29 = OpLoad %7 %28
OpBranch %90
%90 = OpLabel
%30 = OpPhi %7 %31 %89 %32 %98
%33 = OpPhi %7 %31 %89 %34 %98
%35 = OpPhi %7 %31 %89 %36 %98
%37 = OpPhi %7 %31 %89 %38 %98
%39 = OpPhi %5 %24 %89 %40 %98
%41 = OpPhi %5 %24 %89 %42 %98
OpLoopMerge %100 %98 None
OpBranch %91
%91 = OpLabel
OpSelectionMerge %101 None
OpSwitch %41 %99 0 %94 1 %96 3 %92
%99 = OpLabel
OpBranch %100
%94 = OpLabel
%44 = OpAccessChain %43 %12 %24 %24
%45 = OpLoad %8 %44
%47 = OpBitcast %46 %45
%48 = OpCompositeExtract %5 %47 0
%49 = OpShiftRightLogical %5 %48 %6
%50 = OpBitwiseAnd %5 %49 %6
%51 = OpBitwiseAnd %5 %48 %6
%53 = OpIEqual %52 %51 %24
OpBranchConditional %53 %96 %95
%96 = OpLabel
%32 = OpPhi %7 %30 %91 %25 %94 %54 %95
%34 = OpPhi %7 %33 %91 %27 %94 %27 %95
%36 = OpPhi %7 %35 %91 %29 %94 %29 %95
%55 = OpPhi %5 %39 %91 %50 %94 %50 %95
%56 = OpIEqual %52 %55 %24
OpSelectionMerge %97 None
OpBranchConditional %56 %97 %98
%97 = OpLabel
%80 = OpFDiv %7 %78 %22
%82 = OpExtInst %7 %81 NMax %80 %83
%84 = OpExtInst %7 %81 NMin %82 %85
OpBranch %98
%95 = OpLabel
%72 = OpFOrdGreaterThanEqual %52 %25 %73
%74 = OpSelect %7 %72 %75 %31
%76 = OpSelect %7 %72 %77 %78
%79 = OpFMul %7 %76 %25
%54 = OpFAdd %7 %79 %74
OpBranch %96
%92 = OpLabel
%57 = OpAccessChain %43 %12 %24 %24
%58 = OpLoad %8 %57
%59 = OpBitcast %46 %58
%60 = OpCompositeExtract %5 %59 1
%61 = OpIEqual %52 %60 %6
OpSelectionMerge %93 None
OpBranchConditional %61 %93 %100
%93 = OpLabel
%86 = OpAccessChain %43 %12 %24 %24
%87 = OpLoad %8 %86
%88 = OpCompositeExtract %7 %87 2
%66 = OpFMul %7 %88 %37
OpBranch %100
%101 = OpLabel
OpUnreachable
%98 = OpLabel
%38 = OpPhi %7 %37 %96 %84 %97
%40 = OpPhi %5 %55 %96 %24 %97
OpBranch %90
%100 = OpLabel
%62 = OpPhi %7 %31 %99 %30 %92 %30 %93
%63 = OpPhi %7 %31 %99 %33 %92 %33 %93
%64 = OpPhi %7 %31 %99 %35 %92 %35 %93
%65 = OpPhi %7 %31 %99 %37 %92 %66 %93
%68 = OpAccessChain %67 %18 %24
OpStore %68 %62
%69 = OpAccessChain %67 %18 %6
OpStore %69 %63
%70 = OpAccessChain %67 %18 %21
OpStore %70 %64
%71 = OpAccessChain %67 %18 %42
OpStore %71 %65
OpReturn
OpFunctionEnd
#endif
