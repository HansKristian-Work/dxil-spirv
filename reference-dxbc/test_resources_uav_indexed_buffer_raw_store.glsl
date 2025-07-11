GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _28 = ((BUFFER_ADDRESS.x * 4u) + 2u) >> 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_28] = 1u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_28 + 1u] = 2u;
}


