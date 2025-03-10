; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 137
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
%79 = OpTypeSampledImage %12
%87 = OpTypeVector %58 2
%95 = OpTypeSampledImage %15
%100 = OpTypeVector %5 3
%116 = OpTypeSampledImage %18
%125 = OpTypeVector %58 3
%132 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %135
%135 = OpLabel
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
%74 = OpFAdd %5 %73 %64
%75 = OpFAdd %5 %73 %65
%76 = OpCompositeExtract %21 %52 1
%77 = OpCompositeExtract %21 %52 2
%78 = OpLoad %12 %14
%80 = OpSampledImage %79 %78 %55
%81 = OpBitcast %58 %76
%82 = OpBitcast %58 %77
%84 = OpCompositeConstruct %33 %39 %42
%85 = OpCompositeConstruct %33 %44 %44
%86 = OpCompositeConstruct %33 %47 %47
%88 = OpCompositeConstruct %87 %81 %82
%89 = OpBitFieldSExtract %87 %88 %62 %63
%83 = OpImageSampleExplicitLod %23 %80 %84 Grad|Offset %85 %86 %89
%90 = OpCompositeExtract %5 %83 0
%91 = OpCompositeExtract %5 %83 1
%92 = OpFAdd %5 %74 %90
%93 = OpFAdd %5 %75 %91
%94 = OpLoad %15 %17
%96 = OpSampledImage %95 %94 %55
%97 = OpBitcast %58 %76
%98 = OpBitcast %58 %77
%101 = OpCompositeConstruct %100 %39 %42 %44
%102 = OpCompositeConstruct %33 %44 %44
%103 = OpCompositeConstruct %33 %47 %47
%104 = OpCompositeConstruct %87 %97 %98
%105 = OpBitFieldSExtract %87 %104 %62 %63
%99 = OpImageSampleExplicitLod %23 %96 %101 Grad|Offset %102 %103 %105
%106 = OpCompositeExtract %5 %99 0
%107 = OpFAdd %5 %92 %106
%108 = OpFAdd %5 %93 %106
%109 = OpAccessChain %48 %27 %38 %41
%110 = OpLoad %23 %109
%111 = OpBitcast %51 %110
%112 = OpCompositeExtract %21 %111 0
%113 = OpCompositeExtract %21 %111 1
%114 = OpCompositeExtract %21 %111 2
%115 = OpLoad %18 %20
%117 = OpSampledImage %116 %115 %55
%118 = OpBitcast %58 %112
%119 = OpBitcast %58 %113
%120 = OpBitcast %58 %114
%122 = OpCompositeConstruct %100 %39 %42 %44
%123 = OpCompositeConstruct %100 %44 %44 %44
%124 = OpCompositeConstruct %100 %47 %47 %47
%126 = OpCompositeConstruct %125 %118 %119 %120
%127 = OpBitFieldSExtract %125 %126 %62 %63
%121 = OpImageSampleExplicitLod %23 %117 %122 Grad|Offset %123 %124 %127
%128 = OpCompositeExtract %5 %121 0
%129 = OpCompositeExtract %5 %121 1
%130 = OpFAdd %5 %107 %128
%131 = OpFAdd %5 %108 %129
%133 = OpAccessChain %132 %35 %38
OpStore %133 %130
%134 = OpAccessChain %132 %35 %41
OpStore %134 %131
OpReturn
OpFunctionEnd

