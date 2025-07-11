SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 167
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability MinLod
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %22 %25 %27 %28 %29 %30 %31 %32 %33
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %22 "TEXCOORD_2"
OpName %25 "SV_TARGET"
OpName %27 "SV_TARGET_1"
OpName %28 "SV_TARGET_2"
OpName %29 "SV_TARGET_3"
OpName %30 "SV_TARGET_4"
OpName %31 "SV_TARGET_5"
OpName %32 "SV_TARGET_6"
OpName %33 "SV_TARGET_7"
OpName %53 "SparseTexel"
OpName %62 ""
OpName %70 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %18 Location 1
OpDecorate %18 Component 2
OpDecorate %19 Location 1
OpDecorate %19 Component 3
OpDecorate %22 Location 2
OpDecorate %25 Location 0
OpDecorate %27 Location 1
OpDecorate %28 Location 2
OpDecorate %29 Location 3
OpDecorate %30 Location 4
OpDecorate %31 Location 5
OpDecorate %32 Location 6
OpDecorate %33 Location 7
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 3
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %5
%16 = OpVariable %15 Input
%17 = OpVariable %15 Input
%18 = OpVariable %15 Input
%19 = OpVariable %15 Input
%20 = OpTypeVector %5 2
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypeVector %5 4
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %5
%27 = OpVariable %26 Output
%28 = OpVariable %24 Output
%29 = OpVariable %26 Output
%30 = OpVariable %24 Output
%31 = OpVariable %26 Output
%32 = OpVariable %24 Output
%33 = OpVariable %26 Output
%37 = OpTypeInt 32 0
%38 = OpConstant %37 0
%41 = OpConstant %37 1
%45 = OpTypeSampledImage %6
%52 = OpConstant %5 0
%53 = OpTypeStruct %37 %23
%62 = OpTypeStruct %5 %5 %5 %5 %37
%70 = OpTypeStruct %37 %23
%75 = OpConstant %37 2
%77 = OpConstant %37 3
%78 = OpTypeBool
%81 = OpConstant %5 1
%104 = OpTypeInt 32 1
%105 = OpConstant %104 -1
%106 = OpConstant %104 0
%109 = OpTypeVector %104 2
%110 = OpConstantComposite %109 %105 %106
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %165
%165 = OpLabel
%34 = OpLoad %6 %8
%35 = OpLoad %9 %11
%36 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %36
%40 = OpAccessChain %15 %14 %41
%42 = OpLoad %5 %40
%43 = OpCompositeConstruct %20 %39 %42
%44 = OpLoad %5 %19
%46 = OpSampledImage %45 %34 %35
%48 = OpCompositeConstruct %20 %39 %42
%47 = OpImageQueryLod %20 %46 %48
%49 = OpCompositeExtract %5 %47 0
%50 = OpLoad %5 %17
%51 = OpLoad %5 %18
%55 = OpCompositeConstruct %12 %39 %42 %44
%54 = OpImageSparseSampleImplicitLod %53 %46 %55 None
%56 = OpCompositeExtract %37 %54 0
%57 = OpCompositeExtract %23 %54 1
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%60 = OpCompositeExtract %5 %57 2
%61 = OpCompositeExtract %5 %57 3
%63 = OpCompositeConstruct %62 %58 %59 %60 %61 %56
%64 = OpCompositeExtract %37 %63 4
%65 = OpCompositeExtract %5 %63 0
%66 = OpCompositeExtract %5 %63 1
%67 = OpCompositeExtract %5 %63 2
%68 = OpCompositeExtract %5 %63 3
%69 = OpCompositeConstruct %23 %65 %66 %67 %68
%71 = OpCompositeConstruct %70 %64 %69
%72 = OpAccessChain %26 %25 %38
OpStore %72 %65
%73 = OpAccessChain %26 %25 %41
OpStore %73 %66
%74 = OpAccessChain %26 %25 %75
OpStore %74 %67
%76 = OpAccessChain %26 %25 %77
OpStore %76 %68
%79 = OpImageSparseTexelsResident %78 %64
%80 = OpSelect %5 %79 %81 %52
OpStore %27 %80
%83 = OpCompositeConstruct %12 %39 %42 %44
%82 = OpImageSparseSampleExplicitLod %53 %46 %83 Lod %49
%84 = OpCompositeExtract %37 %82 0
%85 = OpCompositeExtract %23 %82 1
%86 = OpCompositeExtract %5 %85 0
%87 = OpCompositeExtract %5 %85 1
%88 = OpCompositeExtract %5 %85 2
%89 = OpCompositeExtract %5 %85 3
%90 = OpCompositeConstruct %62 %86 %87 %88 %89 %84
%91 = OpCompositeExtract %37 %90 4
%92 = OpCompositeExtract %5 %90 0
%93 = OpCompositeExtract %5 %90 1
%94 = OpCompositeExtract %5 %90 2
%95 = OpCompositeExtract %5 %90 3
%96 = OpCompositeConstruct %23 %92 %93 %94 %95
%97 = OpCompositeConstruct %70 %91 %96
%98 = OpAccessChain %26 %28 %38
OpStore %98 %92
%99 = OpAccessChain %26 %28 %41
OpStore %99 %93
%100 = OpAccessChain %26 %28 %75
OpStore %100 %94
%101 = OpAccessChain %26 %28 %77
OpStore %101 %95
%102 = OpImageSparseTexelsResident %78 %91
%103 = OpSelect %5 %102 %81 %52
OpStore %29 %103
%108 = OpCompositeConstruct %12 %39 %42 %44
%107 = OpImageSparseSampleImplicitLod %53 %46 %108 Bias|ConstOffset|MinLod %50 %110 %51
%111 = OpCompositeExtract %37 %107 0
%112 = OpCompositeExtract %23 %107 1
%113 = OpCompositeExtract %5 %112 0
%114 = OpCompositeExtract %5 %112 1
%115 = OpCompositeExtract %5 %112 2
%116 = OpCompositeExtract %5 %112 3
%117 = OpCompositeConstruct %62 %113 %114 %115 %116 %111
%118 = OpCompositeExtract %37 %117 4
%119 = OpCompositeExtract %5 %117 0
%120 = OpCompositeExtract %5 %117 1
%121 = OpCompositeExtract %5 %117 2
%122 = OpCompositeExtract %5 %117 3
%123 = OpCompositeConstruct %23 %119 %120 %121 %122
%124 = OpCompositeConstruct %70 %118 %123
%125 = OpAccessChain %26 %30 %38
OpStore %125 %119
%126 = OpAccessChain %26 %30 %41
OpStore %126 %120
%127 = OpAccessChain %26 %30 %75
OpStore %127 %121
%128 = OpAccessChain %26 %30 %77
OpStore %128 %122
%129 = OpImageSparseTexelsResident %78 %118
%130 = OpSelect %5 %129 %81 %52
OpStore %31 %130
%131 = OpAccessChain %15 %22 %38
%132 = OpLoad %5 %131
%133 = OpDPdx %5 %132
%134 = OpDPdy %5 %132
%135 = OpAccessChain %15 %22 %41
%136 = OpLoad %5 %135
%137 = OpDPdx %5 %136
%138 = OpDPdy %5 %136
%139 = OpCompositeConstruct %20 %133 %137
%140 = OpCompositeConstruct %20 %134 %138
%142 = OpCompositeConstruct %12 %39 %42 %44
%143 = OpCompositeConstruct %20 %133 %137
%144 = OpCompositeConstruct %20 %134 %138
%141 = OpImageSparseSampleExplicitLod %53 %46 %142 Grad %143 %144
%145 = OpCompositeExtract %37 %141 0
%146 = OpCompositeExtract %23 %141 1
%147 = OpCompositeExtract %5 %146 0
%148 = OpCompositeExtract %5 %146 1
%149 = OpCompositeExtract %5 %146 2
%150 = OpCompositeExtract %5 %146 3
%151 = OpCompositeConstruct %62 %147 %148 %149 %150 %145
%152 = OpCompositeExtract %37 %151 4
%153 = OpCompositeExtract %5 %151 0
%154 = OpCompositeExtract %5 %151 1
%155 = OpCompositeExtract %5 %151 2
%156 = OpCompositeExtract %5 %151 3
%157 = OpCompositeConstruct %23 %153 %154 %155 %156
%158 = OpCompositeConstruct %70 %152 %157
%159 = OpAccessChain %26 %32 %38
OpStore %159 %153
%160 = OpAccessChain %26 %32 %41
OpStore %160 %154
%161 = OpAccessChain %26 %32 %75
OpStore %161 %155
%162 = OpAccessChain %26 %32 %77
OpStore %162 %156
%163 = OpImageSparseTexelsResident %78 %152
%164 = OpSelect %5 %163 %81 %52
OpStore %33 %164
OpReturn
OpFunctionEnd

