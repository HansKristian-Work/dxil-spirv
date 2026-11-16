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

uvec4 _18;
vec4 _118;

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
    uvec4 _70;
    _70.x = _69;
    uint _78;
    SPIRV_CROSS_FLATTEN
    if (den.y == 0u)
    {
        _78 = 4294967295u;
    }
    else
    {
        _78 = num.y / den.y;
    }
    _70.y = _78;
    uint _87;
    SPIRV_CROSS_FLATTEN
    if (den.z == 0u)
    {
        _87 = 4294967295u;
    }
    else
    {
        _87 = num.z / den.z;
    }
    _70.z = _87;
    uint _96;
    SPIRV_CROSS_FLATTEN
    if (den.w == 0u)
    {
        _96 = 4294967295u;
    }
    else
    {
        _96 = num.w / den.w;
    }
    _70.w = _96;
    return _70;
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
    vec4 _108 = vec4((_45 * _33) + _17);
    float _109 = _108.x;
    float _116 = inversesqrt(dot(vec4(_109, _108.yzw), vec4(_109, _108.yzw)));
    vec4 _117;
    _117.x = _116;
    _117.y = _116;
    _117.z = _116;
    _117.w = _116;
    uvec4 _125 = min(uvec4(sqrt(vec4(_45 + UDiv(_33, _17)))), uvec4(cos(_117 * _108)));
    SV_Target.x = _125.x;
    SV_Target.y = _125.y;
    SV_Target.z = _125.z;
    SV_Target.w = _125.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
%105 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
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
%18 = OpUndef %6
%20 = OpConstant %5 1
%24 = OpConstant %5 2
%28 = OpConstant %5 3
%55 = OpTypeFunction %6 %6 %6
%60 = OpConstant %5 4294967295
%65 = OpTypeBool
%67 = OpConstantNull %5
%76 = OpConstantNull %5
%85 = OpConstantNull %5
%94 = OpConstantNull %5
%102 = OpTypeFloat 32
%103 = OpTypeVector %102 4
%118 = OpUndef %103
%127 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %135
%135 = OpLabel
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
%98 = OpFunctionCall %6 %58 %42 %30
%99 = OpIAdd %6 %54 %98
%100 = OpIMul %6 %54 %42
%101 = OpIAdd %6 %100 %30
%104 = OpConvertUToF %103 %99
%106 = OpExtInst %103 %105 Sqrt %104
%107 = OpConvertFToU %6 %106
%108 = OpConvertUToF %103 %101
%109 = OpCompositeExtract %102 %108 0
%110 = OpCompositeExtract %102 %108 1
%111 = OpCompositeExtract %102 %108 2
%112 = OpCompositeExtract %102 %108 3
%114 = OpCompositeConstruct %103 %109 %110 %111 %112
%115 = OpCompositeConstruct %103 %109 %110 %111 %112
%113 = OpDot %102 %114 %115
%116 = OpExtInst %102 %105 InverseSqrt %113
%117 = OpCompositeInsert %103 %116 %118 0
%119 = OpCompositeInsert %103 %116 %117 1
%120 = OpCompositeInsert %103 %116 %119 2
%121 = OpCompositeInsert %103 %116 %120 3
%122 = OpFMul %103 %121 %108
%123 = OpExtInst %103 %105 Cos %122
%124 = OpConvertFToU %6 %123
%125 = OpExtInst %6 %105 UMin %107 %124
%126 = OpCompositeExtract %5 %125 0
%128 = OpAccessChain %127 %12 %15
OpStore %128 %126
%129 = OpCompositeExtract %5 %125 1
%130 = OpAccessChain %127 %12 %20
OpStore %130 %129
%131 = OpCompositeExtract %5 %125 2
%132 = OpAccessChain %127 %12 %24
OpStore %132 %131
%133 = OpCompositeExtract %5 %125 3
%134 = OpAccessChain %127 %12 %28
OpStore %134 %133
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
%70 = OpCompositeInsert %6 %69 %18 0
%73 = OpCompositeExtract %5 %56 1
%74 = OpCompositeExtract %5 %57 1
%75 = OpIEqual %65 %74 %76
OpSelectionMerge %72 Flatten
OpBranchConditional %75 %72 %71
%71 = OpLabel
%77 = OpUDiv %5 %73 %74
OpBranch %72
%72 = OpLabel
%78 = OpPhi %5 %60 %62 %77 %71
%79 = OpCompositeInsert %6 %78 %70 1
%82 = OpCompositeExtract %5 %56 2
%83 = OpCompositeExtract %5 %57 2
%84 = OpIEqual %65 %83 %85
OpSelectionMerge %81 Flatten
OpBranchConditional %84 %81 %80
%80 = OpLabel
%86 = OpUDiv %5 %82 %83
OpBranch %81
%81 = OpLabel
%87 = OpPhi %5 %60 %72 %86 %80
%88 = OpCompositeInsert %6 %87 %79 2
%91 = OpCompositeExtract %5 %56 3
%92 = OpCompositeExtract %5 %57 3
%93 = OpIEqual %65 %92 %94
OpSelectionMerge %90 Flatten
OpBranchConditional %93 %90 %89
%89 = OpLabel
%95 = OpUDiv %5 %91 %92
OpBranch %90
%90 = OpLabel
%96 = OpPhi %5 %60 %81 %95 %89
%97 = OpCompositeInsert %6 %96 %88 3
OpReturnValue %97
OpFunctionEnd
#endif
