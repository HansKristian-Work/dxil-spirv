GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

struct _35
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform readonly writeonly image2DArray _9[];

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uvec3 _30 = uvec3(imageSize(_9[nonuniformEXT(floatBitsToUint(_15._m0[0u]))]));
    uint _31 = _30.x;
    SV_TARGET.x = _31;
    SV_TARGET.y = _30.y;
    SV_TARGET_1 = _30.z;
}


