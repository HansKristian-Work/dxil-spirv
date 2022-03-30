#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
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
    f16vec4 _52 = f16vec4(PhysicalPointerFloat4NonWrite(uvec2(_42._m0, registers._m0.y + _42._m1)).value);
    AddCarry _69;
    _69._m0 = uaddCarry(registers._m0.x, 2u * 16u, _69._m1);
    f16vec4 _77 = f16vec4(PhysicalPointerFloat4NonWrite(uvec2(_69._m0, registers._m0.y + _69._m1)).value);
    AddCarry _95;
    _95._m0 = uaddCarry(registers._m0.x, 3u * 16u, _95._m1);
    PhysicalPointerUint642NonWrite _103 = PhysicalPointerUint642NonWrite(uvec2(_95._m0, registers._m0.y + _95._m1));
    AddCarry _113;
    _113._m0 = uaddCarry(registers._m0.x, 4u * 16u, _113._m1);
    PhysicalPointerUint642NonWrite _118 = PhysicalPointerUint642NonWrite(uvec2(_113._m0, registers._m0.y + _113._m1));
    SV_Target.x = ((float(_52.x) + _30.value.x) + float(_77.x)) + float(int64_t(_103.value.x));
    SV_Target.y = ((float(_52.y) + _30.value.y) + float(_77.y)) + float(int64_t(_103.value.y));
    SV_Target.z = ((float(_52.z) + _30.value.z) + float(_77.z)) + float(int64_t(_118.value.x));
    SV_Target.w = ((float(_52.w) + _30.value.w) + float(_77.w)) + float(int64_t(_118.value.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 138
; Schema: 0
OpCapability Shader
OpCapability Float16
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
OpName %101 "PhysicalPointerUint642NonWrite"
OpMemberName %101 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpMemberDecorate %28 0 NonWritable
OpMemberDecorate %101 0 Offset 0
OpDecorate %101 Block
OpMemberDecorate %101 0 NonWritable
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
%50 = OpTypeFloat 16
%51 = OpTypeVector %50 4
%65 = OpConstant %5 2
%90 = OpConstant %5 3
%92 = OpTypeInt 64 0
%100 = OpTypeVector %92 2
%101 = OpTypeStruct %100
%102 = OpTypePointer PhysicalStorageBuffer %101
%104 = OpTypePointer PhysicalStorageBuffer %100
%109 = OpConstant %5 4
%131 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %136
%136 = OpLabel
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
%52 = OpFConvert %51 %49
%53 = OpCompositeExtract %50 %52 0
%54 = OpCompositeExtract %50 %52 1
%55 = OpCompositeExtract %50 %52 2
%56 = OpCompositeExtract %50 %52 3
%57 = OpFConvert %10 %53
%58 = OpFConvert %10 %54
%59 = OpFConvert %10 %55
%60 = OpFConvert %10 %56
%61 = OpFAdd %10 %57 %34
%62 = OpFAdd %10 %58 %35
%63 = OpFAdd %10 %59 %36
%64 = OpFAdd %10 %60 %37
%66 = OpIMul %5 %65 %19
%67 = OpCompositeExtract %5 %17 0
%68 = OpCompositeExtract %5 %17 1
%69 = OpIAddCarry %22 %67 %66
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpIAdd %5 %68 %71
%73 = OpCompositeConstruct %6 %70 %72
%74 = OpBitcast %29 %73
%75 = OpAccessChain %31 %74 %16
%76 = OpLoad %11 %75 Aligned 16
%77 = OpFConvert %51 %76
%78 = OpCompositeExtract %50 %77 0
%79 = OpCompositeExtract %50 %77 1
%80 = OpCompositeExtract %50 %77 2
%81 = OpCompositeExtract %50 %77 3
%82 = OpFConvert %10 %78
%83 = OpFConvert %10 %79
%84 = OpFConvert %10 %80
%85 = OpFConvert %10 %81
%86 = OpFAdd %10 %61 %82
%87 = OpFAdd %10 %62 %83
%88 = OpFAdd %10 %63 %84
%89 = OpFAdd %10 %64 %85
%91 = OpIMul %5 %90 %19
%93 = OpCompositeExtract %5 %17 0
%94 = OpCompositeExtract %5 %17 1
%95 = OpIAddCarry %22 %93 %91
%96 = OpCompositeExtract %5 %95 0
%97 = OpCompositeExtract %5 %95 1
%98 = OpIAdd %5 %94 %97
%99 = OpCompositeConstruct %6 %96 %98
%103 = OpBitcast %102 %99
%105 = OpAccessChain %104 %103 %16
%106 = OpLoad %100 %105 Aligned 16
%107 = OpCompositeExtract %92 %106 0
%108 = OpCompositeExtract %92 %106 1
%110 = OpIMul %5 %109 %19
%111 = OpCompositeExtract %5 %17 0
%112 = OpCompositeExtract %5 %17 1
%113 = OpIAddCarry %22 %111 %110
%114 = OpCompositeExtract %5 %113 0
%115 = OpCompositeExtract %5 %113 1
%116 = OpIAdd %5 %112 %115
%117 = OpCompositeConstruct %6 %114 %116
%118 = OpBitcast %102 %117
%119 = OpAccessChain %104 %118 %16
%120 = OpLoad %100 %119 Aligned 16
%121 = OpCompositeExtract %92 %120 0
%122 = OpCompositeExtract %92 %120 1
%123 = OpConvertSToF %10 %107
%124 = OpConvertSToF %10 %108
%125 = OpConvertSToF %10 %121
%126 = OpConvertSToF %10 %122
%127 = OpFAdd %10 %86 %123
%128 = OpFAdd %10 %87 %124
%129 = OpFAdd %10 %88 %125
%130 = OpFAdd %10 %89 %126
%132 = OpAccessChain %131 %13 %16
OpStore %132 %127
%133 = OpAccessChain %131 %13 %38
OpStore %133 %128
%134 = OpAccessChain %131 %13 %65
OpStore %134 %129
%135 = OpAccessChain %131 %13 %90
OpStore %135 %130
OpReturn
OpFunctionEnd
#endif
