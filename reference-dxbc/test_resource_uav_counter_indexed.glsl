GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
layout(local_size_x = 32, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _14[];

void main()
{
    uint _28 = imageAtomicAdd(_14[nonuniformEXT(gl_WorkGroupID.x)], int(0u), 1u);
}


