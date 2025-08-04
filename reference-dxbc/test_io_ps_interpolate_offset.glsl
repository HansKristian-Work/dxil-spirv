GLSL:
#version 460

layout(location = 3) in vec2 OFFSET;
layout(location = 0) noperspective in float IN_SCALAR;
layout(location = 1) in vec3 IN_VECTOR;
layout(location = 2) centroid in vec3 IN_VECTOR_1;
layout(location = 0) out float SV_TARGET;
layout(location = 1) out vec3 SV_TARGET_1;
layout(location = 2) out float SV_TARGET_2;

void main()
{
    vec2 _27 = vec2(OFFSET.x, OFFSET.y);
    SV_TARGET = interpolateAtOffset(IN_SCALAR, _27);
    SV_TARGET_1.x = interpolateAtOffset(IN_VECTOR.x, _27);
    SV_TARGET_1.y = interpolateAtOffset(IN_VECTOR.y, _27);
    SV_TARGET_1.z = interpolateAtOffset(IN_VECTOR.z, _27);
    SV_TARGET_2 = interpolateAtOffset(IN_VECTOR_1.y, _27);
}


