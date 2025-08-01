GLSL:
#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _9[];

layout(location = 0, component = 2) flat in uint BUFFER_INDEX;
layout(location = 0) flat in uvec2 BUFFER_ADDRESS;

void main()
{
    uint _24 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), 0u);
    uint _29 = imageAtomicExchange(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _24 + 10u);
    uint _32 = imageAtomicCompSwap(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), 10u, _29);
    uint _34 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _32);
    uint _36 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), -_34);
    uint _38 = imageAtomicMin(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _36);
    uint _40 = imageAtomicMax(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _38);
    uint _42 = imageAtomicMin(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _40);
    uint _44 = imageAtomicMax(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _42);
    uint _46 = imageAtomicAnd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _44);
    uint _48 = imageAtomicOr(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _46);
    uint _50 = imageAtomicXor(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _48);
    uint _52 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), 1u);
    uint _55 = imageAtomicAdd(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), -1u);
    imageAtomicExchange(_9[nonuniformEXT(BUFFER_INDEX)], int(BUFFER_ADDRESS.x), _55);
}


