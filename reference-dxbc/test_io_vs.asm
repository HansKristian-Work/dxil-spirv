SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
               OpCapability Shader
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %POSITION %NORMAL %TANGENT %TANGENT_1 %COLOR_1 %SV_POSITION %NORMAL_0 %COLOR %TANGENT_0 %TANGENT_1_0
               OpName %main "main"
               OpName %POSITION "POSITION"
               OpName %NORMAL "NORMAL"
               OpName %TANGENT "TANGENT"
               OpName %TANGENT_1 "TANGENT_1"
               OpName %COLOR_1 "COLOR_1"
               OpName %SV_POSITION "SV_POSITION"
               OpName %NORMAL_0 "NORMAL"
               OpName %COLOR "COLOR"
               OpName %TANGENT_0 "TANGENT"
               OpName %TANGENT_1_0 "TANGENT_1"
               OpDecorate %POSITION Location 0
               OpDecorate %NORMAL Location 1
               OpDecorate %TANGENT Location 2
               OpDecorate %TANGENT_1 Location 3
               OpDecorate %COLOR_1 Location 4
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %NORMAL_0 Location 1
               OpDecorate %COLOR Location 1
               OpDecorate %COLOR Component 3
               OpDecorate %TANGENT_0 Location 2
               OpDecorate %TANGENT_1_0 Location 3
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v3float = OpTypeVector %float 3
%_ptr_Input_v3float = OpTypePointer Input %v3float
   %POSITION = OpVariable %_ptr_Input_v3float Input
     %NORMAL = OpVariable %_ptr_Input_v3float Input
    %TANGENT = OpVariable %_ptr_Input_v3float Input
  %TANGENT_1 = OpVariable %_ptr_Input_v3float Input
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
    %COLOR_1 = OpVariable %_ptr_Input_uint Input
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_v3float = OpTypePointer Output %v3float
   %NORMAL_0 = OpVariable %_ptr_Output_v3float Output
%_ptr_Output_uint = OpTypePointer Output %uint
      %COLOR = OpVariable %_ptr_Output_uint Output
  %TANGENT_0 = OpVariable %_ptr_Output_v3float Output
%TANGENT_1_0 = OpVariable %_ptr_Output_v3float Output
%_ptr_Input_float = OpTypePointer Input %float
     %uint_2 = OpConstant %uint 2
     %uint_1 = OpConstant %uint 1
     %uint_0 = OpConstant %uint 0
    %float_1 = OpConstant %float 1
%_ptr_Output_float = OpTypePointer Output %float
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %72

         %72 = OpLabel
         %25 =   OpAccessChain %_ptr_Input_float %POSITION %uint_2
         %27 =   OpLoad %float %25
         %28 =   OpAccessChain %_ptr_Input_float %POSITION %uint_1
         %30 =   OpLoad %float %28
         %31 =   OpAccessChain %_ptr_Input_float %POSITION %uint_0
         %33 =   OpLoad %float %31
         %37 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_0
                 OpStore %37 %33
         %38 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_1
                 OpStore %38 %30
         %39 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_2
                 OpStore %39 %27
         %40 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_3
                 OpStore %40 %float_1
         %42 =   OpAccessChain %_ptr_Input_float %NORMAL %uint_0
         %43 =   OpLoad %float %42
         %44 =   OpAccessChain %_ptr_Input_float %NORMAL %uint_1
         %45 =   OpLoad %float %44
         %46 =   OpAccessChain %_ptr_Input_float %NORMAL %uint_2
         %47 =   OpLoad %float %46
         %49 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_0
                 OpStore %49 %43
         %50 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_1
                 OpStore %50 %45
         %51 =   OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_2
                 OpStore %51 %47
         %52 =   OpLoad %uint %COLOR_1
                 OpStore %COLOR %52
         %53 =   OpAccessChain %_ptr_Input_float %TANGENT %uint_0
         %54 =   OpLoad %float %53
         %55 =   OpAccessChain %_ptr_Input_float %TANGENT %uint_1
         %56 =   OpLoad %float %55
         %57 =   OpAccessChain %_ptr_Input_float %TANGENT %uint_2
         %58 =   OpLoad %float %57
         %60 =   OpAccessChain %_ptr_Output_float %TANGENT_0 %uint_0
                 OpStore %60 %54
         %61 =   OpAccessChain %_ptr_Output_float %TANGENT_0 %uint_1
                 OpStore %61 %56
         %62 =   OpAccessChain %_ptr_Output_float %TANGENT_0 %uint_2
                 OpStore %62 %58
         %63 =   OpAccessChain %_ptr_Input_float %TANGENT_1 %uint_0
         %64 =   OpLoad %float %63
         %65 =   OpAccessChain %_ptr_Output_float %TANGENT_1_0 %uint_0
                 OpStore %65 %64
         %66 =   OpAccessChain %_ptr_Input_float %TANGENT_1 %uint_1
         %67 =   OpLoad %float %66
         %68 =   OpAccessChain %_ptr_Output_float %TANGENT_1_0 %uint_1
                 OpStore %68 %67
         %69 =   OpAccessChain %_ptr_Input_float %TANGENT_1 %uint_2
         %70 =   OpLoad %float %69
         %71 =   OpAccessChain %_ptr_Output_float %TANGENT_1_0 %uint_2
                 OpStore %71 %70
                 OpReturn
               OpFunctionEnd

