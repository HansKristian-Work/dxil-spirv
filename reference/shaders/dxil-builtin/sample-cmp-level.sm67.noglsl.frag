; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 112
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %29 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %29 "TEXCOORD"
OpName %32 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %29 Location 0
OpDecorate %32 Location 0
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
%18 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeSampler
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeVector %5 4
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypeVector %5 2
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%33 = OpTypePointer Input %5
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%49 = OpTypeImage %5 1D 1 0 0 1 Unknown
%50 = OpTypeSampledImage %49
%52 = OpConstant %5 0.25
%57 = OpTypeImage %5 1D 1 1 0 1 Unknown
%58 = OpTypeSampledImage %57
%60 = OpConstant %5 0.5
%67 = OpTypeImage %5 2D 1 0 0 1 Unknown
%68 = OpTypeSampledImage %67
%70 = OpConstant %5 1
%77 = OpTypeImage %5 2D 1 1 0 1 Unknown
%78 = OpTypeSampledImage %77
%80 = OpConstant %5 2
%82 = OpTypeVector %5 3
%88 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%89 = OpTypeSampledImage %88
%91 = OpConstant %5 3
%98 = OpTypeImage %5 Cube 1 1 0 1 Unknown
%99 = OpTypeSampledImage %98
%101 = OpConstant %5 4
%107 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %110
%110 = OpLabel
%34 = OpAccessChain %33 %29 %36
%37 = OpLoad %5 %34
%38 = OpAccessChain %33 %29 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %33 %29 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %33 %29 %45
%46 = OpLoad %5 %44
%47 = OpLoad %6 %8
%48 = OpLoad %24 %26
%51 = OpSampledImage %50 %47 %48
%53 = OpImageSampleDrefExplicitLod %5 %51 %37 %46 Lod %52
%54 = OpCompositeConstruct %27 %53 %53 %53 %53
%55 = OpCompositeExtract %5 %54 0
%56 = OpLoad %9 %11
%59 = OpSampledImage %58 %56 %48
%62 = OpCompositeConstruct %30 %37 %40
%61 = OpImageSampleDrefExplicitLod %5 %59 %62 %46 Lod %60
%63 = OpCompositeConstruct %27 %61 %61 %61 %61
%64 = OpCompositeExtract %5 %63 0
%65 = OpFAdd %5 %64 %55
%66 = OpLoad %12 %14
%69 = OpSampledImage %68 %66 %48
%72 = OpCompositeConstruct %30 %37 %40
%71 = OpImageSampleDrefExplicitLod %5 %69 %72 %46 Lod %70
%73 = OpCompositeConstruct %27 %71 %71 %71 %71
%74 = OpCompositeExtract %5 %73 0
%75 = OpFAdd %5 %65 %74
%76 = OpLoad %15 %17
%79 = OpSampledImage %78 %76 %48
%83 = OpCompositeConstruct %82 %37 %40 %43
%81 = OpImageSampleDrefExplicitLod %5 %79 %83 %46 Lod %80
%84 = OpCompositeConstruct %27 %81 %81 %81 %81
%85 = OpCompositeExtract %5 %84 0
%86 = OpFAdd %5 %75 %85
%87 = OpLoad %18 %20
%90 = OpSampledImage %89 %87 %48
%93 = OpCompositeConstruct %82 %37 %40 %43
%92 = OpImageSampleDrefExplicitLod %5 %90 %93 %46 Lod %91
%94 = OpCompositeConstruct %27 %92 %92 %92 %92
%95 = OpCompositeExtract %5 %94 0
%96 = OpFAdd %5 %86 %95
%97 = OpLoad %21 %23
%100 = OpSampledImage %99 %97 %48
%103 = OpCompositeConstruct %27 %37 %40 %43 %46
%102 = OpImageSampleDrefExplicitLod %5 %100 %103 %46 Lod %101
%104 = OpCompositeConstruct %27 %102 %102 %102 %102
%105 = OpCompositeExtract %5 %104 0
%106 = OpFAdd %5 %96 %105
%108 = OpAccessChain %107 %32 %36
OpStore %108 %106
%109 = OpAccessChain %107 %32 %39
OpStore %109 %106
OpReturn
OpFunctionEnd

