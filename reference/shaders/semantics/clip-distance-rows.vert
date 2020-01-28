#version 460

out float gl_ClipDistance[2];

layout(location = 0) in vec4 POS;
layout(location = 1) in float CLIP;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP;
    gl_ClipDistance[1u] = CLIP + 1.0;
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
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %1)
  %6 = fadd fast float %1, 1.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 1, i8 0, float %6)
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
!4 = !{[7 x i32] [i32 5, i32 9, i32 1, i32 2, i32 4, i32 8, i32 272]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !13, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"POS", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"CLIP", i8 9, i8 0, !9, i8 0, i32 1, i8 1, i32 1, i8 0, !12}
!12 = !{i32 3, i32 1}
!13 = !{!14, !15}
!14 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!15 = !{i32 1, !"SV_ClipDistance", i8 9, i8 6, !16, i8 2, i32 2, i8 1, i32 1, i8 0, !12}
!16 = !{i32 0, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %10 %12 %17
OpName %3 "main"
OpName %8 "POS"
OpName %10 "CLIP"
OpName %12 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %10 Location 1
OpDecorate %12 BuiltIn Position
OpDecorate %17 BuiltIn ClipDistance
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
%13 = OpTypeInt 32 0
%14 = OpConstant %13 2
%15 = OpTypeArray %5 %14
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpConstant %13 0
%23 = OpConstant %13 1
%28 = OpConstant %13 3
%30 = OpTypePointer Output %5
%37 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%18 = OpLoad %5 %10
%19 = OpAccessChain %9 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %9 %8 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %9 %8 %14
%26 = OpLoad %5 %25
%27 = OpAccessChain %9 %8 %28
%29 = OpLoad %5 %27
%31 = OpAccessChain %30 %12 %20
OpStore %31 %21
%32 = OpAccessChain %30 %12 %23
OpStore %32 %24
%33 = OpAccessChain %30 %12 %14
OpStore %33 %26
%34 = OpAccessChain %30 %12 %28
OpStore %34 %29
%35 = OpAccessChain %30 %17 %20
OpStore %35 %18
%36 = OpFAdd %5 %18 %37
%38 = OpAccessChain %30 %17 %23
OpStore %38 %36
OpReturn
OpFunctionEnd
#endif
