GLSL:
#version 460
#extension GL_ARB_conservative_depth : require
layout(depth_greater) out float gl_FragDepth;

layout(location = 1) in float DELTA;

void main()
{
    gl_FragDepth = DELTA + gl_FragCoord.z;
}


