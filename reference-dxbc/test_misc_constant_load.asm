SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
               OpCapability Shader
               OpCapability DrawParameters
               OpCapability VulkanMemoryModel
         %27 = OpExtInstImport "GLSL.std.450"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %SV_VERTEXID %SV_POSITION %22 %24
               OpName %main "main"
               OpName %SV_VERTEXID "SV_VERTEXID"
               OpName %SV_POSITION "SV_POSITION"
               OpDecorate %SV_VERTEXID BuiltIn VertexIndex
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %24 BuiltIn BaseVertex
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_VERTEXID = OpVariable %_ptr_Input_uint Input
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION = OpVariable %_ptr_Output_v4float Output
     %uint_5 = OpConstant %uint 5
%_arr_v4float_uint_5 = OpTypeArray %v4float %uint_5
    %float_0 = OpConstant %float 0
         %15 = OpConstantComposite %v4float %float_0 %float_0 %float_0 %float_0
    %float_1 = OpConstant %float 1
         %17 = OpConstantComposite %v4float %float_0 %float_1 %float_0 %float_0
         %18 = OpConstantComposite %v4float %float_1 %float_0 %float_0 %float_0
         %19 = OpConstantComposite %v4float %float_1 %float_1 %float_0 %float_0
         %20 = OpConstantComposite %_arr_v4float_uint_5 %15 %17 %18 %19 %15
%_ptr_Private__arr_v4float_uint_5 = OpTypePointer Private %_arr_v4float_uint_5
         %22 = OpVariable %_ptr_Private__arr_v4float_uint_5 Private %20
         %24 = OpVariable %_ptr_Input_uint Input
     %uint_4 = OpConstant %uint 4
%_ptr_Private_v4float = OpTypePointer Private %v4float
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
     %uint_1 = OpConstant %uint 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %46

         %46 = OpLabel
         %23 =   OpLoad %uint %SV_VERTEXID
         %25 =   OpLoad %uint %24
         %26 =   OpISub %uint %23 %25
         %28 =   OpExtInst %uint %27 UMin %26 %uint_4
         %31 =   OpInBoundsAccessChain %_ptr_Private_v4float %22 %28
         %32 =   OpLoad %v4float %31
         %33 =   OpCompositeExtract %float %32 0
         %35 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_0
                 OpStore %35 %33
         %37 =   OpCompositeExtract %float %32 1
         %38 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_1
                 OpStore %38 %37
         %40 =   OpCompositeExtract %float %32 2
         %41 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_2
                 OpStore %41 %40
         %43 =   OpCompositeExtract %float %32 3
         %44 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_3
                 OpStore %44 %43
                 OpReturn
               OpFunctionEnd

