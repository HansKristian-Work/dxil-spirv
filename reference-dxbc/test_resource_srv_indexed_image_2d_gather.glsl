GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec2 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out vec4 SV_TARGET_5;

void main()
{
    uint _38 = 0u * 16u;
    uint _41 = 0u * 4u;
    uint _48 = floatBitsToUint(_15._m0[(_38 + _41) >> 2u]);
    vec4 _74 = textureGather(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y));
    SV_TARGET.x = _74.x;
    SV_TARGET.y = _74.y;
    SV_TARGET.z = _74.z;
    SV_TARGET.w = _74.w;
    vec4 _89 = textureGatherOffset(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    SV_TARGET_1.x = _89.x;
    SV_TARGET_1.y = _89.y;
    SV_TARGET_1.z = _89.z;
    SV_TARGET_1.w = _89.w;
    vec4 _101 = textureGather(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y), int(1u));
    SV_TARGET_2.x = _101.x;
    SV_TARGET_2.y = _101.y;
    SV_TARGET_2.z = _101.z;
    SV_TARGET_2.w = _101.w;
    vec4 _112 = textureGather(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y), int(2u));
    SV_TARGET_3.x = _112.x;
    SV_TARGET_3.y = _112.y;
    SV_TARGET_3.z = _112.z;
    SV_TARGET_3.w = _112.w;
    vec4 _123 = textureGather(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y), int(3u));
    SV_TARGET_4.x = _123.x;
    SV_TARGET_4.y = _123.y;
    SV_TARGET_4.z = _123.z;
    SV_TARGET_4.w = _123.w;
    vec4 _136 = textureGatherOffset(nonuniformEXT(sampler2D(_9[_48], _19[_48])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_5.x = _136.x;
    SV_TARGET_5.y = _136.y;
    SV_TARGET_5.z = _136.z;
    SV_TARGET_5.w = _136.w;
}


