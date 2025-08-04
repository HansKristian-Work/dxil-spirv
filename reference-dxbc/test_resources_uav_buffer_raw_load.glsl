GLSL:
#version 460

layout(set = 0, binding = 0, std430) readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) readonly buffer _12_14
{
    uvec2 _m0[];
} _14;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uvec2 SV_TARGET_1;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uint _35 = (BUFFER_ADDRESS.x * 2u) + 1u;
    uint _48 = 7u + 1u;
    uvec2 _50 = uvec2(_9._m0[7u], _9._m0[_48]);
    SV_TARGET.x = _14._m0[_35].x;
    SV_TARGET.y = _14._m0[_35].y;
    SV_TARGET_1.x = _50.x;
    SV_TARGET_1.y = _50.y;
    SV_TARGET_3 = _9._m0[(BUFFER_ADDRESS.x * 4u) + 2u];
}


