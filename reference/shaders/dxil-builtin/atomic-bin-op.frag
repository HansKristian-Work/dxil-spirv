#version 460

layout(set = 0, binding = 0) uniform uimage1D _8;
layout(set = 0, binding = 1) uniform uimage1DArray _11;
layout(set = 0, binding = 2) uniform uimage2D _14;
layout(set = 0, binding = 3) uniform uimage2DArray _17;
layout(set = 0, binding = 4) uniform uimage3D _20;
layout(set = 0, binding = 5) uniform uimageBuffer _23;
layout(set = 1, binding = 0) uniform iimage1D _27;
layout(set = 1, binding = 2) uniform iimage2D _30;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _56 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _60 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _64 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _69 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _74 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _78 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _82 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _87 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _94 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    SV_Target = (((((((_60 + _56) + _64) + _69) + _74) + _78) + _82) + uint(_87)) + uint(_94);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%"class.RWTexture1D<unsigned int>" = type { i32 }
%"class.RWTexture1DArray<unsigned int>" = type { i32 }
%"class.RWTexture2D<unsigned int>" = type { i32 }
%"class.RWTexture2DArray<unsigned int>" = type { i32 }
%"class.RWTexture3D<unsigned int>" = type { i32 }
%"class.RWBuffer<unsigned int>" = type { i32 }
%"class.RWTexture1D<int>" = type { i32 }
%"class.RWTexture2D<int>" = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 7, i32 2, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 6, i32 0, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 5, i32 5, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 4, i32 4, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 3, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 2, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 1, i1 false)
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %9 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %10 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %11 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %12 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %8, i32 0, i32 %9, i32 undef, i32 undef, i32 1)
  %13 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %7, i32 1, i32 %9, i32 %10, i32 undef, i32 2)
  %14 = add i32 %13, %12
  %15 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %6, i32 8, i32 %9, i32 %10, i32 undef, i32 3)
  %16 = add i32 %14, %15
  %17 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %5, i32 7, i32 %9, i32 %10, i32 %11, i32 4)
  %18 = add i32 %16, %17
  %19 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %4, i32 6, i32 %9, i32 %10, i32 %11, i32 5)
  %20 = add i32 %18, %19
  %21 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %3, i32 2, i32 %9, i32 undef, i32 undef, i32 6)
  %22 = add i32 %20, %21
  %23 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %3, i32 3, i32 %9, i32 undef, i32 undef, i32 7)
  %24 = add i32 %22, %23
  %25 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %2, i32 4, i32 %9, i32 undef, i32 undef, i32 8)
  %26 = add i32 %24, %25
  %27 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %1, i32 5, i32 %9, i32 %10, i32 undef, i32 9)
  %28 = add i32 %26, %27
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %28)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind
declare i32 @dx.op.atomicBinOp.i32(i32, %dx.types.Handle, i32, i32, i32, i32, i32) #1

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
!dx.viewIdState = !{!16}
!dx.entryPoints = !{!17}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13, !15}
!6 = !{i32 0, %"class.RWTexture1D<unsigned int>"* undef, !"", i32 0, i32 0, i32 1, i32 1, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 5}
!8 = !{i32 1, %"class.RWTexture1DArray<unsigned int>"* undef, !"", i32 0, i32 1, i32 1, i32 6, i1 false, i1 false, i1 false, !7}
!9 = !{i32 2, %"class.RWTexture2D<unsigned int>"* undef, !"", i32 0, i32 2, i32 1, i32 2, i1 false, i1 false, i1 false, !7}
!10 = !{i32 3, %"class.RWTexture2DArray<unsigned int>"* undef, !"", i32 0, i32 3, i32 1, i32 7, i1 false, i1 false, i1 false, !7}
!11 = !{i32 4, %"class.RWTexture3D<unsigned int>"* undef, !"", i32 0, i32 4, i32 1, i32 4, i1 false, i1 false, i1 false, !7}
!12 = !{i32 5, %"class.RWBuffer<unsigned int>"* undef, !"", i32 0, i32 5, i32 1, i32 10, i1 false, i1 false, i1 false, !7}
!13 = !{i32 6, %"class.RWTexture1D<int>"* undef, !"", i32 1, i32 0, i32 1, i32 1, i1 false, i1 false, i1 false, !14}
!14 = !{i32 0, i32 4}
!15 = !{i32 7, %"class.RWTexture2D<int>"* undef, !"", i32 1, i32 2, i32 1, i32 2, i1 false, i1 false, i1 false, !14}
!16 = !{[5 x i32] [i32 3, i32 1, i32 1, i32 1, i32 1]}
!17 = !{void ()* @main, !"main", !18, !4, null}
!18 = !{!19, !23, null}
!19 = !{!20}
!20 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !21, i8 1, i32 1, i8 3, i32 0, i8 0, !22}
!21 = !{i32 0}
!22 = !{i32 3, i32 7}
!23 = !{!24}
!24 = !{i32 0, !"SV_Target", i8 5, i8 16, !21, i8 0, i32 1, i8 1, i32 0, i8 0, !25}
!25 = !{i32 3, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 101
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %33 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %33 "TEXCOORD"
OpName %35 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 5
OpDecorate %27 DescriptorSet 1
OpDecorate %27 Binding 0
OpDecorate %30 DescriptorSet 1
OpDecorate %30 Binding 2
OpDecorate %33 Flat
OpDecorate %33 Location 0
OpDecorate %35 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
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
%21 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeInt 32 1
%25 = OpTypeImage %24 1D 0 0 0 2 Unknown
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeImage %24 2D 0 0 0 2 Unknown
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypeVector %5 3
%32 = OpTypePointer Input %31
%33 = OpVariable %32 Input
%34 = OpTypePointer Output %5
%35 = OpVariable %34 Output
%45 = OpTypePointer Input %5
%46 = OpConstant %5 0
%49 = OpConstant %5 1
%52 = OpConstant %5 2
%55 = OpTypePointer Image %5
%58 = OpTypeVector %5 2
%65 = OpConstant %5 3
%70 = OpConstant %5 4
%75 = OpConstant %5 5
%79 = OpConstant %5 6
%83 = OpConstant %5 7
%86 = OpTypePointer Image %24
%88 = OpConstant %5 8
%95 = OpConstant %5 9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %99
%99 = OpLabel
%36 = OpLoad %28 %30
%37 = OpLoad %25 %27
%38 = OpLoad %21 %23
%39 = OpLoad %18 %20
%40 = OpLoad %15 %17
%41 = OpLoad %12 %14
%42 = OpLoad %9 %11
%43 = OpLoad %6 %8
%44 = OpInBoundsAccessChain %45 %33 %46
%47 = OpLoad %5 %44
%48 = OpInBoundsAccessChain %45 %33 %49
%50 = OpLoad %5 %48
%51 = OpInBoundsAccessChain %45 %33 %52
%53 = OpLoad %5 %51
%54 = OpImageTexelPointer %55 %8 %47 %46
%56 = OpAtomicIAdd %5 %54 %49 %46 %49
%57 = OpCompositeConstruct %58 %47 %50
%59 = OpImageTexelPointer %55 %11 %57 %46
%60 = OpAtomicAnd %5 %59 %49 %46 %52
%61 = OpIAdd %5 %60 %56
%62 = OpCompositeConstruct %58 %47 %50
%63 = OpImageTexelPointer %55 %14 %62 %46
%64 = OpAtomicExchange %5 %63 %49 %46 %65
%66 = OpIAdd %5 %61 %64
%67 = OpCompositeConstruct %31 %47 %50 %53
%68 = OpImageTexelPointer %55 %17 %67 %46
%69 = OpAtomicUMax %5 %68 %49 %46 %70
%71 = OpIAdd %5 %66 %69
%72 = OpCompositeConstruct %31 %47 %50 %53
%73 = OpImageTexelPointer %55 %20 %72 %46
%74 = OpAtomicUMin %5 %73 %49 %46 %75
%76 = OpIAdd %5 %71 %74
%77 = OpImageTexelPointer %55 %23 %47 %46
%78 = OpAtomicOr %5 %77 %49 %46 %79
%80 = OpIAdd %5 %76 %78
%81 = OpImageTexelPointer %55 %23 %47 %46
%82 = OpAtomicXor %5 %81 %49 %46 %83
%84 = OpIAdd %5 %80 %82
%85 = OpImageTexelPointer %86 %27 %47 %46
%89 = OpBitcast %24 %88
%87 = OpAtomicSMin %24 %85 %49 %46 %89
%90 = OpBitcast %5 %87
%91 = OpIAdd %5 %84 %90
%92 = OpCompositeConstruct %58 %47 %50
%93 = OpImageTexelPointer %86 %30 %92 %46
%96 = OpBitcast %24 %95
%94 = OpAtomicSMax %24 %93 %49 %46 %96
%97 = OpBitcast %5 %94
%98 = OpIAdd %5 %91 %97
OpStore %35 %98
OpReturn
OpFunctionEnd
#endif
