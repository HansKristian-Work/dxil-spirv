#version 460

layout(location = 0) flat in ivec2 A;
layout(location = 0) out int SV_Target;

void main()
{
    SV_Target = int(uint(min(A.x, A.y)));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %IMin = call i32 @dx.op.binary.i32(i32 38, i32 %1, i32 %2)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %IMin)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind readnone
declare i32 @dx.op.binary.i32(i32, i32, i32) #0

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.typeAnnotations = !{!4}
!dx.viewIdState = !{!8}
!dx.entryPoints = !{!9}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{i32 1, void ()* @main, !5}
!5 = !{!6}
!6 = !{i32 0, !7, !7}
!7 = !{}
!8 = !{[4 x i32] [i32 2, i32 1, i32 1, i32 1]}
!9 = !{void ()* @main, !"main", !10, null, null}
!10 = !{!11, !14, null}
!11 = !{!12}
!12 = !{i32 0, !"A", i8 4, i8 0, !13, i8 1, i32 1, i8 2, i32 0, i8 0, null}
!13 = !{i32 0}
!14 = !{!15}
!15 = !{i32 0, !"SV_Target", i8 4, i8 16, !13, i8 0, i32 1, i8 1, i32 0, i8 0, null}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 24
; Schema: 0
OpCapability Shader
%19 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%12 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %22
%22 = OpLabel
%11 = OpInBoundsAccessChain %12 %8 %14
%15 = OpLoad %5 %11
%16 = OpInBoundsAccessChain %12 %8 %17
%18 = OpLoad %5 %16
%20 = OpExtInst %13 %19 SMin %15 %18
%21 = OpBitcast %5 %20
OpStore %10 %21
OpReturn
OpFunctionEnd
#endif
