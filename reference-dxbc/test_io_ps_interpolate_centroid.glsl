GLSL:
#version 460

layout(location = 0) noperspective in float IN_SCALAR;
layout(location = 1) in vec3 IN_VECTOR;
layout(location = 2) sample in vec3 IN_VECTOR_1;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out vec3 SV_TARGET_1;
layout(location = 2) out float SV_TARGET_2;

void main()
{
    SV_TARGET = interpolateAtCentroid(IN_SCALAR);
    SV_TARGET_1.x = interpolateAtCentroid(IN_VECTOR.x);
    SV_TARGET_1.y = interpolateAtCentroid(IN_VECTOR.y);
    SV_TARGET_1.z = interpolateAtCentroid(IN_VECTOR.z);
    SV_TARGET_2 = interpolateAtCentroid(IN_VECTOR_1.y);
}


