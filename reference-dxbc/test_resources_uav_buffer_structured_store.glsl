GLSL:
#version 460

layout(set = 0, binding = 0, std430) writeonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _26 = (BUFFER_ADDRESS.x * 20u) + (BUFFER_ADDRESS.y >> 2u);
    _9._m0[_26] = 1u;
    _9._m0[_26 + 1u] = 2u;
}


