#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 0, binding = 0) uniform sampler _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _55 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1, TEXCOORD.w);
    vec4 _62 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2, TEXCOORD.w);
    float _64 = _62.x;
    vec4 _71 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(2, 3), TEXCOORD.w);
    vec4 _84 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-1, -3), TEXCOORD.w);
    float _88 = _84.x;
    vec4 _96 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-4, -5, 3), TEXCOORD.w);
    SV_Target.x = (((_64 + _55.x) + _71.x) + _88) + _96.x;
    SV_Target.y = (((_64 + _55.y) + _71.y) + _88) + _96.y;
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
%"class.Texture3D<vector<float, 2> >" = type { <2 x float>, %"class.Texture3D<vector<float, 2> >::mips_type" }
%"class.Texture3D<vector<float, 2> >::mips_type" = type { i32 }
%struct.SamplerState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 4, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %11 = call %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32 61, %dx.types.Handle %5, %dx.types.Handle %6, float %7, float undef, float undef, float undef, i32 1, i32 undef, i32 undef, float %10, float undef)
  %12 = extractvalue %dx.types.ResRet.f32 %11, 0
  %13 = extractvalue %dx.types.ResRet.f32 %11, 1
  %14 = call %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32 61, %dx.types.Handle %4, %dx.types.Handle %6, float %7, float %8, float undef, float undef, i32 2, i32 undef, i32 undef, float %10, float undef)
  %15 = extractvalue %dx.types.ResRet.f32 %14, 0
  %16 = fadd fast float %15, %12
  %17 = fadd fast float %15, %13
  %18 = call %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32 61, %dx.types.Handle %3, %dx.types.Handle %6, float %7, float %8, float undef, float undef, i32 2, i32 3, i32 undef, float %10, float undef)
  %19 = extractvalue %dx.types.ResRet.f32 %18, 0
  %20 = extractvalue %dx.types.ResRet.f32 %18, 1
  %21 = fadd fast float %16, %19
  %22 = fadd fast float %17, %20
  %23 = call %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32 61, %dx.types.Handle %2, %dx.types.Handle %6, float %7, float %8, float %9, float undef, i32 -1, i32 -3, i32 undef, float %10, float undef)
  %24 = extractvalue %dx.types.ResRet.f32 %23, 0
  %25 = fadd fast float %21, %24
  %26 = fadd fast float %22, %24
  %27 = call %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32 61, %dx.types.Handle %1, %dx.types.Handle %6, float %7, float %8, float %9, float undef, i32 -4, i32 -5, i32 3, float %10, float undef)
  %28 = extractvalue %dx.types.ResRet.f32 %27, 0
  %29 = extractvalue %dx.types.ResRet.f32 %27, 1
  %30 = fadd fast float %25, %28
  %31 = fadd fast float %26, %29
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %30)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %31)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sampleBias.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float, float) #2

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
!dx.viewIdState = !{!14}
!dx.entryPoints = !{!15}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !12}
!5 = !{!6, !8, !9, !10, !11}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"", i32 1, i32 4, i32 1, i32 4, i32 0, !7}
!12 = !{!13}
!13 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 0, i32 1, i32 0, null}
!14 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!15 = !{void ()* @main, !"main", !16, !4, null}
!16 = !{!17, !21, null}
!17 = !{!18}
!18 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !19, i8 2, i32 1, i8 4, i32 0, i8 0, !20}
!19 = !{i32 0}
!20 = !{i32 3, i32 15}
!21 = !{!22}
!22 = !{i32 0, !"SV_Target", i8 9, i8 16, !19, i8 0, i32 1, i8 2, i32 0, i8 0, !23}
!23 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 109
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %29 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %29 Location 0
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
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypeVector %5 2
%28 = OpTypePointer Output %27
%29 = OpVariable %28 Output
%37 = OpTypePointer Input %5
%38 = OpTypeInt 32 0
%39 = OpConstant %38 0
%42 = OpConstant %38 1
%45 = OpConstant %38 2
%48 = OpConstant %38 3
%50 = OpTypeImage %5 1D 0 0 0 2 Unknown
%52 = OpTypeSampledImage %50
%53 = OpTypeInt 32 1
%54 = OpConstant %53 1
%58 = OpTypeImage %5 1D 0 1 0 2 Unknown
%60 = OpTypeSampledImage %58
%61 = OpConstant %53 2
%67 = OpTypeImage %5 2D 0 0 0 2 Unknown
%69 = OpTypeSampledImage %67
%70 = OpConstant %53 3
%73 = OpTypeVector %53 2
%74 = OpConstantComposite %73 %61 %70
%79 = OpTypeImage %5 2D 0 1 0 2 Unknown
%81 = OpTypeSampledImage %79
%82 = OpConstant %53 -1
%83 = OpConstant %53 -3
%86 = OpTypeVector %5 3
%87 = OpConstantComposite %73 %82 %83
%91 = OpTypeImage %5 3D 0 0 0 2 Unknown
%93 = OpTypeSampledImage %91
%94 = OpConstant %53 -4
%95 = OpConstant %53 -5
%98 = OpTypeVector %53 3
%99 = OpConstantComposite %98 %94 %95 %70
%105 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %12 %14
%33 = OpLoad %9 %11
%34 = OpLoad %6 %8
%35 = OpLoad %21 %23
%36 = OpInBoundsAccessChain %37 %26 %39
%40 = OpLoad %5 %36
%41 = OpInBoundsAccessChain %37 %26 %42
%43 = OpLoad %5 %41
%44 = OpInBoundsAccessChain %37 %26 %45
%46 = OpLoad %5 %44
%47 = OpInBoundsAccessChain %37 %26 %48
%49 = OpLoad %5 %47
%51 = OpSampledImage %52 %34 %35
%55 = OpImageSampleImplicitLod %24 %51 %40 Bias|ConstOffset %49 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%59 = OpSampledImage %60 %33 %35
%63 = OpCompositeConstruct %27 %40 %43
%62 = OpImageSampleImplicitLod %24 %59 %63 Bias|ConstOffset %49 %61
%64 = OpCompositeExtract %5 %62 0
%65 = OpFAdd %5 %64 %56
%66 = OpFAdd %5 %64 %57
%68 = OpSampledImage %69 %32 %35
%72 = OpCompositeConstruct %27 %40 %43
%71 = OpImageSampleImplicitLod %24 %68 %72 Bias|ConstOffset %49 %74
%75 = OpCompositeExtract %5 %71 0
%76 = OpCompositeExtract %5 %71 1
%77 = OpFAdd %5 %65 %75
%78 = OpFAdd %5 %66 %76
%80 = OpSampledImage %81 %31 %35
%85 = OpCompositeConstruct %86 %40 %43 %46
%84 = OpImageSampleImplicitLod %24 %80 %85 Bias|ConstOffset %49 %87
%88 = OpCompositeExtract %5 %84 0
%89 = OpFAdd %5 %77 %88
%90 = OpFAdd %5 %78 %88
%92 = OpSampledImage %93 %30 %35
%97 = OpCompositeConstruct %86 %40 %43 %46
%96 = OpImageSampleImplicitLod %24 %92 %97 Bias|ConstOffset %49 %99
%100 = OpCompositeExtract %5 %96 0
%101 = OpCompositeExtract %5 %96 1
%102 = OpFAdd %5 %89 %100
%103 = OpFAdd %5 %90 %101
%104 = OpInBoundsAccessChain %105 %29 %39
OpStore %104 %102
%106 = OpInBoundsAccessChain %105 %29 %42
OpStore %106 %103
OpReturn
OpFunctionEnd
#endif
