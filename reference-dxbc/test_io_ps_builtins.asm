SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
               OpCapability Shader
               OpCapability SampleRateShading
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Fragment %main "main" %SV_ISFRONTFACE %SV_SAMPLEINDEX %SV_COVERAGE %gl_SampleMask
               OpExecutionMode %main OriginUpperLeft
               OpName %main "main"
               OpName %SV_ISFRONTFACE "SV_ISFRONTFACE"
               OpName %SV_SAMPLEINDEX "SV_SAMPLEINDEX"
               OpName %SV_COVERAGE "SV_COVERAGE"
               OpDecorate %SV_ISFRONTFACE BuiltIn FrontFacing
               OpDecorate %SV_SAMPLEINDEX BuiltIn SampleId
               OpDecorate %SV_SAMPLEINDEX Flat
               OpDecorate %SV_COVERAGE BuiltIn SampleMask
               OpDecorate %gl_SampleMask BuiltIn SampleMask
               OpDecorate %gl_SampleMask Flat
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
       %bool = OpTypeBool
%_ptr_Input_bool = OpTypePointer Input %bool
%SV_ISFRONTFACE = OpVariable %_ptr_Input_bool Input
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_SAMPLEINDEX = OpVariable %_ptr_Input_uint Input
     %uint_1 = OpConstant %uint 1
%_arr_uint_uint_1 = OpTypeArray %uint %uint_1
%_ptr_Output__arr_uint_uint_1 = OpTypePointer Output %_arr_uint_uint_1
%SV_COVERAGE = OpVariable %_ptr_Output__arr_uint_uint_1 Output
%_ptr_Input__arr_uint_uint_1 = OpTypePointer Input %_arr_uint_uint_1
%gl_SampleMask = OpVariable %_ptr_Input__arr_uint_uint_1 Input
     %uint_0 = OpConstant %uint 0
%_ptr_Output_uint = OpTypePointer Output %uint
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %26

         %26 = OpLabel
         %17 =   OpAccessChain %_ptr_Input_uint %gl_SampleMask %uint_0
         %19 =   OpLoad %uint %17
         %20 =   OpLoad %uint %SV_SAMPLEINDEX
         %21 =   OpBitFieldUExtract %uint %19 %uint_0 %20
         %22 =   OpLoad %bool %SV_ISFRONTFACE
         %23 =   OpSelect %uint %22 %21 %uint_0
         %25 =   OpAccessChain %_ptr_Output_uint %SV_COVERAGE %uint_0
                 OpStore %25 %23
                 OpReturn
               OpFunctionEnd

