GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

struct _34
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform readonly writeonly image1D _9[];

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uint _19 = 0u * 16u;
    uint _22 = 0u * 4u;
    uint _33 = uint(imageSize(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_19 + _22) >> 2u]))]));
    SV_TARGET = _33;
    SV_TARGET_1 = 1u;
}


