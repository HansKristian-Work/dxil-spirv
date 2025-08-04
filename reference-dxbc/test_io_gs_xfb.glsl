GLSL:
#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 0) out vec3 BUFFER_A_ATTR;
layout(location = 0, component = 3) out uint BUFFER_A_ATTR_1;
layout(location = 1, component = 2) out ivec2 BUFFER_B_ATTR;

void main()
{
    BUFFER_A_ATTR.x = 1.0;
    BUFFER_A_ATTR.y = 2.0;
    BUFFER_A_ATTR.z = 3.0;
    BUFFER_A_ATTR_1 = 4u;
    EmitVertex();
    EndPrimitive();
    BUFFER_B_ATTR.x = int(5u);
    BUFFER_B_ATTR.y = int(6u);
    EmitVertex();
    EndPrimitive();
}


