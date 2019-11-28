#version 460

layout(set = 1, binding = 0) uniform texture1D Tex1D;
layout(set = 1, binding = 1) uniform texture1DArray Tex1DArray;
layout(set = 1, binding = 2) uniform texture2D Tex2D;
layout(set = 1, binding = 3) uniform texture2DArray Tex2DArray;
layout(set = 0, binding = 0) uniform samplerShadow Samp;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    float _86 = ((vec4(textureOffset(sampler1DArrayShadow(Tex1DArray, Samp), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 2)).x + vec4(textureOffset(sampler1DShadow(Tex1D, Samp), vec2(TEXCOORD.x, TEXCOORD.w), 1)).x) + vec4(textureOffset(sampler2DShadow(Tex2D, Samp), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), ivec2(-3, -2))).x) + vec4(textureOffset(sampler2DArrayShadow(Tex2DArray, Samp), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), ivec2(4, 5))).x;
    SV_Target.x = _86;
    SV_Target.y = _86;
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
%struct.SamplerComparisonState = type { i32 }
%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture3D<vector<float, 2> >" = type { <2 x float>, %"class.Texture3D<vector<float, 2> >::mips_type" }
%"class.Texture3D<vector<float, 2> >::mips_type" = type { i32 }
%"class.TextureCube<vector<float, 2> >" = type { <2 x float> }
%"class.TextureCubeArray<float>" = type { float }

@"\01?Tex1D@@3V?$Texture1D@V?$vector@M$01@@@@A" = external constant %"class.Texture1D<vector<float, 2> >", align 4
@"\01?Tex1DArray@@3V?$Texture1DArray@M@@A" = external constant %"class.Texture1DArray<float>", align 4
@"\01?Tex2D@@3V?$Texture2D@V?$vector@M$01@@@@A" = external constant %"class.Texture2D<vector<float, 2> >", align 4
@"\01?Tex2DArray@@3V?$Texture2DArray@M@@A" = external constant %"class.Texture2DArray<float>", align 4
@"\01?Samp@@3USamplerComparisonState@@A" = external constant %struct.SamplerComparisonState, align 4

define void @main() {
  %Tex2DArray_texture_2darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %Tex2D_texture_2d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %Tex1DArray_texture_1darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %Tex1D_texture_1d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %Samp_sampler = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %5 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %Tex1D_texture_1d, %dx.types.Handle %Samp_sampler, float %1, float undef, float undef, float undef, i32 1, i32 undef, i32 undef, float %4, float undef)
  %6 = extractvalue %dx.types.ResRet.f32 %5, 0
  %7 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %Tex1DArray_texture_1darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 2, i32 undef, i32 undef, float %4, float undef)
  %8 = extractvalue %dx.types.ResRet.f32 %7, 0
  %.i0 = fadd fast float %8, %6
  %9 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %Tex2D_texture_2d, %dx.types.Handle %Samp_sampler, float %1, float %2, float undef, float undef, i32 -3, i32 -2, i32 undef, float %4, float undef)
  %10 = extractvalue %dx.types.ResRet.f32 %9, 0
  %.i01 = fadd fast float %.i0, %10
  %11 = call %dx.types.ResRet.f32 @dx.op.sampleCmp.f32(i32 64, %dx.types.Handle %Tex2DArray_texture_2darray, %dx.types.Handle %Samp_sampler, float %1, float %2, float %3, float undef, i32 4, i32 5, i32 undef, float %4, float undef)
  %12 = extractvalue %dx.types.ResRet.f32 %11, 0
  %.i03 = fadd fast float %.i01, %12
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i03)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i03)
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
!dx.typeAnnotations = !{!13, !21}
!dx.viewIdState = !{!25}
!dx.entryPoints = !{!26}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !11}
!5 = !{!6, !8, !9, !10}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"Tex1D", i32 1, i32 0, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<float>"* undef, !"Tex1DArray", i32 1, i32 1, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"Tex2D", i32 1, i32 2, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<float>"* undef, !"Tex2DArray", i32 1, i32 3, i32 1, i32 7, i32 0, !7}
!11 = !{!12}
!12 = !{i32 0, %struct.SamplerComparisonState* undef, !"Samp", i32 0, i32 0, i32 1, i32 1, null}
!13 = !{i32 0, %"class.Texture1D<vector<float, 2> >" undef, !14, %"class.Texture1D<vector<float, 2> >::mips_type" undef, !17, %"class.Texture1DArray<float>" undef, !14, %"class.Texture1DArray<float>::mips_type" undef, !17, %"class.Texture2D<vector<float, 2> >" undef, !14, %"class.Texture2D<vector<float, 2> >::mips_type" undef, !17, %"class.Texture2DArray<float>" undef, !14, %"class.Texture2DArray<float>::mips_type" undef, !17, %"class.Texture3D<vector<float, 2> >" undef, !14, %"class.Texture3D<vector<float, 2> >::mips_type" undef, !17, %"class.TextureCube<vector<float, 2> >" undef, !19, %"class.TextureCubeArray<float>" undef, !20}
!14 = !{i32 20, !15, !16}
!15 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!16 = !{i32 6, !"mips", i32 3, i32 16}
!17 = !{i32 4, !18}
!18 = !{i32 6, !"handle", i32 3, i32 0, i32 7, i32 5}
!19 = !{i32 8, !15}
!20 = !{i32 4, !15}
!21 = !{i32 1, void ()* @main, !22}
!22 = !{!23}
!23 = !{i32 0, !24, !24}
!24 = !{}
!25 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!26 = !{void ()* @main, !"main", !27, !4, null}
!27 = !{!28, !31, null}
!28 = !{!29}
!29 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !30, i8 2, i32 1, i8 4, i32 0, i8 0, null}
!30 = !{i32 0}
!31 = !{!32}
!32 = !{i32 0, !"SV_Target", i8 9, i8 16, !30, i8 0, i32 1, i8 2, i32 0, i8 0, null}
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
OpName %8 "Tex1D"
OpName %11 "Tex1DArray"
OpName %14 "Tex2D"
OpName %17 "Tex2DArray"
OpName %20 "Samp"
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
