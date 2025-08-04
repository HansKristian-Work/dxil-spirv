GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0, r32ui) uniform uimage2D _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) flat in uint VALUE;
layout(location = 0) out uint SV_TARGET;

void main()
{
    uint _42 = imageAtomicAdd(_9[nonuniformEXT(floatBitsToUint(_15._m0[0u]))], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), VALUE);
    SV_TARGET = _42;
}


