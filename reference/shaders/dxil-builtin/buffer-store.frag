#version 460

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _13;
layout(set = 0, binding = 3, r32ui) uniform writeonly uimageBuffer _14;

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in vec2 DATA;

uint _40;
float _48;

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    uint _38 = (INDEX << 3u) >> 2u;
    imageStore(_12, int(_38), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_12, int(_38 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _45 = INDEX * 2u;
    imageStore(_13, int(_45), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_13, int(_45 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _55 = (INDEX * 5u) + 3u;
    imageStore(_14, int(_55), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_14, int(_55 + 1u), uvec4(floatBitsToUint(DATA.y)));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%"class.RWBuffer<vector<float, 2> >" = type { <2 x float> }
%struct.RWByteAddressBuffer = type { i32 }
%"class.RWStructuredBuffer<vector<float, 2> >" = type { <2 x float> }
%"class.RWStructuredBuffer<Composite>" = type { %struct.Composite }
%struct.Composite = type { <3 x float>, <2 x float> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 3, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 2, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 1, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %7 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  call void @dx.op.bufferStore.f32(i32 69, %dx.types.Handle %4, i32 %7, i32 undef, float %5, float %6, float %5, float %5, i8 15)
  %8 = bitcast float %5 to i32
  %9 = bitcast float %6 to i32
  %10 = shl i32 %7, 3
  call void @dx.op.bufferStore.i32(i32 69, %dx.types.Handle %3, i32 %10, i32 undef, i32 %8, i32 %9, i32 undef, i32 undef, i8 3)
  call void @dx.op.bufferStore.f32(i32 69, %dx.types.Handle %2, i32 %7, i32 0, float %5, float %6, float undef, float undef, i8 3)
  call void @dx.op.bufferStore.f32(i32 69, %dx.types.Handle %1, i32 %7, i32 12, float %5, float %6, float undef, float undef, i8 3)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.bufferStore.f32(i32, %dx.types.Handle, i32, i32, float, float, float, float, i8) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #2

; Function Attrs: nounwind
declare void @dx.op.bufferStore.i32(i32, %dx.types.Handle, i32, i32, i32, i32, i32, i32, i8) #1

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
!4 = !{null, !5, null, null}
!5 = !{!6, !8, !9, !11}
!6 = !{i32 0, %"class.RWBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %struct.RWByteAddressBuffer* undef, !"", i32 0, i32 1, i32 1, i32 11, i1 false, i1 false, i1 false, null}
!9 = !{i32 2, %"class.RWStructuredBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 12, i1 false, i1 false, i1 false, !10}
!10 = !{i32 1, i32 8}
!11 = !{i32 3, %"class.RWStructuredBuffer<Composite>"* undef, !"", i32 0, i32 3, i32 1, i32 12, i1 false, i1 false, i1 false, !12}
!12 = !{i32 1, i32 20}
!13 = !{[2 x i32] [i32 3, i32 0]}
!14 = !{void ()* @main, !"main", !15, !4, !22}
!15 = !{!16, null, null}
!16 = !{!17, !20}
!17 = !{i32 0, !"INDEX", i8 5, i8 0, !18, i8 1, i32 1, i8 1, i32 0, i8 0, !19}
!18 = !{i32 0}
!19 = !{i32 3, i32 1}
!20 = !{i32 1, !"DATA", i8 9, i8 0, !18, i8 1, i32 1, i8 2, i32 0, i8 1, !21}
!21 = !{i32 3, i32 3}
!22 = !{i32 0, i64 16}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Flat
OpDecorate %19 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeImage %9 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpVariable %11 UniformConstant
%15 = OpTypePointer Input %9
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 2
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%25 = OpTypePointer Input %5
%26 = OpConstant %9 0
%29 = OpConstant %9 1
%33 = OpTypeVector %5 4
%37 = OpConstant %9 3
%39 = OpConstant %9 2
%41 = OpTypeVector %9 4
%52 = OpConstant %9 12
%54 = OpConstant %9 5
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %9
%48 = OpUndef %5
OpBranch %61
%61 = OpLabel
%20 = OpLoad %10 %14
%21 = OpLoad %10 %13
%22 = OpLoad %10 %12
%23 = OpLoad %6 %8
%24 = OpInBoundsAccessChain %25 %19 %26
%27 = OpLoad %5 %24
%28 = OpInBoundsAccessChain %25 %19 %29
%30 = OpLoad %5 %28
%31 = OpLoad %9 %16
%32 = OpCompositeConstruct %33 %27 %30 %27 %27
OpImageWrite %23 %31 %32
%34 = OpBitcast %9 %27
%35 = OpBitcast %9 %30
%36 = OpShiftLeftLogical %9 %31 %37
%38 = OpShiftRightLogical %9 %36 %39
%42 = OpCompositeConstruct %41 %34 %34 %34 %34
OpImageWrite %22 %38 %42
%43 = OpCompositeConstruct %41 %35 %35 %35 %35
%44 = OpIAdd %9 %38 %29
OpImageWrite %22 %44 %43
%45 = OpIMul %9 %31 %39
%46 = OpBitcast %9 %27
%47 = OpBitcast %9 %30
%49 = OpCompositeConstruct %41 %46 %46 %46 %46
OpImageWrite %21 %45 %49
%50 = OpCompositeConstruct %41 %47 %47 %47 %47
%51 = OpIAdd %9 %45 %29
OpImageWrite %21 %51 %50
%53 = OpIMul %9 %31 %54
%55 = OpIAdd %9 %53 %37
%56 = OpBitcast %9 %27
%57 = OpBitcast %9 %30
%58 = OpCompositeConstruct %41 %56 %56 %56 %56
OpImageWrite %20 %55 %58
%59 = OpCompositeConstruct %41 %57 %57 %57 %57
%60 = OpIAdd %9 %55 %29
OpImageWrite %20 %60 %59
OpReturn
OpFunctionEnd
#endif
