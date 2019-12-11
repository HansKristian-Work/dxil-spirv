#version 460
#extension GL_KHR_shader_subgroup_quad : require

layout(location = 0) in float A;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = A;
    SV_Target.y = subgroupQuadSwapHorizontal(A);
    SV_Target.z = subgroupQuadSwapVertical(A);
    SV_Target.w = subgroupQuadSwapDiagonal(A);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.quadOp.f32(i32 123, float %1, i8 0)
  %3 = call float @dx.op.quadOp.f32(i32 123, float %1, i8 1)
  %4 = call float @dx.op.quadOp.f32(i32 123, float %1, i8 2)
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

; Function Attrs: nounwind
declare float @dx.op.quadOp.f32(i32, float, i8) #1

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
!4 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!5 = !{void ()* @main, !"main", !6, null, !14}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !13}
!13 = !{i32 3, i32 15}
!14 = !{i32 0, i64 524288}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 27
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %10 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%13 = OpTypeInt 32 0
%14 = OpConstant %13 3
%15 = OpConstant %13 0
%17 = OpConstant %13 1
%19 = OpConstant %13 2
%20 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %25
%25 = OpLabel
%11 = OpLoad %5 %7
%12 = OpGroupNonUniformQuadSwap %5 %14 %11 %15
%16 = OpGroupNonUniformQuadSwap %5 %14 %11 %17
%18 = OpGroupNonUniformQuadSwap %5 %14 %11 %19
%21 = OpAccessChain %20 %10 %15
OpStore %21 %11
%22 = OpAccessChain %20 %10 %17
OpStore %22 %12
%23 = OpAccessChain %20 %10 %19
OpStore %23 %16
%24 = OpAccessChain %20 %10 %14
OpStore %24 %18
OpReturn
OpFunctionEnd
#endif
