GLSL:
#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 0) out ivec2 BUFFER_A_ATTR;
layout(location = 1) out uint BUFFER_A_ATTR_1;

void main()
{
    BUFFER_A_ATTR.x = int(1u);
    BUFFER_A_ATTR.y = int(2u);
    BUFFER_A_ATTR_1 = 3u;
    EmitStreamVertex(int(0u));
    EndStreamPrimitive(int(0u));
    gl_Position.x = 4.0;
    gl_Position.y = 5.0;
    gl_Position.z = 6.0;
    gl_Position.w = 7.0;
    EmitStreamVertex(int(1u));
    EndStreamPrimitive(int(1u));
}


