GLSL:
#version 460
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 1, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

shared uint _20[1];

void main()
{
    uint _32 = atomicAdd(_20[0u], _9._m0[gl_GlobalInvocationID.x]);
    _13._m0[gl_GlobalInvocationID.x] = _32;
}


