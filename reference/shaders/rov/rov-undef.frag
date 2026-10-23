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

uint ByteAddressMask(uint index, uint stride)
{
    return index & (4294967295u / stride);
}

void main()
{
    SPIRV_Cross_beginInvocationInterlock();
    uint _86;
    uint _87;
    if (gl_FragCoord.x > 1000.0)
    {
        uvec4 _24 = imageLoad(_8, int(0u));
        uint _27 = 0u + 1u;
        uvec4 _26 = imageLoad(_8, int(_27));
        uvec2 _31 = uvec2(_24.x, _26.x);
        imageStore(_8, int(0u), uvec4(50u));
        _86 = _31.x;
        _87 = _31.y;
    }
    else
    {
    }
    if (gl_FragCoord.x > 1100.0)
    {
        uint _41 = (_87 * 1000u) + _86;
        uint _53 = ByteAddressMask(_41 * 4u, 4u);
        uvec4 _54 = imageLoad(_8, int(_53));
        uvec4 _56 = imageLoad(_8, int(_53 + 1u));
        uvec4 _59 = imageLoad(_8, int(_53 + 2u));
        uvec4 _63 = imageLoad(_8, int(_53 + 3u));
        uvec4 _67 = uvec4(_54.x, _56.x, _59.x, _63.x);
        uint _77 = ByteAddressMask(_41 * 4u, 4u);
        imageStore(_8, int(_77), uvec4(_67.x + 1u));
        imageStore(_8, int(_77 + 1u), uvec4(_67.y + 2u));
        imageStore(_8, int(_77 + 2u), uvec4(_67.z + 3u));
        imageStore(_8, int(_77 + 3u), uvec4(_67.w + 4u));
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 98
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpName %48 "ByteAddressMask"
OpName %46 "index"
OpName %47 "stride"
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
%45 = OpTypeFunction %5 %5 %5
%51 = OpConstant %5 4294967295
%61 = OpConstant %5 2
%65 = OpConstant %5 3
%85 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%86 = OpVariable %85 Function
%87 = OpVariable %85 Function
%37 = OpUndef %5
OpBranch %88
%88 = OpLabel
%13 = OpLoad %6 %8
%15 = OpAccessChain %14 %12 %16
%17 = OpLoad %9 %15
%19 = OpFOrdGreaterThan %18 %17 %20
%21 = OpFOrdGreaterThan %18 %17 %22
OpBeginInvocationInterlockEXT
OpSelectionMerge %91 None
OpBranchConditional %19 %90 %89
%89 = OpLabel
OpBranch %91
%90 = OpLabel
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
OpStore %86 %32
OpStore %87 %33
OpBranch %91
%91 = OpLabel
OpBranch %92
%92 = OpLabel
OpBranch %93
%93 = OpLabel
%38 = OpLoad %5 %87
%36 = OpLoad %5 %86
OpSelectionMerge %95 None
OpBranchConditional %21 %94 %95
%94 = OpLabel
%39 = OpIMul %5 %38 %40
%41 = OpIAdd %5 %39 %36
%42 = OpShiftLeftLogical %5 %41 %43
%44 = OpIMul %5 %41 %43
%53 = OpFunctionCall %5 %48 %44 %43
%54 = OpImageRead %23 %13 %53
%55 = OpCompositeExtract %5 %54 0
%57 = OpIAdd %5 %53 %28
%56 = OpImageRead %23 %13 %57
%58 = OpCompositeExtract %5 %56 0
%60 = OpIAdd %5 %53 %61
%59 = OpImageRead %23 %13 %60
%62 = OpCompositeExtract %5 %59 0
%64 = OpIAdd %5 %53 %65
%63 = OpImageRead %23 %13 %64
%66 = OpCompositeExtract %5 %63 0
%67 = OpCompositeConstruct %23 %55 %58 %62 %66
%68 = OpCompositeExtract %5 %67 0
%69 = OpCompositeExtract %5 %67 1
%70 = OpCompositeExtract %5 %67 2
%71 = OpCompositeExtract %5 %67 3
%72 = OpIAdd %5 %68 %28
%73 = OpIAdd %5 %69 %61
%74 = OpIAdd %5 %70 %65
%75 = OpIAdd %5 %71 %43
%76 = OpIMul %5 %41 %43
%77 = OpFunctionCall %5 %48 %76 %43
%78 = OpCompositeConstruct %23 %72 %72 %72 %72
OpImageWrite %13 %77 %78
%79 = OpCompositeConstruct %23 %73 %73 %73 %73
%80 = OpIAdd %5 %77 %28
OpImageWrite %13 %80 %79
%81 = OpCompositeConstruct %23 %74 %74 %74 %74
%82 = OpIAdd %5 %77 %61
OpImageWrite %13 %82 %81
%83 = OpCompositeConstruct %23 %75 %75 %75 %75
%84 = OpIAdd %5 %77 %65
OpImageWrite %13 %84 %83
OpBranch %95
%95 = OpLabel
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
%48 = OpFunction %5 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %5
%49 = OpLabel
%50 = OpUDiv %5 %51 %47
%52 = OpBitwiseAnd %5 %46 %50
OpReturnValue %52
OpFunctionEnd
#endif
