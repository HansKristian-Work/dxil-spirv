GLSL:
#version 460
layout(local_size_x = 32, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _12;

void main()
{
    uint _16 = imageAtomicAdd(_12, int(0u), 1u);
}


