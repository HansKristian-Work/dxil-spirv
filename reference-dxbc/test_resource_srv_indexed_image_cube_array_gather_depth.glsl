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
    uint _37 = floatBitsToUint(_15._m0[0u]);
    vec4 _58 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER);
    vec4 _59 = textureGather(nonuniformEXT(samplerCubeArrayShadow(_9[_37], _19[_37])), _58, DEPTH_REF);
    SV_TARGET.x = _59.x;
    SV_TARGET.y = _59.y;
    SV_TARGET.z = _59.z;
    SV_TARGET.w = _59.w;
}


