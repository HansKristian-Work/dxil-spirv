GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _31 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    _9._m0[_31] = 1u;
    _9._m0[_31 + 1u] = 2u;
    _9._m0[_31 + 2u] = 3u;
    _9._m0[143u] = 1u;
    uint _41 = 143u + 1u;
    _9._m0[_41] = 2u;
    uint _43 = 143u + 2u;
    _9._m0[_43] = 3u;
    _9._m0[143u] = 6u;
}


