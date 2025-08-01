GLSL:
#version 460

layout(location = 0) out float SV_TARGET;

void main()
{
    float _19 = 1.0 / gl_FragCoord.w;
    float _25;
    if (_19 != 0.0)
    {
        _25 = gl_FragCoord.z / _19;
    }
    else
    {
        _25 = gl_FragCoord.z;
    }
    SV_TARGET = _25;
}


