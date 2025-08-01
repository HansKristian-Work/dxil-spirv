GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _25 = ((BUFFER_ADDRESS.x * 4u) + 2u) >> 2u;
    _9._m0[_25] = 1u;
    _9._m0[_25 + 1u] = 2u;
    _9._m0[_25 + 2u] = 3u;
    _9._m0[1u] = 1u;
    uint _34 = 1u + 1u;
    _9._m0[_34] = 2u;
    uint _36 = 1u + 2u;
    _9._m0[_36] = 3u;
    _9._m0[1u] = 6u;
}


