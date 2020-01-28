#version 460
#extension GL_EXT_samplerless_texture_functions : require

const vec2 _77[31] = vec2[](vec2(0.0), vec2(0.25), vec2(-0.25), vec2(-0.125, -0.375), vec2(0.375, -0.125), vec2(-0.375, 0.125), vec2(0.125, 0.375), vec2(0.0625, -0.1875), vec2(-0.0625, 0.1875), vec2(0.3125, 0.0625), vec2(-0.1875, -0.3125), vec2(-0.3125, 0.3125), vec2(-0.4375, -0.0625), vec2(0.1875, 0.4375), vec2(0.4375, -0.4375), vec2(0.0625), vec2(-0.0625, -0.1875), vec2(-0.1875, 0.125), vec2(0.25, -0.0625), vec2(-0.3125, -0.125), vec2(0.125, 0.3125), vec2(0.3125, 0.1875), vec2(0.1875, -0.3125), vec2(-0.125, 0.375), vec2(0.0, -0.4375), vec2(-0.25, -0.375), vec2(-0.375, 0.25), vec2(-0.5, 0.0), vec2(0.4375, -0.25), vec2(0.375, 0.4375), vec2(-0.4375, -0.5));

layout(set = 0, binding = 0, std140) uniform _13_15
{
    vec4 _m0[1];
} _15;

layout(set = 0, binding = 0) uniform texture2DMS _8;

layout(location = 0) out vec4 SV_Target;

void main()
{
    uvec4 _24 = floatBitsToUint(_15._m0[0u]);
    uint _25 = _24.x;
    uint _26 = uint(textureSamples(_8));
    uint _87 = ((_25 < _26) && (_26 <= 16u)) ? ((_26 - 1u) + _25) : 0u;
    SV_Target.x = _77[_87].x;
    SV_Target.y = _77[_87].y;
    SV_Target.z = 0.0;
    SV_Target.w = 0.0;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.CBufRet.i32 = type { i32, i32, i32, i32 }
%dx.types.SamplePos = type { float, float }
%"class.Texture2DMS<vector<float, 4>, 0>" = type { <4 x float>, %"class.Texture2DMS<vector<float, 4>, 0>::sample_type" }
%"class.Texture2DMS<vector<float, 4>, 0>::sample_type" = type { i32 }
%"$Globals" = type { i32 }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 0, i32 0, i1 false)
  %3 = call %dx.types.CBufRet.i32 @dx.op.cbufferLoadLegacy.i32(i32 59, %dx.types.Handle %2, i32 0)
  %4 = extractvalue %dx.types.CBufRet.i32 %3, 0
  %5 = call %dx.types.SamplePos @dx.op.texture2DMSGetSamplePosition(i32 75, %dx.types.Handle %1, i32 %4)
  %6 = extractvalue %dx.types.SamplePos %5, 0
  %7 = extractvalue %dx.types.SamplePos %5, 1
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float 0.000000e+00)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float 0.000000e+00)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readonly
declare %dx.types.CBufRet.i32 @dx.op.cbufferLoadLegacy.i32(i32, %dx.types.Handle, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.SamplePos @dx.op.texture2DMSGetSamplePosition(i32, %dx.types.Handle, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

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
!4 = !{!5, null, !8, null}
!5 = !{!6}
!6 = !{i32 0, %"class.Texture2DMS<vector<float, 4>, 0>"* undef, !"", i32 0, i32 0, i32 1, i32 3, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{!9}
!9 = !{i32 0, %"$Globals"* undef, !"", i32 0, i32 0, i32 1, i32 4, null}
!10 = !{[2 x i32] [i32 0, i32 4]}
!11 = !{void ()* @main, !"main", !12, !4, null}
!12 = !{null, !13, null}
!13 = !{!14}
!14 = !{i32 0, !"SV_Target", i8 9, i8 16, !15, i8 0, i32 1, i8 4, i32 0, i8 0, !16}
!15 = !{i32 0}
!16 = !{i32 3, i32 15}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
OpCapability Shader
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %17 "SV_Target"
OpName %79 "Texture2DMSSamplePositionLUT"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 ArrayStride 16
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 1 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeVector %5 4
%12 = OpTypeArray %11 %10
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypePointer Output %11
%17 = OpVariable %16 Output
%19 = OpConstant %9 0
%20 = OpTypePointer Uniform %11
%23 = OpTypeVector %9 4
%27 = OpTypeVector %5 2
%28 = OpConstant %5 0
%29 = OpConstantComposite %27 %28 %28
%30 = OpConstant %5 0.25
%31 = OpConstantComposite %27 %30 %30
%32 = OpConstant %5 -0.25
%33 = OpConstantComposite %27 %32 %32
%34 = OpConstant %5 -0.125
%35 = OpConstant %5 -0.375
%36 = OpConstantComposite %27 %34 %35
%37 = OpConstant %5 0.375
%38 = OpConstantComposite %27 %37 %34
%39 = OpConstant %5 0.125
%40 = OpConstantComposite %27 %35 %39
%41 = OpConstantComposite %27 %39 %37
%42 = OpConstant %5 0.0625
%43 = OpConstant %5 -0.1875
%44 = OpConstantComposite %27 %42 %43
%45 = OpConstant %5 -0.0625
%46 = OpConstant %5 0.1875
%47 = OpConstantComposite %27 %45 %46
%48 = OpConstant %5 0.3125
%49 = OpConstantComposite %27 %48 %42
%50 = OpConstant %5 -0.3125
%51 = OpConstantComposite %27 %43 %50
%52 = OpConstantComposite %27 %50 %48
%53 = OpConstant %5 -0.4375
%54 = OpConstantComposite %27 %53 %45
%55 = OpConstant %5 0.4375
%56 = OpConstantComposite %27 %46 %55
%57 = OpConstantComposite %27 %55 %53
%58 = OpConstantComposite %27 %42 %42
%59 = OpConstantComposite %27 %45 %43
%60 = OpConstantComposite %27 %43 %39
%61 = OpConstantComposite %27 %30 %45
%62 = OpConstantComposite %27 %50 %34
%63 = OpConstantComposite %27 %39 %48
%64 = OpConstantComposite %27 %48 %46
%65 = OpConstantComposite %27 %46 %50
%66 = OpConstantComposite %27 %34 %37
%67 = OpConstantComposite %27 %28 %53
%68 = OpConstantComposite %27 %32 %35
%69 = OpConstantComposite %27 %35 %30
%70 = OpConstant %5 -0.5
%71 = OpConstantComposite %27 %70 %28
%72 = OpConstantComposite %27 %55 %32
%73 = OpConstantComposite %27 %37 %55
%74 = OpConstantComposite %27 %53 %70
%75 = OpConstant %9 31
%76 = OpTypeArray %27 %75
%77 = OpConstantComposite %76 %29 %31 %33 %36 %38 %40 %41 %44 %47 %49 %51 %52 %54 %56 %57 %58 %59 %60 %61 %62 %63 %64 %65 %66 %67 %68 %69 %71 %72 %73 %74
%78 = OpTypePointer Private %76
%79 = OpVariable %78 Private %77
%82 = OpTypeBool
%85 = OpConstant %9 16
%88 = OpTypePointer Private %27
%93 = OpTypePointer Output %5
%97 = OpConstant %9 2
%99 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %100
%100 = OpLabel
%18 = OpLoad %6 %8
%21 = OpAccessChain %20 %15 %19 %19
%22 = OpLoad %11 %21
%24 = OpBitcast %23 %22
%25 = OpCompositeExtract %9 %24 0
%26 = OpImageQuerySamples %9 %18
%80 = OpISub %9 %26 %10
%81 = OpIAdd %9 %80 %25
%83 = OpULessThan %82 %25 %26
%84 = OpULessThanEqual %82 %26 %85
%86 = OpLogicalAnd %82 %83 %84
%87 = OpSelect %9 %86 %81 %19
%89 = OpAccessChain %88 %79 %87
%90 = OpLoad %27 %89
%91 = OpCompositeExtract %5 %90 0
%92 = OpCompositeExtract %5 %90 1
%94 = OpAccessChain %93 %17 %19
OpStore %94 %91
%95 = OpAccessChain %93 %17 %10
OpStore %95 %92
%96 = OpAccessChain %93 %17 %97
OpStore %96 %28
%98 = OpAccessChain %93 %17 %99
OpStore %98 %28
OpReturn
OpFunctionEnd
#endif
