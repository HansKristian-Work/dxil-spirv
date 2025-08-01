GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

struct _21
{
    uvec2 _m0;
    uint _m1;
};

layout(set = 0, binding = 0) uniform texture2DMS _8;

layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uint SV_TARGET_1;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uvec2 _17 = uvec2(textureSize(_8));
    uint _18 = _17.x;
    SV_TARGET.x = _18;
    SV_TARGET.y = _17.y;
    SV_TARGET_1 = 1u;
    SV_TARGET_3 = uint(textureSamples(_8));
}


