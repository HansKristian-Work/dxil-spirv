GLSL:
#version 460
#extension GL_NV_conservative_raster_underestimation : require

layout(location = 0) out float SV_TARGET;

void main()
{
    SV_TARGET = float(gl_FragFullyCoveredNV);
}


