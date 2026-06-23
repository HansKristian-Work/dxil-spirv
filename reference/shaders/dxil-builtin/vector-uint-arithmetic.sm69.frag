#version 460

uvec4 _18;
vec4 _75;

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
    vec4 _65 = vec4((_45 * _33) + _17);
    float _66 = _65.x;
    float _73 = inversesqrt(dot(vec4(_66, _65.yzw), vec4(_66, _65.yzw)));
    vec4 _74;
    _74.x = _73;
    _74.y = _73;
    _74.z = _73;
    _74.w = _73;
    uvec4 _82 = min(uvec4(sqrt(vec4(_45 + (_33 / _17)))), uvec4(cos(_74 * _65)));
    SV_Target.x = _82.x;
    SV_Target.y = _82.y;
    SV_Target.z = _82.z;
    SV_Target.w = _82.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 94
; Schema: 0
OpCapability Shader
%62 = OpExtInstImport "GLSL.std.450"
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
%59 = OpTypeFloat 32
%60 = OpTypeVector %59 4
%84 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%18 = OpUndef %6
%75 = OpUndef %60
OpBranch %92
%92 = OpLabel
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
%55 = OpUDiv %6 %42 %30
%56 = OpIAdd %6 %54 %55
%57 = OpIMul %6 %54 %42
%58 = OpIAdd %6 %57 %30
%61 = OpConvertUToF %60 %56
%63 = OpExtInst %60 %62 Sqrt %61
%64 = OpConvertFToU %6 %63
%65 = OpConvertUToF %60 %58
%66 = OpCompositeExtract %59 %65 0
%67 = OpCompositeExtract %59 %65 1
%68 = OpCompositeExtract %59 %65 2
%69 = OpCompositeExtract %59 %65 3
%71 = OpCompositeConstruct %60 %66 %67 %68 %69
%72 = OpCompositeConstruct %60 %66 %67 %68 %69
%70 = OpDot %59 %71 %72
%73 = OpExtInst %59 %62 InverseSqrt %70
%74 = OpCompositeInsert %60 %73 %75 0
%76 = OpCompositeInsert %60 %73 %74 1
%77 = OpCompositeInsert %60 %73 %76 2
%78 = OpCompositeInsert %60 %73 %77 3
%79 = OpFMul %60 %78 %65
%80 = OpExtInst %60 %62 Cos %79
%81 = OpConvertFToU %6 %80
%82 = OpExtInst %6 %62 UMin %64 %81
%83 = OpCompositeExtract %5 %82 0
%85 = OpAccessChain %84 %12 %15
OpStore %85 %83
%86 = OpCompositeExtract %5 %82 1
%87 = OpAccessChain %84 %12 %20
OpStore %87 %86
%88 = OpCompositeExtract %5 %82 2
%89 = OpAccessChain %84 %12 %24
OpStore %89 %88
%90 = OpCompositeExtract %5 %82 3
%91 = OpAccessChain %84 %12 %28
OpStore %91 %90
OpReturn
OpFunctionEnd
#endif
