GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 0, binding = 0) uniform samplerShadow _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec2 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;

void main()
{
    uint _35 = 0u * 16u;
    uint _38 = 0u * 4u;
    uint _45 = floatBitsToUint(_15._m0[(_35 + _38) >> 2u]);
    uint _63 = uint(OFFSET.x);
    uint _66 = uint(OFFSET.y);
    vec2 _72 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _73 = textureGather(nonuniformEXT(sampler2DShadow(_9[_45], _19[_45])), _72, DEPTH_REF);
    float _74 = _73.x;
    SV_TARGET.x = _74;
    SV_TARGET.y = _73.y;
    SV_TARGET.z = _73.z;
    SV_TARGET.w = _73.w;
    vec2 _85 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _88 = textureGatherOffset(nonuniformEXT(sampler2DShadow(_9[_45], _19[_45])), _85, DEPTH_REF, ivec2(-1, 0));
    float _90 = _88.x;
    SV_TARGET_1.x = _90;
    SV_TARGET_1.y = _88.y;
    SV_TARGET_1.z = _88.z;
    SV_TARGET_1.w = _88.w;
    vec2 _99 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _102 = textureGatherOffset(nonuniformEXT(sampler2DShadow(_9[_45], _19[_45])), _99, DEPTH_REF, ivec2(int(_63), int(_66)));
    float _104 = _102.x;
    SV_TARGET_2.x = _104;
    SV_TARGET_2.y = _102.y;
    SV_TARGET_2.z = _102.z;
    SV_TARGET_2.w = _102.w;
}


