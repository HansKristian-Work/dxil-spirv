SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 16
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability DrawParameters
               OpCapability SignedZeroInfNanPreserve
               OpCapability ShaderViewportIndexLayerEXT
               OpCapability VulkanMemoryModel
               OpExtension "SPV_EXT_shader_viewport_index_layer"
               OpExtension "SPV_KHR_float_controls"
               OpMemoryModel Logical Vulkan
               OpEntryPoint Vertex %main "main" %SV_INSTANCEID %SV_RenderTargetArrayIndex %gl_BaseInstance
               OpExecutionMode %main SignedZeroInfNanPreserve 32
               OpName %main "main"
               OpName %SV_INSTANCEID "SV_INSTANCEID"
               OpName %SV_RenderTargetArrayIndex "SV_RenderTargetArrayIndex"
               OpDecorate %SV_INSTANCEID BuiltIn InstanceIndex
               OpDecorate %SV_RenderTargetArrayIndex BuiltIn Layer
               OpDecorate %gl_BaseInstance BuiltIn BaseInstance
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
       %uint = OpTypeInt 32 0
%_ptr_Input_uint = OpTypePointer Input %uint
%SV_INSTANCEID = OpVariable %_ptr_Input_uint Input
%_ptr_Output_uint = OpTypePointer Output %uint
%SV_RenderTargetArrayIndex = OpVariable %_ptr_Output_uint Output
%gl_BaseInstance = OpVariable %_ptr_Input_uint Input
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %14

         %14 = OpLabel
         %10 =   OpLoad %uint %SV_INSTANCEID
         %12 =   OpLoad %uint %gl_BaseInstance
         %13 =   OpISub %uint %10 %12
                 OpStore %SV_RenderTargetArrayIndex %13
                 OpReturn
               OpFunctionEnd

