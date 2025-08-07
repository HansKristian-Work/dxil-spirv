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
    uint _36 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_36] = 1u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_36 + 1u] = 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_36 + 2u] = 3u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[143u] = 1u;
    uint _46 = 143u + 1u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_46] = 2u;
    uint _48 = 143u + 2u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[_48] = 3u;
    _10[nonuniformEXT(BUFFER_INDEX)]._m0[143u] = 6u;
}


