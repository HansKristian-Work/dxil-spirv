GLSL:
#version 460

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;

void main()
{
    uint _28 = (BUFFER_ADDRESS.x * 2u) + 1u;
    SV_TARGET.x = _10._m0[_28].x;
    SV_TARGET.y = _10._m0[_28].y;
}


