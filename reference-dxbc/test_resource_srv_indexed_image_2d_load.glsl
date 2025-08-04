GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2D _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    uint _27 = floatBitsToUint(_15._m0[0u]);
    vec4 _39 = texelFetch(_9[nonuniformEXT(_27)], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u));
    SV_TARGET.x = _39.x;
    SV_TARGET.y = _39.y;
    SV_TARGET.z = _39.z;
    SV_TARGET.w = _39.w;
    vec4 _56 = texelFetchOffset(_9[nonuniformEXT(_27)], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u), ivec2(-1, 0));
    SV_TARGET_1.x = _56.x;
    SV_TARGET_1.y = _56.y;
    SV_TARGET_1.z = _56.z;
    SV_TARGET_1.w = _56.w;
}


