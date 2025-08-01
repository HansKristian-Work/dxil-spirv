GLSL:
#version 460

layout(location = 1) flat in int SEL;
layout(location = 0) out float SV_TARGET;

void main()
{
    switch (uint(SEL))
    {
        case 3u:
        {
            SV_TARGET = gl_FragCoord.x;
            break;
        }
        case 6u:
        case 7u:
        {
            SV_TARGET = gl_FragCoord.y;
            break;
        }
        case 9u:
        {
            SV_TARGET = gl_FragCoord.z;
            break;
        }
        default:
        {
            SV_TARGET = gl_FragCoord.w;
            break;
        }
    }
}


