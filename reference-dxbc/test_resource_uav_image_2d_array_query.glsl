GLSL:
#version 460

struct _22
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform readonly writeonly image2DArray _8;

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uvec3 _17 = uvec3(imageSize(_8));
    uint _18 = _17.x;
    SV_TARGET.x = _18;
    SV_TARGET.y = _17.y;
    SV_TARGET_1 = _17.z;
}


