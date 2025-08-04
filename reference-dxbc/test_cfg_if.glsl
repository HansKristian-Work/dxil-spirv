GLSL:
#version 460

layout(location = 0) out float SV_TARGET;

void main()
{
    float _23;
    if (gl_FragCoord.w != 0.0)
    {
        _23 = gl_FragCoord.z / gl_FragCoord.w;
    }
    else
    {
        _23 = gl_FragCoord.z;
    }
    SV_TARGET = _23;
}


