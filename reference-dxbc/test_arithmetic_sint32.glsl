GLSL:
#version 460
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
    _13._m0[0u] = uint(findMSB(int(uint(findLSB(bitfieldReverse(uint(bitCount(uint(bitfieldExtract(int(bitfieldInsert(uint(clamp(int(uint(max(int(uint(min(int(uint(int((uint(abs(int(-(((~(((_9._m0[0u] & _9._m0[1u]) | _9._m0[2u]) ^ _9._m0[3u])) + _9._m0[4u]) - _9._m0[5u])))) * _9._m0[6u]) << _9._m0[7u]) >> int(_9._m0[8u])) >> _9._m0[9u]), int(_9._m0[10u])))), int(_9._m0[11u])))), int(_9._m0[12u]), int(_9._m0[13u]))), _9._m0[14u], int(_9._m0[15u]), int(_9._m0[16u]))), int(_9._m0[17u]), int(_9._m0[18u])))))))))));
}


