GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _11;

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
    uint _44 = uint(OFFSET.x);
    uint _47 = uint(OFFSET.y);
    vec4 _53 = textureGather(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y));
    float _54 = _53.x;
    SV_TARGET.x = _54;
    SV_TARGET.y = _53.y;
    SV_TARGET.z = _53.z;
    SV_TARGET.w = _53.w;
    vec4 _69 = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0));
    float _71 = _69.x;
    SV_TARGET_1.x = _71;
    SV_TARGET_1.y = _69.y;
    SV_TARGET_1.z = _69.z;
    SV_TARGET_1.w = _69.w;
    vec4 _81 = textureGather(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), int(1u));
    float _82 = _81.x;
    SV_TARGET_2.x = _82;
    SV_TARGET_2.y = _81.y;
    SV_TARGET_2.z = _81.z;
    SV_TARGET_2.w = _81.w;
    vec4 _92 = textureGather(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), int(2u));
    float _93 = _92.x;
    SV_TARGET_3.x = _93;
    SV_TARGET_3.y = _92.y;
    SV_TARGET_3.z = _92.z;
    SV_TARGET_3.w = _92.w;
    vec4 _103 = textureGather(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), int(3u));
    float _104 = _103.x;
    SV_TARGET_4.x = _104;
    SV_TARGET_4.y = _103.y;
    SV_TARGET_4.z = _103.z;
    SV_TARGET_4.w = _103.w;
    vec4 _116 = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(_44), int(_47)));
    float _118 = _116.x;
    SV_TARGET_5.x = _118;
    SV_TARGET_5.y = _116.y;
    SV_TARGET_5.z = _116.z;
    SV_TARGET_5.w = _116.w;
}


