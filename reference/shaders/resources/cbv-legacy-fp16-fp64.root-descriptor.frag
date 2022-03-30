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

struct CBVComposite16x8
{
    float16_t _m0;
    float16_t _m1;
    float16_t _m2;
    float16_t _m3;
    float16_t _m4;
    float16_t _m5;
    float16_t _m6;
    float16_t _m7;
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
    AddCarry _43;
    _43._m0 = uaddCarry(registers._m0.x, 1u * 16u, _43._m1);
    PhysicalPointerFloat4NonWrite _48 = PhysicalPointerFloat4NonWrite(uvec2(_43._m0, registers._m0.y + _43._m1));
    f16vec2 _56 = unpackFloat2x16(floatBitsToUint(_48.value.x));
    f16vec2 _59 = unpackFloat2x16(floatBitsToUint(_48.value.y));
    f16vec2 _62 = unpackFloat2x16(floatBitsToUint(_48.value.z));
    f16vec2 _65 = unpackFloat2x16(floatBitsToUint(_48.value.w));
    CBVComposite16x8 _69 = CBVComposite16x8(_56.x, _56.y, _59.x, _59.y, _62.x, _62.y, _65.x, _65.y);
    AddCarry _99;
    _99._m0 = uaddCarry(registers._m0.x, 2u * 16u, _99._m1);
    PhysicalPointerUint642NonWrite _107 = PhysicalPointerUint642NonWrite(uvec2(_99._m0, registers._m0.y + _99._m1));
    AddCarry _117;
    _117._m0 = uaddCarry(registers._m0.x, 3u * 16u, _117._m1);
    PhysicalPointerUint642NonWrite _122 = PhysicalPointerUint642NonWrite(uvec2(_117._m0, registers._m0.y + _117._m1));
    SV_Target.x = ((float(_69._m0) + _30.value.x) + float(_69._m4)) + float(int64_t(_107.value.x));
    SV_Target.y = ((float(_69._m1) + _30.value.y) + float(_69._m5)) + float(int64_t(_107.value.y));
    SV_Target.z = ((float(_69._m2) + _30.value.z) + float(_69._m6)) + float(int64_t(_122.value.x));
    SV_Target.w = ((float(_69._m3) + _30.value.w) + float(_69._m7)) + float(int64_t(_122.value.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 142
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
OpName %68 "CBVComposite16x8"
OpName %105 "PhysicalPointerUint642NonWrite"
OpMemberName %105 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpMemberDecorate %28 0 NonWritable
OpMemberDecorate %105 0 Offset 0
OpDecorate %105 Block
OpMemberDecorate %105 0 NonWritable
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
%40 = OpTypeFloat 16
%51 = OpTypeVector %40 2
%68 = OpTypeStruct %40 %40 %40 %40 %40 %40 %40 %40
%94 = OpConstant %5 2
%96 = OpTypeInt 64 0
%104 = OpTypeVector %96 2
%105 = OpTypeStruct %104
%106 = OpTypePointer PhysicalStorageBuffer %105
%108 = OpTypePointer PhysicalStorageBuffer %104
%113 = OpConstant %5 3
%135 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %140
%140 = OpLabel
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
%41 = OpCompositeExtract %5 %17 0
%42 = OpCompositeExtract %5 %17 1
%43 = OpIAddCarry %22 %41 %39
%44 = OpCompositeExtract %5 %43 0
%45 = OpCompositeExtract %5 %43 1
%46 = OpIAdd %5 %42 %45
%47 = OpCompositeConstruct %6 %44 %46
%48 = OpBitcast %29 %47
%49 = OpAccessChain %31 %48 %16
%50 = OpLoad %11 %49 Aligned 16
%52 = OpCompositeExtract %10 %50 0
%53 = OpCompositeExtract %10 %50 1
%54 = OpCompositeExtract %10 %50 2
%55 = OpCompositeExtract %10 %50 3
%56 = OpBitcast %51 %52
%57 = OpCompositeExtract %40 %56 0
%58 = OpCompositeExtract %40 %56 1
%59 = OpBitcast %51 %53
%60 = OpCompositeExtract %40 %59 0
%61 = OpCompositeExtract %40 %59 1
%62 = OpBitcast %51 %54
%63 = OpCompositeExtract %40 %62 0
%64 = OpCompositeExtract %40 %62 1
%65 = OpBitcast %51 %55
%66 = OpCompositeExtract %40 %65 0
%67 = OpCompositeExtract %40 %65 1
%69 = OpCompositeConstruct %68 %57 %58 %60 %61 %63 %64 %66 %67
%70 = OpCompositeExtract %40 %69 0
%71 = OpCompositeExtract %40 %69 1
%72 = OpCompositeExtract %40 %69 2
%73 = OpCompositeExtract %40 %69 3
%74 = OpFConvert %10 %70
%75 = OpFConvert %10 %71
%76 = OpFConvert %10 %72
%77 = OpFConvert %10 %73
%78 = OpFAdd %10 %74 %34
%79 = OpFAdd %10 %75 %35
%80 = OpFAdd %10 %76 %36
%81 = OpFAdd %10 %77 %37
%82 = OpCompositeExtract %40 %69 4
%83 = OpCompositeExtract %40 %69 5
%84 = OpCompositeExtract %40 %69 6
%85 = OpCompositeExtract %40 %69 7
%86 = OpFConvert %10 %82
%87 = OpFConvert %10 %83
%88 = OpFConvert %10 %84
%89 = OpFConvert %10 %85
%90 = OpFAdd %10 %78 %86
%91 = OpFAdd %10 %79 %87
%92 = OpFAdd %10 %80 %88
%93 = OpFAdd %10 %81 %89
%95 = OpIMul %5 %94 %19
%97 = OpCompositeExtract %5 %17 0
%98 = OpCompositeExtract %5 %17 1
%99 = OpIAddCarry %22 %97 %95
%100 = OpCompositeExtract %5 %99 0
%101 = OpCompositeExtract %5 %99 1
%102 = OpIAdd %5 %98 %101
%103 = OpCompositeConstruct %6 %100 %102
%107 = OpBitcast %106 %103
%109 = OpAccessChain %108 %107 %16
%110 = OpLoad %104 %109 Aligned 16
%111 = OpCompositeExtract %96 %110 0
%112 = OpCompositeExtract %96 %110 1
%114 = OpIMul %5 %113 %19
%115 = OpCompositeExtract %5 %17 0
%116 = OpCompositeExtract %5 %17 1
%117 = OpIAddCarry %22 %115 %114
%118 = OpCompositeExtract %5 %117 0
%119 = OpCompositeExtract %5 %117 1
%120 = OpIAdd %5 %116 %119
%121 = OpCompositeConstruct %6 %118 %120
%122 = OpBitcast %106 %121
%123 = OpAccessChain %108 %122 %16
%124 = OpLoad %104 %123 Aligned 16
%125 = OpCompositeExtract %96 %124 0
%126 = OpCompositeExtract %96 %124 1
%127 = OpConvertSToF %10 %111
%128 = OpConvertSToF %10 %112
%129 = OpConvertSToF %10 %125
%130 = OpConvertSToF %10 %126
%131 = OpFAdd %10 %90 %127
%132 = OpFAdd %10 %91 %128
%133 = OpFAdd %10 %92 %129
%134 = OpFAdd %10 %93 %130
%136 = OpAccessChain %135 %13 %16
OpStore %136 %131
%137 = OpAccessChain %135 %13 %38
OpStore %137 %132
%138 = OpAccessChain %135 %13 %94
OpStore %138 %133
%139 = OpAccessChain %135 %13 %113
OpStore %139 %134
OpReturn
OpFunctionEnd
#endif
