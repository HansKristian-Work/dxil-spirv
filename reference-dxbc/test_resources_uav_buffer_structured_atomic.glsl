GLSL:
#version 460

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _28 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + (BUFFER_ADDRESS.y >> 2u)], 16u);
}


