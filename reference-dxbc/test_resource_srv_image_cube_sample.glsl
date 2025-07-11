GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform textureCube _8;
layout(set = 0, binding = 0) uniform sampler _11;

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
    vec4 _50 = texture(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    float _52 = _50.x;
    SV_TARGET.x = _52;
    SV_TARGET.y = _50.y;
    SV_TARGET.z = _50.z;
    SV_TARGET.w = _50.w;
    vec4 _63 = textureLod(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    float _65 = _63.x;
    SV_TARGET_1.x = _65;
    SV_TARGET_1.y = _63.y;
    SV_TARGET_1.z = _63.z;
    SV_TARGET_1.w = _63.w;
    vec4 _74 = texture(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    float _76 = _74.x;
    SV_TARGET_2.x = _76;
    SV_TARGET_2.y = _74.y;
    SV_TARGET_2.z = _74.z;
    SV_TARGET_2.w = _74.w;
    vec4 _85 = textureClampARB(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    float _87 = _85.x;
    SV_TARGET_3.x = _87;
    SV_TARGET_3.y = _85.y;
    SV_TARGET_3.z = _85.z;
    SV_TARGET_3.w = _85.w;
    float _98 = dFdx(TEXCOORD_2.x);
    float _99 = dFdy(TEXCOORD_2.x);
    float _102 = dFdx(TEXCOORD_2.y);
    float _103 = dFdy(TEXCOORD_2.y);
    float _106 = dFdx(TEXCOORD_2.z);
    float _107 = dFdy(TEXCOORD_2.z);
    vec4 _110 = textureGrad(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(_98, _102, _106), vec3(_99, _103, _107));
    float _114 = _110.x;
    SV_TARGET_4.x = _114;
    SV_TARGET_4.y = _110.y;
    SV_TARGET_4.z = _110.z;
    SV_TARGET_4.w = _110.w;
}


