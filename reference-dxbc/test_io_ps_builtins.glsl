GLSL:
#version 460

void main()
{
    gl_SampleMask[0u] = int(gl_FrontFacing ? bitfieldExtract(uint(gl_SampleMaskIn[0u]), int(0u), int(uint(gl_SampleID))) : 0u);
}


