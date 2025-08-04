GLSL:
#version 460

layout(set = 0, binding = 0) uniform textureCube _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;

void main()
{
    vec4 _44 = textureGather(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _44.x;
    SV_TARGET.y = _44.y;
    SV_TARGET.z = _44.z;
    SV_TARGET.w = _44.w;
    vec4 _57 = textureGather(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(1u));
    SV_TARGET_1.x = _57.x;
    SV_TARGET_1.y = _57.y;
    SV_TARGET_1.z = _57.z;
    SV_TARGET_1.w = _57.w;
    vec4 _68 = textureGather(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(2u));
    SV_TARGET_2.x = _68.x;
    SV_TARGET_2.y = _68.y;
    SV_TARGET_2.z = _68.z;
    SV_TARGET_2.w = _68.w;
    vec4 _79 = textureGather(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(3u));
    SV_TARGET_3.x = _79.x;
    SV_TARGET_3.y = _79.y;
    SV_TARGET_3.z = _79.z;
    SV_TARGET_3.w = _79.w;
}


