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
               OpCapability SignedZeroInfNanPreserve
               OpCapability ShaderViewportIndexLayerEXT
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_shader_viewport_index_layer"
               OpExtension "SPV_KHR_float_controls"
        %102 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint TessellationEvaluation %main "main" %SV_DOMAINLOCATION %SV_POSITION %R_COLOR %G_COLOR %B_COLOR %TEXCOORD %SV_POSITION_0 %SV_RENDERTARGETARRAYINDEX %SV_VIEWPORTARRAYINDEX %COLOR %PRIMID %TEXCOORD_0 %TESS_INNER %TESS_OUTER %gl_ClipDistance %SV_INSIDETESSFACTOR %SV_TESSFACTOR %LAYER %VIEWPORT %INDEX %gl_PrimitiveID
               OpExecutionMode %main Quads
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_DOMAINLOCATION "SV_DOMAINLOCATION"
               OpName %SV_POSITION "SV_POSITION"
               OpName %R_COLOR "R_COLOR"
               OpName %G_COLOR "G_COLOR"
               OpName %B_COLOR "B_COLOR"
               OpName %TEXCOORD "TEXCOORD"
               OpName %SV_POSITION_0 "SV_POSITION"
               OpName %SV_RENDERTARGETARRAYINDEX "SV_RENDERTARGETARRAYINDEX"
               OpName %SV_VIEWPORTARRAYINDEX "SV_VIEWPORTARRAYINDEX"
               OpName %COLOR "COLOR"
               OpName %PRIMID "PRIMID"
               OpName %TEXCOORD_0 "TEXCOORD"
               OpName %TESS_INNER "TESS_INNER"
               OpName %TESS_OUTER "TESS_OUTER"
               OpName %SV_INSIDETESSFACTOR "SV_INSIDETESSFACTOR"
               OpName %SV_TESSFACTOR "SV_TESSFACTOR"
               OpName %LAYER "LAYER"
               OpName %VIEWPORT "VIEWPORT"
               OpName %INDEX "INDEX"
               OpDecorate %SV_DOMAINLOCATION BuiltIn TessCoord
               OpDecorate %SV_POSITION Location 0
               OpDecorate %R_COLOR Location 1
               OpDecorate %G_COLOR Location 1
               OpDecorate %G_COLOR Component 1
               OpDecorate %B_COLOR Location 1
               OpDecorate %B_COLOR Component 2
               OpDecorate %TEXCOORD Location 2
               OpDecorate %SV_POSITION_0 BuiltIn Position
               OpDecorate %SV_RENDERTARGETARRAYINDEX BuiltIn Layer
               OpDecorate %SV_VIEWPORTARRAYINDEX BuiltIn ViewportIndex
               OpDecorate %COLOR Location 6
               OpDecorate %PRIMID Location 6
               OpDecorate %PRIMID Component 3
               OpDecorate %TEXCOORD_0 Location 7
               OpDecorate %TESS_INNER Location 7
               OpDecorate %TESS_INNER Component 2
               OpDecorate %TESS_OUTER Location 8
               OpDecorate %gl_ClipDistance BuiltIn ClipDistance
               OpDecorate %SV_INSIDETESSFACTOR BuiltIn TessLevelInner
               OpDecorate %SV_INSIDETESSFACTOR Patch
               OpDecorate %SV_TESSFACTOR BuiltIn TessLevelOuter
               OpDecorate %SV_TESSFACTOR Patch
               OpDecorate %LAYER Location 6
               OpDecorate %LAYER Patch
               OpDecorate %VIEWPORT Location 6
               OpDecorate %VIEWPORT Component 1
               OpDecorate %VIEWPORT Patch
               OpDecorate %INDEX Location 6
               OpDecorate %INDEX Component 2
               OpDecorate %INDEX Patch
               OpDecorate %gl_PrimitiveID BuiltIn PrimitiveId
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v3float = OpTypeVector %float 3
%_ptr_Input_v3float = OpTypePointer Input %v3float
%SV_DOMAINLOCATION = OpVariable %_ptr_Input_v3float Input
    %v4float = OpTypeVector %float 4
       %uint = OpTypeInt 32 0
    %uint_32 = OpConstant %uint 32
%_arr_v4float_uint_32 = OpTypeArray %v4float %uint_32
%_ptr_Input__arr_v4float_uint_32 = OpTypePointer Input %_arr_v4float_uint_32
%SV_POSITION = OpVariable %_ptr_Input__arr_v4float_uint_32 Input
%_arr_float_uint_32 = OpTypeArray %float %uint_32
%_ptr_Input__arr_float_uint_32 = OpTypePointer Input %_arr_float_uint_32
    %R_COLOR = OpVariable %_ptr_Input__arr_float_uint_32 Input
    %G_COLOR = OpVariable %_ptr_Input__arr_float_uint_32 Input
    %B_COLOR = OpVariable %_ptr_Input__arr_float_uint_32 Input
    %v2float = OpTypeVector %float 2
%_arr_v2float_uint_32 = OpTypeArray %v2float %uint_32
%_ptr_Input__arr_v2float_uint_32 = OpTypePointer Input %_arr_v2float_uint_32
   %TEXCOORD = OpVariable %_ptr_Input__arr_v2float_uint_32 Input
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION_0 = OpVariable %_ptr_Output_v4float Output
     %uint_8 = OpConstant %uint 8
%_arr_float_uint_8 = OpTypeArray %float %uint_8
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_RENDERTARGETARRAYINDEX = OpVariable %_ptr_Output_uint Output
%SV_VIEWPORTARRAYINDEX = OpVariable %_ptr_Output_uint Output
%_ptr_Output_v3float = OpTypePointer Output %v3float
      %COLOR = OpVariable %_ptr_Output_v3float Output
     %PRIMID = OpVariable %_ptr_Output_uint Output
%_ptr_Output_v2float = OpTypePointer Output %v2float
 %TEXCOORD_0 = OpVariable %_ptr_Output_v2float Output
 %TESS_INNER = OpVariable %_ptr_Output_v2float Output
 %TESS_OUTER = OpVariable %_ptr_Output_v4float Output
%_ptr_Output__arr_float_uint_8 = OpTypePointer Output %_arr_float_uint_8
%gl_ClipDistance = OpVariable %_ptr_Output__arr_float_uint_8 Output
     %uint_2 = OpConstant %uint 2
%_arr_float_uint_2 = OpTypeArray %float %uint_2
%_ptr_Input__arr_float_uint_2 = OpTypePointer Input %_arr_float_uint_2
%SV_INSIDETESSFACTOR = OpVariable %_ptr_Input__arr_float_uint_2 Input
     %uint_4 = OpConstant %uint 4
%_arr_float_uint_4 = OpTypeArray %float %uint_4
%_ptr_Input__arr_float_uint_4 = OpTypePointer Input %_arr_float_uint_4
%SV_TESSFACTOR = OpVariable %_ptr_Input__arr_float_uint_4 Input
%_ptr_Input_uint = OpTypePointer Input %uint
      %LAYER = OpVariable %_ptr_Input_uint Input
   %VIEWPORT = OpVariable %_ptr_Input_uint Input
      %INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Input_float = OpTypePointer Input %float
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
%gl_PrimitiveID = OpVariable %_ptr_Input_uint Input
     %v2uint = OpTypeVector %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %190

        %190 = OpLabel
         %53 =   OpAccessChain %_ptr_Input_float %SV_INSIDETESSFACTOR %uint_0
         %55 =   OpLoad %float %53
         %57 =   OpAccessChain %_ptr_Output_float %TESS_INNER %uint_0
                 OpStore %57 %55
         %58 =   OpAccessChain %_ptr_Input_float %SV_INSIDETESSFACTOR %uint_1
         %60 =   OpLoad %float %58
         %61 =   OpAccessChain %_ptr_Output_float %TESS_INNER %uint_1
                 OpStore %61 %60
         %62 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_0
         %63 =   OpLoad %float %62
         %64 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_0
                 OpStore %64 %63
         %65 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_1
         %66 =   OpLoad %float %65
         %67 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_1
                 OpStore %67 %66
         %68 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_2
         %69 =   OpLoad %float %68
         %70 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_2
                 OpStore %70 %69
         %71 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_3
         %73 =   OpLoad %float %71
         %74 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_3
                 OpStore %74 %73
         %75 =   OpLoad %uint %LAYER
                 OpStore %SV_RENDERTARGETARRAYINDEX %75
         %76 =   OpLoad %uint %VIEWPORT
                 OpStore %SV_VIEWPORTARRAYINDEX %76
         %78 =   OpLoad %uint %gl_PrimitiveID
                 OpStore %PRIMID %78
         %79 =   OpLoad %uint %INDEX
         %80 =   OpAccessChain %_ptr_Input_float %SV_DOMAINLOCATION %uint_0
         %81 =   OpLoad %float %80
         %82 =   OpAccessChain %_ptr_Input_float %SV_DOMAINLOCATION %uint_1
         %83 =   OpLoad %float %82
         %86 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_0
         %87 =   OpLoad %float %86
         %88 =   OpBitwiseXor %uint %79 %uint_1
         %90 =   OpAccessChain %_ptr_Input_float %SV_POSITION %88 %uint_0
         %91 =   OpLoad %float %90
         %92 =   OpBitwiseXor %uint %79 %uint_2
         %94 =   OpAccessChain %_ptr_Input_float %SV_POSITION %92 %uint_0
         %95 =   OpLoad %float %94
         %96 =   OpBitwiseXor %uint %79 %uint_3
         %98 =   OpAccessChain %_ptr_Input_float %SV_POSITION %96 %uint_0
         %99 =   OpLoad %float %98
        %100 =   OpFSub %float %91 %87
        %101 =   OpFSub %float %99 %95
        %103 =   OpExtInst %float %102 Fma %81 %100 %87
        %104 =   OpExtInst %float %102 Fma %81 %101 %95
        %105 =   OpFSub %float %104 %103
        %106 =   OpExtInst %float %102 Fma %83 %105 %103
        %108 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_1
        %109 =   OpLoad %float %108
        %110 =   OpBitwiseXor %uint %79 %uint_1
        %112 =   OpAccessChain %_ptr_Input_float %SV_POSITION %110 %uint_1
        %113 =   OpLoad %float %112
        %114 =   OpBitwiseXor %uint %79 %uint_2
        %116 =   OpAccessChain %_ptr_Input_float %SV_POSITION %114 %uint_1
        %117 =   OpLoad %float %116
        %118 =   OpBitwiseXor %uint %79 %uint_3
        %120 =   OpAccessChain %_ptr_Input_float %SV_POSITION %118 %uint_1
        %121 =   OpLoad %float %120
        %122 =   OpFSub %float %113 %109
        %123 =   OpFSub %float %121 %117
        %124 =   OpExtInst %float %102 Fma %81 %122 %109
        %125 =   OpExtInst %float %102 Fma %81 %123 %117
        %126 =   OpFSub %float %125 %124
        %127 =   OpExtInst %float %102 Fma %83 %126 %124
        %129 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_2
        %130 =   OpLoad %float %129
        %131 =   OpBitwiseXor %uint %79 %uint_1
        %133 =   OpAccessChain %_ptr_Input_float %SV_POSITION %131 %uint_2
        %134 =   OpLoad %float %133
        %135 =   OpBitwiseXor %uint %79 %uint_2
        %137 =   OpAccessChain %_ptr_Input_float %SV_POSITION %135 %uint_2
        %138 =   OpLoad %float %137
        %139 =   OpBitwiseXor %uint %79 %uint_3
        %141 =   OpAccessChain %_ptr_Input_float %SV_POSITION %139 %uint_2
        %142 =   OpLoad %float %141
        %143 =   OpFSub %float %134 %130
        %144 =   OpFSub %float %142 %138
        %145 =   OpExtInst %float %102 Fma %81 %143 %130
        %146 =   OpExtInst %float %102 Fma %81 %144 %138
        %147 =   OpFSub %float %146 %145
        %148 =   OpExtInst %float %102 Fma %83 %147 %145
        %150 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_3
        %151 =   OpLoad %float %150
        %152 =   OpBitwiseXor %uint %79 %uint_1
        %154 =   OpAccessChain %_ptr_Input_float %SV_POSITION %152 %uint_3
        %155 =   OpLoad %float %154
        %156 =   OpBitwiseXor %uint %79 %uint_2
        %158 =   OpAccessChain %_ptr_Input_float %SV_POSITION %156 %uint_3
        %159 =   OpLoad %float %158
        %160 =   OpBitwiseXor %uint %79 %uint_3
        %162 =   OpAccessChain %_ptr_Input_float %SV_POSITION %160 %uint_3
        %163 =   OpLoad %float %162
        %164 =   OpFSub %float %155 %151
        %165 =   OpFSub %float %163 %159
        %166 =   OpExtInst %float %102 Fma %81 %164 %151
        %167 =   OpExtInst %float %102 Fma %81 %165 %159
        %168 =   OpFSub %float %167 %166
        %169 =   OpExtInst %float %102 Fma %83 %168 %166
        %170 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0
                 OpStore %170 %106
        %171 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1
                 OpStore %171 %127
        %172 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2
                 OpStore %172 %148
        %173 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_3
                 OpStore %173 %169
        %174 =   OpAccessChain %_ptr_Input_float %R_COLOR %uint_0
        %175 =   OpLoad %float %174
        %176 =   OpAccessChain %_ptr_Output_float %COLOR %uint_0
                 OpStore %176 %175
        %177 =   OpAccessChain %_ptr_Input_float %G_COLOR %uint_1
        %178 =   OpLoad %float %177
        %179 =   OpAccessChain %_ptr_Output_float %COLOR %uint_1
                 OpStore %179 %178
        %180 =   OpAccessChain %_ptr_Input_float %B_COLOR %uint_2
        %181 =   OpLoad %float %180
        %182 =   OpAccessChain %_ptr_Output_float %COLOR %uint_2
                 OpStore %182 %181
        %183 =   OpAccessChain %_ptr_Input_float %TEXCOORD %79 %uint_0
        %184 =   OpLoad %float %183
        %185 =   OpAccessChain %_ptr_Input_float %TEXCOORD %79 %uint_1
        %186 =   OpLoad %float %185
        %188 =   OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_0
                 OpStore %188 %184
        %189 =   OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_1
                 OpStore %189 %186
                 OpReturn
               OpFunctionEnd

