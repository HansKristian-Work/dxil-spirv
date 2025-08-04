GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture3D _9[];
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
layout(location = 5) out vec4 SV_TARGET_5;
layout(location = 6) out vec4 SV_TARGET_6;
layout(location = 7) out vec4 SV_TARGET_7;

void main()
{
    uint _43 = floatBitsToUint(_15._m0[0u]);
    vec4 _68 = texture(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _68.x;
    SV_TARGET.y = _68.y;
    SV_TARGET.z = _68.z;
    SV_TARGET.w = _68.w;
    vec4 _85 = textureOffset(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1));
    SV_TARGET_1.x = _85.x;
    SV_TARGET_1.y = _85.y;
    SV_TARGET_1.z = _85.z;
    SV_TARGET_1.w = _85.w;
    vec4 _98 = textureLod(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_2.x = _98.x;
    SV_TARGET_2.y = _98.y;
    SV_TARGET_2.z = _98.z;
    SV_TARGET_2.w = _98.w;
    vec4 _109 = texture(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    SV_TARGET_3.x = _109.x;
    SV_TARGET_3.y = _109.y;
    SV_TARGET_3.z = _109.z;
    SV_TARGET_3.w = _109.w;
    vec4 _120 = textureClampARB(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    SV_TARGET_4.x = _120.x;
    SV_TARGET_4.y = _120.y;
    SV_TARGET_4.z = _120.z;
    SV_TARGET_4.w = _120.w;
    vec4 _131 = textureOffsetClampARB(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _131.x;
    SV_TARGET_5.y = _131.y;
    SV_TARGET_5.z = _131.z;
    SV_TARGET_5.w = _131.w;
    float _144 = dFdx(TEXCOORD_2.x);
    float _145 = dFdy(TEXCOORD_2.x);
    float _148 = dFdx(TEXCOORD_2.y);
    float _149 = dFdy(TEXCOORD_2.y);
    float _152 = dFdx(TEXCOORD_2.z);
    float _153 = dFdy(TEXCOORD_2.z);
    vec4 _156 = textureGrad(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_144, _148, _152), vec3(_145, _149, _153));
    SV_TARGET_6.x = _156.x;
    SV_TARGET_6.y = _156.y;
    SV_TARGET_6.z = _156.z;
    SV_TARGET_6.w = _156.w;
    vec4 _169 = textureGradOffset(nonuniformEXT(sampler3D(_9[_43], _19[_43])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_144, _148, _152), vec3(_145, _149, _153), ivec3(-1, 0, 1));
    SV_TARGET_7.x = _169.x;
    SV_TARGET_7.y = _169.y;
    SV_TARGET_7.z = _169.z;
    SV_TARGET_7.w = _169.w;
}


