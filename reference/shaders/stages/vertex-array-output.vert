#version 460

layout(location = 0) in vec4 POSITION;
layout(location = 1) out vec4 ATTR[4];
layout(location = 5) out float ATTR_4[4];

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
    ATTR_4[0u] = POSITION.x;
    ATTR_4[1u] = POSITION.y;
    ATTR_4[2u] = POSITION.z;
    ATTR_4[3u] = POSITION.w;
}


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
OpName %18 "ATTR_4"
OpDecorate %8 Location 0
OpDecorate %10 BuiltIn Position
OpDecorate %15 Location 1
OpDecorate %18 Location 5
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
%33 = OpConstant %5 1
%38 = OpConstant %5 2
%43 = OpConstant %5 3
%47 = OpTypePointer Output %5
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
%32 = OpFAdd %5 %22 %33
%34 = OpFAdd %5 %25 %33
%35 = OpFAdd %5 %28 %33
%36 = OpFAdd %5 %31 %33
%37 = OpFAdd %5 %22 %38
%39 = OpFAdd %5 %25 %38
%40 = OpFAdd %5 %28 %38
%41 = OpFAdd %5 %31 %38
%42 = OpFAdd %5 %22 %43
%44 = OpFAdd %5 %25 %43
%45 = OpFAdd %5 %28 %43
%46 = OpFAdd %5 %31 %43
%48 = OpAccessChain %47 %10 %21
OpStore %48 %22
%49 = OpAccessChain %47 %10 %24
OpStore %49 %25
%50 = OpAccessChain %47 %10 %27
OpStore %50 %28
%51 = OpAccessChain %47 %10 %30
OpStore %51 %31
%52 = OpAccessChain %47 %15 %21 %21
OpStore %52 %22
%53 = OpAccessChain %47 %15 %21 %24
OpStore %53 %25
%54 = OpAccessChain %47 %15 %21 %27
OpStore %54 %28
%55 = OpAccessChain %47 %15 %21 %30
OpStore %55 %31
%56 = OpAccessChain %47 %15 %24 %21
OpStore %56 %32
%57 = OpAccessChain %47 %15 %24 %24
OpStore %57 %34
%58 = OpAccessChain %47 %15 %24 %27
OpStore %58 %35
%59 = OpAccessChain %47 %15 %24 %30
OpStore %59 %36
%60 = OpAccessChain %47 %15 %27 %21
OpStore %60 %37
%61 = OpAccessChain %47 %15 %27 %24
OpStore %61 %39
%62 = OpAccessChain %47 %15 %27 %27
OpStore %62 %40
%63 = OpAccessChain %47 %15 %27 %30
OpStore %63 %41
%64 = OpAccessChain %47 %15 %30 %21
OpStore %64 %42
%65 = OpAccessChain %47 %15 %30 %24
OpStore %65 %44
%66 = OpAccessChain %47 %15 %30 %27
OpStore %66 %45
%67 = OpAccessChain %47 %15 %30 %30
OpStore %67 %46
%68 = OpAccessChain %47 %18 %21
OpStore %68 %22
%69 = OpAccessChain %47 %18 %24
OpStore %69 %25
%70 = OpAccessChain %47 %18 %27
OpStore %70 %28
%71 = OpAccessChain %47 %18 %30
OpStore %71 %31
OpReturn
OpFunctionEnd
#endif
