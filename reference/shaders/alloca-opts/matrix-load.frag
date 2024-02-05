#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _9_11
{
    float _m0[104];
} _11;

layout(set = 0, binding = 0, std140) uniform _15_17
{
    vec4 _m0[26];
} _17;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _121 = A % 3u;
    SV_Target.x = _11._m0[(2u + (_121 * 16u)) + 8u] * P.x;
    SV_Target.y = _11._m0[(6u + (_121 * 16u)) + 8u] * P.y;
    SV_Target.z = _11._m0[(10u + (_121 * 16u)) + 8u] * P.z;
    SV_Target.w = _11._m0[(14u + (_121 * 16u)) + 8u] * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 156
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %19 "A"
OpName %21 "P"
OpName %23 "SV_Target"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %21 Location 1
OpDecorate %23 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 104
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 26
%13 = OpTypeVector %7 4
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%20 = OpTypePointer Input %13
%21 = OpVariable %20 Input
%22 = OpTypePointer Output %13
%23 = OpVariable %22 Output
%24 = OpTypePointer Input %7
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%32 = OpConstant %5 2
%35 = OpConstant %5 3
%38 = OpTypePointer Uniform %13
%51 = OpConstant %5 4
%58 = OpConstant %5 5
%65 = OpConstant %5 6
%72 = OpConstant %5 7
%79 = OpConstant %5 8
%86 = OpConstant %5 9
%93 = OpConstant %5 10
%100 = OpConstant %5 11
%107 = OpConstant %5 12
%114 = OpConstant %5 13
%123 = OpConstant %5 16
%126 = OpTypePointer Uniform %7
%141 = OpConstant %5 14
%149 = OpTypePointer Output %7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %154
%154 = OpLabel
%25 = OpAccessChain %24 %21 %26
%27 = OpLoad %7 %25
%28 = OpAccessChain %24 %21 %29
%30 = OpLoad %7 %28
%31 = OpAccessChain %24 %21 %32
%33 = OpLoad %7 %31
%34 = OpAccessChain %24 %21 %35
%36 = OpLoad %7 %34
%37 = OpLoad %5 %19
%39 = OpAccessChain %38 %17 %26 %32
%40 = OpLoad %13 %39
%41 = OpCompositeExtract %7 %40 0
%42 = OpCompositeExtract %7 %40 1
%43 = OpCompositeExtract %7 %40 2
%44 = OpCompositeExtract %7 %40 3
%45 = OpAccessChain %38 %17 %26 %35
%46 = OpLoad %13 %45
%47 = OpCompositeExtract %7 %46 0
%48 = OpCompositeExtract %7 %46 1
%49 = OpCompositeExtract %7 %46 2
%50 = OpCompositeExtract %7 %46 3
%52 = OpAccessChain %38 %17 %26 %51
%53 = OpLoad %13 %52
%54 = OpCompositeExtract %7 %53 0
%55 = OpCompositeExtract %7 %53 1
%56 = OpCompositeExtract %7 %53 2
%57 = OpCompositeExtract %7 %53 3
%59 = OpAccessChain %38 %17 %26 %58
%60 = OpLoad %13 %59
%61 = OpCompositeExtract %7 %60 0
%62 = OpCompositeExtract %7 %60 1
%63 = OpCompositeExtract %7 %60 2
%64 = OpCompositeExtract %7 %60 3
%66 = OpAccessChain %38 %17 %26 %65
%67 = OpLoad %13 %66
%68 = OpCompositeExtract %7 %67 0
%69 = OpCompositeExtract %7 %67 1
%70 = OpCompositeExtract %7 %67 2
%71 = OpCompositeExtract %7 %67 3
%73 = OpAccessChain %38 %17 %26 %72
%74 = OpLoad %13 %73
%75 = OpCompositeExtract %7 %74 0
%76 = OpCompositeExtract %7 %74 1
%77 = OpCompositeExtract %7 %74 2
%78 = OpCompositeExtract %7 %74 3
%80 = OpAccessChain %38 %17 %26 %79
%81 = OpLoad %13 %80
%82 = OpCompositeExtract %7 %81 0
%83 = OpCompositeExtract %7 %81 1
%84 = OpCompositeExtract %7 %81 2
%85 = OpCompositeExtract %7 %81 3
%87 = OpAccessChain %38 %17 %26 %86
%88 = OpLoad %13 %87
%89 = OpCompositeExtract %7 %88 0
%90 = OpCompositeExtract %7 %88 1
%91 = OpCompositeExtract %7 %88 2
%92 = OpCompositeExtract %7 %88 3
%94 = OpAccessChain %38 %17 %26 %93
%95 = OpLoad %13 %94
%96 = OpCompositeExtract %7 %95 0
%97 = OpCompositeExtract %7 %95 1
%98 = OpCompositeExtract %7 %95 2
%99 = OpCompositeExtract %7 %95 3
%101 = OpAccessChain %38 %17 %26 %100
%102 = OpLoad %13 %101
%103 = OpCompositeExtract %7 %102 0
%104 = OpCompositeExtract %7 %102 1
%105 = OpCompositeExtract %7 %102 2
%106 = OpCompositeExtract %7 %102 3
%108 = OpAccessChain %38 %17 %26 %107
%109 = OpLoad %13 %108
%110 = OpCompositeExtract %7 %109 0
%111 = OpCompositeExtract %7 %109 1
%112 = OpCompositeExtract %7 %109 2
%113 = OpCompositeExtract %7 %109 3
%115 = OpAccessChain %38 %17 %26 %114
%116 = OpLoad %13 %115
%117 = OpCompositeExtract %7 %116 0
%118 = OpCompositeExtract %7 %116 1
%119 = OpCompositeExtract %7 %116 2
%120 = OpCompositeExtract %7 %116 3
%121 = OpUMod %5 %37 %35
%122 = OpIMul %5 %121 %123
%124 = OpIAdd %5 %32 %122
%125 = OpIAdd %5 %124 %79
%127 = OpAccessChain %126 %11 %26 %125
%128 = OpLoad %7 %127
%129 = OpIMul %5 %121 %123
%130 = OpIAdd %5 %65 %129
%131 = OpIAdd %5 %130 %79
%132 = OpAccessChain %126 %11 %26 %131
%133 = OpLoad %7 %132
%134 = OpIMul %5 %121 %123
%135 = OpIAdd %5 %93 %134
%136 = OpIAdd %5 %135 %79
%137 = OpAccessChain %126 %11 %26 %136
%138 = OpLoad %7 %137
%139 = OpIMul %5 %121 %123
%140 = OpIAdd %5 %141 %139
%142 = OpIAdd %5 %140 %79
%143 = OpAccessChain %126 %11 %26 %142
%144 = OpLoad %7 %143
%145 = OpFMul %7 %128 %27
%146 = OpFMul %7 %133 %30
%147 = OpFMul %7 %138 %33
%148 = OpFMul %7 %144 %36
%150 = OpAccessChain %149 %23 %26
OpStore %150 %145
%151 = OpAccessChain %149 %23 %29
OpStore %151 %146
%152 = OpAccessChain %149 %23 %32
OpStore %152 %147
%153 = OpAccessChain %149 %23 %35
OpStore %153 %148
OpReturn
OpFunctionEnd
#endif
