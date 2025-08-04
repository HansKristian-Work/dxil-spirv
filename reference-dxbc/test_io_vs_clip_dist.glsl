GLSL:
#version 460

out float gl_ClipDistance[6];

void main()
{
    gl_ClipDistance[0u] = -2.5;
    gl_ClipDistance[1u] = -1.5;
    gl_ClipDistance[2u] = -0.5;
    gl_ClipDistance[3u] = 0.5;
    gl_ClipDistance[4u] = 1.5;
    gl_ClipDistance[5u] = 2.5;
}


