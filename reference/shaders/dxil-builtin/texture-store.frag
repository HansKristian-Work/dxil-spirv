#version 460

layout(set = 0, binding = 1) uniform writeonly image1D _8;
layout(set = 0, binding = 2) uniform coherent writeonly image1DArray _11;
layout(set = 0, binding = 3) uniform writeonly image2D _14;
layout(set = 0, binding = 4) uniform coherent writeonly image2DArray _17;
layout(set = 0, binding = 5) uniform writeonly image3D _20;

layout(location = 0) in vec3 TEXCOORD;

void main()
{
    uint _40 = uint(int(TEXCOORD.x));
    imageStore(_8, int(_40), vec4(1.0, 2.0, 1.0, 1.0));
    uint _45 = uint(int(TEXCOORD.y));
    imageStore(_11, ivec2(uvec2(_40, _45)), vec4(3.0, 4.0, 3.0, 3.0));
    imageStore(_14, ivec2(uvec2(_40, _45)), vec4(5.0, 6.0, 5.0, 5.0));
    uint _55 = uint(int(TEXCOORD.z));
    imageStore(_17, ivec3(uvec3(_40, _45, _55)), vec4(7.0, 8.0, 7.0, 7.0));
    imageStore(_20, ivec3(uvec3(_40, _45, _55)), vec4(9.0, -9.0, 9.0, 9.0));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
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
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %9 = fptosi float %6 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %5, i32 %9, i32 undef, i32 undef, float 1.000000e+00, float 2.000000e+00, float 1.000000e+00, float 1.000000e+00, i8 15)
  %10 = fptosi float %7 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %4, i32 %9, i32 %10, i32 undef, float 3.000000e+00, float 4.000000e+00, float 3.000000e+00, float 3.000000e+00, i8 15)
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %3, i32 %9, i32 %10, i32 undef, float 5.000000e+00, float 6.000000e+00, float 5.000000e+00, float 5.000000e+00, i8 15)
  %11 = fptosi float %8 to i32
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %2, i32 %9, i32 %10, i32 %11, float 7.000000e+00, float 8.000000e+00, float 7.000000e+00, float 7.000000e+00, i8 15)
  call void @dx.op.textureStore.f32(i32 67, %dx.types.Handle %1, i32 %9, i32 %10, i32 %11, float 9.000000e+00, float -9.000000e+00, float 9.000000e+00, float 9.000000e+00, i8 15)
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
!dx.viewIdState = !{!12}
!dx.entryPoints = !{!13}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8, !9, !10, !11}
!6 = !{i32 0, %"class.RWTexture1D<vector<float, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.RWTexture1DArray<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 6, i1 true, i1 false, i1 false, !7}
!9 = !{i32 2, %"class.RWTexture2D<vector<float, 2> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!10 = !{i32 3, %"class.RWTexture2DArray<vector<float, 2> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i1 true, i1 false, i1 false, !7}
!11 = !{i32 4, %"class.RWTexture3D<vector<float, 2> >"* undef, !"", i32 0, i32 5, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
!12 = !{[2 x i32] [i32 3, i32 0]}
!13 = !{void ()* @main, !"main", !14, !4, null}
!14 = !{!15, null, null}
!15 = !{!16}
!16 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !17, i8 2, i32 1, i8 3, i32 0, i8 0, !18}
!17 = !{i32 0}
!18 = !{i32 3, i32 7}
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
