GLSL:
#version 460
layout(local_size_x = 1, local_size_y = 1, local_size_z = 1) in;

struct WideArithResult
{
    uint _m0;
    uint _m1;
};

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _10;

layout(set = 0, binding = 0, std430) writeonly buffer _12_14
{
    uvec2 _m0[];
} _14;

void main()
{
    WideArithResult _23;
    _23._m0 = uaddCarry(_10._m0[0u].x, _10._m0[0u].y, _23._m1);
    _14._m0[0u] = uvec2(uvec2(_23._m0, _23._m1));
    WideArithResult _37;
    _37._m0 = usubBorrow(_10._m0[1u].x, _10._m0[1u].y, _37._m1);
    _14._m0[1u] = uvec2(uvec2(_37._m0, _37._m1));
    WideArithResult _53;
    imulExtended((_10._m0[2u].x), (_10._m0[2u].y), _53._m1, _53._m0);
    uvec2 _56 = uvec2(_53._m0, _53._m1);
    _14._m0[2u] = uvec2((_56.x), (_56.y));
    WideArithResult _70;
    umulExtended(_10._m0[3u].x, _10._m0[3u].y, _70._m1, _70._m0);
    _14._m0[3u] = uvec2(uvec2(_70._m0, _70._m1));
}


