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
    uint _39 = 0u * 16u;
    uint _42 = 0u * 4u;
    uint _49 = floatBitsToUint(_15._m0[(_39 + _42) >> 2u]);
    vec4 _73 = texture(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _73.x;
    SV_TARGET.y = _73.y;
    SV_TARGET.z = _73.z;
    SV_TARGET.w = _73.w;
    vec4 _90 = textureOffset(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1));
    SV_TARGET_1.x = _90.x;
    SV_TARGET_1.y = _90.y;
    SV_TARGET_1.z = _90.z;
    SV_TARGET_1.w = _90.w;
    vec4 _103 = textureLod(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_2.x = _103.x;
    SV_TARGET_2.y = _103.y;
    SV_TARGET_2.z = _103.z;
    SV_TARGET_2.w = _103.w;
    vec4 _114 = texture(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    SV_TARGET_3.x = _114.x;
    SV_TARGET_3.y = _114.y;
    SV_TARGET_3.z = _114.z;
    SV_TARGET_3.w = _114.w;
    vec4 _125 = textureClampARB(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    SV_TARGET_4.x = _125.x;
    SV_TARGET_4.y = _125.y;
    SV_TARGET_4.z = _125.z;
    SV_TARGET_4.w = _125.w;
    vec4 _136 = textureOffsetClampARB(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-1, 0, 1), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _136.x;
    SV_TARGET_5.y = _136.y;
    SV_TARGET_5.z = _136.z;
    SV_TARGET_5.w = _136.w;
    float _149 = dFdx(TEXCOORD_2.x);
    float _150 = dFdy(TEXCOORD_2.x);
    float _153 = dFdx(TEXCOORD_2.y);
    float _154 = dFdy(TEXCOORD_2.y);
    float _157 = dFdx(TEXCOORD_2.z);
    float _158 = dFdy(TEXCOORD_2.z);
    vec4 _161 = textureGrad(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_149, _153, _157), vec3(_150, _154, _158));
    SV_TARGET_6.x = _161.x;
    SV_TARGET_6.y = _161.y;
    SV_TARGET_6.z = _161.z;
    SV_TARGET_6.w = _161.w;
    vec4 _174 = textureGradOffset(nonuniformEXT(sampler3D(_9[_49], _19[_49])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_149, _153, _157), vec3(_150, _154, _158), ivec3(-1, 0, 1));
    SV_TARGET_7.x = _174.x;
    SV_TARGET_7.y = _174.y;
    SV_TARGET_7.z = _174.z;
    SV_TARGET_7.w = _174.w;
}


