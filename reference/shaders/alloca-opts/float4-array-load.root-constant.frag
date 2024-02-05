#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 3, scalar) uniform _12_14
{
    float _m0[12];
} _14;

layout(set = 0, binding = 3, std140) uniform _18_20
{
    vec4 _m0[3];
} _20;

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

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _61 = uintBitsToFloat(uvec4(registers._m4, registers._m5, registers._m6, registers._m7));
    float _42[3];
    float _43[3];
    float _44[3];
    float _45[3];
    _42[0u] = _61.x;
    _43[0u] = _61.y;
    _44[0u] = _61.z;
    _45[0u] = _61.w;
    vec4 _84 = uintBitsToFloat(uvec4(registers._m8, registers._m9, registers._m10, registers._m11));
    _42[1u] = _84.x;
    _43[1u] = _84.y;
    _44[1u] = _84.z;
    _45[1u] = _84.w;
    vec4 _105 = uintBitsToFloat(uvec4(registers._m12, registers._m13, registers._m14, registers._m15));
    _42[2u] = _105.x;
    _43[2u] = _105.y;
    _44[2u] = _105.z;
    _45[2u] = _105.w;
    uint _133 = A % 3u;
    SV_Target.x = _14._m0[_133 * 4u] + (_42[_133] * P.x);
    SV_Target.y = _14._m0[(_133 * 4u) + 1u] + (_43[_133] * P.y);
    SV_Target.z = _14._m0[(_133 * 4u) + 2u] + (_44[_133] * P.z);
    SV_Target.w = _14._m0[(_133 * 4u) + 3u] + (_45[_133] * P.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 173
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %22 %24 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %12 ""
OpName %18 ""
OpName %22 "A"
OpName %24 "P"
OpName %26 "SV_Target"
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
OpDecorate %11 ArrayStride 4
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %17 ArrayStride 16
OpMemberDecorate %18 0 Offset 0
OpDecorate %18 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 3
OpDecorate %22 Flat
OpDecorate %22 Location 0
OpDecorate %24 Location 1
OpDecorate %26 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpConstant %5 12
%10 = OpTypeFloat 32
%11 = OpTypeArray %10 %9
%12 = OpTypeStruct %11
%13 = OpTypePointer Uniform %12
%14 = OpVariable %13 Uniform
%15 = OpConstant %5 3
%16 = OpTypeVector %10 4
%17 = OpTypeArray %16 %15
%18 = OpTypeStruct %17
%19 = OpTypePointer Uniform %18
%20 = OpVariable %19 Uniform
%21 = OpTypePointer Input %5
%22 = OpVariable %21 Input
%23 = OpTypePointer Input %16
%24 = OpVariable %23 Input
%25 = OpTypePointer Output %16
%26 = OpVariable %25 Output
%27 = OpTypePointer Input %10
%29 = OpConstant %5 0
%32 = OpConstant %5 1
%35 = OpConstant %5 2
%40 = OpTypeArray %10 %15
%41 = OpTypePointer Function %40
%46 = OpTypePointer PushConstant %5
%48 = OpConstant %5 4
%51 = OpConstant %5 5
%54 = OpConstant %5 6
%57 = OpConstant %5 7
%59 = OpTypeVector %5 4
%66 = OpTypePointer Function %10
%72 = OpConstant %5 8
%75 = OpConstant %5 9
%78 = OpConstant %5 10
%81 = OpConstant %5 11
%96 = OpConstant %5 13
%99 = OpConstant %5 14
%102 = OpConstant %5 15
%114 = OpTypePointer Uniform %16
%147 = OpTypePointer Uniform %10
%166 = OpTypePointer Output %10
%3 = OpFunction %1 None %2
%4 = OpLabel
%42 = OpVariable %41 Function
%43 = OpVariable %41 Function
%44 = OpVariable %41 Function
%45 = OpVariable %41 Function
OpBranch %171
%171 = OpLabel
%28 = OpAccessChain %27 %24 %29
%30 = OpLoad %10 %28
%31 = OpAccessChain %27 %24 %32
%33 = OpLoad %10 %31
%34 = OpAccessChain %27 %24 %35
%36 = OpLoad %10 %34
%37 = OpAccessChain %27 %24 %15
%38 = OpLoad %10 %37
%39 = OpLoad %5 %22
%47 = OpAccessChain %46 %8 %48
%49 = OpLoad %5 %47
%50 = OpAccessChain %46 %8 %51
%52 = OpLoad %5 %50
%53 = OpAccessChain %46 %8 %54
%55 = OpLoad %5 %53
%56 = OpAccessChain %46 %8 %57
%58 = OpLoad %5 %56
%60 = OpCompositeConstruct %59 %49 %52 %55 %58
%61 = OpBitcast %16 %60
%62 = OpCompositeExtract %10 %61 0
%63 = OpCompositeExtract %10 %61 1
%64 = OpCompositeExtract %10 %61 2
%65 = OpCompositeExtract %10 %61 3
%67 = OpAccessChain %66 %42 %29
%68 = OpAccessChain %66 %43 %29
%69 = OpAccessChain %66 %44 %29
%70 = OpAccessChain %66 %45 %29
OpStore %67 %62
OpStore %68 %63
OpStore %69 %64
OpStore %70 %65
%71 = OpAccessChain %46 %8 %72
%73 = OpLoad %5 %71
%74 = OpAccessChain %46 %8 %75
%76 = OpLoad %5 %74
%77 = OpAccessChain %46 %8 %78
%79 = OpLoad %5 %77
%80 = OpAccessChain %46 %8 %81
%82 = OpLoad %5 %80
%83 = OpCompositeConstruct %59 %73 %76 %79 %82
%84 = OpBitcast %16 %83
%85 = OpCompositeExtract %10 %84 0
%86 = OpCompositeExtract %10 %84 1
%87 = OpCompositeExtract %10 %84 2
%88 = OpCompositeExtract %10 %84 3
%89 = OpAccessChain %66 %42 %32
%90 = OpAccessChain %66 %43 %32
%91 = OpAccessChain %66 %44 %32
%92 = OpAccessChain %66 %45 %32
OpStore %89 %85
OpStore %90 %86
OpStore %91 %87
OpStore %92 %88
%93 = OpAccessChain %46 %8 %9
%94 = OpLoad %5 %93
%95 = OpAccessChain %46 %8 %96
%97 = OpLoad %5 %95
%98 = OpAccessChain %46 %8 %99
%100 = OpLoad %5 %98
%101 = OpAccessChain %46 %8 %102
%103 = OpLoad %5 %101
%104 = OpCompositeConstruct %59 %94 %97 %100 %103
%105 = OpBitcast %16 %104
%106 = OpCompositeExtract %10 %105 0
%107 = OpCompositeExtract %10 %105 1
%108 = OpCompositeExtract %10 %105 2
%109 = OpCompositeExtract %10 %105 3
%110 = OpAccessChain %66 %42 %35
%111 = OpAccessChain %66 %43 %35
%112 = OpAccessChain %66 %44 %35
%113 = OpAccessChain %66 %45 %35
OpStore %110 %106
OpStore %111 %107
OpStore %112 %108
OpStore %113 %109
%115 = OpAccessChain %114 %20 %29 %29
%116 = OpLoad %16 %115
%117 = OpCompositeExtract %10 %116 0
%118 = OpCompositeExtract %10 %116 1
%119 = OpCompositeExtract %10 %116 2
%120 = OpCompositeExtract %10 %116 3
%121 = OpAccessChain %114 %20 %29 %32
%122 = OpLoad %16 %121
%123 = OpCompositeExtract %10 %122 0
%124 = OpCompositeExtract %10 %122 1
%125 = OpCompositeExtract %10 %122 2
%126 = OpCompositeExtract %10 %122 3
%127 = OpAccessChain %114 %20 %29 %35
%128 = OpLoad %16 %127
%129 = OpCompositeExtract %10 %128 0
%130 = OpCompositeExtract %10 %128 1
%131 = OpCompositeExtract %10 %128 2
%132 = OpCompositeExtract %10 %128 3
%133 = OpUMod %5 %39 %15
%134 = OpAccessChain %66 %42 %133
%135 = OpAccessChain %66 %43 %133
%136 = OpAccessChain %66 %44 %133
%137 = OpAccessChain %66 %45 %133
%138 = OpLoad %10 %134
%139 = OpLoad %10 %135
%140 = OpLoad %10 %136
%141 = OpLoad %10 %137
%142 = OpFMul %10 %138 %30
%143 = OpFMul %10 %139 %33
%144 = OpFMul %10 %140 %36
%145 = OpFMul %10 %141 %38
%146 = OpIMul %5 %133 %48
%148 = OpAccessChain %147 %14 %29 %146
%149 = OpIMul %5 %133 %48
%150 = OpIAdd %5 %149 %32
%151 = OpAccessChain %147 %14 %29 %150
%152 = OpIMul %5 %133 %48
%153 = OpIAdd %5 %152 %35
%154 = OpAccessChain %147 %14 %29 %153
%155 = OpIMul %5 %133 %48
%156 = OpIAdd %5 %155 %15
%157 = OpAccessChain %147 %14 %29 %156
%158 = OpLoad %10 %148
%159 = OpLoad %10 %151
%160 = OpLoad %10 %154
%161 = OpLoad %10 %157
%162 = OpFAdd %10 %158 %142
%163 = OpFAdd %10 %159 %143
%164 = OpFAdd %10 %160 %144
%165 = OpFAdd %10 %161 %145
%167 = OpAccessChain %166 %26 %29
OpStore %167 %162
%168 = OpAccessChain %166 %26 %32
OpStore %168 %163
%169 = OpAccessChain %166 %26 %35
OpStore %169 %164
%170 = OpAccessChain %166 %26 %15
OpStore %170 %165
OpReturn
OpFunctionEnd
#endif
