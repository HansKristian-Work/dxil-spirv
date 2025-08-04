GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform writeonly imageBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    imageStore(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), vec4(1.0, 2.0, 3.0, 4.0));
    imageStore(_9[nonuniformEXT(BUFFER_INDEX)], int(7u), vec4(1.0, 2.0, 3.0, 4.0));
}


