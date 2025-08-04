GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

struct _31
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform readonly writeonly image1DArray _9[];

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uvec2 _28 = uvec2(imageSize(_9[nonuniformEXT(floatBitsToUint(_15._m0[0u]))]));
    SV_TARGET = _28.x;
    SV_TARGET_1 = _28.y;
}


