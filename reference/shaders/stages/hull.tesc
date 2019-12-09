#version 460
layout(vertices = 4) out;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 0) patch out float PATCH;

void hull_main()
{
    float _27[4];
    _27[0u] = VSValue[0u];
    _27[1u] = VSValue[1u];
    _27[2u] = VSValue[2u];
    _27[3u] = VSValue[3u];
    uint _45 = uint(int(VSValue[0u]));
    _27[_45] += 40.0;
    HSValue[gl_InvocationID] = ((VSValue[1u] + VSValue[0u]) + VSValue[2u]) + _27[3u];
}

void patch_main()
{
    float _58[4];
    _58[0u] = VSValue[0u];
    _58[1u] = VSValue[1u];
    _58[2u] = VSValue[2u];
    _58[3u] = VSValue[3u];
    uint _71 = uint(int(VSValue[0u]));
    _58[_71] += 40.0;
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelInner[1u] = HSValue[1u];
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelOuter[3u] = HSValue[0u] + VSValue[0u];
    PATCH = _58[3u];
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
  %1 = alloca [4 x float], align 4
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %3 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 0
  store float %2, float* %3, align 4
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  %5 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 1
  store float %4, float* %5, align 4
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  %7 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 2
  store float %6, float* %7, align 4
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 3)
  %9 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 3
  store float %8, float* %9, align 4
  %10 = fptosi float %2 to i32
  %11 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 %10
  %12 = load float, float* %11, align 4, !tbaa !21
  %13 = fadd fast float %12, 4.000000e+01
  store float %13, float* %11, align 4, !tbaa !21
  %14 = fadd fast float %4, %2
  %15 = fadd fast float %14, %6
  %16 = load float, float* %9, align 4, !tbaa !21
  %17 = fadd fast float %15, %16
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %17)
  ret void
}

define void @"\01?main_patch@@YA?AUPatchConstant@@V?$OutputPatch@UHSControlPoint@@$03@@V?$InputPatch@UVSControlPoint@@$04@@@Z"() {
  %1 = alloca [4 x float], align 4
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %3 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 0
  store float %2, float* %3, align 4
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  %5 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 1
  store float %4, float* %5, align 4
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  %7 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 2
  store float %6, float* %7, align 4
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 3)
  %9 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 3
  store float %8, float* %9, align 4
  %10 = fptosi float %2 to i32
  %11 = getelementptr [4 x float], [4 x float]* %1, i32 0, i32 %10
  %12 = load float, float* %11, align 4, !tbaa !21
  %13 = fadd fast float %12, 4.000000e+01
  store float %13, float* %11, align 4, !tbaa !21
  %14 = call float @dx.op.loadOutputControlPoint.f32(i32 103, i32 0, i32 0, i8 0, i32 0)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 1, i32 0, i8 0, float %14)
  %15 = call float @dx.op.loadOutputControlPoint.f32(i32 103, i32 0, i32 0, i8 0, i32 1)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 1, i32 1, i8 0, float %15)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 1, i8 0, float %4)
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 2, i8 0, float %6)
  %16 = fadd fast float %14, %2
  call void @dx.op.storePatchConstant.f32(i32 106, i32 0, i32 3, i8 0, float %16)
  %17 = load float, float* %9, align 4, !tbaa !21
  call void @dx.op.storePatchConstant.f32(i32 106, i32 2, i32 0, i8 0, float %17)
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
!4 = !{[5 x i32] [i32 1, i32 1, i32 1, i32 24, i32 8947849]}
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
!21 = !{!22, !22, i64 0}
!22 = !{!"float", !23, i64 0}
!23 = !{!"omnipotent char", !24, i64 0}
!24 = !{!"Simple C/C++ TBAA"}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 100
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %15 %19 %21 %56
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
OpName %22 "hull_main"
OpName %24 "patch_main"
OpName %27 ""
OpName %58 ""
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn TessLevelOuter
OpDecorate %15 Patch
OpDecorate %19 BuiltIn TessLevelInner
OpDecorate %19 Patch
OpDecorate %21 Location 0
OpDecorate %21 Patch
OpDecorate %56 BuiltIn InvocationId
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
%26 = OpTypePointer Function %12
%28 = OpTypePointer Input %5
%30 = OpConstant %6 0
%32 = OpTypePointer Function %5
%35 = OpConstant %6 1
%42 = OpConstant %6 3
%49 = OpConstant %5 40
%55 = OpTypePointer Input %6
%56 = OpVariable %55 Input
%89 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %92
%92 = OpLabel
%87 = OpFunctionCall %1 %22
%88 = OpLoad %6 %56
%90 = OpIEqual %89 %88 %30
OpControlBarrier %16 %11 %30
OpSelectionMerge %94 None
OpBranchConditional %90 %93 %94
%93 = OpLabel
%91 = OpFunctionCall %1 %24
OpBranch %94
%94 = OpLabel
OpReturn
OpFunctionEnd
%22 = OpFunction %1 None %2
%23 = OpLabel
%27 = OpVariable %26 Function
OpBranch %96
%96 = OpLabel
%29 = OpAccessChain %28 %10 %30
%31 = OpLoad %5 %29
%33 = OpAccessChain %32 %27 %30
OpStore %33 %31
%34 = OpAccessChain %28 %10 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %32 %27 %35
OpStore %37 %36
%38 = OpAccessChain %28 %10 %16
%39 = OpLoad %5 %38
%40 = OpAccessChain %32 %27 %16
OpStore %40 %39
%41 = OpAccessChain %28 %10 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %32 %27 %42
OpStore %44 %43
%45 = OpConvertFToS %6 %31
%46 = OpAccessChain %32 %27 %45
%47 = OpLoad %5 %46
%48 = OpFAdd %5 %47 %49
OpStore %46 %48
%50 = OpFAdd %5 %36 %31
%51 = OpFAdd %5 %50 %39
%52 = OpLoad %5 %44
%53 = OpFAdd %5 %51 %52
%57 = OpLoad %6 %56
%54 = OpAccessChain %20 %14 %57
OpStore %54 %53
OpReturn
OpFunctionEnd
%24 = OpFunction %1 None %2
%25 = OpLabel
%58 = OpVariable %26 Function
OpBranch %98
%98 = OpLabel
%59 = OpAccessChain %28 %10 %30
%60 = OpLoad %5 %59
%61 = OpAccessChain %32 %58 %30
OpStore %61 %60
%62 = OpAccessChain %28 %10 %35
%63 = OpLoad %5 %62
%64 = OpAccessChain %32 %58 %35
OpStore %64 %63
%65 = OpAccessChain %28 %10 %16
%66 = OpLoad %5 %65
%67 = OpAccessChain %32 %58 %16
OpStore %67 %66
%68 = OpAccessChain %28 %10 %42
%69 = OpLoad %5 %68
%70 = OpAccessChain %32 %58 %42
OpStore %70 %69
%71 = OpConvertFToS %6 %60
%72 = OpAccessChain %32 %58 %71
%73 = OpLoad %5 %72
%74 = OpFAdd %5 %73 %49
OpStore %72 %74
%75 = OpAccessChain %20 %14 %30
%76 = OpLoad %5 %75
%77 = OpAccessChain %20 %19 %30
OpStore %77 %76
%78 = OpAccessChain %20 %14 %35
%79 = OpLoad %5 %78
%80 = OpAccessChain %20 %19 %35
OpStore %80 %79
%81 = OpAccessChain %20 %15 %30
OpStore %81 %60
%82 = OpAccessChain %20 %15 %35
OpStore %82 %63
%83 = OpAccessChain %20 %15 %16
OpStore %83 %66
%84 = OpFAdd %5 %76 %60
%85 = OpAccessChain %20 %15 %42
OpStore %85 %84
%86 = OpLoad %5 %70
OpStore %21 %86
OpReturn
OpFunctionEnd
#endif
