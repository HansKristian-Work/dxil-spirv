#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_buffer_reference_uvec2 : require

layout(buffer_reference, buffer_reference_align = 4) buffer uintPointer
{
    uint value;
};

layout(set = 7, binding = 0, std430) readonly buffer AtomicCounters
{
    uvec2 counters[];
} _13;

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uvec4 _m0[];
} _19[];

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(location = 0) flat in uint I;
layout(location = 0) out vec4 SV_Target;

uint RobustPhysicalAtomicCounter(uvec2 _34, uint _35, uint _36)
{
    uint _51;
    if (any(notEqual(_34, uvec2(0u))))
    {
        uint _48 = atomicAdd(uintPointer(_34), _35);
        _51 = _48 + _36;
    }
    else
    {
        _51 = 0u;
    }
    return _51;
}

void main()
{
    uvec2 _32 = _13.counters[14u];
    uint _53 = RobustPhysicalAtomicCounter(_32, 1u, 0u);
    vec4 _57 = uintBitsToFloat(_19[14u]._m0[_53]);
    SV_Target.x = _57.x;
    SV_Target.y = _57.y;
    SV_Target.z = _57.z;
    SV_Target.w = _57.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 71
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %21 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %11 "AtomicCounters"
OpMemberName %11 0 "counters"
OpName %16 "SSBO"
OpName %21 "I"
OpName %25 "SV_Target"
OpName %37 "RobustPhysicalAtomicCounter"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %10 ArrayStride 8
OpDecorate %11 Block
OpMemberDecorate %11 0 Offset 0
OpMemberDecorate %11 0 NonWritable
OpDecorate %13 DescriptorSet 7
OpDecorate %13 Binding 0
OpDecorate %13 AliasedPointer
OpDecorate %15 ArrayStride 16
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 0
OpDecorate %21 Flat
OpDecorate %21 Location 0
OpDecorate %25 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeVector %5 2
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeVector %5 4
%15 = OpTypeRuntimeArray %14
%16 = OpTypeStruct %15
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer StorageBuffer %17
%19 = OpVariable %18 StorageBuffer
%20 = OpTypePointer Input %5
%21 = OpVariable %20 Input
%22 = OpTypeFloat 32
%23 = OpTypeVector %22 4
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer StorageBuffer %16
%28 = OpConstant %5 14
%29 = OpTypePointer StorageBuffer %9
%31 = OpConstant %5 0
%33 = OpTypeFunction %5 %9 %5 %5
%41 = OpTypeBool
%42 = OpTypeVector %41 2
%43 = OpConstantNull %9
%46 = OpTypePointer PhysicalStorageBuffer %5
%49 = OpConstant %5 1
%54 = OpTypePointer StorageBuffer %14
%62 = OpTypePointer Output %22
%66 = OpConstant %5 2
%68 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %69
%69 = OpLabel
%27 = OpAccessChain %26 %19 %28
%30 = OpAccessChain %29 %13 %31 %28
%32 = OpLoad %9 %30
%53 = OpFunctionCall %5 %37 %32 %49 %31
%55 = OpAccessChain %54 %27 %31 %53
%56 = OpLoad %14 %55
%57 = OpBitcast %23 %56
%58 = OpCompositeExtract %22 %57 0
%59 = OpCompositeExtract %22 %57 1
%60 = OpCompositeExtract %22 %57 2
%61 = OpCompositeExtract %22 %57 3
%63 = OpAccessChain %62 %25 %31
OpStore %63 %58
%64 = OpAccessChain %62 %25 %49
OpStore %64 %59
%65 = OpAccessChain %62 %25 %66
OpStore %65 %60
%67 = OpAccessChain %62 %25 %68
OpStore %67 %61
OpReturn
OpFunctionEnd
%37 = OpFunction %5 None %33
%34 = OpFunctionParameter %9
%35 = OpFunctionParameter %5
%36 = OpFunctionParameter %5
%38 = OpLabel
%44 = OpINotEqual %42 %34 %43
%45 = OpAny %41 %44
OpSelectionMerge %40 None
OpBranchConditional %45 %39 %40
%39 = OpLabel
%47 = OpBitcast %46 %34
%48 = OpAtomicIAdd %5 %47 %49 %31 %35
%50 = OpIAdd %5 %48 %36
OpBranch %40
%40 = OpLabel
%51 = OpPhi %5 %31 %38 %50 %39
OpReturnValue %51
OpFunctionEnd
#endif
