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
    vec4 _34 = vec4(POSITION.x, POSITION.y, POSITION.z, 1.0);
    gl_Position.x = _34.x;
    gl_Position.y = _34.y;
    gl_Position.z = _34.z;
    gl_Position.w = _34.w;
    vec3 _52 = vec3(NORMAL.x, NORMAL.y, NORMAL.z);
    NORMAL_1.x = _52.x;
    NORMAL_1.y = _52.y;
    NORMAL_1.z = _52.z;
    COLOR = COLOR_1;
    vec3 _66 = vec3(TANGENT.x, TANGENT.y, TANGENT.z);
    TANGENT_2.x = _66.x;
    TANGENT_2.y = _66.y;
    TANGENT_2.z = _66.z;
    TANGENT_1_1.x = TANGENT_1.x;
    TANGENT_1_1.y = TANGENT_1.y;
    TANGENT_1_1.z = TANGENT_1.z;
}


