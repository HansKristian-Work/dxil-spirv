#version 460
#extension GL_KHR_shader_subgroup_quad : require
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_KHR_shader_subgroup_shuffle : require

layout(location = 0) in float V;
layout(location = 1) flat in uint INDEX;
layout(location = 0) out vec2 SV_Target;

void main()
{
    SV_Target.x = subgroupQuadBroadcast(V, 2u);
    SV_Target.y = subgroupShuffle(V, (gl_SubgroupInvocationID & 4294967292u) + INDEX);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %3 = call float @dx.op.quadReadLaneAt.f32(i32 122, float %2, i32 2)
  %4 = call float @dx.op.quadReadLaneAt.f32(i32 122, float %2, i32 %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %4)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind
declare float @dx.op.quadReadLaneAt.f32(i32, float, i32) #1

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
!4 = !{[7 x i32] [i32 5, i32 2, i32 3, i32 0, i32 0, i32 0, i32 2]}
!5 = !{void ()* @main, !"main", !6, null, !15}
!6 = !{!7, !12, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"V", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{i32 1, !"INDEX", i8 5, i8 0, !9, i8 1, i32 1, i8 1, i32 1, i8 0, !10}
!12 = !{!13}
!13 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !14}
!14 = !{i32 3, i32 3}
!15 = !{i32 0, i64 524288}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability GroupNonUniform
OpCapability GroupNonUniformShuffle
OpCapability GroupNonUniformQuad
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %13 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "V"
OpName %10 "INDEX"
OpName %13 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %10 Flat
OpDecorate %10 Location 1
OpDecorate %13 Location 0
OpDecorate %19 BuiltIn SubgroupLocalInvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 0
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 2
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%17 = OpConstant %8 3
%18 = OpConstant %8 2
%19 = OpVariable %9 Input
%22 = OpConstant %8 4294967292
%25 = OpTypePointer Output %5
%27 = OpConstant %8 0
%29 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%14 = OpLoad %8 %10
%15 = OpLoad %5 %7
%16 = OpGroupNonUniformQuadBroadcast %5 %17 %15 %18
%20 = OpLoad %8 %19
%21 = OpBitwiseAnd %8 %20 %22
%23 = OpIAdd %8 %21 %14
%24 = OpGroupNonUniformShuffle %5 %17 %15 %23
%26 = OpAccessChain %25 %13 %27
OpStore %26 %16
%28 = OpAccessChain %25 %13 %29
OpStore %28 %24
OpReturn
OpFunctionEnd
#endif
