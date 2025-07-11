GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

struct _17
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform texture1D _8;

layout(location = 0) out uint SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 2) out uint SV_TARGET_2;

void main()
{
    SV_TARGET = uint(textureSize(_8, int(0u)));
    SV_TARGET_1 = 1u;
    SV_TARGET_2 = uint(textureQueryLevels(_8));
}


