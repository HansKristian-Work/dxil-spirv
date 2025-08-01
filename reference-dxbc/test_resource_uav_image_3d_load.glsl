GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly image3D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _28 = imageLoad(_8, ivec3(uvec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)));
    SV_TARGET.x = _28.x;
    SV_TARGET.y = _28.y;
    SV_TARGET.z = _28.z;
    SV_TARGET.w = _28.w;
}


