#version 460
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_samplerless_texture_functions : require
layout(early_fragment_tests) in;

layout(set = 10, binding = 10, std430) buffer DescriptorHeapGlobalQAData
{
    uvec2 failed_shader_hash;
    uint failed_offset;
    uint failed_heap;
    uint failed_cookie;
    uint fault_atomic;
    uint failed_instruction;
    uint failed_descriptor_type_mask;
    uint actual_descriptor_type_mask;
    uint fault_type;
    uint va_map_timestamp;
    uint live_status_table[];
} QAGlobalData;

layout(set = 10, binding = 11, scalar) readonly buffer DescriptorHeapQAData
{
    uint descriptor_count;
    uint heap_index;
    uvec3 cookies_descriptor_info[];
} QAHeapData;

layout(set = 0, binding = 0) uniform texture2D _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 1) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void descriptor_qa_report_fault(uint fault_type, uint heap_offset, uint cookie, uint heap_index, uint descriptor_type, uint actual_descriptor_type, uint instruction)
{
    uint _48 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_48 == 0u)
    {
        QAGlobalData.failed_cookie = cookie;
        QAGlobalData.failed_offset = heap_offset;
        QAGlobalData.failed_heap = heap_index;
        QAGlobalData.failed_descriptor_type_mask = descriptor_type;
        QAGlobalData.actual_descriptor_type_mask = actual_descriptor_type;
        QAGlobalData.failed_instruction = instruction;
        QAGlobalData.failed_shader_hash = uvec2(3735928559u, 0u);
        memoryBarrierBuffer();
        QAGlobalData.fault_type = fault_type;
    }
}

uint descriptor_qa_check(uint heap_offset, uint descriptor_type_mask, uint instruction)
{
    uint _84 = QAHeapData.descriptor_count;
    uint _86 = QAHeapData.heap_index;
    uint _89 = QAGlobalData.va_map_timestamp;
    uvec3 _92 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _101 = QAGlobalData.live_status_table[_92.x >> 5u];
    uint _115 = ((uint(heap_offset >= _84) | (((_92.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_101 & (1u << (_92.x & 31u))) != 0u) ? 0u : 4u)) | ((_89 >= _92.y) ? 0u : 8u);
    if (_115 != 0u)
    {
        descriptor_qa_report_fault(_115, heap_offset, _92.x, _86, descriptor_type_mask, _92.z, instruction);
        return _84;
    }
    return heap_offset;
}

void main()
{
    uint _29 = descriptor_qa_check(INDEX, 1u, 1u);
    vec4 _125 = texelFetch(_9[_29], ivec2(uvec2(uint(int(UV.x)), uint(int(UV.y)))), int(0u));
    SV_Target.x = _125.x;
    SV_Target.y = _125.y;
    SV_Target.z = _125.z;
    SV_Target.w = _125.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 138
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %15 %18
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpName %3 "main"
OpName %12 "INDEX"
OpName %15 "UV"
OpName %18 "SV_Target"
OpName %32 "DescriptorHeapGlobalQAData"
OpMemberName %32 0 "failed_shader_hash"
OpMemberName %32 1 "failed_offset"
OpMemberName %32 2 "failed_heap"
OpMemberName %32 3 "failed_cookie"
OpMemberName %32 4 "fault_atomic"
OpMemberName %32 5 "failed_instruction"
OpMemberName %32 6 "failed_descriptor_type_mask"
OpMemberName %32 7 "actual_descriptor_type_mask"
OpMemberName %32 8 "fault_type"
OpMemberName %32 9 "va_map_timestamp"
OpMemberName %32 10 "live_status_table"
OpName %34 "QAGlobalData"
OpName %43 "descriptor_qa_report_fault"
OpName %36 "fault_type"
OpName %37 "heap_offset"
OpName %38 "cookie"
OpName %39 "heap_index"
OpName %40 "descriptor_type"
OpName %41 "actual_descriptor_type"
OpName %42 "instruction"
OpName %74 "DescriptorHeapQAData"
OpMemberName %74 0 "descriptor_count"
OpMemberName %74 1 "heap_index"
OpMemberName %74 2 "cookies_descriptor_info"
OpName %76 "QAHeapData"
OpName %81 "descriptor_qa_check"
OpName %78 "heap_offset"
OpName %79 "descriptor_type_mask"
OpName %80 "instruction"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 1
OpDecorate %18 Location 0
OpDecorate %31 ArrayStride 4
OpMemberDecorate %32 0 Offset 0
OpMemberDecorate %32 1 Offset 8
OpMemberDecorate %32 2 Offset 12
OpMemberDecorate %32 3 Offset 16
OpMemberDecorate %32 4 Offset 20
OpMemberDecorate %32 5 Offset 24
OpMemberDecorate %32 6 Offset 28
OpMemberDecorate %32 7 Offset 32
OpMemberDecorate %32 8 Offset 36
OpMemberDecorate %32 9 Offset 40
OpMemberDecorate %32 10 Offset 44
OpDecorate %32 Block
OpDecorate %34 DescriptorSet 10
OpDecorate %34 Binding 10
OpDecorate %73 ArrayStride 12
OpMemberDecorate %74 0 Offset 0
OpMemberDecorate %74 1 Offset 4
OpMemberDecorate %74 2 Offset 8
OpDecorate %74 Block
OpDecorate %76 DescriptorSet 10
OpDecorate %76 Binding 11
OpDecorate %76 NonWritable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeVector %5 4
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %10 0
%24 = OpConstant %10 1
%27 = OpTypePointer UniformConstant %6
%30 = OpTypeVector %10 2
%31 = OpTypeRuntimeArray %10
%32 = OpTypeStruct %30 %10 %10 %10 %10 %10 %10 %10 %10 %10 %31
%33 = OpTypePointer StorageBuffer %32
%34 = OpVariable %33 StorageBuffer
%35 = OpTypeFunction %1 %10 %10 %10 %10 %10 %10 %10
%45 = OpTypePointer StorageBuffer %10
%47 = OpConstant %10 4
%49 = OpTypeBool
%54 = OpConstant %10 3
%57 = OpConstant %10 2
%59 = OpConstant %10 6
%61 = OpConstant %10 7
%63 = OpConstant %10 5
%64 = OpConstant %10 3735928559
%65 = OpConstantComposite %30 %64 %21
%66 = OpTypePointer StorageBuffer %30
%68 = OpConstant %10 72
%70 = OpConstant %10 8
%72 = OpTypeVector %10 3
%73 = OpTypeRuntimeArray %72
%74 = OpTypeStruct %10 %10 %73
%75 = OpTypePointer StorageBuffer %74
%76 = OpVariable %75 StorageBuffer
%77 = OpTypeFunction %10 %10 %10 %10
%88 = OpConstant %10 9
%90 = OpTypePointer StorageBuffer %72
%98 = OpConstant %10 31
%100 = OpConstant %10 10
%131 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %136
%136 = OpLabel
%20 = OpAccessChain %19 %15 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %15 %24
%25 = OpLoad %5 %23
%26 = OpLoad %10 %12
%29 = OpFunctionCall %10 %81 %26 %24 %24
%28 = OpAccessChain %27 %9 %29
%122 = OpLoad %6 %28
%123 = OpConvertFToS %10 %22
%124 = OpConvertFToS %10 %25
%126 = OpCompositeConstruct %30 %123 %124
%125 = OpImageFetch %16 %122 %126 Lod %21
%127 = OpCompositeExtract %5 %125 0
%128 = OpCompositeExtract %5 %125 1
%129 = OpCompositeExtract %5 %125 2
%130 = OpCompositeExtract %5 %125 3
%132 = OpAccessChain %131 %18 %21
OpStore %132 %127
%133 = OpAccessChain %131 %18 %24
OpStore %133 %128
%134 = OpAccessChain %131 %18 %57
OpStore %134 %129
%135 = OpAccessChain %131 %18 %54
OpStore %135 %130
OpReturn
OpFunctionEnd
%43 = OpFunction %1 None %35
%36 = OpFunctionParameter %10
%37 = OpFunctionParameter %10
%38 = OpFunctionParameter %10
%39 = OpFunctionParameter %10
%40 = OpFunctionParameter %10
%41 = OpFunctionParameter %10
%42 = OpFunctionParameter %10
%44 = OpLabel
%46 = OpAccessChain %45 %34 %47
%48 = OpAtomicIAdd %10 %46 %24 %21 %24
%50 = OpIEqual %49 %48 %21
OpSelectionMerge %52 None
OpBranchConditional %50 %51 %52
%51 = OpLabel
%53 = OpAccessChain %45 %34 %54
OpStore %53 %38
%55 = OpAccessChain %45 %34 %24
OpStore %55 %37
%56 = OpAccessChain %45 %34 %57
OpStore %56 %39
%58 = OpAccessChain %45 %34 %59
OpStore %58 %40
%60 = OpAccessChain %45 %34 %61
OpStore %60 %41
%62 = OpAccessChain %45 %34 %63
OpStore %62 %42
%67 = OpAccessChain %66 %34 %21
OpStore %67 %65
OpMemoryBarrier %24 %68
%69 = OpAccessChain %45 %34 %70
OpStore %69 %36
OpBranch %52
%52 = OpLabel
OpReturn
OpFunctionEnd
%81 = OpFunction %10 None %77
%78 = OpFunctionParameter %10
%79 = OpFunctionParameter %10
%80 = OpFunctionParameter %10
%82 = OpLabel
%83 = OpAccessChain %45 %76 %21
%84 = OpLoad %10 %83
%85 = OpAccessChain %45 %76 %24
%86 = OpLoad %10 %85
%87 = OpAccessChain %45 %34 %88
%89 = OpLoad %10 %87
%91 = OpAccessChain %90 %76 %57 %78
%92 = OpLoad %72 %91
%93 = OpCompositeExtract %10 %92 0
%94 = OpCompositeExtract %10 %92 1
%95 = OpCompositeExtract %10 %92 2
%96 = OpShiftRightLogical %10 %93 %63
%97 = OpBitwiseAnd %10 %93 %98
%99 = OpAccessChain %45 %34 %100 %96
%101 = OpLoad %10 %99
%102 = OpShiftLeftLogical %10 %24 %97
%103 = OpBitwiseAnd %10 %101 %102
%104 = OpINotEqual %49 %103 %21
%105 = OpBitwiseAnd %10 %95 %79
%106 = OpIEqual %49 %105 %79
%107 = OpUGreaterThanEqual %49 %78 %84
%108 = OpSelect %10 %107 %24 %21
%109 = OpSelect %10 %106 %21 %57
%110 = OpSelect %10 %104 %21 %47
%111 = OpUGreaterThanEqual %49 %89 %94
%112 = OpSelect %10 %111 %21 %70
%113 = OpBitwiseOr %10 %108 %109
%114 = OpBitwiseOr %10 %113 %110
%115 = OpBitwiseOr %10 %114 %112
%116 = OpINotEqual %49 %115 %21
OpSelectionMerge %118 None
OpBranchConditional %116 %117 %118
%117 = OpLabel
%119 = OpFunctionCall %1 %43 %115 %78 %93 %86 %79 %95 %80
OpReturnValue %84
%118 = OpLabel
OpReturnValue %78
OpFunctionEnd
#endif
