GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2DArray _8;
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
    vec4 _54 = textureGather(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER));
    SV_TARGET.x = _54.x;
    SV_TARGET.y = _54.y;
    SV_TARGET.z = _54.z;
    SV_TARGET.w = _54.w;
    vec4 _70 = textureGatherOffset(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0));
    SV_TARGET_1.x = _70.x;
    SV_TARGET_1.y = _70.y;
    SV_TARGET_1.z = _70.z;
    SV_TARGET_1.w = _70.w;
    vec4 _82 = textureGather(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(1u));
    SV_TARGET_2.x = _82.x;
    SV_TARGET_2.y = _82.y;
    SV_TARGET_2.z = _82.z;
    SV_TARGET_2.w = _82.w;
    vec4 _93 = textureGather(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(2u));
    SV_TARGET_3.x = _93.x;
    SV_TARGET_3.y = _93.y;
    SV_TARGET_3.z = _93.z;
    SV_TARGET_3.w = _93.w;
    vec4 _104 = textureGather(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), int(3u));
    SV_TARGET_4.x = _104.x;
    SV_TARGET_4.y = _104.y;
    SV_TARGET_4.z = _104.z;
    SV_TARGET_4.w = _104.w;
    vec4 _117 = textureGatherOffset(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_5.x = _117.x;
    SV_TARGET_5.y = _117.y;
    SV_TARGET_5.z = _117.z;
    SV_TARGET_5.w = _117.w;
}


