GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _37
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _45
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0, r32f) uniform readonly image2D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out float SV_TARGET_1;

void main()
{
    uint _60;
    vec4 _61;
    _60 = sparseImageLoadARB(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), _61);
    SparseTexel _29 = SparseTexel(_60, _61);
    vec4 _32 = _29._m1;
    _37 _38 = _37(_32.x, _32.y, _32.z, _32.w, _29._m0);
    float _40 = _38._m0;
    float _41 = _38._m1;
    float _42 = _38._m2;
    float _43 = _38._m3;
    SV_TARGET.x = _40;
    SV_TARGET.y = _41;
    SV_TARGET.z = _42;
    SV_TARGET.w = _43;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_38._m4)));
}


