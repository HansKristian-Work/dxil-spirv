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
#extension GL_EXT_spirv_intrinsics : require
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

spirv_instruction(set = "GLSL.std.450", id = 79) float16_t spvNMin(float16_t, float16_t);
spirv_instruction(set = "GLSL.std.450", id = 79) f16vec2 spvNMin(f16vec2, f16vec2);
spirv_instruction(set = "GLSL.std.450", id = 79) f16vec3 spvNMin(f16vec3, f16vec3);
spirv_instruction(set = "GLSL.std.450", id = 79) f16vec4 spvNMin(f16vec4, f16vec4);
spirv_instruction(set = "GLSL.std.450", id = 80) float16_t spvNMax(float16_t, float16_t);
spirv_instruction(set = "GLSL.std.450", id = 80) f16vec2 spvNMax(f16vec2, f16vec2);
spirv_instruction(set = "GLSL.std.450", id = 80) f16vec3 spvNMax(f16vec3, f16vec3);
spirv_instruction(set = "GLSL.std.450", id = 80) f16vec4 spvNMax(f16vec4, f16vec4);
spirv_instruction(set = "GLSL.std.450", id = 81) float16_t spvNClamp(float16_t, float16_t, float16_t);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec2 spvNClamp(f16vec2, f16vec2, f16vec2);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec3 spvNClamp(f16vec3, f16vec3, f16vec3);
spirv_instruction(set = "GLSL.std.450", id = 81) f16vec4 spvNClamp(f16vec4, f16vec4, f16vec4);

void main()
{
    _13._m0[0u] = floatBitsToUint(float(spvNClamp(spvNMax(spvNMin(fract(float16_t(1.0) / (fma(ceil(floor(roundEven((-abs(trunc(float16_t(uintBitsToFloat(_9._m0[0u]))))) + float16_t(uintBitsToFloat(_9._m0[1u]))) - float16_t(uintBitsToFloat(_9._m0[2u]))) * float16_t(uintBitsToFloat(_9._m0[3u]))), float16_t(uintBitsToFloat(_9._m0[4u])), float16_t(uintBitsToFloat(_9._m0[5u]))) / float16_t(uintBitsToFloat(_9._m0[6u])))), float16_t(uintBitsToFloat(_9._m0[7u]))), float16_t(uintBitsToFloat(_9._m0[8u]))), float16_t(uintBitsToFloat(_9._m0[9u])), float16_t(uintBitsToFloat(_9._m0[10u])))));
}


