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

uint _37;

layout(set = 0, binding = 0, r32ui) uniform coherent uimageBuffer _8;

void main()
{
    SPIRV_Cross_beginInvocationInterlock();
    uint _36;
    uint _38;
    if (gl_FragCoord.x > 1000.0)
    {
        uvec4 _24 = imageLoad(_8, int(0u));
        uint _27 = 0u + 1u;
        uvec4 _26 = imageLoad(_8, int(_27));
        uvec2 _31 = uvec2(_24.x, _26.x);
        imageStore(_8, int(0u), uvec4(50u));
        _36 = _31.x;
        _38 = _31.y;
    }
    else
    {
        _36 = _37;
        _38 = _37;
    }
    if (gl_FragCoord.x > 1100.0)
    {
        uint _41 = (_38 * 1000u) + _36;
        uint _44 = _41 * 4u;
        uvec4 _45 = imageLoad(_8, int(_44));
        uvec4 _47 = imageLoad(_8, int(_44 + 1u));
        uvec4 _50 = imageLoad(_8, int(_44 + 2u));
        uvec4 _54 = imageLoad(_8, int(_44 + 3u));
        uvec4 _58 = uvec4(_45.x, _47.x, _50.x, _54.x);
        uint _67 = _41 * 4u;
        imageStore(_8, int(_67), uvec4(_58.x + 1u));
        imageStore(_8, int(_67 + 1u), uvec4(_58.y + 2u));
        imageStore(_8, int(_67 + 2u), uvec4(_58.z + 3u));
        imageStore(_8, int(_67 + 3u), uvec4(_58.w + 4u));
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
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
OpDecorate %12 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%14 = OpTypePointer Input %9
%16 = OpConstant %5 0
%18 = OpTypeBool
%20 = OpConstant %9 1000
%22 = OpConstant %9 1100
%23 = OpTypeVector %5 4
%28 = OpConstant %5 1
%30 = OpTypeVector %5 2
%34 = OpConstant %5 50
%40 = OpConstant %5 1000
%43 = OpConstant %5 4
%52 = OpConstant %5 2
%56 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
%37 = OpUndef %5
OpBranch %75
%75 = OpLabel
%13 = OpLoad %6 %8
%15 = OpAccessChain %14 %12 %16
%17 = OpLoad %9 %15
%19 = OpFOrdGreaterThan %18 %17 %20
%21 = OpFOrdGreaterThan %18 %17 %22
OpBeginInvocationInterlockEXT
OpSelectionMerge %77 None
OpBranchConditional %19 %76 %77
%76 = OpLabel
%24 = OpImageRead %23 %13 %16
%25 = OpCompositeExtract %5 %24 0
%27 = OpIAdd %5 %16 %28
%26 = OpImageRead %23 %13 %27
%29 = OpCompositeExtract %5 %26 0
%31 = OpCompositeConstruct %30 %25 %29
%32 = OpCompositeExtract %5 %31 0
%33 = OpCompositeExtract %5 %31 1
%35 = OpCompositeConstruct %23 %34 %34 %34 %34
OpImageWrite %13 %16 %35
OpBranch %77
%77 = OpLabel
%36 = OpPhi %5 %37 %75 %32 %76
%38 = OpPhi %5 %37 %75 %33 %76
OpSelectionMerge %79 None
OpBranchConditional %21 %78 %79
%78 = OpLabel
%39 = OpIMul %5 %38 %40
%41 = OpIAdd %5 %39 %36
%42 = OpShiftLeftLogical %5 %41 %43
%44 = OpIMul %5 %41 %43
%45 = OpImageRead %23 %13 %44
%46 = OpCompositeExtract %5 %45 0
%48 = OpIAdd %5 %44 %28
%47 = OpImageRead %23 %13 %48
%49 = OpCompositeExtract %5 %47 0
%51 = OpIAdd %5 %44 %52
%50 = OpImageRead %23 %13 %51
%53 = OpCompositeExtract %5 %50 0
%55 = OpIAdd %5 %44 %56
%54 = OpImageRead %23 %13 %55
%57 = OpCompositeExtract %5 %54 0
%58 = OpCompositeConstruct %23 %46 %49 %53 %57
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%61 = OpCompositeExtract %5 %58 2
%62 = OpCompositeExtract %5 %58 3
%63 = OpIAdd %5 %59 %28
%64 = OpIAdd %5 %60 %52
%65 = OpIAdd %5 %61 %56
%66 = OpIAdd %5 %62 %43
%67 = OpIMul %5 %41 %43
%68 = OpCompositeConstruct %23 %63 %63 %63 %63
OpImageWrite %13 %67 %68
%69 = OpCompositeConstruct %23 %64 %64 %64 %64
%70 = OpIAdd %5 %67 %28
OpImageWrite %13 %70 %69
%71 = OpCompositeConstruct %23 %65 %65 %65 %65
%72 = OpIAdd %5 %67 %52
OpImageWrite %13 %72 %71
%73 = OpCompositeConstruct %23 %66 %66 %66 %66
%74 = OpIAdd %5 %67 %56
OpImageWrite %13 %74 %73
OpBranch %79
%79 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
