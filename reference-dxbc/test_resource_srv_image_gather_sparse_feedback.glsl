GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _61
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _69
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _11;

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
    uint _133;
    vec4 _134;
    _133 = sparseTextureGatherARB(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), _134);
    SparseTexel _54 = SparseTexel(_133, _134);
    vec4 _56 = _54._m1;
    _61 _62 = _61(_56.x, _56.y, _56.z, _56.w, _54._m0);
    float _64 = _62._m0;
    float _65 = _62._m1;
    float _66 = _62._m2;
    float _67 = _62._m3;
    SV_TARGET.x = _64;
    SV_TARGET.y = _65;
    SV_TARGET.z = _66;
    SV_TARGET.w = _67;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_62._m4)));
    uint _135;
    vec4 _136;
    _135 = sparseTextureGatherOffsetARB(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(-1, 0), _136);
    SparseTexel _85 = SparseTexel(_135, _136);
    vec4 _88 = _85._m1;
    _61 _93 = _61(_88.x, _88.y, _88.z, _88.w, _85._m0);
    float _95 = _93._m0;
    float _96 = _93._m1;
    float _97 = _93._m2;
    float _98 = _93._m3;
    SV_TARGET_2.x = _95;
    SV_TARGET_2.y = _96;
    SV_TARGET_2.z = _97;
    SV_TARGET_2.w = _98;
    SV_TARGET_3 = float(sparseTexelsResidentARB(int(_93._m4)));
    uint _137;
    vec4 _138;
    _137 = sparseTextureGatherOffsetARB(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(uint(OFFSET.x)), int(uint(OFFSET.y))), _138);
    SparseTexel _110 = SparseTexel(_137, _138);
    vec4 _113 = _110._m1;
    _61 _118 = _61(_113.x, _113.y, _113.z, _113.w, _110._m0);
    float _120 = _118._m0;
    float _121 = _118._m1;
    float _122 = _118._m2;
    float _123 = _118._m3;
    SV_TARGET_4.x = _120;
    SV_TARGET_4.y = _121;
    SV_TARGET_4.z = _122;
    SV_TARGET_4.w = _123;
    SV_TARGET_5 = float(sparseTexelsResidentARB(int(_118._m4)));
}


