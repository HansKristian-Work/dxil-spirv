#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_shader_image_int64 : require
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_KHR_shader_subgroup_quad : require

struct ResType
{
    vec2 _m0;
    ivec2 _m1;
};

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 1) uniform texture2DArray _11;
layout(set = 1, binding = 0) uniform texture2D _14[];
layout(set = 2, binding = 0) uniform texture2DArray _17[];
layout(set = 0, binding = 0, r64ui) uniform readonly writeonly u64image2D _21;
layout(set = 0, binding = 1, r64ui) uniform readonly writeonly u64image2DArray _24;
layout(set = 1, binding = 0, r64ui) uniform readonly writeonly u64image2D _27[];
layout(set = 2, binding = 0, r64ui) uniform readonly writeonly u64image2DArray _30[];
layout(set = 0, binding = 0) uniform sampler _33;
layout(set = 1, binding = 0) uniform sampler _36[];

layout(location = 1) in vec2 GRADX;
layout(location = 1, component = 2) in vec2 GRADY;
layout(location = 2) in float CLAMP;
layout(location = 3) flat in uint IDX;

void WriteFeedback(u64image2D img, ivec2 coord, uint64_t value, bool active_lane)
{
    bool is_done = false;
    if (active_lane)
    {
        while (!is_done)
        {
            bool _184 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _184;
            if (_184)
            {
                uint64_t _185 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _188 = imageAtomicOr(img, coord, _185);
                }
            }
        }
    }
}

void WriteFeedbackArray(u64image2DArray img, ivec3 coord, uint64_t value, bool active_lane)
{
    bool is_done = false;
    if (active_lane)
    {
        while (!is_done)
        {
            bool _847 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _847;
            if (_847)
            {
                uint64_t _848 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _851 = imageAtomicOr(img, coord, _848);
                }
            }
        }
    }
}

void WriteFeedbackNonUniform(u64image2D img, ivec2 coord, uint64_t value, bool active_lane)
{
    bool is_done = false;
    if (active_lane)
    {
        while (!is_done)
        {
            bool _1555 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1555;
            if (_1555)
            {
                uint64_t _1556 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1559 = imageAtomicOr(img, coord, _1556);
                }
            }
        }
    }
}

void WriteFeedbackArrayNonUniform(u64image2DArray img, ivec3 coord, uint64_t value, bool active_lane)
{
    bool is_done = false;
    if (active_lane)
    {
        while (!is_done)
        {
            bool _1688 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1688;
            if (_1688)
            {
                uint64_t _1689 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1692 = imageAtomicOr(img, coord, _1689);
                }
            }
        }
    }
}

void main()
{
    float _76 = 1.0 / gl_FragCoord.w;
    vec2 _83 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _85 = imageSize(_21) & ivec2(15);
    vec2 _93 = textureQueryLod(sampler2D(_8, _33), _83);
    float _94 = _93.x;
    int _95 = int(_94);
    int _98 = int(_94 + 0.9970703125);
    vec2 _103 = abs(dFdx(_83));
    vec2 _104 = abs(dFdy(_83));
    vec2 _111 = vec2(max(_103.x, _104.x), max(_103.y, _104.y));
    vec2 _112 = fract(_83);
    vec2 _113 = vec2(textureSize(_8, _95));
    ivec2 _115 = -_85;
    vec2 _117 = _112 * ldexp(_113, _115);
    ResType _123;
    _123._m0 = frexp((_111 * _113) - vec2(0.00390625), _123._m1);
    vec2 _134 = min(ldexp(vec2(0.5), clamp(_123._m1, ivec2(0), ivec2(4)) + _115), vec2(0.5));
    ivec2 _140 = ivec2(max(_117 - _134, vec2(0.0)));
    bvec2 _142 = notEqual(_140, ivec2(_117 + _134));
    bool _143 = _142.x;
    bool _144 = _142.y;
    WriteFeedback(_21, _140, uint64_t(((1 | (_143 ? 2 : 0)) | (_144 ? 4 : 0)) | ((_143 && _144) ? 8 : 0)) << uint64_t(_95 * 4), !gl_HelperInvocation);
    vec2 _191 = vec2(textureSize(_8, _98));
    ivec2 _193 = -_85;
    vec2 _195 = _112 * ldexp(_191, _193);
    ResType _198;
    _198._m0 = frexp((_111 * _191) - vec2(0.00390625), _198._m1);
    vec2 _203 = min(ldexp(vec2(0.5), clamp(_198._m1, ivec2(0), ivec2(4)) + _193), vec2(0.5));
    ivec2 _207 = ivec2(max(_195 - _203, vec2(0.0)));
    bvec2 _209 = notEqual(_207, ivec2(_195 + _203));
    bool _210 = _209.x;
    bool _211 = _209.y;
    WriteFeedback(_21, _207, uint64_t(((1 | (_210 ? 2 : 0)) | (_211 ? 4 : 0)) | ((_210 && _211) ? 8 : 0)) << uint64_t(_98 * 4), (!gl_HelperInvocation) && (_95 != _98));
    vec2 _227 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _229 = imageSize(_21) & ivec2(15);
    float _235 = min(max(textureQueryLod(sampler2D(_8, _33), _227).x, CLAMP), 14.0);
    int _237 = int(_235);
    int _239 = int(_235 + 0.9970703125);
    vec2 _244 = abs(dFdx(_227));
    vec2 _245 = abs(dFdy(_227));
    vec2 _252 = vec2(max(_244.x, _245.x), max(_244.y, _245.y));
    vec2 _253 = fract(_227);
    vec2 _254 = vec2(textureSize(_8, _237));
    ivec2 _256 = -_229;
    vec2 _258 = _253 * ldexp(_254, _256);
    ResType _261;
    _261._m0 = frexp((_252 * _254) - vec2(0.00390625), _261._m1);
    vec2 _266 = min(ldexp(vec2(0.5), clamp(_261._m1, ivec2(0), ivec2(4)) + _256), vec2(0.5));
    ivec2 _270 = ivec2(max(_258 - _266, vec2(0.0)));
    bvec2 _272 = notEqual(_270, ivec2(_258 + _266));
    bool _273 = _272.x;
    bool _274 = _272.y;
    WriteFeedback(_21, _270, uint64_t(((1 | (_273 ? 2 : 0)) | (_274 ? 4 : 0)) | ((_273 && _274) ? 8 : 0)) << uint64_t(_237 * 4), !gl_HelperInvocation);
    vec2 _289 = vec2(textureSize(_8, _239));
    ivec2 _291 = -_229;
    vec2 _293 = _253 * ldexp(_289, _291);
    ResType _296;
    _296._m0 = frexp((_252 * _289) - vec2(0.00390625), _296._m1);
    vec2 _301 = min(ldexp(vec2(0.5), clamp(_296._m1, ivec2(0), ivec2(4)) + _291), vec2(0.5));
    ivec2 _305 = ivec2(max(_293 - _301, vec2(0.0)));
    bvec2 _307 = notEqual(_305, ivec2(_293 + _301));
    bool _308 = _307.x;
    bool _309 = _307.y;
    WriteFeedback(_21, _305, uint64_t(((1 | (_308 ? 2 : 0)) | (_309 ? 4 : 0)) | ((_308 && _309) ? 8 : 0)) << uint64_t(_239 * 4), (!gl_HelperInvocation) && (_237 != _239));
    ivec2 _327 = imageSize(_21) & ivec2(15);
    int _329 = textureQueryLevels(_8) - 1;
    float _330 = float(_329);
    float _1934 = isnan(0.0) ? gl_FragCoord.z : (isnan(gl_FragCoord.z) ? 0.0 : max(gl_FragCoord.z, 0.0));
    float _331 = isnan(_330) ? _1934 : (isnan(_1934) ? _330 : min(_1934, _330));
    int _332 = int(_331);
    int _334 = int(_331 + 0.9970703125);
    vec2 _337 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _340 = -_327;
    vec2 _342 = _337 * ldexp(vec2(textureSize(_8, _332)), _340);
    vec2 _343 = ldexp(vec2(0.5), _340);
    ivec2 _347 = ivec2(max(_342 - _343, vec2(0.0)));
    bvec2 _349 = notEqual(_347, ivec2(_342 + _343));
    bool _350 = _349.x;
    bool _351 = _349.y;
    WriteFeedback(_21, _347, uint64_t(((1 | (_350 ? 2 : 0)) | (_351 ? 4 : 0)) | ((_350 && _351) ? 8 : 0)) << uint64_t(_332 * 4), !gl_HelperInvocation);
    ivec2 _368 = -_327;
    vec2 _370 = _337 * ldexp(vec2(textureSize(_8, _334)), _368);
    vec2 _371 = ldexp(vec2(0.5), _368);
    ivec2 _375 = ivec2(max(_370 - _371, vec2(0.0)));
    bvec2 _377 = notEqual(_375, ivec2(_370 + _371));
    bool _378 = _377.x;
    bool _379 = _377.y;
    WriteFeedback(_21, _375, uint64_t(((1 | (_378 ? 2 : 0)) | (_379 ? 4 : 0)) | ((_378 && _379) ? 8 : 0)) << uint64_t(_334 * 4), (!gl_HelperInvocation) && (_332 != _334));
    ivec2 _397 = imageSize(_21) & ivec2(15);
    int _399 = textureQueryLevels(_8) - 1;
    vec2 _400 = vec2(textureSize(_8, 0));
    vec2 _404 = _400 * vec2(GRADX.x, GRADX.y);
    vec2 _405 = _400 * vec2(GRADY.x, GRADY.y);
    float _410 = log2(max(dot(_404, _404), dot(_405, _405))) * 0.5;
    float _411 = float(_399);
    float _1945 = isnan(0.0) ? _410 : (isnan(_410) ? 0.0 : max(_410, 0.0));
    float _412 = isnan(_411) ? _1945 : (isnan(_1945) ? _411 : min(_1945, _411));
    int _413 = int(_412);
    int _415 = int(_412 + 0.9970703125);
    vec2 _418 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _421 = -_397;
    vec2 _423 = _418 * ldexp(vec2(textureSize(_8, _413)), _421);
    vec2 _424 = ldexp(vec2(0.5), _421);
    ivec2 _428 = ivec2(max(_423 - _424, vec2(0.0)));
    bvec2 _430 = notEqual(_428, ivec2(_423 + _424));
    bool _431 = _430.x;
    bool _432 = _430.y;
    WriteFeedback(_21, _428, uint64_t(((1 | (_431 ? 2 : 0)) | (_432 ? 4 : 0)) | ((_431 && _432) ? 8 : 0)) << uint64_t(_413 * 4), !gl_HelperInvocation);
    ivec2 _449 = -_397;
    vec2 _451 = _418 * ldexp(vec2(textureSize(_8, _415)), _449);
    vec2 _452 = ldexp(vec2(0.5), _449);
    ivec2 _456 = ivec2(max(_451 - _452, vec2(0.0)));
    bvec2 _458 = notEqual(_456, ivec2(_451 + _452));
    bool _459 = _458.x;
    bool _460 = _458.y;
    WriteFeedback(_21, _456, uint64_t(((1 | (_459 ? 2 : 0)) | (_460 ? 4 : 0)) | ((_459 && _460) ? 8 : 0)) << uint64_t(_415 * 4), (!gl_HelperInvocation) && (_413 != _415));
    ivec2 _478 = imageSize(_21) & ivec2(15);
    int _480 = textureQueryLevels(_8) - 1;
    vec2 _481 = vec2(textureSize(_8, 0));
    vec2 _485 = _481 * vec2(GRADX.x, GRADX.y);
    vec2 _486 = _481 * vec2(GRADY.x, GRADY.y);
    float _491 = log2(max(dot(_485, _485), dot(_486, _486))) * 0.5;
    float _492 = float(_480);
    float _1956 = isnan(0.0) ? _491 : (isnan(_491) ? 0.0 : max(_491, 0.0));
    float _495 = min(max(isnan(_492) ? _1956 : (isnan(_1956) ? _492 : min(_1956, _492)), CLAMP), 14.0);
    int _496 = int(_495);
    int _498 = int(_495 + 0.9970703125);
    vec2 _501 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _504 = -_478;
    vec2 _506 = _501 * ldexp(vec2(textureSize(_8, _496)), _504);
    vec2 _507 = ldexp(vec2(0.5), _504);
    ivec2 _511 = ivec2(max(_506 - _507, vec2(0.0)));
    bvec2 _513 = notEqual(_511, ivec2(_506 + _507));
    bool _514 = _513.x;
    bool _515 = _513.y;
    WriteFeedback(_21, _511, uint64_t(((1 | (_514 ? 2 : 0)) | (_515 ? 4 : 0)) | ((_514 && _515) ? 8 : 0)) << uint64_t(_496 * 4), !gl_HelperInvocation);
    ivec2 _532 = -_478;
    vec2 _534 = _501 * ldexp(vec2(textureSize(_8, _498)), _532);
    vec2 _535 = ldexp(vec2(0.5), _532);
    ivec2 _539 = ivec2(max(_534 - _535, vec2(0.0)));
    bvec2 _541 = notEqual(_539, ivec2(_534 + _535));
    bool _542 = _541.x;
    bool _543 = _541.y;
    WriteFeedback(_21, _539, uint64_t(((1 | (_542 ? 2 : 0)) | (_543 ? 4 : 0)) | ((_542 && _543) ? 8 : 0)) << uint64_t(_498 * 4), (!gl_HelperInvocation) && (_496 != _498));
    vec2 _559 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _561 = imageSize(_21) & ivec2(15);
    float _564 = exp2(gl_FragCoord.z);
    vec2 _567 = textureQueryLod(sampler2D(_8, _33), _559 * subgroupQuadBroadcast(_564, 0u));
    float _568 = _567.x;
    int _569 = int(_568);
    int _571 = int(_568 + 0.9970703125);
    vec2 _576 = abs(dFdx(_559));
    vec2 _577 = abs(dFdy(_559));
    vec2 _585 = vec2(max(_576.x, _577.x), max(_576.y, _577.y)) * _564;
    vec2 _586 = fract(_559);
    vec2 _587 = vec2(textureSize(_8, _569));
    ivec2 _589 = -_561;
    vec2 _591 = _586 * ldexp(_587, _589);
    ResType _594;
    _594._m0 = frexp((_585 * _587) - vec2(0.00390625), _594._m1);
    vec2 _599 = min(ldexp(vec2(0.5), clamp(_594._m1, ivec2(0), ivec2(4)) + _589), vec2(0.5));
    ivec2 _603 = ivec2(max(_591 - _599, vec2(0.0)));
    bvec2 _605 = notEqual(_603, ivec2(_591 + _599));
    bool _606 = _605.x;
    bool _607 = _605.y;
    WriteFeedback(_21, _603, uint64_t(((1 | (_606 ? 2 : 0)) | (_607 ? 4 : 0)) | ((_606 && _607) ? 8 : 0)) << uint64_t(_569 * 4), !gl_HelperInvocation);
    vec2 _622 = vec2(textureSize(_8, _571));
    ivec2 _624 = -_561;
    vec2 _626 = _586 * ldexp(_622, _624);
    ResType _629;
    _629._m0 = frexp((_585 * _622) - vec2(0.00390625), _629._m1);
    vec2 _634 = min(ldexp(vec2(0.5), clamp(_629._m1, ivec2(0), ivec2(4)) + _624), vec2(0.5));
    ivec2 _638 = ivec2(max(_626 - _634, vec2(0.0)));
    bvec2 _640 = notEqual(_638, ivec2(_626 + _634));
    bool _641 = _640.x;
    bool _642 = _640.y;
    WriteFeedback(_21, _638, uint64_t(((1 | (_641 ? 2 : 0)) | (_642 ? 4 : 0)) | ((_641 && _642) ? 8 : 0)) << uint64_t(_571 * 4), (!gl_HelperInvocation) && (_569 != _571));
    vec2 _658 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _660 = imageSize(_21) & ivec2(15);
    float _663 = exp2(gl_FragCoord.z);
    float _669 = min(max(textureQueryLod(sampler2D(_8, _33), _658 * subgroupQuadBroadcast(_663, 0u)).x, CLAMP), 14.0);
    int _670 = int(_669);
    int _672 = int(_669 + 0.9970703125);
    vec2 _677 = abs(dFdx(_658));
    vec2 _678 = abs(dFdy(_658));
    vec2 _686 = vec2(max(_677.x, _678.x), max(_677.y, _678.y)) * _663;
    vec2 _687 = fract(_658);
    vec2 _688 = vec2(textureSize(_8, _670));
    ivec2 _690 = -_660;
    vec2 _692 = _687 * ldexp(_688, _690);
    ResType _695;
    _695._m0 = frexp((_686 * _688) - vec2(0.00390625), _695._m1);
    vec2 _700 = min(ldexp(vec2(0.5), clamp(_695._m1, ivec2(0), ivec2(4)) + _690), vec2(0.5));
    ivec2 _704 = ivec2(max(_692 - _700, vec2(0.0)));
    bvec2 _706 = notEqual(_704, ivec2(_692 + _700));
    bool _707 = _706.x;
    bool _708 = _706.y;
    WriteFeedback(_21, _704, uint64_t(((1 | (_707 ? 2 : 0)) | (_708 ? 4 : 0)) | ((_707 && _708) ? 8 : 0)) << uint64_t(_670 * 4), !gl_HelperInvocation);
    vec2 _723 = vec2(textureSize(_8, _672));
    ivec2 _725 = -_660;
    vec2 _727 = _687 * ldexp(_723, _725);
    ResType _730;
    _730._m0 = frexp((_686 * _723) - vec2(0.00390625), _730._m1);
    vec2 _735 = min(ldexp(vec2(0.5), clamp(_730._m1, ivec2(0), ivec2(4)) + _725), vec2(0.5));
    ivec2 _739 = ivec2(max(_727 - _735, vec2(0.0)));
    bvec2 _741 = notEqual(_739, ivec2(_727 + _735));
    bool _742 = _741.x;
    bool _743 = _741.y;
    WriteFeedback(_21, _739, uint64_t(((1 | (_742 ? 2 : 0)) | (_743 ? 4 : 0)) | ((_742 && _743) ? 8 : 0)) << uint64_t(_672 * 4), (!gl_HelperInvocation) && (_670 != _672));
    int _760 = int(roundEven(gl_FragCoord.z));
    vec2 _761 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _765 = imageSize(_24).xy & ivec2(15);
    vec2 _770 = textureQueryLod(sampler2DArray(_11, _33), _761);
    float _771 = _770.x;
    int _772 = int(_771);
    int _774 = int(_771 + 0.9970703125);
    vec2 _779 = abs(dFdx(_761));
    vec2 _780 = abs(dFdy(_761));
    vec2 _787 = vec2(max(_779.x, _780.x), max(_779.y, _780.y));
    vec2 _788 = fract(_761);
    vec2 _789 = vec2(textureSize(_11, _772).xy);
    ivec2 _792 = -_765;
    vec2 _794 = _788 * ldexp(_789, _792);
    ResType _797;
    _797._m0 = frexp((_787 * _789) - vec2(0.00390625), _797._m1);
    vec2 _802 = min(ldexp(vec2(0.5), clamp(_797._m1, ivec2(0), ivec2(4)) + _792), vec2(0.5));
    ivec2 _806 = ivec2(max(_794 - _802, vec2(0.0)));
    bvec2 _808 = notEqual(_806, ivec2(_794 + _802));
    bool _809 = _808.x;
    bool _810 = _808.y;
    WriteFeedbackArray(_24, ivec3(_806, _760), uint64_t(((1 | (_809 ? 2 : 0)) | (_810 ? 4 : 0)) | ((_809 && _810) ? 8 : 0)) << uint64_t(_772 * 4), !gl_HelperInvocation);
    vec2 _854 = vec2(textureSize(_11, _774).xy);
    ivec2 _857 = -_765;
    vec2 _859 = _788 * ldexp(_854, _857);
    ResType _862;
    _862._m0 = frexp((_787 * _854) - vec2(0.00390625), _862._m1);
    vec2 _867 = min(ldexp(vec2(0.5), clamp(_862._m1, ivec2(0), ivec2(4)) + _857), vec2(0.5));
    ivec2 _871 = ivec2(max(_859 - _867, vec2(0.0)));
    bvec2 _873 = notEqual(_871, ivec2(_859 + _867));
    bool _874 = _873.x;
    bool _875 = _873.y;
    WriteFeedbackArray(_24, ivec3(_871, _760), uint64_t(((1 | (_874 ? 2 : 0)) | (_875 ? 4 : 0)) | ((_874 && _875) ? 8 : 0)) << uint64_t(_774 * 4), (!gl_HelperInvocation) && (_772 != _774));
    int _893 = int(roundEven(gl_FragCoord.z));
    vec2 _894 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _897 = imageSize(_24).xy & ivec2(15);
    float _903 = min(max(textureQueryLod(sampler2DArray(_11, _33), _894).x, CLAMP), 14.0);
    int _904 = int(_903);
    int _906 = int(_903 + 0.9970703125);
    vec2 _911 = abs(dFdx(_894));
    vec2 _912 = abs(dFdy(_894));
    vec2 _919 = vec2(max(_911.x, _912.x), max(_911.y, _912.y));
    vec2 _920 = fract(_894);
    vec2 _921 = vec2(textureSize(_11, _904).xy);
    ivec2 _924 = -_897;
    vec2 _926 = _920 * ldexp(_921, _924);
    ResType _929;
    _929._m0 = frexp((_919 * _921) - vec2(0.00390625), _929._m1);
    vec2 _934 = min(ldexp(vec2(0.5), clamp(_929._m1, ivec2(0), ivec2(4)) + _924), vec2(0.5));
    ivec2 _938 = ivec2(max(_926 - _934, vec2(0.0)));
    bvec2 _940 = notEqual(_938, ivec2(_926 + _934));
    bool _941 = _940.x;
    bool _942 = _940.y;
    WriteFeedbackArray(_24, ivec3(_938, _893), uint64_t(((1 | (_941 ? 2 : 0)) | (_942 ? 4 : 0)) | ((_941 && _942) ? 8 : 0)) << uint64_t(_904 * 4), !gl_HelperInvocation);
    vec2 _958 = vec2(textureSize(_11, _906).xy);
    ivec2 _961 = -_897;
    vec2 _963 = _920 * ldexp(_958, _961);
    ResType _966;
    _966._m0 = frexp((_919 * _958) - vec2(0.00390625), _966._m1);
    vec2 _971 = min(ldexp(vec2(0.5), clamp(_966._m1, ivec2(0), ivec2(4)) + _961), vec2(0.5));
    ivec2 _975 = ivec2(max(_963 - _971, vec2(0.0)));
    bvec2 _977 = notEqual(_975, ivec2(_963 + _971));
    bool _978 = _977.x;
    bool _979 = _977.y;
    WriteFeedbackArray(_24, ivec3(_975, _893), uint64_t(((1 | (_978 ? 2 : 0)) | (_979 ? 4 : 0)) | ((_978 && _979) ? 8 : 0)) << uint64_t(_906 * 4), (!gl_HelperInvocation) && (_904 != _906));
    int _997 = int(roundEven(gl_FragCoord.z));
    ivec2 _1001 = imageSize(_24).xy & ivec2(15);
    int _1003 = textureQueryLevels(_11) - 1;
    float _1004 = float(_1003);
    float _1967 = isnan(0.0) ? _76 : (isnan(_76) ? 0.0 : max(_76, 0.0));
    float _1005 = isnan(_1004) ? _1967 : (isnan(_1967) ? _1004 : min(_1967, _1004));
    int _1006 = int(_1005);
    int _1008 = int(_1005 + 0.9970703125);
    vec2 _1011 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1015 = -_1001;
    vec2 _1017 = _1011 * ldexp(vec2(textureSize(_11, _1006).xy), _1015);
    vec2 _1018 = ldexp(vec2(0.5), _1015);
    ivec2 _1022 = ivec2(max(_1017 - _1018, vec2(0.0)));
    bvec2 _1024 = notEqual(_1022, ivec2(_1017 + _1018));
    bool _1025 = _1024.x;
    bool _1026 = _1024.y;
    WriteFeedbackArray(_24, ivec3(_1022, _997), uint64_t(((1 | (_1025 ? 2 : 0)) | (_1026 ? 4 : 0)) | ((_1025 && _1026) ? 8 : 0)) << uint64_t(_1006 * 4), !gl_HelperInvocation);
    ivec2 _1045 = -_1001;
    vec2 _1047 = _1011 * ldexp(vec2(textureSize(_11, _1008).xy), _1045);
    vec2 _1048 = ldexp(vec2(0.5), _1045);
    ivec2 _1052 = ivec2(max(_1047 - _1048, vec2(0.0)));
    bvec2 _1054 = notEqual(_1052, ivec2(_1047 + _1048));
    bool _1055 = _1054.x;
    bool _1056 = _1054.y;
    WriteFeedbackArray(_24, ivec3(_1052, _997), uint64_t(((1 | (_1055 ? 2 : 0)) | (_1056 ? 4 : 0)) | ((_1055 && _1056) ? 8 : 0)) << uint64_t(_1008 * 4), (!gl_HelperInvocation) && (_1006 != _1008));
    int _1074 = int(roundEven(gl_FragCoord.z));
    ivec2 _1078 = imageSize(_24).xy & ivec2(15);
    int _1080 = textureQueryLevels(_11) - 1;
    vec2 _1081 = vec2(textureSize(_11, 0).xy);
    vec2 _1086 = _1081 * vec2(GRADX.x, GRADX.y);
    vec2 _1087 = _1081 * vec2(GRADY.x, GRADY.y);
    float _1092 = log2(max(dot(_1086, _1086), dot(_1087, _1087))) * 0.5;
    float _1093 = float(_1080);
    float _1978 = isnan(0.0) ? _1092 : (isnan(_1092) ? 0.0 : max(_1092, 0.0));
    float _1094 = isnan(_1093) ? _1978 : (isnan(_1978) ? _1093 : min(_1978, _1093));
    int _1095 = int(_1094);
    int _1097 = int(_1094 + 0.9970703125);
    vec2 _1100 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1104 = -_1078;
    vec2 _1106 = _1100 * ldexp(vec2(textureSize(_11, _1095).xy), _1104);
    vec2 _1107 = ldexp(vec2(0.5), _1104);
    ivec2 _1111 = ivec2(max(_1106 - _1107, vec2(0.0)));
    bvec2 _1113 = notEqual(_1111, ivec2(_1106 + _1107));
    bool _1114 = _1113.x;
    bool _1115 = _1113.y;
    WriteFeedbackArray(_24, ivec3(_1111, _1074), uint64_t(((1 | (_1114 ? 2 : 0)) | (_1115 ? 4 : 0)) | ((_1114 && _1115) ? 8 : 0)) << uint64_t(_1095 * 4), !gl_HelperInvocation);
    ivec2 _1134 = -_1078;
    vec2 _1136 = _1100 * ldexp(vec2(textureSize(_11, _1097).xy), _1134);
    vec2 _1137 = ldexp(vec2(0.5), _1134);
    ivec2 _1141 = ivec2(max(_1136 - _1137, vec2(0.0)));
    bvec2 _1143 = notEqual(_1141, ivec2(_1136 + _1137));
    bool _1144 = _1143.x;
    bool _1145 = _1143.y;
    WriteFeedbackArray(_24, ivec3(_1141, _1074), uint64_t(((1 | (_1144 ? 2 : 0)) | (_1145 ? 4 : 0)) | ((_1144 && _1145) ? 8 : 0)) << uint64_t(_1097 * 4), (!gl_HelperInvocation) && (_1095 != _1097));
    int _1163 = int(roundEven(gl_FragCoord.z));
    ivec2 _1167 = imageSize(_24).xy & ivec2(15);
    int _1169 = textureQueryLevels(_11) - 1;
    vec2 _1170 = vec2(textureSize(_11, 0).xy);
    vec2 _1175 = _1170 * vec2(GRADX.x, GRADX.y);
    vec2 _1176 = _1170 * vec2(GRADY.x, GRADY.y);
    float _1181 = log2(max(dot(_1175, _1175), dot(_1176, _1176))) * 0.5;
    float _1182 = float(_1169);
    float _1989 = isnan(0.0) ? _1181 : (isnan(_1181) ? 0.0 : max(_1181, 0.0));
    float _1185 = min(max(isnan(_1182) ? _1989 : (isnan(_1989) ? _1182 : min(_1989, _1182)), CLAMP), 14.0);
    int _1186 = int(_1185);
    int _1188 = int(_1185 + 0.9970703125);
    vec2 _1191 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1195 = -_1167;
    vec2 _1197 = _1191 * ldexp(vec2(textureSize(_11, _1186).xy), _1195);
    vec2 _1198 = ldexp(vec2(0.5), _1195);
    ivec2 _1202 = ivec2(max(_1197 - _1198, vec2(0.0)));
    bvec2 _1204 = notEqual(_1202, ivec2(_1197 + _1198));
    bool _1205 = _1204.x;
    bool _1206 = _1204.y;
    WriteFeedbackArray(_24, ivec3(_1202, _1163), uint64_t(((1 | (_1205 ? 2 : 0)) | (_1206 ? 4 : 0)) | ((_1205 && _1206) ? 8 : 0)) << uint64_t(_1186 * 4), !gl_HelperInvocation);
    ivec2 _1225 = -_1167;
    vec2 _1227 = _1191 * ldexp(vec2(textureSize(_11, _1188).xy), _1225);
    vec2 _1228 = ldexp(vec2(0.5), _1225);
    ivec2 _1232 = ivec2(max(_1227 - _1228, vec2(0.0)));
    bvec2 _1234 = notEqual(_1232, ivec2(_1227 + _1228));
    bool _1235 = _1234.x;
    bool _1236 = _1234.y;
    WriteFeedbackArray(_24, ivec3(_1232, _1163), uint64_t(((1 | (_1235 ? 2 : 0)) | (_1236 ? 4 : 0)) | ((_1235 && _1236) ? 8 : 0)) << uint64_t(_1188 * 4), (!gl_HelperInvocation) && (_1186 != _1188));
    int _1254 = int(roundEven(gl_FragCoord.z));
    vec2 _1255 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1258 = imageSize(_24).xy & ivec2(15);
    float _1261 = exp2(gl_FragCoord.z);
    vec2 _1264 = textureQueryLod(sampler2DArray(_11, _33), _1255 * subgroupQuadBroadcast(_1261, 0u));
    float _1265 = _1264.x;
    int _1266 = int(_1265);
    int _1268 = int(_1265 + 0.9970703125);
    vec2 _1273 = abs(dFdx(_1255));
    vec2 _1274 = abs(dFdy(_1255));
    vec2 _1282 = vec2(max(_1273.x, _1274.x), max(_1273.y, _1274.y)) * _1261;
    vec2 _1283 = fract(_1255);
    vec2 _1284 = vec2(textureSize(_11, _1266).xy);
    ivec2 _1287 = -_1258;
    vec2 _1289 = _1283 * ldexp(_1284, _1287);
    ResType _1292;
    _1292._m0 = frexp((_1282 * _1284) - vec2(0.00390625), _1292._m1);
    vec2 _1297 = min(ldexp(vec2(0.5), clamp(_1292._m1, ivec2(0), ivec2(4)) + _1287), vec2(0.5));
    ivec2 _1301 = ivec2(max(_1289 - _1297, vec2(0.0)));
    bvec2 _1303 = notEqual(_1301, ivec2(_1289 + _1297));
    bool _1304 = _1303.x;
    bool _1305 = _1303.y;
    WriteFeedbackArray(_24, ivec3(_1301, _1254), uint64_t(((1 | (_1304 ? 2 : 0)) | (_1305 ? 4 : 0)) | ((_1304 && _1305) ? 8 : 0)) << uint64_t(_1266 * 4), !gl_HelperInvocation);
    vec2 _1321 = vec2(textureSize(_11, _1268).xy);
    ivec2 _1324 = -_1258;
    vec2 _1326 = _1283 * ldexp(_1321, _1324);
    ResType _1329;
    _1329._m0 = frexp((_1282 * _1321) - vec2(0.00390625), _1329._m1);
    vec2 _1334 = min(ldexp(vec2(0.5), clamp(_1329._m1, ivec2(0), ivec2(4)) + _1324), vec2(0.5));
    ivec2 _1338 = ivec2(max(_1326 - _1334, vec2(0.0)));
    bvec2 _1340 = notEqual(_1338, ivec2(_1326 + _1334));
    bool _1341 = _1340.x;
    bool _1342 = _1340.y;
    WriteFeedbackArray(_24, ivec3(_1338, _1254), uint64_t(((1 | (_1341 ? 2 : 0)) | (_1342 ? 4 : 0)) | ((_1341 && _1342) ? 8 : 0)) << uint64_t(_1268 * 4), (!gl_HelperInvocation) && (_1266 != _1268));
    int _1360 = int(roundEven(gl_FragCoord.z));
    vec2 _1361 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1364 = imageSize(_24).xy & ivec2(15);
    float _1367 = exp2(_76);
    float _1373 = min(max(textureQueryLod(sampler2DArray(_11, _33), _1361 * subgroupQuadBroadcast(_1367, 0u)).x, CLAMP), 14.0);
    int _1374 = int(_1373);
    int _1376 = int(_1373 + 0.9970703125);
    vec2 _1381 = abs(dFdx(_1361));
    vec2 _1382 = abs(dFdy(_1361));
    vec2 _1390 = vec2(max(_1381.x, _1382.x), max(_1381.y, _1382.y)) * _1367;
    vec2 _1391 = fract(_1361);
    vec2 _1392 = vec2(textureSize(_11, _1374).xy);
    ivec2 _1395 = -_1364;
    vec2 _1397 = _1391 * ldexp(_1392, _1395);
    ResType _1400;
    _1400._m0 = frexp((_1390 * _1392) - vec2(0.00390625), _1400._m1);
    vec2 _1405 = min(ldexp(vec2(0.5), clamp(_1400._m1, ivec2(0), ivec2(4)) + _1395), vec2(0.5));
    ivec2 _1409 = ivec2(max(_1397 - _1405, vec2(0.0)));
    bvec2 _1411 = notEqual(_1409, ivec2(_1397 + _1405));
    bool _1412 = _1411.x;
    bool _1413 = _1411.y;
    WriteFeedbackArray(_24, ivec3(_1409, _1360), uint64_t(((1 | (_1412 ? 2 : 0)) | (_1413 ? 4 : 0)) | ((_1412 && _1413) ? 8 : 0)) << uint64_t(_1374 * 4), !gl_HelperInvocation);
    vec2 _1429 = vec2(textureSize(_11, _1376).xy);
    ivec2 _1432 = -_1364;
    vec2 _1434 = _1391 * ldexp(_1429, _1432);
    ResType _1437;
    _1437._m0 = frexp((_1390 * _1429) - vec2(0.00390625), _1437._m1);
    vec2 _1442 = min(ldexp(vec2(0.5), clamp(_1437._m1, ivec2(0), ivec2(4)) + _1432), vec2(0.5));
    ivec2 _1446 = ivec2(max(_1434 - _1442, vec2(0.0)));
    bvec2 _1448 = notEqual(_1446, ivec2(_1434 + _1442));
    bool _1449 = _1448.x;
    bool _1450 = _1448.y;
    WriteFeedbackArray(_24, ivec3(_1446, _1360), uint64_t(((1 | (_1449 ? 2 : 0)) | (_1450 ? 4 : 0)) | ((_1449 && _1450) ? 8 : 0)) << uint64_t(_1376 * 4), (!gl_HelperInvocation) && (_1374 != _1376));
    uint _1467 = IDX + 0u;
    uint _1470 = IDX + 0u;
    uint _1473 = IDX + 0u;
    vec2 _1476 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1478 = imageSize(_27[nonuniformEXT(_1467)]) & ivec2(15);
    vec2 _1482 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1470], _36[_1473])), _1476);
    float _1483 = _1482.x;
    int _1484 = int(_1483);
    int _1486 = int(_1483 + 0.9970703125);
    vec2 _1491 = abs(dFdx(_1476));
    vec2 _1492 = abs(dFdy(_1476));
    vec2 _1499 = vec2(max(_1491.x, _1492.x), max(_1491.y, _1492.y));
    vec2 _1500 = fract(_1476);
    vec2 _1501 = vec2(textureSize(_14[nonuniformEXT(_1470)], _1484));
    ivec2 _1503 = -_1478;
    vec2 _1505 = _1500 * ldexp(_1501, _1503);
    ResType _1508;
    _1508._m0 = frexp((_1499 * _1501) - vec2(0.00390625), _1508._m1);
    vec2 _1513 = min(ldexp(vec2(0.5), clamp(_1508._m1, ivec2(0), ivec2(4)) + _1503), vec2(0.5));
    ivec2 _1517 = ivec2(max(_1505 - _1513, vec2(0.0)));
    bvec2 _1519 = notEqual(_1517, ivec2(_1505 + _1513));
    bool _1520 = _1519.x;
    bool _1521 = _1519.y;
    WriteFeedbackNonUniform(_27[_1467], _1517, uint64_t(((1 | (_1520 ? 2 : 0)) | (_1521 ? 4 : 0)) | ((_1520 && _1521) ? 8 : 0)) << uint64_t(_1484 * 4), !gl_HelperInvocation);
    vec2 _1562 = vec2(textureSize(_14[nonuniformEXT(_1470)], _1486));
    ivec2 _1564 = -_1478;
    vec2 _1566 = _1500 * ldexp(_1562, _1564);
    ResType _1569;
    _1569._m0 = frexp((_1499 * _1562) - vec2(0.00390625), _1569._m1);
    vec2 _1574 = min(ldexp(vec2(0.5), clamp(_1569._m1, ivec2(0), ivec2(4)) + _1564), vec2(0.5));
    ivec2 _1578 = ivec2(max(_1566 - _1574, vec2(0.0)));
    bvec2 _1580 = notEqual(_1578, ivec2(_1566 + _1574));
    bool _1581 = _1580.x;
    bool _1582 = _1580.y;
    WriteFeedbackNonUniform(_27[_1467], _1578, uint64_t(((1 | (_1581 ? 2 : 0)) | (_1582 ? 4 : 0)) | ((_1581 && _1582) ? 8 : 0)) << uint64_t(_1486 * 4), (!gl_HelperInvocation) && (_1484 != _1486));
    uint _1598 = IDX + 0u;
    uint _1601 = IDX + 0u;
    int _1605 = int(roundEven(gl_FragCoord.z));
    vec2 _1606 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1609 = imageSize(_30[nonuniformEXT(_1598)]).xy & ivec2(15);
    vec2 _1613 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1601], _36[_1473])), _1606);
    float _1614 = _1613.x;
    int _1615 = int(_1614);
    int _1617 = int(_1614 + 0.9970703125);
    vec2 _1622 = abs(dFdx(_1606));
    vec2 _1623 = abs(dFdy(_1606));
    vec2 _1630 = vec2(max(_1622.x, _1623.x), max(_1622.y, _1623.y));
    vec2 _1631 = fract(_1606);
    vec2 _1632 = vec2(textureSize(_17[nonuniformEXT(_1601)], _1615).xy);
    ivec2 _1635 = -_1609;
    vec2 _1637 = _1631 * ldexp(_1632, _1635);
    ResType _1640;
    _1640._m0 = frexp((_1630 * _1632) - vec2(0.00390625), _1640._m1);
    vec2 _1645 = min(ldexp(vec2(0.5), clamp(_1640._m1, ivec2(0), ivec2(4)) + _1635), vec2(0.5));
    ivec2 _1649 = ivec2(max(_1637 - _1645, vec2(0.0)));
    bvec2 _1651 = notEqual(_1649, ivec2(_1637 + _1645));
    bool _1652 = _1651.x;
    bool _1653 = _1651.y;
    WriteFeedbackArrayNonUniform(_30[_1598], ivec3(_1649, _1605), uint64_t(((1 | (_1652 ? 2 : 0)) | (_1653 ? 4 : 0)) | ((_1652 && _1653) ? 8 : 0)) << uint64_t(_1615 * 4), !gl_HelperInvocation);
    vec2 _1695 = vec2(textureSize(_17[nonuniformEXT(_1601)], _1617).xy);
    ivec2 _1698 = -_1609;
    vec2 _1700 = _1631 * ldexp(_1695, _1698);
    ResType _1703;
    _1703._m0 = frexp((_1630 * _1695) - vec2(0.00390625), _1703._m1);
    vec2 _1708 = min(ldexp(vec2(0.5), clamp(_1703._m1, ivec2(0), ivec2(4)) + _1698), vec2(0.5));
    ivec2 _1712 = ivec2(max(_1700 - _1708, vec2(0.0)));
    bvec2 _1714 = notEqual(_1712, ivec2(_1700 + _1708));
    bool _1715 = _1714.x;
    bool _1716 = _1714.y;
    WriteFeedbackArrayNonUniform(_30[_1598], ivec3(_1712, _1605), uint64_t(((1 | (_1715 ? 2 : 0)) | (_1716 ? 4 : 0)) | ((_1715 && _1716) ? 8 : 0)) << uint64_t(_1617 * 4), (!gl_HelperInvocation) && (_1615 != _1617));
    vec2 _1733 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1735 = imageSize(_27[nonuniformEXT(_1467)]) & ivec2(15);
    vec2 _1738 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1470], _36[_1473])), _1733);
    float _1739 = _1738.x;
    int _1740 = int(_1739);
    int _1742 = int(_1739 + 0.9970703125);
    vec2 _1747 = abs(dFdx(_1733));
    vec2 _1748 = abs(dFdy(_1733));
    vec2 _1755 = vec2(max(_1747.x, _1748.x), max(_1747.y, _1748.y));
    vec2 _1756 = fract(_1733);
    vec2 _1757 = vec2(textureSize(_14[nonuniformEXT(_1470)], _1740));
    ivec2 _1759 = -_1735;
    vec2 _1761 = _1756 * ldexp(_1757, _1759);
    ResType _1764;
    _1764._m0 = frexp((_1755 * _1757) - vec2(0.00390625), _1764._m1);
    vec2 _1769 = min(ldexp(vec2(0.5), clamp(_1764._m1, ivec2(0), ivec2(4)) + _1759), vec2(0.5));
    ivec2 _1773 = ivec2(max(_1761 - _1769, vec2(0.0)));
    bvec2 _1775 = notEqual(_1773, ivec2(_1761 + _1769));
    bool _1776 = _1775.x;
    bool _1777 = _1775.y;
    WriteFeedbackNonUniform(_27[_1467], _1773, uint64_t(((1 | (_1776 ? 2 : 0)) | (_1777 ? 4 : 0)) | ((_1776 && _1777) ? 8 : 0)) << uint64_t(_1740 * 4), !gl_HelperInvocation);
    vec2 _1792 = vec2(textureSize(_14[nonuniformEXT(_1470)], _1742));
    ivec2 _1794 = -_1735;
    vec2 _1796 = _1756 * ldexp(_1792, _1794);
    ResType _1799;
    _1799._m0 = frexp((_1755 * _1792) - vec2(0.00390625), _1799._m1);
    vec2 _1804 = min(ldexp(vec2(0.5), clamp(_1799._m1, ivec2(0), ivec2(4)) + _1794), vec2(0.5));
    ivec2 _1808 = ivec2(max(_1796 - _1804, vec2(0.0)));
    bvec2 _1810 = notEqual(_1808, ivec2(_1796 + _1804));
    bool _1811 = _1810.x;
    bool _1812 = _1810.y;
    WriteFeedbackNonUniform(_27[_1467], _1808, uint64_t(((1 | (_1811 ? 2 : 0)) | (_1812 ? 4 : 0)) | ((_1811 && _1812) ? 8 : 0)) << uint64_t(_1742 * 4), (!gl_HelperInvocation) && (_1740 != _1742));
    int _1829 = int(roundEven(gl_FragCoord.z));
    vec2 _1830 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1833 = imageSize(_30[nonuniformEXT(_1598)]).xy & ivec2(15);
    vec2 _1836 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1601], _36[_1473])), _1830);
    float _1837 = _1836.x;
    int _1838 = int(_1837);
    int _1840 = int(_1837 + 0.9970703125);
    vec2 _1845 = abs(dFdx(_1830));
    vec2 _1846 = abs(dFdy(_1830));
    vec2 _1853 = vec2(max(_1845.x, _1846.x), max(_1845.y, _1846.y));
    vec2 _1854 = fract(_1830);
    vec2 _1855 = vec2(textureSize(_17[nonuniformEXT(_1601)], _1838).xy);
    ivec2 _1858 = -_1833;
    vec2 _1860 = _1854 * ldexp(_1855, _1858);
    ResType _1863;
    _1863._m0 = frexp((_1853 * _1855) - vec2(0.00390625), _1863._m1);
    vec2 _1868 = min(ldexp(vec2(0.5), clamp(_1863._m1, ivec2(0), ivec2(4)) + _1858), vec2(0.5));
    ivec2 _1872 = ivec2(max(_1860 - _1868, vec2(0.0)));
    bvec2 _1874 = notEqual(_1872, ivec2(_1860 + _1868));
    bool _1875 = _1874.x;
    bool _1876 = _1874.y;
    WriteFeedbackArrayNonUniform(_30[_1598], ivec3(_1872, _1829), uint64_t(((1 | (_1875 ? 2 : 0)) | (_1876 ? 4 : 0)) | ((_1875 && _1876) ? 8 : 0)) << uint64_t(_1838 * 4), !gl_HelperInvocation);
    vec2 _1892 = vec2(textureSize(_17[nonuniformEXT(_1601)], _1840).xy);
    ivec2 _1895 = -_1833;
    vec2 _1897 = _1854 * ldexp(_1892, _1895);
    ResType _1900;
    _1900._m0 = frexp((_1853 * _1892) - vec2(0.00390625), _1900._m1);
    vec2 _1905 = min(ldexp(vec2(0.5), clamp(_1900._m1, ivec2(0), ivec2(4)) + _1895), vec2(0.5));
    ivec2 _1909 = ivec2(max(_1897 - _1905, vec2(0.0)));
    bvec2 _1911 = notEqual(_1909, ivec2(_1897 + _1905));
    bool _1912 = _1911.x;
    bool _1913 = _1911.y;
    WriteFeedbackArrayNonUniform(_30[_1598], ivec3(_1909, _1829), uint64_t(((1 | (_1912 ? 2 : 0)) | (_1913 ? 4 : 0)) | ((_1912 && _1913) ? 8 : 0)) << uint64_t(_1840 * 4), (!gl_HelperInvocation) && (_1838 != _1840));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 1934
; Schema: 0
OpCapability Shader
OpCapability Int64
OpCapability Int64Atomics
OpCapability SampledImageArrayDynamicIndexing
OpCapability StorageImageArrayDynamicIndexing
OpCapability ImageQuery
OpCapability GroupNonUniform
OpCapability GroupNonUniformArithmetic
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformQuad
OpCapability Int64ImageEXT
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability StorageImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_shader_image_int64"
%78 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %39 %42 %43 %45 %48 %1932
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %39 "SV_Position"
OpName %42 "GRADX"
OpName %43 "GRADY"
OpName %45 "CLAMP"
OpName %48 "IDX"
OpName %122 "ResType"
OpName %166 "WriteFeedback"
OpName %162 "img"
OpName %163 "coord"
OpName %164 "value"
OpName %165 "active_lane"
OpName %179 "is_done"
OpName %831 "WriteFeedbackArray"
OpName %827 "img"
OpName %828 "coord"
OpName %829 "value"
OpName %830 "active_lane"
OpName %842 "is_done"
OpName %1539 "WriteFeedbackNonUniform"
OpName %1535 "img"
OpName %1536 "coord"
OpName %1537 "value"
OpName %1538 "active_lane"
OpName %1550 "is_done"
OpName %1672 "WriteFeedbackArrayNonUniform"
OpName %1668 "img"
OpName %1669 "coord"
OpName %1670 "value"
OpName %1671 "active_lane"
OpName %1683 "is_done"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %17 DescriptorSet 2
OpDecorate %17 Binding 0
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 0
OpDecorate %24 DescriptorSet 0
OpDecorate %24 Binding 1
OpDecorate %27 DescriptorSet 1
OpDecorate %27 Binding 0
OpDecorate %30 DescriptorSet 2
OpDecorate %30 Binding 0
OpDecorate %33 DescriptorSet 0
OpDecorate %33 Binding 0
OpDecorate %36 DescriptorSet 1
OpDecorate %36 Binding 0
OpDecorate %39 BuiltIn FragCoord
OpDecorate %42 Location 1
OpDecorate %43 Location 1
OpDecorate %43 Component 2
OpDecorate %45 Location 2
OpDecorate %48 Flat
OpDecorate %48 Location 3
OpDecorate %1467 NonUniform
OpDecorate %1469 NonUniform
OpDecorate %1470 NonUniform
OpDecorate %1472 NonUniform
OpDecorate %1473 NonUniform
OpDecorate %1475 NonUniform
OpDecorate %1481 NonUniform
OpDecorate %1558 NonUniform
OpDecorate %1598 NonUniform
OpDecorate %1600 NonUniform
OpDecorate %1601 NonUniform
OpDecorate %1603 NonUniform
OpDecorate %1612 NonUniform
OpDecorate %1691 NonUniform
OpDecorate %1932 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeRuntimeArray %6
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeRuntimeArray %9
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeInt 64 0
%19 = OpTypeImage %18 2D 0 0 0 2 R64ui
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeImage %18 2D 0 1 0 2 R64ui
%23 = OpTypePointer UniformConstant %22
%24 = OpVariable %23 UniformConstant
%25 = OpTypeRuntimeArray %19
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeRuntimeArray %22
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypeSampler
%32 = OpTypePointer UniformConstant %31
%33 = OpVariable %32 UniformConstant
%34 = OpTypeRuntimeArray %31
%35 = OpTypePointer UniformConstant %34
%36 = OpVariable %35 UniformConstant
%37 = OpTypeVector %5 4
%38 = OpTypePointer Input %37
%39 = OpVariable %38 Input
%40 = OpTypeVector %5 2
%41 = OpTypePointer Input %40
%42 = OpVariable %41 Input
%43 = OpVariable %41 Input
%44 = OpTypePointer Input %5
%45 = OpVariable %44 Input
%46 = OpTypeInt 32 0
%47 = OpTypePointer Input %46
%48 = OpVariable %47 Input
%57 = OpConstant %46 0
%60 = OpConstant %46 1
%71 = OpConstant %46 2
%74 = OpConstant %46 3
%77 = OpConstant %5 1
%79 = OpTypeBool
%80 = OpTypeInt 32 1
%81 = OpTypeVector %79 2
%82 = OpTypeVector %80 2
%86 = OpConstant %80 15
%87 = OpConstantComposite %82 %86 %86
%90 = OpConstant %80 1
%91 = OpTypeSampledImage %6
%97 = OpConstant %5 0.997070312
%120 = OpConstant %5 0.00390625
%121 = OpConstantComposite %40 %120 %120
%122 = OpTypeStruct %40 %82
%126 = OpConstant %80 0
%127 = OpConstantComposite %82 %126 %126
%128 = OpConstant %80 4
%129 = OpConstantComposite %82 %128 %128
%132 = OpConstant %5 0.5
%133 = OpConstantComposite %40 %132 %132
%137 = OpConstant %5 0
%138 = OpConstantComposite %40 %137 %137
%147 = OpConstant %80 2
%152 = OpConstant %80 8
%160 = OpTypePointer Image %18
%161 = OpTypeFunction %1 %20 %82 %18 %79
%177 = OpConstantFalse %79
%178 = OpTypePointer Function %79
%236 = OpConstant %5 14
%762 = OpTypeVector %80 3
%768 = OpTypeSampledImage %9
%825 = OpTypeVector %79 3
%826 = OpTypeFunction %1 %23 %762 %18 %79
%1931 = OpTypePointer Input %79
%1932 = OpVariable %1931 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %1930
%1930 = OpLabel
%49 = OpLoad %22 %24
%50 = OpLoad %19 %21
%51 = OpLoad %9 %11
%52 = OpLoad %6 %8
%53 = OpLoad %31 %33
%54 = OpLoad %46 %48
%55 = OpLoad %5 %45
%56 = OpAccessChain %44 %43 %57
%58 = OpLoad %5 %56
%59 = OpAccessChain %44 %43 %60
%61 = OpLoad %5 %59
%62 = OpAccessChain %44 %42 %57
%63 = OpLoad %5 %62
%64 = OpAccessChain %44 %42 %60
%65 = OpLoad %5 %64
%66 = OpAccessChain %44 %39 %57
%67 = OpLoad %5 %66
%68 = OpAccessChain %44 %39 %60
%69 = OpLoad %5 %68
%70 = OpAccessChain %44 %39 %71
%72 = OpLoad %5 %70
%73 = OpAccessChain %44 %39 %74
%75 = OpLoad %5 %73
%76 = OpFDiv %5 %77 %75
%83 = OpCompositeConstruct %40 %67 %69
%84 = OpImageQuerySize %82 %50
%85 = OpBitwiseAnd %82 %84 %87
%88 = OpImageQueryLevels %80 %52
%89 = OpISub %80 %88 %90
%92 = OpSampledImage %91 %52 %53
%93 = OpImageQueryLod %40 %92 %83
%94 = OpCompositeExtract %5 %93 0
%95 = OpConvertFToS %80 %94
%96 = OpFAdd %5 %94 %97
%98 = OpConvertFToS %80 %96
%99 = OpExtInst %80 %78 SMin %98 %89
%100 = OpINotEqual %79 %95 %98
%101 = OpDPdx %40 %83
%102 = OpDPdy %40 %83
%103 = OpExtInst %40 %78 FAbs %101
%104 = OpExtInst %40 %78 FAbs %102
%105 = OpCompositeExtract %5 %103 0
%106 = OpCompositeExtract %5 %104 0
%107 = OpCompositeExtract %5 %103 1
%108 = OpCompositeExtract %5 %104 1
%109 = OpExtInst %5 %78 FMax %105 %106
%110 = OpExtInst %5 %78 FMax %107 %108
%111 = OpCompositeConstruct %40 %109 %110
%112 = OpExtInst %40 %78 Fract %83
%114 = OpImageQuerySizeLod %82 %52 %95
%113 = OpConvertSToF %40 %114
%115 = OpSNegate %82 %85
%116 = OpExtInst %40 %78 Ldexp %113 %115
%117 = OpFMul %40 %112 %116
%118 = OpFMul %40 %111 %113
%119 = OpFSub %40 %118 %121
%123 = OpExtInst %122 %78 FrexpStruct %119
%124 = OpCompositeExtract %82 %123 1
%125 = OpExtInst %82 %78 SClamp %124 %127 %129
%130 = OpIAdd %82 %125 %115
%131 = OpExtInst %40 %78 Ldexp %133 %130
%134 = OpExtInst %40 %78 FMin %131 %133
%135 = OpFSub %40 %117 %134
%136 = OpExtInst %40 %78 FMax %135 %138
%139 = OpFAdd %40 %117 %134
%140 = OpConvertFToS %82 %136
%141 = OpConvertFToS %82 %139
%142 = OpINotEqual %81 %140 %141
%143 = OpCompositeExtract %79 %142 0
%144 = OpCompositeExtract %79 %142 1
%145 = OpLogicalAnd %79 %143 %144
%146 = OpSelect %80 %143 %147 %126
%148 = OpBitwiseOr %80 %90 %146
%149 = OpSelect %80 %144 %128 %126
%150 = OpBitwiseOr %80 %148 %149
%151 = OpSelect %80 %145 %152 %126
%153 = OpBitwiseOr %80 %150 %151
%154 = OpSConvert %18 %153
%155 = OpIMul %80 %95 %128
%156 = OpSConvert %18 %155
%157 = OpShiftLeftLogical %18 %154 %156
%158 = OpLoad %79 %1932
%159 = OpLogicalNot %79 %158
%190 = OpFunctionCall %1 %166 %21 %140 %157 %159
%192 = OpImageQuerySizeLod %82 %52 %98
%191 = OpConvertSToF %40 %192
%193 = OpSNegate %82 %85
%194 = OpExtInst %40 %78 Ldexp %191 %193
%195 = OpFMul %40 %112 %194
%196 = OpFMul %40 %111 %191
%197 = OpFSub %40 %196 %121
%198 = OpExtInst %122 %78 FrexpStruct %197
%199 = OpCompositeExtract %82 %198 1
%200 = OpExtInst %82 %78 SClamp %199 %127 %129
%201 = OpIAdd %82 %200 %193
%202 = OpExtInst %40 %78 Ldexp %133 %201
%203 = OpExtInst %40 %78 FMin %202 %133
%204 = OpFSub %40 %195 %203
%205 = OpExtInst %40 %78 FMax %204 %138
%206 = OpFAdd %40 %195 %203
%207 = OpConvertFToS %82 %205
%208 = OpConvertFToS %82 %206
%209 = OpINotEqual %81 %207 %208
%210 = OpCompositeExtract %79 %209 0
%211 = OpCompositeExtract %79 %209 1
%212 = OpLogicalAnd %79 %210 %211
%213 = OpSelect %80 %210 %147 %126
%214 = OpBitwiseOr %80 %90 %213
%215 = OpSelect %80 %211 %128 %126
%216 = OpBitwiseOr %80 %214 %215
%217 = OpSelect %80 %212 %152 %126
%218 = OpBitwiseOr %80 %216 %217
%219 = OpSConvert %18 %218
%220 = OpIMul %80 %98 %128
%221 = OpSConvert %18 %220
%222 = OpShiftLeftLogical %18 %219 %221
%223 = OpLoad %79 %1932
%224 = OpLogicalNot %79 %223
%225 = OpLogicalAnd %79 %224 %100
%226 = OpFunctionCall %1 %166 %21 %207 %222 %225
%227 = OpCompositeConstruct %40 %67 %69
%228 = OpImageQuerySize %82 %50
%229 = OpBitwiseAnd %82 %228 %87
%230 = OpImageQueryLevels %80 %52
%231 = OpISub %80 %230 %90
%232 = OpImageQueryLod %40 %92 %227
%233 = OpCompositeExtract %5 %232 0
%234 = OpExtInst %5 %78 FMax %233 %55
%235 = OpExtInst %5 %78 FMin %234 %236
%237 = OpConvertFToS %80 %235
%238 = OpFAdd %5 %235 %97
%239 = OpConvertFToS %80 %238
%240 = OpExtInst %80 %78 SMin %239 %231
%241 = OpINotEqual %79 %237 %239
%242 = OpDPdx %40 %227
%243 = OpDPdy %40 %227
%244 = OpExtInst %40 %78 FAbs %242
%245 = OpExtInst %40 %78 FAbs %243
%246 = OpCompositeExtract %5 %244 0
%247 = OpCompositeExtract %5 %245 0
%248 = OpCompositeExtract %5 %244 1
%249 = OpCompositeExtract %5 %245 1
%250 = OpExtInst %5 %78 FMax %246 %247
%251 = OpExtInst %5 %78 FMax %248 %249
%252 = OpCompositeConstruct %40 %250 %251
%253 = OpExtInst %40 %78 Fract %227
%255 = OpImageQuerySizeLod %82 %52 %237
%254 = OpConvertSToF %40 %255
%256 = OpSNegate %82 %229
%257 = OpExtInst %40 %78 Ldexp %254 %256
%258 = OpFMul %40 %253 %257
%259 = OpFMul %40 %252 %254
%260 = OpFSub %40 %259 %121
%261 = OpExtInst %122 %78 FrexpStruct %260
%262 = OpCompositeExtract %82 %261 1
%263 = OpExtInst %82 %78 SClamp %262 %127 %129
%264 = OpIAdd %82 %263 %256
%265 = OpExtInst %40 %78 Ldexp %133 %264
%266 = OpExtInst %40 %78 FMin %265 %133
%267 = OpFSub %40 %258 %266
%268 = OpExtInst %40 %78 FMax %267 %138
%269 = OpFAdd %40 %258 %266
%270 = OpConvertFToS %82 %268
%271 = OpConvertFToS %82 %269
%272 = OpINotEqual %81 %270 %271
%273 = OpCompositeExtract %79 %272 0
%274 = OpCompositeExtract %79 %272 1
%275 = OpLogicalAnd %79 %273 %274
%276 = OpSelect %80 %273 %147 %126
%277 = OpBitwiseOr %80 %90 %276
%278 = OpSelect %80 %274 %128 %126
%279 = OpBitwiseOr %80 %277 %278
%280 = OpSelect %80 %275 %152 %126
%281 = OpBitwiseOr %80 %279 %280
%282 = OpSConvert %18 %281
%283 = OpIMul %80 %237 %128
%284 = OpSConvert %18 %283
%285 = OpShiftLeftLogical %18 %282 %284
%286 = OpLoad %79 %1932
%287 = OpLogicalNot %79 %286
%288 = OpFunctionCall %1 %166 %21 %270 %285 %287
%290 = OpImageQuerySizeLod %82 %52 %239
%289 = OpConvertSToF %40 %290
%291 = OpSNegate %82 %229
%292 = OpExtInst %40 %78 Ldexp %289 %291
%293 = OpFMul %40 %253 %292
%294 = OpFMul %40 %252 %289
%295 = OpFSub %40 %294 %121
%296 = OpExtInst %122 %78 FrexpStruct %295
%297 = OpCompositeExtract %82 %296 1
%298 = OpExtInst %82 %78 SClamp %297 %127 %129
%299 = OpIAdd %82 %298 %291
%300 = OpExtInst %40 %78 Ldexp %133 %299
%301 = OpExtInst %40 %78 FMin %300 %133
%302 = OpFSub %40 %293 %301
%303 = OpExtInst %40 %78 FMax %302 %138
%304 = OpFAdd %40 %293 %301
%305 = OpConvertFToS %82 %303
%306 = OpConvertFToS %82 %304
%307 = OpINotEqual %81 %305 %306
%308 = OpCompositeExtract %79 %307 0
%309 = OpCompositeExtract %79 %307 1
%310 = OpLogicalAnd %79 %308 %309
%311 = OpSelect %80 %308 %147 %126
%312 = OpBitwiseOr %80 %90 %311
%313 = OpSelect %80 %309 %128 %126
%314 = OpBitwiseOr %80 %312 %313
%315 = OpSelect %80 %310 %152 %126
%316 = OpBitwiseOr %80 %314 %315
%317 = OpSConvert %18 %316
%318 = OpIMul %80 %239 %128
%319 = OpSConvert %18 %318
%320 = OpShiftLeftLogical %18 %317 %319
%321 = OpLoad %79 %1932
%322 = OpLogicalNot %79 %321
%323 = OpLogicalAnd %79 %322 %241
%324 = OpFunctionCall %1 %166 %21 %305 %320 %323
%325 = OpCompositeConstruct %40 %67 %69
%326 = OpImageQuerySize %82 %50
%327 = OpBitwiseAnd %82 %326 %87
%328 = OpImageQueryLevels %80 %52
%329 = OpISub %80 %328 %90
%330 = OpConvertSToF %5 %329
%331 = OpExtInst %5 %78 NClamp %72 %137 %330
%332 = OpConvertFToS %80 %331
%333 = OpFAdd %5 %331 %97
%334 = OpConvertFToS %80 %333
%335 = OpExtInst %80 %78 SMin %334 %329
%336 = OpINotEqual %79 %332 %334
%337 = OpExtInst %40 %78 Fract %325
%339 = OpImageQuerySizeLod %82 %52 %332
%338 = OpConvertSToF %40 %339
%340 = OpSNegate %82 %327
%341 = OpExtInst %40 %78 Ldexp %338 %340
%342 = OpFMul %40 %337 %341
%343 = OpExtInst %40 %78 Ldexp %133 %340
%344 = OpFSub %40 %342 %343
%345 = OpExtInst %40 %78 FMax %344 %138
%346 = OpFAdd %40 %342 %343
%347 = OpConvertFToS %82 %345
%348 = OpConvertFToS %82 %346
%349 = OpINotEqual %81 %347 %348
%350 = OpCompositeExtract %79 %349 0
%351 = OpCompositeExtract %79 %349 1
%352 = OpLogicalAnd %79 %350 %351
%353 = OpSelect %80 %350 %147 %126
%354 = OpBitwiseOr %80 %90 %353
%355 = OpSelect %80 %351 %128 %126
%356 = OpBitwiseOr %80 %354 %355
%357 = OpSelect %80 %352 %152 %126
%358 = OpBitwiseOr %80 %356 %357
%359 = OpSConvert %18 %358
%360 = OpIMul %80 %332 %128
%361 = OpSConvert %18 %360
%362 = OpShiftLeftLogical %18 %359 %361
%363 = OpLoad %79 %1932
%364 = OpLogicalNot %79 %363
%365 = OpFunctionCall %1 %166 %21 %347 %362 %364
%367 = OpImageQuerySizeLod %82 %52 %334
%366 = OpConvertSToF %40 %367
%368 = OpSNegate %82 %327
%369 = OpExtInst %40 %78 Ldexp %366 %368
%370 = OpFMul %40 %337 %369
%371 = OpExtInst %40 %78 Ldexp %133 %368
%372 = OpFSub %40 %370 %371
%373 = OpExtInst %40 %78 FMax %372 %138
%374 = OpFAdd %40 %370 %371
%375 = OpConvertFToS %82 %373
%376 = OpConvertFToS %82 %374
%377 = OpINotEqual %81 %375 %376
%378 = OpCompositeExtract %79 %377 0
%379 = OpCompositeExtract %79 %377 1
%380 = OpLogicalAnd %79 %378 %379
%381 = OpSelect %80 %378 %147 %126
%382 = OpBitwiseOr %80 %90 %381
%383 = OpSelect %80 %379 %128 %126
%384 = OpBitwiseOr %80 %382 %383
%385 = OpSelect %80 %380 %152 %126
%386 = OpBitwiseOr %80 %384 %385
%387 = OpSConvert %18 %386
%388 = OpIMul %80 %334 %128
%389 = OpSConvert %18 %388
%390 = OpShiftLeftLogical %18 %387 %389
%391 = OpLoad %79 %1932
%392 = OpLogicalNot %79 %391
%393 = OpLogicalAnd %79 %392 %336
%394 = OpFunctionCall %1 %166 %21 %375 %390 %393
%395 = OpCompositeConstruct %40 %67 %69
%396 = OpImageQuerySize %82 %50
%397 = OpBitwiseAnd %82 %396 %87
%398 = OpImageQueryLevels %80 %52
%399 = OpISub %80 %398 %90
%401 = OpImageQuerySizeLod %82 %52 %126
%400 = OpConvertSToF %40 %401
%402 = OpCompositeConstruct %40 %63 %65
%403 = OpCompositeConstruct %40 %58 %61
%404 = OpFMul %40 %400 %402
%405 = OpFMul %40 %400 %403
%406 = OpDot %5 %404 %404
%407 = OpDot %5 %405 %405
%408 = OpExtInst %5 %78 FMax %406 %407
%409 = OpExtInst %5 %78 Log2 %408
%410 = OpFMul %5 %409 %132
%411 = OpConvertSToF %5 %399
%412 = OpExtInst %5 %78 NClamp %410 %137 %411
%413 = OpConvertFToS %80 %412
%414 = OpFAdd %5 %412 %97
%415 = OpConvertFToS %80 %414
%416 = OpExtInst %80 %78 SMin %415 %399
%417 = OpINotEqual %79 %413 %415
%418 = OpExtInst %40 %78 Fract %395
%420 = OpImageQuerySizeLod %82 %52 %413
%419 = OpConvertSToF %40 %420
%421 = OpSNegate %82 %397
%422 = OpExtInst %40 %78 Ldexp %419 %421
%423 = OpFMul %40 %418 %422
%424 = OpExtInst %40 %78 Ldexp %133 %421
%425 = OpFSub %40 %423 %424
%426 = OpExtInst %40 %78 FMax %425 %138
%427 = OpFAdd %40 %423 %424
%428 = OpConvertFToS %82 %426
%429 = OpConvertFToS %82 %427
%430 = OpINotEqual %81 %428 %429
%431 = OpCompositeExtract %79 %430 0
%432 = OpCompositeExtract %79 %430 1
%433 = OpLogicalAnd %79 %431 %432
%434 = OpSelect %80 %431 %147 %126
%435 = OpBitwiseOr %80 %90 %434
%436 = OpSelect %80 %432 %128 %126
%437 = OpBitwiseOr %80 %435 %436
%438 = OpSelect %80 %433 %152 %126
%439 = OpBitwiseOr %80 %437 %438
%440 = OpSConvert %18 %439
%441 = OpIMul %80 %413 %128
%442 = OpSConvert %18 %441
%443 = OpShiftLeftLogical %18 %440 %442
%444 = OpLoad %79 %1932
%445 = OpLogicalNot %79 %444
%446 = OpFunctionCall %1 %166 %21 %428 %443 %445
%448 = OpImageQuerySizeLod %82 %52 %415
%447 = OpConvertSToF %40 %448
%449 = OpSNegate %82 %397
%450 = OpExtInst %40 %78 Ldexp %447 %449
%451 = OpFMul %40 %418 %450
%452 = OpExtInst %40 %78 Ldexp %133 %449
%453 = OpFSub %40 %451 %452
%454 = OpExtInst %40 %78 FMax %453 %138
%455 = OpFAdd %40 %451 %452
%456 = OpConvertFToS %82 %454
%457 = OpConvertFToS %82 %455
%458 = OpINotEqual %81 %456 %457
%459 = OpCompositeExtract %79 %458 0
%460 = OpCompositeExtract %79 %458 1
%461 = OpLogicalAnd %79 %459 %460
%462 = OpSelect %80 %459 %147 %126
%463 = OpBitwiseOr %80 %90 %462
%464 = OpSelect %80 %460 %128 %126
%465 = OpBitwiseOr %80 %463 %464
%466 = OpSelect %80 %461 %152 %126
%467 = OpBitwiseOr %80 %465 %466
%468 = OpSConvert %18 %467
%469 = OpIMul %80 %415 %128
%470 = OpSConvert %18 %469
%471 = OpShiftLeftLogical %18 %468 %470
%472 = OpLoad %79 %1932
%473 = OpLogicalNot %79 %472
%474 = OpLogicalAnd %79 %473 %417
%475 = OpFunctionCall %1 %166 %21 %456 %471 %474
%476 = OpCompositeConstruct %40 %67 %69
%477 = OpImageQuerySize %82 %50
%478 = OpBitwiseAnd %82 %477 %87
%479 = OpImageQueryLevels %80 %52
%480 = OpISub %80 %479 %90
%482 = OpImageQuerySizeLod %82 %52 %126
%481 = OpConvertSToF %40 %482
%483 = OpCompositeConstruct %40 %63 %65
%484 = OpCompositeConstruct %40 %58 %61
%485 = OpFMul %40 %481 %483
%486 = OpFMul %40 %481 %484
%487 = OpDot %5 %485 %485
%488 = OpDot %5 %486 %486
%489 = OpExtInst %5 %78 FMax %487 %488
%490 = OpExtInst %5 %78 Log2 %489
%491 = OpFMul %5 %490 %132
%492 = OpConvertSToF %5 %480
%493 = OpExtInst %5 %78 NClamp %491 %137 %492
%494 = OpExtInst %5 %78 FMax %493 %55
%495 = OpExtInst %5 %78 FMin %494 %236
%496 = OpConvertFToS %80 %495
%497 = OpFAdd %5 %495 %97
%498 = OpConvertFToS %80 %497
%499 = OpExtInst %80 %78 SMin %498 %480
%500 = OpINotEqual %79 %496 %498
%501 = OpExtInst %40 %78 Fract %476
%503 = OpImageQuerySizeLod %82 %52 %496
%502 = OpConvertSToF %40 %503
%504 = OpSNegate %82 %478
%505 = OpExtInst %40 %78 Ldexp %502 %504
%506 = OpFMul %40 %501 %505
%507 = OpExtInst %40 %78 Ldexp %133 %504
%508 = OpFSub %40 %506 %507
%509 = OpExtInst %40 %78 FMax %508 %138
%510 = OpFAdd %40 %506 %507
%511 = OpConvertFToS %82 %509
%512 = OpConvertFToS %82 %510
%513 = OpINotEqual %81 %511 %512
%514 = OpCompositeExtract %79 %513 0
%515 = OpCompositeExtract %79 %513 1
%516 = OpLogicalAnd %79 %514 %515
%517 = OpSelect %80 %514 %147 %126
%518 = OpBitwiseOr %80 %90 %517
%519 = OpSelect %80 %515 %128 %126
%520 = OpBitwiseOr %80 %518 %519
%521 = OpSelect %80 %516 %152 %126
%522 = OpBitwiseOr %80 %520 %521
%523 = OpSConvert %18 %522
%524 = OpIMul %80 %496 %128
%525 = OpSConvert %18 %524
%526 = OpShiftLeftLogical %18 %523 %525
%527 = OpLoad %79 %1932
%528 = OpLogicalNot %79 %527
%529 = OpFunctionCall %1 %166 %21 %511 %526 %528
%531 = OpImageQuerySizeLod %82 %52 %498
%530 = OpConvertSToF %40 %531
%532 = OpSNegate %82 %478
%533 = OpExtInst %40 %78 Ldexp %530 %532
%534 = OpFMul %40 %501 %533
%535 = OpExtInst %40 %78 Ldexp %133 %532
%536 = OpFSub %40 %534 %535
%537 = OpExtInst %40 %78 FMax %536 %138
%538 = OpFAdd %40 %534 %535
%539 = OpConvertFToS %82 %537
%540 = OpConvertFToS %82 %538
%541 = OpINotEqual %81 %539 %540
%542 = OpCompositeExtract %79 %541 0
%543 = OpCompositeExtract %79 %541 1
%544 = OpLogicalAnd %79 %542 %543
%545 = OpSelect %80 %542 %147 %126
%546 = OpBitwiseOr %80 %90 %545
%547 = OpSelect %80 %543 %128 %126
%548 = OpBitwiseOr %80 %546 %547
%549 = OpSelect %80 %544 %152 %126
%550 = OpBitwiseOr %80 %548 %549
%551 = OpSConvert %18 %550
%552 = OpIMul %80 %498 %128
%553 = OpSConvert %18 %552
%554 = OpShiftLeftLogical %18 %551 %553
%555 = OpLoad %79 %1932
%556 = OpLogicalNot %79 %555
%557 = OpLogicalAnd %79 %556 %500
%558 = OpFunctionCall %1 %166 %21 %539 %554 %557
%559 = OpCompositeConstruct %40 %67 %69
%560 = OpImageQuerySize %82 %50
%561 = OpBitwiseAnd %82 %560 %87
%562 = OpImageQueryLevels %80 %52
%563 = OpISub %80 %562 %90
%564 = OpExtInst %5 %78 Exp2 %72
%565 = OpGroupNonUniformQuadBroadcast %5 %74 %564 %57
%566 = OpVectorTimesScalar %40 %559 %565
%567 = OpImageQueryLod %40 %92 %566
%568 = OpCompositeExtract %5 %567 0
%569 = OpConvertFToS %80 %568
%570 = OpFAdd %5 %568 %97
%571 = OpConvertFToS %80 %570
%572 = OpExtInst %80 %78 SMin %571 %563
%573 = OpINotEqual %79 %569 %571
%574 = OpDPdx %40 %559
%575 = OpDPdy %40 %559
%576 = OpExtInst %40 %78 FAbs %574
%577 = OpExtInst %40 %78 FAbs %575
%578 = OpCompositeExtract %5 %576 0
%579 = OpCompositeExtract %5 %577 0
%580 = OpCompositeExtract %5 %576 1
%581 = OpCompositeExtract %5 %577 1
%582 = OpExtInst %5 %78 FMax %578 %579
%583 = OpExtInst %5 %78 FMax %580 %581
%584 = OpCompositeConstruct %40 %582 %583
%585 = OpVectorTimesScalar %40 %584 %564
%586 = OpExtInst %40 %78 Fract %559
%588 = OpImageQuerySizeLod %82 %52 %569
%587 = OpConvertSToF %40 %588
%589 = OpSNegate %82 %561
%590 = OpExtInst %40 %78 Ldexp %587 %589
%591 = OpFMul %40 %586 %590
%592 = OpFMul %40 %585 %587
%593 = OpFSub %40 %592 %121
%594 = OpExtInst %122 %78 FrexpStruct %593
%595 = OpCompositeExtract %82 %594 1
%596 = OpExtInst %82 %78 SClamp %595 %127 %129
%597 = OpIAdd %82 %596 %589
%598 = OpExtInst %40 %78 Ldexp %133 %597
%599 = OpExtInst %40 %78 FMin %598 %133
%600 = OpFSub %40 %591 %599
%601 = OpExtInst %40 %78 FMax %600 %138
%602 = OpFAdd %40 %591 %599
%603 = OpConvertFToS %82 %601
%604 = OpConvertFToS %82 %602
%605 = OpINotEqual %81 %603 %604
%606 = OpCompositeExtract %79 %605 0
%607 = OpCompositeExtract %79 %605 1
%608 = OpLogicalAnd %79 %606 %607
%609 = OpSelect %80 %606 %147 %126
%610 = OpBitwiseOr %80 %90 %609
%611 = OpSelect %80 %607 %128 %126
%612 = OpBitwiseOr %80 %610 %611
%613 = OpSelect %80 %608 %152 %126
%614 = OpBitwiseOr %80 %612 %613
%615 = OpSConvert %18 %614
%616 = OpIMul %80 %569 %128
%617 = OpSConvert %18 %616
%618 = OpShiftLeftLogical %18 %615 %617
%619 = OpLoad %79 %1932
%620 = OpLogicalNot %79 %619
%621 = OpFunctionCall %1 %166 %21 %603 %618 %620
%623 = OpImageQuerySizeLod %82 %52 %571
%622 = OpConvertSToF %40 %623
%624 = OpSNegate %82 %561
%625 = OpExtInst %40 %78 Ldexp %622 %624
%626 = OpFMul %40 %586 %625
%627 = OpFMul %40 %585 %622
%628 = OpFSub %40 %627 %121
%629 = OpExtInst %122 %78 FrexpStruct %628
%630 = OpCompositeExtract %82 %629 1
%631 = OpExtInst %82 %78 SClamp %630 %127 %129
%632 = OpIAdd %82 %631 %624
%633 = OpExtInst %40 %78 Ldexp %133 %632
%634 = OpExtInst %40 %78 FMin %633 %133
%635 = OpFSub %40 %626 %634
%636 = OpExtInst %40 %78 FMax %635 %138
%637 = OpFAdd %40 %626 %634
%638 = OpConvertFToS %82 %636
%639 = OpConvertFToS %82 %637
%640 = OpINotEqual %81 %638 %639
%641 = OpCompositeExtract %79 %640 0
%642 = OpCompositeExtract %79 %640 1
%643 = OpLogicalAnd %79 %641 %642
%644 = OpSelect %80 %641 %147 %126
%645 = OpBitwiseOr %80 %90 %644
%646 = OpSelect %80 %642 %128 %126
%647 = OpBitwiseOr %80 %645 %646
%648 = OpSelect %80 %643 %152 %126
%649 = OpBitwiseOr %80 %647 %648
%650 = OpSConvert %18 %649
%651 = OpIMul %80 %571 %128
%652 = OpSConvert %18 %651
%653 = OpShiftLeftLogical %18 %650 %652
%654 = OpLoad %79 %1932
%655 = OpLogicalNot %79 %654
%656 = OpLogicalAnd %79 %655 %573
%657 = OpFunctionCall %1 %166 %21 %638 %653 %656
%658 = OpCompositeConstruct %40 %67 %69
%659 = OpImageQuerySize %82 %50
%660 = OpBitwiseAnd %82 %659 %87
%661 = OpImageQueryLevels %80 %52
%662 = OpISub %80 %661 %90
%663 = OpExtInst %5 %78 Exp2 %72
%664 = OpGroupNonUniformQuadBroadcast %5 %74 %663 %57
%665 = OpVectorTimesScalar %40 %658 %664
%666 = OpImageQueryLod %40 %92 %665
%667 = OpCompositeExtract %5 %666 0
%668 = OpExtInst %5 %78 FMax %667 %55
%669 = OpExtInst %5 %78 FMin %668 %236
%670 = OpConvertFToS %80 %669
%671 = OpFAdd %5 %669 %97
%672 = OpConvertFToS %80 %671
%673 = OpExtInst %80 %78 SMin %672 %662
%674 = OpINotEqual %79 %670 %672
%675 = OpDPdx %40 %658
%676 = OpDPdy %40 %658
%677 = OpExtInst %40 %78 FAbs %675
%678 = OpExtInst %40 %78 FAbs %676
%679 = OpCompositeExtract %5 %677 0
%680 = OpCompositeExtract %5 %678 0
%681 = OpCompositeExtract %5 %677 1
%682 = OpCompositeExtract %5 %678 1
%683 = OpExtInst %5 %78 FMax %679 %680
%684 = OpExtInst %5 %78 FMax %681 %682
%685 = OpCompositeConstruct %40 %683 %684
%686 = OpVectorTimesScalar %40 %685 %663
%687 = OpExtInst %40 %78 Fract %658
%689 = OpImageQuerySizeLod %82 %52 %670
%688 = OpConvertSToF %40 %689
%690 = OpSNegate %82 %660
%691 = OpExtInst %40 %78 Ldexp %688 %690
%692 = OpFMul %40 %687 %691
%693 = OpFMul %40 %686 %688
%694 = OpFSub %40 %693 %121
%695 = OpExtInst %122 %78 FrexpStruct %694
%696 = OpCompositeExtract %82 %695 1
%697 = OpExtInst %82 %78 SClamp %696 %127 %129
%698 = OpIAdd %82 %697 %690
%699 = OpExtInst %40 %78 Ldexp %133 %698
%700 = OpExtInst %40 %78 FMin %699 %133
%701 = OpFSub %40 %692 %700
%702 = OpExtInst %40 %78 FMax %701 %138
%703 = OpFAdd %40 %692 %700
%704 = OpConvertFToS %82 %702
%705 = OpConvertFToS %82 %703
%706 = OpINotEqual %81 %704 %705
%707 = OpCompositeExtract %79 %706 0
%708 = OpCompositeExtract %79 %706 1
%709 = OpLogicalAnd %79 %707 %708
%710 = OpSelect %80 %707 %147 %126
%711 = OpBitwiseOr %80 %90 %710
%712 = OpSelect %80 %708 %128 %126
%713 = OpBitwiseOr %80 %711 %712
%714 = OpSelect %80 %709 %152 %126
%715 = OpBitwiseOr %80 %713 %714
%716 = OpSConvert %18 %715
%717 = OpIMul %80 %670 %128
%718 = OpSConvert %18 %717
%719 = OpShiftLeftLogical %18 %716 %718
%720 = OpLoad %79 %1932
%721 = OpLogicalNot %79 %720
%722 = OpFunctionCall %1 %166 %21 %704 %719 %721
%724 = OpImageQuerySizeLod %82 %52 %672
%723 = OpConvertSToF %40 %724
%725 = OpSNegate %82 %660
%726 = OpExtInst %40 %78 Ldexp %723 %725
%727 = OpFMul %40 %687 %726
%728 = OpFMul %40 %686 %723
%729 = OpFSub %40 %728 %121
%730 = OpExtInst %122 %78 FrexpStruct %729
%731 = OpCompositeExtract %82 %730 1
%732 = OpExtInst %82 %78 SClamp %731 %127 %129
%733 = OpIAdd %82 %732 %725
%734 = OpExtInst %40 %78 Ldexp %133 %733
%735 = OpExtInst %40 %78 FMin %734 %133
%736 = OpFSub %40 %727 %735
%737 = OpExtInst %40 %78 FMax %736 %138
%738 = OpFAdd %40 %727 %735
%739 = OpConvertFToS %82 %737
%740 = OpConvertFToS %82 %738
%741 = OpINotEqual %81 %739 %740
%742 = OpCompositeExtract %79 %741 0
%743 = OpCompositeExtract %79 %741 1
%744 = OpLogicalAnd %79 %742 %743
%745 = OpSelect %80 %742 %147 %126
%746 = OpBitwiseOr %80 %90 %745
%747 = OpSelect %80 %743 %128 %126
%748 = OpBitwiseOr %80 %746 %747
%749 = OpSelect %80 %744 %152 %126
%750 = OpBitwiseOr %80 %748 %749
%751 = OpSConvert %18 %750
%752 = OpIMul %80 %672 %128
%753 = OpSConvert %18 %752
%754 = OpShiftLeftLogical %18 %751 %753
%755 = OpLoad %79 %1932
%756 = OpLogicalNot %79 %755
%757 = OpLogicalAnd %79 %756 %674
%758 = OpFunctionCall %1 %166 %21 %739 %754 %757
%759 = OpExtInst %5 %78 RoundEven %72
%760 = OpConvertFToS %80 %759
%761 = OpCompositeConstruct %40 %67 %69
%763 = OpImageQuerySize %762 %49
%764 = OpVectorShuffle %82 %763 %763 0 1
%765 = OpBitwiseAnd %82 %764 %87
%766 = OpImageQueryLevels %80 %51
%767 = OpISub %80 %766 %90
%769 = OpSampledImage %768 %51 %53
%770 = OpImageQueryLod %40 %769 %761
%771 = OpCompositeExtract %5 %770 0
%772 = OpConvertFToS %80 %771
%773 = OpFAdd %5 %771 %97
%774 = OpConvertFToS %80 %773
%775 = OpExtInst %80 %78 SMin %774 %767
%776 = OpINotEqual %79 %772 %774
%777 = OpDPdx %40 %761
%778 = OpDPdy %40 %761
%779 = OpExtInst %40 %78 FAbs %777
%780 = OpExtInst %40 %78 FAbs %778
%781 = OpCompositeExtract %5 %779 0
%782 = OpCompositeExtract %5 %780 0
%783 = OpCompositeExtract %5 %779 1
%784 = OpCompositeExtract %5 %780 1
%785 = OpExtInst %5 %78 FMax %781 %782
%786 = OpExtInst %5 %78 FMax %783 %784
%787 = OpCompositeConstruct %40 %785 %786
%788 = OpExtInst %40 %78 Fract %761
%790 = OpImageQuerySizeLod %762 %51 %772
%791 = OpVectorShuffle %82 %790 %790 0 1
%789 = OpConvertSToF %40 %791
%792 = OpSNegate %82 %765
%793 = OpExtInst %40 %78 Ldexp %789 %792
%794 = OpFMul %40 %788 %793
%795 = OpFMul %40 %787 %789
%796 = OpFSub %40 %795 %121
%797 = OpExtInst %122 %78 FrexpStruct %796
%798 = OpCompositeExtract %82 %797 1
%799 = OpExtInst %82 %78 SClamp %798 %127 %129
%800 = OpIAdd %82 %799 %792
%801 = OpExtInst %40 %78 Ldexp %133 %800
%802 = OpExtInst %40 %78 FMin %801 %133
%803 = OpFSub %40 %794 %802
%804 = OpExtInst %40 %78 FMax %803 %138
%805 = OpFAdd %40 %794 %802
%806 = OpConvertFToS %82 %804
%807 = OpConvertFToS %82 %805
%808 = OpINotEqual %81 %806 %807
%809 = OpCompositeExtract %79 %808 0
%810 = OpCompositeExtract %79 %808 1
%811 = OpLogicalAnd %79 %809 %810
%812 = OpSelect %80 %809 %147 %126
%813 = OpBitwiseOr %80 %90 %812
%814 = OpSelect %80 %810 %128 %126
%815 = OpBitwiseOr %80 %813 %814
%816 = OpSelect %80 %811 %152 %126
%817 = OpBitwiseOr %80 %815 %816
%818 = OpSConvert %18 %817
%819 = OpIMul %80 %772 %128
%820 = OpSConvert %18 %819
%821 = OpShiftLeftLogical %18 %818 %820
%822 = OpCompositeConstruct %762 %806 %760
%823 = OpLoad %79 %1932
%824 = OpLogicalNot %79 %823
%853 = OpFunctionCall %1 %831 %24 %822 %821 %824
%855 = OpImageQuerySizeLod %762 %51 %774
%856 = OpVectorShuffle %82 %855 %855 0 1
%854 = OpConvertSToF %40 %856
%857 = OpSNegate %82 %765
%858 = OpExtInst %40 %78 Ldexp %854 %857
%859 = OpFMul %40 %788 %858
%860 = OpFMul %40 %787 %854
%861 = OpFSub %40 %860 %121
%862 = OpExtInst %122 %78 FrexpStruct %861
%863 = OpCompositeExtract %82 %862 1
%864 = OpExtInst %82 %78 SClamp %863 %127 %129
%865 = OpIAdd %82 %864 %857
%866 = OpExtInst %40 %78 Ldexp %133 %865
%867 = OpExtInst %40 %78 FMin %866 %133
%868 = OpFSub %40 %859 %867
%869 = OpExtInst %40 %78 FMax %868 %138
%870 = OpFAdd %40 %859 %867
%871 = OpConvertFToS %82 %869
%872 = OpConvertFToS %82 %870
%873 = OpINotEqual %81 %871 %872
%874 = OpCompositeExtract %79 %873 0
%875 = OpCompositeExtract %79 %873 1
%876 = OpLogicalAnd %79 %874 %875
%877 = OpSelect %80 %874 %147 %126
%878 = OpBitwiseOr %80 %90 %877
%879 = OpSelect %80 %875 %128 %126
%880 = OpBitwiseOr %80 %878 %879
%881 = OpSelect %80 %876 %152 %126
%882 = OpBitwiseOr %80 %880 %881
%883 = OpSConvert %18 %882
%884 = OpIMul %80 %774 %128
%885 = OpSConvert %18 %884
%886 = OpShiftLeftLogical %18 %883 %885
%887 = OpCompositeConstruct %762 %871 %760
%888 = OpLoad %79 %1932
%889 = OpLogicalNot %79 %888
%890 = OpLogicalAnd %79 %889 %776
%891 = OpFunctionCall %1 %831 %24 %887 %886 %890
%892 = OpExtInst %5 %78 RoundEven %72
%893 = OpConvertFToS %80 %892
%894 = OpCompositeConstruct %40 %67 %69
%895 = OpImageQuerySize %762 %49
%896 = OpVectorShuffle %82 %895 %895 0 1
%897 = OpBitwiseAnd %82 %896 %87
%898 = OpImageQueryLevels %80 %51
%899 = OpISub %80 %898 %90
%900 = OpImageQueryLod %40 %769 %894
%901 = OpCompositeExtract %5 %900 0
%902 = OpExtInst %5 %78 FMax %901 %55
%903 = OpExtInst %5 %78 FMin %902 %236
%904 = OpConvertFToS %80 %903
%905 = OpFAdd %5 %903 %97
%906 = OpConvertFToS %80 %905
%907 = OpExtInst %80 %78 SMin %906 %899
%908 = OpINotEqual %79 %904 %906
%909 = OpDPdx %40 %894
%910 = OpDPdy %40 %894
%911 = OpExtInst %40 %78 FAbs %909
%912 = OpExtInst %40 %78 FAbs %910
%913 = OpCompositeExtract %5 %911 0
%914 = OpCompositeExtract %5 %912 0
%915 = OpCompositeExtract %5 %911 1
%916 = OpCompositeExtract %5 %912 1
%917 = OpExtInst %5 %78 FMax %913 %914
%918 = OpExtInst %5 %78 FMax %915 %916
%919 = OpCompositeConstruct %40 %917 %918
%920 = OpExtInst %40 %78 Fract %894
%922 = OpImageQuerySizeLod %762 %51 %904
%923 = OpVectorShuffle %82 %922 %922 0 1
%921 = OpConvertSToF %40 %923
%924 = OpSNegate %82 %897
%925 = OpExtInst %40 %78 Ldexp %921 %924
%926 = OpFMul %40 %920 %925
%927 = OpFMul %40 %919 %921
%928 = OpFSub %40 %927 %121
%929 = OpExtInst %122 %78 FrexpStruct %928
%930 = OpCompositeExtract %82 %929 1
%931 = OpExtInst %82 %78 SClamp %930 %127 %129
%932 = OpIAdd %82 %931 %924
%933 = OpExtInst %40 %78 Ldexp %133 %932
%934 = OpExtInst %40 %78 FMin %933 %133
%935 = OpFSub %40 %926 %934
%936 = OpExtInst %40 %78 FMax %935 %138
%937 = OpFAdd %40 %926 %934
%938 = OpConvertFToS %82 %936
%939 = OpConvertFToS %82 %937
%940 = OpINotEqual %81 %938 %939
%941 = OpCompositeExtract %79 %940 0
%942 = OpCompositeExtract %79 %940 1
%943 = OpLogicalAnd %79 %941 %942
%944 = OpSelect %80 %941 %147 %126
%945 = OpBitwiseOr %80 %90 %944
%946 = OpSelect %80 %942 %128 %126
%947 = OpBitwiseOr %80 %945 %946
%948 = OpSelect %80 %943 %152 %126
%949 = OpBitwiseOr %80 %947 %948
%950 = OpSConvert %18 %949
%951 = OpIMul %80 %904 %128
%952 = OpSConvert %18 %951
%953 = OpShiftLeftLogical %18 %950 %952
%954 = OpCompositeConstruct %762 %938 %893
%955 = OpLoad %79 %1932
%956 = OpLogicalNot %79 %955
%957 = OpFunctionCall %1 %831 %24 %954 %953 %956
%959 = OpImageQuerySizeLod %762 %51 %906
%960 = OpVectorShuffle %82 %959 %959 0 1
%958 = OpConvertSToF %40 %960
%961 = OpSNegate %82 %897
%962 = OpExtInst %40 %78 Ldexp %958 %961
%963 = OpFMul %40 %920 %962
%964 = OpFMul %40 %919 %958
%965 = OpFSub %40 %964 %121
%966 = OpExtInst %122 %78 FrexpStruct %965
%967 = OpCompositeExtract %82 %966 1
%968 = OpExtInst %82 %78 SClamp %967 %127 %129
%969 = OpIAdd %82 %968 %961
%970 = OpExtInst %40 %78 Ldexp %133 %969
%971 = OpExtInst %40 %78 FMin %970 %133
%972 = OpFSub %40 %963 %971
%973 = OpExtInst %40 %78 FMax %972 %138
%974 = OpFAdd %40 %963 %971
%975 = OpConvertFToS %82 %973
%976 = OpConvertFToS %82 %974
%977 = OpINotEqual %81 %975 %976
%978 = OpCompositeExtract %79 %977 0
%979 = OpCompositeExtract %79 %977 1
%980 = OpLogicalAnd %79 %978 %979
%981 = OpSelect %80 %978 %147 %126
%982 = OpBitwiseOr %80 %90 %981
%983 = OpSelect %80 %979 %128 %126
%984 = OpBitwiseOr %80 %982 %983
%985 = OpSelect %80 %980 %152 %126
%986 = OpBitwiseOr %80 %984 %985
%987 = OpSConvert %18 %986
%988 = OpIMul %80 %906 %128
%989 = OpSConvert %18 %988
%990 = OpShiftLeftLogical %18 %987 %989
%991 = OpCompositeConstruct %762 %975 %893
%992 = OpLoad %79 %1932
%993 = OpLogicalNot %79 %992
%994 = OpLogicalAnd %79 %993 %908
%995 = OpFunctionCall %1 %831 %24 %991 %990 %994
%996 = OpExtInst %5 %78 RoundEven %72
%997 = OpConvertFToS %80 %996
%998 = OpCompositeConstruct %40 %67 %69
%999 = OpImageQuerySize %762 %49
%1000 = OpVectorShuffle %82 %999 %999 0 1
%1001 = OpBitwiseAnd %82 %1000 %87
%1002 = OpImageQueryLevels %80 %51
%1003 = OpISub %80 %1002 %90
%1004 = OpConvertSToF %5 %1003
%1005 = OpExtInst %5 %78 NClamp %76 %137 %1004
%1006 = OpConvertFToS %80 %1005
%1007 = OpFAdd %5 %1005 %97
%1008 = OpConvertFToS %80 %1007
%1009 = OpExtInst %80 %78 SMin %1008 %1003
%1010 = OpINotEqual %79 %1006 %1008
%1011 = OpExtInst %40 %78 Fract %998
%1013 = OpImageQuerySizeLod %762 %51 %1006
%1014 = OpVectorShuffle %82 %1013 %1013 0 1
%1012 = OpConvertSToF %40 %1014
%1015 = OpSNegate %82 %1001
%1016 = OpExtInst %40 %78 Ldexp %1012 %1015
%1017 = OpFMul %40 %1011 %1016
%1018 = OpExtInst %40 %78 Ldexp %133 %1015
%1019 = OpFSub %40 %1017 %1018
%1020 = OpExtInst %40 %78 FMax %1019 %138
%1021 = OpFAdd %40 %1017 %1018
%1022 = OpConvertFToS %82 %1020
%1023 = OpConvertFToS %82 %1021
%1024 = OpINotEqual %81 %1022 %1023
%1025 = OpCompositeExtract %79 %1024 0
%1026 = OpCompositeExtract %79 %1024 1
%1027 = OpLogicalAnd %79 %1025 %1026
%1028 = OpSelect %80 %1025 %147 %126
%1029 = OpBitwiseOr %80 %90 %1028
%1030 = OpSelect %80 %1026 %128 %126
%1031 = OpBitwiseOr %80 %1029 %1030
%1032 = OpSelect %80 %1027 %152 %126
%1033 = OpBitwiseOr %80 %1031 %1032
%1034 = OpSConvert %18 %1033
%1035 = OpIMul %80 %1006 %128
%1036 = OpSConvert %18 %1035
%1037 = OpShiftLeftLogical %18 %1034 %1036
%1038 = OpCompositeConstruct %762 %1022 %997
%1039 = OpLoad %79 %1932
%1040 = OpLogicalNot %79 %1039
%1041 = OpFunctionCall %1 %831 %24 %1038 %1037 %1040
%1043 = OpImageQuerySizeLod %762 %51 %1008
%1044 = OpVectorShuffle %82 %1043 %1043 0 1
%1042 = OpConvertSToF %40 %1044
%1045 = OpSNegate %82 %1001
%1046 = OpExtInst %40 %78 Ldexp %1042 %1045
%1047 = OpFMul %40 %1011 %1046
%1048 = OpExtInst %40 %78 Ldexp %133 %1045
%1049 = OpFSub %40 %1047 %1048
%1050 = OpExtInst %40 %78 FMax %1049 %138
%1051 = OpFAdd %40 %1047 %1048
%1052 = OpConvertFToS %82 %1050
%1053 = OpConvertFToS %82 %1051
%1054 = OpINotEqual %81 %1052 %1053
%1055 = OpCompositeExtract %79 %1054 0
%1056 = OpCompositeExtract %79 %1054 1
%1057 = OpLogicalAnd %79 %1055 %1056
%1058 = OpSelect %80 %1055 %147 %126
%1059 = OpBitwiseOr %80 %90 %1058
%1060 = OpSelect %80 %1056 %128 %126
%1061 = OpBitwiseOr %80 %1059 %1060
%1062 = OpSelect %80 %1057 %152 %126
%1063 = OpBitwiseOr %80 %1061 %1062
%1064 = OpSConvert %18 %1063
%1065 = OpIMul %80 %1008 %128
%1066 = OpSConvert %18 %1065
%1067 = OpShiftLeftLogical %18 %1064 %1066
%1068 = OpCompositeConstruct %762 %1052 %997
%1069 = OpLoad %79 %1932
%1070 = OpLogicalNot %79 %1069
%1071 = OpLogicalAnd %79 %1070 %1010
%1072 = OpFunctionCall %1 %831 %24 %1068 %1067 %1071
%1073 = OpExtInst %5 %78 RoundEven %72
%1074 = OpConvertFToS %80 %1073
%1075 = OpCompositeConstruct %40 %67 %69
%1076 = OpImageQuerySize %762 %49
%1077 = OpVectorShuffle %82 %1076 %1076 0 1
%1078 = OpBitwiseAnd %82 %1077 %87
%1079 = OpImageQueryLevels %80 %51
%1080 = OpISub %80 %1079 %90
%1082 = OpImageQuerySizeLod %762 %51 %126
%1083 = OpVectorShuffle %82 %1082 %1082 0 1
%1081 = OpConvertSToF %40 %1083
%1084 = OpCompositeConstruct %40 %63 %65
%1085 = OpCompositeConstruct %40 %58 %61
%1086 = OpFMul %40 %1081 %1084
%1087 = OpFMul %40 %1081 %1085
%1088 = OpDot %5 %1086 %1086
%1089 = OpDot %5 %1087 %1087
%1090 = OpExtInst %5 %78 FMax %1088 %1089
%1091 = OpExtInst %5 %78 Log2 %1090
%1092 = OpFMul %5 %1091 %132
%1093 = OpConvertSToF %5 %1080
%1094 = OpExtInst %5 %78 NClamp %1092 %137 %1093
%1095 = OpConvertFToS %80 %1094
%1096 = OpFAdd %5 %1094 %97
%1097 = OpConvertFToS %80 %1096
%1098 = OpExtInst %80 %78 SMin %1097 %1080
%1099 = OpINotEqual %79 %1095 %1097
%1100 = OpExtInst %40 %78 Fract %1075
%1102 = OpImageQuerySizeLod %762 %51 %1095
%1103 = OpVectorShuffle %82 %1102 %1102 0 1
%1101 = OpConvertSToF %40 %1103
%1104 = OpSNegate %82 %1078
%1105 = OpExtInst %40 %78 Ldexp %1101 %1104
%1106 = OpFMul %40 %1100 %1105
%1107 = OpExtInst %40 %78 Ldexp %133 %1104
%1108 = OpFSub %40 %1106 %1107
%1109 = OpExtInst %40 %78 FMax %1108 %138
%1110 = OpFAdd %40 %1106 %1107
%1111 = OpConvertFToS %82 %1109
%1112 = OpConvertFToS %82 %1110
%1113 = OpINotEqual %81 %1111 %1112
%1114 = OpCompositeExtract %79 %1113 0
%1115 = OpCompositeExtract %79 %1113 1
%1116 = OpLogicalAnd %79 %1114 %1115
%1117 = OpSelect %80 %1114 %147 %126
%1118 = OpBitwiseOr %80 %90 %1117
%1119 = OpSelect %80 %1115 %128 %126
%1120 = OpBitwiseOr %80 %1118 %1119
%1121 = OpSelect %80 %1116 %152 %126
%1122 = OpBitwiseOr %80 %1120 %1121
%1123 = OpSConvert %18 %1122
%1124 = OpIMul %80 %1095 %128
%1125 = OpSConvert %18 %1124
%1126 = OpShiftLeftLogical %18 %1123 %1125
%1127 = OpCompositeConstruct %762 %1111 %1074
%1128 = OpLoad %79 %1932
%1129 = OpLogicalNot %79 %1128
%1130 = OpFunctionCall %1 %831 %24 %1127 %1126 %1129
%1132 = OpImageQuerySizeLod %762 %51 %1097
%1133 = OpVectorShuffle %82 %1132 %1132 0 1
%1131 = OpConvertSToF %40 %1133
%1134 = OpSNegate %82 %1078
%1135 = OpExtInst %40 %78 Ldexp %1131 %1134
%1136 = OpFMul %40 %1100 %1135
%1137 = OpExtInst %40 %78 Ldexp %133 %1134
%1138 = OpFSub %40 %1136 %1137
%1139 = OpExtInst %40 %78 FMax %1138 %138
%1140 = OpFAdd %40 %1136 %1137
%1141 = OpConvertFToS %82 %1139
%1142 = OpConvertFToS %82 %1140
%1143 = OpINotEqual %81 %1141 %1142
%1144 = OpCompositeExtract %79 %1143 0
%1145 = OpCompositeExtract %79 %1143 1
%1146 = OpLogicalAnd %79 %1144 %1145
%1147 = OpSelect %80 %1144 %147 %126
%1148 = OpBitwiseOr %80 %90 %1147
%1149 = OpSelect %80 %1145 %128 %126
%1150 = OpBitwiseOr %80 %1148 %1149
%1151 = OpSelect %80 %1146 %152 %126
%1152 = OpBitwiseOr %80 %1150 %1151
%1153 = OpSConvert %18 %1152
%1154 = OpIMul %80 %1097 %128
%1155 = OpSConvert %18 %1154
%1156 = OpShiftLeftLogical %18 %1153 %1155
%1157 = OpCompositeConstruct %762 %1141 %1074
%1158 = OpLoad %79 %1932
%1159 = OpLogicalNot %79 %1158
%1160 = OpLogicalAnd %79 %1159 %1099
%1161 = OpFunctionCall %1 %831 %24 %1157 %1156 %1160
%1162 = OpExtInst %5 %78 RoundEven %72
%1163 = OpConvertFToS %80 %1162
%1164 = OpCompositeConstruct %40 %67 %69
%1165 = OpImageQuerySize %762 %49
%1166 = OpVectorShuffle %82 %1165 %1165 0 1
%1167 = OpBitwiseAnd %82 %1166 %87
%1168 = OpImageQueryLevels %80 %51
%1169 = OpISub %80 %1168 %90
%1171 = OpImageQuerySizeLod %762 %51 %126
%1172 = OpVectorShuffle %82 %1171 %1171 0 1
%1170 = OpConvertSToF %40 %1172
%1173 = OpCompositeConstruct %40 %63 %65
%1174 = OpCompositeConstruct %40 %58 %61
%1175 = OpFMul %40 %1170 %1173
%1176 = OpFMul %40 %1170 %1174
%1177 = OpDot %5 %1175 %1175
%1178 = OpDot %5 %1176 %1176
%1179 = OpExtInst %5 %78 FMax %1177 %1178
%1180 = OpExtInst %5 %78 Log2 %1179
%1181 = OpFMul %5 %1180 %132
%1182 = OpConvertSToF %5 %1169
%1183 = OpExtInst %5 %78 NClamp %1181 %137 %1182
%1184 = OpExtInst %5 %78 FMax %1183 %55
%1185 = OpExtInst %5 %78 FMin %1184 %236
%1186 = OpConvertFToS %80 %1185
%1187 = OpFAdd %5 %1185 %97
%1188 = OpConvertFToS %80 %1187
%1189 = OpExtInst %80 %78 SMin %1188 %1169
%1190 = OpINotEqual %79 %1186 %1188
%1191 = OpExtInst %40 %78 Fract %1164
%1193 = OpImageQuerySizeLod %762 %51 %1186
%1194 = OpVectorShuffle %82 %1193 %1193 0 1
%1192 = OpConvertSToF %40 %1194
%1195 = OpSNegate %82 %1167
%1196 = OpExtInst %40 %78 Ldexp %1192 %1195
%1197 = OpFMul %40 %1191 %1196
%1198 = OpExtInst %40 %78 Ldexp %133 %1195
%1199 = OpFSub %40 %1197 %1198
%1200 = OpExtInst %40 %78 FMax %1199 %138
%1201 = OpFAdd %40 %1197 %1198
%1202 = OpConvertFToS %82 %1200
%1203 = OpConvertFToS %82 %1201
%1204 = OpINotEqual %81 %1202 %1203
%1205 = OpCompositeExtract %79 %1204 0
%1206 = OpCompositeExtract %79 %1204 1
%1207 = OpLogicalAnd %79 %1205 %1206
%1208 = OpSelect %80 %1205 %147 %126
%1209 = OpBitwiseOr %80 %90 %1208
%1210 = OpSelect %80 %1206 %128 %126
%1211 = OpBitwiseOr %80 %1209 %1210
%1212 = OpSelect %80 %1207 %152 %126
%1213 = OpBitwiseOr %80 %1211 %1212
%1214 = OpSConvert %18 %1213
%1215 = OpIMul %80 %1186 %128
%1216 = OpSConvert %18 %1215
%1217 = OpShiftLeftLogical %18 %1214 %1216
%1218 = OpCompositeConstruct %762 %1202 %1163
%1219 = OpLoad %79 %1932
%1220 = OpLogicalNot %79 %1219
%1221 = OpFunctionCall %1 %831 %24 %1218 %1217 %1220
%1223 = OpImageQuerySizeLod %762 %51 %1188
%1224 = OpVectorShuffle %82 %1223 %1223 0 1
%1222 = OpConvertSToF %40 %1224
%1225 = OpSNegate %82 %1167
%1226 = OpExtInst %40 %78 Ldexp %1222 %1225
%1227 = OpFMul %40 %1191 %1226
%1228 = OpExtInst %40 %78 Ldexp %133 %1225
%1229 = OpFSub %40 %1227 %1228
%1230 = OpExtInst %40 %78 FMax %1229 %138
%1231 = OpFAdd %40 %1227 %1228
%1232 = OpConvertFToS %82 %1230
%1233 = OpConvertFToS %82 %1231
%1234 = OpINotEqual %81 %1232 %1233
%1235 = OpCompositeExtract %79 %1234 0
%1236 = OpCompositeExtract %79 %1234 1
%1237 = OpLogicalAnd %79 %1235 %1236
%1238 = OpSelect %80 %1235 %147 %126
%1239 = OpBitwiseOr %80 %90 %1238
%1240 = OpSelect %80 %1236 %128 %126
%1241 = OpBitwiseOr %80 %1239 %1240
%1242 = OpSelect %80 %1237 %152 %126
%1243 = OpBitwiseOr %80 %1241 %1242
%1244 = OpSConvert %18 %1243
%1245 = OpIMul %80 %1188 %128
%1246 = OpSConvert %18 %1245
%1247 = OpShiftLeftLogical %18 %1244 %1246
%1248 = OpCompositeConstruct %762 %1232 %1163
%1249 = OpLoad %79 %1932
%1250 = OpLogicalNot %79 %1249
%1251 = OpLogicalAnd %79 %1250 %1190
%1252 = OpFunctionCall %1 %831 %24 %1248 %1247 %1251
%1253 = OpExtInst %5 %78 RoundEven %72
%1254 = OpConvertFToS %80 %1253
%1255 = OpCompositeConstruct %40 %67 %69
%1256 = OpImageQuerySize %762 %49
%1257 = OpVectorShuffle %82 %1256 %1256 0 1
%1258 = OpBitwiseAnd %82 %1257 %87
%1259 = OpImageQueryLevels %80 %51
%1260 = OpISub %80 %1259 %90
%1261 = OpExtInst %5 %78 Exp2 %72
%1262 = OpGroupNonUniformQuadBroadcast %5 %74 %1261 %57
%1263 = OpVectorTimesScalar %40 %1255 %1262
%1264 = OpImageQueryLod %40 %769 %1263
%1265 = OpCompositeExtract %5 %1264 0
%1266 = OpConvertFToS %80 %1265
%1267 = OpFAdd %5 %1265 %97
%1268 = OpConvertFToS %80 %1267
%1269 = OpExtInst %80 %78 SMin %1268 %1260
%1270 = OpINotEqual %79 %1266 %1268
%1271 = OpDPdx %40 %1255
%1272 = OpDPdy %40 %1255
%1273 = OpExtInst %40 %78 FAbs %1271
%1274 = OpExtInst %40 %78 FAbs %1272
%1275 = OpCompositeExtract %5 %1273 0
%1276 = OpCompositeExtract %5 %1274 0
%1277 = OpCompositeExtract %5 %1273 1
%1278 = OpCompositeExtract %5 %1274 1
%1279 = OpExtInst %5 %78 FMax %1275 %1276
%1280 = OpExtInst %5 %78 FMax %1277 %1278
%1281 = OpCompositeConstruct %40 %1279 %1280
%1282 = OpVectorTimesScalar %40 %1281 %1261
%1283 = OpExtInst %40 %78 Fract %1255
%1285 = OpImageQuerySizeLod %762 %51 %1266
%1286 = OpVectorShuffle %82 %1285 %1285 0 1
%1284 = OpConvertSToF %40 %1286
%1287 = OpSNegate %82 %1258
%1288 = OpExtInst %40 %78 Ldexp %1284 %1287
%1289 = OpFMul %40 %1283 %1288
%1290 = OpFMul %40 %1282 %1284
%1291 = OpFSub %40 %1290 %121
%1292 = OpExtInst %122 %78 FrexpStruct %1291
%1293 = OpCompositeExtract %82 %1292 1
%1294 = OpExtInst %82 %78 SClamp %1293 %127 %129
%1295 = OpIAdd %82 %1294 %1287
%1296 = OpExtInst %40 %78 Ldexp %133 %1295
%1297 = OpExtInst %40 %78 FMin %1296 %133
%1298 = OpFSub %40 %1289 %1297
%1299 = OpExtInst %40 %78 FMax %1298 %138
%1300 = OpFAdd %40 %1289 %1297
%1301 = OpConvertFToS %82 %1299
%1302 = OpConvertFToS %82 %1300
%1303 = OpINotEqual %81 %1301 %1302
%1304 = OpCompositeExtract %79 %1303 0
%1305 = OpCompositeExtract %79 %1303 1
%1306 = OpLogicalAnd %79 %1304 %1305
%1307 = OpSelect %80 %1304 %147 %126
%1308 = OpBitwiseOr %80 %90 %1307
%1309 = OpSelect %80 %1305 %128 %126
%1310 = OpBitwiseOr %80 %1308 %1309
%1311 = OpSelect %80 %1306 %152 %126
%1312 = OpBitwiseOr %80 %1310 %1311
%1313 = OpSConvert %18 %1312
%1314 = OpIMul %80 %1266 %128
%1315 = OpSConvert %18 %1314
%1316 = OpShiftLeftLogical %18 %1313 %1315
%1317 = OpCompositeConstruct %762 %1301 %1254
%1318 = OpLoad %79 %1932
%1319 = OpLogicalNot %79 %1318
%1320 = OpFunctionCall %1 %831 %24 %1317 %1316 %1319
%1322 = OpImageQuerySizeLod %762 %51 %1268
%1323 = OpVectorShuffle %82 %1322 %1322 0 1
%1321 = OpConvertSToF %40 %1323
%1324 = OpSNegate %82 %1258
%1325 = OpExtInst %40 %78 Ldexp %1321 %1324
%1326 = OpFMul %40 %1283 %1325
%1327 = OpFMul %40 %1282 %1321
%1328 = OpFSub %40 %1327 %121
%1329 = OpExtInst %122 %78 FrexpStruct %1328
%1330 = OpCompositeExtract %82 %1329 1
%1331 = OpExtInst %82 %78 SClamp %1330 %127 %129
%1332 = OpIAdd %82 %1331 %1324
%1333 = OpExtInst %40 %78 Ldexp %133 %1332
%1334 = OpExtInst %40 %78 FMin %1333 %133
%1335 = OpFSub %40 %1326 %1334
%1336 = OpExtInst %40 %78 FMax %1335 %138
%1337 = OpFAdd %40 %1326 %1334
%1338 = OpConvertFToS %82 %1336
%1339 = OpConvertFToS %82 %1337
%1340 = OpINotEqual %81 %1338 %1339
%1341 = OpCompositeExtract %79 %1340 0
%1342 = OpCompositeExtract %79 %1340 1
%1343 = OpLogicalAnd %79 %1341 %1342
%1344 = OpSelect %80 %1341 %147 %126
%1345 = OpBitwiseOr %80 %90 %1344
%1346 = OpSelect %80 %1342 %128 %126
%1347 = OpBitwiseOr %80 %1345 %1346
%1348 = OpSelect %80 %1343 %152 %126
%1349 = OpBitwiseOr %80 %1347 %1348
%1350 = OpSConvert %18 %1349
%1351 = OpIMul %80 %1268 %128
%1352 = OpSConvert %18 %1351
%1353 = OpShiftLeftLogical %18 %1350 %1352
%1354 = OpCompositeConstruct %762 %1338 %1254
%1355 = OpLoad %79 %1932
%1356 = OpLogicalNot %79 %1355
%1357 = OpLogicalAnd %79 %1356 %1270
%1358 = OpFunctionCall %1 %831 %24 %1354 %1353 %1357
%1359 = OpExtInst %5 %78 RoundEven %72
%1360 = OpConvertFToS %80 %1359
%1361 = OpCompositeConstruct %40 %67 %69
%1362 = OpImageQuerySize %762 %49
%1363 = OpVectorShuffle %82 %1362 %1362 0 1
%1364 = OpBitwiseAnd %82 %1363 %87
%1365 = OpImageQueryLevels %80 %51
%1366 = OpISub %80 %1365 %90
%1367 = OpExtInst %5 %78 Exp2 %76
%1368 = OpGroupNonUniformQuadBroadcast %5 %74 %1367 %57
%1369 = OpVectorTimesScalar %40 %1361 %1368
%1370 = OpImageQueryLod %40 %769 %1369
%1371 = OpCompositeExtract %5 %1370 0
%1372 = OpExtInst %5 %78 FMax %1371 %55
%1373 = OpExtInst %5 %78 FMin %1372 %236
%1374 = OpConvertFToS %80 %1373
%1375 = OpFAdd %5 %1373 %97
%1376 = OpConvertFToS %80 %1375
%1377 = OpExtInst %80 %78 SMin %1376 %1366
%1378 = OpINotEqual %79 %1374 %1376
%1379 = OpDPdx %40 %1361
%1380 = OpDPdy %40 %1361
%1381 = OpExtInst %40 %78 FAbs %1379
%1382 = OpExtInst %40 %78 FAbs %1380
%1383 = OpCompositeExtract %5 %1381 0
%1384 = OpCompositeExtract %5 %1382 0
%1385 = OpCompositeExtract %5 %1381 1
%1386 = OpCompositeExtract %5 %1382 1
%1387 = OpExtInst %5 %78 FMax %1383 %1384
%1388 = OpExtInst %5 %78 FMax %1385 %1386
%1389 = OpCompositeConstruct %40 %1387 %1388
%1390 = OpVectorTimesScalar %40 %1389 %1367
%1391 = OpExtInst %40 %78 Fract %1361
%1393 = OpImageQuerySizeLod %762 %51 %1374
%1394 = OpVectorShuffle %82 %1393 %1393 0 1
%1392 = OpConvertSToF %40 %1394
%1395 = OpSNegate %82 %1364
%1396 = OpExtInst %40 %78 Ldexp %1392 %1395
%1397 = OpFMul %40 %1391 %1396
%1398 = OpFMul %40 %1390 %1392
%1399 = OpFSub %40 %1398 %121
%1400 = OpExtInst %122 %78 FrexpStruct %1399
%1401 = OpCompositeExtract %82 %1400 1
%1402 = OpExtInst %82 %78 SClamp %1401 %127 %129
%1403 = OpIAdd %82 %1402 %1395
%1404 = OpExtInst %40 %78 Ldexp %133 %1403
%1405 = OpExtInst %40 %78 FMin %1404 %133
%1406 = OpFSub %40 %1397 %1405
%1407 = OpExtInst %40 %78 FMax %1406 %138
%1408 = OpFAdd %40 %1397 %1405
%1409 = OpConvertFToS %82 %1407
%1410 = OpConvertFToS %82 %1408
%1411 = OpINotEqual %81 %1409 %1410
%1412 = OpCompositeExtract %79 %1411 0
%1413 = OpCompositeExtract %79 %1411 1
%1414 = OpLogicalAnd %79 %1412 %1413
%1415 = OpSelect %80 %1412 %147 %126
%1416 = OpBitwiseOr %80 %90 %1415
%1417 = OpSelect %80 %1413 %128 %126
%1418 = OpBitwiseOr %80 %1416 %1417
%1419 = OpSelect %80 %1414 %152 %126
%1420 = OpBitwiseOr %80 %1418 %1419
%1421 = OpSConvert %18 %1420
%1422 = OpIMul %80 %1374 %128
%1423 = OpSConvert %18 %1422
%1424 = OpShiftLeftLogical %18 %1421 %1423
%1425 = OpCompositeConstruct %762 %1409 %1360
%1426 = OpLoad %79 %1932
%1427 = OpLogicalNot %79 %1426
%1428 = OpFunctionCall %1 %831 %24 %1425 %1424 %1427
%1430 = OpImageQuerySizeLod %762 %51 %1376
%1431 = OpVectorShuffle %82 %1430 %1430 0 1
%1429 = OpConvertSToF %40 %1431
%1432 = OpSNegate %82 %1364
%1433 = OpExtInst %40 %78 Ldexp %1429 %1432
%1434 = OpFMul %40 %1391 %1433
%1435 = OpFMul %40 %1390 %1429
%1436 = OpFSub %40 %1435 %121
%1437 = OpExtInst %122 %78 FrexpStruct %1436
%1438 = OpCompositeExtract %82 %1437 1
%1439 = OpExtInst %82 %78 SClamp %1438 %127 %129
%1440 = OpIAdd %82 %1439 %1432
%1441 = OpExtInst %40 %78 Ldexp %133 %1440
%1442 = OpExtInst %40 %78 FMin %1441 %133
%1443 = OpFSub %40 %1434 %1442
%1444 = OpExtInst %40 %78 FMax %1443 %138
%1445 = OpFAdd %40 %1434 %1442
%1446 = OpConvertFToS %82 %1444
%1447 = OpConvertFToS %82 %1445
%1448 = OpINotEqual %81 %1446 %1447
%1449 = OpCompositeExtract %79 %1448 0
%1450 = OpCompositeExtract %79 %1448 1
%1451 = OpLogicalAnd %79 %1449 %1450
%1452 = OpSelect %80 %1449 %147 %126
%1453 = OpBitwiseOr %80 %90 %1452
%1454 = OpSelect %80 %1450 %128 %126
%1455 = OpBitwiseOr %80 %1453 %1454
%1456 = OpSelect %80 %1451 %152 %126
%1457 = OpBitwiseOr %80 %1455 %1456
%1458 = OpSConvert %18 %1457
%1459 = OpIMul %80 %1376 %128
%1460 = OpSConvert %18 %1459
%1461 = OpShiftLeftLogical %18 %1458 %1460
%1462 = OpCompositeConstruct %762 %1446 %1360
%1463 = OpLoad %79 %1932
%1464 = OpLogicalNot %79 %1463
%1465 = OpLogicalAnd %79 %1464 %1378
%1466 = OpFunctionCall %1 %831 %24 %1462 %1461 %1465
%1467 = OpIAdd %46 %54 %57
%1468 = OpAccessChain %20 %27 %1467
%1469 = OpLoad %19 %1468
%1470 = OpIAdd %46 %54 %57
%1471 = OpAccessChain %7 %14 %1470
%1472 = OpLoad %6 %1471
%1473 = OpIAdd %46 %54 %57
%1474 = OpAccessChain %32 %36 %1473
%1475 = OpLoad %31 %1474
%1476 = OpCompositeConstruct %40 %67 %69
%1477 = OpImageQuerySize %82 %1469
%1478 = OpBitwiseAnd %82 %1477 %87
%1479 = OpImageQueryLevels %80 %1472
%1480 = OpISub %80 %1479 %90
%1481 = OpSampledImage %91 %1472 %1475
%1482 = OpImageQueryLod %40 %1481 %1476
%1483 = OpCompositeExtract %5 %1482 0
%1484 = OpConvertFToS %80 %1483
%1485 = OpFAdd %5 %1483 %97
%1486 = OpConvertFToS %80 %1485
%1487 = OpExtInst %80 %78 SMin %1486 %1480
%1488 = OpINotEqual %79 %1484 %1486
%1489 = OpDPdx %40 %1476
%1490 = OpDPdy %40 %1476
%1491 = OpExtInst %40 %78 FAbs %1489
%1492 = OpExtInst %40 %78 FAbs %1490
%1493 = OpCompositeExtract %5 %1491 0
%1494 = OpCompositeExtract %5 %1492 0
%1495 = OpCompositeExtract %5 %1491 1
%1496 = OpCompositeExtract %5 %1492 1
%1497 = OpExtInst %5 %78 FMax %1493 %1494
%1498 = OpExtInst %5 %78 FMax %1495 %1496
%1499 = OpCompositeConstruct %40 %1497 %1498
%1500 = OpExtInst %40 %78 Fract %1476
%1502 = OpImageQuerySizeLod %82 %1472 %1484
%1501 = OpConvertSToF %40 %1502
%1503 = OpSNegate %82 %1478
%1504 = OpExtInst %40 %78 Ldexp %1501 %1503
%1505 = OpFMul %40 %1500 %1504
%1506 = OpFMul %40 %1499 %1501
%1507 = OpFSub %40 %1506 %121
%1508 = OpExtInst %122 %78 FrexpStruct %1507
%1509 = OpCompositeExtract %82 %1508 1
%1510 = OpExtInst %82 %78 SClamp %1509 %127 %129
%1511 = OpIAdd %82 %1510 %1503
%1512 = OpExtInst %40 %78 Ldexp %133 %1511
%1513 = OpExtInst %40 %78 FMin %1512 %133
%1514 = OpFSub %40 %1505 %1513
%1515 = OpExtInst %40 %78 FMax %1514 %138
%1516 = OpFAdd %40 %1505 %1513
%1517 = OpConvertFToS %82 %1515
%1518 = OpConvertFToS %82 %1516
%1519 = OpINotEqual %81 %1517 %1518
%1520 = OpCompositeExtract %79 %1519 0
%1521 = OpCompositeExtract %79 %1519 1
%1522 = OpLogicalAnd %79 %1520 %1521
%1523 = OpSelect %80 %1520 %147 %126
%1524 = OpBitwiseOr %80 %90 %1523
%1525 = OpSelect %80 %1521 %128 %126
%1526 = OpBitwiseOr %80 %1524 %1525
%1527 = OpSelect %80 %1522 %152 %126
%1528 = OpBitwiseOr %80 %1526 %1527
%1529 = OpSConvert %18 %1528
%1530 = OpIMul %80 %1484 %128
%1531 = OpSConvert %18 %1530
%1532 = OpShiftLeftLogical %18 %1529 %1531
%1533 = OpLoad %79 %1932
%1534 = OpLogicalNot %79 %1533
%1561 = OpFunctionCall %1 %1539 %1468 %1517 %1532 %1534
%1563 = OpImageQuerySizeLod %82 %1472 %1486
%1562 = OpConvertSToF %40 %1563
%1564 = OpSNegate %82 %1478
%1565 = OpExtInst %40 %78 Ldexp %1562 %1564
%1566 = OpFMul %40 %1500 %1565
%1567 = OpFMul %40 %1499 %1562
%1568 = OpFSub %40 %1567 %121
%1569 = OpExtInst %122 %78 FrexpStruct %1568
%1570 = OpCompositeExtract %82 %1569 1
%1571 = OpExtInst %82 %78 SClamp %1570 %127 %129
%1572 = OpIAdd %82 %1571 %1564
%1573 = OpExtInst %40 %78 Ldexp %133 %1572
%1574 = OpExtInst %40 %78 FMin %1573 %133
%1575 = OpFSub %40 %1566 %1574
%1576 = OpExtInst %40 %78 FMax %1575 %138
%1577 = OpFAdd %40 %1566 %1574
%1578 = OpConvertFToS %82 %1576
%1579 = OpConvertFToS %82 %1577
%1580 = OpINotEqual %81 %1578 %1579
%1581 = OpCompositeExtract %79 %1580 0
%1582 = OpCompositeExtract %79 %1580 1
%1583 = OpLogicalAnd %79 %1581 %1582
%1584 = OpSelect %80 %1581 %147 %126
%1585 = OpBitwiseOr %80 %90 %1584
%1586 = OpSelect %80 %1582 %128 %126
%1587 = OpBitwiseOr %80 %1585 %1586
%1588 = OpSelect %80 %1583 %152 %126
%1589 = OpBitwiseOr %80 %1587 %1588
%1590 = OpSConvert %18 %1589
%1591 = OpIMul %80 %1486 %128
%1592 = OpSConvert %18 %1591
%1593 = OpShiftLeftLogical %18 %1590 %1592
%1594 = OpLoad %79 %1932
%1595 = OpLogicalNot %79 %1594
%1596 = OpLogicalAnd %79 %1595 %1488
%1597 = OpFunctionCall %1 %1539 %1468 %1578 %1593 %1596
%1598 = OpIAdd %46 %54 %57
%1599 = OpAccessChain %23 %30 %1598
%1600 = OpLoad %22 %1599
%1601 = OpIAdd %46 %54 %57
%1602 = OpAccessChain %10 %17 %1601
%1603 = OpLoad %9 %1602
%1604 = OpExtInst %5 %78 RoundEven %72
%1605 = OpConvertFToS %80 %1604
%1606 = OpCompositeConstruct %40 %67 %69
%1607 = OpImageQuerySize %762 %1600
%1608 = OpVectorShuffle %82 %1607 %1607 0 1
%1609 = OpBitwiseAnd %82 %1608 %87
%1610 = OpImageQueryLevels %80 %1603
%1611 = OpISub %80 %1610 %90
%1612 = OpSampledImage %768 %1603 %1475
%1613 = OpImageQueryLod %40 %1612 %1606
%1614 = OpCompositeExtract %5 %1613 0
%1615 = OpConvertFToS %80 %1614
%1616 = OpFAdd %5 %1614 %97
%1617 = OpConvertFToS %80 %1616
%1618 = OpExtInst %80 %78 SMin %1617 %1611
%1619 = OpINotEqual %79 %1615 %1617
%1620 = OpDPdx %40 %1606
%1621 = OpDPdy %40 %1606
%1622 = OpExtInst %40 %78 FAbs %1620
%1623 = OpExtInst %40 %78 FAbs %1621
%1624 = OpCompositeExtract %5 %1622 0
%1625 = OpCompositeExtract %5 %1623 0
%1626 = OpCompositeExtract %5 %1622 1
%1627 = OpCompositeExtract %5 %1623 1
%1628 = OpExtInst %5 %78 FMax %1624 %1625
%1629 = OpExtInst %5 %78 FMax %1626 %1627
%1630 = OpCompositeConstruct %40 %1628 %1629
%1631 = OpExtInst %40 %78 Fract %1606
%1633 = OpImageQuerySizeLod %762 %1603 %1615
%1634 = OpVectorShuffle %82 %1633 %1633 0 1
%1632 = OpConvertSToF %40 %1634
%1635 = OpSNegate %82 %1609
%1636 = OpExtInst %40 %78 Ldexp %1632 %1635
%1637 = OpFMul %40 %1631 %1636
%1638 = OpFMul %40 %1630 %1632
%1639 = OpFSub %40 %1638 %121
%1640 = OpExtInst %122 %78 FrexpStruct %1639
%1641 = OpCompositeExtract %82 %1640 1
%1642 = OpExtInst %82 %78 SClamp %1641 %127 %129
%1643 = OpIAdd %82 %1642 %1635
%1644 = OpExtInst %40 %78 Ldexp %133 %1643
%1645 = OpExtInst %40 %78 FMin %1644 %133
%1646 = OpFSub %40 %1637 %1645
%1647 = OpExtInst %40 %78 FMax %1646 %138
%1648 = OpFAdd %40 %1637 %1645
%1649 = OpConvertFToS %82 %1647
%1650 = OpConvertFToS %82 %1648
%1651 = OpINotEqual %81 %1649 %1650
%1652 = OpCompositeExtract %79 %1651 0
%1653 = OpCompositeExtract %79 %1651 1
%1654 = OpLogicalAnd %79 %1652 %1653
%1655 = OpSelect %80 %1652 %147 %126
%1656 = OpBitwiseOr %80 %90 %1655
%1657 = OpSelect %80 %1653 %128 %126
%1658 = OpBitwiseOr %80 %1656 %1657
%1659 = OpSelect %80 %1654 %152 %126
%1660 = OpBitwiseOr %80 %1658 %1659
%1661 = OpSConvert %18 %1660
%1662 = OpIMul %80 %1615 %128
%1663 = OpSConvert %18 %1662
%1664 = OpShiftLeftLogical %18 %1661 %1663
%1665 = OpCompositeConstruct %762 %1649 %1605
%1666 = OpLoad %79 %1932
%1667 = OpLogicalNot %79 %1666
%1694 = OpFunctionCall %1 %1672 %1599 %1665 %1664 %1667
%1696 = OpImageQuerySizeLod %762 %1603 %1617
%1697 = OpVectorShuffle %82 %1696 %1696 0 1
%1695 = OpConvertSToF %40 %1697
%1698 = OpSNegate %82 %1609
%1699 = OpExtInst %40 %78 Ldexp %1695 %1698
%1700 = OpFMul %40 %1631 %1699
%1701 = OpFMul %40 %1630 %1695
%1702 = OpFSub %40 %1701 %121
%1703 = OpExtInst %122 %78 FrexpStruct %1702
%1704 = OpCompositeExtract %82 %1703 1
%1705 = OpExtInst %82 %78 SClamp %1704 %127 %129
%1706 = OpIAdd %82 %1705 %1698
%1707 = OpExtInst %40 %78 Ldexp %133 %1706
%1708 = OpExtInst %40 %78 FMin %1707 %133
%1709 = OpFSub %40 %1700 %1708
%1710 = OpExtInst %40 %78 FMax %1709 %138
%1711 = OpFAdd %40 %1700 %1708
%1712 = OpConvertFToS %82 %1710
%1713 = OpConvertFToS %82 %1711
%1714 = OpINotEqual %81 %1712 %1713
%1715 = OpCompositeExtract %79 %1714 0
%1716 = OpCompositeExtract %79 %1714 1
%1717 = OpLogicalAnd %79 %1715 %1716
%1718 = OpSelect %80 %1715 %147 %126
%1719 = OpBitwiseOr %80 %90 %1718
%1720 = OpSelect %80 %1716 %128 %126
%1721 = OpBitwiseOr %80 %1719 %1720
%1722 = OpSelect %80 %1717 %152 %126
%1723 = OpBitwiseOr %80 %1721 %1722
%1724 = OpSConvert %18 %1723
%1725 = OpIMul %80 %1617 %128
%1726 = OpSConvert %18 %1725
%1727 = OpShiftLeftLogical %18 %1724 %1726
%1728 = OpCompositeConstruct %762 %1712 %1605
%1729 = OpLoad %79 %1932
%1730 = OpLogicalNot %79 %1729
%1731 = OpLogicalAnd %79 %1730 %1619
%1732 = OpFunctionCall %1 %1672 %1599 %1728 %1727 %1731
%1733 = OpCompositeConstruct %40 %67 %69
%1734 = OpImageQuerySize %82 %1469
%1735 = OpBitwiseAnd %82 %1734 %87
%1736 = OpImageQueryLevels %80 %1472
%1737 = OpISub %80 %1736 %90
%1738 = OpImageQueryLod %40 %1481 %1733
%1739 = OpCompositeExtract %5 %1738 0
%1740 = OpConvertFToS %80 %1739
%1741 = OpFAdd %5 %1739 %97
%1742 = OpConvertFToS %80 %1741
%1743 = OpExtInst %80 %78 SMin %1742 %1737
%1744 = OpINotEqual %79 %1740 %1742
%1745 = OpDPdx %40 %1733
%1746 = OpDPdy %40 %1733
%1747 = OpExtInst %40 %78 FAbs %1745
%1748 = OpExtInst %40 %78 FAbs %1746
%1749 = OpCompositeExtract %5 %1747 0
%1750 = OpCompositeExtract %5 %1748 0
%1751 = OpCompositeExtract %5 %1747 1
%1752 = OpCompositeExtract %5 %1748 1
%1753 = OpExtInst %5 %78 FMax %1749 %1750
%1754 = OpExtInst %5 %78 FMax %1751 %1752
%1755 = OpCompositeConstruct %40 %1753 %1754
%1756 = OpExtInst %40 %78 Fract %1733
%1758 = OpImageQuerySizeLod %82 %1472 %1740
%1757 = OpConvertSToF %40 %1758
%1759 = OpSNegate %82 %1735
%1760 = OpExtInst %40 %78 Ldexp %1757 %1759
%1761 = OpFMul %40 %1756 %1760
%1762 = OpFMul %40 %1755 %1757
%1763 = OpFSub %40 %1762 %121
%1764 = OpExtInst %122 %78 FrexpStruct %1763
%1765 = OpCompositeExtract %82 %1764 1
%1766 = OpExtInst %82 %78 SClamp %1765 %127 %129
%1767 = OpIAdd %82 %1766 %1759
%1768 = OpExtInst %40 %78 Ldexp %133 %1767
%1769 = OpExtInst %40 %78 FMin %1768 %133
%1770 = OpFSub %40 %1761 %1769
%1771 = OpExtInst %40 %78 FMax %1770 %138
%1772 = OpFAdd %40 %1761 %1769
%1773 = OpConvertFToS %82 %1771
%1774 = OpConvertFToS %82 %1772
%1775 = OpINotEqual %81 %1773 %1774
%1776 = OpCompositeExtract %79 %1775 0
%1777 = OpCompositeExtract %79 %1775 1
%1778 = OpLogicalAnd %79 %1776 %1777
%1779 = OpSelect %80 %1776 %147 %126
%1780 = OpBitwiseOr %80 %90 %1779
%1781 = OpSelect %80 %1777 %128 %126
%1782 = OpBitwiseOr %80 %1780 %1781
%1783 = OpSelect %80 %1778 %152 %126
%1784 = OpBitwiseOr %80 %1782 %1783
%1785 = OpSConvert %18 %1784
%1786 = OpIMul %80 %1740 %128
%1787 = OpSConvert %18 %1786
%1788 = OpShiftLeftLogical %18 %1785 %1787
%1789 = OpLoad %79 %1932
%1790 = OpLogicalNot %79 %1789
%1791 = OpFunctionCall %1 %1539 %1468 %1773 %1788 %1790
%1793 = OpImageQuerySizeLod %82 %1472 %1742
%1792 = OpConvertSToF %40 %1793
%1794 = OpSNegate %82 %1735
%1795 = OpExtInst %40 %78 Ldexp %1792 %1794
%1796 = OpFMul %40 %1756 %1795
%1797 = OpFMul %40 %1755 %1792
%1798 = OpFSub %40 %1797 %121
%1799 = OpExtInst %122 %78 FrexpStruct %1798
%1800 = OpCompositeExtract %82 %1799 1
%1801 = OpExtInst %82 %78 SClamp %1800 %127 %129
%1802 = OpIAdd %82 %1801 %1794
%1803 = OpExtInst %40 %78 Ldexp %133 %1802
%1804 = OpExtInst %40 %78 FMin %1803 %133
%1805 = OpFSub %40 %1796 %1804
%1806 = OpExtInst %40 %78 FMax %1805 %138
%1807 = OpFAdd %40 %1796 %1804
%1808 = OpConvertFToS %82 %1806
%1809 = OpConvertFToS %82 %1807
%1810 = OpINotEqual %81 %1808 %1809
%1811 = OpCompositeExtract %79 %1810 0
%1812 = OpCompositeExtract %79 %1810 1
%1813 = OpLogicalAnd %79 %1811 %1812
%1814 = OpSelect %80 %1811 %147 %126
%1815 = OpBitwiseOr %80 %90 %1814
%1816 = OpSelect %80 %1812 %128 %126
%1817 = OpBitwiseOr %80 %1815 %1816
%1818 = OpSelect %80 %1813 %152 %126
%1819 = OpBitwiseOr %80 %1817 %1818
%1820 = OpSConvert %18 %1819
%1821 = OpIMul %80 %1742 %128
%1822 = OpSConvert %18 %1821
%1823 = OpShiftLeftLogical %18 %1820 %1822
%1824 = OpLoad %79 %1932
%1825 = OpLogicalNot %79 %1824
%1826 = OpLogicalAnd %79 %1825 %1744
%1827 = OpFunctionCall %1 %1539 %1468 %1808 %1823 %1826
%1828 = OpExtInst %5 %78 RoundEven %72
%1829 = OpConvertFToS %80 %1828
%1830 = OpCompositeConstruct %40 %67 %69
%1831 = OpImageQuerySize %762 %1600
%1832 = OpVectorShuffle %82 %1831 %1831 0 1
%1833 = OpBitwiseAnd %82 %1832 %87
%1834 = OpImageQueryLevels %80 %1603
%1835 = OpISub %80 %1834 %90
%1836 = OpImageQueryLod %40 %1612 %1830
%1837 = OpCompositeExtract %5 %1836 0
%1838 = OpConvertFToS %80 %1837
%1839 = OpFAdd %5 %1837 %97
%1840 = OpConvertFToS %80 %1839
%1841 = OpExtInst %80 %78 SMin %1840 %1835
%1842 = OpINotEqual %79 %1838 %1840
%1843 = OpDPdx %40 %1830
%1844 = OpDPdy %40 %1830
%1845 = OpExtInst %40 %78 FAbs %1843
%1846 = OpExtInst %40 %78 FAbs %1844
%1847 = OpCompositeExtract %5 %1845 0
%1848 = OpCompositeExtract %5 %1846 0
%1849 = OpCompositeExtract %5 %1845 1
%1850 = OpCompositeExtract %5 %1846 1
%1851 = OpExtInst %5 %78 FMax %1847 %1848
%1852 = OpExtInst %5 %78 FMax %1849 %1850
%1853 = OpCompositeConstruct %40 %1851 %1852
%1854 = OpExtInst %40 %78 Fract %1830
%1856 = OpImageQuerySizeLod %762 %1603 %1838
%1857 = OpVectorShuffle %82 %1856 %1856 0 1
%1855 = OpConvertSToF %40 %1857
%1858 = OpSNegate %82 %1833
%1859 = OpExtInst %40 %78 Ldexp %1855 %1858
%1860 = OpFMul %40 %1854 %1859
%1861 = OpFMul %40 %1853 %1855
%1862 = OpFSub %40 %1861 %121
%1863 = OpExtInst %122 %78 FrexpStruct %1862
%1864 = OpCompositeExtract %82 %1863 1
%1865 = OpExtInst %82 %78 SClamp %1864 %127 %129
%1866 = OpIAdd %82 %1865 %1858
%1867 = OpExtInst %40 %78 Ldexp %133 %1866
%1868 = OpExtInst %40 %78 FMin %1867 %133
%1869 = OpFSub %40 %1860 %1868
%1870 = OpExtInst %40 %78 FMax %1869 %138
%1871 = OpFAdd %40 %1860 %1868
%1872 = OpConvertFToS %82 %1870
%1873 = OpConvertFToS %82 %1871
%1874 = OpINotEqual %81 %1872 %1873
%1875 = OpCompositeExtract %79 %1874 0
%1876 = OpCompositeExtract %79 %1874 1
%1877 = OpLogicalAnd %79 %1875 %1876
%1878 = OpSelect %80 %1875 %147 %126
%1879 = OpBitwiseOr %80 %90 %1878
%1880 = OpSelect %80 %1876 %128 %126
%1881 = OpBitwiseOr %80 %1879 %1880
%1882 = OpSelect %80 %1877 %152 %126
%1883 = OpBitwiseOr %80 %1881 %1882
%1884 = OpSConvert %18 %1883
%1885 = OpIMul %80 %1838 %128
%1886 = OpSConvert %18 %1885
%1887 = OpShiftLeftLogical %18 %1884 %1886
%1888 = OpCompositeConstruct %762 %1872 %1829
%1889 = OpLoad %79 %1932
%1890 = OpLogicalNot %79 %1889
%1891 = OpFunctionCall %1 %1672 %1599 %1888 %1887 %1890
%1893 = OpImageQuerySizeLod %762 %1603 %1840
%1894 = OpVectorShuffle %82 %1893 %1893 0 1
%1892 = OpConvertSToF %40 %1894
%1895 = OpSNegate %82 %1833
%1896 = OpExtInst %40 %78 Ldexp %1892 %1895
%1897 = OpFMul %40 %1854 %1896
%1898 = OpFMul %40 %1853 %1892
%1899 = OpFSub %40 %1898 %121
%1900 = OpExtInst %122 %78 FrexpStruct %1899
%1901 = OpCompositeExtract %82 %1900 1
%1902 = OpExtInst %82 %78 SClamp %1901 %127 %129
%1903 = OpIAdd %82 %1902 %1895
%1904 = OpExtInst %40 %78 Ldexp %133 %1903
%1905 = OpExtInst %40 %78 FMin %1904 %133
%1906 = OpFSub %40 %1897 %1905
%1907 = OpExtInst %40 %78 FMax %1906 %138
%1908 = OpFAdd %40 %1897 %1905
%1909 = OpConvertFToS %82 %1907
%1910 = OpConvertFToS %82 %1908
%1911 = OpINotEqual %81 %1909 %1910
%1912 = OpCompositeExtract %79 %1911 0
%1913 = OpCompositeExtract %79 %1911 1
%1914 = OpLogicalAnd %79 %1912 %1913
%1915 = OpSelect %80 %1912 %147 %126
%1916 = OpBitwiseOr %80 %90 %1915
%1917 = OpSelect %80 %1913 %128 %126
%1918 = OpBitwiseOr %80 %1916 %1917
%1919 = OpSelect %80 %1914 %152 %126
%1920 = OpBitwiseOr %80 %1918 %1919
%1921 = OpSConvert %18 %1920
%1922 = OpIMul %80 %1840 %128
%1923 = OpSConvert %18 %1922
%1924 = OpShiftLeftLogical %18 %1921 %1923
%1925 = OpCompositeConstruct %762 %1909 %1829
%1926 = OpLoad %79 %1932
%1927 = OpLogicalNot %79 %1926
%1928 = OpLogicalAnd %79 %1927 %1842
%1929 = OpFunctionCall %1 %1672 %1599 %1925 %1924 %1928
OpReturn
OpFunctionEnd
%166 = OpFunction %1 None %161
%162 = OpFunctionParameter %20
%163 = OpFunctionParameter %82
%164 = OpFunctionParameter %18
%165 = OpFunctionParameter %79
%167 = OpLabel
%179 = OpVariable %178 Function %177
OpSelectionMerge %169 None
OpBranchConditional %165 %168 %169
%168 = OpLabel
%180 = OpLoad %79 %179
%181 = OpLogicalNot %79 %180
OpLoopMerge %170 %172 None
OpBranchConditional %181 %171 %170
%171 = OpLabel
%182 = OpGroupNonUniformBroadcastFirst %82 %74 %163
%183 = OpIEqual %81 %163 %182
%184 = OpAll %79 %183
OpStore %179 %184
OpSelectionMerge %174 None
OpBranchConditional %184 %173 %174
%173 = OpLabel
%185 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %164
%186 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %176 None
OpBranchConditional %186 %175 %176
%175 = OpLabel
%187 = OpImageTexelPointer %160 %162 %163 %126
%188 = OpAtomicOr %18 %187 %60 %57 %185
OpBranch %176
%176 = OpLabel
OpBranch %174
%174 = OpLabel
OpBranch %172
%172 = OpLabel
OpBranch %168
%170 = OpLabel
OpBranch %169
%169 = OpLabel
OpReturn
OpFunctionEnd
%831 = OpFunction %1 None %826
%827 = OpFunctionParameter %23
%828 = OpFunctionParameter %762
%829 = OpFunctionParameter %18
%830 = OpFunctionParameter %79
%832 = OpLabel
%842 = OpVariable %178 Function %177
OpSelectionMerge %834 None
OpBranchConditional %830 %833 %834
%833 = OpLabel
%843 = OpLoad %79 %842
%844 = OpLogicalNot %79 %843
OpLoopMerge %835 %837 None
OpBranchConditional %844 %836 %835
%836 = OpLabel
%845 = OpGroupNonUniformBroadcastFirst %762 %74 %828
%846 = OpIEqual %825 %828 %845
%847 = OpAll %79 %846
OpStore %842 %847
OpSelectionMerge %839 None
OpBranchConditional %847 %838 %839
%838 = OpLabel
%848 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %829
%849 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %841 None
OpBranchConditional %849 %840 %841
%840 = OpLabel
%850 = OpImageTexelPointer %160 %827 %828 %126
%851 = OpAtomicOr %18 %850 %60 %57 %848
OpBranch %841
%841 = OpLabel
OpBranch %839
%839 = OpLabel
OpBranch %837
%837 = OpLabel
OpBranch %833
%835 = OpLabel
OpBranch %834
%834 = OpLabel
OpReturn
OpFunctionEnd
%1539 = OpFunction %1 None %161
%1535 = OpFunctionParameter %20
%1536 = OpFunctionParameter %82
%1537 = OpFunctionParameter %18
%1538 = OpFunctionParameter %79
%1540 = OpLabel
%1550 = OpVariable %178 Function %177
OpSelectionMerge %1542 None
OpBranchConditional %1538 %1541 %1542
%1541 = OpLabel
%1551 = OpLoad %79 %1550
%1552 = OpLogicalNot %79 %1551
OpLoopMerge %1543 %1545 None
OpBranchConditional %1552 %1544 %1543
%1544 = OpLabel
%1553 = OpGroupNonUniformBroadcastFirst %82 %74 %1536
%1554 = OpIEqual %81 %1536 %1553
%1555 = OpAll %79 %1554
OpStore %1550 %1555
OpSelectionMerge %1547 None
OpBranchConditional %1555 %1546 %1547
%1546 = OpLabel
%1556 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1537
%1557 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1549 None
OpBranchConditional %1557 %1548 %1549
%1548 = OpLabel
%1558 = OpImageTexelPointer %160 %1535 %1536 %126
%1559 = OpAtomicOr %18 %1558 %60 %57 %1556
OpBranch %1549
%1549 = OpLabel
OpBranch %1547
%1547 = OpLabel
OpBranch %1545
%1545 = OpLabel
OpBranch %1541
%1543 = OpLabel
OpBranch %1542
%1542 = OpLabel
OpReturn
OpFunctionEnd
%1672 = OpFunction %1 None %826
%1668 = OpFunctionParameter %23
%1669 = OpFunctionParameter %762
%1670 = OpFunctionParameter %18
%1671 = OpFunctionParameter %79
%1673 = OpLabel
%1683 = OpVariable %178 Function %177
OpSelectionMerge %1675 None
OpBranchConditional %1671 %1674 %1675
%1674 = OpLabel
%1684 = OpLoad %79 %1683
%1685 = OpLogicalNot %79 %1684
OpLoopMerge %1676 %1678 None
OpBranchConditional %1685 %1677 %1676
%1677 = OpLabel
%1686 = OpGroupNonUniformBroadcastFirst %762 %74 %1669
%1687 = OpIEqual %825 %1669 %1686
%1688 = OpAll %79 %1687
OpStore %1683 %1688
OpSelectionMerge %1680 None
OpBranchConditional %1688 %1679 %1680
%1679 = OpLabel
%1689 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1670
%1690 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1682 None
OpBranchConditional %1690 %1681 %1682
%1681 = OpLabel
%1691 = OpImageTexelPointer %160 %1668 %1669 %126
%1692 = OpAtomicOr %18 %1691 %60 %57 %1689
OpBranch %1682
%1682 = OpLabel
OpBranch %1680
%1680 = OpLabel
OpBranch %1678
%1678 = OpLabel
OpBranch %1674
%1676 = OpLabel
OpBranch %1675
%1675 = OpLabel
OpReturn
OpFunctionEnd
#endif
