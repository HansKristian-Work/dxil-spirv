#version 460
#extension GL_EXT_buffer_reference : require
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
bool discard_state;

void descriptor_qa_report_fault(uint fault_type, uint heap_offset, uint cookie, uint heap_index, uint descriptor_type, uint actual_descriptor_type, uint instruction)
{
    uint _61 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_61 == 0u)
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
    uint _95 = QAHeapData.descriptor_count;
    uint _97 = QAHeapData.heap_index;
    uvec2 _99 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _107 = QAGlobalData.live_status_table[_99.x >> 5u];
    uint _118 = (uint(heap_offset >= _95) | (((_99.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_107 & (1u << (_99.x & 31u))) != 0u) ? 0u : 4u);
    if (_118 != 0u)
    {
        descriptor_qa_report_fault(_118, heap_offset, _99.x, _97, descriptor_type_mask, _99.y, instruction);
        return _95;
    }
    return heap_offset;
}

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    if (UV.x < 0.0)
    {
        discard_state = true;
    }
    uint _42 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _133 = texture(sampler2D(_13[_42], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _133.x;
    SV_Target.y = _133.y;
    SV_Target.z = _133.z;
    SV_Target.w = _133.w;
    discard_exit();
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
OpEntryPoint Fragment %3 "main" %20 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %23 "SV_Target"
OpName %35 "discard_state"
OpName %45 "DescriptorHeapGlobalQAData"
OpMemberName %45 0 "failed_shader_hash"
OpMemberName %45 1 "failed_offset"
OpMemberName %45 2 "failed_heap"
OpMemberName %45 3 "failed_cookie"
OpMemberName %45 4 "fault_atomic"
OpMemberName %45 5 "failed_instruction"
OpMemberName %45 6 "failed_descriptor_type_mask"
OpMemberName %45 7 "actual_descriptor_type_mask"
OpMemberName %45 8 "fault_type"
OpMemberName %45 9 "live_status_table"
OpName %47 "QAGlobalData"
OpName %56 "descriptor_qa_report_fault"
OpName %49 "fault_type"
OpName %50 "heap_offset"
OpName %51 "cookie"
OpName %52 "heap_index"
OpName %53 "descriptor_type"
OpName %54 "actual_descriptor_type"
OpName %55 "instruction"
OpName %85 "DescriptorHeapQAData"
OpMemberName %85 0 "descriptor_count"
OpMemberName %85 1 "heap_index"
OpMemberName %85 2 "cookies_descriptor_info"
OpName %87 "QAHeapData"
OpName %92 "descriptor_qa_check"
OpName %89 "heap_offset"
OpName %90 "descriptor_type_mask"
OpName %91 "instruction"
OpName %148 "discard_exit"
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
OpDecorate %44 ArrayStride 4
OpMemberDecorate %45 0 Offset 0
OpMemberDecorate %45 1 Offset 8
OpMemberDecorate %45 2 Offset 12
OpMemberDecorate %45 3 Offset 16
OpMemberDecorate %45 4 Offset 20
OpMemberDecorate %45 5 Offset 24
OpMemberDecorate %45 6 Offset 28
OpMemberDecorate %45 7 Offset 32
OpMemberDecorate %45 8 Offset 36
OpMemberDecorate %45 9 Offset 40
OpDecorate %45 Block
OpDecorate %47 DescriptorSet 10
OpDecorate %47 Binding 10
OpDecorate %84 ArrayStride 8
OpMemberDecorate %85 0 Offset 0
OpMemberDecorate %85 1 Offset 4
OpMemberDecorate %85 2 Offset 8
OpDecorate %85 Block
OpDecorate %87 DescriptorSet 10
OpDecorate %87 Binding 11
OpDecorate %87 NonWritable
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
%34 = OpTypePointer Private %31
%35 = OpVariable %34 Private
%36 = OpConstantFalse %31
%37 = OpTypePointer UniformConstant %10
%39 = OpTypePointer PushConstant %5
%43 = OpTypeVector %5 2
%44 = OpTypeRuntimeArray %5
%45 = OpTypeStruct %43 %5 %5 %5 %5 %5 %5 %5 %5 %44
%46 = OpTypePointer StorageBuffer %45
%47 = OpVariable %46 StorageBuffer
%48 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%58 = OpTypePointer StorageBuffer %5
%60 = OpConstant %5 4
%66 = OpConstant %5 3
%69 = OpConstant %5 2
%71 = OpConstant %5 6
%73 = OpConstant %5 7
%75 = OpConstant %5 5
%76 = OpConstant %5 3735928559
%77 = OpConstantComposite %43 %76 %26
%78 = OpTypePointer StorageBuffer %43
%80 = OpConstant %5 72
%82 = OpConstant %5 8
%84 = OpTypeRuntimeArray %43
%85 = OpTypeStruct %5 %5 %84
%86 = OpTypePointer StorageBuffer %85
%87 = OpVariable %86 StorageBuffer
%88 = OpTypeFunction %5 %5 %5 %5
%104 = OpConstant %5 31
%106 = OpConstant %5 9
%126 = OpTypePointer UniformConstant %14
%131 = OpTypeSampledImage %10
%139 = OpTypePointer Output %9
%147 = OpConstantTrue %31
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %35 %36
OpBranch %144
%144 = OpLabel
%25 = OpAccessChain %24 %20 %26
%27 = OpLoad %9 %25
%28 = OpAccessChain %24 %20 %29
%30 = OpLoad %9 %28
%32 = OpFOrdLessThan %31 %27 %33
OpSelectionMerge %146 None
OpBranchConditional %32 %145 %146
%145 = OpLabel
OpStore %35 %147
OpBranch %146
%146 = OpLabel
%40 = OpAccessChain %39 %8 %26
%41 = OpLoad %5 %40
%42 = OpFunctionCall %5 %92 %41 %29 %29
%38 = OpAccessChain %37 %13 %42
%125 = OpLoad %10 %38
%128 = OpAccessChain %39 %8 %69
%129 = OpLoad %5 %128
%127 = OpAccessChain %126 %17 %129
%130 = OpLoad %14 %127
%132 = OpSampledImage %131 %125 %130
%134 = OpCompositeConstruct %18 %27 %30
%133 = OpImageSampleImplicitLod %21 %132 %134 None
%135 = OpCompositeExtract %9 %133 0
%136 = OpCompositeExtract %9 %133 1
%137 = OpCompositeExtract %9 %133 2
%138 = OpCompositeExtract %9 %133 3
%140 = OpAccessChain %139 %23 %26
OpStore %140 %135
%141 = OpAccessChain %139 %23 %29
OpStore %141 %136
%142 = OpAccessChain %139 %23 %69
OpStore %142 %137
%143 = OpAccessChain %139 %23 %66
OpStore %143 %138
%154 = OpFunctionCall %1 %148
OpReturn
OpFunctionEnd
%56 = OpFunction %1 None %48
%49 = OpFunctionParameter %5
%50 = OpFunctionParameter %5
%51 = OpFunctionParameter %5
%52 = OpFunctionParameter %5
%53 = OpFunctionParameter %5
%54 = OpFunctionParameter %5
%55 = OpFunctionParameter %5
%57 = OpLabel
%59 = OpAccessChain %58 %47 %60
%61 = OpAtomicIAdd %5 %59 %29 %26 %29
%62 = OpIEqual %31 %61 %26
OpSelectionMerge %64 None
OpBranchConditional %62 %63 %64
%63 = OpLabel
%65 = OpAccessChain %58 %47 %66
OpStore %65 %51
%67 = OpAccessChain %58 %47 %29
OpStore %67 %50
%68 = OpAccessChain %58 %47 %69
OpStore %68 %52
%70 = OpAccessChain %58 %47 %71
OpStore %70 %53
%72 = OpAccessChain %58 %47 %73
OpStore %72 %54
%74 = OpAccessChain %58 %47 %75
OpStore %74 %55
%79 = OpAccessChain %78 %47 %26
OpStore %79 %77
OpMemoryBarrier %29 %80
%81 = OpAccessChain %58 %47 %82
OpStore %81 %49
OpBranch %64
%64 = OpLabel
OpReturn
OpFunctionEnd
%92 = OpFunction %5 None %88
%89 = OpFunctionParameter %5
%90 = OpFunctionParameter %5
%91 = OpFunctionParameter %5
%93 = OpLabel
%94 = OpAccessChain %58 %87 %26
%95 = OpLoad %5 %94
%96 = OpAccessChain %58 %87 %29
%97 = OpLoad %5 %96
%98 = OpAccessChain %78 %87 %69 %89
%99 = OpLoad %43 %98
%100 = OpCompositeExtract %5 %99 0
%102 = OpShiftRightLogical %5 %100 %75
%103 = OpBitwiseAnd %5 %100 %104
%101 = OpCompositeExtract %5 %99 1
%105 = OpAccessChain %58 %47 %106 %102
%107 = OpLoad %5 %105
%108 = OpShiftLeftLogical %5 %29 %103
%109 = OpBitwiseAnd %5 %107 %108
%110 = OpINotEqual %31 %109 %26
%111 = OpBitwiseAnd %5 %101 %90
%112 = OpIEqual %31 %111 %90
%113 = OpUGreaterThanEqual %31 %89 %95
%114 = OpSelect %5 %113 %29 %26
%115 = OpSelect %5 %112 %26 %69
%116 = OpSelect %5 %110 %26 %60
%117 = OpBitwiseOr %5 %114 %115
%118 = OpBitwiseOr %5 %117 %116
%119 = OpINotEqual %31 %118 %26
OpSelectionMerge %121 None
OpBranchConditional %119 %120 %121
%120 = OpLabel
%122 = OpFunctionCall %1 %56 %118 %89 %100 %97 %90 %101 %91
OpReturnValue %95
%121 = OpLabel
OpReturnValue %89
OpFunctionEnd
%148 = OpFunction %1 None %2
%149 = OpLabel
%152 = OpLoad %31 %35
OpSelectionMerge %151 None
OpBranchConditional %152 %150 %151
%150 = OpLabel
OpKill
%151 = OpLabel
OpReturn
OpFunctionEnd
#endif
