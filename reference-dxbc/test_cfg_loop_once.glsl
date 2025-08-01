GLSL:
#version 460

layout(location = 0) out float SV_TARGET;

void main()
{
    float _16;
    for (;;)
    {
        _16 = gl_FragCoord.x + 1.0;
        break;
    }
    SV_TARGET = _16;
}


