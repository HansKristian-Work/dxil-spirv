GLSL:
#version 460
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

spirv_instruction(set = "GLSL.std.450", id = 79) float spvNMin(float, float);
spirv_instruction(set = "GLSL.std.450", id = 79) vec2 spvNMin(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 79) vec3 spvNMin(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 79) vec4 spvNMin(vec4, vec4);
spirv_instruction(set = "GLSL.std.450", id = 80) float spvNMax(float, float);
spirv_instruction(set = "GLSL.std.450", id = 80) vec2 spvNMax(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 80) vec3 spvNMax(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 80) vec4 spvNMax(vec4, vec4);
spirv_instruction(set = "GLSL.std.450", id = 81) float spvNClamp(float, float, float);
spirv_instruction(set = "GLSL.std.450", id = 81) vec2 spvNClamp(vec2, vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 81) vec3 spvNClamp(vec3, vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 81) vec4 spvNClamp(vec4, vec4, vec4);

void main()
{
    precise float _28 = (-abs(trunc(uintBitsToFloat(_9._m0[0u])))) + uintBitsToFloat(_9._m0[1u]);
    precise float _34 = roundEven(_28) - uintBitsToFloat(_9._m0[2u]);
    precise float _40 = floor(_34) * uintBitsToFloat(_9._m0[3u]);
    precise float _55 = fma(ceil(_40), uintBitsToFloat(_9._m0[4u]), uintBitsToFloat(_9._m0[5u])) / uintBitsToFloat(_9._m0[6u]);
    precise float _56 = 1.0 / _55;
    _13._m0[0u] = floatBitsToUint(spvNClamp(spvNMax(spvNMin(fract(_56), uintBitsToFloat(_9._m0[7u])), uintBitsToFloat(_9._m0[8u])), uintBitsToFloat(_9._m0[9u]), uintBitsToFloat(_9._m0[10u])));
}


