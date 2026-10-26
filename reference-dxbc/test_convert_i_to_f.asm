SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability Float64
               OpCapability Int64
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %UINPUT %SINPUT %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpExecutionMode %main SignedZeroInfNanPreserve 16
               OpExecutionMode %main SignedZeroInfNanPreserve 64
               OpName %main "main"
               OpName %UINPUT "UINPUT"
               OpName %SINPUT "SINPUT"
               OpName %SV_TARGET "SV_TARGET"
               OpName %SV_TARGET_1 "SV_TARGET_1"
               OpDecorate %UINPUT Flat
               OpDecorate %UINPUT Location 0
               OpDecorate %SINPUT Flat
               OpDecorate %SINPUT Location 0
               OpDecorate %SINPUT Component 1
               OpDecorate %SV_TARGET Location 0
               OpDecorate %SV_TARGET_1 Location 1
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
     %UINPUT = OpVariable %_ptr_Input_uint Input
        %int = OpTypeInt 32 1
%_ptr_Input_int = OpTypePointer Input %int
     %SINPUT = OpVariable %_ptr_Input_int Input
      %float = OpTypeFloat 32
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%SV_TARGET_1 = OpVariable %_ptr_Output_float Output
      %ulong = OpTypeInt 64 0
       %half = OpTypeFloat 16
     %double = OpTypeFloat 64
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %38

         %38 = OpLabel
         %15 =   OpLoad %uint %UINPUT
         %16 =   OpLoad %int %SINPUT
         %17 =   OpBitcast %uint %16
         %19 =   OpUConvert %ulong %15
         %20 =   OpConvertUToF %float %19
         %21 =   OpConvertSToF %float %17
         %22 =   OpUConvert %ulong %15
         %23 =   OpConvertUToF %half %22
         %25 =   OpFConvert %float %23
         %26 =   OpFAdd %float %20 %25
         %27 =   OpConvertSToF %half %17
         %28 =   OpFConvert %float %27
         %29 =   OpFAdd %float %21 %28
         %30 =   OpUConvert %ulong %15
         %31 =   OpConvertUToF %double %30
         %33 =   OpFConvert %float %31
         %34 =   OpFAdd %float %26 %33
         %35 =   OpConvertSToF %double %17
         %36 =   OpFConvert %float %35
         %37 =   OpFAdd %float %29 %36
                 OpStore %SV_TARGET %34
                 OpStore %SV_TARGET_1 %37
                 OpReturn
               OpFunctionEnd

