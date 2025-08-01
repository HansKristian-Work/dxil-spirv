GLSL:
#version 460

layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _8;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _22 = imageLoad(_8, int(BUFFER_ADDRESS.x));
    vec4 _29 = imageLoad(_8, int(7u));
    SV_TARGET.x = _22.x;
    SV_TARGET.y = _22.y;
    SV_TARGET.z = _22.z;
    SV_TARGET.w = _22.w;
    SV_TARGET_1.x = _29.x;
    SV_TARGET_1.y = _29.y;
    SV_TARGET_1.z = _29.z;
    SV_TARGET_1.w = _29.w;
}


