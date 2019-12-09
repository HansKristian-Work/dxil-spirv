#version 460

layout(set = 0, binding = 0, r32ui) uniform readonly writeonly uimageBuffer _8;
layout(set = 1, binding = 0, r32ui) uniform uimageBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly writeonly uimageBuffer _10;
layout(set = 1, binding = 1, r32ui) uniform uimageBuffer _11;

layout(location = 0) out uint SV_Target;

void main()
{
    uint _19 = imageAtomicAdd(_9, int(0u), 1u);
    uint _22 = imageAtomicAdd(_11, int(0u), 4294967295u);
    SV_Target = (_22 - 1u) + _19;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%"class.RWStructuredBuffer<vector<float, 2> >" = type { <2 x float> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 1, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %3 = call i32 @dx.op.bufferUpdateCounter(i32 70, %dx.types.Handle %2, i8 1)
  %4 = call i32 @dx.op.bufferUpdateCounter(i32 70, %dx.types.Handle %1, i8 -1)
  %5 = add i32 %4, %3
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %5)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare i32 @dx.op.bufferUpdateCounter(i32, %dx.types.Handle, i8) #0

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.viewIdState = !{!9}
!dx.entryPoints = !{!10}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8}
!6 = !{i32 0, %"class.RWStructuredBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 12, i1 false, i1 true, i1 false, !7}
!7 = !{i32 1, i32 8}
!8 = !{i32 1, %"class.RWStructuredBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 12, i1 false, i1 true, i1 false, !7}
!9 = !{[2 x i32] [i32 0, i32 1]}
!10 = !{void ()* @main, !"main", !11, !4, !16}
!11 = !{null, !12, null}
!12 = !{!13}
!13 = !{i32 0, !"SV_Target", i8 5, i8 16, !14, i8 0, i32 1, i8 1, i32 0, i8 0, !15}
!14 = !{i32 0}
!15 = !{i32 3, i32 1}
!16 = !{i32 0, i64 16}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 1
OpDecorate %9 Binding 0
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 1
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpVariable %7 UniformConstant
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%16 = OpTypePointer Image %5
%18 = OpConstant %5 0
%20 = OpConstant %5 1
%23 = OpConstant %5 4294967295
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%14 = OpLoad %6 %10
%15 = OpLoad %6 %8
%17 = OpImageTexelPointer %16 %9 %18 %18
%19 = OpAtomicIAdd %5 %17 %20 %18 %20
%21 = OpImageTexelPointer %16 %11 %18 %18
%22 = OpAtomicIAdd %5 %21 %20 %18 %23
%24 = OpISub %5 %22 %20
%25 = OpIAdd %5 %24 %19
OpStore %13 %25
OpReturn
OpFunctionEnd
#endif
