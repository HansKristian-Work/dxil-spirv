#version 460

void main()
{
    float _16 = float(uint(gl_InstanceIndex) - uint(gl_BaseInstance));
    gl_Position.x = _16;
    gl_Position.y = _16;
    gl_Position.z = _16;
    gl_Position.w = _16;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = uitofp i32 %1 to float
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %2)
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
!3 = !{!"vs", i32 6, i32 0}
!4 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_InstanceID", i8 5, i8 2, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !13}
!13 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13
OpName %3 "main"
OpName %7 "SV_InstanceID"
OpName %11 "SV_Position"
OpDecorate %7 BuiltIn InstanceIndex
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn BaseInstance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpVariable %6 Input
%18 = OpTypePointer Output %8
%19 = OpConstant %5 0
%21 = OpConstant %5 1
%23 = OpConstant %5 2
%25 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%12 = OpLoad %5 %7
%14 = OpLoad %5 %13
%15 = OpISub %5 %12 %14
%16 = OpConvertUToF %8 %15
%17 = OpInBoundsAccessChain %18 %11 %19
OpStore %17 %16
%20 = OpInBoundsAccessChain %18 %11 %21
OpStore %20 %16
%22 = OpInBoundsAccessChain %18 %11 %23
OpStore %22 %16
%24 = OpInBoundsAccessChain %18 %11 %25
OpStore %24 %16
OpReturn
OpFunctionEnd
#endif
