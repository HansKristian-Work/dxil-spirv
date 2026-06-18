#version 460
#extension GL_EXT_spirv_intrinsics : require

vec4 _19;

layout(location = 0) in vec4 A;
layout(location = 1) in vec4 B;
layout(location = 2) in vec4 C;
layout(location = 0) out vec4 SV_Target;

spirv_instruction(set = "GLSL.std.450", id = 79) float spvNMin(float, float);
spirv_instruction(set = "GLSL.std.450", id = 79) vec2 spvNMin(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 79) vec3 spvNMin(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 79) vec4 spvNMin(vec4, vec4);

void main()
{
    vec4 _18;
    _18.x = C.x;
    _18.y = C.y;
    _18.z = C.z;
    _18.w = C.w;
    vec4 _34;
    _34.x = B.x;
    _34.y = B.y;
    _34.z = B.z;
    _34.w = B.w;
    vec4 _46;
    _46.x = A.x;
    _46.y = A.y;
    _46.z = A.z;
    _46.w = A.w;
    vec4 _59 = fma(_46, _34, _18);
    float _62 = _59.x;
    float _69 = inversesqrt(dot(vec4(_62, _59.yzw), vec4(_62, _59.yzw)));
    vec4 _70;
    _70.x = _69;
    _70.y = _69;
    _70.z = _69;
    _70.w = _69;
    vec4 _76 = spvNMin(sqrt(abs(_46 + (_34 / _18))), cos(_70 * _59));
    SV_Target.x = _76.x;
    SV_Target.y = _76.y;
    SV_Target.z = _76.z;
    SV_Target.w = _76.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 88
; Schema: 0
OpCapability Shader
%58 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %10 "C"
OpName %12 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %10 Location 2
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%21 = OpConstant %15 1
%25 = OpConstant %15 2
%29 = OpConstant %15 3
%78 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%19 = OpUndef %6
OpBranch %86
%86 = OpLabel
%14 = OpAccessChain %13 %10 %16
%17 = OpLoad %5 %14
%18 = OpCompositeInsert %6 %17 %19 0
%20 = OpAccessChain %13 %10 %21
%22 = OpLoad %5 %20
%23 = OpCompositeInsert %6 %22 %18 1
%24 = OpAccessChain %13 %10 %25
%26 = OpLoad %5 %24
%27 = OpCompositeInsert %6 %26 %23 2
%28 = OpAccessChain %13 %10 %29
%30 = OpLoad %5 %28
%31 = OpCompositeInsert %6 %30 %27 3
%32 = OpAccessChain %13 %9 %16
%33 = OpLoad %5 %32
%34 = OpCompositeInsert %6 %33 %19 0
%35 = OpAccessChain %13 %9 %21
%36 = OpLoad %5 %35
%37 = OpCompositeInsert %6 %36 %34 1
%38 = OpAccessChain %13 %9 %25
%39 = OpLoad %5 %38
%40 = OpCompositeInsert %6 %39 %37 2
%41 = OpAccessChain %13 %9 %29
%42 = OpLoad %5 %41
%43 = OpCompositeInsert %6 %42 %40 3
%44 = OpAccessChain %13 %8 %16
%45 = OpLoad %5 %44
%46 = OpCompositeInsert %6 %45 %19 0
%47 = OpAccessChain %13 %8 %21
%48 = OpLoad %5 %47
%49 = OpCompositeInsert %6 %48 %46 1
%50 = OpAccessChain %13 %8 %25
%51 = OpLoad %5 %50
%52 = OpCompositeInsert %6 %51 %49 2
%53 = OpAccessChain %13 %8 %29
%54 = OpLoad %5 %53
%55 = OpCompositeInsert %6 %54 %52 3
%56 = OpFDiv %6 %43 %31
%57 = OpFAdd %6 %55 %56
%59 = OpExtInst %6 %58 Fma %55 %43 %31
%60 = OpExtInst %6 %58 FAbs %57
%61 = OpExtInst %6 %58 Sqrt %60
%62 = OpCompositeExtract %5 %59 0
%63 = OpCompositeExtract %5 %59 1
%64 = OpCompositeExtract %5 %59 2
%65 = OpCompositeExtract %5 %59 3
%67 = OpCompositeConstruct %6 %62 %63 %64 %65
%68 = OpCompositeConstruct %6 %62 %63 %64 %65
%66 = OpDot %5 %67 %68
%69 = OpExtInst %5 %58 InverseSqrt %66
%70 = OpCompositeInsert %6 %69 %19 0
%71 = OpCompositeInsert %6 %69 %70 1
%72 = OpCompositeInsert %6 %69 %71 2
%73 = OpCompositeInsert %6 %69 %72 3
%74 = OpFMul %6 %73 %59
%75 = OpExtInst %6 %58 Cos %74
%76 = OpExtInst %6 %58 NMin %61 %75
%77 = OpCompositeExtract %5 %76 0
%79 = OpAccessChain %78 %12 %16
OpStore %79 %77
%80 = OpCompositeExtract %5 %76 1
%81 = OpAccessChain %78 %12 %21
OpStore %81 %80
%82 = OpCompositeExtract %5 %76 2
%83 = OpAccessChain %78 %12 %25
OpStore %83 %82
%84 = OpCompositeExtract %5 %76 3
%85 = OpAccessChain %78 %12 %29
OpStore %85 %84
OpReturn
OpFunctionEnd
#endif
