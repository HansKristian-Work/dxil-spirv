#version 460

layout(location = 0) in vec4 A;
layout(location = 1) in vec4 B;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = A.x - B.x * trunc(A.x / B.x);
    SV_Target.y = A.y - B.y * trunc(A.y / B.y);
    SV_Target.z = A.z - B.z * trunc(A.z / B.z);
    SV_Target.w = A.w - B.w * trunc(A.w / B.w);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %.i0 = frem fast float %5, %1
  %.i1 = frem fast float %6, %2
  %.i2 = frem fast float %7, %3
  %.i3 = frem fast float %8, %4
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %.i2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %.i3)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

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
!8 = !{[10 x i32] [i32 8, i32 4, i32 1, i32 2, i32 4, i32 8, i32 1, i32 2, i32 4, i32 8]}
!9 = !{void ()* @main, !"main", !10, null, null}
!10 = !{!11, !15, null}
!11 = !{!12, !14}
!12 = !{i32 0, !"A", i8 9, i8 0, !13, i8 2, i32 1, i8 4, i32 0, i8 0, null}
!13 = !{i32 0}
!14 = !{i32 1, !"B", i8 9, i8 0, !13, i8 2, i32 1, i8 4, i32 1, i8 0, null}
!15 = !{!16}
!16 = !{i32 0, !"SV_Target", i8 9, i8 16, !13, i8 0, i32 1, i8 4, i32 0, i8 0, null}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 45
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%13 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%24 = OpConstant %14 3
%39 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %43
%43 = OpLabel
%12 = OpInBoundsAccessChain %13 %9 %15
%16 = OpLoad %5 %12
%17 = OpInBoundsAccessChain %13 %9 %18
%19 = OpLoad %5 %17
%20 = OpInBoundsAccessChain %13 %9 %21
%22 = OpLoad %5 %20
%23 = OpInBoundsAccessChain %13 %9 %24
%25 = OpLoad %5 %23
%26 = OpInBoundsAccessChain %13 %8 %15
%27 = OpLoad %5 %26
%28 = OpInBoundsAccessChain %13 %8 %18
%29 = OpLoad %5 %28
%30 = OpInBoundsAccessChain %13 %8 %21
%31 = OpLoad %5 %30
%32 = OpInBoundsAccessChain %13 %8 %24
%33 = OpLoad %5 %32
%34 = OpFRem %5 %27 %16
%35 = OpFRem %5 %29 %19
%36 = OpFRem %5 %31 %22
%37 = OpFRem %5 %33 %25
%38 = OpInBoundsAccessChain %39 %11 %15
OpStore %38 %34
%40 = OpInBoundsAccessChain %39 %11 %18
OpStore %40 %35
%41 = OpInBoundsAccessChain %39 %11 %21
OpStore %41 %36
%42 = OpInBoundsAccessChain %39 %11 %24
OpStore %42 %37
OpReturn
OpFunctionEnd
#endif
