GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture1D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _23 = texelFetch(_8, int(TEXCOORD.x), int(1u));
    SV_TARGET.x = _23.x;
    SV_TARGET.y = _23.y;
    SV_TARGET.z = _23.z;
    SV_TARGET.w = _23.w;
    vec4 _38 = texelFetchOffset(_8, int(TEXCOORD.x), int(1u), -1);
    SV_TARGET_1.x = _38.x;
    SV_TARGET_1.y = _38.y;
    SV_TARGET_1.z = _38.z;
    SV_TARGET_1.w = _38.w;
}


