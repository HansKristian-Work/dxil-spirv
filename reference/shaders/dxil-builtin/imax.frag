#version 460

layout(location = 0) flat in ivec2 A;
layout(location = 0) out int SV_Target;

void main()
{
    SV_Target = int(uint(max(int(uint(A.x)), int(uint(A.y)))));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call i32 @dx.op.binary.i32(i32 37, i32 %1, i32 %2)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %3)
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
!dx.viewIdState = !{!4}
!dx.entryPoints = !{!5}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[4 x i32] [i32 2, i32 1, i32 1, i32 1]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"A", i8 4, i8 0, !9, i8 1, i32 1, i8 2, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 3}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 4, i8 16, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !13}
!13 = !{i32 3, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
%21 = OpExtInstImport "GLSL.std.450"
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
%18 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%11 = OpInBoundsAccessChain %12 %8 %14
%15 = OpLoad %5 %11
%16 = OpBitcast %13 %15
%17 = OpInBoundsAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%20 = OpBitcast %13 %19
%22 = OpExtInst %13 %21 SMax %16 %20
%23 = OpBitcast %5 %22
OpStore %10 %23
OpReturn
OpFunctionEnd
#endif
