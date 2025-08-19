SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 31
; Schema: 0
               OpCapability Shader
               OpCapability SignedZeroInfNanPreserve
               OpCapability VulkanMemoryModel
               OpExtension "SPV_KHR_float_controls"
         %17 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %INPUT %SV_TARGET
               OpExecutionMode %main OriginUpperLeft
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %INPUT "INPUT"
               OpName %SV_TARGET "SV_TARGET"
               OpName %_ ""
               OpDecorate %INPUT Location 0
               OpDecorate %SV_TARGET Location 0
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
%_ptr_Input_float = OpTypePointer Input %float
      %INPUT = OpVariable %_ptr_Input_float Input
%_ptr_Output_float = OpTypePointer Output %float
  %SV_TARGET = OpVariable %_ptr_Output_float Output
         %10 = OpTypeFunction %float %float
       %bool = OpTypeBool
    %float_0 = OpConstant %float 0
         %20 = OpUndef %float
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %25

         %25 = OpLabel
         %21 =   OpLoad %float %INPUT
         %22 =   OpFOrdGreaterThanEqual %bool %21 %float_0
         %23 =   OpFunctionCall %float %_ %21
         %24 =   OpSelect %float %22 %23 %20
                 OpStore %SV_TARGET %24
                 OpReturn
               OpFunctionEnd
          %_ = OpFunction %float None %10
         %11 = OpFunctionParameter %float

         %13 = OpLabel
                 OpBranch %27

         %27 = OpLabel
         %15 =   OpFOrdGreaterThanEqual %bool %11 %float_0
                 OpSelectionMerge %29 None
                 OpBranchConditional %15 %28 %29

         %28 =     OpLabel
         %18 =       OpExtInst %float %17 Sqrt %11
                     OpBranch %29

         %29 = OpLabel
         %19 =   OpPhi %float %20 %27 %18 %28
                 OpReturnValue %19
               OpFunctionEnd

