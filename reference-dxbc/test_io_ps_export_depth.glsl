GLSL:
#version 460

layout(location = 1) in float DELTA;

void main()
{
    gl_FragDepth = DELTA + gl_FragCoord.z;
}


