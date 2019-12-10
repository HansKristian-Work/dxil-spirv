#version 460

void main()
{
    gl_Position.x = 1.0;
    gl_Position.y = 1.0;
    gl_Position.z = 1.0;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float 1.000000e+00)
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
!4 = !{[2 x i32] [i32 0, i32 3]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{null, !7, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 3, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 7}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %9
OpName %3 "main"
OpName %9 "SV_Position"
OpDecorate %9 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypeVector %5 4
%8 = OpTypePointer Output %7
%9 = OpVariable %8 Output
%10 = OpTypePointer Output %5
%12 = OpTypeInt 32 0
%13 = OpConstant %12 0
%14 = OpConstant %5 1
%16 = OpConstant %12 1
%18 = OpConstant %12 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %19
%19 = OpLabel
%11 = OpAccessChain %10 %9 %13
OpStore %11 %14
%15 = OpAccessChain %10 %9 %16
OpStore %15 %14
%17 = OpAccessChain %10 %9 %18
OpStore %17 %14
OpReturn
OpFunctionEnd
#endif
