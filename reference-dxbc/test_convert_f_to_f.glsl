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
layout(location = 0) out float SV_TARGET;

void main()
{
    SV_TARGET = float(float16_t(double(float(double(float16_t(INPUT))))));
}


