GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform samplerBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _26 = texelFetch(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x));
    SV_TARGET.x = _26.x;
    SV_TARGET.y = _26.y;
    SV_TARGET.z = _26.z;
    SV_TARGET.w = _26.w;
}


