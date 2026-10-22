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
    uint _88 = QAHeapData.descriptor_count;
    uint _90 = QAHeapData.heap_index;
    uint _93 = QAGlobalData.va_map_timestamp;
    uvec3 _96 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _105 = QAGlobalData.live_status_table[_96.x >> 5u];
    uint _119 = ((uint(heap_offset >= _88) | (((_96.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_105 & (1u << (_96.x & 31u))) != 0u) ? 0u : 4u)) | ((_93 >= _96.y) ? 0u : 8u);
    if (_119 != 0u)
    {
        descriptor_qa_report_fault(_119, heap_offset, _96.x, _90, descriptor_type_mask, _96.z, instruction);
        return _88;
    }
    return heap_offset;
}

void main()
{
    uint _34 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _138 = texture(sampler2D(_13[_34], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _138.x;
    SV_Target.y = _138.y;
    SV_Target.z = _138.z;
    SV_Target.w = _138.w;
    gl_SampleMask[0u] = int(3u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 152
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %8 %13 %17 %20 %23 %27 %39 %80
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
OpName %78 "DescriptorHeapQAData"
OpMemberName %78 0 "descriptor_count"
OpMemberName %78 1 "heap_index"
OpMemberName %78 2 "cookies_descriptor_info"
OpName %80 "QAHeapData"
OpName %85 "descriptor_qa_check"
OpName %82 "heap_offset"
OpName %83 "descriptor_type_mask"
OpName %84 "instruction"
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
OpDecorate %77 ArrayStride 12
OpMemberDecorate %78 0 Offset 0
OpMemberDecorate %78 1 Offset 4
OpMemberDecorate %78 2 Offset 8
OpDecorate %78 Block
OpDecorate %80 DescriptorSet 10
OpDecorate %80 Binding 11
OpDecorate %80 NonWritable
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
%76 = OpTypeVector %5 3
%77 = OpTypeRuntimeArray %76
%78 = OpTypeStruct %5 %5 %77
%79 = OpTypePointer StorageBuffer %78
%80 = OpVariable %79 StorageBuffer
%81 = OpTypeFunction %5 %5 %5 %5
%92 = OpConstant %5 9
%94 = OpTypePointer StorageBuffer %76
%102 = OpConstant %5 31
%104 = OpConstant %5 10
%125 = OpTypePointer UniformConstant %14
%130 = OpTypePointer Input %9
%135 = OpTypeSampledImage %10
%137 = OpConstant %9 0
%144 = OpTypePointer Output %9
%149 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %151
%151 = OpLabel
%31 = OpAccessChain %30 %8 %32
%33 = OpLoad %5 %31
%34 = OpFunctionCall %5 %85 %33 %24 %24
%29 = OpAccessChain %28 %13 %34
%124 = OpLoad %10 %29
%127 = OpAccessChain %30 %8 %62
%128 = OpLoad %5 %127
%126 = OpAccessChain %125 %17 %128
%129 = OpLoad %14 %126
%131 = OpAccessChain %130 %20 %32
%132 = OpLoad %9 %131
%133 = OpAccessChain %130 %20 %24
%134 = OpLoad %9 %133
%136 = OpSampledImage %135 %124 %129
%139 = OpCompositeConstruct %18 %132 %134
%138 = OpImageSampleImplicitLod %21 %136 %139 None
%140 = OpCompositeExtract %9 %138 0
%141 = OpCompositeExtract %9 %138 1
%142 = OpCompositeExtract %9 %138 2
%143 = OpCompositeExtract %9 %138 3
%145 = OpAccessChain %144 %23 %32
OpStore %145 %140
%146 = OpAccessChain %144 %23 %24
OpStore %146 %141
%147 = OpAccessChain %144 %23 %62
OpStore %147 %142
%148 = OpAccessChain %144 %23 %59
OpStore %148 %143
%150 = OpAccessChain %149 %27 %32
OpStore %150 %59
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
%85 = OpFunction %5 None %81
%82 = OpFunctionParameter %5
%83 = OpFunctionParameter %5
%84 = OpFunctionParameter %5
%86 = OpLabel
%87 = OpAccessChain %50 %80 %32
%88 = OpLoad %5 %87
%89 = OpAccessChain %50 %80 %24
%90 = OpLoad %5 %89
%91 = OpAccessChain %50 %39 %92
%93 = OpLoad %5 %91
%95 = OpAccessChain %94 %80 %62 %82
%96 = OpLoad %76 %95
%97 = OpCompositeExtract %5 %96 0
%98 = OpCompositeExtract %5 %96 1
%99 = OpCompositeExtract %5 %96 2
%100 = OpShiftRightLogical %5 %97 %68
%101 = OpBitwiseAnd %5 %97 %102
%103 = OpAccessChain %50 %39 %104 %100
%105 = OpLoad %5 %103
%106 = OpShiftLeftLogical %5 %24 %101
%107 = OpBitwiseAnd %5 %105 %106
%108 = OpINotEqual %54 %107 %32
%109 = OpBitwiseAnd %5 %99 %83
%110 = OpIEqual %54 %109 %83
%111 = OpUGreaterThanEqual %54 %82 %88
%112 = OpSelect %5 %111 %24 %32
%113 = OpSelect %5 %110 %32 %62
%114 = OpSelect %5 %108 %32 %52
%115 = OpUGreaterThanEqual %54 %93 %98
%116 = OpSelect %5 %115 %32 %75
%117 = OpBitwiseOr %5 %112 %113
%118 = OpBitwiseOr %5 %117 %114
%119 = OpBitwiseOr %5 %118 %116
%120 = OpINotEqual %54 %119 %32
OpSelectionMerge %122 None
OpBranchConditional %120 %121 %122
%121 = OpLabel
%123 = OpFunctionCall %1 %48 %119 %82 %97 %90 %83 %99 %84
OpReturnValue %88
%122 = OpLabel
OpReturnValue %82
OpFunctionEnd
#endif
