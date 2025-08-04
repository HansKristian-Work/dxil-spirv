GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0, scalar) uniform _13_15
{
    float _m0[4];
} _15;

layout(set = 0, binding = 0) uniform textureCube _9[];
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

void main()
{
    uint _40 = floatBitsToUint(_15._m0[0u]);
    vec4 _65 = texture(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    SV_TARGET.x = _65.x;
    SV_TARGET.y = _65.y;
    SV_TARGET.z = _65.z;
    SV_TARGET.w = _65.w;
    vec4 _78 = textureLod(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_1.x = _78.x;
    SV_TARGET_1.y = _78.y;
    SV_TARGET_1.z = _78.z;
    SV_TARGET_1.w = _78.w;
    vec4 _89 = texture(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    SV_TARGET_2.x = _89.x;
    SV_TARGET_2.y = _89.y;
    SV_TARGET_2.z = _89.z;
    SV_TARGET_2.w = _89.w;
    vec4 _100 = textureClampARB(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    SV_TARGET_3.x = _100.x;
    SV_TARGET_3.y = _100.y;
    SV_TARGET_3.z = _100.z;
    SV_TARGET_3.w = _100.w;
    vec4 _125 = textureGrad(nonuniformEXT(samplerCube(_9[_40], _19[_40])), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(dFdx(TEXCOORD_2.x), dFdx(TEXCOORD_2.y), dFdx(TEXCOORD_2.z)), vec3(dFdy(TEXCOORD_2.x), dFdy(TEXCOORD_2.y), dFdy(TEXCOORD_2.z)));
    SV_TARGET_4.x = _125.x;
    SV_TARGET_4.y = _125.y;
    SV_TARGET_4.z = _125.z;
    SV_TARGET_4.w = _125.w;
}


