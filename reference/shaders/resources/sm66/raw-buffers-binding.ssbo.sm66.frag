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

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _12;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO_16bit
{
    uint16_t _m0[];
} _14;

layout(set = 0, binding = 1, std430) restrict readonly buffer _16_18
{
    uint _m0[];
} _18;

layout(set = 0, binding = 4, std430) restrict readonly buffer _20_22
{
    uint _m0[];
} _22;

layout(set = 0, binding = 2, std430) buffer _24_26
{
    uint _m0[];
} _26;

layout(set = 0, binding = 2, std430) buffer _28_30
{
    uint16_t _m0[];
} _30;

layout(set = 0, binding = 3, std430) writeonly readonly buffer _32_34
{
    uint _m0[];
} _34;

layout(set = 0, binding = 5, std430) writeonly readonly buffer _36_38
{
    uint _m0[];
} _38;

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

uint _104;

void main()
{
    uint _70 = uint(UV.y) * 2u;
    f16vec2 _81 = uint16BitsToFloat16(u16vec2(_14._m0[_70], _14._m0[_70 + 1u]));
    uint _87 = _26._m0[uint(UV.z)];
    uint _90 = uint(UV.w) * 2u;
    uint16_t _92 = _30._m0[_90];
    uint16_t _95 = _30._m0[_90 + 1u];
    f16vec2 _97 = uint16BitsToFloat16(u16vec2(_92, _95));
    uint _107 = (8u * 2u) + (_104 >> 1u);
    f16vec4 _122 = uint16BitsToFloat16(u16vec4(_14._m0[_107], _14._m0[_107 + 1u], _14._m0[_107 + 2u], _14._m0[_107 + 3u]));
    uint _137 = 16u + (_104 >> 2u);
    vec4 _151 = uintBitsToFloat(uvec4(_12._m0[_137], _12._m0[_137 + 1u], _12._m0[_137 + 2u], _12._m0[_137 + 3u]));
    uint _162 = (8u * 2u) + (_104 >> 1u);
    uint16_t _164 = _30._m0[_162];
    uint16_t _167 = _30._m0[_162 + 1u];
    uint16_t _170 = _30._m0[_162 + 2u];
    uint16_t _173 = _30._m0[_162 + 3u];
    f16vec4 _175 = uint16BitsToFloat16(u16vec4(_164, _167, _170, _173));
    float _184 = (((float(_97.y) + uintBitsToFloat(_12._m0[uint(UV.x)])) + float(_122.x)) + _151.x) + float(_175.x);
    float _185 = ((float(_122.y) + float(_81.x)) + _151.y) + float(_175.y);
    float _186 = (((uintBitsToFloat(_87) + float(_81.y)) + float(_122.z)) + _151.z) + float(_175.z);
    float _187 = ((float(_122.w) + float(_97.x)) + _151.w) + float(_175.w);
    uint _189 = 16u + (_104 >> 2u);
    _26._m0[_189] = floatBitsToUint(_184);
    _26._m0[_189 + 1u] = floatBitsToUint(_185);
    _26._m0[_189 + 2u] = floatBitsToUint(_186);
    _26._m0[_189 + 3u] = floatBitsToUint(_187);
    SV_Target.x = _184;
    SV_Target.y = _185;
    SV_Target.z = _186;
    SV_Target.w = _187;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 208
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %40 %44 %48
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %10 "SSBO_16bit"
OpName %16 "SSBO"
OpName %20 "SSBO"
OpName %24 "SSBO"
OpName %28 "SSBO_16bit"
OpName %32 "SSBO"
OpName %36 "SSBO"
OpName %40 "INDEX"
OpName %44 "UV"
OpName %48 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 ArrayStride 2
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonWritable
OpDecorate %12 Restrict
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 0
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %15 ArrayStride 4
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 1
OpDecorate %18 NonWritable
OpDecorate %18 Restrict
OpDecorate %19 ArrayStride 4
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 4
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %23 ArrayStride 4
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %27 ArrayStride 2
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 2
OpDecorate %30 DescriptorSet 0
OpDecorate %30 Binding 2
OpDecorate %26 Aliased
OpDecorate %30 Aliased
OpDecorate %31 ArrayStride 4
OpMemberDecorate %32 0 Offset 0
OpDecorate %32 Block
OpDecorate %34 DescriptorSet 0
OpDecorate %34 Binding 3
OpDecorate %34 NonReadable
OpDecorate %34 NonWritable
OpDecorate %35 ArrayStride 4
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 5
OpDecorate %38 NonReadable
OpDecorate %38 NonWritable
OpDecorate %40 Flat
OpDecorate %40 Location 0
OpDecorate %44 Flat
OpDecorate %44 Location 1
OpDecorate %48 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeInt 16 0
%9 = OpTypeRuntimeArray %8
%10 = OpTypeStruct %9
%11 = OpTypePointer StorageBuffer %7
%12 = OpVariable %11 StorageBuffer
%13 = OpTypePointer StorageBuffer %10
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeRuntimeArray %5
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeRuntimeArray %5
%20 = OpTypeStruct %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeRuntimeArray %5
%24 = OpTypeStruct %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeRuntimeArray %8
%28 = OpTypeStruct %27
%29 = OpTypePointer StorageBuffer %28
%30 = OpVariable %29 StorageBuffer
%31 = OpTypeRuntimeArray %5
%32 = OpTypeStruct %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeRuntimeArray %5
%36 = OpTypeStruct %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypePointer Input %5
%40 = OpVariable %39 Input
%41 = OpTypeInt 32 1
%42 = OpTypeVector %41 4
%43 = OpTypePointer Input %42
%44 = OpVariable %43 Input
%45 = OpTypeFloat 32
%46 = OpTypeVector %45 4
%47 = OpTypePointer Output %46
%48 = OpVariable %47 Output
%49 = OpTypePointer Input %41
%51 = OpConstant %5 0
%55 = OpConstant %5 1
%59 = OpConstant %5 2
%63 = OpConstant %5 3
%66 = OpTypePointer StorageBuffer %5
%71 = OpTypePointer StorageBuffer %8
%77 = OpTypeVector %8 2
%79 = OpTypeFloat 16
%80 = OpTypeVector %79 2
%103 = OpConstant %5 8
%119 = OpTypeVector %8 4
%121 = OpTypeVector %79 4
%135 = OpConstant %5 16
%149 = OpTypeVector %5 4
%201 = OpTypePointer Output %45
%3 = OpFunction %1 None %2
%4 = OpLabel
%104 = OpUndef %5
OpBranch %206
%206 = OpLabel
%50 = OpAccessChain %49 %44 %51
%52 = OpLoad %41 %50
%53 = OpBitcast %5 %52
%54 = OpAccessChain %49 %44 %55
%56 = OpLoad %41 %54
%57 = OpBitcast %5 %56
%58 = OpAccessChain %49 %44 %59
%60 = OpLoad %41 %58
%61 = OpBitcast %5 %60
%62 = OpAccessChain %49 %44 %63
%64 = OpLoad %41 %62
%65 = OpBitcast %5 %64
%67 = OpAccessChain %66 %12 %51 %53
%68 = OpLoad %5 %67
%69 = OpBitcast %45 %68
%70 = OpIMul %5 %57 %59
%72 = OpAccessChain %71 %14 %51 %70
%73 = OpLoad %8 %72
%75 = OpIAdd %5 %70 %55
%74 = OpAccessChain %71 %14 %51 %75
%76 = OpLoad %8 %74
%78 = OpCompositeConstruct %77 %73 %76
%81 = OpBitcast %80 %78
%82 = OpCompositeExtract %79 %81 0
%83 = OpCompositeExtract %79 %81 1
%84 = OpFConvert %45 %82
%85 = OpFConvert %45 %83
%86 = OpAccessChain %66 %26 %51 %61
%87 = OpLoad %5 %86
%88 = OpBitcast %45 %87
%89 = OpFAdd %45 %88 %85
%90 = OpIMul %5 %65 %59
%91 = OpAccessChain %71 %30 %51 %90
%92 = OpLoad %8 %91
%94 = OpIAdd %5 %90 %55
%93 = OpAccessChain %71 %30 %51 %94
%95 = OpLoad %8 %93
%96 = OpCompositeConstruct %77 %92 %95
%97 = OpBitcast %80 %96
%98 = OpCompositeExtract %79 %97 0
%99 = OpCompositeExtract %79 %97 1
%100 = OpFConvert %45 %98
%101 = OpFConvert %45 %99
%102 = OpFAdd %45 %101 %69
%105 = OpIMul %5 %103 %59
%106 = OpShiftRightLogical %5 %104 %55
%107 = OpIAdd %5 %105 %106
%108 = OpAccessChain %71 %14 %51 %107
%109 = OpLoad %8 %108
%111 = OpIAdd %5 %107 %55
%110 = OpAccessChain %71 %14 %51 %111
%112 = OpLoad %8 %110
%114 = OpIAdd %5 %107 %59
%113 = OpAccessChain %71 %14 %51 %114
%115 = OpLoad %8 %113
%117 = OpIAdd %5 %107 %63
%116 = OpAccessChain %71 %14 %51 %117
%118 = OpLoad %8 %116
%120 = OpCompositeConstruct %119 %109 %112 %115 %118
%122 = OpBitcast %121 %120
%123 = OpCompositeExtract %79 %122 0
%124 = OpCompositeExtract %79 %122 1
%125 = OpCompositeExtract %79 %122 2
%126 = OpCompositeExtract %79 %122 3
%127 = OpFConvert %45 %123
%128 = OpFConvert %45 %124
%129 = OpFConvert %45 %125
%130 = OpFConvert %45 %126
%131 = OpFAdd %45 %102 %127
%132 = OpFAdd %45 %128 %84
%133 = OpFAdd %45 %89 %129
%134 = OpFAdd %45 %130 %100
%136 = OpShiftRightLogical %5 %104 %59
%137 = OpIAdd %5 %135 %136
%138 = OpAccessChain %66 %12 %51 %137
%139 = OpLoad %5 %138
%141 = OpIAdd %5 %137 %55
%140 = OpAccessChain %66 %12 %51 %141
%142 = OpLoad %5 %140
%144 = OpIAdd %5 %137 %59
%143 = OpAccessChain %66 %12 %51 %144
%145 = OpLoad %5 %143
%147 = OpIAdd %5 %137 %63
%146 = OpAccessChain %66 %12 %51 %147
%148 = OpLoad %5 %146
%150 = OpCompositeConstruct %149 %139 %142 %145 %148
%151 = OpBitcast %46 %150
%152 = OpCompositeExtract %45 %151 0
%153 = OpCompositeExtract %45 %151 1
%154 = OpCompositeExtract %45 %151 2
%155 = OpCompositeExtract %45 %151 3
%156 = OpFAdd %45 %131 %152
%157 = OpFAdd %45 %132 %153
%158 = OpFAdd %45 %133 %154
%159 = OpFAdd %45 %134 %155
%160 = OpIMul %5 %103 %59
%161 = OpShiftRightLogical %5 %104 %55
%162 = OpIAdd %5 %160 %161
%163 = OpAccessChain %71 %30 %51 %162
%164 = OpLoad %8 %163
%166 = OpIAdd %5 %162 %55
%165 = OpAccessChain %71 %30 %51 %166
%167 = OpLoad %8 %165
%169 = OpIAdd %5 %162 %59
%168 = OpAccessChain %71 %30 %51 %169
%170 = OpLoad %8 %168
%172 = OpIAdd %5 %162 %63
%171 = OpAccessChain %71 %30 %51 %172
%173 = OpLoad %8 %171
%174 = OpCompositeConstruct %119 %164 %167 %170 %173
%175 = OpBitcast %121 %174
%176 = OpCompositeExtract %79 %175 0
%177 = OpCompositeExtract %79 %175 1
%178 = OpCompositeExtract %79 %175 2
%179 = OpCompositeExtract %79 %175 3
%180 = OpFConvert %45 %176
%181 = OpFConvert %45 %177
%182 = OpFConvert %45 %178
%183 = OpFConvert %45 %179
%184 = OpFAdd %45 %156 %180
%185 = OpFAdd %45 %157 %181
%186 = OpFAdd %45 %158 %182
%187 = OpFAdd %45 %159 %183
%188 = OpShiftRightLogical %5 %104 %59
%189 = OpIAdd %5 %135 %188
%190 = OpBitcast %5 %184
%191 = OpBitcast %5 %185
%192 = OpBitcast %5 %186
%193 = OpBitcast %5 %187
%194 = OpAccessChain %66 %26 %51 %189
OpStore %194 %190
%196 = OpIAdd %5 %189 %55
%195 = OpAccessChain %66 %26 %51 %196
OpStore %195 %191
%198 = OpIAdd %5 %189 %59
%197 = OpAccessChain %66 %26 %51 %198
OpStore %197 %192
%200 = OpIAdd %5 %189 %63
%199 = OpAccessChain %66 %26 %51 %200
OpStore %199 %193
%202 = OpAccessChain %201 %48 %51
OpStore %202 %184
%203 = OpAccessChain %201 %48 %55
OpStore %203 %185
%204 = OpAccessChain %201 %48 %59
OpStore %204 %186
%205 = OpAccessChain %201 %48 %63
OpStore %205 %187
OpReturn
OpFunctionEnd
#endif
