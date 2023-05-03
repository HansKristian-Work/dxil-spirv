#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 5, binding = 0, scalar) uniform BindlessCBV
{
    float16_t _m0[32768];
} _15[];

layout(set = 5, binding = 0, scalar) uniform _19_22
{
    float _m0[16384];
} _22[];

layout(set = 5, binding = 0, scalar) uniform _26_29
{
    double _m0[8192];
} _29[];

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

layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _39 = registers._m5 + 2u;
    uint _45 = registers._m5 + 1u;
    SV_Target.x = (((float(_15[registers._m5]._m0[8u]) + _22[registers._m5]._m0[0u]) + float(int64_t(doubleBitsToUint64(_29[registers._m5]._m0[4u])))) + _22[_45]._m0[0u]) + float(_29[_39]._m0[0u]);
    SV_Target.y = (((float(_15[registers._m5]._m0[10u]) + _22[registers._m5]._m0[1u]) + float(int64_t(doubleBitsToUint64(_29[registers._m5]._m0[5u])))) + _22[_45]._m0[1u]) + float(_29[_39]._m0[1u]);
    SV_Target.z = (((float(_15[registers._m5]._m0[12u]) + _22[registers._m5]._m0[2u]) + float(int64_t(doubleBitsToUint64(_29[registers._m5]._m0[6u])))) + _22[_45]._m0[2u]) + float(_29[_39]._m0[2u]);
    SV_Target.w = (((float(_15[registers._m5]._m0[14u]) + _22[registers._m5]._m0[3u]) + float(int64_t(doubleBitsToUint64(_29[registers._m5]._m0[7u])))) + _22[_45]._m0[3u]) + float(_29[_39]._m0[3u]);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 149
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability UniformAndStorageBuffer16BitAccess
OpCapability DenormPreserve
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_float_controls"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %32
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "BindlessCBV"
OpName %19 "BindlessCBV"
OpName %26 "BindlessCBV"
OpName %32 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %11 ArrayStride 2
OpDecorate %12 Block
OpMemberDecorate %12 0 Offset 0
OpDecorate %15 DescriptorSet 5
OpDecorate %15 Binding 0
OpDecorate %18 ArrayStride 4
OpDecorate %19 Block
OpMemberDecorate %19 0 Offset 0
OpDecorate %22 DescriptorSet 5
OpDecorate %22 Binding 0
OpDecorate %25 ArrayStride 8
OpDecorate %26 Block
OpMemberDecorate %26 0 Offset 0
OpDecorate %29 DescriptorSet 5
OpDecorate %29 Binding 0
OpDecorate %32 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 16
%10 = OpConstant %5 32768
%11 = OpTypeArray %9 %10
%12 = OpTypeStruct %11
%13 = OpTypeRuntimeArray %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeFloat 32
%17 = OpConstant %5 16384
%18 = OpTypeArray %16 %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer Uniform %20
%22 = OpVariable %21 Uniform
%23 = OpTypeFloat 64
%24 = OpConstant %5 8192
%25 = OpTypeArray %23 %24
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer Uniform %27
%29 = OpVariable %28 Uniform
%30 = OpTypeVector %16 4
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%33 = OpTypePointer Uniform %26
%35 = OpTypePointer PushConstant %5
%37 = OpConstant %5 5
%40 = OpConstant %5 2
%41 = OpTypePointer Uniform %19
%46 = OpConstant %5 1
%47 = OpTypePointer Uniform %12
%57 = OpConstant %5 0
%58 = OpTypePointer Uniform %16
%65 = OpConstant %5 3
%68 = OpConstant %5 8
%69 = OpTypePointer Uniform %9
%72 = OpConstant %5 10
%75 = OpConstant %5 12
%78 = OpConstant %5 14
%89 = OpTypeInt 64 0
%90 = OpConstant %5 4
%91 = OpTypePointer Uniform %23
%98 = OpConstant %5 6
%102 = OpConstant %5 7
%142 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %147
%147 = OpLabel
%36 = OpAccessChain %35 %8 %37
%38 = OpLoad %5 %36
%39 = OpIAdd %5 %38 %40
%34 = OpAccessChain %33 %29 %39
%43 = OpAccessChain %35 %8 %37
%44 = OpLoad %5 %43
%45 = OpIAdd %5 %44 %46
%42 = OpAccessChain %41 %22 %45
%49 = OpAccessChain %35 %8 %37
%50 = OpLoad %5 %49
%48 = OpAccessChain %47 %15 %50
%52 = OpAccessChain %35 %8 %37
%53 = OpLoad %5 %52
%51 = OpAccessChain %41 %22 %53
%55 = OpAccessChain %35 %8 %37
%56 = OpLoad %5 %55
%54 = OpAccessChain %33 %29 %56
%59 = OpAccessChain %58 %51 %57 %57
%60 = OpLoad %16 %59
%61 = OpAccessChain %58 %51 %57 %46
%62 = OpLoad %16 %61
%63 = OpAccessChain %58 %51 %57 %40
%64 = OpLoad %16 %63
%66 = OpAccessChain %58 %51 %57 %65
%67 = OpLoad %16 %66
%70 = OpAccessChain %69 %48 %57 %68
%71 = OpLoad %9 %70
%73 = OpAccessChain %69 %48 %57 %72
%74 = OpLoad %9 %73
%76 = OpAccessChain %69 %48 %57 %75
%77 = OpLoad %9 %76
%79 = OpAccessChain %69 %48 %57 %78
%80 = OpLoad %9 %79
%81 = OpFConvert %16 %71
%82 = OpFConvert %16 %74
%83 = OpFConvert %16 %77
%84 = OpFConvert %16 %80
%85 = OpFAdd %16 %81 %60
%86 = OpFAdd %16 %82 %62
%87 = OpFAdd %16 %83 %64
%88 = OpFAdd %16 %84 %67
%92 = OpAccessChain %91 %54 %57 %90
%93 = OpLoad %23 %92
%94 = OpBitcast %89 %93
%95 = OpAccessChain %91 %54 %57 %37
%96 = OpLoad %23 %95
%97 = OpBitcast %89 %96
%99 = OpAccessChain %91 %54 %57 %98
%100 = OpLoad %23 %99
%101 = OpBitcast %89 %100
%103 = OpAccessChain %91 %54 %57 %102
%104 = OpLoad %23 %103
%105 = OpBitcast %89 %104
%106 = OpConvertSToF %16 %94
%107 = OpConvertSToF %16 %97
%108 = OpConvertSToF %16 %101
%109 = OpConvertSToF %16 %105
%110 = OpFAdd %16 %85 %106
%111 = OpFAdd %16 %86 %107
%112 = OpFAdd %16 %87 %108
%113 = OpFAdd %16 %88 %109
%114 = OpAccessChain %58 %42 %57 %57
%115 = OpLoad %16 %114
%116 = OpAccessChain %58 %42 %57 %46
%117 = OpLoad %16 %116
%118 = OpAccessChain %58 %42 %57 %40
%119 = OpLoad %16 %118
%120 = OpAccessChain %58 %42 %57 %65
%121 = OpLoad %16 %120
%122 = OpFAdd %16 %110 %115
%123 = OpFAdd %16 %111 %117
%124 = OpFAdd %16 %112 %119
%125 = OpFAdd %16 %113 %121
%126 = OpAccessChain %91 %34 %57 %57
%127 = OpLoad %23 %126
%128 = OpAccessChain %91 %34 %57 %46
%129 = OpLoad %23 %128
%130 = OpAccessChain %91 %34 %57 %40
%131 = OpLoad %23 %130
%132 = OpAccessChain %91 %34 %57 %65
%133 = OpLoad %23 %132
%134 = OpFConvert %16 %127
%135 = OpFConvert %16 %129
%136 = OpFConvert %16 %131
%137 = OpFConvert %16 %133
%138 = OpFAdd %16 %122 %134
%139 = OpFAdd %16 %123 %135
%140 = OpFAdd %16 %124 %136
%141 = OpFAdd %16 %125 %137
%143 = OpAccessChain %142 %32 %57
OpStore %143 %138
%144 = OpAccessChain %142 %32 %46
OpStore %144 %139
%145 = OpAccessChain %142 %32 %40
OpStore %145 %140
%146 = OpAccessChain %142 %32 %65
OpStore %146 %141
OpReturn
OpFunctionEnd
#endif
