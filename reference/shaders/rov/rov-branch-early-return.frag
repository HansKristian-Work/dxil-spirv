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
layout(set = 0, binding = 1, r32f) uniform image2D _9;
layout(set = 0, binding = 2, r32f) uniform image2D _10;

void main()
{
    uint _25 = uint(gl_FragCoord.x);
    uint _26 = uint(gl_FragCoord.y);
    vec4 _27 = imageLoad(_10, ivec2(uvec2(_25, _26)));
    imageStore(_10, ivec2(uvec2(_25, _26)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
    SPIRV_Cross_beginInvocationInterlock();
    bool _92 = false;
    if (gl_FragCoord.x < 10.0)
    {
        vec4 _60 = imageLoad(_8, ivec2(uvec2(_25, _26)));
        imageStore(_8, ivec2(uvec2(_25, _26)), vec4(_60.x + 1.0, _60.y + 2.0, _60.z + 3.0, _60.w + 4.0));
        if (!(imageLoad(_10, ivec2(uvec2(_25, _26))).z > 100.0))
        {
            _92 = true;
        }
    }
    else
    {
        vec4 _47 = imageLoad(_9, ivec2(uvec2(_25, _26)));
        imageStore(_9, ivec2(uvec2(_25, _26)), vec4(_47.x + 1.0, _47.y + 2.0, _47.z + 3.0, _47.w + 4.0));
        _92 = true;
    }
    if (_92)
    {
        uint _77 = _25 ^ 1u;
        uint _78 = _26 ^ 1u;
        vec4 _79 = imageLoad(_10, ivec2(uvec2(_77, _78)));
        imageStore(_10, ivec2(uvec2(_77, _78)), vec4(_79.x + 1.0, _79.y + 2.0, _79.z + 3.0, _79.w + 4.0));
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %10 %13
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %13 "SV_Position"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
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
%49 = OpConstant %19 5
%76 = OpConstant %5 100
%91 = OpTypePointer Function %44
%93 = OpConstantFalse %44
%95 = OpConstantTrue %44
%3 = OpFunction %1 None %2
%4 = OpLabel
%92 = OpVariable %91 Function
OpBranch %96
%96 = OpLabel
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
%27 = OpImageRead %11 %14 %29 NonPrivateTexel
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
OpImageWrite %14 %42 %43 NonPrivateTexel
%45 = OpFOrdLessThan %44 %21 %46
OpBeginInvocationInterlockEXT
OpStore %92 %93
OpSelectionMerge %101 None
OpBranchConditional %45 %98 %97
%97 = OpLabel
%48 = OpCompositeConstruct %28 %25 %26
%47 = OpImageRead %11 %15 %48 MakeTexelVisible|NonPrivateTexel %49
%50 = OpCompositeExtract %5 %47 0
%51 = OpCompositeExtract %5 %47 1
%52 = OpCompositeExtract %5 %47 2
%53 = OpCompositeExtract %5 %47 3
%54 = OpFAdd %5 %50 %35
%55 = OpFAdd %5 %51 %37
%56 = OpFAdd %5 %52 %39
%57 = OpFAdd %5 %53 %41
%58 = OpCompositeConstruct %28 %25 %26
%59 = OpCompositeConstruct %11 %54 %55 %56 %57
OpImageWrite %15 %58 %59 MakeTexelAvailable|NonPrivateTexel %49
OpStore %92 %95
OpBranch %101
%98 = OpLabel
%61 = OpCompositeConstruct %28 %25 %26
%60 = OpImageRead %11 %16 %61 MakeTexelVisible|NonPrivateTexel %49
%62 = OpCompositeExtract %5 %60 0
%63 = OpCompositeExtract %5 %60 1
%64 = OpCompositeExtract %5 %60 2
%65 = OpCompositeExtract %5 %60 3
%66 = OpFAdd %5 %62 %35
%67 = OpFAdd %5 %63 %37
%68 = OpFAdd %5 %64 %39
%69 = OpFAdd %5 %65 %41
%70 = OpCompositeConstruct %28 %25 %26
%71 = OpCompositeConstruct %11 %66 %67 %68 %69
OpImageWrite %16 %70 %71 MakeTexelAvailable|NonPrivateTexel %49
%73 = OpCompositeConstruct %28 %25 %26
%72 = OpImageRead %11 %14 %73 NonPrivateTexel
%74 = OpCompositeExtract %5 %72 2
%75 = OpFOrdGreaterThan %44 %74 %76
OpSelectionMerge %100 None
OpBranchConditional %75 %100 %99
%99 = OpLabel
OpStore %92 %95
OpBranch %100
%100 = OpLabel
OpBranch %101
%101 = OpLabel
%94 = OpLoad %44 %92
OpSelectionMerge %103 None
OpBranchConditional %94 %102 %103
%102 = OpLabel
%77 = OpBitwiseXor %19 %25 %23
%78 = OpBitwiseXor %19 %26 %23
%80 = OpCompositeConstruct %28 %77 %78
%79 = OpImageRead %11 %14 %80 NonPrivateTexel
%81 = OpCompositeExtract %5 %79 0
%82 = OpCompositeExtract %5 %79 1
%83 = OpCompositeExtract %5 %79 2
%84 = OpCompositeExtract %5 %79 3
%85 = OpFAdd %5 %81 %35
%86 = OpFAdd %5 %82 %37
%87 = OpFAdd %5 %83 %39
%88 = OpFAdd %5 %84 %41
%89 = OpCompositeConstruct %28 %77 %78
%90 = OpCompositeConstruct %11 %85 %86 %87 %88
OpImageWrite %14 %89 %90 NonPrivateTexel
OpBranch %103
%103 = OpLabel
OpBranch %104
%104 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
