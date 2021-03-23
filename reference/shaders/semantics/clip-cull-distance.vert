#version 460

out float gl_ClipDistance[4];
out float gl_CullDistance[4];

layout(location = 0) in vec4 POS;
layout(location = 1) in vec4 CLIP;
layout(location = 2) in vec4 CULL;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP.x;
    gl_ClipDistance[1u] = CLIP.y;
    gl_ClipDistance[2u] = CLIP.z;
    gl_ClipDistance[3u] = CLIP.w;
    gl_CullDistance[0u] = CULL.x;
    gl_CullDistance[1u] = CULL.y;
    gl_CullDistance[2u] = CULL.z;
    gl_CullDistance[3u] = CULL.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 62
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %9 %10 %12 %17 %18
OpName %3 "main"
OpName %8 "POS"
OpName %9 "CLIP"
OpName %10 "CULL"
OpName %12 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %10 Location 2
OpDecorate %12 BuiltIn Position
OpDecorate %17 BuiltIn ClipDistance
OpDecorate %18 BuiltIn CullDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypeInt 32 0
%14 = OpConstant %13 4
%15 = OpTypeArray %5 %14
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %13 0
%24 = OpConstant %13 1
%27 = OpConstant %13 2
%30 = OpConstant %13 3
%48 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%20 = OpAccessChain %19 %10 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %10 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %10 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %10 %30
%31 = OpLoad %5 %29
%32 = OpAccessChain %19 %9 %21
%33 = OpLoad %5 %32
%34 = OpAccessChain %19 %9 %24
%35 = OpLoad %5 %34
%36 = OpAccessChain %19 %9 %27
%37 = OpLoad %5 %36
%38 = OpAccessChain %19 %9 %30
%39 = OpLoad %5 %38
%40 = OpAccessChain %19 %8 %21
%41 = OpLoad %5 %40
%42 = OpAccessChain %19 %8 %24
%43 = OpLoad %5 %42
%44 = OpAccessChain %19 %8 %27
%45 = OpLoad %5 %44
%46 = OpAccessChain %19 %8 %30
%47 = OpLoad %5 %46
%49 = OpAccessChain %48 %12 %21
OpStore %49 %41
%50 = OpAccessChain %48 %12 %24
OpStore %50 %43
%51 = OpAccessChain %48 %12 %27
OpStore %51 %45
%52 = OpAccessChain %48 %12 %30
OpStore %52 %47
%53 = OpAccessChain %48 %17 %21
OpStore %53 %33
%54 = OpAccessChain %48 %17 %24
OpStore %54 %35
%55 = OpAccessChain %48 %17 %27
OpStore %55 %37
%56 = OpAccessChain %48 %17 %30
OpStore %56 %39
%57 = OpAccessChain %48 %18 %21
OpStore %57 %22
%58 = OpAccessChain %48 %18 %24
OpStore %58 %25
%59 = OpAccessChain %48 %18 %27
OpStore %59 %28
%60 = OpAccessChain %48 %18 %30
OpStore %60 %31
OpReturn
OpFunctionEnd
#endif
