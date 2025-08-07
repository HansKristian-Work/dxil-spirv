GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uint _m0[];
} _10[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _33 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 0u);
    uint _41 = atomicExchange(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _33 + 10u);
    uint _47 = atomicCompSwap(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 10u, _41);
    uint _52 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _47);
    uint _57 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], -_52);
    uint _62 = atomicMin(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _57);
    uint _67 = atomicMax(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _62);
    uint _72 = atomicMin(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _67);
    uint _77 = atomicMax(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _72);
    uint _82 = atomicAnd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _77);
    uint _87 = atomicOr(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _82);
    uint _92 = atomicXor(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _87);
    uint _97 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 1u);
    uint _102 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], -1u);
    atomicExchange(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _102);
    uint _111 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 1u);
    uint _116 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], -2u);
}


