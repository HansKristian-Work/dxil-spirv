GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture1DArray _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _24 = texelFetch(_8, ivec2(uvec2(TEXCOORD.x, 2u)), int(1u));
    SV_TARGET.x = _24.x;
    SV_TARGET.y = _24.y;
    SV_TARGET.z = _24.z;
    SV_TARGET.w = _24.w;
    vec4 _40 = texelFetchOffset(_8, ivec2(uvec2(TEXCOORD.x, 2u)), int(1u), -1);
    SV_TARGET_1.x = _40.x;
    SV_TARGET_1.y = _40.y;
    SV_TARGET_1.z = _40.z;
    SV_TARGET_1.w = _40.w;
}


