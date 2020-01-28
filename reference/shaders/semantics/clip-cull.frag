#version 460

in float gl_ClipDistance[4];
in float gl_CullDistance[3];

layout(location = 0) out vec4 SV_Target;

void main()
{
    float _37 = gl_CullDistance[0u] + gl_CullDistance[2u];
    float _39 = gl_CullDistance[1u] + gl_CullDistance[2u];
    SV_Target.x = _37 + gl_ClipDistance[0u];
    SV_Target.y = _39 + gl_ClipDistance[1u];
    SV_Target.z = _37 + gl_ClipDistance[2u];
    SV_Target.w = _39 + gl_ClipDistance[3u];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 4, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 3, i32 0, i8 0, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 3, i32 0, i8 1, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 2, i32 0, i8 0, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %8 = fadd fast float %2, %1
  %9 = fadd fast float %8, %6
  %10 = fadd fast float %3, %1
  %11 = fadd fast float %10, %7
  %12 = fadd fast float %8, %5
  %13 = fadd fast float %10, %4
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %13)
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
!4 = !{[9 x i32] [i32 7, i32 4, i32 1, i32 2, i32 4, i32 8, i32 5, i32 10, i32 15]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !18, null}
!7 = !{!8, !11, !14, !16, !17}
!8 = !{i32 0, !"SV_ClipDistance", i8 9, i8 6, !9, i8 2, i32 1, i8 2, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 3}
!11 = !{i32 1, !"SV_ClipDistance", i8 9, i8 6, !12, i8 2, i32 1, i8 1, i32 0, i8 2, !13}
!12 = !{i32 1}
!13 = !{i32 3, i32 1}
!14 = !{i32 2, !"SV_ClipDistance", i8 9, i8 6, !15, i8 2, i32 1, i8 1, i32 0, i8 3, !13}
!15 = !{i32 2}
!16 = !{i32 3, !"SV_CullDistance", i8 9, i8 7, !9, i8 2, i32 1, i8 2, i32 1, i8 0, !10}
!17 = !{i32 4, !"SV_CullDistance", i8 9, i8 7, !12, i8 2, i32 1, i8 1, i32 1, i8 2, !13}
!18 = !{!19}
!19 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !20}
!20 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %18 "SV_Target"
OpDecorate %11 BuiltIn ClipDistance
OpDecorate %15 BuiltIn CullDistance
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 4
%9 = OpTypeArray %5 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpConstant %7 3
%13 = OpTypeArray %5 %12
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeVector %5 4
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %7 2
%24 = OpConstant %7 0
%27 = OpConstant %7 1
%43 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%20 = OpAccessChain %19 %15 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %15 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %15 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %11 %12
%30 = OpLoad %5 %29
%31 = OpAccessChain %19 %11 %21
%32 = OpLoad %5 %31
%33 = OpAccessChain %19 %11 %24
%34 = OpLoad %5 %33
%35 = OpAccessChain %19 %11 %27
%36 = OpLoad %5 %35
%37 = OpFAdd %5 %25 %22
%38 = OpFAdd %5 %37 %34
%39 = OpFAdd %5 %28 %22
%40 = OpFAdd %5 %39 %36
%41 = OpFAdd %5 %37 %32
%42 = OpFAdd %5 %39 %30
%44 = OpAccessChain %43 %18 %24
OpStore %44 %38
%45 = OpAccessChain %43 %18 %27
OpStore %45 %40
%46 = OpAccessChain %43 %18 %21
OpStore %46 %41
%47 = OpAccessChain %43 %18 %12
OpStore %47 %42
OpReturn
OpFunctionEnd
#endif
