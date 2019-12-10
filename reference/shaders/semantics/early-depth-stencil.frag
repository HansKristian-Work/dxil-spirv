#version 460
layout(early_fragment_tests) in;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = 1.0;
    SV_Target.y = 1.0;
    SV_Target.z = 1.0;
    SV_Target.w = 1.0;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float 1.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float 1.000000e+00)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

attributes #0 = { nounwind }

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
!5 = !{void ()* @main, !"main", !6, null, !11}
!6 = !{null, !7, null}
!7 = !{!8}
!8 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 0, i64 8}
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
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpName %3 "main"
OpName %8 "SV_Target"
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypePointer Output %5
%11 = OpTypeInt 32 0
%12 = OpConstant %11 0
%13 = OpConstant %5 1
%15 = OpConstant %11 1
%17 = OpConstant %11 2
%19 = OpConstant %11 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%10 = OpAccessChain %9 %8 %12
OpStore %10 %13
%14 = OpAccessChain %9 %8 %15
OpStore %14 %13
%16 = OpAccessChain %9 %8 %17
OpStore %16 %13
%18 = OpAccessChain %9 %8 %19
OpStore %18 %13
OpReturn
OpFunctionEnd
#endif
