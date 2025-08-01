GLSL:
#version 460

layout(location = 0) out uint SHADER_OUT;

void main()
{
    SHADER_OUT = uint(gl_VertexIndex) - uint(gl_BaseVertex);
}


