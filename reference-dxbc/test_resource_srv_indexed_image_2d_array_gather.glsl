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
    uint _42 = floatBitsToUint(_15._m0[0u]);
    vec4 _69 = textureGather(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    SV_TARGET.x = _69.x;
    SV_TARGET.y = _69.y;
    SV_TARGET.z = _69.z;
    SV_TARGET.w = _69.w;
    vec4 _85 = textureGatherOffset(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    SV_TARGET_1.x = _85.x;
    SV_TARGET_1.y = _85.y;
    SV_TARGET_1.z = _85.z;
    SV_TARGET_1.w = _85.w;
    vec4 _97 = textureGather(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(1u));
    SV_TARGET_2.x = _97.x;
    SV_TARGET_2.y = _97.y;
    SV_TARGET_2.z = _97.z;
    SV_TARGET_2.w = _97.w;
    vec4 _108 = textureGather(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(2u));
    SV_TARGET_3.x = _108.x;
    SV_TARGET_3.y = _108.y;
    SV_TARGET_3.z = _108.z;
    SV_TARGET_3.w = _108.w;
    vec4 _119 = textureGather(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(3u));
    SV_TARGET_4.x = _119.x;
    SV_TARGET_4.y = _119.y;
    SV_TARGET_4.z = _119.z;
    SV_TARGET_4.w = _119.w;
    vec4 _132 = textureGatherOffset(nonuniformEXT(sampler2DArray(_9[_42], _19[_42])), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_5.x = _132.x;
    SV_TARGET_5.y = _132.y;
    SV_TARGET_5.z = _132.z;
    SV_TARGET_5.w = _132.w;
}


