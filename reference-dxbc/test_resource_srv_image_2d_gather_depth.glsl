GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec2 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;

void main()
{
    vec2 _51 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _52 = textureGather(sampler2DShadow(_8, _11), _51, DEPTH_REF);
    SV_TARGET.x = _52.x;
    SV_TARGET.y = _52.y;
    SV_TARGET.z = _52.z;
    SV_TARGET.w = _52.w;
    vec2 _65 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _68 = textureGatherOffset(sampler2DShadow(_8, _11), _65, DEPTH_REF, ivec2(-1, 0));
    SV_TARGET_1.x = _68.x;
    SV_TARGET_1.y = _68.y;
    SV_TARGET_1.z = _68.z;
    SV_TARGET_1.w = _68.w;
    vec2 _79 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _82 = textureGatherOffset(sampler2DShadow(_8, _11), _79, DEPTH_REF, ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))));
    SV_TARGET_2.x = _82.x;
    SV_TARGET_2.y = _82.y;
    SV_TARGET_2.z = _82.z;
    SV_TARGET_2.w = _82.w;
}


