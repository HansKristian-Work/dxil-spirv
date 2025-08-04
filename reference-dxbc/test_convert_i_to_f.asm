SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
               OpCapability Shader
               OpCapability Float16
               OpCapability Float64
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %UINPUT %SINPUT %SV_TARGET %SV_TARGET_1
               OpExecutionMode %main OriginUpperLeft
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
       %half = OpTypeFloat 16
     %double = OpTypeFloat 64
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %34

         %34 = OpLabel
         %15 =   OpLoad %uint %UINPUT
         %16 =   OpLoad %int %SINPUT
         %17 =   OpBitcast %uint %16
         %18 =   OpConvertUToF %float %15
         %19 =   OpConvertSToF %float %17
         %21 =   OpConvertUToF %half %15
         %22 =   OpFConvert %float %21
         %23 =   OpFAdd %float %18 %22
         %24 =   OpConvertSToF %half %17
         %25 =   OpFConvert %float %24
         %26 =   OpFAdd %float %19 %25
         %28 =   OpConvertUToF %double %15
         %29 =   OpFConvert %float %28
         %30 =   OpFAdd %float %23 %29
         %31 =   OpConvertSToF %double %17
         %32 =   OpFConvert %float %31
         %33 =   OpFAdd %float %26 %32
                 OpStore %SV_TARGET %30
                 OpStore %SV_TARGET_1 %33
                 OpReturn
               OpFunctionEnd

