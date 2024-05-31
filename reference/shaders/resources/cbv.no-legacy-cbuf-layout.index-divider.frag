#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[256];
} _12;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _23 = INDEX + 64u;
    float _29 = _12._m0[_23].x + _12._m0[INDEX].x;
    float _30 = _12._m0[_23].y + _12._m0[INDEX].x;
    uint _31 = INDEX + 128u;
    uint _42 = INDEX + 192u;
    SV_Target.x = (_29 + _12._m0[_31].x) + _12._m0[_42].x;
    SV_Target.y = (_30 + _12._m0[_31].y) + _12._m0[_42].y;
    SV_Target.z = (_29 + _12._m0[_31].z) + _12._m0[_42].z;
    SV_Target.w = (_30 + _12._m0[_31].x) + _12._m0[_42].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "INDEX"
OpName %16 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 256
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypePointer Output %8
%16 = OpVariable %15 Output
%18 = OpTypePointer Uniform %8
%20 = OpConstant %5 0
%24 = OpConstant %5 64
%32 = OpConstant %5 128
%43 = OpConstant %5 192
%54 = OpTypePointer Output %7
%57 = OpConstant %5 1
%59 = OpConstant %5 2
%61 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %62
%62 = OpLabel
%17 = OpLoad %5 %14
%19 = OpAccessChain %18 %12 %20 %17
%21 = OpLoad %8 %19
%22 = OpCompositeExtract %7 %21 0
%23 = OpIAdd %5 %17 %24
%25 = OpAccessChain %18 %12 %20 %23
%26 = OpLoad %8 %25
%27 = OpCompositeExtract %7 %26 0
%28 = OpCompositeExtract %7 %26 1
%29 = OpFAdd %7 %27 %22
%30 = OpFAdd %7 %28 %22
%31 = OpIAdd %5 %17 %32
%33 = OpAccessChain %18 %12 %20 %31
%34 = OpLoad %8 %33
%35 = OpCompositeExtract %7 %34 0
%36 = OpCompositeExtract %7 %34 1
%37 = OpCompositeExtract %7 %34 2
%38 = OpFAdd %7 %29 %35
%39 = OpFAdd %7 %30 %36
%40 = OpFAdd %7 %29 %37
%41 = OpFAdd %7 %30 %35
%42 = OpIAdd %5 %17 %43
%44 = OpAccessChain %18 %12 %20 %42
%45 = OpLoad %8 %44
%46 = OpCompositeExtract %7 %45 0
%47 = OpCompositeExtract %7 %45 1
%48 = OpCompositeExtract %7 %45 2
%49 = OpCompositeExtract %7 %45 3
%50 = OpFAdd %7 %38 %46
%51 = OpFAdd %7 %39 %47
%52 = OpFAdd %7 %40 %48
%53 = OpFAdd %7 %41 %49
%55 = OpAccessChain %54 %16 %20
OpStore %55 %50
%56 = OpAccessChain %54 %16 %57
OpStore %56 %51
%58 = OpAccessChain %54 %16 %59
OpStore %58 %52
%60 = OpAccessChain %54 %16 %61
OpStore %60 %53
OpReturn
OpFunctionEnd
#endif
