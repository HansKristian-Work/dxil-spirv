#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[2];
} _12;

layout(location = 0, index = 0) out vec4 SV_Target;
layout(location = 0, index = 1) out vec4 SV_Target_1;

void main()
{
    SV_Target.x = _12._m0[0u].x;
    SV_Target.y = _12._m0[0u].y;
    SV_Target.z = _12._m0[0u].z;
    SV_Target.w = _12._m0[0u].w;
    SV_Target_1.x = _12._m0[1u].x;
    SV_Target_1.y = _12._m0[1u].y;
    SV_Target_1.z = _12._m0[1u].z;
    SV_Target_1.w = _12._m0[1u].w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.CBufRet.f32 = type { float, float, float, float }
%"$Globals" = type { <4 x float>, <4 x float> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 0, i32 0, i1 false)
  %2 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %1, i32 0)
  %3 = extractvalue %dx.types.CBufRet.f32 %2, 0
  %4 = extractvalue %dx.types.CBufRet.f32 %2, 1
  %5 = extractvalue %dx.types.CBufRet.f32 %2, 2
  %6 = extractvalue %dx.types.CBufRet.f32 %2, 3
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %6)
  %7 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %1, i32 1)
  %8 = extractvalue %dx.types.CBufRet.f32 %7, 0
  %9 = extractvalue %dx.types.CBufRet.f32 %7, 1
  %10 = extractvalue %dx.types.CBufRet.f32 %7, 2
  %11 = extractvalue %dx.types.CBufRet.f32 %7, 3
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %11)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readonly
declare %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32, %dx.types.Handle, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.viewIdState = !{!7}
!dx.entryPoints = !{!8}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, null, !5, null}
!5 = !{!6}
!6 = !{i32 0, %"$Globals"* undef, !"", i32 0, i32 0, i32 1, i32 32, null}
!7 = !{[2 x i32] [i32 0, i32 8]}
!8 = !{void ()* @main, !"main", !9, !4, null}
!9 = !{null, !10, null}
!10 = !{!11, !14}
!11 = !{i32 0, !"SV_Target", i8 9, i8 16, !12, i8 0, i32 1, i8 4, i32 0, i8 0, !13}
!12 = !{i32 0}
!13 = !{i32 3, i32 15}
!14 = !{i32 1, !"SV_Target", i8 9, i8 16, !15, i8 0, i32 1, i8 4, i32 1, i8 0, !13}
!15 = !{i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "SV_Target"
OpName %15 "SV_Target_1"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
OpDecorate %14 Index 0
OpDecorate %15 Location 0
OpDecorate %15 Index 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 2
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Output %8
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpConstant %5 0
%17 = OpTypePointer Uniform %8
%24 = OpTypePointer Output %7
%27 = OpConstant %5 1
%30 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %41
%41 = OpLabel
%18 = OpAccessChain %17 %12 %16 %16
%19 = OpLoad %8 %18
%20 = OpCompositeExtract %7 %19 0
%21 = OpCompositeExtract %7 %19 1
%22 = OpCompositeExtract %7 %19 2
%23 = OpCompositeExtract %7 %19 3
%25 = OpAccessChain %24 %14 %16
OpStore %25 %20
%26 = OpAccessChain %24 %14 %27
OpStore %26 %21
%28 = OpAccessChain %24 %14 %6
OpStore %28 %22
%29 = OpAccessChain %24 %14 %30
OpStore %29 %23
%31 = OpAccessChain %17 %12 %16 %27
%32 = OpLoad %8 %31
%33 = OpCompositeExtract %7 %32 0
%34 = OpCompositeExtract %7 %32 1
%35 = OpCompositeExtract %7 %32 2
%36 = OpCompositeExtract %7 %32 3
%37 = OpAccessChain %24 %15 %16
OpStore %37 %33
%38 = OpAccessChain %24 %15 %27
OpStore %38 %34
%39 = OpAccessChain %24 %15 %6
OpStore %39 %35
%40 = OpAccessChain %24 %15 %30
OpStore %40 %36
OpReturn
OpFunctionEnd
#endif
