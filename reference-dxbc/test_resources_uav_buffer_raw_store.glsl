GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _30 = (BUFFER_ADDRESS.x * 4u) + 2u;
    _9._m0[_30] = 1u;
    _9._m0[_30 + 1u] = 2u;
    _9._m0[_30 + 2u] = 3u;
    _9._m0[7u] = 1u;
    uint _40 = 7u + 1u;
    _9._m0[_40] = 2u;
    uint _42 = 7u + 2u;
    _9._m0[_42] = 3u;
    _9._m0[7u] = 6u;
}


