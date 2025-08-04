GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DMSArray _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    uint _29 = floatBitsToUint(_15._m0[0u]);
    vec4 _42 = texelFetch(_9[nonuniformEXT(_29)], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), int(uint(gl_SampleID)));
    SV_TARGET.x = _42.x;
    SV_TARGET.y = _42.y;
    SV_TARGET.z = _42.z;
    SV_TARGET.w = _42.w;
    vec4 _58 = texelFetchOffset(_9[nonuniformEXT(_29)], ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)), ivec2(-1, 0), int(uint(gl_SampleID)));
    SV_TARGET_1.x = _58.x;
    SV_TARGET_1.y = _58.y;
    SV_TARGET_1.z = _58.z;
    SV_TARGET_1.w = _58.w;
}


