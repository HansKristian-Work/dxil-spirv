#version 460

layout(location = 0) out vec3 SV_Target;

void main()
{
    SV_Target.x = gl_FragCoord.x;
    SV_Target.y = gl_FragCoord.y;
    SV_Target.z = gl_FragCoord.z;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
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
!dx.viewIdState = !{!4}
!dx.entryPoints = !{!5}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[5 x i32] [i32 3, i32 3, i32 1, i32 2, i32 4]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 3, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 7}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 3, i32 0, i8 0, !10}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 "SV_Position"
OpName %11 "SV_Target"
OpDecorate %9 BuiltIn FragCoord
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypeVector %5 4
%8 = OpTypePointer Input %7
%9 = OpVariable %8 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%23 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %9 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %9 %21
%22 = OpLoad %5 %20
%24 = OpAccessChain %23 %11 %15
OpStore %24 %16
%25 = OpAccessChain %23 %11 %18
OpStore %25 %19
%26 = OpAccessChain %23 %11 %21
OpStore %26 %22
OpReturn
OpFunctionEnd
#endif
