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
    uint _51 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_51 == 0u)
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
    uint _32 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _140 = texture(sampler2D(_13[_32], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _140.x;
    SV_Target.y = _140.y;
    SV_Target.z = _140.z;
    SV_Target.w = _140.w;
    gl_FragDepth = 0.5;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 153
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %20 %23 %25
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DepthReplacing
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %23 "SV_Target"
OpName %25 "SV_Depth"
OpName %35 "DescriptorHeapGlobalQAData"
OpMemberName %35 0 "failed_shader_hash"
OpMemberName %35 1 "failed_offset"
OpMemberName %35 2 "failed_heap"
OpMemberName %35 3 "failed_cookie"
OpMemberName %35 4 "fault_atomic"
OpMemberName %35 5 "failed_instruction"
OpMemberName %35 6 "failed_descriptor_type_mask"
OpMemberName %35 7 "actual_descriptor_type_mask"
OpMemberName %35 8 "fault_type"
OpMemberName %35 9 "va_map_timestamp"
OpMemberName %35 10 "live_status_table"
OpName %37 "QAGlobalData"
OpName %46 "descriptor_qa_report_fault"
OpName %39 "fault_type"
OpName %40 "heap_offset"
OpName %41 "cookie"
OpName %42 "heap_index"
OpName %43 "descriptor_type"
OpName %44 "actual_descriptor_type"
OpName %45 "instruction"
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
OpDecorate %25 BuiltIn FragDepth
OpDecorate %34 ArrayStride 4
OpMemberDecorate %35 0 Offset 0
OpMemberDecorate %35 1 Offset 8
OpMemberDecorate %35 2 Offset 12
OpMemberDecorate %35 3 Offset 16
OpMemberDecorate %35 4 Offset 20
OpMemberDecorate %35 5 Offset 24
OpMemberDecorate %35 6 Offset 28
OpMemberDecorate %35 7 Offset 32
OpMemberDecorate %35 8 Offset 36
OpMemberDecorate %35 9 Offset 40
OpMemberDecorate %35 10 Offset 44
OpDecorate %35 Block
OpDecorate %37 DescriptorSet 10
OpDecorate %37 Binding 10
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
%24 = OpTypePointer Output %9
%25 = OpVariable %24 Output
%26 = OpTypePointer UniformConstant %10
%28 = OpTypePointer PushConstant %5
%30 = OpConstant %5 0
%33 = OpTypeVector %5 2
%34 = OpTypeRuntimeArray %5
%35 = OpTypeStruct %33 %5 %5 %5 %5 %5 %5 %5 %5 %5 %34
%36 = OpTypePointer StorageBuffer %35
%37 = OpVariable %36 StorageBuffer
%38 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%48 = OpTypePointer StorageBuffer %5
%50 = OpConstant %5 4
%52 = OpConstant %5 1
%53 = OpTypeBool
%58 = OpConstant %5 3
%61 = OpConstant %5 2
%63 = OpConstant %5 6
%65 = OpConstant %5 7
%67 = OpConstant %5 5
%68 = OpConstant %5 3735928559
%69 = OpConstantComposite %33 %68 %30
%70 = OpTypePointer StorageBuffer %33
%72 = OpConstant %5 72
%74 = OpConstant %5 8
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
%127 = OpTypePointer UniformConstant %14
%132 = OpTypePointer Input %9
%137 = OpTypeSampledImage %10
%139 = OpConstant %9 0
%150 = OpConstant %9 0.5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %151
%151 = OpLabel
%29 = OpAccessChain %28 %8 %30
%31 = OpLoad %5 %29
%32 = OpFunctionCall %5 %85 %31 %52 %52
%27 = OpAccessChain %26 %13 %32
%126 = OpLoad %10 %27
%129 = OpAccessChain %28 %8 %61
%130 = OpLoad %5 %129
%128 = OpAccessChain %127 %17 %130
%131 = OpLoad %14 %128
%133 = OpAccessChain %132 %20 %30
%134 = OpLoad %9 %133
%135 = OpAccessChain %132 %20 %52
%136 = OpLoad %9 %135
%138 = OpSampledImage %137 %126 %131
%141 = OpCompositeConstruct %18 %134 %136
%140 = OpImageSampleImplicitLod %21 %138 %141 None
%142 = OpCompositeExtract %9 %140 0
%143 = OpCompositeExtract %9 %140 1
%144 = OpCompositeExtract %9 %140 2
%145 = OpCompositeExtract %9 %140 3
%146 = OpAccessChain %24 %23 %30
OpStore %146 %142
%147 = OpAccessChain %24 %23 %52
OpStore %147 %143
%148 = OpAccessChain %24 %23 %61
OpStore %148 %144
%149 = OpAccessChain %24 %23 %58
OpStore %149 %145
OpStore %25 %150
OpReturn
OpFunctionEnd
%46 = OpFunction %1 None %38
%39 = OpFunctionParameter %5
%40 = OpFunctionParameter %5
%41 = OpFunctionParameter %5
%42 = OpFunctionParameter %5
%43 = OpFunctionParameter %5
%44 = OpFunctionParameter %5
%45 = OpFunctionParameter %5
%47 = OpLabel
%49 = OpAccessChain %48 %37 %50
%51 = OpAtomicIAdd %5 %49 %52 %30 %52
%54 = OpIEqual %53 %51 %30
OpSelectionMerge %56 None
OpBranchConditional %54 %55 %56
%55 = OpLabel
%57 = OpAccessChain %48 %37 %58
OpStore %57 %41
%59 = OpAccessChain %48 %37 %52
OpStore %59 %40
%60 = OpAccessChain %48 %37 %61
OpStore %60 %42
%62 = OpAccessChain %48 %37 %63
OpStore %62 %43
%64 = OpAccessChain %48 %37 %65
OpStore %64 %44
%66 = OpAccessChain %48 %37 %67
OpStore %66 %45
%71 = OpAccessChain %70 %37 %30
OpStore %71 %69
OpMemoryBarrier %52 %72
%73 = OpAccessChain %48 %37 %74
OpStore %73 %39
OpBranch %56
%56 = OpLabel
OpReturn
OpFunctionEnd
%85 = OpFunction %5 None %81
%82 = OpFunctionParameter %5
%83 = OpFunctionParameter %5
%84 = OpFunctionParameter %5
%86 = OpLabel
%87 = OpAccessChain %48 %80 %30
%88 = OpLoad %5 %87
%89 = OpAccessChain %48 %80 %52
%90 = OpLoad %5 %89
%91 = OpAccessChain %48 %37 %92
%93 = OpLoad %5 %91
%95 = OpAccessChain %94 %80 %61 %82
%96 = OpLoad %76 %95
%97 = OpCompositeExtract %5 %96 0
%98 = OpCompositeExtract %5 %96 1
%99 = OpCompositeExtract %5 %96 2
%100 = OpShiftRightLogical %5 %97 %67
%101 = OpBitwiseAnd %5 %97 %102
%103 = OpAccessChain %48 %37 %104 %100
%105 = OpLoad %5 %103
%106 = OpShiftLeftLogical %5 %52 %101
%107 = OpBitwiseAnd %5 %105 %106
%108 = OpINotEqual %53 %107 %30
%109 = OpBitwiseAnd %5 %99 %83
%110 = OpIEqual %53 %109 %83
%111 = OpUGreaterThanEqual %53 %82 %88
%112 = OpSelect %5 %111 %52 %30
%113 = OpSelect %5 %110 %30 %61
%114 = OpSelect %5 %108 %30 %50
%115 = OpUGreaterThanEqual %53 %93 %98
%116 = OpSelect %5 %115 %30 %74
%117 = OpBitwiseOr %5 %112 %113
%118 = OpBitwiseOr %5 %117 %114
%119 = OpBitwiseOr %5 %118 %116
%120 = OpINotEqual %53 %119 %30
OpSelectionMerge %122 None
OpBranchConditional %120 %121 %122
%121 = OpLabel
%123 = OpFunctionCall %1 %46 %119 %82 %97 %90 %83 %99 %84
OpReturnValue %88
%122 = OpLabel
OpReturnValue %82
OpFunctionEnd
#endif
