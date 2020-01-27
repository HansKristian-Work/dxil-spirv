#version 460

layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = float((gl_FrontFacing ? 4294967295u : 0u) != 0u);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = icmp ne i32 %1, 0
  %3 = select i1 %2, float 1.000000e+00, float 0.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %3)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

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
!4 = !{[3 x i32] [i32 1, i32 1, i32 1]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_IsFrontFace", i8 5, i8 13, !9, i8 1, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !10}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_IsFrontFace"
OpName %11 "SV_Target"
OpDecorate %8 BuiltIn FrontFacing
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeBool
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeFloat 32
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%14 = OpConstant %5 4294967295
%15 = OpConstant %5 0
%18 = OpConstant %9 1
%19 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%12 = OpLoad %6 %8
%13 = OpSelect %5 %12 %14 %15
%16 = OpINotEqual %6 %13 %15
%17 = OpSelect %9 %16 %18 %19
OpStore %11 %17
OpReturn
OpFunctionEnd
#endif
