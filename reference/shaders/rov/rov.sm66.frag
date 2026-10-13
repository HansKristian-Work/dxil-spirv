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
    uint _56 = ByteAddressMask(_43 * 4u, 4u);
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _58 = imageLoad(_9[0u], int(_56));
    uvec4 _60 = imageLoad(_9[0u], int(_56 + 1u));
    uvec4 _63 = imageLoad(_9[0u], int(_56 + 2u));
    uvec4 _67 = imageLoad(_9[0u], int(_56 + 3u));
    uvec4 _71 = uvec4(_58.x, _60.x, _63.x, _67.x);
    uint _81 = ByteAddressMask(_43 * 4u, 4u);
    imageStore(_9[0u], int(_81), uvec4(_71.x + 1u));
    imageStore(_9[0u], int(_81 + 1u), uvec4(_71.y + 2u));
    imageStore(_9[0u], int(_81 + 2u), uvec4(_71.z + 3u));
    imageStore(_9[0u], int(_81 + 3u), uvec4(_71.w + 4u));
    uint _91 = _43 * 4u;
    uvec4 _92 = imageLoad(_12[1u], int(_91));
    uvec4 _94 = imageLoad(_12[1u], int(_91 + 1u));
    uvec4 _97 = imageLoad(_12[1u], int(_91 + 2u));
    uvec4 _100 = imageLoad(_12[1u], int(_91 + 3u));
    vec4 _104 = uintBitsToFloat(uvec4(_92.x, _94.x, _97.x, _100.x));
    uint _117 = _43 * 4u;
    imageStore(_12[1u], int(_117), uvec4(floatBitsToUint(_104.x + 1.0)));
    imageStore(_12[1u], int(_117 + 1u), uvec4(floatBitsToUint(_104.y + 2.0)));
    imageStore(_12[1u], int(_117 + 2u), uvec4(floatBitsToUint(_104.z + 3.0)));
    imageStore(_12[1u], int(_117 + 3u), uvec4(floatBitsToUint(_104.w + 4.0)));
    vec4 _132 = imageLoad(_17[2u], int(_43));
    imageStore(_17[2u], int(_43), vec4(_132.x + 1.0, _132.y + 2.0, _132.z + 3.0, _132.w + 4.0));
    vec4 _145 = imageLoad(_21[3u], int(_43));
    imageStore(_21[3u], int(_43), vec4(_145.x + 1.0, _145.y + 2.0, _145.z + 3.0, _145.w + 4.0));
    vec4 _158 = imageLoad(_25[4u], ivec2(uvec2(_36, _37)));
    imageStore(_25[4u], ivec2(uvec2(_36, _37)), vec4(_158.x + 1.0, _158.y + 2.0, _158.z + 3.0, _158.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 173
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
%57 = OpTypeVector %5 4
%65 = OpConstant %5 2
%69 = OpConstant %5 3
%110 = OpConstant %13 1
%112 = OpConstant %13 2
%114 = OpConstant %13 3
%116 = OpConstant %13 4
%129 = OpTypePointer UniformConstant %14
%142 = OpTypePointer UniformConstant %18
%155 = OpTypePointer UniformConstant %22
%159 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %171
%171 = OpLabel
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
%56 = OpFunctionCall %5 %50 %46 %45
OpBeginInvocationInterlockEXT
%58 = OpImageRead %57 %40 %56
%59 = OpCompositeExtract %5 %58 0
%61 = OpIAdd %5 %56 %34
%60 = OpImageRead %57 %40 %61
%62 = OpCompositeExtract %5 %60 0
%64 = OpIAdd %5 %56 %65
%63 = OpImageRead %57 %40 %64
%66 = OpCompositeExtract %5 %63 0
%68 = OpIAdd %5 %56 %69
%67 = OpImageRead %57 %40 %68
%70 = OpCompositeExtract %5 %67 0
%71 = OpCompositeConstruct %57 %59 %62 %66 %70
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 2
%75 = OpCompositeExtract %5 %71 3
%76 = OpIAdd %5 %72 %34
%77 = OpIAdd %5 %73 %65
%78 = OpIAdd %5 %74 %69
%79 = OpIAdd %5 %75 %45
%80 = OpIMul %5 %43 %45
%81 = OpFunctionCall %5 %50 %80 %45
%82 = OpCompositeConstruct %57 %76 %76 %76 %76
OpImageWrite %40 %81 %82
%83 = OpCompositeConstruct %57 %77 %77 %77 %77
%84 = OpIAdd %5 %81 %34
OpImageWrite %40 %84 %83
%85 = OpCompositeConstruct %57 %78 %78 %78 %78
%86 = OpIAdd %5 %81 %65
OpImageWrite %40 %86 %85
%87 = OpCompositeConstruct %57 %79 %79 %79 %79
%88 = OpIAdd %5 %81 %69
OpImageWrite %40 %88 %87
%89 = OpAccessChain %38 %12 %34
%90 = OpLoad %6 %89
%91 = OpIMul %5 %43 %45
%92 = OpImageRead %57 %90 %91
%93 = OpCompositeExtract %5 %92 0
%95 = OpIAdd %5 %91 %34
%94 = OpImageRead %57 %90 %95
%96 = OpCompositeExtract %5 %94 0
%98 = OpIAdd %5 %91 %65
%97 = OpImageRead %57 %90 %98
%99 = OpCompositeExtract %5 %97 0
%101 = OpIAdd %5 %91 %69
%100 = OpImageRead %57 %90 %101
%102 = OpCompositeExtract %5 %100 0
%103 = OpCompositeConstruct %57 %93 %96 %99 %102
%104 = OpBitcast %26 %103
%105 = OpCompositeExtract %13 %104 0
%106 = OpCompositeExtract %13 %104 1
%107 = OpCompositeExtract %13 %104 2
%108 = OpCompositeExtract %13 %104 3
%109 = OpFAdd %13 %105 %110
%111 = OpFAdd %13 %106 %112
%113 = OpFAdd %13 %107 %114
%115 = OpFAdd %13 %108 %116
%117 = OpIMul %5 %43 %45
%118 = OpBitcast %5 %109
%119 = OpBitcast %5 %111
%120 = OpBitcast %5 %113
%121 = OpBitcast %5 %115
%122 = OpCompositeConstruct %57 %118 %118 %118 %118
OpImageWrite %90 %117 %122
%123 = OpCompositeConstruct %57 %119 %119 %119 %119
%124 = OpIAdd %5 %117 %34
OpImageWrite %90 %124 %123
%125 = OpCompositeConstruct %57 %120 %120 %120 %120
%126 = OpIAdd %5 %117 %65
OpImageWrite %90 %126 %125
%127 = OpCompositeConstruct %57 %121 %121 %121 %121
%128 = OpIAdd %5 %117 %69
OpImageWrite %90 %128 %127
%130 = OpAccessChain %129 %17 %65
%131 = OpLoad %14 %130
%132 = OpImageRead %26 %131 %43
%133 = OpCompositeExtract %13 %132 0
%134 = OpCompositeExtract %13 %132 1
%135 = OpCompositeExtract %13 %132 2
%136 = OpCompositeExtract %13 %132 3
%137 = OpFAdd %13 %133 %110
%138 = OpFAdd %13 %134 %112
%139 = OpFAdd %13 %135 %114
%140 = OpFAdd %13 %136 %116
%141 = OpCompositeConstruct %26 %137 %138 %139 %140
OpImageWrite %131 %43 %141
%143 = OpAccessChain %142 %21 %69
%144 = OpLoad %18 %143
%145 = OpImageRead %26 %144 %43 None
%146 = OpCompositeExtract %13 %145 0
%147 = OpCompositeExtract %13 %145 1
%148 = OpCompositeExtract %13 %145 2
%149 = OpCompositeExtract %13 %145 3
%150 = OpFAdd %13 %146 %110
%151 = OpFAdd %13 %147 %112
%152 = OpFAdd %13 %148 %114
%153 = OpFAdd %13 %149 %116
%154 = OpCompositeConstruct %26 %150 %151 %152 %153
OpImageWrite %144 %43 %154
%156 = OpAccessChain %155 %25 %45
%157 = OpLoad %22 %156
%160 = OpCompositeConstruct %159 %36 %37
%158 = OpImageRead %26 %157 %160 None
%161 = OpCompositeExtract %13 %158 0
%162 = OpCompositeExtract %13 %158 1
%163 = OpCompositeExtract %13 %158 2
%164 = OpCompositeExtract %13 %158 3
%165 = OpFAdd %13 %161 %110
%166 = OpFAdd %13 %162 %112
%167 = OpFAdd %13 %163 %114
%168 = OpFAdd %13 %164 %116
%169 = OpCompositeConstruct %159 %36 %37
%170 = OpCompositeConstruct %26 %165 %166 %167 %168
OpImageWrite %157 %169 %170
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
