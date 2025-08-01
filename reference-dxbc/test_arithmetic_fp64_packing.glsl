GLSL:
#version 460
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 0, std430) writeonly buffer _12_14
{
    uvec2 _m0[];
} _14;

void main()
{
    _14._m0[0u] = uvec2((uvec2(_10._m0[0u])) + (uvec2(_10._m0[1u])));
}


