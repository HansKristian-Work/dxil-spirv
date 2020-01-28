#version 460

in float gl_ClipDistance[2];

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = gl_ClipDistance[0u];
    SV_Target.y = gl_ClipDistance[1u];
    SV_Target.z = gl_ClipDistance[1u];
    SV_Target.w = gl_ClipDistance[0u];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %1)
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
!4 = !{[4 x i32] [i32 2, i32 4, i32 9, i32 6]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_ClipDistance", i8 9, i8 6, !9, i8 2, i32 1, i8 2, i32 0, i8 0, !10}
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
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "SV_Target"
OpDecorate %11 BuiltIn ClipDistance
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %5 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 4
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %7 0
%20 = OpConstant %7 1
%22 = OpTypePointer Output %5
%27 = OpConstant %7 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%16 = OpAccessChain %15 %11 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %15 %11 %20
%21 = OpLoad %5 %19
%23 = OpAccessChain %22 %14 %17
OpStore %23 %18
%24 = OpAccessChain %22 %14 %20
OpStore %24 %21
%25 = OpAccessChain %22 %14 %8
OpStore %25 %21
%26 = OpAccessChain %22 %14 %27
OpStore %26 %18
OpReturn
OpFunctionEnd
#endif
