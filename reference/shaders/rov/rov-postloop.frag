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

layout(set = 0, binding = 0, r32f) uniform image2D _8;
layout(set = 0, binding = 2, r32f) uniform image2D _9;

void main()
{
    uint _23 = uint(gl_FragCoord.x);
    uint _24 = uint(gl_FragCoord.y);
    uint _61 = 0u;
    uint _26;
    bool _45;
    for (;;)
    {
        vec4 _27 = imageLoad(_9, ivec2(uvec2(_23, _24)));
        imageStore(_9, ivec2(uvec2(_23, _24)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
        _26 = _61 + 1u;
        _45 = _26 == 4u;
        if (_45)
        {
            break;
        }
        else
        {
            _61 = _26;
            continue;
        }
    }
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _47 = imageLoad(_8, ivec2(uvec2(_23, _24)));
    imageStore(_8, ivec2(uvec2(_23, _24)), vec4(_47.x + 1.0, _47.y + 2.0, _47.z + 3.0, _47.w + 4.0));
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 69
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 2
OpDecorate %12 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeVector %5 4
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%15 = OpTypePointer Input %5
%17 = OpTypeInt 32 0
%18 = OpConstant %17 0
%21 = OpConstant %17 1
%28 = OpTypeVector %17 2
%35 = OpConstant %5 1
%37 = OpConstant %5 2
%39 = OpConstant %5 3
%41 = OpConstant %5 4
%44 = OpTypeBool
%46 = OpConstant %17 4
%49 = OpConstant %17 5
%60 = OpTypePointer Function %17
%3 = OpFunction %1 None %2
%4 = OpLabel
%61 = OpVariable %60 Function
OpBranch %62
%62 = OpLabel
%13 = OpLoad %6 %9
%14 = OpLoad %6 %8
%16 = OpAccessChain %15 %12 %18
%19 = OpLoad %5 %16
%20 = OpAccessChain %15 %12 %21
%22 = OpLoad %5 %20
%23 = OpConvertFToU %17 %19
%24 = OpConvertFToU %17 %22
OpStore %61 %18
OpBranch %63
%63 = OpLabel
%25 = OpLoad %17 %61
%29 = OpCompositeConstruct %28 %23 %24
%27 = OpImageRead %10 %13 %29 NonPrivateTexel
%30 = OpCompositeExtract %5 %27 0
%31 = OpCompositeExtract %5 %27 1
%32 = OpCompositeExtract %5 %27 2
%33 = OpCompositeExtract %5 %27 3
%34 = OpFAdd %5 %30 %35
%36 = OpFAdd %5 %31 %37
%38 = OpFAdd %5 %32 %39
%40 = OpFAdd %5 %33 %41
%42 = OpCompositeConstruct %28 %23 %24
%43 = OpCompositeConstruct %10 %34 %36 %38 %40
OpImageWrite %13 %42 %43 NonPrivateTexel
%26 = OpIAdd %17 %25 %21
%45 = OpIEqual %44 %26 %46
OpLoopMerge %66 %65 None
OpBranch %64
%64 = OpLabel
OpSelectionMerge %68 None
OpBranchConditional %45 %66 %65
%68 = OpLabel
OpUnreachable
%65 = OpLabel
OpStore %61 %26
OpBranch %63
%66 = OpLabel
OpBranch %67
%67 = OpLabel
%48 = OpCompositeConstruct %28 %23 %24
OpBeginInvocationInterlockEXT
%47 = OpImageRead %10 %14 %48 MakeTexelVisible|NonPrivateTexel %49
%50 = OpCompositeExtract %5 %47 0
%51 = OpCompositeExtract %5 %47 1
%52 = OpCompositeExtract %5 %47 2
%53 = OpCompositeExtract %5 %47 3
%54 = OpFAdd %5 %50 %35
%55 = OpFAdd %5 %51 %37
%56 = OpFAdd %5 %52 %39
%57 = OpFAdd %5 %53 %41
%58 = OpCompositeConstruct %28 %23 %24
%59 = OpCompositeConstruct %10 %54 %55 %56 %57
OpImageWrite %14 %58 %59 MakeTexelAvailable|NonPrivateTexel %49
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
