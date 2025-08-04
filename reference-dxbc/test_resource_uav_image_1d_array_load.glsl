GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly image1DArray _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _22 = imageLoad(_8, ivec2(uvec2(TEXCOORD.x, 2u)));
    SV_TARGET.x = _22.x;
    SV_TARGET.y = _22.y;
    SV_TARGET.z = _22.z;
    SV_TARGET.w = _22.w;
}


