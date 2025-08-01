GLSL:
#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

void main()
{
    uint _98 = uint(clamp(max(min((((uint16_t(int16_t((uint16_t(abs(int16_t(-(((~(((uint16_t(_9._m0[0u]) & uint16_t(_9._m0[1u])) | uint16_t(_9._m0[2u])) ^ uint16_t(_9._m0[3u]))) + uint16_t(_9._m0[4u])) - uint16_t(_9._m0[5u]))))) * uint16_t(_9._m0[6u])) << uint16_t(_9._m0[7u])) >> int16_t(uint16_t(_9._m0[8u]))) >> uint16_t(_9._m0[9u])) / uint16_t(_9._m0[10u])) % uint16_t(_9._m0[11u])), uint16_t(_9._m0[12u])), uint16_t(_9._m0[13u])), uint16_t(_9._m0[14u]), uint16_t(_9._m0[15u])));
    _13._m0[0u] = _98;
}


