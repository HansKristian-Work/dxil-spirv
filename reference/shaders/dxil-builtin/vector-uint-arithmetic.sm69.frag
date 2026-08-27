#version 460

uvec4 _18;
vec4 _83;

layout(location = 0) flat in uvec4 A;
layout(location = 1) flat in uvec4 B;
layout(location = 2) flat in uvec4 C;
layout(location = 0) out uvec4 SV_Target;

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
    bvec4 _60 = notEqual(_17, uvec4(0u));
    vec4 _73 = vec4((_45 * _33) + _17);
    float _74 = _73.x;
    float _81 = inversesqrt(dot(vec4(_74, _73.yzw), vec4(_74, _73.yzw)));
    vec4 _82;
    _82.x = _81;
    _82.y = _81;
    _82.z = _81;
    _82.w = _81;
    uvec4 _90 = min(uvec4(sqrt(vec4(_45 + mix(uvec4(4294967295u), _33 / mix(uvec4(4294967295u), _17, _60), _60)))), uvec4(cos(_82 * _73)));
    SV_Target.x = _90.x;
    SV_Target.y = _90.y;
    SV_Target.z = _90.z;
    SV_Target.w = _90.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
OpCapability Shader
%70 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %10 "C"
OpName %12 "SV_Target"
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
%55 = OpConstant %5 4294967295
%56 = OpTypeBool
%57 = OpTypeVector %56 4
%58 = OpConstantComposite %6 %15 %15 %15 %15
%59 = OpConstantComposite %6 %55 %55 %55 %55
%67 = OpTypeFloat 32
%68 = OpTypeVector %67 4
%92 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%18 = OpUndef %6
%83 = OpUndef %68
OpBranch %100
%100 = OpLabel
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
%60 = OpINotEqual %57 %30 %58
%61 = OpSelect %6 %60 %30 %59
%62 = OpUDiv %6 %42 %61
%63 = OpSelect %6 %60 %62 %59
%64 = OpIAdd %6 %54 %63
%65 = OpIMul %6 %54 %42
%66 = OpIAdd %6 %65 %30
%69 = OpConvertUToF %68 %64
%71 = OpExtInst %68 %70 Sqrt %69
%72 = OpConvertFToU %6 %71
%73 = OpConvertUToF %68 %66
%74 = OpCompositeExtract %67 %73 0
%75 = OpCompositeExtract %67 %73 1
%76 = OpCompositeExtract %67 %73 2
%77 = OpCompositeExtract %67 %73 3
%79 = OpCompositeConstruct %68 %74 %75 %76 %77
%80 = OpCompositeConstruct %68 %74 %75 %76 %77
%78 = OpDot %67 %79 %80
%81 = OpExtInst %67 %70 InverseSqrt %78
%82 = OpCompositeInsert %68 %81 %83 0
%84 = OpCompositeInsert %68 %81 %82 1
%85 = OpCompositeInsert %68 %81 %84 2
%86 = OpCompositeInsert %68 %81 %85 3
%87 = OpFMul %68 %86 %73
%88 = OpExtInst %68 %70 Cos %87
%89 = OpConvertFToU %6 %88
%90 = OpExtInst %6 %70 UMin %72 %89
%91 = OpCompositeExtract %5 %90 0
%93 = OpAccessChain %92 %12 %15
OpStore %93 %91
%94 = OpCompositeExtract %5 %90 1
%95 = OpAccessChain %92 %12 %20
OpStore %95 %94
%96 = OpCompositeExtract %5 %90 2
%97 = OpAccessChain %92 %12 %24
OpStore %97 %96
%98 = OpCompositeExtract %5 %90 3
%99 = OpAccessChain %92 %12 %28
OpStore %99 %98
OpReturn
OpFunctionEnd
#endif
