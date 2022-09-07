#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];
layout(set = 0, binding = 0, r32ui) uniform coherent writeonly uimageBuffer _13[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec3 UV;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _37 = INDEX + 1u;
    uint _41 = uint(UV.x) >> 2u;
    uvec3 _53 = uvec3(texelFetch(_9[INDEX], int(_41)).x, texelFetch(_9[INDEX], int(_41 + 1u)).x, texelFetch(_9[INDEX], int(_41 + 2u)).x);
    uint _54 = _53.x;
    uint _55 = _53.y;
    uint _56 = _53.z;
    uint _60 = uint(UV.y) >> 2u;
    imageStore(_13[_37], int(_60), uvec4(_54));
    imageStore(_13[_37], int(_60 + 1u), uvec4(_55));
    imageStore(_13[_37], int(_60 + 2u), uvec4(_56));
    SV_Target.x = uintBitsToFloat(_54);
    SV_Target.y = uintBitsToFloat(_55);
    SV_Target.z = uintBitsToFloat(_56);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %15 %19 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %15 "INDEX"
OpName %19 "UV"
OpName %23 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 Coherent
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %19 Component 1
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypePointer Input %5
%15 = OpVariable %14 Input
%16 = OpTypeInt 32 1
%17 = OpTypeVector %16 3
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpTypeFloat 32
%21 = OpTypeVector %20 3
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpTypePointer Input %16
%26 = OpConstant %5 0
%30 = OpConstant %5 1
%34 = OpTypePointer UniformConstant %6
%38 = OpTypePointer UniformConstant %10
%42 = OpConstant %5 2
%43 = OpTypeVector %5 4
%52 = OpTypeVector %5 3
%66 = OpTypePointer Output %20
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%25 = OpAccessChain %24 %19 %26
%27 = OpLoad %16 %25
%28 = OpBitcast %5 %27
%29 = OpAccessChain %24 %19 %30
%31 = OpLoad %16 %29
%32 = OpBitcast %5 %31
%33 = OpLoad %5 %15
%35 = OpAccessChain %34 %9 %33
%36 = OpLoad %6 %35
%37 = OpIAdd %5 %33 %30
%39 = OpAccessChain %38 %13 %37
%40 = OpLoad %10 %39
%41 = OpShiftRightLogical %5 %28 %42
%44 = OpImageFetch %43 %36 %41
%45 = OpCompositeExtract %5 %44 0
%47 = OpIAdd %5 %41 %30
%46 = OpImageFetch %43 %36 %47
%48 = OpCompositeExtract %5 %46 0
%50 = OpIAdd %5 %41 %42
%49 = OpImageFetch %43 %36 %50
%51 = OpCompositeExtract %5 %49 0
%53 = OpCompositeConstruct %52 %45 %48 %51
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeExtract %5 %53 2
%57 = OpBitcast %20 %54
%58 = OpBitcast %20 %55
%59 = OpBitcast %20 %56
%60 = OpShiftRightLogical %5 %32 %42
%61 = OpCompositeConstruct %43 %54 %54 %54 %54
OpImageWrite %40 %60 %61
%62 = OpCompositeConstruct %43 %55 %55 %55 %55
%63 = OpIAdd %5 %60 %30
OpImageWrite %40 %63 %62
%64 = OpCompositeConstruct %43 %56 %56 %56 %56
%65 = OpIAdd %5 %60 %42
OpImageWrite %40 %65 %64
%67 = OpAccessChain %66 %23 %26
OpStore %67 %57
%68 = OpAccessChain %66 %23 %30
OpStore %68 %58
%69 = OpAccessChain %66 %23 %42
OpStore %69 %59
OpReturn
OpFunctionEnd
#endif
