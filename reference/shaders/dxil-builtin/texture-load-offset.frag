#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform texture1D Tex1D;
layout(set = 0, binding = 2) uniform texture1DArray Tex1DArray;
layout(set = 0, binding = 3) uniform texture2D Tex2D;
layout(set = 0, binding = 4) uniform texture2DArray Tex2DArray;
layout(set = 0, binding = 5) uniform texture3D Tex3D;
layout(set = 0, binding = 6) uniform texture2DMS Tex2DMS;
layout(set = 0, binding = 7) uniform texture2DMSArray Tex2DMSArray;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _57 = texelFetchOffset(Tex1D, int(TEXCOORD.x), int(TEXCOORD.y), 1);
    vec4 _61 = texelFetchOffset(Tex1DArray, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), 2);
    vec4 _70 = texelFetchOffset(Tex2D, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z), ivec2(3, 4));
    vec4 _80 = texelFetchOffset(Tex2DArray, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec2(-4, -3));
    vec4 _88 = texelFetchOffset(Tex3D, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w), ivec3(-4, 2, 3));
    vec4 _96 = texelFetchOffset(Tex2DMS, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), ivec2(2, 3), TEXCOORD.z);
    vec4 _104 = texelFetchOffset(Tex2DMSArray, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), ivec2(4, 5), TEXCOORD.w);
    SV_Target.x = (((((_61.x + _57.x) + _70.x) + _80.x) + _88.x) + _96.x) + _104.x;
    SV_Target.y = (((((_61.y + _57.y) + _70.y) + _80.y) + _88.y) + _96.y) + _104.y;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

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
%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }

@"\01?Tex1D@@3V?$Texture1D@V?$vector@M$01@@@@A" = external constant %"class.Texture1D<vector<float, 2> >", align 4
@"\01?Tex1DArray@@3V?$Texture1DArray@V?$vector@M$01@@@@A" = external constant %"class.Texture1DArray<vector<float, 2> >", align 4
@"\01?Tex2D@@3V?$Texture2D@V?$vector@M$01@@@@A" = external constant %"class.Texture2D<vector<float, 2> >", align 4
@"\01?Tex2DArray@@3V?$Texture2DArray@V?$vector@M$01@@@@A" = external constant %"class.Texture2DArray<vector<float, 2> >", align 4
@"\01?Tex3D@@3V?$Texture3D@V?$vector@M$01@@@@A" = external constant %"class.Texture3D<vector<float, 2> >", align 4
@"\01?Tex2DMS@@3V?$Texture2DMS@V?$vector@M$01@@$0A@@@A" = external constant %"class.Texture2DMS<vector<float, 2>, 0>", align 4
@"\01?Tex2DMSArray@@3V?$Texture2DMSArray@V?$vector@M$01@@$0A@@@A" = external constant %"class.Texture2DMSArray<vector<float, 2>, 0>", align 4

define void @main() {
  %Tex2DMSArray_texture_2darrayMS = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 6, i32 7, i1 false)
  %Tex2DMS_texture_2dMS = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 5, i32 6, i1 false)
  %Tex3D_texture_3d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 4, i32 5, i1 false)
  %Tex2DArray_texture_2darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 4, i1 false)
  %Tex2D_texture_2d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 3, i1 false)
  %Tex1DArray_texture_1darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 2, i1 false)
  %Tex1D_texture_1d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 1, i1 false)
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %TextureLoad = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex1D_texture_1d, i32 %2, i32 %1, i32 undef, i32 undef, i32 1, i32 undef, i32 undef)
  %5 = extractvalue %dx.types.ResRet.f32 %TextureLoad, 0
  %6 = extractvalue %dx.types.ResRet.f32 %TextureLoad, 1
  %TextureLoad1 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex1DArray_texture_1darray, i32 %3, i32 %1, i32 %2, i32 undef, i32 2, i32 undef, i32 undef)
  %7 = extractvalue %dx.types.ResRet.f32 %TextureLoad1, 0
  %8 = extractvalue %dx.types.ResRet.f32 %TextureLoad1, 1
  %.i0 = fadd fast float %7, %5
  %.i1 = fadd fast float %8, %6
  %TextureLoad2 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2D_texture_2d, i32 %3, i32 %1, i32 %2, i32 undef, i32 3, i32 4, i32 undef)
  %9 = extractvalue %dx.types.ResRet.f32 %TextureLoad2, 0
  %10 = extractvalue %dx.types.ResRet.f32 %TextureLoad2, 1
  %.i07 = fadd fast float %.i0, %9
  %.i18 = fadd fast float %.i1, %10
  %TextureLoad3 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DArray_texture_2darray, i32 %4, i32 %1, i32 %2, i32 %3, i32 -4, i32 -3, i32 undef)
  %11 = extractvalue %dx.types.ResRet.f32 %TextureLoad3, 0
  %12 = extractvalue %dx.types.ResRet.f32 %TextureLoad3, 1
  %.i09 = fadd fast float %.i07, %11
  %.i110 = fadd fast float %.i18, %12
  %TextureLoad4 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex3D_texture_3d, i32 %4, i32 %1, i32 %2, i32 %3, i32 -4, i32 2, i32 3)
  %13 = extractvalue %dx.types.ResRet.f32 %TextureLoad4, 0
  %14 = extractvalue %dx.types.ResRet.f32 %TextureLoad4, 1
  %.i011 = fadd fast float %.i09, %13
  %.i112 = fadd fast float %.i110, %14
  %TextureLoad5 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DMS_texture_2dMS, i32 %3, i32 %1, i32 %2, i32 undef, i32 2, i32 3, i32 undef)
  %15 = extractvalue %dx.types.ResRet.f32 %TextureLoad5, 0
  %16 = extractvalue %dx.types.ResRet.f32 %TextureLoad5, 1
  %.i013 = fadd fast float %.i011, %15
  %.i114 = fadd fast float %.i112, %16
  %TextureLoad6 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DMSArray_texture_2darrayMS, i32 %4, i32 %1, i32 %2, i32 %3, i32 4, i32 5, i32 undef)
  %17 = extractvalue %dx.types.ResRet.f32 %TextureLoad6, 0
  %18 = extractvalue %dx.types.ResRet.f32 %TextureLoad6, 1
  %.i015 = fadd fast float %.i013, %17
  %.i116 = fadd fast float %.i114, %18
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i015)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i116)
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
!dx.typeAnnotations = !{!14, !22}
!dx.viewIdState = !{!26}
!dx.entryPoints = !{!27}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"Tex1D", i32 0, i32 1, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<vector<float, 2> >"* undef, !"Tex1DArray", i32 0, i32 2, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"Tex2D", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<vector<float, 2> >"* undef, !"Tex2DArray", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"Tex3D", i32 0, i32 5, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.Texture2DMS<vector<float, 2>, 0>"* undef, !"Tex2DMS", i32 0, i32 6, i32 1, i32 3, i32 0, !7}
!13 = !{i32 6, %"class.Texture2DMSArray<vector<float, 2>, 0>"* undef, !"Tex2DMSArray", i32 0, i32 7, i32 1, i32 8, i32 0, !7}
!14 = !{i32 0, %"class.Texture1D<vector<float, 2> >" undef, !15, %"class.Texture1D<vector<float, 2> >::mips_type" undef, !18, %"class.Texture1DArray<vector<float, 2> >" undef, !15, %"class.Texture1DArray<vector<float, 2> >::mips_type" undef, !18, %"class.Texture2D<vector<float, 2> >" undef, !15, %"class.Texture2D<vector<float, 2> >::mips_type" undef, !18, %"class.Texture2DArray<vector<float, 2> >" undef, !15, %"class.Texture2DArray<vector<float, 2> >::mips_type" undef, !18, %"class.Texture3D<vector<float, 2> >" undef, !15, %"class.Texture3D<vector<float, 2> >::mips_type" undef, !18, %"class.Texture2DMS<vector<float, 2>, 0>" undef, !20, %"class.Texture2DMS<vector<float, 2>, 0>::sample_type" undef, !18, %"class.Texture2DMSArray<vector<float, 2>, 0>" undef, !20, %"class.Texture2DMSArray<vector<float, 2>, 0>::sample_type" undef, !18}
!15 = !{i32 20, !16, !17}
!16 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!17 = !{i32 6, !"mips", i32 3, i32 16}
!18 = !{i32 4, !19}
!19 = !{i32 6, !"handle", i32 3, i32 0, i32 7, i32 5}
!20 = !{i32 20, !16, !21}
!21 = !{i32 6, !"sample", i32 3, i32 16}
!22 = !{i32 1, void ()* @main, !23}
!23 = !{!24}
!24 = !{i32 0, !25, !25}
!25 = !{}
!26 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!27 = !{void ()* @main, !"main", !28, !4, null}
!28 = !{!29, !32, null}
!29 = !{!30}
!30 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !31, i8 1, i32 1, i8 4, i32 0, i8 0, null}
!31 = !{i32 0}
!32 = !{!33}
!33 = !{i32 0, !"SV_Target", i8 9, i8 16, !31, i8 0, i32 1, i8 2, i32 0, i8 0, null}
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
OpName %8 "Tex1D"
OpName %11 "Tex1DArray"
OpName %14 "Tex2D"
OpName %17 "Tex2DArray"
OpName %20 "Tex3D"
OpName %23 "Tex2DMS"
OpName %26 "Tex2DMSArray"
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
