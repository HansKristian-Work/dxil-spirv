#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 1) flat in int SAMPLE;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _16 = uint(SAMPLE);
    SV_Target.x = interpolateAtSample(TEXCOORD.x, _16) + interpolateAtSample(TEXCOORD.x, 1u);
    SV_Target.y = interpolateAtSample(TEXCOORD.y, _16) + interpolateAtSample(TEXCOORD.y, 1u);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.evalSampleIndex.f32(i32 88, i32 0, i32 0, i8 0, i32 1)
  %3 = call float @dx.op.evalSampleIndex.f32(i32 88, i32 0, i32 0, i8 1, i32 1)
  %4 = call float @dx.op.evalSampleIndex.f32(i32 88, i32 0, i32 0, i8 0, i32 %1)
  %5 = call float @dx.op.evalSampleIndex.f32(i32 88, i32 0, i32 0, i8 1, i32 %1)
  %6 = fadd fast float %4, %2
  %7 = fadd fast float %5, %3
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %7)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readnone
declare float @dx.op.evalSampleIndex.f32(i32, i32, i32, i8, i32) #0

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
!4 = !{[7 x i32] [i32 5, i32 2, i32 0, i32 0, i32 0, i32 0, i32 3]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !12, null}
!7 = !{!8, !10}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 2, i32 0, i8 0, null}
!9 = !{i32 0}
!10 = !{i32 1, !"SAMPLE", i8 4, i8 0, !9, i8 1, i32 1, i8 1, i32 1, i8 0, !11}
!11 = !{i32 3, i32 1}
!12 = !{!13}
!13 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !14}
!14 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
%20 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SAMPLE"
OpName %13 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Flat
OpDecorate %11 Location 1
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 1
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %6
%13 = OpVariable %12 Output
%15 = OpTypeInt 32 0
%17 = OpTypePointer Input %5
%19 = OpConstant %15 0
%21 = OpConstant %15 1
%31 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%14 = OpLoad %9 %11
%16 = OpBitcast %15 %14
%18 = OpAccessChain %17 %8 %19
%22 = OpExtInst %5 %20 InterpolateAtSample %18 %21
%23 = OpAccessChain %17 %8 %21
%24 = OpExtInst %5 %20 InterpolateAtSample %23 %21
%25 = OpAccessChain %17 %8 %19
%26 = OpExtInst %5 %20 InterpolateAtSample %25 %16
%27 = OpAccessChain %17 %8 %21
%28 = OpExtInst %5 %20 InterpolateAtSample %27 %16
%29 = OpFAdd %5 %26 %22
%30 = OpFAdd %5 %28 %24
%32 = OpAccessChain %31 %13 %19
OpStore %32 %29
%33 = OpAccessChain %31 %13 %21
OpStore %33 %30
OpReturn
OpFunctionEnd
#endif
