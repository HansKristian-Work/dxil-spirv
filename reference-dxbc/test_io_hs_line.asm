SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability Tessellation
               OpCapability VulkanMemoryModel
         %84 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint TessellationControl %main "main" %SV_POSITION %NORMAL %FACTOR %PRIMITIVE_ID %SV_POSITION_0 %NORMAL_0 %INSTANCE_ID %TANGENT %TANGENT_1 %SV_TESSFACTOR %SV_INSIDETESSFACTOR %gl_InvocationID
               OpExecutionMode %main Isolines
               OpExecutionMode %main SpacingEqual
               OpExecutionMode %main OutputVertices 4
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %NORMAL "NORMAL"
               OpName %FACTOR "FACTOR"
               OpName %PRIMITIVE_ID "PRIMITIVE_ID"
               OpName %SV_POSITION_0 "SV_POSITION"
               OpName %NORMAL_0 "NORMAL"
               OpName %INSTANCE_ID "INSTANCE_ID"
               OpName %TANGENT "TANGENT"
               OpName %TANGENT_1 "TANGENT_1"
               OpName %SV_TESSFACTOR "SV_TESSFACTOR"
               OpName %SV_INSIDETESSFACTOR "SV_INSIDETESSFACTOR"
               OpName %hull_main "hull_main"
               OpName %patch_main "patch_main"
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %NORMAL Location 1
               OpDecorate %FACTOR Location 1
               OpDecorate %FACTOR Component 3
               OpDecorate %PRIMITIVE_ID BuiltIn PrimitiveId
               OpDecorate %SV_POSITION_0 Location 0
               OpDecorate %NORMAL_0 Location 1
               OpDecorate %INSTANCE_ID Location 4
               OpDecorate %INSTANCE_ID Patch
               OpDecorate %TANGENT Location 5
               OpDecorate %TANGENT Patch
               OpDecorate %TANGENT_1 Location 6
               OpDecorate %TANGENT_1 Patch
               OpDecorate %SV_TESSFACTOR BuiltIn TessLevelOuter
               OpDecorate %SV_TESSFACTOR Patch
               OpDecorate %SV_INSIDETESSFACTOR BuiltIn TessLevelInner
               OpDecorate %SV_INSIDETESSFACTOR Patch
               OpDecorate %gl_InvocationID BuiltIn InvocationId
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
       %uint = OpTypeInt 32 0
    %uint_32 = OpConstant %uint 32
%_arr_v4float_uint_32 = OpTypeArray %v4float %uint_32
%_ptr_Input__arr_v4float_uint_32 = OpTypePointer Input %_arr_v4float_uint_32
%SV_POSITION = OpVariable %_ptr_Input__arr_v4float_uint_32 Input
    %v3float = OpTypeVector %float 3
%_arr_v3float_uint_32 = OpTypeArray %v3float %uint_32
%_ptr_Input__arr_v3float_uint_32 = OpTypePointer Input %_arr_v3float_uint_32
     %NORMAL = OpVariable %_ptr_Input__arr_v3float_uint_32 Input
%_arr_float_uint_32 = OpTypeArray %float %uint_32
%_ptr_Input__arr_float_uint_32 = OpTypePointer Input %_arr_float_uint_32
     %FACTOR = OpVariable %_ptr_Input__arr_float_uint_32 Input
%_ptr_Input_uint = OpTypePointer Input %uint
%PRIMITIVE_ID = OpVariable %_ptr_Input_uint Input
     %uint_4 = OpConstant %uint 4
%_arr_v4float_uint_4 = OpTypeArray %v4float %uint_4
%_ptr_Output__arr_v4float_uint_4 = OpTypePointer Output %_arr_v4float_uint_4
%SV_POSITION_0 = OpVariable %_ptr_Output__arr_v4float_uint_4 Output
%_arr_v3float_uint_4 = OpTypeArray %v3float %uint_4
%_ptr_Output__arr_v3float_uint_4 = OpTypePointer Output %_arr_v3float_uint_4
   %NORMAL_0 = OpVariable %_ptr_Output__arr_v3float_uint_4 Output
%_ptr_Output_uint = OpTypePointer Output %uint
%INSTANCE_ID = OpVariable %_ptr_Output_uint Output
%_ptr_Output_v3float = OpTypePointer Output %v3float
    %TANGENT = OpVariable %_ptr_Output_v3float Output
  %TANGENT_1 = OpVariable %_ptr_Output_v3float Output
%_arr_float_uint_4 = OpTypeArray %float %uint_4
%_ptr_Output__arr_float_uint_4 = OpTypePointer Output %_arr_float_uint_4
%SV_TESSFACTOR = OpVariable %_ptr_Output__arr_float_uint_4 Output
     %uint_2 = OpConstant %uint 2
%_arr_float_uint_2 = OpTypeArray %float %uint_2
%_ptr_Output__arr_float_uint_2 = OpTypePointer Output %_arr_float_uint_2
%SV_INSIDETESSFACTOR = OpVariable %_ptr_Output__arr_float_uint_2 Output
%gl_InvocationID = OpVariable %_ptr_Input_uint Input
%_ptr_Input_float = OpTypePointer Input %float
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
%_ptr_Output_float = OpTypePointer Output %float
   %float_64 = OpConstant %float 64
       %bool = OpTypeBool
  %uint_4104 = OpConstant %uint 4104
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %129

        %129 = OpLabel
        %123 =   OpFunctionCall %void %hull_main
        %124 =   OpLoad %uint %gl_InvocationID
        %126 =   OpIEqual %bool %124 %uint_0
                 OpControlBarrier %uint_2 %uint_2 %uint_4104
                 OpSelectionMerge %131 None
                 OpBranchConditional %126 %130 %131

        %130 =     OpLabel
        %128 =       OpFunctionCall %void %patch_main
                     OpBranch %131

        %131 = OpLabel
                 OpReturn
               OpFunctionEnd
  %hull_main = OpFunction %void None %2

         %41 = OpLabel
                 OpBranch %133

        %133 = OpLabel
         %45 =   OpLoad %uint %gl_InvocationID
         %47 =   OpAccessChain %_ptr_Input_float %SV_POSITION %45 %uint_0
         %49 =   OpLoad %float %47
         %50 =   OpAccessChain %_ptr_Input_float %SV_POSITION %45 %uint_1
         %52 =   OpLoad %float %50
         %53 =   OpAccessChain %_ptr_Input_float %SV_POSITION %45 %uint_2
         %54 =   OpLoad %float %53
         %55 =   OpAccessChain %_ptr_Input_float %SV_POSITION %45 %uint_3
         %57 =   OpLoad %float %55
         %61 =   OpLoad %uint %gl_InvocationID
         %60 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %61 %uint_0
                 OpStore %60 %49
         %63 =   OpLoad %uint %gl_InvocationID
         %62 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %63 %uint_1
                 OpStore %62 %52
         %65 =   OpLoad %uint %gl_InvocationID
         %64 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %65 %uint_2
                 OpStore %64 %54
         %67 =   OpLoad %uint %gl_InvocationID
         %66 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %67 %uint_3
                 OpStore %66 %57
         %68 =   OpAccessChain %_ptr_Input_float %NORMAL %45 %uint_0
         %69 =   OpLoad %float %68
         %70 =   OpAccessChain %_ptr_Input_float %NORMAL %45 %uint_1
         %71 =   OpLoad %float %70
         %72 =   OpAccessChain %_ptr_Input_float %NORMAL %45 %uint_2
         %73 =   OpLoad %float %72
         %76 =   OpLoad %uint %gl_InvocationID
         %75 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %76 %uint_0
                 OpStore %75 %69
         %78 =   OpLoad %uint %gl_InvocationID
         %77 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %78 %uint_1
                 OpStore %77 %71
         %80 =   OpLoad %uint %gl_InvocationID
         %79 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %80 %uint_2
                 OpStore %79 %73
                 OpReturn
               OpFunctionEnd
 %patch_main = OpFunction %void None %2

         %43 = OpLabel
                 OpBranch %135

        %135 = OpLabel
         %81 =   OpLoad %uint %PRIMITIVE_ID
                 OpStore %INSTANCE_ID %81
         %82 =   OpAccessChain %_ptr_Input_float %FACTOR %uint_0
         %83 =   OpLoad %float %82
         %85 =   OpExtInst %float %84 NMin %83 %float_64
         %87 =   OpAccessChain %_ptr_Output_float %SV_TESSFACTOR %uint_0
                 OpStore %87 %85
         %88 =   OpAccessChain %_ptr_Output_float %SV_TESSFACTOR %uint_1
                 OpStore %88 %85
         %89 =   OpAccessChain %_ptr_Output_float %SV_TESSFACTOR %uint_2
                 OpStore %89 %85
         %90 =   OpAccessChain %_ptr_Output_float %SV_TESSFACTOR %uint_3
                 OpStore %90 %85
         %91 =   OpAccessChain %_ptr_Output_float %SV_INSIDETESSFACTOR %uint_0
                 OpStore %91 %85
         %92 =   OpAccessChain %_ptr_Output_float %SV_INSIDETESSFACTOR %uint_1
                 OpStore %92 %85
         %93 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0 %uint_0
         %94 =   OpLoad %float %93
         %95 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1 %uint_0
         %96 =   OpLoad %float %95
         %97 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2 %uint_0
         %98 =   OpLoad %float %97
         %99 =   OpFSub %float %96 %94
        %100 =   OpAccessChain %_ptr_Output_float %TANGENT %uint_0
                 OpStore %100 %99
        %101 =   OpFSub %float %98 %94
        %102 =   OpAccessChain %_ptr_Output_float %TANGENT_1 %uint_0
                 OpStore %102 %101
        %103 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0 %uint_1
        %104 =   OpLoad %float %103
        %105 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1 %uint_1
        %106 =   OpLoad %float %105
        %107 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2 %uint_1
        %108 =   OpLoad %float %107
        %109 =   OpFSub %float %106 %104
        %110 =   OpAccessChain %_ptr_Output_float %TANGENT %uint_1
                 OpStore %110 %109
        %111 =   OpFSub %float %108 %104
        %112 =   OpAccessChain %_ptr_Output_float %TANGENT_1 %uint_1
                 OpStore %112 %111
        %113 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0 %uint_2
        %114 =   OpLoad %float %113
        %115 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1 %uint_2
        %116 =   OpLoad %float %115
        %117 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2 %uint_2
        %118 =   OpLoad %float %117
        %119 =   OpFSub %float %116 %114
        %120 =   OpAccessChain %_ptr_Output_float %TANGENT %uint_2
                 OpStore %120 %119
        %121 =   OpFSub %float %118 %114
        %122 =   OpAccessChain %_ptr_Output_float %TANGENT_1 %uint_2
                 OpStore %122 %121
                 OpReturn
               OpFunctionEnd

