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
    uint _40 = floatBitsToUint(_15._m0[0u]);
    vec4 _59 = textureGather(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _59.x;
    SV_TARGET.y = _59.y;
    SV_TARGET.z = _59.z;
    SV_TARGET.w = _59.w;
    vec4 _72 = textureGather(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(1u));
    SV_TARGET_1.x = _72.x;
    SV_TARGET_1.y = _72.y;
    SV_TARGET_1.z = _72.z;
    SV_TARGET_1.w = _72.w;
    vec4 _83 = textureGather(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(2u));
    SV_TARGET_2.x = _83.x;
    SV_TARGET_2.y = _83.y;
    SV_TARGET_2.z = _83.z;
    SV_TARGET_2.w = _83.w;
    vec4 _94 = textureGather(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(3u));
    SV_TARGET_3.x = _94.x;
    SV_TARGET_3.y = _94.y;
    SV_TARGET_3.z = _94.z;
    SV_TARGET_3.w = _94.w;
}


