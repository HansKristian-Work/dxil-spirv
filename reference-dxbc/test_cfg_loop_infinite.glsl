GLSL:
#version 460

layout(location = 0) out float SV_TARGET;

void main()
{
    float _17;
    float _16 = gl_FragCoord.x;
    for (;;)
    {
        _17 = _16 + 1.0;
        if (_17 >= 10000.0)
        {
            SV_TARGET = _17;
            return;
        }
        _16 = _17;
        continue;
    }
}


