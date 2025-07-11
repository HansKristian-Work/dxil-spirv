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
    uint _39 = 0u * 16u;
    uint _42 = 0u * 4u;
    uint _49 = floatBitsToUint(_15._m0[(_39 + _42) >> 2u]);
    vec4 _66 = texture(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x);
    float _67 = _66.x;
    SV_TARGET.x = _67;
    SV_TARGET.y = _66.y;
    SV_TARGET.z = _66.z;
    SV_TARGET.w = _66.w;
    vec4 _81 = textureOffset(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, -1);
    float _82 = _81.x;
    SV_TARGET_1.x = _82;
    SV_TARGET_1.y = _81.y;
    SV_TARGET_1.z = _81.z;
    SV_TARGET_1.w = _81.w;
    vec4 _91 = textureLod(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, textureQueryLod(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x).x);
    float _92 = _91.x;
    SV_TARGET_2.x = _92;
    SV_TARGET_2.y = _91.y;
    SV_TARGET_2.z = _91.z;
    SV_TARGET_2.w = _91.w;
    vec4 _101 = texture(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, LOD_BIAS);
    float _102 = _101.x;
    SV_TARGET_3.x = _102;
    SV_TARGET_3.y = _101.y;
    SV_TARGET_3.z = _101.z;
    SV_TARGET_3.w = _101.w;
    vec4 _111 = textureClampARB(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, LOD_CLAMP);
    float _112 = _111.x;
    SV_TARGET_4.x = _112;
    SV_TARGET_4.y = _111.y;
    SV_TARGET_4.z = _111.z;
    SV_TARGET_4.w = _111.w;
    vec4 _121 = textureOffsetClampARB(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, -1, LOD_CLAMP, LOD_BIAS);
    float _122 = _121.x;
    SV_TARGET_5.x = _122;
    SV_TARGET_5.y = _121.y;
    SV_TARGET_5.z = _121.z;
    SV_TARGET_5.w = _121.w;
    float _132 = dFdx(TEXCOORD_2);
    float _133 = dFdy(TEXCOORD_2);
    vec4 _134 = textureGrad(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, _132, _133);
    float _135 = _134.x;
    SV_TARGET_6.x = _135;
    SV_TARGET_6.y = _134.y;
    SV_TARGET_6.z = _134.z;
    SV_TARGET_6.w = _134.w;
    vec4 _144 = textureGradOffset(nonuniformEXT(sampler1D(_9[_49], _19[_49])), TEXCOORD.x, _132, _133, -1);
    float _145 = _144.x;
    SV_TARGET_7.x = _145;
    SV_TARGET_7.y = _144.y;
    SV_TARGET_7.z = _144.z;
    SV_TARGET_7.w = _144.w;
}


