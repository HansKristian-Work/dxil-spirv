GLSL:
#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[4096];
} _12;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    SV_TARGET.x = _12._m0[INDEX].x;
    SV_TARGET.y = _12._m0[INDEX].y;
    SV_TARGET.z = _12._m0[INDEX].z;
    SV_TARGET.w = _12._m0[INDEX].w;
}


