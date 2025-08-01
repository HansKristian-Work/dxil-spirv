GLSL:
#version 460
#extension GL_ARB_sparse_texture_clamp : require

layout(set = 0, binding = 0) uniform texture2D _8;
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
    vec4 _51 = texture(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y));
    SV_TARGET.x = _51.x;
    SV_TARGET.y = _51.y;
    SV_TARGET.z = _51.z;
    SV_TARGET.w = _51.w;
    vec4 _68 = textureOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    SV_TARGET_1.x = _68.x;
    SV_TARGET_1.y = _68.y;
    SV_TARGET_1.z = _68.z;
    SV_TARGET_1.w = _68.w;
    vec4 _81 = textureLod(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), textureQueryLod(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y)).x);
    SV_TARGET_2.x = _81.x;
    SV_TARGET_2.y = _81.y;
    SV_TARGET_2.z = _81.z;
    SV_TARGET_2.w = _81.w;
    vec4 _92 = texture(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), LOD_BIAS);
    SV_TARGET_3.x = _92.x;
    SV_TARGET_3.y = _92.y;
    SV_TARGET_3.z = _92.z;
    SV_TARGET_3.w = _92.w;
    vec4 _103 = textureClampARB(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), LOD_CLAMP);
    SV_TARGET_4.x = _103.x;
    SV_TARGET_4.y = _103.y;
    SV_TARGET_4.z = _103.z;
    SV_TARGET_4.w = _103.w;
    vec4 _114 = textureOffsetClampARB(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0), LOD_CLAMP, LOD_BIAS);
    SV_TARGET_5.x = _114.x;
    SV_TARGET_5.y = _114.y;
    SV_TARGET_5.z = _114.z;
    SV_TARGET_5.w = _114.w;
    float _127 = dFdx(TEXCOORD_2.x);
    float _128 = dFdy(TEXCOORD_2.x);
    float _131 = dFdx(TEXCOORD_2.y);
    float _132 = dFdy(TEXCOORD_2.y);
    vec4 _135 = textureGrad(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_127, _131), vec2(_128, _132));
    SV_TARGET_6.x = _135.x;
    SV_TARGET_6.y = _135.y;
    SV_TARGET_6.z = _135.z;
    SV_TARGET_6.w = _135.w;
    vec4 _148 = textureGradOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), vec2(_127, _131), vec2(_128, _132), ivec2(-1, 0));
    SV_TARGET_7.x = _148.x;
    SV_TARGET_7.y = _148.y;
    SV_TARGET_7.z = _148.z;
    SV_TARGET_7.w = _148.w;
}


