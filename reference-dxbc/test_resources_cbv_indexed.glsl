GLSL:
#version 460
#extension GL_EXT_scalar_block_layout : require

layout(set = 1, binding = 0, scalar) uniform _9_11
{
    float _m0[4];
} _11;

layout(set = 0, binding = 0, std140) uniform _15_19
{
    vec4 _m0[8];
} _19[256];

layout(location = 0) out vec4 SV_TARGET;

void main()
{
    uint _27 = floatBitsToUint(_11._m0[1u]);
    SV_TARGET.x = _19[_27]._m0[2u].x;
    SV_TARGET.y = _19[_27]._m0[2u].y;
    SV_TARGET.z = _19[_27]._m0[2u].z;
    SV_TARGET.w = _19[_27]._m0[2u].w;
}


