GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _30 = (BUFFER_ADDRESS.x * 20u) + (BUFFER_ADDRESS.y >> 2u);
    _9._m0[_30] = 1u;
    _9._m0[_30 + 1u] = 2u;
    _9._m0[_30 + 2u] = 3u;
    _9._m0[140u] = 1u;
    uint _40 = 140u + 1u;
    _9._m0[_40] = 2u;
    uint _42 = 140u + 2u;
    _9._m0[_42] = 3u;
    _9._m0[140u] = 6u;
}


