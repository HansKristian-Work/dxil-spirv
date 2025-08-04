GLSL:
#version 460
layout(depth_less) out float gl_FragDepth;

layout(location = 1) in float DELTA;

void main()
{
    gl_FragDepth = DELTA + gl_FragCoord.z;
}


