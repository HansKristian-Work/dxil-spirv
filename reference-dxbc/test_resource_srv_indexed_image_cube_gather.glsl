GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCube _9[];
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
    vec4 _64 = textureGather(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    float _65 = _64.x;
    SV_TARGET.x = _65;
    SV_TARGET.y = _64.y;
    SV_TARGET.z = _64.z;
    SV_TARGET.w = _64.w;
    vec4 _77 = textureGather(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(1u));
    float _78 = _77.x;
    SV_TARGET_1.x = _78;
    SV_TARGET_1.y = _77.y;
    SV_TARGET_1.z = _77.z;
    SV_TARGET_1.w = _77.w;
    vec4 _88 = textureGather(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(2u));
    float _89 = _88.x;
    SV_TARGET_2.x = _89;
    SV_TARGET_2.y = _88.y;
    SV_TARGET_2.z = _88.z;
    SV_TARGET_2.w = _88.w;
    vec4 _99 = textureGather(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(3u));
    float _100 = _99.x;
    SV_TARGET_3.x = _100;
    SV_TARGET_3.y = _99.y;
    SV_TARGET_3.z = _99.z;
    SV_TARGET_3.w = _99.w;
}


