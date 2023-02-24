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
layout(set = 0, binding = 2, r32f) uniform image2D _9;

void main()
{
    uint _23 = uint(gl_FragCoord.x);
    uint _24 = uint(gl_FragCoord.y);
    uint _25;
    _25 = 0u;
    for (;;)
    {
        vec4 _27 = imageLoad(_9, ivec2(uvec2(_23, _24)));
        imageStore(_9, ivec2(uvec2(_23, _24)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
        uint _26 = _25 + 1u;
        if (_26 == 4u)
        {
            break;
        }
        else
        {
            _25 = _26;
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
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 Coherent
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
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%13 = OpLoad %6 %9
%14 = OpLoad %6 %8
%16 = OpAccessChain %15 %12 %18
%19 = OpLoad %5 %16
%20 = OpAccessChain %15 %12 %21
%22 = OpLoad %5 %20
%23 = OpConvertFToU %17 %19
%24 = OpConvertFToU %17 %22
OpBranch %60
%60 = OpLabel
%25 = OpPhi %17 %18 %59 %26 %60
%29 = OpCompositeConstruct %28 %23 %24
%27 = OpImageRead %10 %13 %29 None
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
OpImageWrite %13 %42 %43
%26 = OpIAdd %17 %25 %21
%45 = OpIEqual %44 %26 %46
OpLoopMerge %61 %60 None
OpBranchConditional %45 %61 %60
%61 = OpLabel
%48 = OpCompositeConstruct %28 %23 %24
OpBeginInvocationInterlockEXT
%47 = OpImageRead %10 %14 %48 None
%49 = OpCompositeExtract %5 %47 0
%50 = OpCompositeExtract %5 %47 1
%51 = OpCompositeExtract %5 %47 2
%52 = OpCompositeExtract %5 %47 3
%53 = OpFAdd %5 %49 %35
%54 = OpFAdd %5 %50 %37
%55 = OpFAdd %5 %51 %39
%56 = OpFAdd %5 %52 %41
%57 = OpCompositeConstruct %28 %23 %24
%58 = OpCompositeConstruct %10 %53 %54 %55 %56
OpImageWrite %14 %57 %58
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
