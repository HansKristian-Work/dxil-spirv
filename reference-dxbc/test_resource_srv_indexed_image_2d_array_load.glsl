GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DArray _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    uint _23 = 0u * 16u;
    uint _26 = 0u * 4u;
    uint _33 = floatBitsToUint(_15._m0[(_23 + _26) >> 2u]);
    vec4 _45 = texelFetch(_9[nonuniformEXT(_33)], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), int(1u));
    float _47 = _45.x;
    SV_TARGET.x = _47;
    SV_TARGET.y = _45.y;
    SV_TARGET.z = _45.z;
    SV_TARGET.w = _45.w;
    vec4 _61 = texelFetchOffset(_9[nonuniformEXT(_33)], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), int(1u), ivec2(-1, 0));
    float _65 = _61.x;
    SV_TARGET_1.x = _65;
    SV_TARGET_1.y = _61.y;
    SV_TARGET_1.z = _61.z;
    SV_TARGET_1.w = _61.w;
}


