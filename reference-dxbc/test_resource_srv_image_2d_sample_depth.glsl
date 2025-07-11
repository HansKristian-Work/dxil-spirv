GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out float SV_TARGET_1;
layout(location = 2) out float SV_TARGET_2;

void main()
{
    SV_TARGET = vec4(texture(sampler2DShadow(_8, _11), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DEPTH_REF))).x;
    SV_TARGET_1 = vec4(textureOffset(sampler2DShadow(_8, _11), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DEPTH_REF), ivec2(-1, 0))).x;
    SV_TARGET_2 = vec4(textureLod(sampler2DShadow(_8, _11), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DEPTH_REF), 0.0)).x;
}


