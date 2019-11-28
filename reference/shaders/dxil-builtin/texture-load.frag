#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 1) uniform texture1D Tex1D;
layout(set = 0, binding = 2) uniform texture1DArray Tex1DArray;
layout(set = 0, binding = 3) uniform texture2D Tex2D;
layout(set = 0, binding = 4) uniform texture2DArray Tex2DArray;
layout(set = 0, binding = 5) uniform texture3D Tex3D;
layout(set = 0, binding = 6) uniform texture2DMS Tex2DMS;
layout(set = 0, binding = 7) uniform texture2DMSArray Tex2DMSArray;
layout(set = 0, binding = 1) uniform readonly image1D RWTex1D;
layout(set = 0, binding = 2) uniform readonly image1DArray RWTex1DArray;
layout(set = 0, binding = 3) uniform readonly image2D RWTex2D;
layout(set = 0, binding = 4) uniform readonly image2DArray RWTex2DArray;
layout(set = 0, binding = 5) uniform readonly image3D RWTex3D;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _77 = texelFetch(Tex1D, int(TEXCOORD.x), int(TEXCOORD.y));
    vec4 _80 = texelFetch(Tex1DArray, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _87 = texelFetch(Tex2D, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(TEXCOORD.z));
    vec4 _93 = texelFetch(Tex2DArray, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _100 = texelFetch(Tex3D, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), int(TEXCOORD.w));
    vec4 _106 = texelFetch(Tex2DMS, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), TEXCOORD.z);
    vec4 _112 = texelFetch(Tex2DMSArray, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), TEXCOORD.w);
    vec4 _118 = imageLoad(RWTex1D, int(TEXCOORD.x));
    vec4 _123 = imageLoad(RWTex1DArray, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _129 = imageLoad(RWTex2D, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    vec4 _135 = imageLoad(RWTex2DArray, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    vec4 _141 = imageLoad(RWTex3D, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    SV_Target.x = ((((((((((_80.x + _77.x) + _87.x) + _93.x) + _100.x) + _106.x) + _112.x) + _118.x) + _123.x) + _129.x) + _135.x) + _141.x;
    SV_Target.y = ((((((((((_80.y + _77.y) + _87.y) + _93.y) + _100.y) + _106.y) + _112.y) + _118.y) + _123.y) + _129.y) + _135.y) + _141.y;
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
%"class.RWTexture1D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture1DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture3D<vector<float, 2> >" = type { <2 x float> }
%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }

@"\01?Tex1D@@3V?$Texture1D@V?$vector@M$01@@@@A" = external constant %"class.Texture1D<vector<float, 2> >", align 4
@"\01?Tex1DArray@@3V?$Texture1DArray@V?$vector@M$01@@@@A" = external constant %"class.Texture1DArray<vector<float, 2> >", align 4
@"\01?Tex2D@@3V?$Texture2D@V?$vector@M$01@@@@A" = external constant %"class.Texture2D<vector<float, 2> >", align 4
@"\01?Tex2DArray@@3V?$Texture2DArray@V?$vector@M$01@@@@A" = external constant %"class.Texture2DArray<vector<float, 2> >", align 4
@"\01?Tex3D@@3V?$Texture3D@V?$vector@M$01@@@@A" = external constant %"class.Texture3D<vector<float, 2> >", align 4
@"\01?Tex2DMS@@3V?$Texture2DMS@V?$vector@M$01@@$0A@@@A" = external constant %"class.Texture2DMS<vector<float, 2>, 0>", align 4
@"\01?Tex2DMSArray@@3V?$Texture2DMSArray@V?$vector@M$01@@$0A@@@A" = external constant %"class.Texture2DMSArray<vector<float, 2>, 0>", align 4
@"\01?RWTex1D@@3V?$RWTexture1D@V?$vector@M$01@@@@A" = external constant %"class.RWTexture1D<vector<float, 2> >", align 4
@"\01?RWTex1DArray@@3V?$RWTexture1DArray@V?$vector@M$01@@@@A" = external constant %"class.RWTexture1DArray<vector<float, 2> >", align 4
@"\01?RWTex2D@@3V?$RWTexture2D@V?$vector@M$01@@@@A" = external constant %"class.RWTexture2D<vector<float, 2> >", align 4
@"\01?RWTex2DArray@@3V?$RWTexture2DArray@V?$vector@M$01@@@@A" = external constant %"class.RWTexture2DArray<vector<float, 2> >", align 4
@"\01?RWTex3D@@3V?$RWTexture3D@V?$vector@M$01@@@@A" = external constant %"class.RWTexture3D<vector<float, 2> >", align 4

define void @main() {
  %RWTex3D_UAV_3d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 4, i32 5, i1 false)
  %RWTex2DArray_UAV_2darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 4, i1 false)
  %RWTex2D_UAV_2d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 3, i1 false)
  %RWTex1DArray_UAV_1darray = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 2, i1 false)
  %RWTex1D_UAV_1d = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 1, i1 false)
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
  %TextureLoad2 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex1D_texture_1d, i32 %2, i32 %1, i32 undef, i32 undef, i32 undef, i32 undef, i32 undef)
  %5 = extractvalue %dx.types.ResRet.f32 %TextureLoad2, 0
  %6 = extractvalue %dx.types.ResRet.f32 %TextureLoad2, 1
  %TextureLoad6 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex1DArray_texture_1darray, i32 %3, i32 %1, i32 %2, i32 undef, i32 undef, i32 undef, i32 undef)
  %7 = extractvalue %dx.types.ResRet.f32 %TextureLoad6, 0
  %8 = extractvalue %dx.types.ResRet.f32 %TextureLoad6, 1
  %.i0 = fadd fast float %7, %5
  %.i1 = fadd fast float %8, %6
  %TextureLoad5 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2D_texture_2d, i32 %3, i32 %1, i32 %2, i32 undef, i32 undef, i32 undef, i32 undef)
  %9 = extractvalue %dx.types.ResRet.f32 %TextureLoad5, 0
  %10 = extractvalue %dx.types.ResRet.f32 %TextureLoad5, 1
  %.i012 = fadd fast float %.i0, %9
  %.i113 = fadd fast float %.i1, %10
  %TextureLoad8 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DArray_texture_2darray, i32 %4, i32 %1, i32 %2, i32 %3, i32 undef, i32 undef, i32 undef)
  %11 = extractvalue %dx.types.ResRet.f32 %TextureLoad8, 0
  %12 = extractvalue %dx.types.ResRet.f32 %TextureLoad8, 1
  %.i014 = fadd fast float %.i012, %11
  %.i115 = fadd fast float %.i113, %12
  %TextureLoad7 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex3D_texture_3d, i32 %4, i32 %1, i32 %2, i32 %3, i32 undef, i32 undef, i32 undef)
  %13 = extractvalue %dx.types.ResRet.f32 %TextureLoad7, 0
  %14 = extractvalue %dx.types.ResRet.f32 %TextureLoad7, 1
  %.i016 = fadd fast float %.i014, %13
  %.i117 = fadd fast float %.i115, %14
  %TextureLoad9 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DMS_texture_2dMS, i32 %3, i32 %1, i32 %2, i32 undef, i32 undef, i32 undef, i32 undef)
  %15 = extractvalue %dx.types.ResRet.f32 %TextureLoad9, 0
  %16 = extractvalue %dx.types.ResRet.f32 %TextureLoad9, 1
  %.i018 = fadd fast float %.i016, %15
  %.i119 = fadd fast float %.i117, %16
  %TextureLoad10 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %Tex2DMSArray_texture_2darrayMS, i32 %4, i32 %1, i32 %2, i32 %3, i32 undef, i32 undef, i32 undef)
  %17 = extractvalue %dx.types.ResRet.f32 %TextureLoad10, 0
  %18 = extractvalue %dx.types.ResRet.f32 %TextureLoad10, 1
  %.i020 = fadd fast float %.i018, %17
  %.i121 = fadd fast float %.i119, %18
  %TextureLoad11 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %RWTex1D_UAV_1d, i32 undef, i32 %1, i32 undef, i32 undef, i32 undef, i32 undef, i32 undef)
  %19 = extractvalue %dx.types.ResRet.f32 %TextureLoad11, 0
  %20 = extractvalue %dx.types.ResRet.f32 %TextureLoad11, 1
  %.i022 = fadd fast float %.i020, %19
  %.i123 = fadd fast float %.i121, %20
  %TextureLoad1 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %RWTex1DArray_UAV_1darray, i32 undef, i32 %1, i32 %2, i32 undef, i32 undef, i32 undef, i32 undef)
  %21 = extractvalue %dx.types.ResRet.f32 %TextureLoad1, 0
  %22 = extractvalue %dx.types.ResRet.f32 %TextureLoad1, 1
  %.i024 = fadd fast float %.i022, %21
  %.i125 = fadd fast float %.i123, %22
  %TextureLoad = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %RWTex2D_UAV_2d, i32 undef, i32 %1, i32 %2, i32 undef, i32 undef, i32 undef, i32 undef)
  %23 = extractvalue %dx.types.ResRet.f32 %TextureLoad, 0
  %24 = extractvalue %dx.types.ResRet.f32 %TextureLoad, 1
  %.i026 = fadd fast float %.i024, %23
  %.i127 = fadd fast float %.i125, %24
  %TextureLoad4 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %RWTex2DArray_UAV_2darray, i32 undef, i32 %1, i32 %2, i32 %3, i32 undef, i32 undef, i32 undef)
  %25 = extractvalue %dx.types.ResRet.f32 %TextureLoad4, 0
  %26 = extractvalue %dx.types.ResRet.f32 %TextureLoad4, 1
  %.i028 = fadd fast float %.i026, %25
  %.i129 = fadd fast float %.i127, %26
  %TextureLoad3 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %RWTex3D_UAV_3d, i32 undef, i32 %1, i32 %2, i32 %3, i32 undef, i32 undef, i32 undef)
  %27 = extractvalue %dx.types.ResRet.f32 %TextureLoad3, 0
  %28 = extractvalue %dx.types.ResRet.f32 %TextureLoad3, 1
  %.i030 = fadd fast float %.i028, %27
  %.i131 = fadd fast float %.i129, %28
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %.i030)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %.i131)
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
!dx.typeAnnotations = !{!20, !29}
!dx.viewIdState = !{!33}
!dx.entryPoints = !{!34}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, !14, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13}
!6 = !{i32 0, %"class.Texture1D<vector<float, 2> >"* undef, !"Tex1D", i32 0, i32 1, i32 1, i32 1, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture1DArray<vector<float, 2> >"* undef, !"Tex1DArray", i32 0, i32 2, i32 1, i32 6, i32 0, !7}
!9 = !{i32 2, %"class.Texture2D<vector<float, 2> >"* undef, !"Tex2D", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!10 = !{i32 3, %"class.Texture2DArray<vector<float, 2> >"* undef, !"Tex2DArray", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!11 = !{i32 4, %"class.Texture3D<vector<float, 2> >"* undef, !"Tex3D", i32 0, i32 5, i32 1, i32 4, i32 0, !7}
!12 = !{i32 5, %"class.Texture2DMS<vector<float, 2>, 0>"* undef, !"Tex2DMS", i32 0, i32 6, i32 1, i32 3, i32 0, !7}
!13 = !{i32 6, %"class.Texture2DMSArray<vector<float, 2>, 0>"* undef, !"Tex2DMSArray", i32 0, i32 7, i32 1, i32 8, i32 0, !7}
!14 = !{!15, !16, !17, !18, !19}
!15 = !{i32 0, %"class.RWTexture1D<vector<float, 2> >"* undef, !"RWTex1D", i32 0, i32 1, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!16 = !{i32 1, %"class.RWTexture1DArray<vector<float, 2> >"* undef, !"RWTex1DArray", i32 0, i32 2, i32 1, i32 6, i1 false, i1 false, i1 false, !7}
!17 = !{i32 2, %"class.RWTexture2D<vector<float, 2> >"* undef, !"RWTex2D", i32 0, i32 3, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!18 = !{i32 3, %"class.RWTexture2DArray<vector<float, 2> >"* undef, !"RWTex2DArray", i32 0, i32 4, i32 1, i32 7, i1 false, i1 false, i1 false, !7}
!19 = !{i32 4, %"class.RWTexture3D<vector<float, 2> >"* undef, !"RWTex3D", i32 0, i32 5, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
!20 = !{i32 0, %"class.Texture1D<vector<float, 2> >" undef, !21, %"class.Texture1D<vector<float, 2> >::mips_type" undef, !24, %"class.Texture1DArray<vector<float, 2> >" undef, !21, %"class.Texture1DArray<vector<float, 2> >::mips_type" undef, !24, %"class.Texture2D<vector<float, 2> >" undef, !21, %"class.Texture2D<vector<float, 2> >::mips_type" undef, !24, %"class.Texture2DArray<vector<float, 2> >" undef, !21, %"class.Texture2DArray<vector<float, 2> >::mips_type" undef, !24, %"class.Texture3D<vector<float, 2> >" undef, !21, %"class.Texture3D<vector<float, 2> >::mips_type" undef, !24, %"class.Texture2DMS<vector<float, 2>, 0>" undef, !26, %"class.Texture2DMS<vector<float, 2>, 0>::sample_type" undef, !24, %"class.Texture2DMSArray<vector<float, 2>, 0>" undef, !26, %"class.Texture2DMSArray<vector<float, 2>, 0>::sample_type" undef, !24, %"class.RWTexture1D<vector<float, 2> >" undef, !28, %"class.RWTexture1DArray<vector<float, 2> >" undef, !28, %"class.RWTexture2D<vector<float, 2> >" undef, !28, %"class.RWTexture2DArray<vector<float, 2> >" undef, !28, %"class.RWTexture3D<vector<float, 2> >" undef, !28}
!21 = !{i32 20, !22, !23}
!22 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!23 = !{i32 6, !"mips", i32 3, i32 16}
!24 = !{i32 4, !25}
!25 = !{i32 6, !"handle", i32 3, i32 0, i32 7, i32 5}
!26 = !{i32 20, !22, !27}
!27 = !{i32 6, !"sample", i32 3, i32 16}
!28 = !{i32 8, !22}
!29 = !{i32 1, void ()* @main, !30}
!30 = !{!31}
!31 = !{i32 0, !32, !32}
!32 = !{}
!33 = !{[6 x i32] [i32 4, i32 2, i32 3, i32 3, i32 3, i32 3]}
!34 = !{void ()* @main, !"main", !35, !4, !41}
!35 = !{!36, !39, null}
!36 = !{!37}
!37 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !38, i8 1, i32 1, i8 4, i32 0, i8 0, null}
!38 = !{i32 0}
!39 = !{!40}
!40 = !{i32 0, !"SV_Target", i8 9, i8 16, !38, i8 0, i32 1, i8 2, i32 0, i8 0, null}
!41 = !{i32 0, i64 8192}
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
OpName %8 "Tex1D"
OpName %11 "Tex1DArray"
OpName %14 "Tex2D"
OpName %17 "Tex2DArray"
OpName %20 "Tex3D"
OpName %23 "Tex2DMS"
OpName %26 "Tex2DMSArray"
OpName %29 "RWTex1D"
OpName %32 "RWTex1DArray"
OpName %35 "RWTex2D"
OpName %38 "RWTex2DArray"
OpName %41 "RWTex3D"
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
