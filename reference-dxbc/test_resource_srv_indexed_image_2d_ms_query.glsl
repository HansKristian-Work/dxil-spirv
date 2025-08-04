GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

struct _34
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
    uint _26 = floatBitsToUint(_15._m0[0u]);
    uvec2 _30 = uvec2(textureSize(_9[nonuniformEXT(_26)]));
    uint _31 = _30.x;
    SV_TARGET.x = _31;
    SV_TARGET.y = _30.y;
    SV_TARGET_1 = 1u;
    SV_TARGET_3 = uint(textureSamples(_9[nonuniformEXT(_26)]));
}


