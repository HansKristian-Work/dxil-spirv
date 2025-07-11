GLSL:
#version 460

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;

void main()
{
    uint _27 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    uvec2 _34 = uvec2(_9._m0[_27], _9._m0[_27 + 1u]);
    uint _35 = _34.x;
    SV_TARGET.x = _35;
    SV_TARGET.y = _34.y;
}


