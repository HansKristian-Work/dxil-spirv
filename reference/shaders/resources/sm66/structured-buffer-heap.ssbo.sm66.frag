#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _13_16
{
    uvec2 _m0[];
} _16[];

layout(set = 0, binding = 0, scalar) restrict readonly buffer _19_22
{
    uvec3 _m0[];
} _22[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _25_28
{
    uvec4 _m0[];
} _28[];

layout(set = 0, binding = 0, std430) readonly buffer _30_33
{
    uint _m0[];
} _33[];

layout(set = 0, binding = 0, std430) buffer _35_38
{
    uvec2 _m0[];
} _38[];

layout(set = 0, binding = 0, scalar) readonly buffer _40_43
{
    uvec3 _m0[];
} _43[];

layout(set = 0, binding = 0, std430) readonly buffer _45_48
{
    uvec4 _m0[];
} _48[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _50_53
{
    uint _m0[];
} _53[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _55_58
{
    uvec2 _m0[];
} _58[];

layout(set = 0, binding = 0, scalar) coherent buffer _60_63
{
    uvec3 _m0[];
} _63[];

layout(set = 0, binding = 0, std430) coherent readonly buffer _65_68
{
    uvec4 _m0[];
} _68[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _83 = uint(UV.x);
    uint _87 = uint(UV.y);
    uint _91 = uint(UV.z);
    uint _95 = uint(UV.w);
    uint _112 = INDEX + 5u;
    uint _132 = INDEX + 10u;
    vec2 _148 = uintBitsToFloat(_16[INDEX + 1u]._m0[_87]);
    vec3 _156 = uintBitsToFloat(_22[INDEX + 2u]._m0[_91]);
    vec4 _165 = uintBitsToFloat(_28[INDEX + 3u]._m0[_95]);
    uint _174 = _33[INDEX + 4u]._m0[_83];
    vec2 _179 = uintBitsToFloat(_38[_112]._m0[_87]);
    uvec3 _185 = _43[INDEX + 6u]._m0[_91];
    vec3 _186 = uintBitsToFloat(_185);
    uvec4 _194 = _48[INDEX + 7u]._m0[_95];
    vec4 _195 = uintBitsToFloat(_194);
    uint _205 = _53[INDEX + 8u]._m0[_83];
    uvec2 _209 = _58[INDEX + 9u]._m0[_87];
    vec2 _210 = uintBitsToFloat(_209);
    uvec3 _216 = _63[_132]._m0[_91];
    vec3 _217 = uintBitsToFloat(_216);
    uvec4 _225 = _68[INDEX + 11u]._m0[_95];
    vec4 _226 = uintBitsToFloat(_225);
    _38[_112]._m0[_83] = uvec2(floatBitsToUint(20.0), floatBitsToUint(20.0));
    _63[_132]._m0[_87] = uvec3(floatBitsToUint(30.0), floatBitsToUint(30.0), floatBitsToUint(30.0));
    SV_Target.x = ((((((((((_148.x + uintBitsToFloat(_10[INDEX]._m0[_83])) + _156.x) + _165.x) + uintBitsToFloat(_174)) + _179.x) + _186.x) + _195.x) + uintBitsToFloat(_205)) + _210.x) + _217.x) + _226.x;
    SV_Target.y = (((((((_156.y + _148.y) + _165.y) + _179.y) + _186.y) + _195.y) + _210.y) + _217.y) + _226.y;
    SV_Target.z = ((((_165.z + _156.z) + _186.z) + _195.z) + _217.z) + _226.z;
    SV_Target.w = (_195.w + _165.w) + _226.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 253
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %70 %74 %78
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %13 "SSBO"
OpName %19 "SSBO"
OpName %25 "SSBO"
OpName %30 "SSBO"
OpName %35 "SSBO"
OpName %40 "SSBO"
OpName %45 "SSBO"
OpName %50 "SSBO"
OpName %55 "SSBO"
OpName %60 "SSBO"
OpName %65 "SSBO"
OpName %70 "INDEX"
OpName %74 "UV"
OpName %78 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %12 ArrayStride 8
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %16 NonWritable
OpDecorate %16 Restrict
OpDecorate %18 ArrayStride 12
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %22 NonWritable
OpDecorate %22 Restrict
OpDecorate %24 ArrayStride 16
OpMemberDecorate %25 0 Offset 0
OpDecorate %25 Block
OpDecorate %28 DescriptorSet 0
OpDecorate %28 Binding 0
OpDecorate %28 NonWritable
OpDecorate %28 Restrict
OpDecorate %29 ArrayStride 4
OpMemberDecorate %30 0 Offset 0
OpDecorate %30 Block
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 0
OpDecorate %33 NonWritable
OpDecorate %34 ArrayStride 8
OpMemberDecorate %35 0 Offset 0
OpDecorate %35 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 0
OpDecorate %39 ArrayStride 12
OpMemberDecorate %40 0 Offset 0
OpDecorate %40 Block
OpDecorate %43 DescriptorSet 0
OpDecorate %43 Binding 0
OpDecorate %43 NonWritable
OpDecorate %44 ArrayStride 16
OpMemberDecorate %45 0 Offset 0
OpDecorate %45 Block
OpDecorate %48 DescriptorSet 0
OpDecorate %48 Binding 0
OpDecorate %48 NonWritable
OpDecorate %49 ArrayStride 4
OpMemberDecorate %50 0 Offset 0
OpDecorate %50 Block
OpDecorate %53 DescriptorSet 0
OpDecorate %53 Binding 0
OpDecorate %53 NonWritable
OpDecorate %53 Coherent
OpDecorate %54 ArrayStride 8
OpMemberDecorate %55 0 Offset 0
OpDecorate %55 Block
OpDecorate %58 DescriptorSet 0
OpDecorate %58 Binding 0
OpDecorate %58 NonWritable
OpDecorate %58 Coherent
OpDecorate %59 ArrayStride 12
OpMemberDecorate %60 0 Offset 0
OpDecorate %60 Block
OpDecorate %63 DescriptorSet 0
OpDecorate %63 Binding 0
OpDecorate %63 Coherent
OpDecorate %64 ArrayStride 16
OpMemberDecorate %65 0 Offset 0
OpDecorate %65 Block
OpDecorate %68 DescriptorSet 0
OpDecorate %68 Binding 0
OpDecorate %68 NonWritable
OpDecorate %68 Coherent
OpDecorate %70 Flat
OpDecorate %70 Location 0
OpDecorate %74 Flat
OpDecorate %74 Location 1
OpDecorate %78 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeVector %5 2
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypeVector %5 3
%18 = OpTypeRuntimeArray %17
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeVector %5 4
%24 = OpTypeRuntimeArray %23
%25 = OpTypeStruct %24
%26 = OpTypeRuntimeArray %25
%27 = OpTypePointer StorageBuffer %26
%28 = OpVariable %27 StorageBuffer
%29 = OpTypeRuntimeArray %5
%30 = OpTypeStruct %29
%31 = OpTypeRuntimeArray %30
%32 = OpTypePointer StorageBuffer %31
%33 = OpVariable %32 StorageBuffer
%34 = OpTypeRuntimeArray %11
%35 = OpTypeStruct %34
%36 = OpTypeRuntimeArray %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypeRuntimeArray %17
%40 = OpTypeStruct %39
%41 = OpTypeRuntimeArray %40
%42 = OpTypePointer StorageBuffer %41
%43 = OpVariable %42 StorageBuffer
%44 = OpTypeRuntimeArray %23
%45 = OpTypeStruct %44
%46 = OpTypeRuntimeArray %45
%47 = OpTypePointer StorageBuffer %46
%48 = OpVariable %47 StorageBuffer
%49 = OpTypeRuntimeArray %5
%50 = OpTypeStruct %49
%51 = OpTypeRuntimeArray %50
%52 = OpTypePointer StorageBuffer %51
%53 = OpVariable %52 StorageBuffer
%54 = OpTypeRuntimeArray %11
%55 = OpTypeStruct %54
%56 = OpTypeRuntimeArray %55
%57 = OpTypePointer StorageBuffer %56
%58 = OpVariable %57 StorageBuffer
%59 = OpTypeRuntimeArray %17
%60 = OpTypeStruct %59
%61 = OpTypeRuntimeArray %60
%62 = OpTypePointer StorageBuffer %61
%63 = OpVariable %62 StorageBuffer
%64 = OpTypeRuntimeArray %23
%65 = OpTypeStruct %64
%66 = OpTypeRuntimeArray %65
%67 = OpTypePointer StorageBuffer %66
%68 = OpVariable %67 StorageBuffer
%69 = OpTypePointer Input %5
%70 = OpVariable %69 Input
%71 = OpTypeInt 32 1
%72 = OpTypeVector %71 4
%73 = OpTypePointer Input %72
%74 = OpVariable %73 Input
%75 = OpTypeFloat 32
%76 = OpTypeVector %75 4
%77 = OpTypePointer Output %76
%78 = OpVariable %77 Output
%79 = OpTypePointer Input %71
%81 = OpConstant %5 0
%85 = OpConstant %5 1
%89 = OpConstant %5 2
%93 = OpConstant %5 3
%97 = OpTypePointer StorageBuffer %7
%100 = OpTypePointer StorageBuffer %13
%103 = OpTypePointer StorageBuffer %19
%106 = OpTypePointer StorageBuffer %25
%109 = OpConstant %5 4
%110 = OpTypePointer StorageBuffer %30
%113 = OpConstant %5 5
%114 = OpTypePointer StorageBuffer %35
%117 = OpConstant %5 6
%118 = OpTypePointer StorageBuffer %40
%121 = OpConstant %5 7
%122 = OpTypePointer StorageBuffer %45
%125 = OpConstant %5 8
%126 = OpTypePointer StorageBuffer %50
%129 = OpConstant %5 9
%130 = OpTypePointer StorageBuffer %55
%133 = OpConstant %5 10
%134 = OpTypePointer StorageBuffer %60
%137 = OpConstant %5 11
%138 = OpTypePointer StorageBuffer %65
%140 = OpTypePointer StorageBuffer %5
%144 = OpTypePointer StorageBuffer %11
%147 = OpTypeVector %75 2
%152 = OpTypePointer StorageBuffer %17
%155 = OpTypeVector %75 3
%162 = OpTypePointer StorageBuffer %23
%235 = OpConstant %75 20
%240 = OpConstant %75 30
%246 = OpTypePointer Output %75
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %251
%251 = OpLabel
%80 = OpAccessChain %79 %74 %81
%82 = OpLoad %71 %80
%83 = OpBitcast %5 %82
%84 = OpAccessChain %79 %74 %85
%86 = OpLoad %71 %84
%87 = OpBitcast %5 %86
%88 = OpAccessChain %79 %74 %89
%90 = OpLoad %71 %88
%91 = OpBitcast %5 %90
%92 = OpAccessChain %79 %74 %93
%94 = OpLoad %71 %92
%95 = OpBitcast %5 %94
%96 = OpLoad %5 %70
%98 = OpAccessChain %97 %10 %96
%99 = OpIAdd %5 %96 %85
%101 = OpAccessChain %100 %16 %99
%102 = OpIAdd %5 %96 %89
%104 = OpAccessChain %103 %22 %102
%105 = OpIAdd %5 %96 %93
%107 = OpAccessChain %106 %28 %105
%108 = OpIAdd %5 %96 %109
%111 = OpAccessChain %110 %33 %108
%112 = OpIAdd %5 %96 %113
%115 = OpAccessChain %114 %38 %112
%116 = OpIAdd %5 %96 %117
%119 = OpAccessChain %118 %43 %116
%120 = OpIAdd %5 %96 %121
%123 = OpAccessChain %122 %48 %120
%124 = OpIAdd %5 %96 %125
%127 = OpAccessChain %126 %53 %124
%128 = OpIAdd %5 %96 %129
%131 = OpAccessChain %130 %58 %128
%132 = OpIAdd %5 %96 %133
%135 = OpAccessChain %134 %63 %132
%136 = OpIAdd %5 %96 %137
%139 = OpAccessChain %138 %68 %136
%141 = OpAccessChain %140 %98 %81 %83
%142 = OpLoad %5 %141
%143 = OpBitcast %75 %142
%145 = OpAccessChain %144 %101 %81 %87
%146 = OpLoad %11 %145
%148 = OpBitcast %147 %146
%149 = OpCompositeExtract %75 %148 0
%150 = OpCompositeExtract %75 %148 1
%151 = OpFAdd %75 %149 %143
%153 = OpAccessChain %152 %104 %81 %91
%154 = OpLoad %17 %153
%156 = OpBitcast %155 %154
%157 = OpCompositeExtract %75 %156 0
%158 = OpCompositeExtract %75 %156 1
%159 = OpCompositeExtract %75 %156 2
%160 = OpFAdd %75 %151 %157
%161 = OpFAdd %75 %158 %150
%163 = OpAccessChain %162 %107 %81 %95
%164 = OpLoad %23 %163
%165 = OpBitcast %76 %164
%166 = OpCompositeExtract %75 %165 0
%167 = OpCompositeExtract %75 %165 1
%168 = OpCompositeExtract %75 %165 2
%169 = OpCompositeExtract %75 %165 3
%170 = OpFAdd %75 %160 %166
%171 = OpFAdd %75 %161 %167
%172 = OpFAdd %75 %168 %159
%173 = OpAccessChain %140 %111 %81 %83
%174 = OpLoad %5 %173
%175 = OpBitcast %75 %174
%176 = OpFAdd %75 %170 %175
%177 = OpAccessChain %144 %115 %81 %87
%178 = OpLoad %11 %177
%179 = OpBitcast %147 %178
%180 = OpCompositeExtract %75 %179 0
%181 = OpCompositeExtract %75 %179 1
%182 = OpFAdd %75 %176 %180
%183 = OpFAdd %75 %171 %181
%184 = OpAccessChain %152 %119 %81 %91
%185 = OpLoad %17 %184
%186 = OpBitcast %155 %185
%187 = OpCompositeExtract %75 %186 0
%188 = OpCompositeExtract %75 %186 1
%189 = OpCompositeExtract %75 %186 2
%190 = OpFAdd %75 %182 %187
%191 = OpFAdd %75 %183 %188
%192 = OpFAdd %75 %172 %189
%193 = OpAccessChain %162 %123 %81 %95
%194 = OpLoad %23 %193
%195 = OpBitcast %76 %194
%196 = OpCompositeExtract %75 %195 0
%197 = OpCompositeExtract %75 %195 1
%198 = OpCompositeExtract %75 %195 2
%199 = OpCompositeExtract %75 %195 3
%200 = OpFAdd %75 %190 %196
%201 = OpFAdd %75 %191 %197
%202 = OpFAdd %75 %192 %198
%203 = OpFAdd %75 %199 %169
%204 = OpAccessChain %140 %127 %81 %83
%205 = OpLoad %5 %204
%206 = OpBitcast %75 %205
%207 = OpFAdd %75 %200 %206
%208 = OpAccessChain %144 %131 %81 %87
%209 = OpLoad %11 %208
%210 = OpBitcast %147 %209
%211 = OpCompositeExtract %75 %210 0
%212 = OpCompositeExtract %75 %210 1
%213 = OpFAdd %75 %207 %211
%214 = OpFAdd %75 %201 %212
%215 = OpAccessChain %152 %135 %81 %91
%216 = OpLoad %17 %215
%217 = OpBitcast %155 %216
%218 = OpCompositeExtract %75 %217 0
%219 = OpCompositeExtract %75 %217 1
%220 = OpCompositeExtract %75 %217 2
%221 = OpFAdd %75 %213 %218
%222 = OpFAdd %75 %214 %219
%223 = OpFAdd %75 %202 %220
%224 = OpAccessChain %162 %139 %81 %95
%225 = OpLoad %23 %224
%226 = OpBitcast %76 %225
%227 = OpCompositeExtract %75 %226 0
%228 = OpCompositeExtract %75 %226 1
%229 = OpCompositeExtract %75 %226 2
%230 = OpCompositeExtract %75 %226 3
%231 = OpFAdd %75 %221 %227
%232 = OpFAdd %75 %222 %228
%233 = OpFAdd %75 %223 %229
%234 = OpFAdd %75 %203 %230
%236 = OpBitcast %5 %235
%237 = OpBitcast %5 %235
%238 = OpCompositeConstruct %11 %236 %237
%239 = OpAccessChain %144 %115 %81 %83
OpStore %239 %238
%241 = OpBitcast %5 %240
%242 = OpBitcast %5 %240
%243 = OpBitcast %5 %240
%244 = OpCompositeConstruct %17 %241 %242 %243
%245 = OpAccessChain %152 %135 %81 %87
OpStore %245 %244
%247 = OpAccessChain %246 %78 %81
OpStore %247 %231
%248 = OpAccessChain %246 %78 %85
OpStore %248 %232
%249 = OpAccessChain %246 %78 %89
OpStore %249 %233
%250 = OpAccessChain %246 %78 %93
OpStore %250 %234
OpReturn
OpFunctionEnd
#endif
