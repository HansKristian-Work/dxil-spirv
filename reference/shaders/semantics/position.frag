#version 460

layout(location = 0) flat in uint INDEX;
layout(location = 0) out float SV_Target;

void main()
{
    float _33[4];
    _33[0u] = gl_FragCoord.x;
    _33[1u] = gl_FragCoord.y;
    _33[2u] = gl_FragCoord.z;
    _33[3u] = 1.0 / gl_FragCoord.w;
    SV_Target = _33[INDEX];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %6 = alloca [4 x float], align 4
  %7 = getelementptr inbounds [4 x float], [4 x float]* %6, i32 0, i32 0
  store float %2, float* %7, align 4
  %8 = getelementptr inbounds [4 x float], [4 x float]* %6, i32 0, i32 1
  store float %3, float* %8, align 4
  %9 = getelementptr inbounds [4 x float], [4 x float]* %6, i32 0, i32 2
  store float %4, float* %9, align 4
  %10 = getelementptr inbounds [4 x float], [4 x float]* %6, i32 0, i32 3
  store float %5, float* %10, align 4
  %11 = getelementptr [4 x float], [4 x float]* %6, i32 0, i32 %1
  %12 = load float, float* %11, align 4, !tbaa !15
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %12)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

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
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[7 x i32] [i32 5, i32 1, i32 1, i32 1, i32 1, i32 1, i32 1]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !13, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"INDEX", i8 5, i8 0, !9, i8 1, i32 1, i8 1, i32 1, i8 0, !12}
!12 = !{i32 3, i32 1}
!13 = !{!14}
!14 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !12}
!15 = !{!16, !16, i64 0}
!16 = !{!"float", !17, i64 0}
!17 = !{!"omnipotent char", !18, i64 0}
!18 = !{!"Simple C/C++ TBAA"}
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
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Position"
OpName %11 "INDEX"
OpName %13 "SV_Target"
OpName %33 ""
OpDecorate %8 BuiltIn FragCoord
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 0
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %9 0
%20 = OpConstant %9 1
%23 = OpConstant %9 2
%26 = OpConstant %9 3
%29 = OpConstant %5 1
%30 = OpConstant %9 4
%31 = OpTypeArray %5 %30
%32 = OpTypePointer Function %31
%34 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%33 = OpVariable %32 Function
OpBranch %41
%41 = OpLabel
%14 = OpLoad %9 %11
%16 = OpAccessChain %15 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %15 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %15 %8 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %15 %8 %26
%27 = OpLoad %5 %25
%28 = OpFDiv %5 %29 %27
%35 = OpInBoundsAccessChain %34 %33 %17
OpStore %35 %18
%36 = OpInBoundsAccessChain %34 %33 %20
OpStore %36 %21
%37 = OpInBoundsAccessChain %34 %33 %23
OpStore %37 %24
%38 = OpInBoundsAccessChain %34 %33 %26
OpStore %38 %28
%39 = OpAccessChain %34 %33 %14
%40 = OpLoad %5 %39
OpStore %13 %40
OpReturn
OpFunctionEnd
#endif
