SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability Float64
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %INPUT %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 16
               OpExecutionMode %main SignedZeroInfNanPreserve 64
               OpName %main "main"
               OpName %INPUT "INPUT"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %INPUT Location 0
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
%_ptr_Input_float = OpTypePointer Input %float
      %INPUT = OpVariable %_ptr_Input_float Input
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
        %int = OpTypeInt 32 1
%_ptr_Output_int = OpTypePointer Output %int
%SV_TARGET_1 = OpVariable %_ptr_Output_int Output
     %double = OpTypeFloat 64
       %half = OpTypeFloat 16
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %32

         %32 = OpLabel
         %14 =   OpLoad %float %INPUT
         %15 =   OpConvertFToU %uint %14
         %16 =   OpConvertFToS %uint %14
         %18 =   OpFConvert %double %14
         %19 =   OpConvertFToU %uint %18
         %20 =   OpIAdd %uint %15 %19
         %21 =   OpFConvert %double %14
         %22 =   OpConvertFToS %uint %21
         %23 =   OpIAdd %uint %16 %22
         %25 =   OpFConvert %half %14
         %26 =   OpConvertFToU %uint %25
         %27 =   OpIAdd %uint %20 %26
         %28 =   OpFConvert %half %14
         %29 =   OpConvertFToS %uint %28
         %30 =   OpIAdd %uint %23 %29
                 OpStore %SV_TARGET %27
         %31 =   OpBitcast %int %30
                 OpStore %SV_TARGET_1 %31
                 OpReturn
               OpFunctionEnd

