GLSL:
#version 460
layout(local_size_x = 32, local_size_y = 1, local_size_z = 1) in;

float _50;

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

shared float _21[32];

void main()
{
    _21[gl_LocalInvocationIndex] = uintBitsToFloat(_9._m0[gl_GlobalInvocationID.x]);
    bool _42;
    float _49;
    uint _36 = 16u;
    for (;;)
    {
        barrier();
        _42 = gl_LocalInvocationIndex < _36;
        if (_42)
        {
            _49 = _21[gl_LocalInvocationIndex] + _21[gl_LocalInvocationIndex + _36];
        }
        else
        {
            _49 = _50;
        }
        barrier();
        if (_42)
        {
            _21[gl_LocalInvocationIndex] = _49;
        }
        uint _38 = _36 >> 1u;
        if (_38 != 0u)
        {
            _36 = _38;
            continue;
        }
        else
        {
            break;
        }
    }
    barrier();
    _13._m0[gl_GlobalInvocationID.x] = floatBitsToUint(_21[0u]);
}


