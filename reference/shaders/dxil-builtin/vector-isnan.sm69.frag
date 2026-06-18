#version 460

vec3 _18;

layout(location = 0) in vec3 A;
layout(location = 1) in vec3 B;
layout(location = 0) out vec3 SV_Target;

void main()
{
    vec3 _17;
    _17.x = B.x;
    _17.y = B.y;
    _17.z = B.z;
    vec3 _29;
    _29.x = A.x;
    _29.y = A.y;
    _29.z = A.z;
    vec3 _44 = vec3(isnan(_29)) * _17;
    SV_Target.x = _44.x;
    SV_Target.y = _44.y;
    SV_Target.z = _44.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%20 = OpConstant %14 1
%24 = OpConstant %14 2
%36 = OpTypeBool
%37 = OpTypeVector %36 3
%39 = OpConstant %5 0
%40 = OpConstant %5 1
%41 = OpConstantComposite %6 %39 %39 %39
%42 = OpConstantComposite %6 %40 %40 %40
%46 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%18 = OpUndef %6
OpBranch %52
%52 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpCompositeInsert %6 %16 %18 0
%19 = OpAccessChain %12 %9 %20
%21 = OpLoad %5 %19
%22 = OpCompositeInsert %6 %21 %17 1
%23 = OpAccessChain %12 %9 %24
%25 = OpLoad %5 %23
%26 = OpCompositeInsert %6 %25 %22 2
%27 = OpAccessChain %12 %8 %15
%28 = OpLoad %5 %27
%29 = OpCompositeInsert %6 %28 %18 0
%30 = OpAccessChain %12 %8 %20
%31 = OpLoad %5 %30
%32 = OpCompositeInsert %6 %31 %29 1
%33 = OpAccessChain %12 %8 %24
%34 = OpLoad %5 %33
%35 = OpCompositeInsert %6 %34 %32 2
%38 = OpIsNan %37 %35
%43 = OpSelect %6 %38 %42 %41
%44 = OpFMul %6 %43 %26
%45 = OpCompositeExtract %5 %44 0
%47 = OpAccessChain %46 %11 %15
OpStore %47 %45
%48 = OpCompositeExtract %5 %44 1
%49 = OpAccessChain %46 %11 %20
OpStore %49 %48
%50 = OpCompositeExtract %5 %44 2
%51 = OpAccessChain %46 %11 %24
OpStore %51 %50
OpReturn
OpFunctionEnd
#endif
