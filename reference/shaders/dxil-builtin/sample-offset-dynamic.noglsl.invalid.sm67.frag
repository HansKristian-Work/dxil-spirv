; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 145
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %25 ""
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 4
OpDecorate %24 ArrayStride 16
OpMemberDecorate %25 0 Offset 0
OpDecorate %25 Block
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 0
OpDecorate %32 Location 0
OpDecorate %35 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeInt 32 0
%22 = OpConstant %21 2
%23 = OpTypeVector %5 4
%24 = OpTypeArray %23 %22
%25 = OpTypeStruct %24
%26 = OpTypePointer Uniform %25
%27 = OpVariable %26 Uniform
%28 = OpTypeSampler
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypePointer Input %23
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 2
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%36 = OpTypePointer Input %5
%38 = OpConstant %21 0
%41 = OpConstant %21 1
%45 = OpTypePointer Uniform %23
%48 = OpTypeVector %21 4
%53 = OpTypeSampledImage %6
%55 = OpTypeInt 32 1
%57 = OpConstant %5 0
%60 = OpConstant %55 0
%61 = OpConstant %55 4
%70 = OpTypeSampledImage %9
%86 = OpTypeSampledImage %12
%92 = OpTypeVector %55 2
%106 = OpTypeSampledImage %15
%111 = OpTypeVector %5 3
%126 = OpTypeSampledImage %18
%133 = OpTypeVector %55 3
%140 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %143
%143 = OpLabel
%37 = OpAccessChain %36 %32 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %36 %32 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %36 %32 %22
%44 = OpLoad %5 %43
%46 = OpAccessChain %45 %27 %38 %38
%47 = OpLoad %23 %46
%49 = OpBitcast %48 %47
%50 = OpCompositeExtract %21 %49 0
%51 = OpLoad %6 %8
%52 = OpLoad %28 %30
%54 = OpSampledImage %53 %51 %52
%56 = OpBitcast %55 %50
%59 = OpBitFieldSExtract %55 %56 %60 %61
%58 = OpImageSampleImplicitLod %23 %54 %39 Offset %59
%62 = OpCompositeExtract %5 %58 0
%63 = OpCompositeExtract %5 %58 1
%64 = OpAccessChain %45 %27 %38 %38
%65 = OpLoad %23 %64
%66 = OpBitcast %48 %65
%67 = OpCompositeExtract %21 %66 0
%68 = OpLoad %9 %11
%69 = OpLoad %28 %30
%71 = OpSampledImage %70 %68 %69
%72 = OpBitcast %55 %67
%74 = OpCompositeConstruct %33 %39 %42
%75 = OpBitFieldSExtract %55 %72 %60 %61
%73 = OpImageSampleImplicitLod %23 %71 %74 Offset %75
%76 = OpCompositeExtract %5 %73 0
%77 = OpFAdd %5 %76 %62
%78 = OpFAdd %5 %76 %63
%79 = OpAccessChain %45 %27 %38 %38
%80 = OpLoad %23 %79
%81 = OpBitcast %48 %80
%82 = OpCompositeExtract %21 %81 1
%83 = OpCompositeExtract %21 %81 2
%84 = OpLoad %12 %14
%85 = OpLoad %28 %30
%87 = OpSampledImage %86 %84 %85
%88 = OpBitcast %55 %82
%89 = OpBitcast %55 %83
%91 = OpCompositeConstruct %33 %39 %42
%93 = OpCompositeConstruct %92 %88 %89
%94 = OpBitFieldSExtract %92 %93 %60 %61
%90 = OpImageSampleImplicitLod %23 %87 %91 Offset %94
%95 = OpCompositeExtract %5 %90 0
%96 = OpCompositeExtract %5 %90 1
%97 = OpFAdd %5 %77 %95
%98 = OpFAdd %5 %78 %96
%99 = OpAccessChain %45 %27 %38 %38
%100 = OpLoad %23 %99
%101 = OpBitcast %48 %100
%102 = OpCompositeExtract %21 %101 1
%103 = OpCompositeExtract %21 %101 2
%104 = OpLoad %15 %17
%105 = OpLoad %28 %30
%107 = OpSampledImage %106 %104 %105
%108 = OpBitcast %55 %102
%109 = OpBitcast %55 %103
%112 = OpCompositeConstruct %111 %39 %42 %44
%113 = OpCompositeConstruct %92 %108 %109
%114 = OpBitFieldSExtract %92 %113 %60 %61
%110 = OpImageSampleImplicitLod %23 %107 %112 Offset %114
%115 = OpCompositeExtract %5 %110 0
%116 = OpFAdd %5 %97 %115
%117 = OpFAdd %5 %98 %115
%118 = OpAccessChain %45 %27 %38 %41
%119 = OpLoad %23 %118
%120 = OpBitcast %48 %119
%121 = OpCompositeExtract %21 %120 0
%122 = OpCompositeExtract %21 %120 1
%123 = OpCompositeExtract %21 %120 2
%124 = OpLoad %18 %20
%125 = OpLoad %28 %30
%127 = OpSampledImage %126 %124 %125
%128 = OpBitcast %55 %121
%129 = OpBitcast %55 %122
%130 = OpBitcast %55 %123
%132 = OpCompositeConstruct %111 %39 %42 %44
%134 = OpCompositeConstruct %133 %128 %129 %130
%135 = OpBitFieldSExtract %133 %134 %60 %61
%131 = OpImageSampleImplicitLod %23 %127 %132 Offset %135
%136 = OpCompositeExtract %5 %131 0
%137 = OpCompositeExtract %5 %131 1
%138 = OpFAdd %5 %116 %136
%139 = OpFAdd %5 %117 %137
%141 = OpAccessChain %140 %35 %38
OpStore %141 %138
%142 = OpAccessChain %140 %35 %41
OpStore %142 %139
OpReturn
OpFunctionEnd

