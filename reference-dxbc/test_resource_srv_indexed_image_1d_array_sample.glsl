GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture1DArray _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in float TEXCOORD_2;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out vec4 SV_TARGET_5;
layout(location = 6) out vec4 SV_TARGET_6;
layout(location = 7) out vec4 SV_TARGET_7;

void main()
{
    uint _43 = floatBitsToUint(_15._m0[0u]);
    vec4 _61 = texture(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER));
    SV_TARGET.x = _61.x;
    SV_TARGET.y = _61.y;
    SV_TARGET.z = _61.z;
    SV_TARGET.w = _61.w;
    vec4 _78 = textureOffset(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), -1);
    SV_TARGET_1.x = _78.x;
    SV_TARGET_1.y = _78.y;
    SV_TARGET_1.z = _78.z;
    SV_TARGET_1.w = _78.w;
    vec4 _89 = textureLod(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), textureQueryLod(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), TEXCOORD.x).x);
    SV_TARGET_2.x = _89.x;
    SV_TARGET_2.y = _89.y;
    SV_TARGET_2.z = _89.z;
    SV_TARGET_2.w = _89.w;
    vec4 _100 = texture(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), LOD_BIAS);
    SV_TARGET_3.x = _100.x;
    SV_TARGET_3.y = _100.y;
    SV_TARGET_3.z = _100.z;
    SV_TARGET_3.w = _100.w;
    vec4 _111 = textureClampARB(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), LOD_CLAMP);
    SV_TARGET_4.x = _111.x;
    SV_TARGET_4.y = _111.y;
    SV_TARGET_4.z = _111.z;
    SV_TARGET_4.w = _111.w;
    vec4 _122 = textureOffsetClampARB(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), -1, LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _122.x;
    SV_TARGET_5.y = _122.y;
    SV_TARGET_5.z = _122.z;
    SV_TARGET_5.w = _122.w;
    float _134 = dFdx(TEXCOORD_2);
    float _135 = dFdy(TEXCOORD_2);
    vec4 _136 = textureGrad(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), _134, _135);
    SV_TARGET_6.x = _136.x;
    SV_TARGET_6.y = _136.y;
    SV_TARGET_6.z = _136.z;
    SV_TARGET_6.w = _136.w;
    vec4 _147 = textureGradOffset(nonuniformEXT(sampler1DArray(_9[_43], _19[_43])), vec2(TEXCOORD.x, LAYER), _134, _135, -1);
    SV_TARGET_7.x = _147.x;
    SV_TARGET_7.y = _147.y;
    SV_TARGET_7.z = _147.z;
    SV_TARGET_7.w = _147.w;
}


