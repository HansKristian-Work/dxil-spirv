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

layout(location = 0) in float INPUT;
layout(location = 0) out uint SV_TARGET;
layout(location = 1) out int SV_TARGET_1;

void main()
{
    SV_TARGET = (uint(INPUT) + uint(double(INPUT))) + uint(float16_t(INPUT));
    SV_TARGET_1 = int((uint(int(INPUT)) + uint(int(double(INPUT)))) + uint(int(float16_t(INPUT))));
}


