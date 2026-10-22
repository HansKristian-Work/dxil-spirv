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
layout(pixel_interlock_ordered) in;
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
    uint _36 = uint(gl_FragCoord.x);
    uint _37 = uint(gl_FragCoord.y);
    uint _43 = (_37 * 1000u) + _36;
    uint _55 = ByteAddressMask(_43 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _57 = imageLoad(_9[0u], int(_55));
    uvec4 _59 = imageLoad(_9[0u], int(_55 + 1u));
    uvec4 _62 = imageLoad(_9[0u], int(_55 + 2u));
    uvec4 _66 = imageLoad(_9[0u], int(_55 + 3u));
    uvec4 _70 = uvec4(_57.x, _59.x, _62.x, _66.x);
    uint _80 = ByteAddressMask(_43 * 4u, 4u);
    imageStore(_9[0u], int(_80), uvec4(_70.x + 1u));
    imageStore(_9[0u], int(_80 + 1u), uvec4(_70.y + 2u));
    imageStore(_9[0u], int(_80 + 2u), uvec4(_70.z + 3u));
    imageStore(_9[0u], int(_80 + 3u), uvec4(_70.w + 4u));
    uint _90 = _43 * 4u;
    uvec4 _91 = imageLoad(_12[1u], int(_90));
    uvec4 _93 = imageLoad(_12[1u], int(_90 + 1u));
    uvec4 _96 = imageLoad(_12[1u], int(_90 + 2u));
    uvec4 _99 = imageLoad(_12[1u], int(_90 + 3u));
    vec4 _103 = uintBitsToFloat(uvec4(_91.x, _93.x, _96.x, _99.x));
    uint _116 = _43 * 4u;
    imageStore(_12[1u], int(_116), uvec4(floatBitsToUint(_103.x + 1.0)));
    imageStore(_12[1u], int(_116 + 1u), uvec4(floatBitsToUint(_103.y + 2.0)));
    imageStore(_12[1u], int(_116 + 2u), uvec4(floatBitsToUint(_103.z + 3.0)));
    imageStore(_12[1u], int(_116 + 3u), uvec4(floatBitsToUint(_103.w + 4.0)));
    vec4 _131 = imageLoad(_17[2u], int(_43));
    imageStore(_17[2u], int(_43), vec4(_131.x + 1.0, _131.y + 2.0, _131.z + 3.0, _131.w + 4.0));
    vec4 _144 = imageLoad(_21[3u], int(_43));
    imageStore(_21[3u], int(_43), vec4(_144.x + 1.0, _144.y + 2.0, _144.z + 3.0, _144.w + 4.0));
    vec4 _157 = imageLoad(_25[4u], ivec2(uvec2(_36, _37)));
    imageStore(_25[4u], ivec2(uvec2(_36, _37)), vec4(_157.x + 1.0, _157.y + 2.0, _157.z + 3.0, _157.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 171
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %12 %17 %21 %25 %28
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %28 "SV_Position"
OpName %50 "ByteAddressMask"
OpName %48 "index"
OpName %49 "stride"
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
%29 = OpTypePointer Input %13
%31 = OpConstant %5 0
%34 = OpConstant %5 1
%38 = OpTypePointer UniformConstant %6
%42 = OpConstant %5 1000
%45 = OpConstant %5 4
%47 = OpTypeFunction %5 %5 %5
%53 = OpConstant %5 4294967295
%56 = OpTypeVector %5 4
%64 = OpConstant %5 2
%68 = OpConstant %5 3
%109 = OpConstant %13 1
%111 = OpConstant %13 2
%113 = OpConstant %13 3
%115 = OpConstant %13 4
%128 = OpTypePointer UniformConstant %14
%141 = OpTypePointer UniformConstant %18
%154 = OpTypePointer UniformConstant %22
%158 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %170
%170 = OpLabel
%30 = OpAccessChain %29 %28 %31
%32 = OpLoad %13 %30
%33 = OpAccessChain %29 %28 %34
%35 = OpLoad %13 %33
%36 = OpConvertFToU %5 %32
%37 = OpConvertFToU %5 %35
%39 = OpAccessChain %38 %9 %31
%40 = OpLoad %6 %39
%41 = OpIMul %5 %37 %42
%43 = OpIAdd %5 %41 %36
%44 = OpShiftLeftLogical %5 %43 %45
%46 = OpIMul %5 %43 %45
%55 = OpFunctionCall %5 %50 %46 %45
OpBeginInvocationInterlockEXT
%57 = OpImageRead %56 %40 %55
%58 = OpCompositeExtract %5 %57 0
%60 = OpIAdd %5 %55 %34
%59 = OpImageRead %56 %40 %60
%61 = OpCompositeExtract %5 %59 0
%63 = OpIAdd %5 %55 %64
%62 = OpImageRead %56 %40 %63
%65 = OpCompositeExtract %5 %62 0
%67 = OpIAdd %5 %55 %68
%66 = OpImageRead %56 %40 %67
%69 = OpCompositeExtract %5 %66 0
%70 = OpCompositeConstruct %56 %58 %61 %65 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1
%73 = OpCompositeExtract %5 %70 2
%74 = OpCompositeExtract %5 %70 3
%75 = OpIAdd %5 %71 %34
%76 = OpIAdd %5 %72 %64
%77 = OpIAdd %5 %73 %68
%78 = OpIAdd %5 %74 %45
%79 = OpIMul %5 %43 %45
%80 = OpFunctionCall %5 %50 %79 %45
%81 = OpCompositeConstruct %56 %75 %75 %75 %75
OpImageWrite %40 %80 %81
%82 = OpCompositeConstruct %56 %76 %76 %76 %76
%83 = OpIAdd %5 %80 %34
OpImageWrite %40 %83 %82
%84 = OpCompositeConstruct %56 %77 %77 %77 %77
%85 = OpIAdd %5 %80 %64
OpImageWrite %40 %85 %84
%86 = OpCompositeConstruct %56 %78 %78 %78 %78
%87 = OpIAdd %5 %80 %68
OpImageWrite %40 %87 %86
%88 = OpAccessChain %38 %12 %34
%89 = OpLoad %6 %88
%90 = OpIMul %5 %43 %45
%91 = OpImageRead %56 %89 %90
%92 = OpCompositeExtract %5 %91 0
%94 = OpIAdd %5 %90 %34
%93 = OpImageRead %56 %89 %94
%95 = OpCompositeExtract %5 %93 0
%97 = OpIAdd %5 %90 %64
%96 = OpImageRead %56 %89 %97
%98 = OpCompositeExtract %5 %96 0
%100 = OpIAdd %5 %90 %68
%99 = OpImageRead %56 %89 %100
%101 = OpCompositeExtract %5 %99 0
%102 = OpCompositeConstruct %56 %92 %95 %98 %101
%103 = OpBitcast %26 %102
%104 = OpCompositeExtract %13 %103 0
%105 = OpCompositeExtract %13 %103 1
%106 = OpCompositeExtract %13 %103 2
%107 = OpCompositeExtract %13 %103 3
%108 = OpFAdd %13 %104 %109
%110 = OpFAdd %13 %105 %111
%112 = OpFAdd %13 %106 %113
%114 = OpFAdd %13 %107 %115
%116 = OpIMul %5 %43 %45
%117 = OpBitcast %5 %108
%118 = OpBitcast %5 %110
%119 = OpBitcast %5 %112
%120 = OpBitcast %5 %114
%121 = OpCompositeConstruct %56 %117 %117 %117 %117
OpImageWrite %89 %116 %121
%122 = OpCompositeConstruct %56 %118 %118 %118 %118
%123 = OpIAdd %5 %116 %34
OpImageWrite %89 %123 %122
%124 = OpCompositeConstruct %56 %119 %119 %119 %119
%125 = OpIAdd %5 %116 %64
OpImageWrite %89 %125 %124
%126 = OpCompositeConstruct %56 %120 %120 %120 %120
%127 = OpIAdd %5 %116 %68
OpImageWrite %89 %127 %126
%129 = OpAccessChain %128 %17 %64
%130 = OpLoad %14 %129
%131 = OpImageRead %26 %130 %43
%132 = OpCompositeExtract %13 %131 0
%133 = OpCompositeExtract %13 %131 1
%134 = OpCompositeExtract %13 %131 2
%135 = OpCompositeExtract %13 %131 3
%136 = OpFAdd %13 %132 %109
%137 = OpFAdd %13 %133 %111
%138 = OpFAdd %13 %134 %113
%139 = OpFAdd %13 %135 %115
%140 = OpCompositeConstruct %26 %136 %137 %138 %139
OpImageWrite %130 %43 %140
%142 = OpAccessChain %141 %21 %68
%143 = OpLoad %18 %142
%144 = OpImageRead %26 %143 %43 None
%145 = OpCompositeExtract %13 %144 0
%146 = OpCompositeExtract %13 %144 1
%147 = OpCompositeExtract %13 %144 2
%148 = OpCompositeExtract %13 %144 3
%149 = OpFAdd %13 %145 %109
%150 = OpFAdd %13 %146 %111
%151 = OpFAdd %13 %147 %113
%152 = OpFAdd %13 %148 %115
%153 = OpCompositeConstruct %26 %149 %150 %151 %152
OpImageWrite %143 %43 %153
%155 = OpAccessChain %154 %25 %45
%156 = OpLoad %22 %155
%159 = OpCompositeConstruct %158 %36 %37
%157 = OpImageRead %26 %156 %159 None
%160 = OpCompositeExtract %13 %157 0
%161 = OpCompositeExtract %13 %157 1
%162 = OpCompositeExtract %13 %157 2
%163 = OpCompositeExtract %13 %157 3
%164 = OpFAdd %13 %160 %109
%165 = OpFAdd %13 %161 %111
%166 = OpFAdd %13 %162 %113
%167 = OpFAdd %13 %163 %115
%168 = OpCompositeConstruct %158 %36 %37
%169 = OpCompositeConstruct %26 %164 %165 %166 %167
OpImageWrite %156 %168 %169
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%50 = OpFunction %5 None %47
%48 = OpFunctionParameter %5
%49 = OpFunctionParameter %5
%51 = OpLabel
%52 = OpUDiv %5 %53 %49
%54 = OpBitwiseAnd %5 %48 %52
OpReturnValue %54
OpFunctionEnd
#endif
