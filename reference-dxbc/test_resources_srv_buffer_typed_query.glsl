GLSL:
#version 460

layout(set = 0, binding = 0) uniform samplerBuffer _8;

layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(textureSize(_8));
}


