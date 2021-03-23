#version 460
#extension GL_EXT_samplerless_texture_functions : require

const vec2 _77[31] = vec2[](vec2(0.0), vec2(0.25), vec2(-0.25), vec2(-0.125, -0.375), vec2(0.375, -0.125), vec2(-0.375, 0.125), vec2(0.125, 0.375), vec2(0.0625, -0.1875), vec2(-0.0625, 0.1875), vec2(0.3125, 0.0625), vec2(-0.1875, -0.3125), vec2(-0.3125, 0.3125), vec2(-0.4375, -0.0625), vec2(0.1875, 0.4375), vec2(0.4375, -0.4375), vec2(0.0625), vec2(-0.0625, -0.1875), vec2(-0.1875, 0.125), vec2(0.25, -0.0625), vec2(-0.3125, -0.125), vec2(0.125, 0.3125), vec2(0.3125, 0.1875), vec2(0.1875, -0.3125), vec2(-0.125, 0.375), vec2(0.0, -0.4375), vec2(-0.25, -0.375), vec2(-0.375, 0.25), vec2(-0.5, 0.0), vec2(0.4375, -0.25), vec2(0.375, 0.4375), vec2(-0.4375, -0.5));

layout(set = 0, binding = 0, std140) uniform _13_15
{
    vec4 _m0[1];
} _15;

layout(set = 0, binding = 0) uniform texture2DMS _8;

layout(location = 0) out vec4 SV_Target;

void main()
{
    uvec4 _24 = floatBitsToUint(_15._m0[0u]);
    uint _25 = _24.x;
    uint _26 = uint(textureSamples(_8));
    uint _87 = ((_25 < _26) && (_26 <= 16u)) ? ((_26 - 1u) + _25) : 0u;
    SV_Target.x = _77[_87].x;
    SV_Target.y = _77[_87].y;
    SV_Target.z = 0.0;
    SV_Target.w = 0.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 101
; Schema: 0
OpCapability Shader
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %17 "SV_Target"
OpName %79 "Texture2DMSSamplePositionLUT"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 ArrayStride 16
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 1 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeVector %5 4
%12 = OpTypeArray %11 %10
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypePointer Output %11
%17 = OpVariable %16 Output
%19 = OpConstant %9 0
%20 = OpTypePointer Uniform %11
%23 = OpTypeVector %9 4
%27 = OpTypeVector %5 2
%28 = OpConstant %5 0
%29 = OpConstantComposite %27 %28 %28
%30 = OpConstant %5 0.25
%31 = OpConstantComposite %27 %30 %30
%32 = OpConstant %5 -0.25
%33 = OpConstantComposite %27 %32 %32
%34 = OpConstant %5 -0.125
%35 = OpConstant %5 -0.375
%36 = OpConstantComposite %27 %34 %35
%37 = OpConstant %5 0.375
%38 = OpConstantComposite %27 %37 %34
%39 = OpConstant %5 0.125
%40 = OpConstantComposite %27 %35 %39
%41 = OpConstantComposite %27 %39 %37
%42 = OpConstant %5 0.0625
%43 = OpConstant %5 -0.1875
%44 = OpConstantComposite %27 %42 %43
%45 = OpConstant %5 -0.0625
%46 = OpConstant %5 0.1875
%47 = OpConstantComposite %27 %45 %46
%48 = OpConstant %5 0.3125
%49 = OpConstantComposite %27 %48 %42
%50 = OpConstant %5 -0.3125
%51 = OpConstantComposite %27 %43 %50
%52 = OpConstantComposite %27 %50 %48
%53 = OpConstant %5 -0.4375
%54 = OpConstantComposite %27 %53 %45
%55 = OpConstant %5 0.4375
%56 = OpConstantComposite %27 %46 %55
%57 = OpConstantComposite %27 %55 %53
%58 = OpConstantComposite %27 %42 %42
%59 = OpConstantComposite %27 %45 %43
%60 = OpConstantComposite %27 %43 %39
%61 = OpConstantComposite %27 %30 %45
%62 = OpConstantComposite %27 %50 %34
%63 = OpConstantComposite %27 %39 %48
%64 = OpConstantComposite %27 %48 %46
%65 = OpConstantComposite %27 %46 %50
%66 = OpConstantComposite %27 %34 %37
%67 = OpConstantComposite %27 %28 %53
%68 = OpConstantComposite %27 %32 %35
%69 = OpConstantComposite %27 %35 %30
%70 = OpConstant %5 -0.5
%71 = OpConstantComposite %27 %70 %28
%72 = OpConstantComposite %27 %55 %32
%73 = OpConstantComposite %27 %37 %55
%74 = OpConstantComposite %27 %53 %70
%75 = OpConstant %9 31
%76 = OpTypeArray %27 %75
%77 = OpConstantComposite %76 %29 %31 %33 %36 %38 %40 %41 %44 %47 %49 %51 %52 %54 %56 %57 %58 %59 %60 %61 %62 %63 %64 %65 %66 %67 %68 %69 %71 %72 %73 %74
%78 = OpTypePointer Private %76
%79 = OpVariable %78 Private %77
%82 = OpTypeBool
%85 = OpConstant %9 16
%88 = OpTypePointer Private %27
%93 = OpTypePointer Output %5
%97 = OpConstant %9 2
%99 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %100
%100 = OpLabel
%18 = OpLoad %6 %8
%21 = OpAccessChain %20 %15 %19 %19
%22 = OpLoad %11 %21
%24 = OpBitcast %23 %22
%25 = OpCompositeExtract %9 %24 0
%26 = OpImageQuerySamples %9 %18
%80 = OpISub %9 %26 %10
%81 = OpIAdd %9 %80 %25
%83 = OpULessThan %82 %25 %26
%84 = OpULessThanEqual %82 %26 %85
%86 = OpLogicalAnd %82 %83 %84
%87 = OpSelect %9 %86 %81 %19
%89 = OpAccessChain %88 %79 %87
%90 = OpLoad %27 %89
%91 = OpCompositeExtract %5 %90 0
%92 = OpCompositeExtract %5 %90 1
%94 = OpAccessChain %93 %17 %19
OpStore %94 %91
%95 = OpAccessChain %93 %17 %10
OpStore %95 %92
%96 = OpAccessChain %93 %17 %97
OpStore %96 %28
%98 = OpAccessChain %93 %17 %99
OpStore %98 %28
OpReturn
OpFunctionEnd
#endif
