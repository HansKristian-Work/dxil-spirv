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

void main()
{
    uint _36 = uint(gl_FragCoord.x);
    uint _37 = uint(gl_FragCoord.y);
    uint _43 = (_37 * 1000u) + _36;
    uint _46 = _43 * 4u;
    SPIRV_Cross_beginInvocationInterlock();
    uvec4 _48 = imageLoad(_9[0u], int(_46));
    uvec4 _50 = imageLoad(_9[0u], int(_46 + 1u));
    uvec4 _53 = imageLoad(_9[0u], int(_46 + 2u));
    uvec4 _57 = imageLoad(_9[0u], int(_46 + 3u));
    uvec4 _61 = uvec4(_48.x, _50.x, _53.x, _57.x);
    uint _70 = _43 * 4u;
    imageStore(_9[0u], int(_70), uvec4(_61.x + 1u));
    imageStore(_9[0u], int(_70 + 1u), uvec4(_61.y + 2u));
    imageStore(_9[0u], int(_70 + 2u), uvec4(_61.z + 3u));
    imageStore(_9[0u], int(_70 + 3u), uvec4(_61.w + 4u));
    uint _80 = _43 * 4u;
    uvec4 _81 = imageLoad(_12[1u], int(_80));
    uvec4 _83 = imageLoad(_12[1u], int(_80 + 1u));
    uvec4 _86 = imageLoad(_12[1u], int(_80 + 2u));
    uvec4 _89 = imageLoad(_12[1u], int(_80 + 3u));
    vec4 _93 = uintBitsToFloat(uvec4(_81.x, _83.x, _86.x, _89.x));
    uint _106 = _43 * 4u;
    imageStore(_12[1u], int(_106), uvec4(floatBitsToUint(_93.x + 1.0)));
    imageStore(_12[1u], int(_106 + 1u), uvec4(floatBitsToUint(_93.y + 2.0)));
    imageStore(_12[1u], int(_106 + 2u), uvec4(floatBitsToUint(_93.z + 3.0)));
    imageStore(_12[1u], int(_106 + 3u), uvec4(floatBitsToUint(_93.w + 4.0)));
    vec4 _121 = imageLoad(_17[2u], int(_43));
    imageStore(_17[2u], int(_43), vec4(_121.x + 1.0, _121.y + 2.0, _121.z + 3.0, _121.w + 4.0));
    vec4 _134 = imageLoad(_21[3u], int(_43));
    imageStore(_21[3u], int(_43), vec4(_134.x + 1.0, _134.y + 2.0, _134.z + 3.0, _134.w + 4.0));
    vec4 _147 = imageLoad(_25[4u], ivec2(uvec2(_36, _37)));
    imageStore(_25[4u], ivec2(uvec2(_36, _37)), vec4(_147.x + 1.0, _147.y + 2.0, _147.z + 3.0, _147.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 162
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
OpEntryPoint Fragment %3 "main" %28
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %28 "SV_Position"
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
%47 = OpTypeVector %5 4
%55 = OpConstant %5 2
%59 = OpConstant %5 3
%99 = OpConstant %13 1
%101 = OpConstant %13 2
%103 = OpConstant %13 3
%105 = OpConstant %13 4
%118 = OpTypePointer UniformConstant %14
%131 = OpTypePointer UniformConstant %18
%144 = OpTypePointer UniformConstant %22
%148 = OpTypeVector %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %160
%160 = OpLabel
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
OpBeginInvocationInterlockEXT
%48 = OpImageRead %47 %40 %46
%49 = OpCompositeExtract %5 %48 0
%51 = OpIAdd %5 %46 %34
%50 = OpImageRead %47 %40 %51
%52 = OpCompositeExtract %5 %50 0
%54 = OpIAdd %5 %46 %55
%53 = OpImageRead %47 %40 %54
%56 = OpCompositeExtract %5 %53 0
%58 = OpIAdd %5 %46 %59
%57 = OpImageRead %47 %40 %58
%60 = OpCompositeExtract %5 %57 0
%61 = OpCompositeConstruct %47 %49 %52 %56 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%66 = OpIAdd %5 %62 %34
%67 = OpIAdd %5 %63 %55
%68 = OpIAdd %5 %64 %59
%69 = OpIAdd %5 %65 %45
%70 = OpIMul %5 %43 %45
%71 = OpCompositeConstruct %47 %66 %66 %66 %66
OpImageWrite %40 %70 %71
%72 = OpCompositeConstruct %47 %67 %67 %67 %67
%73 = OpIAdd %5 %70 %34
OpImageWrite %40 %73 %72
%74 = OpCompositeConstruct %47 %68 %68 %68 %68
%75 = OpIAdd %5 %70 %55
OpImageWrite %40 %75 %74
%76 = OpCompositeConstruct %47 %69 %69 %69 %69
%77 = OpIAdd %5 %70 %59
OpImageWrite %40 %77 %76
%78 = OpAccessChain %38 %12 %34
%79 = OpLoad %6 %78
%80 = OpIMul %5 %43 %45
%81 = OpImageRead %47 %79 %80
%82 = OpCompositeExtract %5 %81 0
%84 = OpIAdd %5 %80 %34
%83 = OpImageRead %47 %79 %84
%85 = OpCompositeExtract %5 %83 0
%87 = OpIAdd %5 %80 %55
%86 = OpImageRead %47 %79 %87
%88 = OpCompositeExtract %5 %86 0
%90 = OpIAdd %5 %80 %59
%89 = OpImageRead %47 %79 %90
%91 = OpCompositeExtract %5 %89 0
%92 = OpCompositeConstruct %47 %82 %85 %88 %91
%93 = OpBitcast %26 %92
%94 = OpCompositeExtract %13 %93 0
%95 = OpCompositeExtract %13 %93 1
%96 = OpCompositeExtract %13 %93 2
%97 = OpCompositeExtract %13 %93 3
%98 = OpFAdd %13 %94 %99
%100 = OpFAdd %13 %95 %101
%102 = OpFAdd %13 %96 %103
%104 = OpFAdd %13 %97 %105
%106 = OpIMul %5 %43 %45
%107 = OpBitcast %5 %98
%108 = OpBitcast %5 %100
%109 = OpBitcast %5 %102
%110 = OpBitcast %5 %104
%111 = OpCompositeConstruct %47 %107 %107 %107 %107
OpImageWrite %79 %106 %111
%112 = OpCompositeConstruct %47 %108 %108 %108 %108
%113 = OpIAdd %5 %106 %34
OpImageWrite %79 %113 %112
%114 = OpCompositeConstruct %47 %109 %109 %109 %109
%115 = OpIAdd %5 %106 %55
OpImageWrite %79 %115 %114
%116 = OpCompositeConstruct %47 %110 %110 %110 %110
%117 = OpIAdd %5 %106 %59
OpImageWrite %79 %117 %116
%119 = OpAccessChain %118 %17 %55
%120 = OpLoad %14 %119
%121 = OpImageRead %26 %120 %43
%122 = OpCompositeExtract %13 %121 0
%123 = OpCompositeExtract %13 %121 1
%124 = OpCompositeExtract %13 %121 2
%125 = OpCompositeExtract %13 %121 3
%126 = OpFAdd %13 %122 %99
%127 = OpFAdd %13 %123 %101
%128 = OpFAdd %13 %124 %103
%129 = OpFAdd %13 %125 %105
%130 = OpCompositeConstruct %26 %126 %127 %128 %129
OpImageWrite %120 %43 %130
%132 = OpAccessChain %131 %21 %59
%133 = OpLoad %18 %132
%134 = OpImageRead %26 %133 %43 None
%135 = OpCompositeExtract %13 %134 0
%136 = OpCompositeExtract %13 %134 1
%137 = OpCompositeExtract %13 %134 2
%138 = OpCompositeExtract %13 %134 3
%139 = OpFAdd %13 %135 %99
%140 = OpFAdd %13 %136 %101
%141 = OpFAdd %13 %137 %103
%142 = OpFAdd %13 %138 %105
%143 = OpCompositeConstruct %26 %139 %140 %141 %142
OpImageWrite %133 %43 %143
%145 = OpAccessChain %144 %25 %45
%146 = OpLoad %22 %145
%149 = OpCompositeConstruct %148 %36 %37
%147 = OpImageRead %26 %146 %149 None
%150 = OpCompositeExtract %13 %147 0
%151 = OpCompositeExtract %13 %147 1
%152 = OpCompositeExtract %13 %147 2
%153 = OpCompositeExtract %13 %147 3
%154 = OpFAdd %13 %150 %99
%155 = OpFAdd %13 %151 %101
%156 = OpFAdd %13 %152 %103
%157 = OpFAdd %13 %153 %105
%158 = OpCompositeConstruct %148 %36 %37
%159 = OpCompositeConstruct %26 %154 %155 %156 %157
OpImageWrite %146 %158 %159
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
