GLSL:
#version 460
#extension GL_ARB_sparse_texture2 : require
#extension GL_ARB_sparse_texture_clamp : require

struct SparseTexel
{
    uint _m0;
    vec4 _m1;
};

struct _62
{
    float _m0;
    float _m1;
    float _m2;
    float _m3;
    uint _m4;
};

struct _70
{
    uint _m0;
    vec4 _m1;
};

layout(set = 0, binding = 0) uniform texture2DArray _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 1) in float DEPTH_REF;
layout(location = 1, component = 1) in float LOD_BIAS;
layout(location = 1, component = 2) in float LOD_CLAMP;
layout(location = 1, component = 3) in float LAYER;
layout(location = 2) in vec2 TEXCOORD_2;
layout(location = 0) out vec4 SV_TARGET;
layout(location = 1) out float SV_TARGET_1;
layout(location = 2) out vec4 SV_TARGET_2;
layout(location = 3) out float SV_TARGET_3;
layout(location = 4) out vec4 SV_TARGET_4;
layout(location = 5) out float SV_TARGET_5;
layout(location = 6) out vec4 SV_TARGET_6;
layout(location = 7) out float SV_TARGET_7;

void main()
{
    uint _167;
    vec4 _168;
    _167 = sparseTextureARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), _168);
    SparseTexel _54 = SparseTexel(_167, _168);
    vec4 _57 = _54._m1;
    _62 _63 = _62(_57.x, _57.y, _57.z, _57.w, _54._m0);
    float _65 = _63._m0;
    float _66 = _63._m1;
    float _67 = _63._m2;
    float _68 = _63._m3;
    SV_TARGET.x = _65;
    SV_TARGET.y = _66;
    SV_TARGET.z = _67;
    SV_TARGET.w = _68;
    SV_TARGET_1 = float(sparseTexelsResidentARB(int(_63._m4)));
    uint _169;
    vec4 _170;
    _169 = sparseTextureLodARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), textureQueryLod(sampler2DArray(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y)).x, _170);
    SparseTexel _82 = SparseTexel(_169, _170);
    vec4 _85 = _82._m1;
    _62 _90 = _62(_85.x, _85.y, _85.z, _85.w, _82._m0);
    float _92 = _90._m0;
    float _93 = _90._m1;
    float _94 = _90._m2;
    float _95 = _90._m3;
    SV_TARGET_2.x = _92;
    SV_TARGET_2.y = _93;
    SV_TARGET_2.z = _94;
    SV_TARGET_2.w = _95;
    SV_TARGET_3 = float(sparseTexelsResidentARB(int(_90._m4)));
    uint _171;
    vec4 _172;
    _171 = sparseTextureOffsetClampARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), ivec2(-1, 0), LOD_CLAMP, _172, LOD_BIAS);
    SparseTexel _107 = SparseTexel(_171, _172);
    vec4 _112 = _107._m1;
    _62 _117 = _62(_112.x, _112.y, _112.z, _112.w, _107._m0);
    float _119 = _117._m0;
    float _120 = _117._m1;
    float _121 = _117._m2;
    float _122 = _117._m3;
    SV_TARGET_4.x = _119;
    SV_TARGET_4.y = _120;
    SV_TARGET_4.z = _121;
    SV_TARGET_4.w = _122;
    SV_TARGET_5 = float(sparseTexelsResidentARB(int(_117._m4)));
    uint _173;
    vec4 _174;
    _173 = sparseTextureGradARB(sampler2DArray(_8, _11), vec3(TEXCOORD.x, TEXCOORD.y, LAYER), vec2(dFdx(TEXCOORD_2.x), dFdx(TEXCOORD_2.y)), vec2(dFdy(TEXCOORD_2.x), dFdy(TEXCOORD_2.y)), _174);
    SparseTexel _141 = SparseTexel(_173, _174);
    vec4 _146 = _141._m1;
    _62 _151 = _62(_146.x, _146.y, _146.z, _146.w, _141._m0);
    float _153 = _151._m0;
    float _154 = _151._m1;
    float _155 = _151._m2;
    float _156 = _151._m3;
    SV_TARGET_6.x = _153;
    SV_TARGET_6.y = _154;
    SV_TARGET_6.z = _155;
    SV_TARGET_6.w = _156;
    SV_TARGET_7 = float(sparseTexelsResidentARB(int(_151._m4)));
}


