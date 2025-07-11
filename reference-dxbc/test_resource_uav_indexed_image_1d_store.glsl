GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform writeonly image1D _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 2) noperspective in vec4 COLOR;

void main()
{
    uint _22 = 0u * 16u;
    uint _25 = 0u * 4u;
    imageStore(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_22 + _25) >> 2u]))], int(TEXCOORD.x), vec4(COLOR.x, COLOR.y, COLOR.z, COLOR.w));
}


