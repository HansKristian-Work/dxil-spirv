GLSL:
#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _19 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), 16u);
}


