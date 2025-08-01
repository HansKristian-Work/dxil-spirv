GLSL:
#version 460
#extension GL_EXT_demote_to_helper_invocation : require

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _11;

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    vec4 _32 = texture(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y));
    float _37 = _32.w;
    if (_37 < 0.004999999888241291046142578125)
    {
        demote;
    }
    SV_TARGET.x = _32.x;
    SV_TARGET.y = _32.y;
    SV_TARGET.z = _32.z;
    SV_TARGET.w = _37;
}


