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

layout(set = 0, binding = 0, r64ui) uniform readonly writeonly u64image2D _9[];
layout(set = 0, binding = 0) uniform texture2D _13;
layout(set = 0, binding = 1) uniform texture2DArray _16;
layout(set = 1, binding = 0) uniform texture2D _19[];
layout(set = 2, binding = 0) uniform texture2DArray _22[];
layout(set = 0, binding = 0, r64ui) uniform readonly writeonly u64image2D _24;
layout(set = 0, binding = 1, r64ui) uniform readonly writeonly u64image2DArray _27;
layout(set = 1, binding = 0, r64ui) uniform readonly writeonly u64image2D _30[];
layout(set = 2, binding = 0, r64ui) uniform readonly writeonly u64image2DArray _33[];
layout(set = 0, binding = 0) uniform sampler _36;
layout(set = 1, binding = 0) uniform sampler _39[];

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
            bool _185 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _185;
            if (_185)
            {
                uint64_t _186 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _189 = imageAtomicOr(img, coord, _186);
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
            bool _871 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _871;
            if (_871)
            {
                uint64_t _872 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _875 = imageAtomicOr(img, coord, _872);
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
            bool _1599 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1599;
            if (_1599)
            {
                uint64_t _1600 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1603 = imageAtomicOr(img, coord, _1600);
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
            bool _1733 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1733;
            if (_1733)
            {
                uint64_t _1734 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1737 = imageAtomicOr(img, coord, _1734);
                }
            }
        }
    }
}

void main()
{
    float _74 = 1.0 / gl_FragCoord.w;
    vec2 _84 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _86 = imageSize(_24) & ivec2(15);
    vec2 _94 = textureQueryLod(sampler2D(_13, _36), _84);
    float _95 = _94.x;
    int _96 = int(_95);
    int _99 = int(_95 + 0.9970703125);
    vec2 _104 = abs(dFdx(_84));
    vec2 _105 = abs(dFdy(_84));
    vec2 _112 = vec2(max(_104.x, _105.x), max(_104.y, _105.y));
    vec2 _113 = fract(_84);
    vec2 _114 = vec2(textureSize(_13, _96));
    ivec2 _116 = -_86;
    vec2 _118 = _113 * ldexp(_114, _116);
    ResType _124;
    _124._m0 = frexp((_112 * _114) - vec2(0.00390625), _124._m1);
    vec2 _135 = min(ldexp(vec2(0.5), clamp(_124._m1, ivec2(0), ivec2(4)) + _116), vec2(0.5));
    ivec2 _141 = ivec2(max(_118 - _135, vec2(0.0)));
    bvec2 _143 = notEqual(_141, ivec2(_118 + _135));
    bool _144 = _143.x;
    bool _145 = _143.y;
    bool _159 = helperInvocationEXT();
    WriteFeedback(_24, _141, uint64_t(((1 | (_144 ? 2 : 0)) | (_145 ? 4 : 0)) | ((_144 && _145) ? 8 : 0)) << uint64_t(_96 * 4), !_159);
    vec2 _191 = vec2(textureSize(_13, _99));
    ivec2 _193 = -_86;
    vec2 _195 = _113 * ldexp(_191, _193);
    ResType _198;
    _198._m0 = frexp((_112 * _191) - vec2(0.00390625), _198._m1);
    vec2 _203 = min(ldexp(vec2(0.5), clamp(_198._m1, ivec2(0), ivec2(4)) + _193), vec2(0.5));
    ivec2 _207 = ivec2(max(_195 - _203, vec2(0.0)));
    bvec2 _209 = notEqual(_207, ivec2(_195 + _203));
    bool _210 = _209.x;
    bool _211 = _209.y;
    bool _223 = helperInvocationEXT();
    WriteFeedback(_24, _207, uint64_t(((1 | (_210 ? 2 : 0)) | (_211 ? 4 : 0)) | ((_210 && _211) ? 8 : 0)) << uint64_t(_99 * 4), (!_223) && (_96 != _99));
    vec2 _230 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _232 = imageSize(_24) & ivec2(15);
    float _239 = min(max(textureQueryLod(sampler2D(_13, _36), _230).x, CLAMP), 14.0);
    int _241 = int(_239);
    int _243 = int(_239 + 0.9970703125);
    vec2 _248 = abs(dFdx(_230));
    vec2 _249 = abs(dFdy(_230));
    vec2 _256 = vec2(max(_248.x, _249.x), max(_248.y, _249.y));
    vec2 _257 = fract(_230);
    vec2 _258 = vec2(textureSize(_13, _241));
    ivec2 _260 = -_232;
    vec2 _262 = _257 * ldexp(_258, _260);
    ResType _265;
    _265._m0 = frexp((_256 * _258) - vec2(0.00390625), _265._m1);
    vec2 _270 = min(ldexp(vec2(0.5), clamp(_265._m1, ivec2(0), ivec2(4)) + _260), vec2(0.5));
    ivec2 _274 = ivec2(max(_262 - _270, vec2(0.0)));
    bvec2 _276 = notEqual(_274, ivec2(_262 + _270));
    bool _277 = _276.x;
    bool _278 = _276.y;
    bool _290 = helperInvocationEXT();
    WriteFeedback(_24, _274, uint64_t(((1 | (_277 ? 2 : 0)) | (_278 ? 4 : 0)) | ((_277 && _278) ? 8 : 0)) << uint64_t(_241 * 4), !_290);
    vec2 _293 = vec2(textureSize(_13, _243));
    ivec2 _295 = -_232;
    vec2 _297 = _257 * ldexp(_293, _295);
    ResType _300;
    _300._m0 = frexp((_256 * _293) - vec2(0.00390625), _300._m1);
    vec2 _305 = min(ldexp(vec2(0.5), clamp(_300._m1, ivec2(0), ivec2(4)) + _295), vec2(0.5));
    ivec2 _309 = ivec2(max(_297 - _305, vec2(0.0)));
    bvec2 _311 = notEqual(_309, ivec2(_297 + _305));
    bool _312 = _311.x;
    bool _313 = _311.y;
    bool _325 = helperInvocationEXT();
    WriteFeedback(_24, _309, uint64_t(((1 | (_312 ? 2 : 0)) | (_313 ? 4 : 0)) | ((_312 && _313) ? 8 : 0)) << uint64_t(_243 * 4), (!_325) && (_241 != _243));
    ivec2 _334 = imageSize(_24) & ivec2(15);
    int _336 = textureQueryLevels(_13) - 1;
    float _338 = spvNClamp(gl_FragCoord.z, 0.0, float(_336));
    int _339 = int(_338);
    int _341 = int(_338 + 0.9970703125);
    vec2 _344 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _347 = -_334;
    vec2 _349 = _344 * ldexp(vec2(textureSize(_13, _339)), _347);
    vec2 _350 = ldexp(vec2(0.5), _347);
    ivec2 _354 = ivec2(max(_349 - _350, vec2(0.0)));
    bvec2 _356 = notEqual(_354, ivec2(_349 + _350));
    bool _357 = _356.x;
    bool _358 = _356.y;
    bool _370 = helperInvocationEXT();
    WriteFeedback(_24, _354, uint64_t(((1 | (_357 ? 2 : 0)) | (_358 ? 4 : 0)) | ((_357 && _358) ? 8 : 0)) << uint64_t(_339 * 4), !_370);
    ivec2 _375 = -_334;
    vec2 _377 = _344 * ldexp(vec2(textureSize(_13, _341)), _375);
    vec2 _378 = ldexp(vec2(0.5), _375);
    ivec2 _382 = ivec2(max(_377 - _378, vec2(0.0)));
    bvec2 _384 = notEqual(_382, ivec2(_377 + _378));
    bool _385 = _384.x;
    bool _386 = _384.y;
    bool _398 = helperInvocationEXT();
    WriteFeedback(_24, _382, uint64_t(((1 | (_385 ? 2 : 0)) | (_386 ? 4 : 0)) | ((_385 && _386) ? 8 : 0)) << uint64_t(_341 * 4), (!_398) && (_339 != _341));
    ivec2 _407 = imageSize(_24) & ivec2(15);
    int _409 = textureQueryLevels(_13) - 1;
    vec2 _410 = vec2(textureSize(_13, 0));
    vec2 _414 = _410 * vec2(GRADX.x, GRADX.y);
    vec2 _415 = _410 * vec2(GRADY.x, GRADY.y);
    float _422 = spvNClamp(log2(max(dot(_414, _414), dot(_415, _415))) * 0.5, 0.0, float(_409));
    int _423 = int(_422);
    int _425 = int(_422 + 0.9970703125);
    vec2 _428 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _431 = -_407;
    vec2 _433 = _428 * ldexp(vec2(textureSize(_13, _423)), _431);
    vec2 _434 = ldexp(vec2(0.5), _431);
    ivec2 _438 = ivec2(max(_433 - _434, vec2(0.0)));
    bvec2 _440 = notEqual(_438, ivec2(_433 + _434));
    bool _441 = _440.x;
    bool _442 = _440.y;
    bool _454 = helperInvocationEXT();
    WriteFeedback(_24, _438, uint64_t(((1 | (_441 ? 2 : 0)) | (_442 ? 4 : 0)) | ((_441 && _442) ? 8 : 0)) << uint64_t(_423 * 4), !_454);
    ivec2 _459 = -_407;
    vec2 _461 = _428 * ldexp(vec2(textureSize(_13, _425)), _459);
    vec2 _462 = ldexp(vec2(0.5), _459);
    ivec2 _466 = ivec2(max(_461 - _462, vec2(0.0)));
    bvec2 _468 = notEqual(_466, ivec2(_461 + _462));
    bool _469 = _468.x;
    bool _470 = _468.y;
    bool _482 = helperInvocationEXT();
    WriteFeedback(_24, _466, uint64_t(((1 | (_469 ? 2 : 0)) | (_470 ? 4 : 0)) | ((_469 && _470) ? 8 : 0)) << uint64_t(_425 * 4), (!_482) && (_423 != _425));
    ivec2 _491 = imageSize(_24) & ivec2(15);
    int _493 = textureQueryLevels(_13) - 1;
    vec2 _494 = vec2(textureSize(_13, 0));
    vec2 _498 = _494 * vec2(GRADX.x, GRADX.y);
    vec2 _499 = _494 * vec2(GRADY.x, GRADY.y);
    float _508 = min(max(spvNClamp(log2(max(dot(_498, _498), dot(_499, _499))) * 0.5, 0.0, float(_493)), CLAMP), 14.0);
    int _509 = int(_508);
    int _511 = int(_508 + 0.9970703125);
    vec2 _514 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _517 = -_491;
    vec2 _519 = _514 * ldexp(vec2(textureSize(_13, _509)), _517);
    vec2 _520 = ldexp(vec2(0.5), _517);
    ivec2 _524 = ivec2(max(_519 - _520, vec2(0.0)));
    bvec2 _526 = notEqual(_524, ivec2(_519 + _520));
    bool _527 = _526.x;
    bool _528 = _526.y;
    bool _540 = helperInvocationEXT();
    WriteFeedback(_24, _524, uint64_t(((1 | (_527 ? 2 : 0)) | (_528 ? 4 : 0)) | ((_527 && _528) ? 8 : 0)) << uint64_t(_509 * 4), !_540);
    ivec2 _545 = -_491;
    vec2 _547 = _514 * ldexp(vec2(textureSize(_13, _511)), _545);
    vec2 _548 = ldexp(vec2(0.5), _545);
    ivec2 _552 = ivec2(max(_547 - _548, vec2(0.0)));
    bvec2 _554 = notEqual(_552, ivec2(_547 + _548));
    bool _555 = _554.x;
    bool _556 = _554.y;
    bool _568 = helperInvocationEXT();
    WriteFeedback(_24, _552, uint64_t(((1 | (_555 ? 2 : 0)) | (_556 ? 4 : 0)) | ((_555 && _556) ? 8 : 0)) << uint64_t(_511 * 4), (!_568) && (_509 != _511));
    vec2 _575 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _577 = imageSize(_24) & ivec2(15);
    float _581 = exp2(gl_FragCoord.z);
    vec2 _584 = textureQueryLod(sampler2D(_13, _36), _575 * subgroupQuadBroadcast(_581, 0u));
    float _585 = _584.x;
    int _586 = int(_585);
    int _588 = int(_585 + 0.9970703125);
    vec2 _593 = abs(dFdx(_575));
    vec2 _594 = abs(dFdy(_575));
    vec2 _602 = vec2(max(_593.x, _594.x), max(_593.y, _594.y)) * _581;
    vec2 _603 = fract(_575);
    vec2 _604 = vec2(textureSize(_13, _586));
    ivec2 _606 = -_577;
    vec2 _608 = _603 * ldexp(_604, _606);
    ResType _611;
    _611._m0 = frexp((_602 * _604) - vec2(0.00390625), _611._m1);
    vec2 _616 = min(ldexp(vec2(0.5), clamp(_611._m1, ivec2(0), ivec2(4)) + _606), vec2(0.5));
    ivec2 _620 = ivec2(max(_608 - _616, vec2(0.0)));
    bvec2 _622 = notEqual(_620, ivec2(_608 + _616));
    bool _623 = _622.x;
    bool _624 = _622.y;
    bool _636 = helperInvocationEXT();
    WriteFeedback(_24, _620, uint64_t(((1 | (_623 ? 2 : 0)) | (_624 ? 4 : 0)) | ((_623 && _624) ? 8 : 0)) << uint64_t(_586 * 4), !_636);
    vec2 _639 = vec2(textureSize(_13, _588));
    ivec2 _641 = -_577;
    vec2 _643 = _603 * ldexp(_639, _641);
    ResType _646;
    _646._m0 = frexp((_602 * _639) - vec2(0.00390625), _646._m1);
    vec2 _651 = min(ldexp(vec2(0.5), clamp(_646._m1, ivec2(0), ivec2(4)) + _641), vec2(0.5));
    ivec2 _655 = ivec2(max(_643 - _651, vec2(0.0)));
    bvec2 _657 = notEqual(_655, ivec2(_643 + _651));
    bool _658 = _657.x;
    bool _659 = _657.y;
    bool _671 = helperInvocationEXT();
    WriteFeedback(_24, _655, uint64_t(((1 | (_658 ? 2 : 0)) | (_659 ? 4 : 0)) | ((_658 && _659) ? 8 : 0)) << uint64_t(_588 * 4), (!_671) && (_586 != _588));
    vec2 _678 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _680 = imageSize(_24) & ivec2(15);
    float _684 = exp2(gl_FragCoord.z);
    float _690 = min(max(textureQueryLod(sampler2D(_13, _36), _678 * subgroupQuadBroadcast(_684, 0u)).x, CLAMP), 14.0);
    int _691 = int(_690);
    int _693 = int(_690 + 0.9970703125);
    vec2 _698 = abs(dFdx(_678));
    vec2 _699 = abs(dFdy(_678));
    vec2 _707 = vec2(max(_698.x, _699.x), max(_698.y, _699.y)) * _684;
    vec2 _708 = fract(_678);
    vec2 _709 = vec2(textureSize(_13, _691));
    ivec2 _711 = -_680;
    vec2 _713 = _708 * ldexp(_709, _711);
    ResType _716;
    _716._m0 = frexp((_707 * _709) - vec2(0.00390625), _716._m1);
    vec2 _721 = min(ldexp(vec2(0.5), clamp(_716._m1, ivec2(0), ivec2(4)) + _711), vec2(0.5));
    ivec2 _725 = ivec2(max(_713 - _721, vec2(0.0)));
    bvec2 _727 = notEqual(_725, ivec2(_713 + _721));
    bool _728 = _727.x;
    bool _729 = _727.y;
    bool _741 = helperInvocationEXT();
    WriteFeedback(_24, _725, uint64_t(((1 | (_728 ? 2 : 0)) | (_729 ? 4 : 0)) | ((_728 && _729) ? 8 : 0)) << uint64_t(_691 * 4), !_741);
    vec2 _744 = vec2(textureSize(_13, _693));
    ivec2 _746 = -_680;
    vec2 _748 = _708 * ldexp(_744, _746);
    ResType _751;
    _751._m0 = frexp((_707 * _744) - vec2(0.00390625), _751._m1);
    vec2 _756 = min(ldexp(vec2(0.5), clamp(_751._m1, ivec2(0), ivec2(4)) + _746), vec2(0.5));
    ivec2 _760 = ivec2(max(_748 - _756, vec2(0.0)));
    bvec2 _762 = notEqual(_760, ivec2(_748 + _756));
    bool _763 = _762.x;
    bool _764 = _762.y;
    bool _776 = helperInvocationEXT();
    WriteFeedback(_24, _760, uint64_t(((1 | (_763 ? 2 : 0)) | (_764 ? 4 : 0)) | ((_763 && _764) ? 8 : 0)) << uint64_t(_693 * 4), (!_776) && (_691 != _693));
    int _784 = int(roundEven(gl_FragCoord.z));
    vec2 _785 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _789 = imageSize(_27).xy & ivec2(15);
    vec2 _794 = textureQueryLod(sampler2DArray(_16, _36), _785);
    float _795 = _794.x;
    int _796 = int(_795);
    int _798 = int(_795 + 0.9970703125);
    vec2 _803 = abs(dFdx(_785));
    vec2 _804 = abs(dFdy(_785));
    vec2 _811 = vec2(max(_803.x, _804.x), max(_803.y, _804.y));
    vec2 _812 = fract(_785);
    vec2 _813 = vec2(textureSize(_16, _796).xy);
    ivec2 _816 = -_789;
    vec2 _818 = _812 * ldexp(_813, _816);
    ResType _821;
    _821._m0 = frexp((_811 * _813) - vec2(0.00390625), _821._m1);
    vec2 _826 = min(ldexp(vec2(0.5), clamp(_821._m1, ivec2(0), ivec2(4)) + _816), vec2(0.5));
    ivec2 _830 = ivec2(max(_818 - _826, vec2(0.0)));
    bvec2 _832 = notEqual(_830, ivec2(_818 + _826));
    bool _833 = _832.x;
    bool _834 = _832.y;
    bool _847 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_830, _784), uint64_t(((1 | (_833 ? 2 : 0)) | (_834 ? 4 : 0)) | ((_833 && _834) ? 8 : 0)) << uint64_t(_796 * 4), !_847);
    vec2 _877 = vec2(textureSize(_16, _798).xy);
    ivec2 _880 = -_789;
    vec2 _882 = _812 * ldexp(_877, _880);
    ResType _885;
    _885._m0 = frexp((_811 * _877) - vec2(0.00390625), _885._m1);
    vec2 _890 = min(ldexp(vec2(0.5), clamp(_885._m1, ivec2(0), ivec2(4)) + _880), vec2(0.5));
    ivec2 _894 = ivec2(max(_882 - _890, vec2(0.0)));
    bvec2 _896 = notEqual(_894, ivec2(_882 + _890));
    bool _897 = _896.x;
    bool _898 = _896.y;
    bool _911 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_894, _784), uint64_t(((1 | (_897 ? 2 : 0)) | (_898 ? 4 : 0)) | ((_897 && _898) ? 8 : 0)) << uint64_t(_798 * 4), (!_911) && (_796 != _798));
    int _919 = int(roundEven(gl_FragCoord.z));
    vec2 _920 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _923 = imageSize(_27).xy & ivec2(15);
    float _930 = min(max(textureQueryLod(sampler2DArray(_16, _36), _920).x, CLAMP), 14.0);
    int _931 = int(_930);
    int _933 = int(_930 + 0.9970703125);
    vec2 _938 = abs(dFdx(_920));
    vec2 _939 = abs(dFdy(_920));
    vec2 _946 = vec2(max(_938.x, _939.x), max(_938.y, _939.y));
    vec2 _947 = fract(_920);
    vec2 _948 = vec2(textureSize(_16, _931).xy);
    ivec2 _951 = -_923;
    vec2 _953 = _947 * ldexp(_948, _951);
    ResType _956;
    _956._m0 = frexp((_946 * _948) - vec2(0.00390625), _956._m1);
    vec2 _961 = min(ldexp(vec2(0.5), clamp(_956._m1, ivec2(0), ivec2(4)) + _951), vec2(0.5));
    ivec2 _965 = ivec2(max(_953 - _961, vec2(0.0)));
    bvec2 _967 = notEqual(_965, ivec2(_953 + _961));
    bool _968 = _967.x;
    bool _969 = _967.y;
    bool _982 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_965, _919), uint64_t(((1 | (_968 ? 2 : 0)) | (_969 ? 4 : 0)) | ((_968 && _969) ? 8 : 0)) << uint64_t(_931 * 4), !_982);
    vec2 _985 = vec2(textureSize(_16, _933).xy);
    ivec2 _988 = -_923;
    vec2 _990 = _947 * ldexp(_985, _988);
    ResType _993;
    _993._m0 = frexp((_946 * _985) - vec2(0.00390625), _993._m1);
    vec2 _998 = min(ldexp(vec2(0.5), clamp(_993._m1, ivec2(0), ivec2(4)) + _988), vec2(0.5));
    ivec2 _1002 = ivec2(max(_990 - _998, vec2(0.0)));
    bvec2 _1004 = notEqual(_1002, ivec2(_990 + _998));
    bool _1005 = _1004.x;
    bool _1006 = _1004.y;
    bool _1019 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1002, _919), uint64_t(((1 | (_1005 ? 2 : 0)) | (_1006 ? 4 : 0)) | ((_1005 && _1006) ? 8 : 0)) << uint64_t(_933 * 4), (!_1019) && (_931 != _933));
    int _1027 = int(roundEven(gl_FragCoord.z));
    ivec2 _1031 = imageSize(_27).xy & ivec2(15);
    int _1033 = textureQueryLevels(_16) - 1;
    float _1035 = spvNClamp(_74, 0.0, float(_1033));
    int _1036 = int(_1035);
    int _1038 = int(_1035 + 0.9970703125);
    vec2 _1041 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1045 = -_1031;
    vec2 _1047 = _1041 * ldexp(vec2(textureSize(_16, _1036).xy), _1045);
    vec2 _1048 = ldexp(vec2(0.5), _1045);
    ivec2 _1052 = ivec2(max(_1047 - _1048, vec2(0.0)));
    bvec2 _1054 = notEqual(_1052, ivec2(_1047 + _1048));
    bool _1055 = _1054.x;
    bool _1056 = _1054.y;
    bool _1069 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1052, _1027), uint64_t(((1 | (_1055 ? 2 : 0)) | (_1056 ? 4 : 0)) | ((_1055 && _1056) ? 8 : 0)) << uint64_t(_1036 * 4), !_1069);
    ivec2 _1075 = -_1031;
    vec2 _1077 = _1041 * ldexp(vec2(textureSize(_16, _1038).xy), _1075);
    vec2 _1078 = ldexp(vec2(0.5), _1075);
    ivec2 _1082 = ivec2(max(_1077 - _1078, vec2(0.0)));
    bvec2 _1084 = notEqual(_1082, ivec2(_1077 + _1078));
    bool _1085 = _1084.x;
    bool _1086 = _1084.y;
    bool _1099 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1082, _1027), uint64_t(((1 | (_1085 ? 2 : 0)) | (_1086 ? 4 : 0)) | ((_1085 && _1086) ? 8 : 0)) << uint64_t(_1038 * 4), (!_1099) && (_1036 != _1038));
    int _1107 = int(roundEven(gl_FragCoord.z));
    ivec2 _1111 = imageSize(_27).xy & ivec2(15);
    int _1113 = textureQueryLevels(_16) - 1;
    vec2 _1114 = vec2(textureSize(_16, 0).xy);
    vec2 _1119 = _1114 * vec2(GRADX.x, GRADX.y);
    vec2 _1120 = _1114 * vec2(GRADY.x, GRADY.y);
    float _1127 = spvNClamp(log2(max(dot(_1119, _1119), dot(_1120, _1120))) * 0.5, 0.0, float(_1113));
    int _1128 = int(_1127);
    int _1130 = int(_1127 + 0.9970703125);
    vec2 _1133 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1137 = -_1111;
    vec2 _1139 = _1133 * ldexp(vec2(textureSize(_16, _1128).xy), _1137);
    vec2 _1140 = ldexp(vec2(0.5), _1137);
    ivec2 _1144 = ivec2(max(_1139 - _1140, vec2(0.0)));
    bvec2 _1146 = notEqual(_1144, ivec2(_1139 + _1140));
    bool _1147 = _1146.x;
    bool _1148 = _1146.y;
    bool _1161 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1144, _1107), uint64_t(((1 | (_1147 ? 2 : 0)) | (_1148 ? 4 : 0)) | ((_1147 && _1148) ? 8 : 0)) << uint64_t(_1128 * 4), !_1161);
    ivec2 _1167 = -_1111;
    vec2 _1169 = _1133 * ldexp(vec2(textureSize(_16, _1130).xy), _1167);
    vec2 _1170 = ldexp(vec2(0.5), _1167);
    ivec2 _1174 = ivec2(max(_1169 - _1170, vec2(0.0)));
    bvec2 _1176 = notEqual(_1174, ivec2(_1169 + _1170));
    bool _1177 = _1176.x;
    bool _1178 = _1176.y;
    bool _1191 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1174, _1107), uint64_t(((1 | (_1177 ? 2 : 0)) | (_1178 ? 4 : 0)) | ((_1177 && _1178) ? 8 : 0)) << uint64_t(_1130 * 4), (!_1191) && (_1128 != _1130));
    int _1199 = int(roundEven(gl_FragCoord.z));
    ivec2 _1203 = imageSize(_27).xy & ivec2(15);
    int _1205 = textureQueryLevels(_16) - 1;
    vec2 _1206 = vec2(textureSize(_16, 0).xy);
    vec2 _1211 = _1206 * vec2(GRADX.x, GRADX.y);
    vec2 _1212 = _1206 * vec2(GRADY.x, GRADY.y);
    float _1221 = min(max(spvNClamp(log2(max(dot(_1211, _1211), dot(_1212, _1212))) * 0.5, 0.0, float(_1205)), CLAMP), 14.0);
    int _1222 = int(_1221);
    int _1224 = int(_1221 + 0.9970703125);
    vec2 _1227 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1231 = -_1203;
    vec2 _1233 = _1227 * ldexp(vec2(textureSize(_16, _1222).xy), _1231);
    vec2 _1234 = ldexp(vec2(0.5), _1231);
    ivec2 _1238 = ivec2(max(_1233 - _1234, vec2(0.0)));
    bvec2 _1240 = notEqual(_1238, ivec2(_1233 + _1234));
    bool _1241 = _1240.x;
    bool _1242 = _1240.y;
    bool _1255 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1238, _1199), uint64_t(((1 | (_1241 ? 2 : 0)) | (_1242 ? 4 : 0)) | ((_1241 && _1242) ? 8 : 0)) << uint64_t(_1222 * 4), !_1255);
    ivec2 _1261 = -_1203;
    vec2 _1263 = _1227 * ldexp(vec2(textureSize(_16, _1224).xy), _1261);
    vec2 _1264 = ldexp(vec2(0.5), _1261);
    ivec2 _1268 = ivec2(max(_1263 - _1264, vec2(0.0)));
    bvec2 _1270 = notEqual(_1268, ivec2(_1263 + _1264));
    bool _1271 = _1270.x;
    bool _1272 = _1270.y;
    bool _1285 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1268, _1199), uint64_t(((1 | (_1271 ? 2 : 0)) | (_1272 ? 4 : 0)) | ((_1271 && _1272) ? 8 : 0)) << uint64_t(_1224 * 4), (!_1285) && (_1222 != _1224));
    int _1293 = int(roundEven(gl_FragCoord.z));
    vec2 _1294 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1297 = imageSize(_27).xy & ivec2(15);
    float _1301 = exp2(gl_FragCoord.z);
    vec2 _1304 = textureQueryLod(sampler2DArray(_16, _36), _1294 * subgroupQuadBroadcast(_1301, 0u));
    float _1305 = _1304.x;
    int _1306 = int(_1305);
    int _1308 = int(_1305 + 0.9970703125);
    vec2 _1313 = abs(dFdx(_1294));
    vec2 _1314 = abs(dFdy(_1294));
    vec2 _1322 = vec2(max(_1313.x, _1314.x), max(_1313.y, _1314.y)) * _1301;
    vec2 _1323 = fract(_1294);
    vec2 _1324 = vec2(textureSize(_16, _1306).xy);
    ivec2 _1327 = -_1297;
    vec2 _1329 = _1323 * ldexp(_1324, _1327);
    ResType _1332;
    _1332._m0 = frexp((_1322 * _1324) - vec2(0.00390625), _1332._m1);
    vec2 _1337 = min(ldexp(vec2(0.5), clamp(_1332._m1, ivec2(0), ivec2(4)) + _1327), vec2(0.5));
    ivec2 _1341 = ivec2(max(_1329 - _1337, vec2(0.0)));
    bvec2 _1343 = notEqual(_1341, ivec2(_1329 + _1337));
    bool _1344 = _1343.x;
    bool _1345 = _1343.y;
    bool _1358 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1341, _1293), uint64_t(((1 | (_1344 ? 2 : 0)) | (_1345 ? 4 : 0)) | ((_1344 && _1345) ? 8 : 0)) << uint64_t(_1306 * 4), !_1358);
    vec2 _1361 = vec2(textureSize(_16, _1308).xy);
    ivec2 _1364 = -_1297;
    vec2 _1366 = _1323 * ldexp(_1361, _1364);
    ResType _1369;
    _1369._m0 = frexp((_1322 * _1361) - vec2(0.00390625), _1369._m1);
    vec2 _1374 = min(ldexp(vec2(0.5), clamp(_1369._m1, ivec2(0), ivec2(4)) + _1364), vec2(0.5));
    ivec2 _1378 = ivec2(max(_1366 - _1374, vec2(0.0)));
    bvec2 _1380 = notEqual(_1378, ivec2(_1366 + _1374));
    bool _1381 = _1380.x;
    bool _1382 = _1380.y;
    bool _1395 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1378, _1293), uint64_t(((1 | (_1381 ? 2 : 0)) | (_1382 ? 4 : 0)) | ((_1381 && _1382) ? 8 : 0)) << uint64_t(_1308 * 4), (!_1395) && (_1306 != _1308));
    int _1403 = int(roundEven(gl_FragCoord.z));
    vec2 _1404 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1407 = imageSize(_27).xy & ivec2(15);
    float _1411 = exp2(_74);
    float _1417 = min(max(textureQueryLod(sampler2DArray(_16, _36), _1404 * subgroupQuadBroadcast(_1411, 0u)).x, CLAMP), 14.0);
    int _1418 = int(_1417);
    int _1420 = int(_1417 + 0.9970703125);
    vec2 _1425 = abs(dFdx(_1404));
    vec2 _1426 = abs(dFdy(_1404));
    vec2 _1434 = vec2(max(_1425.x, _1426.x), max(_1425.y, _1426.y)) * _1411;
    vec2 _1435 = fract(_1404);
    vec2 _1436 = vec2(textureSize(_16, _1418).xy);
    ivec2 _1439 = -_1407;
    vec2 _1441 = _1435 * ldexp(_1436, _1439);
    ResType _1444;
    _1444._m0 = frexp((_1434 * _1436) - vec2(0.00390625), _1444._m1);
    vec2 _1449 = min(ldexp(vec2(0.5), clamp(_1444._m1, ivec2(0), ivec2(4)) + _1439), vec2(0.5));
    ivec2 _1453 = ivec2(max(_1441 - _1449, vec2(0.0)));
    bvec2 _1455 = notEqual(_1453, ivec2(_1441 + _1449));
    bool _1456 = _1455.x;
    bool _1457 = _1455.y;
    bool _1470 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1453, _1403), uint64_t(((1 | (_1456 ? 2 : 0)) | (_1457 ? 4 : 0)) | ((_1456 && _1457) ? 8 : 0)) << uint64_t(_1418 * 4), !_1470);
    vec2 _1473 = vec2(textureSize(_16, _1420).xy);
    ivec2 _1476 = -_1407;
    vec2 _1478 = _1435 * ldexp(_1473, _1476);
    ResType _1481;
    _1481._m0 = frexp((_1434 * _1473) - vec2(0.00390625), _1481._m1);
    vec2 _1486 = min(ldexp(vec2(0.5), clamp(_1481._m1, ivec2(0), ivec2(4)) + _1476), vec2(0.5));
    ivec2 _1490 = ivec2(max(_1478 - _1486, vec2(0.0)));
    bvec2 _1492 = notEqual(_1490, ivec2(_1478 + _1486));
    bool _1493 = _1492.x;
    bool _1494 = _1492.y;
    bool _1507 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1490, _1403), uint64_t(((1 | (_1493 ? 2 : 0)) | (_1494 ? 4 : 0)) | ((_1493 && _1494) ? 8 : 0)) << uint64_t(_1420 * 4), (!_1507) && (_1418 != _1420));
    uint _1511 = IDX + 0u;
    uint _1514 = IDX + 0u;
    uint _1517 = IDX + 0u;
    vec2 _1520 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1522 = imageSize(_30[nonuniformEXT(_1511)]) & ivec2(15);
    vec2 _1526 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1514], _39[_1517])), _1520);
    float _1527 = _1526.x;
    int _1528 = int(_1527);
    int _1530 = int(_1527 + 0.9970703125);
    vec2 _1535 = abs(dFdx(_1520));
    vec2 _1536 = abs(dFdy(_1520));
    vec2 _1543 = vec2(max(_1535.x, _1536.x), max(_1535.y, _1536.y));
    vec2 _1544 = fract(_1520);
    vec2 _1545 = vec2(textureSize(_19[nonuniformEXT(_1514)], _1528));
    ivec2 _1547 = -_1522;
    vec2 _1549 = _1544 * ldexp(_1545, _1547);
    ResType _1552;
    _1552._m0 = frexp((_1543 * _1545) - vec2(0.00390625), _1552._m1);
    vec2 _1557 = min(ldexp(vec2(0.5), clamp(_1552._m1, ivec2(0), ivec2(4)) + _1547), vec2(0.5));
    ivec2 _1561 = ivec2(max(_1549 - _1557, vec2(0.0)));
    bvec2 _1563 = notEqual(_1561, ivec2(_1549 + _1557));
    bool _1564 = _1563.x;
    bool _1565 = _1563.y;
    bool _1577 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1511], _1561, uint64_t(((1 | (_1564 ? 2 : 0)) | (_1565 ? 4 : 0)) | ((_1564 && _1565) ? 8 : 0)) << uint64_t(_1528 * 4), !_1577);
    vec2 _1605 = vec2(textureSize(_19[nonuniformEXT(_1514)], _1530));
    ivec2 _1607 = -_1522;
    vec2 _1609 = _1544 * ldexp(_1605, _1607);
    ResType _1612;
    _1612._m0 = frexp((_1543 * _1605) - vec2(0.00390625), _1612._m1);
    vec2 _1617 = min(ldexp(vec2(0.5), clamp(_1612._m1, ivec2(0), ivec2(4)) + _1607), vec2(0.5));
    ivec2 _1621 = ivec2(max(_1609 - _1617, vec2(0.0)));
    bvec2 _1623 = notEqual(_1621, ivec2(_1609 + _1617));
    bool _1624 = _1623.x;
    bool _1625 = _1623.y;
    bool _1637 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1511], _1621, uint64_t(((1 | (_1624 ? 2 : 0)) | (_1625 ? 4 : 0)) | ((_1624 && _1625) ? 8 : 0)) << uint64_t(_1530 * 4), (!_1637) && (_1528 != _1530));
    uint _1641 = IDX + 0u;
    uint _1644 = IDX + 0u;
    int _1650 = int(roundEven(gl_FragCoord.z));
    vec2 _1651 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1654 = imageSize(_33[nonuniformEXT(_1641)]).xy & ivec2(15);
    vec2 _1658 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1644], _39[_1517])), _1651);
    float _1659 = _1658.x;
    int _1660 = int(_1659);
    int _1662 = int(_1659 + 0.9970703125);
    vec2 _1667 = abs(dFdx(_1651));
    vec2 _1668 = abs(dFdy(_1651));
    vec2 _1675 = vec2(max(_1667.x, _1668.x), max(_1667.y, _1668.y));
    vec2 _1676 = fract(_1651);
    vec2 _1677 = vec2(textureSize(_22[nonuniformEXT(_1644)], _1660).xy);
    ivec2 _1680 = -_1654;
    vec2 _1682 = _1676 * ldexp(_1677, _1680);
    ResType _1685;
    _1685._m0 = frexp((_1675 * _1677) - vec2(0.00390625), _1685._m1);
    vec2 _1690 = min(ldexp(vec2(0.5), clamp(_1685._m1, ivec2(0), ivec2(4)) + _1680), vec2(0.5));
    ivec2 _1694 = ivec2(max(_1682 - _1690, vec2(0.0)));
    bvec2 _1696 = notEqual(_1694, ivec2(_1682 + _1690));
    bool _1697 = _1696.x;
    bool _1698 = _1696.y;
    bool _1711 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1641], ivec3(_1694, _1650), uint64_t(((1 | (_1697 ? 2 : 0)) | (_1698 ? 4 : 0)) | ((_1697 && _1698) ? 8 : 0)) << uint64_t(_1660 * 4), !_1711);
    vec2 _1739 = vec2(textureSize(_22[nonuniformEXT(_1644)], _1662).xy);
    ivec2 _1742 = -_1654;
    vec2 _1744 = _1676 * ldexp(_1739, _1742);
    ResType _1747;
    _1747._m0 = frexp((_1675 * _1739) - vec2(0.00390625), _1747._m1);
    vec2 _1752 = min(ldexp(vec2(0.5), clamp(_1747._m1, ivec2(0), ivec2(4)) + _1742), vec2(0.5));
    ivec2 _1756 = ivec2(max(_1744 - _1752, vec2(0.0)));
    bvec2 _1758 = notEqual(_1756, ivec2(_1744 + _1752));
    bool _1759 = _1758.x;
    bool _1760 = _1758.y;
    bool _1773 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1641], ivec3(_1756, _1650), uint64_t(((1 | (_1759 ? 2 : 0)) | (_1760 ? 4 : 0)) | ((_1759 && _1760) ? 8 : 0)) << uint64_t(_1662 * 4), (!_1773) && (_1660 != _1662));
    vec2 _1783 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1785 = imageSize(_30[nonuniformEXT(_1511)]) & ivec2(15);
    vec2 _1789 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1514], _39[_1517])), _1783);
    float _1790 = _1789.x;
    int _1791 = int(_1790);
    int _1793 = int(_1790 + 0.9970703125);
    vec2 _1798 = abs(dFdx(_1783));
    vec2 _1799 = abs(dFdy(_1783));
    vec2 _1806 = vec2(max(_1798.x, _1799.x), max(_1798.y, _1799.y));
    vec2 _1807 = fract(_1783);
    vec2 _1808 = vec2(textureSize(_19[nonuniformEXT(_1514)], _1791));
    ivec2 _1810 = -_1785;
    vec2 _1812 = _1807 * ldexp(_1808, _1810);
    ResType _1815;
    _1815._m0 = frexp((_1806 * _1808) - vec2(0.00390625), _1815._m1);
    vec2 _1820 = min(ldexp(vec2(0.5), clamp(_1815._m1, ivec2(0), ivec2(4)) + _1810), vec2(0.5));
    ivec2 _1824 = ivec2(max(_1812 - _1820, vec2(0.0)));
    bvec2 _1826 = notEqual(_1824, ivec2(_1812 + _1820));
    bool _1827 = _1826.x;
    bool _1828 = _1826.y;
    bool _1840 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1511], _1824, uint64_t(((1 | (_1827 ? 2 : 0)) | (_1828 ? 4 : 0)) | ((_1827 && _1828) ? 8 : 0)) << uint64_t(_1791 * 4), !_1840);
    vec2 _1843 = vec2(textureSize(_19[nonuniformEXT(_1514)], _1793));
    ivec2 _1845 = -_1785;
    vec2 _1847 = _1807 * ldexp(_1843, _1845);
    ResType _1850;
    _1850._m0 = frexp((_1806 * _1843) - vec2(0.00390625), _1850._m1);
    vec2 _1855 = min(ldexp(vec2(0.5), clamp(_1850._m1, ivec2(0), ivec2(4)) + _1845), vec2(0.5));
    ivec2 _1859 = ivec2(max(_1847 - _1855, vec2(0.0)));
    bvec2 _1861 = notEqual(_1859, ivec2(_1847 + _1855));
    bool _1862 = _1861.x;
    bool _1863 = _1861.y;
    bool _1875 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1511], _1859, uint64_t(((1 | (_1862 ? 2 : 0)) | (_1863 ? 4 : 0)) | ((_1862 && _1863) ? 8 : 0)) << uint64_t(_1793 * 4), (!_1875) && (_1791 != _1793));
    int _1886 = int(roundEven(gl_FragCoord.z));
    vec2 _1887 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1890 = imageSize(_33[nonuniformEXT(_1641)]).xy & ivec2(15);
    vec2 _1894 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1644], _39[_1517])), _1887);
    float _1895 = _1894.x;
    int _1896 = int(_1895);
    int _1898 = int(_1895 + 0.9970703125);
    vec2 _1903 = abs(dFdx(_1887));
    vec2 _1904 = abs(dFdy(_1887));
    vec2 _1911 = vec2(max(_1903.x, _1904.x), max(_1903.y, _1904.y));
    vec2 _1912 = fract(_1887);
    vec2 _1913 = vec2(textureSize(_22[nonuniformEXT(_1644)], _1896).xy);
    ivec2 _1916 = -_1890;
    vec2 _1918 = _1912 * ldexp(_1913, _1916);
    ResType _1921;
    _1921._m0 = frexp((_1911 * _1913) - vec2(0.00390625), _1921._m1);
    vec2 _1926 = min(ldexp(vec2(0.5), clamp(_1921._m1, ivec2(0), ivec2(4)) + _1916), vec2(0.5));
    ivec2 _1930 = ivec2(max(_1918 - _1926, vec2(0.0)));
    bvec2 _1932 = notEqual(_1930, ivec2(_1918 + _1926));
    bool _1933 = _1932.x;
    bool _1934 = _1932.y;
    bool _1947 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1641], ivec3(_1930, _1886), uint64_t(((1 | (_1933 ? 2 : 0)) | (_1934 ? 4 : 0)) | ((_1933 && _1934) ? 8 : 0)) << uint64_t(_1896 * 4), !_1947);
    vec2 _1950 = vec2(textureSize(_22[nonuniformEXT(_1644)], _1898).xy);
    ivec2 _1953 = -_1890;
    vec2 _1955 = _1912 * ldexp(_1950, _1953);
    ResType _1958;
    _1958._m0 = frexp((_1911 * _1950) - vec2(0.00390625), _1958._m1);
    vec2 _1963 = min(ldexp(vec2(0.5), clamp(_1958._m1, ivec2(0), ivec2(4)) + _1953), vec2(0.5));
    ivec2 _1967 = ivec2(max(_1955 - _1963, vec2(0.0)));
    bvec2 _1969 = notEqual(_1967, ivec2(_1955 + _1963));
    bool _1970 = _1969.x;
    bool _1971 = _1969.y;
    bool _1984 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1641], ivec3(_1967, _1886), uint64_t(((1 | (_1970 ? 2 : 0)) | (_1971 ? 4 : 0)) | ((_1970 && _1971) ? 8 : 0)) << uint64_t(_1898 * 4), (!_1984) && (_1896 != _1898));
    vec2 _1992 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1994 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _1998 = textureQueryLod(sampler2D(_13, _36), _1992);
    float _1999 = _1998.x;
    int _2000 = int(_1999);
    int _2002 = int(_1999 + 0.9970703125);
    vec2 _2007 = abs(dFdx(_1992));
    vec2 _2008 = abs(dFdy(_1992));
    vec2 _2015 = vec2(max(_2007.x, _2008.x), max(_2007.y, _2008.y));
    vec2 _2016 = fract(_1992);
    vec2 _2017 = vec2(textureSize(_13, _2000));
    ivec2 _2019 = -_1994;
    vec2 _2021 = _2016 * ldexp(_2017, _2019);
    ResType _2024;
    _2024._m0 = frexp((_2015 * _2017) - vec2(0.00390625), _2024._m1);
    vec2 _2029 = min(ldexp(vec2(0.5), clamp(_2024._m1, ivec2(0), ivec2(4)) + _2019), vec2(0.5));
    ivec2 _2033 = ivec2(max(_2021 - _2029, vec2(0.0)));
    bvec2 _2035 = notEqual(_2033, ivec2(_2021 + _2029));
    bool _2036 = _2035.x;
    bool _2037 = _2035.y;
    bool _2049 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2033, uint64_t(((1 | (_2036 ? 2 : 0)) | (_2037 ? 4 : 0)) | ((_2036 && _2037) ? 8 : 0)) << uint64_t(_2000 * 4), !_2049);
    vec2 _2052 = vec2(textureSize(_13, _2002));
    ivec2 _2054 = -_1994;
    vec2 _2056 = _2016 * ldexp(_2052, _2054);
    ResType _2059;
    _2059._m0 = frexp((_2015 * _2052) - vec2(0.00390625), _2059._m1);
    vec2 _2064 = min(ldexp(vec2(0.5), clamp(_2059._m1, ivec2(0), ivec2(4)) + _2054), vec2(0.5));
    ivec2 _2068 = ivec2(max(_2056 - _2064, vec2(0.0)));
    bvec2 _2070 = notEqual(_2068, ivec2(_2056 + _2064));
    bool _2071 = _2070.x;
    bool _2072 = _2070.y;
    bool _2084 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2068, uint64_t(((1 | (_2071 ? 2 : 0)) | (_2072 ? 4 : 0)) | ((_2071 && _2072) ? 8 : 0)) << uint64_t(_2002 * 4), (!_2084) && (_2000 != _2002));
    vec2 _2090 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _2092 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _2096 = textureQueryLod(sampler2D(_13, _36), _2090);
    float _2097 = _2096.x;
    int _2098 = int(_2097);
    int _2100 = int(_2097 + 0.9970703125);
    vec2 _2105 = abs(dFdx(_2090));
    vec2 _2106 = abs(dFdy(_2090));
    vec2 _2113 = vec2(max(_2105.x, _2106.x), max(_2105.y, _2106.y));
    vec2 _2114 = fract(_2090);
    vec2 _2115 = vec2(textureSize(_13, _2098));
    ivec2 _2117 = -_2092;
    vec2 _2119 = _2114 * ldexp(_2115, _2117);
    ResType _2122;
    _2122._m0 = frexp((_2113 * _2115) - vec2(0.00390625), _2122._m1);
    vec2 _2127 = min(ldexp(vec2(0.5), clamp(_2122._m1, ivec2(0), ivec2(4)) + _2117), vec2(0.5));
    ivec2 _2131 = ivec2(max(_2119 - _2127, vec2(0.0)));
    bvec2 _2133 = notEqual(_2131, ivec2(_2119 + _2127));
    bool _2134 = _2133.x;
    bool _2135 = _2133.y;
    bool _2147 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2131, uint64_t(((1 | (_2134 ? 2 : 0)) | (_2135 ? 4 : 0)) | ((_2134 && _2135) ? 8 : 0)) << uint64_t(_2098 * 4), !_2147);
    vec2 _2150 = vec2(textureSize(_13, _2100));
    ivec2 _2152 = -_2092;
    vec2 _2154 = _2114 * ldexp(_2150, _2152);
    ResType _2157;
    _2157._m0 = frexp((_2113 * _2150) - vec2(0.00390625), _2157._m1);
    vec2 _2162 = min(ldexp(vec2(0.5), clamp(_2157._m1, ivec2(0), ivec2(4)) + _2152), vec2(0.5));
    ivec2 _2166 = ivec2(max(_2154 - _2162, vec2(0.0)));
    bvec2 _2168 = notEqual(_2166, ivec2(_2154 + _2162));
    bool _2169 = _2168.x;
    bool _2170 = _2168.y;
    bool _2182 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2166, uint64_t(((1 | (_2169 ? 2 : 0)) | (_2170 ? 4 : 0)) | ((_2169 && _2170) ? 8 : 0)) << uint64_t(_2100 * 4), (!_2182) && (_2098 != _2100));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 2187
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
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_EXT_shader_image_int64"
%79 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %13 %16 %19 %22 %24 %27 %30 %33 %36 %39 %42 %45 %46 %48 %51
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %42 "SV_Position"
OpName %45 "GRADX"
OpName %46 "GRADY"
OpName %48 "CLAMP"
OpName %51 "IDX"
OpName %123 "ResType"
OpName %167 "WriteFeedback"
OpName %163 "img"
OpName %164 "coord"
OpName %165 "value"
OpName %166 "active_lane"
OpName %180 "is_done"
OpName %855 "WriteFeedbackArray"
OpName %851 "img"
OpName %852 "coord"
OpName %853 "value"
OpName %854 "active_lane"
OpName %866 "is_done"
OpName %1583 "WriteFeedbackNonUniform"
OpName %1579 "img"
OpName %1580 "coord"
OpName %1581 "value"
OpName %1582 "active_lane"
OpName %1594 "is_done"
OpName %1717 "WriteFeedbackArrayNonUniform"
OpName %1713 "img"
OpName %1714 "coord"
OpName %1715 "value"
OpName %1716 "active_lane"
OpName %1728 "is_done"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 1
OpDecorate %19 DescriptorSet 1
OpDecorate %19 Binding 0
OpDecorate %22 DescriptorSet 2
OpDecorate %22 Binding 0
OpDecorate %24 DescriptorSet 0
OpDecorate %24 Binding 0
OpDecorate %27 DescriptorSet 0
OpDecorate %27 Binding 1
OpDecorate %30 DescriptorSet 1
OpDecorate %30 Binding 0
OpDecorate %33 DescriptorSet 2
OpDecorate %33 Binding 0
OpDecorate %36 DescriptorSet 0
OpDecorate %36 Binding 0
OpDecorate %39 DescriptorSet 1
OpDecorate %39 Binding 0
OpDecorate %42 BuiltIn FragCoord
OpDecorate %45 Location 1
OpDecorate %46 Location 1
OpDecorate %46 Component 2
OpDecorate %48 Location 2
OpDecorate %51 Flat
OpDecorate %51 Location 3
OpDecorate %1511 NonUniform
OpDecorate %1513 NonUniform
OpDecorate %1514 NonUniform
OpDecorate %1516 NonUniform
OpDecorate %1517 NonUniform
OpDecorate %1519 NonUniform
OpDecorate %1525 NonUniform
OpDecorate %1602 NonUniform
OpDecorate %1641 NonUniform
OpDecorate %1643 NonUniform
OpDecorate %1644 NonUniform
OpDecorate %1646 NonUniform
OpDecorate %1648 NonUniform
OpDecorate %1657 NonUniform
OpDecorate %1736 NonUniform
OpDecorate %1778 NonUniform
OpDecorate %1780 NonUniform
OpDecorate %1782 NonUniform
OpDecorate %1788 NonUniform
OpDecorate %1880 NonUniform
OpDecorate %1882 NonUniform
OpDecorate %1884 NonUniform
OpDecorate %1893 NonUniform
OpDecorate %52 NonUniform
OpDecorate %1989 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 64 0
%6 = OpTypeImage %5 2D 0 0 0 2 R64ui
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeFloat 32
%11 = OpTypeImage %10 2D 0 0 0 1 Unknown
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeImage %10 2D 0 1 0 1 Unknown
%15 = OpTypePointer UniformConstant %14
%16 = OpVariable %15 UniformConstant
%17 = OpTypeRuntimeArray %11
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeRuntimeArray %14
%21 = OpTypePointer UniformConstant %20
%22 = OpVariable %21 UniformConstant
%23 = OpTypePointer UniformConstant %6
%24 = OpVariable %23 UniformConstant
%25 = OpTypeImage %5 2D 0 1 0 2 R64ui
%26 = OpTypePointer UniformConstant %25
%27 = OpVariable %26 UniformConstant
%28 = OpTypeRuntimeArray %6
%29 = OpTypePointer UniformConstant %28
%30 = OpVariable %29 UniformConstant
%31 = OpTypeRuntimeArray %25
%32 = OpTypePointer UniformConstant %31
%33 = OpVariable %32 UniformConstant
%34 = OpTypeSampler
%35 = OpTypePointer UniformConstant %34
%36 = OpVariable %35 UniformConstant
%37 = OpTypeRuntimeArray %34
%38 = OpTypePointer UniformConstant %37
%39 = OpVariable %38 UniformConstant
%40 = OpTypeVector %10 4
%41 = OpTypePointer Input %40
%42 = OpVariable %41 Input
%43 = OpTypeVector %10 2
%44 = OpTypePointer Input %43
%45 = OpVariable %44 Input
%46 = OpVariable %44 Input
%47 = OpTypePointer Input %10
%48 = OpVariable %47 Input
%49 = OpTypeInt 32 0
%50 = OpTypePointer Input %49
%51 = OpVariable %50 Input
%55 = OpConstant %49 0
%58 = OpConstant %49 1
%69 = OpConstant %49 2
%72 = OpConstant %49 3
%75 = OpConstant %10 1
%80 = OpTypeBool
%81 = OpTypeInt 32 1
%82 = OpTypeVector %80 2
%83 = OpTypeVector %81 2
%87 = OpConstant %81 15
%88 = OpConstantComposite %83 %87 %87
%91 = OpConstant %81 1
%92 = OpTypeSampledImage %11
%98 = OpConstant %10 0.997070312
%121 = OpConstant %10 0.00390625
%122 = OpConstantComposite %43 %121 %121
%123 = OpTypeStruct %43 %83
%127 = OpConstant %81 0
%128 = OpConstantComposite %83 %127 %127
%129 = OpConstant %81 4
%130 = OpConstantComposite %83 %129 %129
%133 = OpConstant %10 0.5
%134 = OpConstantComposite %43 %133 %133
%138 = OpConstant %10 0
%139 = OpConstantComposite %43 %138 %138
%148 = OpConstant %81 2
%153 = OpConstant %81 8
%161 = OpTypePointer Image %5
%162 = OpTypeFunction %1 %23 %83 %5 %80
%178 = OpConstantFalse %80
%179 = OpTypePointer Function %80
%240 = OpConstant %10 14
%786 = OpTypeVector %81 3
%792 = OpTypeSampledImage %14
%849 = OpTypeVector %80 3
%850 = OpTypeFunction %1 %26 %786 %5 %80
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %2186
%2186 = OpLabel
%52 = OpLoad %49 %51
%53 = OpLoad %10 %48
%54 = OpAccessChain %47 %46 %55
%56 = OpLoad %10 %54
%57 = OpAccessChain %47 %46 %58
%59 = OpLoad %10 %57
%60 = OpAccessChain %47 %45 %55
%61 = OpLoad %10 %60
%62 = OpAccessChain %47 %45 %58
%63 = OpLoad %10 %62
%64 = OpAccessChain %47 %42 %55
%65 = OpLoad %10 %64
%66 = OpAccessChain %47 %42 %58
%67 = OpLoad %10 %66
%68 = OpAccessChain %47 %42 %69
%70 = OpLoad %10 %68
%71 = OpAccessChain %47 %42 %72
%73 = OpLoad %10 %71
%74 = OpFDiv %10 %75 %73
%76 = OpLoad %6 %24
%77 = OpLoad %11 %13
%78 = OpLoad %34 %36
%84 = OpCompositeConstruct %43 %65 %67
%85 = OpImageQuerySize %83 %76
%86 = OpBitwiseAnd %83 %85 %88
%89 = OpImageQueryLevels %81 %77
%90 = OpISub %81 %89 %91
%93 = OpSampledImage %92 %77 %78
%94 = OpImageQueryLod %43 %93 %84
%95 = OpCompositeExtract %10 %94 0
%96 = OpConvertFToS %81 %95
%97 = OpFAdd %10 %95 %98
%99 = OpConvertFToS %81 %97
%100 = OpExtInst %81 %79 SMin %99 %90
%101 = OpINotEqual %80 %96 %99
%102 = OpDPdx %43 %84
%103 = OpDPdy %43 %84
%104 = OpExtInst %43 %79 FAbs %102
%105 = OpExtInst %43 %79 FAbs %103
%106 = OpCompositeExtract %10 %104 0
%107 = OpCompositeExtract %10 %105 0
%108 = OpCompositeExtract %10 %104 1
%109 = OpCompositeExtract %10 %105 1
%110 = OpExtInst %10 %79 FMax %106 %107
%111 = OpExtInst %10 %79 FMax %108 %109
%112 = OpCompositeConstruct %43 %110 %111
%113 = OpExtInst %43 %79 Fract %84
%115 = OpImageQuerySizeLod %83 %77 %96
%114 = OpConvertSToF %43 %115
%116 = OpSNegate %83 %86
%117 = OpExtInst %43 %79 Ldexp %114 %116
%118 = OpFMul %43 %113 %117
%119 = OpFMul %43 %112 %114
%120 = OpFSub %43 %119 %122
%124 = OpExtInst %123 %79 FrexpStruct %120
%125 = OpCompositeExtract %83 %124 1
%126 = OpExtInst %83 %79 SClamp %125 %128 %130
%131 = OpIAdd %83 %126 %116
%132 = OpExtInst %43 %79 Ldexp %134 %131
%135 = OpExtInst %43 %79 FMin %132 %134
%136 = OpFSub %43 %118 %135
%137 = OpExtInst %43 %79 FMax %136 %139
%140 = OpFAdd %43 %118 %135
%141 = OpConvertFToS %83 %137
%142 = OpConvertFToS %83 %140
%143 = OpINotEqual %82 %141 %142
%144 = OpCompositeExtract %80 %143 0
%145 = OpCompositeExtract %80 %143 1
%146 = OpLogicalAnd %80 %144 %145
%147 = OpSelect %81 %144 %148 %127
%149 = OpBitwiseOr %81 %91 %147
%150 = OpSelect %81 %145 %129 %127
%151 = OpBitwiseOr %81 %149 %150
%152 = OpSelect %81 %146 %153 %127
%154 = OpBitwiseOr %81 %151 %152
%155 = OpSConvert %5 %154
%156 = OpIMul %81 %96 %129
%157 = OpSConvert %5 %156
%158 = OpShiftLeftLogical %5 %155 %157
%159 = OpIsHelperInvocationEXT %80
%160 = OpLogicalNot %80 %159
%190 = OpFunctionCall %1 %167 %24 %141 %158 %160
%192 = OpImageQuerySizeLod %83 %77 %99
%191 = OpConvertSToF %43 %192
%193 = OpSNegate %83 %86
%194 = OpExtInst %43 %79 Ldexp %191 %193
%195 = OpFMul %43 %113 %194
%196 = OpFMul %43 %112 %191
%197 = OpFSub %43 %196 %122
%198 = OpExtInst %123 %79 FrexpStruct %197
%199 = OpCompositeExtract %83 %198 1
%200 = OpExtInst %83 %79 SClamp %199 %128 %130
%201 = OpIAdd %83 %200 %193
%202 = OpExtInst %43 %79 Ldexp %134 %201
%203 = OpExtInst %43 %79 FMin %202 %134
%204 = OpFSub %43 %195 %203
%205 = OpExtInst %43 %79 FMax %204 %139
%206 = OpFAdd %43 %195 %203
%207 = OpConvertFToS %83 %205
%208 = OpConvertFToS %83 %206
%209 = OpINotEqual %82 %207 %208
%210 = OpCompositeExtract %80 %209 0
%211 = OpCompositeExtract %80 %209 1
%212 = OpLogicalAnd %80 %210 %211
%213 = OpSelect %81 %210 %148 %127
%214 = OpBitwiseOr %81 %91 %213
%215 = OpSelect %81 %211 %129 %127
%216 = OpBitwiseOr %81 %214 %215
%217 = OpSelect %81 %212 %153 %127
%218 = OpBitwiseOr %81 %216 %217
%219 = OpSConvert %5 %218
%220 = OpIMul %81 %99 %129
%221 = OpSConvert %5 %220
%222 = OpShiftLeftLogical %5 %219 %221
%223 = OpIsHelperInvocationEXT %80
%224 = OpLogicalNot %80 %223
%225 = OpLogicalAnd %80 %224 %101
%226 = OpFunctionCall %1 %167 %24 %207 %222 %225
%227 = OpLoad %6 %24
%228 = OpLoad %11 %13
%229 = OpLoad %34 %36
%230 = OpCompositeConstruct %43 %65 %67
%231 = OpImageQuerySize %83 %227
%232 = OpBitwiseAnd %83 %231 %88
%233 = OpImageQueryLevels %81 %228
%234 = OpISub %81 %233 %91
%235 = OpSampledImage %92 %228 %229
%236 = OpImageQueryLod %43 %235 %230
%237 = OpCompositeExtract %10 %236 0
%238 = OpExtInst %10 %79 FMax %237 %53
%239 = OpExtInst %10 %79 FMin %238 %240
%241 = OpConvertFToS %81 %239
%242 = OpFAdd %10 %239 %98
%243 = OpConvertFToS %81 %242
%244 = OpExtInst %81 %79 SMin %243 %234
%245 = OpINotEqual %80 %241 %243
%246 = OpDPdx %43 %230
%247 = OpDPdy %43 %230
%248 = OpExtInst %43 %79 FAbs %246
%249 = OpExtInst %43 %79 FAbs %247
%250 = OpCompositeExtract %10 %248 0
%251 = OpCompositeExtract %10 %249 0
%252 = OpCompositeExtract %10 %248 1
%253 = OpCompositeExtract %10 %249 1
%254 = OpExtInst %10 %79 FMax %250 %251
%255 = OpExtInst %10 %79 FMax %252 %253
%256 = OpCompositeConstruct %43 %254 %255
%257 = OpExtInst %43 %79 Fract %230
%259 = OpImageQuerySizeLod %83 %228 %241
%258 = OpConvertSToF %43 %259
%260 = OpSNegate %83 %232
%261 = OpExtInst %43 %79 Ldexp %258 %260
%262 = OpFMul %43 %257 %261
%263 = OpFMul %43 %256 %258
%264 = OpFSub %43 %263 %122
%265 = OpExtInst %123 %79 FrexpStruct %264
%266 = OpCompositeExtract %83 %265 1
%267 = OpExtInst %83 %79 SClamp %266 %128 %130
%268 = OpIAdd %83 %267 %260
%269 = OpExtInst %43 %79 Ldexp %134 %268
%270 = OpExtInst %43 %79 FMin %269 %134
%271 = OpFSub %43 %262 %270
%272 = OpExtInst %43 %79 FMax %271 %139
%273 = OpFAdd %43 %262 %270
%274 = OpConvertFToS %83 %272
%275 = OpConvertFToS %83 %273
%276 = OpINotEqual %82 %274 %275
%277 = OpCompositeExtract %80 %276 0
%278 = OpCompositeExtract %80 %276 1
%279 = OpLogicalAnd %80 %277 %278
%280 = OpSelect %81 %277 %148 %127
%281 = OpBitwiseOr %81 %91 %280
%282 = OpSelect %81 %278 %129 %127
%283 = OpBitwiseOr %81 %281 %282
%284 = OpSelect %81 %279 %153 %127
%285 = OpBitwiseOr %81 %283 %284
%286 = OpSConvert %5 %285
%287 = OpIMul %81 %241 %129
%288 = OpSConvert %5 %287
%289 = OpShiftLeftLogical %5 %286 %288
%290 = OpIsHelperInvocationEXT %80
%291 = OpLogicalNot %80 %290
%292 = OpFunctionCall %1 %167 %24 %274 %289 %291
%294 = OpImageQuerySizeLod %83 %228 %243
%293 = OpConvertSToF %43 %294
%295 = OpSNegate %83 %232
%296 = OpExtInst %43 %79 Ldexp %293 %295
%297 = OpFMul %43 %257 %296
%298 = OpFMul %43 %256 %293
%299 = OpFSub %43 %298 %122
%300 = OpExtInst %123 %79 FrexpStruct %299
%301 = OpCompositeExtract %83 %300 1
%302 = OpExtInst %83 %79 SClamp %301 %128 %130
%303 = OpIAdd %83 %302 %295
%304 = OpExtInst %43 %79 Ldexp %134 %303
%305 = OpExtInst %43 %79 FMin %304 %134
%306 = OpFSub %43 %297 %305
%307 = OpExtInst %43 %79 FMax %306 %139
%308 = OpFAdd %43 %297 %305
%309 = OpConvertFToS %83 %307
%310 = OpConvertFToS %83 %308
%311 = OpINotEqual %82 %309 %310
%312 = OpCompositeExtract %80 %311 0
%313 = OpCompositeExtract %80 %311 1
%314 = OpLogicalAnd %80 %312 %313
%315 = OpSelect %81 %312 %148 %127
%316 = OpBitwiseOr %81 %91 %315
%317 = OpSelect %81 %313 %129 %127
%318 = OpBitwiseOr %81 %316 %317
%319 = OpSelect %81 %314 %153 %127
%320 = OpBitwiseOr %81 %318 %319
%321 = OpSConvert %5 %320
%322 = OpIMul %81 %243 %129
%323 = OpSConvert %5 %322
%324 = OpShiftLeftLogical %5 %321 %323
%325 = OpIsHelperInvocationEXT %80
%326 = OpLogicalNot %80 %325
%327 = OpLogicalAnd %80 %326 %245
%328 = OpFunctionCall %1 %167 %24 %309 %324 %327
%329 = OpLoad %6 %24
%330 = OpLoad %11 %13
%331 = OpLoad %34 %36
%332 = OpCompositeConstruct %43 %65 %67
%333 = OpImageQuerySize %83 %329
%334 = OpBitwiseAnd %83 %333 %88
%335 = OpImageQueryLevels %81 %330
%336 = OpISub %81 %335 %91
%337 = OpConvertSToF %10 %336
%338 = OpExtInst %10 %79 NClamp %70 %138 %337
%339 = OpConvertFToS %81 %338
%340 = OpFAdd %10 %338 %98
%341 = OpConvertFToS %81 %340
%342 = OpExtInst %81 %79 SMin %341 %336
%343 = OpINotEqual %80 %339 %341
%344 = OpExtInst %43 %79 Fract %332
%346 = OpImageQuerySizeLod %83 %330 %339
%345 = OpConvertSToF %43 %346
%347 = OpSNegate %83 %334
%348 = OpExtInst %43 %79 Ldexp %345 %347
%349 = OpFMul %43 %344 %348
%350 = OpExtInst %43 %79 Ldexp %134 %347
%351 = OpFSub %43 %349 %350
%352 = OpExtInst %43 %79 FMax %351 %139
%353 = OpFAdd %43 %349 %350
%354 = OpConvertFToS %83 %352
%355 = OpConvertFToS %83 %353
%356 = OpINotEqual %82 %354 %355
%357 = OpCompositeExtract %80 %356 0
%358 = OpCompositeExtract %80 %356 1
%359 = OpLogicalAnd %80 %357 %358
%360 = OpSelect %81 %357 %148 %127
%361 = OpBitwiseOr %81 %91 %360
%362 = OpSelect %81 %358 %129 %127
%363 = OpBitwiseOr %81 %361 %362
%364 = OpSelect %81 %359 %153 %127
%365 = OpBitwiseOr %81 %363 %364
%366 = OpSConvert %5 %365
%367 = OpIMul %81 %339 %129
%368 = OpSConvert %5 %367
%369 = OpShiftLeftLogical %5 %366 %368
%370 = OpIsHelperInvocationEXT %80
%371 = OpLogicalNot %80 %370
%372 = OpFunctionCall %1 %167 %24 %354 %369 %371
%374 = OpImageQuerySizeLod %83 %330 %341
%373 = OpConvertSToF %43 %374
%375 = OpSNegate %83 %334
%376 = OpExtInst %43 %79 Ldexp %373 %375
%377 = OpFMul %43 %344 %376
%378 = OpExtInst %43 %79 Ldexp %134 %375
%379 = OpFSub %43 %377 %378
%380 = OpExtInst %43 %79 FMax %379 %139
%381 = OpFAdd %43 %377 %378
%382 = OpConvertFToS %83 %380
%383 = OpConvertFToS %83 %381
%384 = OpINotEqual %82 %382 %383
%385 = OpCompositeExtract %80 %384 0
%386 = OpCompositeExtract %80 %384 1
%387 = OpLogicalAnd %80 %385 %386
%388 = OpSelect %81 %385 %148 %127
%389 = OpBitwiseOr %81 %91 %388
%390 = OpSelect %81 %386 %129 %127
%391 = OpBitwiseOr %81 %389 %390
%392 = OpSelect %81 %387 %153 %127
%393 = OpBitwiseOr %81 %391 %392
%394 = OpSConvert %5 %393
%395 = OpIMul %81 %341 %129
%396 = OpSConvert %5 %395
%397 = OpShiftLeftLogical %5 %394 %396
%398 = OpIsHelperInvocationEXT %80
%399 = OpLogicalNot %80 %398
%400 = OpLogicalAnd %80 %399 %343
%401 = OpFunctionCall %1 %167 %24 %382 %397 %400
%402 = OpLoad %6 %24
%403 = OpLoad %11 %13
%404 = OpLoad %34 %36
%405 = OpCompositeConstruct %43 %65 %67
%406 = OpImageQuerySize %83 %402
%407 = OpBitwiseAnd %83 %406 %88
%408 = OpImageQueryLevels %81 %403
%409 = OpISub %81 %408 %91
%411 = OpImageQuerySizeLod %83 %403 %127
%410 = OpConvertSToF %43 %411
%412 = OpCompositeConstruct %43 %61 %63
%413 = OpCompositeConstruct %43 %56 %59
%414 = OpFMul %43 %410 %412
%415 = OpFMul %43 %410 %413
%416 = OpDot %10 %414 %414
%417 = OpDot %10 %415 %415
%418 = OpExtInst %10 %79 FMax %416 %417
%419 = OpExtInst %10 %79 Log2 %418
%420 = OpFMul %10 %419 %133
%421 = OpConvertSToF %10 %409
%422 = OpExtInst %10 %79 NClamp %420 %138 %421
%423 = OpConvertFToS %81 %422
%424 = OpFAdd %10 %422 %98
%425 = OpConvertFToS %81 %424
%426 = OpExtInst %81 %79 SMin %425 %409
%427 = OpINotEqual %80 %423 %425
%428 = OpExtInst %43 %79 Fract %405
%430 = OpImageQuerySizeLod %83 %403 %423
%429 = OpConvertSToF %43 %430
%431 = OpSNegate %83 %407
%432 = OpExtInst %43 %79 Ldexp %429 %431
%433 = OpFMul %43 %428 %432
%434 = OpExtInst %43 %79 Ldexp %134 %431
%435 = OpFSub %43 %433 %434
%436 = OpExtInst %43 %79 FMax %435 %139
%437 = OpFAdd %43 %433 %434
%438 = OpConvertFToS %83 %436
%439 = OpConvertFToS %83 %437
%440 = OpINotEqual %82 %438 %439
%441 = OpCompositeExtract %80 %440 0
%442 = OpCompositeExtract %80 %440 1
%443 = OpLogicalAnd %80 %441 %442
%444 = OpSelect %81 %441 %148 %127
%445 = OpBitwiseOr %81 %91 %444
%446 = OpSelect %81 %442 %129 %127
%447 = OpBitwiseOr %81 %445 %446
%448 = OpSelect %81 %443 %153 %127
%449 = OpBitwiseOr %81 %447 %448
%450 = OpSConvert %5 %449
%451 = OpIMul %81 %423 %129
%452 = OpSConvert %5 %451
%453 = OpShiftLeftLogical %5 %450 %452
%454 = OpIsHelperInvocationEXT %80
%455 = OpLogicalNot %80 %454
%456 = OpFunctionCall %1 %167 %24 %438 %453 %455
%458 = OpImageQuerySizeLod %83 %403 %425
%457 = OpConvertSToF %43 %458
%459 = OpSNegate %83 %407
%460 = OpExtInst %43 %79 Ldexp %457 %459
%461 = OpFMul %43 %428 %460
%462 = OpExtInst %43 %79 Ldexp %134 %459
%463 = OpFSub %43 %461 %462
%464 = OpExtInst %43 %79 FMax %463 %139
%465 = OpFAdd %43 %461 %462
%466 = OpConvertFToS %83 %464
%467 = OpConvertFToS %83 %465
%468 = OpINotEqual %82 %466 %467
%469 = OpCompositeExtract %80 %468 0
%470 = OpCompositeExtract %80 %468 1
%471 = OpLogicalAnd %80 %469 %470
%472 = OpSelect %81 %469 %148 %127
%473 = OpBitwiseOr %81 %91 %472
%474 = OpSelect %81 %470 %129 %127
%475 = OpBitwiseOr %81 %473 %474
%476 = OpSelect %81 %471 %153 %127
%477 = OpBitwiseOr %81 %475 %476
%478 = OpSConvert %5 %477
%479 = OpIMul %81 %425 %129
%480 = OpSConvert %5 %479
%481 = OpShiftLeftLogical %5 %478 %480
%482 = OpIsHelperInvocationEXT %80
%483 = OpLogicalNot %80 %482
%484 = OpLogicalAnd %80 %483 %427
%485 = OpFunctionCall %1 %167 %24 %466 %481 %484
%486 = OpLoad %6 %24
%487 = OpLoad %11 %13
%488 = OpLoad %34 %36
%489 = OpCompositeConstruct %43 %65 %67
%490 = OpImageQuerySize %83 %486
%491 = OpBitwiseAnd %83 %490 %88
%492 = OpImageQueryLevels %81 %487
%493 = OpISub %81 %492 %91
%495 = OpImageQuerySizeLod %83 %487 %127
%494 = OpConvertSToF %43 %495
%496 = OpCompositeConstruct %43 %61 %63
%497 = OpCompositeConstruct %43 %56 %59
%498 = OpFMul %43 %494 %496
%499 = OpFMul %43 %494 %497
%500 = OpDot %10 %498 %498
%501 = OpDot %10 %499 %499
%502 = OpExtInst %10 %79 FMax %500 %501
%503 = OpExtInst %10 %79 Log2 %502
%504 = OpFMul %10 %503 %133
%505 = OpConvertSToF %10 %493
%506 = OpExtInst %10 %79 NClamp %504 %138 %505
%507 = OpExtInst %10 %79 FMax %506 %53
%508 = OpExtInst %10 %79 FMin %507 %240
%509 = OpConvertFToS %81 %508
%510 = OpFAdd %10 %508 %98
%511 = OpConvertFToS %81 %510
%512 = OpExtInst %81 %79 SMin %511 %493
%513 = OpINotEqual %80 %509 %511
%514 = OpExtInst %43 %79 Fract %489
%516 = OpImageQuerySizeLod %83 %487 %509
%515 = OpConvertSToF %43 %516
%517 = OpSNegate %83 %491
%518 = OpExtInst %43 %79 Ldexp %515 %517
%519 = OpFMul %43 %514 %518
%520 = OpExtInst %43 %79 Ldexp %134 %517
%521 = OpFSub %43 %519 %520
%522 = OpExtInst %43 %79 FMax %521 %139
%523 = OpFAdd %43 %519 %520
%524 = OpConvertFToS %83 %522
%525 = OpConvertFToS %83 %523
%526 = OpINotEqual %82 %524 %525
%527 = OpCompositeExtract %80 %526 0
%528 = OpCompositeExtract %80 %526 1
%529 = OpLogicalAnd %80 %527 %528
%530 = OpSelect %81 %527 %148 %127
%531 = OpBitwiseOr %81 %91 %530
%532 = OpSelect %81 %528 %129 %127
%533 = OpBitwiseOr %81 %531 %532
%534 = OpSelect %81 %529 %153 %127
%535 = OpBitwiseOr %81 %533 %534
%536 = OpSConvert %5 %535
%537 = OpIMul %81 %509 %129
%538 = OpSConvert %5 %537
%539 = OpShiftLeftLogical %5 %536 %538
%540 = OpIsHelperInvocationEXT %80
%541 = OpLogicalNot %80 %540
%542 = OpFunctionCall %1 %167 %24 %524 %539 %541
%544 = OpImageQuerySizeLod %83 %487 %511
%543 = OpConvertSToF %43 %544
%545 = OpSNegate %83 %491
%546 = OpExtInst %43 %79 Ldexp %543 %545
%547 = OpFMul %43 %514 %546
%548 = OpExtInst %43 %79 Ldexp %134 %545
%549 = OpFSub %43 %547 %548
%550 = OpExtInst %43 %79 FMax %549 %139
%551 = OpFAdd %43 %547 %548
%552 = OpConvertFToS %83 %550
%553 = OpConvertFToS %83 %551
%554 = OpINotEqual %82 %552 %553
%555 = OpCompositeExtract %80 %554 0
%556 = OpCompositeExtract %80 %554 1
%557 = OpLogicalAnd %80 %555 %556
%558 = OpSelect %81 %555 %148 %127
%559 = OpBitwiseOr %81 %91 %558
%560 = OpSelect %81 %556 %129 %127
%561 = OpBitwiseOr %81 %559 %560
%562 = OpSelect %81 %557 %153 %127
%563 = OpBitwiseOr %81 %561 %562
%564 = OpSConvert %5 %563
%565 = OpIMul %81 %511 %129
%566 = OpSConvert %5 %565
%567 = OpShiftLeftLogical %5 %564 %566
%568 = OpIsHelperInvocationEXT %80
%569 = OpLogicalNot %80 %568
%570 = OpLogicalAnd %80 %569 %513
%571 = OpFunctionCall %1 %167 %24 %552 %567 %570
%572 = OpLoad %6 %24
%573 = OpLoad %11 %13
%574 = OpLoad %34 %36
%575 = OpCompositeConstruct %43 %65 %67
%576 = OpImageQuerySize %83 %572
%577 = OpBitwiseAnd %83 %576 %88
%578 = OpImageQueryLevels %81 %573
%579 = OpISub %81 %578 %91
%580 = OpSampledImage %92 %573 %574
%581 = OpExtInst %10 %79 Exp2 %70
%582 = OpGroupNonUniformQuadBroadcast %10 %72 %581 %55
%583 = OpVectorTimesScalar %43 %575 %582
%584 = OpImageQueryLod %43 %580 %583
%585 = OpCompositeExtract %10 %584 0
%586 = OpConvertFToS %81 %585
%587 = OpFAdd %10 %585 %98
%588 = OpConvertFToS %81 %587
%589 = OpExtInst %81 %79 SMin %588 %579
%590 = OpINotEqual %80 %586 %588
%591 = OpDPdx %43 %575
%592 = OpDPdy %43 %575
%593 = OpExtInst %43 %79 FAbs %591
%594 = OpExtInst %43 %79 FAbs %592
%595 = OpCompositeExtract %10 %593 0
%596 = OpCompositeExtract %10 %594 0
%597 = OpCompositeExtract %10 %593 1
%598 = OpCompositeExtract %10 %594 1
%599 = OpExtInst %10 %79 FMax %595 %596
%600 = OpExtInst %10 %79 FMax %597 %598
%601 = OpCompositeConstruct %43 %599 %600
%602 = OpVectorTimesScalar %43 %601 %581
%603 = OpExtInst %43 %79 Fract %575
%605 = OpImageQuerySizeLod %83 %573 %586
%604 = OpConvertSToF %43 %605
%606 = OpSNegate %83 %577
%607 = OpExtInst %43 %79 Ldexp %604 %606
%608 = OpFMul %43 %603 %607
%609 = OpFMul %43 %602 %604
%610 = OpFSub %43 %609 %122
%611 = OpExtInst %123 %79 FrexpStruct %610
%612 = OpCompositeExtract %83 %611 1
%613 = OpExtInst %83 %79 SClamp %612 %128 %130
%614 = OpIAdd %83 %613 %606
%615 = OpExtInst %43 %79 Ldexp %134 %614
%616 = OpExtInst %43 %79 FMin %615 %134
%617 = OpFSub %43 %608 %616
%618 = OpExtInst %43 %79 FMax %617 %139
%619 = OpFAdd %43 %608 %616
%620 = OpConvertFToS %83 %618
%621 = OpConvertFToS %83 %619
%622 = OpINotEqual %82 %620 %621
%623 = OpCompositeExtract %80 %622 0
%624 = OpCompositeExtract %80 %622 1
%625 = OpLogicalAnd %80 %623 %624
%626 = OpSelect %81 %623 %148 %127
%627 = OpBitwiseOr %81 %91 %626
%628 = OpSelect %81 %624 %129 %127
%629 = OpBitwiseOr %81 %627 %628
%630 = OpSelect %81 %625 %153 %127
%631 = OpBitwiseOr %81 %629 %630
%632 = OpSConvert %5 %631
%633 = OpIMul %81 %586 %129
%634 = OpSConvert %5 %633
%635 = OpShiftLeftLogical %5 %632 %634
%636 = OpIsHelperInvocationEXT %80
%637 = OpLogicalNot %80 %636
%638 = OpFunctionCall %1 %167 %24 %620 %635 %637
%640 = OpImageQuerySizeLod %83 %573 %588
%639 = OpConvertSToF %43 %640
%641 = OpSNegate %83 %577
%642 = OpExtInst %43 %79 Ldexp %639 %641
%643 = OpFMul %43 %603 %642
%644 = OpFMul %43 %602 %639
%645 = OpFSub %43 %644 %122
%646 = OpExtInst %123 %79 FrexpStruct %645
%647 = OpCompositeExtract %83 %646 1
%648 = OpExtInst %83 %79 SClamp %647 %128 %130
%649 = OpIAdd %83 %648 %641
%650 = OpExtInst %43 %79 Ldexp %134 %649
%651 = OpExtInst %43 %79 FMin %650 %134
%652 = OpFSub %43 %643 %651
%653 = OpExtInst %43 %79 FMax %652 %139
%654 = OpFAdd %43 %643 %651
%655 = OpConvertFToS %83 %653
%656 = OpConvertFToS %83 %654
%657 = OpINotEqual %82 %655 %656
%658 = OpCompositeExtract %80 %657 0
%659 = OpCompositeExtract %80 %657 1
%660 = OpLogicalAnd %80 %658 %659
%661 = OpSelect %81 %658 %148 %127
%662 = OpBitwiseOr %81 %91 %661
%663 = OpSelect %81 %659 %129 %127
%664 = OpBitwiseOr %81 %662 %663
%665 = OpSelect %81 %660 %153 %127
%666 = OpBitwiseOr %81 %664 %665
%667 = OpSConvert %5 %666
%668 = OpIMul %81 %588 %129
%669 = OpSConvert %5 %668
%670 = OpShiftLeftLogical %5 %667 %669
%671 = OpIsHelperInvocationEXT %80
%672 = OpLogicalNot %80 %671
%673 = OpLogicalAnd %80 %672 %590
%674 = OpFunctionCall %1 %167 %24 %655 %670 %673
%675 = OpLoad %6 %24
%676 = OpLoad %11 %13
%677 = OpLoad %34 %36
%678 = OpCompositeConstruct %43 %65 %67
%679 = OpImageQuerySize %83 %675
%680 = OpBitwiseAnd %83 %679 %88
%681 = OpImageQueryLevels %81 %676
%682 = OpISub %81 %681 %91
%683 = OpSampledImage %92 %676 %677
%684 = OpExtInst %10 %79 Exp2 %70
%685 = OpGroupNonUniformQuadBroadcast %10 %72 %684 %55
%686 = OpVectorTimesScalar %43 %678 %685
%687 = OpImageQueryLod %43 %683 %686
%688 = OpCompositeExtract %10 %687 0
%689 = OpExtInst %10 %79 FMax %688 %53
%690 = OpExtInst %10 %79 FMin %689 %240
%691 = OpConvertFToS %81 %690
%692 = OpFAdd %10 %690 %98
%693 = OpConvertFToS %81 %692
%694 = OpExtInst %81 %79 SMin %693 %682
%695 = OpINotEqual %80 %691 %693
%696 = OpDPdx %43 %678
%697 = OpDPdy %43 %678
%698 = OpExtInst %43 %79 FAbs %696
%699 = OpExtInst %43 %79 FAbs %697
%700 = OpCompositeExtract %10 %698 0
%701 = OpCompositeExtract %10 %699 0
%702 = OpCompositeExtract %10 %698 1
%703 = OpCompositeExtract %10 %699 1
%704 = OpExtInst %10 %79 FMax %700 %701
%705 = OpExtInst %10 %79 FMax %702 %703
%706 = OpCompositeConstruct %43 %704 %705
%707 = OpVectorTimesScalar %43 %706 %684
%708 = OpExtInst %43 %79 Fract %678
%710 = OpImageQuerySizeLod %83 %676 %691
%709 = OpConvertSToF %43 %710
%711 = OpSNegate %83 %680
%712 = OpExtInst %43 %79 Ldexp %709 %711
%713 = OpFMul %43 %708 %712
%714 = OpFMul %43 %707 %709
%715 = OpFSub %43 %714 %122
%716 = OpExtInst %123 %79 FrexpStruct %715
%717 = OpCompositeExtract %83 %716 1
%718 = OpExtInst %83 %79 SClamp %717 %128 %130
%719 = OpIAdd %83 %718 %711
%720 = OpExtInst %43 %79 Ldexp %134 %719
%721 = OpExtInst %43 %79 FMin %720 %134
%722 = OpFSub %43 %713 %721
%723 = OpExtInst %43 %79 FMax %722 %139
%724 = OpFAdd %43 %713 %721
%725 = OpConvertFToS %83 %723
%726 = OpConvertFToS %83 %724
%727 = OpINotEqual %82 %725 %726
%728 = OpCompositeExtract %80 %727 0
%729 = OpCompositeExtract %80 %727 1
%730 = OpLogicalAnd %80 %728 %729
%731 = OpSelect %81 %728 %148 %127
%732 = OpBitwiseOr %81 %91 %731
%733 = OpSelect %81 %729 %129 %127
%734 = OpBitwiseOr %81 %732 %733
%735 = OpSelect %81 %730 %153 %127
%736 = OpBitwiseOr %81 %734 %735
%737 = OpSConvert %5 %736
%738 = OpIMul %81 %691 %129
%739 = OpSConvert %5 %738
%740 = OpShiftLeftLogical %5 %737 %739
%741 = OpIsHelperInvocationEXT %80
%742 = OpLogicalNot %80 %741
%743 = OpFunctionCall %1 %167 %24 %725 %740 %742
%745 = OpImageQuerySizeLod %83 %676 %693
%744 = OpConvertSToF %43 %745
%746 = OpSNegate %83 %680
%747 = OpExtInst %43 %79 Ldexp %744 %746
%748 = OpFMul %43 %708 %747
%749 = OpFMul %43 %707 %744
%750 = OpFSub %43 %749 %122
%751 = OpExtInst %123 %79 FrexpStruct %750
%752 = OpCompositeExtract %83 %751 1
%753 = OpExtInst %83 %79 SClamp %752 %128 %130
%754 = OpIAdd %83 %753 %746
%755 = OpExtInst %43 %79 Ldexp %134 %754
%756 = OpExtInst %43 %79 FMin %755 %134
%757 = OpFSub %43 %748 %756
%758 = OpExtInst %43 %79 FMax %757 %139
%759 = OpFAdd %43 %748 %756
%760 = OpConvertFToS %83 %758
%761 = OpConvertFToS %83 %759
%762 = OpINotEqual %82 %760 %761
%763 = OpCompositeExtract %80 %762 0
%764 = OpCompositeExtract %80 %762 1
%765 = OpLogicalAnd %80 %763 %764
%766 = OpSelect %81 %763 %148 %127
%767 = OpBitwiseOr %81 %91 %766
%768 = OpSelect %81 %764 %129 %127
%769 = OpBitwiseOr %81 %767 %768
%770 = OpSelect %81 %765 %153 %127
%771 = OpBitwiseOr %81 %769 %770
%772 = OpSConvert %5 %771
%773 = OpIMul %81 %693 %129
%774 = OpSConvert %5 %773
%775 = OpShiftLeftLogical %5 %772 %774
%776 = OpIsHelperInvocationEXT %80
%777 = OpLogicalNot %80 %776
%778 = OpLogicalAnd %80 %777 %695
%779 = OpFunctionCall %1 %167 %24 %760 %775 %778
%780 = OpLoad %25 %27
%781 = OpLoad %14 %16
%782 = OpLoad %34 %36
%783 = OpExtInst %10 %79 RoundEven %70
%784 = OpConvertFToS %81 %783
%785 = OpCompositeConstruct %43 %65 %67
%787 = OpImageQuerySize %786 %780
%788 = OpVectorShuffle %83 %787 %787 0 1
%789 = OpBitwiseAnd %83 %788 %88
%790 = OpImageQueryLevels %81 %781
%791 = OpISub %81 %790 %91
%793 = OpSampledImage %792 %781 %782
%794 = OpImageQueryLod %43 %793 %785
%795 = OpCompositeExtract %10 %794 0
%796 = OpConvertFToS %81 %795
%797 = OpFAdd %10 %795 %98
%798 = OpConvertFToS %81 %797
%799 = OpExtInst %81 %79 SMin %798 %791
%800 = OpINotEqual %80 %796 %798
%801 = OpDPdx %43 %785
%802 = OpDPdy %43 %785
%803 = OpExtInst %43 %79 FAbs %801
%804 = OpExtInst %43 %79 FAbs %802
%805 = OpCompositeExtract %10 %803 0
%806 = OpCompositeExtract %10 %804 0
%807 = OpCompositeExtract %10 %803 1
%808 = OpCompositeExtract %10 %804 1
%809 = OpExtInst %10 %79 FMax %805 %806
%810 = OpExtInst %10 %79 FMax %807 %808
%811 = OpCompositeConstruct %43 %809 %810
%812 = OpExtInst %43 %79 Fract %785
%814 = OpImageQuerySizeLod %786 %781 %796
%815 = OpVectorShuffle %83 %814 %814 0 1
%813 = OpConvertSToF %43 %815
%816 = OpSNegate %83 %789
%817 = OpExtInst %43 %79 Ldexp %813 %816
%818 = OpFMul %43 %812 %817
%819 = OpFMul %43 %811 %813
%820 = OpFSub %43 %819 %122
%821 = OpExtInst %123 %79 FrexpStruct %820
%822 = OpCompositeExtract %83 %821 1
%823 = OpExtInst %83 %79 SClamp %822 %128 %130
%824 = OpIAdd %83 %823 %816
%825 = OpExtInst %43 %79 Ldexp %134 %824
%826 = OpExtInst %43 %79 FMin %825 %134
%827 = OpFSub %43 %818 %826
%828 = OpExtInst %43 %79 FMax %827 %139
%829 = OpFAdd %43 %818 %826
%830 = OpConvertFToS %83 %828
%831 = OpConvertFToS %83 %829
%832 = OpINotEqual %82 %830 %831
%833 = OpCompositeExtract %80 %832 0
%834 = OpCompositeExtract %80 %832 1
%835 = OpLogicalAnd %80 %833 %834
%836 = OpSelect %81 %833 %148 %127
%837 = OpBitwiseOr %81 %91 %836
%838 = OpSelect %81 %834 %129 %127
%839 = OpBitwiseOr %81 %837 %838
%840 = OpSelect %81 %835 %153 %127
%841 = OpBitwiseOr %81 %839 %840
%842 = OpSConvert %5 %841
%843 = OpIMul %81 %796 %129
%844 = OpSConvert %5 %843
%845 = OpShiftLeftLogical %5 %842 %844
%846 = OpCompositeConstruct %786 %830 %784
%847 = OpIsHelperInvocationEXT %80
%848 = OpLogicalNot %80 %847
%876 = OpFunctionCall %1 %855 %27 %846 %845 %848
%878 = OpImageQuerySizeLod %786 %781 %798
%879 = OpVectorShuffle %83 %878 %878 0 1
%877 = OpConvertSToF %43 %879
%880 = OpSNegate %83 %789
%881 = OpExtInst %43 %79 Ldexp %877 %880
%882 = OpFMul %43 %812 %881
%883 = OpFMul %43 %811 %877
%884 = OpFSub %43 %883 %122
%885 = OpExtInst %123 %79 FrexpStruct %884
%886 = OpCompositeExtract %83 %885 1
%887 = OpExtInst %83 %79 SClamp %886 %128 %130
%888 = OpIAdd %83 %887 %880
%889 = OpExtInst %43 %79 Ldexp %134 %888
%890 = OpExtInst %43 %79 FMin %889 %134
%891 = OpFSub %43 %882 %890
%892 = OpExtInst %43 %79 FMax %891 %139
%893 = OpFAdd %43 %882 %890
%894 = OpConvertFToS %83 %892
%895 = OpConvertFToS %83 %893
%896 = OpINotEqual %82 %894 %895
%897 = OpCompositeExtract %80 %896 0
%898 = OpCompositeExtract %80 %896 1
%899 = OpLogicalAnd %80 %897 %898
%900 = OpSelect %81 %897 %148 %127
%901 = OpBitwiseOr %81 %91 %900
%902 = OpSelect %81 %898 %129 %127
%903 = OpBitwiseOr %81 %901 %902
%904 = OpSelect %81 %899 %153 %127
%905 = OpBitwiseOr %81 %903 %904
%906 = OpSConvert %5 %905
%907 = OpIMul %81 %798 %129
%908 = OpSConvert %5 %907
%909 = OpShiftLeftLogical %5 %906 %908
%910 = OpCompositeConstruct %786 %894 %784
%911 = OpIsHelperInvocationEXT %80
%912 = OpLogicalNot %80 %911
%913 = OpLogicalAnd %80 %912 %800
%914 = OpFunctionCall %1 %855 %27 %910 %909 %913
%915 = OpLoad %25 %27
%916 = OpLoad %14 %16
%917 = OpLoad %34 %36
%918 = OpExtInst %10 %79 RoundEven %70
%919 = OpConvertFToS %81 %918
%920 = OpCompositeConstruct %43 %65 %67
%921 = OpImageQuerySize %786 %915
%922 = OpVectorShuffle %83 %921 %921 0 1
%923 = OpBitwiseAnd %83 %922 %88
%924 = OpImageQueryLevels %81 %916
%925 = OpISub %81 %924 %91
%926 = OpSampledImage %792 %916 %917
%927 = OpImageQueryLod %43 %926 %920
%928 = OpCompositeExtract %10 %927 0
%929 = OpExtInst %10 %79 FMax %928 %53
%930 = OpExtInst %10 %79 FMin %929 %240
%931 = OpConvertFToS %81 %930
%932 = OpFAdd %10 %930 %98
%933 = OpConvertFToS %81 %932
%934 = OpExtInst %81 %79 SMin %933 %925
%935 = OpINotEqual %80 %931 %933
%936 = OpDPdx %43 %920
%937 = OpDPdy %43 %920
%938 = OpExtInst %43 %79 FAbs %936
%939 = OpExtInst %43 %79 FAbs %937
%940 = OpCompositeExtract %10 %938 0
%941 = OpCompositeExtract %10 %939 0
%942 = OpCompositeExtract %10 %938 1
%943 = OpCompositeExtract %10 %939 1
%944 = OpExtInst %10 %79 FMax %940 %941
%945 = OpExtInst %10 %79 FMax %942 %943
%946 = OpCompositeConstruct %43 %944 %945
%947 = OpExtInst %43 %79 Fract %920
%949 = OpImageQuerySizeLod %786 %916 %931
%950 = OpVectorShuffle %83 %949 %949 0 1
%948 = OpConvertSToF %43 %950
%951 = OpSNegate %83 %923
%952 = OpExtInst %43 %79 Ldexp %948 %951
%953 = OpFMul %43 %947 %952
%954 = OpFMul %43 %946 %948
%955 = OpFSub %43 %954 %122
%956 = OpExtInst %123 %79 FrexpStruct %955
%957 = OpCompositeExtract %83 %956 1
%958 = OpExtInst %83 %79 SClamp %957 %128 %130
%959 = OpIAdd %83 %958 %951
%960 = OpExtInst %43 %79 Ldexp %134 %959
%961 = OpExtInst %43 %79 FMin %960 %134
%962 = OpFSub %43 %953 %961
%963 = OpExtInst %43 %79 FMax %962 %139
%964 = OpFAdd %43 %953 %961
%965 = OpConvertFToS %83 %963
%966 = OpConvertFToS %83 %964
%967 = OpINotEqual %82 %965 %966
%968 = OpCompositeExtract %80 %967 0
%969 = OpCompositeExtract %80 %967 1
%970 = OpLogicalAnd %80 %968 %969
%971 = OpSelect %81 %968 %148 %127
%972 = OpBitwiseOr %81 %91 %971
%973 = OpSelect %81 %969 %129 %127
%974 = OpBitwiseOr %81 %972 %973
%975 = OpSelect %81 %970 %153 %127
%976 = OpBitwiseOr %81 %974 %975
%977 = OpSConvert %5 %976
%978 = OpIMul %81 %931 %129
%979 = OpSConvert %5 %978
%980 = OpShiftLeftLogical %5 %977 %979
%981 = OpCompositeConstruct %786 %965 %919
%982 = OpIsHelperInvocationEXT %80
%983 = OpLogicalNot %80 %982
%984 = OpFunctionCall %1 %855 %27 %981 %980 %983
%986 = OpImageQuerySizeLod %786 %916 %933
%987 = OpVectorShuffle %83 %986 %986 0 1
%985 = OpConvertSToF %43 %987
%988 = OpSNegate %83 %923
%989 = OpExtInst %43 %79 Ldexp %985 %988
%990 = OpFMul %43 %947 %989
%991 = OpFMul %43 %946 %985
%992 = OpFSub %43 %991 %122
%993 = OpExtInst %123 %79 FrexpStruct %992
%994 = OpCompositeExtract %83 %993 1
%995 = OpExtInst %83 %79 SClamp %994 %128 %130
%996 = OpIAdd %83 %995 %988
%997 = OpExtInst %43 %79 Ldexp %134 %996
%998 = OpExtInst %43 %79 FMin %997 %134
%999 = OpFSub %43 %990 %998
%1000 = OpExtInst %43 %79 FMax %999 %139
%1001 = OpFAdd %43 %990 %998
%1002 = OpConvertFToS %83 %1000
%1003 = OpConvertFToS %83 %1001
%1004 = OpINotEqual %82 %1002 %1003
%1005 = OpCompositeExtract %80 %1004 0
%1006 = OpCompositeExtract %80 %1004 1
%1007 = OpLogicalAnd %80 %1005 %1006
%1008 = OpSelect %81 %1005 %148 %127
%1009 = OpBitwiseOr %81 %91 %1008
%1010 = OpSelect %81 %1006 %129 %127
%1011 = OpBitwiseOr %81 %1009 %1010
%1012 = OpSelect %81 %1007 %153 %127
%1013 = OpBitwiseOr %81 %1011 %1012
%1014 = OpSConvert %5 %1013
%1015 = OpIMul %81 %933 %129
%1016 = OpSConvert %5 %1015
%1017 = OpShiftLeftLogical %5 %1014 %1016
%1018 = OpCompositeConstruct %786 %1002 %919
%1019 = OpIsHelperInvocationEXT %80
%1020 = OpLogicalNot %80 %1019
%1021 = OpLogicalAnd %80 %1020 %935
%1022 = OpFunctionCall %1 %855 %27 %1018 %1017 %1021
%1023 = OpLoad %25 %27
%1024 = OpLoad %14 %16
%1025 = OpLoad %34 %36
%1026 = OpExtInst %10 %79 RoundEven %70
%1027 = OpConvertFToS %81 %1026
%1028 = OpCompositeConstruct %43 %65 %67
%1029 = OpImageQuerySize %786 %1023
%1030 = OpVectorShuffle %83 %1029 %1029 0 1
%1031 = OpBitwiseAnd %83 %1030 %88
%1032 = OpImageQueryLevels %81 %1024
%1033 = OpISub %81 %1032 %91
%1034 = OpConvertSToF %10 %1033
%1035 = OpExtInst %10 %79 NClamp %74 %138 %1034
%1036 = OpConvertFToS %81 %1035
%1037 = OpFAdd %10 %1035 %98
%1038 = OpConvertFToS %81 %1037
%1039 = OpExtInst %81 %79 SMin %1038 %1033
%1040 = OpINotEqual %80 %1036 %1038
%1041 = OpExtInst %43 %79 Fract %1028
%1043 = OpImageQuerySizeLod %786 %1024 %1036
%1044 = OpVectorShuffle %83 %1043 %1043 0 1
%1042 = OpConvertSToF %43 %1044
%1045 = OpSNegate %83 %1031
%1046 = OpExtInst %43 %79 Ldexp %1042 %1045
%1047 = OpFMul %43 %1041 %1046
%1048 = OpExtInst %43 %79 Ldexp %134 %1045
%1049 = OpFSub %43 %1047 %1048
%1050 = OpExtInst %43 %79 FMax %1049 %139
%1051 = OpFAdd %43 %1047 %1048
%1052 = OpConvertFToS %83 %1050
%1053 = OpConvertFToS %83 %1051
%1054 = OpINotEqual %82 %1052 %1053
%1055 = OpCompositeExtract %80 %1054 0
%1056 = OpCompositeExtract %80 %1054 1
%1057 = OpLogicalAnd %80 %1055 %1056
%1058 = OpSelect %81 %1055 %148 %127
%1059 = OpBitwiseOr %81 %91 %1058
%1060 = OpSelect %81 %1056 %129 %127
%1061 = OpBitwiseOr %81 %1059 %1060
%1062 = OpSelect %81 %1057 %153 %127
%1063 = OpBitwiseOr %81 %1061 %1062
%1064 = OpSConvert %5 %1063
%1065 = OpIMul %81 %1036 %129
%1066 = OpSConvert %5 %1065
%1067 = OpShiftLeftLogical %5 %1064 %1066
%1068 = OpCompositeConstruct %786 %1052 %1027
%1069 = OpIsHelperInvocationEXT %80
%1070 = OpLogicalNot %80 %1069
%1071 = OpFunctionCall %1 %855 %27 %1068 %1067 %1070
%1073 = OpImageQuerySizeLod %786 %1024 %1038
%1074 = OpVectorShuffle %83 %1073 %1073 0 1
%1072 = OpConvertSToF %43 %1074
%1075 = OpSNegate %83 %1031
%1076 = OpExtInst %43 %79 Ldexp %1072 %1075
%1077 = OpFMul %43 %1041 %1076
%1078 = OpExtInst %43 %79 Ldexp %134 %1075
%1079 = OpFSub %43 %1077 %1078
%1080 = OpExtInst %43 %79 FMax %1079 %139
%1081 = OpFAdd %43 %1077 %1078
%1082 = OpConvertFToS %83 %1080
%1083 = OpConvertFToS %83 %1081
%1084 = OpINotEqual %82 %1082 %1083
%1085 = OpCompositeExtract %80 %1084 0
%1086 = OpCompositeExtract %80 %1084 1
%1087 = OpLogicalAnd %80 %1085 %1086
%1088 = OpSelect %81 %1085 %148 %127
%1089 = OpBitwiseOr %81 %91 %1088
%1090 = OpSelect %81 %1086 %129 %127
%1091 = OpBitwiseOr %81 %1089 %1090
%1092 = OpSelect %81 %1087 %153 %127
%1093 = OpBitwiseOr %81 %1091 %1092
%1094 = OpSConvert %5 %1093
%1095 = OpIMul %81 %1038 %129
%1096 = OpSConvert %5 %1095
%1097 = OpShiftLeftLogical %5 %1094 %1096
%1098 = OpCompositeConstruct %786 %1082 %1027
%1099 = OpIsHelperInvocationEXT %80
%1100 = OpLogicalNot %80 %1099
%1101 = OpLogicalAnd %80 %1100 %1040
%1102 = OpFunctionCall %1 %855 %27 %1098 %1097 %1101
%1103 = OpLoad %25 %27
%1104 = OpLoad %14 %16
%1105 = OpLoad %34 %36
%1106 = OpExtInst %10 %79 RoundEven %70
%1107 = OpConvertFToS %81 %1106
%1108 = OpCompositeConstruct %43 %65 %67
%1109 = OpImageQuerySize %786 %1103
%1110 = OpVectorShuffle %83 %1109 %1109 0 1
%1111 = OpBitwiseAnd %83 %1110 %88
%1112 = OpImageQueryLevels %81 %1104
%1113 = OpISub %81 %1112 %91
%1115 = OpImageQuerySizeLod %786 %1104 %127
%1116 = OpVectorShuffle %83 %1115 %1115 0 1
%1114 = OpConvertSToF %43 %1116
%1117 = OpCompositeConstruct %43 %61 %63
%1118 = OpCompositeConstruct %43 %56 %59
%1119 = OpFMul %43 %1114 %1117
%1120 = OpFMul %43 %1114 %1118
%1121 = OpDot %10 %1119 %1119
%1122 = OpDot %10 %1120 %1120
%1123 = OpExtInst %10 %79 FMax %1121 %1122
%1124 = OpExtInst %10 %79 Log2 %1123
%1125 = OpFMul %10 %1124 %133
%1126 = OpConvertSToF %10 %1113
%1127 = OpExtInst %10 %79 NClamp %1125 %138 %1126
%1128 = OpConvertFToS %81 %1127
%1129 = OpFAdd %10 %1127 %98
%1130 = OpConvertFToS %81 %1129
%1131 = OpExtInst %81 %79 SMin %1130 %1113
%1132 = OpINotEqual %80 %1128 %1130
%1133 = OpExtInst %43 %79 Fract %1108
%1135 = OpImageQuerySizeLod %786 %1104 %1128
%1136 = OpVectorShuffle %83 %1135 %1135 0 1
%1134 = OpConvertSToF %43 %1136
%1137 = OpSNegate %83 %1111
%1138 = OpExtInst %43 %79 Ldexp %1134 %1137
%1139 = OpFMul %43 %1133 %1138
%1140 = OpExtInst %43 %79 Ldexp %134 %1137
%1141 = OpFSub %43 %1139 %1140
%1142 = OpExtInst %43 %79 FMax %1141 %139
%1143 = OpFAdd %43 %1139 %1140
%1144 = OpConvertFToS %83 %1142
%1145 = OpConvertFToS %83 %1143
%1146 = OpINotEqual %82 %1144 %1145
%1147 = OpCompositeExtract %80 %1146 0
%1148 = OpCompositeExtract %80 %1146 1
%1149 = OpLogicalAnd %80 %1147 %1148
%1150 = OpSelect %81 %1147 %148 %127
%1151 = OpBitwiseOr %81 %91 %1150
%1152 = OpSelect %81 %1148 %129 %127
%1153 = OpBitwiseOr %81 %1151 %1152
%1154 = OpSelect %81 %1149 %153 %127
%1155 = OpBitwiseOr %81 %1153 %1154
%1156 = OpSConvert %5 %1155
%1157 = OpIMul %81 %1128 %129
%1158 = OpSConvert %5 %1157
%1159 = OpShiftLeftLogical %5 %1156 %1158
%1160 = OpCompositeConstruct %786 %1144 %1107
%1161 = OpIsHelperInvocationEXT %80
%1162 = OpLogicalNot %80 %1161
%1163 = OpFunctionCall %1 %855 %27 %1160 %1159 %1162
%1165 = OpImageQuerySizeLod %786 %1104 %1130
%1166 = OpVectorShuffle %83 %1165 %1165 0 1
%1164 = OpConvertSToF %43 %1166
%1167 = OpSNegate %83 %1111
%1168 = OpExtInst %43 %79 Ldexp %1164 %1167
%1169 = OpFMul %43 %1133 %1168
%1170 = OpExtInst %43 %79 Ldexp %134 %1167
%1171 = OpFSub %43 %1169 %1170
%1172 = OpExtInst %43 %79 FMax %1171 %139
%1173 = OpFAdd %43 %1169 %1170
%1174 = OpConvertFToS %83 %1172
%1175 = OpConvertFToS %83 %1173
%1176 = OpINotEqual %82 %1174 %1175
%1177 = OpCompositeExtract %80 %1176 0
%1178 = OpCompositeExtract %80 %1176 1
%1179 = OpLogicalAnd %80 %1177 %1178
%1180 = OpSelect %81 %1177 %148 %127
%1181 = OpBitwiseOr %81 %91 %1180
%1182 = OpSelect %81 %1178 %129 %127
%1183 = OpBitwiseOr %81 %1181 %1182
%1184 = OpSelect %81 %1179 %153 %127
%1185 = OpBitwiseOr %81 %1183 %1184
%1186 = OpSConvert %5 %1185
%1187 = OpIMul %81 %1130 %129
%1188 = OpSConvert %5 %1187
%1189 = OpShiftLeftLogical %5 %1186 %1188
%1190 = OpCompositeConstruct %786 %1174 %1107
%1191 = OpIsHelperInvocationEXT %80
%1192 = OpLogicalNot %80 %1191
%1193 = OpLogicalAnd %80 %1192 %1132
%1194 = OpFunctionCall %1 %855 %27 %1190 %1189 %1193
%1195 = OpLoad %25 %27
%1196 = OpLoad %14 %16
%1197 = OpLoad %34 %36
%1198 = OpExtInst %10 %79 RoundEven %70
%1199 = OpConvertFToS %81 %1198
%1200 = OpCompositeConstruct %43 %65 %67
%1201 = OpImageQuerySize %786 %1195
%1202 = OpVectorShuffle %83 %1201 %1201 0 1
%1203 = OpBitwiseAnd %83 %1202 %88
%1204 = OpImageQueryLevels %81 %1196
%1205 = OpISub %81 %1204 %91
%1207 = OpImageQuerySizeLod %786 %1196 %127
%1208 = OpVectorShuffle %83 %1207 %1207 0 1
%1206 = OpConvertSToF %43 %1208
%1209 = OpCompositeConstruct %43 %61 %63
%1210 = OpCompositeConstruct %43 %56 %59
%1211 = OpFMul %43 %1206 %1209
%1212 = OpFMul %43 %1206 %1210
%1213 = OpDot %10 %1211 %1211
%1214 = OpDot %10 %1212 %1212
%1215 = OpExtInst %10 %79 FMax %1213 %1214
%1216 = OpExtInst %10 %79 Log2 %1215
%1217 = OpFMul %10 %1216 %133
%1218 = OpConvertSToF %10 %1205
%1219 = OpExtInst %10 %79 NClamp %1217 %138 %1218
%1220 = OpExtInst %10 %79 FMax %1219 %53
%1221 = OpExtInst %10 %79 FMin %1220 %240
%1222 = OpConvertFToS %81 %1221
%1223 = OpFAdd %10 %1221 %98
%1224 = OpConvertFToS %81 %1223
%1225 = OpExtInst %81 %79 SMin %1224 %1205
%1226 = OpINotEqual %80 %1222 %1224
%1227 = OpExtInst %43 %79 Fract %1200
%1229 = OpImageQuerySizeLod %786 %1196 %1222
%1230 = OpVectorShuffle %83 %1229 %1229 0 1
%1228 = OpConvertSToF %43 %1230
%1231 = OpSNegate %83 %1203
%1232 = OpExtInst %43 %79 Ldexp %1228 %1231
%1233 = OpFMul %43 %1227 %1232
%1234 = OpExtInst %43 %79 Ldexp %134 %1231
%1235 = OpFSub %43 %1233 %1234
%1236 = OpExtInst %43 %79 FMax %1235 %139
%1237 = OpFAdd %43 %1233 %1234
%1238 = OpConvertFToS %83 %1236
%1239 = OpConvertFToS %83 %1237
%1240 = OpINotEqual %82 %1238 %1239
%1241 = OpCompositeExtract %80 %1240 0
%1242 = OpCompositeExtract %80 %1240 1
%1243 = OpLogicalAnd %80 %1241 %1242
%1244 = OpSelect %81 %1241 %148 %127
%1245 = OpBitwiseOr %81 %91 %1244
%1246 = OpSelect %81 %1242 %129 %127
%1247 = OpBitwiseOr %81 %1245 %1246
%1248 = OpSelect %81 %1243 %153 %127
%1249 = OpBitwiseOr %81 %1247 %1248
%1250 = OpSConvert %5 %1249
%1251 = OpIMul %81 %1222 %129
%1252 = OpSConvert %5 %1251
%1253 = OpShiftLeftLogical %5 %1250 %1252
%1254 = OpCompositeConstruct %786 %1238 %1199
%1255 = OpIsHelperInvocationEXT %80
%1256 = OpLogicalNot %80 %1255
%1257 = OpFunctionCall %1 %855 %27 %1254 %1253 %1256
%1259 = OpImageQuerySizeLod %786 %1196 %1224
%1260 = OpVectorShuffle %83 %1259 %1259 0 1
%1258 = OpConvertSToF %43 %1260
%1261 = OpSNegate %83 %1203
%1262 = OpExtInst %43 %79 Ldexp %1258 %1261
%1263 = OpFMul %43 %1227 %1262
%1264 = OpExtInst %43 %79 Ldexp %134 %1261
%1265 = OpFSub %43 %1263 %1264
%1266 = OpExtInst %43 %79 FMax %1265 %139
%1267 = OpFAdd %43 %1263 %1264
%1268 = OpConvertFToS %83 %1266
%1269 = OpConvertFToS %83 %1267
%1270 = OpINotEqual %82 %1268 %1269
%1271 = OpCompositeExtract %80 %1270 0
%1272 = OpCompositeExtract %80 %1270 1
%1273 = OpLogicalAnd %80 %1271 %1272
%1274 = OpSelect %81 %1271 %148 %127
%1275 = OpBitwiseOr %81 %91 %1274
%1276 = OpSelect %81 %1272 %129 %127
%1277 = OpBitwiseOr %81 %1275 %1276
%1278 = OpSelect %81 %1273 %153 %127
%1279 = OpBitwiseOr %81 %1277 %1278
%1280 = OpSConvert %5 %1279
%1281 = OpIMul %81 %1224 %129
%1282 = OpSConvert %5 %1281
%1283 = OpShiftLeftLogical %5 %1280 %1282
%1284 = OpCompositeConstruct %786 %1268 %1199
%1285 = OpIsHelperInvocationEXT %80
%1286 = OpLogicalNot %80 %1285
%1287 = OpLogicalAnd %80 %1286 %1226
%1288 = OpFunctionCall %1 %855 %27 %1284 %1283 %1287
%1289 = OpLoad %25 %27
%1290 = OpLoad %14 %16
%1291 = OpLoad %34 %36
%1292 = OpExtInst %10 %79 RoundEven %70
%1293 = OpConvertFToS %81 %1292
%1294 = OpCompositeConstruct %43 %65 %67
%1295 = OpImageQuerySize %786 %1289
%1296 = OpVectorShuffle %83 %1295 %1295 0 1
%1297 = OpBitwiseAnd %83 %1296 %88
%1298 = OpImageQueryLevels %81 %1290
%1299 = OpISub %81 %1298 %91
%1300 = OpSampledImage %792 %1290 %1291
%1301 = OpExtInst %10 %79 Exp2 %70
%1302 = OpGroupNonUniformQuadBroadcast %10 %72 %1301 %55
%1303 = OpVectorTimesScalar %43 %1294 %1302
%1304 = OpImageQueryLod %43 %1300 %1303
%1305 = OpCompositeExtract %10 %1304 0
%1306 = OpConvertFToS %81 %1305
%1307 = OpFAdd %10 %1305 %98
%1308 = OpConvertFToS %81 %1307
%1309 = OpExtInst %81 %79 SMin %1308 %1299
%1310 = OpINotEqual %80 %1306 %1308
%1311 = OpDPdx %43 %1294
%1312 = OpDPdy %43 %1294
%1313 = OpExtInst %43 %79 FAbs %1311
%1314 = OpExtInst %43 %79 FAbs %1312
%1315 = OpCompositeExtract %10 %1313 0
%1316 = OpCompositeExtract %10 %1314 0
%1317 = OpCompositeExtract %10 %1313 1
%1318 = OpCompositeExtract %10 %1314 1
%1319 = OpExtInst %10 %79 FMax %1315 %1316
%1320 = OpExtInst %10 %79 FMax %1317 %1318
%1321 = OpCompositeConstruct %43 %1319 %1320
%1322 = OpVectorTimesScalar %43 %1321 %1301
%1323 = OpExtInst %43 %79 Fract %1294
%1325 = OpImageQuerySizeLod %786 %1290 %1306
%1326 = OpVectorShuffle %83 %1325 %1325 0 1
%1324 = OpConvertSToF %43 %1326
%1327 = OpSNegate %83 %1297
%1328 = OpExtInst %43 %79 Ldexp %1324 %1327
%1329 = OpFMul %43 %1323 %1328
%1330 = OpFMul %43 %1322 %1324
%1331 = OpFSub %43 %1330 %122
%1332 = OpExtInst %123 %79 FrexpStruct %1331
%1333 = OpCompositeExtract %83 %1332 1
%1334 = OpExtInst %83 %79 SClamp %1333 %128 %130
%1335 = OpIAdd %83 %1334 %1327
%1336 = OpExtInst %43 %79 Ldexp %134 %1335
%1337 = OpExtInst %43 %79 FMin %1336 %134
%1338 = OpFSub %43 %1329 %1337
%1339 = OpExtInst %43 %79 FMax %1338 %139
%1340 = OpFAdd %43 %1329 %1337
%1341 = OpConvertFToS %83 %1339
%1342 = OpConvertFToS %83 %1340
%1343 = OpINotEqual %82 %1341 %1342
%1344 = OpCompositeExtract %80 %1343 0
%1345 = OpCompositeExtract %80 %1343 1
%1346 = OpLogicalAnd %80 %1344 %1345
%1347 = OpSelect %81 %1344 %148 %127
%1348 = OpBitwiseOr %81 %91 %1347
%1349 = OpSelect %81 %1345 %129 %127
%1350 = OpBitwiseOr %81 %1348 %1349
%1351 = OpSelect %81 %1346 %153 %127
%1352 = OpBitwiseOr %81 %1350 %1351
%1353 = OpSConvert %5 %1352
%1354 = OpIMul %81 %1306 %129
%1355 = OpSConvert %5 %1354
%1356 = OpShiftLeftLogical %5 %1353 %1355
%1357 = OpCompositeConstruct %786 %1341 %1293
%1358 = OpIsHelperInvocationEXT %80
%1359 = OpLogicalNot %80 %1358
%1360 = OpFunctionCall %1 %855 %27 %1357 %1356 %1359
%1362 = OpImageQuerySizeLod %786 %1290 %1308
%1363 = OpVectorShuffle %83 %1362 %1362 0 1
%1361 = OpConvertSToF %43 %1363
%1364 = OpSNegate %83 %1297
%1365 = OpExtInst %43 %79 Ldexp %1361 %1364
%1366 = OpFMul %43 %1323 %1365
%1367 = OpFMul %43 %1322 %1361
%1368 = OpFSub %43 %1367 %122
%1369 = OpExtInst %123 %79 FrexpStruct %1368
%1370 = OpCompositeExtract %83 %1369 1
%1371 = OpExtInst %83 %79 SClamp %1370 %128 %130
%1372 = OpIAdd %83 %1371 %1364
%1373 = OpExtInst %43 %79 Ldexp %134 %1372
%1374 = OpExtInst %43 %79 FMin %1373 %134
%1375 = OpFSub %43 %1366 %1374
%1376 = OpExtInst %43 %79 FMax %1375 %139
%1377 = OpFAdd %43 %1366 %1374
%1378 = OpConvertFToS %83 %1376
%1379 = OpConvertFToS %83 %1377
%1380 = OpINotEqual %82 %1378 %1379
%1381 = OpCompositeExtract %80 %1380 0
%1382 = OpCompositeExtract %80 %1380 1
%1383 = OpLogicalAnd %80 %1381 %1382
%1384 = OpSelect %81 %1381 %148 %127
%1385 = OpBitwiseOr %81 %91 %1384
%1386 = OpSelect %81 %1382 %129 %127
%1387 = OpBitwiseOr %81 %1385 %1386
%1388 = OpSelect %81 %1383 %153 %127
%1389 = OpBitwiseOr %81 %1387 %1388
%1390 = OpSConvert %5 %1389
%1391 = OpIMul %81 %1308 %129
%1392 = OpSConvert %5 %1391
%1393 = OpShiftLeftLogical %5 %1390 %1392
%1394 = OpCompositeConstruct %786 %1378 %1293
%1395 = OpIsHelperInvocationEXT %80
%1396 = OpLogicalNot %80 %1395
%1397 = OpLogicalAnd %80 %1396 %1310
%1398 = OpFunctionCall %1 %855 %27 %1394 %1393 %1397
%1399 = OpLoad %25 %27
%1400 = OpLoad %14 %16
%1401 = OpLoad %34 %36
%1402 = OpExtInst %10 %79 RoundEven %70
%1403 = OpConvertFToS %81 %1402
%1404 = OpCompositeConstruct %43 %65 %67
%1405 = OpImageQuerySize %786 %1399
%1406 = OpVectorShuffle %83 %1405 %1405 0 1
%1407 = OpBitwiseAnd %83 %1406 %88
%1408 = OpImageQueryLevels %81 %1400
%1409 = OpISub %81 %1408 %91
%1410 = OpSampledImage %792 %1400 %1401
%1411 = OpExtInst %10 %79 Exp2 %74
%1412 = OpGroupNonUniformQuadBroadcast %10 %72 %1411 %55
%1413 = OpVectorTimesScalar %43 %1404 %1412
%1414 = OpImageQueryLod %43 %1410 %1413
%1415 = OpCompositeExtract %10 %1414 0
%1416 = OpExtInst %10 %79 FMax %1415 %53
%1417 = OpExtInst %10 %79 FMin %1416 %240
%1418 = OpConvertFToS %81 %1417
%1419 = OpFAdd %10 %1417 %98
%1420 = OpConvertFToS %81 %1419
%1421 = OpExtInst %81 %79 SMin %1420 %1409
%1422 = OpINotEqual %80 %1418 %1420
%1423 = OpDPdx %43 %1404
%1424 = OpDPdy %43 %1404
%1425 = OpExtInst %43 %79 FAbs %1423
%1426 = OpExtInst %43 %79 FAbs %1424
%1427 = OpCompositeExtract %10 %1425 0
%1428 = OpCompositeExtract %10 %1426 0
%1429 = OpCompositeExtract %10 %1425 1
%1430 = OpCompositeExtract %10 %1426 1
%1431 = OpExtInst %10 %79 FMax %1427 %1428
%1432 = OpExtInst %10 %79 FMax %1429 %1430
%1433 = OpCompositeConstruct %43 %1431 %1432
%1434 = OpVectorTimesScalar %43 %1433 %1411
%1435 = OpExtInst %43 %79 Fract %1404
%1437 = OpImageQuerySizeLod %786 %1400 %1418
%1438 = OpVectorShuffle %83 %1437 %1437 0 1
%1436 = OpConvertSToF %43 %1438
%1439 = OpSNegate %83 %1407
%1440 = OpExtInst %43 %79 Ldexp %1436 %1439
%1441 = OpFMul %43 %1435 %1440
%1442 = OpFMul %43 %1434 %1436
%1443 = OpFSub %43 %1442 %122
%1444 = OpExtInst %123 %79 FrexpStruct %1443
%1445 = OpCompositeExtract %83 %1444 1
%1446 = OpExtInst %83 %79 SClamp %1445 %128 %130
%1447 = OpIAdd %83 %1446 %1439
%1448 = OpExtInst %43 %79 Ldexp %134 %1447
%1449 = OpExtInst %43 %79 FMin %1448 %134
%1450 = OpFSub %43 %1441 %1449
%1451 = OpExtInst %43 %79 FMax %1450 %139
%1452 = OpFAdd %43 %1441 %1449
%1453 = OpConvertFToS %83 %1451
%1454 = OpConvertFToS %83 %1452
%1455 = OpINotEqual %82 %1453 %1454
%1456 = OpCompositeExtract %80 %1455 0
%1457 = OpCompositeExtract %80 %1455 1
%1458 = OpLogicalAnd %80 %1456 %1457
%1459 = OpSelect %81 %1456 %148 %127
%1460 = OpBitwiseOr %81 %91 %1459
%1461 = OpSelect %81 %1457 %129 %127
%1462 = OpBitwiseOr %81 %1460 %1461
%1463 = OpSelect %81 %1458 %153 %127
%1464 = OpBitwiseOr %81 %1462 %1463
%1465 = OpSConvert %5 %1464
%1466 = OpIMul %81 %1418 %129
%1467 = OpSConvert %5 %1466
%1468 = OpShiftLeftLogical %5 %1465 %1467
%1469 = OpCompositeConstruct %786 %1453 %1403
%1470 = OpIsHelperInvocationEXT %80
%1471 = OpLogicalNot %80 %1470
%1472 = OpFunctionCall %1 %855 %27 %1469 %1468 %1471
%1474 = OpImageQuerySizeLod %786 %1400 %1420
%1475 = OpVectorShuffle %83 %1474 %1474 0 1
%1473 = OpConvertSToF %43 %1475
%1476 = OpSNegate %83 %1407
%1477 = OpExtInst %43 %79 Ldexp %1473 %1476
%1478 = OpFMul %43 %1435 %1477
%1479 = OpFMul %43 %1434 %1473
%1480 = OpFSub %43 %1479 %122
%1481 = OpExtInst %123 %79 FrexpStruct %1480
%1482 = OpCompositeExtract %83 %1481 1
%1483 = OpExtInst %83 %79 SClamp %1482 %128 %130
%1484 = OpIAdd %83 %1483 %1476
%1485 = OpExtInst %43 %79 Ldexp %134 %1484
%1486 = OpExtInst %43 %79 FMin %1485 %134
%1487 = OpFSub %43 %1478 %1486
%1488 = OpExtInst %43 %79 FMax %1487 %139
%1489 = OpFAdd %43 %1478 %1486
%1490 = OpConvertFToS %83 %1488
%1491 = OpConvertFToS %83 %1489
%1492 = OpINotEqual %82 %1490 %1491
%1493 = OpCompositeExtract %80 %1492 0
%1494 = OpCompositeExtract %80 %1492 1
%1495 = OpLogicalAnd %80 %1493 %1494
%1496 = OpSelect %81 %1493 %148 %127
%1497 = OpBitwiseOr %81 %91 %1496
%1498 = OpSelect %81 %1494 %129 %127
%1499 = OpBitwiseOr %81 %1497 %1498
%1500 = OpSelect %81 %1495 %153 %127
%1501 = OpBitwiseOr %81 %1499 %1500
%1502 = OpSConvert %5 %1501
%1503 = OpIMul %81 %1420 %129
%1504 = OpSConvert %5 %1503
%1505 = OpShiftLeftLogical %5 %1502 %1504
%1506 = OpCompositeConstruct %786 %1490 %1403
%1507 = OpIsHelperInvocationEXT %80
%1508 = OpLogicalNot %80 %1507
%1509 = OpLogicalAnd %80 %1508 %1422
%1510 = OpFunctionCall %1 %855 %27 %1506 %1505 %1509
%1511 = OpIAdd %49 %52 %55
%1512 = OpAccessChain %23 %30 %1511
%1513 = OpLoad %6 %1512
%1514 = OpIAdd %49 %52 %55
%1515 = OpAccessChain %12 %19 %1514
%1516 = OpLoad %11 %1515
%1517 = OpIAdd %49 %52 %55
%1518 = OpAccessChain %35 %39 %1517
%1519 = OpLoad %34 %1518
%1520 = OpCompositeConstruct %43 %65 %67
%1521 = OpImageQuerySize %83 %1513
%1522 = OpBitwiseAnd %83 %1521 %88
%1523 = OpImageQueryLevels %81 %1516
%1524 = OpISub %81 %1523 %91
%1525 = OpSampledImage %92 %1516 %1519
%1526 = OpImageQueryLod %43 %1525 %1520
%1527 = OpCompositeExtract %10 %1526 0
%1528 = OpConvertFToS %81 %1527
%1529 = OpFAdd %10 %1527 %98
%1530 = OpConvertFToS %81 %1529
%1531 = OpExtInst %81 %79 SMin %1530 %1524
%1532 = OpINotEqual %80 %1528 %1530
%1533 = OpDPdx %43 %1520
%1534 = OpDPdy %43 %1520
%1535 = OpExtInst %43 %79 FAbs %1533
%1536 = OpExtInst %43 %79 FAbs %1534
%1537 = OpCompositeExtract %10 %1535 0
%1538 = OpCompositeExtract %10 %1536 0
%1539 = OpCompositeExtract %10 %1535 1
%1540 = OpCompositeExtract %10 %1536 1
%1541 = OpExtInst %10 %79 FMax %1537 %1538
%1542 = OpExtInst %10 %79 FMax %1539 %1540
%1543 = OpCompositeConstruct %43 %1541 %1542
%1544 = OpExtInst %43 %79 Fract %1520
%1546 = OpImageQuerySizeLod %83 %1516 %1528
%1545 = OpConvertSToF %43 %1546
%1547 = OpSNegate %83 %1522
%1548 = OpExtInst %43 %79 Ldexp %1545 %1547
%1549 = OpFMul %43 %1544 %1548
%1550 = OpFMul %43 %1543 %1545
%1551 = OpFSub %43 %1550 %122
%1552 = OpExtInst %123 %79 FrexpStruct %1551
%1553 = OpCompositeExtract %83 %1552 1
%1554 = OpExtInst %83 %79 SClamp %1553 %128 %130
%1555 = OpIAdd %83 %1554 %1547
%1556 = OpExtInst %43 %79 Ldexp %134 %1555
%1557 = OpExtInst %43 %79 FMin %1556 %134
%1558 = OpFSub %43 %1549 %1557
%1559 = OpExtInst %43 %79 FMax %1558 %139
%1560 = OpFAdd %43 %1549 %1557
%1561 = OpConvertFToS %83 %1559
%1562 = OpConvertFToS %83 %1560
%1563 = OpINotEqual %82 %1561 %1562
%1564 = OpCompositeExtract %80 %1563 0
%1565 = OpCompositeExtract %80 %1563 1
%1566 = OpLogicalAnd %80 %1564 %1565
%1567 = OpSelect %81 %1564 %148 %127
%1568 = OpBitwiseOr %81 %91 %1567
%1569 = OpSelect %81 %1565 %129 %127
%1570 = OpBitwiseOr %81 %1568 %1569
%1571 = OpSelect %81 %1566 %153 %127
%1572 = OpBitwiseOr %81 %1570 %1571
%1573 = OpSConvert %5 %1572
%1574 = OpIMul %81 %1528 %129
%1575 = OpSConvert %5 %1574
%1576 = OpShiftLeftLogical %5 %1573 %1575
%1577 = OpIsHelperInvocationEXT %80
%1578 = OpLogicalNot %80 %1577
%1604 = OpFunctionCall %1 %1583 %1512 %1561 %1576 %1578
%1606 = OpImageQuerySizeLod %83 %1516 %1530
%1605 = OpConvertSToF %43 %1606
%1607 = OpSNegate %83 %1522
%1608 = OpExtInst %43 %79 Ldexp %1605 %1607
%1609 = OpFMul %43 %1544 %1608
%1610 = OpFMul %43 %1543 %1605
%1611 = OpFSub %43 %1610 %122
%1612 = OpExtInst %123 %79 FrexpStruct %1611
%1613 = OpCompositeExtract %83 %1612 1
%1614 = OpExtInst %83 %79 SClamp %1613 %128 %130
%1615 = OpIAdd %83 %1614 %1607
%1616 = OpExtInst %43 %79 Ldexp %134 %1615
%1617 = OpExtInst %43 %79 FMin %1616 %134
%1618 = OpFSub %43 %1609 %1617
%1619 = OpExtInst %43 %79 FMax %1618 %139
%1620 = OpFAdd %43 %1609 %1617
%1621 = OpConvertFToS %83 %1619
%1622 = OpConvertFToS %83 %1620
%1623 = OpINotEqual %82 %1621 %1622
%1624 = OpCompositeExtract %80 %1623 0
%1625 = OpCompositeExtract %80 %1623 1
%1626 = OpLogicalAnd %80 %1624 %1625
%1627 = OpSelect %81 %1624 %148 %127
%1628 = OpBitwiseOr %81 %91 %1627
%1629 = OpSelect %81 %1625 %129 %127
%1630 = OpBitwiseOr %81 %1628 %1629
%1631 = OpSelect %81 %1626 %153 %127
%1632 = OpBitwiseOr %81 %1630 %1631
%1633 = OpSConvert %5 %1632
%1634 = OpIMul %81 %1530 %129
%1635 = OpSConvert %5 %1634
%1636 = OpShiftLeftLogical %5 %1633 %1635
%1637 = OpIsHelperInvocationEXT %80
%1638 = OpLogicalNot %80 %1637
%1639 = OpLogicalAnd %80 %1638 %1532
%1640 = OpFunctionCall %1 %1583 %1512 %1621 %1636 %1639
%1641 = OpIAdd %49 %52 %55
%1642 = OpAccessChain %26 %33 %1641
%1643 = OpLoad %25 %1642
%1644 = OpIAdd %49 %52 %55
%1645 = OpAccessChain %15 %22 %1644
%1646 = OpLoad %14 %1645
%1647 = OpAccessChain %35 %39 %1517
%1648 = OpLoad %34 %1647
%1649 = OpExtInst %10 %79 RoundEven %70
%1650 = OpConvertFToS %81 %1649
%1651 = OpCompositeConstruct %43 %65 %67
%1652 = OpImageQuerySize %786 %1643
%1653 = OpVectorShuffle %83 %1652 %1652 0 1
%1654 = OpBitwiseAnd %83 %1653 %88
%1655 = OpImageQueryLevels %81 %1646
%1656 = OpISub %81 %1655 %91
%1657 = OpSampledImage %792 %1646 %1648
%1658 = OpImageQueryLod %43 %1657 %1651
%1659 = OpCompositeExtract %10 %1658 0
%1660 = OpConvertFToS %81 %1659
%1661 = OpFAdd %10 %1659 %98
%1662 = OpConvertFToS %81 %1661
%1663 = OpExtInst %81 %79 SMin %1662 %1656
%1664 = OpINotEqual %80 %1660 %1662
%1665 = OpDPdx %43 %1651
%1666 = OpDPdy %43 %1651
%1667 = OpExtInst %43 %79 FAbs %1665
%1668 = OpExtInst %43 %79 FAbs %1666
%1669 = OpCompositeExtract %10 %1667 0
%1670 = OpCompositeExtract %10 %1668 0
%1671 = OpCompositeExtract %10 %1667 1
%1672 = OpCompositeExtract %10 %1668 1
%1673 = OpExtInst %10 %79 FMax %1669 %1670
%1674 = OpExtInst %10 %79 FMax %1671 %1672
%1675 = OpCompositeConstruct %43 %1673 %1674
%1676 = OpExtInst %43 %79 Fract %1651
%1678 = OpImageQuerySizeLod %786 %1646 %1660
%1679 = OpVectorShuffle %83 %1678 %1678 0 1
%1677 = OpConvertSToF %43 %1679
%1680 = OpSNegate %83 %1654
%1681 = OpExtInst %43 %79 Ldexp %1677 %1680
%1682 = OpFMul %43 %1676 %1681
%1683 = OpFMul %43 %1675 %1677
%1684 = OpFSub %43 %1683 %122
%1685 = OpExtInst %123 %79 FrexpStruct %1684
%1686 = OpCompositeExtract %83 %1685 1
%1687 = OpExtInst %83 %79 SClamp %1686 %128 %130
%1688 = OpIAdd %83 %1687 %1680
%1689 = OpExtInst %43 %79 Ldexp %134 %1688
%1690 = OpExtInst %43 %79 FMin %1689 %134
%1691 = OpFSub %43 %1682 %1690
%1692 = OpExtInst %43 %79 FMax %1691 %139
%1693 = OpFAdd %43 %1682 %1690
%1694 = OpConvertFToS %83 %1692
%1695 = OpConvertFToS %83 %1693
%1696 = OpINotEqual %82 %1694 %1695
%1697 = OpCompositeExtract %80 %1696 0
%1698 = OpCompositeExtract %80 %1696 1
%1699 = OpLogicalAnd %80 %1697 %1698
%1700 = OpSelect %81 %1697 %148 %127
%1701 = OpBitwiseOr %81 %91 %1700
%1702 = OpSelect %81 %1698 %129 %127
%1703 = OpBitwiseOr %81 %1701 %1702
%1704 = OpSelect %81 %1699 %153 %127
%1705 = OpBitwiseOr %81 %1703 %1704
%1706 = OpSConvert %5 %1705
%1707 = OpIMul %81 %1660 %129
%1708 = OpSConvert %5 %1707
%1709 = OpShiftLeftLogical %5 %1706 %1708
%1710 = OpCompositeConstruct %786 %1694 %1650
%1711 = OpIsHelperInvocationEXT %80
%1712 = OpLogicalNot %80 %1711
%1738 = OpFunctionCall %1 %1717 %1642 %1710 %1709 %1712
%1740 = OpImageQuerySizeLod %786 %1646 %1662
%1741 = OpVectorShuffle %83 %1740 %1740 0 1
%1739 = OpConvertSToF %43 %1741
%1742 = OpSNegate %83 %1654
%1743 = OpExtInst %43 %79 Ldexp %1739 %1742
%1744 = OpFMul %43 %1676 %1743
%1745 = OpFMul %43 %1675 %1739
%1746 = OpFSub %43 %1745 %122
%1747 = OpExtInst %123 %79 FrexpStruct %1746
%1748 = OpCompositeExtract %83 %1747 1
%1749 = OpExtInst %83 %79 SClamp %1748 %128 %130
%1750 = OpIAdd %83 %1749 %1742
%1751 = OpExtInst %43 %79 Ldexp %134 %1750
%1752 = OpExtInst %43 %79 FMin %1751 %134
%1753 = OpFSub %43 %1744 %1752
%1754 = OpExtInst %43 %79 FMax %1753 %139
%1755 = OpFAdd %43 %1744 %1752
%1756 = OpConvertFToS %83 %1754
%1757 = OpConvertFToS %83 %1755
%1758 = OpINotEqual %82 %1756 %1757
%1759 = OpCompositeExtract %80 %1758 0
%1760 = OpCompositeExtract %80 %1758 1
%1761 = OpLogicalAnd %80 %1759 %1760
%1762 = OpSelect %81 %1759 %148 %127
%1763 = OpBitwiseOr %81 %91 %1762
%1764 = OpSelect %81 %1760 %129 %127
%1765 = OpBitwiseOr %81 %1763 %1764
%1766 = OpSelect %81 %1761 %153 %127
%1767 = OpBitwiseOr %81 %1765 %1766
%1768 = OpSConvert %5 %1767
%1769 = OpIMul %81 %1662 %129
%1770 = OpSConvert %5 %1769
%1771 = OpShiftLeftLogical %5 %1768 %1770
%1772 = OpCompositeConstruct %786 %1756 %1650
%1773 = OpIsHelperInvocationEXT %80
%1774 = OpLogicalNot %80 %1773
%1775 = OpLogicalAnd %80 %1774 %1664
%1776 = OpFunctionCall %1 %1717 %1642 %1772 %1771 %1775
%1777 = OpAccessChain %23 %30 %1511
%1778 = OpLoad %6 %1777
%1779 = OpAccessChain %12 %19 %1514
%1780 = OpLoad %11 %1779
%1781 = OpAccessChain %35 %39 %1517
%1782 = OpLoad %34 %1781
%1783 = OpCompositeConstruct %43 %65 %67
%1784 = OpImageQuerySize %83 %1778
%1785 = OpBitwiseAnd %83 %1784 %88
%1786 = OpImageQueryLevels %81 %1780
%1787 = OpISub %81 %1786 %91
%1788 = OpSampledImage %92 %1780 %1782
%1789 = OpImageQueryLod %43 %1788 %1783
%1790 = OpCompositeExtract %10 %1789 0
%1791 = OpConvertFToS %81 %1790
%1792 = OpFAdd %10 %1790 %98
%1793 = OpConvertFToS %81 %1792
%1794 = OpExtInst %81 %79 SMin %1793 %1787
%1795 = OpINotEqual %80 %1791 %1793
%1796 = OpDPdx %43 %1783
%1797 = OpDPdy %43 %1783
%1798 = OpExtInst %43 %79 FAbs %1796
%1799 = OpExtInst %43 %79 FAbs %1797
%1800 = OpCompositeExtract %10 %1798 0
%1801 = OpCompositeExtract %10 %1799 0
%1802 = OpCompositeExtract %10 %1798 1
%1803 = OpCompositeExtract %10 %1799 1
%1804 = OpExtInst %10 %79 FMax %1800 %1801
%1805 = OpExtInst %10 %79 FMax %1802 %1803
%1806 = OpCompositeConstruct %43 %1804 %1805
%1807 = OpExtInst %43 %79 Fract %1783
%1809 = OpImageQuerySizeLod %83 %1780 %1791
%1808 = OpConvertSToF %43 %1809
%1810 = OpSNegate %83 %1785
%1811 = OpExtInst %43 %79 Ldexp %1808 %1810
%1812 = OpFMul %43 %1807 %1811
%1813 = OpFMul %43 %1806 %1808
%1814 = OpFSub %43 %1813 %122
%1815 = OpExtInst %123 %79 FrexpStruct %1814
%1816 = OpCompositeExtract %83 %1815 1
%1817 = OpExtInst %83 %79 SClamp %1816 %128 %130
%1818 = OpIAdd %83 %1817 %1810
%1819 = OpExtInst %43 %79 Ldexp %134 %1818
%1820 = OpExtInst %43 %79 FMin %1819 %134
%1821 = OpFSub %43 %1812 %1820
%1822 = OpExtInst %43 %79 FMax %1821 %139
%1823 = OpFAdd %43 %1812 %1820
%1824 = OpConvertFToS %83 %1822
%1825 = OpConvertFToS %83 %1823
%1826 = OpINotEqual %82 %1824 %1825
%1827 = OpCompositeExtract %80 %1826 0
%1828 = OpCompositeExtract %80 %1826 1
%1829 = OpLogicalAnd %80 %1827 %1828
%1830 = OpSelect %81 %1827 %148 %127
%1831 = OpBitwiseOr %81 %91 %1830
%1832 = OpSelect %81 %1828 %129 %127
%1833 = OpBitwiseOr %81 %1831 %1832
%1834 = OpSelect %81 %1829 %153 %127
%1835 = OpBitwiseOr %81 %1833 %1834
%1836 = OpSConvert %5 %1835
%1837 = OpIMul %81 %1791 %129
%1838 = OpSConvert %5 %1837
%1839 = OpShiftLeftLogical %5 %1836 %1838
%1840 = OpIsHelperInvocationEXT %80
%1841 = OpLogicalNot %80 %1840
%1842 = OpFunctionCall %1 %1583 %1777 %1824 %1839 %1841
%1844 = OpImageQuerySizeLod %83 %1780 %1793
%1843 = OpConvertSToF %43 %1844
%1845 = OpSNegate %83 %1785
%1846 = OpExtInst %43 %79 Ldexp %1843 %1845
%1847 = OpFMul %43 %1807 %1846
%1848 = OpFMul %43 %1806 %1843
%1849 = OpFSub %43 %1848 %122
%1850 = OpExtInst %123 %79 FrexpStruct %1849
%1851 = OpCompositeExtract %83 %1850 1
%1852 = OpExtInst %83 %79 SClamp %1851 %128 %130
%1853 = OpIAdd %83 %1852 %1845
%1854 = OpExtInst %43 %79 Ldexp %134 %1853
%1855 = OpExtInst %43 %79 FMin %1854 %134
%1856 = OpFSub %43 %1847 %1855
%1857 = OpExtInst %43 %79 FMax %1856 %139
%1858 = OpFAdd %43 %1847 %1855
%1859 = OpConvertFToS %83 %1857
%1860 = OpConvertFToS %83 %1858
%1861 = OpINotEqual %82 %1859 %1860
%1862 = OpCompositeExtract %80 %1861 0
%1863 = OpCompositeExtract %80 %1861 1
%1864 = OpLogicalAnd %80 %1862 %1863
%1865 = OpSelect %81 %1862 %148 %127
%1866 = OpBitwiseOr %81 %91 %1865
%1867 = OpSelect %81 %1863 %129 %127
%1868 = OpBitwiseOr %81 %1866 %1867
%1869 = OpSelect %81 %1864 %153 %127
%1870 = OpBitwiseOr %81 %1868 %1869
%1871 = OpSConvert %5 %1870
%1872 = OpIMul %81 %1793 %129
%1873 = OpSConvert %5 %1872
%1874 = OpShiftLeftLogical %5 %1871 %1873
%1875 = OpIsHelperInvocationEXT %80
%1876 = OpLogicalNot %80 %1875
%1877 = OpLogicalAnd %80 %1876 %1795
%1878 = OpFunctionCall %1 %1583 %1777 %1859 %1874 %1877
%1879 = OpAccessChain %26 %33 %1641
%1880 = OpLoad %25 %1879
%1881 = OpAccessChain %15 %22 %1644
%1882 = OpLoad %14 %1881
%1883 = OpAccessChain %35 %39 %1517
%1884 = OpLoad %34 %1883
%1885 = OpExtInst %10 %79 RoundEven %70
%1886 = OpConvertFToS %81 %1885
%1887 = OpCompositeConstruct %43 %65 %67
%1888 = OpImageQuerySize %786 %1880
%1889 = OpVectorShuffle %83 %1888 %1888 0 1
%1890 = OpBitwiseAnd %83 %1889 %88
%1891 = OpImageQueryLevels %81 %1882
%1892 = OpISub %81 %1891 %91
%1893 = OpSampledImage %792 %1882 %1884
%1894 = OpImageQueryLod %43 %1893 %1887
%1895 = OpCompositeExtract %10 %1894 0
%1896 = OpConvertFToS %81 %1895
%1897 = OpFAdd %10 %1895 %98
%1898 = OpConvertFToS %81 %1897
%1899 = OpExtInst %81 %79 SMin %1898 %1892
%1900 = OpINotEqual %80 %1896 %1898
%1901 = OpDPdx %43 %1887
%1902 = OpDPdy %43 %1887
%1903 = OpExtInst %43 %79 FAbs %1901
%1904 = OpExtInst %43 %79 FAbs %1902
%1905 = OpCompositeExtract %10 %1903 0
%1906 = OpCompositeExtract %10 %1904 0
%1907 = OpCompositeExtract %10 %1903 1
%1908 = OpCompositeExtract %10 %1904 1
%1909 = OpExtInst %10 %79 FMax %1905 %1906
%1910 = OpExtInst %10 %79 FMax %1907 %1908
%1911 = OpCompositeConstruct %43 %1909 %1910
%1912 = OpExtInst %43 %79 Fract %1887
%1914 = OpImageQuerySizeLod %786 %1882 %1896
%1915 = OpVectorShuffle %83 %1914 %1914 0 1
%1913 = OpConvertSToF %43 %1915
%1916 = OpSNegate %83 %1890
%1917 = OpExtInst %43 %79 Ldexp %1913 %1916
%1918 = OpFMul %43 %1912 %1917
%1919 = OpFMul %43 %1911 %1913
%1920 = OpFSub %43 %1919 %122
%1921 = OpExtInst %123 %79 FrexpStruct %1920
%1922 = OpCompositeExtract %83 %1921 1
%1923 = OpExtInst %83 %79 SClamp %1922 %128 %130
%1924 = OpIAdd %83 %1923 %1916
%1925 = OpExtInst %43 %79 Ldexp %134 %1924
%1926 = OpExtInst %43 %79 FMin %1925 %134
%1927 = OpFSub %43 %1918 %1926
%1928 = OpExtInst %43 %79 FMax %1927 %139
%1929 = OpFAdd %43 %1918 %1926
%1930 = OpConvertFToS %83 %1928
%1931 = OpConvertFToS %83 %1929
%1932 = OpINotEqual %82 %1930 %1931
%1933 = OpCompositeExtract %80 %1932 0
%1934 = OpCompositeExtract %80 %1932 1
%1935 = OpLogicalAnd %80 %1933 %1934
%1936 = OpSelect %81 %1933 %148 %127
%1937 = OpBitwiseOr %81 %91 %1936
%1938 = OpSelect %81 %1934 %129 %127
%1939 = OpBitwiseOr %81 %1937 %1938
%1940 = OpSelect %81 %1935 %153 %127
%1941 = OpBitwiseOr %81 %1939 %1940
%1942 = OpSConvert %5 %1941
%1943 = OpIMul %81 %1896 %129
%1944 = OpSConvert %5 %1943
%1945 = OpShiftLeftLogical %5 %1942 %1944
%1946 = OpCompositeConstruct %786 %1930 %1886
%1947 = OpIsHelperInvocationEXT %80
%1948 = OpLogicalNot %80 %1947
%1949 = OpFunctionCall %1 %1717 %1879 %1946 %1945 %1948
%1951 = OpImageQuerySizeLod %786 %1882 %1898
%1952 = OpVectorShuffle %83 %1951 %1951 0 1
%1950 = OpConvertSToF %43 %1952
%1953 = OpSNegate %83 %1890
%1954 = OpExtInst %43 %79 Ldexp %1950 %1953
%1955 = OpFMul %43 %1912 %1954
%1956 = OpFMul %43 %1911 %1950
%1957 = OpFSub %43 %1956 %122
%1958 = OpExtInst %123 %79 FrexpStruct %1957
%1959 = OpCompositeExtract %83 %1958 1
%1960 = OpExtInst %83 %79 SClamp %1959 %128 %130
%1961 = OpIAdd %83 %1960 %1953
%1962 = OpExtInst %43 %79 Ldexp %134 %1961
%1963 = OpExtInst %43 %79 FMin %1962 %134
%1964 = OpFSub %43 %1955 %1963
%1965 = OpExtInst %43 %79 FMax %1964 %139
%1966 = OpFAdd %43 %1955 %1963
%1967 = OpConvertFToS %83 %1965
%1968 = OpConvertFToS %83 %1966
%1969 = OpINotEqual %82 %1967 %1968
%1970 = OpCompositeExtract %80 %1969 0
%1971 = OpCompositeExtract %80 %1969 1
%1972 = OpLogicalAnd %80 %1970 %1971
%1973 = OpSelect %81 %1970 %148 %127
%1974 = OpBitwiseOr %81 %91 %1973
%1975 = OpSelect %81 %1971 %129 %127
%1976 = OpBitwiseOr %81 %1974 %1975
%1977 = OpSelect %81 %1972 %153 %127
%1978 = OpBitwiseOr %81 %1976 %1977
%1979 = OpSConvert %5 %1978
%1980 = OpIMul %81 %1898 %129
%1981 = OpSConvert %5 %1980
%1982 = OpShiftLeftLogical %5 %1979 %1981
%1983 = OpCompositeConstruct %786 %1967 %1886
%1984 = OpIsHelperInvocationEXT %80
%1985 = OpLogicalNot %80 %1984
%1986 = OpLogicalAnd %80 %1985 %1900
%1987 = OpFunctionCall %1 %1717 %1879 %1983 %1982 %1986
%1988 = OpAccessChain %23 %9 %52
%1989 = OpLoad %6 %1988
%1990 = OpLoad %11 %13
%1991 = OpLoad %34 %36
%1992 = OpCompositeConstruct %43 %65 %67
%1993 = OpImageQuerySize %83 %1989
%1994 = OpBitwiseAnd %83 %1993 %88
%1995 = OpImageQueryLevels %81 %1990
%1996 = OpISub %81 %1995 %91
%1997 = OpSampledImage %92 %1990 %1991
%1998 = OpImageQueryLod %43 %1997 %1992
%1999 = OpCompositeExtract %10 %1998 0
%2000 = OpConvertFToS %81 %1999
%2001 = OpFAdd %10 %1999 %98
%2002 = OpConvertFToS %81 %2001
%2003 = OpExtInst %81 %79 SMin %2002 %1996
%2004 = OpINotEqual %80 %2000 %2002
%2005 = OpDPdx %43 %1992
%2006 = OpDPdy %43 %1992
%2007 = OpExtInst %43 %79 FAbs %2005
%2008 = OpExtInst %43 %79 FAbs %2006
%2009 = OpCompositeExtract %10 %2007 0
%2010 = OpCompositeExtract %10 %2008 0
%2011 = OpCompositeExtract %10 %2007 1
%2012 = OpCompositeExtract %10 %2008 1
%2013 = OpExtInst %10 %79 FMax %2009 %2010
%2014 = OpExtInst %10 %79 FMax %2011 %2012
%2015 = OpCompositeConstruct %43 %2013 %2014
%2016 = OpExtInst %43 %79 Fract %1992
%2018 = OpImageQuerySizeLod %83 %1990 %2000
%2017 = OpConvertSToF %43 %2018
%2019 = OpSNegate %83 %1994
%2020 = OpExtInst %43 %79 Ldexp %2017 %2019
%2021 = OpFMul %43 %2016 %2020
%2022 = OpFMul %43 %2015 %2017
%2023 = OpFSub %43 %2022 %122
%2024 = OpExtInst %123 %79 FrexpStruct %2023
%2025 = OpCompositeExtract %83 %2024 1
%2026 = OpExtInst %83 %79 SClamp %2025 %128 %130
%2027 = OpIAdd %83 %2026 %2019
%2028 = OpExtInst %43 %79 Ldexp %134 %2027
%2029 = OpExtInst %43 %79 FMin %2028 %134
%2030 = OpFSub %43 %2021 %2029
%2031 = OpExtInst %43 %79 FMax %2030 %139
%2032 = OpFAdd %43 %2021 %2029
%2033 = OpConvertFToS %83 %2031
%2034 = OpConvertFToS %83 %2032
%2035 = OpINotEqual %82 %2033 %2034
%2036 = OpCompositeExtract %80 %2035 0
%2037 = OpCompositeExtract %80 %2035 1
%2038 = OpLogicalAnd %80 %2036 %2037
%2039 = OpSelect %81 %2036 %148 %127
%2040 = OpBitwiseOr %81 %91 %2039
%2041 = OpSelect %81 %2037 %129 %127
%2042 = OpBitwiseOr %81 %2040 %2041
%2043 = OpSelect %81 %2038 %153 %127
%2044 = OpBitwiseOr %81 %2042 %2043
%2045 = OpSConvert %5 %2044
%2046 = OpIMul %81 %2000 %129
%2047 = OpSConvert %5 %2046
%2048 = OpShiftLeftLogical %5 %2045 %2047
%2049 = OpIsHelperInvocationEXT %80
%2050 = OpLogicalNot %80 %2049
%2051 = OpFunctionCall %1 %1583 %1988 %2033 %2048 %2050
%2053 = OpImageQuerySizeLod %83 %1990 %2002
%2052 = OpConvertSToF %43 %2053
%2054 = OpSNegate %83 %1994
%2055 = OpExtInst %43 %79 Ldexp %2052 %2054
%2056 = OpFMul %43 %2016 %2055
%2057 = OpFMul %43 %2015 %2052
%2058 = OpFSub %43 %2057 %122
%2059 = OpExtInst %123 %79 FrexpStruct %2058
%2060 = OpCompositeExtract %83 %2059 1
%2061 = OpExtInst %83 %79 SClamp %2060 %128 %130
%2062 = OpIAdd %83 %2061 %2054
%2063 = OpExtInst %43 %79 Ldexp %134 %2062
%2064 = OpExtInst %43 %79 FMin %2063 %134
%2065 = OpFSub %43 %2056 %2064
%2066 = OpExtInst %43 %79 FMax %2065 %139
%2067 = OpFAdd %43 %2056 %2064
%2068 = OpConvertFToS %83 %2066
%2069 = OpConvertFToS %83 %2067
%2070 = OpINotEqual %82 %2068 %2069
%2071 = OpCompositeExtract %80 %2070 0
%2072 = OpCompositeExtract %80 %2070 1
%2073 = OpLogicalAnd %80 %2071 %2072
%2074 = OpSelect %81 %2071 %148 %127
%2075 = OpBitwiseOr %81 %91 %2074
%2076 = OpSelect %81 %2072 %129 %127
%2077 = OpBitwiseOr %81 %2075 %2076
%2078 = OpSelect %81 %2073 %153 %127
%2079 = OpBitwiseOr %81 %2077 %2078
%2080 = OpSConvert %5 %2079
%2081 = OpIMul %81 %2002 %129
%2082 = OpSConvert %5 %2081
%2083 = OpShiftLeftLogical %5 %2080 %2082
%2084 = OpIsHelperInvocationEXT %80
%2085 = OpLogicalNot %80 %2084
%2086 = OpLogicalAnd %80 %2085 %2004
%2087 = OpFunctionCall %1 %1583 %1988 %2068 %2083 %2086
%2088 = OpLoad %11 %13
%2089 = OpLoad %34 %36
%2090 = OpCompositeConstruct %43 %65 %67
%2091 = OpImageQuerySize %83 %1989
%2092 = OpBitwiseAnd %83 %2091 %88
%2093 = OpImageQueryLevels %81 %2088
%2094 = OpISub %81 %2093 %91
%2095 = OpSampledImage %92 %2088 %2089
%2096 = OpImageQueryLod %43 %2095 %2090
%2097 = OpCompositeExtract %10 %2096 0
%2098 = OpConvertFToS %81 %2097
%2099 = OpFAdd %10 %2097 %98
%2100 = OpConvertFToS %81 %2099
%2101 = OpExtInst %81 %79 SMin %2100 %2094
%2102 = OpINotEqual %80 %2098 %2100
%2103 = OpDPdx %43 %2090
%2104 = OpDPdy %43 %2090
%2105 = OpExtInst %43 %79 FAbs %2103
%2106 = OpExtInst %43 %79 FAbs %2104
%2107 = OpCompositeExtract %10 %2105 0
%2108 = OpCompositeExtract %10 %2106 0
%2109 = OpCompositeExtract %10 %2105 1
%2110 = OpCompositeExtract %10 %2106 1
%2111 = OpExtInst %10 %79 FMax %2107 %2108
%2112 = OpExtInst %10 %79 FMax %2109 %2110
%2113 = OpCompositeConstruct %43 %2111 %2112
%2114 = OpExtInst %43 %79 Fract %2090
%2116 = OpImageQuerySizeLod %83 %2088 %2098
%2115 = OpConvertSToF %43 %2116
%2117 = OpSNegate %83 %2092
%2118 = OpExtInst %43 %79 Ldexp %2115 %2117
%2119 = OpFMul %43 %2114 %2118
%2120 = OpFMul %43 %2113 %2115
%2121 = OpFSub %43 %2120 %122
%2122 = OpExtInst %123 %79 FrexpStruct %2121
%2123 = OpCompositeExtract %83 %2122 1
%2124 = OpExtInst %83 %79 SClamp %2123 %128 %130
%2125 = OpIAdd %83 %2124 %2117
%2126 = OpExtInst %43 %79 Ldexp %134 %2125
%2127 = OpExtInst %43 %79 FMin %2126 %134
%2128 = OpFSub %43 %2119 %2127
%2129 = OpExtInst %43 %79 FMax %2128 %139
%2130 = OpFAdd %43 %2119 %2127
%2131 = OpConvertFToS %83 %2129
%2132 = OpConvertFToS %83 %2130
%2133 = OpINotEqual %82 %2131 %2132
%2134 = OpCompositeExtract %80 %2133 0
%2135 = OpCompositeExtract %80 %2133 1
%2136 = OpLogicalAnd %80 %2134 %2135
%2137 = OpSelect %81 %2134 %148 %127
%2138 = OpBitwiseOr %81 %91 %2137
%2139 = OpSelect %81 %2135 %129 %127
%2140 = OpBitwiseOr %81 %2138 %2139
%2141 = OpSelect %81 %2136 %153 %127
%2142 = OpBitwiseOr %81 %2140 %2141
%2143 = OpSConvert %5 %2142
%2144 = OpIMul %81 %2098 %129
%2145 = OpSConvert %5 %2144
%2146 = OpShiftLeftLogical %5 %2143 %2145
%2147 = OpIsHelperInvocationEXT %80
%2148 = OpLogicalNot %80 %2147
%2149 = OpFunctionCall %1 %1583 %1988 %2131 %2146 %2148
%2151 = OpImageQuerySizeLod %83 %2088 %2100
%2150 = OpConvertSToF %43 %2151
%2152 = OpSNegate %83 %2092
%2153 = OpExtInst %43 %79 Ldexp %2150 %2152
%2154 = OpFMul %43 %2114 %2153
%2155 = OpFMul %43 %2113 %2150
%2156 = OpFSub %43 %2155 %122
%2157 = OpExtInst %123 %79 FrexpStruct %2156
%2158 = OpCompositeExtract %83 %2157 1
%2159 = OpExtInst %83 %79 SClamp %2158 %128 %130
%2160 = OpIAdd %83 %2159 %2152
%2161 = OpExtInst %43 %79 Ldexp %134 %2160
%2162 = OpExtInst %43 %79 FMin %2161 %134
%2163 = OpFSub %43 %2154 %2162
%2164 = OpExtInst %43 %79 FMax %2163 %139
%2165 = OpFAdd %43 %2154 %2162
%2166 = OpConvertFToS %83 %2164
%2167 = OpConvertFToS %83 %2165
%2168 = OpINotEqual %82 %2166 %2167
%2169 = OpCompositeExtract %80 %2168 0
%2170 = OpCompositeExtract %80 %2168 1
%2171 = OpLogicalAnd %80 %2169 %2170
%2172 = OpSelect %81 %2169 %148 %127
%2173 = OpBitwiseOr %81 %91 %2172
%2174 = OpSelect %81 %2170 %129 %127
%2175 = OpBitwiseOr %81 %2173 %2174
%2176 = OpSelect %81 %2171 %153 %127
%2177 = OpBitwiseOr %81 %2175 %2176
%2178 = OpSConvert %5 %2177
%2179 = OpIMul %81 %2100 %129
%2180 = OpSConvert %5 %2179
%2181 = OpShiftLeftLogical %5 %2178 %2180
%2182 = OpIsHelperInvocationEXT %80
%2183 = OpLogicalNot %80 %2182
%2184 = OpLogicalAnd %80 %2183 %2102
%2185 = OpFunctionCall %1 %1583 %1988 %2166 %2181 %2184
OpReturn
OpFunctionEnd
%167 = OpFunction %1 None %162
%163 = OpFunctionParameter %23
%164 = OpFunctionParameter %83
%165 = OpFunctionParameter %5
%166 = OpFunctionParameter %80
%168 = OpLabel
%180 = OpVariable %179 Function %178
OpSelectionMerge %177 None
OpBranchConditional %166 %169 %177
%169 = OpLabel
%181 = OpLoad %80 %180
%182 = OpLogicalNot %80 %181
OpLoopMerge %176 %175 None
OpBranchConditional %182 %170 %176
%170 = OpLabel
%183 = OpGroupNonUniformBroadcastFirst %83 %72 %164
%184 = OpIEqual %82 %164 %183
%185 = OpAll %80 %184
OpStore %180 %185
OpSelectionMerge %174 None
OpBranchConditional %185 %171 %174
%171 = OpLabel
%186 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %165
%187 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %173 None
OpBranchConditional %187 %172 %173
%172 = OpLabel
%188 = OpImageTexelPointer %161 %163 %164 %127
%189 = OpAtomicOr %5 %188 %58 %55 %186
OpBranch %173
%173 = OpLabel
OpBranch %174
%174 = OpLabel
OpBranch %175
%175 = OpLabel
OpBranch %169
%176 = OpLabel
OpBranch %177
%177 = OpLabel
OpReturn
OpFunctionEnd
%855 = OpFunction %1 None %850
%851 = OpFunctionParameter %26
%852 = OpFunctionParameter %786
%853 = OpFunctionParameter %5
%854 = OpFunctionParameter %80
%856 = OpLabel
%866 = OpVariable %179 Function %178
OpSelectionMerge %865 None
OpBranchConditional %854 %857 %865
%857 = OpLabel
%867 = OpLoad %80 %866
%868 = OpLogicalNot %80 %867
OpLoopMerge %864 %863 None
OpBranchConditional %868 %858 %864
%858 = OpLabel
%869 = OpGroupNonUniformBroadcastFirst %786 %72 %852
%870 = OpIEqual %849 %852 %869
%871 = OpAll %80 %870
OpStore %866 %871
OpSelectionMerge %862 None
OpBranchConditional %871 %859 %862
%859 = OpLabel
%872 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %853
%873 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %861 None
OpBranchConditional %873 %860 %861
%860 = OpLabel
%874 = OpImageTexelPointer %161 %851 %852 %127
%875 = OpAtomicOr %5 %874 %58 %55 %872
OpBranch %861
%861 = OpLabel
OpBranch %862
%862 = OpLabel
OpBranch %863
%863 = OpLabel
OpBranch %857
%864 = OpLabel
OpBranch %865
%865 = OpLabel
OpReturn
OpFunctionEnd
%1583 = OpFunction %1 None %162
%1579 = OpFunctionParameter %23
%1580 = OpFunctionParameter %83
%1581 = OpFunctionParameter %5
%1582 = OpFunctionParameter %80
%1584 = OpLabel
%1594 = OpVariable %179 Function %178
OpSelectionMerge %1593 None
OpBranchConditional %1582 %1585 %1593
%1585 = OpLabel
%1595 = OpLoad %80 %1594
%1596 = OpLogicalNot %80 %1595
OpLoopMerge %1592 %1591 None
OpBranchConditional %1596 %1586 %1592
%1586 = OpLabel
%1597 = OpGroupNonUniformBroadcastFirst %83 %72 %1580
%1598 = OpIEqual %82 %1580 %1597
%1599 = OpAll %80 %1598
OpStore %1594 %1599
OpSelectionMerge %1590 None
OpBranchConditional %1599 %1587 %1590
%1587 = OpLabel
%1600 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1581
%1601 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1589 None
OpBranchConditional %1601 %1588 %1589
%1588 = OpLabel
%1602 = OpImageTexelPointer %161 %1579 %1580 %127
%1603 = OpAtomicOr %5 %1602 %58 %55 %1600
OpBranch %1589
%1589 = OpLabel
OpBranch %1590
%1590 = OpLabel
OpBranch %1591
%1591 = OpLabel
OpBranch %1585
%1592 = OpLabel
OpBranch %1593
%1593 = OpLabel
OpReturn
OpFunctionEnd
%1717 = OpFunction %1 None %850
%1713 = OpFunctionParameter %26
%1714 = OpFunctionParameter %786
%1715 = OpFunctionParameter %5
%1716 = OpFunctionParameter %80
%1718 = OpLabel
%1728 = OpVariable %179 Function %178
OpSelectionMerge %1727 None
OpBranchConditional %1716 %1719 %1727
%1719 = OpLabel
%1729 = OpLoad %80 %1728
%1730 = OpLogicalNot %80 %1729
OpLoopMerge %1726 %1725 None
OpBranchConditional %1730 %1720 %1726
%1720 = OpLabel
%1731 = OpGroupNonUniformBroadcastFirst %786 %72 %1714
%1732 = OpIEqual %849 %1714 %1731
%1733 = OpAll %80 %1732
OpStore %1728 %1733
OpSelectionMerge %1724 None
OpBranchConditional %1733 %1721 %1724
%1721 = OpLabel
%1734 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1715
%1735 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1723 None
OpBranchConditional %1735 %1722 %1723
%1722 = OpLabel
%1736 = OpImageTexelPointer %161 %1713 %1714 %127
%1737 = OpAtomicOr %5 %1736 %58 %55 %1734
OpBranch %1723
%1723 = OpLabel
OpBranch %1724
%1724 = OpLabel
OpBranch %1725
%1725 = OpLabel
OpBranch %1719
%1726 = OpLabel
OpBranch %1727
%1727 = OpLabel
OpReturn
OpFunctionEnd
#endif
