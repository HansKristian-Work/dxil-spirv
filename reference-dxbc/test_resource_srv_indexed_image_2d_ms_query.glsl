GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

struct _40
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DMS _9[];

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uint _22 = 0u * 16u;
    uint _25 = 0u * 4u;
    uint _32 = floatBitsToUint(_15._m0[(_22 + _25) >> 2u]);
    uvec2 _36 = uvec2(textureSize(_9[nonuniformEXT(_32)]));
    uint _37 = _36.x;
    SV_TARGET.x = _37;
    SV_TARGET.y = _36.y;
    SV_TARGET_1 = 1u;
    SV_TARGET_3 = uint(textureSamples(_9[nonuniformEXT(_32)]));
}


