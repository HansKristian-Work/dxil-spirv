#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 0) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    float _86 = ((vec4(textureOffset(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 2)).x + vec4(textureOffset(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, TEXCOORD.w), 1)).x) + vec4(textureOffset(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), ivec2(-3, -2))).x) + vec4(textureOffset(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), ivec2(4, 5))).x;
    SV_Target.x = _86;
    SV_Target.y = _86;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture1D<vector<float, 2> >" = type { <2 x float>, %"class.Texture1D<vector<float, 2> >::mips_type" }
%"class.Texture1D<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture1DArray<float>" = type { float, %"class.Texture1DArray<float>::mips_type" }
%"class.Texture1DArray<float>::mips_type" = type { i32 }
%"class.Texture2D<vector<float, 2> >" = type { <2 x float>, %"class.Texture2D<vector<float, 2> >::mips_type" }
%"class.Texture2D<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture2DArray<float>" = type { float, %"class.Texture2DArray<float>::mips_type" }
%"class.Texture2DArray<float>::mips_type" = type { i32 }
%struct.SamplerComparisonState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %10 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %4, %dx.types.Handle %5, float %6, float undef, float undef, float undef, i32 1, i32 undef, i32 undef, float %9, float undef)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %3, %dx.types.Handle %5, float %6, float %7, float undef, float undef, i32 2, i32 undef, i32 undef, float %9, float undef)
  %13 = extractvalue %dx.types.ResRet.f32 %12, 0
  %14 = fadd fast float %13, %11
  %15 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %2, %dx.types.Handle %5, float %6, float %7, float undef, float undef, i32 -3, i32 -2, i32 undef, float %9, float undef)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %17 = fadd fast float %14, %16
  %18 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %1, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 4, i32 5, i32 undef, float %9, float undef)
  %19 = extractvalue %dx.types.ResRet.f32 %18, 0
  %20 = fadd fast float %17, %19
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %20)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %20)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float, float) #2

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #2

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }
attributes #2 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.viewIdState = !{!13}
!dx.entryPoints = !{!14}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !11}
!5 = !{!6, !8, !9, !10}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{!12}
!12 = !{i32 0, %struct.SamplerComparisonState* undef, !"", i32 0, i32 0, i32 1, i32 1, null}
!13 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!14 = !{void ()* @main, !"main", !15, !4, null}
!15 = !{!16, !20, null}
!16 = !{!17}
!17 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !18, i8 2, i32 1, i8 4, i32 0, i8 0, !19}
!18 = !{i32 0}
!19 = !{i32 3, i32 15}
!20 = !{!21}
!21 = !{i32 0, !"SV_Target", i8 9, i8 16, !18, i8 0, i32 1, i8 2, i32 0, i8 0, !22}
!22 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %26 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %23 Location 0
OpDecorate %26 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypeVector %5 2
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%33 = OpTypePointer Input %5
%34 = OpTypeInt 32 0
%35 = OpConstant %34 0
%38 = OpConstant %34 1
%41 = OpConstant %34 2
%44 = OpConstant %34 3
%46 = OpTypeImage %5 1D 1 0 0 2 Unknown
%48 = OpTypeSampledImage %46
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%54 = OpTypeImage %5 1D 1 1 0 2 Unknown
%56 = OpTypeSampledImage %54
%57 = OpConstant %49 2
%63 = OpTypeImage %5 2D 1 0 0 2 Unknown
%65 = OpTypeSampledImage %63
%66 = OpConstant %49 -3
%67 = OpConstant %49 -2
%70 = OpTypeVector %49 2
%71 = OpConstantComposite %70 %66 %67
%75 = OpTypeImage %5 2D 1 1 0 2 Unknown
%77 = OpTypeSampledImage %75
%78 = OpConstant %49 4
%79 = OpConstant %49 5
%82 = OpTypeVector %5 3
%83 = OpConstantComposite %70 %78 %79
%88 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
%27 = OpLoad %15 %17
%28 = OpLoad %12 %14
%29 = OpLoad %9 %11
%30 = OpLoad %6 %8
%31 = OpLoad %18 %20
%32 = OpInBoundsAccessChain %33 %23 %35
%36 = OpLoad %5 %32
%37 = OpInBoundsAccessChain %33 %23 %38
%39 = OpLoad %5 %37
%40 = OpInBoundsAccessChain %33 %23 %41
%42 = OpLoad %5 %40
%43 = OpInBoundsAccessChain %33 %23 %44
%45 = OpLoad %5 %43
%47 = OpSampledImage %48 %30 %31
%51 = OpImageSampleDrefImplicitLod %5 %47 %36 %45 ConstOffset %50
%52 = OpCompositeConstruct %21 %51 %51 %51 %51
%53 = OpCompositeExtract %5 %52 0
%55 = OpSampledImage %56 %29 %31
%59 = OpCompositeConstruct %24 %36 %39
%58 = OpImageSampleDrefImplicitLod %5 %55 %59 %45 ConstOffset %57
%60 = OpCompositeConstruct %21 %58 %58 %58 %58
%61 = OpCompositeExtract %5 %60 0
%62 = OpFAdd %5 %61 %53
%64 = OpSampledImage %65 %28 %31
%69 = OpCompositeConstruct %24 %36 %39
%68 = OpImageSampleDrefImplicitLod %5 %64 %69 %45 ConstOffset %71
%72 = OpCompositeConstruct %21 %68 %68 %68 %68
%73 = OpCompositeExtract %5 %72 0
%74 = OpFAdd %5 %62 %73
%76 = OpSampledImage %77 %27 %31
%81 = OpCompositeConstruct %82 %36 %39 %42
%80 = OpImageSampleDrefImplicitLod %5 %76 %81 %45 ConstOffset %83
%84 = OpCompositeConstruct %21 %80 %80 %80 %80
%85 = OpCompositeExtract %5 %84 0
%86 = OpFAdd %5 %74 %85
%87 = OpInBoundsAccessChain %88 %26 %35
OpStore %87 %86
%89 = OpInBoundsAccessChain %88 %26 %38
OpStore %89 %86
OpReturn
OpFunctionEnd
#endif
