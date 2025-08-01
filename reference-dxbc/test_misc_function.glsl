GLSL:
#version 460

layout(location = 0) out vec4 SV_TARGET;

void _9()
{
    SV_TARGET.x = 1.0;
    SV_TARGET.y = 2.0;
    SV_TARGET.z = 3.0;
    SV_TARGET.w = 4.0;
}

void main()
{
    _9();
}


