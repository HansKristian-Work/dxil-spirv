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
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 1, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _13[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _16_19
{
    uint16_t _m0[];
} _19[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _22_25
{
    u16vec4 _m0[];
} _25[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _28_31
{
    uvec4 _m0[];
} _31[];

layout(set = 4, binding = 0, std430) readonly buffer _33_36
{
    uint _m0[];
} _36[];

layout(set = 4, binding = 0, std430) readonly buffer _38_41
{
    uint16_t _m0[];
} _41[];

layout(set = 4, binding = 0, std430) buffer _43_46
{
    u16vec4 _m0[];
} _46[];

layout(set = 4, binding = 0, std430) buffer _48_51
{
    uvec4 _m0[];
} _51[];

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

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _92 = registers._m1 + 1u;
    uint _93 = uint(UV.y) * 2u;
    f16vec2 _104 = uint16BitsToFloat16(u16vec2(_19[_92]._m0[_93], _19[_92]._m0[_93 + 1u]));
    uint _116 = _36[registers._m4 + 2u]._m0[uint(UV.z)];
    uint _123 = registers._m4 + 3u;
    uint _124 = uint(UV.w) * 2u;
    uint16_t _126 = _41[_123]._m0[_124];
    uint16_t _129 = _41[_123]._m0[_124 + 1u];
    f16vec2 _131 = uint16BitsToFloat16(u16vec2(_126, _129));
    f16vec4 _151 = uint16BitsToFloat16(_25[registers._m1 + 4u]._m0[1u]);
    vec4 _167 = uintBitsToFloat(_31[registers._m1 + 4u]._m0[1u]);
    u16vec4 _188 = _46[registers._m4 + 5u]._m0[1u];
    f16vec4 _189 = uint16BitsToFloat16(_188);
    float _198 = (((float(_131.y) + uintBitsToFloat(_13[registers._m1]._m0[uint(UV.x)])) + float(_151.x)) + _167.x) + float(_189.x);
    float _199 = ((float(_151.y) + float(_104.x)) + _167.y) + float(_189.y);
    float _200 = (((uintBitsToFloat(_116) + float(_104.y)) + float(_151.z)) + _167.z) + float(_189.z);
    float _201 = ((float(_151.w) + float(_131.x)) + _167.w) + float(_189.w);
    _51[registers._m4 + 5u]._m0[1u] = uvec4(floatBitsToUint(_198), floatBitsToUint(_199), floatBitsToUint(_200), floatBitsToUint(_201));
    SV_Target.x = _198;
    SV_Target.y = _199;
    SV_Target.z = _200;
    SV_Target.w = _201;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 215
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %53 %57 %61
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %16 "SSBO"
OpName %22 "SSBO"
OpName %28 "SSBO"
OpName %33 "SSBO"
OpName %38 "SSBO"
OpName %43 "SSBO"
OpName %48 "SSBO"
OpName %53 "INDEX"
OpName %57 "UV"
OpName %61 "SV_Target"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %9 ArrayStride 4
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 1
OpDecorate %13 Binding 0
OpDecorate %13 NonWritable
OpDecorate %13 Restrict
OpDecorate %15 ArrayStride 2
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %19 NonWritable
OpDecorate %19 Restrict
OpDecorate %21 ArrayStride 8
OpMemberDecorate %22 0 Offset 0
OpDecorate %22 Block
OpDecorate %25 DescriptorSet 1
OpDecorate %25 Binding 0
OpDecorate %25 NonWritable
OpDecorate %25 Restrict
OpDecorate %27 ArrayStride 16
OpMemberDecorate %28 0 Offset 0
OpDecorate %28 Block
OpDecorate %31 DescriptorSet 1
OpDecorate %31 Binding 0
OpDecorate %31 NonWritable
OpDecorate %31 Restrict
OpDecorate %32 ArrayStride 4
OpMemberDecorate %33 0 Offset 0
OpDecorate %33 Block
OpDecorate %36 DescriptorSet 4
OpDecorate %36 Binding 0
OpDecorate %36 NonWritable
OpDecorate %37 ArrayStride 2
OpMemberDecorate %38 0 Offset 0
OpDecorate %38 Block
OpDecorate %41 DescriptorSet 4
OpDecorate %41 Binding 0
OpDecorate %41 NonWritable
OpDecorate %42 ArrayStride 8
OpMemberDecorate %43 0 Offset 0
OpDecorate %43 Block
OpDecorate %46 DescriptorSet 4
OpDecorate %46 Binding 0
OpDecorate %46 Aliased
OpDecorate %47 ArrayStride 16
OpMemberDecorate %48 0 Offset 0
OpDecorate %48 Block
OpDecorate %51 DescriptorSet 4
OpDecorate %51 Binding 0
OpDecorate %51 Aliased
OpDecorate %53 Flat
OpDecorate %53 Location 0
OpDecorate %57 Flat
OpDecorate %57 Location 1
OpDecorate %61 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeRuntimeArray %5
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeInt 16 0
%15 = OpTypeRuntimeArray %14
%16 = OpTypeStruct %15
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer StorageBuffer %17
%19 = OpVariable %18 StorageBuffer
%20 = OpTypeVector %14 4
%21 = OpTypeRuntimeArray %20
%22 = OpTypeStruct %21
%23 = OpTypeRuntimeArray %22
%24 = OpTypePointer StorageBuffer %23
%25 = OpVariable %24 StorageBuffer
%26 = OpTypeVector %5 4
%27 = OpTypeRuntimeArray %26
%28 = OpTypeStruct %27
%29 = OpTypeRuntimeArray %28
%30 = OpTypePointer StorageBuffer %29
%31 = OpVariable %30 StorageBuffer
%32 = OpTypeRuntimeArray %5
%33 = OpTypeStruct %32
%34 = OpTypeRuntimeArray %33
%35 = OpTypePointer StorageBuffer %34
%36 = OpVariable %35 StorageBuffer
%37 = OpTypeRuntimeArray %14
%38 = OpTypeStruct %37
%39 = OpTypeRuntimeArray %38
%40 = OpTypePointer StorageBuffer %39
%41 = OpVariable %40 StorageBuffer
%42 = OpTypeRuntimeArray %20
%43 = OpTypeStruct %42
%44 = OpTypeRuntimeArray %43
%45 = OpTypePointer StorageBuffer %44
%46 = OpVariable %45 StorageBuffer
%47 = OpTypeRuntimeArray %26
%48 = OpTypeStruct %47
%49 = OpTypeRuntimeArray %48
%50 = OpTypePointer StorageBuffer %49
%51 = OpVariable %50 StorageBuffer
%52 = OpTypePointer Input %5
%53 = OpVariable %52 Input
%54 = OpTypeInt 32 1
%55 = OpTypeVector %54 4
%56 = OpTypePointer Input %55
%57 = OpVariable %56 Input
%58 = OpTypeFloat 32
%59 = OpTypeVector %58 4
%60 = OpTypePointer Output %59
%61 = OpVariable %60 Output
%62 = OpTypePointer Input %54
%64 = OpConstant %5 0
%68 = OpConstant %5 1
%72 = OpConstant %5 2
%76 = OpConstant %5 3
%79 = OpTypePointer StorageBuffer %10
%81 = OpTypePointer PushConstant %5
%84 = OpTypePointer StorageBuffer %5
%88 = OpTypePointer StorageBuffer %16
%94 = OpTypePointer StorageBuffer %14
%100 = OpTypeVector %14 2
%102 = OpTypeFloat 16
%103 = OpTypeVector %102 2
%109 = OpTypePointer StorageBuffer %33
%112 = OpConstant %5 4
%119 = OpTypePointer StorageBuffer %38
%137 = OpTypePointer StorageBuffer %22
%142 = OpTypePointer StorageBuffer %28
%147 = OpTypePointer StorageBuffer %20
%150 = OpTypeVector %102 4
%164 = OpTypePointer StorageBuffer %26
%176 = OpTypePointer StorageBuffer %43
%181 = OpConstant %5 5
%182 = OpTypePointer StorageBuffer %48
%208 = OpTypePointer Output %58
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %213
%213 = OpLabel
%63 = OpAccessChain %62 %57 %64
%65 = OpLoad %54 %63
%66 = OpBitcast %5 %65
%67 = OpAccessChain %62 %57 %68
%69 = OpLoad %54 %67
%70 = OpBitcast %5 %69
%71 = OpAccessChain %62 %57 %72
%73 = OpLoad %54 %71
%74 = OpBitcast %5 %73
%75 = OpAccessChain %62 %57 %76
%77 = OpLoad %54 %75
%78 = OpBitcast %5 %77
%82 = OpAccessChain %81 %8 %68
%83 = OpLoad %5 %82
%80 = OpAccessChain %79 %13 %83
%85 = OpAccessChain %84 %80 %64 %66
%86 = OpLoad %5 %85
%87 = OpBitcast %58 %86
%90 = OpAccessChain %81 %8 %68
%91 = OpLoad %5 %90
%92 = OpIAdd %5 %91 %68
%89 = OpAccessChain %88 %19 %92
%93 = OpIMul %5 %70 %72
%95 = OpAccessChain %94 %89 %64 %93
%96 = OpLoad %14 %95
%98 = OpIAdd %5 %93 %68
%97 = OpAccessChain %94 %89 %64 %98
%99 = OpLoad %14 %97
%101 = OpCompositeConstruct %100 %96 %99
%104 = OpBitcast %103 %101
%105 = OpCompositeExtract %102 %104 0
%106 = OpCompositeExtract %102 %104 1
%107 = OpFConvert %58 %105
%108 = OpFConvert %58 %106
%111 = OpAccessChain %81 %8 %112
%113 = OpLoad %5 %111
%114 = OpIAdd %5 %113 %72
%110 = OpAccessChain %109 %36 %114
%115 = OpAccessChain %84 %110 %64 %74
%116 = OpLoad %5 %115
%117 = OpBitcast %58 %116
%118 = OpFAdd %58 %117 %108
%121 = OpAccessChain %81 %8 %112
%122 = OpLoad %5 %121
%123 = OpIAdd %5 %122 %76
%120 = OpAccessChain %119 %41 %123
%124 = OpIMul %5 %78 %72
%125 = OpAccessChain %94 %120 %64 %124
%126 = OpLoad %14 %125
%128 = OpIAdd %5 %124 %68
%127 = OpAccessChain %94 %120 %64 %128
%129 = OpLoad %14 %127
%130 = OpCompositeConstruct %100 %126 %129
%131 = OpBitcast %103 %130
%132 = OpCompositeExtract %102 %131 0
%133 = OpCompositeExtract %102 %131 1
%134 = OpFConvert %58 %132
%135 = OpFConvert %58 %133
%136 = OpFAdd %58 %135 %87
%139 = OpAccessChain %81 %8 %68
%140 = OpLoad %5 %139
%141 = OpIAdd %5 %140 %112
%138 = OpAccessChain %137 %25 %141
%144 = OpAccessChain %81 %8 %68
%145 = OpLoad %5 %144
%146 = OpIAdd %5 %145 %112
%143 = OpAccessChain %142 %31 %146
%148 = OpAccessChain %147 %138 %64 %68
%149 = OpLoad %20 %148
%151 = OpBitcast %150 %149
%152 = OpCompositeExtract %102 %151 0
%153 = OpCompositeExtract %102 %151 1
%154 = OpCompositeExtract %102 %151 2
%155 = OpCompositeExtract %102 %151 3
%156 = OpFConvert %58 %152
%157 = OpFConvert %58 %153
%158 = OpFConvert %58 %154
%159 = OpFConvert %58 %155
%160 = OpFAdd %58 %136 %156
%161 = OpFAdd %58 %157 %107
%162 = OpFAdd %58 %118 %158
%163 = OpFAdd %58 %159 %134
%165 = OpAccessChain %164 %143 %64 %68
%166 = OpLoad %26 %165
%167 = OpBitcast %59 %166
%168 = OpCompositeExtract %58 %167 0
%169 = OpCompositeExtract %58 %167 1
%170 = OpCompositeExtract %58 %167 2
%171 = OpCompositeExtract %58 %167 3
%172 = OpFAdd %58 %160 %168
%173 = OpFAdd %58 %161 %169
%174 = OpFAdd %58 %162 %170
%175 = OpFAdd %58 %163 %171
%178 = OpAccessChain %81 %8 %112
%179 = OpLoad %5 %178
%180 = OpIAdd %5 %179 %181
%177 = OpAccessChain %176 %46 %180
%184 = OpAccessChain %81 %8 %112
%185 = OpLoad %5 %184
%186 = OpIAdd %5 %185 %181
%183 = OpAccessChain %182 %51 %186
%187 = OpAccessChain %147 %177 %64 %68
%188 = OpLoad %20 %187
%189 = OpBitcast %150 %188
%190 = OpCompositeExtract %102 %189 0
%191 = OpCompositeExtract %102 %189 1
%192 = OpCompositeExtract %102 %189 2
%193 = OpCompositeExtract %102 %189 3
%194 = OpFConvert %58 %190
%195 = OpFConvert %58 %191
%196 = OpFConvert %58 %192
%197 = OpFConvert %58 %193
%198 = OpFAdd %58 %172 %194
%199 = OpFAdd %58 %173 %195
%200 = OpFAdd %58 %174 %196
%201 = OpFAdd %58 %175 %197
%202 = OpBitcast %5 %198
%203 = OpBitcast %5 %199
%204 = OpBitcast %5 %200
%205 = OpBitcast %5 %201
%206 = OpCompositeConstruct %26 %202 %203 %204 %205
%207 = OpAccessChain %164 %183 %64 %68
OpStore %207 %206
%209 = OpAccessChain %208 %61 %64
OpStore %209 %198
%210 = OpAccessChain %208 %61 %68
OpStore %210 %199
%211 = OpAccessChain %208 %61 %72
OpStore %211 %200
%212 = OpAccessChain %208 %61 %76
OpStore %212 %201
OpReturn
OpFunctionEnd
#endif
