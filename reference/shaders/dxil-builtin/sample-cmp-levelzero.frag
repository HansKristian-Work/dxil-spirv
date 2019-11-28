#version 460

layout(set = 1, binding = 0) uniform texture1D Tex1D;
layout(set = 1, binding = 1) uniform texture1DArray Tex1DArray;
layout(set = 1, binding = 2) uniform texture2D Tex2D;
layout(set = 1, binding = 3) uniform texture2DArray Tex2DArray;
layout(set = 1, binding = 5) uniform textureCube TexCube;
layout(set = 1, binding = 6) uniform textureCubeArray TexCubeArray;
layout(set = 0, binding = 0) uniform samplerShadow Samp;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _100 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    float _103 = ((((vec4(textureLod(sampler1DArrayShadow(Tex1DArray, Samp), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0)).x + vec4(textureLod(sampler1DShadow(Tex1D, Samp), vec2(TEXCOORD.x, TEXCOORD.w), 0.0)).x) + vec4(textureLod(sampler2DShadow(Tex2D, Samp), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0)).x) + vec4(textureGrad(sampler2DArrayShadow(Tex2DArray, Samp), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec2(0.0), vec2(0.0))).x) + vec4(textureGrad(samplerCubeShadow(TexCube, Samp), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec3(0.0), vec3(0.0))).x) + vec4(textureGrad(samplerCubeArrayShadow(TexCubeArray, Samp), _100, TEXCOORD.w, vec3(0.0), vec3(0.0))).x;
    SV_Target.x = _103;
    SV_Target.y = _103;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

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
%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture3D<vector<float, 2> >" = type { <2 x float>, %"class.Texture3D<vector<float, 2> >::mips_type" }
%"class.Texture3D<vector<float, 2> >::mips_type" = type { i32 }

@"\01?Tex1D@@3V?$Texture1D@V?$vector@M$01@@@@A" = external constant %"class.Texture1D<vector<float, 2> >", align 4
@"\01?Tex1DArray@@3V?$Texture1DArray@M@@A" = external constant %"class.Texture1DArray<float>", align 4
@"\01?Tex2D@@3V?$Texture2D@V?$vector@M$01@@@@A" = external constant %"class.Texture2D<vector<float, 2> >", align 4
@"\01?Tex2DArray@@3V?$Texture2DArray@M@@A" = external constant %"class.Texture2DArray<float>", align 4
@"\01?TexCube@@3V?$TextureCube@V?$vector@M$01@@@@A" = external constant %"class.TextureCube<vector<float, 2> >", align 4
@"\01?TexCubeArray@@3V?$TextureCubeArray@M@@A" = external constant %"class.TextureCubeArray<float>", align 4
@"\01?Samp@@3USamplerComparisonState@@A" = external constant %struct.SamplerComparisonState, align 4

define void @main() {
  %TexCubeArray_texture_cubearray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 6, i1 false)
  %TexCube_texture_cube = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 5, i1 false)
  %Tex2DArray_texture_2darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %Tex2D_texture_2d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %Tex1DArray_texture_1darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %Tex1D_texture_1d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %Samp_sampler = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %5 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %Tex1D_texture_1d, %dx.types.Handle %Samp_sampler, float %1, float undef, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %6 = extractvalue %dx.types.ResRet.f32 %5, 0
  %7 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %Tex1DArray_texture_1darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %8 = extractvalue %dx.types.ResRet.f32 %7, 0
  %.i0 = fadd fast float %8, %6
  %9 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %Tex2D_texture_2d, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %10 = extractvalue %dx.types.ResRet.f32 %9, 0
  %.i01 = fadd fast float %.i0, %10
  %11 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %Tex2DArray_texture_2darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %12 = extractvalue %dx.types.ResRet.f32 %11, 0
  %.i03 = fadd fast float %.i01, %12
  %13 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %TexCube_texture_cube, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %.i05 = fadd fast float %.i03, %14
  %15 = call %dx.types.ResRet.f32 @dx.op.sampleCmpLevelZero.f32(i32 65, %dx.types.Handle %TexCubeArray_texture_cubearray, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float %4, i32 undef, i32 undef, i32 undef, float %4)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %.i07 = fadd fast float %.i05, %16
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i07)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i07)
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
!dx.typeAnnotations = !{!15, !23}
!dx.viewIdState = !{!27}
!dx.entryPoints = !{!28}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !13}
!5 = !{!6, !8, !9, !10, !11, !12}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"Tex1D", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"Tex1DArray", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"Tex2D", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"Tex2DArray", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.TextureCube<vector<float, 2> >"* undef, !"TexCube", i32 1, i32 5, i32 1, i32 5, i32 0, !7}
!12 = !{i32 5, %"class.TextureCubeArray<float>"* undef, !"TexCubeArray", i32 1, i32 6, i32 1, i32 9, i32 0, !7}
!13 = !{!14}
!14 = !{i32 0, %struct.SamplerComparisonState* undef, !"Samp", i32 0, i32 0, i32 1, i32 1, null}
!15 = !{i32 0, %"class.Texture1D<vector<float, 2> >" undef, !16, %"class.Texture1D<vector<float, 2> >::mips_type" undef, !19, %"class.Texture1DArray<float>" undef, !16, %"class.Texture1DArray<float>::mips_type" undef, !19, %"class.Texture2D<vector<float, 2> >" undef, !16, %"class.Texture2D<vector<float, 2> >::mips_type" undef, !19, %"class.Texture2DArray<float>" undef, !16, %"class.Texture2DArray<float>::mips_type" undef, !19, %"class.Texture3D<vector<float, 2> >" undef, !16, %"class.Texture3D<vector<float, 2> >::mips_type" undef, !19, %"class.TextureCube<vector<float, 2> >" undef, !21, %"class.TextureCubeArray<float>" undef, !22}
!16 = !{i32 20, !17, !18}
!17 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!18 = !{i32 6, !"mips", i32 3, i32 16}
!19 = !{i32 4, !20}
!20 = !{i32 6, !"handle", i32 3, i32 0, i32 7, i32 5}
!21 = !{i32 8, !17}
!22 = !{i32 4, !17}
!23 = !{i32 1, void ()* @main, !24}
!24 = !{!25}
!25 = !{i32 0, !26, !26}
!26 = !{}
!27 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!28 = !{void ()* @main, !"main", !29, !4, null}
!29 = !{!30, !33, null}
!30 = !{!31}
!31 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !32, i8 2, i32 1, i8 4, i32 0, i8 0, null}
!32 = !{i32 0}
!33 = !{!34}
!34 = !{i32 0, !"SV_Target", i8 9, i8 16, !32, i8 0, i32 1, i8 2, i32 0, i8 0, null}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 109
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
OpName %8 "Tex1D"
OpName %11 "Tex1DArray"
OpName %14 "Tex2D"
OpName %17 "Tex2DArray"
OpName %20 "TexCube"
OpName %23 "TexCubeArray"
OpName %26 "Samp"
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
%79 = OpTypeImage %5 2D 1 1 0 2 Unknown
%81 = OpTypeSampledImage %79
%84 = OpTypeVector %5 3
%88 = OpTypeImage %5 Cube 1 0 0 2 Unknown
%90 = OpTypeSampledImage %88
%96 = OpTypeImage %5 Cube 1 1 0 2 Unknown
%98 = OpTypeSampledImage %96
%105 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
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
%60 = OpImageSampleDrefExplicitLod %5 %55 %44 %53 Lod %59
%61 = OpCompositeConstruct %27 %60 %60 %60 %60
%62 = OpCompositeExtract %5 %61 0
%64 = OpSampledImage %65 %37 %39
%67 = OpCompositeConstruct %30 %44 %47
%66 = OpImageSampleDrefExplicitLod %5 %64 %67 %53 Lod %59
%68 = OpCompositeConstruct %27 %66 %66 %66 %66
%69 = OpCompositeExtract %5 %68 0
%70 = OpFAdd %5 %69 %62
%72 = OpSampledImage %73 %36 %39
%75 = OpCompositeConstruct %30 %44 %47
%74 = OpImageSampleDrefExplicitLod %5 %72 %75 %53 Lod %59
%76 = OpCompositeConstruct %27 %74 %74 %74 %74
%77 = OpCompositeExtract %5 %76 0
%78 = OpFAdd %5 %70 %77
%80 = OpSampledImage %81 %35 %39
%83 = OpCompositeConstruct %84 %44 %47 %50
%82 = OpImageSampleDrefExplicitLod %5 %80 %83 %53 Lod %59
%85 = OpCompositeConstruct %27 %82 %82 %82 %82
%86 = OpCompositeExtract %5 %85 0
%87 = OpFAdd %5 %78 %86
%89 = OpSampledImage %90 %34 %39
%92 = OpCompositeConstruct %84 %44 %47 %50
%91 = OpImageSampleDrefExplicitLod %5 %89 %92 %53 Lod %59
%93 = OpCompositeConstruct %27 %91 %91 %91 %91
%94 = OpCompositeExtract %5 %93 0
%95 = OpFAdd %5 %87 %94
%97 = OpSampledImage %98 %33 %39
%100 = OpCompositeConstruct %27 %44 %47 %50 %53
%99 = OpImageSampleDrefExplicitLod %5 %97 %100 %53 Lod %59
%101 = OpCompositeConstruct %27 %99 %99 %99 %99
%102 = OpCompositeExtract %5 %101 0
%103 = OpFAdd %5 %95 %102
%104 = OpInBoundsAccessChain %105 %32 %43
OpStore %104 %103
%106 = OpInBoundsAccessChain %105 %32 %46
OpStore %106 %103
OpReturn
OpFunctionEnd
#endif
