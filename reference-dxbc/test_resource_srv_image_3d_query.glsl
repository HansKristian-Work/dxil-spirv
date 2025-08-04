GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

struct _23
{
    uvec3 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform texture3D _8;

layout(location = 0) out uvec3 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 2) out uint SV_TARGET_2;

void main()
{
    uvec3 _17 = uvec3(textureSize(_8, int(0u)));
    uint _19 = _17.x;
    SV_TARGET.x = _19;
    SV_TARGET.y = _17.y;
    SV_TARGET.z = _17.z;
    SV_TARGET_1 = 1u;
    SV_TARGET_2 = uint(textureQueryLevels(_8));
}


