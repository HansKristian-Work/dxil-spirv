GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _10[];

layout(set = 0, binding = 0, std430) restrict readonly buffer _13_16
{
    uvec2 _m0[];
} _16[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;
layout(location = 1) out uvec2 SV_TARGET_1;
layout(location = 3) out uint SV_TARGET_3;

void main()
{
    uint _43 = (BUFFER_ADDRESS.x * 2u) + 1u;
    uint _56 = 7u + 1u;
    uvec2 _58 = uvec2(_10[nonuniformEXT(BUFFER_INDEX)]._m0[7u], _10[nonuniformEXT(BUFFER_INDEX)]._m0[_56]);
    SV_TARGET.x = _16[nonuniformEXT(BUFFER_INDEX)]._m0[_43].x;
    SV_TARGET.y = _16[nonuniformEXT(BUFFER_INDEX)]._m0[_43].y;
    SV_TARGET_1.x = _58.x;
    SV_TARGET_1.y = _58.y;
    SV_TARGET_3 = _10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u];
}


