GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCube _9[];
layout(set = 0, binding = 0) uniform samplerShadow _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    uint _37 = floatBitsToUint(_15._m0[0u]);
    vec3 _57 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _58 = textureGather(nonuniformEXT(samplerCubeShadow(_9[_37], _19[_37])), _57, DEPTH_REF);
    SV_TARGET.x = _58.x;
    SV_TARGET.y = _58.y;
    SV_TARGET.z = _58.z;
    SV_TARGET.w = _58.w;
}


