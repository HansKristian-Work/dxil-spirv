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
    uint _26 = uint(gl_FragCoord.x);
    uint _27 = uint(gl_FragCoord.y);
    vec4 _28 = imageLoad(_9, ivec2(uvec2(_26, _27)));
    imageStore(_9, ivec2(uvec2(_26, _27)), vec4(_28.x + 1.0, _28.y + 2.0, _28.z + 3.0, _28.w + 4.0));
    uint _45 = uint(gl_FragCoord.z);
    SPIRV_Cross_beginInvocationInterlock();
    if (!(_45 == 0u))
    {
        uint _65 = 0u;
        uint _49;
        bool _63;
        for (;;)
        {
            vec4 _50 = imageLoad(_8, ivec2(uvec2(_26, _27)));
            imageStore(_8, ivec2(uvec2(_26, _27)), vec4(_50.x + 1.0, _50.y + 2.0, _50.z + 3.0, _50.w + 4.0));
            _49 = _65 + 1u;
            _63 = _49 < _45;
            if (_63)
            {
                _65 = _49;
                continue;
            }
            else
            {
                break;
            }
        }
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 75
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
%24 = OpConstant %17 2
%29 = OpTypeVector %17 2
%36 = OpConstant %5 1
%38 = OpConstant %5 2
%40 = OpConstant %5 3
%42 = OpConstant %5 4
%46 = OpTypeBool
%52 = OpConstant %17 5
%64 = OpTypePointer Function %17
%3 = OpFunction %1 None %2
%4 = OpLabel
%65 = OpVariable %64 Function
OpBranch %66
%66 = OpLabel
%13 = OpLoad %6 %9
%14 = OpLoad %6 %8
%16 = OpAccessChain %15 %12 %18
%19 = OpLoad %5 %16
%20 = OpAccessChain %15 %12 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %15 %12 %24
%25 = OpLoad %5 %23
%26 = OpConvertFToU %17 %19
%27 = OpConvertFToU %17 %22
%30 = OpCompositeConstruct %29 %26 %27
%28 = OpImageRead %10 %13 %30 NonPrivateTexel
%31 = OpCompositeExtract %5 %28 0
%32 = OpCompositeExtract %5 %28 1
%33 = OpCompositeExtract %5 %28 2
%34 = OpCompositeExtract %5 %28 3
%35 = OpFAdd %5 %31 %36
%37 = OpFAdd %5 %32 %38
%39 = OpFAdd %5 %33 %40
%41 = OpFAdd %5 %34 %42
%43 = OpCompositeConstruct %29 %26 %27
%44 = OpCompositeConstruct %10 %35 %37 %39 %41
OpImageWrite %13 %43 %44 NonPrivateTexel
%45 = OpConvertFToU %17 %25
%47 = OpIEqual %46 %45 %18
OpBeginInvocationInterlockEXT
OpSelectionMerge %72 None
OpBranchConditional %47 %72 %67
%67 = OpLabel
OpStore %65 %18
OpBranch %68
%68 = OpLabel
%48 = OpLoad %17 %65
%51 = OpCompositeConstruct %29 %26 %27
%50 = OpImageRead %10 %14 %51 MakeTexelVisible|NonPrivateTexel %52
%53 = OpCompositeExtract %5 %50 0
%54 = OpCompositeExtract %5 %50 1
%55 = OpCompositeExtract %5 %50 2
%56 = OpCompositeExtract %5 %50 3
%57 = OpFAdd %5 %53 %36
%58 = OpFAdd %5 %54 %38
%59 = OpFAdd %5 %55 %40
%60 = OpFAdd %5 %56 %42
%61 = OpCompositeConstruct %29 %26 %27
%62 = OpCompositeConstruct %10 %57 %58 %59 %60
OpImageWrite %14 %61 %62 MakeTexelAvailable|NonPrivateTexel %52
%49 = OpIAdd %17 %48 %21
%63 = OpULessThan %46 %49 %45
OpLoopMerge %71 %70 None
OpBranch %69
%69 = OpLabel
OpSelectionMerge %74 None
OpBranchConditional %63 %70 %71
%74 = OpLabel
OpUnreachable
%70 = OpLabel
OpStore %65 %49
OpBranch %68
%71 = OpLabel
OpBranch %72
%72 = OpLabel
OpBranch %73
%73 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
