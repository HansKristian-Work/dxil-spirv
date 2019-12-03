#version 460

layout(set = 0, binding = 0) uniform writeonly iimageBuffer _8;

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec2 DATA;

void main()
{
    uint _20 = uint(DATA.x);
    imageStore(_8, int(INDEX), ivec4(uvec4(_20, uint(DATA.y), _20, _20)));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%"class.RWBuffer<vector<int, 2> >" = type { <2 x i32> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 0, i32 undef)
  %3 = call i32 @dx.op.loadInput.i32(i32 4, i32 1, i32 0, i8 1, i32 undef)
  %4 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  call void @dx.op.bufferStore.i32(i32 69, %dx.types.Handle %1, i32 %4, i32 undef, i32 %2, i32 %3, i32 %2, i32 %2, i8 15)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.bufferStore.i32(i32, %dx.types.Handle, i32, i32, i32, i32, i32, i32, i8) #1

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
!dx.viewIdState = !{!8}
!dx.entryPoints = !{!9}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6}
!6 = !{i32 0, %"class.RWBuffer<vector<int, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 4}
!8 = !{[2 x i32] [i32 3, i32 0]}
!9 = !{void ()* @main, !"main", !10, !4, null}
!10 = !{!11, null, null}
!11 = !{!12, !15}
!12 = !{i32 0, !"INDEX", i8 5, i8 0, !13, i8 1, i32 1, i8 1, i32 0, i8 0, !14}
!13 = !{i32 0}
!14 = !{i32 3, i32 1}
!15 = !{i32 1, !"DATA", i8 4, i8 0, !13, i8 1, i32 1, i8 2, i32 0, i8 1, !16}
!16 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %14 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %14 Flat
OpDecorate %14 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%17 = OpTypePointer Input %5
%18 = OpConstant %9 0
%22 = OpConstant %9 1
%27 = OpTypeVector %9 4
%29 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%15 = OpLoad %6 %8
%16 = OpInBoundsAccessChain %17 %14 %18
%19 = OpLoad %5 %16
%20 = OpBitcast %9 %19
%21 = OpInBoundsAccessChain %17 %14 %22
%23 = OpLoad %5 %21
%24 = OpBitcast %9 %23
%25 = OpLoad %9 %11
%26 = OpCompositeConstruct %27 %20 %24 %20 %20
%28 = OpBitcast %29 %26
OpImageWrite %15 %25 %28
OpReturn
OpFunctionEnd
#endif
