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
    vec4 _52 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1);
    vec4 _59 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2);
    float _61 = _59.x;
    vec4 _69 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(3, 4));
    vec4 _82 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(5, 6));
    float _86 = _82.x;
    vec4 _93 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(7, 6, 5));
    SV_Target.x = (((_61 + _52.x) + _69.x) + _86) + _93.x;
    SV_Target.y = (((_61 + _52.y) + _69.y) + _86) + _93.y;
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
  %10 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %5, %dx.types.Handle %6, float %7, float undef, float undef, float undef, i32 1, i32 undef, i32 undef, float undef)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = extractvalue %dx.types.ResRet.f32 %10, 1
  %13 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %4, %dx.types.Handle %6, float %7, float %8, float undef, float undef, i32 2, i32 undef, i32 undef, float undef)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %15 = fadd fast float %14, %11
  %16 = fadd fast float %14, %12
  %17 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %3, %dx.types.Handle %6, float %7, float %8, float undef, float undef, i32 3, i32 4, i32 undef, float undef)
  %18 = extractvalue %dx.types.ResRet.f32 %17, 0
  %19 = extractvalue %dx.types.ResRet.f32 %17, 1
  %20 = fadd fast float %15, %18
  %21 = fadd fast float %16, %19
  %22 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %2, %dx.types.Handle %6, float %7, float %8, float %9, float undef, i32 5, i32 6, i32 undef, float undef)
  %23 = extractvalue %dx.types.ResRet.f32 %22, 0
  %24 = fadd fast float %20, %23
  %25 = fadd fast float %21, %23
  %26 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %1, %dx.types.Handle %6, float %7, float %8, float %9, float undef, i32 7, i32 6, i32 5, float undef)
  %27 = extractvalue %dx.types.ResRet.f32 %26, 0
  %28 = extractvalue %dx.types.ResRet.f32 %26, 1
  %29 = fadd fast float %24, %27
  %30 = fadd fast float %25, %28
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %29)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %30)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sample.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #2

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
!14 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 0]}
!15 = !{void ()* @main, !"main", !16, !4, null}
!16 = !{!17, !21, null}
!17 = !{!18}
!18 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !19, i8 2, i32 1, i8 4, i32 0, i8 0, !20}
!19 = !{i32 0}
!20 = !{i32 3, i32 7}
!21 = !{!22}
!22 = !{i32 0, !"SV_Target", i8 9, i8 16, !19, i8 0, i32 1, i8 2, i32 0, i8 0, !23}
!23 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 106
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
%47 = OpTypeImage %5 1D 0 0 0 2 Unknown
%49 = OpTypeSampledImage %47
%50 = OpTypeInt 32 1
%51 = OpConstant %50 1
%55 = OpTypeImage %5 1D 0 1 0 2 Unknown
%57 = OpTypeSampledImage %55
%58 = OpConstant %50 2
%64 = OpTypeImage %5 2D 0 0 0 2 Unknown
%66 = OpTypeSampledImage %64
%67 = OpConstant %50 3
%68 = OpConstant %50 4
%71 = OpTypeVector %50 2
%72 = OpConstantComposite %71 %67 %68
%77 = OpTypeImage %5 2D 0 1 0 2 Unknown
%79 = OpTypeSampledImage %77
%80 = OpConstant %50 5
%81 = OpConstant %50 6
%84 = OpTypeVector %5 3
%85 = OpConstantComposite %71 %80 %81
%89 = OpTypeImage %5 3D 0 0 0 2 Unknown
%91 = OpTypeSampledImage %89
%92 = OpConstant %50 7
%95 = OpTypeVector %50 3
%96 = OpConstantComposite %95 %92 %81 %80
%102 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
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
%48 = OpSampledImage %49 %34 %35
%52 = OpImageSampleImplicitLod %24 %48 %40 ConstOffset %51
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%56 = OpSampledImage %57 %33 %35
%60 = OpCompositeConstruct %27 %40 %43
%59 = OpImageSampleImplicitLod %24 %56 %60 ConstOffset %58
%61 = OpCompositeExtract %5 %59 0
%62 = OpFAdd %5 %61 %53
%63 = OpFAdd %5 %61 %54
%65 = OpSampledImage %66 %32 %35
%70 = OpCompositeConstruct %27 %40 %43
%69 = OpImageSampleImplicitLod %24 %65 %70 ConstOffset %72
%73 = OpCompositeExtract %5 %69 0
%74 = OpCompositeExtract %5 %69 1
%75 = OpFAdd %5 %62 %73
%76 = OpFAdd %5 %63 %74
%78 = OpSampledImage %79 %31 %35
%83 = OpCompositeConstruct %84 %40 %43 %46
%82 = OpImageSampleImplicitLod %24 %78 %83 ConstOffset %85
%86 = OpCompositeExtract %5 %82 0
%87 = OpFAdd %5 %75 %86
%88 = OpFAdd %5 %76 %86
%90 = OpSampledImage %91 %30 %35
%94 = OpCompositeConstruct %84 %40 %43 %46
%93 = OpImageSampleImplicitLod %24 %90 %94 ConstOffset %96
%97 = OpCompositeExtract %5 %93 0
%98 = OpCompositeExtract %5 %93 1
%99 = OpFAdd %5 %87 %97
%100 = OpFAdd %5 %88 %98
%101 = OpInBoundsAccessChain %102 %29 %39
OpStore %101 %99
%103 = OpInBoundsAccessChain %102 %29 %42
OpStore %103 %100
OpReturn
OpFunctionEnd
#endif
