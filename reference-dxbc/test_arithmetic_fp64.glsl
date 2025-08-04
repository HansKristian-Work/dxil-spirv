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

spirv_instruction(set = "GLSL.std.450", id = 79) double spvNMin(double, double);
spirv_instruction(set = "GLSL.std.450", id = 79) dvec2 spvNMin(dvec2, dvec2);
spirv_instruction(set = "GLSL.std.450", id = 79) dvec3 spvNMin(dvec3, dvec3);
spirv_instruction(set = "GLSL.std.450", id = 79) dvec4 spvNMin(dvec4, dvec4);
spirv_instruction(set = "GLSL.std.450", id = 80) double spvNMax(double, double);
spirv_instruction(set = "GLSL.std.450", id = 80) dvec2 spvNMax(dvec2, dvec2);
spirv_instruction(set = "GLSL.std.450", id = 80) dvec3 spvNMax(dvec3, dvec3);
spirv_instruction(set = "GLSL.std.450", id = 80) dvec4 spvNMax(dvec4, dvec4);
spirv_instruction(set = "GLSL.std.450", id = 81) double spvNClamp(double, double, double);
spirv_instruction(set = "GLSL.std.450", id = 81) dvec2 spvNClamp(dvec2, dvec2, dvec2);
spirv_instruction(set = "GLSL.std.450", id = 81) dvec3 spvNClamp(dvec3, dvec3, dvec3);
spirv_instruction(set = "GLSL.std.450", id = 81) dvec4 spvNClamp(dvec4, dvec4, dvec4);

void main()
{
    _13._m0[0u] = floatBitsToUint(float(spvNClamp(spvNMax(spvNMin(1.0lf / (fma((((-abs(double(uintBitsToFloat(_9._m0[0u])))) + double(uintBitsToFloat(_9._m0[1u]))) - double(uintBitsToFloat(_9._m0[2u]))) * double(uintBitsToFloat(_9._m0[3u])), double(uintBitsToFloat(_9._m0[4u])), double(uintBitsToFloat(_9._m0[5u]))) / double(uintBitsToFloat(_9._m0[6u]))), double(uintBitsToFloat(_9._m0[7u]))), double(uintBitsToFloat(_9._m0[8u]))), double(uintBitsToFloat(_9._m0[9u])), double(uintBitsToFloat(_9._m0[10u])))));
}


