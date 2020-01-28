#version 460

out float gl_ClipDistance[4];
out float gl_CullDistance[4];

layout(location = 0) in vec4 POS;
layout(location = 1) in vec4 CLIP;
layout(location = 2) in vec4 CULL;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP.x;
    gl_ClipDistance[1u] = CLIP.y;
    gl_ClipDistance[2u] = CLIP.z;
    gl_ClipDistance[3u] = CLIP.w;
    gl_CullDistance[0u] = CULL.x;
    gl_CullDistance[1u] = CULL.y;
    gl_CullDistance[2u] = CULL.z;
    gl_CullDistance[3u] = CULL.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 2, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 2, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 2, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 2, i32 0, i8 3, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %11 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %12 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 3, float %4)
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
!4 = !{[14 x i32] [i32 12, i32 12, i32 1, i32 2, i32 4, i32 8, i32 16, i32 32, i32 64, i32 128, i32 256, i32 512, i32 1024, i32 2048]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !13, null}
!7 = !{!8, !11, !12}
!8 = !{i32 0, !"POS", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"CLIP", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 1, i8 0, !10}
!12 = !{i32 2, !"CULL", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 2, i8 0, !10}
!13 = !{!14, !15, !16}
!14 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!15 = !{i32 1, !"SV_ClipDistance", i8 9, i8 6, !9, i8 2, i32 1, i8 4, i32 1, i8 0, !10}
!16 = !{i32 2, !"SV_CullDistance", i8 9, i8 7, !9, i8 2, i32 1, i8 4, i32 2, i8 0, !10}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %9 %10 %12 %17 %18
OpName %3 "main"
OpName %8 "POS"
OpName %9 "CLIP"
OpName %10 "CULL"
OpName %12 "SV_Position"
OpName %17 "SV_ClipDistance"
OpName %18 "SV_CullDistance"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %10 Location 2
OpDecorate %12 BuiltIn Position
OpDecorate %17 BuiltIn ClipDistance
OpDecorate %18 BuiltIn CullDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypeInt 32 0
%14 = OpConstant %13 4
%15 = OpTypeArray %5 %14
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %13 0
%24 = OpConstant %13 1
%27 = OpConstant %13 2
%30 = OpConstant %13 3
%48 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%20 = OpAccessChain %19 %10 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %10 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %10 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %10 %30
%31 = OpLoad %5 %29
%32 = OpAccessChain %19 %9 %21
%33 = OpLoad %5 %32
%34 = OpAccessChain %19 %9 %24
%35 = OpLoad %5 %34
%36 = OpAccessChain %19 %9 %27
%37 = OpLoad %5 %36
%38 = OpAccessChain %19 %9 %30
%39 = OpLoad %5 %38
%40 = OpAccessChain %19 %8 %21
%41 = OpLoad %5 %40
%42 = OpAccessChain %19 %8 %24
%43 = OpLoad %5 %42
%44 = OpAccessChain %19 %8 %27
%45 = OpLoad %5 %44
%46 = OpAccessChain %19 %8 %30
%47 = OpLoad %5 %46
%49 = OpAccessChain %48 %12 %21
OpStore %49 %41
%50 = OpAccessChain %48 %12 %24
OpStore %50 %43
%51 = OpAccessChain %48 %12 %27
OpStore %51 %45
%52 = OpAccessChain %48 %12 %30
OpStore %52 %47
%53 = OpAccessChain %48 %17 %21
OpStore %53 %33
%54 = OpAccessChain %48 %17 %24
OpStore %54 %35
%55 = OpAccessChain %48 %17 %27
OpStore %55 %37
%56 = OpAccessChain %48 %17 %30
OpStore %56 %39
%57 = OpAccessChain %48 %18 %21
OpStore %57 %22
%58 = OpAccessChain %48 %18 %24
OpStore %58 %25
%59 = OpAccessChain %48 %18 %27
OpStore %59 %28
%60 = OpAccessChain %48 %18 %30
OpStore %60 %31
OpReturn
OpFunctionEnd
#endif
