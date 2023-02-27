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

void main()
{
    uint _41 = uint(gl_SampleID) + uint(gl_FragCoord.x);
    uint _42 = uint(gl_FragCoord.y) + uint(gl_SampleID);
    uint _48 = (_42 * 1000u) + _41;
    uint _51 = _48 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _53 = imageLoad(_9[0u], int(_51));
    uvec4 _55 = imageLoad(_9[0u], int(_51 + 1u));
    uvec4 _58 = imageLoad(_9[0u], int(_51 + 2u));
    uvec4 _62 = imageLoad(_9[0u], int(_51 + 3u));
    uvec4 _66 = uvec4(_53.x, _55.x, _58.x, _62.x);
    uint _75 = _48 * 4u;
    imageStore(_9[0u], int(_75), uvec4(_66.x + 1u));
    imageStore(_9[0u], int(_75 + 1u), uvec4(_66.y + 2u));
    imageStore(_9[0u], int(_75 + 2u), uvec4(_66.z + 3u));
    imageStore(_9[0u], int(_75 + 3u), uvec4(_66.w + 4u));
    uint _85 = _48 * 4u;
    uvec4 _86 = imageLoad(_12[1u], int(_85));
    uvec4 _88 = imageLoad(_12[1u], int(_85 + 1u));
    uvec4 _91 = imageLoad(_12[1u], int(_85 + 2u));
    uvec4 _94 = imageLoad(_12[1u], int(_85 + 3u));
    vec4 _98 = uintBitsToFloat(uvec4(_86.x, _88.x, _91.x, _94.x));
    uint _111 = _48 * 4u;
    imageStore(_12[1u], int(_111), uvec4(floatBitsToUint(_98.x + 1.0)));
    imageStore(_12[1u], int(_111 + 1u), uvec4(floatBitsToUint(_98.y + 2.0)));
    imageStore(_12[1u], int(_111 + 2u), uvec4(floatBitsToUint(_98.z + 3.0)));
    imageStore(_12[1u], int(_111 + 3u), uvec4(floatBitsToUint(_98.w + 4.0)));
    vec4 _126 = imageLoad(_17[2u], int(_48));
    imageStore(_17[2u], int(_48), vec4(_126.x + 1.0, _126.y + 2.0, _126.z + 3.0, _126.w + 4.0));
    vec4 _139 = imageLoad(_21[3u], int(_48));
    imageStore(_21[3u], int(_48), vec4(_139.x + 1.0, _139.y + 2.0, _139.z + 3.0, _139.w + 4.0));
    vec4 _152 = imageLoad(_25[4u], ivec2(uvec2(_41, _42)));
    imageStore(_25[4u], ivec2(uvec2(_41, _42)), vec4(_152.x + 1.0, _152.y + 2.0, _152.z + 3.0, _152.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 167
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
OpEntryPoint Fragment %3 "main" %28 %30
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 SampleInterlockOrderedEXT
OpName %3 "main"
OpName %28 "SV_Position"
OpName %30 "SV_SampleIndex"
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
%52 = OpTypeVector %5 4
%60 = OpConstant %5 2
%64 = OpConstant %5 3
%104 = OpConstant %13 1
%106 = OpConstant %13 2
%108 = OpConstant %13 3
%110 = OpConstant %13 4
%123 = OpTypePointer UniformConstant %14
%136 = OpTypePointer UniformConstant %18
%149 = OpTypePointer UniformConstant %22
%153 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %165
%165 = OpLabel
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
OpBeginInvocationInterlockEXT
%53 = OpImageRead %52 %45 %51
%54 = OpCompositeExtract %5 %53 0
%56 = OpIAdd %5 %51 %36
%55 = OpImageRead %52 %45 %56
%57 = OpCompositeExtract %5 %55 0
%59 = OpIAdd %5 %51 %60
%58 = OpImageRead %52 %45 %59
%61 = OpCompositeExtract %5 %58 0
%63 = OpIAdd %5 %51 %64
%62 = OpImageRead %52 %45 %63
%65 = OpCompositeExtract %5 %62 0
%66 = OpCompositeConstruct %52 %54 %57 %61 %65
%67 = OpCompositeExtract %5 %66 0
%68 = OpCompositeExtract %5 %66 1
%69 = OpCompositeExtract %5 %66 2
%70 = OpCompositeExtract %5 %66 3
%71 = OpIAdd %5 %67 %36
%72 = OpIAdd %5 %68 %60
%73 = OpIAdd %5 %69 %64
%74 = OpIAdd %5 %70 %50
%75 = OpIMul %5 %48 %50
%76 = OpCompositeConstruct %52 %71 %71 %71 %71
OpImageWrite %45 %75 %76
%77 = OpCompositeConstruct %52 %72 %72 %72 %72
%78 = OpIAdd %5 %75 %36
OpImageWrite %45 %78 %77
%79 = OpCompositeConstruct %52 %73 %73 %73 %73
%80 = OpIAdd %5 %75 %60
OpImageWrite %45 %80 %79
%81 = OpCompositeConstruct %52 %74 %74 %74 %74
%82 = OpIAdd %5 %75 %64
OpImageWrite %45 %82 %81
%83 = OpAccessChain %43 %12 %36
%84 = OpLoad %6 %83
%85 = OpIMul %5 %48 %50
%86 = OpImageRead %52 %84 %85
%87 = OpCompositeExtract %5 %86 0
%89 = OpIAdd %5 %85 %36
%88 = OpImageRead %52 %84 %89
%90 = OpCompositeExtract %5 %88 0
%92 = OpIAdd %5 %85 %60
%91 = OpImageRead %52 %84 %92
%93 = OpCompositeExtract %5 %91 0
%95 = OpIAdd %5 %85 %64
%94 = OpImageRead %52 %84 %95
%96 = OpCompositeExtract %5 %94 0
%97 = OpCompositeConstruct %52 %87 %90 %93 %96
%98 = OpBitcast %26 %97
%99 = OpCompositeExtract %13 %98 0
%100 = OpCompositeExtract %13 %98 1
%101 = OpCompositeExtract %13 %98 2
%102 = OpCompositeExtract %13 %98 3
%103 = OpFAdd %13 %99 %104
%105 = OpFAdd %13 %100 %106
%107 = OpFAdd %13 %101 %108
%109 = OpFAdd %13 %102 %110
%111 = OpIMul %5 %48 %50
%112 = OpBitcast %5 %103
%113 = OpBitcast %5 %105
%114 = OpBitcast %5 %107
%115 = OpBitcast %5 %109
%116 = OpCompositeConstruct %52 %112 %112 %112 %112
OpImageWrite %84 %111 %116
%117 = OpCompositeConstruct %52 %113 %113 %113 %113
%118 = OpIAdd %5 %111 %36
OpImageWrite %84 %118 %117
%119 = OpCompositeConstruct %52 %114 %114 %114 %114
%120 = OpIAdd %5 %111 %60
OpImageWrite %84 %120 %119
%121 = OpCompositeConstruct %52 %115 %115 %115 %115
%122 = OpIAdd %5 %111 %64
OpImageWrite %84 %122 %121
%124 = OpAccessChain %123 %17 %60
%125 = OpLoad %14 %124
%126 = OpImageRead %26 %125 %48
%127 = OpCompositeExtract %13 %126 0
%128 = OpCompositeExtract %13 %126 1
%129 = OpCompositeExtract %13 %126 2
%130 = OpCompositeExtract %13 %126 3
%131 = OpFAdd %13 %127 %104
%132 = OpFAdd %13 %128 %106
%133 = OpFAdd %13 %129 %108
%134 = OpFAdd %13 %130 %110
%135 = OpCompositeConstruct %26 %131 %132 %133 %134
OpImageWrite %125 %48 %135
%137 = OpAccessChain %136 %21 %64
%138 = OpLoad %18 %137
%139 = OpImageRead %26 %138 %48 None
%140 = OpCompositeExtract %13 %139 0
%141 = OpCompositeExtract %13 %139 1
%142 = OpCompositeExtract %13 %139 2
%143 = OpCompositeExtract %13 %139 3
%144 = OpFAdd %13 %140 %104
%145 = OpFAdd %13 %141 %106
%146 = OpFAdd %13 %142 %108
%147 = OpFAdd %13 %143 %110
%148 = OpCompositeConstruct %26 %144 %145 %146 %147
OpImageWrite %138 %48 %148
%150 = OpAccessChain %149 %25 %50
%151 = OpLoad %22 %150
%154 = OpCompositeConstruct %153 %41 %42
%152 = OpImageRead %26 %151 %154 None
%155 = OpCompositeExtract %13 %152 0
%156 = OpCompositeExtract %13 %152 1
%157 = OpCompositeExtract %13 %152 2
%158 = OpCompositeExtract %13 %152 3
%159 = OpFAdd %13 %155 %104
%160 = OpFAdd %13 %156 %106
%161 = OpFAdd %13 %157 %108
%162 = OpFAdd %13 %158 %110
%163 = OpCompositeConstruct %153 %41 %42
%164 = OpCompositeConstruct %26 %159 %160 %161 %162
OpImageWrite %151 %163 %164
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
