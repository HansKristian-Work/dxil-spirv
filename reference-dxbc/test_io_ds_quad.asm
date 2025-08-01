SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 192
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability Tessellation
OpCapability ClipDistance
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_shader_viewport_index_layer"
%102 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint TessellationEvaluation %3 "main" %8 %14 %17 %18 %19 %23 %25 %29 %30 %32 %33 %35 %36 %37 %39 %43 %47 %49 %50 %51 %77
OpExecutionMode %3 Quads
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
%84 = OpTypeVector %10 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %190
%190 = OpLabel
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
%86 = OpAccessChain %52 %14 %79 %54
%87 = OpLoad %5 %86
%88 = OpBitwiseXor %10 %79 %59
%90 = OpAccessChain %52 %14 %88 %54
%91 = OpLoad %5 %90
%92 = OpBitwiseXor %10 %79 %40
%94 = OpAccessChain %52 %14 %92 %54
%95 = OpLoad %5 %94
%96 = OpBitwiseXor %10 %79 %72
%98 = OpAccessChain %52 %14 %96 %54
%99 = OpLoad %5 %98
%100 = OpFSub %5 %91 %87
%101 = OpFSub %5 %99 %95
%103 = OpExtInst %5 %102 Fma %81 %100 %87
%104 = OpExtInst %5 %102 Fma %81 %101 %95
%105 = OpFSub %5 %104 %103
%106 = OpExtInst %5 %102 Fma %83 %105 %103
%108 = OpAccessChain %52 %14 %79 %59
%109 = OpLoad %5 %108
%110 = OpBitwiseXor %10 %79 %59
%112 = OpAccessChain %52 %14 %110 %59
%113 = OpLoad %5 %112
%114 = OpBitwiseXor %10 %79 %40
%116 = OpAccessChain %52 %14 %114 %59
%117 = OpLoad %5 %116
%118 = OpBitwiseXor %10 %79 %72
%120 = OpAccessChain %52 %14 %118 %59
%121 = OpLoad %5 %120
%122 = OpFSub %5 %113 %109
%123 = OpFSub %5 %121 %117
%124 = OpExtInst %5 %102 Fma %81 %122 %109
%125 = OpExtInst %5 %102 Fma %81 %123 %117
%126 = OpFSub %5 %125 %124
%127 = OpExtInst %5 %102 Fma %83 %126 %124
%129 = OpAccessChain %52 %14 %79 %40
%130 = OpLoad %5 %129
%131 = OpBitwiseXor %10 %79 %59
%133 = OpAccessChain %52 %14 %131 %40
%134 = OpLoad %5 %133
%135 = OpBitwiseXor %10 %79 %40
%137 = OpAccessChain %52 %14 %135 %40
%138 = OpLoad %5 %137
%139 = OpBitwiseXor %10 %79 %72
%141 = OpAccessChain %52 %14 %139 %40
%142 = OpLoad %5 %141
%143 = OpFSub %5 %134 %130
%144 = OpFSub %5 %142 %138
%145 = OpExtInst %5 %102 Fma %81 %143 %130
%146 = OpExtInst %5 %102 Fma %81 %144 %138
%147 = OpFSub %5 %146 %145
%148 = OpExtInst %5 %102 Fma %83 %147 %145
%150 = OpAccessChain %52 %14 %79 %72
%151 = OpLoad %5 %150
%152 = OpBitwiseXor %10 %79 %59
%154 = OpAccessChain %52 %14 %152 %72
%155 = OpLoad %5 %154
%156 = OpBitwiseXor %10 %79 %40
%158 = OpAccessChain %52 %14 %156 %72
%159 = OpLoad %5 %158
%160 = OpBitwiseXor %10 %79 %72
%162 = OpAccessChain %52 %14 %160 %72
%163 = OpLoad %5 %162
%164 = OpFSub %5 %155 %151
%165 = OpFSub %5 %163 %159
%166 = OpExtInst %5 %102 Fma %81 %164 %151
%167 = OpExtInst %5 %102 Fma %81 %165 %159
%168 = OpFSub %5 %167 %166
%169 = OpExtInst %5 %102 Fma %83 %168 %166
%170 = OpAccessChain %56 %25 %54
OpStore %170 %106
%171 = OpAccessChain %56 %25 %59
OpStore %171 %127
%172 = OpAccessChain %56 %25 %40
OpStore %172 %148
%173 = OpAccessChain %56 %25 %72
OpStore %173 %169
%174 = OpAccessChain %52 %17 %54
%175 = OpLoad %5 %174
%176 = OpAccessChain %56 %32 %54
OpStore %176 %175
%177 = OpAccessChain %52 %18 %59
%178 = OpLoad %5 %177
%179 = OpAccessChain %56 %32 %59
OpStore %179 %178
%180 = OpAccessChain %52 %19 %40
%181 = OpLoad %5 %180
%182 = OpAccessChain %56 %32 %40
OpStore %182 %181
%183 = OpAccessChain %52 %23 %79 %54
%184 = OpLoad %5 %183
%185 = OpAccessChain %52 %23 %79 %59
%186 = OpLoad %5 %185
%188 = OpAccessChain %56 %35 %54
OpStore %188 %184
%189 = OpAccessChain %56 %35 %59
OpStore %189 %186
OpReturn
OpFunctionEnd

