GLSL:
#version 460

struct _18
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform readonly writeonly image1DArray _8;

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uvec2 _15 = uvec2(imageSize(_8));
    SV_TARGET = _15.x;
    SV_TARGET_1 = _15.y;
}


