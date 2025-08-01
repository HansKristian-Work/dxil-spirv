GLSL:
#version 460

layout(location = 0) out vec4 SV_TARGET;

vec4 _14(float _10, float _11, float _12, float _13)
{
    return vec4(_10 * _13, _11 * _13, _12 * _13, _13);
}

void main()
{
    vec4 _20 = _14(0.20000000298023223876953125, 0.5, 1.0, 0.800000011920928955078125);
    SV_TARGET.x = _20.x;
    SV_TARGET.y = _20.y;
    SV_TARGET.z = _20.z;
    SV_TARGET.w = _20.w;
}


