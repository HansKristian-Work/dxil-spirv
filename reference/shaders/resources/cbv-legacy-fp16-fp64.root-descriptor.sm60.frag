#version 460
#extension GL_ARB_gpu_shader_int64 : require
#extension GL_EXT_buffer_reference : require

struct AddCarry
{
    uint _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloat4NonWrite;
layout(buffer_reference) buffer PhysicalPointerUint642NonWrite;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloat4NonWrite
{
    vec4 value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUint642NonWrite
{
    u64vec2 value;
};

layout(push_constant, std430) uniform RootConstants
{
    uvec2 _m0;
    uvec2 _m1;
    uvec2 _m2;
    uvec2 _m3;
} registers;

layout(location = 0) out vec4 SV_Target;

void main()
{
    AddCarry _23;
    _23._m0 = uaddCarry(registers._m0.x, 0u * 16u, _23._m1);
    PhysicalPointerFloat4NonWrite _30 = PhysicalPointerFloat4NonWrite(uvec2(_23._m0, registers._m0.y + _23._m1));
    AddCarry _42;
    _42._m0 = uaddCarry(registers._m0.x, 1u * 16u, _42._m1);
    PhysicalPointerFloat4NonWrite _47 = PhysicalPointerFloat4NonWrite(uvec2(_42._m0, registers._m0.y + _42._m1));
    AddCarry _62;
    _62._m0 = uaddCarry(registers._m0.x, 2u * 16u, _62._m1);
    PhysicalPointerFloat4NonWrite _67 = PhysicalPointerFloat4NonWrite(uvec2(_62._m0, registers._m0.y + _62._m1));
    AddCarry _83;
    _83._m0 = uaddCarry(registers._m0.x, 3u * 16u, _83._m1);
    PhysicalPointerUint642NonWrite _91 = PhysicalPointerUint642NonWrite(uvec2(_83._m0, registers._m0.y + _83._m1));
    AddCarry _101;
    _101._m0 = uaddCarry(registers._m0.x, 4u * 16u, _101._m1);
    PhysicalPointerUint642NonWrite _106 = PhysicalPointerUint642NonWrite(uvec2(_101._m0, registers._m0.y + _101._m1));
    SV_Target.x = ((_47.value.x + _30.value.x) + _67.value.x) + float(int64_t(_91.value.x));
    SV_Target.y = ((_47.value.y + _30.value.y) + _67.value.y) + float(int64_t(_91.value.y));
    SV_Target.z = ((_47.value.z + _30.value.z) + _67.value.z) + float(int64_t(_106.value.x));
    SV_Target.w = ((_47.value.w + _30.value.w) + _67.value.w) + float(int64_t(_106.value.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability Int64
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "RootConstants"
OpName %9 "registers"
OpName %13 "SV_Target"
OpName %22 "AddCarry"
OpName %28 "PhysicalPointerFloat4NonWrite"
OpMemberName %28 0 "value"
OpName %89 "PhysicalPointerUint642NonWrite"
OpMemberName %89 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpMemberDecorate %28 0 NonWritable
OpMemberDecorate %89 0 Offset 0
OpDecorate %89 Block
OpMemberDecorate %89 0 NonWritable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeStruct %6 %6 %6 %6
%8 = OpTypePointer PushConstant %7
%9 = OpVariable %8 PushConstant
%10 = OpTypeFloat 32
%11 = OpTypeVector %10 4
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypePointer PushConstant %6
%16 = OpConstant %5 0
%19 = OpConstant %5 16
%22 = OpTypeStruct %5 %5
%28 = OpTypeStruct %11
%29 = OpTypePointer PhysicalStorageBuffer %28
%31 = OpTypePointer PhysicalStorageBuffer %11
%38 = OpConstant %5 1
%58 = OpConstant %5 2
%78 = OpConstant %5 3
%80 = OpTypeInt 64 0
%88 = OpTypeVector %80 2
%89 = OpTypeStruct %88
%90 = OpTypePointer PhysicalStorageBuffer %89
%92 = OpTypePointer PhysicalStorageBuffer %88
%97 = OpConstant %5 4
%119 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %124
%124 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%18 = OpIMul %5 %16 %19
%20 = OpCompositeExtract %5 %17 0
%21 = OpCompositeExtract %5 %17 1
%23 = OpIAddCarry %22 %20 %18
%24 = OpCompositeExtract %5 %23 0
%25 = OpCompositeExtract %5 %23 1
%26 = OpIAdd %5 %21 %25
%27 = OpCompositeConstruct %6 %24 %26
%30 = OpBitcast %29 %27
%32 = OpAccessChain %31 %30 %16
%33 = OpLoad %11 %32 Aligned 16
%34 = OpCompositeExtract %10 %33 0
%35 = OpCompositeExtract %10 %33 1
%36 = OpCompositeExtract %10 %33 2
%37 = OpCompositeExtract %10 %33 3
%39 = OpIMul %5 %38 %19
%40 = OpCompositeExtract %5 %17 0
%41 = OpCompositeExtract %5 %17 1
%42 = OpIAddCarry %22 %40 %39
%43 = OpCompositeExtract %5 %42 0
%44 = OpCompositeExtract %5 %42 1
%45 = OpIAdd %5 %41 %44
%46 = OpCompositeConstruct %6 %43 %45
%47 = OpBitcast %29 %46
%48 = OpAccessChain %31 %47 %16
%49 = OpLoad %11 %48 Aligned 16
%50 = OpCompositeExtract %10 %49 0
%51 = OpCompositeExtract %10 %49 1
%52 = OpCompositeExtract %10 %49 2
%53 = OpCompositeExtract %10 %49 3
%54 = OpFAdd %10 %50 %34
%55 = OpFAdd %10 %51 %35
%56 = OpFAdd %10 %52 %36
%57 = OpFAdd %10 %53 %37
%59 = OpIMul %5 %58 %19
%60 = OpCompositeExtract %5 %17 0
%61 = OpCompositeExtract %5 %17 1
%62 = OpIAddCarry %22 %60 %59
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%65 = OpIAdd %5 %61 %64
%66 = OpCompositeConstruct %6 %63 %65
%67 = OpBitcast %29 %66
%68 = OpAccessChain %31 %67 %16
%69 = OpLoad %11 %68 Aligned 16
%70 = OpCompositeExtract %10 %69 0
%71 = OpCompositeExtract %10 %69 1
%72 = OpCompositeExtract %10 %69 2
%73 = OpCompositeExtract %10 %69 3
%74 = OpFAdd %10 %54 %70
%75 = OpFAdd %10 %55 %71
%76 = OpFAdd %10 %56 %72
%77 = OpFAdd %10 %57 %73
%79 = OpIMul %5 %78 %19
%81 = OpCompositeExtract %5 %17 0
%82 = OpCompositeExtract %5 %17 1
%83 = OpIAddCarry %22 %81 %79
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %5 %83 1
%86 = OpIAdd %5 %82 %85
%87 = OpCompositeConstruct %6 %84 %86
%91 = OpBitcast %90 %87
%93 = OpAccessChain %92 %91 %16
%94 = OpLoad %88 %93 Aligned 16
%95 = OpCompositeExtract %80 %94 0
%96 = OpCompositeExtract %80 %94 1
%98 = OpIMul %5 %97 %19
%99 = OpCompositeExtract %5 %17 0
%100 = OpCompositeExtract %5 %17 1
%101 = OpIAddCarry %22 %99 %98
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpIAdd %5 %100 %103
%105 = OpCompositeConstruct %6 %102 %104
%106 = OpBitcast %90 %105
%107 = OpAccessChain %92 %106 %16
%108 = OpLoad %88 %107 Aligned 16
%109 = OpCompositeExtract %80 %108 0
%110 = OpCompositeExtract %80 %108 1
%111 = OpConvertSToF %10 %95
%112 = OpConvertSToF %10 %96
%113 = OpConvertSToF %10 %109
%114 = OpConvertSToF %10 %110
%115 = OpFAdd %10 %74 %111
%116 = OpFAdd %10 %75 %112
%117 = OpFAdd %10 %76 %113
%118 = OpFAdd %10 %77 %114
%120 = OpAccessChain %119 %13 %16
OpStore %120 %115
%121 = OpAccessChain %119 %13 %38
OpStore %121 %116
%122 = OpAccessChain %119 %13 %58
OpStore %122 %117
%123 = OpAccessChain %119 %13 %78
OpStore %123 %118
OpReturn
OpFunctionEnd
#endif
