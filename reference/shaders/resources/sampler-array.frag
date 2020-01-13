#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _12[];
layout(set = 1, binding = 0) uniform sampler _17[100];

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _32 = textureOffset(sampler2D(_8, _12[2u]), vec2(0.5), ivec2(0));
    vec4 _45 = textureOffset(sampler2D(_8, _17[3u]), vec2(0.5), ivec2(0));
    SV_Target.x = _45.x + _32.x;
    SV_Target.y = _45.y + _32.y;
    SV_Target.z = _45.z + _32.z;
    SV_Target.w = _45.w + _32.w;
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
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 2, i1 false)
  %3 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %1, %dx.types.Handle %2, float 5.000000e-01, float 5.000000e-01, float undef, float undef, i32 0, i32 0, i32 undef, float undef)
  %4 = extractvalue %dx.types.ResRet.f32 %3, 0
  %5 = extractvalue %dx.types.ResRet.f32 %3, 1
  %6 = extractvalue %dx.types.ResRet.f32 %3, 2
  %7 = extractvalue %dx.types.ResRet.f32 %3, 3
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 1, i32 3, i1 false)
  %9 = call %dx.types.ResRet.f32 @dx.op.sample.f32(i32 60, %dx.types.Handle %1, %dx.types.Handle %8, float 5.000000e-01, float 5.000000e-01, float undef, float undef, i32 0, i32 0, i32 undef, float undef)
  %10 = extractvalue %dx.types.ResRet.f32 %9, 0
  %11 = extractvalue %dx.types.ResRet.f32 %9, 1
  %12 = extractvalue %dx.types.ResRet.f32 %9, 2
  %13 = extractvalue %dx.types.ResRet.f32 %9, 3
  %14 = fadd fast float %10, %4
  %15 = fadd fast float %11, %5
  %16 = fadd fast float %12, %6
  %17 = fadd fast float %13, %7
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %14)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %15)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %16)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %17)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.sample.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

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
!4 = !{!5, null, null, !8}
!5 = !{!6}
!6 = !{i32 0, %"class.Texture2D<vector<float, 4> >"* undef, !"", i32 0, i32 0, i32 1, i32 2, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{!9, !10}
!9 = !{i32 0, [0 x %struct.SamplerState]* undef, !"", i32 0, i32 0, i32 -1, i32 0, null}
!10 = !{i32 1, [100 x %struct.SamplerState]* undef, !"", i32 1, i32 0, i32 100, i32 0, null}
!11 = !{[2 x i32] [i32 0, i32 4]}
!12 = !{void ()* @main, !"main", !13, !4, null}
!13 = !{null, !14, null}
!14 = !{!15}
!15 = !{i32 0, !"SV_Target", i8 9, i8 16, !16, i8 0, i32 1, i8 4, i32 0, i8 0, !17}
!16 = !{i32 0}
!17 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %20 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 0
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeInt 32 0
%14 = OpConstant %13 100
%15 = OpTypeArray %9 %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeVector %5 4
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpConstant %13 2
%26 = OpTypeImage %5 2D 0 0 0 2 Unknown
%27 = OpTypeSampledImage %26
%29 = OpConstant %5 0.5
%30 = OpTypeInt 32 1
%31 = OpConstant %30 0
%33 = OpTypeVector %5 2
%35 = OpTypeVector %30 2
%36 = OpConstantComposite %35 %31 %31
%42 = OpConstant %13 3
%55 = OpTypePointer Output %5
%57 = OpConstant %13 0
%59 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %62
%62 = OpLabel
%21 = OpLoad %6 %8
%23 = OpAccessChain %22 %12 %24
%25 = OpLoad %9 %23
%28 = OpSampledImage %27 %21 %25
%34 = OpCompositeConstruct %33 %29 %29
%32 = OpImageSampleImplicitLod %18 %28 %34 ConstOffset %36
%37 = OpCompositeExtract %5 %32 0
%38 = OpCompositeExtract %5 %32 1
%39 = OpCompositeExtract %5 %32 2
%40 = OpCompositeExtract %5 %32 3
%41 = OpAccessChain %22 %17 %42
%43 = OpLoad %9 %41
%44 = OpSampledImage %27 %21 %43
%46 = OpCompositeConstruct %33 %29 %29
%45 = OpImageSampleImplicitLod %18 %44 %46 ConstOffset %36
%47 = OpCompositeExtract %5 %45 0
%48 = OpCompositeExtract %5 %45 1
%49 = OpCompositeExtract %5 %45 2
%50 = OpCompositeExtract %5 %45 3
%51 = OpFAdd %5 %47 %37
%52 = OpFAdd %5 %48 %38
%53 = OpFAdd %5 %49 %39
%54 = OpFAdd %5 %50 %40
%56 = OpAccessChain %55 %20 %57
OpStore %56 %51
%58 = OpAccessChain %55 %20 %59
OpStore %58 %52
%60 = OpAccessChain %55 %20 %24
OpStore %60 %53
%61 = OpAccessChain %55 %20 %42
OpStore %61 %54
OpReturn
OpFunctionEnd
#endif
