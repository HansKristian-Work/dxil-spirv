#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform texture1D _8;
layout(set = 0, binding = 2) uniform texture1DArray _11;
layout(set = 0, binding = 3) uniform texture2D _14;
layout(set = 0, binding = 4) uniform texture2DArray _17;
layout(set = 0, binding = 5) uniform texture3D _20;
layout(set = 0, binding = 6) uniform texture2DMS _23;
layout(set = 0, binding = 7) uniform texture2DMSArray _26;
layout(set = 0, binding = 1) uniform readonly image1D _29;
layout(set = 0, binding = 2) uniform readonly image1DArray _32;
layout(set = 0, binding = 3) uniform readonly image2D _35;
layout(set = 0, binding = 4) uniform readonly image2DArray _38;
layout(set = 0, binding = 5) uniform readonly image3D _41;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _77 = texelFetch(_8, int(TEXCOORD.x), int(TEXCOORD.y));
    vec4 _80 = texelFetch(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _87 = texelFetch(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _93 = texelFetch(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _100 = texelFetch(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _106 = texelFetch(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), TEXCOORD.z);
    vec4 _112 = texelFetch(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), TEXCOORD.w);
    vec4 _118 = imageLoad(_29, int(TEXCOORD.x));
    vec4 _123 = imageLoad(_32, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _129 = imageLoad(_35, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _135 = imageLoad(_38, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    vec4 _141 = imageLoad(_41, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    SV_Target.x = ((((((((((_80.x + _77.x) + _87.x) + _93.x) + _100.x) + _106.x) + _112.x) + _118.x) + _123.x) + _129.x) + _135.x) + _141.x;
    SV_Target.y = ((((((((((_80.y + _77.y) + _87.y) + _93.y) + _100.y) + _106.y) + _112.y) + _118.y) + _123.y) + _129.y) + _135.y) + _141.y;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture1D<vector<float, 2> >" = type { <2 x float>, %"class.Texture1D<vector<float, 2> >::mips_type" }
%"class.Texture1D<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture1DArray<vector<float, 2> >" = type { <2 x float>, %"class.Texture1DArray<vector<float, 2> >::mips_type" }
%"class.Texture1DArray<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture2D<vector<float, 2> >" = type { <2 x float>, %"class.Texture2D<vector<float, 2> >::mips_type" }
%"class.Texture2D<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture2DArray<vector<float, 2> >" = type { <2 x float>, %"class.Texture2DArray<vector<float, 2> >::mips_type" }
%"class.Texture2DArray<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture3D<vector<float, 2> >" = type { <2 x float>, %"class.Texture3D<vector<float, 2> >::mips_type" }
%"class.Texture3D<vector<float, 2> >::mips_type" = type { i32 }
%"class.Texture2DMS<vector<float, 2>, 0>" = type { <2 x float>, %"class.Texture2DMS<vector<float, 2>, 0>::sample_type" }
%"class.Texture2DMS<vector<float, 2>, 0>::sample_type" = type { i32 }
%"class.Texture2DMSArray<vector<float, 2>, 0>" = type { <2 x float>, %"class.Texture2DMSArray<vector<float, 2>, 0>::sample_type" }
%"class.Texture2DMSArray<vector<float, 2>, 0>::sample_type" = type { i32 }
%"class.RWTexture1D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture1DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture3D<vector<float, 2> >" = type { <2 x float> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 4, i32 5, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 4, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 3, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 2, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 1, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 6, i32 7, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 6, i1 false)
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 5, i1 false)
  %9 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 4, i1 false)
  %10 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 3, i1 false)
  %11 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 2, i1 false)
  %12 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 1, i1 false)
  %13 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %14 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %15 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %16 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %17 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %12, i32 %14, i32 %13, i32 undef, i32 undef, i32 undef, i32 undef, i32 undef)
  %18 = extractvalue %dx.types.ResRet.f32 %17, 0
  %19 = extractvalue %dx.types.ResRet.f32 %17, 1
  %20 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %11, i32 %15, i32 %13, i32 %14, i32 undef, i32 undef, i32 undef, i32 undef)
  %21 = extractvalue %dx.types.ResRet.f32 %20, 0
  %22 = extractvalue %dx.types.ResRet.f32 %20, 1
  %23 = fadd fast float %21, %18
  %24 = fadd fast float %22, %19
  %25 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %10, i32 %15, i32 %13, i32 %14, i32 undef, i32 undef, i32 undef, i32 undef)
  %26 = extractvalue %dx.types.ResRet.f32 %25, 0
  %27 = extractvalue %dx.types.ResRet.f32 %25, 1
  %28 = fadd fast float %23, %26
  %29 = fadd fast float %24, %27
  %30 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %9, i32 %16, i32 %13, i32 %14, i32 %15, i32 undef, i32 undef, i32 undef)
  %31 = extractvalue %dx.types.ResRet.f32 %30, 0
  %32 = extractvalue %dx.types.ResRet.f32 %30, 1
  %33 = fadd fast float %28, %31
  %34 = fadd fast float %29, %32
  %35 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %8, i32 %16, i32 %13, i32 %14, i32 %15, i32 undef, i32 undef, i32 undef)
  %36 = extractvalue %dx.types.ResRet.f32 %35, 0
  %37 = extractvalue %dx.types.ResRet.f32 %35, 1
  %38 = fadd fast float %33, %36
  %39 = fadd fast float %34, %37
  %40 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %7, i32 %15, i32 %13, i32 %14, i32 undef, i32 undef, i32 undef, i32 undef)
  %41 = extractvalue %dx.types.ResRet.f32 %40, 0
  %42 = extractvalue %dx.types.ResRet.f32 %40, 1
  %43 = fadd fast float %38, %41
  %44 = fadd fast float %39, %42
  %45 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %6, i32 %16, i32 %13, i32 %14, i32 %15, i32 undef, i32 undef, i32 undef)
  %46 = extractvalue %dx.types.ResRet.f32 %45, 0
  %47 = extractvalue %dx.types.ResRet.f32 %45, 1
  %48 = fadd fast float %43, %46
  %49 = fadd fast float %44, %47
  %50 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %5, i32 undef, i32 %13, i32 undef, i32 undef, i32 undef, i32 undef, i32 undef)
  %51 = extractvalue %dx.types.ResRet.f32 %50, 0
  %52 = extractvalue %dx.types.ResRet.f32 %50, 1
  %53 = fadd fast float %48, %51
  %54 = fadd fast float %49, %52
  %55 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %4, i32 undef, i32 %13, i32 %14, i32 undef, i32 undef, i32 undef, i32 undef)
  %56 = extractvalue %dx.types.ResRet.f32 %55, 0
  %57 = extractvalue %dx.types.ResRet.f32 %55, 1
  %58 = fadd fast float %53, %56
  %59 = fadd fast float %54, %57
  %60 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %3, i32 undef, i32 %13, i32 %14, i32 undef, i32 undef, i32 undef, i32 undef)
  %61 = extractvalue %dx.types.ResRet.f32 %60, 0
  %62 = extractvalue %dx.types.ResRet.f32 %60, 1
  %63 = fadd fast float %58, %61
  %64 = fadd fast float %59, %62
  %65 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %2, i32 undef, i32 %13, i32 %14, i32 %15, i32 undef, i32 undef, i32 undef)
  %66 = extractvalue %dx.types.ResRet.f32 %65, 0
  %67 = extractvalue %dx.types.ResRet.f32 %65, 1
  %68 = fadd fast float %63, %66
  %69 = fadd fast float %64, %67
  %70 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %1, i32 undef, i32 %13, i32 %14, i32 %15, i32 undef, i32 undef, i32 undef)
  %71 = extractvalue %dx.types.ResRet.f32 %70, 0
  %72 = extractvalue %dx.types.ResRet.f32 %70, 1
  %73 = fadd fast float %68, %71
  %74 = fadd fast float %69, %72
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %73)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %74)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32, %dx.types.Handle, i32, i32, i32, i32, i32, i32, i32) #2

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
!dx.viewIdState = !{!20}
!dx.entryPoints = !{!21}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, !14, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<vector<float, 2> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"", i32 0, i32 5, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.Texture2DMS<vector<float, 2>, 0>"* undef, !"", i32 0, i32 6, i32 1, i32 3, i32 0, !7}
!13 = !{i32 6, %"class.Texture2DMSArray<vector<float, 2>, 0>"* undef, !"", i32 0, i32 7, i32 1, i32 8, i32 0, !7}
!14 = !{!15, !16, !17, !18, !19}
!15 = !{i32 0, %"class.RWTexture1D<vector<float, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!16 = !{i32 1, %"class.RWTexture1DArray<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 6, i1 false, i1 false, i1 false, !7}
!17 = !{i32 2, %"class.RWTexture2D<vector<float, 2> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!18 = !{i32 3, %"class.RWTexture2DArray<vector<float, 2> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i1 false, i1 false, i1 false, !7}
!19 = !{i32 4, %"class.RWTexture3D<vector<float, 2> >"* undef, !"", i32 0, i32 5, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
!20 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!21 = !{void ()* @main, !"main", !22, !4, !30}
!22 = !{!23, !27, null}
!23 = !{!24}
!24 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !25, i8 1, i32 1, i8 4, i32 0, i8 0, !26}
!25 = !{i32 0}
!26 = !{i32 3, i32 15}
!27 = !{!28}
!28 = !{i32 0, !"SV_Target", i8 9, i8 16, !25, i8 0, i32 1, i8 2, i32 0, i8 0, !29}
!29 = !{i32 3, i32 3}
!30 = !{i32 0, i64 8192}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 152
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
OpCapability StorageImageReadWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %45 %48
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %45 "TEXCOORD"
OpName %48 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 7
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 1
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 2
OpDecorate %35 DescriptorSet 0
OpDecorate %35 Binding 3
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 4
OpDecorate %41 DescriptorSet 0
OpDecorate %41 Binding 5
OpDecorate %45 Flat
OpDecorate %45 Location 0
OpDecorate %48 Location 0
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
%21 = OpTypeImage %5 2D 0 0 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 2D 0 1 1 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeImage %5 1D 0 0 0 2 Unknown
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeImage %5 1D 0 1 0 2 Unknown
%31 = OpTypePointer UniformConstant %30
%32 = OpVariable %31 UniformConstant
%33 = OpTypeImage %5 2D 0 0 0 2 Unknown
%34 = OpTypePointer UniformConstant %33
%35 = OpVariable %34 UniformConstant
%36 = OpTypeImage %5 2D 0 1 0 2 Unknown
%37 = OpTypePointer UniformConstant %36
%38 = OpVariable %37 UniformConstant
%39 = OpTypeImage %5 3D 0 0 0 2 Unknown
%40 = OpTypePointer UniformConstant %39
%41 = OpVariable %40 UniformConstant
%42 = OpTypeInt 32 0
%43 = OpTypeVector %42 4
%44 = OpTypePointer Input %43
%45 = OpVariable %44 Input
%46 = OpTypeVector %5 2
%47 = OpTypePointer Output %46
%48 = OpVariable %47 Output
%62 = OpTypePointer Input %42
%63 = OpConstant %42 0
%66 = OpConstant %42 1
%69 = OpConstant %42 2
%72 = OpConstant %42 3
%74 = OpTypeInt 32 1
%75 = OpConstant %74 0
%76 = OpTypeVector %5 4
%82 = OpTypeVector %42 2
%95 = OpTypeVector %42 3
%148 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %150
%150 = OpLabel
%49 = OpLoad %39 %41
%50 = OpLoad %36 %38
%51 = OpLoad %33 %35
%52 = OpLoad %30 %32
%53 = OpLoad %27 %29
%54 = OpLoad %24 %26
%55 = OpLoad %21 %23
%56 = OpLoad %18 %20
%57 = OpLoad %15 %17
%58 = OpLoad %12 %14
%59 = OpLoad %9 %11
%60 = OpLoad %6 %8
%61 = OpInBoundsAccessChain %62 %45 %63
%64 = OpLoad %42 %61
%65 = OpInBoundsAccessChain %62 %45 %66
%67 = OpLoad %42 %65
%68 = OpInBoundsAccessChain %62 %45 %69
%70 = OpLoad %42 %68
%71 = OpInBoundsAccessChain %62 %45 %72
%73 = OpLoad %42 %71
%77 = OpImageFetch %76 %60 %64 Lod %67
%78 = OpCompositeExtract %5 %77 0
%79 = OpCompositeExtract %5 %77 1
%81 = OpCompositeConstruct %82 %64 %67
%80 = OpImageFetch %76 %59 %81 Lod %70
%83 = OpCompositeExtract %5 %80 0
%84 = OpCompositeExtract %5 %80 1
%85 = OpFAdd %5 %83 %78
%86 = OpFAdd %5 %84 %79
%88 = OpCompositeConstruct %82 %64 %67
%87 = OpImageFetch %76 %58 %88 Lod %70
%89 = OpCompositeExtract %5 %87 0
%90 = OpCompositeExtract %5 %87 1
%91 = OpFAdd %5 %85 %89
%92 = OpFAdd %5 %86 %90
%94 = OpCompositeConstruct %95 %64 %67 %70
%93 = OpImageFetch %76 %57 %94 Lod %73
%96 = OpCompositeExtract %5 %93 0
%97 = OpCompositeExtract %5 %93 1
%98 = OpFAdd %5 %91 %96
%99 = OpFAdd %5 %92 %97
%101 = OpCompositeConstruct %95 %64 %67 %70
%100 = OpImageFetch %76 %56 %101 Lod %73
%102 = OpCompositeExtract %5 %100 0
%103 = OpCompositeExtract %5 %100 1
%104 = OpFAdd %5 %98 %102
%105 = OpFAdd %5 %99 %103
%107 = OpCompositeConstruct %82 %64 %67
%106 = OpImageFetch %76 %55 %107 Sample %70
%108 = OpCompositeExtract %5 %106 0
%109 = OpCompositeExtract %5 %106 1
%110 = OpFAdd %5 %104 %108
%111 = OpFAdd %5 %105 %109
%113 = OpCompositeConstruct %95 %64 %67 %70
%112 = OpImageFetch %76 %54 %113 Sample %73
%114 = OpCompositeExtract %5 %112 0
%115 = OpCompositeExtract %5 %112 1
%116 = OpFAdd %5 %110 %114
%117 = OpFAdd %5 %111 %115
%118 = OpImageRead %76 %53 %64 None
%119 = OpCompositeExtract %5 %118 0
%120 = OpCompositeExtract %5 %118 1
%121 = OpFAdd %5 %116 %119
%122 = OpFAdd %5 %117 %120
%124 = OpCompositeConstruct %82 %64 %67
%123 = OpImageRead %76 %52 %124 None
%125 = OpCompositeExtract %5 %123 0
%126 = OpCompositeExtract %5 %123 1
%127 = OpFAdd %5 %121 %125
%128 = OpFAdd %5 %122 %126
%130 = OpCompositeConstruct %82 %64 %67
%129 = OpImageRead %76 %51 %130 None
%131 = OpCompositeExtract %5 %129 0
%132 = OpCompositeExtract %5 %129 1
%133 = OpFAdd %5 %127 %131
%134 = OpFAdd %5 %128 %132
%136 = OpCompositeConstruct %95 %64 %67 %70
%135 = OpImageRead %76 %50 %136 None
%137 = OpCompositeExtract %5 %135 0
%138 = OpCompositeExtract %5 %135 1
%139 = OpFAdd %5 %133 %137
%140 = OpFAdd %5 %134 %138
%142 = OpCompositeConstruct %95 %64 %67 %70
%141 = OpImageRead %76 %49 %142 None
%143 = OpCompositeExtract %5 %141 0
%144 = OpCompositeExtract %5 %141 1
%145 = OpFAdd %5 %139 %143
%146 = OpFAdd %5 %140 %144
%147 = OpInBoundsAccessChain %148 %48 %63
OpStore %147 %145
%149 = OpInBoundsAccessChain %148 %48 %66
OpStore %149 %146
OpReturn
OpFunctionEnd
#endif
