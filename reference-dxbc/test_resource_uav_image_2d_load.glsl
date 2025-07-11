GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly image2D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _26 = imageLoad(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)));
    SV_TARGET.x = _26.x;
    SV_TARGET.y = _26.y;
    SV_TARGET.z = _26.z;
    SV_TARGET.w = _26.w;
}


