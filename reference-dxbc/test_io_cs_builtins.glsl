GLSL:
#version 460
layout(local_size_x = 4, local_size_y = 4, local_size_z = 4) in;

layout(set = 0, binding = 0) uniform writeonly uimage3D _8;
layout(set = 0, binding = 1) uniform writeonly uimage3D _9;
layout(set = 0, binding = 2) uniform writeonly uimage3D _10;

void main()
{
    imageStore(_8, ivec3(uvec3(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y, gl_GlobalInvocationID.z)), uvec4(gl_LocalInvocationIndex));
    imageStore(_9, ivec3(uvec3(gl_WorkGroupID.x, gl_WorkGroupID.y, gl_WorkGroupID.z)), uvec4(gl_LocalInvocationIndex));
    imageStore(_10, ivec3(uvec3(gl_LocalInvocationID.x, gl_LocalInvocationID.y, gl_LocalInvocationID.z)), uvec4(gl_LocalInvocationIndex));
}


