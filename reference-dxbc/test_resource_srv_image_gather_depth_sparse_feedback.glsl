GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _63
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _71
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform samplerShadow _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 2) flat in ivec2 OFFSET;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out float SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out float SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out float SV_TARGET_5;

void main()
{
    vec2 _54 = vec2(TEXCOORD.x, TEXCOORD.y);
    uint _136;
    vec4 _137;
    _136 = sparseTextureGatherARB(sampler2DShadow(_8, _11), _54, DEPTH_REF, _137);
    SparseTexel _56 = SparseTexel(_136, _137);
    vec4 _58 = _56._m1;
    _63 _64 = _63(_58.x, _58.y, _58.z, _58.w, _56._m0);
    float _66 = _64._m0;
    float _67 = _64._m1;
    float _68 = _64._m2;
    float _69 = _64._m3;
    SV_TARGET.x = _66;
    SV_TARGET.y = _67;
    SV_TARGET.z = _68;
    SV_TARGET.w = _69;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_64._m4)));
    vec2 _84 = vec2(TEXCOORD.x, TEXCOORD.y);
    uint _138;
    vec4 _139;
    _138 = sparseTextureGatherOffsetARB(sampler2DShadow(_8, _11), _84, DEPTH_REF, ivec2(-1, 0), _139);
    SparseTexel _87 = SparseTexel(_138, _139);
    vec4 _90 = _87._m1;
    _63 _95 = _63(_90.x, _90.y, _90.z, _90.w, _87._m0);
    float _97 = _95._m0;
    float _98 = _95._m1;
    float _99 = _95._m2;
    float _100 = _95._m3;
    SV_TARGET_2.x = _97;
    SV_TARGET_2.y = _98;
    SV_TARGET_2.z = _99;
    SV_TARGET_2.w = _100;
    SV_TARGET_3 = float(sparseTexelsResidentARB(int(_95._m4)));
    vec2 _109 = vec2(TEXCOORD.x, TEXCOORD.y);
    uint _140;
    vec4 _141;
    _140 = sparseTextureGatherOffsetARB(sampler2DShadow(_8, _11), _109, DEPTH_REF, ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))), _141);
    SparseTexel _112 = SparseTexel(_140, _141);
    vec4 _115 = _112._m1;
    _63 _120 = _63(_115.x, _115.y, _115.z, _115.w, _112._m0);
    float _122 = _120._m0;
    float _123 = _120._m1;
    float _124 = _120._m2;
    float _125 = _120._m3;
    SV_TARGET_4.x = _122;
    SV_TARGET_4.y = _123;
    SV_TARGET_4.z = _124;
    SV_TARGET_4.w = _125;
    SV_TARGET_5 = float(sparseTexelsResidentARB(int(_120._m4)));
}


