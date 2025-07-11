GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_EXT_samplerless_texture_functions : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _39
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _47
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0) uniform texture2D _8;

layout(location = 0) flat in uvec3 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out float SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out float SV_TARGET_3;

void main()
{
    uint _89;
    vec4 _90;
    _89 = sparseTexelFetchARB(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u), _90);
    SparseTexel _31 = SparseTexel(_89, _90);
    vec4 _34 = _31._m1;
    _39 _40 = _39(_34.x, _34.y, _34.z, _34.w, _31._m0);
    float _42 = _40._m0;
    float _43 = _40._m1;
    float _44 = _40._m2;
    float _45 = _40._m3;
    SV_TARGET.x = _42;
    SV_TARGET.y = _43;
    SV_TARGET.z = _44;
    SV_TARGET.w = _45;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_40._m4)));
    uint _91;
    vec4 _92;
    _91 = sparseTexelFetchOffsetARB(_8, ivec2(uvec2(TEXCOORD.x, TEXCOORD.y)), int(1u), ivec2(-1, 0), _92);
    SparseTexel _63 = SparseTexel(_91, _92);
    vec4 _68 = _63._m1;
    _39 _73 = _39(_68.x, _68.y, _68.z, _68.w, _63._m0);
    float _75 = _73._m0;
    float _76 = _73._m1;
    float _77 = _73._m2;
    float _78 = _73._m3;
    SV_TARGET_2.x = _75;
    SV_TARGET_2.y = _76;
    SV_TARGET_2.z = _77;
    SV_TARGET_2.w = _78;
    SV_TARGET_3 = float(sparseTexelsResidentARB(int(_73._m4)));
}


