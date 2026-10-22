#version 460
#extension GL_EXT_nonuniform_qualifier : require
#ifdef GL_ARB_fragment_shader_interlock
#extension GL_ARB_fragment_shader_interlock : enable
#define SPIRV_Cross_beginInvocationInterlock() beginInvocationInterlockARB()
#define SPIRV_Cross_endInvocationInterlock() endInvocationInterlockARB()
#elif defined(GL_INTEL_fragment_shader_ordering)
#extension GL_INTEL_fragment_shader_ordering : enable
#define SPIRV_Cross_beginInvocationInterlock() beginFragmentShaderOrderingINTEL()
#define SPIRV_Cross_endInvocationInterlock()
#endif
#if defined(GL_ARB_fragment_shader_interlock)
layout(sample_interlock_ordered) in;
#elif !defined(GL_INTEL_fragment_shader_ordering)
#error Fragment Shader Interlock/Ordering extension missing!
#endif
layout(early_fragment_tests) in;

layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _9[];
layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _12[];
layout(set = 0, binding = 0, r32f) uniform coherent imageBuffer _17[];
layout(set = 0, binding = 0, r32f) uniform coherent image1D _21[];
layout(set = 0, binding = 0, r32f) uniform coherent image2D _25[];

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    uint _41 = uint(gl_SampleID) + uint(gl_FragCoord.x);
    uint _42 = uint(gl_FragCoord.y) + uint(gl_SampleID);
    uint _48 = (_42 * 1000u) + _41;
    uint _60 = ByteAddressMask(_48 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _62 = imageLoad(_9[0u], int(_60));
    uvec4 _64 = imageLoad(_9[0u], int(_60 + 1u));
    uvec4 _67 = imageLoad(_9[0u], int(_60 + 2u));
    uvec4 _71 = imageLoad(_9[0u], int(_60 + 3u));
    uvec4 _75 = uvec4(_62.x, _64.x, _67.x, _71.x);
    uint _85 = ByteAddressMask(_48 * 4u, 4u);
    imageStore(_9[0u], int(_85), uvec4(_75.x + 1u));
    imageStore(_9[0u], int(_85 + 1u), uvec4(_75.y + 2u));
    imageStore(_9[0u], int(_85 + 2u), uvec4(_75.z + 3u));
    imageStore(_9[0u], int(_85 + 3u), uvec4(_75.w + 4u));
    uint _95 = _48 * 4u;
    uvec4 _96 = imageLoad(_12[1u], int(_95));
    uvec4 _98 = imageLoad(_12[1u], int(_95 + 1u));
    uvec4 _101 = imageLoad(_12[1u], int(_95 + 2u));
    uvec4 _104 = imageLoad(_12[1u], int(_95 + 3u));
    vec4 _108 = uintBitsToFloat(uvec4(_96.x, _98.x, _101.x, _104.x));
    uint _121 = _48 * 4u;
    imageStore(_12[1u], int(_121), uvec4(floatBitsToUint(_108.x + 1.0)));
    imageStore(_12[1u], int(_121 + 1u), uvec4(floatBitsToUint(_108.y + 2.0)));
    imageStore(_12[1u], int(_121 + 2u), uvec4(floatBitsToUint(_108.z + 3.0)));
    imageStore(_12[1u], int(_121 + 3u), uvec4(floatBitsToUint(_108.w + 4.0)));
    vec4 _136 = imageLoad(_17[2u], int(_48));
    imageStore(_17[2u], int(_48), vec4(_136.x + 1.0, _136.y + 2.0, _136.z + 3.0, _136.w + 4.0));
    vec4 _149 = imageLoad(_21[3u], int(_48));
    imageStore(_21[3u], int(_48), vec4(_149.x + 1.0, _149.y + 2.0, _149.z + 3.0, _149.w + 4.0));
    vec4 _162 = imageLoad(_25[4u], ivec2(uvec2(_41, _42)));
    imageStore(_25[4u], ivec2(uvec2(_41, _42)), vec4(_162.x + 1.0, _162.y + 2.0, _162.z + 3.0, _162.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 176
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability Image1D
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability FragmentShaderSampleInterlockEXT
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %12 %17 %21 %25 %28 %30
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 SampleInterlockOrderedEXT
OpName %3 "main"
OpName %28 "SV_Position"
OpName %30 "SV_SampleIndex"
OpName %55 "ByteAddressMask"
OpName %53 "index"
OpName %54 "stride"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 Coherent
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 Coherent
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %17 Coherent
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %21 Coherent
OpDecorate %25 DescriptorSet 0
OpDecorate %25 Binding 0
OpDecorate %25 Coherent
OpDecorate %28 BuiltIn FragCoord
OpDecorate %30 BuiltIn SampleId
OpDecorate %30 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeRuntimeArray %6
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeFloat 32
%14 = OpTypeImage %13 Buffer 0 0 0 2 R32f
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %13 1D 0 0 0 2 R32f
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeImage %13 2D 0 0 0 2 R32f
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer UniformConstant %23
%25 = OpVariable %24 UniformConstant
%26 = OpTypeVector %13 4
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypePointer Input %5
%30 = OpVariable %29 Input
%31 = OpTypePointer Input %13
%33 = OpConstant %5 0
%36 = OpConstant %5 1
%43 = OpTypePointer UniformConstant %6
%47 = OpConstant %5 1000
%50 = OpConstant %5 4
%52 = OpTypeFunction %5 %5 %5
%58 = OpConstant %5 4294967295
%61 = OpTypeVector %5 4
%69 = OpConstant %5 2
%73 = OpConstant %5 3
%114 = OpConstant %13 1
%116 = OpConstant %13 2
%118 = OpConstant %13 3
%120 = OpConstant %13 4
%133 = OpTypePointer UniformConstant %14
%146 = OpTypePointer UniformConstant %18
%159 = OpTypePointer UniformConstant %22
%163 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %175
%175 = OpLabel
%32 = OpAccessChain %31 %28 %33
%34 = OpLoad %13 %32
%35 = OpAccessChain %31 %28 %36
%37 = OpLoad %13 %35
%38 = OpLoad %5 %30
%39 = OpConvertFToU %5 %34
%40 = OpConvertFToU %5 %37
%41 = OpIAdd %5 %38 %39
%42 = OpIAdd %5 %40 %38
%44 = OpAccessChain %43 %9 %33
%45 = OpLoad %6 %44
%46 = OpIMul %5 %42 %47
%48 = OpIAdd %5 %46 %41
%49 = OpShiftLeftLogical %5 %48 %50
%51 = OpIMul %5 %48 %50
%60 = OpFunctionCall %5 %55 %51 %50
OpBeginInvocationInterlockEXT
%62 = OpImageRead %61 %45 %60
%63 = OpCompositeExtract %5 %62 0
%65 = OpIAdd %5 %60 %36
%64 = OpImageRead %61 %45 %65
%66 = OpCompositeExtract %5 %64 0
%68 = OpIAdd %5 %60 %69
%67 = OpImageRead %61 %45 %68
%70 = OpCompositeExtract %5 %67 0
%72 = OpIAdd %5 %60 %73
%71 = OpImageRead %61 %45 %72
%74 = OpCompositeExtract %5 %71 0
%75 = OpCompositeConstruct %61 %63 %66 %70 %74
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpCompositeExtract %5 %75 3
%80 = OpIAdd %5 %76 %36
%81 = OpIAdd %5 %77 %69
%82 = OpIAdd %5 %78 %73
%83 = OpIAdd %5 %79 %50
%84 = OpIMul %5 %48 %50
%85 = OpFunctionCall %5 %55 %84 %50
%86 = OpCompositeConstruct %61 %80 %80 %80 %80
OpImageWrite %45 %85 %86
%87 = OpCompositeConstruct %61 %81 %81 %81 %81
%88 = OpIAdd %5 %85 %36
OpImageWrite %45 %88 %87
%89 = OpCompositeConstruct %61 %82 %82 %82 %82
%90 = OpIAdd %5 %85 %69
OpImageWrite %45 %90 %89
%91 = OpCompositeConstruct %61 %83 %83 %83 %83
%92 = OpIAdd %5 %85 %73
OpImageWrite %45 %92 %91
%93 = OpAccessChain %43 %12 %36
%94 = OpLoad %6 %93
%95 = OpIMul %5 %48 %50
%96 = OpImageRead %61 %94 %95
%97 = OpCompositeExtract %5 %96 0
%99 = OpIAdd %5 %95 %36
%98 = OpImageRead %61 %94 %99
%100 = OpCompositeExtract %5 %98 0
%102 = OpIAdd %5 %95 %69
%101 = OpImageRead %61 %94 %102
%103 = OpCompositeExtract %5 %101 0
%105 = OpIAdd %5 %95 %73
%104 = OpImageRead %61 %94 %105
%106 = OpCompositeExtract %5 %104 0
%107 = OpCompositeConstruct %61 %97 %100 %103 %106
%108 = OpBitcast %26 %107
%109 = OpCompositeExtract %13 %108 0
%110 = OpCompositeExtract %13 %108 1
%111 = OpCompositeExtract %13 %108 2
%112 = OpCompositeExtract %13 %108 3
%113 = OpFAdd %13 %109 %114
%115 = OpFAdd %13 %110 %116
%117 = OpFAdd %13 %111 %118
%119 = OpFAdd %13 %112 %120
%121 = OpIMul %5 %48 %50
%122 = OpBitcast %5 %113
%123 = OpBitcast %5 %115
%124 = OpBitcast %5 %117
%125 = OpBitcast %5 %119
%126 = OpCompositeConstruct %61 %122 %122 %122 %122
OpImageWrite %94 %121 %126
%127 = OpCompositeConstruct %61 %123 %123 %123 %123
%128 = OpIAdd %5 %121 %36
OpImageWrite %94 %128 %127
%129 = OpCompositeConstruct %61 %124 %124 %124 %124
%130 = OpIAdd %5 %121 %69
OpImageWrite %94 %130 %129
%131 = OpCompositeConstruct %61 %125 %125 %125 %125
%132 = OpIAdd %5 %121 %73
OpImageWrite %94 %132 %131
%134 = OpAccessChain %133 %17 %69
%135 = OpLoad %14 %134
%136 = OpImageRead %26 %135 %48
%137 = OpCompositeExtract %13 %136 0
%138 = OpCompositeExtract %13 %136 1
%139 = OpCompositeExtract %13 %136 2
%140 = OpCompositeExtract %13 %136 3
%141 = OpFAdd %13 %137 %114
%142 = OpFAdd %13 %138 %116
%143 = OpFAdd %13 %139 %118
%144 = OpFAdd %13 %140 %120
%145 = OpCompositeConstruct %26 %141 %142 %143 %144
OpImageWrite %135 %48 %145
%147 = OpAccessChain %146 %21 %73
%148 = OpLoad %18 %147
%149 = OpImageRead %26 %148 %48 None
%150 = OpCompositeExtract %13 %149 0
%151 = OpCompositeExtract %13 %149 1
%152 = OpCompositeExtract %13 %149 2
%153 = OpCompositeExtract %13 %149 3
%154 = OpFAdd %13 %150 %114
%155 = OpFAdd %13 %151 %116
%156 = OpFAdd %13 %152 %118
%157 = OpFAdd %13 %153 %120
%158 = OpCompositeConstruct %26 %154 %155 %156 %157
OpImageWrite %148 %48 %158
%160 = OpAccessChain %159 %25 %50
%161 = OpLoad %22 %160
%164 = OpCompositeConstruct %163 %41 %42
%162 = OpImageRead %26 %161 %164 None
%165 = OpCompositeExtract %13 %162 0
%166 = OpCompositeExtract %13 %162 1
%167 = OpCompositeExtract %13 %162 2
%168 = OpCompositeExtract %13 %162 3
%169 = OpFAdd %13 %165 %114
%170 = OpFAdd %13 %166 %116
%171 = OpFAdd %13 %167 %118
%172 = OpFAdd %13 %168 %120
%173 = OpCompositeConstruct %163 %41 %42
%174 = OpCompositeConstruct %26 %169 %170 %171 %172
OpImageWrite %161 %173 %174
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%55 = OpFunction %5 None %52
%53 = OpFunctionParameter %5
%54 = OpFunctionParameter %5
%56 = OpLabel
%57 = OpUDiv %5 %58 %54
%59 = OpBitwiseAnd %5 %53 %57
OpReturnValue %59
OpFunctionEnd
#endif
