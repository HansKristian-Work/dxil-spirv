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
    uint _39 = floatBitsToUint(_15._m0[0u]);
    vec3 _67 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _68 = textureGather(nonuniformEXT(sampler2DArrayShadow(_9[_39], _19[_39])), _67, DEPTH_REF);
    SV_TARGET.x = _68.x;
    SV_TARGET.y = _68.y;
    SV_TARGET.z = _68.z;
    SV_TARGET.w = _68.w;
    vec3 _81 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _84 = textureGatherOffset(nonuniformEXT(sampler2DArrayShadow(_9[_39], _19[_39])), _81, DEPTH_REF, ivec2(-1, 0));
    SV_TARGET_1.x = _84.x;
    SV_TARGET_1.y = _84.y;
    SV_TARGET_1.z = _84.z;
    SV_TARGET_1.w = _84.w;
    vec3 _95 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _98 = textureGatherOffset(nonuniformEXT(sampler2DArrayShadow(_9[_39], _19[_39])), _95, DEPTH_REF, ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_2.x = _98.x;
    SV_TARGET_2.y = _98.y;
    SV_TARGET_2.z = _98.z;
    SV_TARGET_2.w = _98.w;
}


