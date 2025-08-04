GLSL:
#version 460

layout(set = 0, binding = 0) uniform textureCubeArray _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LAYER;
layout(location = 2) flat in ivec3 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out vec4 SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out vec4 SV_TARGET_3;

void main()
{
    vec4 _45 = textureGather(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER));
    SV_TARGET.x = _45.x;
    SV_TARGET.y = _45.y;
    SV_TARGET.z = _45.z;
    SV_TARGET.w = _45.w;
    vec4 _58 = textureGather(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(1u));
    SV_TARGET_1.x = _58.x;
    SV_TARGET_1.y = _58.y;
    SV_TARGET_1.z = _58.z;
    SV_TARGET_1.w = _58.w;
    vec4 _69 = textureGather(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(2u));
    SV_TARGET_2.x = _69.x;
    SV_TARGET_2.y = _69.y;
    SV_TARGET_2.z = _69.z;
    SV_TARGET_2.w = _69.w;
    vec4 _80 = textureGather(samplerCubeArray(_8, _11), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, LAYER), int(3u));
    SV_TARGET_3.x = _80.x;
    SV_TARGET_3.y = _80.y;
    SV_TARGET_3.z = _80.z;
    SV_TARGET_3.w = _80.w;
}


