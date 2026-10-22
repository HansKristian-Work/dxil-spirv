#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
#extension GL_EXT_demote_to_helper_invocation : require

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
    uint _58 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_58 == 0u)
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
    uint _92 = QAHeapData.descriptor_count;
    uint _94 = QAHeapData.heap_index;
    uint _97 = QAGlobalData.va_map_timestamp;
    uvec3 _100 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _109 = QAGlobalData.live_status_table[_100.x >> 5u];
    uint _123 = ((uint(heap_offset >= _92) | (((_100.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_109 & (1u << (_100.x & 31u))) != 0u) ? 0u : 4u)) | ((_97 >= _100.y) ? 0u : 8u);
    if (_123 != 0u)
    {
        descriptor_qa_report_fault(_123, heap_offset, _100.x, _94, descriptor_type_mask, _100.z, instruction);
        return _92;
    }
    return heap_offset;
}

void main()
{
    if (UV.x < 0.0)
    {
        demote;
    }
    uint _39 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _136 = texture(sampler2D(_13[_39], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _136.x;
    SV_Target.y = _136.y;
    SV_Target.z = _136.z;
    SV_Target.w = _136.w;
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
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %8 %13 %17 %20 %23 %44 %84
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %23 "SV_Target"
OpName %42 "DescriptorHeapGlobalQAData"
OpMemberName %42 0 "failed_shader_hash"
OpMemberName %42 1 "failed_offset"
OpMemberName %42 2 "failed_heap"
OpMemberName %42 3 "failed_cookie"
OpMemberName %42 4 "fault_atomic"
OpMemberName %42 5 "failed_instruction"
OpMemberName %42 6 "failed_descriptor_type_mask"
OpMemberName %42 7 "actual_descriptor_type_mask"
OpMemberName %42 8 "fault_type"
OpMemberName %42 9 "va_map_timestamp"
OpMemberName %42 10 "live_status_table"
OpName %44 "QAGlobalData"
OpName %53 "descriptor_qa_report_fault"
OpName %46 "fault_type"
OpName %47 "heap_offset"
OpName %48 "cookie"
OpName %49 "heap_index"
OpName %50 "descriptor_type"
OpName %51 "actual_descriptor_type"
OpName %52 "instruction"
OpName %82 "DescriptorHeapQAData"
OpMemberName %82 0 "descriptor_count"
OpMemberName %82 1 "heap_index"
OpMemberName %82 2 "cookies_descriptor_info"
OpName %84 "QAHeapData"
OpName %89 "descriptor_qa_check"
OpName %86 "heap_offset"
OpName %87 "descriptor_type_mask"
OpName %88 "instruction"
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
OpDecorate %41 ArrayStride 4
OpMemberDecorate %42 0 Offset 0
OpMemberDecorate %42 1 Offset 8
OpMemberDecorate %42 2 Offset 12
OpMemberDecorate %42 3 Offset 16
OpMemberDecorate %42 4 Offset 20
OpMemberDecorate %42 5 Offset 24
OpMemberDecorate %42 6 Offset 28
OpMemberDecorate %42 7 Offset 32
OpMemberDecorate %42 8 Offset 36
OpMemberDecorate %42 9 Offset 40
OpMemberDecorate %42 10 Offset 44
OpDecorate %42 Block
OpDecorate %44 DescriptorSet 10
OpDecorate %44 Binding 10
OpDecorate %81 ArrayStride 12
OpMemberDecorate %82 0 Offset 0
OpMemberDecorate %82 1 Offset 4
OpMemberDecorate %82 2 Offset 8
OpDecorate %82 Block
OpDecorate %84 DescriptorSet 10
OpDecorate %84 Binding 11
OpDecorate %84 NonWritable
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
%24 = OpTypePointer Input %9
%26 = OpConstant %5 0
%29 = OpConstant %5 1
%31 = OpTypeBool
%33 = OpConstant %9 0
%34 = OpTypePointer UniformConstant %10
%36 = OpTypePointer PushConstant %5
%40 = OpTypeVector %5 2
%41 = OpTypeRuntimeArray %5
%42 = OpTypeStruct %40 %5 %5 %5 %5 %5 %5 %5 %5 %5 %41
%43 = OpTypePointer StorageBuffer %42
%44 = OpVariable %43 StorageBuffer
%45 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%55 = OpTypePointer StorageBuffer %5
%57 = OpConstant %5 4
%63 = OpConstant %5 3
%66 = OpConstant %5 2
%68 = OpConstant %5 6
%70 = OpConstant %5 7
%72 = OpConstant %5 5
%73 = OpConstant %5 3735928559
%74 = OpConstantComposite %40 %73 %26
%75 = OpTypePointer StorageBuffer %40
%77 = OpConstant %5 72
%79 = OpConstant %5 8
%80 = OpTypeVector %5 3
%81 = OpTypeRuntimeArray %80
%82 = OpTypeStruct %5 %5 %81
%83 = OpTypePointer StorageBuffer %82
%84 = OpVariable %83 StorageBuffer
%85 = OpTypeFunction %5 %5 %5 %5
%96 = OpConstant %5 9
%98 = OpTypePointer StorageBuffer %80
%106 = OpConstant %5 31
%108 = OpConstant %5 10
%129 = OpTypePointer UniformConstant %14
%134 = OpTypeSampledImage %10
%142 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %147
%147 = OpLabel
%25 = OpAccessChain %24 %20 %26
%27 = OpLoad %9 %25
%28 = OpAccessChain %24 %20 %29
%30 = OpLoad %9 %28
%32 = OpFOrdLessThan %31 %27 %33
OpSelectionMerge %149 None
OpBranchConditional %32 %148 %149
%148 = OpLabel
OpDemoteToHelperInvocation
OpBranch %149
%149 = OpLabel
OpBranch %150
%150 = OpLabel
OpBranch %151
%151 = OpLabel
%37 = OpAccessChain %36 %8 %26
%38 = OpLoad %5 %37
%39 = OpFunctionCall %5 %89 %38 %29 %29
%35 = OpAccessChain %34 %13 %39
%128 = OpLoad %10 %35
%131 = OpAccessChain %36 %8 %66
%132 = OpLoad %5 %131
%130 = OpAccessChain %129 %17 %132
%133 = OpLoad %14 %130
%135 = OpSampledImage %134 %128 %133
%137 = OpCompositeConstruct %18 %27 %30
%136 = OpImageSampleImplicitLod %21 %135 %137 None
%138 = OpCompositeExtract %9 %136 0
%139 = OpCompositeExtract %9 %136 1
%140 = OpCompositeExtract %9 %136 2
%141 = OpCompositeExtract %9 %136 3
%143 = OpAccessChain %142 %23 %26
OpStore %143 %138
%144 = OpAccessChain %142 %23 %29
OpStore %144 %139
%145 = OpAccessChain %142 %23 %66
OpStore %145 %140
%146 = OpAccessChain %142 %23 %63
OpStore %146 %141
OpReturn
OpFunctionEnd
%53 = OpFunction %1 None %45
%46 = OpFunctionParameter %5
%47 = OpFunctionParameter %5
%48 = OpFunctionParameter %5
%49 = OpFunctionParameter %5
%50 = OpFunctionParameter %5
%51 = OpFunctionParameter %5
%52 = OpFunctionParameter %5
%54 = OpLabel
%56 = OpAccessChain %55 %44 %57
%58 = OpAtomicIAdd %5 %56 %29 %26 %29
%59 = OpIEqual %31 %58 %26
OpSelectionMerge %61 None
OpBranchConditional %59 %60 %61
%60 = OpLabel
%62 = OpAccessChain %55 %44 %63
OpStore %62 %48
%64 = OpAccessChain %55 %44 %29
OpStore %64 %47
%65 = OpAccessChain %55 %44 %66
OpStore %65 %49
%67 = OpAccessChain %55 %44 %68
OpStore %67 %50
%69 = OpAccessChain %55 %44 %70
OpStore %69 %51
%71 = OpAccessChain %55 %44 %72
OpStore %71 %52
%76 = OpAccessChain %75 %44 %26
OpStore %76 %74
OpMemoryBarrier %29 %77
%78 = OpAccessChain %55 %44 %79
OpStore %78 %46
OpBranch %61
%61 = OpLabel
OpReturn
OpFunctionEnd
%89 = OpFunction %5 None %85
%86 = OpFunctionParameter %5
%87 = OpFunctionParameter %5
%88 = OpFunctionParameter %5
%90 = OpLabel
%91 = OpAccessChain %55 %84 %26
%92 = OpLoad %5 %91
%93 = OpAccessChain %55 %84 %29
%94 = OpLoad %5 %93
%95 = OpAccessChain %55 %44 %96
%97 = OpLoad %5 %95
%99 = OpAccessChain %98 %84 %66 %86
%100 = OpLoad %80 %99
%101 = OpCompositeExtract %5 %100 0
%102 = OpCompositeExtract %5 %100 1
%103 = OpCompositeExtract %5 %100 2
%104 = OpShiftRightLogical %5 %101 %72
%105 = OpBitwiseAnd %5 %101 %106
%107 = OpAccessChain %55 %44 %108 %104
%109 = OpLoad %5 %107
%110 = OpShiftLeftLogical %5 %29 %105
%111 = OpBitwiseAnd %5 %109 %110
%112 = OpINotEqual %31 %111 %26
%113 = OpBitwiseAnd %5 %103 %87
%114 = OpIEqual %31 %113 %87
%115 = OpUGreaterThanEqual %31 %86 %92
%116 = OpSelect %5 %115 %29 %26
%117 = OpSelect %5 %114 %26 %66
%118 = OpSelect %5 %112 %26 %57
%119 = OpUGreaterThanEqual %31 %97 %102
%120 = OpSelect %5 %119 %26 %79
%121 = OpBitwiseOr %5 %116 %117
%122 = OpBitwiseOr %5 %121 %118
%123 = OpBitwiseOr %5 %122 %120
%124 = OpINotEqual %31 %123 %26
OpSelectionMerge %126 None
OpBranchConditional %124 %125 %126
%125 = OpLabel
%127 = OpFunctionCall %1 %53 %123 %86 %101 %94 %87 %103 %88
OpReturnValue %92
%126 = OpLabel
OpReturnValue %86
OpFunctionEnd
#endif
