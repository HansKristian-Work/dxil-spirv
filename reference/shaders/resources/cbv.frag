#version 460

layout(set = 2, binding = 1, std140) uniform A
{
    vec4 _m0[1];
} A_1;

layout(set = 2, binding = 2, std140) uniform B
{
    vec4 _m0[1];
} B_1;

layout(location = 0) out float SV_Target;

void main()
{
    uvec4 _30 = floatBitsToUint(A_1._m0[0u]);
    uvec4 _35 = floatBitsToUint(B_1._m0[0u]);
    SV_Target = ((B_1._m0[0u].x + A_1._m0[0u].x) + float(_35.y + _30.y)) + float(int(_35.z + _30.z));
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%A = type { float, i32, i32 }
%B = type { float, i32, i32 }
%dx.types.Handle = type { i8* }
%dx.types.CBufRet.f32 = type { float, float, float, float }
%dx.types.CBufRet.i32 = type { i32, i32, i32, i32 }

@A = external constant %A
@B = external constant %B

define void @main() {
  %B_cbuffer = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 1, i32 2, i1 false)
  %A_cbuffer = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 2, i32 0, i32 1, i1 false)
  %1 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %A_cbuffer, i32 0)
  %2 = extractvalue %dx.types.CBufRet.f32 %1, 0
  %3 = call %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32 59, %dx.types.Handle %B_cbuffer, i32 0)
  %4 = extractvalue %dx.types.CBufRet.f32 %3, 0
  %5 = fadd fast float %4, %2
  %6 = call %dx.types.CBufRet.i32 @dx.op.cbufferLoadLegacy.i32(i32 59, %dx.types.Handle %A_cbuffer, i32 0)
  %7 = extractvalue %dx.types.CBufRet.i32 %6, 1
  %8 = call %dx.types.CBufRet.i32 @dx.op.cbufferLoadLegacy.i32(i32 59, %dx.types.Handle %B_cbuffer, i32 0)
  %9 = extractvalue %dx.types.CBufRet.i32 %8, 1
  %10 = add i32 %9, %7
  %11 = uitofp i32 %10 to float
  %12 = fadd fast float %5, %11
  %13 = extractvalue %dx.types.CBufRet.i32 %6, 2
  %14 = extractvalue %dx.types.CBufRet.i32 %8, 2
  %15 = add nsw i32 %14, %13
  %16 = sitofp i32 %15 to float
  %17 = fadd fast float %12, %16
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %17)
  ret void
}

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #0

; Function Attrs: nounwind readonly
declare %dx.types.CBufRet.i32 @dx.op.cbufferLoadLegacy.i32(i32, %dx.types.Handle, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.CBufRet.f32 @dx.op.cbufferLoadLegacy.f32(i32, %dx.types.Handle, i32) #1

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #1

attributes #0 = { nounwind }
attributes #1 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.typeAnnotations = !{!8, !17}
!dx.viewIdState = !{!21}
!dx.entryPoints = !{!22}

!0 = !{!"dxcoob 2019.05.00"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 4}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{null, null, !5, null}
!5 = !{!6, !7}
!6 = !{i32 0, %A* undef, !"A", i32 2, i32 1, i32 1, i32 12, null}
!7 = !{i32 1, %B* undef, !"B", i32 2, i32 2, i32 1, i32 12, null}
!8 = !{i32 0, %A undef, !9, %B undef, !13}
!9 = !{i32 12, !10, !11, !12}
!10 = !{i32 6, !"a", i32 3, i32 0, i32 7, i32 9}
!11 = !{i32 6, !"b", i32 3, i32 4, i32 7, i32 5}
!12 = !{i32 6, !"c", i32 3, i32 8, i32 7, i32 4}
!13 = !{i32 12, !14, !15, !16}
!14 = !{i32 6, !"a2", i32 3, i32 0, i32 7, i32 9}
!15 = !{i32 6, !"b2", i32 3, i32 4, i32 7, i32 5}
!16 = !{i32 6, !"c2", i32 3, i32 8, i32 7, i32 4}
!17 = !{i32 1, void ()* @main, !18}
!18 = !{!19}
!19 = !{i32 0, !20, !20}
!20 = !{}
!21 = !{[2 x i32] [i32 0, i32 1]}
!22 = !{void ()* @main, !"main", !23, !4, null}
!23 = !{null, !24, null}
!24 = !{!25}
!25 = !{i32 0, !"SV_Target", i8 9, i8 16, !26, i8 0, i32 1, i8 1, i32 0, i8 0, null}
!26 = !{i32 0}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 47
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "A"
OpName %12 "A"
OpName %14 "B"
OpName %16 "B"
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 2
OpDecorate %12 Binding 1
OpDecorate %13 ArrayStride 16
OpMemberDecorate %14 0 Offset 0
OpDecorate %14 Block
OpDecorate %16 DescriptorSet 2
OpDecorate %16 Binding 2
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 1
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypeArray %8 %6
%14 = OpTypeStruct %13
%15 = OpTypePointer Uniform %14
%16 = OpVariable %15 Uniform
%17 = OpTypePointer Output %7
%18 = OpVariable %17 Output
%19 = OpConstant %5 0
%21 = OpTypePointer Uniform %8
%31 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %45
%45 = OpLabel
%20 = OpInBoundsAccessChain %21 %12 %19 %19
%22 = OpLoad %8 %20
%23 = OpCompositeExtract %7 %22 0
%24 = OpInBoundsAccessChain %21 %16 %19 %19
%25 = OpLoad %8 %24
%26 = OpCompositeExtract %7 %25 0
%27 = OpFAdd %7 %26 %23
%28 = OpInBoundsAccessChain %21 %12 %19 %19
%29 = OpLoad %8 %28
%30 = OpBitcast %31 %29
%32 = OpCompositeExtract %5 %30 1
%33 = OpInBoundsAccessChain %21 %16 %19 %19
%34 = OpLoad %8 %33
%35 = OpBitcast %31 %34
%36 = OpCompositeExtract %5 %35 1
%37 = OpIAdd %5 %36 %32
%38 = OpConvertUToF %7 %37
%39 = OpFAdd %7 %27 %38
%40 = OpCompositeExtract %5 %30 2
%41 = OpCompositeExtract %5 %35 2
%42 = OpIAdd %5 %41 %40
%43 = OpConvertSToF %7 %42
%44 = OpFAdd %7 %39 %43
OpStore %18 %44
OpReturn
OpFunctionEnd
#endif
