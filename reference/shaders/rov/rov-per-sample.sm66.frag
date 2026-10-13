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
    uint _61 = ByteAddressMask(_48 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _63 = imageLoad(_9[0u], int(_61));
    uvec4 _65 = imageLoad(_9[0u], int(_61 + 1u));
    uvec4 _68 = imageLoad(_9[0u], int(_61 + 2u));
    uvec4 _72 = imageLoad(_9[0u], int(_61 + 3u));
    uvec4 _76 = uvec4(_63.x, _65.x, _68.x, _72.x);
    uint _86 = ByteAddressMask(_48 * 4u, 4u);
    imageStore(_9[0u], int(_86), uvec4(_76.x + 1u));
    imageStore(_9[0u], int(_86 + 1u), uvec4(_76.y + 2u));
    imageStore(_9[0u], int(_86 + 2u), uvec4(_76.z + 3u));
    imageStore(_9[0u], int(_86 + 3u), uvec4(_76.w + 4u));
    uint _96 = _48 * 4u;
    uvec4 _97 = imageLoad(_12[1u], int(_96));
    uvec4 _99 = imageLoad(_12[1u], int(_96 + 1u));
    uvec4 _102 = imageLoad(_12[1u], int(_96 + 2u));
    uvec4 _105 = imageLoad(_12[1u], int(_96 + 3u));
    vec4 _109 = uintBitsToFloat(uvec4(_97.x, _99.x, _102.x, _105.x));
    uint _122 = _48 * 4u;
    imageStore(_12[1u], int(_122), uvec4(floatBitsToUint(_109.x + 1.0)));
    imageStore(_12[1u], int(_122 + 1u), uvec4(floatBitsToUint(_109.y + 2.0)));
    imageStore(_12[1u], int(_122 + 2u), uvec4(floatBitsToUint(_109.z + 3.0)));
    imageStore(_12[1u], int(_122 + 3u), uvec4(floatBitsToUint(_109.w + 4.0)));
    vec4 _137 = imageLoad(_17[2u], int(_48));
    imageStore(_17[2u], int(_48), vec4(_137.x + 1.0, _137.y + 2.0, _137.z + 3.0, _137.w + 4.0));
    vec4 _150 = imageLoad(_21[3u], int(_48));
    imageStore(_21[3u], int(_48), vec4(_150.x + 1.0, _150.y + 2.0, _150.z + 3.0, _150.w + 4.0));
    vec4 _163 = imageLoad(_25[4u], ivec2(uvec2(_41, _42)));
    imageStore(_25[4u], ivec2(uvec2(_41, _42)), vec4(_163.x + 1.0, _163.y + 2.0, _163.z + 3.0, _163.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 178
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
%62 = OpTypeVector %5 4
%70 = OpConstant %5 2
%74 = OpConstant %5 3
%115 = OpConstant %13 1
%117 = OpConstant %13 2
%119 = OpConstant %13 3
%121 = OpConstant %13 4
%134 = OpTypePointer UniformConstant %14
%147 = OpTypePointer UniformConstant %18
%160 = OpTypePointer UniformConstant %22
%164 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %176
%176 = OpLabel
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
%61 = OpFunctionCall %5 %55 %51 %50
OpBeginInvocationInterlockEXT
%63 = OpImageRead %62 %45 %61
%64 = OpCompositeExtract %5 %63 0
%66 = OpIAdd %5 %61 %36
%65 = OpImageRead %62 %45 %66
%67 = OpCompositeExtract %5 %65 0
%69 = OpIAdd %5 %61 %70
%68 = OpImageRead %62 %45 %69
%71 = OpCompositeExtract %5 %68 0
%73 = OpIAdd %5 %61 %74
%72 = OpImageRead %62 %45 %73
%75 = OpCompositeExtract %5 %72 0
%76 = OpCompositeConstruct %62 %64 %67 %71 %75
%77 = OpCompositeExtract %5 %76 0
%78 = OpCompositeExtract %5 %76 1
%79 = OpCompositeExtract %5 %76 2
%80 = OpCompositeExtract %5 %76 3
%81 = OpIAdd %5 %77 %36
%82 = OpIAdd %5 %78 %70
%83 = OpIAdd %5 %79 %74
%84 = OpIAdd %5 %80 %50
%85 = OpIMul %5 %48 %50
%86 = OpFunctionCall %5 %55 %85 %50
%87 = OpCompositeConstruct %62 %81 %81 %81 %81
OpImageWrite %45 %86 %87
%88 = OpCompositeConstruct %62 %82 %82 %82 %82
%89 = OpIAdd %5 %86 %36
OpImageWrite %45 %89 %88
%90 = OpCompositeConstruct %62 %83 %83 %83 %83
%91 = OpIAdd %5 %86 %70
OpImageWrite %45 %91 %90
%92 = OpCompositeConstruct %62 %84 %84 %84 %84
%93 = OpIAdd %5 %86 %74
OpImageWrite %45 %93 %92
%94 = OpAccessChain %43 %12 %36
%95 = OpLoad %6 %94
%96 = OpIMul %5 %48 %50
%97 = OpImageRead %62 %95 %96
%98 = OpCompositeExtract %5 %97 0
%100 = OpIAdd %5 %96 %36
%99 = OpImageRead %62 %95 %100
%101 = OpCompositeExtract %5 %99 0
%103 = OpIAdd %5 %96 %70
%102 = OpImageRead %62 %95 %103
%104 = OpCompositeExtract %5 %102 0
%106 = OpIAdd %5 %96 %74
%105 = OpImageRead %62 %95 %106
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeConstruct %62 %98 %101 %104 %107
%109 = OpBitcast %26 %108
%110 = OpCompositeExtract %13 %109 0
%111 = OpCompositeExtract %13 %109 1
%112 = OpCompositeExtract %13 %109 2
%113 = OpCompositeExtract %13 %109 3
%114 = OpFAdd %13 %110 %115
%116 = OpFAdd %13 %111 %117
%118 = OpFAdd %13 %112 %119
%120 = OpFAdd %13 %113 %121
%122 = OpIMul %5 %48 %50
%123 = OpBitcast %5 %114
%124 = OpBitcast %5 %116
%125 = OpBitcast %5 %118
%126 = OpBitcast %5 %120
%127 = OpCompositeConstruct %62 %123 %123 %123 %123
OpImageWrite %95 %122 %127
%128 = OpCompositeConstruct %62 %124 %124 %124 %124
%129 = OpIAdd %5 %122 %36
OpImageWrite %95 %129 %128
%130 = OpCompositeConstruct %62 %125 %125 %125 %125
%131 = OpIAdd %5 %122 %70
OpImageWrite %95 %131 %130
%132 = OpCompositeConstruct %62 %126 %126 %126 %126
%133 = OpIAdd %5 %122 %74
OpImageWrite %95 %133 %132
%135 = OpAccessChain %134 %17 %70
%136 = OpLoad %14 %135
%137 = OpImageRead %26 %136 %48
%138 = OpCompositeExtract %13 %137 0
%139 = OpCompositeExtract %13 %137 1
%140 = OpCompositeExtract %13 %137 2
%141 = OpCompositeExtract %13 %137 3
%142 = OpFAdd %13 %138 %115
%143 = OpFAdd %13 %139 %117
%144 = OpFAdd %13 %140 %119
%145 = OpFAdd %13 %141 %121
%146 = OpCompositeConstruct %26 %142 %143 %144 %145
OpImageWrite %136 %48 %146
%148 = OpAccessChain %147 %21 %74
%149 = OpLoad %18 %148
%150 = OpImageRead %26 %149 %48 None
%151 = OpCompositeExtract %13 %150 0
%152 = OpCompositeExtract %13 %150 1
%153 = OpCompositeExtract %13 %150 2
%154 = OpCompositeExtract %13 %150 3
%155 = OpFAdd %13 %151 %115
%156 = OpFAdd %13 %152 %117
%157 = OpFAdd %13 %153 %119
%158 = OpFAdd %13 %154 %121
%159 = OpCompositeConstruct %26 %155 %156 %157 %158
OpImageWrite %149 %48 %159
%161 = OpAccessChain %160 %25 %50
%162 = OpLoad %22 %161
%165 = OpCompositeConstruct %164 %41 %42
%163 = OpImageRead %26 %162 %165 None
%166 = OpCompositeExtract %13 %163 0
%167 = OpCompositeExtract %13 %163 1
%168 = OpCompositeExtract %13 %163 2
%169 = OpCompositeExtract %13 %163 3
%170 = OpFAdd %13 %166 %115
%171 = OpFAdd %13 %167 %117
%172 = OpFAdd %13 %168 %119
%173 = OpFAdd %13 %169 %121
%174 = OpCompositeConstruct %164 %41 %42
%175 = OpCompositeConstruct %26 %170 %171 %172 %173
OpImageWrite %162 %174 %175
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
