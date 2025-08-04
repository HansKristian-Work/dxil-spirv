SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 16
; Schema: 0
               OpCapability Shader
               OpCapability DrawParameters
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %SV_VERTEXID %SHADER_OUT %11
               OpName %main "main"
               OpName %SV_VERTEXID "SV_VERTEXID"
               OpName %SHADER_OUT "SHADER_OUT"
               OpDecorate %SV_VERTEXID BuiltIn VertexIndex
               OpDecorate %SHADER_OUT Location 0
               OpDecorate %11 BuiltIn BaseVertex
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_VERTEXID = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
 %SHADER_OUT = OpVariable %_ptr_Output_uint Output
         %11 = OpVariable %_ptr_Input_uint Input
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %14

         %14 = OpLabel
         %10 =   OpLoad %uint %SV_VERTEXID
         %12 =   OpLoad %uint %11
         %13 =   OpISub %uint %10 %12
                 OpStore %SHADER_OUT %13
                 OpReturn
               OpFunctionEnd

