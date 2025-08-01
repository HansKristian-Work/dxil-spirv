GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0, r32f) uniform readonly image1DArray _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    uint _22 = 0u * 16u;
    uint _25 = 0u * 4u;
    vec4 _39 = imageLoad(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_22 + _25) >> 2u]))], ivec2(uvec2(TEXCOORD.x, 2u)));
    SV_TARGET.x = _39.x;
    SV_TARGET.y = _39.y;
    SV_TARGET.z = _39.z;
    SV_TARGET.w = _39.w;
}


