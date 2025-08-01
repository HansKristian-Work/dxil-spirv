GLSL:
#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require
#if defined(GL_ARB_gpu_shader_int64)
#extension GL_ARB_gpu_shader_int64 : require
#else
#error No extension available for 64-bit integers.
#endif

layout(location = 0) flat in uint INPUT;
layout(location = 0) out uint SV_TARGET;

void main()
{
    SV_TARGET = uint(uint16_t(uint64_t(uint16_t(uint(uint16_t(uint(uint64_t(int(uint(int16_t(uint16_t(uint(uint64_t(int16_t(uint16_t(uint64_t(int(uint(uint16_t(uint64_t(uint(uint64_t(uint16_t(INPUT))))))))))))))))))))))));
}


