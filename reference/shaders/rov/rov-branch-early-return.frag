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
    uint _25;
    uint _26;
    bool _45;
    for (;;)
    {
        _25 = uint(gl_FragCoord.x);
        _26 = uint(gl_FragCoord.y);
        vec4 _27 = imageLoad(_10, ivec2(uvec2(_25, _26)));
        imageStore(_10, ivec2(uvec2(_25, _26)), vec4(_27.x + 1.0, _27.y + 2.0, _27.z + 3.0, _27.w + 4.0));
        _45 = gl_FragCoord.x < 10.0;
        SPIRV_Cross_beginInvocationInterlock();
        if (_45)
        {
            vec4 _47 = imageLoad(_8, ivec2(uvec2(_25, _26)));
            imageStore(_8, ivec2(uvec2(_25, _26)), vec4(_47.x + 1.0, _47.y + 2.0, _47.z + 3.0, _47.w + 4.0));
            if (imageLoad(_10, ivec2(uvec2(_25, _26))).z > 100.0)
            {
                break;
            }
        }
        else
        {
            vec4 _64 = imageLoad(_9, ivec2(uvec2(_25, _26)));
            imageStore(_9, ivec2(uvec2(_25, _26)), vec4(_64.x + 1.0, _64.y + 2.0, _64.z + 3.0, _64.w + 4.0));
        }
        uint _76 = _25 ^ 1u;
        uint _77 = _26 ^ 1u;
        vec4 _78 = imageLoad(_10, ivec2(uvec2(_76, _77)));
        imageStore(_10, ivec2(uvec2(_76, _77)), vec4(_78.x + 1.0, _78.y + 2.0, _78.z + 3.0, _78.w + 4.0));
        break;
    }
    SPIRV_Cross_endInvocationInterlock();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 99
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
%63 = OpConstant %5 100
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
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
OpLoopMerge %96 %97 None
OpBranch %91
%91 = OpLabel
OpSelectionMerge %95 None
OpBranchConditional %45 %93 %92
%93 = OpLabel
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
%60 = OpCompositeConstruct %28 %25 %26
%59 = OpImageRead %11 %14 %60 None
%61 = OpCompositeExtract %5 %59 2
%62 = OpFOrdGreaterThan %44 %61 %63
OpSelectionMerge %94 None
OpBranchConditional %62 %96 %94
%94 = OpLabel
OpBranch %95
%92 = OpLabel
%65 = OpCompositeConstruct %28 %25 %26
%64 = OpImageRead %11 %15 %65 None
%66 = OpCompositeExtract %5 %64 0
%67 = OpCompositeExtract %5 %64 1
%68 = OpCompositeExtract %5 %64 2
%69 = OpCompositeExtract %5 %64 3
%70 = OpFAdd %5 %66 %35
%71 = OpFAdd %5 %67 %37
%72 = OpFAdd %5 %68 %39
%73 = OpFAdd %5 %69 %41
%74 = OpCompositeConstruct %28 %25 %26
%75 = OpCompositeConstruct %11 %70 %71 %72 %73
OpImageWrite %15 %74 %75
OpBranch %95
%95 = OpLabel
%76 = OpBitwiseXor %19 %25 %23
%77 = OpBitwiseXor %19 %26 %23
%79 = OpCompositeConstruct %28 %76 %77
%78 = OpImageRead %11 %14 %79 None
%80 = OpCompositeExtract %5 %78 0
%81 = OpCompositeExtract %5 %78 1
%82 = OpCompositeExtract %5 %78 2
%83 = OpCompositeExtract %5 %78 3
%84 = OpFAdd %5 %80 %35
%85 = OpFAdd %5 %81 %37
%86 = OpFAdd %5 %82 %39
%87 = OpFAdd %5 %83 %41
%88 = OpCompositeConstruct %28 %76 %77
%89 = OpCompositeConstruct %11 %84 %85 %86 %87
OpImageWrite %14 %88 %89
OpBranch %96
%97 = OpLabel
OpBranch %90
%96 = OpLabel
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd
#endif
