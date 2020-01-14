#version 460
layout(vertices = 4) out;

layout(location = 0) in float VSValue[];
layout(location = 0) out float HSValue[4];
layout(location = 0) patch out float PATCH;

void hull_main()
{
    float _30[4];
    _30[0u] = VSValue[0u];
    _30[1u] = VSValue[1u];
    _30[2u] = VSValue[2u];
    _30[3u] = VSValue[3u];
    uint _48 = uint(int(VSValue[0u]));
    _30[_48] += 40.0;
    HSValue[gl_InvocationID] = (((VSValue[0u] + float(gl_InvocationID)) + VSValue[1u]) + VSValue[2u]) + _30[3u];
}

void patch_main()
{
    float _61[4];
    _61[0u] = VSValue[0u];
    _61[1u] = VSValue[1u];
    _61[2u] = VSValue[2u];
    _61[3u] = VSValue[3u];
    uint _74 = uint(int(VSValue[0u]));
    _61[_74] += 40.0;
    gl_TessLevelInner[0u] = HSValue[0u];
    gl_TessLevelInner[1u] = HSValue[1u];
    gl_TessLevelOuter[0u] = VSValue[0u];
    gl_TessLevelOuter[1u] = VSValue[1u];
    gl_TessLevelOuter[2u] = VSValue[2u];
    gl_TessLevelOuter[3u] = HSValue[0u] + VSValue[0u];
    PATCH = _61[3u];
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
  %1 = call i32 @dx.op.outputControlPointID.i32(i32 107)
  %2 = alloca [4 x float], align 4
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %4 = getelementptr [4 x float], [4 x float]* %2, i32 0, i32 0
  store float %3, float* %4, align 4
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 1)
  %6 = getelementptr [4 x float], [4 x float]* %2, i32 0, i32 1
  store float %5, float* %6, align 4
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 2)
  %8 = getelementptr [4 x float], [4 x float]* %2, i32 0, i32 2
  store float %7, float* %8, align 4
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 3)
  %10 = getelementptr [4 x float], [4 x float]* %2, i32 0, i32 3
  store float %9, float* %10, align 4
  %11 = fptosi float %3 to i32
  %12 = getelementptr [4 x float], [4 x float]* %2, i32 0, i32 %11
  %13 = load float, float* %12, align 4, !tbaa !21
  %14 = fadd fast float %13, 4.000000e+01
  store float %14, float* %12, align 4, !tbaa !21
  %15 = load float, float* %10, align 4, !tbaa !21
  %16 = uitofp i32 %1 to float
  %17 = fadd fast float %3, %16
  %18 = fadd fast float %17, %5
  %19 = fadd fast float %18, %7
  %20 = fadd fast float %19, %15
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %20)
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
declare i32 @dx.op.outputControlPointID.i32(i32) #0

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
; Bound: 103
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %14 %15 %19 %21 %27
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
OpName %30 ""
OpName %61 ""
OpDecorate %10 Location 0
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn TessLevelOuter
OpDecorate %15 Patch
OpDecorate %19 BuiltIn TessLevelInner
OpDecorate %19 Patch
OpDecorate %21 Location 0
OpDecorate %21 Patch
OpDecorate %27 BuiltIn InvocationId
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
%26 = OpTypePointer Input %6
%27 = OpVariable %26 Input
%29 = OpTypePointer Function %12
%31 = OpTypePointer Input %5
%33 = OpConstant %6 0
%35 = OpTypePointer Function %5
%38 = OpConstant %6 1
%45 = OpConstant %6 3
%52 = OpConstant %5 40
%92 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %95
%95 = OpLabel
%90 = OpFunctionCall %1 %22
%91 = OpLoad %6 %27
%93 = OpIEqual %92 %91 %33
OpControlBarrier %16 %11 %33
OpSelectionMerge %97 None
OpBranchConditional %93 %96 %97
%96 = OpLabel
%94 = OpFunctionCall %1 %24
OpBranch %97
%97 = OpLabel
OpReturn
OpFunctionEnd
%22 = OpFunction %1 None %2
%23 = OpLabel
%30 = OpVariable %29 Function
OpBranch %99
%99 = OpLabel
%28 = OpLoad %6 %27
%32 = OpAccessChain %31 %10 %33
%34 = OpLoad %5 %32
%36 = OpAccessChain %35 %30 %33
OpStore %36 %34
%37 = OpAccessChain %31 %10 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %35 %30 %38
OpStore %40 %39
%41 = OpAccessChain %31 %10 %16
%42 = OpLoad %5 %41
%43 = OpAccessChain %35 %30 %16
OpStore %43 %42
%44 = OpAccessChain %31 %10 %45
%46 = OpLoad %5 %44
%47 = OpAccessChain %35 %30 %45
OpStore %47 %46
%48 = OpConvertFToS %6 %34
%49 = OpAccessChain %35 %30 %48
%50 = OpLoad %5 %49
%51 = OpFAdd %5 %50 %52
OpStore %49 %51
%53 = OpLoad %5 %47
%54 = OpConvertUToF %5 %28
%55 = OpFAdd %5 %34 %54
%56 = OpFAdd %5 %55 %39
%57 = OpFAdd %5 %56 %42
%58 = OpFAdd %5 %57 %53
%60 = OpLoad %6 %27
%59 = OpAccessChain %20 %14 %60
OpStore %59 %58
OpReturn
OpFunctionEnd
%24 = OpFunction %1 None %2
%25 = OpLabel
%61 = OpVariable %29 Function
OpBranch %101
%101 = OpLabel
%62 = OpAccessChain %31 %10 %33
%63 = OpLoad %5 %62
%64 = OpAccessChain %35 %61 %33
OpStore %64 %63
%65 = OpAccessChain %31 %10 %38
%66 = OpLoad %5 %65
%67 = OpAccessChain %35 %61 %38
OpStore %67 %66
%68 = OpAccessChain %31 %10 %16
%69 = OpLoad %5 %68
%70 = OpAccessChain %35 %61 %16
OpStore %70 %69
%71 = OpAccessChain %31 %10 %45
%72 = OpLoad %5 %71
%73 = OpAccessChain %35 %61 %45
OpStore %73 %72
%74 = OpConvertFToS %6 %63
%75 = OpAccessChain %35 %61 %74
%76 = OpLoad %5 %75
%77 = OpFAdd %5 %76 %52
OpStore %75 %77
%78 = OpAccessChain %20 %14 %33
%79 = OpLoad %5 %78
%80 = OpAccessChain %20 %19 %33
OpStore %80 %79
%81 = OpAccessChain %20 %14 %38
%82 = OpLoad %5 %81
%83 = OpAccessChain %20 %19 %38
OpStore %83 %82
%84 = OpAccessChain %20 %15 %33
OpStore %84 %63
%85 = OpAccessChain %20 %15 %38
OpStore %85 %66
%86 = OpAccessChain %20 %15 %16
OpStore %86 %69
%87 = OpFAdd %5 %79 %63
%88 = OpAccessChain %20 %15 %45
OpStore %88 %87
%89 = OpLoad %5 %73
OpStore %21 %89
OpReturn
OpFunctionEnd
#endif
