GLSL:
#version 460
#extension GL_EXT_spirv_intrinsics : require
layout(vertices = 4) out;

layout(location = 1) in vec3 NORMAL[];
layout(location = 1, component = 3) in float FACTOR[];
layout(location = 0) out vec4 SV_POSITION[4];
layout(location = 1) out vec3 NORMAL_1[4];
layout(location = 4) patch out uint INSTANCE_ID;
layout(location = 5) patch out vec3 TANGENT;
layout(location = 6) patch out vec3 TANGENT_1;

spirv_instruction(set = "GLSL.std.450", id = 79) float spvNMin(float, float);
spirv_instruction(set = "GLSL.std.450", id = 79) vec2 spvNMin(vec2, vec2);
spirv_instruction(set = "GLSL.std.450", id = 79) vec3 spvNMin(vec3, vec3);
spirv_instruction(set = "GLSL.std.450", id = 79) vec4 spvNMin(vec4, vec4);

void hull_main()
{
    SV_POSITION[gl_InvocationID].x = gl_in[gl_InvocationID].gl_Position.x;
    SV_POSITION[gl_InvocationID].y = gl_in[gl_InvocationID].gl_Position.y;
    SV_POSITION[gl_InvocationID].z = gl_in[gl_InvocationID].gl_Position.z;
    SV_POSITION[gl_InvocationID].w = gl_in[gl_InvocationID].gl_Position.w;
    NORMAL_1[gl_InvocationID].x = NORMAL[gl_InvocationID].x;
    NORMAL_1[gl_InvocationID].y = NORMAL[gl_InvocationID].y;
    NORMAL_1[gl_InvocationID].z = NORMAL[gl_InvocationID].z;
}

void patch_main()
{
    INSTANCE_ID = uint(gl_PrimitiveID);
    float _85 = spvNMin(FACTOR[0u], 64.0);
    gl_TessLevelOuter[0u] = _85;
    gl_TessLevelOuter[1u] = _85;
    gl_TessLevelOuter[2u] = _85;
    gl_TessLevelOuter[3u] = _85;
    gl_TessLevelInner[0u] = _85;
    gl_TessLevelInner[1u] = _85;
    TANGENT.x = SV_POSITION[1u].x - SV_POSITION[0u].x;
    TANGENT_1.x = SV_POSITION[2u].x - SV_POSITION[0u].x;
    TANGENT.y = SV_POSITION[1u].y - SV_POSITION[0u].y;
    TANGENT_1.y = SV_POSITION[2u].y - SV_POSITION[0u].y;
    TANGENT.z = SV_POSITION[1u].z - SV_POSITION[0u].z;
    TANGENT_1.z = SV_POSITION[2u].z - SV_POSITION[0u].z;
}

void main()
{
    hull_main();
    barrier();
    if (gl_InvocationID == 0u)
    {
        patch_main();
    }
}


