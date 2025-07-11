GLSL:
#version 460

layout(set = 0, binding = 0) uniform readonly writeonly imageBuffer _8;

layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(imageSize(_8));
}


