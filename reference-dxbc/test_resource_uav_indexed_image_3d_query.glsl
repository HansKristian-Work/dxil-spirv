GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

struct _40
{
    uvec3 _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform readonly writeonly image3D _9[];

layout(location = 0) out uvec3 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;

void main()
{
    uint _21 = 0u * 16u;
    uint _24 = 0u * 4u;
    uvec3 _35 = uvec3(imageSize(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_21 + _24) >> 2u]))]));
    uint _36 = _35.x;
    SV_TARGET.x = _36;
    SV_TARGET.y = _35.y;
    SV_TARGET.z = _35.z;
    SV_TARGET_1 = 1u;
}


