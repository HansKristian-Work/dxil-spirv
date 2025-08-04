GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly image2DArray _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _27 = imageLoad(_8, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, 2u)));
    SV_TARGET.x = _27.x;
    SV_TARGET.y = _27.y;
    SV_TARGET.z = _27.z;
    SV_TARGET.w = _27.w;
}


