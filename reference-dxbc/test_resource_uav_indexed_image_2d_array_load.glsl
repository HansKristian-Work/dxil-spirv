GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0, r32f) uniform readonly image2DArray _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    uint _22 = 0u * 16u;
    uint _25 = 0u * 4u;
    vec4 _44 = imageLoad(_9[nonuniformEXT(floatBitsToUint(_15._m0[(_22 + _25) >> 2u]))], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)));
    SV_TARGET.x = _44.x;
    SV_TARGET.y = _44.y;
    SV_TARGET.z = _44.z;
    SV_TARGET.w = _44.w;
}


