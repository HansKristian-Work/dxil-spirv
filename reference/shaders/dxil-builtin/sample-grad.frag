#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 1, binding = 5) uniform textureCube _23;
layout(set = 1, binding = 6) uniform textureCubeArray _26;
layout(set = 0, binding = 0) uniform sampler _29;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _63 = textureGradOffset(sampler1D(_8, _29), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 0);
    vec4 _69 = textureGradOffset(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 0);
    float _71 = _69.x;
    vec4 _77 = textureGradOffset(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(0));
    vec4 _90 = textureGradOffset(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(0));
    float _95 = _90.x;
    vec4 _101 = textureGradOffset(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(0));
    vec4 _114 = textureGrad(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    vec4 _125 = textureGrad(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    float _129 = _125.x;
    SV_Target.x = (((((_71 + _63.x) + _77.x) + _95) + _101.x) + _114.x) + _129;
    SV_Target.y = (((((_71 + _63.y) + _77.y) + _95) + _101.y) + _114.y) + _129;
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
%"class.TextureCube<vector<float, 2> >" = type { <2 x float> }
%"class.TextureCubeArray<float>" = type { float }
%struct.SamplerState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 6, i32 6, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 5, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 4, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %11 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %12 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %13 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %7, %dx.types.Handle %8, float %9, float undef, float undef, float undef, i32 0, i32 undef, i32 undef, float %11, float undef, float undef, float %12, float undef, float undef, float undef)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %15 = extractvalue %dx.types.ResRet.f32 %13, 1
  %16 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %6, %dx.types.Handle %8, float %9, float %10, float undef, float undef, i32 0, i32 undef, i32 undef, float %11, float undef, float undef, float %10, float undef, float undef, float undef)
  %17 = extractvalue %dx.types.ResRet.f32 %16, 0
  %18 = fadd fast float %17, %14
  %19 = fadd fast float %17, %15
  %20 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %5, %dx.types.Handle %8, float %9, float %10, float undef, float undef, i32 0, i32 0, i32 undef, float %11, float %11, float undef, float %12, float %12, float undef, float undef)
  %21 = extractvalue %dx.types.ResRet.f32 %20, 0
  %22 = extractvalue %dx.types.ResRet.f32 %20, 1
  %23 = fadd fast float %18, %21
  %24 = fadd fast float %19, %22
  %25 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %4, %dx.types.Handle %8, float %9, float %10, float %11, float undef, i32 0, i32 0, i32 undef, float %11, float %11, float undef, float %12, float %12, float undef, float undef)
  %26 = extractvalue %dx.types.ResRet.f32 %25, 0
  %27 = fadd fast float %23, %26
  %28 = fadd fast float %24, %26
  %29 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %3, %dx.types.Handle %8, float %9, float %10, float %11, float undef, i32 0, i32 0, i32 0, float %11, float %11, float %11, float %12, float %12, float %12, float undef)
  %30 = extractvalue %dx.types.ResRet.f32 %29, 0
  %31 = extractvalue %dx.types.ResRet.f32 %29, 1
  %32 = fadd fast float %27, %30
  %33 = fadd fast float %28, %31
  %34 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %2, %dx.types.Handle %8, float %9, float %10, float %11, float undef, i32 undef, i32 undef, i32 undef, float %11, float %11, float %11, float %12, float %12, float %12, float undef)
  %35 = extractvalue %dx.types.ResRet.f32 %34, 0
  %36 = extractvalue %dx.types.ResRet.f32 %34, 1
  %37 = fadd fast float %32, %35
  %38 = fadd fast float %33, %36
  %39 = call %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32 63, %dx.types.Handle %1, %dx.types.Handle %8, float %9, float %10, float %11, float %12, i32 undef, i32 undef, i32 undef, float %11, float %11, float %11, float %12, float %12, float %12, float undef)
  %40 = extractvalue %dx.types.ResRet.f32 %39, 0
  %41 = fadd fast float %37, %40
  %42 = fadd fast float %38, %40
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %41)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %42)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sampleGrad.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float, float, float, float, float, float, float) #2

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
!dx.viewIdState = !{!16}
!dx.entryPoints = !{!17}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !14}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"", i32 1, i32 4, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.TextureCube<vector<float, 2> >"* undef, !"", i32 1, i32 5, i32 1, i32 5, i32 0, !7}
!13 = !{i32 6, %"class.TextureCubeArray<float>"* undef, !"", i32 1, i32 6, i32 1, i32 9, i32 0, !7}
!14 = !{!15}
!15 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 0, i32 1, i32 0, null}
!16 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!17 = !{void ()* @main, !"main", !18, !4, null}
!18 = !{!19, !23, null}
!19 = !{!20}
!20 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !21, i8 2, i32 1, i8 4, i32 0, i8 0, !22}
!21 = !{i32 0}
!22 = !{i32 3, i32 15}
!23 = !{!24}
!24 = !{i32 0, !"SV_Target", i8 9, i8 16, !21, i8 0, i32 1, i8 2, i32 0, i8 0, !25}
!25 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability Sampled1D
OpCapability Image1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
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
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 0
OpDecorate %32 Location 0
OpDecorate %35 Location 0
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
%21 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeSampler
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeVector %5 4
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 2
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%44 = OpTypePointer Input %5
%46 = OpTypeInt 32 0
%47 = OpConstant %46 0
%50 = OpConstant %46 1
%53 = OpConstant %46 2
%56 = OpConstant %46 3
%58 = OpTypeImage %5 1D 0 0 0 2 Unknown
%59 = OpTypeSampledImage %58
%61 = OpTypeInt 32 1
%62 = OpConstant %61 0
%66 = OpTypeImage %5 1D 0 1 0 2 Unknown
%67 = OpTypeSampledImage %66
%74 = OpTypeImage %5 2D 0 0 0 2 Unknown
%75 = OpTypeSampledImage %74
%81 = OpTypeVector %61 2
%82 = OpConstantComposite %81 %62 %62
%87 = OpTypeImage %5 2D 0 1 0 2 Unknown
%88 = OpTypeSampledImage %87
%91 = OpTypeVector %5 3
%98 = OpTypeImage %5 3D 0 0 0 2 Unknown
%99 = OpTypeSampledImage %98
%105 = OpTypeVector %61 3
%106 = OpConstantComposite %105 %62 %62 %62
%111 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%112 = OpTypeSampledImage %111
%122 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%123 = OpTypeSampledImage %122
%132 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %135
%135 = OpLabel
%36 = OpLoad %24 %26
%37 = OpLoad %21 %23
%38 = OpLoad %18 %20
%39 = OpLoad %15 %17
%40 = OpLoad %12 %14
%41 = OpLoad %9 %11
%42 = OpLoad %6 %8
%43 = OpLoad %27 %29
%45 = OpAccessChain %44 %32 %47
%48 = OpLoad %5 %45
%49 = OpAccessChain %44 %32 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %44 %32 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %44 %32 %56
%57 = OpLoad %5 %55
%60 = OpSampledImage %59 %42 %43
%63 = OpImageSampleExplicitLod %30 %60 %48 Grad|ConstOffset %54 %57 %62
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%68 = OpSampledImage %67 %41 %43
%70 = OpCompositeConstruct %33 %48 %51
%69 = OpImageSampleExplicitLod %30 %68 %70 Grad|ConstOffset %54 %51 %62
%71 = OpCompositeExtract %5 %69 0
%72 = OpFAdd %5 %71 %64
%73 = OpFAdd %5 %71 %65
%76 = OpSampledImage %75 %40 %43
%78 = OpCompositeConstruct %33 %48 %51
%79 = OpCompositeConstruct %33 %54 %54
%80 = OpCompositeConstruct %33 %57 %57
%77 = OpImageSampleExplicitLod %30 %76 %78 Grad|ConstOffset %79 %80 %82
%83 = OpCompositeExtract %5 %77 0
%84 = OpCompositeExtract %5 %77 1
%85 = OpFAdd %5 %72 %83
%86 = OpFAdd %5 %73 %84
%89 = OpSampledImage %88 %39 %43
%92 = OpCompositeConstruct %91 %48 %51 %54
%93 = OpCompositeConstruct %33 %54 %54
%94 = OpCompositeConstruct %33 %57 %57
%90 = OpImageSampleExplicitLod %30 %89 %92 Grad|ConstOffset %93 %94 %82
%95 = OpCompositeExtract %5 %90 0
%96 = OpFAdd %5 %85 %95
%97 = OpFAdd %5 %86 %95
%100 = OpSampledImage %99 %38 %43
%102 = OpCompositeConstruct %91 %48 %51 %54
%103 = OpCompositeConstruct %91 %54 %54 %54
%104 = OpCompositeConstruct %91 %57 %57 %57
%101 = OpImageSampleExplicitLod %30 %100 %102 Grad|ConstOffset %103 %104 %106
%107 = OpCompositeExtract %5 %101 0
%108 = OpCompositeExtract %5 %101 1
%109 = OpFAdd %5 %96 %107
%110 = OpFAdd %5 %97 %108
%113 = OpSampledImage %112 %37 %43
%115 = OpCompositeConstruct %91 %48 %51 %54
%116 = OpCompositeConstruct %91 %54 %54 %54
%117 = OpCompositeConstruct %91 %57 %57 %57
%114 = OpImageSampleExplicitLod %30 %113 %115 Grad %116 %117
%118 = OpCompositeExtract %5 %114 0
%119 = OpCompositeExtract %5 %114 1
%120 = OpFAdd %5 %109 %118
%121 = OpFAdd %5 %110 %119
%124 = OpSampledImage %123 %36 %43
%126 = OpCompositeConstruct %30 %48 %51 %54 %57
%127 = OpCompositeConstruct %91 %54 %54 %54
%128 = OpCompositeConstruct %91 %57 %57 %57
%125 = OpImageSampleExplicitLod %30 %124 %126 Grad %127 %128
%129 = OpCompositeExtract %5 %125 0
%130 = OpFAdd %5 %120 %129
%131 = OpFAdd %5 %121 %129
%133 = OpAccessChain %132 %35 %47
OpStore %133 %130
%134 = OpAccessChain %132 %35 %50
OpStore %134 %131
OpReturn
OpFunctionEnd
#endif
