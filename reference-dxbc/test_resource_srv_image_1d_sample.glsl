GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform texture1D _8;
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
    vec4 _45 = texture(sampler1D(_8, _11), TEXCOORD.x);
    SV_TARGET.x = _45.x;
    SV_TARGET.y = _45.y;
    SV_TARGET.z = _45.z;
    SV_TARGET.w = _45.w;
    vec4 _61 = textureOffset(sampler1D(_8, _11), TEXCOORD.x, -1);
    SV_TARGET_1.x = _61.x;
    SV_TARGET_1.y = _61.y;
    SV_TARGET_1.z = _61.z;
    SV_TARGET_1.w = _61.w;
    vec4 _71 = textureLod(sampler1D(_8, _11), TEXCOORD.x, textureQueryLod(sampler1D(_8, _11), TEXCOORD.x).x);
    SV_TARGET_2.x = _71.x;
    SV_TARGET_2.y = _71.y;
    SV_TARGET_2.z = _71.z;
    SV_TARGET_2.w = _71.w;
    vec4 _81 = texture(sampler1D(_8, _11), TEXCOORD.x, LOD_BIAS);
    SV_TARGET_3.x = _81.x;
    SV_TARGET_3.y = _81.y;
    SV_TARGET_3.z = _81.z;
    SV_TARGET_3.w = _81.w;
    vec4 _91 = textureClampARB(sampler1D(_8, _11), TEXCOORD.x, LOD_CLAMP);
    SV_TARGET_4.x = _91.x;
    SV_TARGET_4.y = _91.y;
    SV_TARGET_4.z = _91.z;
    SV_TARGET_4.w = _91.w;
    vec4 _101 = textureOffsetClampARB(sampler1D(_8, _11), TEXCOORD.x, -1, LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _101.x;
    SV_TARGET_5.y = _101.y;
    SV_TARGET_5.z = _101.z;
    SV_TARGET_5.w = _101.w;
    float _112 = dFdx(TEXCOORD_2);
    float _113 = dFdy(TEXCOORD_2);
    vec4 _114 = textureGrad(sampler1D(_8, _11), TEXCOORD.x, _112, _113);
    SV_TARGET_6.x = _114.x;
    SV_TARGET_6.y = _114.y;
    SV_TARGET_6.z = _114.z;
    SV_TARGET_6.w = _114.w;
    vec4 _124 = textureGradOffset(sampler1D(_8, _11), TEXCOORD.x, _112, _113, -1);
    SV_TARGET_7.x = _124.x;
    SV_TARGET_7.y = _124.y;
    SV_TARGET_7.z = _124.z;
    SV_TARGET_7.w = _124.w;
}


