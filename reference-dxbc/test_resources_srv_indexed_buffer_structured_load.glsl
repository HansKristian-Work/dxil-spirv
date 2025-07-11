GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;

void main()
{
    uint _32 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    uvec2 _39 = uvec2(_10[nonuniformEXT(BUFFER_INDEX)]._m0[_32], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_32 + 1u]);
    uint _40 = _39.x;
    SV_TARGET.x = _40;
    SV_TARGET.y = _39.y;
}


