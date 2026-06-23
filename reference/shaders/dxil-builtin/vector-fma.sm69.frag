#version 460

dvec3 _42;

layout(location = 0) in vec3 A;
layout(location = 1) in vec3 B;
layout(location = 2) in vec3 C;
layout(location = 0) out vec3 SV_Target;

void main()
{
    dvec3 _41;
    _41.x = double(C.x);
    _41.y = double(C.y);
    _41.z = double(C.z);
    dvec3 _48;
    _48.x = double(B.x);
    _48.y = double(B.y);
    _48.z = double(B.z);
    dvec3 _54;
    _54.x = double(A.x);
    _54.y = double(A.y);
    _54.z = double(A.z);
    dvec3 _58 = fma(_54, _48, _41);
    SV_Target.x = float(_58.x);
    SV_Target.y = float(_58.y);
    SV_Target.z = float(_58.z);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
OpCapability Shader
OpCapability Float64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
%57 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 64
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
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%19 = OpConstant %15 1
%22 = OpConstant %15 2
%36 = OpTypeFloat 64
%40 = OpTypeVector %36 3
%65 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%42 = OpUndef %40
OpBranch %69
%69 = OpLabel
%14 = OpAccessChain %13 %10 %16
%17 = OpLoad %5 %14
%18 = OpAccessChain %13 %10 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %13 %10 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %13 %9 %16
%25 = OpLoad %5 %24
%26 = OpAccessChain %13 %9 %19
%27 = OpLoad %5 %26
%28 = OpAccessChain %13 %9 %22
%29 = OpLoad %5 %28
%30 = OpAccessChain %13 %8 %16
%31 = OpLoad %5 %30
%32 = OpAccessChain %13 %8 %19
%33 = OpLoad %5 %32
%34 = OpAccessChain %13 %8 %22
%35 = OpLoad %5 %34
%37 = OpFConvert %36 %17
%38 = OpFConvert %36 %20
%39 = OpFConvert %36 %23
%41 = OpCompositeInsert %40 %37 %42 0
%43 = OpCompositeInsert %40 %38 %41 1
%44 = OpCompositeInsert %40 %39 %43 2
%45 = OpFConvert %36 %25
%46 = OpFConvert %36 %27
%47 = OpFConvert %36 %29
%48 = OpCompositeInsert %40 %45 %42 0
%49 = OpCompositeInsert %40 %46 %48 1
%50 = OpCompositeInsert %40 %47 %49 2
%51 = OpFConvert %36 %31
%52 = OpFConvert %36 %33
%53 = OpFConvert %36 %35
%54 = OpCompositeInsert %40 %51 %42 0
%55 = OpCompositeInsert %40 %52 %54 1
%56 = OpCompositeInsert %40 %53 %55 2
%58 = OpExtInst %40 %57 Fma %56 %50 %44
%59 = OpCompositeExtract %36 %58 0
%60 = OpCompositeExtract %36 %58 1
%61 = OpCompositeExtract %36 %58 2
%62 = OpFConvert %5 %59
%63 = OpFConvert %5 %60
%64 = OpFConvert %5 %61
%66 = OpAccessChain %65 %12 %16
OpStore %66 %62
%67 = OpAccessChain %65 %12 %19
OpStore %67 %63
%68 = OpAccessChain %65 %12 %22
OpStore %68 %64
OpReturn
OpFunctionEnd
#endif
