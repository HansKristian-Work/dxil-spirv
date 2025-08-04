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
    uint _45 = floatBitsToUint(_15._m0[0u]);
    vec4 _67 = texture(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    SV_TARGET.x = _67.x;
    SV_TARGET.y = _67.y;
    SV_TARGET.z = _67.z;
    SV_TARGET.w = _67.w;
    vec4 _84 = textureOffset(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    SV_TARGET_1.x = _84.x;
    SV_TARGET_1.y = _84.y;
    SV_TARGET_1.z = _84.z;
    SV_TARGET_1.w = _84.w;
    vec4 _97 = textureLod(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), textureQueryLod(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    SV_TARGET_2.x = _97.x;
    SV_TARGET_2.y = _97.y;
    SV_TARGET_2.z = _97.z;
    SV_TARGET_2.w = _97.w;
    vec4 _108 = texture(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_BIAS);
    SV_TARGET_3.x = _108.x;
    SV_TARGET_3.y = _108.y;
    SV_TARGET_3.z = _108.z;
    SV_TARGET_3.w = _108.w;
    vec4 _119 = textureClampARB(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_CLAMP);
    SV_TARGET_4.x = _119.x;
    SV_TARGET_4.y = _119.y;
    SV_TARGET_4.z = _119.z;
    SV_TARGET_4.w = _119.w;
    vec4 _130 = textureOffsetClampARB(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _130.x;
    SV_TARGET_5.y = _130.y;
    SV_TARGET_5.z = _130.z;
    SV_TARGET_5.w = _130.w;
    float _143 = dFdx(TEXCOORD_2.x);
    float _144 = dFdy(TEXCOORD_2.x);
    float _147 = dFdx(TEXCOORD_2.y);
    float _148 = dFdy(TEXCOORD_2.y);
    vec4 _151 = textureGrad(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_143, _147), vec2(_144, _148));
    SV_TARGET_6.x = _151.x;
    SV_TARGET_6.y = _151.y;
    SV_TARGET_6.z = _151.z;
    SV_TARGET_6.w = _151.w;
    vec4 _164 = textureGradOffset(nonuniformEXT(sampler2DArray(_9[_45], _19[_45])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_143, _147), vec2(_144, _148), ivec2(-1, 0));
    SV_TARGET_7.x = _164.x;
    SV_TARGET_7.y = _164.y;
    SV_TARGET_7.z = _164.z;
    SV_TARGET_7.w = _164.w;
}


