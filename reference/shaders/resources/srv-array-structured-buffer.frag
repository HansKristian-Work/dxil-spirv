#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform usamplerBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _17 = INDEX + 0u;
    uint _22 = INDEX * 4u;
    vec4 _40 = uintBitsToFloat(uvec4(texelFetch(_9[_17], int(_22)).x, texelFetch(_9[_17], int(_22 + 1u)).x, texelFetch(_9[_17], int(_22 + 2u)).x, texelFetch(_9[_17], int(_22 + 3u)).x));
    SV_Target.x = _40.x;
    SV_Target.y = _40.y;
    SV_Target.z = _40.z;
    SV_Target.w = _40.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%"class.StructuredBuffer<vector<float, 4> >" = type { <4 x float> }

define void @main() {
  %1 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = add i32 %1, 0
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 %2, i1 false)
  %4 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %3, i32 %1, i32 0)
  %5 = extractvalue %dx.types.ResRet.f32 %4, 0
  %6 = extractvalue %dx.types.ResRet.f32 %4, 1
  %7 = extractvalue %dx.types.ResRet.f32 %4, 2
  %8 = extractvalue %dx.types.ResRet.f32 %4, 3
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %8)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #2

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32, %dx.types.Handle, i32, i32) #2

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
!4 = !{!5, null, null, null}
!5 = !{!6}
!6 = !{i32 0, [0 x %"class.StructuredBuffer<vector<float, 4> >"]* undef, !"", i32 0, i32 0, i32 -1, i32 12, i32 0, !7}
!7 = !{i32 1, i32 16}
!8 = !{[3 x i32] [i32 1, i32 4, i32 15]}
!9 = !{void ()* @main, !"main", !10, !4, !18}
!10 = !{!11, !15, null}
!11 = !{!12}
!12 = !{i32 0, !"INDEX", i8 5, i8 0, !13, i8 1, i32 1, i8 1, i32 0, i8 0, !14}
!13 = !{i32 0}
!14 = !{i32 3, i32 1}
!15 = !{!16}
!16 = !{i32 0, !"SV_Target", i8 9, i8 16, !13, i8 0, i32 1, i8 4, i32 0, i8 0, !17}
!17 = !{i32 3, i32 15}
!18 = !{i32 0, i64 16}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 52
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
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
%18 = OpConstant %5 0
%19 = OpTypePointer UniformConstant %6
%23 = OpConstant %5 4
%24 = OpTypeVector %5 4
%29 = OpConstant %5 1
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%45 = OpTypePointer Output %12
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%16 = OpLoad %5 %11
%17 = OpIAdd %5 %16 %18
%20 = OpAccessChain %19 %9 %17
%21 = OpLoad %6 %20
%22 = OpIMul %5 %16 %23
%25 = OpImageFetch %24 %21 %22
%26 = OpCompositeExtract %5 %25 0
%28 = OpIAdd %5 %22 %29
%27 = OpImageFetch %24 %21 %28
%30 = OpCompositeExtract %5 %27 0
%32 = OpIAdd %5 %22 %33
%31 = OpImageFetch %24 %21 %32
%34 = OpCompositeExtract %5 %31 0
%36 = OpIAdd %5 %22 %37
%35 = OpImageFetch %24 %21 %36
%38 = OpCompositeExtract %5 %35 0
%39 = OpCompositeConstruct %24 %26 %30 %34 %38
%40 = OpBitcast %13 %39
%41 = OpCompositeExtract %12 %40 0
%42 = OpCompositeExtract %12 %40 1
%43 = OpCompositeExtract %12 %40 2
%44 = OpCompositeExtract %12 %40 3
%46 = OpAccessChain %45 %15 %18
OpStore %46 %41
%47 = OpAccessChain %45 %15 %29
OpStore %47 %42
%48 = OpAccessChain %45 %15 %33
OpStore %48 %43
%49 = OpAccessChain %45 %15 %37
OpStore %49 %44
OpReturn
OpFunctionEnd
#endif
