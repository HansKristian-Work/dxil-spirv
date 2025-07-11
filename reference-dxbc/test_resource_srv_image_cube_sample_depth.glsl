GLSL:
#version 460

layout(set = 0, binding = 0) uniform textureCube _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec3 TEXCOORD_2;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out float SV_TARGET_1;

void main()
{
    SV_TARGET = vec4(texture(samplerCubeShadow(_8, _11), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DEPTH_REF))).x;
    SV_TARGET_1 = vec4(textureGrad(samplerCubeShadow(_8, _11), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DEPTH_REF), vec3(0.0), vec3(0.0))).x;
}


