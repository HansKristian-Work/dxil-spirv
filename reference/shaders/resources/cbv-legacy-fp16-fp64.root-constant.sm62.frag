#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
#extension GL_EXT_shader_16bit_storage : require
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

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

struct CBVComposite16x8_1
{
    uint16_t _m0;
    uint16_t _m1;
    uint16_t _m2;
    uint16_t _m3;
    uint16_t _m4;
    uint16_t _m5;
    uint16_t _m6;
    uint16_t _m7;
};

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
    uint _m8;
    uint _m9;
    uint _m10;
    uint _m11;
    uint _m12;
    uint _m13;
    uint _m14;
    uint _m15;
} registers;

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _28 = uintBitsToFloat(uvec4(registers._m0, registers._m1, registers._m2, registers._m3));
    uvec4 _45 = uvec4(registers._m4, registers._m5, registers._m6, registers._m7);
    f16vec2 _52 = unpackFloat2x16(_45.x);
    f16vec2 _55 = unpackFloat2x16(_45.y);
    f16vec2 _58 = unpackFloat2x16(_45.z);
    f16vec2 _61 = unpackFloat2x16(_45.w);
    CBVComposite16x8 _65 = CBVComposite16x8(_52.x, _52.y, _55.x, _55.y, _58.x, _58.y, _61.x, _61.y);
    uvec4 _94 = uvec4(registers._m8, registers._m9, registers._m10, registers._m11);
    u16vec2 _101 = unpackUint2x16(_94.x);
    u16vec2 _104 = unpackUint2x16(_94.y);
    u16vec2 _107 = unpackUint2x16(_94.z);
    u16vec2 _110 = unpackUint2x16(_94.w);
    CBVComposite16x8_1 _114 = CBVComposite16x8_1(_101.x, _101.y, _104.x, _104.y, _107.x, _107.y, _110.x, _110.y);
    float _163 = float((uvec4(registers._m12, registers._m13, registers._m14, registers._m15)).y) + float(int64_t((uvec4(registers._m12, registers._m13, registers._m14, registers._m15)).x));
    SV_Target.x = ((((float(_65._m0) + _28.x) + float(_65._m4)) + float(int16_t(_114._m0))) + float(int16_t(_114._m4))) + _163;
    SV_Target.y = ((((float(_65._m1) + _28.y) + float(_65._m5)) + float(int16_t(_114._m1))) + float(int16_t(_114._m5))) + _163;
    SV_Target.z = ((((float(_65._m2) + _28.z) + float(_65._m6)) + float(int16_t(_114._m2))) + float(int16_t(_114._m6))) + _163;
    SV_Target.w = ((((float(_65._m3) + _28.w) + float(_65._m7)) + float(int16_t(_114._m3))) + float(int16_t(_114._m7))) + _163;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 191
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability Int64
OpCapability Int16
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 "SV_Target"
OpName %64 "CBVComposite16x8"
OpName %113 "CBVComposite16x8"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpMemberDecorate %6 8 Offset 32
OpMemberDecorate %6 9 Offset 36
OpMemberDecorate %6 10 Offset 40
OpMemberDecorate %6 11 Offset 44
OpMemberDecorate %6 12 Offset 48
OpMemberDecorate %6 13 Offset 52
OpMemberDecorate %6 14 Offset 56
OpMemberDecorate %6 15 Offset 60
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer PushConstant %5
%15 = OpConstant %5 0
%18 = OpConstant %5 1
%21 = OpConstant %5 2
%24 = OpConstant %5 3
%26 = OpTypeVector %5 4
%34 = OpConstant %5 4
%37 = OpConstant %5 5
%40 = OpConstant %5 6
%43 = OpConstant %5 7
%46 = OpTypeFloat 16
%47 = OpTypeVector %46 2
%64 = OpTypeStruct %46 %46 %46 %46 %46 %46 %46 %46
%83 = OpConstant %5 8
%86 = OpConstant %5 9
%89 = OpConstant %5 10
%92 = OpConstant %5 11
%95 = OpTypeInt 16 0
%96 = OpTypeVector %95 2
%113 = OpTypeStruct %95 %95 %95 %95 %95 %95 %95 %95
%132 = OpConstant %5 12
%135 = OpConstant %5 13
%138 = OpConstant %5 14
%141 = OpConstant %5 15
%144 = OpTypeInt 64 0
%145 = OpTypeVector %144 2
%158 = OpTypeFloat 64
%159 = OpTypeVector %158 2
%184 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %189
%189 = OpLabel
%14 = OpAccessChain %13 %8 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %8 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %13 %8 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %13 %8 %24
%25 = OpLoad %5 %23
%27 = OpCompositeConstruct %26 %16 %19 %22 %25
%28 = OpBitcast %10 %27
%29 = OpCompositeExtract %9 %28 0
%30 = OpCompositeExtract %9 %28 1
%31 = OpCompositeExtract %9 %28 2
%32 = OpCompositeExtract %9 %28 3
%33 = OpAccessChain %13 %8 %34
%35 = OpLoad %5 %33
%36 = OpAccessChain %13 %8 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %13 %8 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %13 %8 %43
%44 = OpLoad %5 %42
%45 = OpCompositeConstruct %26 %35 %38 %41 %44
%48 = OpCompositeExtract %5 %45 0
%49 = OpCompositeExtract %5 %45 1
%50 = OpCompositeExtract %5 %45 2
%51 = OpCompositeExtract %5 %45 3
%52 = OpBitcast %47 %48
%53 = OpCompositeExtract %46 %52 0
%54 = OpCompositeExtract %46 %52 1
%55 = OpBitcast %47 %49
%56 = OpCompositeExtract %46 %55 0
%57 = OpCompositeExtract %46 %55 1
%58 = OpBitcast %47 %50
%59 = OpCompositeExtract %46 %58 0
%60 = OpCompositeExtract %46 %58 1
%61 = OpBitcast %47 %51
%62 = OpCompositeExtract %46 %61 0
%63 = OpCompositeExtract %46 %61 1
%65 = OpCompositeConstruct %64 %53 %54 %56 %57 %59 %60 %62 %63
%66 = OpCompositeExtract %46 %65 0
%67 = OpCompositeExtract %46 %65 1
%68 = OpCompositeExtract %46 %65 2
%69 = OpCompositeExtract %46 %65 3
%70 = OpFConvert %9 %66
%71 = OpFConvert %9 %67
%72 = OpFConvert %9 %68
%73 = OpFConvert %9 %69
%74 = OpCompositeExtract %46 %65 4
%75 = OpCompositeExtract %46 %65 5
%76 = OpCompositeExtract %46 %65 6
%77 = OpCompositeExtract %46 %65 7
%78 = OpFConvert %9 %74
%79 = OpFConvert %9 %75
%80 = OpFConvert %9 %76
%81 = OpFConvert %9 %77
%82 = OpAccessChain %13 %8 %83
%84 = OpLoad %5 %82
%85 = OpAccessChain %13 %8 %86
%87 = OpLoad %5 %85
%88 = OpAccessChain %13 %8 %89
%90 = OpLoad %5 %88
%91 = OpAccessChain %13 %8 %92
%93 = OpLoad %5 %91
%94 = OpCompositeConstruct %26 %84 %87 %90 %93
%97 = OpCompositeExtract %5 %94 0
%98 = OpCompositeExtract %5 %94 1
%99 = OpCompositeExtract %5 %94 2
%100 = OpCompositeExtract %5 %94 3
%101 = OpBitcast %96 %97
%102 = OpCompositeExtract %95 %101 0
%103 = OpCompositeExtract %95 %101 1
%104 = OpBitcast %96 %98
%105 = OpCompositeExtract %95 %104 0
%106 = OpCompositeExtract %95 %104 1
%107 = OpBitcast %96 %99
%108 = OpCompositeExtract %95 %107 0
%109 = OpCompositeExtract %95 %107 1
%110 = OpBitcast %96 %100
%111 = OpCompositeExtract %95 %110 0
%112 = OpCompositeExtract %95 %110 1
%114 = OpCompositeConstruct %113 %102 %103 %105 %106 %108 %109 %111 %112
%115 = OpCompositeExtract %95 %114 0
%116 = OpCompositeExtract %95 %114 1
%117 = OpCompositeExtract %95 %114 2
%118 = OpCompositeExtract %95 %114 3
%119 = OpConvertSToF %9 %115
%120 = OpConvertSToF %9 %116
%121 = OpConvertSToF %9 %117
%122 = OpConvertSToF %9 %118
%123 = OpCompositeExtract %95 %114 4
%124 = OpCompositeExtract %95 %114 5
%125 = OpCompositeExtract %95 %114 6
%126 = OpCompositeExtract %95 %114 7
%127 = OpConvertSToF %9 %123
%128 = OpConvertSToF %9 %124
%129 = OpConvertSToF %9 %125
%130 = OpConvertSToF %9 %126
%131 = OpAccessChain %13 %8 %132
%133 = OpLoad %5 %131
%134 = OpAccessChain %13 %8 %135
%136 = OpLoad %5 %134
%137 = OpAccessChain %13 %8 %138
%139 = OpLoad %5 %137
%140 = OpAccessChain %13 %8 %141
%142 = OpLoad %5 %140
%143 = OpCompositeConstruct %26 %133 %136 %139 %142
%146 = OpBitcast %145 %143
%147 = OpCompositeExtract %144 %146 0
%148 = OpConvertSToF %9 %147
%149 = OpAccessChain %13 %8 %132
%150 = OpLoad %5 %149
%151 = OpAccessChain %13 %8 %135
%152 = OpLoad %5 %151
%153 = OpAccessChain %13 %8 %138
%154 = OpLoad %5 %153
%155 = OpAccessChain %13 %8 %141
%156 = OpLoad %5 %155
%157 = OpCompositeConstruct %26 %150 %152 %154 %156
%160 = OpBitcast %159 %157
%161 = OpCompositeExtract %158 %160 1
%162 = OpFConvert %9 %161
%163 = OpFAdd %9 %162 %148
%164 = OpFAdd %9 %70 %29
%165 = OpFAdd %9 %164 %78
%166 = OpFAdd %9 %165 %119
%167 = OpFAdd %9 %166 %127
%168 = OpFAdd %9 %167 %163
%169 = OpFAdd %9 %71 %30
%170 = OpFAdd %9 %169 %79
%171 = OpFAdd %9 %170 %120
%172 = OpFAdd %9 %171 %128
%173 = OpFAdd %9 %172 %163
%174 = OpFAdd %9 %72 %31
%175 = OpFAdd %9 %174 %80
%176 = OpFAdd %9 %175 %121
%177 = OpFAdd %9 %176 %129
%178 = OpFAdd %9 %177 %163
%179 = OpFAdd %9 %73 %32
%180 = OpFAdd %9 %179 %81
%181 = OpFAdd %9 %180 %122
%182 = OpFAdd %9 %181 %130
%183 = OpFAdd %9 %182 %163
%185 = OpAccessChain %184 %12 %15
OpStore %185 %168
%186 = OpAccessChain %184 %12 %18
OpStore %186 %173
%187 = OpAccessChain %184 %12 %21
OpStore %187 %178
%188 = OpAccessChain %184 %12 %24
OpStore %188 %183
OpReturn
OpFunctionEnd
#endif
