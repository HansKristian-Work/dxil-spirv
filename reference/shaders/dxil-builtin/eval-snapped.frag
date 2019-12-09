#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 1) flat in ivec2 CODE;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uint _20 = uint(CODE.x);
    uint _24 = uint(CODE.y);
    SV_Target.x = interpolateAtOffset(TEXCOORD.x, vec2(float(int(uint(bitfieldExtract(int(_20), int(0u), int(4u))))) * 0.0625, float(int(uint(bitfieldExtract(int(_24), int(0u), int(4u))))) * 0.0625)) + interpolateAtOffset(TEXCOORD.x, vec2(-0.4375, 0.25));
    SV_Target.y = interpolateAtOffset(TEXCOORD.y, vec2(float(int(uint(bitfieldExtract(int(_20), int(0u), int(4u))))) * 0.0625, float(int(uint(bitfieldExtract(int(_24), int(0u), int(4u))))) * 0.0625)) + interpolateAtOffset(TEXCOORD.y, vec2(-0.4375, 0.25));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.evalSnapped.f32(i32 87, i32 0, i32 0, i8 0, i32 -7, i32 4)
  %4 = call float @dx.op.evalSnapped.f32(i32 87, i32 0, i32 0, i8 1, i32 -7, i32 4)
  %5 = call float @dx.op.evalSnapped.f32(i32 87, i32 0, i32 0, i8 0, i32 %1, i32 %2)
  %6 = call float @dx.op.evalSnapped.f32(i32 87, i32 0, i32 0, i8 1, i32 %1, i32 %2)
  %7 = fadd fast float %5, %3
  %8 = fadd fast float %6, %4
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %8)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readnone
declare float @dx.op.evalSnapped.f32(i32, i32, i32, i8, i32, i32) #0

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
!4 = !{[8 x i32] [i32 6, i32 2, i32 0, i32 0, i32 0, i32 0, i32 3, i32 3]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !12, null}
!7 = !{!8, !10}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 2, i32 0, i8 0, null}
!9 = !{i32 0}
!10 = !{i32 1, !"CODE", i8 4, i8 0, !9, i8 1, i32 1, i8 2, i32 1, i8 0, !11}
!11 = !{i32 3, i32 3}
!12 = !{!13}
!13 = !{i32 0, !"SV_Target", i8 9, i8 16, !9, i8 0, i32 1, i8 2, i32 0, i8 0, !11}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
%27 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %12 "CODE"
OpName %14 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %12 Flat
OpDecorate %12 Location 1
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 1
%10 = OpTypeVector %9 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %9
%17 = OpTypeInt 32 0
%18 = OpConstant %17 0
%22 = OpConstant %17 1
%25 = OpTypePointer Input %5
%28 = OpConstant %5 -0.4375
%29 = OpConstant %5 0.25
%30 = OpConstantComposite %6 %28 %29
%36 = OpConstant %17 4
%39 = OpConstant %5 0.0625
%56 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%16 = OpAccessChain %15 %12 %18
%19 = OpLoad %9 %16
%20 = OpBitcast %17 %19
%21 = OpAccessChain %15 %12 %22
%23 = OpLoad %9 %21
%24 = OpBitcast %17 %23
%26 = OpAccessChain %25 %8 %18
%31 = OpExtInst %5 %27 InterpolateAtOffset %26 %30
%32 = OpAccessChain %25 %8 %22
%33 = OpExtInst %5 %27 InterpolateAtOffset %32 %30
%34 = OpAccessChain %25 %8 %18
%35 = OpBitFieldSExtract %17 %20 %18 %36
%37 = OpConvertSToF %5 %35
%38 = OpFMul %5 %37 %39
%40 = OpBitFieldSExtract %17 %24 %18 %36
%41 = OpConvertSToF %5 %40
%42 = OpFMul %5 %41 %39
%43 = OpCompositeConstruct %6 %38 %42
%44 = OpExtInst %5 %27 InterpolateAtOffset %34 %43
%45 = OpAccessChain %25 %8 %22
%46 = OpBitFieldSExtract %17 %20 %18 %36
%47 = OpConvertSToF %5 %46
%48 = OpFMul %5 %47 %39
%49 = OpBitFieldSExtract %17 %24 %18 %36
%50 = OpConvertSToF %5 %49
%51 = OpFMul %5 %50 %39
%52 = OpCompositeConstruct %6 %48 %51
%53 = OpExtInst %5 %27 InterpolateAtOffset %45 %52
%54 = OpFAdd %5 %44 %31
%55 = OpFAdd %5 %53 %33
%57 = OpAccessChain %56 %14 %18
OpStore %57 %54
%58 = OpAccessChain %56 %14 %22
OpStore %58 %55
OpReturn
OpFunctionEnd
#endif
