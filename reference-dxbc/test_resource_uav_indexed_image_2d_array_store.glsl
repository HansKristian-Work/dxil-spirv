GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform writeonly image2DArray _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) noperspective in vec4 COLOR;

void main()
{
    imageStore(_9[nonuniformEXT(floatBitsToUint(_15._m0[0u]))], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), vec4(COLOR.x, COLOR.y, COLOR.z, COLOR.w));
}


