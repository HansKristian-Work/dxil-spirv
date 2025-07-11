GLSL:
#version 460

struct _15
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform readonly writeonly image1D _8;

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    SV_TARGET = uint(imageSize(_8));
    SV_TARGET_1 = 1u;
}


