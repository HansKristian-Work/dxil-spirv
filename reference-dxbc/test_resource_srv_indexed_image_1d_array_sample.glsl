GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture1DArray _9[];
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
    vec4 _67 = texture(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER));
    SV_TARGET.x = _67.x;
    SV_TARGET.y = _67.y;
    SV_TARGET.z = _67.z;
    SV_TARGET.w = _67.w;
    vec4 _83 = textureOffset(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), -1);
    SV_TARGET_1.x = _83.x;
    SV_TARGET_1.y = _83.y;
    SV_TARGET_1.z = _83.z;
    SV_TARGET_1.w = _83.w;
    vec4 _94 = textureLod(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), textureQueryLod(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), TEXCOORD.x).x);
    SV_TARGET_2.x = _94.x;
    SV_TARGET_2.y = _94.y;
    SV_TARGET_2.z = _94.z;
    SV_TARGET_2.w = _94.w;
    vec4 _105 = texture(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), LOD_BIAS);
    SV_TARGET_3.x = _105.x;
    SV_TARGET_3.y = _105.y;
    SV_TARGET_3.z = _105.z;
    SV_TARGET_3.w = _105.w;
    vec4 _116 = textureClampARB(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), LOD_CLAMP);
    SV_TARGET_4.x = _116.x;
    SV_TARGET_4.y = _116.y;
    SV_TARGET_4.z = _116.z;
    SV_TARGET_4.w = _116.w;
    vec4 _127 = textureOffsetClampARB(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), -1, LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _127.x;
    SV_TARGET_5.y = _127.y;
    SV_TARGET_5.z = _127.z;
    SV_TARGET_5.w = _127.w;
    float _139 = dFdx(TEXCOORD_2);
    float _140 = dFdy(TEXCOORD_2);
    vec4 _141 = textureGrad(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), _139, _140);
    SV_TARGET_6.x = _141.x;
    SV_TARGET_6.y = _141.y;
    SV_TARGET_6.z = _141.z;
    SV_TARGET_6.w = _141.w;
    vec4 _152 = textureGradOffset(nonuniformEXT(sampler1DArray(_9[_49], _19[_49])), vec2(TEXCOORD.x, LAYER), _139, _140, -1);
    SV_TARGET_7.x = _152.x;
    SV_TARGET_7.y = _152.y;
    SV_TARGET_7.z = _152.z;
    SV_TARGET_7.w = _152.w;
}


