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
               OpEntryPoint TessellationEvaluation %main "main" %SV_DOMAINLOCATION %SV_POSITION %R_COLOR %G_COLOR %B_COLOR %TEXCOORD %SV_POSITION_0 %SV_RENDERTARGETARRAYINDEX %SV_VIEWPORTARRAYINDEX %COLOR %PRIMID %TEXCOORD_0 %TESS_INNER %TESS_OUTER %gl_ClipDistance %SV_INSIDETESSFACTOR %SV_TESSFACTOR %SV_PRIMITIVEID %LAYER %VIEWPORT %INDEX
               OpExecutionMode %main Triangles
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
               OpName %SV_PRIMITIVEID "SV_PRIMITIVEID"
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
               OpDecorate %SV_PRIMITIVEID BuiltIn PrimitiveId
               OpDecorate %SV_PRIMITIVEID Patch
               OpDecorate %LAYER Location 6
               OpDecorate %LAYER Patch
               OpDecorate %VIEWPORT Location 6
               OpDecorate %VIEWPORT Component 1
               OpDecorate %VIEWPORT Patch
               OpDecorate %INDEX Location 6
               OpDecorate %INDEX Component 2
               OpDecorate %INDEX Patch
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
%SV_PRIMITIVEID = OpVariable %_ptr_Input_uint Input
      %LAYER = OpVariable %_ptr_Input_uint Input
   %VIEWPORT = OpVariable %_ptr_Input_uint Input
      %INDEX = OpVariable %_ptr_Input_uint Input
%_ptr_Input_float = OpTypePointer Input %float
     %uint_0 = OpConstant %uint 0
%_ptr_Output_float = OpTypePointer Output %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
     %v2uint = OpTypeVector %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %158

        %158 = OpLabel
         %54 =   OpAccessChain %_ptr_Input_float %SV_INSIDETESSFACTOR %uint_0
         %56 =   OpLoad %float %54
         %58 =   OpAccessChain %_ptr_Output_float %TESS_INNER %uint_0
                 OpStore %58 %56
         %59 =   OpAccessChain %_ptr_Input_float %SV_INSIDETESSFACTOR %uint_1
         %61 =   OpLoad %float %59
         %62 =   OpAccessChain %_ptr_Output_float %TESS_INNER %uint_1
                 OpStore %62 %61
         %63 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_0
         %64 =   OpLoad %float %63
         %65 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_0
                 OpStore %65 %64
         %66 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_1
         %67 =   OpLoad %float %66
         %68 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_1
                 OpStore %68 %67
         %69 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_2
         %70 =   OpLoad %float %69
         %71 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_2
                 OpStore %71 %70
         %72 =   OpAccessChain %_ptr_Input_float %SV_TESSFACTOR %uint_3
         %74 =   OpLoad %float %72
         %75 =   OpAccessChain %_ptr_Output_float %TESS_OUTER %uint_3
                 OpStore %75 %74
         %76 =   OpLoad %uint %LAYER
                 OpStore %SV_RENDERTARGETARRAYINDEX %76
         %77 =   OpLoad %uint %VIEWPORT
                 OpStore %SV_VIEWPORTARRAYINDEX %77
         %78 =   OpLoad %uint %SV_PRIMITIVEID
                 OpStore %PRIMID %78
         %79 =   OpLoad %uint %INDEX
         %80 =   OpAccessChain %_ptr_Input_float %SV_DOMAINLOCATION %uint_0
         %81 =   OpLoad %float %80
         %82 =   OpAccessChain %_ptr_Input_float %SV_DOMAINLOCATION %uint_1
         %83 =   OpLoad %float %82
         %84 =   OpAccessChain %_ptr_Input_float %SV_DOMAINLOCATION %uint_2
         %85 =   OpLoad %float %84
         %88 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_0
         %89 =   OpLoad %float %88
         %90 =   OpFMul %float %89 %81
         %92 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_1
         %93 =   OpLoad %float %92
         %94 =   OpFMul %float %93 %81
         %96 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_2
         %97 =   OpLoad %float %96
         %98 =   OpFMul %float %97 %81
        %100 =   OpAccessChain %_ptr_Input_float %SV_POSITION %79 %uint_3
        %101 =   OpLoad %float %100
        %102 =   OpFMul %float %101 %81
        %103 =   OpBitwiseXor %uint %79 %uint_1
        %105 =   OpAccessChain %_ptr_Input_float %SV_POSITION %103 %uint_0
        %106 =   OpLoad %float %105
        %108 =   OpExtInst %float %107 Fma %106 %83 %90
        %110 =   OpAccessChain %_ptr_Input_float %SV_POSITION %103 %uint_1
        %111 =   OpLoad %float %110
        %112 =   OpExtInst %float %107 Fma %111 %83 %94
        %114 =   OpAccessChain %_ptr_Input_float %SV_POSITION %103 %uint_2
        %115 =   OpLoad %float %114
        %116 =   OpExtInst %float %107 Fma %115 %83 %98
        %118 =   OpAccessChain %_ptr_Input_float %SV_POSITION %103 %uint_3
        %119 =   OpLoad %float %118
        %120 =   OpExtInst %float %107 Fma %119 %83 %102
        %121 =   OpBitwiseXor %uint %79 %uint_2
        %123 =   OpAccessChain %_ptr_Input_float %SV_POSITION %121 %uint_0
        %124 =   OpLoad %float %123
        %125 =   OpExtInst %float %107 Fma %124 %85 %108
        %127 =   OpAccessChain %_ptr_Input_float %SV_POSITION %121 %uint_1
        %128 =   OpLoad %float %127
        %129 =   OpExtInst %float %107 Fma %128 %85 %112
        %131 =   OpAccessChain %_ptr_Input_float %SV_POSITION %121 %uint_2
        %132 =   OpLoad %float %131
        %133 =   OpExtInst %float %107 Fma %132 %85 %116
        %135 =   OpAccessChain %_ptr_Input_float %SV_POSITION %121 %uint_3
        %136 =   OpLoad %float %135
        %137 =   OpExtInst %float %107 Fma %136 %85 %120
        %138 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0
                 OpStore %138 %125
        %139 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1
                 OpStore %139 %129
        %140 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2
                 OpStore %140 %133
        %141 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_3
                 OpStore %141 %137
        %142 =   OpAccessChain %_ptr_Input_float %R_COLOR %uint_0
        %143 =   OpLoad %float %142
        %144 =   OpAccessChain %_ptr_Output_float %COLOR %uint_0
                 OpStore %144 %143
        %145 =   OpAccessChain %_ptr_Input_float %G_COLOR %uint_1
        %146 =   OpLoad %float %145
        %147 =   OpAccessChain %_ptr_Output_float %COLOR %uint_1
                 OpStore %147 %146
        %148 =   OpAccessChain %_ptr_Input_float %B_COLOR %uint_2
        %149 =   OpLoad %float %148
        %150 =   OpAccessChain %_ptr_Output_float %COLOR %uint_2
                 OpStore %150 %149
        %151 =   OpAccessChain %_ptr_Input_float %TEXCOORD %79 %uint_0
        %152 =   OpLoad %float %151
        %153 =   OpAccessChain %_ptr_Input_float %TEXCOORD %79 %uint_1
        %154 =   OpLoad %float %153
        %156 =   OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_0
                 OpStore %156 %152
        %157 =   OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_1
                 OpStore %157 %154
                 OpReturn
               OpFunctionEnd

