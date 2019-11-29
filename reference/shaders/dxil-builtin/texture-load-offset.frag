#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform texture1D _8;
layout(set = 0, binding = 2) uniform texture1DArray _11;
layout(set = 0, binding = 3) uniform texture2D _14;
layout(set = 0, binding = 4) uniform texture2DArray _17;
layout(set = 0, binding = 5) uniform texture3D _20;
layout(set = 0, binding = 6) uniform texture2DMS _23;
layout(set = 0, binding = 7) uniform texture2DMSArray _26;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _57 = texelFetchOffset(_8, int(TEXCOORD.x), int(TEXCOORD.y), 1);
    vec4 _61 = texelFetchOffset(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), 2);
    vec4 _70 = texelFetchOffset(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), ivec2(3, 4));
    vec4 _80 = texelFetchOffset(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec2(-4, -3));
    vec4 _88 = texelFetchOffset(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec3(-4, 2, 3));
    vec4 _96 = texelFetchOffset(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), ivec2(2, 3), TEXCOORD.z);
    vec4 _104 = texelFetchOffset(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), ivec2(4, 5), TEXCOORD.w);
    SV_Target.x = (((((_61.x + _57.x) + _70.x) + _80.x) + _88.x) + _96.x) + _104.x;
    SV_Target.y = (((((_61.y + _57.y) + _70.y) + _80.y) + _88.y) + _96.y) + _104.y;
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

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 6, i32 7, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 6, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 5, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 4, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 3, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 2, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 1, i1 false)
  %8 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %9 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %10 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %11 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %12 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %7, i32 %9, i32 %8, i32 undef, i32 undef, i32 1, i32 undef, i32 undef)
  %13 = extractvalue %dx.types.ResRet.f32 %12, 0
  %14 = extractvalue %dx.types.ResRet.f32 %12, 1
  %15 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %6, i32 %10, i32 %8, i32 %9, i32 undef, i32 2, i32 undef, i32 undef)
  %16 = extractvalue %dx.types.ResRet.f32 %15, 0
  %17 = extractvalue %dx.types.ResRet.f32 %15, 1
  %18 = fadd fast float %16, %13
  %19 = fadd fast float %17, %14
  %20 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %5, i32 %10, i32 %8, i32 %9, i32 undef, i32 3, i32 4, i32 undef)
  %21 = extractvalue %dx.types.ResRet.f32 %20, 0
  %22 = extractvalue %dx.types.ResRet.f32 %20, 1
  %23 = fadd fast float %18, %21
  %24 = fadd fast float %19, %22
  %25 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %4, i32 %11, i32 %8, i32 %9, i32 %10, i32 -4, i32 -3, i32 undef)
  %26 = extractvalue %dx.types.ResRet.f32 %25, 0
  %27 = extractvalue %dx.types.ResRet.f32 %25, 1
  %28 = fadd fast float %23, %26
  %29 = fadd fast float %24, %27
  %30 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %3, i32 %11, i32 %8, i32 %9, i32 %10, i32 -4, i32 2, i32 3)
  %31 = extractvalue %dx.types.ResRet.f32 %30, 0
  %32 = extractvalue %dx.types.ResRet.f32 %30, 1
  %33 = fadd fast float %28, %31
  %34 = fadd fast float %29, %32
  %35 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %2, i32 %10, i32 %8, i32 %9, i32 undef, i32 2, i32 3, i32 undef)
  %36 = extractvalue %dx.types.ResRet.f32 %35, 0
  %37 = extractvalue %dx.types.ResRet.f32 %35, 1
  %38 = fadd fast float %33, %36
  %39 = fadd fast float %34, %37
  %40 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %1, i32 %11, i32 %8, i32 %9, i32 %10, i32 4, i32 5, i32 undef)
  %41 = extractvalue %dx.types.ResRet.f32 %40, 0
  %42 = extractvalue %dx.types.ResRet.f32 %40, 1
  %43 = fadd fast float %38, %41
  %44 = fadd fast float %39, %42
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %43)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %44)
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
!dx.viewIdState = !{!14}
!dx.entryPoints = !{!15}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<vector<float, 2> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"", i32 0, i32 5, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.Texture2DMS<vector<float, 2>, 0>"* undef, !"", i32 0, i32 6, i32 1, i32 3, i32 0, !7}
!13 = !{i32 6, %"class.Texture2DMSArray<vector<float, 2>, 0>"* undef, !"", i32 0, i32 7, i32 1, i32 8, i32 0, !7}
!14 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!15 = !{void ()* @main, !"main", !16, !4, null}
!16 = !{!17, !21, null}
!17 = !{!18}
!18 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !19, i8 1, i32 1, i8 4, i32 0, i8 0, !20}
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
; Bound: 116
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %30 %33
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %30 "TEXCOORD"
OpName %33 "SV_Target"
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
OpDecorate %30 Flat
OpDecorate %30 Location 0
OpDecorate %33 Location 0
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
%27 = OpTypeInt 32 0
%28 = OpTypeVector %27 4
%29 = OpTypePointer Input %28
%30 = OpVariable %29 Input
%31 = OpTypeVector %5 2
%32 = OpTypePointer Output %31
%33 = OpVariable %32 Output
%42 = OpTypePointer Input %27
%43 = OpConstant %27 0
%46 = OpConstant %27 1
%49 = OpConstant %27 2
%52 = OpConstant %27 3
%54 = OpTypeInt 32 1
%55 = OpConstant %54 1
%56 = OpTypeVector %5 4
%60 = OpConstant %54 2
%63 = OpTypeVector %27 2
%68 = OpConstant %54 3
%69 = OpConstant %54 4
%72 = OpTypeVector %54 2
%73 = OpConstantComposite %72 %68 %69
%78 = OpConstant %54 -4
%79 = OpConstant %54 -3
%82 = OpTypeVector %27 3
%83 = OpConstantComposite %72 %78 %79
%90 = OpTypeVector %54 3
%91 = OpConstantComposite %90 %78 %60 %68
%98 = OpConstantComposite %72 %60 %68
%103 = OpConstant %54 5
%106 = OpConstantComposite %72 %69 %103
%112 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
%34 = OpLoad %24 %26
%35 = OpLoad %21 %23
%36 = OpLoad %18 %20
%37 = OpLoad %15 %17
%38 = OpLoad %12 %14
%39 = OpLoad %9 %11
%40 = OpLoad %6 %8
%41 = OpInBoundsAccessChain %42 %30 %43
%44 = OpLoad %27 %41
%45 = OpInBoundsAccessChain %42 %30 %46
%47 = OpLoad %27 %45
%48 = OpInBoundsAccessChain %42 %30 %49
%50 = OpLoad %27 %48
%51 = OpInBoundsAccessChain %42 %30 %52
%53 = OpLoad %27 %51
%57 = OpImageFetch %56 %40 %44 Lod|ConstOffset %47 %55
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%62 = OpCompositeConstruct %63 %44 %47
%61 = OpImageFetch %56 %39 %62 Lod|ConstOffset %50 %60
%64 = OpCompositeExtract %5 %61 0
%65 = OpCompositeExtract %5 %61 1
%66 = OpFAdd %5 %64 %58
%67 = OpFAdd %5 %65 %59
%71 = OpCompositeConstruct %63 %44 %47
%70 = OpImageFetch %56 %38 %71 Lod|ConstOffset %50 %73
%74 = OpCompositeExtract %5 %70 0
%75 = OpCompositeExtract %5 %70 1
%76 = OpFAdd %5 %66 %74
%77 = OpFAdd %5 %67 %75
%81 = OpCompositeConstruct %82 %44 %47 %50
%80 = OpImageFetch %56 %37 %81 Lod|ConstOffset %53 %83
%84 = OpCompositeExtract %5 %80 0
%85 = OpCompositeExtract %5 %80 1
%86 = OpFAdd %5 %76 %84
%87 = OpFAdd %5 %77 %85
%89 = OpCompositeConstruct %82 %44 %47 %50
%88 = OpImageFetch %56 %36 %89 Lod|ConstOffset %53 %91
%92 = OpCompositeExtract %5 %88 0
%93 = OpCompositeExtract %5 %88 1
%94 = OpFAdd %5 %86 %92
%95 = OpFAdd %5 %87 %93
%97 = OpCompositeConstruct %63 %44 %47
%96 = OpImageFetch %56 %35 %97 ConstOffset|Sample %98 %50
%99 = OpCompositeExtract %5 %96 0
%100 = OpCompositeExtract %5 %96 1
%101 = OpFAdd %5 %94 %99
%102 = OpFAdd %5 %95 %100
%105 = OpCompositeConstruct %82 %44 %47 %50
%104 = OpImageFetch %56 %34 %105 ConstOffset|Sample %106 %53
%107 = OpCompositeExtract %5 %104 0
%108 = OpCompositeExtract %5 %104 1
%109 = OpFAdd %5 %101 %107
%110 = OpFAdd %5 %102 %108
%111 = OpInBoundsAccessChain %112 %33 %43
OpStore %111 %109
%113 = OpInBoundsAccessChain %112 %33 %46
OpStore %113 %110
OpReturn
OpFunctionEnd
#endif
