GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

struct _37
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
    uint _19 = 0u * 16u;
    uint _22 = 0u * 4u;
    uvec2 _34 = uvec2(imageSize(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_19 + _22) >> 2u]))]));
    uint _35 = _34.x;
    uint _36 = _34.y;
    SV_TARGET = _35;
    SV_TARGET_1 = _36;
}


