#version 460

layout(location = 2) in vec4 ATTR_2;
layout(location = 4) in float ATTR_4;

void main()
{
    gl_Position.x = ATTR_2.x + ATTR_4;
    gl_Position.y = ATTR_2.y + ATTR_4;
    gl_Position.z = ATTR_2.z + ATTR_4;
    gl_Position.w = ATTR_2.w + ATTR_4;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %6 = fadd fast float %2, %1
  %7 = fadd fast float %3, %1
  %8 = fadd fast float %4, %1
  %9 = fadd fast float %5, %1
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %9)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }

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
!4 = !{[7 x i32] [i32 5, i32 4, i32 1, i32 2, i32 4, i32 8, i32 15]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !14, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"ATTR", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 2}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"ATTR", i8 9, i8 0, !12, i8 0, i32 1, i8 1, i32 1, i8 0, !13}
!12 = !{i32 4}
!13 = !{i32 3, i32 1}
!14 = !{!15}
!15 = !{i32 0, !"SV_Position", i8 9, i8 3, !16, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!16 = !{i32 0}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %10 %12
OpName %3 "main"
OpName %8 "ATTR_2"
OpName %10 "ATTR_4"
OpName %12 "SV_Position"
OpDecorate %8 Location 2
OpDecorate %10 Location 4
OpDecorate %12 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%19 = OpConstant %15 1
%22 = OpConstant %15 2
%25 = OpConstant %15 3
%31 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %36
%36 = OpLabel
%13 = OpLoad %5 %10
%14 = OpAccessChain %9 %8 %16
%17 = OpLoad %5 %14
%18 = OpAccessChain %9 %8 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %9 %8 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %9 %8 %25
%26 = OpLoad %5 %24
%27 = OpFAdd %5 %17 %13
%28 = OpFAdd %5 %20 %13
%29 = OpFAdd %5 %23 %13
%30 = OpFAdd %5 %26 %13
%32 = OpAccessChain %31 %12 %16
OpStore %32 %27
%33 = OpAccessChain %31 %12 %19
OpStore %33 %28
%34 = OpAccessChain %31 %12 %22
OpStore %34 %29
%35 = OpAccessChain %31 %12 %25
OpStore %35 %30
OpReturn
OpFunctionEnd
#endif
