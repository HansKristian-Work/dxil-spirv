#version 460

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;
layout(location = 1) out vec4 SV_Target_1;

void main()
{
    SV_Target.y = TEXCOORD.x;
    SV_Target.z = TEXCOORD.y;
    SV_Target.w = TEXCOORD.z;
    SV_Target.x = TEXCOORD.w;
    SV_Target_1.y = TEXCOORD.x;
    SV_Target_1.x = TEXCOORD.y;
    SV_Target_1.w = TEXCOORD.z;
    SV_Target_1.z = TEXCOORD.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %4)
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
!4 = !{[6 x i32] [i32 4, i32 8, i32 17, i32 34, i32 68, i32 136]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{!12, !13}
!12 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!13 = !{i32 1, !"SV_Target", i8 9, i8 16, !14, i8 0, i32 1, i8 4, i32 1, i8 0, !10}
!14 = !{i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %10 "SV_Target"
OpName %11 "SV_Target_1"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
OpDecorate %11 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpVariable %9 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%24 = OpConstant %14 3
%26 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %8 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %12 %8 %24
%25 = OpLoad %5 %23
%27 = OpAccessChain %26 %10 %18
OpStore %27 %16
%28 = OpAccessChain %26 %10 %21
OpStore %28 %19
%29 = OpAccessChain %26 %10 %24
OpStore %29 %22
%30 = OpAccessChain %26 %10 %15
OpStore %30 %25
%31 = OpAccessChain %26 %11 %18
OpStore %31 %16
%32 = OpAccessChain %26 %11 %15
OpStore %32 %19
%33 = OpAccessChain %26 %11 %24
OpStore %33 %22
%34 = OpAccessChain %26 %11 %21
OpStore %34 %25
OpReturn
OpFunctionEnd
#endif
