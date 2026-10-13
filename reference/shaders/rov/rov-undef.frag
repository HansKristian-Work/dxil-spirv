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
    uint _87;
    uint _88;
    if (gl_FragCoord.x > 1000.0)
    {
        uvec4 _24 = imageLoad(_8, int(0u));
        uint _27 = 0u + 1u;
        uvec4 _26 = imageLoad(_8, int(_27));
        uvec2 _31 = uvec2(_24.x, _26.x);
        imageStore(_8, int(0u), uvec4(50u));
        _87 = _31.x;
        _88 = _31.y;
    }
    else
    {
        _87 = _37;
        _88 = _37;
    }
    if (gl_FragCoord.x > 1100.0)
    {
        uint _41 = (_88 * 1000u) + _87;
        uint _54 = ByteAddressMask(_41 * 4u, 4u);
        uvec4 _55 = imageLoad(_8, int(_54));
        uvec4 _57 = imageLoad(_8, int(_54 + 1u));
        uvec4 _60 = imageLoad(_8, int(_54 + 2u));
        uvec4 _64 = imageLoad(_8, int(_54 + 3u));
        uvec4 _68 = uvec4(_55.x, _57.x, _60.x, _64.x);
        uint _78 = ByteAddressMask(_41 * 4u, 4u);
        imageStore(_8, int(_78), uvec4(_68.x + 1u));
        imageStore(_8, int(_78 + 1u), uvec4(_68.y + 2u));
        imageStore(_8, int(_78 + 2u), uvec4(_68.z + 3u));
        imageStore(_8, int(_78 + 3u), uvec4(_68.w + 4u));
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 100
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
%62 = OpConstant %5 2
%66 = OpConstant %5 3
%86 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%87 = OpVariable %86 Function
%88 = OpVariable %86 Function
%37 = OpUndef %5
OpBranch %89
%89 = OpLabel
%13 = OpLoad %6 %8
%15 = OpAccessChain %14 %12 %16
%17 = OpLoad %9 %15
%19 = OpFOrdGreaterThan %18 %17 %20
%21 = OpFOrdGreaterThan %18 %17 %22
OpBeginInvocationInterlockEXT
OpSelectionMerge %92 None
OpBranchConditional %19 %91 %90
%91 = OpLabel
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
OpStore %87 %32
OpStore %88 %33
OpBranch %92
%90 = OpLabel
OpStore %87 %37
OpStore %88 %37
OpBranch %92
%92 = OpLabel
OpBranch %93
%93 = OpLabel
OpBranch %94
%94 = OpLabel
%38 = OpLoad %5 %88
%36 = OpLoad %5 %87
OpSelectionMerge %96 None
OpBranchConditional %21 %95 %96
%95 = OpLabel
%39 = OpIMul %5 %38 %40
%41 = OpIAdd %5 %39 %36
%42 = OpShiftLeftLogical %5 %41 %43
%44 = OpIMul %5 %41 %43
%54 = OpFunctionCall %5 %48 %44 %43
%55 = OpImageRead %23 %13 %54
%56 = OpCompositeExtract %5 %55 0
%58 = OpIAdd %5 %54 %28
%57 = OpImageRead %23 %13 %58
%59 = OpCompositeExtract %5 %57 0
%61 = OpIAdd %5 %54 %62
%60 = OpImageRead %23 %13 %61
%63 = OpCompositeExtract %5 %60 0
%65 = OpIAdd %5 %54 %66
%64 = OpImageRead %23 %13 %65
%67 = OpCompositeExtract %5 %64 0
%68 = OpCompositeConstruct %23 %56 %59 %63 %67
%69 = OpCompositeExtract %5 %68 0
%70 = OpCompositeExtract %5 %68 1
%71 = OpCompositeExtract %5 %68 2
%72 = OpCompositeExtract %5 %68 3
%73 = OpIAdd %5 %69 %28
%74 = OpIAdd %5 %70 %62
%75 = OpIAdd %5 %71 %66
%76 = OpIAdd %5 %72 %43
%77 = OpIMul %5 %41 %43
%78 = OpFunctionCall %5 %48 %77 %43
%79 = OpCompositeConstruct %23 %73 %73 %73 %73
OpImageWrite %13 %78 %79
%80 = OpCompositeConstruct %23 %74 %74 %74 %74
%81 = OpIAdd %5 %78 %28
OpImageWrite %13 %81 %80
%82 = OpCompositeConstruct %23 %75 %75 %75 %75
%83 = OpIAdd %5 %78 %62
OpImageWrite %13 %83 %82
%84 = OpCompositeConstruct %23 %76 %76 %76 %76
%85 = OpIAdd %5 %78 %66
OpImageWrite %13 %85 %84
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
OpBranch %98
%98 = OpLabel
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
