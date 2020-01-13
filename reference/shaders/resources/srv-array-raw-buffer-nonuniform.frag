#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _19 = INDEX + 0u;
    uint _24 = (INDEX << 4u) >> 2u;
    uvec4 _40 = uvec4(texelFetch(_9[nonuniformEXT(_19)], int(_24)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 1u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 2u)).x, texelFetch(_9[nonuniformEXT(_19)], int(_24 + 3u)).x);
    SV_Target.x = uintBitsToFloat(_40.x);
    SV_Target.y = uintBitsToFloat(_40.y);
    SV_Target.z = uintBitsToFloat(_40.z);
    SV_Target.w = uintBitsToFloat(_40.w);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.i32 = type { i32, i32, i32, i32, i32 }
%struct.ByteAddressBuffer = type { i32 }

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = shl i32 %1, 4
  %3 = add i32 %1, 0
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 %3, i1 true)
  %5 = call %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32 68, %dx.types.Handle %4, i32 %2, i32 undef)
  %6 = extractvalue %dx.types.ResRet.i32 %5, 0
  %7 = extractvalue %dx.types.ResRet.i32 %5, 1
  %8 = extractvalue %dx.types.ResRet.i32 %5, 2
  %9 = extractvalue %dx.types.ResRet.i32 %5, 3
  %10 = bitcast i32 %6 to float
  %11 = bitcast i32 %7 to float
  %12 = bitcast i32 %8 to float
  %13 = bitcast i32 %9 to float
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %13)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #2

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32, %dx.types.Handle, i32, i32) #2

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }
attributes #2 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.viewIdState = !{!7}
!dx.entryPoints = !{!8}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, null}
!5 = !{!6}
!6 = !{i32 0, [0 x %struct.ByteAddressBuffer]* undef, !"", i32 0, i32 0, i32 -1, i32 11, i32 0, null}
!7 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!8 = !{void ()* @main, !"main", !9, !4, !17}
!9 = !{!10, !14, null}
!10 = !{!11}
!11 = !{i32 0, !"INDEX", i8 5, i8 0, !12, i8 1, i32 1, i8 1, i32 0, i8 0, !13}
!12 = !{i32 0}
!13 = !{i32 3, i32 1}
!14 = !{!15}
!15 = !{i32 0, !"SV_Target", i8 9, i8 16, !12, i8 0, i32 1, i8 4, i32 0, i8 0, !16}
!16 = !{i32 3, i32 15}
!17 = !{i32 0, i64 16}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "INDEX"
OpName %15 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
OpDecorate %23 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%18 = OpConstant %5 4
%20 = OpConstant %5 0
%21 = OpTypePointer UniformConstant %6
%25 = OpConstant %5 2
%26 = OpTypeVector %5 4
%31 = OpConstant %5 1
%38 = OpConstant %5 3
%49 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%16 = OpLoad %5 %11
%17 = OpShiftLeftLogical %5 %16 %18
%19 = OpIAdd %5 %16 %20
%22 = OpAccessChain %21 %9 %19
%23 = OpLoad %6 %22
%24 = OpShiftRightLogical %5 %17 %25
%27 = OpImageFetch %26 %23 %24
%28 = OpCompositeExtract %5 %27 0
%30 = OpIAdd %5 %24 %31
%29 = OpImageFetch %26 %23 %30
%32 = OpCompositeExtract %5 %29 0
%34 = OpIAdd %5 %24 %25
%33 = OpImageFetch %26 %23 %34
%35 = OpCompositeExtract %5 %33 0
%37 = OpIAdd %5 %24 %38
%36 = OpImageFetch %26 %23 %37
%39 = OpCompositeExtract %5 %36 0
%40 = OpCompositeConstruct %26 %28 %32 %35 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpCompositeExtract %5 %40 2
%44 = OpCompositeExtract %5 %40 3
%45 = OpBitcast %12 %41
%46 = OpBitcast %12 %42
%47 = OpBitcast %12 %43
%48 = OpBitcast %12 %44
%50 = OpAccessChain %49 %15 %20
OpStore %50 %45
%51 = OpAccessChain %49 %15 %31
OpStore %51 %46
%52 = OpAccessChain %49 %15 %25
OpStore %52 %47
%53 = OpAccessChain %49 %15 %38
OpStore %53 %48
OpReturn
OpFunctionEnd
#endif
