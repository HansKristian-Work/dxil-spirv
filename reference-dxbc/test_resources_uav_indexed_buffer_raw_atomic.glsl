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
    uint _34 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 0u);
    uint _43 = atomicExchange(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _34 + 10u);
    uint _50 = atomicCompSwap(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 10u, _43);
    uint _56 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _50);
    uint _62 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], -_56);
    uint _68 = atomicMin(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _62);
    uint _74 = atomicMax(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _68);
    uint _80 = atomicMin(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _74);
    uint _86 = atomicMax(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _80);
    uint _92 = atomicAnd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _86);
    uint _98 = atomicOr(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _92);
    uint _104 = atomicXor(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _98);
    uint _110 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 1u);
    uint _117 = atomicAdd(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], -1u);
    atomicExchange(_10[nonuniformEXT(BUFFER_INDEX)]._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _117);
}


