SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 160
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability Tessellation
OpCapability ClipDistance
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_shader_viewport_index_layer"
%107 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint TessellationEvaluation %3 "main" %8 %14 %17 %18 %19 %23 %25 %29 %30 %32 %33 %35 %36 %37 %39 %43 %47 %49 %50 %51 %77
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %8 "SV_DOMAINLOCATION"
OpName %14 "SV_POSITION"
OpName %17 "R_COLOR"
OpName %18 "G_COLOR"
OpName %19 "B_COLOR"
OpName %23 "TEXCOORD"
OpName %25 "SV_POSITION"
OpName %29 "SV_RENDERTARGETARRAYINDEX"
OpName %30 "SV_VIEWPORTARRAYINDEX"
OpName %32 "COLOR"
OpName %33 "PRIMID"
OpName %35 "TEXCOORD"
OpName %36 "TESS_INNER"
OpName %37 "TESS_OUTER"
OpName %43 "SV_INSIDETESSFACTOR"
OpName %47 "SV_TESSFACTOR"
OpName %49 "LAYER"
OpName %50 "VIEWPORT"
OpName %51 "INDEX"
OpDecorate %8 BuiltIn TessCoord
OpDecorate %14 Location 0
OpDecorate %17 Location 1
OpDecorate %18 Location 1
OpDecorate %18 Component 1
OpDecorate %19 Location 1
OpDecorate %19 Component 2
OpDecorate %23 Location 2
OpDecorate %25 BuiltIn Position
OpDecorate %29 BuiltIn Layer
OpDecorate %30 BuiltIn ViewportIndex
OpDecorate %32 Location 6
OpDecorate %33 Location 6
OpDecorate %33 Component 3
OpDecorate %35 Location 7
OpDecorate %36 Location 7
OpDecorate %36 Component 2
OpDecorate %37 Location 8
OpDecorate %39 BuiltIn ClipDistance
OpDecorate %43 BuiltIn TessLevelInner
OpDecorate %43 Patch
OpDecorate %47 BuiltIn TessLevelOuter
OpDecorate %47 Patch
OpDecorate %49 Location 6
OpDecorate %49 Patch
OpDecorate %50 Location 6
OpDecorate %50 Component 1
OpDecorate %50 Patch
OpDecorate %51 Location 6
OpDecorate %51 Component 2
OpDecorate %51 Patch
OpDecorate %77 BuiltIn PrimitiveId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypeInt 32 0
%11 = OpConstant %10 32
%12 = OpTypeArray %9 %11
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeArray %5 %11
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpVariable %16 Input
%19 = OpVariable %16 Input
%20 = OpTypeVector %5 2
%21 = OpTypeArray %20 %11
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Output %9
%25 = OpVariable %24 Output
%26 = OpConstant %10 8
%27 = OpTypeArray %5 %26
%28 = OpTypePointer Output %10
%29 = OpVariable %28 Output
%30 = OpVariable %28 Output
%31 = OpTypePointer Output %6
%32 = OpVariable %31 Output
%33 = OpVariable %28 Output
%34 = OpTypePointer Output %20
%35 = OpVariable %34 Output
%36 = OpVariable %34 Output
%37 = OpVariable %24 Output
%38 = OpTypePointer Output %27
%39 = OpVariable %38 Output
%40 = OpConstant %10 2
%41 = OpTypeArray %5 %40
%42 = OpTypePointer Input %41
%43 = OpVariable %42 Input
%44 = OpConstant %10 4
%45 = OpTypeArray %5 %44
%46 = OpTypePointer Input %45
%47 = OpVariable %46 Input
%48 = OpTypePointer Input %10
%49 = OpVariable %48 Input
%50 = OpVariable %48 Input
%51 = OpVariable %48 Input
%52 = OpTypePointer Input %5
%54 = OpConstant %10 0
%56 = OpTypePointer Output %5
%59 = OpConstant %10 1
%72 = OpConstant %10 3
%77 = OpVariable %48 Input
%86 = OpTypeVector %10 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %158
%158 = OpLabel
%53 = OpAccessChain %52 %43 %54
%55 = OpLoad %5 %53
%57 = OpAccessChain %56 %36 %54
OpStore %57 %55
%58 = OpAccessChain %52 %43 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %56 %36 %59
OpStore %61 %60
%62 = OpAccessChain %52 %47 %54
%63 = OpLoad %5 %62
%64 = OpAccessChain %56 %37 %54
OpStore %64 %63
%65 = OpAccessChain %52 %47 %59
%66 = OpLoad %5 %65
%67 = OpAccessChain %56 %37 %59
OpStore %67 %66
%68 = OpAccessChain %52 %47 %40
%69 = OpLoad %5 %68
%70 = OpAccessChain %56 %37 %40
OpStore %70 %69
%71 = OpAccessChain %52 %47 %72
%73 = OpLoad %5 %71
%74 = OpAccessChain %56 %37 %72
OpStore %74 %73
%75 = OpLoad %10 %49
OpStore %29 %75
%76 = OpLoad %10 %50
OpStore %30 %76
%78 = OpLoad %10 %77
OpStore %33 %78
%79 = OpLoad %10 %51
%80 = OpAccessChain %52 %8 %54
%81 = OpLoad %5 %80
%82 = OpAccessChain %52 %8 %54
%83 = OpLoad %5 %82
%84 = OpAccessChain %52 %8 %54
%85 = OpLoad %5 %84
%88 = OpAccessChain %52 %14 %79 %54
%89 = OpLoad %5 %88
%90 = OpFMul %5 %89 %81
%92 = OpAccessChain %52 %14 %79 %59
%93 = OpLoad %5 %92
%94 = OpFMul %5 %93 %81
%96 = OpAccessChain %52 %14 %79 %40
%97 = OpLoad %5 %96
%98 = OpFMul %5 %97 %81
%100 = OpAccessChain %52 %14 %79 %72
%101 = OpLoad %5 %100
%102 = OpFMul %5 %101 %81
%103 = OpBitwiseXor %10 %79 %59
%105 = OpAccessChain %52 %14 %103 %54
%106 = OpLoad %5 %105
%108 = OpExtInst %5 %107 Fma %106 %83 %90
%110 = OpAccessChain %52 %14 %103 %59
%111 = OpLoad %5 %110
%112 = OpExtInst %5 %107 Fma %111 %83 %94
%114 = OpAccessChain %52 %14 %103 %40
%115 = OpLoad %5 %114
%116 = OpExtInst %5 %107 Fma %115 %83 %98
%118 = OpAccessChain %52 %14 %103 %72
%119 = OpLoad %5 %118
%120 = OpExtInst %5 %107 Fma %119 %83 %102
%121 = OpBitwiseXor %10 %79 %40
%123 = OpAccessChain %52 %14 %121 %54
%124 = OpLoad %5 %123
%125 = OpExtInst %5 %107 Fma %124 %85 %108
%127 = OpAccessChain %52 %14 %121 %59
%128 = OpLoad %5 %127
%129 = OpExtInst %5 %107 Fma %128 %85 %112
%131 = OpAccessChain %52 %14 %121 %40
%132 = OpLoad %5 %131
%133 = OpExtInst %5 %107 Fma %132 %85 %116
%135 = OpAccessChain %52 %14 %121 %72
%136 = OpLoad %5 %135
%137 = OpExtInst %5 %107 Fma %136 %85 %120
%138 = OpAccessChain %56 %25 %54
OpStore %138 %125
%139 = OpAccessChain %56 %25 %59
OpStore %139 %129
%140 = OpAccessChain %56 %25 %40
OpStore %140 %133
%141 = OpAccessChain %56 %25 %72
OpStore %141 %137
%142 = OpAccessChain %52 %17 %54
%143 = OpLoad %5 %142
%144 = OpAccessChain %56 %32 %54
OpStore %144 %143
%145 = OpAccessChain %52 %18 %59
%146 = OpLoad %5 %145
%147 = OpAccessChain %56 %32 %59
OpStore %147 %146
%148 = OpAccessChain %52 %19 %40
%149 = OpLoad %5 %148
%150 = OpAccessChain %56 %32 %40
OpStore %150 %149
%151 = OpAccessChain %52 %23 %79 %54
%152 = OpLoad %5 %151
%153 = OpAccessChain %52 %23 %79 %59
%154 = OpLoad %5 %153
%156 = OpAccessChain %56 %35 %54
OpStore %156 %152
%157 = OpAccessChain %56 %35 %59
OpStore %157 %154
OpReturn
OpFunctionEnd

