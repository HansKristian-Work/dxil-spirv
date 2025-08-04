GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
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
    uint _45 = floatBitsToUint(_15._m0[0u]);
    vec4 _66 = texture(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y));
    SV_TARGET.x = _66.x;
    SV_TARGET.y = _66.y;
    SV_TARGET.z = _66.z;
    SV_TARGET.w = _66.w;
    vec4 _83 = textureOffset(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    SV_TARGET_1.x = _83.x;
    SV_TARGET_1.y = _83.y;
    SV_TARGET_1.z = _83.z;
    SV_TARGET_1.w = _83.w;
    vec4 _96 = textureLod(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), textureQueryLod(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    SV_TARGET_2.x = _96.x;
    SV_TARGET_2.y = _96.y;
    SV_TARGET_2.z = _96.z;
    SV_TARGET_2.w = _96.w;
    vec4 _107 = texture(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), LOD_BIAS);
    SV_TARGET_3.x = _107.x;
    SV_TARGET_3.y = _107.y;
    SV_TARGET_3.z = _107.z;
    SV_TARGET_3.w = _107.w;
    vec4 _118 = textureClampARB(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), LOD_CLAMP);
    SV_TARGET_4.x = _118.x;
    SV_TARGET_4.y = _118.y;
    SV_TARGET_4.z = _118.z;
    SV_TARGET_4.w = _118.w;
    vec4 _129 = textureOffsetClampARB(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _129.x;
    SV_TARGET_5.y = _129.y;
    SV_TARGET_5.z = _129.z;
    SV_TARGET_5.w = _129.w;
    float _142 = dFdx(TEXCOORD_2.x);
    float _143 = dFdy(TEXCOORD_2.x);
    float _146 = dFdx(TEXCOORD_2.y);
    float _147 = dFdy(TEXCOORD_2.y);
    vec4 _150 = textureGrad(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_142, _146), vec2(_143, _147));
    SV_TARGET_6.x = _150.x;
    SV_TARGET_6.y = _150.y;
    SV_TARGET_6.z = _150.z;
    SV_TARGET_6.w = _150.w;
    vec4 _163 = textureGradOffset(nonuniformEXT(sampler2D(_9[_45], _19[_45])), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_142, _146), vec2(_143, _147), ivec2(-1, 0));
    SV_TARGET_7.x = _163.x;
    SV_TARGET_7.y = _163.y;
    SV_TARGET_7.z = _163.z;
    SV_TARGET_7.w = _163.w;
}


