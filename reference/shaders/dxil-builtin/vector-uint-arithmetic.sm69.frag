#version 460
#if defined(GL_EXT_control_flow_attributes)
#extension GL_EXT_control_flow_attributes : require
#define SPIRV_CROSS_FLATTEN [[flatten]]
#define SPIRV_CROSS_BRANCH [[dont_flatten]]
#define SPIRV_CROSS_UNROLL [[unroll]]
#define SPIRV_CROSS_LOOP [[dont_unroll]]
#else
#define SPIRV_CROSS_FLATTEN
#define SPIRV_CROSS_BRANCH
#define SPIRV_CROSS_UNROLL
#define SPIRV_CROSS_LOOP
#endif

uvec4 _70;
uvec4 _18;
vec4 _120;

layout(location = 0) flat in uvec4 A;
layout(location = 1) flat in uvec4 B;
layout(location = 2) flat in uvec4 C;
layout(location = 0) out uvec4 SV_Target;

uvec4 UDiv(uvec4 num, uvec4 den)
{
    uint _69;
    SPIRV_CROSS_FLATTEN
    if (den.x == 0u)
    {
        _69 = 4294967295u;
    }
    else
    {
        _69 = num.x / den.x;
    }
    uvec4 _71;
    _71.x = _69;
    uint _79;
    SPIRV_CROSS_FLATTEN
    if (den.y == 0u)
    {
        _79 = 4294967295u;
    }
    else
    {
        _79 = num.y / den.y;
    }
    _71.y = _79;
    uint _88;
    SPIRV_CROSS_FLATTEN
    if (den.z == 0u)
    {
        _88 = 4294967295u;
    }
    else
    {
        _88 = num.z / den.z;
    }
    _71.z = _88;
    uint _97;
    SPIRV_CROSS_FLATTEN
    if (den.w == 0u)
    {
        _97 = 4294967295u;
    }
    else
    {
        _97 = num.w / den.w;
    }
    _71.w = _97;
    return _71;
}

void main()
{
    uvec4 _17;
    _17.x = C.x;
    _17.y = C.y;
    _17.z = C.z;
    _17.w = C.w;
    uvec4 _33;
    _33.x = B.x;
    _33.y = B.y;
    _33.z = B.z;
    _33.w = B.w;
    uvec4 _45;
    _45.x = A.x;
    _45.y = A.y;
    _45.z = A.z;
    _45.w = A.w;
    vec4 _110 = vec4((_45 * _33) + _17);
    float _111 = _110.x;
    float _118 = inversesqrt(dot(vec4(_111, _110.yzw), vec4(_111, _110.yzw)));
    vec4 _119;
    _119.x = _118;
    _119.y = _118;
    _119.z = _118;
    _119.w = _118;
    uvec4 _127 = min(uvec4(sqrt(vec4(_45 + UDiv(_33, _17)))), uvec4(cos(_119 * _110)));
    SV_Target.x = _127.x;
    SV_Target.y = _127.y;
    SV_Target.z = _127.z;
    SV_Target.w = _127.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 139
; Schema: 0
OpCapability Shader
%107 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %10 "C"
OpName %12 "SV_Target"
OpName %58 "UDiv"
OpName %56 "num"
OpName %57 "den"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %9 Flat
OpDecorate %9 Location 1
OpDecorate %10 Flat
OpDecorate %10 Location 2
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%20 = OpConstant %5 1
%24 = OpConstant %5 2
%28 = OpConstant %5 3
%55 = OpTypeFunction %6 %6 %6
%60 = OpConstant %5 4294967295
%65 = OpTypeBool
%67 = OpConstantNull %5
%70 = OpUndef %6
%77 = OpConstantNull %5
%86 = OpConstantNull %5
%95 = OpConstantNull %5
%104 = OpTypeFloat 32
%105 = OpTypeVector %104 4
%129 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%18 = OpUndef %6
%120 = OpUndef %105
OpBranch %137
%137 = OpLabel
%14 = OpAccessChain %13 %10 %15
%16 = OpLoad %5 %14
%17 = OpCompositeInsert %6 %16 %18 0
%19 = OpAccessChain %13 %10 %20
%21 = OpLoad %5 %19
%22 = OpCompositeInsert %6 %21 %17 1
%23 = OpAccessChain %13 %10 %24
%25 = OpLoad %5 %23
%26 = OpCompositeInsert %6 %25 %22 2
%27 = OpAccessChain %13 %10 %28
%29 = OpLoad %5 %27
%30 = OpCompositeInsert %6 %29 %26 3
%31 = OpAccessChain %13 %9 %15
%32 = OpLoad %5 %31
%33 = OpCompositeInsert %6 %32 %18 0
%34 = OpAccessChain %13 %9 %20
%35 = OpLoad %5 %34
%36 = OpCompositeInsert %6 %35 %33 1
%37 = OpAccessChain %13 %9 %24
%38 = OpLoad %5 %37
%39 = OpCompositeInsert %6 %38 %36 2
%40 = OpAccessChain %13 %9 %28
%41 = OpLoad %5 %40
%42 = OpCompositeInsert %6 %41 %39 3
%43 = OpAccessChain %13 %8 %15
%44 = OpLoad %5 %43
%45 = OpCompositeInsert %6 %44 %18 0
%46 = OpAccessChain %13 %8 %20
%47 = OpLoad %5 %46
%48 = OpCompositeInsert %6 %47 %45 1
%49 = OpAccessChain %13 %8 %24
%50 = OpLoad %5 %49
%51 = OpCompositeInsert %6 %50 %48 2
%52 = OpAccessChain %13 %8 %28
%53 = OpLoad %5 %52
%54 = OpCompositeInsert %6 %53 %51 3
%100 = OpFunctionCall %6 %58 %42 %30
%101 = OpIAdd %6 %54 %100
%102 = OpIMul %6 %54 %42
%103 = OpIAdd %6 %102 %30
%106 = OpConvertUToF %105 %101
%108 = OpExtInst %105 %107 Sqrt %106
%109 = OpConvertFToU %6 %108
%110 = OpConvertUToF %105 %103
%111 = OpCompositeExtract %104 %110 0
%112 = OpCompositeExtract %104 %110 1
%113 = OpCompositeExtract %104 %110 2
%114 = OpCompositeExtract %104 %110 3
%116 = OpCompositeConstruct %105 %111 %112 %113 %114
%117 = OpCompositeConstruct %105 %111 %112 %113 %114
%115 = OpDot %104 %116 %117
%118 = OpExtInst %104 %107 InverseSqrt %115
%119 = OpCompositeInsert %105 %118 %120 0
%121 = OpCompositeInsert %105 %118 %119 1
%122 = OpCompositeInsert %105 %118 %121 2
%123 = OpCompositeInsert %105 %118 %122 3
%124 = OpFMul %105 %123 %110
%125 = OpExtInst %105 %107 Cos %124
%126 = OpConvertFToU %6 %125
%127 = OpExtInst %6 %107 UMin %109 %126
%128 = OpCompositeExtract %5 %127 0
%130 = OpAccessChain %129 %12 %15
OpStore %130 %128
%131 = OpCompositeExtract %5 %127 1
%132 = OpAccessChain %129 %12 %20
OpStore %132 %131
%133 = OpCompositeExtract %5 %127 2
%134 = OpAccessChain %129 %12 %24
OpStore %134 %133
%135 = OpCompositeExtract %5 %127 3
%136 = OpAccessChain %129 %12 %28
OpStore %136 %135
OpReturn
OpFunctionEnd
%58 = OpFunction %6 None %55
%56 = OpFunctionParameter %6
%57 = OpFunctionParameter %6
%59 = OpLabel
%63 = OpCompositeExtract %5 %56 0
%64 = OpCompositeExtract %5 %57 0
%66 = OpIEqual %65 %64 %67
OpSelectionMerge %62 Flatten
OpBranchConditional %66 %62 %61
%61 = OpLabel
%68 = OpUDiv %5 %63 %64
OpBranch %62
%62 = OpLabel
%69 = OpPhi %5 %60 %59 %68 %61
%71 = OpCompositeInsert %6 %69 %70 0
%74 = OpCompositeExtract %5 %56 1
%75 = OpCompositeExtract %5 %57 1
%76 = OpIEqual %65 %75 %77
OpSelectionMerge %73 Flatten
OpBranchConditional %76 %73 %72
%72 = OpLabel
%78 = OpUDiv %5 %74 %75
OpBranch %73
%73 = OpLabel
%79 = OpPhi %5 %60 %62 %78 %72
%80 = OpCompositeInsert %6 %79 %71 1
%83 = OpCompositeExtract %5 %56 2
%84 = OpCompositeExtract %5 %57 2
%85 = OpIEqual %65 %84 %86
OpSelectionMerge %82 Flatten
OpBranchConditional %85 %82 %81
%81 = OpLabel
%87 = OpUDiv %5 %83 %84
OpBranch %82
%82 = OpLabel
%88 = OpPhi %5 %60 %73 %87 %81
%89 = OpCompositeInsert %6 %88 %80 2
%92 = OpCompositeExtract %5 %56 3
%93 = OpCompositeExtract %5 %57 3
%94 = OpIEqual %65 %93 %95
OpSelectionMerge %91 Flatten
OpBranchConditional %94 %91 %90
%90 = OpLabel
%96 = OpUDiv %5 %92 %93
OpBranch %91
%91 = OpLabel
%97 = OpPhi %5 %60 %82 %96 %90
%98 = OpCompositeInsert %6 %97 %89 3
OpReturnValue %98
OpFunctionEnd
#endif
