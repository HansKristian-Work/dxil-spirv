#version 460
layout(lines_adjacency) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[4];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[3u].gl_Position.x;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[3u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    float _56 = gl_in[3u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
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
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 3)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 3)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 3)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 3)
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
!13 = !{i32 6, i32 6, i32 1, i32 5, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 InputLinesAdjacency
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
%8 = OpConstant %7 4
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
%27 = OpConstant %7 3
%38 = OpTypePointer Output %5
%47 = OpConstant %5 0.00999999978
%57 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
%16 = OpInBoundsAccessChain %17 %11 %18 %18
%19 = OpLoad %5 %16
%20 = OpInBoundsAccessChain %17 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpInBoundsAccessChain %17 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpInBoundsAccessChain %17 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpInBoundsAccessChain %17 %12 %27 %18
%30 = OpLoad %5 %29
%31 = OpInBoundsAccessChain %17 %12 %27 %21
%32 = OpLoad %5 %31
%33 = OpInBoundsAccessChain %17 %12 %27 %24
%34 = OpLoad %5 %33
%35 = OpInBoundsAccessChain %17 %12 %27 %27
%36 = OpLoad %5 %35
%37 = OpInBoundsAccessChain %38 %14 %18
OpStore %37 %19
%39 = OpInBoundsAccessChain %38 %14 %21
OpStore %39 %22
%40 = OpInBoundsAccessChain %38 %14 %24
OpStore %40 %25
%41 = OpInBoundsAccessChain %38 %14 %27
OpStore %41 %28
%42 = OpInBoundsAccessChain %38 %15 %18
OpStore %42 %30
%43 = OpInBoundsAccessChain %38 %15 %21
OpStore %43 %32
%44 = OpInBoundsAccessChain %38 %15 %24
OpStore %44 %34
%45 = OpInBoundsAccessChain %38 %15 %27
OpStore %45 %36
OpEmitVertex
%46 = OpFAdd %5 %30 %47
%48 = OpInBoundsAccessChain %38 %14 %18
OpStore %48 %19
%49 = OpInBoundsAccessChain %38 %14 %21
OpStore %49 %22
%50 = OpInBoundsAccessChain %38 %14 %24
OpStore %50 %25
%51 = OpInBoundsAccessChain %38 %14 %27
OpStore %51 %28
%52 = OpInBoundsAccessChain %38 %15 %18
OpStore %52 %46
%53 = OpInBoundsAccessChain %38 %15 %21
OpStore %53 %32
%54 = OpInBoundsAccessChain %38 %15 %24
OpStore %54 %34
%55 = OpInBoundsAccessChain %38 %15 %27
OpStore %55 %36
OpEmitVertex
%56 = OpFAdd %5 %30 %57
%58 = OpInBoundsAccessChain %38 %14 %18
OpStore %58 %19
%59 = OpInBoundsAccessChain %38 %14 %21
OpStore %59 %22
%60 = OpInBoundsAccessChain %38 %14 %24
OpStore %60 %25
%61 = OpInBoundsAccessChain %38 %14 %27
OpStore %61 %28
%62 = OpInBoundsAccessChain %38 %15 %18
OpStore %62 %56
%63 = OpInBoundsAccessChain %38 %15 %21
OpStore %63 %32
%64 = OpInBoundsAccessChain %38 %15 %24
OpStore %64 %34
%65 = OpInBoundsAccessChain %38 %15 %27
OpStore %65 %36
OpEmitVertex
OpEndPrimitive
%66 = OpInBoundsAccessChain %38 %14 %18
OpStore %66 %19
%67 = OpInBoundsAccessChain %38 %14 %21
OpStore %67 %22
%68 = OpInBoundsAccessChain %38 %14 %24
OpStore %68 %25
%69 = OpInBoundsAccessChain %38 %14 %27
OpStore %69 %28
%70 = OpInBoundsAccessChain %38 %15 %18
OpStore %70 %56
%71 = OpInBoundsAccessChain %38 %15 %21
OpStore %71 %32
%72 = OpInBoundsAccessChain %38 %15 %24
OpStore %72 %34
%73 = OpInBoundsAccessChain %38 %15 %27
OpStore %73 %36
OpEmitVertex
%74 = OpInBoundsAccessChain %38 %14 %18
OpStore %74 %19
%75 = OpInBoundsAccessChain %38 %14 %21
OpStore %75 %22
%76 = OpInBoundsAccessChain %38 %14 %24
OpStore %76 %25
%77 = OpInBoundsAccessChain %38 %14 %27
OpStore %77 %28
%78 = OpInBoundsAccessChain %38 %15 %18
OpStore %78 %56
%79 = OpInBoundsAccessChain %38 %15 %21
OpStore %79 %32
%80 = OpInBoundsAccessChain %38 %15 %24
OpStore %80 %34
%81 = OpInBoundsAccessChain %38 %15 %27
OpStore %81 %36
OpEmitVertex
%82 = OpInBoundsAccessChain %38 %14 %18
OpStore %82 %19
%83 = OpInBoundsAccessChain %38 %14 %21
OpStore %83 %22
%84 = OpInBoundsAccessChain %38 %14 %24
OpStore %84 %25
%85 = OpInBoundsAccessChain %38 %14 %27
OpStore %85 %28
%86 = OpInBoundsAccessChain %38 %15 %18
OpStore %86 %56
%87 = OpInBoundsAccessChain %38 %15 %21
OpStore %87 %32
%88 = OpInBoundsAccessChain %38 %15 %24
OpStore %88 %34
%89 = OpInBoundsAccessChain %38 %15 %27
OpStore %89 %36
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
