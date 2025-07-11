GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _24 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), 16u);
}


