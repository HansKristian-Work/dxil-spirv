#version 460

out float gl_ClipDistance[2];

layout(location = 0) in vec4 POS;
layout(location = 1) in vec2 CLIP;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP.x;
    gl_ClipDistance[1u] = CLIP.y;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %2)
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
!4 = !{[8 x i32] [i32 6, i32 6, i32 1, i32 2, i32 4, i32 8, i32 16, i32 32]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !13, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"POS", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"CLIP", i8 9, i8 0, !9, i8 0, i32 1, i8 2, i32 1, i8 0, !12}
!12 = !{i32 3, i32 3}
!13 = !{!14, !15}
!14 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!15 = !{i32 1, !"SV_ClipDistance", i8 9, i8 6, !9, i8 2, i32 1, i8 2, i32 1, i8 0, !12}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %11 %13 %18
OpName %3 "main"
OpName %8 "POS"
OpName %11 "CLIP"
OpName %13 "SV_Position"
OpName %18 "SV_ClipDistance"
OpDecorate %8 Location 0
OpDecorate %11 Location 1
OpDecorate %13 BuiltIn Position
OpDecorate %18 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 2
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %6
%13 = OpVariable %12 Output
%14 = OpTypeInt 32 0
%15 = OpConstant %14 2
%16 = OpTypeArray %5 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %14 0
%24 = OpConstant %14 1
%33 = OpConstant %14 3
%35 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%20 = OpAccessChain %19 %11 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %11 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %8 %21
%27 = OpLoad %5 %26
%28 = OpAccessChain %19 %8 %24
%29 = OpLoad %5 %28
%30 = OpAccessChain %19 %8 %15
%31 = OpLoad %5 %30
%32 = OpAccessChain %19 %8 %33
%34 = OpLoad %5 %32
%36 = OpAccessChain %35 %13 %21
OpStore %36 %27
%37 = OpAccessChain %35 %13 %24
OpStore %37 %29
%38 = OpAccessChain %35 %13 %15
OpStore %38 %31
%39 = OpAccessChain %35 %13 %33
OpStore %39 %34
%40 = OpAccessChain %35 %18 %21
OpStore %40 %22
%41 = OpAccessChain %35 %18 %24
OpStore %41 %25
OpReturn
OpFunctionEnd
#endif
