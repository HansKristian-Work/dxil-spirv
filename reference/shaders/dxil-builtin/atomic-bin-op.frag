#version 460

layout(set = 0, binding = 0) uniform uimage1D _8;
layout(set = 0, binding = 1) uniform uimage1DArray _11;
layout(set = 0, binding = 2) uniform uimage2D _14;
layout(set = 0, binding = 3) uniform uimage2DArray _17;
layout(set = 0, binding = 4) uniform uimage3D _20;
layout(set = 0, binding = 5) uniform uimageBuffer _23;
layout(set = 1, binding = 0) uniform iimage1D _27;
layout(set = 1, binding = 2) uniform iimage2D _30;
layout(set = 0, binding = 6, r32ui) uniform uimageBuffer _33;
layout(set = 0, binding = 7, r32ui) uniform uimageBuffer _34;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _62 = imageAtomicAdd(_8, int(TEXCOORD.x), 1u);
    uint _66 = imageAtomicAnd(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 2u);
    uint _70 = imageAtomicExchange(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), 3u);
    uint _75 = imageAtomicMax(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 4u);
    uint _80 = imageAtomicMin(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), 5u);
    uint _84 = imageAtomicOr(_23, int(TEXCOORD.x), 6u);
    uint _88 = imageAtomicXor(_23, int(TEXCOORD.x), 7u);
    int _93 = imageAtomicMin(_27, int(TEXCOORD.x), int(8u));
    int _100 = imageAtomicMax(_30, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(9u));
    uint _108 = imageAtomicAdd(_33, int((TEXCOORD.x * 4u) + 2u), 10u);
    uint _114 = imageAtomicMax(_34, int((TEXCOORD.x << 2u) >> 2u), 12u);
    SV_Target = (((((((((_66 + _62) + _70) + _75) + _80) + _84) + _88) + uint(_93)) + uint(_100)) + _108) + _114;
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
%"class.RWStructuredBuffer<Composite>" = type { %struct.Composite }
%struct.Composite = type { i32, i32, i32, i32 }
%struct.RWByteAddressBuffer = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 9, i32 7, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 8, i32 6, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 7, i32 2, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 6, i32 0, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 5, i32 5, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 4, i32 4, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 3, i1 false)
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 2, i1 false)
  %9 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 1, i1 false)
  %10 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %11 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %12 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %13 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %14 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %10, i32 0, i32 %11, i32 undef, i32 undef, i32 1)
  %15 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %9, i32 1, i32 %11, i32 %12, i32 undef, i32 2)
  %16 = add i32 %15, %14
  %17 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %8, i32 8, i32 %11, i32 %12, i32 undef, i32 3)
  %18 = add i32 %16, %17
  %19 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %7, i32 7, i32 %11, i32 %12, i32 %13, i32 4)
  %20 = add i32 %18, %19
  %21 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %6, i32 6, i32 %11, i32 %12, i32 %13, i32 5)
  %22 = add i32 %20, %21
  %23 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %5, i32 2, i32 %11, i32 undef, i32 undef, i32 6)
  %24 = add i32 %22, %23
  %25 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %5, i32 3, i32 %11, i32 undef, i32 undef, i32 7)
  %26 = add i32 %24, %25
  %27 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %4, i32 4, i32 %11, i32 undef, i32 undef, i32 8)
  %28 = add i32 %26, %27
  %29 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %3, i32 5, i32 %11, i32 %12, i32 undef, i32 9)
  %30 = add i32 %28, %29
  %31 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %2, i32 0, i32 %11, i32 8, i32 undef, i32 10)
  %32 = add i32 %30, %31
  %33 = shl i32 %11, 2
  %34 = call i32 @dx.op.atomicBinOp.i32(i32 78, %dx.types.Handle %1, i32 7, i32 %33, i32 undef, i32 undef, i32 12)
  %35 = add i32 %32, %34
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %35)
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
!dx.viewIdState = !{!19}
!dx.entryPoints = !{!20}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8, !9, !10, !11, !12, !13, !15, !16, !18}
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
!16 = !{i32 8, %"class.RWStructuredBuffer<Composite>"* undef, !"", i32 0, i32 6, i32 1, i32 12, i1 false, i1 false, i1 false, !17}
!17 = !{i32 1, i32 16}
!18 = !{i32 9, %struct.RWByteAddressBuffer* undef, !"", i32 0, i32 7, i32 1, i32 11, i1 false, i1 false, i1 false, null}
!19 = !{[5 x i32] [i32 3, i32 1, i32 1, i32 1, i32 1]}
!20 = !{void ()* @main, !"main", !21, !4, !29}
!21 = !{!22, !26, null}
!22 = !{!23}
!23 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !24, i8 1, i32 1, i8 3, i32 0, i8 0, !25}
!24 = !{i32 0}
!25 = !{i32 3, i32 7}
!26 = !{!27}
!27 = !{i32 0, !"SV_Target", i8 5, i8 16, !24, i8 0, i32 1, i8 1, i32 0, i8 0, !28}
!28 = !{i32 3, i32 1}
!29 = !{i32 0, i64 32784}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 119
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %37 %39
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %37 "TEXCOORD"
OpName %39 "SV_Target"
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
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 6
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 7
OpDecorate %37 Flat
OpDecorate %37 Location 0
OpDecorate %39 Location 0
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
%31 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%32 = OpTypePointer UniformConstant %31
%33 = OpVariable %32 UniformConstant
%34 = OpVariable %32 UniformConstant
%35 = OpTypeVector %5 3
%36 = OpTypePointer Input %35
%37 = OpVariable %36 Input
%38 = OpTypePointer Output %5
%39 = OpVariable %38 Output
%51 = OpTypePointer Input %5
%52 = OpConstant %5 0
%55 = OpConstant %5 1
%58 = OpConstant %5 2
%61 = OpTypePointer Image %5
%64 = OpTypeVector %5 2
%71 = OpConstant %5 3
%76 = OpConstant %5 4
%81 = OpConstant %5 5
%85 = OpConstant %5 6
%89 = OpConstant %5 7
%92 = OpTypePointer Image %24
%94 = OpConstant %5 8
%101 = OpConstant %5 9
%109 = OpConstant %5 10
%115 = OpConstant %5 12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %117
%117 = OpLabel
%40 = OpLoad %31 %34
%41 = OpLoad %31 %33
%42 = OpLoad %28 %30
%43 = OpLoad %25 %27
%44 = OpLoad %21 %23
%45 = OpLoad %18 %20
%46 = OpLoad %15 %17
%47 = OpLoad %12 %14
%48 = OpLoad %9 %11
%49 = OpLoad %6 %8
%50 = OpInBoundsAccessChain %51 %37 %52
%53 = OpLoad %5 %50
%54 = OpInBoundsAccessChain %51 %37 %55
%56 = OpLoad %5 %54
%57 = OpInBoundsAccessChain %51 %37 %58
%59 = OpLoad %5 %57
%60 = OpImageTexelPointer %61 %8 %53 %52
%62 = OpAtomicIAdd %5 %60 %55 %52 %55
%63 = OpCompositeConstruct %64 %53 %56
%65 = OpImageTexelPointer %61 %11 %63 %52
%66 = OpAtomicAnd %5 %65 %55 %52 %58
%67 = OpIAdd %5 %66 %62
%68 = OpCompositeConstruct %64 %53 %56
%69 = OpImageTexelPointer %61 %14 %68 %52
%70 = OpAtomicExchange %5 %69 %55 %52 %71
%72 = OpIAdd %5 %67 %70
%73 = OpCompositeConstruct %35 %53 %56 %59
%74 = OpImageTexelPointer %61 %17 %73 %52
%75 = OpAtomicUMax %5 %74 %55 %52 %76
%77 = OpIAdd %5 %72 %75
%78 = OpCompositeConstruct %35 %53 %56 %59
%79 = OpImageTexelPointer %61 %20 %78 %52
%80 = OpAtomicUMin %5 %79 %55 %52 %81
%82 = OpIAdd %5 %77 %80
%83 = OpImageTexelPointer %61 %23 %53 %52
%84 = OpAtomicOr %5 %83 %55 %52 %85
%86 = OpIAdd %5 %82 %84
%87 = OpImageTexelPointer %61 %23 %53 %52
%88 = OpAtomicXor %5 %87 %55 %52 %89
%90 = OpIAdd %5 %86 %88
%91 = OpImageTexelPointer %92 %27 %53 %52
%95 = OpBitcast %24 %94
%93 = OpAtomicSMin %24 %91 %55 %52 %95
%96 = OpBitcast %5 %93
%97 = OpIAdd %5 %90 %96
%98 = OpCompositeConstruct %64 %53 %56
%99 = OpImageTexelPointer %92 %30 %98 %52
%102 = OpBitcast %24 %101
%100 = OpAtomicSMax %24 %99 %55 %52 %102
%103 = OpBitcast %5 %100
%104 = OpIAdd %5 %97 %103
%105 = OpIMul %5 %53 %76
%106 = OpIAdd %5 %105 %58
%107 = OpImageTexelPointer %61 %33 %106 %52
%108 = OpAtomicIAdd %5 %107 %55 %52 %109
%110 = OpIAdd %5 %104 %108
%111 = OpShiftLeftLogical %5 %53 %58
%112 = OpShiftRightLogical %5 %111 %58
%113 = OpImageTexelPointer %61 %34 %112 %52
%114 = OpAtomicUMax %5 %113 %55 %52 %115
%116 = OpIAdd %5 %110 %114
OpStore %39 %116
OpReturn
OpFunctionEnd
#endif
