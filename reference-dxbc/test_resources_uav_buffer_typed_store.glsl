GLSL:
#version 460

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    imageStore(_8, int(BUFFER_ADDRESS.x), vec4(1.0, 2.0, 3.0, 4.0));
    imageStore(_8, int(7u), vec4(1.0, 2.0, 3.0, 4.0));
}


