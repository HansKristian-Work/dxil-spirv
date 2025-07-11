GLSL:
#version 460
#extension GL_EXT_samplerless_texture_functions : require

layout(set = 0, binding = 0) uniform texture2DMS _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;

void main()
{
    vec4 _29 = texelFetch(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(uint(gl_SampleID)));
    SV_TARGET.x = _29.x;
    SV_TARGET.y = _29.y;
    SV_TARGET.z = _29.z;
    SV_TARGET.w = _29.w;
    vec4 _46 = texelFetchOffset(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), ivec2(-1, 0), int(uint(gl_SampleID)));
    SV_TARGET_1.x = _46.x;
    SV_TARGET_1.y = _46.y;
    SV_TARGET_1.z = _46.z;
    SV_TARGET_1.w = _46.w;
}


