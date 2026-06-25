#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require

vec2 _27;
f16vec3 _41;
dvec4 _64;
vec4 _85;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _26;
    _26.x = TEXCOORD.x;
    _26.y = TEXCOORD.y;
    vec2 _32 = dFdxFine(_26) + dFdxCoarse(_26);
    vec2 _34 = dFdyFine(_26) + dFdyCoarse(_26);
    f16vec3 _40;
    _40.x = float16_t(TEXCOORD.x);
    _40.y = float16_t(TEXCOORD.y);
    _40.z = float16_t(TEXCOORD.z);
    dvec4 _63;
    _63.x = double(TEXCOORD.x);
    _63.y = double(TEXCOORD.y);
    _63.z = double(TEXCOORD.z);
    _63.w = double(TEXCOORD.w);
    vec4 _68 = vec4(_63);
    f16vec3 _77 = ((f16vec3(dFdyCoarse(vec3(_40))) + f16vec3(dFdxCoarse(vec3(_40)))) + f16vec3(dFdxFine(vec3(_40)))) + f16vec3(dFdyFine(vec3(_40)));
    vec4 _84;
    _84.x = float(_77.x);
    _84.y = float(_77.y);
    _84.z = float(_77.z);
    _84.w = 0.0;
    dvec4 _91 = (dvec4(dFdxFine(_68)) + dvec4(dFdxCoarse(_68))) * dvec4(2.0lf);
    vec4 _102;
    _102.x = float(_91.x);
    _102.y = float(_91.y);
    _102.z = float(_91.z);
    _102.w = float(_91.w);
    vec4 _106 = (_84 + vec4(_32.x, _32.y, _34.x, _34.y)) + _102;
    SV_Target.x = _106.x;
    SV_Target.y = _106.y;
    SV_Target.z = _106.z;
    SV_Target.w = _106.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 118
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability DerivativeControl
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%23 = OpConstant %13 3
%25 = OpTypeVector %5 2
%35 = OpTypeFloat 16
%39 = OpTypeVector %35 3
%44 = OpTypeVector %5 3
%57 = OpTypeFloat 64
%62 = OpTypeVector %57 4
%89 = OpConstant %5 0
%92 = OpConstant %57 2
%93 = OpConstantComposite %62 %92 %92 %92 %92
%108 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%27 = OpUndef %25
%41 = OpUndef %39
%64 = OpUndef %62
%85 = OpUndef %6
OpBranch %116
%116 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%26 = OpCompositeInsert %25 %15 %27 0
%28 = OpCompositeInsert %25 %18 %26 1
%29 = OpDPdxCoarse %25 %28
%30 = OpDPdyCoarse %25 %28
%31 = OpDPdxFine %25 %28
%32 = OpFAdd %25 %31 %29
%33 = OpDPdyFine %25 %28
%34 = OpFAdd %25 %33 %30
%36 = OpFConvert %35 %15
%37 = OpFConvert %35 %18
%38 = OpFConvert %35 %21
%40 = OpCompositeInsert %39 %36 %41 0
%42 = OpCompositeInsert %39 %37 %40 1
%43 = OpCompositeInsert %39 %38 %42 2
%45 = OpFConvert %44 %43
%46 = OpDPdxCoarse %44 %45
%47 = OpFConvert %39 %46
%48 = OpFConvert %44 %43
%49 = OpDPdyCoarse %44 %48
%50 = OpFConvert %39 %49
%51 = OpFConvert %44 %43
%52 = OpDPdxFine %44 %51
%53 = OpFConvert %39 %52
%54 = OpFConvert %44 %43
%55 = OpDPdyFine %44 %54
%56 = OpFConvert %39 %55
%58 = OpFConvert %57 %15
%59 = OpFConvert %57 %18
%60 = OpFConvert %57 %21
%61 = OpFConvert %57 %24
%63 = OpCompositeInsert %62 %58 %64 0
%65 = OpCompositeInsert %62 %59 %63 1
%66 = OpCompositeInsert %62 %60 %65 2
%67 = OpCompositeInsert %62 %61 %66 3
%68 = OpFConvert %6 %67
%69 = OpDPdxCoarse %6 %68
%70 = OpFConvert %62 %69
%71 = OpDPdxFine %6 %68
%72 = OpFConvert %62 %71
%73 = OpFAdd %62 %72 %70
%74 = OpVectorShuffle %6 %32 %34 0 1 2 3
%75 = OpFAdd %39 %50 %47
%76 = OpFAdd %39 %75 %53
%77 = OpFAdd %39 %76 %56
%78 = OpCompositeExtract %35 %77 0
%79 = OpCompositeExtract %35 %77 1
%80 = OpCompositeExtract %35 %77 2
%81 = OpFConvert %5 %78
%82 = OpFConvert %5 %79
%83 = OpFConvert %5 %80
%84 = OpCompositeInsert %6 %81 %85 0
%86 = OpCompositeInsert %6 %82 %84 1
%87 = OpCompositeInsert %6 %83 %86 2
%88 = OpCompositeInsert %6 %89 %87 3
%90 = OpFAdd %6 %88 %74
%91 = OpFMul %62 %73 %93
%94 = OpCompositeExtract %57 %91 0
%95 = OpCompositeExtract %57 %91 1
%96 = OpCompositeExtract %57 %91 2
%97 = OpCompositeExtract %57 %91 3
%98 = OpFConvert %5 %94
%99 = OpFConvert %5 %95
%100 = OpFConvert %5 %96
%101 = OpFConvert %5 %97
%102 = OpCompositeInsert %6 %98 %85 0
%103 = OpCompositeInsert %6 %99 %102 1
%104 = OpCompositeInsert %6 %100 %103 2
%105 = OpCompositeInsert %6 %101 %104 3
%106 = OpFAdd %6 %90 %105
%107 = OpCompositeExtract %5 %106 0
%109 = OpAccessChain %108 %10 %14
OpStore %109 %107
%110 = OpCompositeExtract %5 %106 1
%111 = OpAccessChain %108 %10 %17
OpStore %111 %110
%112 = OpCompositeExtract %5 %106 2
%113 = OpAccessChain %108 %10 %20
OpStore %113 %112
%114 = OpCompositeExtract %5 %106 3
%115 = OpAccessChain %108 %10 %23
OpStore %115 %114
OpReturn
OpFunctionEnd
#endif
