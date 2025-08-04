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
    uint _40 = floatBitsToUint(_15._m0[0u]);
    vec4 _60 = textureGather(nonuniformEXT(samplerCubeArray(_9[_40], _19[_40])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER));
    SV_TARGET.x = _60.x;
    SV_TARGET.y = _60.y;
    SV_TARGET.z = _60.z;
    SV_TARGET.w = _60.w;
    vec4 _73 = textureGather(nonuniformEXT(samplerCubeArray(_9[_40], _19[_40])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(1u));
    SV_TARGET_1.x = _73.x;
    SV_TARGET_1.y = _73.y;
    SV_TARGET_1.z = _73.z;
    SV_TARGET_1.w = _73.w;
    vec4 _84 = textureGather(nonuniformEXT(samplerCubeArray(_9[_40], _19[_40])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(2u));
    SV_TARGET_2.x = _84.x;
    SV_TARGET_2.y = _84.y;
    SV_TARGET_2.z = _84.z;
    SV_TARGET_2.w = _84.w;
    vec4 _95 = textureGather(nonuniformEXT(samplerCubeArray(_9[_40], _19[_40])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(3u));
    SV_TARGET_3.x = _95.x;
    SV_TARGET_3.y = _95.y;
    SV_TARGET_3.z = _95.z;
    SV_TARGET_3.w = _95.w;
}


