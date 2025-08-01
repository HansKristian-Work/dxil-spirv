SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
               OpCapability Shader
               OpCapability ClipDistance
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %gl_ClipDistance
               OpName %main "main"
               OpDecorate %gl_ClipDistance BuiltIn ClipDistance
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
       %uint = OpTypeInt 32 0
     %uint_6 = OpConstant %uint 6
%_arr_float_uint_6 = OpTypeArray %float %uint_6
%_ptr_Output__arr_float_uint_6 = OpTypePointer Output %_arr_float_uint_6
%gl_ClipDistance = OpVariable %_ptr_Output__arr_float_uint_6 Output
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
 %float_n2_5 = OpConstant %float -2.5
     %uint_1 = OpConstant %uint 1
 %float_n1_5 = OpConstant %float -1.5
     %uint_2 = OpConstant %uint 2
 %float_n0_5 = OpConstant %float -0.5
     %uint_3 = OpConstant %uint 3
  %float_0_5 = OpConstant %float 0.5
     %uint_4 = OpConstant %uint 4
  %float_1_5 = OpConstant %float 1.5
     %uint_5 = OpConstant %uint 5
  %float_2_5 = OpConstant %float 2.5
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %30

         %30 = OpLabel
         %12 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_0
                 OpStore %12 %float_n2_5
         %15 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_1
                 OpStore %15 %float_n1_5
         %18 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_2
                 OpStore %18 %float_n0_5
         %21 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_3
                 OpStore %21 %float_0_5
         %24 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_4
                 OpStore %24 %float_1_5
         %27 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_5
                 OpStore %27 %float_2_5
                 OpReturn
               OpFunctionEnd

