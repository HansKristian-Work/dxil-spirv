GLSL:
#version 460

layout(set = 0, binding = 0) uniform textureCubeArray _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _43 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER);
    vec4 _44 = textureGather(samplerCubeArrayShadow(_8, _11), _43, DEPTH_REF);
    SV_TARGET.x = _44.x;
    SV_TARGET.y = _44.y;
    SV_TARGET.z = _44.z;
    SV_TARGET.w = _44.w;
}


