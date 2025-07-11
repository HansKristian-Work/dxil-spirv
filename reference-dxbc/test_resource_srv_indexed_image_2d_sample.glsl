GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
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
    uint _41 = 0u * 16u;
    uint _44 = 0u * 4u;
    uint _51 = floatBitsToUint(_15._m0[(_41 + _44) >> 2u]);
    vec4 _72 = texture(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y));
    float _74 = _72.x;
    SV_TARGET.x = _74;
    SV_TARGET.y = _72.y;
    SV_TARGET.z = _72.z;
    SV_TARGET.w = _72.w;
    vec4 _88 = textureOffset(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    float _92 = _88.x;
    SV_TARGET_1.x = _92;
    SV_TARGET_1.y = _88.y;
    SV_TARGET_1.z = _88.z;
    SV_TARGET_1.w = _88.w;
    vec4 _101 = textureLod(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), textureQueryLod(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    float _103 = _101.x;
    SV_TARGET_2.x = _103;
    SV_TARGET_2.y = _101.y;
    SV_TARGET_2.z = _101.z;
    SV_TARGET_2.w = _101.w;
    vec4 _112 = texture(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), LOD_BIAS);
    float _114 = _112.x;
    SV_TARGET_3.x = _114;
    SV_TARGET_3.y = _112.y;
    SV_TARGET_3.z = _112.z;
    SV_TARGET_3.w = _112.w;
    vec4 _123 = textureClampARB(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), LOD_CLAMP);
    float _125 = _123.x;
    SV_TARGET_4.x = _125;
    SV_TARGET_4.y = _123.y;
    SV_TARGET_4.z = _123.z;
    SV_TARGET_4.w = _123.w;
    vec4 _134 = textureOffsetClampARB(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    float _136 = _134.x;
    SV_TARGET_5.x = _136;
    SV_TARGET_5.y = _134.y;
    SV_TARGET_5.z = _134.z;
    SV_TARGET_5.w = _134.w;
    float _147 = dFdx(TEXCOORD_2.x);
    float _148 = dFdy(TEXCOORD_2.x);
    float _151 = dFdx(TEXCOORD_2.y);
    float _152 = dFdy(TEXCOORD_2.y);
    vec4 _155 = textureGrad(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_147, _151), vec2(_148, _152));
    float _159 = _155.x;
    SV_TARGET_6.x = _159;
    SV_TARGET_6.y = _155.y;
    SV_TARGET_6.z = _155.z;
    SV_TARGET_6.w = _155.w;
    vec4 _168 = textureGradOffset(nonuniformEXT(sampler2D(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_147, _151), vec2(_148, _152), ivec2(-1, 0));
    float _172 = _168.x;
    SV_TARGET_7.x = _172;
    SV_TARGET_7.y = _168.y;
    SV_TARGET_7.z = _168.z;
    SV_TARGET_7.w = _168.w;
}


