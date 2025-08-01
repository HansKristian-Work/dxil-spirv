SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 88
; Schema: 0
               OpCapability Shader
               OpCapability Geometry
               OpCapability ClipDistance
               OpCapability VulkanMemoryModel
               OpMemoryModel Logical Vulkan
               OpEntryPoint Geometry %main "main" %SV_POSITION %TEXCOORD %NORMAL %gl_ClipDistance %SV_POSITION_0 %TEXCOORD_0 %NORMAL_0 %gl_ClipDistance_0
               OpExecutionMode %main Invocations 1
               OpExecutionMode %main OutputVertices 4
               OpExecutionMode %main InputLinesAdjacency
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
     %uint_4 = OpConstant %uint 4
%_arr_v4float_uint_4 = OpTypeArray %v4float %uint_4
%_ptr_Input__arr_v4float_uint_4 = OpTypePointer Input %_arr_v4float_uint_4
%SV_POSITION = OpVariable %_ptr_Input__arr_v4float_uint_4 Input
     %uint_2 = OpConstant %uint 2
%_arr_float_uint_2 = OpTypeArray %float %uint_2
    %v2float = OpTypeVector %float 2
%_arr_v2float_uint_4 = OpTypeArray %v2float %uint_4
%_ptr_Input__arr_v2float_uint_4 = OpTypePointer Input %_arr_v2float_uint_4
   %TEXCOORD = OpVariable %_ptr_Input__arr_v2float_uint_4 Input
    %v3float = OpTypeVector %float 3
%_arr_v3float_uint_4 = OpTypeArray %v3float %uint_4
%_ptr_Input__arr_v3float_uint_4 = OpTypePointer Input %_arr_v3float_uint_4
     %NORMAL = OpVariable %_ptr_Input__arr_v3float_uint_4 Input
%_arr__arr_float_uint_2_uint_4 = OpTypeArray %_arr_float_uint_2 %uint_4
%_ptr_Input__arr__arr_float_uint_2_uint_4 = OpTypePointer Input %_arr__arr_float_uint_2_uint_4
%gl_ClipDistance = OpVariable %_ptr_Input__arr__arr_float_uint_2_uint_4 Input
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
                 OpBranch %82

         %82 = OpLabel
                 OpBranch %83

         %83 = OpLabel
         %33 =   OpPhi %uint %uint_0 %82 %35 %85
                 OpLoopMerge %86 %85 None
                 OpBranch %84

         %84 =     OpLabel
         %37 =       OpAccessChain %_ptr_Input_float %SV_POSITION %33 %uint_0
         %38 =       OpLoad %float %37
         %39 =       OpAccessChain %_ptr_Input_float %SV_POSITION %33 %uint_1
         %41 =       OpLoad %float %39
         %42 =       OpAccessChain %_ptr_Input_float %SV_POSITION %33 %uint_2
         %43 =       OpLoad %float %42
         %44 =       OpAccessChain %_ptr_Input_float %SV_POSITION %33 %uint_3
         %46 =       OpLoad %float %44
         %49 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_0
                     OpStore %49 %38
         %50 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_1
                     OpStore %50 %41
         %51 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_2
                     OpStore %51 %43
         %52 =       OpAccessChain %_ptr_Output_float %SV_POSITION_0 %uint_3
                     OpStore %52 %46
         %53 =       OpAccessChain %_ptr_Input_float %NORMAL %33 %uint_0
         %54 =       OpLoad %float %53
         %55 =       OpAccessChain %_ptr_Input_float %NORMAL %33 %uint_1
         %56 =       OpLoad %float %55
         %57 =       OpAccessChain %_ptr_Input_float %NORMAL %33 %uint_2
         %58 =       OpLoad %float %57
         %60 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_0
                     OpStore %60 %54
         %61 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_1
                     OpStore %61 %56
         %62 =       OpAccessChain %_ptr_Output_float %NORMAL_0 %uint_2
                     OpStore %62 %58
         %65 =       OpAccessChain %_ptr_Input_float %gl_ClipDistance %33 %uint_0
         %66 =       OpLoad %float %65
         %67 =       OpAccessChain %_ptr_Output_float %gl_ClipDistance_0 %uint_0
                     OpStore %67 %66
         %69 =       OpAccessChain %_ptr_Input_float %gl_ClipDistance %33 %uint_1
         %70 =       OpLoad %float %69
         %71 =       OpAccessChain %_ptr_Output_float %gl_ClipDistance_0 %uint_1
                     OpStore %71 %70
         %73 =       OpAccessChain %_ptr_Input_float %TEXCOORD %33 %uint_0
         %74 =       OpLoad %float %73
         %75 =       OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_0
                     OpStore %75 %74
         %77 =       OpAccessChain %_ptr_Input_float %TEXCOORD %33 %uint_1
         %78 =       OpLoad %float %77
         %79 =       OpAccessChain %_ptr_Output_float %TEXCOORD_0 %uint_1
                     OpStore %79 %78
                     OpEmitVertex
                     OpBranch %85

         %85 =   OpLabel
         %35 =     OpIAdd %uint %33 %uint_1
         %81 =     OpULessThan %bool %35 %uint_4
                   OpBranchConditional %81 %83 %86

         %86 = OpLabel
                 OpEndPrimitive
                 OpReturn
               OpFunctionEnd

