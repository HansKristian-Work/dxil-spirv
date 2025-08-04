GLSL:
#version 460
#extension GL_ARB_shader_viewport_layer_array : require

void main()
{
    gl_Layer = int(uint(gl_InstanceIndex) - uint(gl_BaseInstance));
}


