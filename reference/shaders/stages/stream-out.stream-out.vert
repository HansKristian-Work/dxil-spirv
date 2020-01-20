#version 460

layout(location = 1, offset = 0) out vec4 StreamOut;
layout(location = 2, offset = 0) out vec4 StreamOut_1;

void main()
{
    gl_Position.x = 2.0;
    gl_Position.y = 2.0;
    gl_Position.z = 2.0;
    gl_Position.w = 2.0;
    StreamOut.x = 4.0;
    StreamOut.y = 4.0;
    StreamOut.z = 4.0;
    StreamOut.w = 4.0;
    StreamOut_1.x = 6.0;
    StreamOut_1.y = 6.0;
    StreamOut_1.z = 6.0;
    StreamOut_1.w = 6.0;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float 2.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float 2.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float 2.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float 2.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float 4.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float 4.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float 4.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float 4.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 0, float 6.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 1, float 6.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 2, float 6.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 3, float 6.000000e+00)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

attributes #0 = { nounwind }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.viewIdState = !{!4}
!dx.entryPoints = !{!5}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"vs", i32 6, i32 0}
!4 = !{[2 x i32] [i32 0, i32 12]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{null, !7, null}
!7 = !{!8, !11, !12}
!8 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"StreamOut", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 1, i8 0, !10}
!12 = !{i32 2, !"StreamOut", i8 9, i8 0, !13, i8 2, i32 1, i8 4, i32 2, i8 0, !10}
!13 = !{i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability TransformFeedback
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %9 %10
OpExecutionMode %3 Xfb
OpExecutionMode %3 Xfb
OpExecutionMode %3 Xfb
OpName %3 "main"
OpName %8 "SV_Position"
OpName %9 "StreamOut"
OpName %10 "StreamOut_1"
OpDecorate %8 Offset 16
OpDecorate %8 XfbStride 32
OpDecorate %8 XfbBuffer 1
OpDecorate %8 BuiltIn Position
OpDecorate %9 Offset 0
OpDecorate %9 XfbStride 32
OpDecorate %9 XfbBuffer 0
OpDecorate %9 Location 1
OpDecorate %10 Offset 0
OpDecorate %10 XfbStride 16
OpDecorate %10 XfbBuffer 1
OpDecorate %10 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpVariable %7 Output
%10 = OpVariable %7 Output
%11 = OpTypePointer Output %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%15 = OpConstant %5 2
%17 = OpConstant %13 1
%19 = OpConstant %13 2
%21 = OpConstant %13 3
%23 = OpConstant %5 4
%28 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%12 = OpAccessChain %11 %8 %14
OpStore %12 %15
%16 = OpAccessChain %11 %8 %17
OpStore %16 %15
%18 = OpAccessChain %11 %8 %19
OpStore %18 %15
%20 = OpAccessChain %11 %8 %21
OpStore %20 %15
%22 = OpAccessChain %11 %9 %14
OpStore %22 %23
%24 = OpAccessChain %11 %9 %17
OpStore %24 %23
%25 = OpAccessChain %11 %9 %19
OpStore %25 %23
%26 = OpAccessChain %11 %9 %21
OpStore %26 %23
%27 = OpAccessChain %11 %10 %14
OpStore %27 %28
%29 = OpAccessChain %11 %10 %17
OpStore %29 %28
%30 = OpAccessChain %11 %10 %19
OpStore %30 %28
%31 = OpAccessChain %11 %10 %21
OpStore %31 %28
OpReturn
OpFunctionEnd
#endif
