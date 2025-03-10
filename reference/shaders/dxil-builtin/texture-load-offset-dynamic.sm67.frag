#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, std140) uniform _31_33
{
    vec4 _m0[2];
} _33;

layout(set = 0, binding = 1) uniform texture1D _8;
layout(set = 0, binding = 2) uniform texture1DArray _11;
layout(set = 0, binding = 3) uniform texture2D _14;
layout(set = 0, binding = 4) uniform texture2DArray _17;
layout(set = 0, binding = 5) uniform texture3D _20;
layout(set = 0, binding = 6) uniform texture2DMS _23;
layout(set = 0, binding = 7) uniform texture2DMSArray _26;

layout(location = 0) flat in uvec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    uvec4 _55 = floatBitsToUint(_33._m0[0u]);
    uint _56 = _55.x;
    vec4 _60 = texelFetch(_8, int(TEXCOORD.x) + bitfieldExtract(int(_56), 0, 4), int(TEXCOORD.y));
    vec4 _69 = texelFetch(_11, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)) + bitfieldExtract(ivec2(int(_56), 0), 0, 4), int(TEXCOORD.z));
    uint _80 = _55.y;
    uint _81 = _55.z;
    vec4 _85 = texelFetch(_14, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)) + bitfieldExtract(ivec2(int(_80), int(_81)), 0, 4), int(TEXCOORD.z));
    vec4 _97 = texelFetch(_17, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)) + bitfieldExtract(ivec3(int(_80), int(_81), 0), 0, 4), int(TEXCOORD.w));
    uvec4 _110 = floatBitsToUint(_33._m0[1u]);
    vec4 _118 = texelFetch(_20, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)) + bitfieldExtract(ivec3(int(_110.x), int(_110.y), int(_110.z)), 0, 4), int(TEXCOORD.w));
    vec4 _130 = texelFetch(_23, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)) + bitfieldExtract(ivec2(int(_80), int(_81)), 0, 4), int(TEXCOORD.z));
    vec4 _142 = texelFetch(_26, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)) + bitfieldExtract(ivec3(int(_80), int(_81), 0), 0, 4), int(TEXCOORD.w));
    SV_Target.x = (((((_69.x + _60.x) + _85.x) + _97.x) + _118.x) + _130.x) + _142.x;
    SV_Target.y = (((((_69.y + _60.y) + _85.y) + _97.y) + _118.y) + _130.y) + _142.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 156
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %36 %39
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %31 ""
OpName %36 "TEXCOORD"
OpName %39 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 1
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 4
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 7
OpDecorate %30 ArrayStride 16
OpMemberDecorate %31 0 Offset 0
OpDecorate %31 Block
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 0
OpDecorate %36 Flat
OpDecorate %36 Location 0
OpDecorate %39 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeImage %5 2D 0 0 1 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 2D 0 1 1 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeInt 32 0
%28 = OpConstant %27 2
%29 = OpTypeVector %5 4
%30 = OpTypeArray %29 %28
%31 = OpTypeStruct %30
%32 = OpTypePointer Uniform %31
%33 = OpVariable %32 Uniform
%34 = OpTypeVector %27 4
%35 = OpTypePointer Input %34
%36 = OpVariable %35 Input
%37 = OpTypeVector %5 2
%38 = OpTypePointer Output %37
%39 = OpVariable %38 Output
%40 = OpTypePointer Input %27
%42 = OpConstant %27 0
%45 = OpConstant %27 1
%50 = OpConstant %27 3
%52 = OpTypePointer Uniform %29
%58 = OpTypeInt 32 1
%63 = OpConstant %58 0
%64 = OpConstant %58 4
%70 = OpTypeVector %27 2
%72 = OpTypeVector %58 2
%98 = OpTypeVector %27 3
%100 = OpTypeVector %58 3
%151 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %154
%154 = OpLabel
%41 = OpAccessChain %40 %36 %42
%43 = OpLoad %27 %41
%44 = OpAccessChain %40 %36 %45
%46 = OpLoad %27 %44
%47 = OpAccessChain %40 %36 %28
%48 = OpLoad %27 %47
%49 = OpAccessChain %40 %36 %50
%51 = OpLoad %27 %49
%53 = OpAccessChain %52 %33 %42 %42
%54 = OpLoad %29 %53
%55 = OpBitcast %34 %54
%56 = OpCompositeExtract %27 %55 0
%57 = OpLoad %6 %8
%59 = OpBitcast %58 %56
%62 = OpBitFieldSExtract %58 %59 %63 %64
%61 = OpIAdd %58 %43 %62
%60 = OpImageFetch %29 %57 %61 Lod %46
%65 = OpCompositeExtract %5 %60 0
%66 = OpCompositeExtract %5 %60 1
%67 = OpLoad %9 %11
%68 = OpBitcast %58 %56
%71 = OpCompositeConstruct %70 %43 %46
%74 = OpCompositeConstruct %72 %68 %63
%75 = OpBitFieldSExtract %72 %74 %63 %64
%73 = OpIAdd %72 %71 %75
%69 = OpImageFetch %29 %67 %73 Lod %48
%76 = OpCompositeExtract %5 %69 0
%77 = OpCompositeExtract %5 %69 1
%78 = OpFAdd %5 %76 %65
%79 = OpFAdd %5 %77 %66
%80 = OpCompositeExtract %27 %55 1
%81 = OpCompositeExtract %27 %55 2
%82 = OpLoad %12 %14
%83 = OpBitcast %58 %80
%84 = OpBitcast %58 %81
%86 = OpCompositeConstruct %70 %43 %46
%88 = OpCompositeConstruct %72 %83 %84
%89 = OpBitFieldSExtract %72 %88 %63 %64
%87 = OpIAdd %72 %86 %89
%85 = OpImageFetch %29 %82 %87 Lod %48
%90 = OpCompositeExtract %5 %85 0
%91 = OpCompositeExtract %5 %85 1
%92 = OpFAdd %5 %78 %90
%93 = OpFAdd %5 %79 %91
%94 = OpLoad %15 %17
%95 = OpBitcast %58 %80
%96 = OpBitcast %58 %81
%99 = OpCompositeConstruct %98 %43 %46 %48
%102 = OpCompositeConstruct %100 %95 %96 %63
%103 = OpBitFieldSExtract %100 %102 %63 %64
%101 = OpIAdd %100 %99 %103
%97 = OpImageFetch %29 %94 %101 Lod %51
%104 = OpCompositeExtract %5 %97 0
%105 = OpCompositeExtract %5 %97 1
%106 = OpFAdd %5 %92 %104
%107 = OpFAdd %5 %93 %105
%108 = OpAccessChain %52 %33 %42 %45
%109 = OpLoad %29 %108
%110 = OpBitcast %34 %109
%111 = OpCompositeExtract %27 %110 0
%112 = OpCompositeExtract %27 %110 1
%113 = OpCompositeExtract %27 %110 2
%114 = OpLoad %18 %20
%115 = OpBitcast %58 %111
%116 = OpBitcast %58 %112
%117 = OpBitcast %58 %113
%119 = OpCompositeConstruct %98 %43 %46 %48
%121 = OpCompositeConstruct %100 %115 %116 %117
%122 = OpBitFieldSExtract %100 %121 %63 %64
%120 = OpIAdd %100 %119 %122
%118 = OpImageFetch %29 %114 %120 Lod %51
%123 = OpCompositeExtract %5 %118 0
%124 = OpCompositeExtract %5 %118 1
%125 = OpFAdd %5 %106 %123
%126 = OpFAdd %5 %107 %124
%127 = OpLoad %21 %23
%128 = OpBitcast %58 %80
%129 = OpBitcast %58 %81
%131 = OpCompositeConstruct %70 %43 %46
%133 = OpCompositeConstruct %72 %128 %129
%134 = OpBitFieldSExtract %72 %133 %63 %64
%132 = OpIAdd %72 %131 %134
%130 = OpImageFetch %29 %127 %132 Sample %48
%135 = OpCompositeExtract %5 %130 0
%136 = OpCompositeExtract %5 %130 1
%137 = OpFAdd %5 %125 %135
%138 = OpFAdd %5 %126 %136
%139 = OpLoad %24 %26
%140 = OpBitcast %58 %80
%141 = OpBitcast %58 %81
%143 = OpCompositeConstruct %98 %43 %46 %48
%145 = OpCompositeConstruct %100 %140 %141 %63
%146 = OpBitFieldSExtract %100 %145 %63 %64
%144 = OpIAdd %100 %143 %146
%142 = OpImageFetch %29 %139 %144 Sample %51
%147 = OpCompositeExtract %5 %142 0
%148 = OpCompositeExtract %5 %142 1
%149 = OpFAdd %5 %137 %147
%150 = OpFAdd %5 %138 %148
%152 = OpAccessChain %151 %39 %42
OpStore %152 %149
%153 = OpAccessChain %151 %39 %45
OpStore %153 %150
OpReturn
OpFunctionEnd
#endif
