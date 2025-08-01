GLSL:
#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 1) out uint BUFFER_A_ATTR_1;
layout(location = 4, stream = 1) out ivec2 BUFFER_B_ATTR;

void main()
{
    gl_Position.x = 1.0;
    gl_Position.y = 2.0;
    gl_Position.z = 3.0;
    gl_Position.w = 4.0;
    BUFFER_A_ATTR_1 = 4u;
    EmitStreamVertex(int(0u));
    EndStreamPrimitive(int(0u));
    BUFFER_B_ATTR.x = int(5u);
    BUFFER_B_ATTR.y = int(6u);
    EmitStreamVertex(int(1u));
    EndStreamPrimitive(int(1u));
}


