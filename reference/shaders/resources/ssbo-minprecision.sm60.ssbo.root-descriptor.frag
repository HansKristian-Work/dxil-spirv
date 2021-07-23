#version 460
#extension GL_EXT_buffer_reference : require

struct AddCarry
{
    uint _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloatNonWrite;
layout(buffer_reference) buffer PhysicalPointerFloat;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloatNonWrite
{
    float value;
};

layout(buffer_reference, std430) buffer PhysicalPointerFloat
{
    float value;
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

float _70;

void main()
{
    uint _23 = uint(A);
    AddCarry _34;
    _34._m0 = uaddCarry(registers._m1.x, (_23 * 4u) + 0u, _34._m1);
    AddCarry _48;
    _48._m0 = uaddCarry(registers._m1.x, ((_23 + 1u) * 4u) + 0u, _48._m1);
    AddCarry _63;
    _63._m0 = uaddCarry(registers._m2.x, (_23 * 4u) + 0u, _63._m1);
    PhysicalPointerFloat(uvec2(_63._m0, registers._m2.y + _63._m1)).value = PhysicalPointerFloatNonWrite(uvec2(_48._m0, registers._m1.y + _48._m1)).value + PhysicalPointerFloatNonWrite(uvec2(_34._m0, registers._m1.y + _34._m1)).value;
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 75
; Schema: 0
OpCapability Shader
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %12 "A"
OpName %14 "SV_Target"
OpName %25 "PhysicalPointerFloatNonWrite"
OpMemberName %25 0 "value"
OpName %33 "AddCarry"
OpName %57 "PhysicalPointerFloat"
OpMemberName %57 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %12 RelaxedPrecision
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
OpMemberDecorate %25 0 Offset 0
OpDecorate %25 Block
OpMemberDecorate %25 0 NonWritable
OpMemberDecorate %57 0 Offset 0
OpDecorate %57 Block
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeInt 32 1
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %10
%14 = OpVariable %13 Output
%15 = OpTypePointer PushConstant %6
%17 = OpConstant %5 2
%20 = OpConstant %5 1
%24 = OpTypeFloat 32
%25 = OpTypeStruct %24
%26 = OpTypePointer PhysicalStorageBuffer %25
%27 = OpConstant %5 0
%29 = OpConstant %5 4
%33 = OpTypeStruct %5 %5
%40 = OpTypePointer PhysicalStorageBuffer %24
%57 = OpTypeStruct %24
%58 = OpTypePointer PhysicalStorageBuffer %57
%71 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
%70 = OpUndef %24
OpBranch %73
%73 = OpLabel
%16 = OpAccessChain %15 %9 %17
%18 = OpLoad %6 %16
%19 = OpAccessChain %15 %9 %20
%21 = OpLoad %6 %19
%22 = OpLoad %10 %12
%23 = OpBitcast %5 %22
%28 = OpIMul %5 %23 %29
%30 = OpIAdd %5 %28 %27
%31 = OpCompositeExtract %5 %21 0
%32 = OpCompositeExtract %5 %21 1
%34 = OpIAddCarry %33 %31 %30
%35 = OpCompositeExtract %5 %34 0
%36 = OpCompositeExtract %5 %34 1
%37 = OpIAdd %5 %32 %36
%38 = OpCompositeConstruct %6 %35 %37
%39 = OpBitcast %26 %38
%41 = OpAccessChain %40 %39 %27
%42 = OpLoad %24 %41 Aligned 4
%43 = OpIAdd %5 %23 %20
%44 = OpIMul %5 %43 %29
%45 = OpIAdd %5 %44 %27
%46 = OpCompositeExtract %5 %21 0
%47 = OpCompositeExtract %5 %21 1
%48 = OpIAddCarry %33 %46 %45
%49 = OpCompositeExtract %5 %48 0
%50 = OpCompositeExtract %5 %48 1
%51 = OpIAdd %5 %47 %50
%52 = OpCompositeConstruct %6 %49 %51
%53 = OpBitcast %26 %52
%54 = OpAccessChain %40 %53 %27
%55 = OpLoad %24 %54 Aligned 4
%56 = OpFAdd %24 %55 %42
%59 = OpIMul %5 %23 %29
%60 = OpIAdd %5 %59 %27
%61 = OpCompositeExtract %5 %18 0
%62 = OpCompositeExtract %5 %18 1
%63 = OpIAddCarry %33 %61 %60
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%66 = OpIAdd %5 %62 %65
%67 = OpCompositeConstruct %6 %64 %66
%68 = OpBitcast %58 %67
%69 = OpAccessChain %40 %68 %27
OpStore %69 %56 Aligned 4
%72 = OpBitcast %10 %71
OpStore %14 %72
OpReturn
OpFunctionEnd
#endif
