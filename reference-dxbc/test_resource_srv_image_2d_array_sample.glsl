GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform texture2DArray _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out vec4 SV_TARGET_5;
layout(location = 6) out vec4 SV_TARGET_6;
layout(location = 7) out vec4 SV_TARGET_7;

void main()
{
    vec4 _52 = texture(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    SV_TARGET.x = _52.x;
    SV_TARGET.y = _52.y;
    SV_TARGET.z = _52.z;
    SV_TARGET.w = _52.w;
    vec4 _69 = textureOffset(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    SV_TARGET_1.x = _69.x;
    SV_TARGET_1.y = _69.y;
    SV_TARGET_1.z = _69.z;
    SV_TARGET_1.w = _69.w;
    vec4 _82 = textureLod(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), textureQueryLod(sampler2DArray(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    SV_TARGET_2.x = _82.x;
    SV_TARGET_2.y = _82.y;
    SV_TARGET_2.z = _82.z;
    SV_TARGET_2.w = _82.w;
    vec4 _93 = texture(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_BIAS);
    SV_TARGET_3.x = _93.x;
    SV_TARGET_3.y = _93.y;
    SV_TARGET_3.z = _93.z;
    SV_TARGET_3.w = _93.w;
    vec4 _104 = textureClampARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), LOD_CLAMP);
    SV_TARGET_4.x = _104.x;
    SV_TARGET_4.y = _104.y;
    SV_TARGET_4.z = _104.z;
    SV_TARGET_4.w = _104.w;
    vec4 _115 = textureOffsetClampARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _115.x;
    SV_TARGET_5.y = _115.y;
    SV_TARGET_5.z = _115.z;
    SV_TARGET_5.w = _115.w;
    float _128 = dFdx(TEXCOORD_2.x);
    float _129 = dFdy(TEXCOORD_2.x);
    float _132 = dFdx(TEXCOORD_2.y);
    float _133 = dFdy(TEXCOORD_2.y);
    vec4 _136 = textureGrad(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_128, _132), vec2(_129, _133));
    SV_TARGET_6.x = _136.x;
    SV_TARGET_6.y = _136.y;
    SV_TARGET_6.z = _136.z;
    SV_TARGET_6.w = _136.w;
    vec4 _149 = textureGradOffset(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(_128, _132), vec2(_129, _133), ivec2(-1, 0));
    SV_TARGET_7.x = _149.x;
    SV_TARGET_7.y = _149.y;
    SV_TARGET_7.z = _149.z;
    SV_TARGET_7.w = _149.w;
}


