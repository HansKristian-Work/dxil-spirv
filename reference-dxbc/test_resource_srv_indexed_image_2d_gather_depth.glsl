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
    uint _39 = floatBitsToUint(_15._m0[0u]);
    vec2 _66 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _67 = textureGather(nonuniformEXT(sampler2DShadow(_9[_39], _19[_39])), _66, DEPTH_REF);
    SV_TARGET.x = _67.x;
    SV_TARGET.y = _67.y;
    SV_TARGET.z = _67.z;
    SV_TARGET.w = _67.w;
    vec2 _80 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _83 = textureGatherOffset(nonuniformEXT(sampler2DShadow(_9[_39], _19[_39])), _80, DEPTH_REF, ivec2(-1, 0));
    SV_TARGET_1.x = _83.x;
    SV_TARGET_1.y = _83.y;
    SV_TARGET_1.z = _83.z;
    SV_TARGET_1.w = _83.w;
    vec2 _94 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _97 = textureGatherOffset(nonuniformEXT(sampler2DShadow(_9[_39], _19[_39])), _94, DEPTH_REF, ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_2.x = _97.x;
    SV_TARGET_2.y = _97.y;
    SV_TARGET_2.z = _97.z;
    SV_TARGET_2.w = _97.w;
}


