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
    uint _83 = QAHeapData.descriptor_count;
    uint _85 = QAHeapData.heap_index;
    uint _88 = QAGlobalData.va_map_timestamp;
    uvec3 _91 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _100 = QAGlobalData.live_status_table[_91.x >> 5u];
    uint _114 = ((uint(heap_offset >= _83) | (((_91.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_100 & (1u << (_91.x & 31u))) != 0u) ? 0u : 4u)) | ((_88 >= _91.y) ? 0u : 8u);
    if (_114 != 0u)
    {
        descriptor_qa_report_fault(_114, heap_offset, _91.x, _85, descriptor_type_mask, _91.z, instruction);
        return _83;
    }
    return heap_offset;
}

void main()
{
    uint _29 = descriptor_qa_check(INDEX, 1u, 1u);
    vec4 _122 = texelFetch(_9[_29], ivec2(uvec2(uint(int(UV.x)), uint(int(UV.y)))), int(0u));
    SV_Target.x = _122.x;
    SV_Target.y = _122.y;
    SV_Target.z = _122.z;
    SV_Target.w = _122.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 134
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %15 %18 %34 %75
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
OpName %73 "DescriptorHeapQAData"
OpMemberName %73 0 "descriptor_count"
OpMemberName %73 1 "heap_index"
OpMemberName %73 2 "cookies_descriptor_info"
OpName %75 "QAHeapData"
OpName %80 "descriptor_qa_check"
OpName %77 "heap_offset"
OpName %78 "descriptor_type_mask"
OpName %79 "instruction"
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
OpDecorate %72 ArrayStride 12
OpMemberDecorate %73 0 Offset 0
OpMemberDecorate %73 1 Offset 4
OpMemberDecorate %73 2 Offset 8
OpDecorate %73 Block
OpDecorate %75 DescriptorSet 10
OpDecorate %75 Binding 11
OpDecorate %75 NonWritable
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
%49 = OpConstant %10 5
%50 = OpTypeBool
%55 = OpConstant %10 3
%58 = OpConstant %10 2
%60 = OpConstant %10 6
%62 = OpConstant %10 7
%64 = OpConstant %10 3735928559
%65 = OpConstantComposite %30 %64 %21
%66 = OpTypePointer StorageBuffer %30
%68 = OpConstant %10 72
%70 = OpConstant %10 8
%71 = OpTypeVector %10 3
%72 = OpTypeRuntimeArray %71
%73 = OpTypeStruct %10 %10 %72
%74 = OpTypePointer StorageBuffer %73
%75 = OpVariable %74 StorageBuffer
%76 = OpTypeFunction %10 %10 %10 %10
%87 = OpConstant %10 9
%89 = OpTypePointer StorageBuffer %71
%97 = OpConstant %10 31
%99 = OpConstant %10 10
%128 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %133
%133 = OpLabel
%20 = OpAccessChain %19 %15 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %15 %24
%25 = OpLoad %5 %23
%26 = OpLoad %10 %12
%29 = OpFunctionCall %10 %80 %26 %24 %24
%28 = OpAccessChain %27 %9 %29
%119 = OpLoad %6 %28
%120 = OpConvertFToS %10 %22
%121 = OpConvertFToS %10 %25
%123 = OpCompositeConstruct %30 %120 %121
%122 = OpImageFetch %16 %119 %123 Lod %21
%124 = OpCompositeExtract %5 %122 0
%125 = OpCompositeExtract %5 %122 1
%126 = OpCompositeExtract %5 %122 2
%127 = OpCompositeExtract %5 %122 3
%129 = OpAccessChain %128 %18 %21
OpStore %129 %124
%130 = OpAccessChain %128 %18 %24
OpStore %130 %125
%131 = OpAccessChain %128 %18 %58
OpStore %131 %126
%132 = OpAccessChain %128 %18 %55
OpStore %132 %127
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
%48 = OpAtomicIAdd %10 %46 %49 %21 %24
%51 = OpIEqual %50 %48 %21
OpSelectionMerge %53 None
OpBranchConditional %51 %52 %53
%52 = OpLabel
%54 = OpAccessChain %45 %34 %55
OpStore %54 %38 NonPrivatePointer
%56 = OpAccessChain %45 %34 %24
OpStore %56 %37 NonPrivatePointer
%57 = OpAccessChain %45 %34 %58
OpStore %57 %39 NonPrivatePointer
%59 = OpAccessChain %45 %34 %60
OpStore %59 %40 NonPrivatePointer
%61 = OpAccessChain %45 %34 %62
OpStore %61 %41 NonPrivatePointer
%63 = OpAccessChain %45 %34 %49
OpStore %63 %42 NonPrivatePointer
%67 = OpAccessChain %66 %34 %21
OpStore %67 %65 NonPrivatePointer
OpMemoryBarrier %49 %68
%69 = OpAccessChain %45 %34 %70
OpStore %69 %36 NonPrivatePointer
OpBranch %53
%53 = OpLabel
OpReturn
OpFunctionEnd
%80 = OpFunction %10 None %76
%77 = OpFunctionParameter %10
%78 = OpFunctionParameter %10
%79 = OpFunctionParameter %10
%81 = OpLabel
%82 = OpAccessChain %45 %75 %21
%83 = OpLoad %10 %82
%84 = OpAccessChain %45 %75 %24
%85 = OpLoad %10 %84
%86 = OpAccessChain %45 %34 %87
%88 = OpLoad %10 %86
%90 = OpAccessChain %89 %75 %58 %77
%91 = OpLoad %71 %90
%92 = OpCompositeExtract %10 %91 0
%93 = OpCompositeExtract %10 %91 1
%94 = OpCompositeExtract %10 %91 2
%95 = OpShiftRightLogical %10 %92 %49
%96 = OpBitwiseAnd %10 %92 %97
%98 = OpAccessChain %45 %34 %99 %95
%100 = OpLoad %10 %98
%101 = OpShiftLeftLogical %10 %24 %96
%102 = OpBitwiseAnd %10 %100 %101
%103 = OpINotEqual %50 %102 %21
%104 = OpBitwiseAnd %10 %94 %78
%105 = OpIEqual %50 %104 %78
%106 = OpUGreaterThanEqual %50 %77 %83
%107 = OpSelect %10 %106 %24 %21
%108 = OpSelect %10 %105 %21 %58
%109 = OpSelect %10 %103 %21 %47
%110 = OpUGreaterThanEqual %50 %88 %93
%111 = OpSelect %10 %110 %21 %70
%112 = OpBitwiseOr %10 %107 %108
%113 = OpBitwiseOr %10 %112 %109
%114 = OpBitwiseOr %10 %113 %111
%115 = OpINotEqual %50 %114 %21
OpSelectionMerge %117 None
OpBranchConditional %115 %116 %117
%116 = OpLabel
%118 = OpFunctionCall %1 %43 %114 %77 %92 %85 %78 %94 %79
OpReturnValue %83
%117 = OpLabel
OpReturnValue %77
OpFunctionEnd
#endif
