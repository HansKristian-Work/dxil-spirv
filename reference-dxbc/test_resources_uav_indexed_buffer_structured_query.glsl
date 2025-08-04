GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(_10[nonuniformEXT(BUFFER_INDEX)]._m0.length()) / 20u;
}


