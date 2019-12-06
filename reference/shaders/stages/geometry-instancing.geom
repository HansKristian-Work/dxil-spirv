#version 460
layout(invocations = 2, triangles) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    uint _31 = gl_InvocationID ^ 1u;
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = gl_in[_31].gl_Position.x;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = gl_in[_31].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    float _59 = gl_in[_31].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call i32 @dx.op.gsInstanceID.i32(i32 100)
  %2 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 %1)
  %3 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 %1)
  %4 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 2, i32 %1)
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 3, i32 %1)
  %6 = xor i32 %1, 1
  %7 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 0, i32 %6)
  %8 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 1, i32 %6)
  %9 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 2, i32 %6)
  %10 = call float @dx.op.loadInput.f32(i32 4, i32 1, i32 0, i8 3, i32 %6)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %7)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  %11 = fadd fast float %7, 0x3F847AE140000000
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %11)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  %12 = fadd fast float %7, 0x3F947AE140000000
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.cutStream(i32 98, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %2)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %3)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 2, float %4)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 3, float %5)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 0, float %12)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 1, float %8)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 2, float %9)
  call void @dx.op.storeOutput.f32(i32 5, i32 1, i32 0, i8 3, float %10)
  call void @dx.op.emitStream(i32 97, i8 0)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.gsInstanceID.i32(i32) #0

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
!13 = !{i32 3, i32 6, i32 1, i32 5, i32 2}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %17
OpExecutionMode %3 Invocations 2
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
OpDecorate %17 BuiltIn InvocationId
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
%16 = OpTypePointer Input %7
%17 = OpVariable %16 Input
%20 = OpTypePointer Input %5
%21 = OpConstant %7 0
%24 = OpConstant %7 1
%27 = OpConstant %7 2
%41 = OpTypePointer Output %5
%50 = OpConstant %5 0.00999999978
%60 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%18 = OpLoad %7 %17
%19 = OpInBoundsAccessChain %20 %11 %18 %21
%22 = OpLoad %5 %19
%23 = OpInBoundsAccessChain %20 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpInBoundsAccessChain %20 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpInBoundsAccessChain %20 %11 %18 %8
%30 = OpLoad %5 %29
%31 = OpBitwiseXor %7 %18 %24
%32 = OpInBoundsAccessChain %20 %12 %31 %21
%33 = OpLoad %5 %32
%34 = OpInBoundsAccessChain %20 %12 %31 %24
%35 = OpLoad %5 %34
%36 = OpInBoundsAccessChain %20 %12 %31 %27
%37 = OpLoad %5 %36
%38 = OpInBoundsAccessChain %20 %12 %31 %8
%39 = OpLoad %5 %38
%40 = OpInBoundsAccessChain %41 %14 %21
OpStore %40 %22
%42 = OpInBoundsAccessChain %41 %14 %24
OpStore %42 %25
%43 = OpInBoundsAccessChain %41 %14 %27
OpStore %43 %28
%44 = OpInBoundsAccessChain %41 %14 %8
OpStore %44 %30
%45 = OpInBoundsAccessChain %41 %15 %21
OpStore %45 %33
%46 = OpInBoundsAccessChain %41 %15 %24
OpStore %46 %35
%47 = OpInBoundsAccessChain %41 %15 %27
OpStore %47 %37
%48 = OpInBoundsAccessChain %41 %15 %8
OpStore %48 %39
OpEmitVertex
%49 = OpFAdd %5 %33 %50
%51 = OpInBoundsAccessChain %41 %14 %21
OpStore %51 %22
%52 = OpInBoundsAccessChain %41 %14 %24
OpStore %52 %25
%53 = OpInBoundsAccessChain %41 %14 %27
OpStore %53 %28
%54 = OpInBoundsAccessChain %41 %14 %8
OpStore %54 %30
%55 = OpInBoundsAccessChain %41 %15 %21
OpStore %55 %49
%56 = OpInBoundsAccessChain %41 %15 %24
OpStore %56 %35
%57 = OpInBoundsAccessChain %41 %15 %27
OpStore %57 %37
%58 = OpInBoundsAccessChain %41 %15 %8
OpStore %58 %39
OpEmitVertex
%59 = OpFAdd %5 %33 %60
%61 = OpInBoundsAccessChain %41 %14 %21
OpStore %61 %22
%62 = OpInBoundsAccessChain %41 %14 %24
OpStore %62 %25
%63 = OpInBoundsAccessChain %41 %14 %27
OpStore %63 %28
%64 = OpInBoundsAccessChain %41 %14 %8
OpStore %64 %30
%65 = OpInBoundsAccessChain %41 %15 %21
OpStore %65 %59
%66 = OpInBoundsAccessChain %41 %15 %24
OpStore %66 %35
%67 = OpInBoundsAccessChain %41 %15 %27
OpStore %67 %37
%68 = OpInBoundsAccessChain %41 %15 %8
OpStore %68 %39
OpEmitVertex
OpEndPrimitive
%69 = OpInBoundsAccessChain %41 %14 %21
OpStore %69 %22
%70 = OpInBoundsAccessChain %41 %14 %24
OpStore %70 %25
%71 = OpInBoundsAccessChain %41 %14 %27
OpStore %71 %28
%72 = OpInBoundsAccessChain %41 %14 %8
OpStore %72 %30
%73 = OpInBoundsAccessChain %41 %15 %21
OpStore %73 %59
%74 = OpInBoundsAccessChain %41 %15 %24
OpStore %74 %35
%75 = OpInBoundsAccessChain %41 %15 %27
OpStore %75 %37
%76 = OpInBoundsAccessChain %41 %15 %8
OpStore %76 %39
OpEmitVertex
%77 = OpInBoundsAccessChain %41 %14 %21
OpStore %77 %22
%78 = OpInBoundsAccessChain %41 %14 %24
OpStore %78 %25
%79 = OpInBoundsAccessChain %41 %14 %27
OpStore %79 %28
%80 = OpInBoundsAccessChain %41 %14 %8
OpStore %80 %30
%81 = OpInBoundsAccessChain %41 %15 %21
OpStore %81 %59
%82 = OpInBoundsAccessChain %41 %15 %24
OpStore %82 %35
%83 = OpInBoundsAccessChain %41 %15 %27
OpStore %83 %37
%84 = OpInBoundsAccessChain %41 %15 %8
OpStore %84 %39
OpEmitVertex
%85 = OpInBoundsAccessChain %41 %14 %21
OpStore %85 %22
%86 = OpInBoundsAccessChain %41 %14 %24
OpStore %86 %25
%87 = OpInBoundsAccessChain %41 %14 %27
OpStore %87 %28
%88 = OpInBoundsAccessChain %41 %14 %8
OpStore %88 %30
%89 = OpInBoundsAccessChain %41 %15 %21
OpStore %89 %59
%90 = OpInBoundsAccessChain %41 %15 %24
OpStore %90 %35
%91 = OpInBoundsAccessChain %41 %15 %27
OpStore %91 %37
%92 = OpInBoundsAccessChain %41 %15 %8
OpStore %92 %39
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
