GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DMS _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    uint _25 = 0u * 16u;
    uint _28 = 0u * 4u;
    uint _35 = floatBitsToUint(_15._m0[(_25 + _28) >> 2u]);
    vec4 _47 = texelFetch(_9[nonuniformEXT(_35)], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(uint(gl_SampleID)));
    SV_TARGET.x = _47.x;
    SV_TARGET.y = _47.y;
    SV_TARGET.z = _47.z;
    SV_TARGET.w = _47.w;
    vec4 _63 = texelFetchOffset(_9[nonuniformEXT(_35)], ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), ivec2(-1, 0), int(uint(gl_SampleID)));
    SV_TARGET_1.x = _63.x;
    SV_TARGET_1.y = _63.y;
    SV_TARGET_1.z = _63.z;
    SV_TARGET_1.w = _63.w;
}


