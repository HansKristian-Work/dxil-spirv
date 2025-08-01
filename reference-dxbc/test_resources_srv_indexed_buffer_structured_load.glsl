GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uvec2 SV_TARGET_1;
layout(location = 2) out uvec4 SV_TARGET_2;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uint _41 = (BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y;
    uvec2 _48 = uvec2(_10[nonuniformEXT(BUFFER_INDEX)]._m0[_41], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_41 + 1u]);
    uint _56 = 143u + 1u;
    uvec2 _58 = uvec2(_10[nonuniformEXT(BUFFER_INDEX)]._m0[143u], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_56]);
    SV_TARGET.x = _48.x;
    SV_TARGET.y = _48.y;
    SV_TARGET_1.x = _58.x;
    SV_TARGET_1.y = _58.y;
    uint _70 = 331u + 1u;
    uint _73 = 331u + 2u;
    uint _77 = 331u + 3u;
    uvec4 _79 = uvec4(_10[nonuniformEXT(BUFFER_INDEX)]._m0[331u], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_70], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_73], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_77]);
    SV_TARGET_2.x = _79.x;
    SV_TARGET_2.y = _79.y;
    SV_TARGET_2.z = _79.z;
    SV_TARGET_2.w = _79.w;
    SV_TARGET_3 = _10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y];
}


