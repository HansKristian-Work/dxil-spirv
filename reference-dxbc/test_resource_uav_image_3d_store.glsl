GLSL:
#version 460

layout(set = 0, binding = 0) uniform writeonly image3D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) noperspective in vec4 COLOR;

void main()
{
    imageStore(_8, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)), vec4(COLOR.x, COLOR.y, COLOR.z, COLOR.w));
}


