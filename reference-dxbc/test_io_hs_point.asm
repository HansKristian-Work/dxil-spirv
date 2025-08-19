SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
               OpCapability Shader
               OpCapability Tessellation
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %84 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint TessellationControl %main "main" %SV_POSITION %NORMAL %FACTOR %SV_POSITION_0 %NORMAL_0 %INSTANCE_ID %TANGENT %TANGENT_1 %SV_TESSFACTOR %SV_INSIDETESSFACTOR %gl_InvocationID %gl_PrimitiveID
               OpExecutionMode %main Triangles
               OpExecutionMode %main SpacingEqual
               OpExecutionMode %main PointMode
               OpExecutionMode %main OutputVertices 4
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %NORMAL "NORMAL"
               OpName %FACTOR "FACTOR"
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
               OpDecorate %gl_PrimitiveID BuiltIn PrimitiveId
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
%_ptr_Input_uint = OpTypePointer Input %uint
%gl_InvocationID = OpVariable %_ptr_Input_uint Input
%_ptr_Input_float = OpTypePointer Input %float
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
%_ptr_Output_float = OpTypePointer Output %float
%gl_PrimitiveID = OpVariable %_ptr_Input_uint Input
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

         %39 = OpLabel
                 OpBranch %133

        %133 = OpLabel
         %44 =   OpLoad %uint %gl_InvocationID
         %46 =   OpAccessChain %_ptr_Input_float %SV_POSITION %44 %uint_0
         %48 =   OpLoad %float %46
         %49 =   OpAccessChain %_ptr_Input_float %SV_POSITION %44 %uint_1
         %51 =   OpLoad %float %49
         %52 =   OpAccessChain %_ptr_Input_float %SV_POSITION %44 %uint_2
         %53 =   OpLoad %float %52
         %54 =   OpAccessChain %_ptr_Input_float %SV_POSITION %44 %uint_3
         %56 =   OpLoad %float %54
         %60 =   OpLoad %uint %gl_InvocationID
         %59 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %60 %uint_0
                 OpStore %59 %48
         %62 =   OpLoad %uint %gl_InvocationID
         %61 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %62 %uint_1
                 OpStore %61 %51
         %64 =   OpLoad %uint %gl_InvocationID
         %63 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %64 %uint_2
                 OpStore %63 %53
         %66 =   OpLoad %uint %gl_InvocationID
         %65 =   OpAccessChain %_ptr_Output_float %SV_POSITION_0 %66 %uint_3
                 OpStore %65 %56
         %67 =   OpAccessChain %_ptr_Input_float %NORMAL %44 %uint_0
         %68 =   OpLoad %float %67
         %69 =   OpAccessChain %_ptr_Input_float %NORMAL %44 %uint_1
         %70 =   OpLoad %float %69
         %71 =   OpAccessChain %_ptr_Input_float %NORMAL %44 %uint_2
         %72 =   OpLoad %float %71
         %75 =   OpLoad %uint %gl_InvocationID
         %74 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %75 %uint_0
                 OpStore %74 %68
         %77 =   OpLoad %uint %gl_InvocationID
         %76 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %77 %uint_1
                 OpStore %76 %70
         %79 =   OpLoad %uint %gl_InvocationID
         %78 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %79 %uint_2
                 OpStore %78 %72
                 OpReturn
               OpFunctionEnd
 %patch_main = OpFunction %void None %2

         %41 = OpLabel
                 OpBranch %135

        %135 = OpLabel
         %81 =   OpLoad %uint %gl_PrimitiveID
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

