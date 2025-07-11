GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCubeArray _9[];
layout(set = 0, binding = 0) uniform samplerShadow _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    uint _33 = 0u * 16u;
    uint _36 = 0u * 4u;
    uint _43 = floatBitsToUint(_15._m0[(_33 + _36) >> 2u]);
    vec4 _63 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER);
    vec4 _64 = textureGather(nonuniformEXT(samplerCubeArrayShadow(_9[_43], _19[_43])), _63, DEPTH_REF);
    float _65 = _64.x;
    SV_TARGET.x = _65;
    SV_TARGET.y = _64.y;
    SV_TARGET.z = _64.z;
    SV_TARGET.w = _64.w;
}


