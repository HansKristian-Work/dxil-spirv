GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCubeArray _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec3 TEXCOORD_2;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;

void main()
{
    uint _36 = 0u * 16u;
    uint _39 = 0u * 4u;
    uint _46 = floatBitsToUint(_15._m0[(_36 + _39) >> 2u]);
    vec4 _71 = texture(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER));
    SV_TARGET.x = _71.x;
    SV_TARGET.y = _71.y;
    SV_TARGET.z = _71.z;
    SV_TARGET.w = _71.w;
    vec4 _84 = textureLod(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), textureQueryLod(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_1.x = _84.x;
    SV_TARGET_1.y = _84.y;
    SV_TARGET_1.z = _84.z;
    SV_TARGET_1.w = _84.w;
    vec4 _95 = texture(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), LOD_BIAS);
    SV_TARGET_2.x = _95.x;
    SV_TARGET_2.y = _95.y;
    SV_TARGET_2.z = _95.z;
    SV_TARGET_2.w = _95.w;
    vec4 _106 = textureClampARB(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), LOD_CLAMP);
    SV_TARGET_3.x = _106.x;
    SV_TARGET_3.y = _106.y;
    SV_TARGET_3.z = _106.z;
    SV_TARGET_3.w = _106.w;
    vec4 _131 = textureGrad(nonuniformEXT(samplerCubeArray(_9[_46], _19[_46])), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), vec3(dFdx(TEXCOORD_2.x), dFdx(TEXCOORD_2.y), dFdx(TEXCOORD_2.z)), vec3(dFdy(TEXCOORD_2.x), dFdy(TEXCOORD_2.y), dFdy(TEXCOORD_2.z)));
    SV_TARGET_4.x = _131.x;
    SV_TARGET_4.y = _131.y;
    SV_TARGET_4.z = _131.z;
    SV_TARGET_4.w = _131.w;
}


