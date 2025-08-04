GLSL:
#version 460

const vec4 _20[5] = vec4[](vec4(0.0), vec4(0.0, 1.0, 0.0, 0.0), vec4(1.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 0.0, 0.0), vec4(0.0));

void main()
{
    uint _28 = min((uint(gl_VertexIndex) - uint(gl_BaseVertex)), 4u);
    gl_Position.x = _20[_28].x;
    gl_Position.y = _20[_28].y;
    gl_Position.z = _20[_28].z;
    gl_Position.w = _20[_28].w;
}


