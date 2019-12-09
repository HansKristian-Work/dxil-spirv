#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _49 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _52 = textureGather(sampler2DShadow(_8, _20), _49, TEXCOORD.z);
    vec3 _61 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _62 = textureGather(sampler2DArrayShadow(_11, _20), _61, TEXCOORD.w);
    vec3 _74 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _75 = textureGather(samplerCubeShadow(_14, _20), _74, TEXCOORD.w);
    vec4 _87 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    vec4 _88 = textureGather(samplerCubeArrayShadow(_17, _20), _87, TEXCOORD.w);
    SV_Target.x = ((_62.x + _52.x) + _75.x) + _88.x;
    SV_Target.y = ((_62.y + _52.y) + _75.y) + _88.y;
    SV_Target.z = ((_62.z + _52.z) + _75.z) + _88.z;
    SV_Target.w = ((_62.w + _52.w) + _75.w) + _88.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture2D<vector<float, 4> >" = type { <4 x float>, %"class.Texture2D<vector<float, 4> >::mips_type" }
%"class.Texture2D<vector<float, 4> >::mips_type" = type { i32 }
%"class.Texture2DArray<vector<float, 4> >" = type { <4 x float>, %"class.Texture2DArray<vector<float, 4> >::mips_type" }
%"class.Texture2DArray<vector<float, 4> >::mips_type" = type { i32 }
%"class.TextureCube<vector<float, 4> >" = type { <4 x float> }
%"class.TextureCubeArray<vector<float, 4> >" = type { <4 x float> }
%struct.SamplerComparisonState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 7, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 6, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 4, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 3, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 1, i1 false)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %10 = call %dx.types.ResRet.f32 @dx.op.textureGatherCmp.f32(i32 74, %dx.types.Handle %4, %dx.types.Handle %5, float %6, float %7, float undef, float undef, i32 0, i32 0, i32 0, float %8)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = extractvalue %dx.types.ResRet.f32 %10, 1
  %13 = extractvalue %dx.types.ResRet.f32 %10, 2
  %14 = extractvalue %dx.types.ResRet.f32 %10, 3
  %15 = call %dx.types.ResRet.f32 @dx.op.textureGatherCmp.f32(i32 74, %dx.types.Handle %3, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 0, i32 0, i32 0, float %9)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %17 = extractvalue %dx.types.ResRet.f32 %15, 1
  %18 = extractvalue %dx.types.ResRet.f32 %15, 2
  %19 = extractvalue %dx.types.ResRet.f32 %15, 3
  %20 = fadd fast float %16, %11
  %21 = fadd fast float %17, %12
  %22 = fadd fast float %18, %13
  %23 = fadd fast float %19, %14
  %24 = call %dx.types.ResRet.f32 @dx.op.textureGatherCmp.f32(i32 74, %dx.types.Handle %2, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 undef, i32 undef, i32 0, float %9)
  %25 = extractvalue %dx.types.ResRet.f32 %24, 0
  %26 = extractvalue %dx.types.ResRet.f32 %24, 1
  %27 = extractvalue %dx.types.ResRet.f32 %24, 2
  %28 = extractvalue %dx.types.ResRet.f32 %24, 3
  %29 = fadd fast float %20, %25
  %30 = fadd fast float %21, %26
  %31 = fadd fast float %22, %27
  %32 = fadd fast float %23, %28
  %33 = call %dx.types.ResRet.f32 @dx.op.textureGatherCmp.f32(i32 74, %dx.types.Handle %1, %dx.types.Handle %5, float %6, float %7, float %8, float %9, i32 undef, i32 undef, i32 0, float %9)
  %34 = extractvalue %dx.types.ResRet.f32 %33, 0
  %35 = extractvalue %dx.types.ResRet.f32 %33, 1
  %36 = extractvalue %dx.types.ResRet.f32 %33, 2
  %37 = extractvalue %dx.types.ResRet.f32 %33, 3
  %38 = fadd fast float %29, %34
  %39 = fadd fast float %30, %35
  %40 = fadd fast float %31, %36
  %41 = fadd fast float %32, %37
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %38)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %39)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %40)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %41)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.textureGatherCmp.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #2

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
!6 = !{i32 0, %"class.Texture2D<vector<float, 4> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture2DArray<vector<float, 4> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!9 = !{i32 2, %"class.TextureCube<vector<float, 4> >"* undef, !"", i32 0, i32 6, i32 1, i32 5, i32 0, !7}
!10 = !{i32 3, %"class.TextureCubeArray<vector<float, 4> >"* undef, !"", i32 0, i32 7, i32 1, i32 9, i32 0, !7}
!11 = !{!12}
!12 = !{i32 0, %struct.SamplerComparisonState* undef, !"", i32 0, i32 1, i32 1, i32 1, null}
!13 = !{[6 x i32] [i32 4, i32 4, i32 15, i32 15, i32 15, i32 15]}
!14 = !{void ()* @main, !"main", !15, !4, null}
!15 = !{!16, !20, null}
!16 = !{!17}
!17 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !18, i8 2, i32 1, i8 4, i32 0, i8 0, !19}
!18 = !{i32 0}
!19 = !{i32 3, i32 15}
!20 = !{!21}
!21 = !{i32 0, !"SV_Target", i8 9, i8 16, !18, i8 0, i32 1, i8 4, i32 0, i8 0, !19}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 104
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %25 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 6
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 7
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %23 Location 0
OpDecorate %25 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Output %21
%25 = OpVariable %24 Output
%31 = OpTypePointer Input %5
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%40 = OpConstant %33 2
%43 = OpConstant %33 3
%45 = OpTypeImage %5 2D 0 0 0 2 Unknown
%46 = OpTypeSampledImage %45
%48 = OpTypeVector %5 2
%50 = OpTypeInt 32 1
%51 = OpConstant %50 0
%57 = OpTypeImage %5 2D 0 1 0 2 Unknown
%58 = OpTypeSampledImage %57
%60 = OpTypeVector %5 3
%71 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%72 = OpTypeSampledImage %71
%84 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%85 = OpTypeSampledImage %84
%97 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %102
%102 = OpLabel
%26 = OpLoad %15 %17
%27 = OpLoad %12 %14
%28 = OpLoad %9 %11
%29 = OpLoad %6 %8
%30 = OpLoad %18 %20
%32 = OpAccessChain %31 %23 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %31 %23 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %31 %23 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %31 %23 %43
%44 = OpLoad %5 %42
%47 = OpSampledImage %46 %29 %30
%49 = OpCompositeConstruct %48 %35 %38
%52 = OpImageDrefGather %21 %47 %49 %41
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%55 = OpCompositeExtract %5 %52 2
%56 = OpCompositeExtract %5 %52 3
%59 = OpSampledImage %58 %28 %30
%61 = OpCompositeConstruct %60 %35 %38 %41
%62 = OpImageDrefGather %21 %59 %61 %44
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%65 = OpCompositeExtract %5 %62 2
%66 = OpCompositeExtract %5 %62 3
%67 = OpFAdd %5 %63 %53
%68 = OpFAdd %5 %64 %54
%69 = OpFAdd %5 %65 %55
%70 = OpFAdd %5 %66 %56
%73 = OpSampledImage %72 %27 %30
%74 = OpCompositeConstruct %60 %35 %38 %41
%75 = OpImageDrefGather %21 %73 %74 %44
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpCompositeExtract %5 %75 3
%80 = OpFAdd %5 %67 %76
%81 = OpFAdd %5 %68 %77
%82 = OpFAdd %5 %69 %78
%83 = OpFAdd %5 %70 %79
%86 = OpSampledImage %85 %26 %30
%87 = OpCompositeConstruct %21 %35 %38 %41 %44
%88 = OpImageDrefGather %21 %86 %87 %44
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpCompositeExtract %5 %88 2
%92 = OpCompositeExtract %5 %88 3
%93 = OpFAdd %5 %80 %89
%94 = OpFAdd %5 %81 %90
%95 = OpFAdd %5 %82 %91
%96 = OpFAdd %5 %83 %92
%98 = OpAccessChain %97 %25 %34
OpStore %98 %93
%99 = OpAccessChain %97 %25 %37
OpStore %99 %94
%100 = OpAccessChain %97 %25 %40
OpStore %100 %95
%101 = OpAccessChain %97 %25 %43
OpStore %101 %96
OpReturn
OpFunctionEnd
#endif
