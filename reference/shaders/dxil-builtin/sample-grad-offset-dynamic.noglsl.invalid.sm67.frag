; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 136
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
%46 = OpConstant %21 3
%48 = OpTypePointer Uniform %23
%51 = OpTypeVector %21 4
%56 = OpTypeSampledImage %6
%58 = OpTypeInt 32 1
%62 = OpConstant %58 0
%63 = OpConstant %58 4
%67 = OpTypeSampledImage %9
%77 = OpTypeSampledImage %12
%85 = OpTypeVector %58 2
%91 = OpTypeSampledImage %15
%96 = OpTypeVector %5 3
%110 = OpTypeSampledImage %18
%119 = OpTypeVector %58 3
%131 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %134
%134 = OpLabel
%37 = OpAccessChain %36 %32 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %36 %32 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %36 %32 %22
%44 = OpLoad %5 %43
%45 = OpAccessChain %36 %32 %46
%47 = OpLoad %5 %45
%49 = OpAccessChain %48 %27 %38 %38
%50 = OpLoad %23 %49
%52 = OpBitcast %51 %50
%53 = OpCompositeExtract %21 %52 0
%54 = OpLoad %6 %8
%55 = OpLoad %28 %30
%57 = OpSampledImage %56 %54 %55
%59 = OpBitcast %58 %53
%61 = OpBitFieldSExtract %58 %59 %62 %63
%60 = OpImageSampleExplicitLod %23 %57 %39 Grad|Offset %44 %47 %61
%64 = OpCompositeExtract %5 %60 0
%65 = OpCompositeExtract %5 %60 1
%66 = OpLoad %9 %11
%68 = OpSampledImage %67 %66 %55
%69 = OpBitcast %58 %53
%71 = OpCompositeConstruct %33 %39 %42
%72 = OpBitFieldSExtract %58 %69 %62 %63
%70 = OpImageSampleExplicitLod %23 %68 %71 Grad|Offset %44 %42 %72
%73 = OpCompositeExtract %5 %70 0
%74 = OpCompositeExtract %21 %52 1
%75 = OpCompositeExtract %21 %52 2
%76 = OpLoad %12 %14
%78 = OpSampledImage %77 %76 %55
%79 = OpBitcast %58 %74
%80 = OpBitcast %58 %75
%82 = OpCompositeConstruct %33 %39 %42
%83 = OpCompositeConstruct %33 %44 %44
%84 = OpCompositeConstruct %33 %47 %47
%86 = OpCompositeConstruct %85 %79 %80
%87 = OpBitFieldSExtract %85 %86 %62 %63
%81 = OpImageSampleExplicitLod %23 %78 %82 Grad|Offset %83 %84 %87
%88 = OpCompositeExtract %5 %81 0
%89 = OpCompositeExtract %5 %81 1
%90 = OpLoad %15 %17
%92 = OpSampledImage %91 %90 %55
%93 = OpBitcast %58 %74
%94 = OpBitcast %58 %75
%97 = OpCompositeConstruct %96 %39 %42 %44
%98 = OpCompositeConstruct %33 %44 %44
%99 = OpCompositeConstruct %33 %47 %47
%100 = OpCompositeConstruct %85 %93 %94
%101 = OpBitFieldSExtract %85 %100 %62 %63
%95 = OpImageSampleExplicitLod %23 %92 %97 Grad|Offset %98 %99 %101
%102 = OpCompositeExtract %5 %95 0
%103 = OpAccessChain %48 %27 %38 %41
%104 = OpLoad %23 %103
%105 = OpBitcast %51 %104
%106 = OpCompositeExtract %21 %105 0
%107 = OpCompositeExtract %21 %105 1
%108 = OpCompositeExtract %21 %105 2
%109 = OpLoad %18 %20
%111 = OpSampledImage %110 %109 %55
%112 = OpBitcast %58 %106
%113 = OpBitcast %58 %107
%114 = OpBitcast %58 %108
%116 = OpCompositeConstruct %96 %39 %42 %44
%117 = OpCompositeConstruct %96 %44 %44 %44
%118 = OpCompositeConstruct %96 %47 %47 %47
%120 = OpCompositeConstruct %119 %112 %113 %114
%121 = OpBitFieldSExtract %119 %120 %62 %63
%115 = OpImageSampleExplicitLod %23 %111 %116 Grad|Offset %117 %118 %121
%122 = OpCompositeExtract %5 %115 0
%123 = OpCompositeExtract %5 %115 1
%124 = OpFAdd %5 %102 %73
%125 = OpFAdd %5 %88 %64
%126 = OpFAdd %5 %125 %124
%127 = OpFAdd %5 %126 %122
%128 = OpFAdd %5 %89 %65
%129 = OpFAdd %5 %128 %124
%130 = OpFAdd %5 %129 %123
%132 = OpAccessChain %131 %35 %38
OpStore %132 %127
%133 = OpAccessChain %131 %35 %41
OpStore %133 %130
OpReturn
OpFunctionEnd

