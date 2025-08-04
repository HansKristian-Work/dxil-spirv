GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform textureCubeArray _8;
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
    vec4 _51 = texture(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER));
    SV_TARGET.x = _51.x;
    SV_TARGET.y = _51.y;
    SV_TARGET.z = _51.z;
    SV_TARGET.w = _51.w;
    vec4 _64 = textureLod(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), textureQueryLod(samplerCubeArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x);
    SV_TARGET_1.x = _64.x;
    SV_TARGET_1.y = _64.y;
    SV_TARGET_1.z = _64.z;
    SV_TARGET_1.w = _64.w;
    vec4 _75 = texture(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), LOD_BIAS);
    SV_TARGET_2.x = _75.x;
    SV_TARGET_2.y = _75.y;
    SV_TARGET_2.z = _75.z;
    SV_TARGET_2.w = _75.w;
    vec4 _86 = textureClampARB(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), LOD_CLAMP);
    SV_TARGET_3.x = _86.x;
    SV_TARGET_3.y = _86.y;
    SV_TARGET_3.z = _86.z;
    SV_TARGET_3.w = _86.w;
    vec4 _111 = textureGrad(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), vec3(dFdx(TEXCOORD_2.x), dFdx(TEXCOORD_2.y), dFdx(TEXCOORD_2.z)), vec3(dFdy(TEXCOORD_2.x), dFdy(TEXCOORD_2.y), dFdy(TEXCOORD_2.z)));
    SV_TARGET_4.x = _111.x;
    SV_TARGET_4.y = _111.y;
    SV_TARGET_4.z = _111.z;
    SV_TARGET_4.w = _111.w;
}


