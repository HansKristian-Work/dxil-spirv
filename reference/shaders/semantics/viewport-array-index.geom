#version 460
layout(points) in;
layout(max_vertices = 2, points) out;

layout(location = 0) in vec4 A[1];
layout(location = 1) in vec4 B[1];

void main()
{
    gl_Position.x = A[0u].x;
    gl_Position.y = A[0u].y;
    gl_Position.z = A[0u].z;
    gl_Position.w = A[0u].w;
    gl_ViewportIndex = int(0u);
    EmitVertex();
    gl_Position.x = B[0u].x;
    gl_Position.y = B[0u].y;
    gl_Position.z = B[0u].z;
    gl_Position.w = B[0u].w;
    gl_ViewportIndex = int(1u);
    EmitVertex();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 0)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 0)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.i32(i32 5, i32 1, i32 0, i8 0, i32 0)
  call void @dx.op.emitStream(i32 97, i8 0)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 0)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 0)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 0)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %8)
  call void @dx.op.storeOutput.i32(i32 5, i32 1, i32 0, i8 0, i32 1)
  call void @dx.op.emitStream(i32 97, i8 0)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind
declare void @dx.op.emitStream(i32, i8) #1

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
!3 = !{!"gs", i32 6, i32 0}
!4 = !{[13 x i32] [i32 8, i32 5, i32 1, i32 2, i32 4, i32 8, i32 1, i32 2, i32 4, i32 8, i32 0, i32 0, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, !16}
!6 = !{!7, !12, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"B", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 1, i8 0, !10}
!12 = !{!13, !14}
!13 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!14 = !{i32 1, !"SV_ViewportArrayIndex", i8 5, i8 5, !9, i8 1, i32 1, i8 1, i32 1, i8 0, !15}
!15 = !{i32 3, i32 1}
!16 = !{i32 1, !17}
!17 = !{i32 1, i32 2, i32 1, i32 1, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %16
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "A"
OpName %12 "B"
OpName %14 "SV_Position"
OpName %16 "SV_ViewportArrayIndex"
OpDecorate %11 Location 0
OpDecorate %12 Location 1
OpDecorate %14 BuiltIn Position
OpDecorate %16 BuiltIn ViewportIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 1
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpTypePointer Output %7
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %7 0
%24 = OpConstant %7 2
%27 = OpConstant %7 3
%29 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%18 = OpAccessChain %17 %11 %19 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %11 %19 %8
%22 = OpLoad %5 %21
%23 = OpAccessChain %17 %11 %19 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %17 %11 %19 %27
%28 = OpLoad %5 %26
%30 = OpAccessChain %29 %14 %19
OpStore %30 %20
%31 = OpAccessChain %29 %14 %8
OpStore %31 %22
%32 = OpAccessChain %29 %14 %24
OpStore %32 %25
%33 = OpAccessChain %29 %14 %27
OpStore %33 %28
OpStore %16 %19
OpEmitVertex
%34 = OpAccessChain %17 %12 %19 %19
%35 = OpLoad %5 %34
%36 = OpAccessChain %17 %12 %19 %8
%37 = OpLoad %5 %36
%38 = OpAccessChain %17 %12 %19 %24
%39 = OpLoad %5 %38
%40 = OpAccessChain %17 %12 %19 %27
%41 = OpLoad %5 %40
%42 = OpAccessChain %29 %14 %19
OpStore %42 %35
%43 = OpAccessChain %29 %14 %8
OpStore %43 %37
%44 = OpAccessChain %29 %14 %24
OpStore %44 %39
%45 = OpAccessChain %29 %14 %27
OpStore %45 %41
OpStore %16 %8
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
