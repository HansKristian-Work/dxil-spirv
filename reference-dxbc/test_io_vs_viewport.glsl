GLSL:
#version 460

void main()
{
    gl_ViewportIndex = int(uint(gl_InstanceIndex) - uint(gl_BaseInstance));
}


