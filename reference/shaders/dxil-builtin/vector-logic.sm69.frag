#version 460

uvec4 _20;

layout(location = 0) flat in ivec4 A;
layout(location = 1) flat in ivec4 B;
layout(location = 0) out ivec4 SV_Target;

void main()
{
    uvec4 _19;
    _19.x = uint(B.x);
    _19.y = uint(B.y);
    _19.z = uint(B.z);
    _19.w = uint(B.w);
    uvec4 _39;
    _39.x = uint(A.x);
    _39.y = uint(A.y);
    _39.z = uint(A.z);
    _39.w = uint(A.w);
    bvec4 _66 = notEqual(uvec4(equal((_39 * _19), uvec4(0u))), uvec4(0u));
    bvec4 _67 = notEqual(uvec4(lessThan(ivec4(_19), ivec4(uvec4(4294967295u)))), uvec4(0u));
    bvec4 _68 = notEqual(uvec4(greaterThan(ivec4(_39), ivec4(uvec4(1u)))), uvec4(0u));
    bvec4 _69 = bvec4(_68.x || _67.x, _68.y || _67.y, _68.z || _67.z, _68.w || _67.w);
    bvec4 _72 = notEqual(uvec4(bvec4(_69.x && _66.x, _69.y && _66.y, _69.z && _66.z, _69.w && _66.w)), uvec4(0u));
    uvec4 _77 = (any(_72) && all(_72)) ? mix(_19, _39, _72) : uvec4(0u);
    SV_Target.x = int(_77.x);
    SV_Target.y = int(_77.y);
    SV_Target.z = int(_77.z);
    SV_Target.w = int(_77.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %11 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %9 Flat
OpDecorate %9 Location 1
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpTypeVector %14 4
%22 = OpConstant %14 1
%27 = OpConstant %14 2
%32 = OpConstant %14 3
%52 = OpTypeBool
%53 = OpTypeVector %52 4
%55 = OpConstantComposite %18 %22 %22 %22 %22
%56 = OpConstantComposite %18 %15 %15 %15 %15
%59 = OpConstant %14 4294967295
%60 = OpConstantComposite %18 %59 %59 %59 %59
%64 = OpConstantNull %18
%79 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%20 = OpUndef %18
OpBranch %91
%91 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpBitcast %14 %16
%19 = OpCompositeInsert %18 %17 %20 0
%21 = OpAccessChain %12 %9 %22
%23 = OpLoad %5 %21
%24 = OpBitcast %14 %23
%25 = OpCompositeInsert %18 %24 %19 1
%26 = OpAccessChain %12 %9 %27
%28 = OpLoad %5 %26
%29 = OpBitcast %14 %28
%30 = OpCompositeInsert %18 %29 %25 2
%31 = OpAccessChain %12 %9 %32
%33 = OpLoad %5 %31
%34 = OpBitcast %14 %33
%35 = OpCompositeInsert %18 %34 %30 3
%36 = OpAccessChain %12 %8 %15
%37 = OpLoad %5 %36
%38 = OpBitcast %14 %37
%39 = OpCompositeInsert %18 %38 %20 0
%40 = OpAccessChain %12 %8 %22
%41 = OpLoad %5 %40
%42 = OpBitcast %14 %41
%43 = OpCompositeInsert %18 %42 %39 1
%44 = OpAccessChain %12 %8 %27
%45 = OpLoad %5 %44
%46 = OpBitcast %14 %45
%47 = OpCompositeInsert %18 %46 %43 2
%48 = OpAccessChain %12 %8 %32
%49 = OpLoad %5 %48
%50 = OpBitcast %14 %49
%51 = OpCompositeInsert %18 %50 %47 3
%54 = OpSGreaterThan %53 %51 %55
%57 = OpSelect %18 %54 %55 %56
%58 = OpSLessThan %53 %35 %60
%61 = OpSelect %18 %58 %55 %56
%62 = OpIMul %18 %51 %35
%63 = OpIEqual %53 %62 %64
%65 = OpSelect %18 %63 %55 %56
%66 = OpINotEqual %53 %65 %64
%67 = OpINotEqual %53 %61 %64
%68 = OpINotEqual %53 %57 %64
%69 = OpLogicalOr %53 %68 %67
%70 = OpLogicalAnd %53 %69 %66
%71 = OpSelect %18 %70 %55 %56
%72 = OpINotEqual %53 %71 %64
%73 = OpSelect %18 %72 %51 %35
%74 = OpAny %52 %72
%75 = OpAll %52 %72
%76 = OpLogicalAnd %52 %74 %75
%77 = OpSelect %18 %76 %73 %64
%78 = OpCompositeExtract %14 %77 0
%80 = OpAccessChain %79 %11 %15
%81 = OpBitcast %5 %78
OpStore %80 %81
%82 = OpCompositeExtract %14 %77 1
%83 = OpAccessChain %79 %11 %22
%84 = OpBitcast %5 %82
OpStore %83 %84
%85 = OpCompositeExtract %14 %77 2
%86 = OpAccessChain %79 %11 %27
%87 = OpBitcast %5 %85
OpStore %86 %87
%88 = OpCompositeExtract %14 %77 3
%89 = OpAccessChain %79 %11 %32
%90 = OpBitcast %5 %88
OpStore %89 %90
OpReturn
OpFunctionEnd
#endif
