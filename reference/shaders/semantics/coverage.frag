#version 460

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = 1.0;
    SV_Target.y = 1.0;
    SV_Target.z = 1.0;
    SV_Target.w = 1.0;
    gl_SampleMask[0u] = gl_SampleMaskIn[0u] & 3u;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.coverage.i32(i32 91)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float 1.000000e+00)
  %2 = and i32 %1, 3
  call void @dx.op.storeOutput.i32(i32 5, i32 1, i32 0, i8 0, i32 %2)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.coverage.i32(i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

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
!4 = !{[2 x i32] [i32 0, i32 4]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{null, !7, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"SV_Coverage", i8 5, i8 14, !9, i8 0, i32 1, i8 1, i32 -1, i8 -1, !12}
!12 = !{i32 3, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Target"
OpName %13 "SV_Coverage"
OpDecorate %8 Location 0
OpDecorate %13 BuiltIn SampleMask
OpDecorate %15 BuiltIn SampleMask
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeArray %9 %10
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypePointer Input %11
%15 = OpVariable %14 Input
%16 = OpTypePointer Input %9
%18 = OpConstant %9 0
%20 = OpTypePointer Output %5
%22 = OpConstant %5 1
%25 = OpConstant %9 2
%27 = OpConstant %9 3
%29 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%17 = OpAccessChain %16 %15 %18
%19 = OpLoad %9 %17
%21 = OpAccessChain %20 %8 %18
OpStore %21 %22
%23 = OpAccessChain %20 %8 %10
OpStore %23 %22
%24 = OpAccessChain %20 %8 %25
OpStore %24 %22
%26 = OpAccessChain %20 %8 %27
OpStore %26 %22
%28 = OpBitwiseAnd %9 %19 %27
%30 = OpAccessChain %29 %13 %18
OpStore %30 %28
OpReturn
OpFunctionEnd
#endif
