GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32f) uniform readonly imageBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _27 = imageLoad(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x));
    vec4 _34 = imageLoad(_9[nonuniformEXT(BUFFER_INDEX)], int(7u));
    SV_TARGET.x = _27.x;
    SV_TARGET.y = _27.y;
    SV_TARGET.z = _27.z;
    SV_TARGET.w = _27.w;
    SV_TARGET_1.x = _34.x;
    SV_TARGET_1.y = _34.y;
    SV_TARGET_1.z = _34.z;
    SV_TARGET_1.w = _34.w;
}


