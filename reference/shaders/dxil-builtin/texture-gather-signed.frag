#version 460

layout(set = 0, binding = 3) uniform itexture2D _8;
layout(set = 0, binding = 4) uniform itexture2DArray _11;
layout(set = 0, binding = 6) uniform itextureCube _14;
layout(set = 0, binding = 7) uniform itextureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out ivec4 SV_Target;

void main()
{
    uvec4 _54 = uvec4(textureGather(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), 0u));
    uvec4 _66 = uvec4(textureGather(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1u));
    uvec4 _80 = uvec4(textureGather(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u));
    uvec4 _94 = uvec4(textureGather(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u));
    SV_Target.x = int(((_66.x + _54.x) + _80.x) + _94.x);
    SV_Target.y = int(((_66.y + _54.y) + _80.y) + _94.y);
    SV_Target.z = int(((_66.z + _54.z) + _80.z) + _94.z);
    SV_Target.w = int(((_66.w + _54.w) + _80.w) + _94.w);
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.i32 = type { i32, i32, i32, i32, i32 }
%"class.Texture2D<vector<int, 4> >" = type { <4 x i32>, %"class.Texture2D<vector<int, 4> >::mips_type" }
%"class.Texture2D<vector<int, 4> >::mips_type" = type { i32 }
%"class.Texture2DArray<vector<int, 4> >" = type { <4 x i32>, %"class.Texture2DArray<vector<int, 4> >::mips_type" }
%"class.Texture2DArray<vector<int, 4> >::mips_type" = type { i32 }
%"class.TextureCube<vector<int, 4> >" = type { <4 x i32> }
%"class.TextureCubeArray<vector<int, 4> >" = type { <4 x i32> }
%struct.SamplerState = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 7, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 6, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 4, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 3, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 3, i32 0, i32 1, i1 false)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  %10 = call %dx.types.ResRet.i32 @dx.op.textureGather.i32(i32 73, %dx.types.Handle %4, %dx.types.Handle %5, float %6, float %7, float undef, float undef, i32 0, i32 0, i32 0)
  %11 = extractvalue %dx.types.ResRet.i32 %10, 0
  %12 = extractvalue %dx.types.ResRet.i32 %10, 1
  %13 = extractvalue %dx.types.ResRet.i32 %10, 2
  %14 = extractvalue %dx.types.ResRet.i32 %10, 3
  %15 = call %dx.types.ResRet.i32 @dx.op.textureGather.i32(i32 73, %dx.types.Handle %3, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 0, i32 0, i32 1)
  %16 = extractvalue %dx.types.ResRet.i32 %15, 0
  %17 = extractvalue %dx.types.ResRet.i32 %15, 1
  %18 = extractvalue %dx.types.ResRet.i32 %15, 2
  %19 = extractvalue %dx.types.ResRet.i32 %15, 3
  %20 = add i32 %16, %11
  %21 = add i32 %17, %12
  %22 = add i32 %18, %13
  %23 = add i32 %19, %14
  %24 = call %dx.types.ResRet.i32 @dx.op.textureGather.i32(i32 73, %dx.types.Handle %2, %dx.types.Handle %5, float %6, float %7, float %8, float undef, i32 undef, i32 undef, i32 2)
  %25 = extractvalue %dx.types.ResRet.i32 %24, 0
  %26 = extractvalue %dx.types.ResRet.i32 %24, 1
  %27 = extractvalue %dx.types.ResRet.i32 %24, 2
  %28 = extractvalue %dx.types.ResRet.i32 %24, 3
  %29 = add i32 %20, %25
  %30 = add i32 %21, %26
  %31 = add i32 %22, %27
  %32 = add i32 %23, %28
  %33 = call %dx.types.ResRet.i32 @dx.op.textureGather.i32(i32 73, %dx.types.Handle %1, %dx.types.Handle %5, float %6, float %7, float %8, float %9, i32 undef, i32 undef, i32 3)
  %34 = extractvalue %dx.types.ResRet.i32 %33, 0
  %35 = extractvalue %dx.types.ResRet.i32 %33, 1
  %36 = extractvalue %dx.types.ResRet.i32 %33, 2
  %37 = extractvalue %dx.types.ResRet.i32 %33, 3
  %38 = add i32 %29, %34
  %39 = add i32 %30, %35
  %40 = add i32 %31, %36
  %41 = add i32 %32, %37
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 0, i32 %38)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 1, i32 %39)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 2, i32 %40)
  call void @dx.op.storeOutput.i32(i32 5, i32 0, i32 0, i8 3, i32 %41)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.i32(i32, i32, i32, i8, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.i32 @dx.op.textureGather.i32(i32, %dx.types.Handle, %dx.types.Handle, float, float, float, float, i32, i32, i32) #2

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
!dx.viewIdState = !{!13}
!dx.entryPoints = !{!14}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, null, null, !11}
!5 = !{!6, !8, !9, !10}
!6 = !{i32 0, %"class.Texture2D<vector<int, 4> >"* undef, !"", i32 0, i32 3, i32 1, i32 2, i32 0, !7}
!7 = !{i32 0, i32 4}
!8 = !{i32 1, %"class.Texture2DArray<vector<int, 4> >"* undef, !"", i32 0, i32 4, i32 1, i32 7, i32 0, !7}
!9 = !{i32 2, %"class.TextureCube<vector<int, 4> >"* undef, !"", i32 0, i32 6, i32 1, i32 5, i32 0, !7}
!10 = !{i32 3, %"class.TextureCubeArray<vector<int, 4> >"* undef, !"", i32 0, i32 7, i32 1, i32 9, i32 0, !7}
!11 = !{!12}
!12 = !{i32 0, %struct.SamplerState* undef, !"", i32 0, i32 1, i32 1, i32 0, null}
!13 = !{[6 x i32] [i32 4, i32 4, i32 15, i32 15, i32 15, i32 15]}
!14 = !{void ()* @main, !"main", !15, !4, null}
!15 = !{!16, !20, null}
!16 = !{!17}
!17 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !18, i8 2, i32 1, i8 4, i32 0, i8 0, !19}
!18 = !{i32 0}
!19 = !{i32 3, i32 15}
!20 = !{!21}
!21 = !{i32 0, !"SV_Target", i8 4, i8 16, !18, i8 0, i32 1, i8 4, i32 0, i8 0, !19}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 114
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 6
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 7
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %24 Location 0
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeFloat 32
%22 = OpTypeVector %21 4
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 4
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%34 = OpTypePointer Input %21
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%47 = OpTypeImage %5 2D 0 0 0 2 Unknown
%49 = OpTypeSampledImage %47
%51 = OpTypeVector %21 2
%52 = OpConstant %5 0
%55 = OpTypeVector %35 4
%60 = OpTypeImage %5 2D 0 1 0 2 Unknown
%62 = OpTypeSampledImage %60
%64 = OpTypeVector %21 3
%75 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%77 = OpTypeSampledImage %75
%89 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%91 = OpTypeSampledImage %89
%104 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %112
%112 = OpLabel
%28 = OpLoad %15 %17
%29 = OpLoad %12 %14
%30 = OpLoad %9 %11
%31 = OpLoad %6 %8
%32 = OpLoad %18 %20
%33 = OpInBoundsAccessChain %34 %24 %36
%37 = OpLoad %21 %33
%38 = OpInBoundsAccessChain %34 %24 %39
%40 = OpLoad %21 %38
%41 = OpInBoundsAccessChain %34 %24 %42
%43 = OpLoad %21 %41
%44 = OpInBoundsAccessChain %34 %24 %45
%46 = OpLoad %21 %44
%48 = OpSampledImage %49 %31 %32
%50 = OpCompositeConstruct %51 %37 %40
%53 = OpImageGather %25 %48 %50 %36
%54 = OpBitcast %55 %53
%56 = OpCompositeExtract %35 %54 0
%57 = OpCompositeExtract %35 %54 1
%58 = OpCompositeExtract %35 %54 2
%59 = OpCompositeExtract %35 %54 3
%61 = OpSampledImage %62 %30 %32
%63 = OpCompositeConstruct %64 %37 %40 %43
%65 = OpImageGather %25 %61 %63 %39
%66 = OpBitcast %55 %65
%67 = OpCompositeExtract %35 %66 0
%68 = OpCompositeExtract %35 %66 1
%69 = OpCompositeExtract %35 %66 2
%70 = OpCompositeExtract %35 %66 3
%71 = OpIAdd %35 %67 %56
%72 = OpIAdd %35 %68 %57
%73 = OpIAdd %35 %69 %58
%74 = OpIAdd %35 %70 %59
%76 = OpSampledImage %77 %29 %32
%78 = OpCompositeConstruct %64 %37 %40 %43
%79 = OpImageGather %25 %76 %78 %42
%80 = OpBitcast %55 %79
%81 = OpCompositeExtract %35 %80 0
%82 = OpCompositeExtract %35 %80 1
%83 = OpCompositeExtract %35 %80 2
%84 = OpCompositeExtract %35 %80 3
%85 = OpIAdd %35 %71 %81
%86 = OpIAdd %35 %72 %82
%87 = OpIAdd %35 %73 %83
%88 = OpIAdd %35 %74 %84
%90 = OpSampledImage %91 %28 %32
%92 = OpCompositeConstruct %22 %37 %40 %43 %46
%93 = OpImageGather %25 %90 %92 %45
%94 = OpBitcast %55 %93
%95 = OpCompositeExtract %35 %94 0
%96 = OpCompositeExtract %35 %94 1
%97 = OpCompositeExtract %35 %94 2
%98 = OpCompositeExtract %35 %94 3
%99 = OpIAdd %35 %85 %95
%100 = OpIAdd %35 %86 %96
%101 = OpIAdd %35 %87 %97
%102 = OpIAdd %35 %88 %98
%103 = OpInBoundsAccessChain %104 %27 %36
%105 = OpBitcast %5 %99
OpStore %103 %105
%106 = OpInBoundsAccessChain %104 %27 %39
%107 = OpBitcast %5 %100
OpStore %106 %107
%108 = OpInBoundsAccessChain %104 %27 %42
%109 = OpBitcast %5 %101
OpStore %108 %109
%110 = OpInBoundsAccessChain %104 %27 %45
%111 = OpBitcast %5 %102
OpStore %110 %111
OpReturn
OpFunctionEnd
#endif
