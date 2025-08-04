SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability ClipDistance
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %SV_POSITION %TEXCOORD %NORMAL %gl_ClipDistance %SV_POSITION_0 %TEXCOORD_0 %NORMAL_0 %gl_ClipDistance_0
               OpExecutionMode %main Invocations 1
               OpExecutionMode %main OutputVertices 2
               OpExecutionMode %main InputLines
               OpExecutionMode %main OutputLineStrip
               OpName %main "main"
               OpName %SV_POSITION "SV_POSITION"
               OpName %TEXCOORD "TEXCOORD"
               OpName %NORMAL "NORMAL"
               OpName %SV_POSITION_0 "SV_POSITION"
               OpName %TEXCOORD_0 "TEXCOORD"
               OpName %NORMAL_0 "NORMAL"
               OpDecorate %SV_POSITION BuiltIn Position
               OpDecorate %TEXCOORD Location 2
               OpDecorate %NORMAL Location 3
               OpDecorate %gl_ClipDistance BuiltIn ClipDistance
               OpDecorate %SV_POSITION_0 BuiltIn Position
               OpDecorate %TEXCOORD_0 Location 2
               OpDecorate %NORMAL_0 Location 3
               OpDecorate %gl_ClipDistance_0 BuiltIn ClipDistance
       %void = OpTypeVoid
          %2 = OpTypeFunction %void
      %float = OpTypeFloat 32
    %v4float = OpTypeVector %float 4
       %uint = OpTypeInt 32 0
     %uint_2 = OpConstant %uint 2
%_arr_v4float_uint_2 = OpTypeArray %v4float %uint_2
%_ptr_Input__arr_v4float_uint_2 = OpTypePointer Input %_arr_v4float_uint_2
%SV_POSITION = OpVariable %_ptr_Input__arr_v4float_uint_2 Input
%_arr_float_uint_2 = OpTypeArray %float %uint_2
    %v2float = OpTypeVector %float 2
%_arr_v2float_uint_2 = OpTypeArray %v2float %uint_2
%_ptr_Input__arr_v2float_uint_2 = OpTypePointer Input %_arr_v2float_uint_2
   %TEXCOORD = OpVariable %_ptr_Input__arr_v2float_uint_2 Input
    %v3float = OpTypeVector %float 3
%_arr_v3float_uint_2 = OpTypeArray %v3float %uint_2
%_ptr_Input__arr_v3float_uint_2 = OpTypePointer Input %_arr_v3float_uint_2
     %NORMAL = OpVariable %_ptr_Input__arr_v3float_uint_2 Input
%_arr__arr_float_uint_2_uint_2 = OpTypeArray %_arr_float_uint_2 %uint_2
%_ptr_Input__arr__arr_float_uint_2_uint_2 = OpTypePointer Input %_arr__arr_float_uint_2_uint_2
%gl_ClipDistance = OpVariable %_ptr_Input__arr__arr_float_uint_2_uint_2 Input
%_ptr_Output_v4float = OpTypePointer Output %v4float
%SV_POSITION_0 = OpVariable %_ptr_Output_v4float Output
%_ptr_Output_v2float = OpTypePointer Output %v2float
 %TEXCOORD_0 = OpVariable %_ptr_Output_v2float Output
%_ptr_Output_v3float = OpTypePointer Output %v3float
   %NORMAL_0 = OpVariable %_ptr_Output_v3float Output
%_ptr_Output__arr_float_uint_2 = OpTypePointer Output %_arr_float_uint_2
%gl_ClipDistance_0 = OpVariable %_ptr_Output__arr_float_uint_2 Output
     %uint_0 = OpConstant %uint 0
%_ptr_Input_float = OpTypePointer Input %float
     %uint_1 = OpConstant %uint 1
     %uint_3 = OpConstant %uint 3
%_ptr_Output_float = OpTypePointer Output %float
     %v2uint = OpTypeVector %uint 2
       %bool = OpTypeBool
       %main = OpFunction %void None %2

          %4 = OpLabel
                 OpBranch %81

         %81 = OpLabel
                 OpBranch %82

         %82 = OpLabel
         %32 =   OpPhi %uint %uint_0 %81 %34 %84
                 OpLoopMerge %85 %84 None
                 OpBranch %83

         %83 =     OpLabel
         %36 =       OpAccessChain %_ptr_Input_float %SV_POSITION %32 %uint_0
         %37 =       OpLoad %float %36
         %38 =       OpAccessChain %_ptr_Input_float %SV_POSITION %32 %uint_1
         %40 =       OpLoad %float %38
         %41 =       OpAccessChain %_ptr_Input_float %SV_POSITION %32 %uint_2
         %42 =       OpLoad %float %41
         %43 =       OpAccessChain %_ptr_Input_float %SV_POSITION %32 %uint_3
         %45 =       OpLoad %float %43
         %48 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0
                     OpStore %48 %37
         %49 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1
                     OpStore %49 %40
         %50 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2
                     OpStore %50 %42
         %51 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_3
                     OpStore %51 %45
         %52 =       OpAccessChain %_ptr_Input_float %NORMAL %32 %uint_0
         %53 =       OpLoad %float %52
         %54 =       OpAccessChain %_ptr_Input_float %NORMAL %32 %uint_1
         %55 =       OpLoad %float %54
         %56 =       OpAccessChain %_ptr_Input_float %NORMAL %32 %uint_2
         %57 =       OpLoad %float %56
         %59 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_0
                     OpStore %59 %53
         %60 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_1
                     OpStore %60 %55
         %61 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_2
                     OpStore %61 %57
         %64 =       OpAccessChain %_ptr_Input_float %gl_ClipDistance %32 %uint_0
         %65 =       OpLoad %float %64
         %66 =       OpAccessChain %_ptr_Output_float %gl_ClipDistance_0 %uint_0
                     OpStore %66 %65
         %68 =       OpAccessChain %_ptr_Input_float %gl_ClipDistance %32 %uint_1
         %69 =       OpLoad %float %68
         %70 =       OpAccessChain %_ptr_Output_float %gl_ClipDistance_0 %uint_1
                     OpStore %70 %69
         %72 =       OpAccessChain %_ptr_Input_float %TEXCOORD %32 %uint_0
         %73 =       OpLoad %float %72
         %74 =       OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_0
                     OpStore %74 %73
         %76 =       OpAccessChain %_ptr_Input_float %TEXCOORD %32 %uint_1
         %77 =       OpLoad %float %76
         %78 =       OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_1
                     OpStore %78 %77
                     OpEmitVertex
                     OpBranch %84

         %84 =   OpLabel
         %34 =     OpIAdd %uint %32 %uint_1
         %80 =     OpULessThan %bool %34 %uint_2
                   OpBranchConditional %80 %82 %85

         %85 = OpLabel
                 OpEndPrimitive
                 OpReturn
               OpFunctionEnd

