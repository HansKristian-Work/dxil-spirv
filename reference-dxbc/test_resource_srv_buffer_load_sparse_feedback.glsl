GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _25
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _33
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0) uniform samplerBuffer _8;

layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out float SV_TARGET_1;

void main()
{
    uint _50;
    vec4 _51;
    _50 = sparseTexelFetchARB(_8, int(12345u), _51);
    SparseTexel _18 = SparseTexel(_50, _51);
    vec4 _20 = _18._m1;
    _25 _26 = _25(_20.x, _20.y, _20.z, _20.w, _18._m0);
    float _28 = _26._m0;
    float _29 = _26._m1;
    float _30 = _26._m2;
    float _31 = _26._m3;
    SV_TARGET.x = _28;
    SV_TARGET.y = _29;
    SV_TARGET.z = _30;
    SV_TARGET.w = _31;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_26._m4)));
}


