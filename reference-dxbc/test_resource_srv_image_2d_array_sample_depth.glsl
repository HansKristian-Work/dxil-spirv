GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2DArray _8;
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
    SV_TARGET = vec4(texture(sampler2DArrayShadow(_8, _11), vec4(vec3(TEXCOORD.x, TEXCOORD.y, LAYER), DEPTH_REF))).x;
    SV_TARGET_1 = vec4(textureOffset(sampler2DArrayShadow(_8, _11), vec4(vec3(TEXCOORD.x, TEXCOORD.y, LAYER), DEPTH_REF), ivec2(-1, 0))).x;
    SV_TARGET_2 = vec4(textureGrad(sampler2DArrayShadow(_8, _11), vec4(vec3(TEXCOORD.x, TEXCOORD.y, LAYER), DEPTH_REF), vec2(0.0), vec2(0.0))).x;
}


