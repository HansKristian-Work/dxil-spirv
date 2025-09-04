#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require

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

layout(push_constant, std430) uniform RootConstants
{
    uint _m0;
    uint _m1;
    uint _m2;
    uint _m3;
    uint _m4;
    uint _m5;
    uint _m6;
    uint _m7;
} registers;

layout(set = 0, binding = 0) uniform texture2D _13[];
layout(set = 2, binding = 0) uniform sampler _17[];

layout(location = 0) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void descriptor_qa_report_fault(uint fault_type, uint heap_offset, uint cookie, uint heap_index, uint descriptor_type, uint actual_descriptor_type, uint instruction)
{
    uint _53 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_53 == 0u)
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
    uint _89 = QAHeapData.descriptor_count;
    uint _91 = QAHeapData.heap_index;
    uint _94 = QAGlobalData.va_map_timestamp;
    uvec3 _97 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _106 = QAGlobalData.live_status_table[_97.x >> 5u];
    uint _120 = ((uint(heap_offset >= _89) | (((_97.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_106 & (1u << (_97.x & 31u))) != 0u) ? 0u : 4u)) | ((_94 >= _97.y) ? 0u : 8u);
    if (_120 != 0u)
    {
        descriptor_qa_report_fault(_120, heap_offset, _97.x, _91, descriptor_type_mask, _97.z, instruction);
        return _89;
    }
    return heap_offset;
}

void main()
{
    uint _34 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _141 = texture(sampler2D(_13[_34], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _141.x;
    SV_Target.y = _141.y;
    SV_Target.z = _141.z;
    SV_Target.w = _141.w;
    gl_SampleMask[0u] = int(3u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 156
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %20 %23 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %23 "SV_Target"
OpName %27 "SV_Coverage"
OpName %37 "DescriptorHeapGlobalQAData"
OpMemberName %37 0 "failed_shader_hash"
OpMemberName %37 1 "failed_offset"
OpMemberName %37 2 "failed_heap"
OpMemberName %37 3 "failed_cookie"
OpMemberName %37 4 "fault_atomic"
OpMemberName %37 5 "failed_instruction"
OpMemberName %37 6 "failed_descriptor_type_mask"
OpMemberName %37 7 "actual_descriptor_type_mask"
OpMemberName %37 8 "fault_type"
OpMemberName %37 9 "va_map_timestamp"
OpMemberName %37 10 "live_status_table"
OpName %39 "QAGlobalData"
OpName %48 "descriptor_qa_report_fault"
OpName %41 "fault_type"
OpName %42 "heap_offset"
OpName %43 "cookie"
OpName %44 "heap_index"
OpName %45 "descriptor_type"
OpName %46 "actual_descriptor_type"
OpName %47 "instruction"
OpName %79 "DescriptorHeapQAData"
OpMemberName %79 0 "descriptor_count"
OpMemberName %79 1 "heap_index"
OpMemberName %79 2 "cookies_descriptor_info"
OpName %81 "QAHeapData"
OpName %86 "descriptor_qa_check"
OpName %83 "heap_offset"
OpName %84 "descriptor_type_mask"
OpName %85 "instruction"
OpDecorate %6 Block
OpMemberDecorate %6 0 Offset 0
OpMemberDecorate %6 1 Offset 4
OpMemberDecorate %6 2 Offset 8
OpMemberDecorate %6 3 Offset 12
OpMemberDecorate %6 4 Offset 16
OpMemberDecorate %6 5 Offset 20
OpMemberDecorate %6 6 Offset 24
OpMemberDecorate %6 7 Offset 28
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %17 DescriptorSet 2
OpDecorate %17 Binding 0
OpDecorate %20 Location 0
OpDecorate %23 Location 0
OpDecorate %27 BuiltIn SampleMask
OpDecorate %36 ArrayStride 4
OpMemberDecorate %37 0 Offset 0
OpMemberDecorate %37 1 Offset 8
OpMemberDecorate %37 2 Offset 12
OpMemberDecorate %37 3 Offset 16
OpMemberDecorate %37 4 Offset 20
OpMemberDecorate %37 5 Offset 24
OpMemberDecorate %37 6 Offset 28
OpMemberDecorate %37 7 Offset 32
OpMemberDecorate %37 8 Offset 36
OpMemberDecorate %37 9 Offset 40
OpMemberDecorate %37 10 Offset 44
OpDecorate %37 Block
OpDecorate %39 DescriptorSet 10
OpDecorate %39 Binding 10
OpDecorate %78 ArrayStride 12
OpMemberDecorate %79 0 Offset 0
OpMemberDecorate %79 1 Offset 4
OpMemberDecorate %79 2 Offset 8
OpDecorate %79 Block
OpDecorate %81 DescriptorSet 10
OpDecorate %81 Binding 11
OpDecorate %81 NonWritable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeStruct %5 %5 %5 %5 %5 %5 %5 %5
%7 = OpTypePointer PushConstant %6
%8 = OpVariable %7 PushConstant
%9 = OpTypeFloat 32
%10 = OpTypeImage %9 2D 0 0 0 1 Unknown
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeSampler
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeVector %9 2
%19 = OpTypePointer Input %18
%20 = OpVariable %19 Input
%21 = OpTypeVector %9 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpConstant %5 1
%25 = OpTypeArray %5 %24
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%28 = OpTypePointer UniformConstant %10
%30 = OpTypePointer PushConstant %5
%32 = OpConstant %5 0
%35 = OpTypeVector %5 2
%36 = OpTypeRuntimeArray %5
%37 = OpTypeStruct %35 %5 %5 %5 %5 %5 %5 %5 %5 %5 %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%50 = OpTypePointer StorageBuffer %5
%52 = OpConstant %5 4
%54 = OpTypeBool
%59 = OpConstant %5 3
%62 = OpConstant %5 2
%64 = OpConstant %5 6
%66 = OpConstant %5 7
%68 = OpConstant %5 5
%69 = OpConstant %5 3735928559
%70 = OpConstantComposite %35 %69 %32
%71 = OpTypePointer StorageBuffer %35
%73 = OpConstant %5 72
%75 = OpConstant %5 8
%77 = OpTypeVector %5 3
%78 = OpTypeRuntimeArray %77
%79 = OpTypeStruct %5 %5 %78
%80 = OpTypePointer StorageBuffer %79
%81 = OpVariable %80 StorageBuffer
%82 = OpTypeFunction %5 %5 %5 %5
%93 = OpConstant %5 9
%95 = OpTypePointer StorageBuffer %77
%103 = OpConstant %5 31
%105 = OpConstant %5 10
%128 = OpTypePointer UniformConstant %14
%133 = OpTypePointer Input %9
%138 = OpTypeSampledImage %10
%140 = OpConstant %9 0
%147 = OpTypePointer Output %9
%152 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %154
%154 = OpLabel
%31 = OpAccessChain %30 %8 %32
%33 = OpLoad %5 %31
%34 = OpFunctionCall %5 %86 %33 %24 %24
%29 = OpAccessChain %28 %13 %34
%127 = OpLoad %10 %29
%130 = OpAccessChain %30 %8 %62
%131 = OpLoad %5 %130
%129 = OpAccessChain %128 %17 %131
%132 = OpLoad %14 %129
%134 = OpAccessChain %133 %20 %32
%135 = OpLoad %9 %134
%136 = OpAccessChain %133 %20 %24
%137 = OpLoad %9 %136
%139 = OpSampledImage %138 %127 %132
%142 = OpCompositeConstruct %18 %135 %137
%141 = OpImageSampleImplicitLod %21 %139 %142 None
%143 = OpCompositeExtract %9 %141 0
%144 = OpCompositeExtract %9 %141 1
%145 = OpCompositeExtract %9 %141 2
%146 = OpCompositeExtract %9 %141 3
%148 = OpAccessChain %147 %23 %32
OpStore %148 %143
%149 = OpAccessChain %147 %23 %24
OpStore %149 %144
%150 = OpAccessChain %147 %23 %62
OpStore %150 %145
%151 = OpAccessChain %147 %23 %59
OpStore %151 %146
%153 = OpAccessChain %152 %27 %32
OpStore %153 %59
OpReturn
OpFunctionEnd
%48 = OpFunction %1 None %40
%41 = OpFunctionParameter %5
%42 = OpFunctionParameter %5
%43 = OpFunctionParameter %5
%44 = OpFunctionParameter %5
%45 = OpFunctionParameter %5
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %5
%49 = OpLabel
%51 = OpAccessChain %50 %39 %52
%53 = OpAtomicIAdd %5 %51 %24 %32 %24
%55 = OpIEqual %54 %53 %32
OpSelectionMerge %57 None
OpBranchConditional %55 %56 %57
%56 = OpLabel
%58 = OpAccessChain %50 %39 %59
OpStore %58 %43
%60 = OpAccessChain %50 %39 %24
OpStore %60 %42
%61 = OpAccessChain %50 %39 %62
OpStore %61 %44
%63 = OpAccessChain %50 %39 %64
OpStore %63 %45
%65 = OpAccessChain %50 %39 %66
OpStore %65 %46
%67 = OpAccessChain %50 %39 %68
OpStore %67 %47
%72 = OpAccessChain %71 %39 %32
OpStore %72 %70
OpMemoryBarrier %24 %73
%74 = OpAccessChain %50 %39 %75
OpStore %74 %41
OpBranch %57
%57 = OpLabel
OpReturn
OpFunctionEnd
%86 = OpFunction %5 None %82
%83 = OpFunctionParameter %5
%84 = OpFunctionParameter %5
%85 = OpFunctionParameter %5
%87 = OpLabel
%88 = OpAccessChain %50 %81 %32
%89 = OpLoad %5 %88
%90 = OpAccessChain %50 %81 %24
%91 = OpLoad %5 %90
%92 = OpAccessChain %50 %39 %93
%94 = OpLoad %5 %92
%96 = OpAccessChain %95 %81 %62 %83
%97 = OpLoad %77 %96
%98 = OpCompositeExtract %5 %97 0
%99 = OpCompositeExtract %5 %97 1
%100 = OpCompositeExtract %5 %97 2
%101 = OpShiftRightLogical %5 %98 %68
%102 = OpBitwiseAnd %5 %98 %103
%104 = OpAccessChain %50 %39 %105 %101
%106 = OpLoad %5 %104
%107 = OpShiftLeftLogical %5 %24 %102
%108 = OpBitwiseAnd %5 %106 %107
%109 = OpINotEqual %54 %108 %32
%110 = OpBitwiseAnd %5 %100 %84
%111 = OpIEqual %54 %110 %84
%112 = OpUGreaterThanEqual %54 %83 %89
%113 = OpSelect %5 %112 %24 %32
%114 = OpSelect %5 %111 %32 %62
%115 = OpSelect %5 %109 %32 %52
%116 = OpUGreaterThanEqual %54 %94 %99
%117 = OpSelect %5 %116 %32 %75
%118 = OpBitwiseOr %5 %113 %114
%119 = OpBitwiseOr %5 %118 %115
%120 = OpBitwiseOr %5 %119 %117
%121 = OpINotEqual %54 %120 %32
OpSelectionMerge %123 None
OpBranchConditional %121 %122 %123
%122 = OpLabel
%124 = OpFunctionCall %1 %48 %120 %83 %98 %91 %84 %100 %85
OpReturnValue %89
%123 = OpLabel
OpReturnValue %83
OpFunctionEnd
#endif
