#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require

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
    uint live_status_table[];
} QAGlobalData;

layout(set = 10, binding = 11, std430) readonly buffer DescriptorHeapQAData
{
    uint descriptor_count;
    uint heap_index;
    uvec2 cookies_descriptor_info[];
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
    uvec2 _92 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _100 = QAGlobalData.live_status_table[_92.x >> 5u];
    uint _111 = (uint(heap_offset >= _88) | (((_92.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_100 & (1u << (_92.x & 31u))) != 0u) ? 0u : 4u);
    if (_111 != 0u)
    {
        descriptor_qa_report_fault(_111, heap_offset, _92.x, _90, descriptor_type_mask, _92.y, instruction);
        return _88;
    }
    return heap_offset;
}

void main()
{
    uint _34 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _132 = texture(sampler2D(_13[_34], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _132.x;
    SV_Target.y = _132.y;
    SV_Target.z = _132.z;
    SV_Target.w = _132.w;
    gl_SampleMask[0u] = int(3u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 147
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
OpMemberName %37 9 "live_status_table"
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
OpDecorate %37 Block
OpDecorate %39 DescriptorSet 10
OpDecorate %39 Binding 10
OpDecorate %77 ArrayStride 8
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
%37 = OpTypeStruct %35 %5 %5 %5 %5 %5 %5 %5 %5 %36
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
%77 = OpTypeRuntimeArray %35
%78 = OpTypeStruct %5 %5 %77
%79 = OpTypePointer StorageBuffer %78
%80 = OpVariable %79 StorageBuffer
%81 = OpTypeFunction %5 %5 %5 %5
%97 = OpConstant %5 31
%99 = OpConstant %5 9
%119 = OpTypePointer UniformConstant %14
%124 = OpTypePointer Input %9
%129 = OpTypeSampledImage %10
%131 = OpConstant %9 0
%138 = OpTypePointer Output %9
%143 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %145
%145 = OpLabel
%31 = OpAccessChain %30 %8 %32
%33 = OpLoad %5 %31
%34 = OpFunctionCall %5 %85 %33 %24 %24
%29 = OpAccessChain %28 %13 %34
%118 = OpLoad %10 %29
%121 = OpAccessChain %30 %8 %62
%122 = OpLoad %5 %121
%120 = OpAccessChain %119 %17 %122
%123 = OpLoad %14 %120
%125 = OpAccessChain %124 %20 %32
%126 = OpLoad %9 %125
%127 = OpAccessChain %124 %20 %24
%128 = OpLoad %9 %127
%130 = OpSampledImage %129 %118 %123
%133 = OpCompositeConstruct %18 %126 %128
%132 = OpImageSampleImplicitLod %21 %130 %133 None
%134 = OpCompositeExtract %9 %132 0
%135 = OpCompositeExtract %9 %132 1
%136 = OpCompositeExtract %9 %132 2
%137 = OpCompositeExtract %9 %132 3
%139 = OpAccessChain %138 %23 %32
OpStore %139 %134
%140 = OpAccessChain %138 %23 %24
OpStore %140 %135
%141 = OpAccessChain %138 %23 %62
OpStore %141 %136
%142 = OpAccessChain %138 %23 %59
OpStore %142 %137
%144 = OpAccessChain %143 %27 %32
OpStore %144 %59
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
%91 = OpAccessChain %71 %80 %62 %82
%92 = OpLoad %35 %91
%93 = OpCompositeExtract %5 %92 0
%95 = OpShiftRightLogical %5 %93 %68
%96 = OpBitwiseAnd %5 %93 %97
%94 = OpCompositeExtract %5 %92 1
%98 = OpAccessChain %50 %39 %99 %95
%100 = OpLoad %5 %98
%101 = OpShiftLeftLogical %5 %24 %96
%102 = OpBitwiseAnd %5 %100 %101
%103 = OpINotEqual %54 %102 %32
%104 = OpBitwiseAnd %5 %94 %83
%105 = OpIEqual %54 %104 %83
%106 = OpUGreaterThanEqual %54 %82 %88
%107 = OpSelect %5 %106 %24 %32
%108 = OpSelect %5 %105 %32 %62
%109 = OpSelect %5 %103 %32 %52
%110 = OpBitwiseOr %5 %107 %108
%111 = OpBitwiseOr %5 %110 %109
%112 = OpINotEqual %54 %111 %32
OpSelectionMerge %114 None
OpBranchConditional %112 %113 %114
%113 = OpLabel
%115 = OpFunctionCall %1 %48 %111 %82 %93 %90 %83 %94 %84
OpReturnValue %88
%114 = OpLabel
OpReturnValue %82
OpFunctionEnd
#endif
