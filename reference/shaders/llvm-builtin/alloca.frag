#version 460

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _14[4];
    _14[0u] = 1u;
    _14[1u] = 2u;
    _14[2u] = 3u;
    _14[3u] = 4u;
    _14[TEXCOORD & 3u] = TEXCOORD;
    SV_Target = ((_14[1u] + _14[0u]) + _14[2u]) + _14[3u];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = alloca [4 x i32], align 4
  %3 = getelementptr inbounds [4 x i32], [4 x i32]* %2, i32 0, i32 0
  store i32 1, i32* %3, align 4, !tbaa !13
  %4 = getelementptr inbounds [4 x i32], [4 x i32]* %2, i32 0, i32 1
  store i32 2, i32* %4, align 4, !tbaa !13
  %5 = getelementptr inbounds [4 x i32], [4 x i32]* %2, i32 0, i32 2
  store i32 3, i32* %5, align 4, !tbaa !13
  %6 = getelementptr inbounds [4 x i32], [4 x i32]* %2, i32 0, i32 3
  store i32 4, i32* %6, align 4, !tbaa !13
  %7 = and i32 %1, 3
  %8 = getelementptr inbounds [4 x i32], [4 x i32]* %2, i32 0, i32 %7
  store i32 %1, i32* %8, align 4, !tbaa !13
  %9 = load i32, i32* %3, align 4, !tbaa !13
  %10 = load i32, i32* %4, align 4, !tbaa !13
  %11 = add i32 %10, %9
  %12 = load i32, i32* %5, align 4, !tbaa !13
  %13 = add i32 %11, %12
  %14 = load i32, i32* %6, align 4, !tbaa !13
  %15 = add i32 %13, %14
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %15)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

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
!4 = !{[3 x i32] [i32 1, i32 1, i32 1]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !9, i8 1, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 5, i8 16, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !10}
!13 = !{!14, !14, i64 0}
!14 = !{!"int", !15, i64 0}
!15 = !{!"omnipotent char", !16, i64 0}
!16 = !{!"Simple C/C++ TBAA"}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "TEXCOORD"
OpName %9 "SV_Target"
OpName %14 ""
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpConstant %5 4
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Function %12
%16 = OpTypePointer Function %5
%17 = OpConstant %5 0
%18 = OpConstant %5 1
%20 = OpConstant %5 2
%22 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
%14 = OpVariable %13 Function
OpBranch %33
%33 = OpLabel
%10 = OpLoad %5 %7
%15 = OpInBoundsAccessChain %16 %14 %17
OpStore %15 %18
%19 = OpInBoundsAccessChain %16 %14 %18
OpStore %19 %20
%21 = OpInBoundsAccessChain %16 %14 %20
OpStore %21 %22
%23 = OpInBoundsAccessChain %16 %14 %22
OpStore %23 %11
%24 = OpBitwiseAnd %5 %10 %22
%25 = OpInBoundsAccessChain %16 %14 %24
OpStore %25 %10
%26 = OpLoad %5 %15
%27 = OpLoad %5 %19
%28 = OpIAdd %5 %27 %26
%29 = OpLoad %5 %21
%30 = OpIAdd %5 %28 %29
%31 = OpLoad %5 %23
%32 = OpIAdd %5 %30 %31
OpStore %9 %32
OpReturn
OpFunctionEnd
#endif
