GLSL:
#version 460

struct _20
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform readonly writeonly image2D _8;

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uvec2 _16 = uvec2(imageSize(_8));
    uint _17 = _16.x;
    SV_TARGET.x = _17;
    SV_TARGET.y = _16.y;
    SV_TARGET_1 = 1u;
}


