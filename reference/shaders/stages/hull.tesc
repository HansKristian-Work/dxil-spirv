#version 460
layout(vertices = 4) out;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 0) patch out float PATCH;

void hull_main()
{
    HSValue[gl_InvocationID] = (VSValue[1u] + VSValue[0u]) + VSValue[2u];
}

void patch_main()
{
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelInner[1u] = HSValue[1u];
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelOuter[3u] = HSValue[0u] + VSValue[0u];
    PATCH = 2.0;
}

void main()
{
    hull_main();
    barrier();
    if (gl_InvocationID == 0u)
    {
        patch_main();
    }
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

define void @"\01?main_patch@@YA?AUPatchConstant@@V?$OutputPatch@UHSControlPoint@@$03@@V?$InputPatch@UVSControlPoint@@$04@@@Z"() {
  %1 = call float @dx.op.loadOutputControlPoint.f32(i32 103, i32 0, i32 0, i8 0, i32 0)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 1, i32 0, i8 0, float %1)
  %2 = call float @dx.op.loadOutputControlPoint.f32(i32 103, i32 0, i32 0, i8 0, i32 1)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 1, i32 1, i8 0, float %2)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 0, i8 0, float %3)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 1, i8 0, float %4)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 2, i8 0, float %5)
  %6 = fadd fast float %1, %3
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 3, i8 0, float %6)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 2, i32 0, i8 0, float 2.000000e+00)
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
!4 = !{[5 x i32] [i32 1, i32 1, i32 1, i32 24, i32 8947848]}
!5 = !{void ()* @main, !"main", !6, null, !19}
!6 = !{!7, !11, !13}
!7 = !{!8}
!8 = !{i32 0, !"VSValue", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 1}
!11 = !{!12}
!12 = !{i32 0, !"HSValue", i8 9, i8 0, !9, i8 2, i32 1, i8 1, i32 0, i8 0, !10}
!13 = !{!14, !16, !18}
!14 = !{i32 0, !"SV_TessFactor", i8 9, i8 25, !15, i8 0, i32 4, i8 1, i32 0, i8 3, !10}
!15 = !{i32 0, i32 1, i32 2, i32 3}
!16 = !{i32 1, !"SV_InsideTessFactor", i8 9, i8 26, !17, i8 0, i32 2, i8 1, i32 4, i8 3, !10}
!17 = !{i32 0, i32 1}
!18 = !{i32 2, !"PATCH", i8 9, i8 0, !9, i8 0, i32 1, i8 1, i32 0, i8 0, !10}
!19 = !{i32 3, !20}
!20 = !{void ()* @"\01?main_patch@@YA?AUPatchConstant@@V?$OutputPatch@UHSControlPoint@@$03@@V?$InputPatch@UVSControlPoint@@$04@@@Z", i32 5, i32 4, i32 3, i32 1, i32 3, float 6.400000e+01}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 73
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %15 %19 %21 %35
OpExecutionMode %3 Quads
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCw
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %10 "VSValue"
OpName %14 "HSValue"
OpName %15 "SV_TessFactor"
OpName %19 "SV_InsideTessFactor"
OpName %21 "PATCH"
OpName %56 "hull_main"
OpName %58 "patch_main"
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn TessLevelOuter
OpDecorate %15 Patch
OpDecorate %19 BuiltIn TessLevelInner
OpDecorate %19 Patch
OpDecorate %21 Location 0
OpDecorate %21 Patch
OpDecorate %35 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 5
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpConstant %6 4
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpConstant %6 2
%17 = OpTypeArray %5 %16
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%20 = OpTypePointer Output %5
%21 = OpVariable %20 Output
%22 = OpTypePointer Input %5
%24 = OpConstant %6 0
%27 = OpConstant %6 1
%34 = OpTypePointer Input %6
%35 = OpVariable %34 Input
%54 = OpConstant %6 3
%55 = OpConstant %5 2
%62 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%60 = OpFunctionCall %1 %56
%61 = OpLoad %6 %35
%63 = OpIEqual %62 %61 %24
OpControlBarrier %16 %11 %24
OpSelectionMerge %67 None
OpBranchConditional %63 %66 %67
%66 = OpLabel
%64 = OpFunctionCall %1 %58
OpBranch %67
%67 = OpLabel
OpReturn
OpFunctionEnd
%56 = OpFunction %1 None %2
%57 = OpLabel
OpBranch %69
%69 = OpLabel
%23 = OpAccessChain %22 %10 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %22 %10 %27
%28 = OpLoad %5 %26
%29 = OpFAdd %5 %28 %25
%30 = OpAccessChain %22 %10 %16
%31 = OpLoad %5 %30
%32 = OpFAdd %5 %29 %31
%36 = OpLoad %6 %35
%33 = OpAccessChain %20 %14 %36
OpStore %33 %32
OpReturn
OpFunctionEnd
%58 = OpFunction %1 None %2
%59 = OpLabel
OpBranch %71
%71 = OpLabel
%37 = OpAccessChain %20 %14 %24
%38 = OpLoad %5 %37
%39 = OpAccessChain %20 %19 %24
OpStore %39 %38
%40 = OpAccessChain %20 %14 %27
%41 = OpLoad %5 %40
%42 = OpAccessChain %20 %19 %27
OpStore %42 %41
%43 = OpAccessChain %22 %10 %24
%44 = OpLoad %5 %43
%45 = OpAccessChain %20 %15 %24
OpStore %45 %44
%46 = OpAccessChain %22 %10 %27
%47 = OpLoad %5 %46
%48 = OpAccessChain %20 %15 %27
OpStore %48 %47
%49 = OpAccessChain %22 %10 %16
%50 = OpLoad %5 %49
%51 = OpAccessChain %20 %15 %16
OpStore %51 %50
%52 = OpFAdd %5 %38 %44
%53 = OpAccessChain %20 %15 %54
OpStore %53 %52
OpStore %21 %55
OpReturn
OpFunctionEnd
#endif
