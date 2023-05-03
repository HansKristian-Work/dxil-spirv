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

layout(set = 0, binding = 0, std430) restrict readonly buffer _14_17
{
    u16vec2 _m0[];
} _17[];

layout(set = 0, binding = 0, std430) buffer _19_22
{
    uint _m0[];
} _22[];

layout(set = 0, binding = 0, std430) buffer _24_27
{
    u16vec2 _m0[];
} _27[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _30_33
{
    u16vec4 _m0[];
} _33[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _36_39
{
    uvec4 _m0[];
} _39[];

layout(set = 0, binding = 0, std430) buffer _41_44
{
    u16vec4 _m0[];
} _44[];

layout(set = 0, binding = 0, std430) buffer _46_49
{
    uvec4 _m0[];
} _49[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) flat in ivec4 UV;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _91 = INDEX + 8u;
    uint _97 = INDEX + 9u;
    f16vec2 _112 = uint16BitsToFloat16(_17[INDEX + 1u]._m0[uint(UV.y)]);
    uint _118 = _22[INDEX + 4u]._m0[uint(UV.z)];
    u16vec2 _122 = _27[INDEX + 5u]._m0[uint(UV.w)];
    f16vec2 _123 = uint16BitsToFloat16(_122);
    f16vec4 _133 = uint16BitsToFloat16(_33[_91]._m0[1u]);
    vec4 _149 = uintBitsToFloat(_39[_91]._m0[1u]);
    u16vec4 _159 = _44[_97]._m0[1u];
    f16vec4 _160 = uint16BitsToFloat16(_159);
    float _169 = (((float(_123.y) + uintBitsToFloat(_10[INDEX]._m0[uint(UV.x)])) + float(_133.x)) + _149.x) + float(_160.x);
    float _170 = ((float(_133.y) + float(_112.x)) + _149.y) + float(_160.y);
    float _171 = (((float(_112.y) + uintBitsToFloat(_118)) + float(_133.z)) + _149.z) + float(_160.z);
    float _172 = ((float(_133.w) + float(_123.x)) + _149.w) + float(_160.w);
    _49[_97]._m0[1u] = uvec4(floatBitsToUint(_169), floatBitsToUint(_170), floatBitsToUint(_171), floatBitsToUint(_172));
    SV_Target.x = _169;
    SV_Target.y = _170;
    SV_Target.z = _171;
    SV_Target.w = _172;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 186
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability StorageBuffer16BitAccess
OpCapability DenormPreserve
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %51 %55 %59
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 16
OpName %3 "main"
OpName %7 "SSBO"
OpName %14 "SSBO"
OpName %19 "SSBO"
OpName %24 "SSBO"
OpName %30 "SSBO"
OpName %36 "SSBO"
OpName %41 "SSBO"
OpName %46 "SSBO"
OpName %51 "INDEX"
OpName %55 "UV"
OpName %59 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %13 ArrayStride 4
OpMemberDecorate %14 0 Offset 0
OpDecorate %14 Block
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %17 NonWritable
OpDecorate %17 Restrict
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 0
OpDecorate %23 ArrayStride 4
OpMemberDecorate %24 0 Offset 0
OpDecorate %24 Block
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 0
OpDecorate %29 ArrayStride 8
OpMemberDecorate %30 0 Offset 0
OpDecorate %30 Block
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 0
OpDecorate %33 NonWritable
OpDecorate %33 Restrict
OpDecorate %35 ArrayStride 16
OpMemberDecorate %36 0 Offset 0
OpDecorate %36 Block
OpDecorate %39 DescriptorSet 0
OpDecorate %39 Binding 0
OpDecorate %39 NonWritable
OpDecorate %39 Restrict
OpDecorate %40 ArrayStride 8
OpMemberDecorate %41 0 Offset 0
OpDecorate %41 Block
OpDecorate %44 DescriptorSet 0
OpDecorate %44 Binding 0
OpDecorate %44 Aliased
OpDecorate %45 ArrayStride 16
OpMemberDecorate %46 0 Offset 0
OpDecorate %46 Block
OpDecorate %49 DescriptorSet 0
OpDecorate %49 Binding 0
OpDecorate %49 Aliased
OpDecorate %51 Flat
OpDecorate %51 Location 0
OpDecorate %55 Flat
OpDecorate %55 Location 1
OpDecorate %59 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeInt 16 0
%12 = OpTypeVector %11 2
%13 = OpTypeRuntimeArray %12
%14 = OpTypeStruct %13
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer StorageBuffer %15
%17 = OpVariable %16 StorageBuffer
%18 = OpTypeRuntimeArray %5
%19 = OpTypeStruct %18
%20 = OpTypeRuntimeArray %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypeRuntimeArray %12
%24 = OpTypeStruct %23
%25 = OpTypeRuntimeArray %24
%26 = OpTypePointer StorageBuffer %25
%27 = OpVariable %26 StorageBuffer
%28 = OpTypeVector %11 4
%29 = OpTypeRuntimeArray %28
%30 = OpTypeStruct %29
%31 = OpTypeRuntimeArray %30
%32 = OpTypePointer StorageBuffer %31
%33 = OpVariable %32 StorageBuffer
%34 = OpTypeVector %5 4
%35 = OpTypeRuntimeArray %34
%36 = OpTypeStruct %35
%37 = OpTypeRuntimeArray %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeRuntimeArray %28
%41 = OpTypeStruct %40
%42 = OpTypeRuntimeArray %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeRuntimeArray %34
%46 = OpTypeStruct %45
%47 = OpTypeRuntimeArray %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypePointer Input %5
%51 = OpVariable %50 Input
%52 = OpTypeInt 32 1
%53 = OpTypeVector %52 4
%54 = OpTypePointer Input %53
%55 = OpVariable %54 Input
%56 = OpTypeFloat 32
%57 = OpTypeVector %56 4
%58 = OpTypePointer Output %57
%59 = OpVariable %58 Output
%60 = OpTypePointer Input %52
%62 = OpConstant %5 0
%66 = OpConstant %5 1
%70 = OpConstant %5 2
%74 = OpConstant %5 3
%78 = OpTypePointer StorageBuffer %7
%81 = OpTypePointer StorageBuffer %14
%84 = OpConstant %5 4
%85 = OpTypePointer StorageBuffer %19
%88 = OpConstant %5 5
%89 = OpTypePointer StorageBuffer %24
%92 = OpConstant %5 8
%93 = OpTypePointer StorageBuffer %30
%95 = OpTypePointer StorageBuffer %36
%98 = OpConstant %5 9
%99 = OpTypePointer StorageBuffer %41
%101 = OpTypePointer StorageBuffer %46
%103 = OpTypePointer StorageBuffer %5
%107 = OpTypePointer StorageBuffer %12
%110 = OpTypeFloat 16
%111 = OpTypeVector %110 2
%129 = OpTypePointer StorageBuffer %28
%132 = OpTypeVector %110 4
%146 = OpTypePointer StorageBuffer %34
%179 = OpTypePointer Output %56
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %184
%184 = OpLabel
%61 = OpAccessChain %60 %55 %62
%63 = OpLoad %52 %61
%64 = OpBitcast %5 %63
%65 = OpAccessChain %60 %55 %66
%67 = OpLoad %52 %65
%68 = OpBitcast %5 %67
%69 = OpAccessChain %60 %55 %70
%71 = OpLoad %52 %69
%72 = OpBitcast %5 %71
%73 = OpAccessChain %60 %55 %74
%75 = OpLoad %52 %73
%76 = OpBitcast %5 %75
%77 = OpLoad %5 %51
%79 = OpAccessChain %78 %10 %77
%80 = OpIAdd %5 %77 %66
%82 = OpAccessChain %81 %17 %80
%83 = OpIAdd %5 %77 %84
%86 = OpAccessChain %85 %22 %83
%87 = OpIAdd %5 %77 %88
%90 = OpAccessChain %89 %27 %87
%91 = OpIAdd %5 %77 %92
%94 = OpAccessChain %93 %33 %91
%96 = OpAccessChain %95 %39 %91
%97 = OpIAdd %5 %77 %98
%100 = OpAccessChain %99 %44 %97
%102 = OpAccessChain %101 %49 %97
%104 = OpAccessChain %103 %79 %62 %64
%105 = OpLoad %5 %104
%106 = OpBitcast %56 %105
%108 = OpAccessChain %107 %82 %62 %68
%109 = OpLoad %12 %108
%112 = OpBitcast %111 %109
%113 = OpCompositeExtract %110 %112 0
%114 = OpCompositeExtract %110 %112 1
%115 = OpFConvert %56 %113
%116 = OpFConvert %56 %114
%117 = OpAccessChain %103 %86 %62 %72
%118 = OpLoad %5 %117
%119 = OpBitcast %56 %118
%120 = OpFAdd %56 %116 %119
%121 = OpAccessChain %107 %90 %62 %76
%122 = OpLoad %12 %121
%123 = OpBitcast %111 %122
%124 = OpCompositeExtract %110 %123 0
%125 = OpCompositeExtract %110 %123 1
%126 = OpFConvert %56 %124
%127 = OpFConvert %56 %125
%128 = OpFAdd %56 %127 %106
%130 = OpAccessChain %129 %94 %62 %66
%131 = OpLoad %28 %130
%133 = OpBitcast %132 %131
%134 = OpCompositeExtract %110 %133 0
%135 = OpCompositeExtract %110 %133 1
%136 = OpCompositeExtract %110 %133 2
%137 = OpCompositeExtract %110 %133 3
%138 = OpFConvert %56 %134
%139 = OpFConvert %56 %135
%140 = OpFConvert %56 %136
%141 = OpFConvert %56 %137
%142 = OpFAdd %56 %128 %138
%143 = OpFAdd %56 %139 %115
%144 = OpFAdd %56 %120 %140
%145 = OpFAdd %56 %141 %126
%147 = OpAccessChain %146 %96 %62 %66
%148 = OpLoad %34 %147
%149 = OpBitcast %57 %148
%150 = OpCompositeExtract %56 %149 0
%151 = OpCompositeExtract %56 %149 1
%152 = OpCompositeExtract %56 %149 2
%153 = OpCompositeExtract %56 %149 3
%154 = OpFAdd %56 %142 %150
%155 = OpFAdd %56 %143 %151
%156 = OpFAdd %56 %144 %152
%157 = OpFAdd %56 %145 %153
%158 = OpAccessChain %129 %100 %62 %66
%159 = OpLoad %28 %158
%160 = OpBitcast %132 %159
%161 = OpCompositeExtract %110 %160 0
%162 = OpCompositeExtract %110 %160 1
%163 = OpCompositeExtract %110 %160 2
%164 = OpCompositeExtract %110 %160 3
%165 = OpFConvert %56 %161
%166 = OpFConvert %56 %162
%167 = OpFConvert %56 %163
%168 = OpFConvert %56 %164
%169 = OpFAdd %56 %154 %165
%170 = OpFAdd %56 %155 %166
%171 = OpFAdd %56 %156 %167
%172 = OpFAdd %56 %157 %168
%173 = OpBitcast %5 %169
%174 = OpBitcast %5 %170
%175 = OpBitcast %5 %171
%176 = OpBitcast %5 %172
%177 = OpCompositeConstruct %34 %173 %174 %175 %176
%178 = OpAccessChain %146 %102 %62 %66
OpStore %178 %177
%180 = OpAccessChain %179 %59 %62
OpStore %180 %169
%181 = OpAccessChain %179 %59 %66
OpStore %181 %170
%182 = OpAccessChain %179 %59 %70
OpStore %182 %171
%183 = OpAccessChain %179 %59 %74
OpStore %183 %172
OpReturn
OpFunctionEnd
#endif
