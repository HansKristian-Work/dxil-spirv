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
    SV_TARGET.x = _50.x;
    SV_TARGET.y = _50.y;
    SV_TARGET.z = _50.z;
    SV_TARGET.w = _50.w;
    vec4 _63 = textureLod(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), textureQueryLod(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_1.x = _63.x;
    SV_TARGET_1.y = _63.y;
    SV_TARGET_1.z = _63.z;
    SV_TARGET_1.w = _63.w;
    vec4 _74 = texture(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_BIAS);
    SV_TARGET_2.x = _74.x;
    SV_TARGET_2.y = _74.y;
    SV_TARGET_2.z = _74.z;
    SV_TARGET_2.w = _74.w;
    vec4 _85 = textureClampARB(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), LOD_CLAMP);
    SV_TARGET_3.x = _85.x;
    SV_TARGET_3.y = _85.y;
    SV_TARGET_3.z = _85.z;
    SV_TARGET_3.w = _85.w;
    vec4 _110 = textureGrad(samplerCube(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(dFdx(TEXCOORD_2.x), dFdx(TEXCOORD_2.y), dFdx(TEXCOORD_2.z)), vec3(dFdy(TEXCOORD_2.x), dFdy(TEXCOORD_2.y), dFdy(TEXCOORD_2.z)));
    SV_TARGET_4.x = _110.x;
    SV_TARGET_4.y = _110.y;
    SV_TARGET_4.z = _110.z;
    SV_TARGET_4.w = _110.w;
}


