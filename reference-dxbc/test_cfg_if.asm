SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_POSITION %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %SV_TARGET "SV_TARGET"
               OpDecorate %SV_POSITION BuiltIn FragCoord
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Input_v4float = OpTypePointer Input %v4float
%SV_POSITION = OpVariable %_ptr_Input_v4float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
%_ptr_Input_float = OpTypePointer Input %float
       %uint = OpTypeInt 32 0
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %bool = OpTypeBool
    %float_0 = OpConstant %float 0
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %24

         %24 = OpLabel
         %12 =   OpAccessChain %_ptr_Input_float %SV_POSITION %uint_2
         %15 =   OpLoad %float %12
         %16 =   OpAccessChain %_ptr_Input_float %SV_POSITION %uint_3
         %18 =   OpLoad %float %16
         %20 =   OpFUnordNotEqual %bool %18 %float_0
                 OpSelectionMerge %26 None
                 OpBranchConditional %20 %25 %26

         %25 =     OpLabel
         %22 =       OpFDiv %float %15 %18
                     OpBranch %26

         %26 = OpLabel
         %23 =   OpPhi %float %15 %24 %22 %25
                 OpStore %SV_TARGET %23
                 OpReturn
               OpFunctionEnd

