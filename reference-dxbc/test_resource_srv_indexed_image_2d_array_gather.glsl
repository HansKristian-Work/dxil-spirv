GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DArray _9[];
layout(set = 0, binding = 0) uniform sampler _19[];

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec2 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out vec4 SV_TARGET_5;

void main()
{
    uint _38 = 0u * 16u;
    uint _41 = 0u * 4u;
    uint _48 = floatBitsToUint(_15._m0[(_38 + _41) >> 2u]);
    uint _66 = uint(OFFSET.x);
    uint _69 = uint(OFFSET.y);
    vec4 _75 = textureGather(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    float _76 = _75.x;
    SV_TARGET.x = _76;
    SV_TARGET.y = _75.y;
    SV_TARGET.z = _75.z;
    SV_TARGET.w = _75.w;
    vec4 _90 = textureGatherOffset(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    float _92 = _90.x;
    SV_TARGET_1.x = _92;
    SV_TARGET_1.y = _90.y;
    SV_TARGET_1.z = _90.z;
    SV_TARGET_1.w = _90.w;
    vec4 _102 = textureGather(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(1u));
    float _103 = _102.x;
    SV_TARGET_2.x = _103;
    SV_TARGET_2.y = _102.y;
    SV_TARGET_2.z = _102.z;
    SV_TARGET_2.w = _102.w;
    vec4 _113 = textureGather(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(2u));
    float _114 = _113.x;
    SV_TARGET_3.x = _114;
    SV_TARGET_3.y = _113.y;
    SV_TARGET_3.z = _113.z;
    SV_TARGET_3.w = _113.w;
    vec4 _124 = textureGather(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(3u));
    float _125 = _124.x;
    SV_TARGET_4.x = _125;
    SV_TARGET_4.y = _124.y;
    SV_TARGET_4.z = _124.z;
    SV_TARGET_4.w = _124.w;
    vec4 _137 = textureGatherOffset(nonuniformEXT(sampler2DArray(_9[_48], _19[_48])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(int(_66), int(_69)));
    float _139 = _137.x;
    SV_TARGET_5.x = _139;
    SV_TARGET_5.y = _137.y;
    SV_TARGET_5.z = _137.z;
    SV_TARGET_5.w = _137.w;
}


