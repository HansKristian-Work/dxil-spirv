GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

struct _23
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform texture2DMSArray _8;

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uvec3 _18 = uvec3(textureSize(_8));
    uint _19 = _18.x;
    SV_TARGET.x = _19;
    SV_TARGET.y = _18.y;
    SV_TARGET_1 = _18.z;
    SV_TARGET_3 = uint(textureSamples(_8));
}


