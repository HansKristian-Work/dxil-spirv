GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture1D _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    uint _23 = 0u * 16u;
    uint _26 = 0u * 4u;
    uint _33 = floatBitsToUint(_15._m0[(_23 + _26) >> 2u]);
    vec4 _41 = texelFetch(_9[nonuniformEXT(_33)], int(TEXCOORD.x), int(1u));
    float _42 = _41.x;
    SV_TARGET.x = _42;
    SV_TARGET.y = _41.y;
    SV_TARGET.z = _41.z;
    SV_TARGET.w = _41.w;
    vec4 _55 = texelFetchOffset(_9[nonuniformEXT(_33)], int(TEXCOORD.x), int(1u), -1);
    float _56 = _55.x;
    SV_TARGET_1.x = _56;
    SV_TARGET_1.y = _55.y;
    SV_TARGET_1.z = _55.z;
    SV_TARGET_1.w = _55.w;
}


