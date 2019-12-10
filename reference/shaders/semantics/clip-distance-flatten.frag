#version 460

in float gl_ClipDistance[4];

layout(location = 0) out vec4 SV_Target;

uint _20;

void main()
{
    SV_Target.x = gl_ClipDistance[0u];
    SV_Target.y = gl_ClipDistance[1u];
    SV_Target.z = gl_ClipDistance[2u];
    SV_Target.w = gl_ClipDistance[3u];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 1, i8 0, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 1, i8 1, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
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
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[8 x i32] [i32 6, i32 4, i32 1, i32 2, i32 0, i32 0, i32 4, i32 8]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_ClipDistance", i8 9, i8 6, !9, i8 2, i32 2, i8 2, i32 0, i8 0, !10}
!9 = !{i32 0, i32 1}
!10 = !{i32 3, i32 3}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !13, i8 0, i32 1, i8 4, i32 0, i8 0, !14}
!13 = !{i32 0}
!14 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "SV_ClipDistance"
OpName %16 "SV_Target"
OpDecorate %13 BuiltIn ClipDistance
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %6 %8
%10 = OpConstant %7 4
%11 = OpTypeArray %5 %10
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypeVector %5 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %7 0
%23 = OpConstant %7 1
%28 = OpConstant %7 3
%30 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%20 = OpUndef %7
OpBranch %35
%35 = OpLabel
%18 = OpAccessChain %17 %13 %19
%21 = OpLoad %5 %18
%22 = OpAccessChain %17 %13 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %17 %13 %8
%26 = OpLoad %5 %25
%27 = OpAccessChain %17 %13 %28
%29 = OpLoad %5 %27
%31 = OpAccessChain %30 %16 %19
OpStore %31 %21
%32 = OpAccessChain %30 %16 %23
OpStore %32 %24
%33 = OpAccessChain %30 %16 %8
OpStore %33 %26
%34 = OpAccessChain %30 %16 %28
OpStore %34 %29
OpReturn
OpFunctionEnd
#endif
