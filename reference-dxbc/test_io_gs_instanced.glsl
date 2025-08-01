GLSL:
#version 460
layout(invocations = 12, points) in;
layout(max_vertices = 1, points) out;

void main()
{
    gl_PrimitiveID = int(gl_InvocationID + (uint(gl_PrimitiveIDIn) * 12u));
    gl_Layer = int(gl_InvocationID >> 1u);
    gl_ViewportIndex = int(gl_InvocationID & 1u);
    gl_Position.x = 1.0;
    gl_Position.y = 1.0;
    gl_Position.z = 1.0;
    gl_Position.w = 1.0;
    EmitVertex();
    EndPrimitive();
}


