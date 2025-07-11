GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCubeArray _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;

void main()
{
    uint _36 = 0u * 16u;
    uint _39 = 0u * 4u;
    uint _46 = floatBitsToUint(_15._m0[(_36 + _39) >> 2u]);
    vec4 _65 = textureGather(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER));
    SV_TARGET.x = _65.x;
    SV_TARGET.y = _65.y;
    SV_TARGET.z = _65.z;
    SV_TARGET.w = _65.w;
    vec4 _78 = textureGather(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(1u));
    SV_TARGET_1.x = _78.x;
    SV_TARGET_1.y = _78.y;
    SV_TARGET_1.z = _78.z;
    SV_TARGET_1.w = _78.w;
    vec4 _89 = textureGather(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(2u));
    SV_TARGET_2.x = _89.x;
    SV_TARGET_2.y = _89.y;
    SV_TARGET_2.z = _89.z;
    SV_TARGET_2.w = _89.w;
    vec4 _100 = textureGather(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(3u));
    SV_TARGET_3.x = _100.x;
    SV_TARGET_3.y = _100.y;
    SV_TARGET_3.z = _100.z;
    SV_TARGET_3.w = _100.w;
}


