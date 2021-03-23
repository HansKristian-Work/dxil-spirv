#version 460

layout(constant_id = 0) const uint _13 = 1u;
const vec2 _63[31] = vec2[](vec2(0.0), vec2(0.25), vec2(-0.25), vec2(-0.125, -0.375), vec2(0.375, -0.125), vec2(-0.375, 0.125), vec2(0.125, 0.375), vec2(0.0625, -0.1875), vec2(-0.0625, 0.1875), vec2(0.3125, 0.0625), vec2(-0.1875, -0.3125), vec2(-0.3125, 0.3125), vec2(-0.4375, -0.0625), vec2(0.1875, 0.4375), vec2(0.4375, -0.4375), vec2(0.0625), vec2(-0.0625, -0.1875), vec2(-0.1875, 0.125), vec2(0.25, -0.0625), vec2(-0.3125, -0.125), vec2(0.125, 0.3125), vec2(0.3125, 0.1875), vec2(0.1875, -0.3125), vec2(-0.125, 0.375), vec2(0.0, -0.4375), vec2(-0.25, -0.375), vec2(-0.375, 0.25), vec2(-0.5, 0.0), vec2(0.4375, -0.25), vec2(0.375, 0.4375), vec2(-0.4375, -0.5));

layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _74 = ((uint(gl_SampleID) < _13) && (_13 <= 16u)) ? ((_13 - 1u) + uint(gl_SampleID)) : 0u;
    SV_Target.x = _63[_74].x;
    SV_Target.y = _63[_74].y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 85
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_SampleIndex"
OpName %11 "SV_Target"
OpName %65 "Texture2DMSSamplePositionLUT"
OpDecorate %7 BuiltIn SampleId
OpDecorate %11 Location 0
OpDecorate %13 SpecId 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 2
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpSpecConstant %5 1
%14 = OpConstant %8 0
%15 = OpConstantComposite %9 %14 %14
%16 = OpConstant %8 0.25
%17 = OpConstantComposite %9 %16 %16
%18 = OpConstant %8 -0.25
%19 = OpConstantComposite %9 %18 %18
%20 = OpConstant %8 -0.125
%21 = OpConstant %8 -0.375
%22 = OpConstantComposite %9 %20 %21
%23 = OpConstant %8 0.375
%24 = OpConstantComposite %9 %23 %20
%25 = OpConstant %8 0.125
%26 = OpConstantComposite %9 %21 %25
%27 = OpConstantComposite %9 %25 %23
%28 = OpConstant %8 0.0625
%29 = OpConstant %8 -0.1875
%30 = OpConstantComposite %9 %28 %29
%31 = OpConstant %8 -0.0625
%32 = OpConstant %8 0.1875
%33 = OpConstantComposite %9 %31 %32
%34 = OpConstant %8 0.3125
%35 = OpConstantComposite %9 %34 %28
%36 = OpConstant %8 -0.3125
%37 = OpConstantComposite %9 %29 %36
%38 = OpConstantComposite %9 %36 %34
%39 = OpConstant %8 -0.4375
%40 = OpConstantComposite %9 %39 %31
%41 = OpConstant %8 0.4375
%42 = OpConstantComposite %9 %32 %41
%43 = OpConstantComposite %9 %41 %39
%44 = OpConstantComposite %9 %28 %28
%45 = OpConstantComposite %9 %31 %29
%46 = OpConstantComposite %9 %29 %25
%47 = OpConstantComposite %9 %16 %31
%48 = OpConstantComposite %9 %36 %20
%49 = OpConstantComposite %9 %25 %34
%50 = OpConstantComposite %9 %34 %32
%51 = OpConstantComposite %9 %32 %36
%52 = OpConstantComposite %9 %20 %23
%53 = OpConstantComposite %9 %14 %39
%54 = OpConstantComposite %9 %18 %21
%55 = OpConstantComposite %9 %21 %16
%56 = OpConstant %8 -0.5
%57 = OpConstantComposite %9 %56 %14
%58 = OpConstantComposite %9 %41 %18
%59 = OpConstantComposite %9 %23 %41
%60 = OpConstantComposite %9 %39 %56
%61 = OpConstant %5 31
%62 = OpTypeArray %9 %61
%63 = OpConstantComposite %62 %15 %17 %19 %22 %24 %26 %27 %30 %33 %35 %37 %38 %40 %42 %43 %44 %45 %46 %47 %48 %49 %50 %51 %52 %53 %54 %55 %57 %58 %59 %60
%64 = OpTypePointer Private %62
%65 = OpVariable %64 Private %63
%67 = OpConstant %5 1
%69 = OpTypeBool
%72 = OpConstant %5 16
%75 = OpConstant %5 0
%76 = OpTypePointer Private %9
%81 = OpTypePointer Output %8
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %84
%84 = OpLabel
%12 = OpLoad %5 %7
%66 = OpISub %5 %13 %67
%68 = OpIAdd %5 %66 %12
%70 = OpULessThan %69 %12 %13
%71 = OpULessThanEqual %69 %13 %72
%73 = OpLogicalAnd %69 %70 %71
%74 = OpSelect %5 %73 %68 %75
%77 = OpAccessChain %76 %65 %74
%78 = OpLoad %9 %77
%79 = OpCompositeExtract %8 %78 0
%80 = OpCompositeExtract %8 %78 1
%82 = OpAccessChain %81 %11 %75
OpStore %82 %79
%83 = OpAccessChain %81 %11 %67
OpStore %83 %80
OpReturn
OpFunctionEnd
#endif
