GLSL:
#version 460

layout(set = 0, binding = 0) uniform writeonly image1D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) noperspective in vec4 COLOR;

void main()
{
    imageStore(_8, int(TEXCOORD.x), vec4(COLOR.x, COLOR.y, COLOR.z, COLOR.w));
}


