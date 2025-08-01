GLSL:
#version 460

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _29 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 0u);
    uint _38 = atomicExchange(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _29 + 10u);
    uint _45 = atomicCompSwap(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 10u, _38);
    uint _51 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _45);
    uint _57 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], -_51);
    uint _63 = atomicMin(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _57);
    uint _69 = atomicMax(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _63);
    uint _75 = atomicMin(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _69);
    uint _81 = atomicMax(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _75);
    uint _87 = atomicAnd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _81);
    uint _93 = atomicOr(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _87);
    uint _99 = atomicXor(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _93);
    uint _105 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], 1u);
    uint _112 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], -1u);
    atomicExchange(_9._m0[(BUFFER_ADDRESS.x * 4u) + 2u], _112);
}


