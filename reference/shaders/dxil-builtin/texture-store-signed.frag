#version 460

layout(set = 0, binding = 1) uniform writeonly iimage1D _8;
layout(set = 0, binding = 2) uniform coherent writeonly iimage1DArray _11;
layout(set = 0, binding = 3) uniform writeonly iimage2D _14;
layout(set = 0, binding = 4) uniform coherent writeonly iimage2DArray _17;
layout(set = 0, binding = 5) uniform writeonly iimage3D _20;

layout(location = 0) in vec3 TEXCOORD;

void main()
{
    uint _41 = uint(int(TEXCOORD.x));
    imageStore(_8, int(_41), ivec4(uvec4(1u, 2u, 1u, 1u)));
    uint _46 = uint(int(TEXCOORD.y));
    imageStore(_11, ivec2(uvec2(_41, _46)), ivec4(uvec4(3u, 4u, 3u, 3u)));
    imageStore(_14, ivec2(uvec2(_41, _46)), ivec4(uvec4(5u, 6u, 5u, 5u)));
    uint _58 = uint(int(TEXCOORD.z));
    imageStore(_17, ivec3(uvec3(_41, _46, _58)), ivec4(uvec4(7u, 8u, 7u, 7u)));
    imageStore(_20, ivec3(uvec3(_41, _46, _58)), ivec4(uvec4(9u, 4294967287u, 9u, 9u)));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%"class.RWTexture1D<vector<int, 2> >" = type { <2 x i32> }
%"class.RWTexture1DArray<vector<int, 2> >" = type { <2 x i32> }
%"class.RWTexture2D<vector<int, 2> >" = type { <2 x i32> }
%"class.RWTexture2DArray<vector<int, 2> >" = type { <2 x i32> }
%"class.RWTexture3D<vector<int, 2> >" = type { <2 x i32> }

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
  call void @dx.op.textureStore.i32(i32 67, %dx.types.Handle %5, i32 %9, i32 undef, i32 undef, i32 1, i32 2, i32 1, i32 1, i8 15)
  %10 = fptosi float %7 to i32
  call void @dx.op.textureStore.i32(i32 67, %dx.types.Handle %4, i32 %9, i32 %10, i32 undef, i32 3, i32 4, i32 3, i32 3, i8 15)
  call void @dx.op.textureStore.i32(i32 67, %dx.types.Handle %3, i32 %9, i32 %10, i32 undef, i32 5, i32 6, i32 5, i32 5, i8 15)
  %11 = fptosi float %8 to i32
  call void @dx.op.textureStore.i32(i32 67, %dx.types.Handle %2, i32 %9, i32 %10, i32 %11, i32 7, i32 8, i32 7, i32 7, i8 15)
  call void @dx.op.textureStore.i32(i32 67, %dx.types.Handle %1, i32 %9, i32 %10, i32 %11, i32 9, i32 -9, i32 9, i32 9, i8 15)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.textureStore.i32(i32, %dx.types.Handle, i32, i32, i32, i32, i32, i32, i32, i8) #1

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
!6 = !{i32 0, %"class.RWTexture1D<vector<int, 2> >"* undef, !"", i32 0, i32 1, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 4}
!8 = !{i32 1, %"class.RWTexture1DArray<vector<int, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 6, i1 true, i1 false, i1 false, !7}
!9 = !{i32 2, %"class.RWTexture2D<vector<int, 2> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!10 = !{i32 3, %"class.RWTexture2DArray<vector<int, 2> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i1 true, i1 false, i1 false, !7}
!11 = !{i32 4, %"class.RWTexture3D<vector<int, 2> >"* undef, !"", i32 0, i32 5, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
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
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
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
OpDecorate %24 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
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
%21 = OpTypeFloat 32
%22 = OpTypeVector %21 3
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%30 = OpTypePointer Input %21
%32 = OpTypeInt 32 0
%33 = OpConstant %32 0
%36 = OpConstant %32 1
%39 = OpConstant %32 2
%42 = OpTypeVector %32 4
%44 = OpTypeVector %5 4
%47 = OpConstant %32 3
%48 = OpConstant %32 4
%49 = OpTypeVector %32 2
%53 = OpConstant %32 5
%54 = OpConstant %32 6
%59 = OpConstant %32 7
%60 = OpConstant %32 8
%61 = OpTypeVector %32 3
%65 = OpConstant %32 9
%66 = OpConstant %32 4294967287
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%25 = OpLoad %18 %20
%26 = OpLoad %15 %17
%27 = OpLoad %12 %14
%28 = OpLoad %9 %11
%29 = OpLoad %6 %8
%31 = OpAccessChain %30 %24 %33
%34 = OpLoad %21 %31
%35 = OpAccessChain %30 %24 %36
%37 = OpLoad %21 %35
%38 = OpAccessChain %30 %24 %39
%40 = OpLoad %21 %38
%41 = OpConvertFToS %32 %34
%43 = OpCompositeConstruct %42 %36 %39 %36 %36
%45 = OpBitcast %44 %43
OpImageWrite %29 %41 %45
%46 = OpConvertFToS %32 %37
%50 = OpCompositeConstruct %49 %41 %46
%51 = OpCompositeConstruct %42 %47 %48 %47 %47
%52 = OpBitcast %44 %51
OpImageWrite %28 %50 %52
%55 = OpCompositeConstruct %49 %41 %46
%56 = OpCompositeConstruct %42 %53 %54 %53 %53
%57 = OpBitcast %44 %56
OpImageWrite %27 %55 %57
%58 = OpConvertFToS %32 %40
%62 = OpCompositeConstruct %61 %41 %46 %58
%63 = OpCompositeConstruct %42 %59 %60 %59 %59
%64 = OpBitcast %44 %63
OpImageWrite %26 %62 %64
%67 = OpCompositeConstruct %61 %41 %46 %58
%68 = OpCompositeConstruct %42 %65 %66 %65 %65
%69 = OpBitcast %44 %68
OpImageWrite %25 %67 %69
OpReturn
OpFunctionEnd
#endif
