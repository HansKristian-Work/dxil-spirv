#version 460

layout(location = 0) in float A[][3];
layout(location = 0, component = 1) in float B[];
layout(location = 0) patch in float C[3];
layout(location = 0, component = 1) patch in float D;

void main()
{
    gl_Position.x = (((A[1u][1u] + B[1u]) * gl_TessCoord.y) + ((A[2u][0u] + B[2u]) * gl_TessCoord.z)) + ((A[0u][2u] + B[0u]) * gl_TessCoord.x);
    gl_Position.y = C[1u] + C[0u];
    gl_Position.z = C[2u];
    gl_Position.w = D;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadPatchConstant.f32(i32 104, i32 1, i32 0, i8 0)
  %2 = call float @dx.op.domainLocation.f32(i32 105, i8 0)
  %3 = call float @dx.op.domainLocation.f32(i32 105, i8 1)
  %4 = call float @dx.op.domainLocation.f32(i32 105, i8 2)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 0)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 1)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 2)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 2, i8 0, i32 0)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 1, i8 0, i32 1)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  %11 = fadd fast float %10, %7
  %12 = fmul fast float %11, %4
  %13 = fadd fast float %9, %6
  %14 = fmul fast float %13, %3
  %15 = fadd fast float %8, %5
  %16 = fmul fast float %15, %2
  %17 = fadd fast float %14, %12
  %18 = fadd fast float %17, %16
  %19 = call float @dx.op.loadPatchConstant.f32(i32 104, i32 0, i32 0, i8 0)
  %20 = call float @dx.op.loadPatchConstant.f32(i32 104, i32 0, i32 1, i8 0)
  %21 = fadd fast float %20, %19
  %22 = call float @dx.op.loadPatchConstant.f32(i32 104, i32 0, i32 2, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %18)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %21)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %22)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %1)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.domainLocation.f32(i32, i8) #0

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readnone
declare float @dx.op.loadPatchConstant.f32(i32, i32, i32, i8) #0

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
!3 = !{!"ds", i32 6, i32 0}
!4 = !{[21 x i32] [i32 9, i32 4, i32 1, i32 1, i32 0, i32 0, i32 1, i32 0, i32 0, i32 0, i32 1, i32 9, i32 2, i32 8, i32 0, i32 0, i32 2, i32 0, i32 0, i32 0, i32 4]}
!5 = !{void ()* @main, !"main", !6, null, !19}
!6 = !{!7, !13, !16}
!7 = !{!8, !11}
!8 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 3, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0, i32 1, i32 2}
!10 = !{i32 3, i32 1}
!11 = !{i32 1, !"B", i8 9, i8 0, !12, i8 2, i32 1, i8 1, i32 0, i8 1, !10}
!12 = !{i32 0}
!13 = !{!14}
!14 = !{i32 0, !"SV_Position", i8 9, i8 3, !12, i8 4, i32 1, i8 4, i32 0, i8 0, !15}
!15 = !{i32 3, i32 15}
!16 = !{!17, !18}
!17 = !{i32 0, !"C", i8 9, i8 0, !9, i8 0, i32 3, i8 1, i32 0, i8 0, !10}
!18 = !{i32 1, !"D", i8 9, i8 0, !12, i8 0, i32 1, i8 1, i32 0, i8 1, !10}
!19 = !{i32 2, !20}
!20 = !{i32 2, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 67
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %17 %19 %23
OpName %3 "main"
OpName %11 "A"
OpName %13 "B"
OpName %16 "SV_Position"
OpName %17 "C"
OpName %19 "D"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %16 BuiltIn Position
OpDecorate %17 Location 0
OpDecorate %17 Patch
OpDecorate %19 Location 0
OpDecorate %19 Component 1
OpDecorate %19 Patch
OpDecorate %23 BuiltIn TessCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 3
%8 = OpTypeArray %5 %7
%9 = OpTypeArray %8 %7
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %8
%13 = OpVariable %12 Input
%14 = OpTypeVector %5 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%17 = OpVariable %12 Input
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%21 = OpTypeVector %5 3
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%25 = OpConstant %6 0
%28 = OpConstant %6 1
%31 = OpConstant %6 2
%60 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%20 = OpLoad %5 %19
%24 = OpAccessChain %18 %23 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %18 %23 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %18 %23 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %18 %13 %25
%34 = OpLoad %5 %33
%35 = OpAccessChain %18 %13 %28
%36 = OpLoad %5 %35
%37 = OpAccessChain %18 %13 %31
%38 = OpLoad %5 %37
%39 = OpAccessChain %18 %11 %25 %31
%40 = OpLoad %5 %39
%41 = OpAccessChain %18 %11 %28 %28
%42 = OpLoad %5 %41
%43 = OpAccessChain %18 %11 %31 %25
%44 = OpLoad %5 %43
%45 = OpFAdd %5 %44 %38
%46 = OpFMul %5 %45 %32
%47 = OpFAdd %5 %42 %36
%48 = OpFMul %5 %47 %29
%49 = OpFAdd %5 %40 %34
%50 = OpFMul %5 %49 %26
%51 = OpFAdd %5 %48 %46
%52 = OpFAdd %5 %51 %50
%53 = OpAccessChain %18 %17 %25
%54 = OpLoad %5 %53
%55 = OpAccessChain %18 %17 %28
%56 = OpLoad %5 %55
%57 = OpFAdd %5 %56 %54
%58 = OpAccessChain %18 %17 %31
%59 = OpLoad %5 %58
%61 = OpAccessChain %60 %16 %25
OpStore %61 %52
%62 = OpAccessChain %60 %16 %28
OpStore %62 %57
%63 = OpAccessChain %60 %16 %31
OpStore %63 %59
%64 = OpAccessChain %60 %16 %7
OpStore %64 %20
OpReturn
OpFunctionEnd
#endif
