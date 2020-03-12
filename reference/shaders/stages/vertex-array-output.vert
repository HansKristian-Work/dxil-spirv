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
