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
    uint _42 = floatBitsToUint(_15._m0[0u]);
    vec4 _68 = textureGather(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y));
    SV_TARGET.x = _68.x;
    SV_TARGET.y = _68.y;
    SV_TARGET.z = _68.z;
    SV_TARGET.w = _68.w;
    vec4 _84 = textureGatherOffset(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    SV_TARGET_1.x = _84.x;
    SV_TARGET_1.y = _84.y;
    SV_TARGET_1.z = _84.z;
    SV_TARGET_1.w = _84.w;
    vec4 _96 = textureGather(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y), int(1u));
    SV_TARGET_2.x = _96.x;
    SV_TARGET_2.y = _96.y;
    SV_TARGET_2.z = _96.z;
    SV_TARGET_2.w = _96.w;
    vec4 _107 = textureGather(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y), int(2u));
    SV_TARGET_3.x = _107.x;
    SV_TARGET_3.y = _107.y;
    SV_TARGET_3.z = _107.z;
    SV_TARGET_3.w = _107.w;
    vec4 _118 = textureGather(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y), int(3u));
    SV_TARGET_4.x = _118.x;
    SV_TARGET_4.y = _118.y;
    SV_TARGET_4.z = _118.z;
    SV_TARGET_4.w = _118.w;
    vec4 _131 = textureGatherOffset(nonuniformEXT(sampler2D(_9[_42], _19[_42])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_5.x = _131.x;
    SV_TARGET_5.y = _131.y;
    SV_TARGET_5.z = _131.z;
    SV_TARGET_5.w = _131.w;
}


