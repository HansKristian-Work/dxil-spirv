#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std140) uniform _10_13
{
    vec4 _m0[4];
} _13[];

layout(set = 1, binding = 0, std140) uniform _15_19
{
    vec4 _m0[4];
} _19[100];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _25 = INDEX & 3u;
    uint _27 = INDEX + 0u;
    uint _38 = INDEX & 1u;
    uint _41 = (INDEX ^ 1u) + 0u;
    SV_Target.x = _19[_41]._m0[_38].x + _13[_27]._m0[_25].x;
    SV_Target.y = _19[_41]._m0[_38].y + _13[_27]._m0[_25].y;
    SV_Target.z = _19[_41]._m0[_38].z + _13[_27]._m0[_25].z;
    SV_Target.w = _19[_41]._m0[_38].w + _13[_27]._m0[_25].w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.CBufRet.f32 = type { float, float, float, float }
%Buf = type { %struct.Foo }
%struct.Foo = type { [4 x <4 x float>] }
%Buf2 = type { %struct.Foo }

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = and i32 %1, 3
  %3 = add i32 %1, 0
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 0, i32 %3, i1 false)
  %5 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %4, i32 %2)
  %6 = extractvalue %dx.types.CBufRet.f32 %5, 0
  %7 = extractvalue %dx.types.CBufRet.f32 %5, 1
  %8 = extractvalue %dx.types.CBufRet.f32 %5, 2
  %9 = extractvalue %dx.types.CBufRet.f32 %5, 3
  %10 = and i32 %1, 1
  %11 = xor i32 %1, 1
  %12 = add i32 %11, 0
  %13 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 1, i32 %12, i1 false)
  %14 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %13, i32 %10)
  %15 = extractvalue %dx.types.CBufRet.f32 %14, 0
  %16 = extractvalue %dx.types.CBufRet.f32 %14, 1
  %17 = extractvalue %dx.types.CBufRet.f32 %14, 2
  %18 = extractvalue %dx.types.CBufRet.f32 %14, 3
  %19 = fadd fast float %15, %6
  %20 = fadd fast float %16, %7
  %21 = fadd fast float %17, %8
  %22 = fadd fast float %18, %9
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %19)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %20)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %21)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %22)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32, %dx.types.Handle, i32) #2

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
!4 = !{null, null, !5, null}
!5 = !{!6, !7}
!6 = !{i32 0, [4294967295 x %Buf]* undef, !"", i32 0, i32 0, i32 -1, i32 64, null}
!7 = !{i32 1, [100 x %Buf2]* undef, !"", i32 1, i32 0, i32 100, i32 64, null}
!8 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!9 = !{void ()* @main, !"main", !10, !4, null}
!10 = !{!11, !15, null}
!11 = !{!12}
!12 = !{i32 0, !"INDEX", i8 5, i8 0, !13, i8 1, i32 1, i8 1, i32 0, i8 0, !14}
!13 = !{i32 0}
!14 = !{i32 3, i32 1}
!15 = !{!16}
!16 = !{i32 0, !"SV_Target", i8 9, i8 16, !13, i8 0, i32 1, i8 4, i32 0, i8 0, !17}
!17 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %15 ""
OpName %21 "INDEX"
OpName %23 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %21 Flat
OpDecorate %21 Location 0
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer Uniform %11
%13 = OpVariable %12 Uniform
%14 = OpTypeArray %8 %6
%15 = OpTypeStruct %14
%16 = OpConstant %5 100
%17 = OpTypeArray %15 %16
%18 = OpTypePointer Uniform %17
%19 = OpVariable %18 Uniform
%20 = OpTypePointer Input %5
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %8
%23 = OpVariable %22 Output
%26 = OpConstant %5 3
%28 = OpConstant %5 0
%29 = OpTypePointer Uniform %10
%31 = OpTypePointer Uniform %8
%39 = OpConstant %5 1
%42 = OpTypePointer Uniform %15
%54 = OpTypePointer Output %7
%58 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%24 = OpLoad %5 %21
%25 = OpBitwiseAnd %5 %24 %26
%27 = OpIAdd %5 %24 %28
%30 = OpAccessChain %29 %13 %27
%32 = OpAccessChain %31 %30 %28 %25
%33 = OpLoad %8 %32
%34 = OpCompositeExtract %7 %33 0
%35 = OpCompositeExtract %7 %33 1
%36 = OpCompositeExtract %7 %33 2
%37 = OpCompositeExtract %7 %33 3
%38 = OpBitwiseAnd %5 %24 %39
%40 = OpBitwiseXor %5 %24 %39
%41 = OpIAdd %5 %40 %28
%43 = OpAccessChain %42 %19 %41
%44 = OpAccessChain %31 %43 %28 %38
%45 = OpLoad %8 %44
%46 = OpCompositeExtract %7 %45 0
%47 = OpCompositeExtract %7 %45 1
%48 = OpCompositeExtract %7 %45 2
%49 = OpCompositeExtract %7 %45 3
%50 = OpFAdd %7 %46 %34
%51 = OpFAdd %7 %47 %35
%52 = OpFAdd %7 %48 %36
%53 = OpFAdd %7 %49 %37
%55 = OpAccessChain %54 %23 %28
OpStore %55 %50
%56 = OpAccessChain %54 %23 %39
OpStore %56 %51
%57 = OpAccessChain %54 %23 %58
OpStore %57 %52
%59 = OpAccessChain %54 %23 %26
OpStore %59 %53
OpReturn
OpFunctionEnd
#endif
