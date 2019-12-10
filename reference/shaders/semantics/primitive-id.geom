#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 0) in vec4 A[1];

void main()
{
    gl_Position.x = A[0u].x;
    gl_Position.y = A[0u].y;
    gl_Position.z = A[0u].z;
    gl_Position.w = A[0u].w;
    gl_PrimitiveID = int(uint(gl_PrimitiveIDIn) + 1u);
    EmitVertex();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.primitiveID.i32(i32 108)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 0)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 0)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 0)
  %6 = add i32 %1, 1
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.i32(i32 5, i32 1, i32 0, i8 0, i32 %6)
  call void @dx.op.emitStream(i32 97, i8 0)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.primitiveID.i32(i32) #0

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
!4 = !{[9 x i32] [i32 4, i32 5, i32 1, i32 2, i32 4, i32 8, i32 0, i32 0, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, !16}
!6 = !{!7, !12, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"SV_PrimitiveID", i8 5, i8 10, !9, i8 0, i32 1, i8 1, i32 -1, i8 -1, null}
!12 = !{!13, !14}
!13 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!14 = !{i32 1, !"SV_PrimitiveID", i8 5, i8 10, !9, i8 1, i32 1, i8 1, i32 1, i8 0, !15}
!15 = !{i32 3, i32 1}
!16 = !{i32 1, !17}
!17 = !{i32 1, i32 1, i32 1, i32 1, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %13 %15 %17
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "A"
OpName %13 "SV_PrimitiveID"
OpName %15 "SV_Position"
OpName %17 "SV_PrimitiveID"
OpDecorate %11 Location 0
OpDecorate %13 BuiltIn PrimitiveId
OpDecorate %15 BuiltIn Position
OpDecorate %17 BuiltIn PrimitiveId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 1
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %7
%13 = OpVariable %12 Input
%14 = OpTypePointer Output %6
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %7
%17 = OpVariable %16 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %7 0
%26 = OpConstant %7 2
%29 = OpConstant %7 3
%32 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%18 = OpLoad %7 %13
%20 = OpAccessChain %19 %11 %21 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %11 %21 %8
%24 = OpLoad %5 %23
%25 = OpAccessChain %19 %11 %21 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %19 %11 %21 %29
%30 = OpLoad %5 %28
%31 = OpIAdd %7 %18 %8
%33 = OpAccessChain %32 %15 %21
OpStore %33 %22
%34 = OpAccessChain %32 %15 %8
OpStore %34 %24
%35 = OpAccessChain %32 %15 %26
OpStore %35 %27
%36 = OpAccessChain %32 %15 %29
OpStore %36 %30
OpStore %17 %31
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
