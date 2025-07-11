GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

struct _42
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
    uint _22 = 0u * 16u;
    uint _25 = 0u * 4u;
    uint _32 = floatBitsToUint(_15._m0[(_22 + _25) >> 2u]);
    uvec3 _37 = uvec3(textureSize(_9[nonuniformEXT(_32)], int(0u)));
    uint _38 = _37.x;
    uint _41 = _37.z;
    SV_TARGET.x = _38;
    SV_TARGET.y = _37.y;
    SV_TARGET_1 = _41;
    SV_TARGET_2 = uint(textureQueryLevels(_9[nonuniformEXT(_32)]));
}


