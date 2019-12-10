#version 460

layout(location = 0) in float A;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    uvec2 _16 = unpackDouble2x32(double(A));
    SV_Target.x = _16.x;
    SV_Target.y = _16.y;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.splitdouble = type { i32, i32 }

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = fpext float %1 to double
  %3 = call %dx.types.splitdouble @dx.op.splitDouble.f64(i32 102, double %2)
  %4 = extractvalue %dx.types.splitdouble %3, 0
  %5 = extractvalue %dx.types.splitdouble %3, 1
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %4)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 1, i32 %5)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind readnone
declare %dx.types.splitdouble @dx.op.splitDouble.f64(i32, double) #0

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
!4 = !{[3 x i32] [i32 1, i32 2, i32 3]}
!5 = !{void ()* @main, !"main", !6, null, !14}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"A", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 5, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !13}
!13 = !{i32 3, i32 3}
!14 = !{i32 0, i64 4}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
OpCapability Float64
%15 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %11 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 0
%9 = OpTypeVector %8 2
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpTypeFloat 64
%19 = OpTypePointer Output %8
%21 = OpConstant %8 0
%23 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%12 = OpLoad %5 %7
%14 = OpFConvert %13 %12
%16 = OpExtInst %9 %15 UnpackDouble2x32 %14
%17 = OpCompositeExtract %8 %16 0
%18 = OpCompositeExtract %8 %16 1
%20 = OpAccessChain %19 %11 %21
OpStore %20 %17
%22 = OpAccessChain %19 %11 %23
OpStore %22 %18
OpReturn
OpFunctionEnd
#endif
