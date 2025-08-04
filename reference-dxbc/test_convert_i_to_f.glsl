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

layout(location = 0) flat in uint UINPUT;
layout(location = 0, component = 1) flat in int SINPUT;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out float SV_TARGET_1;

void main()
{
    uint _17 = uint(SINPUT);
    SV_TARGET = (float(UINPUT) + float(float16_t(UINPUT))) + float(double(UINPUT));
    SV_TARGET_1 = (float(int(_17)) + float(float16_t(int(_17)))) + float(double(int(_17)));
}


