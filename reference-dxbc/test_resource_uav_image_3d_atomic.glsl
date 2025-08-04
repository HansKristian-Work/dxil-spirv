GLSL:
#version 460

layout(set = 0, binding = 0, r32ui) uniform uimage3D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) flat in uint VALUE;
layout(location = 0) out uint SV_TARGET;

void main()
{
    uint _31 = imageAtomicAdd(_8, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), VALUE);
    SV_TARGET = _31;
}


