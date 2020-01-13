#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 1, binding = 0) uniform texture2D _14[100];
layout(set = 0, binding = 0) uniform sampler _17;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _36 = textureOffset(sampler2D(_9[nonuniformEXT(INDEX + 0u)], _17), vec2(0.5), ivec2(0));
    vec4 _51 = textureOffset(sampler2D(_14[nonuniformEXT((INDEX ^ 1u) + 0u)], _17), vec2(0.5), ivec2(0));
    SV_Target.x = _51.x + _36.x;
    SV_Target.y = _51.y + _36.y;
    SV_Target.z = _51.z + _36.z;
    SV_Target.w = _51.w + _36.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture2D<vector<float, 4> >" = type { <4 x float>, %"class.Texture2D<vector<float, 4> >::mips_type" }
%"class.Texture2D<vector<float, 4> >::mips_type" = type { i32 }
%struct.SamplerState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 0, i1 false)
  %2 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %3 = add i32 %2, 0
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 %3, i1 true)
  %5 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %4, %dx.types.Handle %1, float 5.000000e-01, float 5.000000e-01, float undef, float undef, i32 0, i32 0, i32 undef, float undef)
  %6 = extractvalue %dx.types.ResRet.f32 %5, 0
  %7 = extractvalue %dx.types.ResRet.f32 %5, 1
  %8 = extractvalue %dx.types.ResRet.f32 %5, 2
  %9 = extractvalue %dx.types.ResRet.f32 %5, 3
  %10 = xor i32 %2, 1
  %11 = add i32 %10, 0
  %12 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 %11, i1 true)
  %13 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %12, %dx.types.Handle %1, float 5.000000e-01, float 5.000000e-01, float undef, float undef, i32 0, i32 0, i32 undef, float undef)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %15 = extractvalue %dx.types.ResRet.f32 %13, 1
  %16 = extractvalue %dx.types.ResRet.f32 %13, 2
  %17 = extractvalue %dx.types.ResRet.f32 %13, 3
  %18 = fadd fast float %14, %6
  %19 = fadd fast float %15, %7
  %20 = fadd fast float %16, %8
  %21 = fadd fast float %17, %9
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %18)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %19)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %20)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %21)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sample.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #2

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
!dx.viewIdState = !{!11}
!dx.entryPoints = !{!12}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !9}
!5 = !{!6, !8}
!6 = !{i32 0, [0 x %"class.Texture2D<vector<float, 4> >"]* undef, !"", i32 0, i32 0, i32 -1, i32 2, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, [100 x %"class.Texture2D<vector<float, 4> >"]* undef, !"", i32 1, i32 0, i32 100, i32 2, i32 0, !7}
!9 = !{!10}
!10 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 0, i32 1, i32 0, null}
!11 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!12 = !{void ()* @main, !"main", !13, !4, null}
!13 = !{!14, !18, null}
!14 = !{!15}
!15 = !{i32 0, !"INDEX", i8 5, i8 0, !16, i8 1, i32 1, i8 1, i32 0, i8 0, !17}
!16 = !{i32 0}
!17 = !{i32 3, i32 1}
!18 = !{!19}
!19 = !{i32 0, !"SV_Target", i8 9, i8 16, !16, i8 0, i32 1, i8 4, i32 0, i8 0, !20}
!20 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 70
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %19 "INDEX"
OpName %22 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %22 Location 0
OpDecorate %32 NonUniform
OpDecorate %50 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 100
%12 = OpTypeArray %6 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeSampler
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypePointer Input %10
%19 = OpVariable %18 Input
%20 = OpTypeVector %5 4
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%26 = OpConstant %10 0
%27 = OpTypePointer UniformConstant %6
%30 = OpTypeImage %5 2D 0 0 0 2 Unknown
%31 = OpTypeSampledImage %30
%33 = OpConstant %5 0.5
%34 = OpTypeInt 32 1
%35 = OpConstant %34 0
%37 = OpTypeVector %5 2
%39 = OpTypeVector %34 2
%40 = OpConstantComposite %39 %35 %35
%46 = OpConstant %10 1
%61 = OpTypePointer Output %5
%65 = OpConstant %10 2
%67 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %68
%68 = OpLabel
%23 = OpLoad %15 %17
%24 = OpLoad %10 %19
%25 = OpIAdd %10 %24 %26
%28 = OpAccessChain %27 %9 %25
%29 = OpLoad %6 %28
%32 = OpSampledImage %31 %29 %23
%38 = OpCompositeConstruct %37 %33 %33
%36 = OpImageSampleImplicitLod %20 %32 %38 ConstOffset %40
%41 = OpCompositeExtract %5 %36 0
%42 = OpCompositeExtract %5 %36 1
%43 = OpCompositeExtract %5 %36 2
%44 = OpCompositeExtract %5 %36 3
%45 = OpBitwiseXor %10 %24 %46
%47 = OpIAdd %10 %45 %26
%48 = OpAccessChain %27 %14 %47
%49 = OpLoad %6 %48
%50 = OpSampledImage %31 %49 %23
%52 = OpCompositeConstruct %37 %33 %33
%51 = OpImageSampleImplicitLod %20 %50 %52 ConstOffset %40
%53 = OpCompositeExtract %5 %51 0
%54 = OpCompositeExtract %5 %51 1
%55 = OpCompositeExtract %5 %51 2
%56 = OpCompositeExtract %5 %51 3
%57 = OpFAdd %5 %53 %41
%58 = OpFAdd %5 %54 %42
%59 = OpFAdd %5 %55 %43
%60 = OpFAdd %5 %56 %44
%62 = OpAccessChain %61 %22 %26
OpStore %62 %57
%63 = OpAccessChain %61 %22 %46
OpStore %63 %58
%64 = OpAccessChain %61 %22 %65
OpStore %64 %59
%66 = OpAccessChain %61 %22 %67
OpStore %66 %60
OpReturn
OpFunctionEnd
#endif
