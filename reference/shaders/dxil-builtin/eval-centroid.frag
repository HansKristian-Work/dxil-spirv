#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    SV_Target.x = interpolateAtCentroid(TEXCOORD.x);
    SV_Target.y = interpolateAtCentroid(TEXCOORD.y);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.evalCentroid.f32(i32 89, i32 0, i32 0, i8 0)
  %2 = call float @dx.op.evalCentroid.f32(i32 89, i32 0, i32 0, i8 1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readnone
declare float @dx.op.evalCentroid.f32(i32, i32, i32, i8) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readnone }

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
!4 = !{[4 x i32] [i32 2, i32 2, i32 0, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !10, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 2, i32 0, i8 0, null}
!9 = !{i32 0}
!10 = !{!11}
!11 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !12}
!12 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
%15 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%18 = OpConstant %13 1
%20 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %23
%23 = OpLabel
%12 = OpAccessChain %11 %8 %14
%16 = OpExtInst %5 %15 InterpolateAtCentroid %12
%17 = OpAccessChain %11 %8 %18
%19 = OpExtInst %5 %15 InterpolateAtCentroid %17
%21 = OpAccessChain %20 %10 %14
OpStore %21 %16
%22 = OpAccessChain %20 %10 %18
OpStore %22 %19
OpReturn
OpFunctionEnd
#endif
