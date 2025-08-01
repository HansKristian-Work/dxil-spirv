SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
               OpCapability Shader
               OpCapability StorageImageWriteWithoutFormat
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint GLCompute %main "main" %8 %9 %10 %SV_DispatchThreadId %SV_GroupId %SV_GroupThreadId %gl_LocalInvocationIndex
               OpExecutionMode %main LocalSize 4 4 4
               OpName %main "main"
               OpName %SV_DispatchThreadId "SV_DispatchThreadId"
               OpName %SV_GroupId "SV_GroupId"
               OpName %SV_GroupThreadId "SV_GroupThreadId"
               OpDecorate %8 DescriptorSet 0
               OpDecorate %8 Binding 0
               OpDecorate %8 NonReadable
               OpDecorate %9 DescriptorSet 0
               OpDecorate %9 Binding 1
               OpDecorate %9 NonReadable
               OpDecorate %10 DescriptorSet 0
               OpDecorate %10 Binding 2
               OpDecorate %10 NonReadable
               OpDecorate %SV_DispatchThreadId BuiltIn GlobalInvocationId
               OpDecorate %SV_GroupId BuiltIn WorkgroupId
               OpDecorate %SV_GroupThreadId BuiltIn LocalInvocationId
               OpDecorate %gl_LocalInvocationIndex BuiltIn LocalInvocationIndex
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
          %6 = OpTypeImage %uint 3D 0 0 0 2 Unknown
%_ptr_UniformConstant_6 = OpTypePointer UniformConstant %6
          %8 = OpVariable %_ptr_UniformConstant_6 UniformConstant
          %9 = OpVariable %_ptr_UniformConstant_6 UniformConstant
         %10 = OpVariable %_ptr_UniformConstant_6 UniformConstant
     %v3uint = OpTypeVector %uint 3
%_ptr_Input_v3uint = OpTypePointer Input %v3uint
%SV_DispatchThreadId = OpVariable %_ptr_Input_v3uint Input
 %SV_GroupId = OpVariable %_ptr_Input_v3uint Input
%SV_GroupThreadId = OpVariable %_ptr_Input_v3uint Input
%_ptr_Input_uint = OpTypePointer Input %uint
%gl_LocalInvocationIndex = OpVariable %_ptr_Input_uint Input
     %v4uint = OpTypeVector %uint 4
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %54

         %54 = OpLabel
         %16 =   OpLoad %6 %8
         %17 =   OpLoad %6 %9
         %18 =   OpLoad %6 %10
         %21 =   OpLoad %uint %gl_LocalInvocationIndex
         %24 =   OpAccessChain %_ptr_Input_uint %SV_DispatchThreadId %uint_0
         %26 =   OpLoad %uint %24
         %27 =   OpAccessChain %_ptr_Input_uint %SV_DispatchThreadId %uint_1
         %29 =   OpLoad %uint %27
         %30 =   OpAccessChain %_ptr_Input_uint %SV_DispatchThreadId %uint_2
         %32 =   OpLoad %uint %30
         %34 =   OpAccessChain %_ptr_Input_uint %SV_GroupId %uint_0
         %35 =   OpLoad %uint %34
         %36 =   OpAccessChain %_ptr_Input_uint %SV_GroupId %uint_1
         %37 =   OpLoad %uint %36
         %38 =   OpAccessChain %_ptr_Input_uint %SV_GroupId %uint_2
         %39 =   OpLoad %uint %38
         %41 =   OpAccessChain %_ptr_Input_uint %SV_GroupThreadId %uint_0
         %42 =   OpLoad %uint %41
         %43 =   OpAccessChain %_ptr_Input_uint %SV_GroupThreadId %uint_1
         %44 =   OpLoad %uint %43
         %45 =   OpAccessChain %_ptr_Input_uint %SV_GroupThreadId %uint_2
         %46 =   OpLoad %uint %45
         %48 =   OpCompositeConstruct %v3uint %26 %29 %32
         %49 =   OpCompositeConstruct %v4uint %21 %21 %21 %21
                 OpImageWrite %16 %48 %49 NonPrivateTexel
         %50 =   OpCompositeConstruct %v3uint %35 %37 %39
         %51 =   OpCompositeConstruct %v4uint %21 %21 %21 %21
                 OpImageWrite %17 %50 %51 NonPrivateTexel
         %52 =   OpCompositeConstruct %v3uint %42 %44 %46
         %53 =   OpCompositeConstruct %v4uint %21 %21 %21 %21
                 OpImageWrite %18 %52 %53 NonPrivateTexel
                 OpReturn
               OpFunctionEnd

