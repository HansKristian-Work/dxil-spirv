GLSL:
#version 460
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

void main()
{
    vec2 _24 = unpackHalf2x16(_9._m0[0u]);
    vec2 _25 = unpackHalf2x16(_9._m0[1u]);
    _13._m0[0u] = packHalf2x16(vec2(_24.x + _25.x, _24.y + _25.y));
}


