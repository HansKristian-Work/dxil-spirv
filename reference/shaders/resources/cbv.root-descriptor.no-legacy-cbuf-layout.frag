#version 460
#extension GL_ARB_gpu_shader_int64 : require
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_buffer_reference : require

struct AddCarry
{
    uint _m0;
    uint _m1;
};

layout(buffer_reference) buffer PhysicalPointerFloatNonWrite;
layout(buffer_reference) buffer PhysicalPointerUint64NonWrite;
layout(buffer_reference) buffer PhysicalPointerHalfNonWrite;
layout(buffer_reference, std430) readonly buffer PhysicalPointerFloatNonWrite
{
    float value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerUint64NonWrite
{
    uint64_t value;
};

layout(buffer_reference, std430) readonly buffer PhysicalPointerHalfNonWrite
{
    float16_t value;
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
    AddCarry _21;
    _21._m0 = uaddCarry(registers._m0.x, 0u, _21._m1);
    AddCarry _35;
    _35._m0 = uaddCarry(registers._m0.x, 4u, _35._m1);
    AddCarry _46;
    _46._m0 = uaddCarry(registers._m0.x, 8u, _46._m1);
    AddCarry _57;
    _57._m0 = uaddCarry(registers._m0.x, 12u, _57._m1);
    AddCarry _69;
    _69._m0 = uaddCarry(registers._m0.x, 32u, _69._m1);
    AddCarry _83;
    _83._m0 = uaddCarry(registers._m0.x, 40u, _83._m1);
    AddCarry _94;
    _94._m0 = uaddCarry(registers._m0.x, 48u, _94._m1);
    AddCarry _105;
    _105._m0 = uaddCarry(registers._m0.x, 56u, _105._m1);
    AddCarry _125;
    _125._m0 = uaddCarry(registers._m0.x, 16u, _125._m1);
    AddCarry _139;
    _139._m0 = uaddCarry(registers._m0.x, 20u, _139._m1);
    AddCarry _150;
    _150._m0 = uaddCarry(registers._m0.x, 24u, _150._m1);
    AddCarry _161;
    _161._m0 = uaddCarry(registers._m0.x, 28u, _161._m1);
    SV_Target.x = (float(int64_t(PhysicalPointerUint64NonWrite(uvec2(_69._m0, registers._m0.y + _69._m1)).value)) + PhysicalPointerFloatNonWrite(uvec2(_21._m0, registers._m0.y + _21._m1)).value) + float(PhysicalPointerHalfNonWrite(uvec2(_125._m0, registers._m0.y + _125._m1)).value);
    SV_Target.y = (float(int64_t(PhysicalPointerUint64NonWrite(uvec2(_83._m0, registers._m0.y + _83._m1)).value)) + PhysicalPointerFloatNonWrite(uvec2(_35._m0, registers._m0.y + _35._m1)).value) + float(PhysicalPointerHalfNonWrite(uvec2(_139._m0, registers._m0.y + _139._m1)).value);
    SV_Target.z = (float(int64_t(PhysicalPointerUint64NonWrite(uvec2(_94._m0, registers._m0.y + _94._m1)).value)) + PhysicalPointerFloatNonWrite(uvec2(_46._m0, registers._m0.y + _46._m1)).value) + float(PhysicalPointerHalfNonWrite(uvec2(_150._m0, registers._m0.y + _150._m1)).value);
    SV_Target.w = (float(int64_t(PhysicalPointerUint64NonWrite(uvec2(_105._m0, registers._m0.y + _105._m1)).value)) + PhysicalPointerFloatNonWrite(uvec2(_57._m0, registers._m0.y + _57._m1)).value) + float(PhysicalPointerHalfNonWrite(uvec2(_161._m0, registers._m0.y + _161._m1)).value);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 187
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
OpName %20 "AddCarry"
OpName %26 "PhysicalPointerFloatNonWrite"
OpMemberName %26 0 "value"
OpName %74 "PhysicalPointerUint64NonWrite"
OpMemberName %74 0 "value"
OpName %130 "PhysicalPointerHalfNonWrite"
OpMemberName %130 0 "value"
OpDecorate %7 Block
OpMemberDecorate %7 0 Offset 0
OpMemberDecorate %7 1 Offset 8
OpMemberDecorate %7 2 Offset 16
OpMemberDecorate %7 3 Offset 24
OpDecorate %13 Location 0
OpMemberDecorate %26 0 Offset 0
OpDecorate %26 Block
OpMemberDecorate %26 0 NonWritable
OpMemberDecorate %74 0 Offset 0
OpDecorate %74 Block
OpMemberDecorate %74 0 NonWritable
OpMemberDecorate %130 0 Offset 0
OpDecorate %130 Block
OpMemberDecorate %130 0 NonWritable
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
%20 = OpTypeStruct %5 %5
%26 = OpTypeStruct %10
%27 = OpTypePointer PhysicalStorageBuffer %26
%29 = OpTypePointer PhysicalStorageBuffer %10
%32 = OpConstant %5 4
%43 = OpConstant %5 8
%54 = OpConstant %5 12
%65 = OpConstant %5 32
%66 = OpTypeInt 64 0
%74 = OpTypeStruct %66
%75 = OpTypePointer PhysicalStorageBuffer %74
%77 = OpTypePointer PhysicalStorageBuffer %66
%80 = OpConstant %5 40
%91 = OpConstant %5 48
%102 = OpConstant %5 56
%121 = OpConstant %5 16
%122 = OpTypeFloat 16
%130 = OpTypeStruct %122
%131 = OpTypePointer PhysicalStorageBuffer %130
%133 = OpTypePointer PhysicalStorageBuffer %122
%136 = OpConstant %5 20
%147 = OpConstant %5 24
%158 = OpConstant %5 28
%177 = OpTypePointer Output %10
%180 = OpConstant %5 1
%182 = OpConstant %5 2
%184 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %185
%185 = OpLabel
%15 = OpAccessChain %14 %9 %16
%17 = OpLoad %6 %15
%18 = OpCompositeExtract %5 %17 0
%19 = OpCompositeExtract %5 %17 1
%21 = OpIAddCarry %20 %18 %16
%22 = OpCompositeExtract %5 %21 0
%23 = OpCompositeExtract %5 %21 1
%24 = OpIAdd %5 %19 %23
%25 = OpCompositeConstruct %6 %22 %24
%28 = OpBitcast %27 %25
%30 = OpAccessChain %29 %28 %16
%31 = OpLoad %10 %30 Aligned 4
%33 = OpCompositeExtract %5 %17 0
%34 = OpCompositeExtract %5 %17 1
%35 = OpIAddCarry %20 %33 %32
%36 = OpCompositeExtract %5 %35 0
%37 = OpCompositeExtract %5 %35 1
%38 = OpIAdd %5 %34 %37
%39 = OpCompositeConstruct %6 %36 %38
%40 = OpBitcast %27 %39
%41 = OpAccessChain %29 %40 %16
%42 = OpLoad %10 %41 Aligned 4
%44 = OpCompositeExtract %5 %17 0
%45 = OpCompositeExtract %5 %17 1
%46 = OpIAddCarry %20 %44 %43
%47 = OpCompositeExtract %5 %46 0
%48 = OpCompositeExtract %5 %46 1
%49 = OpIAdd %5 %45 %48
%50 = OpCompositeConstruct %6 %47 %49
%51 = OpBitcast %27 %50
%52 = OpAccessChain %29 %51 %16
%53 = OpLoad %10 %52 Aligned 4
%55 = OpCompositeExtract %5 %17 0
%56 = OpCompositeExtract %5 %17 1
%57 = OpIAddCarry %20 %55 %54
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%60 = OpIAdd %5 %56 %59
%61 = OpCompositeConstruct %6 %58 %60
%62 = OpBitcast %27 %61
%63 = OpAccessChain %29 %62 %16
%64 = OpLoad %10 %63 Aligned 4
%67 = OpCompositeExtract %5 %17 0
%68 = OpCompositeExtract %5 %17 1
%69 = OpIAddCarry %20 %67 %65
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpIAdd %5 %68 %71
%73 = OpCompositeConstruct %6 %70 %72
%76 = OpBitcast %75 %73
%78 = OpAccessChain %77 %76 %16
%79 = OpLoad %66 %78 Aligned 8
%81 = OpCompositeExtract %5 %17 0
%82 = OpCompositeExtract %5 %17 1
%83 = OpIAddCarry %20 %81 %80
%84 = OpCompositeExtract %5 %83 0
%85 = OpCompositeExtract %5 %83 1
%86 = OpIAdd %5 %82 %85
%87 = OpCompositeConstruct %6 %84 %86
%88 = OpBitcast %75 %87
%89 = OpAccessChain %77 %88 %16
%90 = OpLoad %66 %89 Aligned 8
%92 = OpCompositeExtract %5 %17 0
%93 = OpCompositeExtract %5 %17 1
%94 = OpIAddCarry %20 %92 %91
%95 = OpCompositeExtract %5 %94 0
%96 = OpCompositeExtract %5 %94 1
%97 = OpIAdd %5 %93 %96
%98 = OpCompositeConstruct %6 %95 %97
%99 = OpBitcast %75 %98
%100 = OpAccessChain %77 %99 %16
%101 = OpLoad %66 %100 Aligned 8
%103 = OpCompositeExtract %5 %17 0
%104 = OpCompositeExtract %5 %17 1
%105 = OpIAddCarry %20 %103 %102
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1
%108 = OpIAdd %5 %104 %107
%109 = OpCompositeConstruct %6 %106 %108
%110 = OpBitcast %75 %109
%111 = OpAccessChain %77 %110 %16
%112 = OpLoad %66 %111 Aligned 8
%113 = OpConvertSToF %10 %79
%114 = OpConvertSToF %10 %90
%115 = OpConvertSToF %10 %101
%116 = OpConvertSToF %10 %112
%117 = OpFAdd %10 %113 %31
%118 = OpFAdd %10 %114 %42
%119 = OpFAdd %10 %115 %53
%120 = OpFAdd %10 %116 %64
%123 = OpCompositeExtract %5 %17 0
%124 = OpCompositeExtract %5 %17 1
%125 = OpIAddCarry %20 %123 %121
%126 = OpCompositeExtract %5 %125 0
%127 = OpCompositeExtract %5 %125 1
%128 = OpIAdd %5 %124 %127
%129 = OpCompositeConstruct %6 %126 %128
%132 = OpBitcast %131 %129
%134 = OpAccessChain %133 %132 %16
%135 = OpLoad %122 %134 Aligned 2
%137 = OpCompositeExtract %5 %17 0
%138 = OpCompositeExtract %5 %17 1
%139 = OpIAddCarry %20 %137 %136
%140 = OpCompositeExtract %5 %139 0
%141 = OpCompositeExtract %5 %139 1
%142 = OpIAdd %5 %138 %141
%143 = OpCompositeConstruct %6 %140 %142
%144 = OpBitcast %131 %143
%145 = OpAccessChain %133 %144 %16
%146 = OpLoad %122 %145 Aligned 2
%148 = OpCompositeExtract %5 %17 0
%149 = OpCompositeExtract %5 %17 1
%150 = OpIAddCarry %20 %148 %147
%151 = OpCompositeExtract %5 %150 0
%152 = OpCompositeExtract %5 %150 1
%153 = OpIAdd %5 %149 %152
%154 = OpCompositeConstruct %6 %151 %153
%155 = OpBitcast %131 %154
%156 = OpAccessChain %133 %155 %16
%157 = OpLoad %122 %156 Aligned 2
%159 = OpCompositeExtract %5 %17 0
%160 = OpCompositeExtract %5 %17 1
%161 = OpIAddCarry %20 %159 %158
%162 = OpCompositeExtract %5 %161 0
%163 = OpCompositeExtract %5 %161 1
%164 = OpIAdd %5 %160 %163
%165 = OpCompositeConstruct %6 %162 %164
%166 = OpBitcast %131 %165
%167 = OpAccessChain %133 %166 %16
%168 = OpLoad %122 %167 Aligned 2
%169 = OpFConvert %10 %135
%170 = OpFConvert %10 %146
%171 = OpFConvert %10 %157
%172 = OpFConvert %10 %168
%173 = OpFAdd %10 %117 %169
%174 = OpFAdd %10 %118 %170
%175 = OpFAdd %10 %119 %171
%176 = OpFAdd %10 %120 %172
%178 = OpAccessChain %177 %13 %16
OpStore %178 %173
%179 = OpAccessChain %177 %13 %180
OpStore %179 %174
%181 = OpAccessChain %177 %13 %182
OpStore %181 %175
%183 = OpAccessChain %177 %13 %184
OpStore %183 %176
OpReturn
OpFunctionEnd
#endif
