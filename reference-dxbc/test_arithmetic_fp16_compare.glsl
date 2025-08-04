GLSL:
#version 460
#if defined(GL_AMD_gpu_shader_half_float)
#extension GL_AMD_gpu_shader_half_float : require
#elif defined(GL_EXT_shader_explicit_arithmetic_types_float16)
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : require
#else
#error No extension available for FP16.
#endif
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
    float16_t _21 = float16_t(uintBitsToFloat(_9._m0[0u]));
    float16_t _26 = float16_t(uintBitsToFloat(_9._m0[1u]));
    _13._m0[0u] = uint(_21 == _26);
    _13._m0[1u] = uint(_21 != _26);
    _13._m0[2u] = uint(_21 < _26);
    _13._m0[3u] = uint(_21 <= _26);
    _13._m0[4u] = uint(_21 > _26);
    _13._m0[5u] = uint(_21 >= _26);
    _13._m0[6u] = uint(isnan(_21));
}


