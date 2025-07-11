GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCube _9[];
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
    vec4 _70 = texture(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    float _72 = _70.x;
    SV_TARGET.x = _72;
    SV_TARGET.y = _70.y;
    SV_TARGET.z = _70.z;
    SV_TARGET.w = _70.w;
    vec4 _83 = textureLod(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    float _85 = _83.x;
    SV_TARGET_1.x = _85;
    SV_TARGET_1.y = _83.y;
    SV_TARGET_1.z = _83.z;
    SV_TARGET_1.w = _83.w;
    vec4 _94 = texture(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    float _96 = _94.x;
    SV_TARGET_2.x = _96;
    SV_TARGET_2.y = _94.y;
    SV_TARGET_2.z = _94.z;
    SV_TARGET_2.w = _94.w;
    vec4 _105 = textureClampARB(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    float _107 = _105.x;
    SV_TARGET_3.x = _107;
    SV_TARGET_3.y = _105.y;
    SV_TARGET_3.z = _105.z;
    SV_TARGET_3.w = _105.w;
    float _118 = dFdx(TEXCOORD_2.x);
    float _119 = dFdy(TEXCOORD_2.x);
    float _122 = dFdx(TEXCOORD_2.y);
    float _123 = dFdy(TEXCOORD_2.y);
    float _126 = dFdx(TEXCOORD_2.z);
    float _127 = dFdy(TEXCOORD_2.z);
    vec4 _130 = textureGrad(nonuniformEXT(samplerCube(_9[_46], _19[_46])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_118, _122, _126), vec3(_119, _123, _127));
    float _134 = _130.x;
    SV_TARGET_4.x = _134;
    SV_TARGET_4.y = _130.y;
    SV_TARGET_4.z = _130.z;
    SV_TARGET_4.w = _130.w;
}


