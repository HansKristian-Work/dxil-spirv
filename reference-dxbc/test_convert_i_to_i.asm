SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
               OpCapability Shader
               OpCapability Int64
               OpCapability Int16
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %INPUT %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %INPUT "INPUT"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %INPUT Flat
               OpDecorate %INPUT Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
      %INPUT = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
  %SV_TARGET = OpVariable %_ptr_Output_uint Output
     %ushort = OpTypeInt 16 0
      %ulong = OpTypeInt 64 0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %33

         %33 = OpLabel
         %10 =   OpLoad %uint %INPUT
         %12 =   OpUConvert %ushort %10
         %14 =   OpUConvert %ulong %12
         %15 =   OpUConvert %uint %14
         %16 =   OpUConvert %ulong %15
         %17 =   OpUConvert %ushort %16
         %18 =   OpUConvert %uint %17
         %19 =   OpSConvert %ulong %18
         %20 =   OpUConvert %ushort %19
         %21 =   OpSConvert %ulong %20
         %22 =   OpUConvert %uint %21
         %23 =   OpUConvert %ushort %22
         %24 =   OpSConvert %uint %23
         %25 =   OpSConvert %ulong %24
         %26 =   OpUConvert %uint %25
         %27 =   OpUConvert %ushort %26
         %28 =   OpUConvert %uint %27
         %29 =   OpUConvert %ushort %28
         %30 =   OpUConvert %ulong %29
         %31 =   OpUConvert %ushort %30
         %32 =   OpUConvert %uint %31
                 OpStore %SV_TARGET %32
                 OpReturn
               OpFunctionEnd

