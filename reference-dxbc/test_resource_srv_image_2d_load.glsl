GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture2D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _27 = texelFetch(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u));
    SV_TARGET.x = _27.x;
    SV_TARGET.y = _27.y;
    SV_TARGET.z = _27.z;
    SV_TARGET.w = _27.w;
    vec4 _44 = texelFetchOffset(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u), ivec2(-1, 0));
    SV_TARGET_1.x = _44.x;
    SV_TARGET_1.y = _44.y;
    SV_TARGET_1.z = _44.z;
    SV_TARGET_1.w = _44.w;
}


