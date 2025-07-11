GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _23 = ((BUFFER_ADDRESS.x * 4u) + 2u) >> 2u;
    _9._m0[_23] = 1u;
    _9._m0[_23 + 1u] = 2u;
}


