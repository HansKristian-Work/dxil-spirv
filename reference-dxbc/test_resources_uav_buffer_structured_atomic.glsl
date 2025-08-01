GLSL:
#version 460

layout(set = 0, binding = 0, std430) buffer SSBO
{
    uint _m0[];
} _9;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _28 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 0u);
    uint _36 = atomicExchange(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _28 + 10u);
    uint _42 = atomicCompSwap(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 10u, _36);
    uint _47 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _42);
    uint _52 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], -_47);
    uint _57 = atomicMin(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _52);
    uint _62 = atomicMax(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _57);
    uint _67 = atomicMin(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _62);
    uint _72 = atomicMax(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _67);
    uint _77 = atomicAnd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _72);
    uint _82 = atomicOr(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _77);
    uint _87 = atomicXor(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _82);
    uint _92 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], 1u);
    uint _97 = atomicAdd(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], -1u);
    atomicExchange(_9._m0[(BUFFER_ADDRESS.x * 20u) + BUFFER_ADDRESS.y], _97);
}


