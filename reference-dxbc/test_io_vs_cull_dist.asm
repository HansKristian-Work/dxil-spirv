SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 20
; Schema: 0
               OpCapability Shader
               OpCapability CullDistance
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %gl_CullDistance
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpDecorate %gl_CullDistance BuiltIn CullDistance
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
       %uint = OpTypeInt 32 0
     %uint_2 = OpConstant %uint 2
%_arr_float_uint_2 = OpTypeArray %float %uint_2
%_ptr_Output__arr_float_uint_2 = OpTypePointer Output %_arr_float_uint_2
%gl_CullDistance = OpVariable %_ptr_Output__arr_float_uint_2 Output
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
%float_0_699999988 = OpConstant %float 0.699999988
     %uint_1 = OpConstant %uint 1
%float_0_100000001 = OpConstant %float 0.100000001
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %18

         %18 = OpLabel
         %12 =   OpAccessChain %_ptr_Output_float %gl_CullDistance %uint_0
                 OpStore %12 %float_0_699999988
         %15 =   OpAccessChain %_ptr_Output_float %gl_CullDistance %uint_1
                 OpStore %15 %float_0_100000001
                 OpReturn
               OpFunctionEnd

