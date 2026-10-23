#version 460
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_shader_image_int64 : require
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_EXT_shader_subgroup_extended_types_int64 : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_EXT_shader_atomic_int64 : require
#extension GL_EXT_samplerless_texture_functions : require
#extension GL_EXT_demote_to_helper_invocation : require
#extension GL_EXT_spirv_intrinsics : require
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

spirv_instruction(set = "GLSL.std.450", id = 81) float spvNClamp(float, float, float);
spirv_instruction(set = "GLSL.std.450", id = 81) vec2 spvNClamp(vec2, vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 81) vec3 spvNClamp(vec3, vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 81) vec4 spvNClamp(vec4, vec4, vec4);

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
            bool _1554 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1554;
            if (_1554)
            {
                uint64_t _1555 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1558 = imageAtomicOr(img, coord, _1555);
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
            bool _1686 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1686;
            if (_1686)
            {
                uint64_t _1687 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1690 = imageAtomicOr(img, coord, _1687);
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
    bool _158 = helperInvocationEXT();
    WriteFeedback(_21, _140, uint64_t(((1 | (_143 ? 2 : 0)) | (_144 ? 4 : 0)) | ((_143 && _144) ? 8 : 0)) << uint64_t(_95 * 4), !_158);
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
    bool _223 = helperInvocationEXT();
    WriteFeedback(_21, _207, uint64_t(((1 | (_210 ? 2 : 0)) | (_211 ? 4 : 0)) | ((_210 && _211) ? 8 : 0)) << uint64_t(_98 * 4), (!_223) && (_95 != _98));
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
    bool _286 = helperInvocationEXT();
    WriteFeedback(_21, _270, uint64_t(((1 | (_273 ? 2 : 0)) | (_274 ? 4 : 0)) | ((_273 && _274) ? 8 : 0)) << uint64_t(_237 * 4), !_286);
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
    bool _321 = helperInvocationEXT();
    WriteFeedback(_21, _305, uint64_t(((1 | (_308 ? 2 : 0)) | (_309 ? 4 : 0)) | ((_308 && _309) ? 8 : 0)) << uint64_t(_239 * 4), (!_321) && (_237 != _239));
    ivec2 _327 = imageSize(_21) & ivec2(15);
    int _329 = textureQueryLevels(_8) - 1;
    float _331 = spvNClamp(gl_FragCoord.z, 0.0, float(_329));
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
    bool _363 = helperInvocationEXT();
    WriteFeedback(_21, _347, uint64_t(((1 | (_350 ? 2 : 0)) | (_351 ? 4 : 0)) | ((_350 && _351) ? 8 : 0)) << uint64_t(_332 * 4), !_363);
    ivec2 _368 = -_327;
    vec2 _370 = _337 * ldexp(vec2(textureSize(_8, _334)), _368);
    vec2 _371 = ldexp(vec2(0.5), _368);
    ivec2 _375 = ivec2(max(_370 - _371, vec2(0.0)));
    bvec2 _377 = notEqual(_375, ivec2(_370 + _371));
    bool _378 = _377.x;
    bool _379 = _377.y;
    bool _391 = helperInvocationEXT();
    WriteFeedback(_21, _375, uint64_t(((1 | (_378 ? 2 : 0)) | (_379 ? 4 : 0)) | ((_378 && _379) ? 8 : 0)) << uint64_t(_334 * 4), (!_391) && (_332 != _334));
    ivec2 _397 = imageSize(_21) & ivec2(15);
    int _399 = textureQueryLevels(_8) - 1;
    vec2 _400 = vec2(textureSize(_8, 0));
    vec2 _404 = _400 * vec2(GRADX.x, GRADX.y);
    vec2 _405 = _400 * vec2(GRADY.x, GRADY.y);
    float _412 = spvNClamp(log2(max(dot(_404, _404), dot(_405, _405))) * 0.5, 0.0, float(_399));
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
    bool _444 = helperInvocationEXT();
    WriteFeedback(_21, _428, uint64_t(((1 | (_431 ? 2 : 0)) | (_432 ? 4 : 0)) | ((_431 && _432) ? 8 : 0)) << uint64_t(_413 * 4), !_444);
    ivec2 _449 = -_397;
    vec2 _451 = _418 * ldexp(vec2(textureSize(_8, _415)), _449);
    vec2 _452 = ldexp(vec2(0.5), _449);
    ivec2 _456 = ivec2(max(_451 - _452, vec2(0.0)));
    bvec2 _458 = notEqual(_456, ivec2(_451 + _452));
    bool _459 = _458.x;
    bool _460 = _458.y;
    bool _472 = helperInvocationEXT();
    WriteFeedback(_21, _456, uint64_t(((1 | (_459 ? 2 : 0)) | (_460 ? 4 : 0)) | ((_459 && _460) ? 8 : 0)) << uint64_t(_415 * 4), (!_472) && (_413 != _415));
    ivec2 _478 = imageSize(_21) & ivec2(15);
    int _480 = textureQueryLevels(_8) - 1;
    vec2 _481 = vec2(textureSize(_8, 0));
    vec2 _485 = _481 * vec2(GRADX.x, GRADX.y);
    vec2 _486 = _481 * vec2(GRADY.x, GRADY.y);
    float _495 = min(max(spvNClamp(log2(max(dot(_485, _485), dot(_486, _486))) * 0.5, 0.0, float(_480)), CLAMP), 14.0);
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
    bool _527 = helperInvocationEXT();
    WriteFeedback(_21, _511, uint64_t(((1 | (_514 ? 2 : 0)) | (_515 ? 4 : 0)) | ((_514 && _515) ? 8 : 0)) << uint64_t(_496 * 4), !_527);
    ivec2 _532 = -_478;
    vec2 _534 = _501 * ldexp(vec2(textureSize(_8, _498)), _532);
    vec2 _535 = ldexp(vec2(0.5), _532);
    ivec2 _539 = ivec2(max(_534 - _535, vec2(0.0)));
    bvec2 _541 = notEqual(_539, ivec2(_534 + _535));
    bool _542 = _541.x;
    bool _543 = _541.y;
    bool _555 = helperInvocationEXT();
    WriteFeedback(_21, _539, uint64_t(((1 | (_542 ? 2 : 0)) | (_543 ? 4 : 0)) | ((_542 && _543) ? 8 : 0)) << uint64_t(_498 * 4), (!_555) && (_496 != _498));
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
    bool _619 = helperInvocationEXT();
    WriteFeedback(_21, _603, uint64_t(((1 | (_606 ? 2 : 0)) | (_607 ? 4 : 0)) | ((_606 && _607) ? 8 : 0)) << uint64_t(_569 * 4), !_619);
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
    bool _654 = helperInvocationEXT();
    WriteFeedback(_21, _638, uint64_t(((1 | (_641 ? 2 : 0)) | (_642 ? 4 : 0)) | ((_641 && _642) ? 8 : 0)) << uint64_t(_571 * 4), (!_654) && (_569 != _571));
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
    bool _720 = helperInvocationEXT();
    WriteFeedback(_21, _704, uint64_t(((1 | (_707 ? 2 : 0)) | (_708 ? 4 : 0)) | ((_707 && _708) ? 8 : 0)) << uint64_t(_670 * 4), !_720);
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
    bool _755 = helperInvocationEXT();
    WriteFeedback(_21, _739, uint64_t(((1 | (_742 ? 2 : 0)) | (_743 ? 4 : 0)) | ((_742 && _743) ? 8 : 0)) << uint64_t(_672 * 4), (!_755) && (_670 != _672));
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
    bool _823 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_806, _760), uint64_t(((1 | (_809 ? 2 : 0)) | (_810 ? 4 : 0)) | ((_809 && _810) ? 8 : 0)) << uint64_t(_772 * 4), !_823);
    vec2 _853 = vec2(textureSize(_11, _774).xy);
    ivec2 _856 = -_765;
    vec2 _858 = _788 * ldexp(_853, _856);
    ResType _861;
    _861._m0 = frexp((_787 * _853) - vec2(0.00390625), _861._m1);
    vec2 _866 = min(ldexp(vec2(0.5), clamp(_861._m1, ivec2(0), ivec2(4)) + _856), vec2(0.5));
    ivec2 _870 = ivec2(max(_858 - _866, vec2(0.0)));
    bvec2 _872 = notEqual(_870, ivec2(_858 + _866));
    bool _873 = _872.x;
    bool _874 = _872.y;
    bool _887 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_870, _760), uint64_t(((1 | (_873 ? 2 : 0)) | (_874 ? 4 : 0)) | ((_873 && _874) ? 8 : 0)) << uint64_t(_774 * 4), (!_887) && (_772 != _774));
    int _892 = int(roundEven(gl_FragCoord.z));
    vec2 _893 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _896 = imageSize(_24).xy & ivec2(15);
    float _902 = min(max(textureQueryLod(sampler2DArray(_11, _33), _893).x, CLAMP), 14.0);
    int _903 = int(_902);
    int _905 = int(_902 + 0.9970703125);
    vec2 _910 = abs(dFdx(_893));
    vec2 _911 = abs(dFdy(_893));
    vec2 _918 = vec2(max(_910.x, _911.x), max(_910.y, _911.y));
    vec2 _919 = fract(_893);
    vec2 _920 = vec2(textureSize(_11, _903).xy);
    ivec2 _923 = -_896;
    vec2 _925 = _919 * ldexp(_920, _923);
    ResType _928;
    _928._m0 = frexp((_918 * _920) - vec2(0.00390625), _928._m1);
    vec2 _933 = min(ldexp(vec2(0.5), clamp(_928._m1, ivec2(0), ivec2(4)) + _923), vec2(0.5));
    ivec2 _937 = ivec2(max(_925 - _933, vec2(0.0)));
    bvec2 _939 = notEqual(_937, ivec2(_925 + _933));
    bool _940 = _939.x;
    bool _941 = _939.y;
    bool _954 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_937, _892), uint64_t(((1 | (_940 ? 2 : 0)) | (_941 ? 4 : 0)) | ((_940 && _941) ? 8 : 0)) << uint64_t(_903 * 4), !_954);
    vec2 _957 = vec2(textureSize(_11, _905).xy);
    ivec2 _960 = -_896;
    vec2 _962 = _919 * ldexp(_957, _960);
    ResType _965;
    _965._m0 = frexp((_918 * _957) - vec2(0.00390625), _965._m1);
    vec2 _970 = min(ldexp(vec2(0.5), clamp(_965._m1, ivec2(0), ivec2(4)) + _960), vec2(0.5));
    ivec2 _974 = ivec2(max(_962 - _970, vec2(0.0)));
    bvec2 _976 = notEqual(_974, ivec2(_962 + _970));
    bool _977 = _976.x;
    bool _978 = _976.y;
    bool _991 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_974, _892), uint64_t(((1 | (_977 ? 2 : 0)) | (_978 ? 4 : 0)) | ((_977 && _978) ? 8 : 0)) << uint64_t(_905 * 4), (!_991) && (_903 != _905));
    int _996 = int(roundEven(gl_FragCoord.z));
    ivec2 _1000 = imageSize(_24).xy & ivec2(15);
    int _1002 = textureQueryLevels(_11) - 1;
    float _1004 = spvNClamp(_76, 0.0, float(_1002));
    int _1005 = int(_1004);
    int _1007 = int(_1004 + 0.9970703125);
    vec2 _1010 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1014 = -_1000;
    vec2 _1016 = _1010 * ldexp(vec2(textureSize(_11, _1005).xy), _1014);
    vec2 _1017 = ldexp(vec2(0.5), _1014);
    ivec2 _1021 = ivec2(max(_1016 - _1017, vec2(0.0)));
    bvec2 _1023 = notEqual(_1021, ivec2(_1016 + _1017));
    bool _1024 = _1023.x;
    bool _1025 = _1023.y;
    bool _1038 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1021, _996), uint64_t(((1 | (_1024 ? 2 : 0)) | (_1025 ? 4 : 0)) | ((_1024 && _1025) ? 8 : 0)) << uint64_t(_1005 * 4), !_1038);
    ivec2 _1044 = -_1000;
    vec2 _1046 = _1010 * ldexp(vec2(textureSize(_11, _1007).xy), _1044);
    vec2 _1047 = ldexp(vec2(0.5), _1044);
    ivec2 _1051 = ivec2(max(_1046 - _1047, vec2(0.0)));
    bvec2 _1053 = notEqual(_1051, ivec2(_1046 + _1047));
    bool _1054 = _1053.x;
    bool _1055 = _1053.y;
    bool _1068 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1051, _996), uint64_t(((1 | (_1054 ? 2 : 0)) | (_1055 ? 4 : 0)) | ((_1054 && _1055) ? 8 : 0)) << uint64_t(_1007 * 4), (!_1068) && (_1005 != _1007));
    int _1073 = int(roundEven(gl_FragCoord.z));
    ivec2 _1077 = imageSize(_24).xy & ivec2(15);
    int _1079 = textureQueryLevels(_11) - 1;
    vec2 _1080 = vec2(textureSize(_11, 0).xy);
    vec2 _1085 = _1080 * vec2(GRADX.x, GRADX.y);
    vec2 _1086 = _1080 * vec2(GRADY.x, GRADY.y);
    float _1093 = spvNClamp(log2(max(dot(_1085, _1085), dot(_1086, _1086))) * 0.5, 0.0, float(_1079));
    int _1094 = int(_1093);
    int _1096 = int(_1093 + 0.9970703125);
    vec2 _1099 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1103 = -_1077;
    vec2 _1105 = _1099 * ldexp(vec2(textureSize(_11, _1094).xy), _1103);
    vec2 _1106 = ldexp(vec2(0.5), _1103);
    ivec2 _1110 = ivec2(max(_1105 - _1106, vec2(0.0)));
    bvec2 _1112 = notEqual(_1110, ivec2(_1105 + _1106));
    bool _1113 = _1112.x;
    bool _1114 = _1112.y;
    bool _1127 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1110, _1073), uint64_t(((1 | (_1113 ? 2 : 0)) | (_1114 ? 4 : 0)) | ((_1113 && _1114) ? 8 : 0)) << uint64_t(_1094 * 4), !_1127);
    ivec2 _1133 = -_1077;
    vec2 _1135 = _1099 * ldexp(vec2(textureSize(_11, _1096).xy), _1133);
    vec2 _1136 = ldexp(vec2(0.5), _1133);
    ivec2 _1140 = ivec2(max(_1135 - _1136, vec2(0.0)));
    bvec2 _1142 = notEqual(_1140, ivec2(_1135 + _1136));
    bool _1143 = _1142.x;
    bool _1144 = _1142.y;
    bool _1157 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1140, _1073), uint64_t(((1 | (_1143 ? 2 : 0)) | (_1144 ? 4 : 0)) | ((_1143 && _1144) ? 8 : 0)) << uint64_t(_1096 * 4), (!_1157) && (_1094 != _1096));
    int _1162 = int(roundEven(gl_FragCoord.z));
    ivec2 _1166 = imageSize(_24).xy & ivec2(15);
    int _1168 = textureQueryLevels(_11) - 1;
    vec2 _1169 = vec2(textureSize(_11, 0).xy);
    vec2 _1174 = _1169 * vec2(GRADX.x, GRADX.y);
    vec2 _1175 = _1169 * vec2(GRADY.x, GRADY.y);
    float _1184 = min(max(spvNClamp(log2(max(dot(_1174, _1174), dot(_1175, _1175))) * 0.5, 0.0, float(_1168)), CLAMP), 14.0);
    int _1185 = int(_1184);
    int _1187 = int(_1184 + 0.9970703125);
    vec2 _1190 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1194 = -_1166;
    vec2 _1196 = _1190 * ldexp(vec2(textureSize(_11, _1185).xy), _1194);
    vec2 _1197 = ldexp(vec2(0.5), _1194);
    ivec2 _1201 = ivec2(max(_1196 - _1197, vec2(0.0)));
    bvec2 _1203 = notEqual(_1201, ivec2(_1196 + _1197));
    bool _1204 = _1203.x;
    bool _1205 = _1203.y;
    bool _1218 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1201, _1162), uint64_t(((1 | (_1204 ? 2 : 0)) | (_1205 ? 4 : 0)) | ((_1204 && _1205) ? 8 : 0)) << uint64_t(_1185 * 4), !_1218);
    ivec2 _1224 = -_1166;
    vec2 _1226 = _1190 * ldexp(vec2(textureSize(_11, _1187).xy), _1224);
    vec2 _1227 = ldexp(vec2(0.5), _1224);
    ivec2 _1231 = ivec2(max(_1226 - _1227, vec2(0.0)));
    bvec2 _1233 = notEqual(_1231, ivec2(_1226 + _1227));
    bool _1234 = _1233.x;
    bool _1235 = _1233.y;
    bool _1248 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1231, _1162), uint64_t(((1 | (_1234 ? 2 : 0)) | (_1235 ? 4 : 0)) | ((_1234 && _1235) ? 8 : 0)) << uint64_t(_1187 * 4), (!_1248) && (_1185 != _1187));
    int _1253 = int(roundEven(gl_FragCoord.z));
    vec2 _1254 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1257 = imageSize(_24).xy & ivec2(15);
    float _1260 = exp2(gl_FragCoord.z);
    vec2 _1263 = textureQueryLod(sampler2DArray(_11, _33), _1254 * subgroupQuadBroadcast(_1260, 0u));
    float _1264 = _1263.x;
    int _1265 = int(_1264);
    int _1267 = int(_1264 + 0.9970703125);
    vec2 _1272 = abs(dFdx(_1254));
    vec2 _1273 = abs(dFdy(_1254));
    vec2 _1281 = vec2(max(_1272.x, _1273.x), max(_1272.y, _1273.y)) * _1260;
    vec2 _1282 = fract(_1254);
    vec2 _1283 = vec2(textureSize(_11, _1265).xy);
    ivec2 _1286 = -_1257;
    vec2 _1288 = _1282 * ldexp(_1283, _1286);
    ResType _1291;
    _1291._m0 = frexp((_1281 * _1283) - vec2(0.00390625), _1291._m1);
    vec2 _1296 = min(ldexp(vec2(0.5), clamp(_1291._m1, ivec2(0), ivec2(4)) + _1286), vec2(0.5));
    ivec2 _1300 = ivec2(max(_1288 - _1296, vec2(0.0)));
    bvec2 _1302 = notEqual(_1300, ivec2(_1288 + _1296));
    bool _1303 = _1302.x;
    bool _1304 = _1302.y;
    bool _1317 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1300, _1253), uint64_t(((1 | (_1303 ? 2 : 0)) | (_1304 ? 4 : 0)) | ((_1303 && _1304) ? 8 : 0)) << uint64_t(_1265 * 4), !_1317);
    vec2 _1320 = vec2(textureSize(_11, _1267).xy);
    ivec2 _1323 = -_1257;
    vec2 _1325 = _1282 * ldexp(_1320, _1323);
    ResType _1328;
    _1328._m0 = frexp((_1281 * _1320) - vec2(0.00390625), _1328._m1);
    vec2 _1333 = min(ldexp(vec2(0.5), clamp(_1328._m1, ivec2(0), ivec2(4)) + _1323), vec2(0.5));
    ivec2 _1337 = ivec2(max(_1325 - _1333, vec2(0.0)));
    bvec2 _1339 = notEqual(_1337, ivec2(_1325 + _1333));
    bool _1340 = _1339.x;
    bool _1341 = _1339.y;
    bool _1354 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1337, _1253), uint64_t(((1 | (_1340 ? 2 : 0)) | (_1341 ? 4 : 0)) | ((_1340 && _1341) ? 8 : 0)) << uint64_t(_1267 * 4), (!_1354) && (_1265 != _1267));
    int _1359 = int(roundEven(gl_FragCoord.z));
    vec2 _1360 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1363 = imageSize(_24).xy & ivec2(15);
    float _1366 = exp2(_76);
    float _1372 = min(max(textureQueryLod(sampler2DArray(_11, _33), _1360 * subgroupQuadBroadcast(_1366, 0u)).x, CLAMP), 14.0);
    int _1373 = int(_1372);
    int _1375 = int(_1372 + 0.9970703125);
    vec2 _1380 = abs(dFdx(_1360));
    vec2 _1381 = abs(dFdy(_1360));
    vec2 _1389 = vec2(max(_1380.x, _1381.x), max(_1380.y, _1381.y)) * _1366;
    vec2 _1390 = fract(_1360);
    vec2 _1391 = vec2(textureSize(_11, _1373).xy);
    ivec2 _1394 = -_1363;
    vec2 _1396 = _1390 * ldexp(_1391, _1394);
    ResType _1399;
    _1399._m0 = frexp((_1389 * _1391) - vec2(0.00390625), _1399._m1);
    vec2 _1404 = min(ldexp(vec2(0.5), clamp(_1399._m1, ivec2(0), ivec2(4)) + _1394), vec2(0.5));
    ivec2 _1408 = ivec2(max(_1396 - _1404, vec2(0.0)));
    bvec2 _1410 = notEqual(_1408, ivec2(_1396 + _1404));
    bool _1411 = _1410.x;
    bool _1412 = _1410.y;
    bool _1425 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1408, _1359), uint64_t(((1 | (_1411 ? 2 : 0)) | (_1412 ? 4 : 0)) | ((_1411 && _1412) ? 8 : 0)) << uint64_t(_1373 * 4), !_1425);
    vec2 _1428 = vec2(textureSize(_11, _1375).xy);
    ivec2 _1431 = -_1363;
    vec2 _1433 = _1390 * ldexp(_1428, _1431);
    ResType _1436;
    _1436._m0 = frexp((_1389 * _1428) - vec2(0.00390625), _1436._m1);
    vec2 _1441 = min(ldexp(vec2(0.5), clamp(_1436._m1, ivec2(0), ivec2(4)) + _1431), vec2(0.5));
    ivec2 _1445 = ivec2(max(_1433 - _1441, vec2(0.0)));
    bvec2 _1447 = notEqual(_1445, ivec2(_1433 + _1441));
    bool _1448 = _1447.x;
    bool _1449 = _1447.y;
    bool _1462 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1445, _1359), uint64_t(((1 | (_1448 ? 2 : 0)) | (_1449 ? 4 : 0)) | ((_1448 && _1449) ? 8 : 0)) << uint64_t(_1375 * 4), (!_1462) && (_1373 != _1375));
    uint _1466 = IDX + 0u;
    uint _1469 = IDX + 0u;
    uint _1472 = IDX + 0u;
    vec2 _1475 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1477 = imageSize(_27[nonuniformEXT(_1466)]) & ivec2(15);
    vec2 _1481 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1469], _36[_1472])), _1475);
    float _1482 = _1481.x;
    int _1483 = int(_1482);
    int _1485 = int(_1482 + 0.9970703125);
    vec2 _1490 = abs(dFdx(_1475));
    vec2 _1491 = abs(dFdy(_1475));
    vec2 _1498 = vec2(max(_1490.x, _1491.x), max(_1490.y, _1491.y));
    vec2 _1499 = fract(_1475);
    vec2 _1500 = vec2(textureSize(_14[nonuniformEXT(_1469)], _1483));
    ivec2 _1502 = -_1477;
    vec2 _1504 = _1499 * ldexp(_1500, _1502);
    ResType _1507;
    _1507._m0 = frexp((_1498 * _1500) - vec2(0.00390625), _1507._m1);
    vec2 _1512 = min(ldexp(vec2(0.5), clamp(_1507._m1, ivec2(0), ivec2(4)) + _1502), vec2(0.5));
    ivec2 _1516 = ivec2(max(_1504 - _1512, vec2(0.0)));
    bvec2 _1518 = notEqual(_1516, ivec2(_1504 + _1512));
    bool _1519 = _1518.x;
    bool _1520 = _1518.y;
    bool _1532 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1466], _1516, uint64_t(((1 | (_1519 ? 2 : 0)) | (_1520 ? 4 : 0)) | ((_1519 && _1520) ? 8 : 0)) << uint64_t(_1483 * 4), !_1532);
    vec2 _1560 = vec2(textureSize(_14[nonuniformEXT(_1469)], _1485));
    ivec2 _1562 = -_1477;
    vec2 _1564 = _1499 * ldexp(_1560, _1562);
    ResType _1567;
    _1567._m0 = frexp((_1498 * _1560) - vec2(0.00390625), _1567._m1);
    vec2 _1572 = min(ldexp(vec2(0.5), clamp(_1567._m1, ivec2(0), ivec2(4)) + _1562), vec2(0.5));
    ivec2 _1576 = ivec2(max(_1564 - _1572, vec2(0.0)));
    bvec2 _1578 = notEqual(_1576, ivec2(_1564 + _1572));
    bool _1579 = _1578.x;
    bool _1580 = _1578.y;
    bool _1592 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1466], _1576, uint64_t(((1 | (_1579 ? 2 : 0)) | (_1580 ? 4 : 0)) | ((_1579 && _1580) ? 8 : 0)) << uint64_t(_1485 * 4), (!_1592) && (_1483 != _1485));
    uint _1596 = IDX + 0u;
    uint _1599 = IDX + 0u;
    int _1603 = int(roundEven(gl_FragCoord.z));
    vec2 _1604 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1607 = imageSize(_30[nonuniformEXT(_1596)]).xy & ivec2(15);
    vec2 _1611 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1599], _36[_1472])), _1604);
    float _1612 = _1611.x;
    int _1613 = int(_1612);
    int _1615 = int(_1612 + 0.9970703125);
    vec2 _1620 = abs(dFdx(_1604));
    vec2 _1621 = abs(dFdy(_1604));
    vec2 _1628 = vec2(max(_1620.x, _1621.x), max(_1620.y, _1621.y));
    vec2 _1629 = fract(_1604);
    vec2 _1630 = vec2(textureSize(_17[nonuniformEXT(_1599)], _1613).xy);
    ivec2 _1633 = -_1607;
    vec2 _1635 = _1629 * ldexp(_1630, _1633);
    ResType _1638;
    _1638._m0 = frexp((_1628 * _1630) - vec2(0.00390625), _1638._m1);
    vec2 _1643 = min(ldexp(vec2(0.5), clamp(_1638._m1, ivec2(0), ivec2(4)) + _1633), vec2(0.5));
    ivec2 _1647 = ivec2(max(_1635 - _1643, vec2(0.0)));
    bvec2 _1649 = notEqual(_1647, ivec2(_1635 + _1643));
    bool _1650 = _1649.x;
    bool _1651 = _1649.y;
    bool _1664 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1596], ivec3(_1647, _1603), uint64_t(((1 | (_1650 ? 2 : 0)) | (_1651 ? 4 : 0)) | ((_1650 && _1651) ? 8 : 0)) << uint64_t(_1613 * 4), !_1664);
    vec2 _1692 = vec2(textureSize(_17[nonuniformEXT(_1599)], _1615).xy);
    ivec2 _1695 = -_1607;
    vec2 _1697 = _1629 * ldexp(_1692, _1695);
    ResType _1700;
    _1700._m0 = frexp((_1628 * _1692) - vec2(0.00390625), _1700._m1);
    vec2 _1705 = min(ldexp(vec2(0.5), clamp(_1700._m1, ivec2(0), ivec2(4)) + _1695), vec2(0.5));
    ivec2 _1709 = ivec2(max(_1697 - _1705, vec2(0.0)));
    bvec2 _1711 = notEqual(_1709, ivec2(_1697 + _1705));
    bool _1712 = _1711.x;
    bool _1713 = _1711.y;
    bool _1726 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1596], ivec3(_1709, _1603), uint64_t(((1 | (_1712 ? 2 : 0)) | (_1713 ? 4 : 0)) | ((_1712 && _1713) ? 8 : 0)) << uint64_t(_1615 * 4), (!_1726) && (_1613 != _1615));
    vec2 _1730 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1732 = imageSize(_27[nonuniformEXT(_1466)]) & ivec2(15);
    vec2 _1735 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1469], _36[_1472])), _1730);
    float _1736 = _1735.x;
    int _1737 = int(_1736);
    int _1739 = int(_1736 + 0.9970703125);
    vec2 _1744 = abs(dFdx(_1730));
    vec2 _1745 = abs(dFdy(_1730));
    vec2 _1752 = vec2(max(_1744.x, _1745.x), max(_1744.y, _1745.y));
    vec2 _1753 = fract(_1730);
    vec2 _1754 = vec2(textureSize(_14[nonuniformEXT(_1469)], _1737));
    ivec2 _1756 = -_1732;
    vec2 _1758 = _1753 * ldexp(_1754, _1756);
    ResType _1761;
    _1761._m0 = frexp((_1752 * _1754) - vec2(0.00390625), _1761._m1);
    vec2 _1766 = min(ldexp(vec2(0.5), clamp(_1761._m1, ivec2(0), ivec2(4)) + _1756), vec2(0.5));
    ivec2 _1770 = ivec2(max(_1758 - _1766, vec2(0.0)));
    bvec2 _1772 = notEqual(_1770, ivec2(_1758 + _1766));
    bool _1773 = _1772.x;
    bool _1774 = _1772.y;
    bool _1786 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1466], _1770, uint64_t(((1 | (_1773 ? 2 : 0)) | (_1774 ? 4 : 0)) | ((_1773 && _1774) ? 8 : 0)) << uint64_t(_1737 * 4), !_1786);
    vec2 _1789 = vec2(textureSize(_14[nonuniformEXT(_1469)], _1739));
    ivec2 _1791 = -_1732;
    vec2 _1793 = _1753 * ldexp(_1789, _1791);
    ResType _1796;
    _1796._m0 = frexp((_1752 * _1789) - vec2(0.00390625), _1796._m1);
    vec2 _1801 = min(ldexp(vec2(0.5), clamp(_1796._m1, ivec2(0), ivec2(4)) + _1791), vec2(0.5));
    ivec2 _1805 = ivec2(max(_1793 - _1801, vec2(0.0)));
    bvec2 _1807 = notEqual(_1805, ivec2(_1793 + _1801));
    bool _1808 = _1807.x;
    bool _1809 = _1807.y;
    bool _1821 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1466], _1805, uint64_t(((1 | (_1808 ? 2 : 0)) | (_1809 ? 4 : 0)) | ((_1808 && _1809) ? 8 : 0)) << uint64_t(_1739 * 4), (!_1821) && (_1737 != _1739));
    int _1826 = int(roundEven(gl_FragCoord.z));
    vec2 _1827 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1830 = imageSize(_30[nonuniformEXT(_1596)]).xy & ivec2(15);
    vec2 _1833 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1599], _36[_1472])), _1827);
    float _1834 = _1833.x;
    int _1835 = int(_1834);
    int _1837 = int(_1834 + 0.9970703125);
    vec2 _1842 = abs(dFdx(_1827));
    vec2 _1843 = abs(dFdy(_1827));
    vec2 _1850 = vec2(max(_1842.x, _1843.x), max(_1842.y, _1843.y));
    vec2 _1851 = fract(_1827);
    vec2 _1852 = vec2(textureSize(_17[nonuniformEXT(_1599)], _1835).xy);
    ivec2 _1855 = -_1830;
    vec2 _1857 = _1851 * ldexp(_1852, _1855);
    ResType _1860;
    _1860._m0 = frexp((_1850 * _1852) - vec2(0.00390625), _1860._m1);
    vec2 _1865 = min(ldexp(vec2(0.5), clamp(_1860._m1, ivec2(0), ivec2(4)) + _1855), vec2(0.5));
    ivec2 _1869 = ivec2(max(_1857 - _1865, vec2(0.0)));
    bvec2 _1871 = notEqual(_1869, ivec2(_1857 + _1865));
    bool _1872 = _1871.x;
    bool _1873 = _1871.y;
    bool _1886 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1596], ivec3(_1869, _1826), uint64_t(((1 | (_1872 ? 2 : 0)) | (_1873 ? 4 : 0)) | ((_1872 && _1873) ? 8 : 0)) << uint64_t(_1835 * 4), !_1886);
    vec2 _1889 = vec2(textureSize(_17[nonuniformEXT(_1599)], _1837).xy);
    ivec2 _1892 = -_1830;
    vec2 _1894 = _1851 * ldexp(_1889, _1892);
    ResType _1897;
    _1897._m0 = frexp((_1850 * _1889) - vec2(0.00390625), _1897._m1);
    vec2 _1902 = min(ldexp(vec2(0.5), clamp(_1897._m1, ivec2(0), ivec2(4)) + _1892), vec2(0.5));
    ivec2 _1906 = ivec2(max(_1894 - _1902, vec2(0.0)));
    bvec2 _1908 = notEqual(_1906, ivec2(_1894 + _1902));
    bool _1909 = _1908.x;
    bool _1910 = _1908.y;
    bool _1923 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1596], ivec3(_1906, _1826), uint64_t(((1 | (_1909 ? 2 : 0)) | (_1910 ? 4 : 0)) | ((_1909 && _1910) ? 8 : 0)) << uint64_t(_1837 * 4), (!_1923) && (_1835 != _1837));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 1928
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
OpCapability VulkanMemoryModel
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_shader_image_int64"
%78 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %17 %21 %24 %27 %30 %33 %36 %39 %42 %43 %45 %48
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
OpName %1538 "WriteFeedbackNonUniform"
OpName %1534 "img"
OpName %1535 "coord"
OpName %1536 "value"
OpName %1537 "active_lane"
OpName %1549 "is_done"
OpName %1670 "WriteFeedbackArrayNonUniform"
OpName %1666 "img"
OpName %1667 "coord"
OpName %1668 "value"
OpName %1669 "active_lane"
OpName %1681 "is_done"
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
OpDecorate %1466 NonUniform
OpDecorate %1468 NonUniform
OpDecorate %1469 NonUniform
OpDecorate %1471 NonUniform
OpDecorate %1472 NonUniform
OpDecorate %1474 NonUniform
OpDecorate %1480 NonUniform
OpDecorate %1557 NonUniform
OpDecorate %1596 NonUniform
OpDecorate %1598 NonUniform
OpDecorate %1599 NonUniform
OpDecorate %1601 NonUniform
OpDecorate %1610 NonUniform
OpDecorate %1689 NonUniform
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
%189 = OpConstant %46 5
%236 = OpConstant %5 14
%762 = OpTypeVector %80 3
%768 = OpTypeSampledImage %9
%825 = OpTypeVector %79 3
%826 = OpTypeFunction %1 %23 %762 %18 %79
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %1927
%1927 = OpLabel
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
%158 = OpIsHelperInvocationEXT %79
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
%223 = OpIsHelperInvocationEXT %79
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
%286 = OpIsHelperInvocationEXT %79
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
%321 = OpIsHelperInvocationEXT %79
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
%363 = OpIsHelperInvocationEXT %79
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
%391 = OpIsHelperInvocationEXT %79
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
%444 = OpIsHelperInvocationEXT %79
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
%472 = OpIsHelperInvocationEXT %79
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
%527 = OpIsHelperInvocationEXT %79
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
%555 = OpIsHelperInvocationEXT %79
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
%619 = OpIsHelperInvocationEXT %79
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
%654 = OpIsHelperInvocationEXT %79
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
%720 = OpIsHelperInvocationEXT %79
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
%755 = OpIsHelperInvocationEXT %79
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
%823 = OpIsHelperInvocationEXT %79
%824 = OpLogicalNot %79 %823
%852 = OpFunctionCall %1 %831 %24 %822 %821 %824
%854 = OpImageQuerySizeLod %762 %51 %774
%855 = OpVectorShuffle %82 %854 %854 0 1
%853 = OpConvertSToF %40 %855
%856 = OpSNegate %82 %765
%857 = OpExtInst %40 %78 Ldexp %853 %856
%858 = OpFMul %40 %788 %857
%859 = OpFMul %40 %787 %853
%860 = OpFSub %40 %859 %121
%861 = OpExtInst %122 %78 FrexpStruct %860
%862 = OpCompositeExtract %82 %861 1
%863 = OpExtInst %82 %78 SClamp %862 %127 %129
%864 = OpIAdd %82 %863 %856
%865 = OpExtInst %40 %78 Ldexp %133 %864
%866 = OpExtInst %40 %78 FMin %865 %133
%867 = OpFSub %40 %858 %866
%868 = OpExtInst %40 %78 FMax %867 %138
%869 = OpFAdd %40 %858 %866
%870 = OpConvertFToS %82 %868
%871 = OpConvertFToS %82 %869
%872 = OpINotEqual %81 %870 %871
%873 = OpCompositeExtract %79 %872 0
%874 = OpCompositeExtract %79 %872 1
%875 = OpLogicalAnd %79 %873 %874
%876 = OpSelect %80 %873 %147 %126
%877 = OpBitwiseOr %80 %90 %876
%878 = OpSelect %80 %874 %128 %126
%879 = OpBitwiseOr %80 %877 %878
%880 = OpSelect %80 %875 %152 %126
%881 = OpBitwiseOr %80 %879 %880
%882 = OpSConvert %18 %881
%883 = OpIMul %80 %774 %128
%884 = OpSConvert %18 %883
%885 = OpShiftLeftLogical %18 %882 %884
%886 = OpCompositeConstruct %762 %870 %760
%887 = OpIsHelperInvocationEXT %79
%888 = OpLogicalNot %79 %887
%889 = OpLogicalAnd %79 %888 %776
%890 = OpFunctionCall %1 %831 %24 %886 %885 %889
%891 = OpExtInst %5 %78 RoundEven %72
%892 = OpConvertFToS %80 %891
%893 = OpCompositeConstruct %40 %67 %69
%894 = OpImageQuerySize %762 %49
%895 = OpVectorShuffle %82 %894 %894 0 1
%896 = OpBitwiseAnd %82 %895 %87
%897 = OpImageQueryLevels %80 %51
%898 = OpISub %80 %897 %90
%899 = OpImageQueryLod %40 %769 %893
%900 = OpCompositeExtract %5 %899 0
%901 = OpExtInst %5 %78 FMax %900 %55
%902 = OpExtInst %5 %78 FMin %901 %236
%903 = OpConvertFToS %80 %902
%904 = OpFAdd %5 %902 %97
%905 = OpConvertFToS %80 %904
%906 = OpExtInst %80 %78 SMin %905 %898
%907 = OpINotEqual %79 %903 %905
%908 = OpDPdx %40 %893
%909 = OpDPdy %40 %893
%910 = OpExtInst %40 %78 FAbs %908
%911 = OpExtInst %40 %78 FAbs %909
%912 = OpCompositeExtract %5 %910 0
%913 = OpCompositeExtract %5 %911 0
%914 = OpCompositeExtract %5 %910 1
%915 = OpCompositeExtract %5 %911 1
%916 = OpExtInst %5 %78 FMax %912 %913
%917 = OpExtInst %5 %78 FMax %914 %915
%918 = OpCompositeConstruct %40 %916 %917
%919 = OpExtInst %40 %78 Fract %893
%921 = OpImageQuerySizeLod %762 %51 %903
%922 = OpVectorShuffle %82 %921 %921 0 1
%920 = OpConvertSToF %40 %922
%923 = OpSNegate %82 %896
%924 = OpExtInst %40 %78 Ldexp %920 %923
%925 = OpFMul %40 %919 %924
%926 = OpFMul %40 %918 %920
%927 = OpFSub %40 %926 %121
%928 = OpExtInst %122 %78 FrexpStruct %927
%929 = OpCompositeExtract %82 %928 1
%930 = OpExtInst %82 %78 SClamp %929 %127 %129
%931 = OpIAdd %82 %930 %923
%932 = OpExtInst %40 %78 Ldexp %133 %931
%933 = OpExtInst %40 %78 FMin %932 %133
%934 = OpFSub %40 %925 %933
%935 = OpExtInst %40 %78 FMax %934 %138
%936 = OpFAdd %40 %925 %933
%937 = OpConvertFToS %82 %935
%938 = OpConvertFToS %82 %936
%939 = OpINotEqual %81 %937 %938
%940 = OpCompositeExtract %79 %939 0
%941 = OpCompositeExtract %79 %939 1
%942 = OpLogicalAnd %79 %940 %941
%943 = OpSelect %80 %940 %147 %126
%944 = OpBitwiseOr %80 %90 %943
%945 = OpSelect %80 %941 %128 %126
%946 = OpBitwiseOr %80 %944 %945
%947 = OpSelect %80 %942 %152 %126
%948 = OpBitwiseOr %80 %946 %947
%949 = OpSConvert %18 %948
%950 = OpIMul %80 %903 %128
%951 = OpSConvert %18 %950
%952 = OpShiftLeftLogical %18 %949 %951
%953 = OpCompositeConstruct %762 %937 %892
%954 = OpIsHelperInvocationEXT %79
%955 = OpLogicalNot %79 %954
%956 = OpFunctionCall %1 %831 %24 %953 %952 %955
%958 = OpImageQuerySizeLod %762 %51 %905
%959 = OpVectorShuffle %82 %958 %958 0 1
%957 = OpConvertSToF %40 %959
%960 = OpSNegate %82 %896
%961 = OpExtInst %40 %78 Ldexp %957 %960
%962 = OpFMul %40 %919 %961
%963 = OpFMul %40 %918 %957
%964 = OpFSub %40 %963 %121
%965 = OpExtInst %122 %78 FrexpStruct %964
%966 = OpCompositeExtract %82 %965 1
%967 = OpExtInst %82 %78 SClamp %966 %127 %129
%968 = OpIAdd %82 %967 %960
%969 = OpExtInst %40 %78 Ldexp %133 %968
%970 = OpExtInst %40 %78 FMin %969 %133
%971 = OpFSub %40 %962 %970
%972 = OpExtInst %40 %78 FMax %971 %138
%973 = OpFAdd %40 %962 %970
%974 = OpConvertFToS %82 %972
%975 = OpConvertFToS %82 %973
%976 = OpINotEqual %81 %974 %975
%977 = OpCompositeExtract %79 %976 0
%978 = OpCompositeExtract %79 %976 1
%979 = OpLogicalAnd %79 %977 %978
%980 = OpSelect %80 %977 %147 %126
%981 = OpBitwiseOr %80 %90 %980
%982 = OpSelect %80 %978 %128 %126
%983 = OpBitwiseOr %80 %981 %982
%984 = OpSelect %80 %979 %152 %126
%985 = OpBitwiseOr %80 %983 %984
%986 = OpSConvert %18 %985
%987 = OpIMul %80 %905 %128
%988 = OpSConvert %18 %987
%989 = OpShiftLeftLogical %18 %986 %988
%990 = OpCompositeConstruct %762 %974 %892
%991 = OpIsHelperInvocationEXT %79
%992 = OpLogicalNot %79 %991
%993 = OpLogicalAnd %79 %992 %907
%994 = OpFunctionCall %1 %831 %24 %990 %989 %993
%995 = OpExtInst %5 %78 RoundEven %72
%996 = OpConvertFToS %80 %995
%997 = OpCompositeConstruct %40 %67 %69
%998 = OpImageQuerySize %762 %49
%999 = OpVectorShuffle %82 %998 %998 0 1
%1000 = OpBitwiseAnd %82 %999 %87
%1001 = OpImageQueryLevels %80 %51
%1002 = OpISub %80 %1001 %90
%1003 = OpConvertSToF %5 %1002
%1004 = OpExtInst %5 %78 NClamp %76 %137 %1003
%1005 = OpConvertFToS %80 %1004
%1006 = OpFAdd %5 %1004 %97
%1007 = OpConvertFToS %80 %1006
%1008 = OpExtInst %80 %78 SMin %1007 %1002
%1009 = OpINotEqual %79 %1005 %1007
%1010 = OpExtInst %40 %78 Fract %997
%1012 = OpImageQuerySizeLod %762 %51 %1005
%1013 = OpVectorShuffle %82 %1012 %1012 0 1
%1011 = OpConvertSToF %40 %1013
%1014 = OpSNegate %82 %1000
%1015 = OpExtInst %40 %78 Ldexp %1011 %1014
%1016 = OpFMul %40 %1010 %1015
%1017 = OpExtInst %40 %78 Ldexp %133 %1014
%1018 = OpFSub %40 %1016 %1017
%1019 = OpExtInst %40 %78 FMax %1018 %138
%1020 = OpFAdd %40 %1016 %1017
%1021 = OpConvertFToS %82 %1019
%1022 = OpConvertFToS %82 %1020
%1023 = OpINotEqual %81 %1021 %1022
%1024 = OpCompositeExtract %79 %1023 0
%1025 = OpCompositeExtract %79 %1023 1
%1026 = OpLogicalAnd %79 %1024 %1025
%1027 = OpSelect %80 %1024 %147 %126
%1028 = OpBitwiseOr %80 %90 %1027
%1029 = OpSelect %80 %1025 %128 %126
%1030 = OpBitwiseOr %80 %1028 %1029
%1031 = OpSelect %80 %1026 %152 %126
%1032 = OpBitwiseOr %80 %1030 %1031
%1033 = OpSConvert %18 %1032
%1034 = OpIMul %80 %1005 %128
%1035 = OpSConvert %18 %1034
%1036 = OpShiftLeftLogical %18 %1033 %1035
%1037 = OpCompositeConstruct %762 %1021 %996
%1038 = OpIsHelperInvocationEXT %79
%1039 = OpLogicalNot %79 %1038
%1040 = OpFunctionCall %1 %831 %24 %1037 %1036 %1039
%1042 = OpImageQuerySizeLod %762 %51 %1007
%1043 = OpVectorShuffle %82 %1042 %1042 0 1
%1041 = OpConvertSToF %40 %1043
%1044 = OpSNegate %82 %1000
%1045 = OpExtInst %40 %78 Ldexp %1041 %1044
%1046 = OpFMul %40 %1010 %1045
%1047 = OpExtInst %40 %78 Ldexp %133 %1044
%1048 = OpFSub %40 %1046 %1047
%1049 = OpExtInst %40 %78 FMax %1048 %138
%1050 = OpFAdd %40 %1046 %1047
%1051 = OpConvertFToS %82 %1049
%1052 = OpConvertFToS %82 %1050
%1053 = OpINotEqual %81 %1051 %1052
%1054 = OpCompositeExtract %79 %1053 0
%1055 = OpCompositeExtract %79 %1053 1
%1056 = OpLogicalAnd %79 %1054 %1055
%1057 = OpSelect %80 %1054 %147 %126
%1058 = OpBitwiseOr %80 %90 %1057
%1059 = OpSelect %80 %1055 %128 %126
%1060 = OpBitwiseOr %80 %1058 %1059
%1061 = OpSelect %80 %1056 %152 %126
%1062 = OpBitwiseOr %80 %1060 %1061
%1063 = OpSConvert %18 %1062
%1064 = OpIMul %80 %1007 %128
%1065 = OpSConvert %18 %1064
%1066 = OpShiftLeftLogical %18 %1063 %1065
%1067 = OpCompositeConstruct %762 %1051 %996
%1068 = OpIsHelperInvocationEXT %79
%1069 = OpLogicalNot %79 %1068
%1070 = OpLogicalAnd %79 %1069 %1009
%1071 = OpFunctionCall %1 %831 %24 %1067 %1066 %1070
%1072 = OpExtInst %5 %78 RoundEven %72
%1073 = OpConvertFToS %80 %1072
%1074 = OpCompositeConstruct %40 %67 %69
%1075 = OpImageQuerySize %762 %49
%1076 = OpVectorShuffle %82 %1075 %1075 0 1
%1077 = OpBitwiseAnd %82 %1076 %87
%1078 = OpImageQueryLevels %80 %51
%1079 = OpISub %80 %1078 %90
%1081 = OpImageQuerySizeLod %762 %51 %126
%1082 = OpVectorShuffle %82 %1081 %1081 0 1
%1080 = OpConvertSToF %40 %1082
%1083 = OpCompositeConstruct %40 %63 %65
%1084 = OpCompositeConstruct %40 %58 %61
%1085 = OpFMul %40 %1080 %1083
%1086 = OpFMul %40 %1080 %1084
%1087 = OpDot %5 %1085 %1085
%1088 = OpDot %5 %1086 %1086
%1089 = OpExtInst %5 %78 FMax %1087 %1088
%1090 = OpExtInst %5 %78 Log2 %1089
%1091 = OpFMul %5 %1090 %132
%1092 = OpConvertSToF %5 %1079
%1093 = OpExtInst %5 %78 NClamp %1091 %137 %1092
%1094 = OpConvertFToS %80 %1093
%1095 = OpFAdd %5 %1093 %97
%1096 = OpConvertFToS %80 %1095
%1097 = OpExtInst %80 %78 SMin %1096 %1079
%1098 = OpINotEqual %79 %1094 %1096
%1099 = OpExtInst %40 %78 Fract %1074
%1101 = OpImageQuerySizeLod %762 %51 %1094
%1102 = OpVectorShuffle %82 %1101 %1101 0 1
%1100 = OpConvertSToF %40 %1102
%1103 = OpSNegate %82 %1077
%1104 = OpExtInst %40 %78 Ldexp %1100 %1103
%1105 = OpFMul %40 %1099 %1104
%1106 = OpExtInst %40 %78 Ldexp %133 %1103
%1107 = OpFSub %40 %1105 %1106
%1108 = OpExtInst %40 %78 FMax %1107 %138
%1109 = OpFAdd %40 %1105 %1106
%1110 = OpConvertFToS %82 %1108
%1111 = OpConvertFToS %82 %1109
%1112 = OpINotEqual %81 %1110 %1111
%1113 = OpCompositeExtract %79 %1112 0
%1114 = OpCompositeExtract %79 %1112 1
%1115 = OpLogicalAnd %79 %1113 %1114
%1116 = OpSelect %80 %1113 %147 %126
%1117 = OpBitwiseOr %80 %90 %1116
%1118 = OpSelect %80 %1114 %128 %126
%1119 = OpBitwiseOr %80 %1117 %1118
%1120 = OpSelect %80 %1115 %152 %126
%1121 = OpBitwiseOr %80 %1119 %1120
%1122 = OpSConvert %18 %1121
%1123 = OpIMul %80 %1094 %128
%1124 = OpSConvert %18 %1123
%1125 = OpShiftLeftLogical %18 %1122 %1124
%1126 = OpCompositeConstruct %762 %1110 %1073
%1127 = OpIsHelperInvocationEXT %79
%1128 = OpLogicalNot %79 %1127
%1129 = OpFunctionCall %1 %831 %24 %1126 %1125 %1128
%1131 = OpImageQuerySizeLod %762 %51 %1096
%1132 = OpVectorShuffle %82 %1131 %1131 0 1
%1130 = OpConvertSToF %40 %1132
%1133 = OpSNegate %82 %1077
%1134 = OpExtInst %40 %78 Ldexp %1130 %1133
%1135 = OpFMul %40 %1099 %1134
%1136 = OpExtInst %40 %78 Ldexp %133 %1133
%1137 = OpFSub %40 %1135 %1136
%1138 = OpExtInst %40 %78 FMax %1137 %138
%1139 = OpFAdd %40 %1135 %1136
%1140 = OpConvertFToS %82 %1138
%1141 = OpConvertFToS %82 %1139
%1142 = OpINotEqual %81 %1140 %1141
%1143 = OpCompositeExtract %79 %1142 0
%1144 = OpCompositeExtract %79 %1142 1
%1145 = OpLogicalAnd %79 %1143 %1144
%1146 = OpSelect %80 %1143 %147 %126
%1147 = OpBitwiseOr %80 %90 %1146
%1148 = OpSelect %80 %1144 %128 %126
%1149 = OpBitwiseOr %80 %1147 %1148
%1150 = OpSelect %80 %1145 %152 %126
%1151 = OpBitwiseOr %80 %1149 %1150
%1152 = OpSConvert %18 %1151
%1153 = OpIMul %80 %1096 %128
%1154 = OpSConvert %18 %1153
%1155 = OpShiftLeftLogical %18 %1152 %1154
%1156 = OpCompositeConstruct %762 %1140 %1073
%1157 = OpIsHelperInvocationEXT %79
%1158 = OpLogicalNot %79 %1157
%1159 = OpLogicalAnd %79 %1158 %1098
%1160 = OpFunctionCall %1 %831 %24 %1156 %1155 %1159
%1161 = OpExtInst %5 %78 RoundEven %72
%1162 = OpConvertFToS %80 %1161
%1163 = OpCompositeConstruct %40 %67 %69
%1164 = OpImageQuerySize %762 %49
%1165 = OpVectorShuffle %82 %1164 %1164 0 1
%1166 = OpBitwiseAnd %82 %1165 %87
%1167 = OpImageQueryLevels %80 %51
%1168 = OpISub %80 %1167 %90
%1170 = OpImageQuerySizeLod %762 %51 %126
%1171 = OpVectorShuffle %82 %1170 %1170 0 1
%1169 = OpConvertSToF %40 %1171
%1172 = OpCompositeConstruct %40 %63 %65
%1173 = OpCompositeConstruct %40 %58 %61
%1174 = OpFMul %40 %1169 %1172
%1175 = OpFMul %40 %1169 %1173
%1176 = OpDot %5 %1174 %1174
%1177 = OpDot %5 %1175 %1175
%1178 = OpExtInst %5 %78 FMax %1176 %1177
%1179 = OpExtInst %5 %78 Log2 %1178
%1180 = OpFMul %5 %1179 %132
%1181 = OpConvertSToF %5 %1168
%1182 = OpExtInst %5 %78 NClamp %1180 %137 %1181
%1183 = OpExtInst %5 %78 FMax %1182 %55
%1184 = OpExtInst %5 %78 FMin %1183 %236
%1185 = OpConvertFToS %80 %1184
%1186 = OpFAdd %5 %1184 %97
%1187 = OpConvertFToS %80 %1186
%1188 = OpExtInst %80 %78 SMin %1187 %1168
%1189 = OpINotEqual %79 %1185 %1187
%1190 = OpExtInst %40 %78 Fract %1163
%1192 = OpImageQuerySizeLod %762 %51 %1185
%1193 = OpVectorShuffle %82 %1192 %1192 0 1
%1191 = OpConvertSToF %40 %1193
%1194 = OpSNegate %82 %1166
%1195 = OpExtInst %40 %78 Ldexp %1191 %1194
%1196 = OpFMul %40 %1190 %1195
%1197 = OpExtInst %40 %78 Ldexp %133 %1194
%1198 = OpFSub %40 %1196 %1197
%1199 = OpExtInst %40 %78 FMax %1198 %138
%1200 = OpFAdd %40 %1196 %1197
%1201 = OpConvertFToS %82 %1199
%1202 = OpConvertFToS %82 %1200
%1203 = OpINotEqual %81 %1201 %1202
%1204 = OpCompositeExtract %79 %1203 0
%1205 = OpCompositeExtract %79 %1203 1
%1206 = OpLogicalAnd %79 %1204 %1205
%1207 = OpSelect %80 %1204 %147 %126
%1208 = OpBitwiseOr %80 %90 %1207
%1209 = OpSelect %80 %1205 %128 %126
%1210 = OpBitwiseOr %80 %1208 %1209
%1211 = OpSelect %80 %1206 %152 %126
%1212 = OpBitwiseOr %80 %1210 %1211
%1213 = OpSConvert %18 %1212
%1214 = OpIMul %80 %1185 %128
%1215 = OpSConvert %18 %1214
%1216 = OpShiftLeftLogical %18 %1213 %1215
%1217 = OpCompositeConstruct %762 %1201 %1162
%1218 = OpIsHelperInvocationEXT %79
%1219 = OpLogicalNot %79 %1218
%1220 = OpFunctionCall %1 %831 %24 %1217 %1216 %1219
%1222 = OpImageQuerySizeLod %762 %51 %1187
%1223 = OpVectorShuffle %82 %1222 %1222 0 1
%1221 = OpConvertSToF %40 %1223
%1224 = OpSNegate %82 %1166
%1225 = OpExtInst %40 %78 Ldexp %1221 %1224
%1226 = OpFMul %40 %1190 %1225
%1227 = OpExtInst %40 %78 Ldexp %133 %1224
%1228 = OpFSub %40 %1226 %1227
%1229 = OpExtInst %40 %78 FMax %1228 %138
%1230 = OpFAdd %40 %1226 %1227
%1231 = OpConvertFToS %82 %1229
%1232 = OpConvertFToS %82 %1230
%1233 = OpINotEqual %81 %1231 %1232
%1234 = OpCompositeExtract %79 %1233 0
%1235 = OpCompositeExtract %79 %1233 1
%1236 = OpLogicalAnd %79 %1234 %1235
%1237 = OpSelect %80 %1234 %147 %126
%1238 = OpBitwiseOr %80 %90 %1237
%1239 = OpSelect %80 %1235 %128 %126
%1240 = OpBitwiseOr %80 %1238 %1239
%1241 = OpSelect %80 %1236 %152 %126
%1242 = OpBitwiseOr %80 %1240 %1241
%1243 = OpSConvert %18 %1242
%1244 = OpIMul %80 %1187 %128
%1245 = OpSConvert %18 %1244
%1246 = OpShiftLeftLogical %18 %1243 %1245
%1247 = OpCompositeConstruct %762 %1231 %1162
%1248 = OpIsHelperInvocationEXT %79
%1249 = OpLogicalNot %79 %1248
%1250 = OpLogicalAnd %79 %1249 %1189
%1251 = OpFunctionCall %1 %831 %24 %1247 %1246 %1250
%1252 = OpExtInst %5 %78 RoundEven %72
%1253 = OpConvertFToS %80 %1252
%1254 = OpCompositeConstruct %40 %67 %69
%1255 = OpImageQuerySize %762 %49
%1256 = OpVectorShuffle %82 %1255 %1255 0 1
%1257 = OpBitwiseAnd %82 %1256 %87
%1258 = OpImageQueryLevels %80 %51
%1259 = OpISub %80 %1258 %90
%1260 = OpExtInst %5 %78 Exp2 %72
%1261 = OpGroupNonUniformQuadBroadcast %5 %74 %1260 %57
%1262 = OpVectorTimesScalar %40 %1254 %1261
%1263 = OpImageQueryLod %40 %769 %1262
%1264 = OpCompositeExtract %5 %1263 0
%1265 = OpConvertFToS %80 %1264
%1266 = OpFAdd %5 %1264 %97
%1267 = OpConvertFToS %80 %1266
%1268 = OpExtInst %80 %78 SMin %1267 %1259
%1269 = OpINotEqual %79 %1265 %1267
%1270 = OpDPdx %40 %1254
%1271 = OpDPdy %40 %1254
%1272 = OpExtInst %40 %78 FAbs %1270
%1273 = OpExtInst %40 %78 FAbs %1271
%1274 = OpCompositeExtract %5 %1272 0
%1275 = OpCompositeExtract %5 %1273 0
%1276 = OpCompositeExtract %5 %1272 1
%1277 = OpCompositeExtract %5 %1273 1
%1278 = OpExtInst %5 %78 FMax %1274 %1275
%1279 = OpExtInst %5 %78 FMax %1276 %1277
%1280 = OpCompositeConstruct %40 %1278 %1279
%1281 = OpVectorTimesScalar %40 %1280 %1260
%1282 = OpExtInst %40 %78 Fract %1254
%1284 = OpImageQuerySizeLod %762 %51 %1265
%1285 = OpVectorShuffle %82 %1284 %1284 0 1
%1283 = OpConvertSToF %40 %1285
%1286 = OpSNegate %82 %1257
%1287 = OpExtInst %40 %78 Ldexp %1283 %1286
%1288 = OpFMul %40 %1282 %1287
%1289 = OpFMul %40 %1281 %1283
%1290 = OpFSub %40 %1289 %121
%1291 = OpExtInst %122 %78 FrexpStruct %1290
%1292 = OpCompositeExtract %82 %1291 1
%1293 = OpExtInst %82 %78 SClamp %1292 %127 %129
%1294 = OpIAdd %82 %1293 %1286
%1295 = OpExtInst %40 %78 Ldexp %133 %1294
%1296 = OpExtInst %40 %78 FMin %1295 %133
%1297 = OpFSub %40 %1288 %1296
%1298 = OpExtInst %40 %78 FMax %1297 %138
%1299 = OpFAdd %40 %1288 %1296
%1300 = OpConvertFToS %82 %1298
%1301 = OpConvertFToS %82 %1299
%1302 = OpINotEqual %81 %1300 %1301
%1303 = OpCompositeExtract %79 %1302 0
%1304 = OpCompositeExtract %79 %1302 1
%1305 = OpLogicalAnd %79 %1303 %1304
%1306 = OpSelect %80 %1303 %147 %126
%1307 = OpBitwiseOr %80 %90 %1306
%1308 = OpSelect %80 %1304 %128 %126
%1309 = OpBitwiseOr %80 %1307 %1308
%1310 = OpSelect %80 %1305 %152 %126
%1311 = OpBitwiseOr %80 %1309 %1310
%1312 = OpSConvert %18 %1311
%1313 = OpIMul %80 %1265 %128
%1314 = OpSConvert %18 %1313
%1315 = OpShiftLeftLogical %18 %1312 %1314
%1316 = OpCompositeConstruct %762 %1300 %1253
%1317 = OpIsHelperInvocationEXT %79
%1318 = OpLogicalNot %79 %1317
%1319 = OpFunctionCall %1 %831 %24 %1316 %1315 %1318
%1321 = OpImageQuerySizeLod %762 %51 %1267
%1322 = OpVectorShuffle %82 %1321 %1321 0 1
%1320 = OpConvertSToF %40 %1322
%1323 = OpSNegate %82 %1257
%1324 = OpExtInst %40 %78 Ldexp %1320 %1323
%1325 = OpFMul %40 %1282 %1324
%1326 = OpFMul %40 %1281 %1320
%1327 = OpFSub %40 %1326 %121
%1328 = OpExtInst %122 %78 FrexpStruct %1327
%1329 = OpCompositeExtract %82 %1328 1
%1330 = OpExtInst %82 %78 SClamp %1329 %127 %129
%1331 = OpIAdd %82 %1330 %1323
%1332 = OpExtInst %40 %78 Ldexp %133 %1331
%1333 = OpExtInst %40 %78 FMin %1332 %133
%1334 = OpFSub %40 %1325 %1333
%1335 = OpExtInst %40 %78 FMax %1334 %138
%1336 = OpFAdd %40 %1325 %1333
%1337 = OpConvertFToS %82 %1335
%1338 = OpConvertFToS %82 %1336
%1339 = OpINotEqual %81 %1337 %1338
%1340 = OpCompositeExtract %79 %1339 0
%1341 = OpCompositeExtract %79 %1339 1
%1342 = OpLogicalAnd %79 %1340 %1341
%1343 = OpSelect %80 %1340 %147 %126
%1344 = OpBitwiseOr %80 %90 %1343
%1345 = OpSelect %80 %1341 %128 %126
%1346 = OpBitwiseOr %80 %1344 %1345
%1347 = OpSelect %80 %1342 %152 %126
%1348 = OpBitwiseOr %80 %1346 %1347
%1349 = OpSConvert %18 %1348
%1350 = OpIMul %80 %1267 %128
%1351 = OpSConvert %18 %1350
%1352 = OpShiftLeftLogical %18 %1349 %1351
%1353 = OpCompositeConstruct %762 %1337 %1253
%1354 = OpIsHelperInvocationEXT %79
%1355 = OpLogicalNot %79 %1354
%1356 = OpLogicalAnd %79 %1355 %1269
%1357 = OpFunctionCall %1 %831 %24 %1353 %1352 %1356
%1358 = OpExtInst %5 %78 RoundEven %72
%1359 = OpConvertFToS %80 %1358
%1360 = OpCompositeConstruct %40 %67 %69
%1361 = OpImageQuerySize %762 %49
%1362 = OpVectorShuffle %82 %1361 %1361 0 1
%1363 = OpBitwiseAnd %82 %1362 %87
%1364 = OpImageQueryLevels %80 %51
%1365 = OpISub %80 %1364 %90
%1366 = OpExtInst %5 %78 Exp2 %76
%1367 = OpGroupNonUniformQuadBroadcast %5 %74 %1366 %57
%1368 = OpVectorTimesScalar %40 %1360 %1367
%1369 = OpImageQueryLod %40 %769 %1368
%1370 = OpCompositeExtract %5 %1369 0
%1371 = OpExtInst %5 %78 FMax %1370 %55
%1372 = OpExtInst %5 %78 FMin %1371 %236
%1373 = OpConvertFToS %80 %1372
%1374 = OpFAdd %5 %1372 %97
%1375 = OpConvertFToS %80 %1374
%1376 = OpExtInst %80 %78 SMin %1375 %1365
%1377 = OpINotEqual %79 %1373 %1375
%1378 = OpDPdx %40 %1360
%1379 = OpDPdy %40 %1360
%1380 = OpExtInst %40 %78 FAbs %1378
%1381 = OpExtInst %40 %78 FAbs %1379
%1382 = OpCompositeExtract %5 %1380 0
%1383 = OpCompositeExtract %5 %1381 0
%1384 = OpCompositeExtract %5 %1380 1
%1385 = OpCompositeExtract %5 %1381 1
%1386 = OpExtInst %5 %78 FMax %1382 %1383
%1387 = OpExtInst %5 %78 FMax %1384 %1385
%1388 = OpCompositeConstruct %40 %1386 %1387
%1389 = OpVectorTimesScalar %40 %1388 %1366
%1390 = OpExtInst %40 %78 Fract %1360
%1392 = OpImageQuerySizeLod %762 %51 %1373
%1393 = OpVectorShuffle %82 %1392 %1392 0 1
%1391 = OpConvertSToF %40 %1393
%1394 = OpSNegate %82 %1363
%1395 = OpExtInst %40 %78 Ldexp %1391 %1394
%1396 = OpFMul %40 %1390 %1395
%1397 = OpFMul %40 %1389 %1391
%1398 = OpFSub %40 %1397 %121
%1399 = OpExtInst %122 %78 FrexpStruct %1398
%1400 = OpCompositeExtract %82 %1399 1
%1401 = OpExtInst %82 %78 SClamp %1400 %127 %129
%1402 = OpIAdd %82 %1401 %1394
%1403 = OpExtInst %40 %78 Ldexp %133 %1402
%1404 = OpExtInst %40 %78 FMin %1403 %133
%1405 = OpFSub %40 %1396 %1404
%1406 = OpExtInst %40 %78 FMax %1405 %138
%1407 = OpFAdd %40 %1396 %1404
%1408 = OpConvertFToS %82 %1406
%1409 = OpConvertFToS %82 %1407
%1410 = OpINotEqual %81 %1408 %1409
%1411 = OpCompositeExtract %79 %1410 0
%1412 = OpCompositeExtract %79 %1410 1
%1413 = OpLogicalAnd %79 %1411 %1412
%1414 = OpSelect %80 %1411 %147 %126
%1415 = OpBitwiseOr %80 %90 %1414
%1416 = OpSelect %80 %1412 %128 %126
%1417 = OpBitwiseOr %80 %1415 %1416
%1418 = OpSelect %80 %1413 %152 %126
%1419 = OpBitwiseOr %80 %1417 %1418
%1420 = OpSConvert %18 %1419
%1421 = OpIMul %80 %1373 %128
%1422 = OpSConvert %18 %1421
%1423 = OpShiftLeftLogical %18 %1420 %1422
%1424 = OpCompositeConstruct %762 %1408 %1359
%1425 = OpIsHelperInvocationEXT %79
%1426 = OpLogicalNot %79 %1425
%1427 = OpFunctionCall %1 %831 %24 %1424 %1423 %1426
%1429 = OpImageQuerySizeLod %762 %51 %1375
%1430 = OpVectorShuffle %82 %1429 %1429 0 1
%1428 = OpConvertSToF %40 %1430
%1431 = OpSNegate %82 %1363
%1432 = OpExtInst %40 %78 Ldexp %1428 %1431
%1433 = OpFMul %40 %1390 %1432
%1434 = OpFMul %40 %1389 %1428
%1435 = OpFSub %40 %1434 %121
%1436 = OpExtInst %122 %78 FrexpStruct %1435
%1437 = OpCompositeExtract %82 %1436 1
%1438 = OpExtInst %82 %78 SClamp %1437 %127 %129
%1439 = OpIAdd %82 %1438 %1431
%1440 = OpExtInst %40 %78 Ldexp %133 %1439
%1441 = OpExtInst %40 %78 FMin %1440 %133
%1442 = OpFSub %40 %1433 %1441
%1443 = OpExtInst %40 %78 FMax %1442 %138
%1444 = OpFAdd %40 %1433 %1441
%1445 = OpConvertFToS %82 %1443
%1446 = OpConvertFToS %82 %1444
%1447 = OpINotEqual %81 %1445 %1446
%1448 = OpCompositeExtract %79 %1447 0
%1449 = OpCompositeExtract %79 %1447 1
%1450 = OpLogicalAnd %79 %1448 %1449
%1451 = OpSelect %80 %1448 %147 %126
%1452 = OpBitwiseOr %80 %90 %1451
%1453 = OpSelect %80 %1449 %128 %126
%1454 = OpBitwiseOr %80 %1452 %1453
%1455 = OpSelect %80 %1450 %152 %126
%1456 = OpBitwiseOr %80 %1454 %1455
%1457 = OpSConvert %18 %1456
%1458 = OpIMul %80 %1375 %128
%1459 = OpSConvert %18 %1458
%1460 = OpShiftLeftLogical %18 %1457 %1459
%1461 = OpCompositeConstruct %762 %1445 %1359
%1462 = OpIsHelperInvocationEXT %79
%1463 = OpLogicalNot %79 %1462
%1464 = OpLogicalAnd %79 %1463 %1377
%1465 = OpFunctionCall %1 %831 %24 %1461 %1460 %1464
%1466 = OpIAdd %46 %54 %57
%1467 = OpAccessChain %20 %27 %1466
%1468 = OpLoad %19 %1467
%1469 = OpIAdd %46 %54 %57
%1470 = OpAccessChain %7 %14 %1469
%1471 = OpLoad %6 %1470
%1472 = OpIAdd %46 %54 %57
%1473 = OpAccessChain %32 %36 %1472
%1474 = OpLoad %31 %1473
%1475 = OpCompositeConstruct %40 %67 %69
%1476 = OpImageQuerySize %82 %1468
%1477 = OpBitwiseAnd %82 %1476 %87
%1478 = OpImageQueryLevels %80 %1471
%1479 = OpISub %80 %1478 %90
%1480 = OpSampledImage %91 %1471 %1474
%1481 = OpImageQueryLod %40 %1480 %1475
%1482 = OpCompositeExtract %5 %1481 0
%1483 = OpConvertFToS %80 %1482
%1484 = OpFAdd %5 %1482 %97
%1485 = OpConvertFToS %80 %1484
%1486 = OpExtInst %80 %78 SMin %1485 %1479
%1487 = OpINotEqual %79 %1483 %1485
%1488 = OpDPdx %40 %1475
%1489 = OpDPdy %40 %1475
%1490 = OpExtInst %40 %78 FAbs %1488
%1491 = OpExtInst %40 %78 FAbs %1489
%1492 = OpCompositeExtract %5 %1490 0
%1493 = OpCompositeExtract %5 %1491 0
%1494 = OpCompositeExtract %5 %1490 1
%1495 = OpCompositeExtract %5 %1491 1
%1496 = OpExtInst %5 %78 FMax %1492 %1493
%1497 = OpExtInst %5 %78 FMax %1494 %1495
%1498 = OpCompositeConstruct %40 %1496 %1497
%1499 = OpExtInst %40 %78 Fract %1475
%1501 = OpImageQuerySizeLod %82 %1471 %1483
%1500 = OpConvertSToF %40 %1501
%1502 = OpSNegate %82 %1477
%1503 = OpExtInst %40 %78 Ldexp %1500 %1502
%1504 = OpFMul %40 %1499 %1503
%1505 = OpFMul %40 %1498 %1500
%1506 = OpFSub %40 %1505 %121
%1507 = OpExtInst %122 %78 FrexpStruct %1506
%1508 = OpCompositeExtract %82 %1507 1
%1509 = OpExtInst %82 %78 SClamp %1508 %127 %129
%1510 = OpIAdd %82 %1509 %1502
%1511 = OpExtInst %40 %78 Ldexp %133 %1510
%1512 = OpExtInst %40 %78 FMin %1511 %133
%1513 = OpFSub %40 %1504 %1512
%1514 = OpExtInst %40 %78 FMax %1513 %138
%1515 = OpFAdd %40 %1504 %1512
%1516 = OpConvertFToS %82 %1514
%1517 = OpConvertFToS %82 %1515
%1518 = OpINotEqual %81 %1516 %1517
%1519 = OpCompositeExtract %79 %1518 0
%1520 = OpCompositeExtract %79 %1518 1
%1521 = OpLogicalAnd %79 %1519 %1520
%1522 = OpSelect %80 %1519 %147 %126
%1523 = OpBitwiseOr %80 %90 %1522
%1524 = OpSelect %80 %1520 %128 %126
%1525 = OpBitwiseOr %80 %1523 %1524
%1526 = OpSelect %80 %1521 %152 %126
%1527 = OpBitwiseOr %80 %1525 %1526
%1528 = OpSConvert %18 %1527
%1529 = OpIMul %80 %1483 %128
%1530 = OpSConvert %18 %1529
%1531 = OpShiftLeftLogical %18 %1528 %1530
%1532 = OpIsHelperInvocationEXT %79
%1533 = OpLogicalNot %79 %1532
%1559 = OpFunctionCall %1 %1538 %1467 %1516 %1531 %1533
%1561 = OpImageQuerySizeLod %82 %1471 %1485
%1560 = OpConvertSToF %40 %1561
%1562 = OpSNegate %82 %1477
%1563 = OpExtInst %40 %78 Ldexp %1560 %1562
%1564 = OpFMul %40 %1499 %1563
%1565 = OpFMul %40 %1498 %1560
%1566 = OpFSub %40 %1565 %121
%1567 = OpExtInst %122 %78 FrexpStruct %1566
%1568 = OpCompositeExtract %82 %1567 1
%1569 = OpExtInst %82 %78 SClamp %1568 %127 %129
%1570 = OpIAdd %82 %1569 %1562
%1571 = OpExtInst %40 %78 Ldexp %133 %1570
%1572 = OpExtInst %40 %78 FMin %1571 %133
%1573 = OpFSub %40 %1564 %1572
%1574 = OpExtInst %40 %78 FMax %1573 %138
%1575 = OpFAdd %40 %1564 %1572
%1576 = OpConvertFToS %82 %1574
%1577 = OpConvertFToS %82 %1575
%1578 = OpINotEqual %81 %1576 %1577
%1579 = OpCompositeExtract %79 %1578 0
%1580 = OpCompositeExtract %79 %1578 1
%1581 = OpLogicalAnd %79 %1579 %1580
%1582 = OpSelect %80 %1579 %147 %126
%1583 = OpBitwiseOr %80 %90 %1582
%1584 = OpSelect %80 %1580 %128 %126
%1585 = OpBitwiseOr %80 %1583 %1584
%1586 = OpSelect %80 %1581 %152 %126
%1587 = OpBitwiseOr %80 %1585 %1586
%1588 = OpSConvert %18 %1587
%1589 = OpIMul %80 %1485 %128
%1590 = OpSConvert %18 %1589
%1591 = OpShiftLeftLogical %18 %1588 %1590
%1592 = OpIsHelperInvocationEXT %79
%1593 = OpLogicalNot %79 %1592
%1594 = OpLogicalAnd %79 %1593 %1487
%1595 = OpFunctionCall %1 %1538 %1467 %1576 %1591 %1594
%1596 = OpIAdd %46 %54 %57
%1597 = OpAccessChain %23 %30 %1596
%1598 = OpLoad %22 %1597
%1599 = OpIAdd %46 %54 %57
%1600 = OpAccessChain %10 %17 %1599
%1601 = OpLoad %9 %1600
%1602 = OpExtInst %5 %78 RoundEven %72
%1603 = OpConvertFToS %80 %1602
%1604 = OpCompositeConstruct %40 %67 %69
%1605 = OpImageQuerySize %762 %1598
%1606 = OpVectorShuffle %82 %1605 %1605 0 1
%1607 = OpBitwiseAnd %82 %1606 %87
%1608 = OpImageQueryLevels %80 %1601
%1609 = OpISub %80 %1608 %90
%1610 = OpSampledImage %768 %1601 %1474
%1611 = OpImageQueryLod %40 %1610 %1604
%1612 = OpCompositeExtract %5 %1611 0
%1613 = OpConvertFToS %80 %1612
%1614 = OpFAdd %5 %1612 %97
%1615 = OpConvertFToS %80 %1614
%1616 = OpExtInst %80 %78 SMin %1615 %1609
%1617 = OpINotEqual %79 %1613 %1615
%1618 = OpDPdx %40 %1604
%1619 = OpDPdy %40 %1604
%1620 = OpExtInst %40 %78 FAbs %1618
%1621 = OpExtInst %40 %78 FAbs %1619
%1622 = OpCompositeExtract %5 %1620 0
%1623 = OpCompositeExtract %5 %1621 0
%1624 = OpCompositeExtract %5 %1620 1
%1625 = OpCompositeExtract %5 %1621 1
%1626 = OpExtInst %5 %78 FMax %1622 %1623
%1627 = OpExtInst %5 %78 FMax %1624 %1625
%1628 = OpCompositeConstruct %40 %1626 %1627
%1629 = OpExtInst %40 %78 Fract %1604
%1631 = OpImageQuerySizeLod %762 %1601 %1613
%1632 = OpVectorShuffle %82 %1631 %1631 0 1
%1630 = OpConvertSToF %40 %1632
%1633 = OpSNegate %82 %1607
%1634 = OpExtInst %40 %78 Ldexp %1630 %1633
%1635 = OpFMul %40 %1629 %1634
%1636 = OpFMul %40 %1628 %1630
%1637 = OpFSub %40 %1636 %121
%1638 = OpExtInst %122 %78 FrexpStruct %1637
%1639 = OpCompositeExtract %82 %1638 1
%1640 = OpExtInst %82 %78 SClamp %1639 %127 %129
%1641 = OpIAdd %82 %1640 %1633
%1642 = OpExtInst %40 %78 Ldexp %133 %1641
%1643 = OpExtInst %40 %78 FMin %1642 %133
%1644 = OpFSub %40 %1635 %1643
%1645 = OpExtInst %40 %78 FMax %1644 %138
%1646 = OpFAdd %40 %1635 %1643
%1647 = OpConvertFToS %82 %1645
%1648 = OpConvertFToS %82 %1646
%1649 = OpINotEqual %81 %1647 %1648
%1650 = OpCompositeExtract %79 %1649 0
%1651 = OpCompositeExtract %79 %1649 1
%1652 = OpLogicalAnd %79 %1650 %1651
%1653 = OpSelect %80 %1650 %147 %126
%1654 = OpBitwiseOr %80 %90 %1653
%1655 = OpSelect %80 %1651 %128 %126
%1656 = OpBitwiseOr %80 %1654 %1655
%1657 = OpSelect %80 %1652 %152 %126
%1658 = OpBitwiseOr %80 %1656 %1657
%1659 = OpSConvert %18 %1658
%1660 = OpIMul %80 %1613 %128
%1661 = OpSConvert %18 %1660
%1662 = OpShiftLeftLogical %18 %1659 %1661
%1663 = OpCompositeConstruct %762 %1647 %1603
%1664 = OpIsHelperInvocationEXT %79
%1665 = OpLogicalNot %79 %1664
%1691 = OpFunctionCall %1 %1670 %1597 %1663 %1662 %1665
%1693 = OpImageQuerySizeLod %762 %1601 %1615
%1694 = OpVectorShuffle %82 %1693 %1693 0 1
%1692 = OpConvertSToF %40 %1694
%1695 = OpSNegate %82 %1607
%1696 = OpExtInst %40 %78 Ldexp %1692 %1695
%1697 = OpFMul %40 %1629 %1696
%1698 = OpFMul %40 %1628 %1692
%1699 = OpFSub %40 %1698 %121
%1700 = OpExtInst %122 %78 FrexpStruct %1699
%1701 = OpCompositeExtract %82 %1700 1
%1702 = OpExtInst %82 %78 SClamp %1701 %127 %129
%1703 = OpIAdd %82 %1702 %1695
%1704 = OpExtInst %40 %78 Ldexp %133 %1703
%1705 = OpExtInst %40 %78 FMin %1704 %133
%1706 = OpFSub %40 %1697 %1705
%1707 = OpExtInst %40 %78 FMax %1706 %138
%1708 = OpFAdd %40 %1697 %1705
%1709 = OpConvertFToS %82 %1707
%1710 = OpConvertFToS %82 %1708
%1711 = OpINotEqual %81 %1709 %1710
%1712 = OpCompositeExtract %79 %1711 0
%1713 = OpCompositeExtract %79 %1711 1
%1714 = OpLogicalAnd %79 %1712 %1713
%1715 = OpSelect %80 %1712 %147 %126
%1716 = OpBitwiseOr %80 %90 %1715
%1717 = OpSelect %80 %1713 %128 %126
%1718 = OpBitwiseOr %80 %1716 %1717
%1719 = OpSelect %80 %1714 %152 %126
%1720 = OpBitwiseOr %80 %1718 %1719
%1721 = OpSConvert %18 %1720
%1722 = OpIMul %80 %1615 %128
%1723 = OpSConvert %18 %1722
%1724 = OpShiftLeftLogical %18 %1721 %1723
%1725 = OpCompositeConstruct %762 %1709 %1603
%1726 = OpIsHelperInvocationEXT %79
%1727 = OpLogicalNot %79 %1726
%1728 = OpLogicalAnd %79 %1727 %1617
%1729 = OpFunctionCall %1 %1670 %1597 %1725 %1724 %1728
%1730 = OpCompositeConstruct %40 %67 %69
%1731 = OpImageQuerySize %82 %1468
%1732 = OpBitwiseAnd %82 %1731 %87
%1733 = OpImageQueryLevels %80 %1471
%1734 = OpISub %80 %1733 %90
%1735 = OpImageQueryLod %40 %1480 %1730
%1736 = OpCompositeExtract %5 %1735 0
%1737 = OpConvertFToS %80 %1736
%1738 = OpFAdd %5 %1736 %97
%1739 = OpConvertFToS %80 %1738
%1740 = OpExtInst %80 %78 SMin %1739 %1734
%1741 = OpINotEqual %79 %1737 %1739
%1742 = OpDPdx %40 %1730
%1743 = OpDPdy %40 %1730
%1744 = OpExtInst %40 %78 FAbs %1742
%1745 = OpExtInst %40 %78 FAbs %1743
%1746 = OpCompositeExtract %5 %1744 0
%1747 = OpCompositeExtract %5 %1745 0
%1748 = OpCompositeExtract %5 %1744 1
%1749 = OpCompositeExtract %5 %1745 1
%1750 = OpExtInst %5 %78 FMax %1746 %1747
%1751 = OpExtInst %5 %78 FMax %1748 %1749
%1752 = OpCompositeConstruct %40 %1750 %1751
%1753 = OpExtInst %40 %78 Fract %1730
%1755 = OpImageQuerySizeLod %82 %1471 %1737
%1754 = OpConvertSToF %40 %1755
%1756 = OpSNegate %82 %1732
%1757 = OpExtInst %40 %78 Ldexp %1754 %1756
%1758 = OpFMul %40 %1753 %1757
%1759 = OpFMul %40 %1752 %1754
%1760 = OpFSub %40 %1759 %121
%1761 = OpExtInst %122 %78 FrexpStruct %1760
%1762 = OpCompositeExtract %82 %1761 1
%1763 = OpExtInst %82 %78 SClamp %1762 %127 %129
%1764 = OpIAdd %82 %1763 %1756
%1765 = OpExtInst %40 %78 Ldexp %133 %1764
%1766 = OpExtInst %40 %78 FMin %1765 %133
%1767 = OpFSub %40 %1758 %1766
%1768 = OpExtInst %40 %78 FMax %1767 %138
%1769 = OpFAdd %40 %1758 %1766
%1770 = OpConvertFToS %82 %1768
%1771 = OpConvertFToS %82 %1769
%1772 = OpINotEqual %81 %1770 %1771
%1773 = OpCompositeExtract %79 %1772 0
%1774 = OpCompositeExtract %79 %1772 1
%1775 = OpLogicalAnd %79 %1773 %1774
%1776 = OpSelect %80 %1773 %147 %126
%1777 = OpBitwiseOr %80 %90 %1776
%1778 = OpSelect %80 %1774 %128 %126
%1779 = OpBitwiseOr %80 %1777 %1778
%1780 = OpSelect %80 %1775 %152 %126
%1781 = OpBitwiseOr %80 %1779 %1780
%1782 = OpSConvert %18 %1781
%1783 = OpIMul %80 %1737 %128
%1784 = OpSConvert %18 %1783
%1785 = OpShiftLeftLogical %18 %1782 %1784
%1786 = OpIsHelperInvocationEXT %79
%1787 = OpLogicalNot %79 %1786
%1788 = OpFunctionCall %1 %1538 %1467 %1770 %1785 %1787
%1790 = OpImageQuerySizeLod %82 %1471 %1739
%1789 = OpConvertSToF %40 %1790
%1791 = OpSNegate %82 %1732
%1792 = OpExtInst %40 %78 Ldexp %1789 %1791
%1793 = OpFMul %40 %1753 %1792
%1794 = OpFMul %40 %1752 %1789
%1795 = OpFSub %40 %1794 %121
%1796 = OpExtInst %122 %78 FrexpStruct %1795
%1797 = OpCompositeExtract %82 %1796 1
%1798 = OpExtInst %82 %78 SClamp %1797 %127 %129
%1799 = OpIAdd %82 %1798 %1791
%1800 = OpExtInst %40 %78 Ldexp %133 %1799
%1801 = OpExtInst %40 %78 FMin %1800 %133
%1802 = OpFSub %40 %1793 %1801
%1803 = OpExtInst %40 %78 FMax %1802 %138
%1804 = OpFAdd %40 %1793 %1801
%1805 = OpConvertFToS %82 %1803
%1806 = OpConvertFToS %82 %1804
%1807 = OpINotEqual %81 %1805 %1806
%1808 = OpCompositeExtract %79 %1807 0
%1809 = OpCompositeExtract %79 %1807 1
%1810 = OpLogicalAnd %79 %1808 %1809
%1811 = OpSelect %80 %1808 %147 %126
%1812 = OpBitwiseOr %80 %90 %1811
%1813 = OpSelect %80 %1809 %128 %126
%1814 = OpBitwiseOr %80 %1812 %1813
%1815 = OpSelect %80 %1810 %152 %126
%1816 = OpBitwiseOr %80 %1814 %1815
%1817 = OpSConvert %18 %1816
%1818 = OpIMul %80 %1739 %128
%1819 = OpSConvert %18 %1818
%1820 = OpShiftLeftLogical %18 %1817 %1819
%1821 = OpIsHelperInvocationEXT %79
%1822 = OpLogicalNot %79 %1821
%1823 = OpLogicalAnd %79 %1822 %1741
%1824 = OpFunctionCall %1 %1538 %1467 %1805 %1820 %1823
%1825 = OpExtInst %5 %78 RoundEven %72
%1826 = OpConvertFToS %80 %1825
%1827 = OpCompositeConstruct %40 %67 %69
%1828 = OpImageQuerySize %762 %1598
%1829 = OpVectorShuffle %82 %1828 %1828 0 1
%1830 = OpBitwiseAnd %82 %1829 %87
%1831 = OpImageQueryLevels %80 %1601
%1832 = OpISub %80 %1831 %90
%1833 = OpImageQueryLod %40 %1610 %1827
%1834 = OpCompositeExtract %5 %1833 0
%1835 = OpConvertFToS %80 %1834
%1836 = OpFAdd %5 %1834 %97
%1837 = OpConvertFToS %80 %1836
%1838 = OpExtInst %80 %78 SMin %1837 %1832
%1839 = OpINotEqual %79 %1835 %1837
%1840 = OpDPdx %40 %1827
%1841 = OpDPdy %40 %1827
%1842 = OpExtInst %40 %78 FAbs %1840
%1843 = OpExtInst %40 %78 FAbs %1841
%1844 = OpCompositeExtract %5 %1842 0
%1845 = OpCompositeExtract %5 %1843 0
%1846 = OpCompositeExtract %5 %1842 1
%1847 = OpCompositeExtract %5 %1843 1
%1848 = OpExtInst %5 %78 FMax %1844 %1845
%1849 = OpExtInst %5 %78 FMax %1846 %1847
%1850 = OpCompositeConstruct %40 %1848 %1849
%1851 = OpExtInst %40 %78 Fract %1827
%1853 = OpImageQuerySizeLod %762 %1601 %1835
%1854 = OpVectorShuffle %82 %1853 %1853 0 1
%1852 = OpConvertSToF %40 %1854
%1855 = OpSNegate %82 %1830
%1856 = OpExtInst %40 %78 Ldexp %1852 %1855
%1857 = OpFMul %40 %1851 %1856
%1858 = OpFMul %40 %1850 %1852
%1859 = OpFSub %40 %1858 %121
%1860 = OpExtInst %122 %78 FrexpStruct %1859
%1861 = OpCompositeExtract %82 %1860 1
%1862 = OpExtInst %82 %78 SClamp %1861 %127 %129
%1863 = OpIAdd %82 %1862 %1855
%1864 = OpExtInst %40 %78 Ldexp %133 %1863
%1865 = OpExtInst %40 %78 FMin %1864 %133
%1866 = OpFSub %40 %1857 %1865
%1867 = OpExtInst %40 %78 FMax %1866 %138
%1868 = OpFAdd %40 %1857 %1865
%1869 = OpConvertFToS %82 %1867
%1870 = OpConvertFToS %82 %1868
%1871 = OpINotEqual %81 %1869 %1870
%1872 = OpCompositeExtract %79 %1871 0
%1873 = OpCompositeExtract %79 %1871 1
%1874 = OpLogicalAnd %79 %1872 %1873
%1875 = OpSelect %80 %1872 %147 %126
%1876 = OpBitwiseOr %80 %90 %1875
%1877 = OpSelect %80 %1873 %128 %126
%1878 = OpBitwiseOr %80 %1876 %1877
%1879 = OpSelect %80 %1874 %152 %126
%1880 = OpBitwiseOr %80 %1878 %1879
%1881 = OpSConvert %18 %1880
%1882 = OpIMul %80 %1835 %128
%1883 = OpSConvert %18 %1882
%1884 = OpShiftLeftLogical %18 %1881 %1883
%1885 = OpCompositeConstruct %762 %1869 %1826
%1886 = OpIsHelperInvocationEXT %79
%1887 = OpLogicalNot %79 %1886
%1888 = OpFunctionCall %1 %1670 %1597 %1885 %1884 %1887
%1890 = OpImageQuerySizeLod %762 %1601 %1837
%1891 = OpVectorShuffle %82 %1890 %1890 0 1
%1889 = OpConvertSToF %40 %1891
%1892 = OpSNegate %82 %1830
%1893 = OpExtInst %40 %78 Ldexp %1889 %1892
%1894 = OpFMul %40 %1851 %1893
%1895 = OpFMul %40 %1850 %1889
%1896 = OpFSub %40 %1895 %121
%1897 = OpExtInst %122 %78 FrexpStruct %1896
%1898 = OpCompositeExtract %82 %1897 1
%1899 = OpExtInst %82 %78 SClamp %1898 %127 %129
%1900 = OpIAdd %82 %1899 %1892
%1901 = OpExtInst %40 %78 Ldexp %133 %1900
%1902 = OpExtInst %40 %78 FMin %1901 %133
%1903 = OpFSub %40 %1894 %1902
%1904 = OpExtInst %40 %78 FMax %1903 %138
%1905 = OpFAdd %40 %1894 %1902
%1906 = OpConvertFToS %82 %1904
%1907 = OpConvertFToS %82 %1905
%1908 = OpINotEqual %81 %1906 %1907
%1909 = OpCompositeExtract %79 %1908 0
%1910 = OpCompositeExtract %79 %1908 1
%1911 = OpLogicalAnd %79 %1909 %1910
%1912 = OpSelect %80 %1909 %147 %126
%1913 = OpBitwiseOr %80 %90 %1912
%1914 = OpSelect %80 %1910 %128 %126
%1915 = OpBitwiseOr %80 %1913 %1914
%1916 = OpSelect %80 %1911 %152 %126
%1917 = OpBitwiseOr %80 %1915 %1916
%1918 = OpSConvert %18 %1917
%1919 = OpIMul %80 %1837 %128
%1920 = OpSConvert %18 %1919
%1921 = OpShiftLeftLogical %18 %1918 %1920
%1922 = OpCompositeConstruct %762 %1906 %1826
%1923 = OpIsHelperInvocationEXT %79
%1924 = OpLogicalNot %79 %1923
%1925 = OpLogicalAnd %79 %1924 %1839
%1926 = OpFunctionCall %1 %1670 %1597 %1922 %1921 %1925
OpReturn
OpFunctionEnd
%166 = OpFunction %1 None %161
%162 = OpFunctionParameter %20
%163 = OpFunctionParameter %82
%164 = OpFunctionParameter %18
%165 = OpFunctionParameter %79
%167 = OpLabel
%179 = OpVariable %178 Function %177
OpSelectionMerge %176 None
OpBranchConditional %165 %168 %176
%168 = OpLabel
%180 = OpLoad %79 %179
%181 = OpLogicalNot %79 %180
OpLoopMerge %175 %174 None
OpBranchConditional %181 %169 %175
%169 = OpLabel
%182 = OpGroupNonUniformBroadcastFirst %82 %74 %163
%183 = OpIEqual %81 %163 %182
%184 = OpAll %79 %183
OpStore %179 %184
OpSelectionMerge %173 None
OpBranchConditional %184 %170 %173
%170 = OpLabel
%185 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %164
%186 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %172 None
OpBranchConditional %186 %171 %172
%171 = OpLabel
%187 = OpImageTexelPointer %160 %162 %163 %126
%188 = OpAtomicOr %18 %187 %189 %57 %185
OpBranch %172
%172 = OpLabel
OpBranch %173
%173 = OpLabel
OpBranch %174
%174 = OpLabel
OpBranch %168
%175 = OpLabel
OpBranch %176
%176 = OpLabel
OpReturn
OpFunctionEnd
%831 = OpFunction %1 None %826
%827 = OpFunctionParameter %23
%828 = OpFunctionParameter %762
%829 = OpFunctionParameter %18
%830 = OpFunctionParameter %79
%832 = OpLabel
%842 = OpVariable %178 Function %177
OpSelectionMerge %841 None
OpBranchConditional %830 %833 %841
%833 = OpLabel
%843 = OpLoad %79 %842
%844 = OpLogicalNot %79 %843
OpLoopMerge %840 %839 None
OpBranchConditional %844 %834 %840
%834 = OpLabel
%845 = OpGroupNonUniformBroadcastFirst %762 %74 %828
%846 = OpIEqual %825 %828 %845
%847 = OpAll %79 %846
OpStore %842 %847
OpSelectionMerge %838 None
OpBranchConditional %847 %835 %838
%835 = OpLabel
%848 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %829
%849 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %837 None
OpBranchConditional %849 %836 %837
%836 = OpLabel
%850 = OpImageTexelPointer %160 %827 %828 %126
%851 = OpAtomicOr %18 %850 %189 %57 %848
OpBranch %837
%837 = OpLabel
OpBranch %838
%838 = OpLabel
OpBranch %839
%839 = OpLabel
OpBranch %833
%840 = OpLabel
OpBranch %841
%841 = OpLabel
OpReturn
OpFunctionEnd
%1538 = OpFunction %1 None %161
%1534 = OpFunctionParameter %20
%1535 = OpFunctionParameter %82
%1536 = OpFunctionParameter %18
%1537 = OpFunctionParameter %79
%1539 = OpLabel
%1549 = OpVariable %178 Function %177
OpSelectionMerge %1548 None
OpBranchConditional %1537 %1540 %1548
%1540 = OpLabel
%1550 = OpLoad %79 %1549
%1551 = OpLogicalNot %79 %1550
OpLoopMerge %1547 %1546 None
OpBranchConditional %1551 %1541 %1547
%1541 = OpLabel
%1552 = OpGroupNonUniformBroadcastFirst %82 %74 %1535
%1553 = OpIEqual %81 %1535 %1552
%1554 = OpAll %79 %1553
OpStore %1549 %1554
OpSelectionMerge %1545 None
OpBranchConditional %1554 %1542 %1545
%1542 = OpLabel
%1555 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1536
%1556 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1544 None
OpBranchConditional %1556 %1543 %1544
%1543 = OpLabel
%1557 = OpImageTexelPointer %160 %1534 %1535 %126
%1558 = OpAtomicOr %18 %1557 %189 %57 %1555
OpBranch %1544
%1544 = OpLabel
OpBranch %1545
%1545 = OpLabel
OpBranch %1546
%1546 = OpLabel
OpBranch %1540
%1547 = OpLabel
OpBranch %1548
%1548 = OpLabel
OpReturn
OpFunctionEnd
%1670 = OpFunction %1 None %826
%1666 = OpFunctionParameter %23
%1667 = OpFunctionParameter %762
%1668 = OpFunctionParameter %18
%1669 = OpFunctionParameter %79
%1671 = OpLabel
%1681 = OpVariable %178 Function %177
OpSelectionMerge %1680 None
OpBranchConditional %1669 %1672 %1680
%1672 = OpLabel
%1682 = OpLoad %79 %1681
%1683 = OpLogicalNot %79 %1682
OpLoopMerge %1679 %1678 None
OpBranchConditional %1683 %1673 %1679
%1673 = OpLabel
%1684 = OpGroupNonUniformBroadcastFirst %762 %74 %1667
%1685 = OpIEqual %825 %1667 %1684
%1686 = OpAll %79 %1685
OpStore %1681 %1686
OpSelectionMerge %1677 None
OpBranchConditional %1686 %1674 %1677
%1674 = OpLabel
%1687 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1668
%1688 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1676 None
OpBranchConditional %1688 %1675 %1676
%1675 = OpLabel
%1689 = OpImageTexelPointer %160 %1666 %1667 %126
%1690 = OpAtomicOr %18 %1689 %189 %57 %1687
OpBranch %1676
%1676 = OpLabel
OpBranch %1677
%1677 = OpLabel
OpBranch %1678
%1678 = OpLabel
OpBranch %1672
%1679 = OpLabel
OpBranch %1680
%1680 = OpLabel
OpReturn
OpFunctionEnd
#endif
