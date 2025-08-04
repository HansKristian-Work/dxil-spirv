GLSL:
#version 460

layout(location = 0) noperspective in float IN_SCALAR;
layout(location = 1) in vec3 IN_VECTOR;
layout(location = 2) centroid in vec3 IN_VECTOR_1;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out vec3 SV_TARGET_1;
layout(location = 2) out float SV_TARGET_2;

void main()
{
    SV_TARGET = interpolateAtSample(IN_SCALAR, uint(gl_SampleID));
    SV_TARGET_1.x = interpolateAtSample(IN_VECTOR.x, uint(gl_SampleID));
    SV_TARGET_1.y = interpolateAtSample(IN_VECTOR.y, uint(gl_SampleID));
    SV_TARGET_1.z = interpolateAtSample(IN_VECTOR.z, uint(gl_SampleID));
    SV_TARGET_2 = interpolateAtSample(IN_VECTOR_1.y, uint(gl_SampleID));
}


