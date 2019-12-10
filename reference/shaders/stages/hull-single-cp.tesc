#version 460
layout(vertices = 1) out;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[1];
layout(location = 0) patch out float PATCH;

void hull_main()
{
    HSValue[gl_InvocationID] = (VSValue[1u] + VSValue[0u]) + VSValue[2u];
}

void patch_main()
{
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    PATCH = VSValue[3u];
}

void main()
{
    hull_main();
    patch_main();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  %3 = fadd fast float %2, %1
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  %5 = fadd fast float %3, %4
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %5)
  ret void
}

define void @"\01?main_patch@@YA?AUPatchConstant@@V?$OutputPatch@UHSControlPoint@@$00@@V?$InputPatch@UVSControlPoint@@$04@@@Z"() {
  %1 = call float @dx.op.loadOutputControlPoint.f32(i32 103, i32 0, i32 0, i8 0, i32 0)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 1, i32 0, i8 0, float %1)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 0, i8 0, float %2)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 1, i8 0, float %3)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 2, i8 0, float %4)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 3)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 2, i32 0, i8 0, float %5)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind
declare void @dx.op.storePatchConstant.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readnone
declare float @dx.op.loadOutputControlPoint.f32(i32, i32, i32, i8, i32) #0

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
!3 = !{!"hs", i32 6, i32 0}
!4 = !{[5 x i32] [i32 1, i32 1, i32 1, i32 13, i32 6281]}
!5 = !{void ()* @main, !"main", !6, null, !18}
!6 = !{!7, !11, !13}
!7 = !{!8}
!8 = !{i32 0, !"VSValue", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"HSValue", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!13 = !{!14, !16, !17}
!14 = !{i32 0, !"SV_TessFactor", i8 9, i8 25, !15, i8 0, i32 3, i8 1, i32 0, i8 3, !10}
!15 = !{i32 0, i32 1, i32 2}
!16 = !{i32 1, !"SV_InsideTessFactor", i8 9, i8 26, !9, i8 0, i32 1, i8 1, i32 3, i8 0, !10}
!17 = !{i32 2, !"PATCH", i8 9, i8 0, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !10}
!18 = !{i32 3, !19}
!19 = !{void ()* @"\01?main_patch@@YA?AUPatchConstant@@V?$OutputPatch@UHSControlPoint@@$00@@V?$InputPatch@UVSControlPoint@@$04@@@Z", i32 5, i32 1, i32 2, i32 1, i32 4, float 6.400000e+01}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %18 %22 %24 %41
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCcw
OpExecutionMode %3 OutputVertices 1
OpName %3 "main"
OpName %10 "VSValue"
OpName %14 "HSValue"
OpName %18 "SV_TessFactor"
OpName %22 "SV_InsideTessFactor"
OpName %24 "PATCH"
OpName %25 "hull_main"
OpName %27 "patch_main"
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %18 BuiltIn TessLevelOuter
OpDecorate %18 Patch
OpDecorate %22 BuiltIn TessLevelInner
OpDecorate %22 Patch
OpDecorate %24 Location 0
OpDecorate %24 Patch
OpDecorate %41 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 5
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpConstant %6 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpConstant %6 4
%16 = OpTypeArray %5 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpConstant %6 2
%20 = OpTypeArray %5 %19
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypePointer Output %5
%24 = OpVariable %23 Output
%29 = OpTypePointer Input %5
%31 = OpConstant %6 0
%40 = OpTypePointer Input %6
%41 = OpVariable %40 Input
%56 = OpConstant %6 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%58 = OpFunctionCall %1 %25
%59 = OpFunctionCall %1 %27
OpReturn
OpFunctionEnd
%25 = OpFunction %1 None %2
%26 = OpLabel
OpBranch %62
%62 = OpLabel
%30 = OpAccessChain %29 %10 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %29 %10 %11
%34 = OpLoad %5 %33
%35 = OpFAdd %5 %34 %32
%36 = OpAccessChain %29 %10 %19
%37 = OpLoad %5 %36
%38 = OpFAdd %5 %35 %37
%42 = OpLoad %6 %41
%39 = OpAccessChain %23 %14 %42
OpStore %39 %38
OpReturn
OpFunctionEnd
%27 = OpFunction %1 None %2
%28 = OpLabel
OpBranch %64
%64 = OpLabel
%43 = OpAccessChain %23 %14 %31
%44 = OpLoad %5 %43
%45 = OpAccessChain %23 %22 %31
OpStore %45 %44
%46 = OpAccessChain %29 %10 %31
%47 = OpLoad %5 %46
%48 = OpAccessChain %23 %18 %31
OpStore %48 %47
%49 = OpAccessChain %29 %10 %11
%50 = OpLoad %5 %49
%51 = OpAccessChain %23 %18 %11
OpStore %51 %50
%52 = OpAccessChain %29 %10 %19
%53 = OpLoad %5 %52
%54 = OpAccessChain %23 %18 %19
OpStore %54 %53
%55 = OpAccessChain %29 %10 %56
%57 = OpLoad %5 %55
OpStore %24 %57
OpReturn
OpFunctionEnd
#endif
