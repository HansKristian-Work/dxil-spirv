GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

struct _35
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture1D _9[];

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 2) out uint SV_TARGET_2;

void main()
{
    uint _20 = 0u * 16u;
    uint _23 = 0u * 4u;
    uint _30 = floatBitsToUint(_15._m0[(_20 + _23) >> 2u]);
    SV_TARGET = uint(textureSize(_9[nonuniformEXT(_30)], int(0u)));
    SV_TARGET_1 = 1u;
    SV_TARGET_2 = uint(textureQueryLevels(_9[nonuniformEXT(_30)]));
}


