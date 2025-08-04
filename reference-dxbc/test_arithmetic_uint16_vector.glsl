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
    uint _99 = packUint2x16(clamp(max(min((((u16vec2(i16vec2((u16vec2(abs(i16vec2(-(((~(((unpackUint2x16(_9._m0[0u]) & unpackUint2x16(_9._m0[1u])) | unpackUint2x16(_9._m0[2u])) ^ unpackUint2x16(_9._m0[3u]))) + unpackUint2x16(_9._m0[4u])) - unpackUint2x16(_9._m0[5u]))))) * unpackUint2x16(_9._m0[6u])) << unpackUint2x16(_9._m0[7u])) >> i16vec2(unpackUint2x16(_9._m0[8u]))) >> unpackUint2x16(_9._m0[9u])) / unpackUint2x16(_9._m0[10u])) % unpackUint2x16(_9._m0[11u])), unpackUint2x16(_9._m0[12u])), unpackUint2x16(_9._m0[13u])), unpackUint2x16(_9._m0[14u]), unpackUint2x16(_9._m0[15u])));
    _13._m0[0u] = _99;
}


