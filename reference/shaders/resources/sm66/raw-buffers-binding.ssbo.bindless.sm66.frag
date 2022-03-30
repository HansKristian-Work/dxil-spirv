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

layout(set = 1, binding = 0, std430) restrict readonly buffer _17_20
{
    u16vec2 _m0[];
} _20[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _23_26
{
    u16vec4 _m0[];
} _26[];

layout(set = 1, binding = 0, std430) restrict readonly buffer _29_32
{
    uvec4 _m0[];
} _32[];

layout(set = 4, binding = 0, std430) readonly buffer _34_37
{
    uint _m0[];
} _37[];

layout(set = 4, binding = 0, std430) readonly buffer _39_42
{
    u16vec2 _m0[];
} _42[];

layout(set = 4, binding = 0, std430) buffer _44_47
{
    u16vec4 _m0[];
} _47[];

layout(set = 4, binding = 0, std430) buffer _49_52
{
    uvec4 _m0[];
} _52[];

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
    f16vec2 _99 = uint16BitsToFloat16(_20[registers._m1 + 1u]._m0[uint(UV.y)]);
    uint _111 = _37[registers._m4 + 2u]._m0[uint(UV.z)];
    u16vec2 _120 = _42[registers._m4 + 3u]._m0[uint(UV.w)];
    f16vec2 _121 = uint16BitsToFloat16(_120);
    f16vec4 _141 = uint16BitsToFloat16(_26[registers._m1 + 4u]._m0[1u]);
    vec4 _157 = uintBitsToFloat(_32[registers._m1 + 4u]._m0[1u]);
    u16vec4 _178 = _47[registers._m4 + 5u]._m0[1u];
    f16vec4 _179 = uint16BitsToFloat16(_178);
    float _188 = (((float(_121.y) + uintBitsToFloat(_13[registers._m1]._m0[uint(UV.x)])) + float(_141.x)) + _157.x) + float(_179.x);
    float _189 = ((float(_141.y) + float(_99.x)) + _157.y) + float(_179.y);
    float _190 = (((uintBitsToFloat(_111) + float(_99.y)) + float(_141.z)) + _157.z) + float(_179.z);
    float _191 = ((float(_141.w) + float(_121.x)) + _157.w) + float(_179.w);
    _52[registers._m4 + 5u]._m0[1u] = uvec4(floatBitsToUint(_188), floatBitsToUint(_189), floatBitsToUint(_190), floatBitsToUint(_191));
    SV_Target.x = _188;
    SV_Target.y = _189;
    SV_Target.z = _190;
    SV_Target.w = _191;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 205
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Int16
OpCapability StorageBuffer16BitAccess
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %54 %58 %62
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %10 "SSBO"
OpName %17 "SSBO"
OpName %23 "SSBO"
OpName %29 "SSBO"
OpName %34 "SSBO"
OpName %39 "SSBO"
OpName %44 "SSBO"
OpName %49 "SSBO"
OpName %54 "INDEX"
OpName %58 "UV"
OpName %62 "SV_Target"
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
OpDecorate %16 ArrayStride 4
OpMemberDecorate %17 0 Offset 0
OpDecorate %17 Block
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 0
OpDecorate %20 NonWritable
OpDecorate %20 Restrict
OpDecorate %22 ArrayStride 8
OpMemberDecorate %23 0 Offset 0
OpDecorate %23 Block
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 0
OpDecorate %26 NonWritable
OpDecorate %26 Restrict
OpDecorate %28 ArrayStride 16
OpMemberDecorate %29 0 Offset 0
OpDecorate %29 Block
OpDecorate %32 DescriptorSet 1
OpDecorate %32 Binding 0
OpDecorate %32 NonWritable
OpDecorate %32 Restrict
OpDecorate %33 ArrayStride 4
OpMemberDecorate %34 0 Offset 0
OpDecorate %34 Block
OpDecorate %37 DescriptorSet 4
OpDecorate %37 Binding 0
OpDecorate %37 NonWritable
OpDecorate %38 ArrayStride 4
OpMemberDecorate %39 0 Offset 0
OpDecorate %39 Block
OpDecorate %42 DescriptorSet 4
OpDecorate %42 Binding 0
OpDecorate %42 NonWritable
OpDecorate %43 ArrayStride 8
OpMemberDecorate %44 0 Offset 0
OpDecorate %44 Block
OpDecorate %47 DescriptorSet 4
OpDecorate %47 Binding 0
OpDecorate %47 Aliased
OpDecorate %48 ArrayStride 16
OpMemberDecorate %49 0 Offset 0
OpDecorate %49 Block
OpDecorate %52 DescriptorSet 4
OpDecorate %52 Binding 0
OpDecorate %52 Aliased
OpDecorate %54 Flat
OpDecorate %54 Location 0
OpDecorate %58 Flat
OpDecorate %58 Location 1
OpDecorate %62 Location 0
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
%15 = OpTypeVector %14 2
%16 = OpTypeRuntimeArray %15
%17 = OpTypeStruct %16
%18 = OpTypeRuntimeArray %17
%19 = OpTypePointer StorageBuffer %18
%20 = OpVariable %19 StorageBuffer
%21 = OpTypeVector %14 4
%22 = OpTypeRuntimeArray %21
%23 = OpTypeStruct %22
%24 = OpTypeRuntimeArray %23
%25 = OpTypePointer StorageBuffer %24
%26 = OpVariable %25 StorageBuffer
%27 = OpTypeVector %5 4
%28 = OpTypeRuntimeArray %27
%29 = OpTypeStruct %28
%30 = OpTypeRuntimeArray %29
%31 = OpTypePointer StorageBuffer %30
%32 = OpVariable %31 StorageBuffer
%33 = OpTypeRuntimeArray %5
%34 = OpTypeStruct %33
%35 = OpTypeRuntimeArray %34
%36 = OpTypePointer StorageBuffer %35
%37 = OpVariable %36 StorageBuffer
%38 = OpTypeRuntimeArray %15
%39 = OpTypeStruct %38
%40 = OpTypeRuntimeArray %39
%41 = OpTypePointer StorageBuffer %40
%42 = OpVariable %41 StorageBuffer
%43 = OpTypeRuntimeArray %21
%44 = OpTypeStruct %43
%45 = OpTypeRuntimeArray %44
%46 = OpTypePointer StorageBuffer %45
%47 = OpVariable %46 StorageBuffer
%48 = OpTypeRuntimeArray %27
%49 = OpTypeStruct %48
%50 = OpTypeRuntimeArray %49
%51 = OpTypePointer StorageBuffer %50
%52 = OpVariable %51 StorageBuffer
%53 = OpTypePointer Input %5
%54 = OpVariable %53 Input
%55 = OpTypeInt 32 1
%56 = OpTypeVector %55 4
%57 = OpTypePointer Input %56
%58 = OpVariable %57 Input
%59 = OpTypeFloat 32
%60 = OpTypeVector %59 4
%61 = OpTypePointer Output %60
%62 = OpVariable %61 Output
%63 = OpTypePointer Input %55
%65 = OpConstant %5 0
%69 = OpConstant %5 1
%73 = OpConstant %5 2
%77 = OpConstant %5 3
%80 = OpTypePointer StorageBuffer %10
%82 = OpTypePointer PushConstant %5
%85 = OpTypePointer StorageBuffer %5
%89 = OpTypePointer StorageBuffer %17
%94 = OpTypePointer StorageBuffer %15
%97 = OpTypeFloat 16
%98 = OpTypeVector %97 2
%104 = OpTypePointer StorageBuffer %34
%107 = OpConstant %5 4
%114 = OpTypePointer StorageBuffer %39
%127 = OpTypePointer StorageBuffer %23
%132 = OpTypePointer StorageBuffer %29
%137 = OpTypePointer StorageBuffer %21
%140 = OpTypeVector %97 4
%154 = OpTypePointer StorageBuffer %27
%166 = OpTypePointer StorageBuffer %44
%171 = OpConstant %5 5
%172 = OpTypePointer StorageBuffer %49
%198 = OpTypePointer Output %59
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %203
%203 = OpLabel
%64 = OpAccessChain %63 %58 %65
%66 = OpLoad %55 %64
%67 = OpBitcast %5 %66
%68 = OpAccessChain %63 %58 %69
%70 = OpLoad %55 %68
%71 = OpBitcast %5 %70
%72 = OpAccessChain %63 %58 %73
%74 = OpLoad %55 %72
%75 = OpBitcast %5 %74
%76 = OpAccessChain %63 %58 %77
%78 = OpLoad %55 %76
%79 = OpBitcast %5 %78
%83 = OpAccessChain %82 %8 %69
%84 = OpLoad %5 %83
%81 = OpAccessChain %80 %13 %84
%86 = OpAccessChain %85 %81 %65 %67
%87 = OpLoad %5 %86
%88 = OpBitcast %59 %87
%91 = OpAccessChain %82 %8 %69
%92 = OpLoad %5 %91
%93 = OpIAdd %5 %92 %69
%90 = OpAccessChain %89 %20 %93
%95 = OpAccessChain %94 %90 %65 %71
%96 = OpLoad %15 %95
%99 = OpBitcast %98 %96
%100 = OpCompositeExtract %97 %99 0
%101 = OpCompositeExtract %97 %99 1
%102 = OpFConvert %59 %100
%103 = OpFConvert %59 %101
%106 = OpAccessChain %82 %8 %107
%108 = OpLoad %5 %106
%109 = OpIAdd %5 %108 %73
%105 = OpAccessChain %104 %37 %109
%110 = OpAccessChain %85 %105 %65 %75
%111 = OpLoad %5 %110
%112 = OpBitcast %59 %111
%113 = OpFAdd %59 %112 %103
%116 = OpAccessChain %82 %8 %107
%117 = OpLoad %5 %116
%118 = OpIAdd %5 %117 %77
%115 = OpAccessChain %114 %42 %118
%119 = OpAccessChain %94 %115 %65 %79
%120 = OpLoad %15 %119
%121 = OpBitcast %98 %120
%122 = OpCompositeExtract %97 %121 0
%123 = OpCompositeExtract %97 %121 1
%124 = OpFConvert %59 %122
%125 = OpFConvert %59 %123
%126 = OpFAdd %59 %125 %88
%129 = OpAccessChain %82 %8 %69
%130 = OpLoad %5 %129
%131 = OpIAdd %5 %130 %107
%128 = OpAccessChain %127 %26 %131
%134 = OpAccessChain %82 %8 %69
%135 = OpLoad %5 %134
%136 = OpIAdd %5 %135 %107
%133 = OpAccessChain %132 %32 %136
%138 = OpAccessChain %137 %128 %65 %69
%139 = OpLoad %21 %138
%141 = OpBitcast %140 %139
%142 = OpCompositeExtract %97 %141 0
%143 = OpCompositeExtract %97 %141 1
%144 = OpCompositeExtract %97 %141 2
%145 = OpCompositeExtract %97 %141 3
%146 = OpFConvert %59 %142
%147 = OpFConvert %59 %143
%148 = OpFConvert %59 %144
%149 = OpFConvert %59 %145
%150 = OpFAdd %59 %126 %146
%151 = OpFAdd %59 %147 %102
%152 = OpFAdd %59 %113 %148
%153 = OpFAdd %59 %149 %124
%155 = OpAccessChain %154 %133 %65 %69
%156 = OpLoad %27 %155
%157 = OpBitcast %60 %156
%158 = OpCompositeExtract %59 %157 0
%159 = OpCompositeExtract %59 %157 1
%160 = OpCompositeExtract %59 %157 2
%161 = OpCompositeExtract %59 %157 3
%162 = OpFAdd %59 %150 %158
%163 = OpFAdd %59 %151 %159
%164 = OpFAdd %59 %152 %160
%165 = OpFAdd %59 %153 %161
%168 = OpAccessChain %82 %8 %107
%169 = OpLoad %5 %168
%170 = OpIAdd %5 %169 %171
%167 = OpAccessChain %166 %47 %170
%174 = OpAccessChain %82 %8 %107
%175 = OpLoad %5 %174
%176 = OpIAdd %5 %175 %171
%173 = OpAccessChain %172 %52 %176
%177 = OpAccessChain %137 %167 %65 %69
%178 = OpLoad %21 %177
%179 = OpBitcast %140 %178
%180 = OpCompositeExtract %97 %179 0
%181 = OpCompositeExtract %97 %179 1
%182 = OpCompositeExtract %97 %179 2
%183 = OpCompositeExtract %97 %179 3
%184 = OpFConvert %59 %180
%185 = OpFConvert %59 %181
%186 = OpFConvert %59 %182
%187 = OpFConvert %59 %183
%188 = OpFAdd %59 %162 %184
%189 = OpFAdd %59 %163 %185
%190 = OpFAdd %59 %164 %186
%191 = OpFAdd %59 %165 %187
%192 = OpBitcast %5 %188
%193 = OpBitcast %5 %189
%194 = OpBitcast %5 %190
%195 = OpBitcast %5 %191
%196 = OpCompositeConstruct %27 %192 %193 %194 %195
%197 = OpAccessChain %154 %173 %65 %69
OpStore %197 %196
%199 = OpAccessChain %198 %62 %65
OpStore %199 %188
%200 = OpAccessChain %198 %62 %69
OpStore %200 %189
%201 = OpAccessChain %198 %62 %73
OpStore %201 %190
%202 = OpAccessChain %198 %62 %77
OpStore %202 %191
OpReturn
OpFunctionEnd
#endif
