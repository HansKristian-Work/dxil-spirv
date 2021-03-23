#version 460

layout(set = 0, binding = 1) uniform writeonly image1D _8;
layout(set = 0, binding = 2) uniform coherent writeonly image1DArray _11;
layout(set = 0, binding = 3) uniform writeonly image2D _14;
layout(set = 0, binding = 4) uniform coherent writeonly image2DArray _17;
layout(set = 0, binding = 5) uniform writeonly image3D _20;

layout(location = 0) in vec3 TEXCOORD;

void main()
{
    uint _40 = uint(int(TEXCOORD.x));
    imageStore(_8, int(_40), vec4(1.0, 2.0, 1.0, 1.0));
    uint _45 = uint(int(TEXCOORD.y));
    imageStore(_11, ivec2(uvec2(_40, _45)), vec4(3.0, 4.0, 3.0, 3.0));
    imageStore(_14, ivec2(uvec2(_40, _45)), vec4(5.0, 6.0, 5.0, 5.0));
    uint _55 = uint(int(TEXCOORD.z));
    imageStore(_17, ivec3(uvec3(_40, _45, _55)), vec4(7.0, 8.0, 7.0, 7.0));
    imageStore(_20, ivec3(uvec3(_40, _45, _55)), vec4(9.0, -9.0, 9.0, 9.0));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %8 NonReadable
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %11 NonReadable
OpDecorate %11 Coherent
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %14 NonReadable
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %17 NonReadable
OpDecorate %17 Coherent
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %20 NonReadable
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 2 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 2 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 2 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 2 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 3
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%29 = OpTypePointer Input %5
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%38 = OpConstant %31 2
%41 = OpConstant %5 1
%42 = OpConstant %5 2
%43 = OpTypeVector %5 4
%46 = OpConstant %5 3
%47 = OpConstant %5 4
%48 = OpTypeVector %31 2
%51 = OpConstant %5 5
%52 = OpConstant %5 6
%56 = OpConstant %5 7
%57 = OpConstant %5 8
%58 = OpTypeVector %31 3
%61 = OpConstant %5 9
%62 = OpConstant %5 -9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%24 = OpLoad %18 %20
%25 = OpLoad %15 %17
%26 = OpLoad %12 %14
%27 = OpLoad %9 %11
%28 = OpLoad %6 %8
%30 = OpAccessChain %29 %23 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %29 %23 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %29 %23 %38
%39 = OpLoad %5 %37
%40 = OpConvertFToS %31 %33
%44 = OpCompositeConstruct %43 %41 %42 %41 %41
OpImageWrite %28 %40 %44
%45 = OpConvertFToS %31 %36
%49 = OpCompositeConstruct %48 %40 %45
%50 = OpCompositeConstruct %43 %46 %47 %46 %46
OpImageWrite %27 %49 %50
%53 = OpCompositeConstruct %48 %40 %45
%54 = OpCompositeConstruct %43 %51 %52 %51 %51
OpImageWrite %26 %53 %54
%55 = OpConvertFToS %31 %39
%59 = OpCompositeConstruct %58 %40 %45 %55
%60 = OpCompositeConstruct %43 %56 %57 %56 %56
OpImageWrite %25 %59 %60
%63 = OpCompositeConstruct %58 %40 %45 %55
%64 = OpCompositeConstruct %43 %61 %62 %61 %61
OpImageWrite %24 %63 %64
OpReturn
OpFunctionEnd
#endif
