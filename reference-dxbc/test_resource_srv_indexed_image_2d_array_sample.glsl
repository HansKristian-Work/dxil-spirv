GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DArray _9[];
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
    vec4 _73 = texture(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    float _75 = _73.x;
    SV_TARGET.x = _75;
    SV_TARGET.y = _73.y;
    SV_TARGET.z = _73.z;
    SV_TARGET.w = _73.w;
    vec4 _89 = textureOffset(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    float _93 = _89.x;
    SV_TARGET_1.x = _93;
    SV_TARGET_1.y = _89.y;
    SV_TARGET_1.z = _89.z;
    SV_TARGET_1.w = _89.w;
    vec4 _102 = textureLod(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), textureQueryLod(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    float _104 = _102.x;
    SV_TARGET_2.x = _104;
    SV_TARGET_2.y = _102.y;
    SV_TARGET_2.z = _102.z;
    SV_TARGET_2.w = _102.w;
    vec4 _113 = texture(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_BIAS);
    float _115 = _113.x;
    SV_TARGET_3.x = _115;
    SV_TARGET_3.y = _113.y;
    SV_TARGET_3.z = _113.z;
    SV_TARGET_3.w = _113.w;
    vec4 _124 = textureClampARB(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_CLAMP);
    float _126 = _124.x;
    SV_TARGET_4.x = _126;
    SV_TARGET_4.y = _124.y;
    SV_TARGET_4.z = _124.z;
    SV_TARGET_4.w = _124.w;
    vec4 _135 = textureOffsetClampARB(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    float _137 = _135.x;
    SV_TARGET_5.x = _137;
    SV_TARGET_5.y = _135.y;
    SV_TARGET_5.z = _135.z;
    SV_TARGET_5.w = _135.w;
    float _148 = dFdx(TEXCOORD_2.x);
    float _149 = dFdy(TEXCOORD_2.x);
    float _152 = dFdx(TEXCOORD_2.y);
    float _153 = dFdy(TEXCOORD_2.y);
    vec4 _156 = textureGrad(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_148, _152), vec2(_149, _153));
    float _160 = _156.x;
    SV_TARGET_6.x = _160;
    SV_TARGET_6.y = _156.y;
    SV_TARGET_6.z = _156.z;
    SV_TARGET_6.w = _156.w;
    vec4 _169 = textureGradOffset(nonuniformEXT(sampler2DArray(_9[_51], _19[_51])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_148, _152), vec2(_149, _153), ivec2(-1, 0));
    float _173 = _169.x;
    SV_TARGET_7.x = _173;
    SV_TARGET_7.y = _169.y;
    SV_TARGET_7.z = _169.z;
    SV_TARGET_7.w = _169.w;
}


