GLSL:
#version 460

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(_9._m0.length()) / 20u;
}


