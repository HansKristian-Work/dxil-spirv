#version 460
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

layout(set = 0, binding = 0, r32f) uniform coherent image2D _8;
layout(set = 0, binding = 1, r32f) uniform coherent image2D _9;
layout(set = 0, binding = 2, r32f) uniform image2D _10;

void main()
{
    uint _25 = uint(gl_FragCoord.x);
    uint _26 = uint(gl_FragCoord.y);
    vec4 _27 = imageLoad(_10, ivec2(uvec2(_25, _26)));
    imageStore(_10, ivec2(uvec2(_25, _26)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
    SPIRV_Cross_beginInvocationInterlock();
    if (gl_FragCoord.x < 10.0)
    {
        vec4 _47 = imageLoad(_8, ivec2(uvec2(_25, _26)));
        imageStore(_8, ivec2(uvec2(_25, _26)), vec4(_47.x + 1.0, _47.y + 2.0, _47.z + 3.0, _47.w + 4.0));
    }
    else
    {
        vec4 _59 = imageLoad(_9, ivec2(uvec2(_25, _26)));
        imageStore(_9, ivec2(uvec2(_25, _26)), vec4(_59.x + 1.0, _59.y + 2.0, _59.z + 3.0, _59.w + 4.0));
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 76
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %13 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 Coherent
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %9 Coherent
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 2
OpDecorate %13 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpTypeVector %5 4
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%17 = OpTypePointer Input %5
%19 = OpTypeInt 32 0
%20 = OpConstant %19 0
%23 = OpConstant %19 1
%28 = OpTypeVector %19 2
%35 = OpConstant %5 1
%37 = OpConstant %5 2
%39 = OpConstant %5 3
%41 = OpConstant %5 4
%44 = OpTypeBool
%46 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %71
%71 = OpLabel
%14 = OpLoad %6 %10
%15 = OpLoad %6 %9
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %13 %20
%21 = OpLoad %5 %18
%22 = OpAccessChain %17 %13 %23
%24 = OpLoad %5 %22
%25 = OpConvertFToU %19 %21
%26 = OpConvertFToU %19 %24
%29 = OpCompositeConstruct %28 %25 %26
%27 = OpImageRead %11 %14 %29 None
%30 = OpCompositeExtract %5 %27 0
%31 = OpCompositeExtract %5 %27 1
%32 = OpCompositeExtract %5 %27 2
%33 = OpCompositeExtract %5 %27 3
%34 = OpFAdd %5 %30 %35
%36 = OpFAdd %5 %31 %37
%38 = OpFAdd %5 %32 %39
%40 = OpFAdd %5 %33 %41
%42 = OpCompositeConstruct %28 %25 %26
%43 = OpCompositeConstruct %11 %34 %36 %38 %40
OpImageWrite %14 %42 %43
%45 = OpFOrdLessThan %44 %21 %46
OpBeginInvocationInterlockEXT
OpSelectionMerge %74 None
OpBranchConditional %45 %73 %72
%73 = OpLabel
%48 = OpCompositeConstruct %28 %25 %26
%47 = OpImageRead %11 %16 %48 None
%49 = OpCompositeExtract %5 %47 0
%50 = OpCompositeExtract %5 %47 1
%51 = OpCompositeExtract %5 %47 2
%52 = OpCompositeExtract %5 %47 3
%53 = OpFAdd %5 %49 %35
%54 = OpFAdd %5 %50 %37
%55 = OpFAdd %5 %51 %39
%56 = OpFAdd %5 %52 %41
%57 = OpCompositeConstruct %28 %25 %26
%58 = OpCompositeConstruct %11 %53 %54 %55 %56
OpImageWrite %16 %57 %58
OpBranch %74
%72 = OpLabel
%60 = OpCompositeConstruct %28 %25 %26
%59 = OpImageRead %11 %15 %60 None
%61 = OpCompositeExtract %5 %59 0
%62 = OpCompositeExtract %5 %59 1
%63 = OpCompositeExtract %5 %59 2
%64 = OpCompositeExtract %5 %59 3
%65 = OpFAdd %5 %61 %35
%66 = OpFAdd %5 %62 %37
%67 = OpFAdd %5 %63 %39
%68 = OpFAdd %5 %64 %41
%69 = OpCompositeConstruct %28 %25 %26
%70 = OpCompositeConstruct %11 %65 %66 %67 %68
OpImageWrite %15 %69 %70
OpBranch %74
%74 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
