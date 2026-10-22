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
            bool _846 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _846;
            if (_846)
            {
                uint64_t _847 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _850 = imageAtomicOr(img, coord, _847);
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
            bool _1553 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1553;
            if (_1553)
            {
                uint64_t _1554 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1557 = imageAtomicOr(img, coord, _1554);
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
            bool _1685 = all(equal(coord, subgroupBroadcastFirst(coord)));
            is_done = _1685;
            if (_1685)
            {
                uint64_t _1686 = subgroupOr(value);
                if (subgroupElect())
                {
                    uint64_t _1689 = imageAtomicOr(img, coord, _1686);
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
    vec2 _190 = vec2(textureSize(_8, _98));
    ivec2 _192 = -_85;
    vec2 _194 = _112 * ldexp(_190, _192);
    ResType _197;
    _197._m0 = frexp((_111 * _190) - vec2(0.00390625), _197._m1);
    vec2 _202 = min(ldexp(vec2(0.5), clamp(_197._m1, ivec2(0), ivec2(4)) + _192), vec2(0.5));
    ivec2 _206 = ivec2(max(_194 - _202, vec2(0.0)));
    bvec2 _208 = notEqual(_206, ivec2(_194 + _202));
    bool _209 = _208.x;
    bool _210 = _208.y;
    bool _222 = helperInvocationEXT();
    WriteFeedback(_21, _206, uint64_t(((1 | (_209 ? 2 : 0)) | (_210 ? 4 : 0)) | ((_209 && _210) ? 8 : 0)) << uint64_t(_98 * 4), (!_222) && (_95 != _98));
    vec2 _226 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _228 = imageSize(_21) & ivec2(15);
    float _234 = min(max(textureQueryLod(sampler2D(_8, _33), _226).x, CLAMP), 14.0);
    int _236 = int(_234);
    int _238 = int(_234 + 0.9970703125);
    vec2 _243 = abs(dFdx(_226));
    vec2 _244 = abs(dFdy(_226));
    vec2 _251 = vec2(max(_243.x, _244.x), max(_243.y, _244.y));
    vec2 _252 = fract(_226);
    vec2 _253 = vec2(textureSize(_8, _236));
    ivec2 _255 = -_228;
    vec2 _257 = _252 * ldexp(_253, _255);
    ResType _260;
    _260._m0 = frexp((_251 * _253) - vec2(0.00390625), _260._m1);
    vec2 _265 = min(ldexp(vec2(0.5), clamp(_260._m1, ivec2(0), ivec2(4)) + _255), vec2(0.5));
    ivec2 _269 = ivec2(max(_257 - _265, vec2(0.0)));
    bvec2 _271 = notEqual(_269, ivec2(_257 + _265));
    bool _272 = _271.x;
    bool _273 = _271.y;
    bool _285 = helperInvocationEXT();
    WriteFeedback(_21, _269, uint64_t(((1 | (_272 ? 2 : 0)) | (_273 ? 4 : 0)) | ((_272 && _273) ? 8 : 0)) << uint64_t(_236 * 4), !_285);
    vec2 _288 = vec2(textureSize(_8, _238));
    ivec2 _290 = -_228;
    vec2 _292 = _252 * ldexp(_288, _290);
    ResType _295;
    _295._m0 = frexp((_251 * _288) - vec2(0.00390625), _295._m1);
    vec2 _300 = min(ldexp(vec2(0.5), clamp(_295._m1, ivec2(0), ivec2(4)) + _290), vec2(0.5));
    ivec2 _304 = ivec2(max(_292 - _300, vec2(0.0)));
    bvec2 _306 = notEqual(_304, ivec2(_292 + _300));
    bool _307 = _306.x;
    bool _308 = _306.y;
    bool _320 = helperInvocationEXT();
    WriteFeedback(_21, _304, uint64_t(((1 | (_307 ? 2 : 0)) | (_308 ? 4 : 0)) | ((_307 && _308) ? 8 : 0)) << uint64_t(_238 * 4), (!_320) && (_236 != _238));
    ivec2 _326 = imageSize(_21) & ivec2(15);
    int _328 = textureQueryLevels(_8) - 1;
    float _330 = spvNClamp(gl_FragCoord.z, 0.0, float(_328));
    int _331 = int(_330);
    int _333 = int(_330 + 0.9970703125);
    vec2 _336 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _339 = -_326;
    vec2 _341 = _336 * ldexp(vec2(textureSize(_8, _331)), _339);
    vec2 _342 = ldexp(vec2(0.5), _339);
    ivec2 _346 = ivec2(max(_341 - _342, vec2(0.0)));
    bvec2 _348 = notEqual(_346, ivec2(_341 + _342));
    bool _349 = _348.x;
    bool _350 = _348.y;
    bool _362 = helperInvocationEXT();
    WriteFeedback(_21, _346, uint64_t(((1 | (_349 ? 2 : 0)) | (_350 ? 4 : 0)) | ((_349 && _350) ? 8 : 0)) << uint64_t(_331 * 4), !_362);
    ivec2 _367 = -_326;
    vec2 _369 = _336 * ldexp(vec2(textureSize(_8, _333)), _367);
    vec2 _370 = ldexp(vec2(0.5), _367);
    ivec2 _374 = ivec2(max(_369 - _370, vec2(0.0)));
    bvec2 _376 = notEqual(_374, ivec2(_369 + _370));
    bool _377 = _376.x;
    bool _378 = _376.y;
    bool _390 = helperInvocationEXT();
    WriteFeedback(_21, _374, uint64_t(((1 | (_377 ? 2 : 0)) | (_378 ? 4 : 0)) | ((_377 && _378) ? 8 : 0)) << uint64_t(_333 * 4), (!_390) && (_331 != _333));
    ivec2 _396 = imageSize(_21) & ivec2(15);
    int _398 = textureQueryLevels(_8) - 1;
    vec2 _399 = vec2(textureSize(_8, 0));
    vec2 _403 = _399 * vec2(GRADX.x, GRADX.y);
    vec2 _404 = _399 * vec2(GRADY.x, GRADY.y);
    float _411 = spvNClamp(log2(max(dot(_403, _403), dot(_404, _404))) * 0.5, 0.0, float(_398));
    int _412 = int(_411);
    int _414 = int(_411 + 0.9970703125);
    vec2 _417 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _420 = -_396;
    vec2 _422 = _417 * ldexp(vec2(textureSize(_8, _412)), _420);
    vec2 _423 = ldexp(vec2(0.5), _420);
    ivec2 _427 = ivec2(max(_422 - _423, vec2(0.0)));
    bvec2 _429 = notEqual(_427, ivec2(_422 + _423));
    bool _430 = _429.x;
    bool _431 = _429.y;
    bool _443 = helperInvocationEXT();
    WriteFeedback(_21, _427, uint64_t(((1 | (_430 ? 2 : 0)) | (_431 ? 4 : 0)) | ((_430 && _431) ? 8 : 0)) << uint64_t(_412 * 4), !_443);
    ivec2 _448 = -_396;
    vec2 _450 = _417 * ldexp(vec2(textureSize(_8, _414)), _448);
    vec2 _451 = ldexp(vec2(0.5), _448);
    ivec2 _455 = ivec2(max(_450 - _451, vec2(0.0)));
    bvec2 _457 = notEqual(_455, ivec2(_450 + _451));
    bool _458 = _457.x;
    bool _459 = _457.y;
    bool _471 = helperInvocationEXT();
    WriteFeedback(_21, _455, uint64_t(((1 | (_458 ? 2 : 0)) | (_459 ? 4 : 0)) | ((_458 && _459) ? 8 : 0)) << uint64_t(_414 * 4), (!_471) && (_412 != _414));
    ivec2 _477 = imageSize(_21) & ivec2(15);
    int _479 = textureQueryLevels(_8) - 1;
    vec2 _480 = vec2(textureSize(_8, 0));
    vec2 _484 = _480 * vec2(GRADX.x, GRADX.y);
    vec2 _485 = _480 * vec2(GRADY.x, GRADY.y);
    float _494 = min(max(spvNClamp(log2(max(dot(_484, _484), dot(_485, _485))) * 0.5, 0.0, float(_479)), CLAMP), 14.0);
    int _495 = int(_494);
    int _497 = int(_494 + 0.9970703125);
    vec2 _500 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _503 = -_477;
    vec2 _505 = _500 * ldexp(vec2(textureSize(_8, _495)), _503);
    vec2 _506 = ldexp(vec2(0.5), _503);
    ivec2 _510 = ivec2(max(_505 - _506, vec2(0.0)));
    bvec2 _512 = notEqual(_510, ivec2(_505 + _506));
    bool _513 = _512.x;
    bool _514 = _512.y;
    bool _526 = helperInvocationEXT();
    WriteFeedback(_21, _510, uint64_t(((1 | (_513 ? 2 : 0)) | (_514 ? 4 : 0)) | ((_513 && _514) ? 8 : 0)) << uint64_t(_495 * 4), !_526);
    ivec2 _531 = -_477;
    vec2 _533 = _500 * ldexp(vec2(textureSize(_8, _497)), _531);
    vec2 _534 = ldexp(vec2(0.5), _531);
    ivec2 _538 = ivec2(max(_533 - _534, vec2(0.0)));
    bvec2 _540 = notEqual(_538, ivec2(_533 + _534));
    bool _541 = _540.x;
    bool _542 = _540.y;
    bool _554 = helperInvocationEXT();
    WriteFeedback(_21, _538, uint64_t(((1 | (_541 ? 2 : 0)) | (_542 ? 4 : 0)) | ((_541 && _542) ? 8 : 0)) << uint64_t(_497 * 4), (!_554) && (_495 != _497));
    vec2 _558 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _560 = imageSize(_21) & ivec2(15);
    float _563 = exp2(gl_FragCoord.z);
    vec2 _566 = textureQueryLod(sampler2D(_8, _33), _558 * subgroupQuadBroadcast(_563, 0u));
    float _567 = _566.x;
    int _568 = int(_567);
    int _570 = int(_567 + 0.9970703125);
    vec2 _575 = abs(dFdx(_558));
    vec2 _576 = abs(dFdy(_558));
    vec2 _584 = vec2(max(_575.x, _576.x), max(_575.y, _576.y)) * _563;
    vec2 _585 = fract(_558);
    vec2 _586 = vec2(textureSize(_8, _568));
    ivec2 _588 = -_560;
    vec2 _590 = _585 * ldexp(_586, _588);
    ResType _593;
    _593._m0 = frexp((_584 * _586) - vec2(0.00390625), _593._m1);
    vec2 _598 = min(ldexp(vec2(0.5), clamp(_593._m1, ivec2(0), ivec2(4)) + _588), vec2(0.5));
    ivec2 _602 = ivec2(max(_590 - _598, vec2(0.0)));
    bvec2 _604 = notEqual(_602, ivec2(_590 + _598));
    bool _605 = _604.x;
    bool _606 = _604.y;
    bool _618 = helperInvocationEXT();
    WriteFeedback(_21, _602, uint64_t(((1 | (_605 ? 2 : 0)) | (_606 ? 4 : 0)) | ((_605 && _606) ? 8 : 0)) << uint64_t(_568 * 4), !_618);
    vec2 _621 = vec2(textureSize(_8, _570));
    ivec2 _623 = -_560;
    vec2 _625 = _585 * ldexp(_621, _623);
    ResType _628;
    _628._m0 = frexp((_584 * _621) - vec2(0.00390625), _628._m1);
    vec2 _633 = min(ldexp(vec2(0.5), clamp(_628._m1, ivec2(0), ivec2(4)) + _623), vec2(0.5));
    ivec2 _637 = ivec2(max(_625 - _633, vec2(0.0)));
    bvec2 _639 = notEqual(_637, ivec2(_625 + _633));
    bool _640 = _639.x;
    bool _641 = _639.y;
    bool _653 = helperInvocationEXT();
    WriteFeedback(_21, _637, uint64_t(((1 | (_640 ? 2 : 0)) | (_641 ? 4 : 0)) | ((_640 && _641) ? 8 : 0)) << uint64_t(_570 * 4), (!_653) && (_568 != _570));
    vec2 _657 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _659 = imageSize(_21) & ivec2(15);
    float _662 = exp2(gl_FragCoord.z);
    float _668 = min(max(textureQueryLod(sampler2D(_8, _33), _657 * subgroupQuadBroadcast(_662, 0u)).x, CLAMP), 14.0);
    int _669 = int(_668);
    int _671 = int(_668 + 0.9970703125);
    vec2 _676 = abs(dFdx(_657));
    vec2 _677 = abs(dFdy(_657));
    vec2 _685 = vec2(max(_676.x, _677.x), max(_676.y, _677.y)) * _662;
    vec2 _686 = fract(_657);
    vec2 _687 = vec2(textureSize(_8, _669));
    ivec2 _689 = -_659;
    vec2 _691 = _686 * ldexp(_687, _689);
    ResType _694;
    _694._m0 = frexp((_685 * _687) - vec2(0.00390625), _694._m1);
    vec2 _699 = min(ldexp(vec2(0.5), clamp(_694._m1, ivec2(0), ivec2(4)) + _689), vec2(0.5));
    ivec2 _703 = ivec2(max(_691 - _699, vec2(0.0)));
    bvec2 _705 = notEqual(_703, ivec2(_691 + _699));
    bool _706 = _705.x;
    bool _707 = _705.y;
    bool _719 = helperInvocationEXT();
    WriteFeedback(_21, _703, uint64_t(((1 | (_706 ? 2 : 0)) | (_707 ? 4 : 0)) | ((_706 && _707) ? 8 : 0)) << uint64_t(_669 * 4), !_719);
    vec2 _722 = vec2(textureSize(_8, _671));
    ivec2 _724 = -_659;
    vec2 _726 = _686 * ldexp(_722, _724);
    ResType _729;
    _729._m0 = frexp((_685 * _722) - vec2(0.00390625), _729._m1);
    vec2 _734 = min(ldexp(vec2(0.5), clamp(_729._m1, ivec2(0), ivec2(4)) + _724), vec2(0.5));
    ivec2 _738 = ivec2(max(_726 - _734, vec2(0.0)));
    bvec2 _740 = notEqual(_738, ivec2(_726 + _734));
    bool _741 = _740.x;
    bool _742 = _740.y;
    bool _754 = helperInvocationEXT();
    WriteFeedback(_21, _738, uint64_t(((1 | (_741 ? 2 : 0)) | (_742 ? 4 : 0)) | ((_741 && _742) ? 8 : 0)) << uint64_t(_671 * 4), (!_754) && (_669 != _671));
    int _759 = int(roundEven(gl_FragCoord.z));
    vec2 _760 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _764 = imageSize(_24).xy & ivec2(15);
    vec2 _769 = textureQueryLod(sampler2DArray(_11, _33), _760);
    float _770 = _769.x;
    int _771 = int(_770);
    int _773 = int(_770 + 0.9970703125);
    vec2 _778 = abs(dFdx(_760));
    vec2 _779 = abs(dFdy(_760));
    vec2 _786 = vec2(max(_778.x, _779.x), max(_778.y, _779.y));
    vec2 _787 = fract(_760);
    vec2 _788 = vec2(textureSize(_11, _771).xy);
    ivec2 _791 = -_764;
    vec2 _793 = _787 * ldexp(_788, _791);
    ResType _796;
    _796._m0 = frexp((_786 * _788) - vec2(0.00390625), _796._m1);
    vec2 _801 = min(ldexp(vec2(0.5), clamp(_796._m1, ivec2(0), ivec2(4)) + _791), vec2(0.5));
    ivec2 _805 = ivec2(max(_793 - _801, vec2(0.0)));
    bvec2 _807 = notEqual(_805, ivec2(_793 + _801));
    bool _808 = _807.x;
    bool _809 = _807.y;
    bool _822 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_805, _759), uint64_t(((1 | (_808 ? 2 : 0)) | (_809 ? 4 : 0)) | ((_808 && _809) ? 8 : 0)) << uint64_t(_771 * 4), !_822);
    vec2 _852 = vec2(textureSize(_11, _773).xy);
    ivec2 _855 = -_764;
    vec2 _857 = _787 * ldexp(_852, _855);
    ResType _860;
    _860._m0 = frexp((_786 * _852) - vec2(0.00390625), _860._m1);
    vec2 _865 = min(ldexp(vec2(0.5), clamp(_860._m1, ivec2(0), ivec2(4)) + _855), vec2(0.5));
    ivec2 _869 = ivec2(max(_857 - _865, vec2(0.0)));
    bvec2 _871 = notEqual(_869, ivec2(_857 + _865));
    bool _872 = _871.x;
    bool _873 = _871.y;
    bool _886 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_869, _759), uint64_t(((1 | (_872 ? 2 : 0)) | (_873 ? 4 : 0)) | ((_872 && _873) ? 8 : 0)) << uint64_t(_773 * 4), (!_886) && (_771 != _773));
    int _891 = int(roundEven(gl_FragCoord.z));
    vec2 _892 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _895 = imageSize(_24).xy & ivec2(15);
    float _901 = min(max(textureQueryLod(sampler2DArray(_11, _33), _892).x, CLAMP), 14.0);
    int _902 = int(_901);
    int _904 = int(_901 + 0.9970703125);
    vec2 _909 = abs(dFdx(_892));
    vec2 _910 = abs(dFdy(_892));
    vec2 _917 = vec2(max(_909.x, _910.x), max(_909.y, _910.y));
    vec2 _918 = fract(_892);
    vec2 _919 = vec2(textureSize(_11, _902).xy);
    ivec2 _922 = -_895;
    vec2 _924 = _918 * ldexp(_919, _922);
    ResType _927;
    _927._m0 = frexp((_917 * _919) - vec2(0.00390625), _927._m1);
    vec2 _932 = min(ldexp(vec2(0.5), clamp(_927._m1, ivec2(0), ivec2(4)) + _922), vec2(0.5));
    ivec2 _936 = ivec2(max(_924 - _932, vec2(0.0)));
    bvec2 _938 = notEqual(_936, ivec2(_924 + _932));
    bool _939 = _938.x;
    bool _940 = _938.y;
    bool _953 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_936, _891), uint64_t(((1 | (_939 ? 2 : 0)) | (_940 ? 4 : 0)) | ((_939 && _940) ? 8 : 0)) << uint64_t(_902 * 4), !_953);
    vec2 _956 = vec2(textureSize(_11, _904).xy);
    ivec2 _959 = -_895;
    vec2 _961 = _918 * ldexp(_956, _959);
    ResType _964;
    _964._m0 = frexp((_917 * _956) - vec2(0.00390625), _964._m1);
    vec2 _969 = min(ldexp(vec2(0.5), clamp(_964._m1, ivec2(0), ivec2(4)) + _959), vec2(0.5));
    ivec2 _973 = ivec2(max(_961 - _969, vec2(0.0)));
    bvec2 _975 = notEqual(_973, ivec2(_961 + _969));
    bool _976 = _975.x;
    bool _977 = _975.y;
    bool _990 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_973, _891), uint64_t(((1 | (_976 ? 2 : 0)) | (_977 ? 4 : 0)) | ((_976 && _977) ? 8 : 0)) << uint64_t(_904 * 4), (!_990) && (_902 != _904));
    int _995 = int(roundEven(gl_FragCoord.z));
    ivec2 _999 = imageSize(_24).xy & ivec2(15);
    int _1001 = textureQueryLevels(_11) - 1;
    float _1003 = spvNClamp(_76, 0.0, float(_1001));
    int _1004 = int(_1003);
    int _1006 = int(_1003 + 0.9970703125);
    vec2 _1009 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1013 = -_999;
    vec2 _1015 = _1009 * ldexp(vec2(textureSize(_11, _1004).xy), _1013);
    vec2 _1016 = ldexp(vec2(0.5), _1013);
    ivec2 _1020 = ivec2(max(_1015 - _1016, vec2(0.0)));
    bvec2 _1022 = notEqual(_1020, ivec2(_1015 + _1016));
    bool _1023 = _1022.x;
    bool _1024 = _1022.y;
    bool _1037 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1020, _995), uint64_t(((1 | (_1023 ? 2 : 0)) | (_1024 ? 4 : 0)) | ((_1023 && _1024) ? 8 : 0)) << uint64_t(_1004 * 4), !_1037);
    ivec2 _1043 = -_999;
    vec2 _1045 = _1009 * ldexp(vec2(textureSize(_11, _1006).xy), _1043);
    vec2 _1046 = ldexp(vec2(0.5), _1043);
    ivec2 _1050 = ivec2(max(_1045 - _1046, vec2(0.0)));
    bvec2 _1052 = notEqual(_1050, ivec2(_1045 + _1046));
    bool _1053 = _1052.x;
    bool _1054 = _1052.y;
    bool _1067 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1050, _995), uint64_t(((1 | (_1053 ? 2 : 0)) | (_1054 ? 4 : 0)) | ((_1053 && _1054) ? 8 : 0)) << uint64_t(_1006 * 4), (!_1067) && (_1004 != _1006));
    int _1072 = int(roundEven(gl_FragCoord.z));
    ivec2 _1076 = imageSize(_24).xy & ivec2(15);
    int _1078 = textureQueryLevels(_11) - 1;
    vec2 _1079 = vec2(textureSize(_11, 0).xy);
    vec2 _1084 = _1079 * vec2(GRADX.x, GRADX.y);
    vec2 _1085 = _1079 * vec2(GRADY.x, GRADY.y);
    float _1092 = spvNClamp(log2(max(dot(_1084, _1084), dot(_1085, _1085))) * 0.5, 0.0, float(_1078));
    int _1093 = int(_1092);
    int _1095 = int(_1092 + 0.9970703125);
    vec2 _1098 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1102 = -_1076;
    vec2 _1104 = _1098 * ldexp(vec2(textureSize(_11, _1093).xy), _1102);
    vec2 _1105 = ldexp(vec2(0.5), _1102);
    ivec2 _1109 = ivec2(max(_1104 - _1105, vec2(0.0)));
    bvec2 _1111 = notEqual(_1109, ivec2(_1104 + _1105));
    bool _1112 = _1111.x;
    bool _1113 = _1111.y;
    bool _1126 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1109, _1072), uint64_t(((1 | (_1112 ? 2 : 0)) | (_1113 ? 4 : 0)) | ((_1112 && _1113) ? 8 : 0)) << uint64_t(_1093 * 4), !_1126);
    ivec2 _1132 = -_1076;
    vec2 _1134 = _1098 * ldexp(vec2(textureSize(_11, _1095).xy), _1132);
    vec2 _1135 = ldexp(vec2(0.5), _1132);
    ivec2 _1139 = ivec2(max(_1134 - _1135, vec2(0.0)));
    bvec2 _1141 = notEqual(_1139, ivec2(_1134 + _1135));
    bool _1142 = _1141.x;
    bool _1143 = _1141.y;
    bool _1156 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1139, _1072), uint64_t(((1 | (_1142 ? 2 : 0)) | (_1143 ? 4 : 0)) | ((_1142 && _1143) ? 8 : 0)) << uint64_t(_1095 * 4), (!_1156) && (_1093 != _1095));
    int _1161 = int(roundEven(gl_FragCoord.z));
    ivec2 _1165 = imageSize(_24).xy & ivec2(15);
    int _1167 = textureQueryLevels(_11) - 1;
    vec2 _1168 = vec2(textureSize(_11, 0).xy);
    vec2 _1173 = _1168 * vec2(GRADX.x, GRADX.y);
    vec2 _1174 = _1168 * vec2(GRADY.x, GRADY.y);
    float _1183 = min(max(spvNClamp(log2(max(dot(_1173, _1173), dot(_1174, _1174))) * 0.5, 0.0, float(_1167)), CLAMP), 14.0);
    int _1184 = int(_1183);
    int _1186 = int(_1183 + 0.9970703125);
    vec2 _1189 = fract(vec2(gl_FragCoord.x, gl_FragCoord.y));
    ivec2 _1193 = -_1165;
    vec2 _1195 = _1189 * ldexp(vec2(textureSize(_11, _1184).xy), _1193);
    vec2 _1196 = ldexp(vec2(0.5), _1193);
    ivec2 _1200 = ivec2(max(_1195 - _1196, vec2(0.0)));
    bvec2 _1202 = notEqual(_1200, ivec2(_1195 + _1196));
    bool _1203 = _1202.x;
    bool _1204 = _1202.y;
    bool _1217 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1200, _1161), uint64_t(((1 | (_1203 ? 2 : 0)) | (_1204 ? 4 : 0)) | ((_1203 && _1204) ? 8 : 0)) << uint64_t(_1184 * 4), !_1217);
    ivec2 _1223 = -_1165;
    vec2 _1225 = _1189 * ldexp(vec2(textureSize(_11, _1186).xy), _1223);
    vec2 _1226 = ldexp(vec2(0.5), _1223);
    ivec2 _1230 = ivec2(max(_1225 - _1226, vec2(0.0)));
    bvec2 _1232 = notEqual(_1230, ivec2(_1225 + _1226));
    bool _1233 = _1232.x;
    bool _1234 = _1232.y;
    bool _1247 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1230, _1161), uint64_t(((1 | (_1233 ? 2 : 0)) | (_1234 ? 4 : 0)) | ((_1233 && _1234) ? 8 : 0)) << uint64_t(_1186 * 4), (!_1247) && (_1184 != _1186));
    int _1252 = int(roundEven(gl_FragCoord.z));
    vec2 _1253 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1256 = imageSize(_24).xy & ivec2(15);
    float _1259 = exp2(gl_FragCoord.z);
    vec2 _1262 = textureQueryLod(sampler2DArray(_11, _33), _1253 * subgroupQuadBroadcast(_1259, 0u));
    float _1263 = _1262.x;
    int _1264 = int(_1263);
    int _1266 = int(_1263 + 0.9970703125);
    vec2 _1271 = abs(dFdx(_1253));
    vec2 _1272 = abs(dFdy(_1253));
    vec2 _1280 = vec2(max(_1271.x, _1272.x), max(_1271.y, _1272.y)) * _1259;
    vec2 _1281 = fract(_1253);
    vec2 _1282 = vec2(textureSize(_11, _1264).xy);
    ivec2 _1285 = -_1256;
    vec2 _1287 = _1281 * ldexp(_1282, _1285);
    ResType _1290;
    _1290._m0 = frexp((_1280 * _1282) - vec2(0.00390625), _1290._m1);
    vec2 _1295 = min(ldexp(vec2(0.5), clamp(_1290._m1, ivec2(0), ivec2(4)) + _1285), vec2(0.5));
    ivec2 _1299 = ivec2(max(_1287 - _1295, vec2(0.0)));
    bvec2 _1301 = notEqual(_1299, ivec2(_1287 + _1295));
    bool _1302 = _1301.x;
    bool _1303 = _1301.y;
    bool _1316 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1299, _1252), uint64_t(((1 | (_1302 ? 2 : 0)) | (_1303 ? 4 : 0)) | ((_1302 && _1303) ? 8 : 0)) << uint64_t(_1264 * 4), !_1316);
    vec2 _1319 = vec2(textureSize(_11, _1266).xy);
    ivec2 _1322 = -_1256;
    vec2 _1324 = _1281 * ldexp(_1319, _1322);
    ResType _1327;
    _1327._m0 = frexp((_1280 * _1319) - vec2(0.00390625), _1327._m1);
    vec2 _1332 = min(ldexp(vec2(0.5), clamp(_1327._m1, ivec2(0), ivec2(4)) + _1322), vec2(0.5));
    ivec2 _1336 = ivec2(max(_1324 - _1332, vec2(0.0)));
    bvec2 _1338 = notEqual(_1336, ivec2(_1324 + _1332));
    bool _1339 = _1338.x;
    bool _1340 = _1338.y;
    bool _1353 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1336, _1252), uint64_t(((1 | (_1339 ? 2 : 0)) | (_1340 ? 4 : 0)) | ((_1339 && _1340) ? 8 : 0)) << uint64_t(_1266 * 4), (!_1353) && (_1264 != _1266));
    int _1358 = int(roundEven(gl_FragCoord.z));
    vec2 _1359 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1362 = imageSize(_24).xy & ivec2(15);
    float _1365 = exp2(_76);
    float _1371 = min(max(textureQueryLod(sampler2DArray(_11, _33), _1359 * subgroupQuadBroadcast(_1365, 0u)).x, CLAMP), 14.0);
    int _1372 = int(_1371);
    int _1374 = int(_1371 + 0.9970703125);
    vec2 _1379 = abs(dFdx(_1359));
    vec2 _1380 = abs(dFdy(_1359));
    vec2 _1388 = vec2(max(_1379.x, _1380.x), max(_1379.y, _1380.y)) * _1365;
    vec2 _1389 = fract(_1359);
    vec2 _1390 = vec2(textureSize(_11, _1372).xy);
    ivec2 _1393 = -_1362;
    vec2 _1395 = _1389 * ldexp(_1390, _1393);
    ResType _1398;
    _1398._m0 = frexp((_1388 * _1390) - vec2(0.00390625), _1398._m1);
    vec2 _1403 = min(ldexp(vec2(0.5), clamp(_1398._m1, ivec2(0), ivec2(4)) + _1393), vec2(0.5));
    ivec2 _1407 = ivec2(max(_1395 - _1403, vec2(0.0)));
    bvec2 _1409 = notEqual(_1407, ivec2(_1395 + _1403));
    bool _1410 = _1409.x;
    bool _1411 = _1409.y;
    bool _1424 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1407, _1358), uint64_t(((1 | (_1410 ? 2 : 0)) | (_1411 ? 4 : 0)) | ((_1410 && _1411) ? 8 : 0)) << uint64_t(_1372 * 4), !_1424);
    vec2 _1427 = vec2(textureSize(_11, _1374).xy);
    ivec2 _1430 = -_1362;
    vec2 _1432 = _1389 * ldexp(_1427, _1430);
    ResType _1435;
    _1435._m0 = frexp((_1388 * _1427) - vec2(0.00390625), _1435._m1);
    vec2 _1440 = min(ldexp(vec2(0.5), clamp(_1435._m1, ivec2(0), ivec2(4)) + _1430), vec2(0.5));
    ivec2 _1444 = ivec2(max(_1432 - _1440, vec2(0.0)));
    bvec2 _1446 = notEqual(_1444, ivec2(_1432 + _1440));
    bool _1447 = _1446.x;
    bool _1448 = _1446.y;
    bool _1461 = helperInvocationEXT();
    WriteFeedbackArray(_24, ivec3(_1444, _1358), uint64_t(((1 | (_1447 ? 2 : 0)) | (_1448 ? 4 : 0)) | ((_1447 && _1448) ? 8 : 0)) << uint64_t(_1374 * 4), (!_1461) && (_1372 != _1374));
    uint _1465 = IDX + 0u;
    uint _1468 = IDX + 0u;
    uint _1471 = IDX + 0u;
    vec2 _1474 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1476 = imageSize(_27[nonuniformEXT(_1465)]) & ivec2(15);
    vec2 _1480 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1468], _36[_1471])), _1474);
    float _1481 = _1480.x;
    int _1482 = int(_1481);
    int _1484 = int(_1481 + 0.9970703125);
    vec2 _1489 = abs(dFdx(_1474));
    vec2 _1490 = abs(dFdy(_1474));
    vec2 _1497 = vec2(max(_1489.x, _1490.x), max(_1489.y, _1490.y));
    vec2 _1498 = fract(_1474);
    vec2 _1499 = vec2(textureSize(_14[nonuniformEXT(_1468)], _1482));
    ivec2 _1501 = -_1476;
    vec2 _1503 = _1498 * ldexp(_1499, _1501);
    ResType _1506;
    _1506._m0 = frexp((_1497 * _1499) - vec2(0.00390625), _1506._m1);
    vec2 _1511 = min(ldexp(vec2(0.5), clamp(_1506._m1, ivec2(0), ivec2(4)) + _1501), vec2(0.5));
    ivec2 _1515 = ivec2(max(_1503 - _1511, vec2(0.0)));
    bvec2 _1517 = notEqual(_1515, ivec2(_1503 + _1511));
    bool _1518 = _1517.x;
    bool _1519 = _1517.y;
    bool _1531 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1465], _1515, uint64_t(((1 | (_1518 ? 2 : 0)) | (_1519 ? 4 : 0)) | ((_1518 && _1519) ? 8 : 0)) << uint64_t(_1482 * 4), !_1531);
    vec2 _1559 = vec2(textureSize(_14[nonuniformEXT(_1468)], _1484));
    ivec2 _1561 = -_1476;
    vec2 _1563 = _1498 * ldexp(_1559, _1561);
    ResType _1566;
    _1566._m0 = frexp((_1497 * _1559) - vec2(0.00390625), _1566._m1);
    vec2 _1571 = min(ldexp(vec2(0.5), clamp(_1566._m1, ivec2(0), ivec2(4)) + _1561), vec2(0.5));
    ivec2 _1575 = ivec2(max(_1563 - _1571, vec2(0.0)));
    bvec2 _1577 = notEqual(_1575, ivec2(_1563 + _1571));
    bool _1578 = _1577.x;
    bool _1579 = _1577.y;
    bool _1591 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1465], _1575, uint64_t(((1 | (_1578 ? 2 : 0)) | (_1579 ? 4 : 0)) | ((_1578 && _1579) ? 8 : 0)) << uint64_t(_1484 * 4), (!_1591) && (_1482 != _1484));
    uint _1595 = IDX + 0u;
    uint _1598 = IDX + 0u;
    int _1602 = int(roundEven(gl_FragCoord.z));
    vec2 _1603 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1606 = imageSize(_30[nonuniformEXT(_1595)]).xy & ivec2(15);
    vec2 _1610 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1598], _36[_1471])), _1603);
    float _1611 = _1610.x;
    int _1612 = int(_1611);
    int _1614 = int(_1611 + 0.9970703125);
    vec2 _1619 = abs(dFdx(_1603));
    vec2 _1620 = abs(dFdy(_1603));
    vec2 _1627 = vec2(max(_1619.x, _1620.x), max(_1619.y, _1620.y));
    vec2 _1628 = fract(_1603);
    vec2 _1629 = vec2(textureSize(_17[nonuniformEXT(_1598)], _1612).xy);
    ivec2 _1632 = -_1606;
    vec2 _1634 = _1628 * ldexp(_1629, _1632);
    ResType _1637;
    _1637._m0 = frexp((_1627 * _1629) - vec2(0.00390625), _1637._m1);
    vec2 _1642 = min(ldexp(vec2(0.5), clamp(_1637._m1, ivec2(0), ivec2(4)) + _1632), vec2(0.5));
    ivec2 _1646 = ivec2(max(_1634 - _1642, vec2(0.0)));
    bvec2 _1648 = notEqual(_1646, ivec2(_1634 + _1642));
    bool _1649 = _1648.x;
    bool _1650 = _1648.y;
    bool _1663 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1595], ivec3(_1646, _1602), uint64_t(((1 | (_1649 ? 2 : 0)) | (_1650 ? 4 : 0)) | ((_1649 && _1650) ? 8 : 0)) << uint64_t(_1612 * 4), !_1663);
    vec2 _1691 = vec2(textureSize(_17[nonuniformEXT(_1598)], _1614).xy);
    ivec2 _1694 = -_1606;
    vec2 _1696 = _1628 * ldexp(_1691, _1694);
    ResType _1699;
    _1699._m0 = frexp((_1627 * _1691) - vec2(0.00390625), _1699._m1);
    vec2 _1704 = min(ldexp(vec2(0.5), clamp(_1699._m1, ivec2(0), ivec2(4)) + _1694), vec2(0.5));
    ivec2 _1708 = ivec2(max(_1696 - _1704, vec2(0.0)));
    bvec2 _1710 = notEqual(_1708, ivec2(_1696 + _1704));
    bool _1711 = _1710.x;
    bool _1712 = _1710.y;
    bool _1725 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1595], ivec3(_1708, _1602), uint64_t(((1 | (_1711 ? 2 : 0)) | (_1712 ? 4 : 0)) | ((_1711 && _1712) ? 8 : 0)) << uint64_t(_1614 * 4), (!_1725) && (_1612 != _1614));
    vec2 _1729 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1731 = imageSize(_27[nonuniformEXT(_1465)]) & ivec2(15);
    vec2 _1734 = textureQueryLod(nonuniformEXT(sampler2D(_14[_1468], _36[_1471])), _1729);
    float _1735 = _1734.x;
    int _1736 = int(_1735);
    int _1738 = int(_1735 + 0.9970703125);
    vec2 _1743 = abs(dFdx(_1729));
    vec2 _1744 = abs(dFdy(_1729));
    vec2 _1751 = vec2(max(_1743.x, _1744.x), max(_1743.y, _1744.y));
    vec2 _1752 = fract(_1729);
    vec2 _1753 = vec2(textureSize(_14[nonuniformEXT(_1468)], _1736));
    ivec2 _1755 = -_1731;
    vec2 _1757 = _1752 * ldexp(_1753, _1755);
    ResType _1760;
    _1760._m0 = frexp((_1751 * _1753) - vec2(0.00390625), _1760._m1);
    vec2 _1765 = min(ldexp(vec2(0.5), clamp(_1760._m1, ivec2(0), ivec2(4)) + _1755), vec2(0.5));
    ivec2 _1769 = ivec2(max(_1757 - _1765, vec2(0.0)));
    bvec2 _1771 = notEqual(_1769, ivec2(_1757 + _1765));
    bool _1772 = _1771.x;
    bool _1773 = _1771.y;
    bool _1785 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1465], _1769, uint64_t(((1 | (_1772 ? 2 : 0)) | (_1773 ? 4 : 0)) | ((_1772 && _1773) ? 8 : 0)) << uint64_t(_1736 * 4), !_1785);
    vec2 _1788 = vec2(textureSize(_14[nonuniformEXT(_1468)], _1738));
    ivec2 _1790 = -_1731;
    vec2 _1792 = _1752 * ldexp(_1788, _1790);
    ResType _1795;
    _1795._m0 = frexp((_1751 * _1788) - vec2(0.00390625), _1795._m1);
    vec2 _1800 = min(ldexp(vec2(0.5), clamp(_1795._m1, ivec2(0), ivec2(4)) + _1790), vec2(0.5));
    ivec2 _1804 = ivec2(max(_1792 - _1800, vec2(0.0)));
    bvec2 _1806 = notEqual(_1804, ivec2(_1792 + _1800));
    bool _1807 = _1806.x;
    bool _1808 = _1806.y;
    bool _1820 = helperInvocationEXT();
    WriteFeedbackNonUniform(_27[_1465], _1804, uint64_t(((1 | (_1807 ? 2 : 0)) | (_1808 ? 4 : 0)) | ((_1807 && _1808) ? 8 : 0)) << uint64_t(_1738 * 4), (!_1820) && (_1736 != _1738));
    int _1825 = int(roundEven(gl_FragCoord.z));
    vec2 _1826 = vec2(gl_FragCoord.x, gl_FragCoord.y);
    ivec2 _1829 = imageSize(_30[nonuniformEXT(_1595)]).xy & ivec2(15);
    vec2 _1832 = textureQueryLod(nonuniformEXT(sampler2DArray(_17[_1598], _36[_1471])), _1826);
    float _1833 = _1832.x;
    int _1834 = int(_1833);
    int _1836 = int(_1833 + 0.9970703125);
    vec2 _1841 = abs(dFdx(_1826));
    vec2 _1842 = abs(dFdy(_1826));
    vec2 _1849 = vec2(max(_1841.x, _1842.x), max(_1841.y, _1842.y));
    vec2 _1850 = fract(_1826);
    vec2 _1851 = vec2(textureSize(_17[nonuniformEXT(_1598)], _1834).xy);
    ivec2 _1854 = -_1829;
    vec2 _1856 = _1850 * ldexp(_1851, _1854);
    ResType _1859;
    _1859._m0 = frexp((_1849 * _1851) - vec2(0.00390625), _1859._m1);
    vec2 _1864 = min(ldexp(vec2(0.5), clamp(_1859._m1, ivec2(0), ivec2(4)) + _1854), vec2(0.5));
    ivec2 _1868 = ivec2(max(_1856 - _1864, vec2(0.0)));
    bvec2 _1870 = notEqual(_1868, ivec2(_1856 + _1864));
    bool _1871 = _1870.x;
    bool _1872 = _1870.y;
    bool _1885 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1595], ivec3(_1868, _1825), uint64_t(((1 | (_1871 ? 2 : 0)) | (_1872 ? 4 : 0)) | ((_1871 && _1872) ? 8 : 0)) << uint64_t(_1834 * 4), !_1885);
    vec2 _1888 = vec2(textureSize(_17[nonuniformEXT(_1598)], _1836).xy);
    ivec2 _1891 = -_1829;
    vec2 _1893 = _1850 * ldexp(_1888, _1891);
    ResType _1896;
    _1896._m0 = frexp((_1849 * _1888) - vec2(0.00390625), _1896._m1);
    vec2 _1901 = min(ldexp(vec2(0.5), clamp(_1896._m1, ivec2(0), ivec2(4)) + _1891), vec2(0.5));
    ivec2 _1905 = ivec2(max(_1893 - _1901, vec2(0.0)));
    bvec2 _1907 = notEqual(_1905, ivec2(_1893 + _1901));
    bool _1908 = _1907.x;
    bool _1909 = _1907.y;
    bool _1922 = helperInvocationEXT();
    WriteFeedbackArrayNonUniform(_30[_1595], ivec3(_1905, _1825), uint64_t(((1 | (_1908 ? 2 : 0)) | (_1909 ? 4 : 0)) | ((_1908 && _1909) ? 8 : 0)) << uint64_t(_1836 * 4), (!_1922) && (_1834 != _1836));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 1927
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
%78 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
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
OpName %830 "WriteFeedbackArray"
OpName %826 "img"
OpName %827 "coord"
OpName %828 "value"
OpName %829 "active_lane"
OpName %841 "is_done"
OpName %1537 "WriteFeedbackNonUniform"
OpName %1533 "img"
OpName %1534 "coord"
OpName %1535 "value"
OpName %1536 "active_lane"
OpName %1548 "is_done"
OpName %1669 "WriteFeedbackArrayNonUniform"
OpName %1665 "img"
OpName %1666 "coord"
OpName %1667 "value"
OpName %1668 "active_lane"
OpName %1680 "is_done"
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
OpDecorate %1465 NonUniform
OpDecorate %1467 NonUniform
OpDecorate %1468 NonUniform
OpDecorate %1470 NonUniform
OpDecorate %1471 NonUniform
OpDecorate %1473 NonUniform
OpDecorate %1479 NonUniform
OpDecorate %1556 NonUniform
OpDecorate %1595 NonUniform
OpDecorate %1597 NonUniform
OpDecorate %1598 NonUniform
OpDecorate %1600 NonUniform
OpDecorate %1609 NonUniform
OpDecorate %1688 NonUniform
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
%235 = OpConstant %5 14
%761 = OpTypeVector %80 3
%767 = OpTypeSampledImage %9
%824 = OpTypeVector %79 3
%825 = OpTypeFunction %1 %23 %761 %18 %79
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %1926
%1926 = OpLabel
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
%189 = OpFunctionCall %1 %166 %21 %140 %157 %159
%191 = OpImageQuerySizeLod %82 %52 %98
%190 = OpConvertSToF %40 %191
%192 = OpSNegate %82 %85
%193 = OpExtInst %40 %78 Ldexp %190 %192
%194 = OpFMul %40 %112 %193
%195 = OpFMul %40 %111 %190
%196 = OpFSub %40 %195 %121
%197 = OpExtInst %122 %78 FrexpStruct %196
%198 = OpCompositeExtract %82 %197 1
%199 = OpExtInst %82 %78 SClamp %198 %127 %129
%200 = OpIAdd %82 %199 %192
%201 = OpExtInst %40 %78 Ldexp %133 %200
%202 = OpExtInst %40 %78 FMin %201 %133
%203 = OpFSub %40 %194 %202
%204 = OpExtInst %40 %78 FMax %203 %138
%205 = OpFAdd %40 %194 %202
%206 = OpConvertFToS %82 %204
%207 = OpConvertFToS %82 %205
%208 = OpINotEqual %81 %206 %207
%209 = OpCompositeExtract %79 %208 0
%210 = OpCompositeExtract %79 %208 1
%211 = OpLogicalAnd %79 %209 %210
%212 = OpSelect %80 %209 %147 %126
%213 = OpBitwiseOr %80 %90 %212
%214 = OpSelect %80 %210 %128 %126
%215 = OpBitwiseOr %80 %213 %214
%216 = OpSelect %80 %211 %152 %126
%217 = OpBitwiseOr %80 %215 %216
%218 = OpSConvert %18 %217
%219 = OpIMul %80 %98 %128
%220 = OpSConvert %18 %219
%221 = OpShiftLeftLogical %18 %218 %220
%222 = OpIsHelperInvocationEXT %79
%223 = OpLogicalNot %79 %222
%224 = OpLogicalAnd %79 %223 %100
%225 = OpFunctionCall %1 %166 %21 %206 %221 %224
%226 = OpCompositeConstruct %40 %67 %69
%227 = OpImageQuerySize %82 %50
%228 = OpBitwiseAnd %82 %227 %87
%229 = OpImageQueryLevels %80 %52
%230 = OpISub %80 %229 %90
%231 = OpImageQueryLod %40 %92 %226
%232 = OpCompositeExtract %5 %231 0
%233 = OpExtInst %5 %78 FMax %232 %55
%234 = OpExtInst %5 %78 FMin %233 %235
%236 = OpConvertFToS %80 %234
%237 = OpFAdd %5 %234 %97
%238 = OpConvertFToS %80 %237
%239 = OpExtInst %80 %78 SMin %238 %230
%240 = OpINotEqual %79 %236 %238
%241 = OpDPdx %40 %226
%242 = OpDPdy %40 %226
%243 = OpExtInst %40 %78 FAbs %241
%244 = OpExtInst %40 %78 FAbs %242
%245 = OpCompositeExtract %5 %243 0
%246 = OpCompositeExtract %5 %244 0
%247 = OpCompositeExtract %5 %243 1
%248 = OpCompositeExtract %5 %244 1
%249 = OpExtInst %5 %78 FMax %245 %246
%250 = OpExtInst %5 %78 FMax %247 %248
%251 = OpCompositeConstruct %40 %249 %250
%252 = OpExtInst %40 %78 Fract %226
%254 = OpImageQuerySizeLod %82 %52 %236
%253 = OpConvertSToF %40 %254
%255 = OpSNegate %82 %228
%256 = OpExtInst %40 %78 Ldexp %253 %255
%257 = OpFMul %40 %252 %256
%258 = OpFMul %40 %251 %253
%259 = OpFSub %40 %258 %121
%260 = OpExtInst %122 %78 FrexpStruct %259
%261 = OpCompositeExtract %82 %260 1
%262 = OpExtInst %82 %78 SClamp %261 %127 %129
%263 = OpIAdd %82 %262 %255
%264 = OpExtInst %40 %78 Ldexp %133 %263
%265 = OpExtInst %40 %78 FMin %264 %133
%266 = OpFSub %40 %257 %265
%267 = OpExtInst %40 %78 FMax %266 %138
%268 = OpFAdd %40 %257 %265
%269 = OpConvertFToS %82 %267
%270 = OpConvertFToS %82 %268
%271 = OpINotEqual %81 %269 %270
%272 = OpCompositeExtract %79 %271 0
%273 = OpCompositeExtract %79 %271 1
%274 = OpLogicalAnd %79 %272 %273
%275 = OpSelect %80 %272 %147 %126
%276 = OpBitwiseOr %80 %90 %275
%277 = OpSelect %80 %273 %128 %126
%278 = OpBitwiseOr %80 %276 %277
%279 = OpSelect %80 %274 %152 %126
%280 = OpBitwiseOr %80 %278 %279
%281 = OpSConvert %18 %280
%282 = OpIMul %80 %236 %128
%283 = OpSConvert %18 %282
%284 = OpShiftLeftLogical %18 %281 %283
%285 = OpIsHelperInvocationEXT %79
%286 = OpLogicalNot %79 %285
%287 = OpFunctionCall %1 %166 %21 %269 %284 %286
%289 = OpImageQuerySizeLod %82 %52 %238
%288 = OpConvertSToF %40 %289
%290 = OpSNegate %82 %228
%291 = OpExtInst %40 %78 Ldexp %288 %290
%292 = OpFMul %40 %252 %291
%293 = OpFMul %40 %251 %288
%294 = OpFSub %40 %293 %121
%295 = OpExtInst %122 %78 FrexpStruct %294
%296 = OpCompositeExtract %82 %295 1
%297 = OpExtInst %82 %78 SClamp %296 %127 %129
%298 = OpIAdd %82 %297 %290
%299 = OpExtInst %40 %78 Ldexp %133 %298
%300 = OpExtInst %40 %78 FMin %299 %133
%301 = OpFSub %40 %292 %300
%302 = OpExtInst %40 %78 FMax %301 %138
%303 = OpFAdd %40 %292 %300
%304 = OpConvertFToS %82 %302
%305 = OpConvertFToS %82 %303
%306 = OpINotEqual %81 %304 %305
%307 = OpCompositeExtract %79 %306 0
%308 = OpCompositeExtract %79 %306 1
%309 = OpLogicalAnd %79 %307 %308
%310 = OpSelect %80 %307 %147 %126
%311 = OpBitwiseOr %80 %90 %310
%312 = OpSelect %80 %308 %128 %126
%313 = OpBitwiseOr %80 %311 %312
%314 = OpSelect %80 %309 %152 %126
%315 = OpBitwiseOr %80 %313 %314
%316 = OpSConvert %18 %315
%317 = OpIMul %80 %238 %128
%318 = OpSConvert %18 %317
%319 = OpShiftLeftLogical %18 %316 %318
%320 = OpIsHelperInvocationEXT %79
%321 = OpLogicalNot %79 %320
%322 = OpLogicalAnd %79 %321 %240
%323 = OpFunctionCall %1 %166 %21 %304 %319 %322
%324 = OpCompositeConstruct %40 %67 %69
%325 = OpImageQuerySize %82 %50
%326 = OpBitwiseAnd %82 %325 %87
%327 = OpImageQueryLevels %80 %52
%328 = OpISub %80 %327 %90
%329 = OpConvertSToF %5 %328
%330 = OpExtInst %5 %78 NClamp %72 %137 %329
%331 = OpConvertFToS %80 %330
%332 = OpFAdd %5 %330 %97
%333 = OpConvertFToS %80 %332
%334 = OpExtInst %80 %78 SMin %333 %328
%335 = OpINotEqual %79 %331 %333
%336 = OpExtInst %40 %78 Fract %324
%338 = OpImageQuerySizeLod %82 %52 %331
%337 = OpConvertSToF %40 %338
%339 = OpSNegate %82 %326
%340 = OpExtInst %40 %78 Ldexp %337 %339
%341 = OpFMul %40 %336 %340
%342 = OpExtInst %40 %78 Ldexp %133 %339
%343 = OpFSub %40 %341 %342
%344 = OpExtInst %40 %78 FMax %343 %138
%345 = OpFAdd %40 %341 %342
%346 = OpConvertFToS %82 %344
%347 = OpConvertFToS %82 %345
%348 = OpINotEqual %81 %346 %347
%349 = OpCompositeExtract %79 %348 0
%350 = OpCompositeExtract %79 %348 1
%351 = OpLogicalAnd %79 %349 %350
%352 = OpSelect %80 %349 %147 %126
%353 = OpBitwiseOr %80 %90 %352
%354 = OpSelect %80 %350 %128 %126
%355 = OpBitwiseOr %80 %353 %354
%356 = OpSelect %80 %351 %152 %126
%357 = OpBitwiseOr %80 %355 %356
%358 = OpSConvert %18 %357
%359 = OpIMul %80 %331 %128
%360 = OpSConvert %18 %359
%361 = OpShiftLeftLogical %18 %358 %360
%362 = OpIsHelperInvocationEXT %79
%363 = OpLogicalNot %79 %362
%364 = OpFunctionCall %1 %166 %21 %346 %361 %363
%366 = OpImageQuerySizeLod %82 %52 %333
%365 = OpConvertSToF %40 %366
%367 = OpSNegate %82 %326
%368 = OpExtInst %40 %78 Ldexp %365 %367
%369 = OpFMul %40 %336 %368
%370 = OpExtInst %40 %78 Ldexp %133 %367
%371 = OpFSub %40 %369 %370
%372 = OpExtInst %40 %78 FMax %371 %138
%373 = OpFAdd %40 %369 %370
%374 = OpConvertFToS %82 %372
%375 = OpConvertFToS %82 %373
%376 = OpINotEqual %81 %374 %375
%377 = OpCompositeExtract %79 %376 0
%378 = OpCompositeExtract %79 %376 1
%379 = OpLogicalAnd %79 %377 %378
%380 = OpSelect %80 %377 %147 %126
%381 = OpBitwiseOr %80 %90 %380
%382 = OpSelect %80 %378 %128 %126
%383 = OpBitwiseOr %80 %381 %382
%384 = OpSelect %80 %379 %152 %126
%385 = OpBitwiseOr %80 %383 %384
%386 = OpSConvert %18 %385
%387 = OpIMul %80 %333 %128
%388 = OpSConvert %18 %387
%389 = OpShiftLeftLogical %18 %386 %388
%390 = OpIsHelperInvocationEXT %79
%391 = OpLogicalNot %79 %390
%392 = OpLogicalAnd %79 %391 %335
%393 = OpFunctionCall %1 %166 %21 %374 %389 %392
%394 = OpCompositeConstruct %40 %67 %69
%395 = OpImageQuerySize %82 %50
%396 = OpBitwiseAnd %82 %395 %87
%397 = OpImageQueryLevels %80 %52
%398 = OpISub %80 %397 %90
%400 = OpImageQuerySizeLod %82 %52 %126
%399 = OpConvertSToF %40 %400
%401 = OpCompositeConstruct %40 %63 %65
%402 = OpCompositeConstruct %40 %58 %61
%403 = OpFMul %40 %399 %401
%404 = OpFMul %40 %399 %402
%405 = OpDot %5 %403 %403
%406 = OpDot %5 %404 %404
%407 = OpExtInst %5 %78 FMax %405 %406
%408 = OpExtInst %5 %78 Log2 %407
%409 = OpFMul %5 %408 %132
%410 = OpConvertSToF %5 %398
%411 = OpExtInst %5 %78 NClamp %409 %137 %410
%412 = OpConvertFToS %80 %411
%413 = OpFAdd %5 %411 %97
%414 = OpConvertFToS %80 %413
%415 = OpExtInst %80 %78 SMin %414 %398
%416 = OpINotEqual %79 %412 %414
%417 = OpExtInst %40 %78 Fract %394
%419 = OpImageQuerySizeLod %82 %52 %412
%418 = OpConvertSToF %40 %419
%420 = OpSNegate %82 %396
%421 = OpExtInst %40 %78 Ldexp %418 %420
%422 = OpFMul %40 %417 %421
%423 = OpExtInst %40 %78 Ldexp %133 %420
%424 = OpFSub %40 %422 %423
%425 = OpExtInst %40 %78 FMax %424 %138
%426 = OpFAdd %40 %422 %423
%427 = OpConvertFToS %82 %425
%428 = OpConvertFToS %82 %426
%429 = OpINotEqual %81 %427 %428
%430 = OpCompositeExtract %79 %429 0
%431 = OpCompositeExtract %79 %429 1
%432 = OpLogicalAnd %79 %430 %431
%433 = OpSelect %80 %430 %147 %126
%434 = OpBitwiseOr %80 %90 %433
%435 = OpSelect %80 %431 %128 %126
%436 = OpBitwiseOr %80 %434 %435
%437 = OpSelect %80 %432 %152 %126
%438 = OpBitwiseOr %80 %436 %437
%439 = OpSConvert %18 %438
%440 = OpIMul %80 %412 %128
%441 = OpSConvert %18 %440
%442 = OpShiftLeftLogical %18 %439 %441
%443 = OpIsHelperInvocationEXT %79
%444 = OpLogicalNot %79 %443
%445 = OpFunctionCall %1 %166 %21 %427 %442 %444
%447 = OpImageQuerySizeLod %82 %52 %414
%446 = OpConvertSToF %40 %447
%448 = OpSNegate %82 %396
%449 = OpExtInst %40 %78 Ldexp %446 %448
%450 = OpFMul %40 %417 %449
%451 = OpExtInst %40 %78 Ldexp %133 %448
%452 = OpFSub %40 %450 %451
%453 = OpExtInst %40 %78 FMax %452 %138
%454 = OpFAdd %40 %450 %451
%455 = OpConvertFToS %82 %453
%456 = OpConvertFToS %82 %454
%457 = OpINotEqual %81 %455 %456
%458 = OpCompositeExtract %79 %457 0
%459 = OpCompositeExtract %79 %457 1
%460 = OpLogicalAnd %79 %458 %459
%461 = OpSelect %80 %458 %147 %126
%462 = OpBitwiseOr %80 %90 %461
%463 = OpSelect %80 %459 %128 %126
%464 = OpBitwiseOr %80 %462 %463
%465 = OpSelect %80 %460 %152 %126
%466 = OpBitwiseOr %80 %464 %465
%467 = OpSConvert %18 %466
%468 = OpIMul %80 %414 %128
%469 = OpSConvert %18 %468
%470 = OpShiftLeftLogical %18 %467 %469
%471 = OpIsHelperInvocationEXT %79
%472 = OpLogicalNot %79 %471
%473 = OpLogicalAnd %79 %472 %416
%474 = OpFunctionCall %1 %166 %21 %455 %470 %473
%475 = OpCompositeConstruct %40 %67 %69
%476 = OpImageQuerySize %82 %50
%477 = OpBitwiseAnd %82 %476 %87
%478 = OpImageQueryLevels %80 %52
%479 = OpISub %80 %478 %90
%481 = OpImageQuerySizeLod %82 %52 %126
%480 = OpConvertSToF %40 %481
%482 = OpCompositeConstruct %40 %63 %65
%483 = OpCompositeConstruct %40 %58 %61
%484 = OpFMul %40 %480 %482
%485 = OpFMul %40 %480 %483
%486 = OpDot %5 %484 %484
%487 = OpDot %5 %485 %485
%488 = OpExtInst %5 %78 FMax %486 %487
%489 = OpExtInst %5 %78 Log2 %488
%490 = OpFMul %5 %489 %132
%491 = OpConvertSToF %5 %479
%492 = OpExtInst %5 %78 NClamp %490 %137 %491
%493 = OpExtInst %5 %78 FMax %492 %55
%494 = OpExtInst %5 %78 FMin %493 %235
%495 = OpConvertFToS %80 %494
%496 = OpFAdd %5 %494 %97
%497 = OpConvertFToS %80 %496
%498 = OpExtInst %80 %78 SMin %497 %479
%499 = OpINotEqual %79 %495 %497
%500 = OpExtInst %40 %78 Fract %475
%502 = OpImageQuerySizeLod %82 %52 %495
%501 = OpConvertSToF %40 %502
%503 = OpSNegate %82 %477
%504 = OpExtInst %40 %78 Ldexp %501 %503
%505 = OpFMul %40 %500 %504
%506 = OpExtInst %40 %78 Ldexp %133 %503
%507 = OpFSub %40 %505 %506
%508 = OpExtInst %40 %78 FMax %507 %138
%509 = OpFAdd %40 %505 %506
%510 = OpConvertFToS %82 %508
%511 = OpConvertFToS %82 %509
%512 = OpINotEqual %81 %510 %511
%513 = OpCompositeExtract %79 %512 0
%514 = OpCompositeExtract %79 %512 1
%515 = OpLogicalAnd %79 %513 %514
%516 = OpSelect %80 %513 %147 %126
%517 = OpBitwiseOr %80 %90 %516
%518 = OpSelect %80 %514 %128 %126
%519 = OpBitwiseOr %80 %517 %518
%520 = OpSelect %80 %515 %152 %126
%521 = OpBitwiseOr %80 %519 %520
%522 = OpSConvert %18 %521
%523 = OpIMul %80 %495 %128
%524 = OpSConvert %18 %523
%525 = OpShiftLeftLogical %18 %522 %524
%526 = OpIsHelperInvocationEXT %79
%527 = OpLogicalNot %79 %526
%528 = OpFunctionCall %1 %166 %21 %510 %525 %527
%530 = OpImageQuerySizeLod %82 %52 %497
%529 = OpConvertSToF %40 %530
%531 = OpSNegate %82 %477
%532 = OpExtInst %40 %78 Ldexp %529 %531
%533 = OpFMul %40 %500 %532
%534 = OpExtInst %40 %78 Ldexp %133 %531
%535 = OpFSub %40 %533 %534
%536 = OpExtInst %40 %78 FMax %535 %138
%537 = OpFAdd %40 %533 %534
%538 = OpConvertFToS %82 %536
%539 = OpConvertFToS %82 %537
%540 = OpINotEqual %81 %538 %539
%541 = OpCompositeExtract %79 %540 0
%542 = OpCompositeExtract %79 %540 1
%543 = OpLogicalAnd %79 %541 %542
%544 = OpSelect %80 %541 %147 %126
%545 = OpBitwiseOr %80 %90 %544
%546 = OpSelect %80 %542 %128 %126
%547 = OpBitwiseOr %80 %545 %546
%548 = OpSelect %80 %543 %152 %126
%549 = OpBitwiseOr %80 %547 %548
%550 = OpSConvert %18 %549
%551 = OpIMul %80 %497 %128
%552 = OpSConvert %18 %551
%553 = OpShiftLeftLogical %18 %550 %552
%554 = OpIsHelperInvocationEXT %79
%555 = OpLogicalNot %79 %554
%556 = OpLogicalAnd %79 %555 %499
%557 = OpFunctionCall %1 %166 %21 %538 %553 %556
%558 = OpCompositeConstruct %40 %67 %69
%559 = OpImageQuerySize %82 %50
%560 = OpBitwiseAnd %82 %559 %87
%561 = OpImageQueryLevels %80 %52
%562 = OpISub %80 %561 %90
%563 = OpExtInst %5 %78 Exp2 %72
%564 = OpGroupNonUniformQuadBroadcast %5 %74 %563 %57
%565 = OpVectorTimesScalar %40 %558 %564
%566 = OpImageQueryLod %40 %92 %565
%567 = OpCompositeExtract %5 %566 0
%568 = OpConvertFToS %80 %567
%569 = OpFAdd %5 %567 %97
%570 = OpConvertFToS %80 %569
%571 = OpExtInst %80 %78 SMin %570 %562
%572 = OpINotEqual %79 %568 %570
%573 = OpDPdx %40 %558
%574 = OpDPdy %40 %558
%575 = OpExtInst %40 %78 FAbs %573
%576 = OpExtInst %40 %78 FAbs %574
%577 = OpCompositeExtract %5 %575 0
%578 = OpCompositeExtract %5 %576 0
%579 = OpCompositeExtract %5 %575 1
%580 = OpCompositeExtract %5 %576 1
%581 = OpExtInst %5 %78 FMax %577 %578
%582 = OpExtInst %5 %78 FMax %579 %580
%583 = OpCompositeConstruct %40 %581 %582
%584 = OpVectorTimesScalar %40 %583 %563
%585 = OpExtInst %40 %78 Fract %558
%587 = OpImageQuerySizeLod %82 %52 %568
%586 = OpConvertSToF %40 %587
%588 = OpSNegate %82 %560
%589 = OpExtInst %40 %78 Ldexp %586 %588
%590 = OpFMul %40 %585 %589
%591 = OpFMul %40 %584 %586
%592 = OpFSub %40 %591 %121
%593 = OpExtInst %122 %78 FrexpStruct %592
%594 = OpCompositeExtract %82 %593 1
%595 = OpExtInst %82 %78 SClamp %594 %127 %129
%596 = OpIAdd %82 %595 %588
%597 = OpExtInst %40 %78 Ldexp %133 %596
%598 = OpExtInst %40 %78 FMin %597 %133
%599 = OpFSub %40 %590 %598
%600 = OpExtInst %40 %78 FMax %599 %138
%601 = OpFAdd %40 %590 %598
%602 = OpConvertFToS %82 %600
%603 = OpConvertFToS %82 %601
%604 = OpINotEqual %81 %602 %603
%605 = OpCompositeExtract %79 %604 0
%606 = OpCompositeExtract %79 %604 1
%607 = OpLogicalAnd %79 %605 %606
%608 = OpSelect %80 %605 %147 %126
%609 = OpBitwiseOr %80 %90 %608
%610 = OpSelect %80 %606 %128 %126
%611 = OpBitwiseOr %80 %609 %610
%612 = OpSelect %80 %607 %152 %126
%613 = OpBitwiseOr %80 %611 %612
%614 = OpSConvert %18 %613
%615 = OpIMul %80 %568 %128
%616 = OpSConvert %18 %615
%617 = OpShiftLeftLogical %18 %614 %616
%618 = OpIsHelperInvocationEXT %79
%619 = OpLogicalNot %79 %618
%620 = OpFunctionCall %1 %166 %21 %602 %617 %619
%622 = OpImageQuerySizeLod %82 %52 %570
%621 = OpConvertSToF %40 %622
%623 = OpSNegate %82 %560
%624 = OpExtInst %40 %78 Ldexp %621 %623
%625 = OpFMul %40 %585 %624
%626 = OpFMul %40 %584 %621
%627 = OpFSub %40 %626 %121
%628 = OpExtInst %122 %78 FrexpStruct %627
%629 = OpCompositeExtract %82 %628 1
%630 = OpExtInst %82 %78 SClamp %629 %127 %129
%631 = OpIAdd %82 %630 %623
%632 = OpExtInst %40 %78 Ldexp %133 %631
%633 = OpExtInst %40 %78 FMin %632 %133
%634 = OpFSub %40 %625 %633
%635 = OpExtInst %40 %78 FMax %634 %138
%636 = OpFAdd %40 %625 %633
%637 = OpConvertFToS %82 %635
%638 = OpConvertFToS %82 %636
%639 = OpINotEqual %81 %637 %638
%640 = OpCompositeExtract %79 %639 0
%641 = OpCompositeExtract %79 %639 1
%642 = OpLogicalAnd %79 %640 %641
%643 = OpSelect %80 %640 %147 %126
%644 = OpBitwiseOr %80 %90 %643
%645 = OpSelect %80 %641 %128 %126
%646 = OpBitwiseOr %80 %644 %645
%647 = OpSelect %80 %642 %152 %126
%648 = OpBitwiseOr %80 %646 %647
%649 = OpSConvert %18 %648
%650 = OpIMul %80 %570 %128
%651 = OpSConvert %18 %650
%652 = OpShiftLeftLogical %18 %649 %651
%653 = OpIsHelperInvocationEXT %79
%654 = OpLogicalNot %79 %653
%655 = OpLogicalAnd %79 %654 %572
%656 = OpFunctionCall %1 %166 %21 %637 %652 %655
%657 = OpCompositeConstruct %40 %67 %69
%658 = OpImageQuerySize %82 %50
%659 = OpBitwiseAnd %82 %658 %87
%660 = OpImageQueryLevels %80 %52
%661 = OpISub %80 %660 %90
%662 = OpExtInst %5 %78 Exp2 %72
%663 = OpGroupNonUniformQuadBroadcast %5 %74 %662 %57
%664 = OpVectorTimesScalar %40 %657 %663
%665 = OpImageQueryLod %40 %92 %664
%666 = OpCompositeExtract %5 %665 0
%667 = OpExtInst %5 %78 FMax %666 %55
%668 = OpExtInst %5 %78 FMin %667 %235
%669 = OpConvertFToS %80 %668
%670 = OpFAdd %5 %668 %97
%671 = OpConvertFToS %80 %670
%672 = OpExtInst %80 %78 SMin %671 %661
%673 = OpINotEqual %79 %669 %671
%674 = OpDPdx %40 %657
%675 = OpDPdy %40 %657
%676 = OpExtInst %40 %78 FAbs %674
%677 = OpExtInst %40 %78 FAbs %675
%678 = OpCompositeExtract %5 %676 0
%679 = OpCompositeExtract %5 %677 0
%680 = OpCompositeExtract %5 %676 1
%681 = OpCompositeExtract %5 %677 1
%682 = OpExtInst %5 %78 FMax %678 %679
%683 = OpExtInst %5 %78 FMax %680 %681
%684 = OpCompositeConstruct %40 %682 %683
%685 = OpVectorTimesScalar %40 %684 %662
%686 = OpExtInst %40 %78 Fract %657
%688 = OpImageQuerySizeLod %82 %52 %669
%687 = OpConvertSToF %40 %688
%689 = OpSNegate %82 %659
%690 = OpExtInst %40 %78 Ldexp %687 %689
%691 = OpFMul %40 %686 %690
%692 = OpFMul %40 %685 %687
%693 = OpFSub %40 %692 %121
%694 = OpExtInst %122 %78 FrexpStruct %693
%695 = OpCompositeExtract %82 %694 1
%696 = OpExtInst %82 %78 SClamp %695 %127 %129
%697 = OpIAdd %82 %696 %689
%698 = OpExtInst %40 %78 Ldexp %133 %697
%699 = OpExtInst %40 %78 FMin %698 %133
%700 = OpFSub %40 %691 %699
%701 = OpExtInst %40 %78 FMax %700 %138
%702 = OpFAdd %40 %691 %699
%703 = OpConvertFToS %82 %701
%704 = OpConvertFToS %82 %702
%705 = OpINotEqual %81 %703 %704
%706 = OpCompositeExtract %79 %705 0
%707 = OpCompositeExtract %79 %705 1
%708 = OpLogicalAnd %79 %706 %707
%709 = OpSelect %80 %706 %147 %126
%710 = OpBitwiseOr %80 %90 %709
%711 = OpSelect %80 %707 %128 %126
%712 = OpBitwiseOr %80 %710 %711
%713 = OpSelect %80 %708 %152 %126
%714 = OpBitwiseOr %80 %712 %713
%715 = OpSConvert %18 %714
%716 = OpIMul %80 %669 %128
%717 = OpSConvert %18 %716
%718 = OpShiftLeftLogical %18 %715 %717
%719 = OpIsHelperInvocationEXT %79
%720 = OpLogicalNot %79 %719
%721 = OpFunctionCall %1 %166 %21 %703 %718 %720
%723 = OpImageQuerySizeLod %82 %52 %671
%722 = OpConvertSToF %40 %723
%724 = OpSNegate %82 %659
%725 = OpExtInst %40 %78 Ldexp %722 %724
%726 = OpFMul %40 %686 %725
%727 = OpFMul %40 %685 %722
%728 = OpFSub %40 %727 %121
%729 = OpExtInst %122 %78 FrexpStruct %728
%730 = OpCompositeExtract %82 %729 1
%731 = OpExtInst %82 %78 SClamp %730 %127 %129
%732 = OpIAdd %82 %731 %724
%733 = OpExtInst %40 %78 Ldexp %133 %732
%734 = OpExtInst %40 %78 FMin %733 %133
%735 = OpFSub %40 %726 %734
%736 = OpExtInst %40 %78 FMax %735 %138
%737 = OpFAdd %40 %726 %734
%738 = OpConvertFToS %82 %736
%739 = OpConvertFToS %82 %737
%740 = OpINotEqual %81 %738 %739
%741 = OpCompositeExtract %79 %740 0
%742 = OpCompositeExtract %79 %740 1
%743 = OpLogicalAnd %79 %741 %742
%744 = OpSelect %80 %741 %147 %126
%745 = OpBitwiseOr %80 %90 %744
%746 = OpSelect %80 %742 %128 %126
%747 = OpBitwiseOr %80 %745 %746
%748 = OpSelect %80 %743 %152 %126
%749 = OpBitwiseOr %80 %747 %748
%750 = OpSConvert %18 %749
%751 = OpIMul %80 %671 %128
%752 = OpSConvert %18 %751
%753 = OpShiftLeftLogical %18 %750 %752
%754 = OpIsHelperInvocationEXT %79
%755 = OpLogicalNot %79 %754
%756 = OpLogicalAnd %79 %755 %673
%757 = OpFunctionCall %1 %166 %21 %738 %753 %756
%758 = OpExtInst %5 %78 RoundEven %72
%759 = OpConvertFToS %80 %758
%760 = OpCompositeConstruct %40 %67 %69
%762 = OpImageQuerySize %761 %49
%763 = OpVectorShuffle %82 %762 %762 0 1
%764 = OpBitwiseAnd %82 %763 %87
%765 = OpImageQueryLevels %80 %51
%766 = OpISub %80 %765 %90
%768 = OpSampledImage %767 %51 %53
%769 = OpImageQueryLod %40 %768 %760
%770 = OpCompositeExtract %5 %769 0
%771 = OpConvertFToS %80 %770
%772 = OpFAdd %5 %770 %97
%773 = OpConvertFToS %80 %772
%774 = OpExtInst %80 %78 SMin %773 %766
%775 = OpINotEqual %79 %771 %773
%776 = OpDPdx %40 %760
%777 = OpDPdy %40 %760
%778 = OpExtInst %40 %78 FAbs %776
%779 = OpExtInst %40 %78 FAbs %777
%780 = OpCompositeExtract %5 %778 0
%781 = OpCompositeExtract %5 %779 0
%782 = OpCompositeExtract %5 %778 1
%783 = OpCompositeExtract %5 %779 1
%784 = OpExtInst %5 %78 FMax %780 %781
%785 = OpExtInst %5 %78 FMax %782 %783
%786 = OpCompositeConstruct %40 %784 %785
%787 = OpExtInst %40 %78 Fract %760
%789 = OpImageQuerySizeLod %761 %51 %771
%790 = OpVectorShuffle %82 %789 %789 0 1
%788 = OpConvertSToF %40 %790
%791 = OpSNegate %82 %764
%792 = OpExtInst %40 %78 Ldexp %788 %791
%793 = OpFMul %40 %787 %792
%794 = OpFMul %40 %786 %788
%795 = OpFSub %40 %794 %121
%796 = OpExtInst %122 %78 FrexpStruct %795
%797 = OpCompositeExtract %82 %796 1
%798 = OpExtInst %82 %78 SClamp %797 %127 %129
%799 = OpIAdd %82 %798 %791
%800 = OpExtInst %40 %78 Ldexp %133 %799
%801 = OpExtInst %40 %78 FMin %800 %133
%802 = OpFSub %40 %793 %801
%803 = OpExtInst %40 %78 FMax %802 %138
%804 = OpFAdd %40 %793 %801
%805 = OpConvertFToS %82 %803
%806 = OpConvertFToS %82 %804
%807 = OpINotEqual %81 %805 %806
%808 = OpCompositeExtract %79 %807 0
%809 = OpCompositeExtract %79 %807 1
%810 = OpLogicalAnd %79 %808 %809
%811 = OpSelect %80 %808 %147 %126
%812 = OpBitwiseOr %80 %90 %811
%813 = OpSelect %80 %809 %128 %126
%814 = OpBitwiseOr %80 %812 %813
%815 = OpSelect %80 %810 %152 %126
%816 = OpBitwiseOr %80 %814 %815
%817 = OpSConvert %18 %816
%818 = OpIMul %80 %771 %128
%819 = OpSConvert %18 %818
%820 = OpShiftLeftLogical %18 %817 %819
%821 = OpCompositeConstruct %761 %805 %759
%822 = OpIsHelperInvocationEXT %79
%823 = OpLogicalNot %79 %822
%851 = OpFunctionCall %1 %830 %24 %821 %820 %823
%853 = OpImageQuerySizeLod %761 %51 %773
%854 = OpVectorShuffle %82 %853 %853 0 1
%852 = OpConvertSToF %40 %854
%855 = OpSNegate %82 %764
%856 = OpExtInst %40 %78 Ldexp %852 %855
%857 = OpFMul %40 %787 %856
%858 = OpFMul %40 %786 %852
%859 = OpFSub %40 %858 %121
%860 = OpExtInst %122 %78 FrexpStruct %859
%861 = OpCompositeExtract %82 %860 1
%862 = OpExtInst %82 %78 SClamp %861 %127 %129
%863 = OpIAdd %82 %862 %855
%864 = OpExtInst %40 %78 Ldexp %133 %863
%865 = OpExtInst %40 %78 FMin %864 %133
%866 = OpFSub %40 %857 %865
%867 = OpExtInst %40 %78 FMax %866 %138
%868 = OpFAdd %40 %857 %865
%869 = OpConvertFToS %82 %867
%870 = OpConvertFToS %82 %868
%871 = OpINotEqual %81 %869 %870
%872 = OpCompositeExtract %79 %871 0
%873 = OpCompositeExtract %79 %871 1
%874 = OpLogicalAnd %79 %872 %873
%875 = OpSelect %80 %872 %147 %126
%876 = OpBitwiseOr %80 %90 %875
%877 = OpSelect %80 %873 %128 %126
%878 = OpBitwiseOr %80 %876 %877
%879 = OpSelect %80 %874 %152 %126
%880 = OpBitwiseOr %80 %878 %879
%881 = OpSConvert %18 %880
%882 = OpIMul %80 %773 %128
%883 = OpSConvert %18 %882
%884 = OpShiftLeftLogical %18 %881 %883
%885 = OpCompositeConstruct %761 %869 %759
%886 = OpIsHelperInvocationEXT %79
%887 = OpLogicalNot %79 %886
%888 = OpLogicalAnd %79 %887 %775
%889 = OpFunctionCall %1 %830 %24 %885 %884 %888
%890 = OpExtInst %5 %78 RoundEven %72
%891 = OpConvertFToS %80 %890
%892 = OpCompositeConstruct %40 %67 %69
%893 = OpImageQuerySize %761 %49
%894 = OpVectorShuffle %82 %893 %893 0 1
%895 = OpBitwiseAnd %82 %894 %87
%896 = OpImageQueryLevels %80 %51
%897 = OpISub %80 %896 %90
%898 = OpImageQueryLod %40 %768 %892
%899 = OpCompositeExtract %5 %898 0
%900 = OpExtInst %5 %78 FMax %899 %55
%901 = OpExtInst %5 %78 FMin %900 %235
%902 = OpConvertFToS %80 %901
%903 = OpFAdd %5 %901 %97
%904 = OpConvertFToS %80 %903
%905 = OpExtInst %80 %78 SMin %904 %897
%906 = OpINotEqual %79 %902 %904
%907 = OpDPdx %40 %892
%908 = OpDPdy %40 %892
%909 = OpExtInst %40 %78 FAbs %907
%910 = OpExtInst %40 %78 FAbs %908
%911 = OpCompositeExtract %5 %909 0
%912 = OpCompositeExtract %5 %910 0
%913 = OpCompositeExtract %5 %909 1
%914 = OpCompositeExtract %5 %910 1
%915 = OpExtInst %5 %78 FMax %911 %912
%916 = OpExtInst %5 %78 FMax %913 %914
%917 = OpCompositeConstruct %40 %915 %916
%918 = OpExtInst %40 %78 Fract %892
%920 = OpImageQuerySizeLod %761 %51 %902
%921 = OpVectorShuffle %82 %920 %920 0 1
%919 = OpConvertSToF %40 %921
%922 = OpSNegate %82 %895
%923 = OpExtInst %40 %78 Ldexp %919 %922
%924 = OpFMul %40 %918 %923
%925 = OpFMul %40 %917 %919
%926 = OpFSub %40 %925 %121
%927 = OpExtInst %122 %78 FrexpStruct %926
%928 = OpCompositeExtract %82 %927 1
%929 = OpExtInst %82 %78 SClamp %928 %127 %129
%930 = OpIAdd %82 %929 %922
%931 = OpExtInst %40 %78 Ldexp %133 %930
%932 = OpExtInst %40 %78 FMin %931 %133
%933 = OpFSub %40 %924 %932
%934 = OpExtInst %40 %78 FMax %933 %138
%935 = OpFAdd %40 %924 %932
%936 = OpConvertFToS %82 %934
%937 = OpConvertFToS %82 %935
%938 = OpINotEqual %81 %936 %937
%939 = OpCompositeExtract %79 %938 0
%940 = OpCompositeExtract %79 %938 1
%941 = OpLogicalAnd %79 %939 %940
%942 = OpSelect %80 %939 %147 %126
%943 = OpBitwiseOr %80 %90 %942
%944 = OpSelect %80 %940 %128 %126
%945 = OpBitwiseOr %80 %943 %944
%946 = OpSelect %80 %941 %152 %126
%947 = OpBitwiseOr %80 %945 %946
%948 = OpSConvert %18 %947
%949 = OpIMul %80 %902 %128
%950 = OpSConvert %18 %949
%951 = OpShiftLeftLogical %18 %948 %950
%952 = OpCompositeConstruct %761 %936 %891
%953 = OpIsHelperInvocationEXT %79
%954 = OpLogicalNot %79 %953
%955 = OpFunctionCall %1 %830 %24 %952 %951 %954
%957 = OpImageQuerySizeLod %761 %51 %904
%958 = OpVectorShuffle %82 %957 %957 0 1
%956 = OpConvertSToF %40 %958
%959 = OpSNegate %82 %895
%960 = OpExtInst %40 %78 Ldexp %956 %959
%961 = OpFMul %40 %918 %960
%962 = OpFMul %40 %917 %956
%963 = OpFSub %40 %962 %121
%964 = OpExtInst %122 %78 FrexpStruct %963
%965 = OpCompositeExtract %82 %964 1
%966 = OpExtInst %82 %78 SClamp %965 %127 %129
%967 = OpIAdd %82 %966 %959
%968 = OpExtInst %40 %78 Ldexp %133 %967
%969 = OpExtInst %40 %78 FMin %968 %133
%970 = OpFSub %40 %961 %969
%971 = OpExtInst %40 %78 FMax %970 %138
%972 = OpFAdd %40 %961 %969
%973 = OpConvertFToS %82 %971
%974 = OpConvertFToS %82 %972
%975 = OpINotEqual %81 %973 %974
%976 = OpCompositeExtract %79 %975 0
%977 = OpCompositeExtract %79 %975 1
%978 = OpLogicalAnd %79 %976 %977
%979 = OpSelect %80 %976 %147 %126
%980 = OpBitwiseOr %80 %90 %979
%981 = OpSelect %80 %977 %128 %126
%982 = OpBitwiseOr %80 %980 %981
%983 = OpSelect %80 %978 %152 %126
%984 = OpBitwiseOr %80 %982 %983
%985 = OpSConvert %18 %984
%986 = OpIMul %80 %904 %128
%987 = OpSConvert %18 %986
%988 = OpShiftLeftLogical %18 %985 %987
%989 = OpCompositeConstruct %761 %973 %891
%990 = OpIsHelperInvocationEXT %79
%991 = OpLogicalNot %79 %990
%992 = OpLogicalAnd %79 %991 %906
%993 = OpFunctionCall %1 %830 %24 %989 %988 %992
%994 = OpExtInst %5 %78 RoundEven %72
%995 = OpConvertFToS %80 %994
%996 = OpCompositeConstruct %40 %67 %69
%997 = OpImageQuerySize %761 %49
%998 = OpVectorShuffle %82 %997 %997 0 1
%999 = OpBitwiseAnd %82 %998 %87
%1000 = OpImageQueryLevels %80 %51
%1001 = OpISub %80 %1000 %90
%1002 = OpConvertSToF %5 %1001
%1003 = OpExtInst %5 %78 NClamp %76 %137 %1002
%1004 = OpConvertFToS %80 %1003
%1005 = OpFAdd %5 %1003 %97
%1006 = OpConvertFToS %80 %1005
%1007 = OpExtInst %80 %78 SMin %1006 %1001
%1008 = OpINotEqual %79 %1004 %1006
%1009 = OpExtInst %40 %78 Fract %996
%1011 = OpImageQuerySizeLod %761 %51 %1004
%1012 = OpVectorShuffle %82 %1011 %1011 0 1
%1010 = OpConvertSToF %40 %1012
%1013 = OpSNegate %82 %999
%1014 = OpExtInst %40 %78 Ldexp %1010 %1013
%1015 = OpFMul %40 %1009 %1014
%1016 = OpExtInst %40 %78 Ldexp %133 %1013
%1017 = OpFSub %40 %1015 %1016
%1018 = OpExtInst %40 %78 FMax %1017 %138
%1019 = OpFAdd %40 %1015 %1016
%1020 = OpConvertFToS %82 %1018
%1021 = OpConvertFToS %82 %1019
%1022 = OpINotEqual %81 %1020 %1021
%1023 = OpCompositeExtract %79 %1022 0
%1024 = OpCompositeExtract %79 %1022 1
%1025 = OpLogicalAnd %79 %1023 %1024
%1026 = OpSelect %80 %1023 %147 %126
%1027 = OpBitwiseOr %80 %90 %1026
%1028 = OpSelect %80 %1024 %128 %126
%1029 = OpBitwiseOr %80 %1027 %1028
%1030 = OpSelect %80 %1025 %152 %126
%1031 = OpBitwiseOr %80 %1029 %1030
%1032 = OpSConvert %18 %1031
%1033 = OpIMul %80 %1004 %128
%1034 = OpSConvert %18 %1033
%1035 = OpShiftLeftLogical %18 %1032 %1034
%1036 = OpCompositeConstruct %761 %1020 %995
%1037 = OpIsHelperInvocationEXT %79
%1038 = OpLogicalNot %79 %1037
%1039 = OpFunctionCall %1 %830 %24 %1036 %1035 %1038
%1041 = OpImageQuerySizeLod %761 %51 %1006
%1042 = OpVectorShuffle %82 %1041 %1041 0 1
%1040 = OpConvertSToF %40 %1042
%1043 = OpSNegate %82 %999
%1044 = OpExtInst %40 %78 Ldexp %1040 %1043
%1045 = OpFMul %40 %1009 %1044
%1046 = OpExtInst %40 %78 Ldexp %133 %1043
%1047 = OpFSub %40 %1045 %1046
%1048 = OpExtInst %40 %78 FMax %1047 %138
%1049 = OpFAdd %40 %1045 %1046
%1050 = OpConvertFToS %82 %1048
%1051 = OpConvertFToS %82 %1049
%1052 = OpINotEqual %81 %1050 %1051
%1053 = OpCompositeExtract %79 %1052 0
%1054 = OpCompositeExtract %79 %1052 1
%1055 = OpLogicalAnd %79 %1053 %1054
%1056 = OpSelect %80 %1053 %147 %126
%1057 = OpBitwiseOr %80 %90 %1056
%1058 = OpSelect %80 %1054 %128 %126
%1059 = OpBitwiseOr %80 %1057 %1058
%1060 = OpSelect %80 %1055 %152 %126
%1061 = OpBitwiseOr %80 %1059 %1060
%1062 = OpSConvert %18 %1061
%1063 = OpIMul %80 %1006 %128
%1064 = OpSConvert %18 %1063
%1065 = OpShiftLeftLogical %18 %1062 %1064
%1066 = OpCompositeConstruct %761 %1050 %995
%1067 = OpIsHelperInvocationEXT %79
%1068 = OpLogicalNot %79 %1067
%1069 = OpLogicalAnd %79 %1068 %1008
%1070 = OpFunctionCall %1 %830 %24 %1066 %1065 %1069
%1071 = OpExtInst %5 %78 RoundEven %72
%1072 = OpConvertFToS %80 %1071
%1073 = OpCompositeConstruct %40 %67 %69
%1074 = OpImageQuerySize %761 %49
%1075 = OpVectorShuffle %82 %1074 %1074 0 1
%1076 = OpBitwiseAnd %82 %1075 %87
%1077 = OpImageQueryLevels %80 %51
%1078 = OpISub %80 %1077 %90
%1080 = OpImageQuerySizeLod %761 %51 %126
%1081 = OpVectorShuffle %82 %1080 %1080 0 1
%1079 = OpConvertSToF %40 %1081
%1082 = OpCompositeConstruct %40 %63 %65
%1083 = OpCompositeConstruct %40 %58 %61
%1084 = OpFMul %40 %1079 %1082
%1085 = OpFMul %40 %1079 %1083
%1086 = OpDot %5 %1084 %1084
%1087 = OpDot %5 %1085 %1085
%1088 = OpExtInst %5 %78 FMax %1086 %1087
%1089 = OpExtInst %5 %78 Log2 %1088
%1090 = OpFMul %5 %1089 %132
%1091 = OpConvertSToF %5 %1078
%1092 = OpExtInst %5 %78 NClamp %1090 %137 %1091
%1093 = OpConvertFToS %80 %1092
%1094 = OpFAdd %5 %1092 %97
%1095 = OpConvertFToS %80 %1094
%1096 = OpExtInst %80 %78 SMin %1095 %1078
%1097 = OpINotEqual %79 %1093 %1095
%1098 = OpExtInst %40 %78 Fract %1073
%1100 = OpImageQuerySizeLod %761 %51 %1093
%1101 = OpVectorShuffle %82 %1100 %1100 0 1
%1099 = OpConvertSToF %40 %1101
%1102 = OpSNegate %82 %1076
%1103 = OpExtInst %40 %78 Ldexp %1099 %1102
%1104 = OpFMul %40 %1098 %1103
%1105 = OpExtInst %40 %78 Ldexp %133 %1102
%1106 = OpFSub %40 %1104 %1105
%1107 = OpExtInst %40 %78 FMax %1106 %138
%1108 = OpFAdd %40 %1104 %1105
%1109 = OpConvertFToS %82 %1107
%1110 = OpConvertFToS %82 %1108
%1111 = OpINotEqual %81 %1109 %1110
%1112 = OpCompositeExtract %79 %1111 0
%1113 = OpCompositeExtract %79 %1111 1
%1114 = OpLogicalAnd %79 %1112 %1113
%1115 = OpSelect %80 %1112 %147 %126
%1116 = OpBitwiseOr %80 %90 %1115
%1117 = OpSelect %80 %1113 %128 %126
%1118 = OpBitwiseOr %80 %1116 %1117
%1119 = OpSelect %80 %1114 %152 %126
%1120 = OpBitwiseOr %80 %1118 %1119
%1121 = OpSConvert %18 %1120
%1122 = OpIMul %80 %1093 %128
%1123 = OpSConvert %18 %1122
%1124 = OpShiftLeftLogical %18 %1121 %1123
%1125 = OpCompositeConstruct %761 %1109 %1072
%1126 = OpIsHelperInvocationEXT %79
%1127 = OpLogicalNot %79 %1126
%1128 = OpFunctionCall %1 %830 %24 %1125 %1124 %1127
%1130 = OpImageQuerySizeLod %761 %51 %1095
%1131 = OpVectorShuffle %82 %1130 %1130 0 1
%1129 = OpConvertSToF %40 %1131
%1132 = OpSNegate %82 %1076
%1133 = OpExtInst %40 %78 Ldexp %1129 %1132
%1134 = OpFMul %40 %1098 %1133
%1135 = OpExtInst %40 %78 Ldexp %133 %1132
%1136 = OpFSub %40 %1134 %1135
%1137 = OpExtInst %40 %78 FMax %1136 %138
%1138 = OpFAdd %40 %1134 %1135
%1139 = OpConvertFToS %82 %1137
%1140 = OpConvertFToS %82 %1138
%1141 = OpINotEqual %81 %1139 %1140
%1142 = OpCompositeExtract %79 %1141 0
%1143 = OpCompositeExtract %79 %1141 1
%1144 = OpLogicalAnd %79 %1142 %1143
%1145 = OpSelect %80 %1142 %147 %126
%1146 = OpBitwiseOr %80 %90 %1145
%1147 = OpSelect %80 %1143 %128 %126
%1148 = OpBitwiseOr %80 %1146 %1147
%1149 = OpSelect %80 %1144 %152 %126
%1150 = OpBitwiseOr %80 %1148 %1149
%1151 = OpSConvert %18 %1150
%1152 = OpIMul %80 %1095 %128
%1153 = OpSConvert %18 %1152
%1154 = OpShiftLeftLogical %18 %1151 %1153
%1155 = OpCompositeConstruct %761 %1139 %1072
%1156 = OpIsHelperInvocationEXT %79
%1157 = OpLogicalNot %79 %1156
%1158 = OpLogicalAnd %79 %1157 %1097
%1159 = OpFunctionCall %1 %830 %24 %1155 %1154 %1158
%1160 = OpExtInst %5 %78 RoundEven %72
%1161 = OpConvertFToS %80 %1160
%1162 = OpCompositeConstruct %40 %67 %69
%1163 = OpImageQuerySize %761 %49
%1164 = OpVectorShuffle %82 %1163 %1163 0 1
%1165 = OpBitwiseAnd %82 %1164 %87
%1166 = OpImageQueryLevels %80 %51
%1167 = OpISub %80 %1166 %90
%1169 = OpImageQuerySizeLod %761 %51 %126
%1170 = OpVectorShuffle %82 %1169 %1169 0 1
%1168 = OpConvertSToF %40 %1170
%1171 = OpCompositeConstruct %40 %63 %65
%1172 = OpCompositeConstruct %40 %58 %61
%1173 = OpFMul %40 %1168 %1171
%1174 = OpFMul %40 %1168 %1172
%1175 = OpDot %5 %1173 %1173
%1176 = OpDot %5 %1174 %1174
%1177 = OpExtInst %5 %78 FMax %1175 %1176
%1178 = OpExtInst %5 %78 Log2 %1177
%1179 = OpFMul %5 %1178 %132
%1180 = OpConvertSToF %5 %1167
%1181 = OpExtInst %5 %78 NClamp %1179 %137 %1180
%1182 = OpExtInst %5 %78 FMax %1181 %55
%1183 = OpExtInst %5 %78 FMin %1182 %235
%1184 = OpConvertFToS %80 %1183
%1185 = OpFAdd %5 %1183 %97
%1186 = OpConvertFToS %80 %1185
%1187 = OpExtInst %80 %78 SMin %1186 %1167
%1188 = OpINotEqual %79 %1184 %1186
%1189 = OpExtInst %40 %78 Fract %1162
%1191 = OpImageQuerySizeLod %761 %51 %1184
%1192 = OpVectorShuffle %82 %1191 %1191 0 1
%1190 = OpConvertSToF %40 %1192
%1193 = OpSNegate %82 %1165
%1194 = OpExtInst %40 %78 Ldexp %1190 %1193
%1195 = OpFMul %40 %1189 %1194
%1196 = OpExtInst %40 %78 Ldexp %133 %1193
%1197 = OpFSub %40 %1195 %1196
%1198 = OpExtInst %40 %78 FMax %1197 %138
%1199 = OpFAdd %40 %1195 %1196
%1200 = OpConvertFToS %82 %1198
%1201 = OpConvertFToS %82 %1199
%1202 = OpINotEqual %81 %1200 %1201
%1203 = OpCompositeExtract %79 %1202 0
%1204 = OpCompositeExtract %79 %1202 1
%1205 = OpLogicalAnd %79 %1203 %1204
%1206 = OpSelect %80 %1203 %147 %126
%1207 = OpBitwiseOr %80 %90 %1206
%1208 = OpSelect %80 %1204 %128 %126
%1209 = OpBitwiseOr %80 %1207 %1208
%1210 = OpSelect %80 %1205 %152 %126
%1211 = OpBitwiseOr %80 %1209 %1210
%1212 = OpSConvert %18 %1211
%1213 = OpIMul %80 %1184 %128
%1214 = OpSConvert %18 %1213
%1215 = OpShiftLeftLogical %18 %1212 %1214
%1216 = OpCompositeConstruct %761 %1200 %1161
%1217 = OpIsHelperInvocationEXT %79
%1218 = OpLogicalNot %79 %1217
%1219 = OpFunctionCall %1 %830 %24 %1216 %1215 %1218
%1221 = OpImageQuerySizeLod %761 %51 %1186
%1222 = OpVectorShuffle %82 %1221 %1221 0 1
%1220 = OpConvertSToF %40 %1222
%1223 = OpSNegate %82 %1165
%1224 = OpExtInst %40 %78 Ldexp %1220 %1223
%1225 = OpFMul %40 %1189 %1224
%1226 = OpExtInst %40 %78 Ldexp %133 %1223
%1227 = OpFSub %40 %1225 %1226
%1228 = OpExtInst %40 %78 FMax %1227 %138
%1229 = OpFAdd %40 %1225 %1226
%1230 = OpConvertFToS %82 %1228
%1231 = OpConvertFToS %82 %1229
%1232 = OpINotEqual %81 %1230 %1231
%1233 = OpCompositeExtract %79 %1232 0
%1234 = OpCompositeExtract %79 %1232 1
%1235 = OpLogicalAnd %79 %1233 %1234
%1236 = OpSelect %80 %1233 %147 %126
%1237 = OpBitwiseOr %80 %90 %1236
%1238 = OpSelect %80 %1234 %128 %126
%1239 = OpBitwiseOr %80 %1237 %1238
%1240 = OpSelect %80 %1235 %152 %126
%1241 = OpBitwiseOr %80 %1239 %1240
%1242 = OpSConvert %18 %1241
%1243 = OpIMul %80 %1186 %128
%1244 = OpSConvert %18 %1243
%1245 = OpShiftLeftLogical %18 %1242 %1244
%1246 = OpCompositeConstruct %761 %1230 %1161
%1247 = OpIsHelperInvocationEXT %79
%1248 = OpLogicalNot %79 %1247
%1249 = OpLogicalAnd %79 %1248 %1188
%1250 = OpFunctionCall %1 %830 %24 %1246 %1245 %1249
%1251 = OpExtInst %5 %78 RoundEven %72
%1252 = OpConvertFToS %80 %1251
%1253 = OpCompositeConstruct %40 %67 %69
%1254 = OpImageQuerySize %761 %49
%1255 = OpVectorShuffle %82 %1254 %1254 0 1
%1256 = OpBitwiseAnd %82 %1255 %87
%1257 = OpImageQueryLevels %80 %51
%1258 = OpISub %80 %1257 %90
%1259 = OpExtInst %5 %78 Exp2 %72
%1260 = OpGroupNonUniformQuadBroadcast %5 %74 %1259 %57
%1261 = OpVectorTimesScalar %40 %1253 %1260
%1262 = OpImageQueryLod %40 %768 %1261
%1263 = OpCompositeExtract %5 %1262 0
%1264 = OpConvertFToS %80 %1263
%1265 = OpFAdd %5 %1263 %97
%1266 = OpConvertFToS %80 %1265
%1267 = OpExtInst %80 %78 SMin %1266 %1258
%1268 = OpINotEqual %79 %1264 %1266
%1269 = OpDPdx %40 %1253
%1270 = OpDPdy %40 %1253
%1271 = OpExtInst %40 %78 FAbs %1269
%1272 = OpExtInst %40 %78 FAbs %1270
%1273 = OpCompositeExtract %5 %1271 0
%1274 = OpCompositeExtract %5 %1272 0
%1275 = OpCompositeExtract %5 %1271 1
%1276 = OpCompositeExtract %5 %1272 1
%1277 = OpExtInst %5 %78 FMax %1273 %1274
%1278 = OpExtInst %5 %78 FMax %1275 %1276
%1279 = OpCompositeConstruct %40 %1277 %1278
%1280 = OpVectorTimesScalar %40 %1279 %1259
%1281 = OpExtInst %40 %78 Fract %1253
%1283 = OpImageQuerySizeLod %761 %51 %1264
%1284 = OpVectorShuffle %82 %1283 %1283 0 1
%1282 = OpConvertSToF %40 %1284
%1285 = OpSNegate %82 %1256
%1286 = OpExtInst %40 %78 Ldexp %1282 %1285
%1287 = OpFMul %40 %1281 %1286
%1288 = OpFMul %40 %1280 %1282
%1289 = OpFSub %40 %1288 %121
%1290 = OpExtInst %122 %78 FrexpStruct %1289
%1291 = OpCompositeExtract %82 %1290 1
%1292 = OpExtInst %82 %78 SClamp %1291 %127 %129
%1293 = OpIAdd %82 %1292 %1285
%1294 = OpExtInst %40 %78 Ldexp %133 %1293
%1295 = OpExtInst %40 %78 FMin %1294 %133
%1296 = OpFSub %40 %1287 %1295
%1297 = OpExtInst %40 %78 FMax %1296 %138
%1298 = OpFAdd %40 %1287 %1295
%1299 = OpConvertFToS %82 %1297
%1300 = OpConvertFToS %82 %1298
%1301 = OpINotEqual %81 %1299 %1300
%1302 = OpCompositeExtract %79 %1301 0
%1303 = OpCompositeExtract %79 %1301 1
%1304 = OpLogicalAnd %79 %1302 %1303
%1305 = OpSelect %80 %1302 %147 %126
%1306 = OpBitwiseOr %80 %90 %1305
%1307 = OpSelect %80 %1303 %128 %126
%1308 = OpBitwiseOr %80 %1306 %1307
%1309 = OpSelect %80 %1304 %152 %126
%1310 = OpBitwiseOr %80 %1308 %1309
%1311 = OpSConvert %18 %1310
%1312 = OpIMul %80 %1264 %128
%1313 = OpSConvert %18 %1312
%1314 = OpShiftLeftLogical %18 %1311 %1313
%1315 = OpCompositeConstruct %761 %1299 %1252
%1316 = OpIsHelperInvocationEXT %79
%1317 = OpLogicalNot %79 %1316
%1318 = OpFunctionCall %1 %830 %24 %1315 %1314 %1317
%1320 = OpImageQuerySizeLod %761 %51 %1266
%1321 = OpVectorShuffle %82 %1320 %1320 0 1
%1319 = OpConvertSToF %40 %1321
%1322 = OpSNegate %82 %1256
%1323 = OpExtInst %40 %78 Ldexp %1319 %1322
%1324 = OpFMul %40 %1281 %1323
%1325 = OpFMul %40 %1280 %1319
%1326 = OpFSub %40 %1325 %121
%1327 = OpExtInst %122 %78 FrexpStruct %1326
%1328 = OpCompositeExtract %82 %1327 1
%1329 = OpExtInst %82 %78 SClamp %1328 %127 %129
%1330 = OpIAdd %82 %1329 %1322
%1331 = OpExtInst %40 %78 Ldexp %133 %1330
%1332 = OpExtInst %40 %78 FMin %1331 %133
%1333 = OpFSub %40 %1324 %1332
%1334 = OpExtInst %40 %78 FMax %1333 %138
%1335 = OpFAdd %40 %1324 %1332
%1336 = OpConvertFToS %82 %1334
%1337 = OpConvertFToS %82 %1335
%1338 = OpINotEqual %81 %1336 %1337
%1339 = OpCompositeExtract %79 %1338 0
%1340 = OpCompositeExtract %79 %1338 1
%1341 = OpLogicalAnd %79 %1339 %1340
%1342 = OpSelect %80 %1339 %147 %126
%1343 = OpBitwiseOr %80 %90 %1342
%1344 = OpSelect %80 %1340 %128 %126
%1345 = OpBitwiseOr %80 %1343 %1344
%1346 = OpSelect %80 %1341 %152 %126
%1347 = OpBitwiseOr %80 %1345 %1346
%1348 = OpSConvert %18 %1347
%1349 = OpIMul %80 %1266 %128
%1350 = OpSConvert %18 %1349
%1351 = OpShiftLeftLogical %18 %1348 %1350
%1352 = OpCompositeConstruct %761 %1336 %1252
%1353 = OpIsHelperInvocationEXT %79
%1354 = OpLogicalNot %79 %1353
%1355 = OpLogicalAnd %79 %1354 %1268
%1356 = OpFunctionCall %1 %830 %24 %1352 %1351 %1355
%1357 = OpExtInst %5 %78 RoundEven %72
%1358 = OpConvertFToS %80 %1357
%1359 = OpCompositeConstruct %40 %67 %69
%1360 = OpImageQuerySize %761 %49
%1361 = OpVectorShuffle %82 %1360 %1360 0 1
%1362 = OpBitwiseAnd %82 %1361 %87
%1363 = OpImageQueryLevels %80 %51
%1364 = OpISub %80 %1363 %90
%1365 = OpExtInst %5 %78 Exp2 %76
%1366 = OpGroupNonUniformQuadBroadcast %5 %74 %1365 %57
%1367 = OpVectorTimesScalar %40 %1359 %1366
%1368 = OpImageQueryLod %40 %768 %1367
%1369 = OpCompositeExtract %5 %1368 0
%1370 = OpExtInst %5 %78 FMax %1369 %55
%1371 = OpExtInst %5 %78 FMin %1370 %235
%1372 = OpConvertFToS %80 %1371
%1373 = OpFAdd %5 %1371 %97
%1374 = OpConvertFToS %80 %1373
%1375 = OpExtInst %80 %78 SMin %1374 %1364
%1376 = OpINotEqual %79 %1372 %1374
%1377 = OpDPdx %40 %1359
%1378 = OpDPdy %40 %1359
%1379 = OpExtInst %40 %78 FAbs %1377
%1380 = OpExtInst %40 %78 FAbs %1378
%1381 = OpCompositeExtract %5 %1379 0
%1382 = OpCompositeExtract %5 %1380 0
%1383 = OpCompositeExtract %5 %1379 1
%1384 = OpCompositeExtract %5 %1380 1
%1385 = OpExtInst %5 %78 FMax %1381 %1382
%1386 = OpExtInst %5 %78 FMax %1383 %1384
%1387 = OpCompositeConstruct %40 %1385 %1386
%1388 = OpVectorTimesScalar %40 %1387 %1365
%1389 = OpExtInst %40 %78 Fract %1359
%1391 = OpImageQuerySizeLod %761 %51 %1372
%1392 = OpVectorShuffle %82 %1391 %1391 0 1
%1390 = OpConvertSToF %40 %1392
%1393 = OpSNegate %82 %1362
%1394 = OpExtInst %40 %78 Ldexp %1390 %1393
%1395 = OpFMul %40 %1389 %1394
%1396 = OpFMul %40 %1388 %1390
%1397 = OpFSub %40 %1396 %121
%1398 = OpExtInst %122 %78 FrexpStruct %1397
%1399 = OpCompositeExtract %82 %1398 1
%1400 = OpExtInst %82 %78 SClamp %1399 %127 %129
%1401 = OpIAdd %82 %1400 %1393
%1402 = OpExtInst %40 %78 Ldexp %133 %1401
%1403 = OpExtInst %40 %78 FMin %1402 %133
%1404 = OpFSub %40 %1395 %1403
%1405 = OpExtInst %40 %78 FMax %1404 %138
%1406 = OpFAdd %40 %1395 %1403
%1407 = OpConvertFToS %82 %1405
%1408 = OpConvertFToS %82 %1406
%1409 = OpINotEqual %81 %1407 %1408
%1410 = OpCompositeExtract %79 %1409 0
%1411 = OpCompositeExtract %79 %1409 1
%1412 = OpLogicalAnd %79 %1410 %1411
%1413 = OpSelect %80 %1410 %147 %126
%1414 = OpBitwiseOr %80 %90 %1413
%1415 = OpSelect %80 %1411 %128 %126
%1416 = OpBitwiseOr %80 %1414 %1415
%1417 = OpSelect %80 %1412 %152 %126
%1418 = OpBitwiseOr %80 %1416 %1417
%1419 = OpSConvert %18 %1418
%1420 = OpIMul %80 %1372 %128
%1421 = OpSConvert %18 %1420
%1422 = OpShiftLeftLogical %18 %1419 %1421
%1423 = OpCompositeConstruct %761 %1407 %1358
%1424 = OpIsHelperInvocationEXT %79
%1425 = OpLogicalNot %79 %1424
%1426 = OpFunctionCall %1 %830 %24 %1423 %1422 %1425
%1428 = OpImageQuerySizeLod %761 %51 %1374
%1429 = OpVectorShuffle %82 %1428 %1428 0 1
%1427 = OpConvertSToF %40 %1429
%1430 = OpSNegate %82 %1362
%1431 = OpExtInst %40 %78 Ldexp %1427 %1430
%1432 = OpFMul %40 %1389 %1431
%1433 = OpFMul %40 %1388 %1427
%1434 = OpFSub %40 %1433 %121
%1435 = OpExtInst %122 %78 FrexpStruct %1434
%1436 = OpCompositeExtract %82 %1435 1
%1437 = OpExtInst %82 %78 SClamp %1436 %127 %129
%1438 = OpIAdd %82 %1437 %1430
%1439 = OpExtInst %40 %78 Ldexp %133 %1438
%1440 = OpExtInst %40 %78 FMin %1439 %133
%1441 = OpFSub %40 %1432 %1440
%1442 = OpExtInst %40 %78 FMax %1441 %138
%1443 = OpFAdd %40 %1432 %1440
%1444 = OpConvertFToS %82 %1442
%1445 = OpConvertFToS %82 %1443
%1446 = OpINotEqual %81 %1444 %1445
%1447 = OpCompositeExtract %79 %1446 0
%1448 = OpCompositeExtract %79 %1446 1
%1449 = OpLogicalAnd %79 %1447 %1448
%1450 = OpSelect %80 %1447 %147 %126
%1451 = OpBitwiseOr %80 %90 %1450
%1452 = OpSelect %80 %1448 %128 %126
%1453 = OpBitwiseOr %80 %1451 %1452
%1454 = OpSelect %80 %1449 %152 %126
%1455 = OpBitwiseOr %80 %1453 %1454
%1456 = OpSConvert %18 %1455
%1457 = OpIMul %80 %1374 %128
%1458 = OpSConvert %18 %1457
%1459 = OpShiftLeftLogical %18 %1456 %1458
%1460 = OpCompositeConstruct %761 %1444 %1358
%1461 = OpIsHelperInvocationEXT %79
%1462 = OpLogicalNot %79 %1461
%1463 = OpLogicalAnd %79 %1462 %1376
%1464 = OpFunctionCall %1 %830 %24 %1460 %1459 %1463
%1465 = OpIAdd %46 %54 %57
%1466 = OpAccessChain %20 %27 %1465
%1467 = OpLoad %19 %1466
%1468 = OpIAdd %46 %54 %57
%1469 = OpAccessChain %7 %14 %1468
%1470 = OpLoad %6 %1469
%1471 = OpIAdd %46 %54 %57
%1472 = OpAccessChain %32 %36 %1471
%1473 = OpLoad %31 %1472
%1474 = OpCompositeConstruct %40 %67 %69
%1475 = OpImageQuerySize %82 %1467
%1476 = OpBitwiseAnd %82 %1475 %87
%1477 = OpImageQueryLevels %80 %1470
%1478 = OpISub %80 %1477 %90
%1479 = OpSampledImage %91 %1470 %1473
%1480 = OpImageQueryLod %40 %1479 %1474
%1481 = OpCompositeExtract %5 %1480 0
%1482 = OpConvertFToS %80 %1481
%1483 = OpFAdd %5 %1481 %97
%1484 = OpConvertFToS %80 %1483
%1485 = OpExtInst %80 %78 SMin %1484 %1478
%1486 = OpINotEqual %79 %1482 %1484
%1487 = OpDPdx %40 %1474
%1488 = OpDPdy %40 %1474
%1489 = OpExtInst %40 %78 FAbs %1487
%1490 = OpExtInst %40 %78 FAbs %1488
%1491 = OpCompositeExtract %5 %1489 0
%1492 = OpCompositeExtract %5 %1490 0
%1493 = OpCompositeExtract %5 %1489 1
%1494 = OpCompositeExtract %5 %1490 1
%1495 = OpExtInst %5 %78 FMax %1491 %1492
%1496 = OpExtInst %5 %78 FMax %1493 %1494
%1497 = OpCompositeConstruct %40 %1495 %1496
%1498 = OpExtInst %40 %78 Fract %1474
%1500 = OpImageQuerySizeLod %82 %1470 %1482
%1499 = OpConvertSToF %40 %1500
%1501 = OpSNegate %82 %1476
%1502 = OpExtInst %40 %78 Ldexp %1499 %1501
%1503 = OpFMul %40 %1498 %1502
%1504 = OpFMul %40 %1497 %1499
%1505 = OpFSub %40 %1504 %121
%1506 = OpExtInst %122 %78 FrexpStruct %1505
%1507 = OpCompositeExtract %82 %1506 1
%1508 = OpExtInst %82 %78 SClamp %1507 %127 %129
%1509 = OpIAdd %82 %1508 %1501
%1510 = OpExtInst %40 %78 Ldexp %133 %1509
%1511 = OpExtInst %40 %78 FMin %1510 %133
%1512 = OpFSub %40 %1503 %1511
%1513 = OpExtInst %40 %78 FMax %1512 %138
%1514 = OpFAdd %40 %1503 %1511
%1515 = OpConvertFToS %82 %1513
%1516 = OpConvertFToS %82 %1514
%1517 = OpINotEqual %81 %1515 %1516
%1518 = OpCompositeExtract %79 %1517 0
%1519 = OpCompositeExtract %79 %1517 1
%1520 = OpLogicalAnd %79 %1518 %1519
%1521 = OpSelect %80 %1518 %147 %126
%1522 = OpBitwiseOr %80 %90 %1521
%1523 = OpSelect %80 %1519 %128 %126
%1524 = OpBitwiseOr %80 %1522 %1523
%1525 = OpSelect %80 %1520 %152 %126
%1526 = OpBitwiseOr %80 %1524 %1525
%1527 = OpSConvert %18 %1526
%1528 = OpIMul %80 %1482 %128
%1529 = OpSConvert %18 %1528
%1530 = OpShiftLeftLogical %18 %1527 %1529
%1531 = OpIsHelperInvocationEXT %79
%1532 = OpLogicalNot %79 %1531
%1558 = OpFunctionCall %1 %1537 %1466 %1515 %1530 %1532
%1560 = OpImageQuerySizeLod %82 %1470 %1484
%1559 = OpConvertSToF %40 %1560
%1561 = OpSNegate %82 %1476
%1562 = OpExtInst %40 %78 Ldexp %1559 %1561
%1563 = OpFMul %40 %1498 %1562
%1564 = OpFMul %40 %1497 %1559
%1565 = OpFSub %40 %1564 %121
%1566 = OpExtInst %122 %78 FrexpStruct %1565
%1567 = OpCompositeExtract %82 %1566 1
%1568 = OpExtInst %82 %78 SClamp %1567 %127 %129
%1569 = OpIAdd %82 %1568 %1561
%1570 = OpExtInst %40 %78 Ldexp %133 %1569
%1571 = OpExtInst %40 %78 FMin %1570 %133
%1572 = OpFSub %40 %1563 %1571
%1573 = OpExtInst %40 %78 FMax %1572 %138
%1574 = OpFAdd %40 %1563 %1571
%1575 = OpConvertFToS %82 %1573
%1576 = OpConvertFToS %82 %1574
%1577 = OpINotEqual %81 %1575 %1576
%1578 = OpCompositeExtract %79 %1577 0
%1579 = OpCompositeExtract %79 %1577 1
%1580 = OpLogicalAnd %79 %1578 %1579
%1581 = OpSelect %80 %1578 %147 %126
%1582 = OpBitwiseOr %80 %90 %1581
%1583 = OpSelect %80 %1579 %128 %126
%1584 = OpBitwiseOr %80 %1582 %1583
%1585 = OpSelect %80 %1580 %152 %126
%1586 = OpBitwiseOr %80 %1584 %1585
%1587 = OpSConvert %18 %1586
%1588 = OpIMul %80 %1484 %128
%1589 = OpSConvert %18 %1588
%1590 = OpShiftLeftLogical %18 %1587 %1589
%1591 = OpIsHelperInvocationEXT %79
%1592 = OpLogicalNot %79 %1591
%1593 = OpLogicalAnd %79 %1592 %1486
%1594 = OpFunctionCall %1 %1537 %1466 %1575 %1590 %1593
%1595 = OpIAdd %46 %54 %57
%1596 = OpAccessChain %23 %30 %1595
%1597 = OpLoad %22 %1596
%1598 = OpIAdd %46 %54 %57
%1599 = OpAccessChain %10 %17 %1598
%1600 = OpLoad %9 %1599
%1601 = OpExtInst %5 %78 RoundEven %72
%1602 = OpConvertFToS %80 %1601
%1603 = OpCompositeConstruct %40 %67 %69
%1604 = OpImageQuerySize %761 %1597
%1605 = OpVectorShuffle %82 %1604 %1604 0 1
%1606 = OpBitwiseAnd %82 %1605 %87
%1607 = OpImageQueryLevels %80 %1600
%1608 = OpISub %80 %1607 %90
%1609 = OpSampledImage %767 %1600 %1473
%1610 = OpImageQueryLod %40 %1609 %1603
%1611 = OpCompositeExtract %5 %1610 0
%1612 = OpConvertFToS %80 %1611
%1613 = OpFAdd %5 %1611 %97
%1614 = OpConvertFToS %80 %1613
%1615 = OpExtInst %80 %78 SMin %1614 %1608
%1616 = OpINotEqual %79 %1612 %1614
%1617 = OpDPdx %40 %1603
%1618 = OpDPdy %40 %1603
%1619 = OpExtInst %40 %78 FAbs %1617
%1620 = OpExtInst %40 %78 FAbs %1618
%1621 = OpCompositeExtract %5 %1619 0
%1622 = OpCompositeExtract %5 %1620 0
%1623 = OpCompositeExtract %5 %1619 1
%1624 = OpCompositeExtract %5 %1620 1
%1625 = OpExtInst %5 %78 FMax %1621 %1622
%1626 = OpExtInst %5 %78 FMax %1623 %1624
%1627 = OpCompositeConstruct %40 %1625 %1626
%1628 = OpExtInst %40 %78 Fract %1603
%1630 = OpImageQuerySizeLod %761 %1600 %1612
%1631 = OpVectorShuffle %82 %1630 %1630 0 1
%1629 = OpConvertSToF %40 %1631
%1632 = OpSNegate %82 %1606
%1633 = OpExtInst %40 %78 Ldexp %1629 %1632
%1634 = OpFMul %40 %1628 %1633
%1635 = OpFMul %40 %1627 %1629
%1636 = OpFSub %40 %1635 %121
%1637 = OpExtInst %122 %78 FrexpStruct %1636
%1638 = OpCompositeExtract %82 %1637 1
%1639 = OpExtInst %82 %78 SClamp %1638 %127 %129
%1640 = OpIAdd %82 %1639 %1632
%1641 = OpExtInst %40 %78 Ldexp %133 %1640
%1642 = OpExtInst %40 %78 FMin %1641 %133
%1643 = OpFSub %40 %1634 %1642
%1644 = OpExtInst %40 %78 FMax %1643 %138
%1645 = OpFAdd %40 %1634 %1642
%1646 = OpConvertFToS %82 %1644
%1647 = OpConvertFToS %82 %1645
%1648 = OpINotEqual %81 %1646 %1647
%1649 = OpCompositeExtract %79 %1648 0
%1650 = OpCompositeExtract %79 %1648 1
%1651 = OpLogicalAnd %79 %1649 %1650
%1652 = OpSelect %80 %1649 %147 %126
%1653 = OpBitwiseOr %80 %90 %1652
%1654 = OpSelect %80 %1650 %128 %126
%1655 = OpBitwiseOr %80 %1653 %1654
%1656 = OpSelect %80 %1651 %152 %126
%1657 = OpBitwiseOr %80 %1655 %1656
%1658 = OpSConvert %18 %1657
%1659 = OpIMul %80 %1612 %128
%1660 = OpSConvert %18 %1659
%1661 = OpShiftLeftLogical %18 %1658 %1660
%1662 = OpCompositeConstruct %761 %1646 %1602
%1663 = OpIsHelperInvocationEXT %79
%1664 = OpLogicalNot %79 %1663
%1690 = OpFunctionCall %1 %1669 %1596 %1662 %1661 %1664
%1692 = OpImageQuerySizeLod %761 %1600 %1614
%1693 = OpVectorShuffle %82 %1692 %1692 0 1
%1691 = OpConvertSToF %40 %1693
%1694 = OpSNegate %82 %1606
%1695 = OpExtInst %40 %78 Ldexp %1691 %1694
%1696 = OpFMul %40 %1628 %1695
%1697 = OpFMul %40 %1627 %1691
%1698 = OpFSub %40 %1697 %121
%1699 = OpExtInst %122 %78 FrexpStruct %1698
%1700 = OpCompositeExtract %82 %1699 1
%1701 = OpExtInst %82 %78 SClamp %1700 %127 %129
%1702 = OpIAdd %82 %1701 %1694
%1703 = OpExtInst %40 %78 Ldexp %133 %1702
%1704 = OpExtInst %40 %78 FMin %1703 %133
%1705 = OpFSub %40 %1696 %1704
%1706 = OpExtInst %40 %78 FMax %1705 %138
%1707 = OpFAdd %40 %1696 %1704
%1708 = OpConvertFToS %82 %1706
%1709 = OpConvertFToS %82 %1707
%1710 = OpINotEqual %81 %1708 %1709
%1711 = OpCompositeExtract %79 %1710 0
%1712 = OpCompositeExtract %79 %1710 1
%1713 = OpLogicalAnd %79 %1711 %1712
%1714 = OpSelect %80 %1711 %147 %126
%1715 = OpBitwiseOr %80 %90 %1714
%1716 = OpSelect %80 %1712 %128 %126
%1717 = OpBitwiseOr %80 %1715 %1716
%1718 = OpSelect %80 %1713 %152 %126
%1719 = OpBitwiseOr %80 %1717 %1718
%1720 = OpSConvert %18 %1719
%1721 = OpIMul %80 %1614 %128
%1722 = OpSConvert %18 %1721
%1723 = OpShiftLeftLogical %18 %1720 %1722
%1724 = OpCompositeConstruct %761 %1708 %1602
%1725 = OpIsHelperInvocationEXT %79
%1726 = OpLogicalNot %79 %1725
%1727 = OpLogicalAnd %79 %1726 %1616
%1728 = OpFunctionCall %1 %1669 %1596 %1724 %1723 %1727
%1729 = OpCompositeConstruct %40 %67 %69
%1730 = OpImageQuerySize %82 %1467
%1731 = OpBitwiseAnd %82 %1730 %87
%1732 = OpImageQueryLevels %80 %1470
%1733 = OpISub %80 %1732 %90
%1734 = OpImageQueryLod %40 %1479 %1729
%1735 = OpCompositeExtract %5 %1734 0
%1736 = OpConvertFToS %80 %1735
%1737 = OpFAdd %5 %1735 %97
%1738 = OpConvertFToS %80 %1737
%1739 = OpExtInst %80 %78 SMin %1738 %1733
%1740 = OpINotEqual %79 %1736 %1738
%1741 = OpDPdx %40 %1729
%1742 = OpDPdy %40 %1729
%1743 = OpExtInst %40 %78 FAbs %1741
%1744 = OpExtInst %40 %78 FAbs %1742
%1745 = OpCompositeExtract %5 %1743 0
%1746 = OpCompositeExtract %5 %1744 0
%1747 = OpCompositeExtract %5 %1743 1
%1748 = OpCompositeExtract %5 %1744 1
%1749 = OpExtInst %5 %78 FMax %1745 %1746
%1750 = OpExtInst %5 %78 FMax %1747 %1748
%1751 = OpCompositeConstruct %40 %1749 %1750
%1752 = OpExtInst %40 %78 Fract %1729
%1754 = OpImageQuerySizeLod %82 %1470 %1736
%1753 = OpConvertSToF %40 %1754
%1755 = OpSNegate %82 %1731
%1756 = OpExtInst %40 %78 Ldexp %1753 %1755
%1757 = OpFMul %40 %1752 %1756
%1758 = OpFMul %40 %1751 %1753
%1759 = OpFSub %40 %1758 %121
%1760 = OpExtInst %122 %78 FrexpStruct %1759
%1761 = OpCompositeExtract %82 %1760 1
%1762 = OpExtInst %82 %78 SClamp %1761 %127 %129
%1763 = OpIAdd %82 %1762 %1755
%1764 = OpExtInst %40 %78 Ldexp %133 %1763
%1765 = OpExtInst %40 %78 FMin %1764 %133
%1766 = OpFSub %40 %1757 %1765
%1767 = OpExtInst %40 %78 FMax %1766 %138
%1768 = OpFAdd %40 %1757 %1765
%1769 = OpConvertFToS %82 %1767
%1770 = OpConvertFToS %82 %1768
%1771 = OpINotEqual %81 %1769 %1770
%1772 = OpCompositeExtract %79 %1771 0
%1773 = OpCompositeExtract %79 %1771 1
%1774 = OpLogicalAnd %79 %1772 %1773
%1775 = OpSelect %80 %1772 %147 %126
%1776 = OpBitwiseOr %80 %90 %1775
%1777 = OpSelect %80 %1773 %128 %126
%1778 = OpBitwiseOr %80 %1776 %1777
%1779 = OpSelect %80 %1774 %152 %126
%1780 = OpBitwiseOr %80 %1778 %1779
%1781 = OpSConvert %18 %1780
%1782 = OpIMul %80 %1736 %128
%1783 = OpSConvert %18 %1782
%1784 = OpShiftLeftLogical %18 %1781 %1783
%1785 = OpIsHelperInvocationEXT %79
%1786 = OpLogicalNot %79 %1785
%1787 = OpFunctionCall %1 %1537 %1466 %1769 %1784 %1786
%1789 = OpImageQuerySizeLod %82 %1470 %1738
%1788 = OpConvertSToF %40 %1789
%1790 = OpSNegate %82 %1731
%1791 = OpExtInst %40 %78 Ldexp %1788 %1790
%1792 = OpFMul %40 %1752 %1791
%1793 = OpFMul %40 %1751 %1788
%1794 = OpFSub %40 %1793 %121
%1795 = OpExtInst %122 %78 FrexpStruct %1794
%1796 = OpCompositeExtract %82 %1795 1
%1797 = OpExtInst %82 %78 SClamp %1796 %127 %129
%1798 = OpIAdd %82 %1797 %1790
%1799 = OpExtInst %40 %78 Ldexp %133 %1798
%1800 = OpExtInst %40 %78 FMin %1799 %133
%1801 = OpFSub %40 %1792 %1800
%1802 = OpExtInst %40 %78 FMax %1801 %138
%1803 = OpFAdd %40 %1792 %1800
%1804 = OpConvertFToS %82 %1802
%1805 = OpConvertFToS %82 %1803
%1806 = OpINotEqual %81 %1804 %1805
%1807 = OpCompositeExtract %79 %1806 0
%1808 = OpCompositeExtract %79 %1806 1
%1809 = OpLogicalAnd %79 %1807 %1808
%1810 = OpSelect %80 %1807 %147 %126
%1811 = OpBitwiseOr %80 %90 %1810
%1812 = OpSelect %80 %1808 %128 %126
%1813 = OpBitwiseOr %80 %1811 %1812
%1814 = OpSelect %80 %1809 %152 %126
%1815 = OpBitwiseOr %80 %1813 %1814
%1816 = OpSConvert %18 %1815
%1817 = OpIMul %80 %1738 %128
%1818 = OpSConvert %18 %1817
%1819 = OpShiftLeftLogical %18 %1816 %1818
%1820 = OpIsHelperInvocationEXT %79
%1821 = OpLogicalNot %79 %1820
%1822 = OpLogicalAnd %79 %1821 %1740
%1823 = OpFunctionCall %1 %1537 %1466 %1804 %1819 %1822
%1824 = OpExtInst %5 %78 RoundEven %72
%1825 = OpConvertFToS %80 %1824
%1826 = OpCompositeConstruct %40 %67 %69
%1827 = OpImageQuerySize %761 %1597
%1828 = OpVectorShuffle %82 %1827 %1827 0 1
%1829 = OpBitwiseAnd %82 %1828 %87
%1830 = OpImageQueryLevels %80 %1600
%1831 = OpISub %80 %1830 %90
%1832 = OpImageQueryLod %40 %1609 %1826
%1833 = OpCompositeExtract %5 %1832 0
%1834 = OpConvertFToS %80 %1833
%1835 = OpFAdd %5 %1833 %97
%1836 = OpConvertFToS %80 %1835
%1837 = OpExtInst %80 %78 SMin %1836 %1831
%1838 = OpINotEqual %79 %1834 %1836
%1839 = OpDPdx %40 %1826
%1840 = OpDPdy %40 %1826
%1841 = OpExtInst %40 %78 FAbs %1839
%1842 = OpExtInst %40 %78 FAbs %1840
%1843 = OpCompositeExtract %5 %1841 0
%1844 = OpCompositeExtract %5 %1842 0
%1845 = OpCompositeExtract %5 %1841 1
%1846 = OpCompositeExtract %5 %1842 1
%1847 = OpExtInst %5 %78 FMax %1843 %1844
%1848 = OpExtInst %5 %78 FMax %1845 %1846
%1849 = OpCompositeConstruct %40 %1847 %1848
%1850 = OpExtInst %40 %78 Fract %1826
%1852 = OpImageQuerySizeLod %761 %1600 %1834
%1853 = OpVectorShuffle %82 %1852 %1852 0 1
%1851 = OpConvertSToF %40 %1853
%1854 = OpSNegate %82 %1829
%1855 = OpExtInst %40 %78 Ldexp %1851 %1854
%1856 = OpFMul %40 %1850 %1855
%1857 = OpFMul %40 %1849 %1851
%1858 = OpFSub %40 %1857 %121
%1859 = OpExtInst %122 %78 FrexpStruct %1858
%1860 = OpCompositeExtract %82 %1859 1
%1861 = OpExtInst %82 %78 SClamp %1860 %127 %129
%1862 = OpIAdd %82 %1861 %1854
%1863 = OpExtInst %40 %78 Ldexp %133 %1862
%1864 = OpExtInst %40 %78 FMin %1863 %133
%1865 = OpFSub %40 %1856 %1864
%1866 = OpExtInst %40 %78 FMax %1865 %138
%1867 = OpFAdd %40 %1856 %1864
%1868 = OpConvertFToS %82 %1866
%1869 = OpConvertFToS %82 %1867
%1870 = OpINotEqual %81 %1868 %1869
%1871 = OpCompositeExtract %79 %1870 0
%1872 = OpCompositeExtract %79 %1870 1
%1873 = OpLogicalAnd %79 %1871 %1872
%1874 = OpSelect %80 %1871 %147 %126
%1875 = OpBitwiseOr %80 %90 %1874
%1876 = OpSelect %80 %1872 %128 %126
%1877 = OpBitwiseOr %80 %1875 %1876
%1878 = OpSelect %80 %1873 %152 %126
%1879 = OpBitwiseOr %80 %1877 %1878
%1880 = OpSConvert %18 %1879
%1881 = OpIMul %80 %1834 %128
%1882 = OpSConvert %18 %1881
%1883 = OpShiftLeftLogical %18 %1880 %1882
%1884 = OpCompositeConstruct %761 %1868 %1825
%1885 = OpIsHelperInvocationEXT %79
%1886 = OpLogicalNot %79 %1885
%1887 = OpFunctionCall %1 %1669 %1596 %1884 %1883 %1886
%1889 = OpImageQuerySizeLod %761 %1600 %1836
%1890 = OpVectorShuffle %82 %1889 %1889 0 1
%1888 = OpConvertSToF %40 %1890
%1891 = OpSNegate %82 %1829
%1892 = OpExtInst %40 %78 Ldexp %1888 %1891
%1893 = OpFMul %40 %1850 %1892
%1894 = OpFMul %40 %1849 %1888
%1895 = OpFSub %40 %1894 %121
%1896 = OpExtInst %122 %78 FrexpStruct %1895
%1897 = OpCompositeExtract %82 %1896 1
%1898 = OpExtInst %82 %78 SClamp %1897 %127 %129
%1899 = OpIAdd %82 %1898 %1891
%1900 = OpExtInst %40 %78 Ldexp %133 %1899
%1901 = OpExtInst %40 %78 FMin %1900 %133
%1902 = OpFSub %40 %1893 %1901
%1903 = OpExtInst %40 %78 FMax %1902 %138
%1904 = OpFAdd %40 %1893 %1901
%1905 = OpConvertFToS %82 %1903
%1906 = OpConvertFToS %82 %1904
%1907 = OpINotEqual %81 %1905 %1906
%1908 = OpCompositeExtract %79 %1907 0
%1909 = OpCompositeExtract %79 %1907 1
%1910 = OpLogicalAnd %79 %1908 %1909
%1911 = OpSelect %80 %1908 %147 %126
%1912 = OpBitwiseOr %80 %90 %1911
%1913 = OpSelect %80 %1909 %128 %126
%1914 = OpBitwiseOr %80 %1912 %1913
%1915 = OpSelect %80 %1910 %152 %126
%1916 = OpBitwiseOr %80 %1914 %1915
%1917 = OpSConvert %18 %1916
%1918 = OpIMul %80 %1836 %128
%1919 = OpSConvert %18 %1918
%1920 = OpShiftLeftLogical %18 %1917 %1919
%1921 = OpCompositeConstruct %761 %1905 %1825
%1922 = OpIsHelperInvocationEXT %79
%1923 = OpLogicalNot %79 %1922
%1924 = OpLogicalAnd %79 %1923 %1838
%1925 = OpFunctionCall %1 %1669 %1596 %1921 %1920 %1924
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
%188 = OpAtomicOr %18 %187 %60 %57 %185
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
%830 = OpFunction %1 None %825
%826 = OpFunctionParameter %23
%827 = OpFunctionParameter %761
%828 = OpFunctionParameter %18
%829 = OpFunctionParameter %79
%831 = OpLabel
%841 = OpVariable %178 Function %177
OpSelectionMerge %840 None
OpBranchConditional %829 %832 %840
%832 = OpLabel
%842 = OpLoad %79 %841
%843 = OpLogicalNot %79 %842
OpLoopMerge %839 %838 None
OpBranchConditional %843 %833 %839
%833 = OpLabel
%844 = OpGroupNonUniformBroadcastFirst %761 %74 %827
%845 = OpIEqual %824 %827 %844
%846 = OpAll %79 %845
OpStore %841 %846
OpSelectionMerge %837 None
OpBranchConditional %846 %834 %837
%834 = OpLabel
%847 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %828
%848 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %836 None
OpBranchConditional %848 %835 %836
%835 = OpLabel
%849 = OpImageTexelPointer %160 %826 %827 %126
%850 = OpAtomicOr %18 %849 %60 %57 %847
OpBranch %836
%836 = OpLabel
OpBranch %837
%837 = OpLabel
OpBranch %838
%838 = OpLabel
OpBranch %832
%839 = OpLabel
OpBranch %840
%840 = OpLabel
OpReturn
OpFunctionEnd
%1537 = OpFunction %1 None %161
%1533 = OpFunctionParameter %20
%1534 = OpFunctionParameter %82
%1535 = OpFunctionParameter %18
%1536 = OpFunctionParameter %79
%1538 = OpLabel
%1548 = OpVariable %178 Function %177
OpSelectionMerge %1547 None
OpBranchConditional %1536 %1539 %1547
%1539 = OpLabel
%1549 = OpLoad %79 %1548
%1550 = OpLogicalNot %79 %1549
OpLoopMerge %1546 %1545 None
OpBranchConditional %1550 %1540 %1546
%1540 = OpLabel
%1551 = OpGroupNonUniformBroadcastFirst %82 %74 %1534
%1552 = OpIEqual %81 %1534 %1551
%1553 = OpAll %79 %1552
OpStore %1548 %1553
OpSelectionMerge %1544 None
OpBranchConditional %1553 %1541 %1544
%1541 = OpLabel
%1554 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1535
%1555 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1543 None
OpBranchConditional %1555 %1542 %1543
%1542 = OpLabel
%1556 = OpImageTexelPointer %160 %1533 %1534 %126
%1557 = OpAtomicOr %18 %1556 %60 %57 %1554
OpBranch %1543
%1543 = OpLabel
OpBranch %1544
%1544 = OpLabel
OpBranch %1545
%1545 = OpLabel
OpBranch %1539
%1546 = OpLabel
OpBranch %1547
%1547 = OpLabel
OpReturn
OpFunctionEnd
%1669 = OpFunction %1 None %825
%1665 = OpFunctionParameter %23
%1666 = OpFunctionParameter %761
%1667 = OpFunctionParameter %18
%1668 = OpFunctionParameter %79
%1670 = OpLabel
%1680 = OpVariable %178 Function %177
OpSelectionMerge %1679 None
OpBranchConditional %1668 %1671 %1679
%1671 = OpLabel
%1681 = OpLoad %79 %1680
%1682 = OpLogicalNot %79 %1681
OpLoopMerge %1678 %1677 None
OpBranchConditional %1682 %1672 %1678
%1672 = OpLabel
%1683 = OpGroupNonUniformBroadcastFirst %761 %74 %1666
%1684 = OpIEqual %824 %1666 %1683
%1685 = OpAll %79 %1684
OpStore %1680 %1685
OpSelectionMerge %1676 None
OpBranchConditional %1685 %1673 %1676
%1673 = OpLabel
%1686 = OpGroupNonUniformBitwiseOr %18 %74 Reduce %1667
%1687 = OpGroupNonUniformElect %79 %74
OpSelectionMerge %1675 None
OpBranchConditional %1687 %1674 %1675
%1674 = OpLabel
%1688 = OpImageTexelPointer %160 %1665 %1666 %126
%1689 = OpAtomicOr %18 %1688 %60 %57 %1686
OpBranch %1675
%1675 = OpLabel
OpBranch %1676
%1676 = OpLabel
OpBranch %1677
%1677 = OpLabel
OpBranch %1671
%1678 = OpLabel
OpBranch %1679
%1679 = OpLabel
OpReturn
OpFunctionEnd
#endif
