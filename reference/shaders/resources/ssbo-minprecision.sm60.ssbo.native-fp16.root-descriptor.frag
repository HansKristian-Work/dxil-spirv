#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_buffer_reference : require

struct AddCarry
{
    uint _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloatNonWrite;
layout(buffer_reference) buffer PhysicalPointerFloat;
layout(buffer_reference) buffer PhysicalPointerUint;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloatNonWrite
{
    float value;
};

layout(buffer_reference, std430) buffer PhysicalPointerFloat
{
    float value;
};

layout(buffer_reference, std430) buffer PhysicalPointerUint
{
    uint value;
};

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13;

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

float16_t _84;
uint16_t _108;

void main()
{
    uint16_t _31 = uint16_t(A);
    uint _32 = uint(int16_t(_31));
    AddCarry _43;
    _43._m0 = uaddCarry(registers._m1.x, (_32 * 4u) + 0u, _43._m1);
    uint _56 = uint(int16_t(_31 + 1us));
    AddCarry _61;
    _61._m0 = uaddCarry(registers._m1.x, (_56 * 4u) + 0u, _61._m1);
    AddCarry _77;
    _77._m0 = uaddCarry(registers._m2.x, (_32 * 4u) + 0u, _77._m1);
    PhysicalPointerFloat(uvec2(_77._m0, registers._m2.y + _77._m1)).value = float(float16_t(PhysicalPointerFloatNonWrite(uvec2(_61._m0, registers._m1.y + _61._m1)).value) + float16_t(PhysicalPointerFloatNonWrite(uvec2(_43._m0, registers._m1.y + _43._m1)).value));
    AddCarry _100;
    _100._m0 = uaddCarry(registers._m3.x, (_32 * 4u) + 0u, _100._m1);
    PhysicalPointerUint(uvec2(_100._m0, registers._m3.y + _100._m1)).value = uint(uint16_t(_13._m0[_56]) + uint16_t(_13._m0[_32]));
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 114
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %11 "SSBO"
OpName %16 "A"
OpName %18 "SV_Target"
OpName %34 "PhysicalPointerFloatNonWrite"
OpMemberName %34 0 "value"
OpName %42 "AddCarry"
OpName %71 "PhysicalPointerFloat"
OpMemberName %71 0 "value"
OpName %94 "PhysicalPointerUint"
OpMemberName %94 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %16 RelaxedPrecision
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpMemberDecorate %34 0 NonWritable
OpMemberDecorate %71 0 Offset 0
OpDecorate %71 Block
OpMemberDecorate %94 0 Offset 0
OpDecorate %94 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeInt 32 1
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %14
%18 = OpVariable %17 Output
%19 = OpTypePointer PushConstant %6
%21 = OpConstant %5 3
%24 = OpConstant %5 2
%27 = OpConstant %5 1
%30 = OpTypeInt 16 0
%33 = OpTypeFloat 32
%34 = OpTypeStruct %33
%35 = OpTypePointer PhysicalStorageBuffer %34
%36 = OpConstant %5 0
%38 = OpConstant %5 4
%42 = OpTypeStruct %5 %5
%49 = OpTypePointer PhysicalStorageBuffer %33
%52 = OpTypeFloat 16
%55 = OpConstant %30 1
%71 = OpTypeStruct %33
%72 = OpTypePointer PhysicalStorageBuffer %71
%86 = OpTypePointer StorageBuffer %5
%94 = OpTypeStruct %5
%95 = OpTypePointer PhysicalStorageBuffer %94
%106 = OpTypePointer PhysicalStorageBuffer %5
%110 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%84 = OpUndef %52
%108 = OpUndef %30
OpBranch %112
%112 = OpLabel
%20 = OpAccessChain %19 %9 %21
%22 = OpLoad %6 %20
%23 = OpAccessChain %19 %9 %24
%25 = OpLoad %6 %23
%26 = OpAccessChain %19 %9 %27
%28 = OpLoad %6 %26
%29 = OpLoad %14 %16
%31 = OpSConvert %30 %29
%32 = OpSConvert %5 %31
%37 = OpIMul %5 %32 %38
%39 = OpIAdd %5 %37 %36
%40 = OpCompositeExtract %5 %28 0
%41 = OpCompositeExtract %5 %28 1
%43 = OpIAddCarry %42 %40 %39
%44 = OpCompositeExtract %5 %43 0
%45 = OpCompositeExtract %5 %43 1
%46 = OpIAdd %5 %41 %45
%47 = OpCompositeConstruct %6 %44 %46
%48 = OpBitcast %35 %47
%50 = OpAccessChain %49 %48 %36
%51 = OpLoad %33 %50 Aligned 4
%53 = OpFConvert %52 %51
%54 = OpIAdd %30 %31 %55
%56 = OpSConvert %5 %54
%57 = OpIMul %5 %56 %38
%58 = OpIAdd %5 %57 %36
%59 = OpCompositeExtract %5 %28 0
%60 = OpCompositeExtract %5 %28 1
%61 = OpIAddCarry %42 %59 %58
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpIAdd %5 %60 %63
%65 = OpCompositeConstruct %6 %62 %64
%66 = OpBitcast %35 %65
%67 = OpAccessChain %49 %66 %36
%68 = OpLoad %33 %67 Aligned 4
%69 = OpFConvert %52 %68
%70 = OpFAdd %52 %69 %53
%73 = OpIMul %5 %32 %38
%74 = OpIAdd %5 %73 %36
%75 = OpCompositeExtract %5 %25 0
%76 = OpCompositeExtract %5 %25 1
%77 = OpIAddCarry %42 %75 %74
%78 = OpCompositeExtract %5 %77 0
%79 = OpCompositeExtract %5 %77 1
%80 = OpIAdd %5 %76 %79
%81 = OpCompositeConstruct %6 %78 %80
%82 = OpBitcast %72 %81
%83 = OpAccessChain %49 %82 %36
%85 = OpFConvert %33 %70
OpStore %83 %85 Aligned 4
%87 = OpAccessChain %86 %13 %36 %32
%88 = OpLoad %5 %87
%89 = OpUConvert %30 %88
%90 = OpAccessChain %86 %13 %36 %56
%91 = OpLoad %5 %90
%92 = OpUConvert %30 %91
%93 = OpIAdd %30 %92 %89
%96 = OpIMul %5 %32 %38
%97 = OpIAdd %5 %96 %36
%98 = OpCompositeExtract %5 %22 0
%99 = OpCompositeExtract %5 %22 1
%100 = OpIAddCarry %42 %98 %97
%101 = OpCompositeExtract %5 %100 0
%102 = OpCompositeExtract %5 %100 1
%103 = OpIAdd %5 %99 %102
%104 = OpCompositeConstruct %6 %101 %103
%105 = OpBitcast %95 %104
%107 = OpAccessChain %106 %105 %36
%109 = OpUConvert %5 %93
OpStore %107 %109 Aligned 4
%111 = OpBitcast %14 %110
OpStore %18 %111
OpReturn
OpFunctionEnd
#endif
