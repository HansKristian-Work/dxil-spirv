#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 5, binding = 0, scalar) uniform BindlessCBV
{
    uint64_t _m0[8192];
} _15[];

layout(set = 5, binding = 0, scalar) uniform _19_22
{
    float16_t _m0[32768];
} _22[];

layout(set = 5, binding = 0, scalar) uniform _26_29
{
    float _m0[16384];
} _29[];

layout(set = 5, binding = 0, scalar) uniform _32_35
{
    double _m0[8192];
} _35[];

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
    uint _45 = registers._m5 + 2u;
    uint _51 = registers._m5 + 1u;
    SV_Target.x = (((float(_22[registers._m5]._m0[8u]) + _29[registers._m5]._m0[0u]) + float(int64_t(_15[registers._m5]._m0[4u]))) + _29[_51]._m0[0u]) + float(_35[_45]._m0[0u]);
    SV_Target.y = (((float(_22[registers._m5]._m0[10u]) + _29[registers._m5]._m0[1u]) + float(int64_t(_15[registers._m5]._m0[5u]))) + _29[_51]._m0[1u]) + float(_35[_45]._m0[1u]);
    SV_Target.z = (((float(_22[registers._m5]._m0[12u]) + _29[registers._m5]._m0[2u]) + float(int64_t(_15[registers._m5]._m0[6u]))) + _29[_51]._m0[2u]) + float(_35[_45]._m0[2u]);
    SV_Target.w = (((float(_22[registers._m5]._m0[14u]) + _29[registers._m5]._m0[3u]) + float(int64_t(_15[registers._m5]._m0[7u]))) + _29[_51]._m0[3u]) + float(_35[_45]._m0[3u]);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 152
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
OpEntryPoint Fragment %3 "main" %38
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "BindlessCBV"
OpName %19 "BindlessCBV"
OpName %26 "BindlessCBV"
OpName %32 "BindlessCBV"
OpName %38 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %11 ArrayStride 8
OpDecorate %12 Block
OpMemberDecorate %12 0 Offset 0
OpDecorate %15 DescriptorSet 5
OpDecorate %15 Binding 0
OpDecorate %18 ArrayStride 2
OpDecorate %19 Block
OpMemberDecorate %19 0 Offset 0
OpDecorate %22 DescriptorSet 5
OpDecorate %22 Binding 0
OpDecorate %25 ArrayStride 4
OpDecorate %26 Block
OpMemberDecorate %26 0 Offset 0
OpDecorate %29 DescriptorSet 5
OpDecorate %29 Binding 0
OpDecorate %31 ArrayStride 8
OpDecorate %32 Block
OpMemberDecorate %32 0 Offset 0
OpDecorate %35 DescriptorSet 5
OpDecorate %35 Binding 0
OpDecorate %38 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeInt 64 0
%10 = OpConstant %5 8192
%11 = OpTypeArray %9 %10
%12 = OpTypeStruct %11
%13 = OpTypeRuntimeArray %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeFloat 16
%17 = OpConstant %5 32768
%18 = OpTypeArray %16 %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer Uniform %20
%22 = OpVariable %21 Uniform
%23 = OpTypeFloat 32
%24 = OpConstant %5 16384
%25 = OpTypeArray %23 %24
%26 = OpTypeStruct %25
%27 = OpTypeRuntimeArray %26
%28 = OpTypePointer Uniform %27
%29 = OpVariable %28 Uniform
%30 = OpTypeFloat 64
%31 = OpTypeArray %30 %10
%32 = OpTypeStruct %31
%33 = OpTypeRuntimeArray %32
%34 = OpTypePointer Uniform %33
%35 = OpVariable %34 Uniform
%36 = OpTypeVector %23 4
%37 = OpTypePointer Output %36
%38 = OpVariable %37 Output
%39 = OpTypePointer Uniform %32
%41 = OpTypePointer PushConstant %5
%43 = OpConstant %5 5
%46 = OpConstant %5 2
%47 = OpTypePointer Uniform %26
%52 = OpConstant %5 1
%53 = OpTypePointer Uniform %12
%57 = OpTypePointer Uniform %19
%64 = OpConstant %5 0
%65 = OpTypePointer Uniform %23
%72 = OpConstant %5 3
%75 = OpConstant %5 8
%76 = OpTypePointer Uniform %16
%79 = OpConstant %5 10
%82 = OpConstant %5 12
%85 = OpConstant %5 14
%96 = OpConstant %5 4
%97 = OpTypePointer Uniform %9
%102 = OpConstant %5 6
%105 = OpConstant %5 7
%128 = OpTypePointer Uniform %30
%145 = OpTypePointer Output %23
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %150
%150 = OpLabel
%42 = OpAccessChain %41 %8 %43
%44 = OpLoad %5 %42
%45 = OpIAdd %5 %44 %46
%40 = OpAccessChain %39 %35 %45
%49 = OpAccessChain %41 %8 %43
%50 = OpLoad %5 %49
%51 = OpIAdd %5 %50 %52
%48 = OpAccessChain %47 %29 %51
%55 = OpAccessChain %41 %8 %43
%56 = OpLoad %5 %55
%54 = OpAccessChain %53 %15 %56
%59 = OpAccessChain %41 %8 %43
%60 = OpLoad %5 %59
%58 = OpAccessChain %57 %22 %60
%62 = OpAccessChain %41 %8 %43
%63 = OpLoad %5 %62
%61 = OpAccessChain %47 %29 %63
%66 = OpAccessChain %65 %61 %64 %64
%67 = OpLoad %23 %66
%68 = OpAccessChain %65 %61 %64 %52
%69 = OpLoad %23 %68
%70 = OpAccessChain %65 %61 %64 %46
%71 = OpLoad %23 %70
%73 = OpAccessChain %65 %61 %64 %72
%74 = OpLoad %23 %73
%77 = OpAccessChain %76 %58 %64 %75
%78 = OpLoad %16 %77
%80 = OpAccessChain %76 %58 %64 %79
%81 = OpLoad %16 %80
%83 = OpAccessChain %76 %58 %64 %82
%84 = OpLoad %16 %83
%86 = OpAccessChain %76 %58 %64 %85
%87 = OpLoad %16 %86
%88 = OpFConvert %23 %78
%89 = OpFConvert %23 %81
%90 = OpFConvert %23 %84
%91 = OpFConvert %23 %87
%92 = OpFAdd %23 %88 %67
%93 = OpFAdd %23 %89 %69
%94 = OpFAdd %23 %90 %71
%95 = OpFAdd %23 %91 %74
%98 = OpAccessChain %97 %54 %64 %96
%99 = OpLoad %9 %98
%100 = OpAccessChain %97 %54 %64 %43
%101 = OpLoad %9 %100
%103 = OpAccessChain %97 %54 %64 %102
%104 = OpLoad %9 %103
%106 = OpAccessChain %97 %54 %64 %105
%107 = OpLoad %9 %106
%108 = OpConvertSToF %23 %99
%109 = OpConvertSToF %23 %101
%110 = OpConvertSToF %23 %104
%111 = OpConvertSToF %23 %107
%112 = OpFAdd %23 %92 %108
%113 = OpFAdd %23 %93 %109
%114 = OpFAdd %23 %94 %110
%115 = OpFAdd %23 %95 %111
%116 = OpAccessChain %65 %48 %64 %64
%117 = OpLoad %23 %116
%118 = OpAccessChain %65 %48 %64 %52
%119 = OpLoad %23 %118
%120 = OpAccessChain %65 %48 %64 %46
%121 = OpLoad %23 %120
%122 = OpAccessChain %65 %48 %64 %72
%123 = OpLoad %23 %122
%124 = OpFAdd %23 %112 %117
%125 = OpFAdd %23 %113 %119
%126 = OpFAdd %23 %114 %121
%127 = OpFAdd %23 %115 %123
%129 = OpAccessChain %128 %40 %64 %64
%130 = OpLoad %30 %129
%131 = OpAccessChain %128 %40 %64 %52
%132 = OpLoad %30 %131
%133 = OpAccessChain %128 %40 %64 %46
%134 = OpLoad %30 %133
%135 = OpAccessChain %128 %40 %64 %72
%136 = OpLoad %30 %135
%137 = OpFConvert %23 %130
%138 = OpFConvert %23 %132
%139 = OpFConvert %23 %134
%140 = OpFConvert %23 %136
%141 = OpFAdd %23 %124 %137
%142 = OpFAdd %23 %125 %138
%143 = OpFAdd %23 %126 %139
%144 = OpFAdd %23 %127 %140
%146 = OpAccessChain %145 %38 %64
OpStore %146 %141
%147 = OpAccessChain %145 %38 %52
OpStore %147 %142
%148 = OpAccessChain %145 %38 %46
OpStore %148 %143
%149 = OpAccessChain %145 %38 %72
OpStore %149 %144
OpReturn
OpFunctionEnd
#endif
