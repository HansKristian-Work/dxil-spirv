GLSL:
#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_EXT_control_flow_attributes)
#extension GL_EXT_control_flow_attributes : require
#define SPIRV_CROSS_FLATTEN [[flatten]]
#define SPIRV_CROSS_BRANCH [[dont_flatten]]
#define SPIRV_CROSS_UNROLL [[unroll]]
#define SPIRV_CROSS_LOOP [[dont_unroll]]
#else
#define SPIRV_CROSS_FLATTEN
#define SPIRV_CROSS_BRANCH
#define SPIRV_CROSS_UNROLL
#define SPIRV_CROSS_LOOP
#endif
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

uint16_t UDiv(uint16_t num, uint16_t den)
{
    uint16_t _85;
    SPIRV_CROSS_FLATTEN
    if (den == 0us)
    {
        _85 = 65535us;
    }
    else
    {
        _85 = num / den;
    }
    return _85;
}

uint16_t UMod(uint16_t num, uint16_t den)
{
    uint16_t _101;
    SPIRV_CROSS_FLATTEN
    if (den == 0us)
    {
        _101 = 65535us;
    }
    else
    {
        _101 = num % den;
    }
    return _101;
}

void main()
{
    _13._m0[0u] = uint(clamp(max(min(UMod(UDiv(uint16_t(int16_t((uint16_t(abs(int16_t(-(((~(((uint16_t(_9._m0[0u]) & uint16_t(_9._m0[1u])) | uint16_t(_9._m0[2u])) ^ uint16_t(_9._m0[3u]))) + uint16_t(_9._m0[4u])) - uint16_t(_9._m0[5u]))))) * uint16_t(_9._m0[6u])) << uint16_t(_9._m0[7u])) >> int16_t(uint16_t(_9._m0[8u]))) >> uint16_t(_9._m0[9u]), uint16_t(_9._m0[10u])), uint16_t(_9._m0[11u])), uint16_t(_9._m0[12u])), uint16_t(_9._m0[13u])), uint16_t(_9._m0[14u]), uint16_t(_9._m0[15u])));
}


