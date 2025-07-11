GLSL:
#version 460

layout(set = 0, binding = 0) uniform texture2DArray _8;
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
    uint _43 = uint(OFFSET.x);
    uint _46 = uint(OFFSET.y);
    vec3 _52 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _53 = textureGather(sampler2DArrayShadow(_8, _11), _52, DEPTH_REF);
    float _54 = _53.x;
    SV_TARGET.x = _54;
    SV_TARGET.y = _53.y;
    SV_TARGET.z = _53.z;
    SV_TARGET.w = _53.w;
    vec3 _66 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _69 = textureGatherOffset(sampler2DArrayShadow(_8, _11), _66, DEPTH_REF, ivec2(-1, 0));
    float _71 = _69.x;
    SV_TARGET_1.x = _71;
    SV_TARGET_1.y = _69.y;
    SV_TARGET_1.z = _69.z;
    SV_TARGET_1.w = _69.w;
    vec3 _80 = vec3(TEXCOORD.x, TEXCOORD.y, LAYER);
    vec4 _83 = textureGatherOffset(sampler2DArrayShadow(_8, _11), _80, DEPTH_REF, ivec2(int(_43), int(_46)));
    float _85 = _83.x;
    SV_TARGET_2.x = _85;
    SV_TARGET_2.y = _83.y;
    SV_TARGET_2.z = _83.z;
    SV_TARGET_2.w = _83.w;
}


