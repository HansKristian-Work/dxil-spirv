#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 1) uniform sampler _14;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _42 = textureGatherOffset(sampler2D(_8, _14), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(1, 2), 0u);
    vec4 _56 = textureGatherOffset(sampler2DArray(_11, _14), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-2, -3), 1u);
    SV_Target.x = _56.x + _42.x;
    SV_Target.y = _56.y + _42.y;
    SV_Target.z = _56.z + _42.z;
    SV_Target.w = _56.w + _42.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.Texture2D<vector<float, 4> >" = type { <4 x float>, %"class.Texture2D<vector<float, 4> >::mips_type" }
%"class.Texture2D<vector<float, 4> >::mips_type" = type { i32 }
%"class.Texture2DArray<vector<float, 4> >" = type { <4 x float>, %"class.Texture2DArray<vector<float, 4> >::mips_type" }
%"class.Texture2DArray<vector<float, 4> >::mips_type" = type { i32 }
%struct.SamplerState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 4, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 3, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 1, i1 false)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %7 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %2, %dx.types.Handle %3, float %4, float %5, float undef, float undef, i32 1, i32 2, i32 0)
  %8 = extractvalue %dx.types.ResRet.f32 %7, 0
  %9 = extractvalue %dx.types.ResRet.f32 %7, 1
  %10 = extractvalue %dx.types.ResRet.f32 %7, 2
  %11 = extractvalue %dx.types.ResRet.f32 %7, 3
  %12 = call %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32 73, %dx.types.Handle %1, %dx.types.Handle %3, float %4, float %5, float %6, float undef, i32 -2, i32 -3, i32 1)
  %13 = extractvalue %dx.types.ResRet.f32 %12, 0
  %14 = extractvalue %dx.types.ResRet.f32 %12, 1
  %15 = extractvalue %dx.types.ResRet.f32 %12, 2
  %16 = extractvalue %dx.types.ResRet.f32 %12, 3
  %17 = fadd fast float %13, %8
  %18 = fadd fast float %14, %9
  %19 = fadd fast float %15, %10
  %20 = fadd fast float %16, %11
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %17)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %18)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %19)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %20)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.textureGather.f32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32) #2

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
!6 = !{i32 0, %"class.Texture2D<vector<float, 4> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %"class.Texture2DArray<vector<float, 4> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!9 = !{!10}
!10 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 1, i32 1, i32 0, null}
!11 = !{[6 x i32] [i32 4, i32 4, i32 15, i32 15, i32 15, i32 0]}
!12 = !{void ()* @main, !"main", !13, !4, null}
!13 = !{!14, !18, null}
!14 = !{!15}
!15 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !16, i8 2, i32 1, i8 4, i32 0, i8 0, !17}
!16 = !{i32 0}
!17 = !{i32 3, i32 7}
!18 = !{!19}
!19 = !{i32 0, !"SV_Target", i8 9, i8 16, !16, i8 0, i32 1, i8 4, i32 0, i8 0, !20}
!20 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %17 "TEXCOORD"
OpName %19 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %17 Location 0
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeSampler
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeVector %5 4
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %15
%19 = OpVariable %18 Output
%23 = OpTypePointer Input %5
%25 = OpTypeInt 32 0
%26 = OpConstant %25 0
%29 = OpConstant %25 1
%32 = OpConstant %25 2
%34 = OpTypeImage %5 2D 0 0 0 2 Unknown
%35 = OpTypeSampledImage %34
%37 = OpTypeVector %5 2
%39 = OpTypeInt 32 1
%40 = OpConstant %39 1
%41 = OpConstant %39 2
%43 = OpTypeVector %39 2
%44 = OpConstantComposite %43 %40 %41
%49 = OpTypeImage %5 2D 0 1 0 2 Unknown
%50 = OpTypeSampledImage %49
%52 = OpTypeVector %5 3
%54 = OpConstant %39 -2
%55 = OpConstant %39 -3
%57 = OpConstantComposite %43 %54 %55
%66 = OpTypePointer Output %5
%71 = OpConstant %25 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%20 = OpLoad %9 %11
%21 = OpLoad %6 %8
%22 = OpLoad %12 %14
%24 = OpAccessChain %23 %17 %26
%27 = OpLoad %5 %24
%28 = OpAccessChain %23 %17 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %17 %32
%33 = OpLoad %5 %31
%36 = OpSampledImage %35 %21 %22
%38 = OpCompositeConstruct %37 %27 %30
%42 = OpImageGather %15 %36 %38 %26 ConstOffset %44
%45 = OpCompositeExtract %5 %42 0
%46 = OpCompositeExtract %5 %42 1
%47 = OpCompositeExtract %5 %42 2
%48 = OpCompositeExtract %5 %42 3
%51 = OpSampledImage %50 %20 %22
%53 = OpCompositeConstruct %52 %27 %30 %33
%56 = OpImageGather %15 %51 %53 %29 ConstOffset %57
%58 = OpCompositeExtract %5 %56 0
%59 = OpCompositeExtract %5 %56 1
%60 = OpCompositeExtract %5 %56 2
%61 = OpCompositeExtract %5 %56 3
%62 = OpFAdd %5 %58 %45
%63 = OpFAdd %5 %59 %46
%64 = OpFAdd %5 %60 %47
%65 = OpFAdd %5 %61 %48
%67 = OpAccessChain %66 %19 %26
OpStore %67 %62
%68 = OpAccessChain %66 %19 %29
OpStore %68 %63
%69 = OpAccessChain %66 %19 %32
OpStore %69 %64
%70 = OpAccessChain %66 %19 %71
OpStore %70 %65
OpReturn
OpFunctionEnd
#endif
