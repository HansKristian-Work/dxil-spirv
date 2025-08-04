GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture1D _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in float TEXCOORD_2;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out vec4 SV_TARGET_5;
layout(location = 6) out vec4 SV_TARGET_6;
layout(location = 7) out vec4 SV_TARGET_7;

void main()
{
    uint _43 = floatBitsToUint(_15._m0[0u]);
    vec4 _60 = texture(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x);
    SV_TARGET.x = _60.x;
    SV_TARGET.y = _60.y;
    SV_TARGET.z = _60.z;
    SV_TARGET.w = _60.w;
    vec4 _76 = textureOffset(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, -1);
    SV_TARGET_1.x = _76.x;
    SV_TARGET_1.y = _76.y;
    SV_TARGET_1.z = _76.z;
    SV_TARGET_1.w = _76.w;
    vec4 _86 = textureLod(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, textureQueryLod(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x).x);
    SV_TARGET_2.x = _86.x;
    SV_TARGET_2.y = _86.y;
    SV_TARGET_2.z = _86.z;
    SV_TARGET_2.w = _86.w;
    vec4 _96 = texture(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, LOD_BIAS);
    SV_TARGET_3.x = _96.x;
    SV_TARGET_3.y = _96.y;
    SV_TARGET_3.z = _96.z;
    SV_TARGET_3.w = _96.w;
    vec4 _106 = textureClampARB(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, LOD_CLAMP);
    SV_TARGET_4.x = _106.x;
    SV_TARGET_4.y = _106.y;
    SV_TARGET_4.z = _106.z;
    SV_TARGET_4.w = _106.w;
    vec4 _116 = textureOffsetClampARB(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, -1, LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _116.x;
    SV_TARGET_5.y = _116.y;
    SV_TARGET_5.z = _116.z;
    SV_TARGET_5.w = _116.w;
    float _127 = dFdx(TEXCOORD_2);
    float _128 = dFdy(TEXCOORD_2);
    vec4 _129 = textureGrad(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, _127, _128);
    SV_TARGET_6.x = _129.x;
    SV_TARGET_6.y = _129.y;
    SV_TARGET_6.z = _129.z;
    SV_TARGET_6.w = _129.w;
    vec4 _139 = textureGradOffset(nonuniformEXT(sampler1D(_9[_43], _19[_43])), TEXCOORD.x, _127, _128, -1);
    SV_TARGET_7.x = _139.x;
    SV_TARGET_7.y = _139.y;
    SV_TARGET_7.z = _139.z;
    SV_TARGET_7.w = _139.w;
}


