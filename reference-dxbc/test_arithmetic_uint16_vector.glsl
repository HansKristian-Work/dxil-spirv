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

u16vec2 _89;
u16vec2 _118;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

u16vec2 UDiv(u16vec2 num, u16vec2 den)
{
    uint16_t _88;
    SPIRV_CROSS_FLATTEN
    if (den.x == 0us)
    {
        _88 = 65535us;
    }
    else
    {
        _88 = num.x / den.x;
    }
    u16vec2 _90;
    _90.x = _88;
    uint16_t _98;
    SPIRV_CROSS_FLATTEN
    if (den.y == 0us)
    {
        _98 = 65535us;
    }
    else
    {
        _98 = num.y / den.y;
    }
    _90.y = _98;
    return _90;
}

u16vec2 UMod(u16vec2 num, u16vec2 den)
{
    uint16_t _117;
    SPIRV_CROSS_FLATTEN
    if (den.x == 0us)
    {
        _117 = 65535us;
    }
    else
    {
        _117 = num.x % den.x;
    }
    u16vec2 _119;
    _119.x = _117;
    uint16_t _127;
    SPIRV_CROSS_FLATTEN
    if (den.y == 0us)
    {
        _127 = 65535us;
    }
    else
    {
        _127 = num.y % den.y;
    }
    _119.y = _127;
    return _119;
}

void main()
{
    _13._m0[0u] = packUint2x16(clamp(max(min(UMod(UDiv(u16vec2(i16vec2((u16vec2(abs(i16vec2(-(((~(((unpackUint2x16(_9._m0[0u]) & unpackUint2x16(_9._m0[1u])) | unpackUint2x16(_9._m0[2u])) ^ unpackUint2x16(_9._m0[3u]))) + unpackUint2x16(_9._m0[4u])) - unpackUint2x16(_9._m0[5u]))))) * unpackUint2x16(_9._m0[6u])) << unpackUint2x16(_9._m0[7u])) >> i16vec2(unpackUint2x16(_9._m0[8u]))) >> unpackUint2x16(_9._m0[9u]), unpackUint2x16(_9._m0[10u])), unpackUint2x16(_9._m0[11u])), unpackUint2x16(_9._m0[12u])), unpackUint2x16(_9._m0[13u])), unpackUint2x16(_9._m0[14u]), unpackUint2x16(_9._m0[15u])));
}


