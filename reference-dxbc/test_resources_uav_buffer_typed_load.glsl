GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _8;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _21 = imageLoad(_8, int(BUFFER_ADDRESS.x));
    SV_TARGET.x = _21.x;
    SV_TARGET.y = _21.y;
    SV_TARGET.z = _21.z;
    SV_TARGET.w = _21.w;
}


