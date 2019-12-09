#version 460

layout(location = 0) in vec4 POSITION;
layout(location = 0) out vec4 ATTR[4];
layout(location = 4) out float ATTR_1[4];

void main()
{
    gl_Position.x = POSITION.x;
    gl_Position.y = POSITION.y;
    gl_Position.z = POSITION.z;
    gl_Position.w = POSITION.w;
    ATTR[0u].x = POSITION.x;
    ATTR[0u].y = POSITION.y;
    ATTR[0u].z = POSITION.z;
    ATTR[0u].w = POSITION.w;
    ATTR[1u].x = POSITION.x + 1.0;
    ATTR[1u].y = POSITION.y + 1.0;
    ATTR[1u].z = POSITION.z + 1.0;
    ATTR[1u].w = POSITION.w + 1.0;
    ATTR[2u].x = POSITION.x + 2.0;
    ATTR[2u].y = POSITION.y + 2.0;
    ATTR[2u].z = POSITION.z + 2.0;
    ATTR[2u].w = POSITION.w + 2.0;
    ATTR[3u].x = POSITION.x + 3.0;
    ATTR[3u].y = POSITION.y + 3.0;
    ATTR[3u].z = POSITION.z + 3.0;
    ATTR[3u].w = POSITION.w + 3.0;
    ATTR_1[0u] = POSITION.x;
    ATTR_1[1u] = POSITION.y;
    ATTR_1[2u] = POSITION.z;
    ATTR_1[3u] = POSITION.w;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 undef)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 undef)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %4)
  %5 = fadd fast float %1, 1.000000e+00
  %6 = fadd fast float %2, 1.000000e+00
  %7 = fadd fast float %3, 1.000000e+00
  %8 = fadd fast float %4, 1.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 1, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 1, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 1, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 1, i8 3, float %8)
  %9 = fadd fast float %1, 2.000000e+00
  %10 = fadd fast float %2, 2.000000e+00
  %11 = fadd fast float %3, 2.000000e+00
  %12 = fadd fast float %4, 2.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 2, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 2, i8 1, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 2, i8 2, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 2, i8 3, float %12)
  %13 = fadd fast float %1, 3.000000e+00
  %14 = fadd fast float %2, 3.000000e+00
  %15 = fadd fast float %3, 3.000000e+00
  %16 = fadd fast float %4, 3.000000e+00
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 3, i8 0, float %13)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 3, i8 1, float %14)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 3, i8 2, float %15)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 3, i8 3, float %16)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 1, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 2, i8 0, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 2, i32 3, i8 0, float %4)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.viewIdState = !{!4}
!dx.entryPoints = !{!5}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"vs", i32 6, i32 0}
!4 = !{[10 x i32] [i32 4, i32 33, i32 1118481, i32 0, i32 16917026, i32 0, i32 268715076, i32 0, i32 559240, i32 1]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, !11, null}
!7 = !{!8}
!8 = !{i32 0, !"POSITION", i8 9, i8 0, !9, i8 0, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{!12, !13, !15}
!12 = !{i32 0, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 0, i8 0, !10}
!13 = !{i32 1, !"ATTR", i8 9, i8 0, !14, i8 2, i32 4, i8 4, i32 1, i8 0, !10}
!14 = !{i32 0, i32 1, i32 2, i32 3}
!15 = !{i32 2, !"ATTR", i8 9, i8 0, !16, i8 2, i32 4, i8 1, i32 5, i8 0, !17}
!16 = !{i32 4, i32 5, i32 6, i32 7}
!17 = !{i32 3, i32 1}
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
OpEntryPoint Vertex %3 "main" %8 %10 %15 %18
OpName %3 "main"
OpName %8 "POSITION"
OpName %10 "SV_Position"
OpName %15 "ATTR"
OpName %18 "ATTR"
OpDecorate %8 Location 0
OpDecorate %10 BuiltIn Position
OpDecorate %15 Location 0
OpDecorate %18 Location 4
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypeInt 32 0
%12 = OpConstant %11 4
%13 = OpTypeArray %6 %12
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpTypeArray %5 %12
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %11 0
%24 = OpConstant %11 1
%27 = OpConstant %11 2
%30 = OpConstant %11 3
%32 = OpTypePointer Output %5
%42 = OpConstant %5 1
%51 = OpConstant %5 2
%60 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%20 = OpAccessChain %19 %8 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %8 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %8 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %8 %30
%31 = OpLoad %5 %29
%33 = OpAccessChain %32 %10 %21
OpStore %33 %22
%34 = OpAccessChain %32 %10 %24
OpStore %34 %25
%35 = OpAccessChain %32 %10 %27
OpStore %35 %28
%36 = OpAccessChain %32 %10 %30
OpStore %36 %31
%37 = OpAccessChain %32 %15 %21 %21
OpStore %37 %22
%38 = OpAccessChain %32 %15 %21 %24
OpStore %38 %25
%39 = OpAccessChain %32 %15 %21 %27
OpStore %39 %28
%40 = OpAccessChain %32 %15 %21 %30
OpStore %40 %31
%41 = OpFAdd %5 %22 %42
%43 = OpFAdd %5 %25 %42
%44 = OpFAdd %5 %28 %42
%45 = OpFAdd %5 %31 %42
%46 = OpAccessChain %32 %15 %24 %21
OpStore %46 %41
%47 = OpAccessChain %32 %15 %24 %24
OpStore %47 %43
%48 = OpAccessChain %32 %15 %24 %27
OpStore %48 %44
%49 = OpAccessChain %32 %15 %24 %30
OpStore %49 %45
%50 = OpFAdd %5 %22 %51
%52 = OpFAdd %5 %25 %51
%53 = OpFAdd %5 %28 %51
%54 = OpFAdd %5 %31 %51
%55 = OpAccessChain %32 %15 %27 %21
OpStore %55 %50
%56 = OpAccessChain %32 %15 %27 %24
OpStore %56 %52
%57 = OpAccessChain %32 %15 %27 %27
OpStore %57 %53
%58 = OpAccessChain %32 %15 %27 %30
OpStore %58 %54
%59 = OpFAdd %5 %22 %60
%61 = OpFAdd %5 %25 %60
%62 = OpFAdd %5 %28 %60
%63 = OpFAdd %5 %31 %60
%64 = OpAccessChain %32 %15 %30 %21
OpStore %64 %59
%65 = OpAccessChain %32 %15 %30 %24
OpStore %65 %61
%66 = OpAccessChain %32 %15 %30 %27
OpStore %66 %62
%67 = OpAccessChain %32 %15 %30 %30
OpStore %67 %63
%68 = OpAccessChain %32 %18 %21
OpStore %68 %22
%69 = OpAccessChain %32 %18 %24
OpStore %69 %25
%70 = OpAccessChain %32 %18 %27
OpStore %70 %28
%71 = OpAccessChain %32 %18 %30
OpStore %71 %31
OpReturn
OpFunctionEnd
#endif
