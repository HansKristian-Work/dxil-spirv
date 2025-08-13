GLSL:
#version 460

float _20;

layout(location = 0) in float INPUT;
layout(location = 0) out float SV_TARGET;

float _12(float _11)
{
    float _19;
    if (_11 >= 0.0)
    {
        _19 = sqrt(_11);
    }
    else
    {
        _19 = _20;
    }
    return _19;
}

void main()
{
    SV_TARGET = (INPUT >= 0.0) ? _12(INPUT) : _20;
}


