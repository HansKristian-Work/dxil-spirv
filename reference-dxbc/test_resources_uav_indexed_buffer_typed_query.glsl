GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform readonly writeonly imageBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(imageSize(_9[nonuniformEXT(BUFFER_INDEX)]));
}


