GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform texture3D _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec3 TEXCOORD_2;
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
    vec4 _53 = texture(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _53.x;
    SV_TARGET.y = _53.y;
    SV_TARGET.z = _53.z;
    SV_TARGET.w = _53.w;
    vec4 _70 = textureOffset(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1));
    SV_TARGET_1.x = _70.x;
    SV_TARGET_1.y = _70.y;
    SV_TARGET_1.z = _70.z;
    SV_TARGET_1.w = _70.w;
    vec4 _83 = textureLod(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_2.x = _83.x;
    SV_TARGET_2.y = _83.y;
    SV_TARGET_2.z = _83.z;
    SV_TARGET_2.w = _83.w;
    vec4 _94 = texture(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    SV_TARGET_3.x = _94.x;
    SV_TARGET_3.y = _94.y;
    SV_TARGET_3.z = _94.z;
    SV_TARGET_3.w = _94.w;
    vec4 _105 = textureClampARB(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    SV_TARGET_4.x = _105.x;
    SV_TARGET_4.y = _105.y;
    SV_TARGET_4.z = _105.z;
    SV_TARGET_4.w = _105.w;
    vec4 _116 = textureOffsetClampARB(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _116.x;
    SV_TARGET_5.y = _116.y;
    SV_TARGET_5.z = _116.z;
    SV_TARGET_5.w = _116.w;
    float _129 = dFdx(TEXCOORD_2.x);
    float _130 = dFdy(TEXCOORD_2.x);
    float _133 = dFdx(TEXCOORD_2.y);
    float _134 = dFdy(TEXCOORD_2.y);
    float _137 = dFdx(TEXCOORD_2.z);
    float _138 = dFdy(TEXCOORD_2.z);
    vec4 _141 = textureGrad(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_129, _133, _137), vec3(_130, _134, _138));
    SV_TARGET_6.x = _141.x;
    SV_TARGET_6.y = _141.y;
    SV_TARGET_6.z = _141.z;
    SV_TARGET_6.w = _141.w;
    vec4 _154 = textureGradOffset(sampler3D(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_129, _133, _137), vec3(_130, _134, _138), ivec3(-1, 0, 1));
    SV_TARGET_7.x = _154.x;
    SV_TARGET_7.y = _154.y;
    SV_TARGET_7.z = _154.z;
    SV_TARGET_7.w = _154.w;
}


