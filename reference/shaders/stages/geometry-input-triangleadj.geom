#version 460
layout(triangles_adjacency) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[6];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[5u].gl_Position.x;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[5u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
    float _57 = gl_in[5u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
    EndStreamPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitStreamVertex();
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
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 5)
  %6 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 5)
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 5)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 5)
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
!13 = !{i32 7, i32 6, i32 1, i32 5, i32 1}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability GeometryStreams
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 InputTrianglesAdjacency
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
%8 = OpConstant %7 6
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
%30 = OpConstant %7 5
%39 = OpTypePointer Output %5
%48 = OpConstant %5 0.00999999978
%58 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%16 = OpInBoundsAccessChain %17 %11 %18 %18
%19 = OpLoad %5 %16
%20 = OpInBoundsAccessChain %17 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpInBoundsAccessChain %17 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpInBoundsAccessChain %17 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpInBoundsAccessChain %17 %12 %30 %18
%31 = OpLoad %5 %29
%32 = OpInBoundsAccessChain %17 %12 %30 %21
%33 = OpLoad %5 %32
%34 = OpInBoundsAccessChain %17 %12 %30 %24
%35 = OpLoad %5 %34
%36 = OpInBoundsAccessChain %17 %12 %30 %27
%37 = OpLoad %5 %36
%38 = OpInBoundsAccessChain %39 %14 %18
OpStore %38 %19
%40 = OpInBoundsAccessChain %39 %14 %21
OpStore %40 %22
%41 = OpInBoundsAccessChain %39 %14 %24
OpStore %41 %25
%42 = OpInBoundsAccessChain %39 %14 %27
OpStore %42 %28
%43 = OpInBoundsAccessChain %39 %15 %18
OpStore %43 %31
%44 = OpInBoundsAccessChain %39 %15 %21
OpStore %44 %33
%45 = OpInBoundsAccessChain %39 %15 %24
OpStore %45 %35
%46 = OpInBoundsAccessChain %39 %15 %27
OpStore %46 %37
OpEmitStreamVertex %18
%47 = OpFAdd %5 %31 %48
%49 = OpInBoundsAccessChain %39 %14 %18
OpStore %49 %19
%50 = OpInBoundsAccessChain %39 %14 %21
OpStore %50 %22
%51 = OpInBoundsAccessChain %39 %14 %24
OpStore %51 %25
%52 = OpInBoundsAccessChain %39 %14 %27
OpStore %52 %28
%53 = OpInBoundsAccessChain %39 %15 %18
OpStore %53 %47
%54 = OpInBoundsAccessChain %39 %15 %21
OpStore %54 %33
%55 = OpInBoundsAccessChain %39 %15 %24
OpStore %55 %35
%56 = OpInBoundsAccessChain %39 %15 %27
OpStore %56 %37
OpEmitStreamVertex %18
%57 = OpFAdd %5 %31 %58
%59 = OpInBoundsAccessChain %39 %14 %18
OpStore %59 %19
%60 = OpInBoundsAccessChain %39 %14 %21
OpStore %60 %22
%61 = OpInBoundsAccessChain %39 %14 %24
OpStore %61 %25
%62 = OpInBoundsAccessChain %39 %14 %27
OpStore %62 %28
%63 = OpInBoundsAccessChain %39 %15 %18
OpStore %63 %57
%64 = OpInBoundsAccessChain %39 %15 %21
OpStore %64 %33
%65 = OpInBoundsAccessChain %39 %15 %24
OpStore %65 %35
%66 = OpInBoundsAccessChain %39 %15 %27
OpStore %66 %37
OpEmitStreamVertex %18
OpEndStreamPrimitive %18
%67 = OpInBoundsAccessChain %39 %14 %18
OpStore %67 %19
%68 = OpInBoundsAccessChain %39 %14 %21
OpStore %68 %22
%69 = OpInBoundsAccessChain %39 %14 %24
OpStore %69 %25
%70 = OpInBoundsAccessChain %39 %14 %27
OpStore %70 %28
%71 = OpInBoundsAccessChain %39 %15 %18
OpStore %71 %57
%72 = OpInBoundsAccessChain %39 %15 %21
OpStore %72 %33
%73 = OpInBoundsAccessChain %39 %15 %24
OpStore %73 %35
%74 = OpInBoundsAccessChain %39 %15 %27
OpStore %74 %37
OpEmitStreamVertex %18
%75 = OpInBoundsAccessChain %39 %14 %18
OpStore %75 %19
%76 = OpInBoundsAccessChain %39 %14 %21
OpStore %76 %22
%77 = OpInBoundsAccessChain %39 %14 %24
OpStore %77 %25
%78 = OpInBoundsAccessChain %39 %14 %27
OpStore %78 %28
%79 = OpInBoundsAccessChain %39 %15 %18
OpStore %79 %57
%80 = OpInBoundsAccessChain %39 %15 %21
OpStore %80 %33
%81 = OpInBoundsAccessChain %39 %15 %24
OpStore %81 %35
%82 = OpInBoundsAccessChain %39 %15 %27
OpStore %82 %37
OpEmitStreamVertex %18
%83 = OpInBoundsAccessChain %39 %14 %18
OpStore %83 %19
%84 = OpInBoundsAccessChain %39 %14 %21
OpStore %84 %22
%85 = OpInBoundsAccessChain %39 %14 %24
OpStore %85 %25
%86 = OpInBoundsAccessChain %39 %14 %27
OpStore %86 %28
%87 = OpInBoundsAccessChain %39 %15 %18
OpStore %87 %57
%88 = OpInBoundsAccessChain %39 %15 %21
OpStore %88 %33
%89 = OpInBoundsAccessChain %39 %15 %24
OpStore %89 %35
%90 = OpInBoundsAccessChain %39 %15 %27
OpStore %90 %37
OpEmitStreamVertex %18
OpReturn
OpFunctionEnd
#endif
