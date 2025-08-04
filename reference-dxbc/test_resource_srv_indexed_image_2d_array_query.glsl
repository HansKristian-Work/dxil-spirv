GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

struct _36
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DArray _9[];

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 2) out uint SV_TARGET_2;

void main()
{
    uint _26 = floatBitsToUint(_15._m0[0u]);
    uvec3 _31 = uvec3(textureSize(_9[nonuniformEXT(_26)], int(0u)));
    uint _32 = _31.x;
    SV_TARGET.x = _32;
    SV_TARGET.y = _31.y;
    SV_TARGET_1 = _31.z;
    SV_TARGET_2 = uint(textureQueryLevels(_9[nonuniformEXT(_26)]));
}


