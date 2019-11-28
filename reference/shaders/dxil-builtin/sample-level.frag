#version 460

layout(set = 1, binding = 0) uniform texture1D Tex1D;
layout(set = 1, binding = 1) uniform texture1DArray Tex1DArray;
layout(set = 1, binding = 2) uniform texture2D Tex2D;
layout(set = 1, binding = 3) uniform texture2DArray Tex2DArray;
layout(set = 1, binding = 4) uniform texture3D Tex3D;
layout(set = 1, binding = 5) uniform textureCube TexCube;
layout(set = 1, binding = 6) uniform textureCubeArray TexCubeArray;
layout(set = 0, binding = 0) uniform sampler Samp;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _63 = textureLod(sampler1D(Tex1D, Samp), TEXCOORD.x, TEXCOORD.w);
    vec4 _69 = textureLod(sampler1DArray(Tex1DArray, Samp), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w);
    float _71 = _69.x;
    vec4 _77 = textureLod(sampler2D(Tex2D, Samp), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w);
    vec4 _86 = textureLod(sampler2DArray(Tex2DArray, Samp), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    float _89 = _86.x;
    vec4 _95 = textureLod(sampler3D(Tex3D, Samp), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _104 = textureLod(samplerCube(TexCube, Samp), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _113 = textureLod(samplerCubeArray(TexCubeArray, Samp), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), TEXCOORD.w);
    float _115 = _113.x;
    SV_Target.x = (((((_71 + _63.x) + _77.x) + _89) + _95.x) + _104.x) + _115;
    SV_Target.y = (((((_71 + _63.y) + _77.y) + _89) + _95.y) + _104.y) + _115;
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
%"class.Texture3D<vector<float, 2> >" = type { <2 x float>, %"class.Texture3D<vector<float, 2> >::mips_type" }
%"class.Texture3D<vector<float, 2> >::mips_type" = type { i32 }
%"class.TextureCube<vector<float, 2> >" = type { <2 x float> }
%"class.TextureCubeArray<float>" = type { float }
%struct.SamplerState = type { i32 }
%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }

@"\01?Tex1D@@3V?$Texture1D@V?$vector@M$01@@@@A" = external constant %"class.Texture1D<vector<float, 2> >", align 4
@"\01?Tex1DArray@@3V?$Texture1DArray@M@@A" = external constant %"class.Texture1DArray<float>", align 4
@"\01?Tex2D@@3V?$Texture2D@V?$vector@M$01@@@@A" = external constant %"class.Texture2D<vector<float, 2> >", align 4
@"\01?Tex2DArray@@3V?$Texture2DArray@M@@A" = external constant %"class.Texture2DArray<float>", align 4
@"\01?Tex3D@@3V?$Texture3D@V?$vector@M$01@@@@A" = external constant %"class.Texture3D<vector<float, 2> >", align 4
@"\01?TexCube@@3V?$TextureCube@V?$vector@M$01@@@@A" = external constant %"class.TextureCube<vector<float, 2> >", align 4
@"\01?TexCubeArray@@3V?$TextureCubeArray@M@@A" = external constant %"class.TextureCubeArray<float>", align 4
@"\01?Samp@@3USamplerState@@A" = external constant %struct.SamplerState, align 4

define void @main() {
  %TexCubeArray_texture_cubearray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 6, i32 6, i1 false)
  %TexCube_texture_cube = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 5, i1 false)
  %Tex3D_texture_3d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 4, i1 false)
  %Tex2DArray_texture_2darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %Tex2D_texture_2d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %Tex1DArray_texture_1darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %Tex1D_texture_1d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %Samp_sampler = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %5 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %Tex1D_texture_1d, %dx.types.Handle %Samp_sampler, float %1, float undef, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %6 = extractvalue %dx.types.ResRet.f32 %5, 0
  %7 = extractvalue %dx.types.ResRet.f32 %5, 1
  %8 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %Tex1DArray_texture_1darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %9 = extractvalue %dx.types.ResRet.f32 %8, 0
  %.i0 = fadd fast float %9, %6
  %.i1 = fadd fast float %9, %7
  %10 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %Tex2D_texture_2d, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = extractvalue %dx.types.ResRet.f32 %10, 1
  %.i01 = fadd fast float %.i0, %11
  %.i12 = fadd fast float %.i1, %12
  %13 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %Tex2DArray_texture_2darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %.i03 = fadd fast float %.i01, %14
  %.i14 = fadd fast float %.i12, %14
  %15 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %Tex3D_texture_3d, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %17 = extractvalue %dx.types.ResRet.f32 %15, 1
  %.i05 = fadd fast float %.i03, %16
  %.i16 = fadd fast float %.i14, %17
  %18 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %TexCube_texture_cube, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 undef, i32 undef, i32 undef, float %4)
  %19 = extractvalue %dx.types.ResRet.f32 %18, 0
  %20 = extractvalue %dx.types.ResRet.f32 %18, 1
  %.i07 = fadd fast float %.i05, %19
  %.i18 = fadd fast float %.i16, %20
  %21 = call %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32 62, %dx.types.Handle %TexCubeArray_texture_cubearray, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float %4, i32 undef, i32 undef, i32 undef, float %4)
  %22 = extractvalue %dx.types.ResRet.f32 %21, 0
  %.i09 = fadd fast float %.i07, %22
  %.i110 = fadd fast float %.i18, %22
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i09)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i110)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sampleLevel.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #2

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
!dx.typeAnnotations = !{!16, !24}
!dx.viewIdState = !{!28}
!dx.entryPoints = !{!29}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !14}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"Tex1D", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"Tex1DArray", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"Tex2D", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"Tex2DArray", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"Tex3D", i32 1, i32 4, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.TextureCube<vector<float, 2> >"* undef, !"TexCube", i32 1, i32 5, i32 1, i32 5, i32 0, !7}
!13 = !{i32 6, %"class.TextureCubeArray<float>"* undef, !"TexCubeArray", i32 1, i32 6, i32 1, i32 9, i32 0, !7}
!14 = !{!15}
!15 = !{i32 0, %struct.SamplerState* undef, !"Samp", i32 0, i32 0, i32 1, i32 0, null}
!16 = !{i32 0, %"class.Texture1D<vector<float, 2> >" undef, !17, %"class.Texture1D<vector<float, 2> >::mips_type" undef, !20, %"class.Texture1DArray<float>" undef, !17, %"class.Texture1DArray<float>::mips_type" undef, !20, %"class.Texture2D<vector<float, 2> >" undef, !17, %"class.Texture2D<vector<float, 2> >::mips_type" undef, !20, %"class.Texture2DArray<float>" undef, !17, %"class.Texture2DArray<float>::mips_type" undef, !20, %"class.Texture3D<vector<float, 2> >" undef, !17, %"class.Texture3D<vector<float, 2> >::mips_type" undef, !20, %"class.TextureCube<vector<float, 2> >" undef, !22, %"class.TextureCubeArray<float>" undef, !23}
!17 = !{i32 20, !18, !19}
!18 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!19 = !{i32 6, !"mips", i32 3, i32 16}
!20 = !{i32 4, !21}
!21 = !{i32 6, !"handle", i32 3, i32 0, i32 7, i32 5}
!22 = !{i32 8, !18}
!23 = !{i32 4, !18}
!24 = !{i32 1, void ()* @main, !25}
!25 = !{!26}
!26 = !{i32 0, !27, !27}
!27 = !{}
!28 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!29 = !{void ()* @main, !"main", !30, !4, null}
!30 = !{!31, !34, null}
!31 = !{!32}
!32 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !33, i8 2, i32 1, i8 4, i32 0, i8 0, null}
!33 = !{i32 0}
!34 = !{!35}
!35 = !{i32 0, !"SV_Target", i8 9, i8 16, !33, i8 0, i32 1, i8 2, i32 0, i8 0, null}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 123
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
OpName %8 "Tex1D"
OpName %11 "Tex1DArray"
OpName %14 "Tex2D"
OpName %17 "Tex2DArray"
OpName %20 "Tex3D"
OpName %23 "TexCube"
OpName %26 "TexCubeArray"
OpName %29 "Samp"
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
%45 = OpTypePointer Input %5
%46 = OpTypeInt 32 0
%47 = OpConstant %46 0
%50 = OpConstant %46 1
%53 = OpConstant %46 2
%56 = OpConstant %46 3
%58 = OpTypeImage %5 1D 0 0 0 2 Unknown
%60 = OpTypeSampledImage %58
%61 = OpTypeInt 32 1
%62 = OpConstant %61 0
%66 = OpTypeImage %5 1D 0 1 0 2 Unknown
%68 = OpTypeSampledImage %66
%74 = OpTypeImage %5 2D 0 0 0 2 Unknown
%76 = OpTypeSampledImage %74
%83 = OpTypeImage %5 2D 0 1 0 2 Unknown
%85 = OpTypeSampledImage %83
%88 = OpTypeVector %5 3
%92 = OpTypeImage %5 3D 0 0 0 2 Unknown
%94 = OpTypeSampledImage %92
%101 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%103 = OpTypeSampledImage %101
%110 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%112 = OpTypeSampledImage %110
%119 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %121
%121 = OpLabel
%36 = OpLoad %24 %26
%37 = OpLoad %21 %23
%38 = OpLoad %18 %20
%39 = OpLoad %15 %17
%40 = OpLoad %12 %14
%41 = OpLoad %9 %11
%42 = OpLoad %6 %8
%43 = OpLoad %27 %29
%44 = OpInBoundsAccessChain %45 %32 %47
%48 = OpLoad %5 %44
%49 = OpInBoundsAccessChain %45 %32 %50
%51 = OpLoad %5 %49
%52 = OpInBoundsAccessChain %45 %32 %53
%54 = OpLoad %5 %52
%55 = OpInBoundsAccessChain %45 %32 %56
%57 = OpLoad %5 %55
%59 = OpSampledImage %60 %42 %43
%63 = OpImageSampleExplicitLod %30 %59 %48 Lod %57
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%67 = OpSampledImage %68 %41 %43
%70 = OpCompositeConstruct %33 %48 %51
%69 = OpImageSampleExplicitLod %30 %67 %70 Lod %57
%71 = OpCompositeExtract %5 %69 0
%72 = OpFAdd %5 %71 %64
%73 = OpFAdd %5 %71 %65
%75 = OpSampledImage %76 %40 %43
%78 = OpCompositeConstruct %33 %48 %51
%77 = OpImageSampleExplicitLod %30 %75 %78 Lod %57
%79 = OpCompositeExtract %5 %77 0
%80 = OpCompositeExtract %5 %77 1
%81 = OpFAdd %5 %72 %79
%82 = OpFAdd %5 %73 %80
%84 = OpSampledImage %85 %39 %43
%87 = OpCompositeConstruct %88 %48 %51 %54
%86 = OpImageSampleExplicitLod %30 %84 %87 Lod %57
%89 = OpCompositeExtract %5 %86 0
%90 = OpFAdd %5 %81 %89
%91 = OpFAdd %5 %82 %89
%93 = OpSampledImage %94 %38 %43
%96 = OpCompositeConstruct %88 %48 %51 %54
%95 = OpImageSampleExplicitLod %30 %93 %96 Lod %57
%97 = OpCompositeExtract %5 %95 0
%98 = OpCompositeExtract %5 %95 1
%99 = OpFAdd %5 %90 %97
%100 = OpFAdd %5 %91 %98
%102 = OpSampledImage %103 %37 %43
%105 = OpCompositeConstruct %88 %48 %51 %54
%104 = OpImageSampleExplicitLod %30 %102 %105 Lod %57
%106 = OpCompositeExtract %5 %104 0
%107 = OpCompositeExtract %5 %104 1
%108 = OpFAdd %5 %99 %106
%109 = OpFAdd %5 %100 %107
%111 = OpSampledImage %112 %36 %43
%114 = OpCompositeConstruct %30 %48 %51 %54 %57
%113 = OpImageSampleExplicitLod %30 %111 %114 Lod %57
%115 = OpCompositeExtract %5 %113 0
%116 = OpFAdd %5 %108 %115
%117 = OpFAdd %5 %109 %115
%118 = OpInBoundsAccessChain %119 %35 %47
OpStore %118 %116
%120 = OpInBoundsAccessChain %119 %35 %50
OpStore %120 %117
OpReturn
OpFunctionEnd
#endif
