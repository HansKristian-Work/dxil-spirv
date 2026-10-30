GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _55
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _59
{
    uint _m0;
    float _m1;
};

layout(set = 0, binding = 0) uniform texture2DArray _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out float SV_TARGET_1;
layout(location = 2) out float SV_TARGET_2;
layout(location = 3) out float SV_TARGET_3;

void main()
{
    uint _80;
    vec4 _81;
    _80 = sparseTextureARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), _81);
    SparseTexel _47 = SparseTexel(_80, _81);
    vec4 _50 = _47._m1;
    _55 _56 = _55(_50.x, _50.y, _50.z, _50.w, _47._m0);
    SV_TARGET = _56._m0;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_56._m4)));
    uint _82;
    vec4 _83;
    _82 = sparseTextureLodARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), 0.0, _83);
    SparseTexel _65 = SparseTexel(_82, _83);
    vec4 _68 = _65._m1;
    _55 _73 = _55(_68.x, _68.y, _68.z, _68.w, _65._m0);
    SV_TARGET_2 = _73._m0;
    SV_TARGET_3 = float(sparseTexelsResidentARB(int(_73._m4)));
}


