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
    uint _35 = (BUFFER_ADDRESS.x * 4u) + 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_35] = 1u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_35 + 1u] = 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_35 + 2u] = 3u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[7u] = 1u;
    uint _45 = 7u + 1u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_45] = 2u;
    uint _47 = 7u + 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_47] = 3u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[7u] = 6u;
}


