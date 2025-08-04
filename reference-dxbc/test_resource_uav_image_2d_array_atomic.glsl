GLSL:
#version 460

layout(set = 0, binding = 0, r32ui) uniform uimage2DArray _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) flat in uint VALUE;
layout(location = 0) out uint SV_TARGET;

void main()
{
    uint _30 = imageAtomicAdd(_8, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), VALUE);
    SV_TARGET = _30;
}


