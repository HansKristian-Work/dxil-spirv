GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform texture1DArray _8;
layout(set = 0, binding = 0) uniform sampler _11;

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
    vec4 _46 = texture(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER));
    SV_TARGET.x = _46.x;
    SV_TARGET.y = _46.y;
    SV_TARGET.z = _46.z;
    SV_TARGET.w = _46.w;
    vec4 _63 = textureOffset(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), -1);
    SV_TARGET_1.x = _63.x;
    SV_TARGET_1.y = _63.y;
    SV_TARGET_1.z = _63.z;
    SV_TARGET_1.w = _63.w;
    vec4 _74 = textureLod(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), textureQueryLod(sampler1DArray(_8, _11), TEXCOORD.x).x);
    SV_TARGET_2.x = _74.x;
    SV_TARGET_2.y = _74.y;
    SV_TARGET_2.z = _74.z;
    SV_TARGET_2.w = _74.w;
    vec4 _85 = texture(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), LOD_BIAS);
    SV_TARGET_3.x = _85.x;
    SV_TARGET_3.y = _85.y;
    SV_TARGET_3.z = _85.z;
    SV_TARGET_3.w = _85.w;
    vec4 _96 = textureClampARB(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), LOD_CLAMP);
    SV_TARGET_4.x = _96.x;
    SV_TARGET_4.y = _96.y;
    SV_TARGET_4.z = _96.z;
    SV_TARGET_4.w = _96.w;
    vec4 _107 = textureOffsetClampARB(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), -1, LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _107.x;
    SV_TARGET_5.y = _107.y;
    SV_TARGET_5.z = _107.z;
    SV_TARGET_5.w = _107.w;
    float _119 = dFdx(TEXCOORD_2);
    float _120 = dFdy(TEXCOORD_2);
    vec4 _121 = textureGrad(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), _119, _120);
    SV_TARGET_6.x = _121.x;
    SV_TARGET_6.y = _121.y;
    SV_TARGET_6.z = _121.z;
    SV_TARGET_6.w = _121.w;
    vec4 _132 = textureGradOffset(sampler1DArray(_8, _11), vec2(TEXCOORD.x, LAYER), _119, _120, -1);
    SV_TARGET_7.x = _132.x;
    SV_TARGET_7.y = _132.y;
    SV_TARGET_7.z = _132.z;
    SV_TARGET_7.w = _132.w;
}


