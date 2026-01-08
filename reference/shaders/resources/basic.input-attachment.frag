#version 460

layout(input_attachment_index = 0, set = 1000, binding = 0) uniform subpassInput _8;
layout(input_attachment_index = 1, set = 1000, binding = 1) uniform isubpassInput _12;
layout(input_attachment_index = 2, set = 1000, binding = 2) uniform usubpassInput _16;
layout(set = 1001, binding = 3) uniform subpassInput _17;
layout(set = 1001, binding = 4) uniform usubpassInput _18;
layout(input_attachment_index = 5, set = 1000, binding = 5) uniform subpassInputMS _21;
layout(set = 1001, binding = 6) uniform subpassInputMS _22;

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _47 = subpassLoad(_8);
    uvec4 _57 = uvec4(subpassLoad(_12));
    uvec4 _66 = subpassLoad(_16);
    vec4 _80 = subpassLoad(_21, uint(gl_SampleID));
    float _88 = subpassLoad(_22, uint(gl_SampleID)).x + (float(subpassLoad(_18).x) + subpassLoad(_17).x);
    SV_Target.x = (((_88 + _47.x) + float(int(_57.x))) + float(_66.x)) + _80.x;
    SV_Target.y = (((_88 + _47.y) + float(int(_57.y))) + float(_66.y)) + _80.y;
    SV_Target.z = (((_88 + _47.z) + float(int(_57.z))) + float(_66.z)) + _80.z;
    SV_Target.w = (((_88 + _47.w) + float(int(_57.w))) + float(_66.w)) + _80.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 114
; Schema: 0
OpCapability Shader
OpCapability StorageImageMultisample
OpCapability SampleRateShading
OpCapability InputAttachment
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %25 %27 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %25 "SV_Position"
OpName %27 "SV_SampleIndex"
OpName %29 "SV_Target"
OpDecorate %8 DescriptorSet 1000
OpDecorate %8 Binding 0
OpDecorate %8 InputAttachmentIndex 0
OpDecorate %12 DescriptorSet 1000
OpDecorate %12 Binding 1
OpDecorate %12 InputAttachmentIndex 1
OpDecorate %16 DescriptorSet 1000
OpDecorate %16 Binding 2
OpDecorate %16 InputAttachmentIndex 2
OpDecorate %17 DescriptorSet 1001
OpDecorate %17 Binding 3
OpDecorate %18 DescriptorSet 1001
OpDecorate %18 Binding 4
OpDecorate %21 DescriptorSet 1000
OpDecorate %21 Binding 5
OpDecorate %21 InputAttachmentIndex 5
OpDecorate %22 DescriptorSet 1001
OpDecorate %22 Binding 6
OpDecorate %25 BuiltIn FragCoord
OpDecorate %27 BuiltIn SampleId
OpDecorate %27 Flat
OpDecorate %29 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 SubpassData 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 1
%10 = OpTypeImage %9 SubpassData 0 0 0 2 Unknown
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeInt 32 0
%14 = OpTypeImage %13 SubpassData 0 0 0 2 Unknown
%15 = OpTypePointer UniformConstant %14
%16 = OpVariable %15 UniformConstant
%17 = OpVariable %7 UniformConstant
%18 = OpVariable %15 UniformConstant
%19 = OpTypeImage %5 SubpassData 0 0 1 2 Unknown
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpVariable %20 UniformConstant
%23 = OpTypeVector %5 4
%24 = OpTypePointer Input %23
%25 = OpVariable %24 Input
%26 = OpTypePointer Input %13
%27 = OpVariable %26 Input
%28 = OpTypePointer Output %23
%29 = OpVariable %28 Output
%37 = OpTypePointer Input %5
%39 = OpConstant %13 0
%42 = OpConstant %13 1
%48 = OpTypeVector %13 2
%49 = OpConstantComposite %48 %39 %39
%54 = OpTypeVector %9 4
%56 = OpTypeVector %13 4
%105 = OpTypePointer Output %5
%109 = OpConstant %13 2
%111 = OpConstant %13 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %112
%112 = OpLabel
%30 = OpLoad %19 %22
%31 = OpLoad %19 %21
%32 = OpLoad %14 %18
%33 = OpLoad %6 %17
%34 = OpLoad %14 %16
%35 = OpLoad %10 %12
%36 = OpLoad %6 %8
%38 = OpAccessChain %37 %25 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %37 %25 %42
%43 = OpLoad %5 %41
%44 = OpLoad %13 %27
%45 = OpConvertFToS %13 %40
%46 = OpConvertFToS %13 %43
%47 = OpImageRead %23 %36 %49 None
%50 = OpCompositeExtract %5 %47 0
%51 = OpCompositeExtract %5 %47 1
%52 = OpCompositeExtract %5 %47 2
%53 = OpCompositeExtract %5 %47 3
%55 = OpImageRead %54 %35 %49 None
%57 = OpBitcast %56 %55
%58 = OpCompositeExtract %13 %57 0
%59 = OpCompositeExtract %13 %57 1
%60 = OpCompositeExtract %13 %57 2
%61 = OpCompositeExtract %13 %57 3
%62 = OpConvertSToF %5 %58
%63 = OpConvertSToF %5 %59
%64 = OpConvertSToF %5 %60
%65 = OpConvertSToF %5 %61
%66 = OpImageRead %56 %34 %49 None
%67 = OpCompositeExtract %13 %66 0
%68 = OpCompositeExtract %13 %66 1
%69 = OpCompositeExtract %13 %66 2
%70 = OpCompositeExtract %13 %66 3
%71 = OpConvertUToF %5 %67
%72 = OpConvertUToF %5 %68
%73 = OpConvertUToF %5 %69
%74 = OpConvertUToF %5 %70
%75 = OpImageRead %23 %33 %49 None
%76 = OpCompositeExtract %5 %75 0
%77 = OpImageRead %56 %32 %49 None
%78 = OpCompositeExtract %13 %77 0
%79 = OpConvertUToF %5 %78
%80 = OpImageRead %23 %31 %49 Sample %44
%81 = OpCompositeExtract %5 %80 0
%82 = OpCompositeExtract %5 %80 1
%83 = OpCompositeExtract %5 %80 2
%84 = OpCompositeExtract %5 %80 3
%85 = OpImageRead %23 %30 %49 Sample %44
%86 = OpCompositeExtract %5 %85 0
%87 = OpFAdd %5 %79 %76
%88 = OpFAdd %5 %86 %87
%89 = OpFAdd %5 %88 %50
%90 = OpFAdd %5 %89 %62
%91 = OpFAdd %5 %90 %71
%92 = OpFAdd %5 %91 %81
%93 = OpFAdd %5 %88 %51
%94 = OpFAdd %5 %93 %63
%95 = OpFAdd %5 %94 %72
%96 = OpFAdd %5 %95 %82
%97 = OpFAdd %5 %88 %52
%98 = OpFAdd %5 %97 %64
%99 = OpFAdd %5 %98 %73
%100 = OpFAdd %5 %99 %83
%101 = OpFAdd %5 %88 %53
%102 = OpFAdd %5 %101 %65
%103 = OpFAdd %5 %102 %74
%104 = OpFAdd %5 %103 %84
%106 = OpAccessChain %105 %29 %39
OpStore %106 %92
%107 = OpAccessChain %105 %29 %42
OpStore %107 %96
%108 = OpAccessChain %105 %29 %109
OpStore %108 %100
%110 = OpAccessChain %105 %29 %111
OpStore %110 %104
OpReturn
OpFunctionEnd
#endif
