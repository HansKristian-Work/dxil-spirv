SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
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
     %uint_0 = OpConstant %uint 0
    %float_1 = OpConstant %float 1
       %bool = OpTypeBool
%float_10000 = OpConstant %float 10000
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %22

         %22 = OpLabel
         %12 =   OpAccessChain %_ptr_Input_float %SV_POSITION %uint_0
         %15 =   OpLoad %float %12
                 OpBranch %23

         %23 = OpLabel
         %16 =   OpPhi %float %15 %22 %17 %26
                 OpLoopMerge %28 %26 None
                 OpBranch %24

         %24 =     OpLabel
         %17 =       OpFAdd %float %16 %float_1
         %20 =       OpFOrdGreaterThanEqual %bool %17 %float_10000
                     OpSelectionMerge %25 None
                     OpBranchConditional %20 %27 %25

         %27 =         OpLabel
                         OpStore %SV_TARGET %17
                         OpReturn

         %25 =     OpLabel
                     OpBranch %26

         %26 =   OpLabel
                   OpBranch %23

         %28 = OpLabel
                 OpUnreachable
               OpFunctionEnd

