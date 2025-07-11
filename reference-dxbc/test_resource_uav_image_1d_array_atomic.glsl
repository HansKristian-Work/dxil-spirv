GLSL:
#version 460

layout(set = 0, binding = 0, r32ui) uniform uimage1DArray _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) flat in uint VALUE;
layout(location = 0) out uint SV_TARGET;

void main()
{
    uint _26 = imageAtomicAdd(_8, ivec2(uvec2(TEXCOORD.x, 2u)), VALUE);
    SV_TARGET = _26;
}


