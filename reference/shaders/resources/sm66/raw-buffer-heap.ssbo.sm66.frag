#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) coherent writeonly buffer _12_15
{
    uint _m0[];
} _15[];

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in ivec3 UV;
layout(location = 0) out vec3 SV_Target;

void main()
{
    uint _38 = INDEX + 1u;
    uint _41 = uint(UV.x) >> 2u;
    uvec3 _53 = uvec3(_10[INDEX]._m0[_41], _10[INDEX]._m0[_41 + 1u], _10[INDEX]._m0[_41 + 2u]);
    uint _54 = _53.x;
    uint _55 = _53.y;
    uint _56 = _53.z;
    uint _60 = uint(UV.y) >> 2u;
    _15[_38]._m0[_60] = _54;
    _15[_38]._m0[_60 + 1u] = _55;
    _15[_38]._m0[_60 + 2u] = _56;
    SV_Target.x = uintBitsToFloat(_54);
    SV_Target.y = uintBitsToFloat(_55);
    SV_Target.z = uintBitsToFloat(_56);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %21 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "SSBO"
OpName %17 "INDEX"
OpName %21 "UV"
OpName %25 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 4
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %15 NonReadable
OpDecorate %15 Coherent
OpDecorate %17 Flat
OpDecorate %17 Location 0
OpDecorate %21 Flat
OpDecorate %21 Location 0
OpDecorate %21 Component 1
OpDecorate %25 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %5
%12 = OpTypeStruct %11
%13 = OpTypeRuntimeArray %12
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypePointer Input %5
%17 = OpVariable %16 Input
%18 = OpTypeInt 32 1
%19 = OpTypeVector %18 3
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeFloat 32
%23 = OpTypeVector %22 3
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Input %18
%28 = OpConstant %5 0
%32 = OpConstant %5 1
%36 = OpTypePointer StorageBuffer %7
%39 = OpTypePointer StorageBuffer %12
%42 = OpConstant %5 2
%43 = OpTypePointer StorageBuffer %5
%52 = OpTypeVector %5 3
%66 = OpTypePointer Output %22
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%27 = OpAccessChain %26 %21 %28
%29 = OpLoad %18 %27
%30 = OpBitcast %5 %29
%31 = OpAccessChain %26 %21 %32
%33 = OpLoad %18 %31
%34 = OpBitcast %5 %33
%35 = OpLoad %5 %17
%37 = OpAccessChain %36 %10 %35
%38 = OpIAdd %5 %35 %32
%40 = OpAccessChain %39 %15 %38
%41 = OpShiftRightLogical %5 %30 %42
%44 = OpAccessChain %43 %37 %28 %41
%45 = OpLoad %5 %44
%47 = OpIAdd %5 %41 %32
%46 = OpAccessChain %43 %37 %28 %47
%48 = OpLoad %5 %46
%50 = OpIAdd %5 %41 %42
%49 = OpAccessChain %43 %37 %28 %50
%51 = OpLoad %5 %49
%53 = OpCompositeConstruct %52 %45 %48 %51
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeExtract %5 %53 2
%57 = OpBitcast %22 %54
%58 = OpBitcast %22 %55
%59 = OpBitcast %22 %56
%60 = OpShiftRightLogical %5 %34 %42
%61 = OpAccessChain %43 %40 %28 %60
OpStore %61 %54
%63 = OpIAdd %5 %60 %32
%62 = OpAccessChain %43 %40 %28 %63
OpStore %62 %55
%65 = OpIAdd %5 %60 %42
%64 = OpAccessChain %43 %40 %28 %65
OpStore %64 %56
%67 = OpAccessChain %66 %25 %28
OpStore %67 %57
%68 = OpAccessChain %66 %25 %32
OpStore %68 %58
%69 = OpAccessChain %66 %25 %42
OpStore %69 %59
OpReturn
OpFunctionEnd
#endif
