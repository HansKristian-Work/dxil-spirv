#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform readonly image2D _9[];
layout(set = 1, binding = 0) uniform readonly image2D _14[100];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _28 = imageLoad(_9[INDEX + 0u], ivec2(uvec2(0u)));
    vec4 _40 = imageLoad(_14[(INDEX ^ 1u) + 0u], ivec2(uvec2(0u)));
    SV_Target.x = _40.x + _28.x;
    SV_Target.y = _40.y + _28.y;
    SV_Target.z = _40.z + _28.z;
    SV_Target.w = _40.w + _28.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.RWTexture2D<vector<float, 4> >" = type { <4 x float> }

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = add i32 %1, 0
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 %2, i1 false)
  %4 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %3, i32 undef, i32 0, i32 0, i32 undef, i32 undef, i32 undef, i32 undef)
  %5 = extractvalue %dx.types.ResRet.f32 %4, 0
  %6 = extractvalue %dx.types.ResRet.f32 %4, 1
  %7 = extractvalue %dx.types.ResRet.f32 %4, 2
  %8 = extractvalue %dx.types.ResRet.f32 %4, 3
  %9 = xor i32 %1, 1
  %10 = add i32 %9, 0
  %11 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 %10, i1 false)
  %12 = call %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32 66, %dx.types.Handle %11, i32 undef, i32 0, i32 0, i32 undef, i32 undef, i32 undef, i32 undef)
  %13 = extractvalue %dx.types.ResRet.f32 %12, 0
  %14 = extractvalue %dx.types.ResRet.f32 %12, 1
  %15 = extractvalue %dx.types.ResRet.f32 %12, 2
  %16 = extractvalue %dx.types.ResRet.f32 %12, 3
  %17 = fadd fast float %13, %5
  %18 = fadd fast float %14, %6
  %19 = fadd fast float %15, %7
  %20 = fadd fast float %16, %8
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %17)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %18)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %19)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %20)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.textureLoad.f32(i32, %dx.types.Handle, i32, i32, i32, i32, i32, i32, i32) #2

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
!dx.viewIdState = !{!9}
!dx.entryPoints = !{!10}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, !5, null, null}
!5 = !{!6, !8}
!6 = !{i32 0, [0 x %"class.RWTexture2D<vector<float, 4> >"]* undef, !"", i32 0, i32 0, i32 -1, i32 2, i1 false, i1 false, i1 false, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, [100 x %"class.RWTexture2D<vector<float, 4> >"]* undef, !"", i32 1, i32 0, i32 100, i32 2, i1 false, i1 false, i1 false, !7}
!9 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!10 = !{void ()* @main, !"main", !11, !4, !19}
!11 = !{!12, !16, null}
!12 = !{!13}
!13 = !{i32 0, !"INDEX", i8 5, i8 0, !14, i8 1, i32 1, i8 1, i32 0, i8 0, !15}
!14 = !{i32 0}
!15 = !{i32 3, i32 1}
!16 = !{!17}
!17 = !{i32 0, !"SV_Target", i8 9, i8 16, !14, i8 0, i32 1, i8 4, i32 0, i8 0, !18}
!18 = !{i32 3, i32 15}
!19 = !{i32 0, i64 8192}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability StorageImageReadWithoutFormat
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 100
%12 = OpTypeArray %6 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypePointer Input %10
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 4
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%22 = OpConstant %10 0
%23 = OpTypePointer UniformConstant %6
%26 = OpTypeInt 32 1
%27 = OpConstant %26 0
%29 = OpTypeVector %10 2
%36 = OpConstant %10 1
%50 = OpTypePointer Output %5
%54 = OpConstant %10 2
%56 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%20 = OpLoad %10 %16
%21 = OpIAdd %10 %20 %22
%24 = OpAccessChain %23 %9 %21
%25 = OpLoad %6 %24
%30 = OpCompositeConstruct %29 %22 %22
%28 = OpImageRead %17 %25 %30 None
%31 = OpCompositeExtract %5 %28 0
%32 = OpCompositeExtract %5 %28 1
%33 = OpCompositeExtract %5 %28 2
%34 = OpCompositeExtract %5 %28 3
%35 = OpBitwiseXor %10 %20 %36
%37 = OpIAdd %10 %35 %22
%38 = OpAccessChain %23 %14 %37
%39 = OpLoad %6 %38
%41 = OpCompositeConstruct %29 %22 %22
%40 = OpImageRead %17 %39 %41 None
%42 = OpCompositeExtract %5 %40 0
%43 = OpCompositeExtract %5 %40 1
%44 = OpCompositeExtract %5 %40 2
%45 = OpCompositeExtract %5 %40 3
%46 = OpFAdd %5 %42 %31
%47 = OpFAdd %5 %43 %32
%48 = OpFAdd %5 %44 %33
%49 = OpFAdd %5 %45 %34
%51 = OpAccessChain %50 %19 %22
OpStore %51 %46
%52 = OpAccessChain %50 %19 %36
OpStore %52 %47
%53 = OpAccessChain %50 %19 %54
OpStore %53 %48
%55 = OpAccessChain %50 %19 %56
OpStore %55 %49
OpReturn
OpFunctionEnd
#endif
