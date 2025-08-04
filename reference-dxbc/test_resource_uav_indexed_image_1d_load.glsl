GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0, r32f) uniform readonly image1D _9[];

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _33 = imageLoad(_9[nonuniformEXT(floatBitsToUint(_15._m0[0u]))], int(TEXCOORD.x));
    SV_TARGET.x = _33.x;
    SV_TARGET.y = _33.y;
    SV_TARGET.z = _33.z;
    SV_TARGET.w = _33.w;
}


