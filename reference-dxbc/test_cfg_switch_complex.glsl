GLSL:
#version 460

layout(location = 1) flat in int SEL;
layout(location = 0) out float SV_TARGET;

void main()
{
    uint _16 = uint(SEL);
    float _17;
    float _28;
    if (_16 == 9)
    {
        _28 = -1.0;
    }
    switch (_16)
    {
        case 3u:
        {
            _17 = gl_FragCoord.x;
            break;
        }
        case 7u:
        {
            _28 = gl_FragCoord.y;
        }
        case 9u:
        {
            _17 = gl_FragCoord.z + _28;
            break;
        }
        case 17u:
        {
            _17 = gl_FragCoord.w;
            break;
        }
        default:
        {
            _17 = 0.0;
            break;
        }
    }
    SV_TARGET = _17;
}


