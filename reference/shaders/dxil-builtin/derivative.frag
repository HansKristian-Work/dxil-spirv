#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = dFdxFine(TEXCOORD.x) + dFdxCoarse(TEXCOORD.x);
    SV_Target.y = dFdxFine(TEXCOORD.y) + dFdxCoarse(TEXCOORD.y);
    SV_Target.z = dFdyFine(TEXCOORD.x) + dFdyCoarse(TEXCOORD.x);
    SV_Target.w = dFdyFine(TEXCOORD.y) + dFdyCoarse(TEXCOORD.y);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.unary.f32(i32 83, float %1)
  %4 = call float @dx.op.unary.f32(i32 83, float %2)
  %5 = call float @dx.op.unary.f32(i32 84, float %1)
  %6 = call float @dx.op.unary.f32(i32 84, float %2)
  %7 = call float @dx.op.unary.f32(i32 85, float %1)
  %8 = call float @dx.op.unary.f32(i32 85, float %2)
  %9 = fadd fast float %7, %3
  %10 = fadd fast float %8, %4
  %11 = call float @dx.op.unary.f32(i32 86, float %1)
  %12 = call float @dx.op.unary.f32(i32 86, float %2)
  %13 = fadd fast float %11, %5
  %14 = fadd fast float %12, %6
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %13)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %14)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readnone
declare float @dx.op.unary.f32(i32, float) #0

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
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[4 x i32] [i32 2, i32 4, i32 5, i32 10]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 2, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 3}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !13}
!13 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability DerivativeControl
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%33 = OpTypePointer Output %5
%36 = OpConstant %14 2
%38 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%12 = OpInBoundsAccessChain %13 %8 %15
%16 = OpLoad %5 %12
%17 = OpInBoundsAccessChain %13 %8 %18
%19 = OpLoad %5 %17
%20 = OpDPdxCoarse %5 %16
%21 = OpDPdxCoarse %5 %19
%22 = OpDPdyCoarse %5 %16
%23 = OpDPdyCoarse %5 %19
%24 = OpDPdxFine %5 %16
%25 = OpDPdxFine %5 %19
%26 = OpFAdd %5 %24 %20
%27 = OpFAdd %5 %25 %21
%28 = OpDPdyFine %5 %16
%29 = OpDPdyFine %5 %19
%30 = OpFAdd %5 %28 %22
%31 = OpFAdd %5 %29 %23
%32 = OpInBoundsAccessChain %33 %11 %15
OpStore %32 %26
%34 = OpInBoundsAccessChain %33 %11 %18
OpStore %34 %27
%35 = OpInBoundsAccessChain %33 %11 %36
OpStore %35 %30
%37 = OpInBoundsAccessChain %33 %11 %38
OpStore %37 %31
OpReturn
OpFunctionEnd
#endif
