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
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_EXT_shader_subgroup_extended_types_float16 : require

uvec2 _36;
uvec3 _100;
vec4 _160;
f16vec4 _207;

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 1, scalar) writeonly buffer _13_15
{
    uvec3 _m0[];
} _15;

layout(set = 0, binding = 2, std430) writeonly buffer _18_20
{
    uvec4 _m0[];
} _20;

layout(set = 0, binding = 3, std430) writeonly buffer _24_26
{
    u16vec4 _m0[];
} _26;

layout(location = 0) flat in uint INDEX;

void main()
{
    if (INDEX == 40u)
    {
        demote;
    }
    uint _33 = INDEX + 1u;
    uvec2 _35;
    _35.x = INDEX;
    _35.y = _33;
    bool _40 = helperInvocationEXT();
    uint _44 = INDEX * 7u;
    _10._m0[INDEX * 7u] = subgroupAdd(_40 ? uvec2(0u) : _35);
    bool _50 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 1u] = subgroupMul(_50 ? uvec2(1u) : _35);
    bool _58 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 2u] = subgroupAnd(_58 ? uvec2(4294967295u) : _35);
    bool _68 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 3u] = subgroupOr(_68 ? uvec2(0u) : _35);
    bool _75 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 4u] = subgroupXor(_75 ? uvec2(0u) : _35);
    bool _83 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 5u] = subgroupMin(_83 ? uvec2(4294967295u) : _35);
    bool _91 = helperInvocationEXT();
    _10._m0[(INDEX * 7u) + 6u] = subgroupMax(_91 ? uvec2(0u) : _35);
    uint _98 = INDEX + 2u;
    uvec3 _99;
    _99.x = INDEX;
    _99.y = _33;
    _99.z = _98;
    bool _104 = helperInvocationEXT();
    _15._m0[INDEX * 7u] = subgroupAdd(_104 ? uvec3(0u) : _99);
    bool _111 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 1u] = subgroupMul(_111 ? uvec3(1u) : _99);
    bool _118 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 2u] = subgroupAnd(_118 ? uvec3(4294967295u) : _99);
    bool _125 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 3u] = subgroupOr(_125 ? uvec3(0u) : _99);
    bool _131 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 4u] = subgroupXor(_131 ? uvec3(0u) : _99);
    bool _137 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 5u] = uvec3(subgroupMin(ivec3(_137 ? uvec3(2147483647u) : _99)));
    bool _145 = helperInvocationEXT();
    _15._m0[(INDEX * 7u) + 6u] = uvec3(subgroupMax(ivec3(_145 ? uvec3(2147483648u) : _99)));
    uint _156 = INDEX + 3u;
    vec4 _159;
    _159.x = float(INDEX);
    _159.y = float(_33);
    _159.z = float(_98);
    _159.w = float(_156);
    bool _165 = helperInvocationEXT();
    _20._m0[INDEX * 7u] = floatBitsToUint(subgroupAdd(_165 ? vec4(0.0) : _159));
    bool _174 = helperInvocationEXT();
    _20._m0[(INDEX * 7u) + 1u] = floatBitsToUint(subgroupMul(_174 ? vec4(1.0) : _159));
    bool _183 = helperInvocationEXT();
    _20._m0[(INDEX * 7u) + 2u] = floatBitsToUint(subgroupMin(_183 ? vec4(uintBitsToFloat(0x7f800000u /* inf */)) : _159));
    bool _192 = helperInvocationEXT();
    _20._m0[(INDEX * 7u) + 3u] = floatBitsToUint(subgroupMax(_192 ? vec4(uintBitsToFloat(0xff800000u /* -inf */)) : _159));
    f16vec4 _206;
    _206.x = float16_t(INDEX);
    _206.y = float16_t(_33);
    _206.z = float16_t(_98);
    _206.w = float16_t(_156);
    bool _212 = helperInvocationEXT();
    _26._m0[INDEX * 7u] = float16BitsToUint16(subgroupAdd(_212 ? f16vec4(float16_t(0.0)) : _206));
    bool _221 = helperInvocationEXT();
    _26._m0[(INDEX * 7u) + 1u] = float16BitsToUint16(subgroupMul(_221 ? f16vec4(float16_t(1.0)) : _206));
    bool _230 = helperInvocationEXT();
    _26._m0[(INDEX * 7u) + 2u] = float16BitsToUint16(subgroupMin(_230 ? f16vec4(float16_t(1.0 / 0.0)) : _206));
    bool _239 = helperInvocationEXT();
    _26._m0[(INDEX * 7u) + 3u] = float16BitsToUint16(subgroupMax(_239 ? f16vec4(float16_t(-1.0 / 0.0)) : _206));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 251
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability GroupNonUniformArithmetic
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %15 %20 %26 %28
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %24 "SSBO"
OpName %28 "INDEX"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonReadable
OpDecorate %12 ArrayStride 12
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 1
OpDecorate %15 NonReadable
OpDecorate %17 ArrayStride 16
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 2
OpDecorate %20 NonReadable
OpDecorate %23 ArrayStride 8
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 3
OpDecorate %26 NonReadable
OpDecorate %28 Flat
OpDecorate %28 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeVector %5 3
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypeVector %5 4
%17 = OpTypeRuntimeArray %16
%18 = OpTypeStruct %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeInt 16 0
%22 = OpTypeVector %21 4
%23 = OpTypeRuntimeArray %22
%24 = OpTypeStruct %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypePointer Input %5
%28 = OpVariable %27 Input
%30 = OpTypeBool
%32 = OpConstant %5 40
%34 = OpConstant %5 1
%39 = OpConstant %5 3
%41 = OpConstant %5 0
%42 = OpConstantComposite %6 %41 %41
%45 = OpConstant %5 7
%47 = OpTypePointer StorageBuffer %6
%51 = OpConstantComposite %6 %34 %34
%59 = OpConstant %5 4294967295
%60 = OpConstantComposite %6 %59 %59
%63 = OpConstant %5 2
%78 = OpConstant %5 4
%86 = OpConstant %5 5
%94 = OpConstant %5 6
%105 = OpConstantComposite %11 %41 %41 %41
%108 = OpTypePointer StorageBuffer %11
%112 = OpConstantComposite %11 %34 %34 %34
%119 = OpConstantComposite %11 %59 %59 %59
%138 = OpConstant %5 2147483647
%139 = OpConstantComposite %11 %138 %138 %138
%146 = OpConstant %5 2147483648
%147 = OpConstantComposite %11 %146 %146 %146
%152 = OpTypeFloat 32
%158 = OpTypeVector %152 4
%166 = OpConstant %152 0
%167 = OpConstantComposite %158 %166 %166 %166 %166
%171 = OpTypePointer StorageBuffer %16
%175 = OpConstant %152 1
%176 = OpConstantComposite %158 %175 %175 %175 %175
%184 = OpConstant %152 0x1p+128
%185 = OpConstantComposite %158 %184 %184 %184 %184
%193 = OpConstant %152 -0x1p+128
%194 = OpConstantComposite %158 %193 %193 %193 %193
%200 = OpTypeFloat 16
%205 = OpTypeVector %200 4
%213 = OpConstant %200 0x0p+0
%214 = OpConstantComposite %205 %213 %213 %213 %213
%218 = OpTypePointer StorageBuffer %22
%222 = OpConstant %200 0x1p+0
%223 = OpConstantComposite %205 %222 %222 %222 %222
%231 = OpConstant %200 0x1p+16
%232 = OpConstantComposite %205 %231 %231 %231 %231
%240 = OpConstant %200 -0x1p+16
%241 = OpConstantComposite %205 %240 %240 %240 %240
%3 = OpFunction %1 None %2
%4 = OpLabel
%36 = OpUndef %6
%100 = OpUndef %11
%160 = OpUndef %158
%207 = OpUndef %205
OpBranch %247
%247 = OpLabel
%29 = OpLoad %5 %28
%31 = OpIEqual %30 %29 %32
OpSelectionMerge %249 None
OpBranchConditional %31 %248 %249
%248 = OpLabel
OpDemoteToHelperInvocation
OpBranch %249
%249 = OpLabel
OpBranch %250
%250 = OpLabel
%33 = OpIAdd %5 %29 %34
%35 = OpCompositeInsert %6 %29 %36 0
%37 = OpCompositeInsert %6 %33 %35 1
%40 = OpIsHelperInvocationEXT %30
%43 = OpSelect %6 %40 %42 %37
%38 = OpGroupNonUniformIAdd %6 %39 Reduce %43
%44 = OpIMul %5 %29 %45
%46 = OpIMul %5 %29 %45
%48 = OpAccessChain %47 %10 %41 %46
OpStore %48 %38 NonPrivatePointer
%50 = OpIsHelperInvocationEXT %30
%52 = OpSelect %6 %50 %51 %37
%49 = OpGroupNonUniformIMul %6 %39 Reduce %52
%53 = OpIAdd %5 %44 %34
%54 = OpIMul %5 %29 %45
%55 = OpIAdd %5 %54 %34
%56 = OpAccessChain %47 %10 %41 %55
OpStore %56 %49 NonPrivatePointer
%58 = OpIsHelperInvocationEXT %30
%61 = OpSelect %6 %58 %60 %37
%57 = OpGroupNonUniformBitwiseAnd %6 %39 Reduce %61
%62 = OpIAdd %5 %44 %63
%64 = OpIMul %5 %29 %45
%65 = OpIAdd %5 %64 %63
%66 = OpAccessChain %47 %10 %41 %65
OpStore %66 %57 NonPrivatePointer
%68 = OpIsHelperInvocationEXT %30
%69 = OpSelect %6 %68 %42 %37
%67 = OpGroupNonUniformBitwiseOr %6 %39 Reduce %69
%70 = OpIAdd %5 %44 %39
%71 = OpIMul %5 %29 %45
%72 = OpIAdd %5 %71 %39
%73 = OpAccessChain %47 %10 %41 %72
OpStore %73 %67 NonPrivatePointer
%75 = OpIsHelperInvocationEXT %30
%76 = OpSelect %6 %75 %42 %37
%74 = OpGroupNonUniformBitwiseXor %6 %39 Reduce %76
%77 = OpIAdd %5 %44 %78
%79 = OpIMul %5 %29 %45
%80 = OpIAdd %5 %79 %78
%81 = OpAccessChain %47 %10 %41 %80
OpStore %81 %74 NonPrivatePointer
%83 = OpIsHelperInvocationEXT %30
%84 = OpSelect %6 %83 %60 %37
%82 = OpGroupNonUniformUMin %6 %39 Reduce %84
%85 = OpIAdd %5 %44 %86
%87 = OpIMul %5 %29 %45
%88 = OpIAdd %5 %87 %86
%89 = OpAccessChain %47 %10 %41 %88
OpStore %89 %82 NonPrivatePointer
%91 = OpIsHelperInvocationEXT %30
%92 = OpSelect %6 %91 %42 %37
%90 = OpGroupNonUniformUMax %6 %39 Reduce %92
%93 = OpIAdd %5 %44 %94
%95 = OpIMul %5 %29 %45
%96 = OpIAdd %5 %95 %94
%97 = OpAccessChain %47 %10 %41 %96
OpStore %97 %90 NonPrivatePointer
%98 = OpIAdd %5 %29 %63
%99 = OpCompositeInsert %11 %29 %100 0
%101 = OpCompositeInsert %11 %33 %99 1
%102 = OpCompositeInsert %11 %98 %101 2
%104 = OpIsHelperInvocationEXT %30
%106 = OpSelect %11 %104 %105 %102
%103 = OpGroupNonUniformIAdd %11 %39 Reduce %106
%107 = OpIMul %5 %29 %45
%109 = OpAccessChain %108 %15 %41 %107
OpStore %109 %103 NonPrivatePointer
%111 = OpIsHelperInvocationEXT %30
%113 = OpSelect %11 %111 %112 %102
%110 = OpGroupNonUniformIMul %11 %39 Reduce %113
%114 = OpIMul %5 %29 %45
%115 = OpIAdd %5 %114 %34
%116 = OpAccessChain %108 %15 %41 %115
OpStore %116 %110 NonPrivatePointer
%118 = OpIsHelperInvocationEXT %30
%120 = OpSelect %11 %118 %119 %102
%117 = OpGroupNonUniformBitwiseAnd %11 %39 Reduce %120
%121 = OpIMul %5 %29 %45
%122 = OpIAdd %5 %121 %63
%123 = OpAccessChain %108 %15 %41 %122
OpStore %123 %117 NonPrivatePointer
%125 = OpIsHelperInvocationEXT %30
%126 = OpSelect %11 %125 %105 %102
%124 = OpGroupNonUniformBitwiseOr %11 %39 Reduce %126
%127 = OpIMul %5 %29 %45
%128 = OpIAdd %5 %127 %39
%129 = OpAccessChain %108 %15 %41 %128
OpStore %129 %124 NonPrivatePointer
%131 = OpIsHelperInvocationEXT %30
%132 = OpSelect %11 %131 %105 %102
%130 = OpGroupNonUniformBitwiseXor %11 %39 Reduce %132
%133 = OpIMul %5 %29 %45
%134 = OpIAdd %5 %133 %78
%135 = OpAccessChain %108 %15 %41 %134
OpStore %135 %130 NonPrivatePointer
%137 = OpIsHelperInvocationEXT %30
%140 = OpSelect %11 %137 %139 %102
%136 = OpGroupNonUniformSMin %11 %39 Reduce %140
%141 = OpIMul %5 %29 %45
%142 = OpIAdd %5 %141 %86
%143 = OpAccessChain %108 %15 %41 %142
OpStore %143 %136 NonPrivatePointer
%145 = OpIsHelperInvocationEXT %30
%148 = OpSelect %11 %145 %147 %102
%144 = OpGroupNonUniformSMax %11 %39 Reduce %148
%149 = OpIMul %5 %29 %45
%150 = OpIAdd %5 %149 %94
%151 = OpAccessChain %108 %15 %41 %150
OpStore %151 %144 NonPrivatePointer
%153 = OpConvertUToF %152 %29
%154 = OpConvertUToF %152 %33
%155 = OpConvertUToF %152 %98
%156 = OpIAdd %5 %29 %39
%157 = OpConvertUToF %152 %156
%159 = OpCompositeInsert %158 %153 %160 0
%161 = OpCompositeInsert %158 %154 %159 1
%162 = OpCompositeInsert %158 %155 %161 2
%163 = OpCompositeInsert %158 %157 %162 3
%165 = OpIsHelperInvocationEXT %30
%168 = OpSelect %158 %165 %167 %163
%164 = OpGroupNonUniformFAdd %158 %39 Reduce %168
%169 = OpIMul %5 %29 %45
%170 = OpBitcast %16 %164
%172 = OpAccessChain %171 %20 %41 %169
OpStore %172 %170 NonPrivatePointer
%174 = OpIsHelperInvocationEXT %30
%177 = OpSelect %158 %174 %176 %163
%173 = OpGroupNonUniformFMul %158 %39 Reduce %177
%178 = OpIMul %5 %29 %45
%179 = OpIAdd %5 %178 %34
%180 = OpBitcast %16 %173
%181 = OpAccessChain %171 %20 %41 %179
OpStore %181 %180 NonPrivatePointer
%183 = OpIsHelperInvocationEXT %30
%186 = OpSelect %158 %183 %185 %163
%182 = OpGroupNonUniformFMin %158 %39 Reduce %186
%187 = OpIMul %5 %29 %45
%188 = OpIAdd %5 %187 %63
%189 = OpBitcast %16 %182
%190 = OpAccessChain %171 %20 %41 %188
OpStore %190 %189 NonPrivatePointer
%192 = OpIsHelperInvocationEXT %30
%195 = OpSelect %158 %192 %194 %163
%191 = OpGroupNonUniformFMax %158 %39 Reduce %195
%196 = OpIMul %5 %29 %45
%197 = OpIAdd %5 %196 %39
%198 = OpBitcast %16 %191
%199 = OpAccessChain %171 %20 %41 %197
OpStore %199 %198 NonPrivatePointer
%201 = OpConvertUToF %200 %29
%202 = OpConvertUToF %200 %33
%203 = OpConvertUToF %200 %98
%204 = OpConvertUToF %200 %156
%206 = OpCompositeInsert %205 %201 %207 0
%208 = OpCompositeInsert %205 %202 %206 1
%209 = OpCompositeInsert %205 %203 %208 2
%210 = OpCompositeInsert %205 %204 %209 3
%212 = OpIsHelperInvocationEXT %30
%215 = OpSelect %205 %212 %214 %210
%211 = OpGroupNonUniformFAdd %205 %39 Reduce %215
%216 = OpIMul %5 %29 %45
%217 = OpBitcast %22 %211
%219 = OpAccessChain %218 %26 %41 %216
OpStore %219 %217 NonPrivatePointer
%221 = OpIsHelperInvocationEXT %30
%224 = OpSelect %205 %221 %223 %210
%220 = OpGroupNonUniformFMul %205 %39 Reduce %224
%225 = OpIMul %5 %29 %45
%226 = OpIAdd %5 %225 %34
%227 = OpBitcast %22 %220
%228 = OpAccessChain %218 %26 %41 %226
OpStore %228 %227 NonPrivatePointer
%230 = OpIsHelperInvocationEXT %30
%233 = OpSelect %205 %230 %232 %210
%229 = OpGroupNonUniformFMin %205 %39 Reduce %233
%234 = OpIMul %5 %29 %45
%235 = OpIAdd %5 %234 %63
%236 = OpBitcast %22 %229
%237 = OpAccessChain %218 %26 %41 %235
OpStore %237 %236 NonPrivatePointer
%239 = OpIsHelperInvocationEXT %30
%242 = OpSelect %205 %239 %241 %210
%238 = OpGroupNonUniformFMax %205 %39 Reduce %242
%243 = OpIMul %5 %29 %45
%244 = OpIAdd %5 %243 %39
%245 = OpBitcast %22 %238
%246 = OpAccessChain %218 %26 %41 %244
OpStore %246 %245 NonPrivatePointer
OpReturn
OpFunctionEnd
#endif
