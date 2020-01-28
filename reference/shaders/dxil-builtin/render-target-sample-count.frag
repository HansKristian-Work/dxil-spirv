#version 460

layout(constant_id = 0) const uint _10 = 1u;

layout(location = 0) out vec4 SV_Target;

void main()
{
    float _11 = float(_10);
    SV_Target.x = _11;
    SV_Target.y = _11;
    SV_Target.z = _11;
    SV_Target.w = _11;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.renderTargetGetSampleCount(i32 77)
  %2 = uitofp i32 %1 to float
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %2)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readonly
declare i32 @dx.op.renderTargetGetSampleCount(i32) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

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
!7 = !{!8}
!8 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 23
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 SpecId 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpSpecConstant %9 1
%12 = OpTypePointer Output %5
%14 = OpConstant %9 0
%16 = OpConstant %9 1
%18 = OpConstant %9 2
%20 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %21
%21 = OpLabel
%11 = OpConvertUToF %5 %10
%13 = OpAccessChain %12 %8 %14
OpStore %13 %11
%15 = OpAccessChain %12 %8 %16
OpStore %15 %11
%17 = OpAccessChain %12 %8 %18
OpStore %17 %11
%19 = OpAccessChain %12 %8 %20
OpStore %19 %11
OpReturn
OpFunctionEnd
#endif
