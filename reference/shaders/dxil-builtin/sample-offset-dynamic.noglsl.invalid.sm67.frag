; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 144
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
%84 = OpTypeSampledImage %12
%90 = OpTypeVector %55 2
%102 = OpTypeSampledImage %15
%107 = OpTypeVector %5 3
%120 = OpTypeSampledImage %18
%127 = OpTypeVector %55 3
%139 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %142
%142 = OpLabel
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
%77 = OpAccessChain %45 %27 %38 %38
%78 = OpLoad %23 %77
%79 = OpBitcast %48 %78
%80 = OpCompositeExtract %21 %79 1
%81 = OpCompositeExtract %21 %79 2
%82 = OpLoad %12 %14
%83 = OpLoad %28 %30
%85 = OpSampledImage %84 %82 %83
%86 = OpBitcast %55 %80
%87 = OpBitcast %55 %81
%89 = OpCompositeConstruct %33 %39 %42
%91 = OpCompositeConstruct %90 %86 %87
%92 = OpBitFieldSExtract %90 %91 %60 %61
%88 = OpImageSampleImplicitLod %23 %85 %89 Offset %92
%93 = OpCompositeExtract %5 %88 0
%94 = OpCompositeExtract %5 %88 1
%95 = OpAccessChain %45 %27 %38 %38
%96 = OpLoad %23 %95
%97 = OpBitcast %48 %96
%98 = OpCompositeExtract %21 %97 1
%99 = OpCompositeExtract %21 %97 2
%100 = OpLoad %15 %17
%101 = OpLoad %28 %30
%103 = OpSampledImage %102 %100 %101
%104 = OpBitcast %55 %98
%105 = OpBitcast %55 %99
%108 = OpCompositeConstruct %107 %39 %42 %44
%109 = OpCompositeConstruct %90 %104 %105
%110 = OpBitFieldSExtract %90 %109 %60 %61
%106 = OpImageSampleImplicitLod %23 %103 %108 Offset %110
%111 = OpCompositeExtract %5 %106 0
%112 = OpAccessChain %45 %27 %38 %41
%113 = OpLoad %23 %112
%114 = OpBitcast %48 %113
%115 = OpCompositeExtract %21 %114 0
%116 = OpCompositeExtract %21 %114 1
%117 = OpCompositeExtract %21 %114 2
%118 = OpLoad %18 %20
%119 = OpLoad %28 %30
%121 = OpSampledImage %120 %118 %119
%122 = OpBitcast %55 %115
%123 = OpBitcast %55 %116
%124 = OpBitcast %55 %117
%126 = OpCompositeConstruct %107 %39 %42 %44
%128 = OpCompositeConstruct %127 %122 %123 %124
%129 = OpBitFieldSExtract %127 %128 %60 %61
%125 = OpImageSampleImplicitLod %23 %121 %126 Offset %129
%130 = OpCompositeExtract %5 %125 0
%131 = OpCompositeExtract %5 %125 1
%132 = OpFAdd %5 %111 %76
%133 = OpFAdd %5 %93 %62
%134 = OpFAdd %5 %133 %132
%135 = OpFAdd %5 %134 %130
%136 = OpFAdd %5 %94 %63
%137 = OpFAdd %5 %136 %132
%138 = OpFAdd %5 %137 %131
%140 = OpAccessChain %139 %35 %38
OpStore %140 %135
%141 = OpAccessChain %139 %35 %41
OpStore %141 %138
OpReturn
OpFunctionEnd

