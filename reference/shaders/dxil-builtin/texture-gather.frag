#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _52 = textureGatherOffset(sampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0), 0u);
    vec4 _64 = textureGatherOffset(sampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0), 1u);
    vec4 _77 = textureGather(samplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u);
    vec4 _90 = textureGather(samplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u);
    SV_Target.x = ((_64.x + _52.x) + _77.x) + _90.x;
    SV_Target.y = ((_64.y + _52.y) + _77.y) + _90.y;
    SV_Target.z = ((_64.z + _52.z) + _77.z) + _90.z;
    SV_Target.w = ((_64.w + _52.w) + _77.w) + _90.w;
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
%struct.SamplerState = type { i32 }

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
  %10 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %4, %dx.types.Handle %5, float %6, float %7, float undef, float undef, i32 0, i32 0, i32 0)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = extractvalue %dx.types.ResRet.f32 %10, 1
  %13 = extractvalue %dx.types.ResRet.f32 %10, 2
  %14 = extractvalue %dx.types.ResRet.f32 %10, 3
  %15 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %3, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 0, i32 0, i32 1)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %17 = extractvalue %dx.types.ResRet.f32 %15, 1
  %18 = extractvalue %dx.types.ResRet.f32 %15, 2
  %19 = extractvalue %dx.types.ResRet.f32 %15, 3
  %20 = fadd fast float %16, %11
  %21 = fadd fast float %17, %12
  %22 = fadd fast float %18, %13
  %23 = fadd fast float %19, %14
  %24 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %2, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 undef, i32 undef, i32 2)
  %25 = extractvalue %dx.types.ResRet.f32 %24, 0
  %26 = extractvalue %dx.types.ResRet.f32 %24, 1
  %27 = extractvalue %dx.types.ResRet.f32 %24, 2
  %28 = extractvalue %dx.types.ResRet.f32 %24, 3
  %29 = fadd fast float %20, %25
  %30 = fadd fast float %21, %26
  %31 = fadd fast float %22, %27
  %32 = fadd fast float %23, %28
  %33 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %1, %dx.types.Handle %5, float %6, float %7, float %8, float %9, i32 undef, i32 undef, i32 3)
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
declare %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32) #2

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
!12 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 1, i32 1, i32 0, null}
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
; Bound: 106
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
%32 = OpTypePointer Input %5
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%40 = OpConstant %33 2
%43 = OpConstant %33 3
%45 = OpTypeImage %5 2D 0 0 0 2 Unknown
%47 = OpTypeSampledImage %45
%49 = OpTypeVector %5 2
%50 = OpTypeInt 32 1
%51 = OpConstant %50 0
%53 = OpTypeVector %50 2
%54 = OpConstantComposite %53 %51 %51
%59 = OpTypeImage %5 2D 0 1 0 2 Unknown
%61 = OpTypeSampledImage %59
%63 = OpTypeVector %5 3
%73 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%75 = OpTypeSampledImage %73
%86 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%88 = OpTypeSampledImage %86
%100 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
%26 = OpLoad %15 %17
%27 = OpLoad %12 %14
%28 = OpLoad %9 %11
%29 = OpLoad %6 %8
%30 = OpLoad %18 %20
%31 = OpInBoundsAccessChain %32 %23 %34
%35 = OpLoad %5 %31
%36 = OpInBoundsAccessChain %32 %23 %37
%38 = OpLoad %5 %36
%39 = OpInBoundsAccessChain %32 %23 %40
%41 = OpLoad %5 %39
%42 = OpInBoundsAccessChain %32 %23 %43
%44 = OpLoad %5 %42
%46 = OpSampledImage %47 %29 %30
%48 = OpCompositeConstruct %49 %35 %38
%52 = OpImageGather %21 %46 %48 %34 ConstOffset %54
%55 = OpCompositeExtract %5 %52 0
%56 = OpCompositeExtract %5 %52 1
%57 = OpCompositeExtract %5 %52 2
%58 = OpCompositeExtract %5 %52 3
%60 = OpSampledImage %61 %28 %30
%62 = OpCompositeConstruct %63 %35 %38 %41
%64 = OpImageGather %21 %60 %62 %37 ConstOffset %54
%65 = OpCompositeExtract %5 %64 0
%66 = OpCompositeExtract %5 %64 1
%67 = OpCompositeExtract %5 %64 2
%68 = OpCompositeExtract %5 %64 3
%69 = OpFAdd %5 %65 %55
%70 = OpFAdd %5 %66 %56
%71 = OpFAdd %5 %67 %57
%72 = OpFAdd %5 %68 %58
%74 = OpSampledImage %75 %27 %30
%76 = OpCompositeConstruct %63 %35 %38 %41
%77 = OpImageGather %21 %74 %76 %40
%78 = OpCompositeExtract %5 %77 0
%79 = OpCompositeExtract %5 %77 1
%80 = OpCompositeExtract %5 %77 2
%81 = OpCompositeExtract %5 %77 3
%82 = OpFAdd %5 %69 %78
%83 = OpFAdd %5 %70 %79
%84 = OpFAdd %5 %71 %80
%85 = OpFAdd %5 %72 %81
%87 = OpSampledImage %88 %26 %30
%89 = OpCompositeConstruct %21 %35 %38 %41 %44
%90 = OpImageGather %21 %87 %89 %43
%91 = OpCompositeExtract %5 %90 0
%92 = OpCompositeExtract %5 %90 1
%93 = OpCompositeExtract %5 %90 2
%94 = OpCompositeExtract %5 %90 3
%95 = OpFAdd %5 %82 %91
%96 = OpFAdd %5 %83 %92
%97 = OpFAdd %5 %84 %93
%98 = OpFAdd %5 %85 %94
%99 = OpInBoundsAccessChain %100 %25 %34
OpStore %99 %95
%101 = OpInBoundsAccessChain %100 %25 %37
OpStore %101 %96
%102 = OpInBoundsAccessChain %100 %25 %40
OpStore %102 %97
%103 = OpInBoundsAccessChain %100 %25 %43
OpStore %103 %98
OpReturn
OpFunctionEnd
#endif
