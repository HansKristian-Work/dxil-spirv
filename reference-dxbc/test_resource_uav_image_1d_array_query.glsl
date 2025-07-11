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
    uint _16 = _15.x;
    uint _17 = _15.y;
    SV_TARGET = _16;
    SV_TARGET_1 = _17;
}


