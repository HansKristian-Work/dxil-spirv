GLSL:
#version 460
layout(early_fragment_tests) in;

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uint INDEX;

void main()
{
    uint _18 = atomicOr(_9._m0[INDEX], 1u);
}


