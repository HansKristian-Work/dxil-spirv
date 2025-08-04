GLSL:
#version 460

layout(set = 0, binding = 0, std430) readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uvec2 SV_TARGET_1;
layout(location = 2) out uvec4 SV_TARGET_2;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uint _36 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    uvec2 _43 = uvec2(_9._m0[_36], _9._m0[_36 + 1u]);
    uint _51 = 143u + 1u;
    uvec2 _53 = uvec2(_9._m0[143u], _9._m0[_51]);
    SV_TARGET.x = _43.x;
    SV_TARGET.y = _43.y;
    SV_TARGET_1.x = _53.x;
    SV_TARGET_1.y = _53.y;
    uint _65 = 331u + 1u;
    uint _68 = 331u + 2u;
    uint _72 = 331u + 3u;
    uvec4 _74 = uvec4(_9._m0[331u], _9._m0[_65], _9._m0[_68], _9._m0[_72]);
    SV_TARGET_2.x = _74.x;
    SV_TARGET_2.y = _74.y;
    SV_TARGET_2.z = _74.z;
    SV_TARGET_2.w = _74.w;
    SV_TARGET_3 = _9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y];
}


