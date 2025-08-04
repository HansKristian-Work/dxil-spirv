GLSL:
#version 460

layout(location = 0) out vec4 SV_TARGET;

void _14(float _10, float _11, float _12, float _13)
{
    SV_TARGET.x = _10;
    SV_TARGET.y = _11;
    SV_TARGET.z = _12;
    SV_TARGET.w = _13;
}

void main()
{
    _14(1.0, 2.0, 3.0, 4.0);
}


