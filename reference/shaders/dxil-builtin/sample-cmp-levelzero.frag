#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 5) uniform textureCube _20;
layout(set = 1, binding = 6) uniform textureCubeArray _23;
layout(set = 0, binding = 0) uniform samplerShadow _26;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _102 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    float _105 = ((((vec4(textureLodOffset(sampler1DArrayShadow(_11, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, 0)).x + vec4(textureLodOffset(sampler1DShadow(_8, _26), vec2(TEXCOORD.x, TEXCOORD.w), 0.0, 0)).x) + vec4(textureLodOffset(sampler2DShadow(_14, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, ivec2(0))).x) + vec4(textureGradOffset(sampler2DArrayShadow(_17, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec2(0.0), vec2(0.0), ivec2(0))).x) + vec4(textureGrad(samplerCubeShadow(_20, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec3(0.0), vec3(0.0))).x) + vec4(textureGrad(samplerCubeArrayShadow(_23, _26), _102, TEXCOORD.w, vec3(0.0), vec3(0.0))).x;
    SV_Target.x = _105;
    SV_Target.y = _105;
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
%"class.TextureCube<vector<float, 2> >" = type { <2 x float> }
%"class.TextureCubeArray<float>" = type { float }
%struct.SamplerComparisonState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 6, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 5, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %11 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %12 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %6, %dx.types.Handle %7, float %8, float undef, float undef, float undef, i32 0, i32 undef, i32 undef, float %11)
  %13 = extractvalue %dx.types.ResRet.f32 %12, 0
  %14 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %5, %dx.types.Handle %7, float %8, float %9, float undef, float undef, i32 0, i32 undef, i32 undef, float %11)
  %15 = extractvalue %dx.types.ResRet.f32 %14, 0
  %16 = fadd fast float %15, %13
  %17 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %4, %dx.types.Handle %7, float %8, float %9, float undef, float undef, i32 0, i32 0, i32 undef, float %11)
  %18 = extractvalue %dx.types.ResRet.f32 %17, 0
  %19 = fadd fast float %16, %18
  %20 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %3, %dx.types.Handle %7, float %8, float %9, float %10, float undef, i32 0, i32 0, i32 undef, float %11)
  %21 = extractvalue %dx.types.ResRet.f32 %20, 0
  %22 = fadd fast float %19, %21
  %23 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %2, %dx.types.Handle %7, float %8, float %9, float %10, float undef, i32 undef, i32 undef, i32 undef, float %11)
  %24 = extractvalue %dx.types.ResRet.f32 %23, 0
  %25 = fadd fast float %22, %24
  %26 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %1, %dx.types.Handle %7, float %8, float %9, float %10, float %11, i32 undef, i32 undef, i32 undef, float %11)
  %27 = extractvalue %dx.types.ResRet.f32 %26, 0
  %28 = fadd fast float %25, %27
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %28)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %28)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #2

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
!dx.viewIdState = !{!15}
!dx.entryPoints = !{!16}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !13}
!5 = !{!6, !8, !9, !10, !11, !12}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.TextureCube<vector<float, 2> >"* undef, !"", i32 1, i32 5, i32 1, i32 5, i32 0, !7}
!12 = !{i32 5, %"class.TextureCubeArray<float>"* undef, !"", i32 1, i32 6, i32 1, i32 9, i32 0, !7}
!13 = !{!14}
!14 = !{i32 0, %struct.SamplerComparisonState* undef, !"", i32 0, i32 0, i32 1, i32 1, null}
!15 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!16 = !{void ()* @main, !"main", !17, !4, null}
!17 = !{!18, !22, null}
!18 = !{!19}
!19 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !20, i8 2, i32 1, i8 4, i32 0, i8 0, !21}
!20 = !{i32 0}
!21 = !{i32 3, i32 15}
!22 = !{!23}
!23 = !{i32 0, !"SV_Target", i8 9, i8 16, !20, i8 0, i32 1, i8 2, i32 0, i8 0, !24}
!24 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 111
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability Sampled1D
OpCapability Image1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %29 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %29 "TEXCOORD"
OpName %32 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %29 Location 0
OpDecorate %32 Location 0
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
%18 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeSampler
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeVector %5 4
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypeVector %5 2
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%41 = OpTypePointer Input %5
%42 = OpTypeInt 32 0
%43 = OpConstant %42 0
%46 = OpConstant %42 1
%49 = OpConstant %42 2
%52 = OpConstant %42 3
%54 = OpTypeImage %5 1D 1 0 0 2 Unknown
%56 = OpTypeSampledImage %54
%57 = OpTypeInt 32 1
%58 = OpConstant %57 0
%59 = OpConstant %5 0
%63 = OpTypeImage %5 1D 1 1 0 2 Unknown
%65 = OpTypeSampledImage %63
%71 = OpTypeImage %5 2D 1 0 0 2 Unknown
%73 = OpTypeSampledImage %71
%76 = OpTypeVector %57 2
%77 = OpConstantComposite %76 %58 %58
%81 = OpTypeImage %5 2D 1 1 0 2 Unknown
%83 = OpTypeSampledImage %81
%86 = OpTypeVector %5 3
%90 = OpTypeImage %5 Cube 1 0 0 2 Unknown
%92 = OpTypeSampledImage %90
%98 = OpTypeImage %5 Cube 1 1 0 2 Unknown
%100 = OpTypeSampledImage %98
%107 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %109
%109 = OpLabel
%33 = OpLoad %21 %23
%34 = OpLoad %18 %20
%35 = OpLoad %15 %17
%36 = OpLoad %12 %14
%37 = OpLoad %9 %11
%38 = OpLoad %6 %8
%39 = OpLoad %24 %26
%40 = OpInBoundsAccessChain %41 %29 %43
%44 = OpLoad %5 %40
%45 = OpInBoundsAccessChain %41 %29 %46
%47 = OpLoad %5 %45
%48 = OpInBoundsAccessChain %41 %29 %49
%50 = OpLoad %5 %48
%51 = OpInBoundsAccessChain %41 %29 %52
%53 = OpLoad %5 %51
%55 = OpSampledImage %56 %38 %39
%60 = OpImageSampleDrefExplicitLod %5 %55 %44 %53 Lod|ConstOffset %59 %58
%61 = OpCompositeConstruct %27 %60 %60 %60 %60
%62 = OpCompositeExtract %5 %61 0
%64 = OpSampledImage %65 %37 %39
%67 = OpCompositeConstruct %30 %44 %47
%66 = OpImageSampleDrefExplicitLod %5 %64 %67 %53 Lod|ConstOffset %59 %58
%68 = OpCompositeConstruct %27 %66 %66 %66 %66
%69 = OpCompositeExtract %5 %68 0
%70 = OpFAdd %5 %69 %62
%72 = OpSampledImage %73 %36 %39
%75 = OpCompositeConstruct %30 %44 %47
%74 = OpImageSampleDrefExplicitLod %5 %72 %75 %53 Lod|ConstOffset %59 %77
%78 = OpCompositeConstruct %27 %74 %74 %74 %74
%79 = OpCompositeExtract %5 %78 0
%80 = OpFAdd %5 %70 %79
%82 = OpSampledImage %83 %35 %39
%85 = OpCompositeConstruct %86 %44 %47 %50
%84 = OpImageSampleDrefExplicitLod %5 %82 %85 %53 Lod|ConstOffset %59 %77
%87 = OpCompositeConstruct %27 %84 %84 %84 %84
%88 = OpCompositeExtract %5 %87 0
%89 = OpFAdd %5 %80 %88
%91 = OpSampledImage %92 %34 %39
%94 = OpCompositeConstruct %86 %44 %47 %50
%93 = OpImageSampleDrefExplicitLod %5 %91 %94 %53 Lod %59
%95 = OpCompositeConstruct %27 %93 %93 %93 %93
%96 = OpCompositeExtract %5 %95 0
%97 = OpFAdd %5 %89 %96
%99 = OpSampledImage %100 %33 %39
%102 = OpCompositeConstruct %27 %44 %47 %50 %53
%101 = OpImageSampleDrefExplicitLod %5 %99 %102 %53 Lod %59
%103 = OpCompositeConstruct %27 %101 %101 %101 %101
%104 = OpCompositeExtract %5 %103 0
%105 = OpFAdd %5 %97 %104
%106 = OpInBoundsAccessChain %107 %32 %43
OpStore %106 %105
%108 = OpInBoundsAccessChain %107 %32 %46
OpStore %108 %105
OpReturn
OpFunctionEnd
#endif
