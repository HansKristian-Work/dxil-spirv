GLSL:
#version 460

layout(location = 1) flat in int SEL;
layout(location = 0) out float SV_TARGET;

void main()
{
    uint _16 = uint(SEL);
    float _24;
    float _33;
    if (_16 == 9)
    {
        _24 = -1.0;
    }
    switch (_16)
    {
        case 3u:
        {
            _33 = gl_FragCoord.x;
            break;
        }
        case 7u:
        {
            _24 = gl_FragCoord.y;
        }
        case 9u:
        {
            _33 = gl_FragCoord.z + _24;
            break;
        }
        case 17u:
        {
            _33 = gl_FragCoord.w;
            break;
        }
        default:
        {
            _33 = 0.0;
            break;
        }
    }
    SV_TARGET = _33;
}


