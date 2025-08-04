GLSL:
#version 460

layout(set = 0, binding = 0) uniform textureCube _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec3 _42 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _43 = textureGather(samplerCubeShadow(_8, _11), _42, DEPTH_REF);
    SV_TARGET.x = _43.x;
    SV_TARGET.y = _43.y;
    SV_TARGET.z = _43.z;
    SV_TARGET.w = _43.w;
}


