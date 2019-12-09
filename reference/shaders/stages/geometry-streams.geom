#version 460
layout(points) in;
layout(max_vertices = 3, points) out;

layout(location = 0) in vec4 TEXCOORD[1];
layout(location = 0) out vec4 A;
layout(location = 1) out vec4 B;
layout(location = 2) out vec4 C;

void main()
{
    A.x = TEXCOORD[0u].x;
    A.y = TEXCOORD[0u].y;
    A.z = TEXCOORD[0u].z;
    A.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[0u].gl_Position.x;
    gl_Position.y = gl_in[0u].gl_Position.y;
    gl_Position.z = gl_in[0u].gl_Position.z;
    gl_Position.w = gl_in[0u].gl_Position.w;
    EmitStreamVertex();
    B.x = TEXCOORD[0u].x + 1.0;
    B.y = TEXCOORD[0u].y + 1.0;
    B.z = TEXCOORD[0u].z + 1.0;
    B.w = TEXCOORD[0u].w + 1.0;
    EmitStreamVertex();
    C.x = TEXCOORD[0u].x + 2.0;
    C.y = TEXCOORD[0u].y + 2.0;
    C.z = TEXCOORD[0u].z + 2.0;
    C.w = TEXCOORD[0u].w + 2.0;
    EmitStreamVertex();
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
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 0)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 0)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 0)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  %9 = fadd fast float %1, 1.000000e+00
  %10 = fadd fast float %2, 1.000000e+00
  %11 = fadd fast float %3, 1.000000e+00
  %12 = fadd fast float %4, 1.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 1, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 2, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 3, float %12)
  call void @dx.op.emitStream(i32 97, i8 1)
  %13 = fadd fast float %1, 2.000000e+00
  %14 = fadd fast float %2, 2.000000e+00
  %15 = fadd fast float %3, 2.000000e+00
  %16 = fadd fast float %4, 2.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 3, i32 0, i8 0, float %13)
  call void @dx.op.storeOutput.f32(i32 5, i32 3, i32 0, i8 1, float %14)
  call void @dx.op.storeOutput.f32(i32 5, i32 3, i32 0, i8 2, float %15)
  call void @dx.op.storeOutput.f32(i32 5, i32 3, i32 0, i8 3, float %16)
  call void @dx.op.emitStream(i32 97, i8 2)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

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
!4 = !{[29 x i32] [i32 8, i32 8, i32 1, i32 2, i32 4, i32 8, i32 16, i32 32, i32 64, i32 128, i32 4, i32 1, i32 2, i32 4, i32 8, i32 0, i32 0, i32 0, i32 0, i32 4, i32 1, i32 2, i32 4, i32 8, i32 0, i32 0, i32 0, i32 0, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, !18}
!6 = !{!7, !12, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 1, i8 0, !10}
!12 = !{!13, !11, !14, !16}
!13 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!14 = !{i32 2, !"B", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !15}
!15 = !{i32 0, i32 1, i32 3, i32 15}
!16 = !{i32 3, !"C", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !17}
!17 = !{i32 0, i32 2, i32 3, i32 15}
!18 = !{i32 1, !19}
!19 = !{i32 1, i32 3, i32 7, i32 1, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 67
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability GeometryStreams
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %16 %17
OpExecutionMode %3 OutputVertices 3
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "A"
OpName %15 "SV_Position"
OpName %16 "B"
OpName %17 "C"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %16 Location 1
OpDecorate %17 Location 2
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
%15 = OpVariable %13 Output
%16 = OpVariable %13 Output
%17 = OpVariable %13 Output
%18 = OpTypePointer Input %5
%20 = OpConstant %7 0
%25 = OpConstant %7 2
%28 = OpConstant %7 3
%38 = OpTypePointer Output %5
%48 = OpConstant %5 1
%57 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%19 = OpAccessChain %18 %11 %20 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %18 %11 %20 %8
%23 = OpLoad %5 %22
%24 = OpAccessChain %18 %11 %20 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %18 %11 %20 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %18 %12 %20 %20
%31 = OpLoad %5 %30
%32 = OpAccessChain %18 %12 %20 %8
%33 = OpLoad %5 %32
%34 = OpAccessChain %18 %12 %20 %25
%35 = OpLoad %5 %34
%36 = OpAccessChain %18 %12 %20 %28
%37 = OpLoad %5 %36
%39 = OpAccessChain %38 %14 %20
OpStore %39 %21
%40 = OpAccessChain %38 %14 %8
OpStore %40 %23
%41 = OpAccessChain %38 %14 %25
OpStore %41 %26
%42 = OpAccessChain %38 %14 %28
OpStore %42 %29
%43 = OpAccessChain %38 %15 %20
OpStore %43 %31
%44 = OpAccessChain %38 %15 %8
OpStore %44 %33
%45 = OpAccessChain %38 %15 %25
OpStore %45 %35
%46 = OpAccessChain %38 %15 %28
OpStore %46 %37
OpEmitStreamVertex %20
%47 = OpFAdd %5 %21 %48
%49 = OpFAdd %5 %23 %48
%50 = OpFAdd %5 %26 %48
%51 = OpFAdd %5 %29 %48
%52 = OpAccessChain %38 %16 %20
OpStore %52 %47
%53 = OpAccessChain %38 %16 %8
OpStore %53 %49
%54 = OpAccessChain %38 %16 %25
OpStore %54 %50
%55 = OpAccessChain %38 %16 %28
OpStore %55 %51
OpEmitStreamVertex %8
%56 = OpFAdd %5 %21 %57
%58 = OpFAdd %5 %23 %57
%59 = OpFAdd %5 %26 %57
%60 = OpFAdd %5 %29 %57
%61 = OpAccessChain %38 %17 %20
OpStore %61 %56
%62 = OpAccessChain %38 %17 %8
OpStore %62 %58
%63 = OpAccessChain %38 %17 %25
OpStore %63 %59
%64 = OpAccessChain %38 %17 %28
OpStore %64 %60
OpEmitStreamVertex %25
OpReturn
OpFunctionEnd
#endif
