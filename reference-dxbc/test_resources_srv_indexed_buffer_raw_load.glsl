GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uvec2 _m0[];
} _11[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;
layout(location = 0) out uvec2 SV_TARGET;

void main()
{
    uint _33 = (BUFFER_ADDRESS.x * 2u) + 1u;
    SV_TARGET.x = _11[nonuniformEXT(BUFFER_INDEX)]._m0[_33].x;
    SV_TARGET.y = _11[nonuniformEXT(BUFFER_INDEX)]._m0[_33].y;
}


