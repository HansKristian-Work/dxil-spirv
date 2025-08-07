GLSL:
#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _19 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), 0u);
    uint _24 = imageAtomicExchange(_8, int(BUFFER_ADDRESS.x), _19 + 10u);
    uint _27 = imageAtomicCompSwap(_8, int(BUFFER_ADDRESS.x), 10u, _24);
    uint _29 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), _27);
    uint _31 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), -_29);
    uint _33 = imageAtomicMin(_8, int(BUFFER_ADDRESS.x), _31);
    uint _35 = imageAtomicMax(_8, int(BUFFER_ADDRESS.x), _33);
    uint _37 = imageAtomicMin(_8, int(BUFFER_ADDRESS.x), _35);
    uint _39 = imageAtomicMax(_8, int(BUFFER_ADDRESS.x), _37);
    uint _41 = imageAtomicAnd(_8, int(BUFFER_ADDRESS.x), _39);
    uint _43 = imageAtomicOr(_8, int(BUFFER_ADDRESS.x), _41);
    uint _45 = imageAtomicXor(_8, int(BUFFER_ADDRESS.x), _43);
    uint _47 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), 1u);
    uint _50 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), -1u);
    imageAtomicExchange(_8, int(BUFFER_ADDRESS.x), _50);
    uint _53 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), 1u);
    uint _55 = imageAtomicAdd(_8, int(BUFFER_ADDRESS.x), -2u);
}


