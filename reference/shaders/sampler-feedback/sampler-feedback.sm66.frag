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
#extension GL_EXT_shader_atomic_int64 : require
#extension GL_EXT_samplerless_texture_functions : require
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
            bool _872 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _872;
            if (_872)
            {
                uint64_t _873 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _876 = imageAtomicOr(img, coord, _873);
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
            bool _1601 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1601;
            if (_1601)
            {
                uint64_t _1602 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1605 = imageAtomicOr(img, coord, _1602);
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
            bool _1736 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1736;
            if (_1736)
            {
                uint64_t _1737 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1740 = imageAtomicOr(img, coord, _1737);
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
    WriteFeedback(_24, _141, uint64_t(((1 | (_144 ? 2 : 0)) | (_145 ? 4 : 0)) | ((_144 && _145) ? 8 : 0)) << uint64_t(_96 * 4), !gl_HelperInvocation);
    vec2 _192 = vec2(textureSize(_13, _99));
    ivec2 _194 = -_86;
    vec2 _196 = _113 * ldexp(_192, _194);
    ResType _199;
    _199._m0 = frexp((_112 * _192) - vec2(0.00390625), _199._m1);
    vec2 _204 = min(ldexp(vec2(0.5), clamp(_199._m1, ivec2(0), ivec2(4)) + _194), vec2(0.5));
    ivec2 _208 = ivec2(max(_196 - _204, vec2(0.0)));
    bvec2 _210 = notEqual(_208, ivec2(_196 + _204));
    bool _211 = _210.x;
    bool _212 = _210.y;
    WriteFeedback(_24, _208, uint64_t(((1 | (_211 ? 2 : 0)) | (_212 ? 4 : 0)) | ((_211 && _212) ? 8 : 0)) << uint64_t(_99 * 4), (!gl_HelperInvocation) && (_96 != _99));
    vec2 _231 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _233 = imageSize(_24) & ivec2(15);
    float _240 = min(max(textureQueryLod(sampler2D(_13, _36), _231).x, CLAMP), 14.0);
    int _242 = int(_240);
    int _244 = int(_240 + 0.9970703125);
    vec2 _249 = abs(dFdx(_231));
    vec2 _250 = abs(dFdy(_231));
    vec2 _257 = vec2(max(_249.x, _250.x), max(_249.y, _250.y));
    vec2 _258 = fract(_231);
    vec2 _259 = vec2(textureSize(_13, _242));
    ivec2 _261 = -_233;
    vec2 _263 = _258 * ldexp(_259, _261);
    ResType _266;
    _266._m0 = frexp((_257 * _259) - vec2(0.00390625), _266._m1);
    vec2 _271 = min(ldexp(vec2(0.5), clamp(_266._m1, ivec2(0), ivec2(4)) + _261), vec2(0.5));
    ivec2 _275 = ivec2(max(_263 - _271, vec2(0.0)));
    bvec2 _277 = notEqual(_275, ivec2(_263 + _271));
    bool _278 = _277.x;
    bool _279 = _277.y;
    WriteFeedback(_24, _275, uint64_t(((1 | (_278 ? 2 : 0)) | (_279 ? 4 : 0)) | ((_278 && _279) ? 8 : 0)) << uint64_t(_242 * 4), !gl_HelperInvocation);
    vec2 _294 = vec2(textureSize(_13, _244));
    ivec2 _296 = -_233;
    vec2 _298 = _258 * ldexp(_294, _296);
    ResType _301;
    _301._m0 = frexp((_257 * _294) - vec2(0.00390625), _301._m1);
    vec2 _306 = min(ldexp(vec2(0.5), clamp(_301._m1, ivec2(0), ivec2(4)) + _296), vec2(0.5));
    ivec2 _310 = ivec2(max(_298 - _306, vec2(0.0)));
    bvec2 _312 = notEqual(_310, ivec2(_298 + _306));
    bool _313 = _312.x;
    bool _314 = _312.y;
    WriteFeedback(_24, _310, uint64_t(((1 | (_313 ? 2 : 0)) | (_314 ? 4 : 0)) | ((_313 && _314) ? 8 : 0)) << uint64_t(_244 * 4), (!gl_HelperInvocation) && (_242 != _244));
    ivec2 _335 = imageSize(_24) & ivec2(15);
    int _337 = textureQueryLevels(_13) - 1;
    float _339 = spvNClamp(gl_FragCoord.z, 0.0, float(_337));
    int _340 = int(_339);
    int _342 = int(_339 + 0.9970703125);
    vec2 _345 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _348 = -_335;
    vec2 _350 = _345 * ldexp(vec2(textureSize(_13, _340)), _348);
    vec2 _351 = ldexp(vec2(0.5), _348);
    ivec2 _355 = ivec2(max(_350 - _351, vec2(0.0)));
    bvec2 _357 = notEqual(_355, ivec2(_350 + _351));
    bool _358 = _357.x;
    bool _359 = _357.y;
    WriteFeedback(_24, _355, uint64_t(((1 | (_358 ? 2 : 0)) | (_359 ? 4 : 0)) | ((_358 && _359) ? 8 : 0)) << uint64_t(_340 * 4), !gl_HelperInvocation);
    ivec2 _376 = -_335;
    vec2 _378 = _345 * ldexp(vec2(textureSize(_13, _342)), _376);
    vec2 _379 = ldexp(vec2(0.5), _376);
    ivec2 _383 = ivec2(max(_378 - _379, vec2(0.0)));
    bvec2 _385 = notEqual(_383, ivec2(_378 + _379));
    bool _386 = _385.x;
    bool _387 = _385.y;
    WriteFeedback(_24, _383, uint64_t(((1 | (_386 ? 2 : 0)) | (_387 ? 4 : 0)) | ((_386 && _387) ? 8 : 0)) << uint64_t(_342 * 4), (!gl_HelperInvocation) && (_340 != _342));
    ivec2 _408 = imageSize(_24) & ivec2(15);
    int _410 = textureQueryLevels(_13) - 1;
    vec2 _411 = vec2(textureSize(_13, 0));
    vec2 _415 = _411 * vec2(GRADX.x, GRADX.y);
    vec2 _416 = _411 * vec2(GRADY.x, GRADY.y);
    float _423 = spvNClamp(log2(max(dot(_415, _415), dot(_416, _416))) * 0.5, 0.0, float(_410));
    int _424 = int(_423);
    int _426 = int(_423 + 0.9970703125);
    vec2 _429 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _432 = -_408;
    vec2 _434 = _429 * ldexp(vec2(textureSize(_13, _424)), _432);
    vec2 _435 = ldexp(vec2(0.5), _432);
    ivec2 _439 = ivec2(max(_434 - _435, vec2(0.0)));
    bvec2 _441 = notEqual(_439, ivec2(_434 + _435));
    bool _442 = _441.x;
    bool _443 = _441.y;
    WriteFeedback(_24, _439, uint64_t(((1 | (_442 ? 2 : 0)) | (_443 ? 4 : 0)) | ((_442 && _443) ? 8 : 0)) << uint64_t(_424 * 4), !gl_HelperInvocation);
    ivec2 _460 = -_408;
    vec2 _462 = _429 * ldexp(vec2(textureSize(_13, _426)), _460);
    vec2 _463 = ldexp(vec2(0.5), _460);
    ivec2 _467 = ivec2(max(_462 - _463, vec2(0.0)));
    bvec2 _469 = notEqual(_467, ivec2(_462 + _463));
    bool _470 = _469.x;
    bool _471 = _469.y;
    WriteFeedback(_24, _467, uint64_t(((1 | (_470 ? 2 : 0)) | (_471 ? 4 : 0)) | ((_470 && _471) ? 8 : 0)) << uint64_t(_426 * 4), (!gl_HelperInvocation) && (_424 != _426));
    ivec2 _492 = imageSize(_24) & ivec2(15);
    int _494 = textureQueryLevels(_13) - 1;
    vec2 _495 = vec2(textureSize(_13, 0));
    vec2 _499 = _495 * vec2(GRADX.x, GRADX.y);
    vec2 _500 = _495 * vec2(GRADY.x, GRADY.y);
    float _509 = min(max(spvNClamp(log2(max(dot(_499, _499), dot(_500, _500))) * 0.5, 0.0, float(_494)), CLAMP), 14.0);
    int _510 = int(_509);
    int _512 = int(_509 + 0.9970703125);
    vec2 _515 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _518 = -_492;
    vec2 _520 = _515 * ldexp(vec2(textureSize(_13, _510)), _518);
    vec2 _521 = ldexp(vec2(0.5), _518);
    ivec2 _525 = ivec2(max(_520 - _521, vec2(0.0)));
    bvec2 _527 = notEqual(_525, ivec2(_520 + _521));
    bool _528 = _527.x;
    bool _529 = _527.y;
    WriteFeedback(_24, _525, uint64_t(((1 | (_528 ? 2 : 0)) | (_529 ? 4 : 0)) | ((_528 && _529) ? 8 : 0)) << uint64_t(_510 * 4), !gl_HelperInvocation);
    ivec2 _546 = -_492;
    vec2 _548 = _515 * ldexp(vec2(textureSize(_13, _512)), _546);
    vec2 _549 = ldexp(vec2(0.5), _546);
    ivec2 _553 = ivec2(max(_548 - _549, vec2(0.0)));
    bvec2 _555 = notEqual(_553, ivec2(_548 + _549));
    bool _556 = _555.x;
    bool _557 = _555.y;
    WriteFeedback(_24, _553, uint64_t(((1 | (_556 ? 2 : 0)) | (_557 ? 4 : 0)) | ((_556 && _557) ? 8 : 0)) << uint64_t(_512 * 4), (!gl_HelperInvocation) && (_510 != _512));
    vec2 _576 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _578 = imageSize(_24) & ivec2(15);
    float _582 = exp2(gl_FragCoord.z);
    vec2 _585 = textureQueryLod(sampler2D(_13, _36), _576 * subgroupQuadBroadcast(_582, 0u));
    float _586 = _585.x;
    int _587 = int(_586);
    int _589 = int(_586 + 0.9970703125);
    vec2 _594 = abs(dFdx(_576));
    vec2 _595 = abs(dFdy(_576));
    vec2 _603 = vec2(max(_594.x, _595.x), max(_594.y, _595.y)) * _582;
    vec2 _604 = fract(_576);
    vec2 _605 = vec2(textureSize(_13, _587));
    ivec2 _607 = -_578;
    vec2 _609 = _604 * ldexp(_605, _607);
    ResType _612;
    _612._m0 = frexp((_603 * _605) - vec2(0.00390625), _612._m1);
    vec2 _617 = min(ldexp(vec2(0.5), clamp(_612._m1, ivec2(0), ivec2(4)) + _607), vec2(0.5));
    ivec2 _621 = ivec2(max(_609 - _617, vec2(0.0)));
    bvec2 _623 = notEqual(_621, ivec2(_609 + _617));
    bool _624 = _623.x;
    bool _625 = _623.y;
    WriteFeedback(_24, _621, uint64_t(((1 | (_624 ? 2 : 0)) | (_625 ? 4 : 0)) | ((_624 && _625) ? 8 : 0)) << uint64_t(_587 * 4), !gl_HelperInvocation);
    vec2 _640 = vec2(textureSize(_13, _589));
    ivec2 _642 = -_578;
    vec2 _644 = _604 * ldexp(_640, _642);
    ResType _647;
    _647._m0 = frexp((_603 * _640) - vec2(0.00390625), _647._m1);
    vec2 _652 = min(ldexp(vec2(0.5), clamp(_647._m1, ivec2(0), ivec2(4)) + _642), vec2(0.5));
    ivec2 _656 = ivec2(max(_644 - _652, vec2(0.0)));
    bvec2 _658 = notEqual(_656, ivec2(_644 + _652));
    bool _659 = _658.x;
    bool _660 = _658.y;
    WriteFeedback(_24, _656, uint64_t(((1 | (_659 ? 2 : 0)) | (_660 ? 4 : 0)) | ((_659 && _660) ? 8 : 0)) << uint64_t(_589 * 4), (!gl_HelperInvocation) && (_587 != _589));
    vec2 _679 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _681 = imageSize(_24) & ivec2(15);
    float _685 = exp2(gl_FragCoord.z);
    float _691 = min(max(textureQueryLod(sampler2D(_13, _36), _679 * subgroupQuadBroadcast(_685, 0u)).x, CLAMP), 14.0);
    int _692 = int(_691);
    int _694 = int(_691 + 0.9970703125);
    vec2 _699 = abs(dFdx(_679));
    vec2 _700 = abs(dFdy(_679));
    vec2 _708 = vec2(max(_699.x, _700.x), max(_699.y, _700.y)) * _685;
    vec2 _709 = fract(_679);
    vec2 _710 = vec2(textureSize(_13, _692));
    ivec2 _712 = -_681;
    vec2 _714 = _709 * ldexp(_710, _712);
    ResType _717;
    _717._m0 = frexp((_708 * _710) - vec2(0.00390625), _717._m1);
    vec2 _722 = min(ldexp(vec2(0.5), clamp(_717._m1, ivec2(0), ivec2(4)) + _712), vec2(0.5));
    ivec2 _726 = ivec2(max(_714 - _722, vec2(0.0)));
    bvec2 _728 = notEqual(_726, ivec2(_714 + _722));
    bool _729 = _728.x;
    bool _730 = _728.y;
    WriteFeedback(_24, _726, uint64_t(((1 | (_729 ? 2 : 0)) | (_730 ? 4 : 0)) | ((_729 && _730) ? 8 : 0)) << uint64_t(_692 * 4), !gl_HelperInvocation);
    vec2 _745 = vec2(textureSize(_13, _694));
    ivec2 _747 = -_681;
    vec2 _749 = _709 * ldexp(_745, _747);
    ResType _752;
    _752._m0 = frexp((_708 * _745) - vec2(0.00390625), _752._m1);
    vec2 _757 = min(ldexp(vec2(0.5), clamp(_752._m1, ivec2(0), ivec2(4)) + _747), vec2(0.5));
    ivec2 _761 = ivec2(max(_749 - _757, vec2(0.0)));
    bvec2 _763 = notEqual(_761, ivec2(_749 + _757));
    bool _764 = _763.x;
    bool _765 = _763.y;
    WriteFeedback(_24, _761, uint64_t(((1 | (_764 ? 2 : 0)) | (_765 ? 4 : 0)) | ((_764 && _765) ? 8 : 0)) << uint64_t(_694 * 4), (!gl_HelperInvocation) && (_692 != _694));
    int _785 = int(roundEven(gl_FragCoord.z));
    vec2 _786 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _790 = imageSize(_27).xy & ivec2(15);
    vec2 _795 = textureQueryLod(sampler2DArray(_16, _36), _786);
    float _796 = _795.x;
    int _797 = int(_796);
    int _799 = int(_796 + 0.9970703125);
    vec2 _804 = abs(dFdx(_786));
    vec2 _805 = abs(dFdy(_786));
    vec2 _812 = vec2(max(_804.x, _805.x), max(_804.y, _805.y));
    vec2 _813 = fract(_786);
    vec2 _814 = vec2(textureSize(_16, _797).xy);
    ivec2 _817 = -_790;
    vec2 _819 = _813 * ldexp(_814, _817);
    ResType _822;
    _822._m0 = frexp((_812 * _814) - vec2(0.00390625), _822._m1);
    vec2 _827 = min(ldexp(vec2(0.5), clamp(_822._m1, ivec2(0), ivec2(4)) + _817), vec2(0.5));
    ivec2 _831 = ivec2(max(_819 - _827, vec2(0.0)));
    bvec2 _833 = notEqual(_831, ivec2(_819 + _827));
    bool _834 = _833.x;
    bool _835 = _833.y;
    WriteFeedbackArray(_27, ivec3(_831, _785), uint64_t(((1 | (_834 ? 2 : 0)) | (_835 ? 4 : 0)) | ((_834 && _835) ? 8 : 0)) << uint64_t(_797 * 4), !gl_HelperInvocation);
    vec2 _879 = vec2(textureSize(_16, _799).xy);
    ivec2 _882 = -_790;
    vec2 _884 = _813 * ldexp(_879, _882);
    ResType _887;
    _887._m0 = frexp((_812 * _879) - vec2(0.00390625), _887._m1);
    vec2 _892 = min(ldexp(vec2(0.5), clamp(_887._m1, ivec2(0), ivec2(4)) + _882), vec2(0.5));
    ivec2 _896 = ivec2(max(_884 - _892, vec2(0.0)));
    bvec2 _898 = notEqual(_896, ivec2(_884 + _892));
    bool _899 = _898.x;
    bool _900 = _898.y;
    WriteFeedbackArray(_27, ivec3(_896, _785), uint64_t(((1 | (_899 ? 2 : 0)) | (_900 ? 4 : 0)) | ((_899 && _900) ? 8 : 0)) << uint64_t(_799 * 4), (!gl_HelperInvocation) && (_797 != _799));
    int _921 = int(roundEven(gl_FragCoord.z));
    vec2 _922 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _925 = imageSize(_27).xy & ivec2(15);
    float _932 = min(max(textureQueryLod(sampler2DArray(_16, _36), _922).x, CLAMP), 14.0);
    int _933 = int(_932);
    int _935 = int(_932 + 0.9970703125);
    vec2 _940 = abs(dFdx(_922));
    vec2 _941 = abs(dFdy(_922));
    vec2 _948 = vec2(max(_940.x, _941.x), max(_940.y, _941.y));
    vec2 _949 = fract(_922);
    vec2 _950 = vec2(textureSize(_16, _933).xy);
    ivec2 _953 = -_925;
    vec2 _955 = _949 * ldexp(_950, _953);
    ResType _958;
    _958._m0 = frexp((_948 * _950) - vec2(0.00390625), _958._m1);
    vec2 _963 = min(ldexp(vec2(0.5), clamp(_958._m1, ivec2(0), ivec2(4)) + _953), vec2(0.5));
    ivec2 _967 = ivec2(max(_955 - _963, vec2(0.0)));
    bvec2 _969 = notEqual(_967, ivec2(_955 + _963));
    bool _970 = _969.x;
    bool _971 = _969.y;
    WriteFeedbackArray(_27, ivec3(_967, _921), uint64_t(((1 | (_970 ? 2 : 0)) | (_971 ? 4 : 0)) | ((_970 && _971) ? 8 : 0)) << uint64_t(_933 * 4), !gl_HelperInvocation);
    vec2 _987 = vec2(textureSize(_16, _935).xy);
    ivec2 _990 = -_925;
    vec2 _992 = _949 * ldexp(_987, _990);
    ResType _995;
    _995._m0 = frexp((_948 * _987) - vec2(0.00390625), _995._m1);
    vec2 _1000 = min(ldexp(vec2(0.5), clamp(_995._m1, ivec2(0), ivec2(4)) + _990), vec2(0.5));
    ivec2 _1004 = ivec2(max(_992 - _1000, vec2(0.0)));
    bvec2 _1006 = notEqual(_1004, ivec2(_992 + _1000));
    bool _1007 = _1006.x;
    bool _1008 = _1006.y;
    WriteFeedbackArray(_27, ivec3(_1004, _921), uint64_t(((1 | (_1007 ? 2 : 0)) | (_1008 ? 4 : 0)) | ((_1007 && _1008) ? 8 : 0)) << uint64_t(_935 * 4), (!gl_HelperInvocation) && (_933 != _935));
    int _1029 = int(roundEven(gl_FragCoord.z));
    ivec2 _1033 = imageSize(_27).xy & ivec2(15);
    int _1035 = textureQueryLevels(_16) - 1;
    float _1037 = spvNClamp(_74, 0.0, float(_1035));
    int _1038 = int(_1037);
    int _1040 = int(_1037 + 0.9970703125);
    vec2 _1043 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1047 = -_1033;
    vec2 _1049 = _1043 * ldexp(vec2(textureSize(_16, _1038).xy), _1047);
    vec2 _1050 = ldexp(vec2(0.5), _1047);
    ivec2 _1054 = ivec2(max(_1049 - _1050, vec2(0.0)));
    bvec2 _1056 = notEqual(_1054, ivec2(_1049 + _1050));
    bool _1057 = _1056.x;
    bool _1058 = _1056.y;
    WriteFeedbackArray(_27, ivec3(_1054, _1029), uint64_t(((1 | (_1057 ? 2 : 0)) | (_1058 ? 4 : 0)) | ((_1057 && _1058) ? 8 : 0)) << uint64_t(_1038 * 4), !gl_HelperInvocation);
    ivec2 _1077 = -_1033;
    vec2 _1079 = _1043 * ldexp(vec2(textureSize(_16, _1040).xy), _1077);
    vec2 _1080 = ldexp(vec2(0.5), _1077);
    ivec2 _1084 = ivec2(max(_1079 - _1080, vec2(0.0)));
    bvec2 _1086 = notEqual(_1084, ivec2(_1079 + _1080));
    bool _1087 = _1086.x;
    bool _1088 = _1086.y;
    WriteFeedbackArray(_27, ivec3(_1084, _1029), uint64_t(((1 | (_1087 ? 2 : 0)) | (_1088 ? 4 : 0)) | ((_1087 && _1088) ? 8 : 0)) << uint64_t(_1040 * 4), (!gl_HelperInvocation) && (_1038 != _1040));
    int _1109 = int(roundEven(gl_FragCoord.z));
    ivec2 _1113 = imageSize(_27).xy & ivec2(15);
    int _1115 = textureQueryLevels(_16) - 1;
    vec2 _1116 = vec2(textureSize(_16, 0).xy);
    vec2 _1121 = _1116 * vec2(GRADX.x, GRADX.y);
    vec2 _1122 = _1116 * vec2(GRADY.x, GRADY.y);
    float _1129 = spvNClamp(log2(max(dot(_1121, _1121), dot(_1122, _1122))) * 0.5, 0.0, float(_1115));
    int _1130 = int(_1129);
    int _1132 = int(_1129 + 0.9970703125);
    vec2 _1135 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1139 = -_1113;
    vec2 _1141 = _1135 * ldexp(vec2(textureSize(_16, _1130).xy), _1139);
    vec2 _1142 = ldexp(vec2(0.5), _1139);
    ivec2 _1146 = ivec2(max(_1141 - _1142, vec2(0.0)));
    bvec2 _1148 = notEqual(_1146, ivec2(_1141 + _1142));
    bool _1149 = _1148.x;
    bool _1150 = _1148.y;
    WriteFeedbackArray(_27, ivec3(_1146, _1109), uint64_t(((1 | (_1149 ? 2 : 0)) | (_1150 ? 4 : 0)) | ((_1149 && _1150) ? 8 : 0)) << uint64_t(_1130 * 4), !gl_HelperInvocation);
    ivec2 _1169 = -_1113;
    vec2 _1171 = _1135 * ldexp(vec2(textureSize(_16, _1132).xy), _1169);
    vec2 _1172 = ldexp(vec2(0.5), _1169);
    ivec2 _1176 = ivec2(max(_1171 - _1172, vec2(0.0)));
    bvec2 _1178 = notEqual(_1176, ivec2(_1171 + _1172));
    bool _1179 = _1178.x;
    bool _1180 = _1178.y;
    WriteFeedbackArray(_27, ivec3(_1176, _1109), uint64_t(((1 | (_1179 ? 2 : 0)) | (_1180 ? 4 : 0)) | ((_1179 && _1180) ? 8 : 0)) << uint64_t(_1132 * 4), (!gl_HelperInvocation) && (_1130 != _1132));
    int _1201 = int(roundEven(gl_FragCoord.z));
    ivec2 _1205 = imageSize(_27).xy & ivec2(15);
    int _1207 = textureQueryLevels(_16) - 1;
    vec2 _1208 = vec2(textureSize(_16, 0).xy);
    vec2 _1213 = _1208 * vec2(GRADX.x, GRADX.y);
    vec2 _1214 = _1208 * vec2(GRADY.x, GRADY.y);
    float _1223 = min(max(spvNClamp(log2(max(dot(_1213, _1213), dot(_1214, _1214))) * 0.5, 0.0, float(_1207)), CLAMP), 14.0);
    int _1224 = int(_1223);
    int _1226 = int(_1223 + 0.9970703125);
    vec2 _1229 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1233 = -_1205;
    vec2 _1235 = _1229 * ldexp(vec2(textureSize(_16, _1224).xy), _1233);
    vec2 _1236 = ldexp(vec2(0.5), _1233);
    ivec2 _1240 = ivec2(max(_1235 - _1236, vec2(0.0)));
    bvec2 _1242 = notEqual(_1240, ivec2(_1235 + _1236));
    bool _1243 = _1242.x;
    bool _1244 = _1242.y;
    WriteFeedbackArray(_27, ivec3(_1240, _1201), uint64_t(((1 | (_1243 ? 2 : 0)) | (_1244 ? 4 : 0)) | ((_1243 && _1244) ? 8 : 0)) << uint64_t(_1224 * 4), !gl_HelperInvocation);
    ivec2 _1263 = -_1205;
    vec2 _1265 = _1229 * ldexp(vec2(textureSize(_16, _1226).xy), _1263);
    vec2 _1266 = ldexp(vec2(0.5), _1263);
    ivec2 _1270 = ivec2(max(_1265 - _1266, vec2(0.0)));
    bvec2 _1272 = notEqual(_1270, ivec2(_1265 + _1266));
    bool _1273 = _1272.x;
    bool _1274 = _1272.y;
    WriteFeedbackArray(_27, ivec3(_1270, _1201), uint64_t(((1 | (_1273 ? 2 : 0)) | (_1274 ? 4 : 0)) | ((_1273 && _1274) ? 8 : 0)) << uint64_t(_1226 * 4), (!gl_HelperInvocation) && (_1224 != _1226));
    int _1295 = int(roundEven(gl_FragCoord.z));
    vec2 _1296 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1299 = imageSize(_27).xy & ivec2(15);
    float _1303 = exp2(gl_FragCoord.z);
    vec2 _1306 = textureQueryLod(sampler2DArray(_16, _36), _1296 * subgroupQuadBroadcast(_1303, 0u));
    float _1307 = _1306.x;
    int _1308 = int(_1307);
    int _1310 = int(_1307 + 0.9970703125);
    vec2 _1315 = abs(dFdx(_1296));
    vec2 _1316 = abs(dFdy(_1296));
    vec2 _1324 = vec2(max(_1315.x, _1316.x), max(_1315.y, _1316.y)) * _1303;
    vec2 _1325 = fract(_1296);
    vec2 _1326 = vec2(textureSize(_16, _1308).xy);
    ivec2 _1329 = -_1299;
    vec2 _1331 = _1325 * ldexp(_1326, _1329);
    ResType _1334;
    _1334._m0 = frexp((_1324 * _1326) - vec2(0.00390625), _1334._m1);
    vec2 _1339 = min(ldexp(vec2(0.5), clamp(_1334._m1, ivec2(0), ivec2(4)) + _1329), vec2(0.5));
    ivec2 _1343 = ivec2(max(_1331 - _1339, vec2(0.0)));
    bvec2 _1345 = notEqual(_1343, ivec2(_1331 + _1339));
    bool _1346 = _1345.x;
    bool _1347 = _1345.y;
    WriteFeedbackArray(_27, ivec3(_1343, _1295), uint64_t(((1 | (_1346 ? 2 : 0)) | (_1347 ? 4 : 0)) | ((_1346 && _1347) ? 8 : 0)) << uint64_t(_1308 * 4), !gl_HelperInvocation);
    vec2 _1363 = vec2(textureSize(_16, _1310).xy);
    ivec2 _1366 = -_1299;
    vec2 _1368 = _1325 * ldexp(_1363, _1366);
    ResType _1371;
    _1371._m0 = frexp((_1324 * _1363) - vec2(0.00390625), _1371._m1);
    vec2 _1376 = min(ldexp(vec2(0.5), clamp(_1371._m1, ivec2(0), ivec2(4)) + _1366), vec2(0.5));
    ivec2 _1380 = ivec2(max(_1368 - _1376, vec2(0.0)));
    bvec2 _1382 = notEqual(_1380, ivec2(_1368 + _1376));
    bool _1383 = _1382.x;
    bool _1384 = _1382.y;
    WriteFeedbackArray(_27, ivec3(_1380, _1295), uint64_t(((1 | (_1383 ? 2 : 0)) | (_1384 ? 4 : 0)) | ((_1383 && _1384) ? 8 : 0)) << uint64_t(_1310 * 4), (!gl_HelperInvocation) && (_1308 != _1310));
    int _1405 = int(roundEven(gl_FragCoord.z));
    vec2 _1406 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1409 = imageSize(_27).xy & ivec2(15);
    float _1413 = exp2(_74);
    float _1419 = min(max(textureQueryLod(sampler2DArray(_16, _36), _1406 * subgroupQuadBroadcast(_1413, 0u)).x, CLAMP), 14.0);
    int _1420 = int(_1419);
    int _1422 = int(_1419 + 0.9970703125);
    vec2 _1427 = abs(dFdx(_1406));
    vec2 _1428 = abs(dFdy(_1406));
    vec2 _1436 = vec2(max(_1427.x, _1428.x), max(_1427.y, _1428.y)) * _1413;
    vec2 _1437 = fract(_1406);
    vec2 _1438 = vec2(textureSize(_16, _1420).xy);
    ivec2 _1441 = -_1409;
    vec2 _1443 = _1437 * ldexp(_1438, _1441);
    ResType _1446;
    _1446._m0 = frexp((_1436 * _1438) - vec2(0.00390625), _1446._m1);
    vec2 _1451 = min(ldexp(vec2(0.5), clamp(_1446._m1, ivec2(0), ivec2(4)) + _1441), vec2(0.5));
    ivec2 _1455 = ivec2(max(_1443 - _1451, vec2(0.0)));
    bvec2 _1457 = notEqual(_1455, ivec2(_1443 + _1451));
    bool _1458 = _1457.x;
    bool _1459 = _1457.y;
    WriteFeedbackArray(_27, ivec3(_1455, _1405), uint64_t(((1 | (_1458 ? 2 : 0)) | (_1459 ? 4 : 0)) | ((_1458 && _1459) ? 8 : 0)) << uint64_t(_1420 * 4), !gl_HelperInvocation);
    vec2 _1475 = vec2(textureSize(_16, _1422).xy);
    ivec2 _1478 = -_1409;
    vec2 _1480 = _1437 * ldexp(_1475, _1478);
    ResType _1483;
    _1483._m0 = frexp((_1436 * _1475) - vec2(0.00390625), _1483._m1);
    vec2 _1488 = min(ldexp(vec2(0.5), clamp(_1483._m1, ivec2(0), ivec2(4)) + _1478), vec2(0.5));
    ivec2 _1492 = ivec2(max(_1480 - _1488, vec2(0.0)));
    bvec2 _1494 = notEqual(_1492, ivec2(_1480 + _1488));
    bool _1495 = _1494.x;
    bool _1496 = _1494.y;
    WriteFeedbackArray(_27, ivec3(_1492, _1405), uint64_t(((1 | (_1495 ? 2 : 0)) | (_1496 ? 4 : 0)) | ((_1495 && _1496) ? 8 : 0)) << uint64_t(_1422 * 4), (!gl_HelperInvocation) && (_1420 != _1422));
    uint _1513 = IDX + 0u;
    uint _1516 = IDX + 0u;
    uint _1519 = IDX + 0u;
    vec2 _1522 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1524 = imageSize(_30[nonuniformEXT(_1513)]) & ivec2(15);
    vec2 _1528 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1516], _39[_1519])), _1522);
    float _1529 = _1528.x;
    int _1530 = int(_1529);
    int _1532 = int(_1529 + 0.9970703125);
    vec2 _1537 = abs(dFdx(_1522));
    vec2 _1538 = abs(dFdy(_1522));
    vec2 _1545 = vec2(max(_1537.x, _1538.x), max(_1537.y, _1538.y));
    vec2 _1546 = fract(_1522);
    vec2 _1547 = vec2(textureSize(_19[nonuniformEXT(_1516)], _1530));
    ivec2 _1549 = -_1524;
    vec2 _1551 = _1546 * ldexp(_1547, _1549);
    ResType _1554;
    _1554._m0 = frexp((_1545 * _1547) - vec2(0.00390625), _1554._m1);
    vec2 _1559 = min(ldexp(vec2(0.5), clamp(_1554._m1, ivec2(0), ivec2(4)) + _1549), vec2(0.5));
    ivec2 _1563 = ivec2(max(_1551 - _1559, vec2(0.0)));
    bvec2 _1565 = notEqual(_1563, ivec2(_1551 + _1559));
    bool _1566 = _1565.x;
    bool _1567 = _1565.y;
    WriteFeedbackNonUniform(_30[_1513], _1563, uint64_t(((1 | (_1566 ? 2 : 0)) | (_1567 ? 4 : 0)) | ((_1566 && _1567) ? 8 : 0)) << uint64_t(_1530 * 4), !gl_HelperInvocation);
    vec2 _1608 = vec2(textureSize(_19[nonuniformEXT(_1516)], _1532));
    ivec2 _1610 = -_1524;
    vec2 _1612 = _1546 * ldexp(_1608, _1610);
    ResType _1615;
    _1615._m0 = frexp((_1545 * _1608) - vec2(0.00390625), _1615._m1);
    vec2 _1620 = min(ldexp(vec2(0.5), clamp(_1615._m1, ivec2(0), ivec2(4)) + _1610), vec2(0.5));
    ivec2 _1624 = ivec2(max(_1612 - _1620, vec2(0.0)));
    bvec2 _1626 = notEqual(_1624, ivec2(_1612 + _1620));
    bool _1627 = _1626.x;
    bool _1628 = _1626.y;
    WriteFeedbackNonUniform(_30[_1513], _1624, uint64_t(((1 | (_1627 ? 2 : 0)) | (_1628 ? 4 : 0)) | ((_1627 && _1628) ? 8 : 0)) << uint64_t(_1532 * 4), (!gl_HelperInvocation) && (_1530 != _1532));
    uint _1644 = IDX + 0u;
    uint _1647 = IDX + 0u;
    int _1653 = int(roundEven(gl_FragCoord.z));
    vec2 _1654 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1657 = imageSize(_33[nonuniformEXT(_1644)]).xy & ivec2(15);
    vec2 _1661 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1647], _39[_1519])), _1654);
    float _1662 = _1661.x;
    int _1663 = int(_1662);
    int _1665 = int(_1662 + 0.9970703125);
    vec2 _1670 = abs(dFdx(_1654));
    vec2 _1671 = abs(dFdy(_1654));
    vec2 _1678 = vec2(max(_1670.x, _1671.x), max(_1670.y, _1671.y));
    vec2 _1679 = fract(_1654);
    vec2 _1680 = vec2(textureSize(_22[nonuniformEXT(_1647)], _1663).xy);
    ivec2 _1683 = -_1657;
    vec2 _1685 = _1679 * ldexp(_1680, _1683);
    ResType _1688;
    _1688._m0 = frexp((_1678 * _1680) - vec2(0.00390625), _1688._m1);
    vec2 _1693 = min(ldexp(vec2(0.5), clamp(_1688._m1, ivec2(0), ivec2(4)) + _1683), vec2(0.5));
    ivec2 _1697 = ivec2(max(_1685 - _1693, vec2(0.0)));
    bvec2 _1699 = notEqual(_1697, ivec2(_1685 + _1693));
    bool _1700 = _1699.x;
    bool _1701 = _1699.y;
    WriteFeedbackArrayNonUniform(_33[_1644], ivec3(_1697, _1653), uint64_t(((1 | (_1700 ? 2 : 0)) | (_1701 ? 4 : 0)) | ((_1700 && _1701) ? 8 : 0)) << uint64_t(_1663 * 4), !gl_HelperInvocation);
    vec2 _1743 = vec2(textureSize(_22[nonuniformEXT(_1647)], _1665).xy);
    ivec2 _1746 = -_1657;
    vec2 _1748 = _1679 * ldexp(_1743, _1746);
    ResType _1751;
    _1751._m0 = frexp((_1678 * _1743) - vec2(0.00390625), _1751._m1);
    vec2 _1756 = min(ldexp(vec2(0.5), clamp(_1751._m1, ivec2(0), ivec2(4)) + _1746), vec2(0.5));
    ivec2 _1760 = ivec2(max(_1748 - _1756, vec2(0.0)));
    bvec2 _1762 = notEqual(_1760, ivec2(_1748 + _1756));
    bool _1763 = _1762.x;
    bool _1764 = _1762.y;
    WriteFeedbackArrayNonUniform(_33[_1644], ivec3(_1760, _1653), uint64_t(((1 | (_1763 ? 2 : 0)) | (_1764 ? 4 : 0)) | ((_1763 && _1764) ? 8 : 0)) << uint64_t(_1665 * 4), (!gl_HelperInvocation) && (_1663 != _1665));
    vec2 _1787 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1789 = imageSize(_30[nonuniformEXT(_1513)]) & ivec2(15);
    vec2 _1793 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1516], _39[_1519])), _1787);
    float _1794 = _1793.x;
    int _1795 = int(_1794);
    int _1797 = int(_1794 + 0.9970703125);
    vec2 _1802 = abs(dFdx(_1787));
    vec2 _1803 = abs(dFdy(_1787));
    vec2 _1810 = vec2(max(_1802.x, _1803.x), max(_1802.y, _1803.y));
    vec2 _1811 = fract(_1787);
    vec2 _1812 = vec2(textureSize(_19[nonuniformEXT(_1516)], _1795));
    ivec2 _1814 = -_1789;
    vec2 _1816 = _1811 * ldexp(_1812, _1814);
    ResType _1819;
    _1819._m0 = frexp((_1810 * _1812) - vec2(0.00390625), _1819._m1);
    vec2 _1824 = min(ldexp(vec2(0.5), clamp(_1819._m1, ivec2(0), ivec2(4)) + _1814), vec2(0.5));
    ivec2 _1828 = ivec2(max(_1816 - _1824, vec2(0.0)));
    bvec2 _1830 = notEqual(_1828, ivec2(_1816 + _1824));
    bool _1831 = _1830.x;
    bool _1832 = _1830.y;
    WriteFeedbackNonUniform(_30[_1513], _1828, uint64_t(((1 | (_1831 ? 2 : 0)) | (_1832 ? 4 : 0)) | ((_1831 && _1832) ? 8 : 0)) << uint64_t(_1795 * 4), !gl_HelperInvocation);
    vec2 _1847 = vec2(textureSize(_19[nonuniformEXT(_1516)], _1797));
    ivec2 _1849 = -_1789;
    vec2 _1851 = _1811 * ldexp(_1847, _1849);
    ResType _1854;
    _1854._m0 = frexp((_1810 * _1847) - vec2(0.00390625), _1854._m1);
    vec2 _1859 = min(ldexp(vec2(0.5), clamp(_1854._m1, ivec2(0), ivec2(4)) + _1849), vec2(0.5));
    ivec2 _1863 = ivec2(max(_1851 - _1859, vec2(0.0)));
    bvec2 _1865 = notEqual(_1863, ivec2(_1851 + _1859));
    bool _1866 = _1865.x;
    bool _1867 = _1865.y;
    WriteFeedbackNonUniform(_30[_1513], _1863, uint64_t(((1 | (_1866 ? 2 : 0)) | (_1867 ? 4 : 0)) | ((_1866 && _1867) ? 8 : 0)) << uint64_t(_1797 * 4), (!gl_HelperInvocation) && (_1795 != _1797));
    int _1890 = int(roundEven(gl_FragCoord.z));
    vec2 _1891 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1894 = imageSize(_33[nonuniformEXT(_1644)]).xy & ivec2(15);
    vec2 _1898 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1647], _39[_1519])), _1891);
    float _1899 = _1898.x;
    int _1900 = int(_1899);
    int _1902 = int(_1899 + 0.9970703125);
    vec2 _1907 = abs(dFdx(_1891));
    vec2 _1908 = abs(dFdy(_1891));
    vec2 _1915 = vec2(max(_1907.x, _1908.x), max(_1907.y, _1908.y));
    vec2 _1916 = fract(_1891);
    vec2 _1917 = vec2(textureSize(_22[nonuniformEXT(_1647)], _1900).xy);
    ivec2 _1920 = -_1894;
    vec2 _1922 = _1916 * ldexp(_1917, _1920);
    ResType _1925;
    _1925._m0 = frexp((_1915 * _1917) - vec2(0.00390625), _1925._m1);
    vec2 _1930 = min(ldexp(vec2(0.5), clamp(_1925._m1, ivec2(0), ivec2(4)) + _1920), vec2(0.5));
    ivec2 _1934 = ivec2(max(_1922 - _1930, vec2(0.0)));
    bvec2 _1936 = notEqual(_1934, ivec2(_1922 + _1930));
    bool _1937 = _1936.x;
    bool _1938 = _1936.y;
    WriteFeedbackArrayNonUniform(_33[_1644], ivec3(_1934, _1890), uint64_t(((1 | (_1937 ? 2 : 0)) | (_1938 ? 4 : 0)) | ((_1937 && _1938) ? 8 : 0)) << uint64_t(_1900 * 4), !gl_HelperInvocation);
    vec2 _1954 = vec2(textureSize(_22[nonuniformEXT(_1647)], _1902).xy);
    ivec2 _1957 = -_1894;
    vec2 _1959 = _1916 * ldexp(_1954, _1957);
    ResType _1962;
    _1962._m0 = frexp((_1915 * _1954) - vec2(0.00390625), _1962._m1);
    vec2 _1967 = min(ldexp(vec2(0.5), clamp(_1962._m1, ivec2(0), ivec2(4)) + _1957), vec2(0.5));
    ivec2 _1971 = ivec2(max(_1959 - _1967, vec2(0.0)));
    bvec2 _1973 = notEqual(_1971, ivec2(_1959 + _1967));
    bool _1974 = _1973.x;
    bool _1975 = _1973.y;
    WriteFeedbackArrayNonUniform(_33[_1644], ivec3(_1971, _1890), uint64_t(((1 | (_1974 ? 2 : 0)) | (_1975 ? 4 : 0)) | ((_1974 && _1975) ? 8 : 0)) << uint64_t(_1902 * 4), (!gl_HelperInvocation) && (_1900 != _1902));
    vec2 _1996 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1998 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _2002 = textureQueryLod(sampler2D(_13, _36), _1996);
    float _2003 = _2002.x;
    int _2004 = int(_2003);
    int _2006 = int(_2003 + 0.9970703125);
    vec2 _2011 = abs(dFdx(_1996));
    vec2 _2012 = abs(dFdy(_1996));
    vec2 _2019 = vec2(max(_2011.x, _2012.x), max(_2011.y, _2012.y));
    vec2 _2020 = fract(_1996);
    vec2 _2021 = vec2(textureSize(_13, _2004));
    ivec2 _2023 = -_1998;
    vec2 _2025 = _2020 * ldexp(_2021, _2023);
    ResType _2028;
    _2028._m0 = frexp((_2019 * _2021) - vec2(0.00390625), _2028._m1);
    vec2 _2033 = min(ldexp(vec2(0.5), clamp(_2028._m1, ivec2(0), ivec2(4)) + _2023), vec2(0.5));
    ivec2 _2037 = ivec2(max(_2025 - _2033, vec2(0.0)));
    bvec2 _2039 = notEqual(_2037, ivec2(_2025 + _2033));
    bool _2040 = _2039.x;
    bool _2041 = _2039.y;
    WriteFeedbackNonUniform(_9[IDX], _2037, uint64_t(((1 | (_2040 ? 2 : 0)) | (_2041 ? 4 : 0)) | ((_2040 && _2041) ? 8 : 0)) << uint64_t(_2004 * 4), !gl_HelperInvocation);
    vec2 _2056 = vec2(textureSize(_13, _2006));
    ivec2 _2058 = -_1998;
    vec2 _2060 = _2020 * ldexp(_2056, _2058);
    ResType _2063;
    _2063._m0 = frexp((_2019 * _2056) - vec2(0.00390625), _2063._m1);
    vec2 _2068 = min(ldexp(vec2(0.5), clamp(_2063._m1, ivec2(0), ivec2(4)) + _2058), vec2(0.5));
    ivec2 _2072 = ivec2(max(_2060 - _2068, vec2(0.0)));
    bvec2 _2074 = notEqual(_2072, ivec2(_2060 + _2068));
    bool _2075 = _2074.x;
    bool _2076 = _2074.y;
    WriteFeedbackNonUniform(_9[IDX], _2072, uint64_t(((1 | (_2075 ? 2 : 0)) | (_2076 ? 4 : 0)) | ((_2075 && _2076) ? 8 : 0)) << uint64_t(_2006 * 4), (!gl_HelperInvocation) && (_2004 != _2006));
    vec2 _2094 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _2096 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _2100 = textureQueryLod(sampler2D(_13, _36), _2094);
    float _2101 = _2100.x;
    int _2102 = int(_2101);
    int _2104 = int(_2101 + 0.9970703125);
    vec2 _2109 = abs(dFdx(_2094));
    vec2 _2110 = abs(dFdy(_2094));
    vec2 _2117 = vec2(max(_2109.x, _2110.x), max(_2109.y, _2110.y));
    vec2 _2118 = fract(_2094);
    vec2 _2119 = vec2(textureSize(_13, _2102));
    ivec2 _2121 = -_2096;
    vec2 _2123 = _2118 * ldexp(_2119, _2121);
    ResType _2126;
    _2126._m0 = frexp((_2117 * _2119) - vec2(0.00390625), _2126._m1);
    vec2 _2131 = min(ldexp(vec2(0.5), clamp(_2126._m1, ivec2(0), ivec2(4)) + _2121), vec2(0.5));
    ivec2 _2135 = ivec2(max(_2123 - _2131, vec2(0.0)));
    bvec2 _2137 = notEqual(_2135, ivec2(_2123 + _2131));
    bool _2138 = _2137.x;
    bool _2139 = _2137.y;
    WriteFeedbackNonUniform(_9[IDX], _2135, uint64_t(((1 | (_2138 ? 2 : 0)) | (_2139 ? 4 : 0)) | ((_2138 && _2139) ? 8 : 0)) << uint64_t(_2102 * 4), !gl_HelperInvocation);
    vec2 _2154 = vec2(textureSize(_13, _2104));
    ivec2 _2156 = -_2096;
    vec2 _2158 = _2118 * ldexp(_2154, _2156);
    ResType _2161;
    _2161._m0 = frexp((_2117 * _2154) - vec2(0.00390625), _2161._m1);
    vec2 _2166 = min(ldexp(vec2(0.5), clamp(_2161._m1, ivec2(0), ivec2(4)) + _2156), vec2(0.5));
    ivec2 _2170 = ivec2(max(_2158 - _2166, vec2(0.0)));
    bvec2 _2172 = notEqual(_2170, ivec2(_2158 + _2166));
    bool _2173 = _2172.x;
    bool _2174 = _2172.y;
    WriteFeedbackNonUniform(_9[IDX], _2170, uint64_t(((1 | (_2173 ? 2 : 0)) | (_2174 ? 4 : 0)) | ((_2173 && _2174) ? 8 : 0)) << uint64_t(_2104 * 4), (!gl_HelperInvocation) && (_2102 != _2104));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 2194
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
%79 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %42 %45 %46 %48 %51 %2192
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
OpName %856 "WriteFeedbackArray"
OpName %852 "img"
OpName %853 "coord"
OpName %854 "value"
OpName %855 "active_lane"
OpName %867 "is_done"
OpName %1585 "WriteFeedbackNonUniform"
OpName %1581 "img"
OpName %1582 "coord"
OpName %1583 "value"
OpName %1584 "active_lane"
OpName %1596 "is_done"
OpName %1720 "WriteFeedbackArrayNonUniform"
OpName %1716 "img"
OpName %1717 "coord"
OpName %1718 "value"
OpName %1719 "active_lane"
OpName %1731 "is_done"
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
OpDecorate %1513 NonUniform
OpDecorate %1515 NonUniform
OpDecorate %1516 NonUniform
OpDecorate %1518 NonUniform
OpDecorate %1519 NonUniform
OpDecorate %1521 NonUniform
OpDecorate %1527 NonUniform
OpDecorate %1604 NonUniform
OpDecorate %1644 NonUniform
OpDecorate %1646 NonUniform
OpDecorate %1647 NonUniform
OpDecorate %1649 NonUniform
OpDecorate %1651 NonUniform
OpDecorate %1660 NonUniform
OpDecorate %1739 NonUniform
OpDecorate %1782 NonUniform
OpDecorate %1784 NonUniform
OpDecorate %1786 NonUniform
OpDecorate %1792 NonUniform
OpDecorate %1884 NonUniform
OpDecorate %1886 NonUniform
OpDecorate %1888 NonUniform
OpDecorate %1897 NonUniform
OpDecorate %52 NonUniform
OpDecorate %1993 NonUniform
OpDecorate %2192 BuiltIn HelperInvocation
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
%241 = OpConstant %10 14
%787 = OpTypeVector %81 3
%793 = OpTypeSampledImage %14
%850 = OpTypeVector %80 3
%851 = OpTypeFunction %1 %26 %787 %5 %80
%2191 = OpTypePointer Input %80
%2192 = OpVariable %2191 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %2190
%2190 = OpLabel
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
%159 = OpLoad %80 %2192
%160 = OpLogicalNot %80 %159
%191 = OpFunctionCall %1 %167 %24 %141 %158 %160
%193 = OpImageQuerySizeLod %83 %77 %99
%192 = OpConvertSToF %43 %193
%194 = OpSNegate %83 %86
%195 = OpExtInst %43 %79 Ldexp %192 %194
%196 = OpFMul %43 %113 %195
%197 = OpFMul %43 %112 %192
%198 = OpFSub %43 %197 %122
%199 = OpExtInst %123 %79 FrexpStruct %198
%200 = OpCompositeExtract %83 %199 1
%201 = OpExtInst %83 %79 SClamp %200 %128 %130
%202 = OpIAdd %83 %201 %194
%203 = OpExtInst %43 %79 Ldexp %134 %202
%204 = OpExtInst %43 %79 FMin %203 %134
%205 = OpFSub %43 %196 %204
%206 = OpExtInst %43 %79 FMax %205 %139
%207 = OpFAdd %43 %196 %204
%208 = OpConvertFToS %83 %206
%209 = OpConvertFToS %83 %207
%210 = OpINotEqual %82 %208 %209
%211 = OpCompositeExtract %80 %210 0
%212 = OpCompositeExtract %80 %210 1
%213 = OpLogicalAnd %80 %211 %212
%214 = OpSelect %81 %211 %148 %127
%215 = OpBitwiseOr %81 %91 %214
%216 = OpSelect %81 %212 %129 %127
%217 = OpBitwiseOr %81 %215 %216
%218 = OpSelect %81 %213 %153 %127
%219 = OpBitwiseOr %81 %217 %218
%220 = OpSConvert %5 %219
%221 = OpIMul %81 %99 %129
%222 = OpSConvert %5 %221
%223 = OpShiftLeftLogical %5 %220 %222
%224 = OpLoad %80 %2192
%225 = OpLogicalNot %80 %224
%226 = OpLogicalAnd %80 %225 %101
%227 = OpFunctionCall %1 %167 %24 %208 %223 %226
%228 = OpLoad %6 %24
%229 = OpLoad %11 %13
%230 = OpLoad %34 %36
%231 = OpCompositeConstruct %43 %65 %67
%232 = OpImageQuerySize %83 %228
%233 = OpBitwiseAnd %83 %232 %88
%234 = OpImageQueryLevels %81 %229
%235 = OpISub %81 %234 %91
%236 = OpSampledImage %92 %229 %230
%237 = OpImageQueryLod %43 %236 %231
%238 = OpCompositeExtract %10 %237 0
%239 = OpExtInst %10 %79 FMax %238 %53
%240 = OpExtInst %10 %79 FMin %239 %241
%242 = OpConvertFToS %81 %240
%243 = OpFAdd %10 %240 %98
%244 = OpConvertFToS %81 %243
%245 = OpExtInst %81 %79 SMin %244 %235
%246 = OpINotEqual %80 %242 %244
%247 = OpDPdx %43 %231
%248 = OpDPdy %43 %231
%249 = OpExtInst %43 %79 FAbs %247
%250 = OpExtInst %43 %79 FAbs %248
%251 = OpCompositeExtract %10 %249 0
%252 = OpCompositeExtract %10 %250 0
%253 = OpCompositeExtract %10 %249 1
%254 = OpCompositeExtract %10 %250 1
%255 = OpExtInst %10 %79 FMax %251 %252
%256 = OpExtInst %10 %79 FMax %253 %254
%257 = OpCompositeConstruct %43 %255 %256
%258 = OpExtInst %43 %79 Fract %231
%260 = OpImageQuerySizeLod %83 %229 %242
%259 = OpConvertSToF %43 %260
%261 = OpSNegate %83 %233
%262 = OpExtInst %43 %79 Ldexp %259 %261
%263 = OpFMul %43 %258 %262
%264 = OpFMul %43 %257 %259
%265 = OpFSub %43 %264 %122
%266 = OpExtInst %123 %79 FrexpStruct %265
%267 = OpCompositeExtract %83 %266 1
%268 = OpExtInst %83 %79 SClamp %267 %128 %130
%269 = OpIAdd %83 %268 %261
%270 = OpExtInst %43 %79 Ldexp %134 %269
%271 = OpExtInst %43 %79 FMin %270 %134
%272 = OpFSub %43 %263 %271
%273 = OpExtInst %43 %79 FMax %272 %139
%274 = OpFAdd %43 %263 %271
%275 = OpConvertFToS %83 %273
%276 = OpConvertFToS %83 %274
%277 = OpINotEqual %82 %275 %276
%278 = OpCompositeExtract %80 %277 0
%279 = OpCompositeExtract %80 %277 1
%280 = OpLogicalAnd %80 %278 %279
%281 = OpSelect %81 %278 %148 %127
%282 = OpBitwiseOr %81 %91 %281
%283 = OpSelect %81 %279 %129 %127
%284 = OpBitwiseOr %81 %282 %283
%285 = OpSelect %81 %280 %153 %127
%286 = OpBitwiseOr %81 %284 %285
%287 = OpSConvert %5 %286
%288 = OpIMul %81 %242 %129
%289 = OpSConvert %5 %288
%290 = OpShiftLeftLogical %5 %287 %289
%291 = OpLoad %80 %2192
%292 = OpLogicalNot %80 %291
%293 = OpFunctionCall %1 %167 %24 %275 %290 %292
%295 = OpImageQuerySizeLod %83 %229 %244
%294 = OpConvertSToF %43 %295
%296 = OpSNegate %83 %233
%297 = OpExtInst %43 %79 Ldexp %294 %296
%298 = OpFMul %43 %258 %297
%299 = OpFMul %43 %257 %294
%300 = OpFSub %43 %299 %122
%301 = OpExtInst %123 %79 FrexpStruct %300
%302 = OpCompositeExtract %83 %301 1
%303 = OpExtInst %83 %79 SClamp %302 %128 %130
%304 = OpIAdd %83 %303 %296
%305 = OpExtInst %43 %79 Ldexp %134 %304
%306 = OpExtInst %43 %79 FMin %305 %134
%307 = OpFSub %43 %298 %306
%308 = OpExtInst %43 %79 FMax %307 %139
%309 = OpFAdd %43 %298 %306
%310 = OpConvertFToS %83 %308
%311 = OpConvertFToS %83 %309
%312 = OpINotEqual %82 %310 %311
%313 = OpCompositeExtract %80 %312 0
%314 = OpCompositeExtract %80 %312 1
%315 = OpLogicalAnd %80 %313 %314
%316 = OpSelect %81 %313 %148 %127
%317 = OpBitwiseOr %81 %91 %316
%318 = OpSelect %81 %314 %129 %127
%319 = OpBitwiseOr %81 %317 %318
%320 = OpSelect %81 %315 %153 %127
%321 = OpBitwiseOr %81 %319 %320
%322 = OpSConvert %5 %321
%323 = OpIMul %81 %244 %129
%324 = OpSConvert %5 %323
%325 = OpShiftLeftLogical %5 %322 %324
%326 = OpLoad %80 %2192
%327 = OpLogicalNot %80 %326
%328 = OpLogicalAnd %80 %327 %246
%329 = OpFunctionCall %1 %167 %24 %310 %325 %328
%330 = OpLoad %6 %24
%331 = OpLoad %11 %13
%332 = OpLoad %34 %36
%333 = OpCompositeConstruct %43 %65 %67
%334 = OpImageQuerySize %83 %330
%335 = OpBitwiseAnd %83 %334 %88
%336 = OpImageQueryLevels %81 %331
%337 = OpISub %81 %336 %91
%338 = OpConvertSToF %10 %337
%339 = OpExtInst %10 %79 NClamp %70 %138 %338
%340 = OpConvertFToS %81 %339
%341 = OpFAdd %10 %339 %98
%342 = OpConvertFToS %81 %341
%343 = OpExtInst %81 %79 SMin %342 %337
%344 = OpINotEqual %80 %340 %342
%345 = OpExtInst %43 %79 Fract %333
%347 = OpImageQuerySizeLod %83 %331 %340
%346 = OpConvertSToF %43 %347
%348 = OpSNegate %83 %335
%349 = OpExtInst %43 %79 Ldexp %346 %348
%350 = OpFMul %43 %345 %349
%351 = OpExtInst %43 %79 Ldexp %134 %348
%352 = OpFSub %43 %350 %351
%353 = OpExtInst %43 %79 FMax %352 %139
%354 = OpFAdd %43 %350 %351
%355 = OpConvertFToS %83 %353
%356 = OpConvertFToS %83 %354
%357 = OpINotEqual %82 %355 %356
%358 = OpCompositeExtract %80 %357 0
%359 = OpCompositeExtract %80 %357 1
%360 = OpLogicalAnd %80 %358 %359
%361 = OpSelect %81 %358 %148 %127
%362 = OpBitwiseOr %81 %91 %361
%363 = OpSelect %81 %359 %129 %127
%364 = OpBitwiseOr %81 %362 %363
%365 = OpSelect %81 %360 %153 %127
%366 = OpBitwiseOr %81 %364 %365
%367 = OpSConvert %5 %366
%368 = OpIMul %81 %340 %129
%369 = OpSConvert %5 %368
%370 = OpShiftLeftLogical %5 %367 %369
%371 = OpLoad %80 %2192
%372 = OpLogicalNot %80 %371
%373 = OpFunctionCall %1 %167 %24 %355 %370 %372
%375 = OpImageQuerySizeLod %83 %331 %342
%374 = OpConvertSToF %43 %375
%376 = OpSNegate %83 %335
%377 = OpExtInst %43 %79 Ldexp %374 %376
%378 = OpFMul %43 %345 %377
%379 = OpExtInst %43 %79 Ldexp %134 %376
%380 = OpFSub %43 %378 %379
%381 = OpExtInst %43 %79 FMax %380 %139
%382 = OpFAdd %43 %378 %379
%383 = OpConvertFToS %83 %381
%384 = OpConvertFToS %83 %382
%385 = OpINotEqual %82 %383 %384
%386 = OpCompositeExtract %80 %385 0
%387 = OpCompositeExtract %80 %385 1
%388 = OpLogicalAnd %80 %386 %387
%389 = OpSelect %81 %386 %148 %127
%390 = OpBitwiseOr %81 %91 %389
%391 = OpSelect %81 %387 %129 %127
%392 = OpBitwiseOr %81 %390 %391
%393 = OpSelect %81 %388 %153 %127
%394 = OpBitwiseOr %81 %392 %393
%395 = OpSConvert %5 %394
%396 = OpIMul %81 %342 %129
%397 = OpSConvert %5 %396
%398 = OpShiftLeftLogical %5 %395 %397
%399 = OpLoad %80 %2192
%400 = OpLogicalNot %80 %399
%401 = OpLogicalAnd %80 %400 %344
%402 = OpFunctionCall %1 %167 %24 %383 %398 %401
%403 = OpLoad %6 %24
%404 = OpLoad %11 %13
%405 = OpLoad %34 %36
%406 = OpCompositeConstruct %43 %65 %67
%407 = OpImageQuerySize %83 %403
%408 = OpBitwiseAnd %83 %407 %88
%409 = OpImageQueryLevels %81 %404
%410 = OpISub %81 %409 %91
%412 = OpImageQuerySizeLod %83 %404 %127
%411 = OpConvertSToF %43 %412
%413 = OpCompositeConstruct %43 %61 %63
%414 = OpCompositeConstruct %43 %56 %59
%415 = OpFMul %43 %411 %413
%416 = OpFMul %43 %411 %414
%417 = OpDot %10 %415 %415
%418 = OpDot %10 %416 %416
%419 = OpExtInst %10 %79 FMax %417 %418
%420 = OpExtInst %10 %79 Log2 %419
%421 = OpFMul %10 %420 %133
%422 = OpConvertSToF %10 %410
%423 = OpExtInst %10 %79 NClamp %421 %138 %422
%424 = OpConvertFToS %81 %423
%425 = OpFAdd %10 %423 %98
%426 = OpConvertFToS %81 %425
%427 = OpExtInst %81 %79 SMin %426 %410
%428 = OpINotEqual %80 %424 %426
%429 = OpExtInst %43 %79 Fract %406
%431 = OpImageQuerySizeLod %83 %404 %424
%430 = OpConvertSToF %43 %431
%432 = OpSNegate %83 %408
%433 = OpExtInst %43 %79 Ldexp %430 %432
%434 = OpFMul %43 %429 %433
%435 = OpExtInst %43 %79 Ldexp %134 %432
%436 = OpFSub %43 %434 %435
%437 = OpExtInst %43 %79 FMax %436 %139
%438 = OpFAdd %43 %434 %435
%439 = OpConvertFToS %83 %437
%440 = OpConvertFToS %83 %438
%441 = OpINotEqual %82 %439 %440
%442 = OpCompositeExtract %80 %441 0
%443 = OpCompositeExtract %80 %441 1
%444 = OpLogicalAnd %80 %442 %443
%445 = OpSelect %81 %442 %148 %127
%446 = OpBitwiseOr %81 %91 %445
%447 = OpSelect %81 %443 %129 %127
%448 = OpBitwiseOr %81 %446 %447
%449 = OpSelect %81 %444 %153 %127
%450 = OpBitwiseOr %81 %448 %449
%451 = OpSConvert %5 %450
%452 = OpIMul %81 %424 %129
%453 = OpSConvert %5 %452
%454 = OpShiftLeftLogical %5 %451 %453
%455 = OpLoad %80 %2192
%456 = OpLogicalNot %80 %455
%457 = OpFunctionCall %1 %167 %24 %439 %454 %456
%459 = OpImageQuerySizeLod %83 %404 %426
%458 = OpConvertSToF %43 %459
%460 = OpSNegate %83 %408
%461 = OpExtInst %43 %79 Ldexp %458 %460
%462 = OpFMul %43 %429 %461
%463 = OpExtInst %43 %79 Ldexp %134 %460
%464 = OpFSub %43 %462 %463
%465 = OpExtInst %43 %79 FMax %464 %139
%466 = OpFAdd %43 %462 %463
%467 = OpConvertFToS %83 %465
%468 = OpConvertFToS %83 %466
%469 = OpINotEqual %82 %467 %468
%470 = OpCompositeExtract %80 %469 0
%471 = OpCompositeExtract %80 %469 1
%472 = OpLogicalAnd %80 %470 %471
%473 = OpSelect %81 %470 %148 %127
%474 = OpBitwiseOr %81 %91 %473
%475 = OpSelect %81 %471 %129 %127
%476 = OpBitwiseOr %81 %474 %475
%477 = OpSelect %81 %472 %153 %127
%478 = OpBitwiseOr %81 %476 %477
%479 = OpSConvert %5 %478
%480 = OpIMul %81 %426 %129
%481 = OpSConvert %5 %480
%482 = OpShiftLeftLogical %5 %479 %481
%483 = OpLoad %80 %2192
%484 = OpLogicalNot %80 %483
%485 = OpLogicalAnd %80 %484 %428
%486 = OpFunctionCall %1 %167 %24 %467 %482 %485
%487 = OpLoad %6 %24
%488 = OpLoad %11 %13
%489 = OpLoad %34 %36
%490 = OpCompositeConstruct %43 %65 %67
%491 = OpImageQuerySize %83 %487
%492 = OpBitwiseAnd %83 %491 %88
%493 = OpImageQueryLevels %81 %488
%494 = OpISub %81 %493 %91
%496 = OpImageQuerySizeLod %83 %488 %127
%495 = OpConvertSToF %43 %496
%497 = OpCompositeConstruct %43 %61 %63
%498 = OpCompositeConstruct %43 %56 %59
%499 = OpFMul %43 %495 %497
%500 = OpFMul %43 %495 %498
%501 = OpDot %10 %499 %499
%502 = OpDot %10 %500 %500
%503 = OpExtInst %10 %79 FMax %501 %502
%504 = OpExtInst %10 %79 Log2 %503
%505 = OpFMul %10 %504 %133
%506 = OpConvertSToF %10 %494
%507 = OpExtInst %10 %79 NClamp %505 %138 %506
%508 = OpExtInst %10 %79 FMax %507 %53
%509 = OpExtInst %10 %79 FMin %508 %241
%510 = OpConvertFToS %81 %509
%511 = OpFAdd %10 %509 %98
%512 = OpConvertFToS %81 %511
%513 = OpExtInst %81 %79 SMin %512 %494
%514 = OpINotEqual %80 %510 %512
%515 = OpExtInst %43 %79 Fract %490
%517 = OpImageQuerySizeLod %83 %488 %510
%516 = OpConvertSToF %43 %517
%518 = OpSNegate %83 %492
%519 = OpExtInst %43 %79 Ldexp %516 %518
%520 = OpFMul %43 %515 %519
%521 = OpExtInst %43 %79 Ldexp %134 %518
%522 = OpFSub %43 %520 %521
%523 = OpExtInst %43 %79 FMax %522 %139
%524 = OpFAdd %43 %520 %521
%525 = OpConvertFToS %83 %523
%526 = OpConvertFToS %83 %524
%527 = OpINotEqual %82 %525 %526
%528 = OpCompositeExtract %80 %527 0
%529 = OpCompositeExtract %80 %527 1
%530 = OpLogicalAnd %80 %528 %529
%531 = OpSelect %81 %528 %148 %127
%532 = OpBitwiseOr %81 %91 %531
%533 = OpSelect %81 %529 %129 %127
%534 = OpBitwiseOr %81 %532 %533
%535 = OpSelect %81 %530 %153 %127
%536 = OpBitwiseOr %81 %534 %535
%537 = OpSConvert %5 %536
%538 = OpIMul %81 %510 %129
%539 = OpSConvert %5 %538
%540 = OpShiftLeftLogical %5 %537 %539
%541 = OpLoad %80 %2192
%542 = OpLogicalNot %80 %541
%543 = OpFunctionCall %1 %167 %24 %525 %540 %542
%545 = OpImageQuerySizeLod %83 %488 %512
%544 = OpConvertSToF %43 %545
%546 = OpSNegate %83 %492
%547 = OpExtInst %43 %79 Ldexp %544 %546
%548 = OpFMul %43 %515 %547
%549 = OpExtInst %43 %79 Ldexp %134 %546
%550 = OpFSub %43 %548 %549
%551 = OpExtInst %43 %79 FMax %550 %139
%552 = OpFAdd %43 %548 %549
%553 = OpConvertFToS %83 %551
%554 = OpConvertFToS %83 %552
%555 = OpINotEqual %82 %553 %554
%556 = OpCompositeExtract %80 %555 0
%557 = OpCompositeExtract %80 %555 1
%558 = OpLogicalAnd %80 %556 %557
%559 = OpSelect %81 %556 %148 %127
%560 = OpBitwiseOr %81 %91 %559
%561 = OpSelect %81 %557 %129 %127
%562 = OpBitwiseOr %81 %560 %561
%563 = OpSelect %81 %558 %153 %127
%564 = OpBitwiseOr %81 %562 %563
%565 = OpSConvert %5 %564
%566 = OpIMul %81 %512 %129
%567 = OpSConvert %5 %566
%568 = OpShiftLeftLogical %5 %565 %567
%569 = OpLoad %80 %2192
%570 = OpLogicalNot %80 %569
%571 = OpLogicalAnd %80 %570 %514
%572 = OpFunctionCall %1 %167 %24 %553 %568 %571
%573 = OpLoad %6 %24
%574 = OpLoad %11 %13
%575 = OpLoad %34 %36
%576 = OpCompositeConstruct %43 %65 %67
%577 = OpImageQuerySize %83 %573
%578 = OpBitwiseAnd %83 %577 %88
%579 = OpImageQueryLevels %81 %574
%580 = OpISub %81 %579 %91
%581 = OpSampledImage %92 %574 %575
%582 = OpExtInst %10 %79 Exp2 %70
%583 = OpGroupNonUniformQuadBroadcast %10 %72 %582 %55
%584 = OpVectorTimesScalar %43 %576 %583
%585 = OpImageQueryLod %43 %581 %584
%586 = OpCompositeExtract %10 %585 0
%587 = OpConvertFToS %81 %586
%588 = OpFAdd %10 %586 %98
%589 = OpConvertFToS %81 %588
%590 = OpExtInst %81 %79 SMin %589 %580
%591 = OpINotEqual %80 %587 %589
%592 = OpDPdx %43 %576
%593 = OpDPdy %43 %576
%594 = OpExtInst %43 %79 FAbs %592
%595 = OpExtInst %43 %79 FAbs %593
%596 = OpCompositeExtract %10 %594 0
%597 = OpCompositeExtract %10 %595 0
%598 = OpCompositeExtract %10 %594 1
%599 = OpCompositeExtract %10 %595 1
%600 = OpExtInst %10 %79 FMax %596 %597
%601 = OpExtInst %10 %79 FMax %598 %599
%602 = OpCompositeConstruct %43 %600 %601
%603 = OpVectorTimesScalar %43 %602 %582
%604 = OpExtInst %43 %79 Fract %576
%606 = OpImageQuerySizeLod %83 %574 %587
%605 = OpConvertSToF %43 %606
%607 = OpSNegate %83 %578
%608 = OpExtInst %43 %79 Ldexp %605 %607
%609 = OpFMul %43 %604 %608
%610 = OpFMul %43 %603 %605
%611 = OpFSub %43 %610 %122
%612 = OpExtInst %123 %79 FrexpStruct %611
%613 = OpCompositeExtract %83 %612 1
%614 = OpExtInst %83 %79 SClamp %613 %128 %130
%615 = OpIAdd %83 %614 %607
%616 = OpExtInst %43 %79 Ldexp %134 %615
%617 = OpExtInst %43 %79 FMin %616 %134
%618 = OpFSub %43 %609 %617
%619 = OpExtInst %43 %79 FMax %618 %139
%620 = OpFAdd %43 %609 %617
%621 = OpConvertFToS %83 %619
%622 = OpConvertFToS %83 %620
%623 = OpINotEqual %82 %621 %622
%624 = OpCompositeExtract %80 %623 0
%625 = OpCompositeExtract %80 %623 1
%626 = OpLogicalAnd %80 %624 %625
%627 = OpSelect %81 %624 %148 %127
%628 = OpBitwiseOr %81 %91 %627
%629 = OpSelect %81 %625 %129 %127
%630 = OpBitwiseOr %81 %628 %629
%631 = OpSelect %81 %626 %153 %127
%632 = OpBitwiseOr %81 %630 %631
%633 = OpSConvert %5 %632
%634 = OpIMul %81 %587 %129
%635 = OpSConvert %5 %634
%636 = OpShiftLeftLogical %5 %633 %635
%637 = OpLoad %80 %2192
%638 = OpLogicalNot %80 %637
%639 = OpFunctionCall %1 %167 %24 %621 %636 %638
%641 = OpImageQuerySizeLod %83 %574 %589
%640 = OpConvertSToF %43 %641
%642 = OpSNegate %83 %578
%643 = OpExtInst %43 %79 Ldexp %640 %642
%644 = OpFMul %43 %604 %643
%645 = OpFMul %43 %603 %640
%646 = OpFSub %43 %645 %122
%647 = OpExtInst %123 %79 FrexpStruct %646
%648 = OpCompositeExtract %83 %647 1
%649 = OpExtInst %83 %79 SClamp %648 %128 %130
%650 = OpIAdd %83 %649 %642
%651 = OpExtInst %43 %79 Ldexp %134 %650
%652 = OpExtInst %43 %79 FMin %651 %134
%653 = OpFSub %43 %644 %652
%654 = OpExtInst %43 %79 FMax %653 %139
%655 = OpFAdd %43 %644 %652
%656 = OpConvertFToS %83 %654
%657 = OpConvertFToS %83 %655
%658 = OpINotEqual %82 %656 %657
%659 = OpCompositeExtract %80 %658 0
%660 = OpCompositeExtract %80 %658 1
%661 = OpLogicalAnd %80 %659 %660
%662 = OpSelect %81 %659 %148 %127
%663 = OpBitwiseOr %81 %91 %662
%664 = OpSelect %81 %660 %129 %127
%665 = OpBitwiseOr %81 %663 %664
%666 = OpSelect %81 %661 %153 %127
%667 = OpBitwiseOr %81 %665 %666
%668 = OpSConvert %5 %667
%669 = OpIMul %81 %589 %129
%670 = OpSConvert %5 %669
%671 = OpShiftLeftLogical %5 %668 %670
%672 = OpLoad %80 %2192
%673 = OpLogicalNot %80 %672
%674 = OpLogicalAnd %80 %673 %591
%675 = OpFunctionCall %1 %167 %24 %656 %671 %674
%676 = OpLoad %6 %24
%677 = OpLoad %11 %13
%678 = OpLoad %34 %36
%679 = OpCompositeConstruct %43 %65 %67
%680 = OpImageQuerySize %83 %676
%681 = OpBitwiseAnd %83 %680 %88
%682 = OpImageQueryLevels %81 %677
%683 = OpISub %81 %682 %91
%684 = OpSampledImage %92 %677 %678
%685 = OpExtInst %10 %79 Exp2 %70
%686 = OpGroupNonUniformQuadBroadcast %10 %72 %685 %55
%687 = OpVectorTimesScalar %43 %679 %686
%688 = OpImageQueryLod %43 %684 %687
%689 = OpCompositeExtract %10 %688 0
%690 = OpExtInst %10 %79 FMax %689 %53
%691 = OpExtInst %10 %79 FMin %690 %241
%692 = OpConvertFToS %81 %691
%693 = OpFAdd %10 %691 %98
%694 = OpConvertFToS %81 %693
%695 = OpExtInst %81 %79 SMin %694 %683
%696 = OpINotEqual %80 %692 %694
%697 = OpDPdx %43 %679
%698 = OpDPdy %43 %679
%699 = OpExtInst %43 %79 FAbs %697
%700 = OpExtInst %43 %79 FAbs %698
%701 = OpCompositeExtract %10 %699 0
%702 = OpCompositeExtract %10 %700 0
%703 = OpCompositeExtract %10 %699 1
%704 = OpCompositeExtract %10 %700 1
%705 = OpExtInst %10 %79 FMax %701 %702
%706 = OpExtInst %10 %79 FMax %703 %704
%707 = OpCompositeConstruct %43 %705 %706
%708 = OpVectorTimesScalar %43 %707 %685
%709 = OpExtInst %43 %79 Fract %679
%711 = OpImageQuerySizeLod %83 %677 %692
%710 = OpConvertSToF %43 %711
%712 = OpSNegate %83 %681
%713 = OpExtInst %43 %79 Ldexp %710 %712
%714 = OpFMul %43 %709 %713
%715 = OpFMul %43 %708 %710
%716 = OpFSub %43 %715 %122
%717 = OpExtInst %123 %79 FrexpStruct %716
%718 = OpCompositeExtract %83 %717 1
%719 = OpExtInst %83 %79 SClamp %718 %128 %130
%720 = OpIAdd %83 %719 %712
%721 = OpExtInst %43 %79 Ldexp %134 %720
%722 = OpExtInst %43 %79 FMin %721 %134
%723 = OpFSub %43 %714 %722
%724 = OpExtInst %43 %79 FMax %723 %139
%725 = OpFAdd %43 %714 %722
%726 = OpConvertFToS %83 %724
%727 = OpConvertFToS %83 %725
%728 = OpINotEqual %82 %726 %727
%729 = OpCompositeExtract %80 %728 0
%730 = OpCompositeExtract %80 %728 1
%731 = OpLogicalAnd %80 %729 %730
%732 = OpSelect %81 %729 %148 %127
%733 = OpBitwiseOr %81 %91 %732
%734 = OpSelect %81 %730 %129 %127
%735 = OpBitwiseOr %81 %733 %734
%736 = OpSelect %81 %731 %153 %127
%737 = OpBitwiseOr %81 %735 %736
%738 = OpSConvert %5 %737
%739 = OpIMul %81 %692 %129
%740 = OpSConvert %5 %739
%741 = OpShiftLeftLogical %5 %738 %740
%742 = OpLoad %80 %2192
%743 = OpLogicalNot %80 %742
%744 = OpFunctionCall %1 %167 %24 %726 %741 %743
%746 = OpImageQuerySizeLod %83 %677 %694
%745 = OpConvertSToF %43 %746
%747 = OpSNegate %83 %681
%748 = OpExtInst %43 %79 Ldexp %745 %747
%749 = OpFMul %43 %709 %748
%750 = OpFMul %43 %708 %745
%751 = OpFSub %43 %750 %122
%752 = OpExtInst %123 %79 FrexpStruct %751
%753 = OpCompositeExtract %83 %752 1
%754 = OpExtInst %83 %79 SClamp %753 %128 %130
%755 = OpIAdd %83 %754 %747
%756 = OpExtInst %43 %79 Ldexp %134 %755
%757 = OpExtInst %43 %79 FMin %756 %134
%758 = OpFSub %43 %749 %757
%759 = OpExtInst %43 %79 FMax %758 %139
%760 = OpFAdd %43 %749 %757
%761 = OpConvertFToS %83 %759
%762 = OpConvertFToS %83 %760
%763 = OpINotEqual %82 %761 %762
%764 = OpCompositeExtract %80 %763 0
%765 = OpCompositeExtract %80 %763 1
%766 = OpLogicalAnd %80 %764 %765
%767 = OpSelect %81 %764 %148 %127
%768 = OpBitwiseOr %81 %91 %767
%769 = OpSelect %81 %765 %129 %127
%770 = OpBitwiseOr %81 %768 %769
%771 = OpSelect %81 %766 %153 %127
%772 = OpBitwiseOr %81 %770 %771
%773 = OpSConvert %5 %772
%774 = OpIMul %81 %694 %129
%775 = OpSConvert %5 %774
%776 = OpShiftLeftLogical %5 %773 %775
%777 = OpLoad %80 %2192
%778 = OpLogicalNot %80 %777
%779 = OpLogicalAnd %80 %778 %696
%780 = OpFunctionCall %1 %167 %24 %761 %776 %779
%781 = OpLoad %25 %27
%782 = OpLoad %14 %16
%783 = OpLoad %34 %36
%784 = OpExtInst %10 %79 RoundEven %70
%785 = OpConvertFToS %81 %784
%786 = OpCompositeConstruct %43 %65 %67
%788 = OpImageQuerySize %787 %781
%789 = OpVectorShuffle %83 %788 %788 0 1
%790 = OpBitwiseAnd %83 %789 %88
%791 = OpImageQueryLevels %81 %782
%792 = OpISub %81 %791 %91
%794 = OpSampledImage %793 %782 %783
%795 = OpImageQueryLod %43 %794 %786
%796 = OpCompositeExtract %10 %795 0
%797 = OpConvertFToS %81 %796
%798 = OpFAdd %10 %796 %98
%799 = OpConvertFToS %81 %798
%800 = OpExtInst %81 %79 SMin %799 %792
%801 = OpINotEqual %80 %797 %799
%802 = OpDPdx %43 %786
%803 = OpDPdy %43 %786
%804 = OpExtInst %43 %79 FAbs %802
%805 = OpExtInst %43 %79 FAbs %803
%806 = OpCompositeExtract %10 %804 0
%807 = OpCompositeExtract %10 %805 0
%808 = OpCompositeExtract %10 %804 1
%809 = OpCompositeExtract %10 %805 1
%810 = OpExtInst %10 %79 FMax %806 %807
%811 = OpExtInst %10 %79 FMax %808 %809
%812 = OpCompositeConstruct %43 %810 %811
%813 = OpExtInst %43 %79 Fract %786
%815 = OpImageQuerySizeLod %787 %782 %797
%816 = OpVectorShuffle %83 %815 %815 0 1
%814 = OpConvertSToF %43 %816
%817 = OpSNegate %83 %790
%818 = OpExtInst %43 %79 Ldexp %814 %817
%819 = OpFMul %43 %813 %818
%820 = OpFMul %43 %812 %814
%821 = OpFSub %43 %820 %122
%822 = OpExtInst %123 %79 FrexpStruct %821
%823 = OpCompositeExtract %83 %822 1
%824 = OpExtInst %83 %79 SClamp %823 %128 %130
%825 = OpIAdd %83 %824 %817
%826 = OpExtInst %43 %79 Ldexp %134 %825
%827 = OpExtInst %43 %79 FMin %826 %134
%828 = OpFSub %43 %819 %827
%829 = OpExtInst %43 %79 FMax %828 %139
%830 = OpFAdd %43 %819 %827
%831 = OpConvertFToS %83 %829
%832 = OpConvertFToS %83 %830
%833 = OpINotEqual %82 %831 %832
%834 = OpCompositeExtract %80 %833 0
%835 = OpCompositeExtract %80 %833 1
%836 = OpLogicalAnd %80 %834 %835
%837 = OpSelect %81 %834 %148 %127
%838 = OpBitwiseOr %81 %91 %837
%839 = OpSelect %81 %835 %129 %127
%840 = OpBitwiseOr %81 %838 %839
%841 = OpSelect %81 %836 %153 %127
%842 = OpBitwiseOr %81 %840 %841
%843 = OpSConvert %5 %842
%844 = OpIMul %81 %797 %129
%845 = OpSConvert %5 %844
%846 = OpShiftLeftLogical %5 %843 %845
%847 = OpCompositeConstruct %787 %831 %785
%848 = OpLoad %80 %2192
%849 = OpLogicalNot %80 %848
%878 = OpFunctionCall %1 %856 %27 %847 %846 %849
%880 = OpImageQuerySizeLod %787 %782 %799
%881 = OpVectorShuffle %83 %880 %880 0 1
%879 = OpConvertSToF %43 %881
%882 = OpSNegate %83 %790
%883 = OpExtInst %43 %79 Ldexp %879 %882
%884 = OpFMul %43 %813 %883
%885 = OpFMul %43 %812 %879
%886 = OpFSub %43 %885 %122
%887 = OpExtInst %123 %79 FrexpStruct %886
%888 = OpCompositeExtract %83 %887 1
%889 = OpExtInst %83 %79 SClamp %888 %128 %130
%890 = OpIAdd %83 %889 %882
%891 = OpExtInst %43 %79 Ldexp %134 %890
%892 = OpExtInst %43 %79 FMin %891 %134
%893 = OpFSub %43 %884 %892
%894 = OpExtInst %43 %79 FMax %893 %139
%895 = OpFAdd %43 %884 %892
%896 = OpConvertFToS %83 %894
%897 = OpConvertFToS %83 %895
%898 = OpINotEqual %82 %896 %897
%899 = OpCompositeExtract %80 %898 0
%900 = OpCompositeExtract %80 %898 1
%901 = OpLogicalAnd %80 %899 %900
%902 = OpSelect %81 %899 %148 %127
%903 = OpBitwiseOr %81 %91 %902
%904 = OpSelect %81 %900 %129 %127
%905 = OpBitwiseOr %81 %903 %904
%906 = OpSelect %81 %901 %153 %127
%907 = OpBitwiseOr %81 %905 %906
%908 = OpSConvert %5 %907
%909 = OpIMul %81 %799 %129
%910 = OpSConvert %5 %909
%911 = OpShiftLeftLogical %5 %908 %910
%912 = OpCompositeConstruct %787 %896 %785
%913 = OpLoad %80 %2192
%914 = OpLogicalNot %80 %913
%915 = OpLogicalAnd %80 %914 %801
%916 = OpFunctionCall %1 %856 %27 %912 %911 %915
%917 = OpLoad %25 %27
%918 = OpLoad %14 %16
%919 = OpLoad %34 %36
%920 = OpExtInst %10 %79 RoundEven %70
%921 = OpConvertFToS %81 %920
%922 = OpCompositeConstruct %43 %65 %67
%923 = OpImageQuerySize %787 %917
%924 = OpVectorShuffle %83 %923 %923 0 1
%925 = OpBitwiseAnd %83 %924 %88
%926 = OpImageQueryLevels %81 %918
%927 = OpISub %81 %926 %91
%928 = OpSampledImage %793 %918 %919
%929 = OpImageQueryLod %43 %928 %922
%930 = OpCompositeExtract %10 %929 0
%931 = OpExtInst %10 %79 FMax %930 %53
%932 = OpExtInst %10 %79 FMin %931 %241
%933 = OpConvertFToS %81 %932
%934 = OpFAdd %10 %932 %98
%935 = OpConvertFToS %81 %934
%936 = OpExtInst %81 %79 SMin %935 %927
%937 = OpINotEqual %80 %933 %935
%938 = OpDPdx %43 %922
%939 = OpDPdy %43 %922
%940 = OpExtInst %43 %79 FAbs %938
%941 = OpExtInst %43 %79 FAbs %939
%942 = OpCompositeExtract %10 %940 0
%943 = OpCompositeExtract %10 %941 0
%944 = OpCompositeExtract %10 %940 1
%945 = OpCompositeExtract %10 %941 1
%946 = OpExtInst %10 %79 FMax %942 %943
%947 = OpExtInst %10 %79 FMax %944 %945
%948 = OpCompositeConstruct %43 %946 %947
%949 = OpExtInst %43 %79 Fract %922
%951 = OpImageQuerySizeLod %787 %918 %933
%952 = OpVectorShuffle %83 %951 %951 0 1
%950 = OpConvertSToF %43 %952
%953 = OpSNegate %83 %925
%954 = OpExtInst %43 %79 Ldexp %950 %953
%955 = OpFMul %43 %949 %954
%956 = OpFMul %43 %948 %950
%957 = OpFSub %43 %956 %122
%958 = OpExtInst %123 %79 FrexpStruct %957
%959 = OpCompositeExtract %83 %958 1
%960 = OpExtInst %83 %79 SClamp %959 %128 %130
%961 = OpIAdd %83 %960 %953
%962 = OpExtInst %43 %79 Ldexp %134 %961
%963 = OpExtInst %43 %79 FMin %962 %134
%964 = OpFSub %43 %955 %963
%965 = OpExtInst %43 %79 FMax %964 %139
%966 = OpFAdd %43 %955 %963
%967 = OpConvertFToS %83 %965
%968 = OpConvertFToS %83 %966
%969 = OpINotEqual %82 %967 %968
%970 = OpCompositeExtract %80 %969 0
%971 = OpCompositeExtract %80 %969 1
%972 = OpLogicalAnd %80 %970 %971
%973 = OpSelect %81 %970 %148 %127
%974 = OpBitwiseOr %81 %91 %973
%975 = OpSelect %81 %971 %129 %127
%976 = OpBitwiseOr %81 %974 %975
%977 = OpSelect %81 %972 %153 %127
%978 = OpBitwiseOr %81 %976 %977
%979 = OpSConvert %5 %978
%980 = OpIMul %81 %933 %129
%981 = OpSConvert %5 %980
%982 = OpShiftLeftLogical %5 %979 %981
%983 = OpCompositeConstruct %787 %967 %921
%984 = OpLoad %80 %2192
%985 = OpLogicalNot %80 %984
%986 = OpFunctionCall %1 %856 %27 %983 %982 %985
%988 = OpImageQuerySizeLod %787 %918 %935
%989 = OpVectorShuffle %83 %988 %988 0 1
%987 = OpConvertSToF %43 %989
%990 = OpSNegate %83 %925
%991 = OpExtInst %43 %79 Ldexp %987 %990
%992 = OpFMul %43 %949 %991
%993 = OpFMul %43 %948 %987
%994 = OpFSub %43 %993 %122
%995 = OpExtInst %123 %79 FrexpStruct %994
%996 = OpCompositeExtract %83 %995 1
%997 = OpExtInst %83 %79 SClamp %996 %128 %130
%998 = OpIAdd %83 %997 %990
%999 = OpExtInst %43 %79 Ldexp %134 %998
%1000 = OpExtInst %43 %79 FMin %999 %134
%1001 = OpFSub %43 %992 %1000
%1002 = OpExtInst %43 %79 FMax %1001 %139
%1003 = OpFAdd %43 %992 %1000
%1004 = OpConvertFToS %83 %1002
%1005 = OpConvertFToS %83 %1003
%1006 = OpINotEqual %82 %1004 %1005
%1007 = OpCompositeExtract %80 %1006 0
%1008 = OpCompositeExtract %80 %1006 1
%1009 = OpLogicalAnd %80 %1007 %1008
%1010 = OpSelect %81 %1007 %148 %127
%1011 = OpBitwiseOr %81 %91 %1010
%1012 = OpSelect %81 %1008 %129 %127
%1013 = OpBitwiseOr %81 %1011 %1012
%1014 = OpSelect %81 %1009 %153 %127
%1015 = OpBitwiseOr %81 %1013 %1014
%1016 = OpSConvert %5 %1015
%1017 = OpIMul %81 %935 %129
%1018 = OpSConvert %5 %1017
%1019 = OpShiftLeftLogical %5 %1016 %1018
%1020 = OpCompositeConstruct %787 %1004 %921
%1021 = OpLoad %80 %2192
%1022 = OpLogicalNot %80 %1021
%1023 = OpLogicalAnd %80 %1022 %937
%1024 = OpFunctionCall %1 %856 %27 %1020 %1019 %1023
%1025 = OpLoad %25 %27
%1026 = OpLoad %14 %16
%1027 = OpLoad %34 %36
%1028 = OpExtInst %10 %79 RoundEven %70
%1029 = OpConvertFToS %81 %1028
%1030 = OpCompositeConstruct %43 %65 %67
%1031 = OpImageQuerySize %787 %1025
%1032 = OpVectorShuffle %83 %1031 %1031 0 1
%1033 = OpBitwiseAnd %83 %1032 %88
%1034 = OpImageQueryLevels %81 %1026
%1035 = OpISub %81 %1034 %91
%1036 = OpConvertSToF %10 %1035
%1037 = OpExtInst %10 %79 NClamp %74 %138 %1036
%1038 = OpConvertFToS %81 %1037
%1039 = OpFAdd %10 %1037 %98
%1040 = OpConvertFToS %81 %1039
%1041 = OpExtInst %81 %79 SMin %1040 %1035
%1042 = OpINotEqual %80 %1038 %1040
%1043 = OpExtInst %43 %79 Fract %1030
%1045 = OpImageQuerySizeLod %787 %1026 %1038
%1046 = OpVectorShuffle %83 %1045 %1045 0 1
%1044 = OpConvertSToF %43 %1046
%1047 = OpSNegate %83 %1033
%1048 = OpExtInst %43 %79 Ldexp %1044 %1047
%1049 = OpFMul %43 %1043 %1048
%1050 = OpExtInst %43 %79 Ldexp %134 %1047
%1051 = OpFSub %43 %1049 %1050
%1052 = OpExtInst %43 %79 FMax %1051 %139
%1053 = OpFAdd %43 %1049 %1050
%1054 = OpConvertFToS %83 %1052
%1055 = OpConvertFToS %83 %1053
%1056 = OpINotEqual %82 %1054 %1055
%1057 = OpCompositeExtract %80 %1056 0
%1058 = OpCompositeExtract %80 %1056 1
%1059 = OpLogicalAnd %80 %1057 %1058
%1060 = OpSelect %81 %1057 %148 %127
%1061 = OpBitwiseOr %81 %91 %1060
%1062 = OpSelect %81 %1058 %129 %127
%1063 = OpBitwiseOr %81 %1061 %1062
%1064 = OpSelect %81 %1059 %153 %127
%1065 = OpBitwiseOr %81 %1063 %1064
%1066 = OpSConvert %5 %1065
%1067 = OpIMul %81 %1038 %129
%1068 = OpSConvert %5 %1067
%1069 = OpShiftLeftLogical %5 %1066 %1068
%1070 = OpCompositeConstruct %787 %1054 %1029
%1071 = OpLoad %80 %2192
%1072 = OpLogicalNot %80 %1071
%1073 = OpFunctionCall %1 %856 %27 %1070 %1069 %1072
%1075 = OpImageQuerySizeLod %787 %1026 %1040
%1076 = OpVectorShuffle %83 %1075 %1075 0 1
%1074 = OpConvertSToF %43 %1076
%1077 = OpSNegate %83 %1033
%1078 = OpExtInst %43 %79 Ldexp %1074 %1077
%1079 = OpFMul %43 %1043 %1078
%1080 = OpExtInst %43 %79 Ldexp %134 %1077
%1081 = OpFSub %43 %1079 %1080
%1082 = OpExtInst %43 %79 FMax %1081 %139
%1083 = OpFAdd %43 %1079 %1080
%1084 = OpConvertFToS %83 %1082
%1085 = OpConvertFToS %83 %1083
%1086 = OpINotEqual %82 %1084 %1085
%1087 = OpCompositeExtract %80 %1086 0
%1088 = OpCompositeExtract %80 %1086 1
%1089 = OpLogicalAnd %80 %1087 %1088
%1090 = OpSelect %81 %1087 %148 %127
%1091 = OpBitwiseOr %81 %91 %1090
%1092 = OpSelect %81 %1088 %129 %127
%1093 = OpBitwiseOr %81 %1091 %1092
%1094 = OpSelect %81 %1089 %153 %127
%1095 = OpBitwiseOr %81 %1093 %1094
%1096 = OpSConvert %5 %1095
%1097 = OpIMul %81 %1040 %129
%1098 = OpSConvert %5 %1097
%1099 = OpShiftLeftLogical %5 %1096 %1098
%1100 = OpCompositeConstruct %787 %1084 %1029
%1101 = OpLoad %80 %2192
%1102 = OpLogicalNot %80 %1101
%1103 = OpLogicalAnd %80 %1102 %1042
%1104 = OpFunctionCall %1 %856 %27 %1100 %1099 %1103
%1105 = OpLoad %25 %27
%1106 = OpLoad %14 %16
%1107 = OpLoad %34 %36
%1108 = OpExtInst %10 %79 RoundEven %70
%1109 = OpConvertFToS %81 %1108
%1110 = OpCompositeConstruct %43 %65 %67
%1111 = OpImageQuerySize %787 %1105
%1112 = OpVectorShuffle %83 %1111 %1111 0 1
%1113 = OpBitwiseAnd %83 %1112 %88
%1114 = OpImageQueryLevels %81 %1106
%1115 = OpISub %81 %1114 %91
%1117 = OpImageQuerySizeLod %787 %1106 %127
%1118 = OpVectorShuffle %83 %1117 %1117 0 1
%1116 = OpConvertSToF %43 %1118
%1119 = OpCompositeConstruct %43 %61 %63
%1120 = OpCompositeConstruct %43 %56 %59
%1121 = OpFMul %43 %1116 %1119
%1122 = OpFMul %43 %1116 %1120
%1123 = OpDot %10 %1121 %1121
%1124 = OpDot %10 %1122 %1122
%1125 = OpExtInst %10 %79 FMax %1123 %1124
%1126 = OpExtInst %10 %79 Log2 %1125
%1127 = OpFMul %10 %1126 %133
%1128 = OpConvertSToF %10 %1115
%1129 = OpExtInst %10 %79 NClamp %1127 %138 %1128
%1130 = OpConvertFToS %81 %1129
%1131 = OpFAdd %10 %1129 %98
%1132 = OpConvertFToS %81 %1131
%1133 = OpExtInst %81 %79 SMin %1132 %1115
%1134 = OpINotEqual %80 %1130 %1132
%1135 = OpExtInst %43 %79 Fract %1110
%1137 = OpImageQuerySizeLod %787 %1106 %1130
%1138 = OpVectorShuffle %83 %1137 %1137 0 1
%1136 = OpConvertSToF %43 %1138
%1139 = OpSNegate %83 %1113
%1140 = OpExtInst %43 %79 Ldexp %1136 %1139
%1141 = OpFMul %43 %1135 %1140
%1142 = OpExtInst %43 %79 Ldexp %134 %1139
%1143 = OpFSub %43 %1141 %1142
%1144 = OpExtInst %43 %79 FMax %1143 %139
%1145 = OpFAdd %43 %1141 %1142
%1146 = OpConvertFToS %83 %1144
%1147 = OpConvertFToS %83 %1145
%1148 = OpINotEqual %82 %1146 %1147
%1149 = OpCompositeExtract %80 %1148 0
%1150 = OpCompositeExtract %80 %1148 1
%1151 = OpLogicalAnd %80 %1149 %1150
%1152 = OpSelect %81 %1149 %148 %127
%1153 = OpBitwiseOr %81 %91 %1152
%1154 = OpSelect %81 %1150 %129 %127
%1155 = OpBitwiseOr %81 %1153 %1154
%1156 = OpSelect %81 %1151 %153 %127
%1157 = OpBitwiseOr %81 %1155 %1156
%1158 = OpSConvert %5 %1157
%1159 = OpIMul %81 %1130 %129
%1160 = OpSConvert %5 %1159
%1161 = OpShiftLeftLogical %5 %1158 %1160
%1162 = OpCompositeConstruct %787 %1146 %1109
%1163 = OpLoad %80 %2192
%1164 = OpLogicalNot %80 %1163
%1165 = OpFunctionCall %1 %856 %27 %1162 %1161 %1164
%1167 = OpImageQuerySizeLod %787 %1106 %1132
%1168 = OpVectorShuffle %83 %1167 %1167 0 1
%1166 = OpConvertSToF %43 %1168
%1169 = OpSNegate %83 %1113
%1170 = OpExtInst %43 %79 Ldexp %1166 %1169
%1171 = OpFMul %43 %1135 %1170
%1172 = OpExtInst %43 %79 Ldexp %134 %1169
%1173 = OpFSub %43 %1171 %1172
%1174 = OpExtInst %43 %79 FMax %1173 %139
%1175 = OpFAdd %43 %1171 %1172
%1176 = OpConvertFToS %83 %1174
%1177 = OpConvertFToS %83 %1175
%1178 = OpINotEqual %82 %1176 %1177
%1179 = OpCompositeExtract %80 %1178 0
%1180 = OpCompositeExtract %80 %1178 1
%1181 = OpLogicalAnd %80 %1179 %1180
%1182 = OpSelect %81 %1179 %148 %127
%1183 = OpBitwiseOr %81 %91 %1182
%1184 = OpSelect %81 %1180 %129 %127
%1185 = OpBitwiseOr %81 %1183 %1184
%1186 = OpSelect %81 %1181 %153 %127
%1187 = OpBitwiseOr %81 %1185 %1186
%1188 = OpSConvert %5 %1187
%1189 = OpIMul %81 %1132 %129
%1190 = OpSConvert %5 %1189
%1191 = OpShiftLeftLogical %5 %1188 %1190
%1192 = OpCompositeConstruct %787 %1176 %1109
%1193 = OpLoad %80 %2192
%1194 = OpLogicalNot %80 %1193
%1195 = OpLogicalAnd %80 %1194 %1134
%1196 = OpFunctionCall %1 %856 %27 %1192 %1191 %1195
%1197 = OpLoad %25 %27
%1198 = OpLoad %14 %16
%1199 = OpLoad %34 %36
%1200 = OpExtInst %10 %79 RoundEven %70
%1201 = OpConvertFToS %81 %1200
%1202 = OpCompositeConstruct %43 %65 %67
%1203 = OpImageQuerySize %787 %1197
%1204 = OpVectorShuffle %83 %1203 %1203 0 1
%1205 = OpBitwiseAnd %83 %1204 %88
%1206 = OpImageQueryLevels %81 %1198
%1207 = OpISub %81 %1206 %91
%1209 = OpImageQuerySizeLod %787 %1198 %127
%1210 = OpVectorShuffle %83 %1209 %1209 0 1
%1208 = OpConvertSToF %43 %1210
%1211 = OpCompositeConstruct %43 %61 %63
%1212 = OpCompositeConstruct %43 %56 %59
%1213 = OpFMul %43 %1208 %1211
%1214 = OpFMul %43 %1208 %1212
%1215 = OpDot %10 %1213 %1213
%1216 = OpDot %10 %1214 %1214
%1217 = OpExtInst %10 %79 FMax %1215 %1216
%1218 = OpExtInst %10 %79 Log2 %1217
%1219 = OpFMul %10 %1218 %133
%1220 = OpConvertSToF %10 %1207
%1221 = OpExtInst %10 %79 NClamp %1219 %138 %1220
%1222 = OpExtInst %10 %79 FMax %1221 %53
%1223 = OpExtInst %10 %79 FMin %1222 %241
%1224 = OpConvertFToS %81 %1223
%1225 = OpFAdd %10 %1223 %98
%1226 = OpConvertFToS %81 %1225
%1227 = OpExtInst %81 %79 SMin %1226 %1207
%1228 = OpINotEqual %80 %1224 %1226
%1229 = OpExtInst %43 %79 Fract %1202
%1231 = OpImageQuerySizeLod %787 %1198 %1224
%1232 = OpVectorShuffle %83 %1231 %1231 0 1
%1230 = OpConvertSToF %43 %1232
%1233 = OpSNegate %83 %1205
%1234 = OpExtInst %43 %79 Ldexp %1230 %1233
%1235 = OpFMul %43 %1229 %1234
%1236 = OpExtInst %43 %79 Ldexp %134 %1233
%1237 = OpFSub %43 %1235 %1236
%1238 = OpExtInst %43 %79 FMax %1237 %139
%1239 = OpFAdd %43 %1235 %1236
%1240 = OpConvertFToS %83 %1238
%1241 = OpConvertFToS %83 %1239
%1242 = OpINotEqual %82 %1240 %1241
%1243 = OpCompositeExtract %80 %1242 0
%1244 = OpCompositeExtract %80 %1242 1
%1245 = OpLogicalAnd %80 %1243 %1244
%1246 = OpSelect %81 %1243 %148 %127
%1247 = OpBitwiseOr %81 %91 %1246
%1248 = OpSelect %81 %1244 %129 %127
%1249 = OpBitwiseOr %81 %1247 %1248
%1250 = OpSelect %81 %1245 %153 %127
%1251 = OpBitwiseOr %81 %1249 %1250
%1252 = OpSConvert %5 %1251
%1253 = OpIMul %81 %1224 %129
%1254 = OpSConvert %5 %1253
%1255 = OpShiftLeftLogical %5 %1252 %1254
%1256 = OpCompositeConstruct %787 %1240 %1201
%1257 = OpLoad %80 %2192
%1258 = OpLogicalNot %80 %1257
%1259 = OpFunctionCall %1 %856 %27 %1256 %1255 %1258
%1261 = OpImageQuerySizeLod %787 %1198 %1226
%1262 = OpVectorShuffle %83 %1261 %1261 0 1
%1260 = OpConvertSToF %43 %1262
%1263 = OpSNegate %83 %1205
%1264 = OpExtInst %43 %79 Ldexp %1260 %1263
%1265 = OpFMul %43 %1229 %1264
%1266 = OpExtInst %43 %79 Ldexp %134 %1263
%1267 = OpFSub %43 %1265 %1266
%1268 = OpExtInst %43 %79 FMax %1267 %139
%1269 = OpFAdd %43 %1265 %1266
%1270 = OpConvertFToS %83 %1268
%1271 = OpConvertFToS %83 %1269
%1272 = OpINotEqual %82 %1270 %1271
%1273 = OpCompositeExtract %80 %1272 0
%1274 = OpCompositeExtract %80 %1272 1
%1275 = OpLogicalAnd %80 %1273 %1274
%1276 = OpSelect %81 %1273 %148 %127
%1277 = OpBitwiseOr %81 %91 %1276
%1278 = OpSelect %81 %1274 %129 %127
%1279 = OpBitwiseOr %81 %1277 %1278
%1280 = OpSelect %81 %1275 %153 %127
%1281 = OpBitwiseOr %81 %1279 %1280
%1282 = OpSConvert %5 %1281
%1283 = OpIMul %81 %1226 %129
%1284 = OpSConvert %5 %1283
%1285 = OpShiftLeftLogical %5 %1282 %1284
%1286 = OpCompositeConstruct %787 %1270 %1201
%1287 = OpLoad %80 %2192
%1288 = OpLogicalNot %80 %1287
%1289 = OpLogicalAnd %80 %1288 %1228
%1290 = OpFunctionCall %1 %856 %27 %1286 %1285 %1289
%1291 = OpLoad %25 %27
%1292 = OpLoad %14 %16
%1293 = OpLoad %34 %36
%1294 = OpExtInst %10 %79 RoundEven %70
%1295 = OpConvertFToS %81 %1294
%1296 = OpCompositeConstruct %43 %65 %67
%1297 = OpImageQuerySize %787 %1291
%1298 = OpVectorShuffle %83 %1297 %1297 0 1
%1299 = OpBitwiseAnd %83 %1298 %88
%1300 = OpImageQueryLevels %81 %1292
%1301 = OpISub %81 %1300 %91
%1302 = OpSampledImage %793 %1292 %1293
%1303 = OpExtInst %10 %79 Exp2 %70
%1304 = OpGroupNonUniformQuadBroadcast %10 %72 %1303 %55
%1305 = OpVectorTimesScalar %43 %1296 %1304
%1306 = OpImageQueryLod %43 %1302 %1305
%1307 = OpCompositeExtract %10 %1306 0
%1308 = OpConvertFToS %81 %1307
%1309 = OpFAdd %10 %1307 %98
%1310 = OpConvertFToS %81 %1309
%1311 = OpExtInst %81 %79 SMin %1310 %1301
%1312 = OpINotEqual %80 %1308 %1310
%1313 = OpDPdx %43 %1296
%1314 = OpDPdy %43 %1296
%1315 = OpExtInst %43 %79 FAbs %1313
%1316 = OpExtInst %43 %79 FAbs %1314
%1317 = OpCompositeExtract %10 %1315 0
%1318 = OpCompositeExtract %10 %1316 0
%1319 = OpCompositeExtract %10 %1315 1
%1320 = OpCompositeExtract %10 %1316 1
%1321 = OpExtInst %10 %79 FMax %1317 %1318
%1322 = OpExtInst %10 %79 FMax %1319 %1320
%1323 = OpCompositeConstruct %43 %1321 %1322
%1324 = OpVectorTimesScalar %43 %1323 %1303
%1325 = OpExtInst %43 %79 Fract %1296
%1327 = OpImageQuerySizeLod %787 %1292 %1308
%1328 = OpVectorShuffle %83 %1327 %1327 0 1
%1326 = OpConvertSToF %43 %1328
%1329 = OpSNegate %83 %1299
%1330 = OpExtInst %43 %79 Ldexp %1326 %1329
%1331 = OpFMul %43 %1325 %1330
%1332 = OpFMul %43 %1324 %1326
%1333 = OpFSub %43 %1332 %122
%1334 = OpExtInst %123 %79 FrexpStruct %1333
%1335 = OpCompositeExtract %83 %1334 1
%1336 = OpExtInst %83 %79 SClamp %1335 %128 %130
%1337 = OpIAdd %83 %1336 %1329
%1338 = OpExtInst %43 %79 Ldexp %134 %1337
%1339 = OpExtInst %43 %79 FMin %1338 %134
%1340 = OpFSub %43 %1331 %1339
%1341 = OpExtInst %43 %79 FMax %1340 %139
%1342 = OpFAdd %43 %1331 %1339
%1343 = OpConvertFToS %83 %1341
%1344 = OpConvertFToS %83 %1342
%1345 = OpINotEqual %82 %1343 %1344
%1346 = OpCompositeExtract %80 %1345 0
%1347 = OpCompositeExtract %80 %1345 1
%1348 = OpLogicalAnd %80 %1346 %1347
%1349 = OpSelect %81 %1346 %148 %127
%1350 = OpBitwiseOr %81 %91 %1349
%1351 = OpSelect %81 %1347 %129 %127
%1352 = OpBitwiseOr %81 %1350 %1351
%1353 = OpSelect %81 %1348 %153 %127
%1354 = OpBitwiseOr %81 %1352 %1353
%1355 = OpSConvert %5 %1354
%1356 = OpIMul %81 %1308 %129
%1357 = OpSConvert %5 %1356
%1358 = OpShiftLeftLogical %5 %1355 %1357
%1359 = OpCompositeConstruct %787 %1343 %1295
%1360 = OpLoad %80 %2192
%1361 = OpLogicalNot %80 %1360
%1362 = OpFunctionCall %1 %856 %27 %1359 %1358 %1361
%1364 = OpImageQuerySizeLod %787 %1292 %1310
%1365 = OpVectorShuffle %83 %1364 %1364 0 1
%1363 = OpConvertSToF %43 %1365
%1366 = OpSNegate %83 %1299
%1367 = OpExtInst %43 %79 Ldexp %1363 %1366
%1368 = OpFMul %43 %1325 %1367
%1369 = OpFMul %43 %1324 %1363
%1370 = OpFSub %43 %1369 %122
%1371 = OpExtInst %123 %79 FrexpStruct %1370
%1372 = OpCompositeExtract %83 %1371 1
%1373 = OpExtInst %83 %79 SClamp %1372 %128 %130
%1374 = OpIAdd %83 %1373 %1366
%1375 = OpExtInst %43 %79 Ldexp %134 %1374
%1376 = OpExtInst %43 %79 FMin %1375 %134
%1377 = OpFSub %43 %1368 %1376
%1378 = OpExtInst %43 %79 FMax %1377 %139
%1379 = OpFAdd %43 %1368 %1376
%1380 = OpConvertFToS %83 %1378
%1381 = OpConvertFToS %83 %1379
%1382 = OpINotEqual %82 %1380 %1381
%1383 = OpCompositeExtract %80 %1382 0
%1384 = OpCompositeExtract %80 %1382 1
%1385 = OpLogicalAnd %80 %1383 %1384
%1386 = OpSelect %81 %1383 %148 %127
%1387 = OpBitwiseOr %81 %91 %1386
%1388 = OpSelect %81 %1384 %129 %127
%1389 = OpBitwiseOr %81 %1387 %1388
%1390 = OpSelect %81 %1385 %153 %127
%1391 = OpBitwiseOr %81 %1389 %1390
%1392 = OpSConvert %5 %1391
%1393 = OpIMul %81 %1310 %129
%1394 = OpSConvert %5 %1393
%1395 = OpShiftLeftLogical %5 %1392 %1394
%1396 = OpCompositeConstruct %787 %1380 %1295
%1397 = OpLoad %80 %2192
%1398 = OpLogicalNot %80 %1397
%1399 = OpLogicalAnd %80 %1398 %1312
%1400 = OpFunctionCall %1 %856 %27 %1396 %1395 %1399
%1401 = OpLoad %25 %27
%1402 = OpLoad %14 %16
%1403 = OpLoad %34 %36
%1404 = OpExtInst %10 %79 RoundEven %70
%1405 = OpConvertFToS %81 %1404
%1406 = OpCompositeConstruct %43 %65 %67
%1407 = OpImageQuerySize %787 %1401
%1408 = OpVectorShuffle %83 %1407 %1407 0 1
%1409 = OpBitwiseAnd %83 %1408 %88
%1410 = OpImageQueryLevels %81 %1402
%1411 = OpISub %81 %1410 %91
%1412 = OpSampledImage %793 %1402 %1403
%1413 = OpExtInst %10 %79 Exp2 %74
%1414 = OpGroupNonUniformQuadBroadcast %10 %72 %1413 %55
%1415 = OpVectorTimesScalar %43 %1406 %1414
%1416 = OpImageQueryLod %43 %1412 %1415
%1417 = OpCompositeExtract %10 %1416 0
%1418 = OpExtInst %10 %79 FMax %1417 %53
%1419 = OpExtInst %10 %79 FMin %1418 %241
%1420 = OpConvertFToS %81 %1419
%1421 = OpFAdd %10 %1419 %98
%1422 = OpConvertFToS %81 %1421
%1423 = OpExtInst %81 %79 SMin %1422 %1411
%1424 = OpINotEqual %80 %1420 %1422
%1425 = OpDPdx %43 %1406
%1426 = OpDPdy %43 %1406
%1427 = OpExtInst %43 %79 FAbs %1425
%1428 = OpExtInst %43 %79 FAbs %1426
%1429 = OpCompositeExtract %10 %1427 0
%1430 = OpCompositeExtract %10 %1428 0
%1431 = OpCompositeExtract %10 %1427 1
%1432 = OpCompositeExtract %10 %1428 1
%1433 = OpExtInst %10 %79 FMax %1429 %1430
%1434 = OpExtInst %10 %79 FMax %1431 %1432
%1435 = OpCompositeConstruct %43 %1433 %1434
%1436 = OpVectorTimesScalar %43 %1435 %1413
%1437 = OpExtInst %43 %79 Fract %1406
%1439 = OpImageQuerySizeLod %787 %1402 %1420
%1440 = OpVectorShuffle %83 %1439 %1439 0 1
%1438 = OpConvertSToF %43 %1440
%1441 = OpSNegate %83 %1409
%1442 = OpExtInst %43 %79 Ldexp %1438 %1441
%1443 = OpFMul %43 %1437 %1442
%1444 = OpFMul %43 %1436 %1438
%1445 = OpFSub %43 %1444 %122
%1446 = OpExtInst %123 %79 FrexpStruct %1445
%1447 = OpCompositeExtract %83 %1446 1
%1448 = OpExtInst %83 %79 SClamp %1447 %128 %130
%1449 = OpIAdd %83 %1448 %1441
%1450 = OpExtInst %43 %79 Ldexp %134 %1449
%1451 = OpExtInst %43 %79 FMin %1450 %134
%1452 = OpFSub %43 %1443 %1451
%1453 = OpExtInst %43 %79 FMax %1452 %139
%1454 = OpFAdd %43 %1443 %1451
%1455 = OpConvertFToS %83 %1453
%1456 = OpConvertFToS %83 %1454
%1457 = OpINotEqual %82 %1455 %1456
%1458 = OpCompositeExtract %80 %1457 0
%1459 = OpCompositeExtract %80 %1457 1
%1460 = OpLogicalAnd %80 %1458 %1459
%1461 = OpSelect %81 %1458 %148 %127
%1462 = OpBitwiseOr %81 %91 %1461
%1463 = OpSelect %81 %1459 %129 %127
%1464 = OpBitwiseOr %81 %1462 %1463
%1465 = OpSelect %81 %1460 %153 %127
%1466 = OpBitwiseOr %81 %1464 %1465
%1467 = OpSConvert %5 %1466
%1468 = OpIMul %81 %1420 %129
%1469 = OpSConvert %5 %1468
%1470 = OpShiftLeftLogical %5 %1467 %1469
%1471 = OpCompositeConstruct %787 %1455 %1405
%1472 = OpLoad %80 %2192
%1473 = OpLogicalNot %80 %1472
%1474 = OpFunctionCall %1 %856 %27 %1471 %1470 %1473
%1476 = OpImageQuerySizeLod %787 %1402 %1422
%1477 = OpVectorShuffle %83 %1476 %1476 0 1
%1475 = OpConvertSToF %43 %1477
%1478 = OpSNegate %83 %1409
%1479 = OpExtInst %43 %79 Ldexp %1475 %1478
%1480 = OpFMul %43 %1437 %1479
%1481 = OpFMul %43 %1436 %1475
%1482 = OpFSub %43 %1481 %122
%1483 = OpExtInst %123 %79 FrexpStruct %1482
%1484 = OpCompositeExtract %83 %1483 1
%1485 = OpExtInst %83 %79 SClamp %1484 %128 %130
%1486 = OpIAdd %83 %1485 %1478
%1487 = OpExtInst %43 %79 Ldexp %134 %1486
%1488 = OpExtInst %43 %79 FMin %1487 %134
%1489 = OpFSub %43 %1480 %1488
%1490 = OpExtInst %43 %79 FMax %1489 %139
%1491 = OpFAdd %43 %1480 %1488
%1492 = OpConvertFToS %83 %1490
%1493 = OpConvertFToS %83 %1491
%1494 = OpINotEqual %82 %1492 %1493
%1495 = OpCompositeExtract %80 %1494 0
%1496 = OpCompositeExtract %80 %1494 1
%1497 = OpLogicalAnd %80 %1495 %1496
%1498 = OpSelect %81 %1495 %148 %127
%1499 = OpBitwiseOr %81 %91 %1498
%1500 = OpSelect %81 %1496 %129 %127
%1501 = OpBitwiseOr %81 %1499 %1500
%1502 = OpSelect %81 %1497 %153 %127
%1503 = OpBitwiseOr %81 %1501 %1502
%1504 = OpSConvert %5 %1503
%1505 = OpIMul %81 %1422 %129
%1506 = OpSConvert %5 %1505
%1507 = OpShiftLeftLogical %5 %1504 %1506
%1508 = OpCompositeConstruct %787 %1492 %1405
%1509 = OpLoad %80 %2192
%1510 = OpLogicalNot %80 %1509
%1511 = OpLogicalAnd %80 %1510 %1424
%1512 = OpFunctionCall %1 %856 %27 %1508 %1507 %1511
%1513 = OpIAdd %49 %52 %55
%1514 = OpAccessChain %23 %30 %1513
%1515 = OpLoad %6 %1514
%1516 = OpIAdd %49 %52 %55
%1517 = OpAccessChain %12 %19 %1516
%1518 = OpLoad %11 %1517
%1519 = OpIAdd %49 %52 %55
%1520 = OpAccessChain %35 %39 %1519
%1521 = OpLoad %34 %1520
%1522 = OpCompositeConstruct %43 %65 %67
%1523 = OpImageQuerySize %83 %1515
%1524 = OpBitwiseAnd %83 %1523 %88
%1525 = OpImageQueryLevels %81 %1518
%1526 = OpISub %81 %1525 %91
%1527 = OpSampledImage %92 %1518 %1521
%1528 = OpImageQueryLod %43 %1527 %1522
%1529 = OpCompositeExtract %10 %1528 0
%1530 = OpConvertFToS %81 %1529
%1531 = OpFAdd %10 %1529 %98
%1532 = OpConvertFToS %81 %1531
%1533 = OpExtInst %81 %79 SMin %1532 %1526
%1534 = OpINotEqual %80 %1530 %1532
%1535 = OpDPdx %43 %1522
%1536 = OpDPdy %43 %1522
%1537 = OpExtInst %43 %79 FAbs %1535
%1538 = OpExtInst %43 %79 FAbs %1536
%1539 = OpCompositeExtract %10 %1537 0
%1540 = OpCompositeExtract %10 %1538 0
%1541 = OpCompositeExtract %10 %1537 1
%1542 = OpCompositeExtract %10 %1538 1
%1543 = OpExtInst %10 %79 FMax %1539 %1540
%1544 = OpExtInst %10 %79 FMax %1541 %1542
%1545 = OpCompositeConstruct %43 %1543 %1544
%1546 = OpExtInst %43 %79 Fract %1522
%1548 = OpImageQuerySizeLod %83 %1518 %1530
%1547 = OpConvertSToF %43 %1548
%1549 = OpSNegate %83 %1524
%1550 = OpExtInst %43 %79 Ldexp %1547 %1549
%1551 = OpFMul %43 %1546 %1550
%1552 = OpFMul %43 %1545 %1547
%1553 = OpFSub %43 %1552 %122
%1554 = OpExtInst %123 %79 FrexpStruct %1553
%1555 = OpCompositeExtract %83 %1554 1
%1556 = OpExtInst %83 %79 SClamp %1555 %128 %130
%1557 = OpIAdd %83 %1556 %1549
%1558 = OpExtInst %43 %79 Ldexp %134 %1557
%1559 = OpExtInst %43 %79 FMin %1558 %134
%1560 = OpFSub %43 %1551 %1559
%1561 = OpExtInst %43 %79 FMax %1560 %139
%1562 = OpFAdd %43 %1551 %1559
%1563 = OpConvertFToS %83 %1561
%1564 = OpConvertFToS %83 %1562
%1565 = OpINotEqual %82 %1563 %1564
%1566 = OpCompositeExtract %80 %1565 0
%1567 = OpCompositeExtract %80 %1565 1
%1568 = OpLogicalAnd %80 %1566 %1567
%1569 = OpSelect %81 %1566 %148 %127
%1570 = OpBitwiseOr %81 %91 %1569
%1571 = OpSelect %81 %1567 %129 %127
%1572 = OpBitwiseOr %81 %1570 %1571
%1573 = OpSelect %81 %1568 %153 %127
%1574 = OpBitwiseOr %81 %1572 %1573
%1575 = OpSConvert %5 %1574
%1576 = OpIMul %81 %1530 %129
%1577 = OpSConvert %5 %1576
%1578 = OpShiftLeftLogical %5 %1575 %1577
%1579 = OpLoad %80 %2192
%1580 = OpLogicalNot %80 %1579
%1607 = OpFunctionCall %1 %1585 %1514 %1563 %1578 %1580
%1609 = OpImageQuerySizeLod %83 %1518 %1532
%1608 = OpConvertSToF %43 %1609
%1610 = OpSNegate %83 %1524
%1611 = OpExtInst %43 %79 Ldexp %1608 %1610
%1612 = OpFMul %43 %1546 %1611
%1613 = OpFMul %43 %1545 %1608
%1614 = OpFSub %43 %1613 %122
%1615 = OpExtInst %123 %79 FrexpStruct %1614
%1616 = OpCompositeExtract %83 %1615 1
%1617 = OpExtInst %83 %79 SClamp %1616 %128 %130
%1618 = OpIAdd %83 %1617 %1610
%1619 = OpExtInst %43 %79 Ldexp %134 %1618
%1620 = OpExtInst %43 %79 FMin %1619 %134
%1621 = OpFSub %43 %1612 %1620
%1622 = OpExtInst %43 %79 FMax %1621 %139
%1623 = OpFAdd %43 %1612 %1620
%1624 = OpConvertFToS %83 %1622
%1625 = OpConvertFToS %83 %1623
%1626 = OpINotEqual %82 %1624 %1625
%1627 = OpCompositeExtract %80 %1626 0
%1628 = OpCompositeExtract %80 %1626 1
%1629 = OpLogicalAnd %80 %1627 %1628
%1630 = OpSelect %81 %1627 %148 %127
%1631 = OpBitwiseOr %81 %91 %1630
%1632 = OpSelect %81 %1628 %129 %127
%1633 = OpBitwiseOr %81 %1631 %1632
%1634 = OpSelect %81 %1629 %153 %127
%1635 = OpBitwiseOr %81 %1633 %1634
%1636 = OpSConvert %5 %1635
%1637 = OpIMul %81 %1532 %129
%1638 = OpSConvert %5 %1637
%1639 = OpShiftLeftLogical %5 %1636 %1638
%1640 = OpLoad %80 %2192
%1641 = OpLogicalNot %80 %1640
%1642 = OpLogicalAnd %80 %1641 %1534
%1643 = OpFunctionCall %1 %1585 %1514 %1624 %1639 %1642
%1644 = OpIAdd %49 %52 %55
%1645 = OpAccessChain %26 %33 %1644
%1646 = OpLoad %25 %1645
%1647 = OpIAdd %49 %52 %55
%1648 = OpAccessChain %15 %22 %1647
%1649 = OpLoad %14 %1648
%1650 = OpAccessChain %35 %39 %1519
%1651 = OpLoad %34 %1650
%1652 = OpExtInst %10 %79 RoundEven %70
%1653 = OpConvertFToS %81 %1652
%1654 = OpCompositeConstruct %43 %65 %67
%1655 = OpImageQuerySize %787 %1646
%1656 = OpVectorShuffle %83 %1655 %1655 0 1
%1657 = OpBitwiseAnd %83 %1656 %88
%1658 = OpImageQueryLevels %81 %1649
%1659 = OpISub %81 %1658 %91
%1660 = OpSampledImage %793 %1649 %1651
%1661 = OpImageQueryLod %43 %1660 %1654
%1662 = OpCompositeExtract %10 %1661 0
%1663 = OpConvertFToS %81 %1662
%1664 = OpFAdd %10 %1662 %98
%1665 = OpConvertFToS %81 %1664
%1666 = OpExtInst %81 %79 SMin %1665 %1659
%1667 = OpINotEqual %80 %1663 %1665
%1668 = OpDPdx %43 %1654
%1669 = OpDPdy %43 %1654
%1670 = OpExtInst %43 %79 FAbs %1668
%1671 = OpExtInst %43 %79 FAbs %1669
%1672 = OpCompositeExtract %10 %1670 0
%1673 = OpCompositeExtract %10 %1671 0
%1674 = OpCompositeExtract %10 %1670 1
%1675 = OpCompositeExtract %10 %1671 1
%1676 = OpExtInst %10 %79 FMax %1672 %1673
%1677 = OpExtInst %10 %79 FMax %1674 %1675
%1678 = OpCompositeConstruct %43 %1676 %1677
%1679 = OpExtInst %43 %79 Fract %1654
%1681 = OpImageQuerySizeLod %787 %1649 %1663
%1682 = OpVectorShuffle %83 %1681 %1681 0 1
%1680 = OpConvertSToF %43 %1682
%1683 = OpSNegate %83 %1657
%1684 = OpExtInst %43 %79 Ldexp %1680 %1683
%1685 = OpFMul %43 %1679 %1684
%1686 = OpFMul %43 %1678 %1680
%1687 = OpFSub %43 %1686 %122
%1688 = OpExtInst %123 %79 FrexpStruct %1687
%1689 = OpCompositeExtract %83 %1688 1
%1690 = OpExtInst %83 %79 SClamp %1689 %128 %130
%1691 = OpIAdd %83 %1690 %1683
%1692 = OpExtInst %43 %79 Ldexp %134 %1691
%1693 = OpExtInst %43 %79 FMin %1692 %134
%1694 = OpFSub %43 %1685 %1693
%1695 = OpExtInst %43 %79 FMax %1694 %139
%1696 = OpFAdd %43 %1685 %1693
%1697 = OpConvertFToS %83 %1695
%1698 = OpConvertFToS %83 %1696
%1699 = OpINotEqual %82 %1697 %1698
%1700 = OpCompositeExtract %80 %1699 0
%1701 = OpCompositeExtract %80 %1699 1
%1702 = OpLogicalAnd %80 %1700 %1701
%1703 = OpSelect %81 %1700 %148 %127
%1704 = OpBitwiseOr %81 %91 %1703
%1705 = OpSelect %81 %1701 %129 %127
%1706 = OpBitwiseOr %81 %1704 %1705
%1707 = OpSelect %81 %1702 %153 %127
%1708 = OpBitwiseOr %81 %1706 %1707
%1709 = OpSConvert %5 %1708
%1710 = OpIMul %81 %1663 %129
%1711 = OpSConvert %5 %1710
%1712 = OpShiftLeftLogical %5 %1709 %1711
%1713 = OpCompositeConstruct %787 %1697 %1653
%1714 = OpLoad %80 %2192
%1715 = OpLogicalNot %80 %1714
%1742 = OpFunctionCall %1 %1720 %1645 %1713 %1712 %1715
%1744 = OpImageQuerySizeLod %787 %1649 %1665
%1745 = OpVectorShuffle %83 %1744 %1744 0 1
%1743 = OpConvertSToF %43 %1745
%1746 = OpSNegate %83 %1657
%1747 = OpExtInst %43 %79 Ldexp %1743 %1746
%1748 = OpFMul %43 %1679 %1747
%1749 = OpFMul %43 %1678 %1743
%1750 = OpFSub %43 %1749 %122
%1751 = OpExtInst %123 %79 FrexpStruct %1750
%1752 = OpCompositeExtract %83 %1751 1
%1753 = OpExtInst %83 %79 SClamp %1752 %128 %130
%1754 = OpIAdd %83 %1753 %1746
%1755 = OpExtInst %43 %79 Ldexp %134 %1754
%1756 = OpExtInst %43 %79 FMin %1755 %134
%1757 = OpFSub %43 %1748 %1756
%1758 = OpExtInst %43 %79 FMax %1757 %139
%1759 = OpFAdd %43 %1748 %1756
%1760 = OpConvertFToS %83 %1758
%1761 = OpConvertFToS %83 %1759
%1762 = OpINotEqual %82 %1760 %1761
%1763 = OpCompositeExtract %80 %1762 0
%1764 = OpCompositeExtract %80 %1762 1
%1765 = OpLogicalAnd %80 %1763 %1764
%1766 = OpSelect %81 %1763 %148 %127
%1767 = OpBitwiseOr %81 %91 %1766
%1768 = OpSelect %81 %1764 %129 %127
%1769 = OpBitwiseOr %81 %1767 %1768
%1770 = OpSelect %81 %1765 %153 %127
%1771 = OpBitwiseOr %81 %1769 %1770
%1772 = OpSConvert %5 %1771
%1773 = OpIMul %81 %1665 %129
%1774 = OpSConvert %5 %1773
%1775 = OpShiftLeftLogical %5 %1772 %1774
%1776 = OpCompositeConstruct %787 %1760 %1653
%1777 = OpLoad %80 %2192
%1778 = OpLogicalNot %80 %1777
%1779 = OpLogicalAnd %80 %1778 %1667
%1780 = OpFunctionCall %1 %1720 %1645 %1776 %1775 %1779
%1781 = OpAccessChain %23 %30 %1513
%1782 = OpLoad %6 %1781
%1783 = OpAccessChain %12 %19 %1516
%1784 = OpLoad %11 %1783
%1785 = OpAccessChain %35 %39 %1519
%1786 = OpLoad %34 %1785
%1787 = OpCompositeConstruct %43 %65 %67
%1788 = OpImageQuerySize %83 %1782
%1789 = OpBitwiseAnd %83 %1788 %88
%1790 = OpImageQueryLevels %81 %1784
%1791 = OpISub %81 %1790 %91
%1792 = OpSampledImage %92 %1784 %1786
%1793 = OpImageQueryLod %43 %1792 %1787
%1794 = OpCompositeExtract %10 %1793 0
%1795 = OpConvertFToS %81 %1794
%1796 = OpFAdd %10 %1794 %98
%1797 = OpConvertFToS %81 %1796
%1798 = OpExtInst %81 %79 SMin %1797 %1791
%1799 = OpINotEqual %80 %1795 %1797
%1800 = OpDPdx %43 %1787
%1801 = OpDPdy %43 %1787
%1802 = OpExtInst %43 %79 FAbs %1800
%1803 = OpExtInst %43 %79 FAbs %1801
%1804 = OpCompositeExtract %10 %1802 0
%1805 = OpCompositeExtract %10 %1803 0
%1806 = OpCompositeExtract %10 %1802 1
%1807 = OpCompositeExtract %10 %1803 1
%1808 = OpExtInst %10 %79 FMax %1804 %1805
%1809 = OpExtInst %10 %79 FMax %1806 %1807
%1810 = OpCompositeConstruct %43 %1808 %1809
%1811 = OpExtInst %43 %79 Fract %1787
%1813 = OpImageQuerySizeLod %83 %1784 %1795
%1812 = OpConvertSToF %43 %1813
%1814 = OpSNegate %83 %1789
%1815 = OpExtInst %43 %79 Ldexp %1812 %1814
%1816 = OpFMul %43 %1811 %1815
%1817 = OpFMul %43 %1810 %1812
%1818 = OpFSub %43 %1817 %122
%1819 = OpExtInst %123 %79 FrexpStruct %1818
%1820 = OpCompositeExtract %83 %1819 1
%1821 = OpExtInst %83 %79 SClamp %1820 %128 %130
%1822 = OpIAdd %83 %1821 %1814
%1823 = OpExtInst %43 %79 Ldexp %134 %1822
%1824 = OpExtInst %43 %79 FMin %1823 %134
%1825 = OpFSub %43 %1816 %1824
%1826 = OpExtInst %43 %79 FMax %1825 %139
%1827 = OpFAdd %43 %1816 %1824
%1828 = OpConvertFToS %83 %1826
%1829 = OpConvertFToS %83 %1827
%1830 = OpINotEqual %82 %1828 %1829
%1831 = OpCompositeExtract %80 %1830 0
%1832 = OpCompositeExtract %80 %1830 1
%1833 = OpLogicalAnd %80 %1831 %1832
%1834 = OpSelect %81 %1831 %148 %127
%1835 = OpBitwiseOr %81 %91 %1834
%1836 = OpSelect %81 %1832 %129 %127
%1837 = OpBitwiseOr %81 %1835 %1836
%1838 = OpSelect %81 %1833 %153 %127
%1839 = OpBitwiseOr %81 %1837 %1838
%1840 = OpSConvert %5 %1839
%1841 = OpIMul %81 %1795 %129
%1842 = OpSConvert %5 %1841
%1843 = OpShiftLeftLogical %5 %1840 %1842
%1844 = OpLoad %80 %2192
%1845 = OpLogicalNot %80 %1844
%1846 = OpFunctionCall %1 %1585 %1781 %1828 %1843 %1845
%1848 = OpImageQuerySizeLod %83 %1784 %1797
%1847 = OpConvertSToF %43 %1848
%1849 = OpSNegate %83 %1789
%1850 = OpExtInst %43 %79 Ldexp %1847 %1849
%1851 = OpFMul %43 %1811 %1850
%1852 = OpFMul %43 %1810 %1847
%1853 = OpFSub %43 %1852 %122
%1854 = OpExtInst %123 %79 FrexpStruct %1853
%1855 = OpCompositeExtract %83 %1854 1
%1856 = OpExtInst %83 %79 SClamp %1855 %128 %130
%1857 = OpIAdd %83 %1856 %1849
%1858 = OpExtInst %43 %79 Ldexp %134 %1857
%1859 = OpExtInst %43 %79 FMin %1858 %134
%1860 = OpFSub %43 %1851 %1859
%1861 = OpExtInst %43 %79 FMax %1860 %139
%1862 = OpFAdd %43 %1851 %1859
%1863 = OpConvertFToS %83 %1861
%1864 = OpConvertFToS %83 %1862
%1865 = OpINotEqual %82 %1863 %1864
%1866 = OpCompositeExtract %80 %1865 0
%1867 = OpCompositeExtract %80 %1865 1
%1868 = OpLogicalAnd %80 %1866 %1867
%1869 = OpSelect %81 %1866 %148 %127
%1870 = OpBitwiseOr %81 %91 %1869
%1871 = OpSelect %81 %1867 %129 %127
%1872 = OpBitwiseOr %81 %1870 %1871
%1873 = OpSelect %81 %1868 %153 %127
%1874 = OpBitwiseOr %81 %1872 %1873
%1875 = OpSConvert %5 %1874
%1876 = OpIMul %81 %1797 %129
%1877 = OpSConvert %5 %1876
%1878 = OpShiftLeftLogical %5 %1875 %1877
%1879 = OpLoad %80 %2192
%1880 = OpLogicalNot %80 %1879
%1881 = OpLogicalAnd %80 %1880 %1799
%1882 = OpFunctionCall %1 %1585 %1781 %1863 %1878 %1881
%1883 = OpAccessChain %26 %33 %1644
%1884 = OpLoad %25 %1883
%1885 = OpAccessChain %15 %22 %1647
%1886 = OpLoad %14 %1885
%1887 = OpAccessChain %35 %39 %1519
%1888 = OpLoad %34 %1887
%1889 = OpExtInst %10 %79 RoundEven %70
%1890 = OpConvertFToS %81 %1889
%1891 = OpCompositeConstruct %43 %65 %67
%1892 = OpImageQuerySize %787 %1884
%1893 = OpVectorShuffle %83 %1892 %1892 0 1
%1894 = OpBitwiseAnd %83 %1893 %88
%1895 = OpImageQueryLevels %81 %1886
%1896 = OpISub %81 %1895 %91
%1897 = OpSampledImage %793 %1886 %1888
%1898 = OpImageQueryLod %43 %1897 %1891
%1899 = OpCompositeExtract %10 %1898 0
%1900 = OpConvertFToS %81 %1899
%1901 = OpFAdd %10 %1899 %98
%1902 = OpConvertFToS %81 %1901
%1903 = OpExtInst %81 %79 SMin %1902 %1896
%1904 = OpINotEqual %80 %1900 %1902
%1905 = OpDPdx %43 %1891
%1906 = OpDPdy %43 %1891
%1907 = OpExtInst %43 %79 FAbs %1905
%1908 = OpExtInst %43 %79 FAbs %1906
%1909 = OpCompositeExtract %10 %1907 0
%1910 = OpCompositeExtract %10 %1908 0
%1911 = OpCompositeExtract %10 %1907 1
%1912 = OpCompositeExtract %10 %1908 1
%1913 = OpExtInst %10 %79 FMax %1909 %1910
%1914 = OpExtInst %10 %79 FMax %1911 %1912
%1915 = OpCompositeConstruct %43 %1913 %1914
%1916 = OpExtInst %43 %79 Fract %1891
%1918 = OpImageQuerySizeLod %787 %1886 %1900
%1919 = OpVectorShuffle %83 %1918 %1918 0 1
%1917 = OpConvertSToF %43 %1919
%1920 = OpSNegate %83 %1894
%1921 = OpExtInst %43 %79 Ldexp %1917 %1920
%1922 = OpFMul %43 %1916 %1921
%1923 = OpFMul %43 %1915 %1917
%1924 = OpFSub %43 %1923 %122
%1925 = OpExtInst %123 %79 FrexpStruct %1924
%1926 = OpCompositeExtract %83 %1925 1
%1927 = OpExtInst %83 %79 SClamp %1926 %128 %130
%1928 = OpIAdd %83 %1927 %1920
%1929 = OpExtInst %43 %79 Ldexp %134 %1928
%1930 = OpExtInst %43 %79 FMin %1929 %134
%1931 = OpFSub %43 %1922 %1930
%1932 = OpExtInst %43 %79 FMax %1931 %139
%1933 = OpFAdd %43 %1922 %1930
%1934 = OpConvertFToS %83 %1932
%1935 = OpConvertFToS %83 %1933
%1936 = OpINotEqual %82 %1934 %1935
%1937 = OpCompositeExtract %80 %1936 0
%1938 = OpCompositeExtract %80 %1936 1
%1939 = OpLogicalAnd %80 %1937 %1938
%1940 = OpSelect %81 %1937 %148 %127
%1941 = OpBitwiseOr %81 %91 %1940
%1942 = OpSelect %81 %1938 %129 %127
%1943 = OpBitwiseOr %81 %1941 %1942
%1944 = OpSelect %81 %1939 %153 %127
%1945 = OpBitwiseOr %81 %1943 %1944
%1946 = OpSConvert %5 %1945
%1947 = OpIMul %81 %1900 %129
%1948 = OpSConvert %5 %1947
%1949 = OpShiftLeftLogical %5 %1946 %1948
%1950 = OpCompositeConstruct %787 %1934 %1890
%1951 = OpLoad %80 %2192
%1952 = OpLogicalNot %80 %1951
%1953 = OpFunctionCall %1 %1720 %1883 %1950 %1949 %1952
%1955 = OpImageQuerySizeLod %787 %1886 %1902
%1956 = OpVectorShuffle %83 %1955 %1955 0 1
%1954 = OpConvertSToF %43 %1956
%1957 = OpSNegate %83 %1894
%1958 = OpExtInst %43 %79 Ldexp %1954 %1957
%1959 = OpFMul %43 %1916 %1958
%1960 = OpFMul %43 %1915 %1954
%1961 = OpFSub %43 %1960 %122
%1962 = OpExtInst %123 %79 FrexpStruct %1961
%1963 = OpCompositeExtract %83 %1962 1
%1964 = OpExtInst %83 %79 SClamp %1963 %128 %130
%1965 = OpIAdd %83 %1964 %1957
%1966 = OpExtInst %43 %79 Ldexp %134 %1965
%1967 = OpExtInst %43 %79 FMin %1966 %134
%1968 = OpFSub %43 %1959 %1967
%1969 = OpExtInst %43 %79 FMax %1968 %139
%1970 = OpFAdd %43 %1959 %1967
%1971 = OpConvertFToS %83 %1969
%1972 = OpConvertFToS %83 %1970
%1973 = OpINotEqual %82 %1971 %1972
%1974 = OpCompositeExtract %80 %1973 0
%1975 = OpCompositeExtract %80 %1973 1
%1976 = OpLogicalAnd %80 %1974 %1975
%1977 = OpSelect %81 %1974 %148 %127
%1978 = OpBitwiseOr %81 %91 %1977
%1979 = OpSelect %81 %1975 %129 %127
%1980 = OpBitwiseOr %81 %1978 %1979
%1981 = OpSelect %81 %1976 %153 %127
%1982 = OpBitwiseOr %81 %1980 %1981
%1983 = OpSConvert %5 %1982
%1984 = OpIMul %81 %1902 %129
%1985 = OpSConvert %5 %1984
%1986 = OpShiftLeftLogical %5 %1983 %1985
%1987 = OpCompositeConstruct %787 %1971 %1890
%1988 = OpLoad %80 %2192
%1989 = OpLogicalNot %80 %1988
%1990 = OpLogicalAnd %80 %1989 %1904
%1991 = OpFunctionCall %1 %1720 %1883 %1987 %1986 %1990
%1992 = OpAccessChain %23 %9 %52
%1993 = OpLoad %6 %1992
%1994 = OpLoad %11 %13
%1995 = OpLoad %34 %36
%1996 = OpCompositeConstruct %43 %65 %67
%1997 = OpImageQuerySize %83 %1993
%1998 = OpBitwiseAnd %83 %1997 %88
%1999 = OpImageQueryLevels %81 %1994
%2000 = OpISub %81 %1999 %91
%2001 = OpSampledImage %92 %1994 %1995
%2002 = OpImageQueryLod %43 %2001 %1996
%2003 = OpCompositeExtract %10 %2002 0
%2004 = OpConvertFToS %81 %2003
%2005 = OpFAdd %10 %2003 %98
%2006 = OpConvertFToS %81 %2005
%2007 = OpExtInst %81 %79 SMin %2006 %2000
%2008 = OpINotEqual %80 %2004 %2006
%2009 = OpDPdx %43 %1996
%2010 = OpDPdy %43 %1996
%2011 = OpExtInst %43 %79 FAbs %2009
%2012 = OpExtInst %43 %79 FAbs %2010
%2013 = OpCompositeExtract %10 %2011 0
%2014 = OpCompositeExtract %10 %2012 0
%2015 = OpCompositeExtract %10 %2011 1
%2016 = OpCompositeExtract %10 %2012 1
%2017 = OpExtInst %10 %79 FMax %2013 %2014
%2018 = OpExtInst %10 %79 FMax %2015 %2016
%2019 = OpCompositeConstruct %43 %2017 %2018
%2020 = OpExtInst %43 %79 Fract %1996
%2022 = OpImageQuerySizeLod %83 %1994 %2004
%2021 = OpConvertSToF %43 %2022
%2023 = OpSNegate %83 %1998
%2024 = OpExtInst %43 %79 Ldexp %2021 %2023
%2025 = OpFMul %43 %2020 %2024
%2026 = OpFMul %43 %2019 %2021
%2027 = OpFSub %43 %2026 %122
%2028 = OpExtInst %123 %79 FrexpStruct %2027
%2029 = OpCompositeExtract %83 %2028 1
%2030 = OpExtInst %83 %79 SClamp %2029 %128 %130
%2031 = OpIAdd %83 %2030 %2023
%2032 = OpExtInst %43 %79 Ldexp %134 %2031
%2033 = OpExtInst %43 %79 FMin %2032 %134
%2034 = OpFSub %43 %2025 %2033
%2035 = OpExtInst %43 %79 FMax %2034 %139
%2036 = OpFAdd %43 %2025 %2033
%2037 = OpConvertFToS %83 %2035
%2038 = OpConvertFToS %83 %2036
%2039 = OpINotEqual %82 %2037 %2038
%2040 = OpCompositeExtract %80 %2039 0
%2041 = OpCompositeExtract %80 %2039 1
%2042 = OpLogicalAnd %80 %2040 %2041
%2043 = OpSelect %81 %2040 %148 %127
%2044 = OpBitwiseOr %81 %91 %2043
%2045 = OpSelect %81 %2041 %129 %127
%2046 = OpBitwiseOr %81 %2044 %2045
%2047 = OpSelect %81 %2042 %153 %127
%2048 = OpBitwiseOr %81 %2046 %2047
%2049 = OpSConvert %5 %2048
%2050 = OpIMul %81 %2004 %129
%2051 = OpSConvert %5 %2050
%2052 = OpShiftLeftLogical %5 %2049 %2051
%2053 = OpLoad %80 %2192
%2054 = OpLogicalNot %80 %2053
%2055 = OpFunctionCall %1 %1585 %1992 %2037 %2052 %2054
%2057 = OpImageQuerySizeLod %83 %1994 %2006
%2056 = OpConvertSToF %43 %2057
%2058 = OpSNegate %83 %1998
%2059 = OpExtInst %43 %79 Ldexp %2056 %2058
%2060 = OpFMul %43 %2020 %2059
%2061 = OpFMul %43 %2019 %2056
%2062 = OpFSub %43 %2061 %122
%2063 = OpExtInst %123 %79 FrexpStruct %2062
%2064 = OpCompositeExtract %83 %2063 1
%2065 = OpExtInst %83 %79 SClamp %2064 %128 %130
%2066 = OpIAdd %83 %2065 %2058
%2067 = OpExtInst %43 %79 Ldexp %134 %2066
%2068 = OpExtInst %43 %79 FMin %2067 %134
%2069 = OpFSub %43 %2060 %2068
%2070 = OpExtInst %43 %79 FMax %2069 %139
%2071 = OpFAdd %43 %2060 %2068
%2072 = OpConvertFToS %83 %2070
%2073 = OpConvertFToS %83 %2071
%2074 = OpINotEqual %82 %2072 %2073
%2075 = OpCompositeExtract %80 %2074 0
%2076 = OpCompositeExtract %80 %2074 1
%2077 = OpLogicalAnd %80 %2075 %2076
%2078 = OpSelect %81 %2075 %148 %127
%2079 = OpBitwiseOr %81 %91 %2078
%2080 = OpSelect %81 %2076 %129 %127
%2081 = OpBitwiseOr %81 %2079 %2080
%2082 = OpSelect %81 %2077 %153 %127
%2083 = OpBitwiseOr %81 %2081 %2082
%2084 = OpSConvert %5 %2083
%2085 = OpIMul %81 %2006 %129
%2086 = OpSConvert %5 %2085
%2087 = OpShiftLeftLogical %5 %2084 %2086
%2088 = OpLoad %80 %2192
%2089 = OpLogicalNot %80 %2088
%2090 = OpLogicalAnd %80 %2089 %2008
%2091 = OpFunctionCall %1 %1585 %1992 %2072 %2087 %2090
%2092 = OpLoad %11 %13
%2093 = OpLoad %34 %36
%2094 = OpCompositeConstruct %43 %65 %67
%2095 = OpImageQuerySize %83 %1993
%2096 = OpBitwiseAnd %83 %2095 %88
%2097 = OpImageQueryLevels %81 %2092
%2098 = OpISub %81 %2097 %91
%2099 = OpSampledImage %92 %2092 %2093
%2100 = OpImageQueryLod %43 %2099 %2094
%2101 = OpCompositeExtract %10 %2100 0
%2102 = OpConvertFToS %81 %2101
%2103 = OpFAdd %10 %2101 %98
%2104 = OpConvertFToS %81 %2103
%2105 = OpExtInst %81 %79 SMin %2104 %2098
%2106 = OpINotEqual %80 %2102 %2104
%2107 = OpDPdx %43 %2094
%2108 = OpDPdy %43 %2094
%2109 = OpExtInst %43 %79 FAbs %2107
%2110 = OpExtInst %43 %79 FAbs %2108
%2111 = OpCompositeExtract %10 %2109 0
%2112 = OpCompositeExtract %10 %2110 0
%2113 = OpCompositeExtract %10 %2109 1
%2114 = OpCompositeExtract %10 %2110 1
%2115 = OpExtInst %10 %79 FMax %2111 %2112
%2116 = OpExtInst %10 %79 FMax %2113 %2114
%2117 = OpCompositeConstruct %43 %2115 %2116
%2118 = OpExtInst %43 %79 Fract %2094
%2120 = OpImageQuerySizeLod %83 %2092 %2102
%2119 = OpConvertSToF %43 %2120
%2121 = OpSNegate %83 %2096
%2122 = OpExtInst %43 %79 Ldexp %2119 %2121
%2123 = OpFMul %43 %2118 %2122
%2124 = OpFMul %43 %2117 %2119
%2125 = OpFSub %43 %2124 %122
%2126 = OpExtInst %123 %79 FrexpStruct %2125
%2127 = OpCompositeExtract %83 %2126 1
%2128 = OpExtInst %83 %79 SClamp %2127 %128 %130
%2129 = OpIAdd %83 %2128 %2121
%2130 = OpExtInst %43 %79 Ldexp %134 %2129
%2131 = OpExtInst %43 %79 FMin %2130 %134
%2132 = OpFSub %43 %2123 %2131
%2133 = OpExtInst %43 %79 FMax %2132 %139
%2134 = OpFAdd %43 %2123 %2131
%2135 = OpConvertFToS %83 %2133
%2136 = OpConvertFToS %83 %2134
%2137 = OpINotEqual %82 %2135 %2136
%2138 = OpCompositeExtract %80 %2137 0
%2139 = OpCompositeExtract %80 %2137 1
%2140 = OpLogicalAnd %80 %2138 %2139
%2141 = OpSelect %81 %2138 %148 %127
%2142 = OpBitwiseOr %81 %91 %2141
%2143 = OpSelect %81 %2139 %129 %127
%2144 = OpBitwiseOr %81 %2142 %2143
%2145 = OpSelect %81 %2140 %153 %127
%2146 = OpBitwiseOr %81 %2144 %2145
%2147 = OpSConvert %5 %2146
%2148 = OpIMul %81 %2102 %129
%2149 = OpSConvert %5 %2148
%2150 = OpShiftLeftLogical %5 %2147 %2149
%2151 = OpLoad %80 %2192
%2152 = OpLogicalNot %80 %2151
%2153 = OpFunctionCall %1 %1585 %1992 %2135 %2150 %2152
%2155 = OpImageQuerySizeLod %83 %2092 %2104
%2154 = OpConvertSToF %43 %2155
%2156 = OpSNegate %83 %2096
%2157 = OpExtInst %43 %79 Ldexp %2154 %2156
%2158 = OpFMul %43 %2118 %2157
%2159 = OpFMul %43 %2117 %2154
%2160 = OpFSub %43 %2159 %122
%2161 = OpExtInst %123 %79 FrexpStruct %2160
%2162 = OpCompositeExtract %83 %2161 1
%2163 = OpExtInst %83 %79 SClamp %2162 %128 %130
%2164 = OpIAdd %83 %2163 %2156
%2165 = OpExtInst %43 %79 Ldexp %134 %2164
%2166 = OpExtInst %43 %79 FMin %2165 %134
%2167 = OpFSub %43 %2158 %2166
%2168 = OpExtInst %43 %79 FMax %2167 %139
%2169 = OpFAdd %43 %2158 %2166
%2170 = OpConvertFToS %83 %2168
%2171 = OpConvertFToS %83 %2169
%2172 = OpINotEqual %82 %2170 %2171
%2173 = OpCompositeExtract %80 %2172 0
%2174 = OpCompositeExtract %80 %2172 1
%2175 = OpLogicalAnd %80 %2173 %2174
%2176 = OpSelect %81 %2173 %148 %127
%2177 = OpBitwiseOr %81 %91 %2176
%2178 = OpSelect %81 %2174 %129 %127
%2179 = OpBitwiseOr %81 %2177 %2178
%2180 = OpSelect %81 %2175 %153 %127
%2181 = OpBitwiseOr %81 %2179 %2180
%2182 = OpSConvert %5 %2181
%2183 = OpIMul %81 %2104 %129
%2184 = OpSConvert %5 %2183
%2185 = OpShiftLeftLogical %5 %2182 %2184
%2186 = OpLoad %80 %2192
%2187 = OpLogicalNot %80 %2186
%2188 = OpLogicalAnd %80 %2187 %2106
%2189 = OpFunctionCall %1 %1585 %1992 %2170 %2185 %2188
OpReturn
OpFunctionEnd
%167 = OpFunction %1 None %162
%163 = OpFunctionParameter %23
%164 = OpFunctionParameter %83
%165 = OpFunctionParameter %5
%166 = OpFunctionParameter %80
%168 = OpLabel
%180 = OpVariable %179 Function %178
OpSelectionMerge %170 None
OpBranchConditional %166 %169 %170
%169 = OpLabel
%181 = OpLoad %80 %180
%182 = OpLogicalNot %80 %181
OpLoopMerge %171 %173 None
OpBranchConditional %182 %172 %171
%172 = OpLabel
%183 = OpGroupNonUniformBroadcastFirst %83 %72 %164
%184 = OpIEqual %82 %164 %183
%185 = OpAll %80 %184
OpStore %180 %185
OpSelectionMerge %175 None
OpBranchConditional %185 %174 %175
%174 = OpLabel
%186 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %165
%187 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %177 None
OpBranchConditional %187 %176 %177
%176 = OpLabel
%188 = OpImageTexelPointer %161 %163 %164 %127
%189 = OpAtomicOr %5 %188 %58 %55 %186
OpBranch %177
%177 = OpLabel
OpBranch %175
%175 = OpLabel
OpBranch %173
%173 = OpLabel
OpBranch %169
%171 = OpLabel
OpBranch %170
%170 = OpLabel
OpReturn
OpFunctionEnd
%856 = OpFunction %1 None %851
%852 = OpFunctionParameter %26
%853 = OpFunctionParameter %787
%854 = OpFunctionParameter %5
%855 = OpFunctionParameter %80
%857 = OpLabel
%867 = OpVariable %179 Function %178
OpSelectionMerge %859 None
OpBranchConditional %855 %858 %859
%858 = OpLabel
%868 = OpLoad %80 %867
%869 = OpLogicalNot %80 %868
OpLoopMerge %860 %862 None
OpBranchConditional %869 %861 %860
%861 = OpLabel
%870 = OpGroupNonUniformBroadcastFirst %787 %72 %853
%871 = OpIEqual %850 %853 %870
%872 = OpAll %80 %871
OpStore %867 %872
OpSelectionMerge %864 None
OpBranchConditional %872 %863 %864
%863 = OpLabel
%873 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %854
%874 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %866 None
OpBranchConditional %874 %865 %866
%865 = OpLabel
%875 = OpImageTexelPointer %161 %852 %853 %127
%876 = OpAtomicOr %5 %875 %58 %55 %873
OpBranch %866
%866 = OpLabel
OpBranch %864
%864 = OpLabel
OpBranch %862
%862 = OpLabel
OpBranch %858
%860 = OpLabel
OpBranch %859
%859 = OpLabel
OpReturn
OpFunctionEnd
%1585 = OpFunction %1 None %162
%1581 = OpFunctionParameter %23
%1582 = OpFunctionParameter %83
%1583 = OpFunctionParameter %5
%1584 = OpFunctionParameter %80
%1586 = OpLabel
%1596 = OpVariable %179 Function %178
OpSelectionMerge %1588 None
OpBranchConditional %1584 %1587 %1588
%1587 = OpLabel
%1597 = OpLoad %80 %1596
%1598 = OpLogicalNot %80 %1597
OpLoopMerge %1589 %1591 None
OpBranchConditional %1598 %1590 %1589
%1590 = OpLabel
%1599 = OpGroupNonUniformBroadcastFirst %83 %72 %1582
%1600 = OpIEqual %82 %1582 %1599
%1601 = OpAll %80 %1600
OpStore %1596 %1601
OpSelectionMerge %1593 None
OpBranchConditional %1601 %1592 %1593
%1592 = OpLabel
%1602 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1583
%1603 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1595 None
OpBranchConditional %1603 %1594 %1595
%1594 = OpLabel
%1604 = OpImageTexelPointer %161 %1581 %1582 %127
%1605 = OpAtomicOr %5 %1604 %58 %55 %1602
OpBranch %1595
%1595 = OpLabel
OpBranch %1593
%1593 = OpLabel
OpBranch %1591
%1591 = OpLabel
OpBranch %1587
%1589 = OpLabel
OpBranch %1588
%1588 = OpLabel
OpReturn
OpFunctionEnd
%1720 = OpFunction %1 None %851
%1716 = OpFunctionParameter %26
%1717 = OpFunctionParameter %787
%1718 = OpFunctionParameter %5
%1719 = OpFunctionParameter %80
%1721 = OpLabel
%1731 = OpVariable %179 Function %178
OpSelectionMerge %1723 None
OpBranchConditional %1719 %1722 %1723
%1722 = OpLabel
%1732 = OpLoad %80 %1731
%1733 = OpLogicalNot %80 %1732
OpLoopMerge %1724 %1726 None
OpBranchConditional %1733 %1725 %1724
%1725 = OpLabel
%1734 = OpGroupNonUniformBroadcastFirst %787 %72 %1717
%1735 = OpIEqual %850 %1717 %1734
%1736 = OpAll %80 %1735
OpStore %1731 %1736
OpSelectionMerge %1728 None
OpBranchConditional %1736 %1727 %1728
%1727 = OpLabel
%1737 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1718
%1738 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1730 None
OpBranchConditional %1738 %1729 %1730
%1729 = OpLabel
%1739 = OpImageTexelPointer %161 %1716 %1717 %127
%1740 = OpAtomicOr %5 %1739 %58 %55 %1737
OpBranch %1730
%1730 = OpLabel
OpBranch %1728
%1728 = OpLabel
OpBranch %1726
%1726 = OpLabel
OpBranch %1722
%1724 = OpLabel
OpBranch %1723
%1723 = OpLabel
OpReturn
OpFunctionEnd
#endif
