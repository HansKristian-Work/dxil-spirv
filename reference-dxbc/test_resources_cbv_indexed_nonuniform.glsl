GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std140) uniform _10_13
{
    vec4 _m0[8];
} _13[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_TARGET;

void main()
{
    SV_TARGET.x = _13[nonuniformEXT(INDEX)]._m0[2u].x;
    SV_TARGET.y = _13[nonuniformEXT(INDEX)]._m0[2u].y;
    SV_TARGET.z = _13[nonuniformEXT(INDEX)]._m0[2u].z;
    SV_TARGET.w = _13[nonuniformEXT(INDEX)]._m0[2u].w;
}


