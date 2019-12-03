#version 460

layout(set = 0, binding = 0) uniform isamplerBuffer _8;
layout(set = 0, binding = 0) uniform readonly iimageBuffer _11;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out ivec2 SV_Target;

void main()
{
    uvec4 _23 = uvec4(texelFetch(_8, int(TEXCOORD)));
    uvec4 _28 = uvec4(imageLoad(_11, int(TEXCOORD)));
    SV_Target.x = int(_28.x + _23.x);
    SV_Target.y = int(_28.y + _23.y);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.i32 = type { i32, i32, i32, i32, i32 }
%"class.Buffer<vector<int, 2> >" = type { <2 x i32> }
%"class.RWBuffer<vector<int, 2> >" = type { <2 x i32> }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %3 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %4 = call %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32 68, %dx.types.Handle %2, i32 %3, i32 undef)
  %5 = extractvalue %dx.types.ResRet.i32 %4, 0
  %6 = extractvalue %dx.types.ResRet.i32 %4, 1
  %7 = call %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32 68, %dx.types.Handle %1, i32 %3, i32 undef)
  %8 = extractvalue %dx.types.ResRet.i32 %7, 0
  %9 = extractvalue %dx.types.ResRet.i32 %7, 1
  %10 = add i32 %8, %5
  %11 = add i32 %9, %6
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %10)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 1, i32 %11)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32, %dx.types.Handle, i32, i32) #2

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
!dx.viewIdState = !{!10}
!dx.entryPoints = !{!11}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, !8, null, null}
!5 = !{!6}
!6 = !{i32 0, %"class.Buffer<vector<int, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i32 0, !7}
!7 = !{i32 0, i32 4}
!8 = !{!9}
!9 = !{i32 0, %"class.RWBuffer<vector<int, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i1 false, i1 false, i1 false, !7}
!10 = !{[3 x i32] [i32 1, i32 2, i32 3]}
!11 = !{void ()* @main, !"main", !12, !4, !20}
!12 = !{!13, !17, null}
!13 = !{!14}
!14 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !15, i8 1, i32 1, i8 1, i32 0, i8 0, !16}
!15 = !{i32 0}
!16 = !{i32 3, i32 1}
!17 = !{!18}
!18 = !{i32 0, !"SV_Target", i8 4, i8 16, !15, i8 0, i32 1, i8 2, i32 0, i8 0, !19}
!19 = !{i32 3, i32 3}
!20 = !{i32 0, i64 8192}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageReadWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %17 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeInt 32 0
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 2
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%22 = OpTypeVector %5 4
%24 = OpTypeVector %12 4
%34 = OpTypePointer Output %5
%35 = OpConstant %12 0
%38 = OpConstant %12 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%18 = OpLoad %9 %11
%19 = OpLoad %6 %8
%20 = OpLoad %12 %14
%21 = OpImageFetch %22 %19 %20
%23 = OpBitcast %24 %21
%25 = OpCompositeExtract %12 %23 0
%26 = OpCompositeExtract %12 %23 1
%27 = OpImageRead %22 %18 %20
%28 = OpBitcast %24 %27
%29 = OpCompositeExtract %12 %28 0
%30 = OpCompositeExtract %12 %28 1
%31 = OpIAdd %12 %29 %25
%32 = OpIAdd %12 %30 %26
%33 = OpInBoundsAccessChain %34 %17 %35
%36 = OpBitcast %5 %31
OpStore %33 %36
%37 = OpInBoundsAccessChain %34 %17 %38
%39 = OpBitcast %5 %32
OpStore %37 %39
OpReturn
OpFunctionEnd
#endif
