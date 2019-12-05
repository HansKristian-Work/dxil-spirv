#version 460

const uint _29[16] = uint[](1u, 4294967295u, 2u, 4294967294u, 3u, 4294967293u, 5u, 4294967291u, 7u, 4294967289u, 11u, 4294967285u, 13u, 4294967283u, 17u, 4294967279u);

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    SV_Target.x = _29[0u + (TEXCOORD * 2u)];
    SV_Target.y = _29[1u + (TEXCOORD * 2u)];
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

@values.v.1dim = internal constant [16 x i32] [i32 1, i32 -1, i32 2, i32 -2, i32 3, i32 -3, i32 5, i32 -5, i32 7, i32 -7, i32 11, i32 -11, i32 13, i32 -13, i32 17, i32 -17]

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = mul i32 %1, 2
  %3 = add i32 0, %2
  %4 = getelementptr [16 x i32], [16 x i32]* @values.v.1dim, i32 0, i32 %3
  %5 = load i32, i32* %4, align 8
  %6 = mul i32 %1, 2
  %7 = add i32 1, %6
  %8 = getelementptr [16 x i32], [16 x i32]* @values.v.1dim, i32 0, i32 %7
  %9 = load i32, i32* %8, align 4
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %5)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 1, i32 %9)
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
!4 = !{[3 x i32] [i32 1, i32 2, i32 3]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !9, i8 1, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"SV_Target", i8 5, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !13}
!13 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "TEXCOORD"
OpName %10 "SV_Target"
OpName %31 "values.v.1dim"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 2
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpConstant %5 16
%12 = OpTypeArray %5 %11
%13 = OpConstant %5 1
%14 = OpConstant %5 4294967295
%15 = OpConstant %5 2
%16 = OpConstant %5 4294967294
%17 = OpConstant %5 3
%18 = OpConstant %5 4294967293
%19 = OpConstant %5 5
%20 = OpConstant %5 4294967291
%21 = OpConstant %5 7
%22 = OpConstant %5 4294967289
%23 = OpConstant %5 11
%24 = OpConstant %5 4294967285
%25 = OpConstant %5 13
%26 = OpConstant %5 4294967283
%27 = OpConstant %5 17
%28 = OpConstant %5 4294967279
%29 = OpConstantComposite %12 %13 %14 %15 %16 %17 %18 %19 %20 %21 %22 %23 %24 %25 %26 %27 %28
%30 = OpTypePointer Private %12
%31 = OpVariable %30 Private %29
%35 = OpConstant %5 0
%37 = OpTypePointer Private %5
%44 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%32 = OpLoad %5 %7
%33 = OpIMul %5 %32 %15
%34 = OpIAdd %5 %35 %33
%36 = OpAccessChain %37 %31 %34
%38 = OpLoad %5 %36
%39 = OpIMul %5 %32 %15
%40 = OpIAdd %5 %13 %39
%41 = OpAccessChain %37 %31 %40
%42 = OpLoad %5 %41
%43 = OpInBoundsAccessChain %44 %10 %35
OpStore %43 %38
%45 = OpInBoundsAccessChain %44 %10 %13
OpStore %45 %42
OpReturn
OpFunctionEnd
#endif
