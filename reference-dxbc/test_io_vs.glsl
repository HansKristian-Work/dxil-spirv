GLSL:
#version 460

layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec3 NORMAL;
layout(location = 2) in vec3 TANGENT;
layout(location = 3) in vec3 TANGENT_1;
layout(location = 4) in uint COLOR_1;
layout(location = 1) out vec3 NORMAL_1;
layout(location = 1, component = 3) out uint COLOR;
layout(location = 2) out vec3 TANGENT_2;
layout(location = 3) out vec3 TANGENT_1_1;

void main()
{
    gl_Position.x = POSITION.x;
    gl_Position.y = POSITION.y;
    gl_Position.z = POSITION.z;
    gl_Position.w = 1.0;
    NORMAL_1.x = NORMAL.x;
    NORMAL_1.y = NORMAL.y;
    NORMAL_1.z = NORMAL.z;
    COLOR = COLOR_1;
    TANGENT_2.x = TANGENT.x;
    TANGENT_2.y = TANGENT.y;
    TANGENT_2.z = TANGENT.z;
    TANGENT_1_1.x = TANGENT_1.x;
    TANGENT_1_1.y = TANGENT_1.y;
    TANGENT_1_1.z = TANGENT_1.z;
}


