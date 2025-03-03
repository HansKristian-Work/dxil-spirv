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

layout(location = 0) out float SV_Target;

void main()
{
    uint _29 = uint(gl_FragCoord.x);
    uint _30 = uint(gl_FragCoord.y);
    float _28[8];
    _28[0u] = 0.0;
    _28[1u] = 1.0;
    _28[2u] = 2.0;
    _28[3u] = 3.0;
    _28[4u] = 4.0;
    _28[5u] = 5.0;
    _28[6u] = 6.0;
    _28[7u] = 7.0;
    vec4 _54 = imageLoad(_9, ivec2(uvec2(_29, _30)));
    imageStore(_9, ivec2(uvec2(_29, _30)), vec4(_54.x + 1.0, _54.y + 2.0, _54.z + 3.0, _54.w + 4.0));
    SPIRV_Cross_beginInvocationInterlock();
    uint _67;
    _67 = 0u;
    float _83;
    bool _86;
    for (;;)
    {
        vec4 _69 = imageLoad(_8, ivec2(uvec2(_29, _30)));
        imageStore(_8, ivec2(uvec2(_29, _30)), vec4(_69.x + 1.0, _69.y + 2.0, _69.z + 3.0, _69.w + 4.0));
        _83 = imageLoad(_8, ivec2(uvec2(_29, _30))).y;
        _86 = _67 < 8u;
        if (_86)
        {
            _28[_67] = _83;
        }
        uint _68 = _67 + 1u;
        if (_68 == 4u)
        {
            break;
        }
        else
        {
            _67 = _68;
            continue;
        }
    }
    SPIRV_Cross_endInvocationInterlock();
    uint _92 = uint((1.0 / gl_FragCoord.w) * 7.0);
    float _95;
    if (_92 < 8u)
    {
        _95 = _28[_92];
    }
    else
    {
        _95 = 0.0;
    }
    SV_Target = _95;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %12 "SV_Position"
OpName %14 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 Coherent
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 2
OpDecorate %12 BuiltIn FragCoord
OpDecorate %14 Location 0
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
%13 = OpTypePointer Output %5
%14 = OpVariable %13 Output
%17 = OpTypePointer Input %5
%19 = OpTypeInt 32 0
%20 = OpConstant %19 0
%23 = OpConstant %19 1
%25 = OpConstant %19 8
%26 = OpTypeArray %5 %25
%27 = OpTypePointer Function %26
%31 = OpTypePointer Function %5
%33 = OpConstant %5 0
%35 = OpConstant %5 1
%37 = OpConstant %19 2
%38 = OpConstant %5 2
%40 = OpConstant %19 3
%41 = OpConstant %5 3
%43 = OpConstant %19 4
%44 = OpConstant %5 4
%46 = OpConstant %19 5
%47 = OpConstant %5 5
%49 = OpConstant %19 6
%50 = OpConstant %5 6
%52 = OpConstant %19 7
%53 = OpConstant %5 7
%55 = OpTypeVector %19 2
%85 = OpTypeBool
%105 = OpConstantNull %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%28 = OpVariable %27 Function
OpBranch %96
%96 = OpLabel
%15 = OpLoad %6 %9
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %12 %20
%21 = OpLoad %5 %18
%22 = OpAccessChain %17 %12 %23
%24 = OpLoad %5 %22
%29 = OpConvertFToU %19 %21
%30 = OpConvertFToU %19 %24
%32 = OpInBoundsAccessChain %31 %28 %20
OpStore %32 %33
%34 = OpInBoundsAccessChain %31 %28 %23
OpStore %34 %35
%36 = OpInBoundsAccessChain %31 %28 %37
OpStore %36 %38
%39 = OpInBoundsAccessChain %31 %28 %40
OpStore %39 %41
%42 = OpInBoundsAccessChain %31 %28 %43
OpStore %42 %44
%45 = OpInBoundsAccessChain %31 %28 %46
OpStore %45 %47
%48 = OpInBoundsAccessChain %31 %28 %49
OpStore %48 %50
%51 = OpInBoundsAccessChain %31 %28 %52
OpStore %51 %53
%56 = OpCompositeConstruct %55 %29 %30
%54 = OpImageRead %10 %15 %56 None
%57 = OpCompositeExtract %5 %54 0
%58 = OpCompositeExtract %5 %54 1
%59 = OpCompositeExtract %5 %54 2
%60 = OpCompositeExtract %5 %54 3
%61 = OpFAdd %5 %57 %35
%62 = OpFAdd %5 %58 %38
%63 = OpFAdd %5 %59 %41
%64 = OpFAdd %5 %60 %44
%65 = OpCompositeConstruct %55 %29 %30
%66 = OpCompositeConstruct %10 %61 %62 %63 %64
OpImageWrite %15 %65 %66
OpBeginInvocationInterlockEXT
OpBranch %97
%97 = OpLabel
%67 = OpPhi %19 %20 %96 %68 %101
%70 = OpCompositeConstruct %55 %29 %30
%69 = OpImageRead %10 %16 %70 None
%71 = OpCompositeExtract %5 %69 0
%72 = OpCompositeExtract %5 %69 1
%73 = OpCompositeExtract %5 %69 2
%74 = OpCompositeExtract %5 %69 3
%75 = OpFAdd %5 %71 %35
%76 = OpFAdd %5 %72 %38
%77 = OpFAdd %5 %73 %41
%78 = OpFAdd %5 %74 %44
%79 = OpCompositeConstruct %55 %29 %30
%80 = OpCompositeConstruct %10 %75 %76 %77 %78
OpImageWrite %16 %79 %80
%82 = OpCompositeConstruct %55 %29 %30
%81 = OpImageRead %10 %16 %82 None
%83 = OpCompositeExtract %5 %81 1
%86 = OpULessThan %85 %67 %25
%84 = OpInBoundsAccessChain %31 %28 %67
OpLoopMerge %98 %99 None
OpBranch %99
%99 = OpLabel
OpSelectionMerge %101 None
OpBranchConditional %86 %100 %101
%100 = OpLabel
OpStore %84 %83
OpBranch %101
%101 = OpLabel
%68 = OpIAdd %19 %67 %23
%87 = OpIEqual %85 %68 %43
OpBranchConditional %87 %98 %97
%98 = OpLabel
OpEndInvocationInterlockEXT
%88 = OpAccessChain %17 %12 %40
%89 = OpLoad %5 %88
%90 = OpFDiv %5 %35 %89
%91 = OpFMul %5 %90 %53
%92 = OpConvertFToU %19 %91
%94 = OpULessThan %85 %92 %25
%93 = OpInBoundsAccessChain %31 %28 %92
OpSelectionMerge %103 None
OpBranchConditional %94 %102 %103
%102 = OpLabel
%104 = OpLoad %5 %93
OpBranch %103
%103 = OpLabel
%95 = OpPhi %5 %104 %102 %105 %98
OpStore %14 %95
OpReturn
OpFunctionEnd
#endif
