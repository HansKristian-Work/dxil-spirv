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
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _13_16
{
    uint16_t _m0[];
} _16[];

layout(set = 0, binding = 0, std430) readonly buffer _18_21
{
    uint _m0[];
} _21[];

layout(set = 0, binding = 0, std430) readonly buffer _23_26
{
    uint16_t _m0[];
} _26[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _29_32
{
    u16vec4 _m0[];
} _32[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _35_38
{
    uvec4 _m0[];
} _38[];

layout(set = 0, binding = 0, std430) buffer _40_43
{
    u16vec4 _m0[];
} _43[];

layout(set = 0, binding = 0, std430) buffer _45_48
{
    uvec4 _m0[];
} _48[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _79 = INDEX + 1u;
    uint _86 = INDEX + 5u;
    uint _90 = INDEX + 8u;
    uint _96 = INDEX + 9u;
    uint _106 = uint(UV.y) * 2u;
    f16vec2 _117 = uint16BitsToFloat16(u16vec2(_16[_79]._m0[_106], _16[_79]._m0[_106 + 1u]));
    uint _123 = _21[INDEX + 4u]._m0[uint(UV.z)];
    uint _126 = uint(UV.w) * 2u;
    uint16_t _128 = _26[_86]._m0[_126];
    uint16_t _131 = _26[_86]._m0[_126 + 1u];
    f16vec2 _133 = uint16BitsToFloat16(u16vec2(_128, _131));
    f16vec4 _143 = uint16BitsToFloat16(_32[_90]._m0[1u]);
    vec4 _159 = uintBitsToFloat(_38[_90]._m0[1u]);
    u16vec4 _169 = _43[_96]._m0[1u];
    f16vec4 _170 = uint16BitsToFloat16(_169);
    float _179 = (((float(_133.y) + uintBitsToFloat(_10[INDEX]._m0[uint(UV.x)])) + float(_143.x)) + _159.x) + float(_170.x);
    float _180 = ((float(_143.y) + float(_117.x)) + _159.y) + float(_170.y);
    float _181 = (((float(_117.y) + uintBitsToFloat(_123)) + float(_143.z)) + _159.z) + float(_170.z);
    float _182 = ((float(_143.w) + float(_133.x)) + _159.w) + float(_170.w);
    _48[_96]._m0[1u] = uvec4(floatBitsToUint(_179), floatBitsToUint(_180), floatBitsToUint(_181), floatBitsToUint(_182));
    SV_Target.x = _179;
    SV_Target.y = _180;
    SV_Target.z = _181;
    SV_Target.w = _182;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 196
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %50 %54 %58
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %13 "SSBO"
OpName %18 "SSBO"
OpName %23 "SSBO"
OpName %29 "SSBO"
OpName %35 "SSBO"
OpName %40 "SSBO"
OpName %45 "SSBO"
OpName %50 "INDEX"
OpName %54 "UV"
OpName %58 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %12 ArrayStride 2
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %16 NonWritable
OpDecorate %16 Restrict
OpDecorate %17 ArrayStride 4
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %21 NonWritable
OpDecorate %22 ArrayStride 2
OpMemberDecorate %23 0 Offset 0
OpDecorate %23 Block
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %28 ArrayStride 8
OpMemberDecorate %29 0 Offset 0
OpDecorate %29 Block
OpDecorate %32 DescriptorSet 0
OpDecorate %32 Binding 0
OpDecorate %32 NonWritable
OpDecorate %32 Restrict
OpDecorate %34 ArrayStride 16
OpMemberDecorate %35 0 Offset 0
OpDecorate %35 Block
OpDecorate %38 DescriptorSet 0
OpDecorate %38 Binding 0
OpDecorate %38 NonWritable
OpDecorate %38 Restrict
OpDecorate %39 ArrayStride 8
OpMemberDecorate %40 0 Offset 0
OpDecorate %40 Block
OpDecorate %43 DescriptorSet 0
OpDecorate %43 Binding 0
OpDecorate %43 Aliased
OpDecorate %44 ArrayStride 16
OpMemberDecorate %45 0 Offset 0
OpDecorate %45 Block
OpDecorate %48 DescriptorSet 0
OpDecorate %48 Binding 0
OpDecorate %48 Aliased
OpDecorate %50 Flat
OpDecorate %50 Location 0
OpDecorate %54 Flat
OpDecorate %54 Location 1
OpDecorate %58 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeInt 16 0
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypeRuntimeArray %5
%18 = OpTypeStruct %17
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypeRuntimeArray %11
%23 = OpTypeStruct %22
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeVector %11 4
%28 = OpTypeRuntimeArray %27
%29 = OpTypeStruct %28
%30 = OpTypeRuntimeArray %29
%31 = OpTypePointer StorageBuffer %30
%32 = OpVariable %31 StorageBuffer
%33 = OpTypeVector %5 4
%34 = OpTypeRuntimeArray %33
%35 = OpTypeStruct %34
%36 = OpTypeRuntimeArray %35
%37 = OpTypePointer StorageBuffer %36
%38 = OpVariable %37 StorageBuffer
%39 = OpTypeRuntimeArray %27
%40 = OpTypeStruct %39
%41 = OpTypeRuntimeArray %40
%42 = OpTypePointer StorageBuffer %41
%43 = OpVariable %42 StorageBuffer
%44 = OpTypeRuntimeArray %33
%45 = OpTypeStruct %44
%46 = OpTypeRuntimeArray %45
%47 = OpTypePointer StorageBuffer %46
%48 = OpVariable %47 StorageBuffer
%49 = OpTypePointer Input %5
%50 = OpVariable %49 Input
%51 = OpTypeInt 32 1
%52 = OpTypeVector %51 4
%53 = OpTypePointer Input %52
%54 = OpVariable %53 Input
%55 = OpTypeFloat 32
%56 = OpTypeVector %55 4
%57 = OpTypePointer Output %56
%58 = OpVariable %57 Output
%59 = OpTypePointer Input %51
%61 = OpConstant %5 0
%65 = OpConstant %5 1
%69 = OpConstant %5 2
%73 = OpConstant %5 3
%77 = OpTypePointer StorageBuffer %7
%80 = OpTypePointer StorageBuffer %13
%83 = OpConstant %5 4
%84 = OpTypePointer StorageBuffer %18
%87 = OpConstant %5 5
%88 = OpTypePointer StorageBuffer %23
%91 = OpConstant %5 8
%92 = OpTypePointer StorageBuffer %29
%94 = OpTypePointer StorageBuffer %35
%97 = OpConstant %5 9
%98 = OpTypePointer StorageBuffer %40
%100 = OpTypePointer StorageBuffer %45
%102 = OpTypePointer StorageBuffer %5
%107 = OpTypePointer StorageBuffer %11
%113 = OpTypeVector %11 2
%115 = OpTypeFloat 16
%116 = OpTypeVector %115 2
%139 = OpTypePointer StorageBuffer %27
%142 = OpTypeVector %115 4
%156 = OpTypePointer StorageBuffer %33
%189 = OpTypePointer Output %55
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %194
%194 = OpLabel
%60 = OpAccessChain %59 %54 %61
%62 = OpLoad %51 %60
%63 = OpBitcast %5 %62
%64 = OpAccessChain %59 %54 %65
%66 = OpLoad %51 %64
%67 = OpBitcast %5 %66
%68 = OpAccessChain %59 %54 %69
%70 = OpLoad %51 %68
%71 = OpBitcast %5 %70
%72 = OpAccessChain %59 %54 %73
%74 = OpLoad %51 %72
%75 = OpBitcast %5 %74
%76 = OpLoad %5 %50
%78 = OpAccessChain %77 %10 %76
%79 = OpIAdd %5 %76 %65
%81 = OpAccessChain %80 %16 %79
%82 = OpIAdd %5 %76 %83
%85 = OpAccessChain %84 %21 %82
%86 = OpIAdd %5 %76 %87
%89 = OpAccessChain %88 %26 %86
%90 = OpIAdd %5 %76 %91
%93 = OpAccessChain %92 %32 %90
%95 = OpAccessChain %94 %38 %90
%96 = OpIAdd %5 %76 %97
%99 = OpAccessChain %98 %43 %96
%101 = OpAccessChain %100 %48 %96
%103 = OpAccessChain %102 %78 %61 %63
%104 = OpLoad %5 %103
%105 = OpBitcast %55 %104
%106 = OpIMul %5 %67 %69
%108 = OpAccessChain %107 %81 %61 %106
%109 = OpLoad %11 %108
%111 = OpIAdd %5 %106 %65
%110 = OpAccessChain %107 %81 %61 %111
%112 = OpLoad %11 %110
%114 = OpCompositeConstruct %113 %109 %112
%117 = OpBitcast %116 %114
%118 = OpCompositeExtract %115 %117 0
%119 = OpCompositeExtract %115 %117 1
%120 = OpFConvert %55 %118
%121 = OpFConvert %55 %119
%122 = OpAccessChain %102 %85 %61 %71
%123 = OpLoad %5 %122
%124 = OpBitcast %55 %123
%125 = OpFAdd %55 %121 %124
%126 = OpIMul %5 %75 %69
%127 = OpAccessChain %107 %89 %61 %126
%128 = OpLoad %11 %127
%130 = OpIAdd %5 %126 %65
%129 = OpAccessChain %107 %89 %61 %130
%131 = OpLoad %11 %129
%132 = OpCompositeConstruct %113 %128 %131
%133 = OpBitcast %116 %132
%134 = OpCompositeExtract %115 %133 0
%135 = OpCompositeExtract %115 %133 1
%136 = OpFConvert %55 %134
%137 = OpFConvert %55 %135
%138 = OpFAdd %55 %137 %105
%140 = OpAccessChain %139 %93 %61 %65
%141 = OpLoad %27 %140
%143 = OpBitcast %142 %141
%144 = OpCompositeExtract %115 %143 0
%145 = OpCompositeExtract %115 %143 1
%146 = OpCompositeExtract %115 %143 2
%147 = OpCompositeExtract %115 %143 3
%148 = OpFConvert %55 %144
%149 = OpFConvert %55 %145
%150 = OpFConvert %55 %146
%151 = OpFConvert %55 %147
%152 = OpFAdd %55 %138 %148
%153 = OpFAdd %55 %149 %120
%154 = OpFAdd %55 %125 %150
%155 = OpFAdd %55 %151 %136
%157 = OpAccessChain %156 %95 %61 %65
%158 = OpLoad %33 %157
%159 = OpBitcast %56 %158
%160 = OpCompositeExtract %55 %159 0
%161 = OpCompositeExtract %55 %159 1
%162 = OpCompositeExtract %55 %159 2
%163 = OpCompositeExtract %55 %159 3
%164 = OpFAdd %55 %152 %160
%165 = OpFAdd %55 %153 %161
%166 = OpFAdd %55 %154 %162
%167 = OpFAdd %55 %155 %163
%168 = OpAccessChain %139 %99 %61 %65
%169 = OpLoad %27 %168
%170 = OpBitcast %142 %169
%171 = OpCompositeExtract %115 %170 0
%172 = OpCompositeExtract %115 %170 1
%173 = OpCompositeExtract %115 %170 2
%174 = OpCompositeExtract %115 %170 3
%175 = OpFConvert %55 %171
%176 = OpFConvert %55 %172
%177 = OpFConvert %55 %173
%178 = OpFConvert %55 %174
%179 = OpFAdd %55 %164 %175
%180 = OpFAdd %55 %165 %176
%181 = OpFAdd %55 %166 %177
%182 = OpFAdd %55 %167 %178
%183 = OpBitcast %5 %179
%184 = OpBitcast %5 %180
%185 = OpBitcast %5 %181
%186 = OpBitcast %5 %182
%187 = OpCompositeConstruct %33 %183 %184 %185 %186
%188 = OpAccessChain %156 %101 %61 %65
OpStore %188 %187
%190 = OpAccessChain %189 %58 %61
OpStore %190 %179
%191 = OpAccessChain %189 %58 %65
OpStore %191 %180
%192 = OpAccessChain %189 %58 %69
OpStore %192 %181
%193 = OpAccessChain %189 %58 %73
OpStore %193 %182
OpReturn
OpFunctionEnd
#endif
