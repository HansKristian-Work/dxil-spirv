GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform texture2DArray _9[];
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
    vec3 _73 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _74 = textureGather(nonuniformEXT(sampler2DArrayShadow(_9[_45], _19[_45])), _73, DEPTH_REF);
    SV_TARGET.x = _74.x;
    SV_TARGET.y = _74.y;
    SV_TARGET.z = _74.z;
    SV_TARGET.w = _74.w;
    vec3 _86 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _89 = textureGatherOffset(nonuniformEXT(sampler2DArrayShadow(_9[_45], _19[_45])), _86, DEPTH_REF, ivec2(-1, 0));
    SV_TARGET_1.x = _89.x;
    SV_TARGET_1.y = _89.y;
    SV_TARGET_1.z = _89.z;
    SV_TARGET_1.w = _89.w;
    vec3 _100 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _103 = textureGatherOffset(nonuniformEXT(sampler2DArrayShadow(_9[_45], _19[_45])), _100, DEPTH_REF, ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_2.x = _103.x;
    SV_TARGET_2.y = _103.y;
    SV_TARGET_2.z = _103.z;
    SV_TARGET_2.w = _103.w;
}


