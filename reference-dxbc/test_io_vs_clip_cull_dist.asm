SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
               OpCapability Shader
               OpCapability ClipDistance
               OpCapability CullDistance
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %gl_ClipDistance %gl_CullDistance
               OpName %main "main"
               OpDecorate %gl_ClipDistance BuiltIn ClipDistance
               OpDecorate %gl_CullDistance BuiltIn CullDistance
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
       %uint = OpTypeInt 32 0
     %uint_7 = OpConstant %uint 7
%_arr_float_uint_7 = OpTypeArray %float %uint_7
%_ptr_Output__arr_float_uint_7 = OpTypePointer Output %_arr_float_uint_7
%gl_ClipDistance = OpVariable %_ptr_Output__arr_float_uint_7 Output
     %uint_1 = OpConstant %uint 1
%_arr_float_uint_1 = OpTypeArray %float %uint_1
%_ptr_Output__arr_float_uint_1 = OpTypePointer Output %_arr_float_uint_1
%gl_CullDistance = OpVariable %_ptr_Output__arr_float_uint_1 Output
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
 %float_n2_5 = OpConstant %float -2.5
 %float_n1_5 = OpConstant %float -1.5
     %uint_2 = OpConstant %uint 2
 %float_n0_5 = OpConstant %float -0.5
     %uint_3 = OpConstant %uint 3
  %float_0_5 = OpConstant %float 0.5
     %uint_4 = OpConstant %uint 4
  %float_1_5 = OpConstant %float 1.5
     %uint_5 = OpConstant %uint 5
  %float_2_5 = OpConstant %float 2.5
     %uint_6 = OpConstant %uint 6
  %float_3_5 = OpConstant %float 3.5
   %float_n2 = OpConstant %float -2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %38

         %38 = OpLabel
         %16 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_0
                 OpStore %16 %float_n2_5
         %19 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_1
                 OpStore %19 %float_n1_5
         %21 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_2
                 OpStore %21 %float_n0_5
         %24 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_3
                 OpStore %24 %float_0_5
         %27 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_4
                 OpStore %27 %float_1_5
         %30 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_5
                 OpStore %30 %float_2_5
         %33 =   OpAccessChain %_ptr_Output_float %gl_ClipDistance %uint_6
                 OpStore %33 %float_3_5
         %36 =   OpAccessChain %_ptr_Output_float %gl_CullDistance %uint_0
                 OpStore %36 %float_n2
                 OpReturn
               OpFunctionEnd

