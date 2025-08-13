SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability MultiViewport
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %SV_POSITION %SV_RenderTargetArrayIndex %SV_ViewportArrayIndex %SV_PrimitiveId %gl_InvocationID %gl_PrimitiveID
               OpExecutionMode %main Invocations 12
               OpExecutionMode %main OutputVertices 1
               OpExecutionMode %main InputPoints
               OpExecutionMode %main OutputPoints
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %SV_RenderTargetArrayIndex "SV_RenderTargetArrayIndex"
               OpName %SV_ViewportArrayIndex "SV_ViewportArrayIndex"
               OpName %SV_PrimitiveId "SV_PrimitiveId"
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %SV_RenderTargetArrayIndex BuiltIn Layer
               OpDecorate %SV_ViewportArrayIndex BuiltIn ViewportIndex
               OpDecorate %SV_PrimitiveId BuiltIn PrimitiveId
               OpDecorate %gl_InvocationID BuiltIn InvocationId
               OpDecorate %gl_PrimitiveID BuiltIn PrimitiveId
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION = OpVariable %_ptr_Output_v4float Output
       %uint = OpTypeInt 32 0
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_RenderTargetArrayIndex = OpVariable %_ptr_Output_uint Output
%SV_ViewportArrayIndex = OpVariable %_ptr_Output_uint Output
%SV_PrimitiveId = OpVariable %_ptr_Output_uint Output
%_ptr_Input_uint = OpTypePointer Input %uint
%gl_InvocationID = OpVariable %_ptr_Input_uint Input
%gl_PrimitiveID = OpVariable %_ptr_Input_uint Input
    %uint_12 = OpConstant %uint 12
     %uint_1 = OpConstant %uint 1
%_ptr_Output_float = OpTypePointer Output %float
     %uint_0 = OpConstant %uint 0
    %float_1 = OpConstant %float 1
     %uint_2 = OpConstant %uint 2
     %uint_3 = OpConstant %uint 3
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %34

         %34 = OpLabel
         %16 =   OpLoad %uint %gl_InvocationID
         %18 =   OpLoad %uint %gl_PrimitiveID
         %19 =   OpIMul %uint %18 %uint_12
         %21 =   OpIAdd %uint %16 %19
                 OpStore %SV_PrimitiveId %21
         %22 =   OpShiftRightLogical %uint %16 %uint_1
                 OpStore %SV_RenderTargetArrayIndex %22
         %24 =   OpBitwiseAnd %uint %16 %uint_1
                 OpStore %SV_ViewportArrayIndex %24
         %26 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_0
                 OpStore %26 %float_1
         %29 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_1
                 OpStore %29 %float_1
         %30 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_2
                 OpStore %30 %float_1
         %32 =   OpAccessChain %_ptr_Output_float %SV_POSITION %uint_3
                 OpStore %32 %float_1
                 OpEmitVertex
                 OpEndPrimitive
                 OpReturn
               OpFunctionEnd

