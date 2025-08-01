GLSL:
#version 460
#extension GL_ARB_shader_stencil_export : require

layout(location = 0) flat in uint STENCIL_REF;

void main()
{
    gl_FragStencilRefARB = int(STENCIL_REF);
}


