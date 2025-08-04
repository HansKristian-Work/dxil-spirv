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
    _13._m0[0u] = uint(_9._m0[0u] == _9._m0[1u]);
    _13._m0[1u] = uint(_9._m0[0u] != _9._m0[1u]);
    _13._m0[2u] = uint(int(_9._m0[0u]) < int(_9._m0[1u]));
    _13._m0[3u] = uint(int(_9._m0[0u]) <= int(_9._m0[1u]));
    _13._m0[4u] = uint(int(_9._m0[0u]) > int(_9._m0[1u]));
    _13._m0[5u] = uint(int(_9._m0[0u]) >= int(_9._m0[1u]));
    _13._m0[6u] = uint(_9._m0[0u] < _9._m0[1u]);
    _13._m0[7u] = uint(_9._m0[0u] <= _9._m0[1u]);
    _13._m0[8u] = uint(_9._m0[0u] > _9._m0[1u]);
    _13._m0[9u] = uint(_9._m0[0u] >= _9._m0[1u]);
}


