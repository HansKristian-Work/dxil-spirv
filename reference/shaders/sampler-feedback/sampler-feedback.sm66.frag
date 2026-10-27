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
            bool _1600 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1600;
            if (_1600)
            {
                uint64_t _1601 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1604 = imageAtomicOr(img, coord, _1601);
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
            bool _1734 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1734;
            if (_1734)
            {
                uint64_t _1735 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1738 = imageAtomicOr(img, coord, _1735);
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
    bool _224 = helperInvocationEXT();
    WriteFeedback(_24, _208, uint64_t(((1 | (_211 ? 2 : 0)) | (_212 ? 4 : 0)) | ((_211 && _212) ? 8 : 0)) << uint64_t(_99 * 4), (!_224) && (_96 != _99));
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
    bool _291 = helperInvocationEXT();
    WriteFeedback(_24, _275, uint64_t(((1 | (_278 ? 2 : 0)) | (_279 ? 4 : 0)) | ((_278 && _279) ? 8 : 0)) << uint64_t(_242 * 4), !_291);
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
    bool _326 = helperInvocationEXT();
    WriteFeedback(_24, _310, uint64_t(((1 | (_313 ? 2 : 0)) | (_314 ? 4 : 0)) | ((_313 && _314) ? 8 : 0)) << uint64_t(_244 * 4), (!_326) && (_242 != _244));
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
    bool _371 = helperInvocationEXT();
    WriteFeedback(_24, _355, uint64_t(((1 | (_358 ? 2 : 0)) | (_359 ? 4 : 0)) | ((_358 && _359) ? 8 : 0)) << uint64_t(_340 * 4), !_371);
    ivec2 _376 = -_335;
    vec2 _378 = _345 * ldexp(vec2(textureSize(_13, _342)), _376);
    vec2 _379 = ldexp(vec2(0.5), _376);
    ivec2 _383 = ivec2(max(_378 - _379, vec2(0.0)));
    bvec2 _385 = notEqual(_383, ivec2(_378 + _379));
    bool _386 = _385.x;
    bool _387 = _385.y;
    bool _399 = helperInvocationEXT();
    WriteFeedback(_24, _383, uint64_t(((1 | (_386 ? 2 : 0)) | (_387 ? 4 : 0)) | ((_386 && _387) ? 8 : 0)) << uint64_t(_342 * 4), (!_399) && (_340 != _342));
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
    bool _455 = helperInvocationEXT();
    WriteFeedback(_24, _439, uint64_t(((1 | (_442 ? 2 : 0)) | (_443 ? 4 : 0)) | ((_442 && _443) ? 8 : 0)) << uint64_t(_424 * 4), !_455);
    ivec2 _460 = -_408;
    vec2 _462 = _429 * ldexp(vec2(textureSize(_13, _426)), _460);
    vec2 _463 = ldexp(vec2(0.5), _460);
    ivec2 _467 = ivec2(max(_462 - _463, vec2(0.0)));
    bvec2 _469 = notEqual(_467, ivec2(_462 + _463));
    bool _470 = _469.x;
    bool _471 = _469.y;
    bool _483 = helperInvocationEXT();
    WriteFeedback(_24, _467, uint64_t(((1 | (_470 ? 2 : 0)) | (_471 ? 4 : 0)) | ((_470 && _471) ? 8 : 0)) << uint64_t(_426 * 4), (!_483) && (_424 != _426));
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
    bool _541 = helperInvocationEXT();
    WriteFeedback(_24, _525, uint64_t(((1 | (_528 ? 2 : 0)) | (_529 ? 4 : 0)) | ((_528 && _529) ? 8 : 0)) << uint64_t(_510 * 4), !_541);
    ivec2 _546 = -_492;
    vec2 _548 = _515 * ldexp(vec2(textureSize(_13, _512)), _546);
    vec2 _549 = ldexp(vec2(0.5), _546);
    ivec2 _553 = ivec2(max(_548 - _549, vec2(0.0)));
    bvec2 _555 = notEqual(_553, ivec2(_548 + _549));
    bool _556 = _555.x;
    bool _557 = _555.y;
    bool _569 = helperInvocationEXT();
    WriteFeedback(_24, _553, uint64_t(((1 | (_556 ? 2 : 0)) | (_557 ? 4 : 0)) | ((_556 && _557) ? 8 : 0)) << uint64_t(_512 * 4), (!_569) && (_510 != _512));
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
    bool _637 = helperInvocationEXT();
    WriteFeedback(_24, _621, uint64_t(((1 | (_624 ? 2 : 0)) | (_625 ? 4 : 0)) | ((_624 && _625) ? 8 : 0)) << uint64_t(_587 * 4), !_637);
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
    bool _672 = helperInvocationEXT();
    WriteFeedback(_24, _656, uint64_t(((1 | (_659 ? 2 : 0)) | (_660 ? 4 : 0)) | ((_659 && _660) ? 8 : 0)) << uint64_t(_589 * 4), (!_672) && (_587 != _589));
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
    bool _742 = helperInvocationEXT();
    WriteFeedback(_24, _726, uint64_t(((1 | (_729 ? 2 : 0)) | (_730 ? 4 : 0)) | ((_729 && _730) ? 8 : 0)) << uint64_t(_692 * 4), !_742);
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
    bool _777 = helperInvocationEXT();
    WriteFeedback(_24, _761, uint64_t(((1 | (_764 ? 2 : 0)) | (_765 ? 4 : 0)) | ((_764 && _765) ? 8 : 0)) << uint64_t(_694 * 4), (!_777) && (_692 != _694));
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
    bool _848 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_831, _785), uint64_t(((1 | (_834 ? 2 : 0)) | (_835 ? 4 : 0)) | ((_834 && _835) ? 8 : 0)) << uint64_t(_797 * 4), !_848);
    vec2 _878 = vec2(textureSize(_16, _799).xy);
    ivec2 _881 = -_790;
    vec2 _883 = _813 * ldexp(_878, _881);
    ResType _886;
    _886._m0 = frexp((_812 * _878) - vec2(0.00390625), _886._m1);
    vec2 _891 = min(ldexp(vec2(0.5), clamp(_886._m1, ivec2(0), ivec2(4)) + _881), vec2(0.5));
    ivec2 _895 = ivec2(max(_883 - _891, vec2(0.0)));
    bvec2 _897 = notEqual(_895, ivec2(_883 + _891));
    bool _898 = _897.x;
    bool _899 = _897.y;
    bool _912 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_895, _785), uint64_t(((1 | (_898 ? 2 : 0)) | (_899 ? 4 : 0)) | ((_898 && _899) ? 8 : 0)) << uint64_t(_799 * 4), (!_912) && (_797 != _799));
    int _920 = int(roundEven(gl_FragCoord.z));
    vec2 _921 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _924 = imageSize(_27).xy & ivec2(15);
    float _931 = min(max(textureQueryLod(sampler2DArray(_16, _36), _921).x, CLAMP), 14.0);
    int _932 = int(_931);
    int _934 = int(_931 + 0.9970703125);
    vec2 _939 = abs(dFdx(_921));
    vec2 _940 = abs(dFdy(_921));
    vec2 _947 = vec2(max(_939.x, _940.x), max(_939.y, _940.y));
    vec2 _948 = fract(_921);
    vec2 _949 = vec2(textureSize(_16, _932).xy);
    ivec2 _952 = -_924;
    vec2 _954 = _948 * ldexp(_949, _952);
    ResType _957;
    _957._m0 = frexp((_947 * _949) - vec2(0.00390625), _957._m1);
    vec2 _962 = min(ldexp(vec2(0.5), clamp(_957._m1, ivec2(0), ivec2(4)) + _952), vec2(0.5));
    ivec2 _966 = ivec2(max(_954 - _962, vec2(0.0)));
    bvec2 _968 = notEqual(_966, ivec2(_954 + _962));
    bool _969 = _968.x;
    bool _970 = _968.y;
    bool _983 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_966, _920), uint64_t(((1 | (_969 ? 2 : 0)) | (_970 ? 4 : 0)) | ((_969 && _970) ? 8 : 0)) << uint64_t(_932 * 4), !_983);
    vec2 _986 = vec2(textureSize(_16, _934).xy);
    ivec2 _989 = -_924;
    vec2 _991 = _948 * ldexp(_986, _989);
    ResType _994;
    _994._m0 = frexp((_947 * _986) - vec2(0.00390625), _994._m1);
    vec2 _999 = min(ldexp(vec2(0.5), clamp(_994._m1, ivec2(0), ivec2(4)) + _989), vec2(0.5));
    ivec2 _1003 = ivec2(max(_991 - _999, vec2(0.0)));
    bvec2 _1005 = notEqual(_1003, ivec2(_991 + _999));
    bool _1006 = _1005.x;
    bool _1007 = _1005.y;
    bool _1020 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1003, _920), uint64_t(((1 | (_1006 ? 2 : 0)) | (_1007 ? 4 : 0)) | ((_1006 && _1007) ? 8 : 0)) << uint64_t(_934 * 4), (!_1020) && (_932 != _934));
    int _1028 = int(roundEven(gl_FragCoord.z));
    ivec2 _1032 = imageSize(_27).xy & ivec2(15);
    int _1034 = textureQueryLevels(_16) - 1;
    float _1036 = spvNClamp(_74, 0.0, float(_1034));
    int _1037 = int(_1036);
    int _1039 = int(_1036 + 0.9970703125);
    vec2 _1042 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1046 = -_1032;
    vec2 _1048 = _1042 * ldexp(vec2(textureSize(_16, _1037).xy), _1046);
    vec2 _1049 = ldexp(vec2(0.5), _1046);
    ivec2 _1053 = ivec2(max(_1048 - _1049, vec2(0.0)));
    bvec2 _1055 = notEqual(_1053, ivec2(_1048 + _1049));
    bool _1056 = _1055.x;
    bool _1057 = _1055.y;
    bool _1070 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1053, _1028), uint64_t(((1 | (_1056 ? 2 : 0)) | (_1057 ? 4 : 0)) | ((_1056 && _1057) ? 8 : 0)) << uint64_t(_1037 * 4), !_1070);
    ivec2 _1076 = -_1032;
    vec2 _1078 = _1042 * ldexp(vec2(textureSize(_16, _1039).xy), _1076);
    vec2 _1079 = ldexp(vec2(0.5), _1076);
    ivec2 _1083 = ivec2(max(_1078 - _1079, vec2(0.0)));
    bvec2 _1085 = notEqual(_1083, ivec2(_1078 + _1079));
    bool _1086 = _1085.x;
    bool _1087 = _1085.y;
    bool _1100 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1083, _1028), uint64_t(((1 | (_1086 ? 2 : 0)) | (_1087 ? 4 : 0)) | ((_1086 && _1087) ? 8 : 0)) << uint64_t(_1039 * 4), (!_1100) && (_1037 != _1039));
    int _1108 = int(roundEven(gl_FragCoord.z));
    ivec2 _1112 = imageSize(_27).xy & ivec2(15);
    int _1114 = textureQueryLevels(_16) - 1;
    vec2 _1115 = vec2(textureSize(_16, 0).xy);
    vec2 _1120 = _1115 * vec2(GRADX.x, GRADX.y);
    vec2 _1121 = _1115 * vec2(GRADY.x, GRADY.y);
    float _1128 = spvNClamp(log2(max(dot(_1120, _1120), dot(_1121, _1121))) * 0.5, 0.0, float(_1114));
    int _1129 = int(_1128);
    int _1131 = int(_1128 + 0.9970703125);
    vec2 _1134 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1138 = -_1112;
    vec2 _1140 = _1134 * ldexp(vec2(textureSize(_16, _1129).xy), _1138);
    vec2 _1141 = ldexp(vec2(0.5), _1138);
    ivec2 _1145 = ivec2(max(_1140 - _1141, vec2(0.0)));
    bvec2 _1147 = notEqual(_1145, ivec2(_1140 + _1141));
    bool _1148 = _1147.x;
    bool _1149 = _1147.y;
    bool _1162 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1145, _1108), uint64_t(((1 | (_1148 ? 2 : 0)) | (_1149 ? 4 : 0)) | ((_1148 && _1149) ? 8 : 0)) << uint64_t(_1129 * 4), !_1162);
    ivec2 _1168 = -_1112;
    vec2 _1170 = _1134 * ldexp(vec2(textureSize(_16, _1131).xy), _1168);
    vec2 _1171 = ldexp(vec2(0.5), _1168);
    ivec2 _1175 = ivec2(max(_1170 - _1171, vec2(0.0)));
    bvec2 _1177 = notEqual(_1175, ivec2(_1170 + _1171));
    bool _1178 = _1177.x;
    bool _1179 = _1177.y;
    bool _1192 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1175, _1108), uint64_t(((1 | (_1178 ? 2 : 0)) | (_1179 ? 4 : 0)) | ((_1178 && _1179) ? 8 : 0)) << uint64_t(_1131 * 4), (!_1192) && (_1129 != _1131));
    int _1200 = int(roundEven(gl_FragCoord.z));
    ivec2 _1204 = imageSize(_27).xy & ivec2(15);
    int _1206 = textureQueryLevels(_16) - 1;
    vec2 _1207 = vec2(textureSize(_16, 0).xy);
    vec2 _1212 = _1207 * vec2(GRADX.x, GRADX.y);
    vec2 _1213 = _1207 * vec2(GRADY.x, GRADY.y);
    float _1222 = min(max(spvNClamp(log2(max(dot(_1212, _1212), dot(_1213, _1213))) * 0.5, 0.0, float(_1206)), CLAMP), 14.0);
    int _1223 = int(_1222);
    int _1225 = int(_1222 + 0.9970703125);
    vec2 _1228 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1232 = -_1204;
    vec2 _1234 = _1228 * ldexp(vec2(textureSize(_16, _1223).xy), _1232);
    vec2 _1235 = ldexp(vec2(0.5), _1232);
    ivec2 _1239 = ivec2(max(_1234 - _1235, vec2(0.0)));
    bvec2 _1241 = notEqual(_1239, ivec2(_1234 + _1235));
    bool _1242 = _1241.x;
    bool _1243 = _1241.y;
    bool _1256 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1239, _1200), uint64_t(((1 | (_1242 ? 2 : 0)) | (_1243 ? 4 : 0)) | ((_1242 && _1243) ? 8 : 0)) << uint64_t(_1223 * 4), !_1256);
    ivec2 _1262 = -_1204;
    vec2 _1264 = _1228 * ldexp(vec2(textureSize(_16, _1225).xy), _1262);
    vec2 _1265 = ldexp(vec2(0.5), _1262);
    ivec2 _1269 = ivec2(max(_1264 - _1265, vec2(0.0)));
    bvec2 _1271 = notEqual(_1269, ivec2(_1264 + _1265));
    bool _1272 = _1271.x;
    bool _1273 = _1271.y;
    bool _1286 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1269, _1200), uint64_t(((1 | (_1272 ? 2 : 0)) | (_1273 ? 4 : 0)) | ((_1272 && _1273) ? 8 : 0)) << uint64_t(_1225 * 4), (!_1286) && (_1223 != _1225));
    int _1294 = int(roundEven(gl_FragCoord.z));
    vec2 _1295 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1298 = imageSize(_27).xy & ivec2(15);
    float _1302 = exp2(gl_FragCoord.z);
    vec2 _1305 = textureQueryLod(sampler2DArray(_16, _36), _1295 * subgroupQuadBroadcast(_1302, 0u));
    float _1306 = _1305.x;
    int _1307 = int(_1306);
    int _1309 = int(_1306 + 0.9970703125);
    vec2 _1314 = abs(dFdx(_1295));
    vec2 _1315 = abs(dFdy(_1295));
    vec2 _1323 = vec2(max(_1314.x, _1315.x), max(_1314.y, _1315.y)) * _1302;
    vec2 _1324 = fract(_1295);
    vec2 _1325 = vec2(textureSize(_16, _1307).xy);
    ivec2 _1328 = -_1298;
    vec2 _1330 = _1324 * ldexp(_1325, _1328);
    ResType _1333;
    _1333._m0 = frexp((_1323 * _1325) - vec2(0.00390625), _1333._m1);
    vec2 _1338 = min(ldexp(vec2(0.5), clamp(_1333._m1, ivec2(0), ivec2(4)) + _1328), vec2(0.5));
    ivec2 _1342 = ivec2(max(_1330 - _1338, vec2(0.0)));
    bvec2 _1344 = notEqual(_1342, ivec2(_1330 + _1338));
    bool _1345 = _1344.x;
    bool _1346 = _1344.y;
    bool _1359 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1342, _1294), uint64_t(((1 | (_1345 ? 2 : 0)) | (_1346 ? 4 : 0)) | ((_1345 && _1346) ? 8 : 0)) << uint64_t(_1307 * 4), !_1359);
    vec2 _1362 = vec2(textureSize(_16, _1309).xy);
    ivec2 _1365 = -_1298;
    vec2 _1367 = _1324 * ldexp(_1362, _1365);
    ResType _1370;
    _1370._m0 = frexp((_1323 * _1362) - vec2(0.00390625), _1370._m1);
    vec2 _1375 = min(ldexp(vec2(0.5), clamp(_1370._m1, ivec2(0), ivec2(4)) + _1365), vec2(0.5));
    ivec2 _1379 = ivec2(max(_1367 - _1375, vec2(0.0)));
    bvec2 _1381 = notEqual(_1379, ivec2(_1367 + _1375));
    bool _1382 = _1381.x;
    bool _1383 = _1381.y;
    bool _1396 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1379, _1294), uint64_t(((1 | (_1382 ? 2 : 0)) | (_1383 ? 4 : 0)) | ((_1382 && _1383) ? 8 : 0)) << uint64_t(_1309 * 4), (!_1396) && (_1307 != _1309));
    int _1404 = int(roundEven(gl_FragCoord.z));
    vec2 _1405 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1408 = imageSize(_27).xy & ivec2(15);
    float _1412 = exp2(_74);
    float _1418 = min(max(textureQueryLod(sampler2DArray(_16, _36), _1405 * subgroupQuadBroadcast(_1412, 0u)).x, CLAMP), 14.0);
    int _1419 = int(_1418);
    int _1421 = int(_1418 + 0.9970703125);
    vec2 _1426 = abs(dFdx(_1405));
    vec2 _1427 = abs(dFdy(_1405));
    vec2 _1435 = vec2(max(_1426.x, _1427.x), max(_1426.y, _1427.y)) * _1412;
    vec2 _1436 = fract(_1405);
    vec2 _1437 = vec2(textureSize(_16, _1419).xy);
    ivec2 _1440 = -_1408;
    vec2 _1442 = _1436 * ldexp(_1437, _1440);
    ResType _1445;
    _1445._m0 = frexp((_1435 * _1437) - vec2(0.00390625), _1445._m1);
    vec2 _1450 = min(ldexp(vec2(0.5), clamp(_1445._m1, ivec2(0), ivec2(4)) + _1440), vec2(0.5));
    ivec2 _1454 = ivec2(max(_1442 - _1450, vec2(0.0)));
    bvec2 _1456 = notEqual(_1454, ivec2(_1442 + _1450));
    bool _1457 = _1456.x;
    bool _1458 = _1456.y;
    bool _1471 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1454, _1404), uint64_t(((1 | (_1457 ? 2 : 0)) | (_1458 ? 4 : 0)) | ((_1457 && _1458) ? 8 : 0)) << uint64_t(_1419 * 4), !_1471);
    vec2 _1474 = vec2(textureSize(_16, _1421).xy);
    ivec2 _1477 = -_1408;
    vec2 _1479 = _1436 * ldexp(_1474, _1477);
    ResType _1482;
    _1482._m0 = frexp((_1435 * _1474) - vec2(0.00390625), _1482._m1);
    vec2 _1487 = min(ldexp(vec2(0.5), clamp(_1482._m1, ivec2(0), ivec2(4)) + _1477), vec2(0.5));
    ivec2 _1491 = ivec2(max(_1479 - _1487, vec2(0.0)));
    bvec2 _1493 = notEqual(_1491, ivec2(_1479 + _1487));
    bool _1494 = _1493.x;
    bool _1495 = _1493.y;
    bool _1508 = helperInvocationEXT();
    WriteFeedbackArray(_27, ivec3(_1491, _1404), uint64_t(((1 | (_1494 ? 2 : 0)) | (_1495 ? 4 : 0)) | ((_1494 && _1495) ? 8 : 0)) << uint64_t(_1421 * 4), (!_1508) && (_1419 != _1421));
    uint _1512 = IDX + 0u;
    uint _1515 = IDX + 0u;
    uint _1518 = IDX + 0u;
    vec2 _1521 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1523 = imageSize(_30[nonuniformEXT(_1512)]) & ivec2(15);
    vec2 _1527 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1515], _39[_1518])), _1521);
    float _1528 = _1527.x;
    int _1529 = int(_1528);
    int _1531 = int(_1528 + 0.9970703125);
    vec2 _1536 = abs(dFdx(_1521));
    vec2 _1537 = abs(dFdy(_1521));
    vec2 _1544 = vec2(max(_1536.x, _1537.x), max(_1536.y, _1537.y));
    vec2 _1545 = fract(_1521);
    vec2 _1546 = vec2(textureSize(_19[nonuniformEXT(_1515)], _1529));
    ivec2 _1548 = -_1523;
    vec2 _1550 = _1545 * ldexp(_1546, _1548);
    ResType _1553;
    _1553._m0 = frexp((_1544 * _1546) - vec2(0.00390625), _1553._m1);
    vec2 _1558 = min(ldexp(vec2(0.5), clamp(_1553._m1, ivec2(0), ivec2(4)) + _1548), vec2(0.5));
    ivec2 _1562 = ivec2(max(_1550 - _1558, vec2(0.0)));
    bvec2 _1564 = notEqual(_1562, ivec2(_1550 + _1558));
    bool _1565 = _1564.x;
    bool _1566 = _1564.y;
    bool _1578 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1512], _1562, uint64_t(((1 | (_1565 ? 2 : 0)) | (_1566 ? 4 : 0)) | ((_1565 && _1566) ? 8 : 0)) << uint64_t(_1529 * 4), !_1578);
    vec2 _1606 = vec2(textureSize(_19[nonuniformEXT(_1515)], _1531));
    ivec2 _1608 = -_1523;
    vec2 _1610 = _1545 * ldexp(_1606, _1608);
    ResType _1613;
    _1613._m0 = frexp((_1544 * _1606) - vec2(0.00390625), _1613._m1);
    vec2 _1618 = min(ldexp(vec2(0.5), clamp(_1613._m1, ivec2(0), ivec2(4)) + _1608), vec2(0.5));
    ivec2 _1622 = ivec2(max(_1610 - _1618, vec2(0.0)));
    bvec2 _1624 = notEqual(_1622, ivec2(_1610 + _1618));
    bool _1625 = _1624.x;
    bool _1626 = _1624.y;
    bool _1638 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1512], _1622, uint64_t(((1 | (_1625 ? 2 : 0)) | (_1626 ? 4 : 0)) | ((_1625 && _1626) ? 8 : 0)) << uint64_t(_1531 * 4), (!_1638) && (_1529 != _1531));
    uint _1642 = IDX + 0u;
    uint _1645 = IDX + 0u;
    int _1651 = int(roundEven(gl_FragCoord.z));
    vec2 _1652 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1655 = imageSize(_33[nonuniformEXT(_1642)]).xy & ivec2(15);
    vec2 _1659 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1645], _39[_1518])), _1652);
    float _1660 = _1659.x;
    int _1661 = int(_1660);
    int _1663 = int(_1660 + 0.9970703125);
    vec2 _1668 = abs(dFdx(_1652));
    vec2 _1669 = abs(dFdy(_1652));
    vec2 _1676 = vec2(max(_1668.x, _1669.x), max(_1668.y, _1669.y));
    vec2 _1677 = fract(_1652);
    vec2 _1678 = vec2(textureSize(_22[nonuniformEXT(_1645)], _1661).xy);
    ivec2 _1681 = -_1655;
    vec2 _1683 = _1677 * ldexp(_1678, _1681);
    ResType _1686;
    _1686._m0 = frexp((_1676 * _1678) - vec2(0.00390625), _1686._m1);
    vec2 _1691 = min(ldexp(vec2(0.5), clamp(_1686._m1, ivec2(0), ivec2(4)) + _1681), vec2(0.5));
    ivec2 _1695 = ivec2(max(_1683 - _1691, vec2(0.0)));
    bvec2 _1697 = notEqual(_1695, ivec2(_1683 + _1691));
    bool _1698 = _1697.x;
    bool _1699 = _1697.y;
    bool _1712 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1642], ivec3(_1695, _1651), uint64_t(((1 | (_1698 ? 2 : 0)) | (_1699 ? 4 : 0)) | ((_1698 && _1699) ? 8 : 0)) << uint64_t(_1661 * 4), !_1712);
    vec2 _1740 = vec2(textureSize(_22[nonuniformEXT(_1645)], _1663).xy);
    ivec2 _1743 = -_1655;
    vec2 _1745 = _1677 * ldexp(_1740, _1743);
    ResType _1748;
    _1748._m0 = frexp((_1676 * _1740) - vec2(0.00390625), _1748._m1);
    vec2 _1753 = min(ldexp(vec2(0.5), clamp(_1748._m1, ivec2(0), ivec2(4)) + _1743), vec2(0.5));
    ivec2 _1757 = ivec2(max(_1745 - _1753, vec2(0.0)));
    bvec2 _1759 = notEqual(_1757, ivec2(_1745 + _1753));
    bool _1760 = _1759.x;
    bool _1761 = _1759.y;
    bool _1774 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1642], ivec3(_1757, _1651), uint64_t(((1 | (_1760 ? 2 : 0)) | (_1761 ? 4 : 0)) | ((_1760 && _1761) ? 8 : 0)) << uint64_t(_1663 * 4), (!_1774) && (_1661 != _1663));
    vec2 _1784 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1786 = imageSize(_30[nonuniformEXT(_1512)]) & ivec2(15);
    vec2 _1790 = textureQueryLod(nonuniformEXT(sampler2D(_19[_1515], _39[_1518])), _1784);
    float _1791 = _1790.x;
    int _1792 = int(_1791);
    int _1794 = int(_1791 + 0.9970703125);
    vec2 _1799 = abs(dFdx(_1784));
    vec2 _1800 = abs(dFdy(_1784));
    vec2 _1807 = vec2(max(_1799.x, _1800.x), max(_1799.y, _1800.y));
    vec2 _1808 = fract(_1784);
    vec2 _1809 = vec2(textureSize(_19[nonuniformEXT(_1515)], _1792));
    ivec2 _1811 = -_1786;
    vec2 _1813 = _1808 * ldexp(_1809, _1811);
    ResType _1816;
    _1816._m0 = frexp((_1807 * _1809) - vec2(0.00390625), _1816._m1);
    vec2 _1821 = min(ldexp(vec2(0.5), clamp(_1816._m1, ivec2(0), ivec2(4)) + _1811), vec2(0.5));
    ivec2 _1825 = ivec2(max(_1813 - _1821, vec2(0.0)));
    bvec2 _1827 = notEqual(_1825, ivec2(_1813 + _1821));
    bool _1828 = _1827.x;
    bool _1829 = _1827.y;
    bool _1841 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1512], _1825, uint64_t(((1 | (_1828 ? 2 : 0)) | (_1829 ? 4 : 0)) | ((_1828 && _1829) ? 8 : 0)) << uint64_t(_1792 * 4), !_1841);
    vec2 _1844 = vec2(textureSize(_19[nonuniformEXT(_1515)], _1794));
    ivec2 _1846 = -_1786;
    vec2 _1848 = _1808 * ldexp(_1844, _1846);
    ResType _1851;
    _1851._m0 = frexp((_1807 * _1844) - vec2(0.00390625), _1851._m1);
    vec2 _1856 = min(ldexp(vec2(0.5), clamp(_1851._m1, ivec2(0), ivec2(4)) + _1846), vec2(0.5));
    ivec2 _1860 = ivec2(max(_1848 - _1856, vec2(0.0)));
    bvec2 _1862 = notEqual(_1860, ivec2(_1848 + _1856));
    bool _1863 = _1862.x;
    bool _1864 = _1862.y;
    bool _1876 = helperInvocationEXT();
    WriteFeedbackNonUniform(_30[_1512], _1860, uint64_t(((1 | (_1863 ? 2 : 0)) | (_1864 ? 4 : 0)) | ((_1863 && _1864) ? 8 : 0)) << uint64_t(_1794 * 4), (!_1876) && (_1792 != _1794));
    int _1887 = int(roundEven(gl_FragCoord.z));
    vec2 _1888 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1891 = imageSize(_33[nonuniformEXT(_1642)]).xy & ivec2(15);
    vec2 _1895 = textureQueryLod(nonuniformEXT(sampler2DArray(_22[_1645], _39[_1518])), _1888);
    float _1896 = _1895.x;
    int _1897 = int(_1896);
    int _1899 = int(_1896 + 0.9970703125);
    vec2 _1904 = abs(dFdx(_1888));
    vec2 _1905 = abs(dFdy(_1888));
    vec2 _1912 = vec2(max(_1904.x, _1905.x), max(_1904.y, _1905.y));
    vec2 _1913 = fract(_1888);
    vec2 _1914 = vec2(textureSize(_22[nonuniformEXT(_1645)], _1897).xy);
    ivec2 _1917 = -_1891;
    vec2 _1919 = _1913 * ldexp(_1914, _1917);
    ResType _1922;
    _1922._m0 = frexp((_1912 * _1914) - vec2(0.00390625), _1922._m1);
    vec2 _1927 = min(ldexp(vec2(0.5), clamp(_1922._m1, ivec2(0), ivec2(4)) + _1917), vec2(0.5));
    ivec2 _1931 = ivec2(max(_1919 - _1927, vec2(0.0)));
    bvec2 _1933 = notEqual(_1931, ivec2(_1919 + _1927));
    bool _1934 = _1933.x;
    bool _1935 = _1933.y;
    bool _1948 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1642], ivec3(_1931, _1887), uint64_t(((1 | (_1934 ? 2 : 0)) | (_1935 ? 4 : 0)) | ((_1934 && _1935) ? 8 : 0)) << uint64_t(_1897 * 4), !_1948);
    vec2 _1951 = vec2(textureSize(_22[nonuniformEXT(_1645)], _1899).xy);
    ivec2 _1954 = -_1891;
    vec2 _1956 = _1913 * ldexp(_1951, _1954);
    ResType _1959;
    _1959._m0 = frexp((_1912 * _1951) - vec2(0.00390625), _1959._m1);
    vec2 _1964 = min(ldexp(vec2(0.5), clamp(_1959._m1, ivec2(0), ivec2(4)) + _1954), vec2(0.5));
    ivec2 _1968 = ivec2(max(_1956 - _1964, vec2(0.0)));
    bvec2 _1970 = notEqual(_1968, ivec2(_1956 + _1964));
    bool _1971 = _1970.x;
    bool _1972 = _1970.y;
    bool _1985 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_33[_1642], ivec3(_1968, _1887), uint64_t(((1 | (_1971 ? 2 : 0)) | (_1972 ? 4 : 0)) | ((_1971 && _1972) ? 8 : 0)) << uint64_t(_1899 * 4), (!_1985) && (_1897 != _1899));
    vec2 _1993 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1995 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _1999 = textureQueryLod(sampler2D(_13, _36), _1993);
    float _2000 = _1999.x;
    int _2001 = int(_2000);
    int _2003 = int(_2000 + 0.9970703125);
    vec2 _2008 = abs(dFdx(_1993));
    vec2 _2009 = abs(dFdy(_1993));
    vec2 _2016 = vec2(max(_2008.x, _2009.x), max(_2008.y, _2009.y));
    vec2 _2017 = fract(_1993);
    vec2 _2018 = vec2(textureSize(_13, _2001));
    ivec2 _2020 = -_1995;
    vec2 _2022 = _2017 * ldexp(_2018, _2020);
    ResType _2025;
    _2025._m0 = frexp((_2016 * _2018) - vec2(0.00390625), _2025._m1);
    vec2 _2030 = min(ldexp(vec2(0.5), clamp(_2025._m1, ivec2(0), ivec2(4)) + _2020), vec2(0.5));
    ivec2 _2034 = ivec2(max(_2022 - _2030, vec2(0.0)));
    bvec2 _2036 = notEqual(_2034, ivec2(_2022 + _2030));
    bool _2037 = _2036.x;
    bool _2038 = _2036.y;
    bool _2050 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2034, uint64_t(((1 | (_2037 ? 2 : 0)) | (_2038 ? 4 : 0)) | ((_2037 && _2038) ? 8 : 0)) << uint64_t(_2001 * 4), !_2050);
    vec2 _2053 = vec2(textureSize(_13, _2003));
    ivec2 _2055 = -_1995;
    vec2 _2057 = _2017 * ldexp(_2053, _2055);
    ResType _2060;
    _2060._m0 = frexp((_2016 * _2053) - vec2(0.00390625), _2060._m1);
    vec2 _2065 = min(ldexp(vec2(0.5), clamp(_2060._m1, ivec2(0), ivec2(4)) + _2055), vec2(0.5));
    ivec2 _2069 = ivec2(max(_2057 - _2065, vec2(0.0)));
    bvec2 _2071 = notEqual(_2069, ivec2(_2057 + _2065));
    bool _2072 = _2071.x;
    bool _2073 = _2071.y;
    bool _2085 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2069, uint64_t(((1 | (_2072 ? 2 : 0)) | (_2073 ? 4 : 0)) | ((_2072 && _2073) ? 8 : 0)) << uint64_t(_2003 * 4), (!_2085) && (_2001 != _2003));
    vec2 _2091 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _2093 = imageSize(_9[nonuniformEXT(IDX)]) & ivec2(15);
    vec2 _2097 = textureQueryLod(sampler2D(_13, _36), _2091);
    float _2098 = _2097.x;
    int _2099 = int(_2098);
    int _2101 = int(_2098 + 0.9970703125);
    vec2 _2106 = abs(dFdx(_2091));
    vec2 _2107 = abs(dFdy(_2091));
    vec2 _2114 = vec2(max(_2106.x, _2107.x), max(_2106.y, _2107.y));
    vec2 _2115 = fract(_2091);
    vec2 _2116 = vec2(textureSize(_13, _2099));
    ivec2 _2118 = -_2093;
    vec2 _2120 = _2115 * ldexp(_2116, _2118);
    ResType _2123;
    _2123._m0 = frexp((_2114 * _2116) - vec2(0.00390625), _2123._m1);
    vec2 _2128 = min(ldexp(vec2(0.5), clamp(_2123._m1, ivec2(0), ivec2(4)) + _2118), vec2(0.5));
    ivec2 _2132 = ivec2(max(_2120 - _2128, vec2(0.0)));
    bvec2 _2134 = notEqual(_2132, ivec2(_2120 + _2128));
    bool _2135 = _2134.x;
    bool _2136 = _2134.y;
    bool _2148 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2132, uint64_t(((1 | (_2135 ? 2 : 0)) | (_2136 ? 4 : 0)) | ((_2135 && _2136) ? 8 : 0)) << uint64_t(_2099 * 4), !_2148);
    vec2 _2151 = vec2(textureSize(_13, _2101));
    ivec2 _2153 = -_2093;
    vec2 _2155 = _2115 * ldexp(_2151, _2153);
    ResType _2158;
    _2158._m0 = frexp((_2114 * _2151) - vec2(0.00390625), _2158._m1);
    vec2 _2163 = min(ldexp(vec2(0.5), clamp(_2158._m1, ivec2(0), ivec2(4)) + _2153), vec2(0.5));
    ivec2 _2167 = ivec2(max(_2155 - _2163, vec2(0.0)));
    bvec2 _2169 = notEqual(_2167, ivec2(_2155 + _2163));
    bool _2170 = _2169.x;
    bool _2171 = _2169.y;
    bool _2183 = helperInvocationEXT();
    WriteFeedbackNonUniform(_9[IDX], _2167, uint64_t(((1 | (_2170 ? 2 : 0)) | (_2171 ? 4 : 0)) | ((_2170 && _2171) ? 8 : 0)) << uint64_t(_2101 * 4), (!_2183) && (_2099 != _2101));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 2188
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
%79 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
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
OpName %856 "WriteFeedbackArray"
OpName %852 "img"
OpName %853 "coord"
OpName %854 "value"
OpName %855 "active_lane"
OpName %867 "is_done"
OpName %1584 "WriteFeedbackNonUniform"
OpName %1580 "img"
OpName %1581 "coord"
OpName %1582 "value"
OpName %1583 "active_lane"
OpName %1595 "is_done"
OpName %1718 "WriteFeedbackArrayNonUniform"
OpName %1714 "img"
OpName %1715 "coord"
OpName %1716 "value"
OpName %1717 "active_lane"
OpName %1729 "is_done"
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
OpDecorate %1512 NonUniform
OpDecorate %1514 NonUniform
OpDecorate %1515 NonUniform
OpDecorate %1517 NonUniform
OpDecorate %1518 NonUniform
OpDecorate %1520 NonUniform
OpDecorate %1526 NonUniform
OpDecorate %1603 NonUniform
OpDecorate %1642 NonUniform
OpDecorate %1644 NonUniform
OpDecorate %1645 NonUniform
OpDecorate %1647 NonUniform
OpDecorate %1649 NonUniform
OpDecorate %1658 NonUniform
OpDecorate %1737 NonUniform
OpDecorate %1779 NonUniform
OpDecorate %1781 NonUniform
OpDecorate %1783 NonUniform
OpDecorate %1789 NonUniform
OpDecorate %1881 NonUniform
OpDecorate %1883 NonUniform
OpDecorate %1885 NonUniform
OpDecorate %1894 NonUniform
OpDecorate %52 NonUniform
OpDecorate %1990 NonUniform
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
%190 = OpConstant %49 5
%241 = OpConstant %10 14
%787 = OpTypeVector %81 3
%793 = OpTypeSampledImage %14
%850 = OpTypeVector %80 3
%851 = OpTypeFunction %1 %26 %787 %5 %80
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %2187
%2187 = OpLabel
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
%224 = OpIsHelperInvocationEXT %80
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
%291 = OpIsHelperInvocationEXT %80
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
%326 = OpIsHelperInvocationEXT %80
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
%371 = OpIsHelperInvocationEXT %80
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
%399 = OpIsHelperInvocationEXT %80
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
%455 = OpIsHelperInvocationEXT %80
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
%483 = OpIsHelperInvocationEXT %80
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
%541 = OpIsHelperInvocationEXT %80
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
%569 = OpIsHelperInvocationEXT %80
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
%637 = OpIsHelperInvocationEXT %80
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
%672 = OpIsHelperInvocationEXT %80
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
%742 = OpIsHelperInvocationEXT %80
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
%777 = OpIsHelperInvocationEXT %80
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
%848 = OpIsHelperInvocationEXT %80
%849 = OpLogicalNot %80 %848
%877 = OpFunctionCall %1 %856 %27 %847 %846 %849
%879 = OpImageQuerySizeLod %787 %782 %799
%880 = OpVectorShuffle %83 %879 %879 0 1
%878 = OpConvertSToF %43 %880
%881 = OpSNegate %83 %790
%882 = OpExtInst %43 %79 Ldexp %878 %881
%883 = OpFMul %43 %813 %882
%884 = OpFMul %43 %812 %878
%885 = OpFSub %43 %884 %122
%886 = OpExtInst %123 %79 FrexpStruct %885
%887 = OpCompositeExtract %83 %886 1
%888 = OpExtInst %83 %79 SClamp %887 %128 %130
%889 = OpIAdd %83 %888 %881
%890 = OpExtInst %43 %79 Ldexp %134 %889
%891 = OpExtInst %43 %79 FMin %890 %134
%892 = OpFSub %43 %883 %891
%893 = OpExtInst %43 %79 FMax %892 %139
%894 = OpFAdd %43 %883 %891
%895 = OpConvertFToS %83 %893
%896 = OpConvertFToS %83 %894
%897 = OpINotEqual %82 %895 %896
%898 = OpCompositeExtract %80 %897 0
%899 = OpCompositeExtract %80 %897 1
%900 = OpLogicalAnd %80 %898 %899
%901 = OpSelect %81 %898 %148 %127
%902 = OpBitwiseOr %81 %91 %901
%903 = OpSelect %81 %899 %129 %127
%904 = OpBitwiseOr %81 %902 %903
%905 = OpSelect %81 %900 %153 %127
%906 = OpBitwiseOr %81 %904 %905
%907 = OpSConvert %5 %906
%908 = OpIMul %81 %799 %129
%909 = OpSConvert %5 %908
%910 = OpShiftLeftLogical %5 %907 %909
%911 = OpCompositeConstruct %787 %895 %785
%912 = OpIsHelperInvocationEXT %80
%913 = OpLogicalNot %80 %912
%914 = OpLogicalAnd %80 %913 %801
%915 = OpFunctionCall %1 %856 %27 %911 %910 %914
%916 = OpLoad %25 %27
%917 = OpLoad %14 %16
%918 = OpLoad %34 %36
%919 = OpExtInst %10 %79 RoundEven %70
%920 = OpConvertFToS %81 %919
%921 = OpCompositeConstruct %43 %65 %67
%922 = OpImageQuerySize %787 %916
%923 = OpVectorShuffle %83 %922 %922 0 1
%924 = OpBitwiseAnd %83 %923 %88
%925 = OpImageQueryLevels %81 %917
%926 = OpISub %81 %925 %91
%927 = OpSampledImage %793 %917 %918
%928 = OpImageQueryLod %43 %927 %921
%929 = OpCompositeExtract %10 %928 0
%930 = OpExtInst %10 %79 FMax %929 %53
%931 = OpExtInst %10 %79 FMin %930 %241
%932 = OpConvertFToS %81 %931
%933 = OpFAdd %10 %931 %98
%934 = OpConvertFToS %81 %933
%935 = OpExtInst %81 %79 SMin %934 %926
%936 = OpINotEqual %80 %932 %934
%937 = OpDPdx %43 %921
%938 = OpDPdy %43 %921
%939 = OpExtInst %43 %79 FAbs %937
%940 = OpExtInst %43 %79 FAbs %938
%941 = OpCompositeExtract %10 %939 0
%942 = OpCompositeExtract %10 %940 0
%943 = OpCompositeExtract %10 %939 1
%944 = OpCompositeExtract %10 %940 1
%945 = OpExtInst %10 %79 FMax %941 %942
%946 = OpExtInst %10 %79 FMax %943 %944
%947 = OpCompositeConstruct %43 %945 %946
%948 = OpExtInst %43 %79 Fract %921
%950 = OpImageQuerySizeLod %787 %917 %932
%951 = OpVectorShuffle %83 %950 %950 0 1
%949 = OpConvertSToF %43 %951
%952 = OpSNegate %83 %924
%953 = OpExtInst %43 %79 Ldexp %949 %952
%954 = OpFMul %43 %948 %953
%955 = OpFMul %43 %947 %949
%956 = OpFSub %43 %955 %122
%957 = OpExtInst %123 %79 FrexpStruct %956
%958 = OpCompositeExtract %83 %957 1
%959 = OpExtInst %83 %79 SClamp %958 %128 %130
%960 = OpIAdd %83 %959 %952
%961 = OpExtInst %43 %79 Ldexp %134 %960
%962 = OpExtInst %43 %79 FMin %961 %134
%963 = OpFSub %43 %954 %962
%964 = OpExtInst %43 %79 FMax %963 %139
%965 = OpFAdd %43 %954 %962
%966 = OpConvertFToS %83 %964
%967 = OpConvertFToS %83 %965
%968 = OpINotEqual %82 %966 %967
%969 = OpCompositeExtract %80 %968 0
%970 = OpCompositeExtract %80 %968 1
%971 = OpLogicalAnd %80 %969 %970
%972 = OpSelect %81 %969 %148 %127
%973 = OpBitwiseOr %81 %91 %972
%974 = OpSelect %81 %970 %129 %127
%975 = OpBitwiseOr %81 %973 %974
%976 = OpSelect %81 %971 %153 %127
%977 = OpBitwiseOr %81 %975 %976
%978 = OpSConvert %5 %977
%979 = OpIMul %81 %932 %129
%980 = OpSConvert %5 %979
%981 = OpShiftLeftLogical %5 %978 %980
%982 = OpCompositeConstruct %787 %966 %920
%983 = OpIsHelperInvocationEXT %80
%984 = OpLogicalNot %80 %983
%985 = OpFunctionCall %1 %856 %27 %982 %981 %984
%987 = OpImageQuerySizeLod %787 %917 %934
%988 = OpVectorShuffle %83 %987 %987 0 1
%986 = OpConvertSToF %43 %988
%989 = OpSNegate %83 %924
%990 = OpExtInst %43 %79 Ldexp %986 %989
%991 = OpFMul %43 %948 %990
%992 = OpFMul %43 %947 %986
%993 = OpFSub %43 %992 %122
%994 = OpExtInst %123 %79 FrexpStruct %993
%995 = OpCompositeExtract %83 %994 1
%996 = OpExtInst %83 %79 SClamp %995 %128 %130
%997 = OpIAdd %83 %996 %989
%998 = OpExtInst %43 %79 Ldexp %134 %997
%999 = OpExtInst %43 %79 FMin %998 %134
%1000 = OpFSub %43 %991 %999
%1001 = OpExtInst %43 %79 FMax %1000 %139
%1002 = OpFAdd %43 %991 %999
%1003 = OpConvertFToS %83 %1001
%1004 = OpConvertFToS %83 %1002
%1005 = OpINotEqual %82 %1003 %1004
%1006 = OpCompositeExtract %80 %1005 0
%1007 = OpCompositeExtract %80 %1005 1
%1008 = OpLogicalAnd %80 %1006 %1007
%1009 = OpSelect %81 %1006 %148 %127
%1010 = OpBitwiseOr %81 %91 %1009
%1011 = OpSelect %81 %1007 %129 %127
%1012 = OpBitwiseOr %81 %1010 %1011
%1013 = OpSelect %81 %1008 %153 %127
%1014 = OpBitwiseOr %81 %1012 %1013
%1015 = OpSConvert %5 %1014
%1016 = OpIMul %81 %934 %129
%1017 = OpSConvert %5 %1016
%1018 = OpShiftLeftLogical %5 %1015 %1017
%1019 = OpCompositeConstruct %787 %1003 %920
%1020 = OpIsHelperInvocationEXT %80
%1021 = OpLogicalNot %80 %1020
%1022 = OpLogicalAnd %80 %1021 %936
%1023 = OpFunctionCall %1 %856 %27 %1019 %1018 %1022
%1024 = OpLoad %25 %27
%1025 = OpLoad %14 %16
%1026 = OpLoad %34 %36
%1027 = OpExtInst %10 %79 RoundEven %70
%1028 = OpConvertFToS %81 %1027
%1029 = OpCompositeConstruct %43 %65 %67
%1030 = OpImageQuerySize %787 %1024
%1031 = OpVectorShuffle %83 %1030 %1030 0 1
%1032 = OpBitwiseAnd %83 %1031 %88
%1033 = OpImageQueryLevels %81 %1025
%1034 = OpISub %81 %1033 %91
%1035 = OpConvertSToF %10 %1034
%1036 = OpExtInst %10 %79 NClamp %74 %138 %1035
%1037 = OpConvertFToS %81 %1036
%1038 = OpFAdd %10 %1036 %98
%1039 = OpConvertFToS %81 %1038
%1040 = OpExtInst %81 %79 SMin %1039 %1034
%1041 = OpINotEqual %80 %1037 %1039
%1042 = OpExtInst %43 %79 Fract %1029
%1044 = OpImageQuerySizeLod %787 %1025 %1037
%1045 = OpVectorShuffle %83 %1044 %1044 0 1
%1043 = OpConvertSToF %43 %1045
%1046 = OpSNegate %83 %1032
%1047 = OpExtInst %43 %79 Ldexp %1043 %1046
%1048 = OpFMul %43 %1042 %1047
%1049 = OpExtInst %43 %79 Ldexp %134 %1046
%1050 = OpFSub %43 %1048 %1049
%1051 = OpExtInst %43 %79 FMax %1050 %139
%1052 = OpFAdd %43 %1048 %1049
%1053 = OpConvertFToS %83 %1051
%1054 = OpConvertFToS %83 %1052
%1055 = OpINotEqual %82 %1053 %1054
%1056 = OpCompositeExtract %80 %1055 0
%1057 = OpCompositeExtract %80 %1055 1
%1058 = OpLogicalAnd %80 %1056 %1057
%1059 = OpSelect %81 %1056 %148 %127
%1060 = OpBitwiseOr %81 %91 %1059
%1061 = OpSelect %81 %1057 %129 %127
%1062 = OpBitwiseOr %81 %1060 %1061
%1063 = OpSelect %81 %1058 %153 %127
%1064 = OpBitwiseOr %81 %1062 %1063
%1065 = OpSConvert %5 %1064
%1066 = OpIMul %81 %1037 %129
%1067 = OpSConvert %5 %1066
%1068 = OpShiftLeftLogical %5 %1065 %1067
%1069 = OpCompositeConstruct %787 %1053 %1028
%1070 = OpIsHelperInvocationEXT %80
%1071 = OpLogicalNot %80 %1070
%1072 = OpFunctionCall %1 %856 %27 %1069 %1068 %1071
%1074 = OpImageQuerySizeLod %787 %1025 %1039
%1075 = OpVectorShuffle %83 %1074 %1074 0 1
%1073 = OpConvertSToF %43 %1075
%1076 = OpSNegate %83 %1032
%1077 = OpExtInst %43 %79 Ldexp %1073 %1076
%1078 = OpFMul %43 %1042 %1077
%1079 = OpExtInst %43 %79 Ldexp %134 %1076
%1080 = OpFSub %43 %1078 %1079
%1081 = OpExtInst %43 %79 FMax %1080 %139
%1082 = OpFAdd %43 %1078 %1079
%1083 = OpConvertFToS %83 %1081
%1084 = OpConvertFToS %83 %1082
%1085 = OpINotEqual %82 %1083 %1084
%1086 = OpCompositeExtract %80 %1085 0
%1087 = OpCompositeExtract %80 %1085 1
%1088 = OpLogicalAnd %80 %1086 %1087
%1089 = OpSelect %81 %1086 %148 %127
%1090 = OpBitwiseOr %81 %91 %1089
%1091 = OpSelect %81 %1087 %129 %127
%1092 = OpBitwiseOr %81 %1090 %1091
%1093 = OpSelect %81 %1088 %153 %127
%1094 = OpBitwiseOr %81 %1092 %1093
%1095 = OpSConvert %5 %1094
%1096 = OpIMul %81 %1039 %129
%1097 = OpSConvert %5 %1096
%1098 = OpShiftLeftLogical %5 %1095 %1097
%1099 = OpCompositeConstruct %787 %1083 %1028
%1100 = OpIsHelperInvocationEXT %80
%1101 = OpLogicalNot %80 %1100
%1102 = OpLogicalAnd %80 %1101 %1041
%1103 = OpFunctionCall %1 %856 %27 %1099 %1098 %1102
%1104 = OpLoad %25 %27
%1105 = OpLoad %14 %16
%1106 = OpLoad %34 %36
%1107 = OpExtInst %10 %79 RoundEven %70
%1108 = OpConvertFToS %81 %1107
%1109 = OpCompositeConstruct %43 %65 %67
%1110 = OpImageQuerySize %787 %1104
%1111 = OpVectorShuffle %83 %1110 %1110 0 1
%1112 = OpBitwiseAnd %83 %1111 %88
%1113 = OpImageQueryLevels %81 %1105
%1114 = OpISub %81 %1113 %91
%1116 = OpImageQuerySizeLod %787 %1105 %127
%1117 = OpVectorShuffle %83 %1116 %1116 0 1
%1115 = OpConvertSToF %43 %1117
%1118 = OpCompositeConstruct %43 %61 %63
%1119 = OpCompositeConstruct %43 %56 %59
%1120 = OpFMul %43 %1115 %1118
%1121 = OpFMul %43 %1115 %1119
%1122 = OpDot %10 %1120 %1120
%1123 = OpDot %10 %1121 %1121
%1124 = OpExtInst %10 %79 FMax %1122 %1123
%1125 = OpExtInst %10 %79 Log2 %1124
%1126 = OpFMul %10 %1125 %133
%1127 = OpConvertSToF %10 %1114
%1128 = OpExtInst %10 %79 NClamp %1126 %138 %1127
%1129 = OpConvertFToS %81 %1128
%1130 = OpFAdd %10 %1128 %98
%1131 = OpConvertFToS %81 %1130
%1132 = OpExtInst %81 %79 SMin %1131 %1114
%1133 = OpINotEqual %80 %1129 %1131
%1134 = OpExtInst %43 %79 Fract %1109
%1136 = OpImageQuerySizeLod %787 %1105 %1129
%1137 = OpVectorShuffle %83 %1136 %1136 0 1
%1135 = OpConvertSToF %43 %1137
%1138 = OpSNegate %83 %1112
%1139 = OpExtInst %43 %79 Ldexp %1135 %1138
%1140 = OpFMul %43 %1134 %1139
%1141 = OpExtInst %43 %79 Ldexp %134 %1138
%1142 = OpFSub %43 %1140 %1141
%1143 = OpExtInst %43 %79 FMax %1142 %139
%1144 = OpFAdd %43 %1140 %1141
%1145 = OpConvertFToS %83 %1143
%1146 = OpConvertFToS %83 %1144
%1147 = OpINotEqual %82 %1145 %1146
%1148 = OpCompositeExtract %80 %1147 0
%1149 = OpCompositeExtract %80 %1147 1
%1150 = OpLogicalAnd %80 %1148 %1149
%1151 = OpSelect %81 %1148 %148 %127
%1152 = OpBitwiseOr %81 %91 %1151
%1153 = OpSelect %81 %1149 %129 %127
%1154 = OpBitwiseOr %81 %1152 %1153
%1155 = OpSelect %81 %1150 %153 %127
%1156 = OpBitwiseOr %81 %1154 %1155
%1157 = OpSConvert %5 %1156
%1158 = OpIMul %81 %1129 %129
%1159 = OpSConvert %5 %1158
%1160 = OpShiftLeftLogical %5 %1157 %1159
%1161 = OpCompositeConstruct %787 %1145 %1108
%1162 = OpIsHelperInvocationEXT %80
%1163 = OpLogicalNot %80 %1162
%1164 = OpFunctionCall %1 %856 %27 %1161 %1160 %1163
%1166 = OpImageQuerySizeLod %787 %1105 %1131
%1167 = OpVectorShuffle %83 %1166 %1166 0 1
%1165 = OpConvertSToF %43 %1167
%1168 = OpSNegate %83 %1112
%1169 = OpExtInst %43 %79 Ldexp %1165 %1168
%1170 = OpFMul %43 %1134 %1169
%1171 = OpExtInst %43 %79 Ldexp %134 %1168
%1172 = OpFSub %43 %1170 %1171
%1173 = OpExtInst %43 %79 FMax %1172 %139
%1174 = OpFAdd %43 %1170 %1171
%1175 = OpConvertFToS %83 %1173
%1176 = OpConvertFToS %83 %1174
%1177 = OpINotEqual %82 %1175 %1176
%1178 = OpCompositeExtract %80 %1177 0
%1179 = OpCompositeExtract %80 %1177 1
%1180 = OpLogicalAnd %80 %1178 %1179
%1181 = OpSelect %81 %1178 %148 %127
%1182 = OpBitwiseOr %81 %91 %1181
%1183 = OpSelect %81 %1179 %129 %127
%1184 = OpBitwiseOr %81 %1182 %1183
%1185 = OpSelect %81 %1180 %153 %127
%1186 = OpBitwiseOr %81 %1184 %1185
%1187 = OpSConvert %5 %1186
%1188 = OpIMul %81 %1131 %129
%1189 = OpSConvert %5 %1188
%1190 = OpShiftLeftLogical %5 %1187 %1189
%1191 = OpCompositeConstruct %787 %1175 %1108
%1192 = OpIsHelperInvocationEXT %80
%1193 = OpLogicalNot %80 %1192
%1194 = OpLogicalAnd %80 %1193 %1133
%1195 = OpFunctionCall %1 %856 %27 %1191 %1190 %1194
%1196 = OpLoad %25 %27
%1197 = OpLoad %14 %16
%1198 = OpLoad %34 %36
%1199 = OpExtInst %10 %79 RoundEven %70
%1200 = OpConvertFToS %81 %1199
%1201 = OpCompositeConstruct %43 %65 %67
%1202 = OpImageQuerySize %787 %1196
%1203 = OpVectorShuffle %83 %1202 %1202 0 1
%1204 = OpBitwiseAnd %83 %1203 %88
%1205 = OpImageQueryLevels %81 %1197
%1206 = OpISub %81 %1205 %91
%1208 = OpImageQuerySizeLod %787 %1197 %127
%1209 = OpVectorShuffle %83 %1208 %1208 0 1
%1207 = OpConvertSToF %43 %1209
%1210 = OpCompositeConstruct %43 %61 %63
%1211 = OpCompositeConstruct %43 %56 %59
%1212 = OpFMul %43 %1207 %1210
%1213 = OpFMul %43 %1207 %1211
%1214 = OpDot %10 %1212 %1212
%1215 = OpDot %10 %1213 %1213
%1216 = OpExtInst %10 %79 FMax %1214 %1215
%1217 = OpExtInst %10 %79 Log2 %1216
%1218 = OpFMul %10 %1217 %133
%1219 = OpConvertSToF %10 %1206
%1220 = OpExtInst %10 %79 NClamp %1218 %138 %1219
%1221 = OpExtInst %10 %79 FMax %1220 %53
%1222 = OpExtInst %10 %79 FMin %1221 %241
%1223 = OpConvertFToS %81 %1222
%1224 = OpFAdd %10 %1222 %98
%1225 = OpConvertFToS %81 %1224
%1226 = OpExtInst %81 %79 SMin %1225 %1206
%1227 = OpINotEqual %80 %1223 %1225
%1228 = OpExtInst %43 %79 Fract %1201
%1230 = OpImageQuerySizeLod %787 %1197 %1223
%1231 = OpVectorShuffle %83 %1230 %1230 0 1
%1229 = OpConvertSToF %43 %1231
%1232 = OpSNegate %83 %1204
%1233 = OpExtInst %43 %79 Ldexp %1229 %1232
%1234 = OpFMul %43 %1228 %1233
%1235 = OpExtInst %43 %79 Ldexp %134 %1232
%1236 = OpFSub %43 %1234 %1235
%1237 = OpExtInst %43 %79 FMax %1236 %139
%1238 = OpFAdd %43 %1234 %1235
%1239 = OpConvertFToS %83 %1237
%1240 = OpConvertFToS %83 %1238
%1241 = OpINotEqual %82 %1239 %1240
%1242 = OpCompositeExtract %80 %1241 0
%1243 = OpCompositeExtract %80 %1241 1
%1244 = OpLogicalAnd %80 %1242 %1243
%1245 = OpSelect %81 %1242 %148 %127
%1246 = OpBitwiseOr %81 %91 %1245
%1247 = OpSelect %81 %1243 %129 %127
%1248 = OpBitwiseOr %81 %1246 %1247
%1249 = OpSelect %81 %1244 %153 %127
%1250 = OpBitwiseOr %81 %1248 %1249
%1251 = OpSConvert %5 %1250
%1252 = OpIMul %81 %1223 %129
%1253 = OpSConvert %5 %1252
%1254 = OpShiftLeftLogical %5 %1251 %1253
%1255 = OpCompositeConstruct %787 %1239 %1200
%1256 = OpIsHelperInvocationEXT %80
%1257 = OpLogicalNot %80 %1256
%1258 = OpFunctionCall %1 %856 %27 %1255 %1254 %1257
%1260 = OpImageQuerySizeLod %787 %1197 %1225
%1261 = OpVectorShuffle %83 %1260 %1260 0 1
%1259 = OpConvertSToF %43 %1261
%1262 = OpSNegate %83 %1204
%1263 = OpExtInst %43 %79 Ldexp %1259 %1262
%1264 = OpFMul %43 %1228 %1263
%1265 = OpExtInst %43 %79 Ldexp %134 %1262
%1266 = OpFSub %43 %1264 %1265
%1267 = OpExtInst %43 %79 FMax %1266 %139
%1268 = OpFAdd %43 %1264 %1265
%1269 = OpConvertFToS %83 %1267
%1270 = OpConvertFToS %83 %1268
%1271 = OpINotEqual %82 %1269 %1270
%1272 = OpCompositeExtract %80 %1271 0
%1273 = OpCompositeExtract %80 %1271 1
%1274 = OpLogicalAnd %80 %1272 %1273
%1275 = OpSelect %81 %1272 %148 %127
%1276 = OpBitwiseOr %81 %91 %1275
%1277 = OpSelect %81 %1273 %129 %127
%1278 = OpBitwiseOr %81 %1276 %1277
%1279 = OpSelect %81 %1274 %153 %127
%1280 = OpBitwiseOr %81 %1278 %1279
%1281 = OpSConvert %5 %1280
%1282 = OpIMul %81 %1225 %129
%1283 = OpSConvert %5 %1282
%1284 = OpShiftLeftLogical %5 %1281 %1283
%1285 = OpCompositeConstruct %787 %1269 %1200
%1286 = OpIsHelperInvocationEXT %80
%1287 = OpLogicalNot %80 %1286
%1288 = OpLogicalAnd %80 %1287 %1227
%1289 = OpFunctionCall %1 %856 %27 %1285 %1284 %1288
%1290 = OpLoad %25 %27
%1291 = OpLoad %14 %16
%1292 = OpLoad %34 %36
%1293 = OpExtInst %10 %79 RoundEven %70
%1294 = OpConvertFToS %81 %1293
%1295 = OpCompositeConstruct %43 %65 %67
%1296 = OpImageQuerySize %787 %1290
%1297 = OpVectorShuffle %83 %1296 %1296 0 1
%1298 = OpBitwiseAnd %83 %1297 %88
%1299 = OpImageQueryLevels %81 %1291
%1300 = OpISub %81 %1299 %91
%1301 = OpSampledImage %793 %1291 %1292
%1302 = OpExtInst %10 %79 Exp2 %70
%1303 = OpGroupNonUniformQuadBroadcast %10 %72 %1302 %55
%1304 = OpVectorTimesScalar %43 %1295 %1303
%1305 = OpImageQueryLod %43 %1301 %1304
%1306 = OpCompositeExtract %10 %1305 0
%1307 = OpConvertFToS %81 %1306
%1308 = OpFAdd %10 %1306 %98
%1309 = OpConvertFToS %81 %1308
%1310 = OpExtInst %81 %79 SMin %1309 %1300
%1311 = OpINotEqual %80 %1307 %1309
%1312 = OpDPdx %43 %1295
%1313 = OpDPdy %43 %1295
%1314 = OpExtInst %43 %79 FAbs %1312
%1315 = OpExtInst %43 %79 FAbs %1313
%1316 = OpCompositeExtract %10 %1314 0
%1317 = OpCompositeExtract %10 %1315 0
%1318 = OpCompositeExtract %10 %1314 1
%1319 = OpCompositeExtract %10 %1315 1
%1320 = OpExtInst %10 %79 FMax %1316 %1317
%1321 = OpExtInst %10 %79 FMax %1318 %1319
%1322 = OpCompositeConstruct %43 %1320 %1321
%1323 = OpVectorTimesScalar %43 %1322 %1302
%1324 = OpExtInst %43 %79 Fract %1295
%1326 = OpImageQuerySizeLod %787 %1291 %1307
%1327 = OpVectorShuffle %83 %1326 %1326 0 1
%1325 = OpConvertSToF %43 %1327
%1328 = OpSNegate %83 %1298
%1329 = OpExtInst %43 %79 Ldexp %1325 %1328
%1330 = OpFMul %43 %1324 %1329
%1331 = OpFMul %43 %1323 %1325
%1332 = OpFSub %43 %1331 %122
%1333 = OpExtInst %123 %79 FrexpStruct %1332
%1334 = OpCompositeExtract %83 %1333 1
%1335 = OpExtInst %83 %79 SClamp %1334 %128 %130
%1336 = OpIAdd %83 %1335 %1328
%1337 = OpExtInst %43 %79 Ldexp %134 %1336
%1338 = OpExtInst %43 %79 FMin %1337 %134
%1339 = OpFSub %43 %1330 %1338
%1340 = OpExtInst %43 %79 FMax %1339 %139
%1341 = OpFAdd %43 %1330 %1338
%1342 = OpConvertFToS %83 %1340
%1343 = OpConvertFToS %83 %1341
%1344 = OpINotEqual %82 %1342 %1343
%1345 = OpCompositeExtract %80 %1344 0
%1346 = OpCompositeExtract %80 %1344 1
%1347 = OpLogicalAnd %80 %1345 %1346
%1348 = OpSelect %81 %1345 %148 %127
%1349 = OpBitwiseOr %81 %91 %1348
%1350 = OpSelect %81 %1346 %129 %127
%1351 = OpBitwiseOr %81 %1349 %1350
%1352 = OpSelect %81 %1347 %153 %127
%1353 = OpBitwiseOr %81 %1351 %1352
%1354 = OpSConvert %5 %1353
%1355 = OpIMul %81 %1307 %129
%1356 = OpSConvert %5 %1355
%1357 = OpShiftLeftLogical %5 %1354 %1356
%1358 = OpCompositeConstruct %787 %1342 %1294
%1359 = OpIsHelperInvocationEXT %80
%1360 = OpLogicalNot %80 %1359
%1361 = OpFunctionCall %1 %856 %27 %1358 %1357 %1360
%1363 = OpImageQuerySizeLod %787 %1291 %1309
%1364 = OpVectorShuffle %83 %1363 %1363 0 1
%1362 = OpConvertSToF %43 %1364
%1365 = OpSNegate %83 %1298
%1366 = OpExtInst %43 %79 Ldexp %1362 %1365
%1367 = OpFMul %43 %1324 %1366
%1368 = OpFMul %43 %1323 %1362
%1369 = OpFSub %43 %1368 %122
%1370 = OpExtInst %123 %79 FrexpStruct %1369
%1371 = OpCompositeExtract %83 %1370 1
%1372 = OpExtInst %83 %79 SClamp %1371 %128 %130
%1373 = OpIAdd %83 %1372 %1365
%1374 = OpExtInst %43 %79 Ldexp %134 %1373
%1375 = OpExtInst %43 %79 FMin %1374 %134
%1376 = OpFSub %43 %1367 %1375
%1377 = OpExtInst %43 %79 FMax %1376 %139
%1378 = OpFAdd %43 %1367 %1375
%1379 = OpConvertFToS %83 %1377
%1380 = OpConvertFToS %83 %1378
%1381 = OpINotEqual %82 %1379 %1380
%1382 = OpCompositeExtract %80 %1381 0
%1383 = OpCompositeExtract %80 %1381 1
%1384 = OpLogicalAnd %80 %1382 %1383
%1385 = OpSelect %81 %1382 %148 %127
%1386 = OpBitwiseOr %81 %91 %1385
%1387 = OpSelect %81 %1383 %129 %127
%1388 = OpBitwiseOr %81 %1386 %1387
%1389 = OpSelect %81 %1384 %153 %127
%1390 = OpBitwiseOr %81 %1388 %1389
%1391 = OpSConvert %5 %1390
%1392 = OpIMul %81 %1309 %129
%1393 = OpSConvert %5 %1392
%1394 = OpShiftLeftLogical %5 %1391 %1393
%1395 = OpCompositeConstruct %787 %1379 %1294
%1396 = OpIsHelperInvocationEXT %80
%1397 = OpLogicalNot %80 %1396
%1398 = OpLogicalAnd %80 %1397 %1311
%1399 = OpFunctionCall %1 %856 %27 %1395 %1394 %1398
%1400 = OpLoad %25 %27
%1401 = OpLoad %14 %16
%1402 = OpLoad %34 %36
%1403 = OpExtInst %10 %79 RoundEven %70
%1404 = OpConvertFToS %81 %1403
%1405 = OpCompositeConstruct %43 %65 %67
%1406 = OpImageQuerySize %787 %1400
%1407 = OpVectorShuffle %83 %1406 %1406 0 1
%1408 = OpBitwiseAnd %83 %1407 %88
%1409 = OpImageQueryLevels %81 %1401
%1410 = OpISub %81 %1409 %91
%1411 = OpSampledImage %793 %1401 %1402
%1412 = OpExtInst %10 %79 Exp2 %74
%1413 = OpGroupNonUniformQuadBroadcast %10 %72 %1412 %55
%1414 = OpVectorTimesScalar %43 %1405 %1413
%1415 = OpImageQueryLod %43 %1411 %1414
%1416 = OpCompositeExtract %10 %1415 0
%1417 = OpExtInst %10 %79 FMax %1416 %53
%1418 = OpExtInst %10 %79 FMin %1417 %241
%1419 = OpConvertFToS %81 %1418
%1420 = OpFAdd %10 %1418 %98
%1421 = OpConvertFToS %81 %1420
%1422 = OpExtInst %81 %79 SMin %1421 %1410
%1423 = OpINotEqual %80 %1419 %1421
%1424 = OpDPdx %43 %1405
%1425 = OpDPdy %43 %1405
%1426 = OpExtInst %43 %79 FAbs %1424
%1427 = OpExtInst %43 %79 FAbs %1425
%1428 = OpCompositeExtract %10 %1426 0
%1429 = OpCompositeExtract %10 %1427 0
%1430 = OpCompositeExtract %10 %1426 1
%1431 = OpCompositeExtract %10 %1427 1
%1432 = OpExtInst %10 %79 FMax %1428 %1429
%1433 = OpExtInst %10 %79 FMax %1430 %1431
%1434 = OpCompositeConstruct %43 %1432 %1433
%1435 = OpVectorTimesScalar %43 %1434 %1412
%1436 = OpExtInst %43 %79 Fract %1405
%1438 = OpImageQuerySizeLod %787 %1401 %1419
%1439 = OpVectorShuffle %83 %1438 %1438 0 1
%1437 = OpConvertSToF %43 %1439
%1440 = OpSNegate %83 %1408
%1441 = OpExtInst %43 %79 Ldexp %1437 %1440
%1442 = OpFMul %43 %1436 %1441
%1443 = OpFMul %43 %1435 %1437
%1444 = OpFSub %43 %1443 %122
%1445 = OpExtInst %123 %79 FrexpStruct %1444
%1446 = OpCompositeExtract %83 %1445 1
%1447 = OpExtInst %83 %79 SClamp %1446 %128 %130
%1448 = OpIAdd %83 %1447 %1440
%1449 = OpExtInst %43 %79 Ldexp %134 %1448
%1450 = OpExtInst %43 %79 FMin %1449 %134
%1451 = OpFSub %43 %1442 %1450
%1452 = OpExtInst %43 %79 FMax %1451 %139
%1453 = OpFAdd %43 %1442 %1450
%1454 = OpConvertFToS %83 %1452
%1455 = OpConvertFToS %83 %1453
%1456 = OpINotEqual %82 %1454 %1455
%1457 = OpCompositeExtract %80 %1456 0
%1458 = OpCompositeExtract %80 %1456 1
%1459 = OpLogicalAnd %80 %1457 %1458
%1460 = OpSelect %81 %1457 %148 %127
%1461 = OpBitwiseOr %81 %91 %1460
%1462 = OpSelect %81 %1458 %129 %127
%1463 = OpBitwiseOr %81 %1461 %1462
%1464 = OpSelect %81 %1459 %153 %127
%1465 = OpBitwiseOr %81 %1463 %1464
%1466 = OpSConvert %5 %1465
%1467 = OpIMul %81 %1419 %129
%1468 = OpSConvert %5 %1467
%1469 = OpShiftLeftLogical %5 %1466 %1468
%1470 = OpCompositeConstruct %787 %1454 %1404
%1471 = OpIsHelperInvocationEXT %80
%1472 = OpLogicalNot %80 %1471
%1473 = OpFunctionCall %1 %856 %27 %1470 %1469 %1472
%1475 = OpImageQuerySizeLod %787 %1401 %1421
%1476 = OpVectorShuffle %83 %1475 %1475 0 1
%1474 = OpConvertSToF %43 %1476
%1477 = OpSNegate %83 %1408
%1478 = OpExtInst %43 %79 Ldexp %1474 %1477
%1479 = OpFMul %43 %1436 %1478
%1480 = OpFMul %43 %1435 %1474
%1481 = OpFSub %43 %1480 %122
%1482 = OpExtInst %123 %79 FrexpStruct %1481
%1483 = OpCompositeExtract %83 %1482 1
%1484 = OpExtInst %83 %79 SClamp %1483 %128 %130
%1485 = OpIAdd %83 %1484 %1477
%1486 = OpExtInst %43 %79 Ldexp %134 %1485
%1487 = OpExtInst %43 %79 FMin %1486 %134
%1488 = OpFSub %43 %1479 %1487
%1489 = OpExtInst %43 %79 FMax %1488 %139
%1490 = OpFAdd %43 %1479 %1487
%1491 = OpConvertFToS %83 %1489
%1492 = OpConvertFToS %83 %1490
%1493 = OpINotEqual %82 %1491 %1492
%1494 = OpCompositeExtract %80 %1493 0
%1495 = OpCompositeExtract %80 %1493 1
%1496 = OpLogicalAnd %80 %1494 %1495
%1497 = OpSelect %81 %1494 %148 %127
%1498 = OpBitwiseOr %81 %91 %1497
%1499 = OpSelect %81 %1495 %129 %127
%1500 = OpBitwiseOr %81 %1498 %1499
%1501 = OpSelect %81 %1496 %153 %127
%1502 = OpBitwiseOr %81 %1500 %1501
%1503 = OpSConvert %5 %1502
%1504 = OpIMul %81 %1421 %129
%1505 = OpSConvert %5 %1504
%1506 = OpShiftLeftLogical %5 %1503 %1505
%1507 = OpCompositeConstruct %787 %1491 %1404
%1508 = OpIsHelperInvocationEXT %80
%1509 = OpLogicalNot %80 %1508
%1510 = OpLogicalAnd %80 %1509 %1423
%1511 = OpFunctionCall %1 %856 %27 %1507 %1506 %1510
%1512 = OpIAdd %49 %52 %55
%1513 = OpAccessChain %23 %30 %1512
%1514 = OpLoad %6 %1513
%1515 = OpIAdd %49 %52 %55
%1516 = OpAccessChain %12 %19 %1515
%1517 = OpLoad %11 %1516
%1518 = OpIAdd %49 %52 %55
%1519 = OpAccessChain %35 %39 %1518
%1520 = OpLoad %34 %1519
%1521 = OpCompositeConstruct %43 %65 %67
%1522 = OpImageQuerySize %83 %1514
%1523 = OpBitwiseAnd %83 %1522 %88
%1524 = OpImageQueryLevels %81 %1517
%1525 = OpISub %81 %1524 %91
%1526 = OpSampledImage %92 %1517 %1520
%1527 = OpImageQueryLod %43 %1526 %1521
%1528 = OpCompositeExtract %10 %1527 0
%1529 = OpConvertFToS %81 %1528
%1530 = OpFAdd %10 %1528 %98
%1531 = OpConvertFToS %81 %1530
%1532 = OpExtInst %81 %79 SMin %1531 %1525
%1533 = OpINotEqual %80 %1529 %1531
%1534 = OpDPdx %43 %1521
%1535 = OpDPdy %43 %1521
%1536 = OpExtInst %43 %79 FAbs %1534
%1537 = OpExtInst %43 %79 FAbs %1535
%1538 = OpCompositeExtract %10 %1536 0
%1539 = OpCompositeExtract %10 %1537 0
%1540 = OpCompositeExtract %10 %1536 1
%1541 = OpCompositeExtract %10 %1537 1
%1542 = OpExtInst %10 %79 FMax %1538 %1539
%1543 = OpExtInst %10 %79 FMax %1540 %1541
%1544 = OpCompositeConstruct %43 %1542 %1543
%1545 = OpExtInst %43 %79 Fract %1521
%1547 = OpImageQuerySizeLod %83 %1517 %1529
%1546 = OpConvertSToF %43 %1547
%1548 = OpSNegate %83 %1523
%1549 = OpExtInst %43 %79 Ldexp %1546 %1548
%1550 = OpFMul %43 %1545 %1549
%1551 = OpFMul %43 %1544 %1546
%1552 = OpFSub %43 %1551 %122
%1553 = OpExtInst %123 %79 FrexpStruct %1552
%1554 = OpCompositeExtract %83 %1553 1
%1555 = OpExtInst %83 %79 SClamp %1554 %128 %130
%1556 = OpIAdd %83 %1555 %1548
%1557 = OpExtInst %43 %79 Ldexp %134 %1556
%1558 = OpExtInst %43 %79 FMin %1557 %134
%1559 = OpFSub %43 %1550 %1558
%1560 = OpExtInst %43 %79 FMax %1559 %139
%1561 = OpFAdd %43 %1550 %1558
%1562 = OpConvertFToS %83 %1560
%1563 = OpConvertFToS %83 %1561
%1564 = OpINotEqual %82 %1562 %1563
%1565 = OpCompositeExtract %80 %1564 0
%1566 = OpCompositeExtract %80 %1564 1
%1567 = OpLogicalAnd %80 %1565 %1566
%1568 = OpSelect %81 %1565 %148 %127
%1569 = OpBitwiseOr %81 %91 %1568
%1570 = OpSelect %81 %1566 %129 %127
%1571 = OpBitwiseOr %81 %1569 %1570
%1572 = OpSelect %81 %1567 %153 %127
%1573 = OpBitwiseOr %81 %1571 %1572
%1574 = OpSConvert %5 %1573
%1575 = OpIMul %81 %1529 %129
%1576 = OpSConvert %5 %1575
%1577 = OpShiftLeftLogical %5 %1574 %1576
%1578 = OpIsHelperInvocationEXT %80
%1579 = OpLogicalNot %80 %1578
%1605 = OpFunctionCall %1 %1584 %1513 %1562 %1577 %1579
%1607 = OpImageQuerySizeLod %83 %1517 %1531
%1606 = OpConvertSToF %43 %1607
%1608 = OpSNegate %83 %1523
%1609 = OpExtInst %43 %79 Ldexp %1606 %1608
%1610 = OpFMul %43 %1545 %1609
%1611 = OpFMul %43 %1544 %1606
%1612 = OpFSub %43 %1611 %122
%1613 = OpExtInst %123 %79 FrexpStruct %1612
%1614 = OpCompositeExtract %83 %1613 1
%1615 = OpExtInst %83 %79 SClamp %1614 %128 %130
%1616 = OpIAdd %83 %1615 %1608
%1617 = OpExtInst %43 %79 Ldexp %134 %1616
%1618 = OpExtInst %43 %79 FMin %1617 %134
%1619 = OpFSub %43 %1610 %1618
%1620 = OpExtInst %43 %79 FMax %1619 %139
%1621 = OpFAdd %43 %1610 %1618
%1622 = OpConvertFToS %83 %1620
%1623 = OpConvertFToS %83 %1621
%1624 = OpINotEqual %82 %1622 %1623
%1625 = OpCompositeExtract %80 %1624 0
%1626 = OpCompositeExtract %80 %1624 1
%1627 = OpLogicalAnd %80 %1625 %1626
%1628 = OpSelect %81 %1625 %148 %127
%1629 = OpBitwiseOr %81 %91 %1628
%1630 = OpSelect %81 %1626 %129 %127
%1631 = OpBitwiseOr %81 %1629 %1630
%1632 = OpSelect %81 %1627 %153 %127
%1633 = OpBitwiseOr %81 %1631 %1632
%1634 = OpSConvert %5 %1633
%1635 = OpIMul %81 %1531 %129
%1636 = OpSConvert %5 %1635
%1637 = OpShiftLeftLogical %5 %1634 %1636
%1638 = OpIsHelperInvocationEXT %80
%1639 = OpLogicalNot %80 %1638
%1640 = OpLogicalAnd %80 %1639 %1533
%1641 = OpFunctionCall %1 %1584 %1513 %1622 %1637 %1640
%1642 = OpIAdd %49 %52 %55
%1643 = OpAccessChain %26 %33 %1642
%1644 = OpLoad %25 %1643
%1645 = OpIAdd %49 %52 %55
%1646 = OpAccessChain %15 %22 %1645
%1647 = OpLoad %14 %1646
%1648 = OpAccessChain %35 %39 %1518
%1649 = OpLoad %34 %1648
%1650 = OpExtInst %10 %79 RoundEven %70
%1651 = OpConvertFToS %81 %1650
%1652 = OpCompositeConstruct %43 %65 %67
%1653 = OpImageQuerySize %787 %1644
%1654 = OpVectorShuffle %83 %1653 %1653 0 1
%1655 = OpBitwiseAnd %83 %1654 %88
%1656 = OpImageQueryLevels %81 %1647
%1657 = OpISub %81 %1656 %91
%1658 = OpSampledImage %793 %1647 %1649
%1659 = OpImageQueryLod %43 %1658 %1652
%1660 = OpCompositeExtract %10 %1659 0
%1661 = OpConvertFToS %81 %1660
%1662 = OpFAdd %10 %1660 %98
%1663 = OpConvertFToS %81 %1662
%1664 = OpExtInst %81 %79 SMin %1663 %1657
%1665 = OpINotEqual %80 %1661 %1663
%1666 = OpDPdx %43 %1652
%1667 = OpDPdy %43 %1652
%1668 = OpExtInst %43 %79 FAbs %1666
%1669 = OpExtInst %43 %79 FAbs %1667
%1670 = OpCompositeExtract %10 %1668 0
%1671 = OpCompositeExtract %10 %1669 0
%1672 = OpCompositeExtract %10 %1668 1
%1673 = OpCompositeExtract %10 %1669 1
%1674 = OpExtInst %10 %79 FMax %1670 %1671
%1675 = OpExtInst %10 %79 FMax %1672 %1673
%1676 = OpCompositeConstruct %43 %1674 %1675
%1677 = OpExtInst %43 %79 Fract %1652
%1679 = OpImageQuerySizeLod %787 %1647 %1661
%1680 = OpVectorShuffle %83 %1679 %1679 0 1
%1678 = OpConvertSToF %43 %1680
%1681 = OpSNegate %83 %1655
%1682 = OpExtInst %43 %79 Ldexp %1678 %1681
%1683 = OpFMul %43 %1677 %1682
%1684 = OpFMul %43 %1676 %1678
%1685 = OpFSub %43 %1684 %122
%1686 = OpExtInst %123 %79 FrexpStruct %1685
%1687 = OpCompositeExtract %83 %1686 1
%1688 = OpExtInst %83 %79 SClamp %1687 %128 %130
%1689 = OpIAdd %83 %1688 %1681
%1690 = OpExtInst %43 %79 Ldexp %134 %1689
%1691 = OpExtInst %43 %79 FMin %1690 %134
%1692 = OpFSub %43 %1683 %1691
%1693 = OpExtInst %43 %79 FMax %1692 %139
%1694 = OpFAdd %43 %1683 %1691
%1695 = OpConvertFToS %83 %1693
%1696 = OpConvertFToS %83 %1694
%1697 = OpINotEqual %82 %1695 %1696
%1698 = OpCompositeExtract %80 %1697 0
%1699 = OpCompositeExtract %80 %1697 1
%1700 = OpLogicalAnd %80 %1698 %1699
%1701 = OpSelect %81 %1698 %148 %127
%1702 = OpBitwiseOr %81 %91 %1701
%1703 = OpSelect %81 %1699 %129 %127
%1704 = OpBitwiseOr %81 %1702 %1703
%1705 = OpSelect %81 %1700 %153 %127
%1706 = OpBitwiseOr %81 %1704 %1705
%1707 = OpSConvert %5 %1706
%1708 = OpIMul %81 %1661 %129
%1709 = OpSConvert %5 %1708
%1710 = OpShiftLeftLogical %5 %1707 %1709
%1711 = OpCompositeConstruct %787 %1695 %1651
%1712 = OpIsHelperInvocationEXT %80
%1713 = OpLogicalNot %80 %1712
%1739 = OpFunctionCall %1 %1718 %1643 %1711 %1710 %1713
%1741 = OpImageQuerySizeLod %787 %1647 %1663
%1742 = OpVectorShuffle %83 %1741 %1741 0 1
%1740 = OpConvertSToF %43 %1742
%1743 = OpSNegate %83 %1655
%1744 = OpExtInst %43 %79 Ldexp %1740 %1743
%1745 = OpFMul %43 %1677 %1744
%1746 = OpFMul %43 %1676 %1740
%1747 = OpFSub %43 %1746 %122
%1748 = OpExtInst %123 %79 FrexpStruct %1747
%1749 = OpCompositeExtract %83 %1748 1
%1750 = OpExtInst %83 %79 SClamp %1749 %128 %130
%1751 = OpIAdd %83 %1750 %1743
%1752 = OpExtInst %43 %79 Ldexp %134 %1751
%1753 = OpExtInst %43 %79 FMin %1752 %134
%1754 = OpFSub %43 %1745 %1753
%1755 = OpExtInst %43 %79 FMax %1754 %139
%1756 = OpFAdd %43 %1745 %1753
%1757 = OpConvertFToS %83 %1755
%1758 = OpConvertFToS %83 %1756
%1759 = OpINotEqual %82 %1757 %1758
%1760 = OpCompositeExtract %80 %1759 0
%1761 = OpCompositeExtract %80 %1759 1
%1762 = OpLogicalAnd %80 %1760 %1761
%1763 = OpSelect %81 %1760 %148 %127
%1764 = OpBitwiseOr %81 %91 %1763
%1765 = OpSelect %81 %1761 %129 %127
%1766 = OpBitwiseOr %81 %1764 %1765
%1767 = OpSelect %81 %1762 %153 %127
%1768 = OpBitwiseOr %81 %1766 %1767
%1769 = OpSConvert %5 %1768
%1770 = OpIMul %81 %1663 %129
%1771 = OpSConvert %5 %1770
%1772 = OpShiftLeftLogical %5 %1769 %1771
%1773 = OpCompositeConstruct %787 %1757 %1651
%1774 = OpIsHelperInvocationEXT %80
%1775 = OpLogicalNot %80 %1774
%1776 = OpLogicalAnd %80 %1775 %1665
%1777 = OpFunctionCall %1 %1718 %1643 %1773 %1772 %1776
%1778 = OpAccessChain %23 %30 %1512
%1779 = OpLoad %6 %1778
%1780 = OpAccessChain %12 %19 %1515
%1781 = OpLoad %11 %1780
%1782 = OpAccessChain %35 %39 %1518
%1783 = OpLoad %34 %1782
%1784 = OpCompositeConstruct %43 %65 %67
%1785 = OpImageQuerySize %83 %1779
%1786 = OpBitwiseAnd %83 %1785 %88
%1787 = OpImageQueryLevels %81 %1781
%1788 = OpISub %81 %1787 %91
%1789 = OpSampledImage %92 %1781 %1783
%1790 = OpImageQueryLod %43 %1789 %1784
%1791 = OpCompositeExtract %10 %1790 0
%1792 = OpConvertFToS %81 %1791
%1793 = OpFAdd %10 %1791 %98
%1794 = OpConvertFToS %81 %1793
%1795 = OpExtInst %81 %79 SMin %1794 %1788
%1796 = OpINotEqual %80 %1792 %1794
%1797 = OpDPdx %43 %1784
%1798 = OpDPdy %43 %1784
%1799 = OpExtInst %43 %79 FAbs %1797
%1800 = OpExtInst %43 %79 FAbs %1798
%1801 = OpCompositeExtract %10 %1799 0
%1802 = OpCompositeExtract %10 %1800 0
%1803 = OpCompositeExtract %10 %1799 1
%1804 = OpCompositeExtract %10 %1800 1
%1805 = OpExtInst %10 %79 FMax %1801 %1802
%1806 = OpExtInst %10 %79 FMax %1803 %1804
%1807 = OpCompositeConstruct %43 %1805 %1806
%1808 = OpExtInst %43 %79 Fract %1784
%1810 = OpImageQuerySizeLod %83 %1781 %1792
%1809 = OpConvertSToF %43 %1810
%1811 = OpSNegate %83 %1786
%1812 = OpExtInst %43 %79 Ldexp %1809 %1811
%1813 = OpFMul %43 %1808 %1812
%1814 = OpFMul %43 %1807 %1809
%1815 = OpFSub %43 %1814 %122
%1816 = OpExtInst %123 %79 FrexpStruct %1815
%1817 = OpCompositeExtract %83 %1816 1
%1818 = OpExtInst %83 %79 SClamp %1817 %128 %130
%1819 = OpIAdd %83 %1818 %1811
%1820 = OpExtInst %43 %79 Ldexp %134 %1819
%1821 = OpExtInst %43 %79 FMin %1820 %134
%1822 = OpFSub %43 %1813 %1821
%1823 = OpExtInst %43 %79 FMax %1822 %139
%1824 = OpFAdd %43 %1813 %1821
%1825 = OpConvertFToS %83 %1823
%1826 = OpConvertFToS %83 %1824
%1827 = OpINotEqual %82 %1825 %1826
%1828 = OpCompositeExtract %80 %1827 0
%1829 = OpCompositeExtract %80 %1827 1
%1830 = OpLogicalAnd %80 %1828 %1829
%1831 = OpSelect %81 %1828 %148 %127
%1832 = OpBitwiseOr %81 %91 %1831
%1833 = OpSelect %81 %1829 %129 %127
%1834 = OpBitwiseOr %81 %1832 %1833
%1835 = OpSelect %81 %1830 %153 %127
%1836 = OpBitwiseOr %81 %1834 %1835
%1837 = OpSConvert %5 %1836
%1838 = OpIMul %81 %1792 %129
%1839 = OpSConvert %5 %1838
%1840 = OpShiftLeftLogical %5 %1837 %1839
%1841 = OpIsHelperInvocationEXT %80
%1842 = OpLogicalNot %80 %1841
%1843 = OpFunctionCall %1 %1584 %1778 %1825 %1840 %1842
%1845 = OpImageQuerySizeLod %83 %1781 %1794
%1844 = OpConvertSToF %43 %1845
%1846 = OpSNegate %83 %1786
%1847 = OpExtInst %43 %79 Ldexp %1844 %1846
%1848 = OpFMul %43 %1808 %1847
%1849 = OpFMul %43 %1807 %1844
%1850 = OpFSub %43 %1849 %122
%1851 = OpExtInst %123 %79 FrexpStruct %1850
%1852 = OpCompositeExtract %83 %1851 1
%1853 = OpExtInst %83 %79 SClamp %1852 %128 %130
%1854 = OpIAdd %83 %1853 %1846
%1855 = OpExtInst %43 %79 Ldexp %134 %1854
%1856 = OpExtInst %43 %79 FMin %1855 %134
%1857 = OpFSub %43 %1848 %1856
%1858 = OpExtInst %43 %79 FMax %1857 %139
%1859 = OpFAdd %43 %1848 %1856
%1860 = OpConvertFToS %83 %1858
%1861 = OpConvertFToS %83 %1859
%1862 = OpINotEqual %82 %1860 %1861
%1863 = OpCompositeExtract %80 %1862 0
%1864 = OpCompositeExtract %80 %1862 1
%1865 = OpLogicalAnd %80 %1863 %1864
%1866 = OpSelect %81 %1863 %148 %127
%1867 = OpBitwiseOr %81 %91 %1866
%1868 = OpSelect %81 %1864 %129 %127
%1869 = OpBitwiseOr %81 %1867 %1868
%1870 = OpSelect %81 %1865 %153 %127
%1871 = OpBitwiseOr %81 %1869 %1870
%1872 = OpSConvert %5 %1871
%1873 = OpIMul %81 %1794 %129
%1874 = OpSConvert %5 %1873
%1875 = OpShiftLeftLogical %5 %1872 %1874
%1876 = OpIsHelperInvocationEXT %80
%1877 = OpLogicalNot %80 %1876
%1878 = OpLogicalAnd %80 %1877 %1796
%1879 = OpFunctionCall %1 %1584 %1778 %1860 %1875 %1878
%1880 = OpAccessChain %26 %33 %1642
%1881 = OpLoad %25 %1880
%1882 = OpAccessChain %15 %22 %1645
%1883 = OpLoad %14 %1882
%1884 = OpAccessChain %35 %39 %1518
%1885 = OpLoad %34 %1884
%1886 = OpExtInst %10 %79 RoundEven %70
%1887 = OpConvertFToS %81 %1886
%1888 = OpCompositeConstruct %43 %65 %67
%1889 = OpImageQuerySize %787 %1881
%1890 = OpVectorShuffle %83 %1889 %1889 0 1
%1891 = OpBitwiseAnd %83 %1890 %88
%1892 = OpImageQueryLevels %81 %1883
%1893 = OpISub %81 %1892 %91
%1894 = OpSampledImage %793 %1883 %1885
%1895 = OpImageQueryLod %43 %1894 %1888
%1896 = OpCompositeExtract %10 %1895 0
%1897 = OpConvertFToS %81 %1896
%1898 = OpFAdd %10 %1896 %98
%1899 = OpConvertFToS %81 %1898
%1900 = OpExtInst %81 %79 SMin %1899 %1893
%1901 = OpINotEqual %80 %1897 %1899
%1902 = OpDPdx %43 %1888
%1903 = OpDPdy %43 %1888
%1904 = OpExtInst %43 %79 FAbs %1902
%1905 = OpExtInst %43 %79 FAbs %1903
%1906 = OpCompositeExtract %10 %1904 0
%1907 = OpCompositeExtract %10 %1905 0
%1908 = OpCompositeExtract %10 %1904 1
%1909 = OpCompositeExtract %10 %1905 1
%1910 = OpExtInst %10 %79 FMax %1906 %1907
%1911 = OpExtInst %10 %79 FMax %1908 %1909
%1912 = OpCompositeConstruct %43 %1910 %1911
%1913 = OpExtInst %43 %79 Fract %1888
%1915 = OpImageQuerySizeLod %787 %1883 %1897
%1916 = OpVectorShuffle %83 %1915 %1915 0 1
%1914 = OpConvertSToF %43 %1916
%1917 = OpSNegate %83 %1891
%1918 = OpExtInst %43 %79 Ldexp %1914 %1917
%1919 = OpFMul %43 %1913 %1918
%1920 = OpFMul %43 %1912 %1914
%1921 = OpFSub %43 %1920 %122
%1922 = OpExtInst %123 %79 FrexpStruct %1921
%1923 = OpCompositeExtract %83 %1922 1
%1924 = OpExtInst %83 %79 SClamp %1923 %128 %130
%1925 = OpIAdd %83 %1924 %1917
%1926 = OpExtInst %43 %79 Ldexp %134 %1925
%1927 = OpExtInst %43 %79 FMin %1926 %134
%1928 = OpFSub %43 %1919 %1927
%1929 = OpExtInst %43 %79 FMax %1928 %139
%1930 = OpFAdd %43 %1919 %1927
%1931 = OpConvertFToS %83 %1929
%1932 = OpConvertFToS %83 %1930
%1933 = OpINotEqual %82 %1931 %1932
%1934 = OpCompositeExtract %80 %1933 0
%1935 = OpCompositeExtract %80 %1933 1
%1936 = OpLogicalAnd %80 %1934 %1935
%1937 = OpSelect %81 %1934 %148 %127
%1938 = OpBitwiseOr %81 %91 %1937
%1939 = OpSelect %81 %1935 %129 %127
%1940 = OpBitwiseOr %81 %1938 %1939
%1941 = OpSelect %81 %1936 %153 %127
%1942 = OpBitwiseOr %81 %1940 %1941
%1943 = OpSConvert %5 %1942
%1944 = OpIMul %81 %1897 %129
%1945 = OpSConvert %5 %1944
%1946 = OpShiftLeftLogical %5 %1943 %1945
%1947 = OpCompositeConstruct %787 %1931 %1887
%1948 = OpIsHelperInvocationEXT %80
%1949 = OpLogicalNot %80 %1948
%1950 = OpFunctionCall %1 %1718 %1880 %1947 %1946 %1949
%1952 = OpImageQuerySizeLod %787 %1883 %1899
%1953 = OpVectorShuffle %83 %1952 %1952 0 1
%1951 = OpConvertSToF %43 %1953
%1954 = OpSNegate %83 %1891
%1955 = OpExtInst %43 %79 Ldexp %1951 %1954
%1956 = OpFMul %43 %1913 %1955
%1957 = OpFMul %43 %1912 %1951
%1958 = OpFSub %43 %1957 %122
%1959 = OpExtInst %123 %79 FrexpStruct %1958
%1960 = OpCompositeExtract %83 %1959 1
%1961 = OpExtInst %83 %79 SClamp %1960 %128 %130
%1962 = OpIAdd %83 %1961 %1954
%1963 = OpExtInst %43 %79 Ldexp %134 %1962
%1964 = OpExtInst %43 %79 FMin %1963 %134
%1965 = OpFSub %43 %1956 %1964
%1966 = OpExtInst %43 %79 FMax %1965 %139
%1967 = OpFAdd %43 %1956 %1964
%1968 = OpConvertFToS %83 %1966
%1969 = OpConvertFToS %83 %1967
%1970 = OpINotEqual %82 %1968 %1969
%1971 = OpCompositeExtract %80 %1970 0
%1972 = OpCompositeExtract %80 %1970 1
%1973 = OpLogicalAnd %80 %1971 %1972
%1974 = OpSelect %81 %1971 %148 %127
%1975 = OpBitwiseOr %81 %91 %1974
%1976 = OpSelect %81 %1972 %129 %127
%1977 = OpBitwiseOr %81 %1975 %1976
%1978 = OpSelect %81 %1973 %153 %127
%1979 = OpBitwiseOr %81 %1977 %1978
%1980 = OpSConvert %5 %1979
%1981 = OpIMul %81 %1899 %129
%1982 = OpSConvert %5 %1981
%1983 = OpShiftLeftLogical %5 %1980 %1982
%1984 = OpCompositeConstruct %787 %1968 %1887
%1985 = OpIsHelperInvocationEXT %80
%1986 = OpLogicalNot %80 %1985
%1987 = OpLogicalAnd %80 %1986 %1901
%1988 = OpFunctionCall %1 %1718 %1880 %1984 %1983 %1987
%1989 = OpAccessChain %23 %9 %52
%1990 = OpLoad %6 %1989
%1991 = OpLoad %11 %13
%1992 = OpLoad %34 %36
%1993 = OpCompositeConstruct %43 %65 %67
%1994 = OpImageQuerySize %83 %1990
%1995 = OpBitwiseAnd %83 %1994 %88
%1996 = OpImageQueryLevels %81 %1991
%1997 = OpISub %81 %1996 %91
%1998 = OpSampledImage %92 %1991 %1992
%1999 = OpImageQueryLod %43 %1998 %1993
%2000 = OpCompositeExtract %10 %1999 0
%2001 = OpConvertFToS %81 %2000
%2002 = OpFAdd %10 %2000 %98
%2003 = OpConvertFToS %81 %2002
%2004 = OpExtInst %81 %79 SMin %2003 %1997
%2005 = OpINotEqual %80 %2001 %2003
%2006 = OpDPdx %43 %1993
%2007 = OpDPdy %43 %1993
%2008 = OpExtInst %43 %79 FAbs %2006
%2009 = OpExtInst %43 %79 FAbs %2007
%2010 = OpCompositeExtract %10 %2008 0
%2011 = OpCompositeExtract %10 %2009 0
%2012 = OpCompositeExtract %10 %2008 1
%2013 = OpCompositeExtract %10 %2009 1
%2014 = OpExtInst %10 %79 FMax %2010 %2011
%2015 = OpExtInst %10 %79 FMax %2012 %2013
%2016 = OpCompositeConstruct %43 %2014 %2015
%2017 = OpExtInst %43 %79 Fract %1993
%2019 = OpImageQuerySizeLod %83 %1991 %2001
%2018 = OpConvertSToF %43 %2019
%2020 = OpSNegate %83 %1995
%2021 = OpExtInst %43 %79 Ldexp %2018 %2020
%2022 = OpFMul %43 %2017 %2021
%2023 = OpFMul %43 %2016 %2018
%2024 = OpFSub %43 %2023 %122
%2025 = OpExtInst %123 %79 FrexpStruct %2024
%2026 = OpCompositeExtract %83 %2025 1
%2027 = OpExtInst %83 %79 SClamp %2026 %128 %130
%2028 = OpIAdd %83 %2027 %2020
%2029 = OpExtInst %43 %79 Ldexp %134 %2028
%2030 = OpExtInst %43 %79 FMin %2029 %134
%2031 = OpFSub %43 %2022 %2030
%2032 = OpExtInst %43 %79 FMax %2031 %139
%2033 = OpFAdd %43 %2022 %2030
%2034 = OpConvertFToS %83 %2032
%2035 = OpConvertFToS %83 %2033
%2036 = OpINotEqual %82 %2034 %2035
%2037 = OpCompositeExtract %80 %2036 0
%2038 = OpCompositeExtract %80 %2036 1
%2039 = OpLogicalAnd %80 %2037 %2038
%2040 = OpSelect %81 %2037 %148 %127
%2041 = OpBitwiseOr %81 %91 %2040
%2042 = OpSelect %81 %2038 %129 %127
%2043 = OpBitwiseOr %81 %2041 %2042
%2044 = OpSelect %81 %2039 %153 %127
%2045 = OpBitwiseOr %81 %2043 %2044
%2046 = OpSConvert %5 %2045
%2047 = OpIMul %81 %2001 %129
%2048 = OpSConvert %5 %2047
%2049 = OpShiftLeftLogical %5 %2046 %2048
%2050 = OpIsHelperInvocationEXT %80
%2051 = OpLogicalNot %80 %2050
%2052 = OpFunctionCall %1 %1584 %1989 %2034 %2049 %2051
%2054 = OpImageQuerySizeLod %83 %1991 %2003
%2053 = OpConvertSToF %43 %2054
%2055 = OpSNegate %83 %1995
%2056 = OpExtInst %43 %79 Ldexp %2053 %2055
%2057 = OpFMul %43 %2017 %2056
%2058 = OpFMul %43 %2016 %2053
%2059 = OpFSub %43 %2058 %122
%2060 = OpExtInst %123 %79 FrexpStruct %2059
%2061 = OpCompositeExtract %83 %2060 1
%2062 = OpExtInst %83 %79 SClamp %2061 %128 %130
%2063 = OpIAdd %83 %2062 %2055
%2064 = OpExtInst %43 %79 Ldexp %134 %2063
%2065 = OpExtInst %43 %79 FMin %2064 %134
%2066 = OpFSub %43 %2057 %2065
%2067 = OpExtInst %43 %79 FMax %2066 %139
%2068 = OpFAdd %43 %2057 %2065
%2069 = OpConvertFToS %83 %2067
%2070 = OpConvertFToS %83 %2068
%2071 = OpINotEqual %82 %2069 %2070
%2072 = OpCompositeExtract %80 %2071 0
%2073 = OpCompositeExtract %80 %2071 1
%2074 = OpLogicalAnd %80 %2072 %2073
%2075 = OpSelect %81 %2072 %148 %127
%2076 = OpBitwiseOr %81 %91 %2075
%2077 = OpSelect %81 %2073 %129 %127
%2078 = OpBitwiseOr %81 %2076 %2077
%2079 = OpSelect %81 %2074 %153 %127
%2080 = OpBitwiseOr %81 %2078 %2079
%2081 = OpSConvert %5 %2080
%2082 = OpIMul %81 %2003 %129
%2083 = OpSConvert %5 %2082
%2084 = OpShiftLeftLogical %5 %2081 %2083
%2085 = OpIsHelperInvocationEXT %80
%2086 = OpLogicalNot %80 %2085
%2087 = OpLogicalAnd %80 %2086 %2005
%2088 = OpFunctionCall %1 %1584 %1989 %2069 %2084 %2087
%2089 = OpLoad %11 %13
%2090 = OpLoad %34 %36
%2091 = OpCompositeConstruct %43 %65 %67
%2092 = OpImageQuerySize %83 %1990
%2093 = OpBitwiseAnd %83 %2092 %88
%2094 = OpImageQueryLevels %81 %2089
%2095 = OpISub %81 %2094 %91
%2096 = OpSampledImage %92 %2089 %2090
%2097 = OpImageQueryLod %43 %2096 %2091
%2098 = OpCompositeExtract %10 %2097 0
%2099 = OpConvertFToS %81 %2098
%2100 = OpFAdd %10 %2098 %98
%2101 = OpConvertFToS %81 %2100
%2102 = OpExtInst %81 %79 SMin %2101 %2095
%2103 = OpINotEqual %80 %2099 %2101
%2104 = OpDPdx %43 %2091
%2105 = OpDPdy %43 %2091
%2106 = OpExtInst %43 %79 FAbs %2104
%2107 = OpExtInst %43 %79 FAbs %2105
%2108 = OpCompositeExtract %10 %2106 0
%2109 = OpCompositeExtract %10 %2107 0
%2110 = OpCompositeExtract %10 %2106 1
%2111 = OpCompositeExtract %10 %2107 1
%2112 = OpExtInst %10 %79 FMax %2108 %2109
%2113 = OpExtInst %10 %79 FMax %2110 %2111
%2114 = OpCompositeConstruct %43 %2112 %2113
%2115 = OpExtInst %43 %79 Fract %2091
%2117 = OpImageQuerySizeLod %83 %2089 %2099
%2116 = OpConvertSToF %43 %2117
%2118 = OpSNegate %83 %2093
%2119 = OpExtInst %43 %79 Ldexp %2116 %2118
%2120 = OpFMul %43 %2115 %2119
%2121 = OpFMul %43 %2114 %2116
%2122 = OpFSub %43 %2121 %122
%2123 = OpExtInst %123 %79 FrexpStruct %2122
%2124 = OpCompositeExtract %83 %2123 1
%2125 = OpExtInst %83 %79 SClamp %2124 %128 %130
%2126 = OpIAdd %83 %2125 %2118
%2127 = OpExtInst %43 %79 Ldexp %134 %2126
%2128 = OpExtInst %43 %79 FMin %2127 %134
%2129 = OpFSub %43 %2120 %2128
%2130 = OpExtInst %43 %79 FMax %2129 %139
%2131 = OpFAdd %43 %2120 %2128
%2132 = OpConvertFToS %83 %2130
%2133 = OpConvertFToS %83 %2131
%2134 = OpINotEqual %82 %2132 %2133
%2135 = OpCompositeExtract %80 %2134 0
%2136 = OpCompositeExtract %80 %2134 1
%2137 = OpLogicalAnd %80 %2135 %2136
%2138 = OpSelect %81 %2135 %148 %127
%2139 = OpBitwiseOr %81 %91 %2138
%2140 = OpSelect %81 %2136 %129 %127
%2141 = OpBitwiseOr %81 %2139 %2140
%2142 = OpSelect %81 %2137 %153 %127
%2143 = OpBitwiseOr %81 %2141 %2142
%2144 = OpSConvert %5 %2143
%2145 = OpIMul %81 %2099 %129
%2146 = OpSConvert %5 %2145
%2147 = OpShiftLeftLogical %5 %2144 %2146
%2148 = OpIsHelperInvocationEXT %80
%2149 = OpLogicalNot %80 %2148
%2150 = OpFunctionCall %1 %1584 %1989 %2132 %2147 %2149
%2152 = OpImageQuerySizeLod %83 %2089 %2101
%2151 = OpConvertSToF %43 %2152
%2153 = OpSNegate %83 %2093
%2154 = OpExtInst %43 %79 Ldexp %2151 %2153
%2155 = OpFMul %43 %2115 %2154
%2156 = OpFMul %43 %2114 %2151
%2157 = OpFSub %43 %2156 %122
%2158 = OpExtInst %123 %79 FrexpStruct %2157
%2159 = OpCompositeExtract %83 %2158 1
%2160 = OpExtInst %83 %79 SClamp %2159 %128 %130
%2161 = OpIAdd %83 %2160 %2153
%2162 = OpExtInst %43 %79 Ldexp %134 %2161
%2163 = OpExtInst %43 %79 FMin %2162 %134
%2164 = OpFSub %43 %2155 %2163
%2165 = OpExtInst %43 %79 FMax %2164 %139
%2166 = OpFAdd %43 %2155 %2163
%2167 = OpConvertFToS %83 %2165
%2168 = OpConvertFToS %83 %2166
%2169 = OpINotEqual %82 %2167 %2168
%2170 = OpCompositeExtract %80 %2169 0
%2171 = OpCompositeExtract %80 %2169 1
%2172 = OpLogicalAnd %80 %2170 %2171
%2173 = OpSelect %81 %2170 %148 %127
%2174 = OpBitwiseOr %81 %91 %2173
%2175 = OpSelect %81 %2171 %129 %127
%2176 = OpBitwiseOr %81 %2174 %2175
%2177 = OpSelect %81 %2172 %153 %127
%2178 = OpBitwiseOr %81 %2176 %2177
%2179 = OpSConvert %5 %2178
%2180 = OpIMul %81 %2101 %129
%2181 = OpSConvert %5 %2180
%2182 = OpShiftLeftLogical %5 %2179 %2181
%2183 = OpIsHelperInvocationEXT %80
%2184 = OpLogicalNot %80 %2183
%2185 = OpLogicalAnd %80 %2184 %2103
%2186 = OpFunctionCall %1 %1584 %1989 %2167 %2182 %2185
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
%189 = OpAtomicOr %5 %188 %190 %55 %186
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
%856 = OpFunction %1 None %851
%852 = OpFunctionParameter %26
%853 = OpFunctionParameter %787
%854 = OpFunctionParameter %5
%855 = OpFunctionParameter %80
%857 = OpLabel
%867 = OpVariable %179 Function %178
OpSelectionMerge %866 None
OpBranchConditional %855 %858 %866
%858 = OpLabel
%868 = OpLoad %80 %867
%869 = OpLogicalNot %80 %868
OpLoopMerge %865 %864 None
OpBranchConditional %869 %859 %865
%859 = OpLabel
%870 = OpGroupNonUniformBroadcastFirst %787 %72 %853
%871 = OpIEqual %850 %853 %870
%872 = OpAll %80 %871
OpStore %867 %872
OpSelectionMerge %863 None
OpBranchConditional %872 %860 %863
%860 = OpLabel
%873 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %854
%874 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %862 None
OpBranchConditional %874 %861 %862
%861 = OpLabel
%875 = OpImageTexelPointer %161 %852 %853 %127
%876 = OpAtomicOr %5 %875 %190 %55 %873
OpBranch %862
%862 = OpLabel
OpBranch %863
%863 = OpLabel
OpBranch %864
%864 = OpLabel
OpBranch %858
%865 = OpLabel
OpBranch %866
%866 = OpLabel
OpReturn
OpFunctionEnd
%1584 = OpFunction %1 None %162
%1580 = OpFunctionParameter %23
%1581 = OpFunctionParameter %83
%1582 = OpFunctionParameter %5
%1583 = OpFunctionParameter %80
%1585 = OpLabel
%1595 = OpVariable %179 Function %178
OpSelectionMerge %1594 None
OpBranchConditional %1583 %1586 %1594
%1586 = OpLabel
%1596 = OpLoad %80 %1595
%1597 = OpLogicalNot %80 %1596
OpLoopMerge %1593 %1592 None
OpBranchConditional %1597 %1587 %1593
%1587 = OpLabel
%1598 = OpGroupNonUniformBroadcastFirst %83 %72 %1581
%1599 = OpIEqual %82 %1581 %1598
%1600 = OpAll %80 %1599
OpStore %1595 %1600
OpSelectionMerge %1591 None
OpBranchConditional %1600 %1588 %1591
%1588 = OpLabel
%1601 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1582
%1602 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1590 None
OpBranchConditional %1602 %1589 %1590
%1589 = OpLabel
%1603 = OpImageTexelPointer %161 %1580 %1581 %127
%1604 = OpAtomicOr %5 %1603 %190 %55 %1601
OpBranch %1590
%1590 = OpLabel
OpBranch %1591
%1591 = OpLabel
OpBranch %1592
%1592 = OpLabel
OpBranch %1586
%1593 = OpLabel
OpBranch %1594
%1594 = OpLabel
OpReturn
OpFunctionEnd
%1718 = OpFunction %1 None %851
%1714 = OpFunctionParameter %26
%1715 = OpFunctionParameter %787
%1716 = OpFunctionParameter %5
%1717 = OpFunctionParameter %80
%1719 = OpLabel
%1729 = OpVariable %179 Function %178
OpSelectionMerge %1728 None
OpBranchConditional %1717 %1720 %1728
%1720 = OpLabel
%1730 = OpLoad %80 %1729
%1731 = OpLogicalNot %80 %1730
OpLoopMerge %1727 %1726 None
OpBranchConditional %1731 %1721 %1727
%1721 = OpLabel
%1732 = OpGroupNonUniformBroadcastFirst %787 %72 %1715
%1733 = OpIEqual %850 %1715 %1732
%1734 = OpAll %80 %1733
OpStore %1729 %1734
OpSelectionMerge %1725 None
OpBranchConditional %1734 %1722 %1725
%1722 = OpLabel
%1735 = OpGroupNonUniformBitwiseOr %5 %72 Reduce %1716
%1736 = OpGroupNonUniformElect %80 %72
OpSelectionMerge %1724 None
OpBranchConditional %1736 %1723 %1724
%1723 = OpLabel
%1737 = OpImageTexelPointer %161 %1714 %1715 %127
%1738 = OpAtomicOr %5 %1737 %190 %55 %1735
OpBranch %1724
%1724 = OpLabel
OpBranch %1725
%1725 = OpLabel
OpBranch %1726
%1726 = OpLabel
OpBranch %1720
%1727 = OpLabel
OpBranch %1728
%1728 = OpLabel
OpReturn
OpFunctionEnd
#endif
