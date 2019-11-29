#version 460

layout(set = 0, binding = 1) uniform writeonly image1D RWTex1D;
layout(set = 0, binding = 2) uniform coherent writeonly image1DArray RWTex1DArray;
layout(set = 0, binding = 3) uniform writeonly image2D RWTex2D;
layout(set = 0, binding = 4) uniform coherent writeonly image2DArray RWTex2DArray;
layout(set = 0, binding = 5) uniform writeonly image3D RWTex3D;

layout(location = 0) in vec3 TEXCOORD;

void main()
{
    uint _40 = uint(int(TEXCOORD.x));
    imageStore(RWTex1D, int(_40), vec4(1.0, 2.0, 1.0, 1.0));
    uint _45 = uint(int(TEXCOORD.y));
    imageStore(RWTex1DArray, ivec2(uvec2(_40, _45)), vec4(3.0, 4.0, 3.0, 3.0));
    imageStore(RWTex2D, ivec2(uvec2(_40, _45)), vec4(5.0, 6.0, 5.0, 5.0));
    uint _55 = uint(int(TEXCOORD.z));
    imageStore(RWTex2DArray, ivec3(uvec3(_40, _45, _55)), vec4(7.0, 8.0, 7.0, 7.0));
    imageStore(RWTex3D, ivec3(uvec3(_40, _45, _55)), vec4(9.0, -9.0, 9.0, 9.0));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%"class.RWTexture1D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture1DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2D<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture2DArray<vector<float, 2> >" = type { <2 x float> }
%"class.RWTexture3D<vector<float, 2> >" = type { <2 x float> }
%dx.types.Handle = type { i8* }

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
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = fptosi float %1 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %RWTex1D_UAV_1d, i32 %4, i32 undef, i32 undef, float 1.000000e+00, float 2.000000e+00, float 1.000000e+00, float 1.000000e+00, i8 15)
  %5 = fptosi float %2 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %RWTex1DArray_UAV_1darray, i32 %4, i32 %5, i32 undef, float 3.000000e+00, float 4.000000e+00, float 3.000000e+00, float 3.000000e+00, i8 15)
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %RWTex2D_UAV_2d, i32 %4, i32 %5, i32 undef, float 5.000000e+00, float 6.000000e+00, float 5.000000e+00, float 5.000000e+00, i8 15)
  %6 = fptosi float %3 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %RWTex2DArray_UAV_2darray, i32 %4, i32 %5, i32 %6, float 7.000000e+00, float 8.000000e+00, float 7.000000e+00, float 7.000000e+00, i8 15)
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %RWTex3D_UAV_3d, i32 %4, i32 %5, i32 %6, float 9.000000e+00, float -9.000000e+00, float 9.000000e+00, float 9.000000e+00, i8 15)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.textureStore.f32(i32, %dx.types.Handle, i32, i32, i32, float, float, float, float, i8) #1

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
!dx.typeAnnotations = !{!12, !15}
!dx.viewIdState = !{!19}
!dx.entryPoints = !{!20}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8, !9, !10, !11}
!6 = !{i32 0, %"class.RWTexture1D<vector<float, 2> >"* undef, !"RWTex1D", i32 0, i32 1, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.RWTexture1DArray<vector<float, 2> >"* undef, !"RWTex1DArray", i32 0, i32 2, i32 1, i32 6, i1 true, i1 false, i1 false, !7}
!9 = !{i32 2, %"class.RWTexture2D<vector<float, 2> >"* undef, !"RWTex2D", i32 0, i32 3, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!10 = !{i32 3, %"class.RWTexture2DArray<vector<float, 2> >"* undef, !"RWTex2DArray", i32 0, i32 4, i32 1, i32 7, i1 true, i1 false, i1 false, !7}
!11 = !{i32 4, %"class.RWTexture3D<vector<float, 2> >"* undef, !"RWTex3D", i32 0, i32 5, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
!12 = !{i32 0, %"class.RWTexture1D<vector<float, 2> >" undef, !13, %"class.RWTexture1DArray<vector<float, 2> >" undef, !13, %"class.RWTexture2D<vector<float, 2> >" undef, !13, %"class.RWTexture2DArray<vector<float, 2> >" undef, !13, %"class.RWTexture3D<vector<float, 2> >" undef, !13}
!13 = !{i32 8, !14}
!14 = !{i32 6, !"h", i32 3, i32 0, i32 7, i32 9}
!15 = !{i32 1, void ()* @main, !16}
!16 = !{!17}
!17 = !{i32 0, !18, !18}
!18 = !{}
!19 = !{[2 x i32] [i32 3, i32 0]}
!20 = !{void ()* @main, !"main", !21, !4, null}
!21 = !{!22, null, null}
!22 = !{!23}
!23 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !24, i8 2, i32 1, i8 3, i32 0, i8 0, null}
!24 = !{i32 0}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 67
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "RWTex1D"
OpName %11 "RWTex1DArray"
OpName %14 "RWTex2D"
OpName %17 "RWTex2DArray"
OpName %20 "RWTex3D"
OpName %23 "TEXCOORD"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %11 Coherent
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %17 Coherent
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 2 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 2 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 2 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 2 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 3
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%30 = OpTypePointer Input %5
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%38 = OpConstant %31 2
%41 = OpConstant %5 1
%42 = OpConstant %5 2
%44 = OpTypeVector %5 4
%46 = OpConstant %5 3
%47 = OpConstant %5 4
%49 = OpTypeVector %31 2
%51 = OpConstant %5 5
%52 = OpConstant %5 6
%56 = OpConstant %5 7
%57 = OpConstant %5 8
%59 = OpTypeVector %31 3
%61 = OpConstant %5 9
%62 = OpConstant %5 -9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%24 = OpLoad %18 %20
%25 = OpLoad %15 %17
%26 = OpLoad %12 %14
%27 = OpLoad %9 %11
%28 = OpLoad %6 %8
%29 = OpInBoundsAccessChain %30 %23 %32
%33 = OpLoad %5 %29
%34 = OpInBoundsAccessChain %30 %23 %35
%36 = OpLoad %5 %34
%37 = OpInBoundsAccessChain %30 %23 %38
%39 = OpLoad %5 %37
%40 = OpConvertFToS %31 %33
%43 = OpCompositeConstruct %44 %41 %42 %41 %41
OpImageWrite %28 %40 %43
%45 = OpConvertFToS %31 %36
%48 = OpCompositeConstruct %49 %40 %45
%50 = OpCompositeConstruct %44 %46 %47 %46 %46
OpImageWrite %27 %48 %50
%53 = OpCompositeConstruct %49 %40 %45
%54 = OpCompositeConstruct %44 %51 %52 %51 %51
OpImageWrite %26 %53 %54
%55 = OpConvertFToS %31 %39
%58 = OpCompositeConstruct %59 %40 %45 %55
%60 = OpCompositeConstruct %44 %56 %57 %56 %56
OpImageWrite %25 %58 %60
%63 = OpCompositeConstruct %59 %40 %45 %55
%64 = OpCompositeConstruct %44 %61 %62 %61 %61
OpImageWrite %24 %63 %64
OpReturn
OpFunctionEnd
#endif
