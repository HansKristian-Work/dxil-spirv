#version 460
layout(triangles) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    float _55 = gl_in[1u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 0)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 0)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 0)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 0)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 1)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 1)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 1)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  %9 = fadd fast float %5, 0x3F847AE140000000
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  %10 = fadd fast float %5, 0x3F947AE140000000
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.cutStream(i32 98, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %1)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %10)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %8)
  call void @dx.op.emitStream(i32 97, i8 0)
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind
declare void @dx.op.cutStream(i32, i8) #1

; Function Attrs: nounwind
declare void @dx.op.emitStream(i32, i8) #1

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
!3 = !{!"gs", i32 6, i32 0}
!4 = !{[13 x i32] [i32 8, i32 8, i32 1, i32 2, i32 4, i32 8, i32 16, i32 32, i32 64, i32 128, i32 0, i32 0, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, !12}
!6 = !{!7, !7, null}
!7 = !{!8, !11}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 4, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 15}
!11 = !{i32 1, !"SV_Position", i8 9, i8 3, !9, i8 4, i32 1, i8 4, i32 1, i8 0, !10}
!12 = !{i32 1, !13}
!13 = !{i32 3, i32 6, i32 1, i32 5, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 91
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputTriangleStrip
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%17 = OpTypePointer Input %5
%18 = OpConstant %7 0
%21 = OpConstant %7 1
%24 = OpConstant %7 2
%37 = OpTypePointer Output %5
%46 = OpConstant %5 0.00999999978
%56 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%16 = OpInBoundsAccessChain %17 %11 %18 %18
%19 = OpLoad %5 %16
%20 = OpInBoundsAccessChain %17 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpInBoundsAccessChain %17 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpInBoundsAccessChain %17 %11 %18 %8
%27 = OpLoad %5 %26
%28 = OpInBoundsAccessChain %17 %12 %21 %18
%29 = OpLoad %5 %28
%30 = OpInBoundsAccessChain %17 %12 %21 %21
%31 = OpLoad %5 %30
%32 = OpInBoundsAccessChain %17 %12 %21 %24
%33 = OpLoad %5 %32
%34 = OpInBoundsAccessChain %17 %12 %21 %8
%35 = OpLoad %5 %34
%36 = OpInBoundsAccessChain %37 %14 %18
OpStore %36 %19
%38 = OpInBoundsAccessChain %37 %14 %21
OpStore %38 %22
%39 = OpInBoundsAccessChain %37 %14 %24
OpStore %39 %25
%40 = OpInBoundsAccessChain %37 %14 %8
OpStore %40 %27
%41 = OpInBoundsAccessChain %37 %15 %18
OpStore %41 %29
%42 = OpInBoundsAccessChain %37 %15 %21
OpStore %42 %31
%43 = OpInBoundsAccessChain %37 %15 %24
OpStore %43 %33
%44 = OpInBoundsAccessChain %37 %15 %8
OpStore %44 %35
OpEmitVertex
%45 = OpFAdd %5 %29 %46
%47 = OpInBoundsAccessChain %37 %14 %18
OpStore %47 %19
%48 = OpInBoundsAccessChain %37 %14 %21
OpStore %48 %22
%49 = OpInBoundsAccessChain %37 %14 %24
OpStore %49 %25
%50 = OpInBoundsAccessChain %37 %14 %8
OpStore %50 %27
%51 = OpInBoundsAccessChain %37 %15 %18
OpStore %51 %45
%52 = OpInBoundsAccessChain %37 %15 %21
OpStore %52 %31
%53 = OpInBoundsAccessChain %37 %15 %24
OpStore %53 %33
%54 = OpInBoundsAccessChain %37 %15 %8
OpStore %54 %35
OpEmitVertex
%55 = OpFAdd %5 %29 %56
%57 = OpInBoundsAccessChain %37 %14 %18
OpStore %57 %19
%58 = OpInBoundsAccessChain %37 %14 %21
OpStore %58 %22
%59 = OpInBoundsAccessChain %37 %14 %24
OpStore %59 %25
%60 = OpInBoundsAccessChain %37 %14 %8
OpStore %60 %27
%61 = OpInBoundsAccessChain %37 %15 %18
OpStore %61 %55
%62 = OpInBoundsAccessChain %37 %15 %21
OpStore %62 %31
%63 = OpInBoundsAccessChain %37 %15 %24
OpStore %63 %33
%64 = OpInBoundsAccessChain %37 %15 %8
OpStore %64 %35
OpEmitVertex
OpEndPrimitive
%65 = OpInBoundsAccessChain %37 %14 %18
OpStore %65 %19
%66 = OpInBoundsAccessChain %37 %14 %21
OpStore %66 %22
%67 = OpInBoundsAccessChain %37 %14 %24
OpStore %67 %25
%68 = OpInBoundsAccessChain %37 %14 %8
OpStore %68 %27
%69 = OpInBoundsAccessChain %37 %15 %18
OpStore %69 %55
%70 = OpInBoundsAccessChain %37 %15 %21
OpStore %70 %31
%71 = OpInBoundsAccessChain %37 %15 %24
OpStore %71 %33
%72 = OpInBoundsAccessChain %37 %15 %8
OpStore %72 %35
OpEmitVertex
%73 = OpInBoundsAccessChain %37 %14 %18
OpStore %73 %19
%74 = OpInBoundsAccessChain %37 %14 %21
OpStore %74 %22
%75 = OpInBoundsAccessChain %37 %14 %24
OpStore %75 %25
%76 = OpInBoundsAccessChain %37 %14 %8
OpStore %76 %27
%77 = OpInBoundsAccessChain %37 %15 %18
OpStore %77 %55
%78 = OpInBoundsAccessChain %37 %15 %21
OpStore %78 %31
%79 = OpInBoundsAccessChain %37 %15 %24
OpStore %79 %33
%80 = OpInBoundsAccessChain %37 %15 %8
OpStore %80 %35
OpEmitVertex
%81 = OpInBoundsAccessChain %37 %14 %18
OpStore %81 %19
%82 = OpInBoundsAccessChain %37 %14 %21
OpStore %82 %22
%83 = OpInBoundsAccessChain %37 %14 %24
OpStore %83 %25
%84 = OpInBoundsAccessChain %37 %14 %8
OpStore %84 %27
%85 = OpInBoundsAccessChain %37 %15 %18
OpStore %85 %55
%86 = OpInBoundsAccessChain %37 %15 %21
OpStore %86 %31
%87 = OpInBoundsAccessChain %37 %15 %24
OpStore %87 %33
%88 = OpInBoundsAccessChain %37 %15 %8
OpStore %88 %35
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
