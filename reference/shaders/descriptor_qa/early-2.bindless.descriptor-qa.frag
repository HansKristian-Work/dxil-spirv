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
    uint _59 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_59 == 0u)
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
    uint _93 = QAHeapData.descriptor_count;
    uint _95 = QAHeapData.heap_index;
    uvec2 _97 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _105 = QAGlobalData.live_status_table[_97.x >> 5u];
    uint _116 = (uint(heap_offset >= _93) | (((_97.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_105 & (1u << (_97.x & 31u))) != 0u) ? 0u : 4u);
    if (_116 != 0u)
    {
        descriptor_qa_report_fault(_116, heap_offset, _97.x, _95, descriptor_type_mask, _97.y, instruction);
        return _93;
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
    uint _40 = descriptor_qa_check(registers._m0, 1u, 1u);
    if (UV.x < 0.0)
    {
        discard_state = true;
    }
    vec4 _141 = texture(sampler2D(_13[_40], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _141.x;
    SV_Target.y = _141.y;
    SV_Target.z = _141.z;
    SV_Target.w = _141.w;
    discard_exit();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 164
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
OpName %43 "DescriptorHeapGlobalQAData"
OpMemberName %43 0 "failed_shader_hash"
OpMemberName %43 1 "failed_offset"
OpMemberName %43 2 "failed_heap"
OpMemberName %43 3 "failed_cookie"
OpMemberName %43 4 "fault_atomic"
OpMemberName %43 5 "failed_instruction"
OpMemberName %43 6 "failed_descriptor_type_mask"
OpMemberName %43 7 "actual_descriptor_type_mask"
OpMemberName %43 8 "fault_type"
OpMemberName %43 9 "live_status_table"
OpName %45 "QAGlobalData"
OpName %54 "descriptor_qa_report_fault"
OpName %47 "fault_type"
OpName %48 "heap_offset"
OpName %49 "cookie"
OpName %50 "heap_index"
OpName %51 "descriptor_type"
OpName %52 "actual_descriptor_type"
OpName %53 "instruction"
OpName %83 "DescriptorHeapQAData"
OpMemberName %83 0 "descriptor_count"
OpMemberName %83 1 "heap_index"
OpMemberName %83 2 "cookies_descriptor_info"
OpName %85 "QAHeapData"
OpName %90 "descriptor_qa_check"
OpName %87 "heap_offset"
OpName %88 "descriptor_type_mask"
OpName %89 "instruction"
OpName %137 "discard_state"
OpName %156 "discard_exit"
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
OpDecorate %42 ArrayStride 4
OpMemberDecorate %43 0 Offset 0
OpMemberDecorate %43 1 Offset 8
OpMemberDecorate %43 2 Offset 12
OpMemberDecorate %43 3 Offset 16
OpMemberDecorate %43 4 Offset 20
OpMemberDecorate %43 5 Offset 24
OpMemberDecorate %43 6 Offset 28
OpMemberDecorate %43 7 Offset 32
OpMemberDecorate %43 8 Offset 36
OpMemberDecorate %43 9 Offset 40
OpDecorate %43 Block
OpDecorate %45 DescriptorSet 10
OpDecorate %45 Binding 10
OpDecorate %82 ArrayStride 8
OpMemberDecorate %83 0 Offset 0
OpMemberDecorate %83 1 Offset 4
OpMemberDecorate %83 2 Offset 8
OpDecorate %83 Block
OpDecorate %85 DescriptorSet 10
OpDecorate %85 Binding 11
OpDecorate %85 NonWritable
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
%26 = OpTypePointer Input %25
%27 = OpVariable %26 Input
%28 = OpTypePointer Input %5
%30 = OpConstant %5 0
%32 = OpTypeBool
%35 = OpTypePointer UniformConstant %10
%37 = OpTypePointer PushConstant %5
%41 = OpTypeVector %5 2
%42 = OpTypeRuntimeArray %5
%43 = OpTypeStruct %41 %5 %5 %5 %5 %5 %5 %5 %5 %42
%44 = OpTypePointer StorageBuffer %43
%45 = OpVariable %44 StorageBuffer
%46 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%56 = OpTypePointer StorageBuffer %5
%58 = OpConstant %5 4
%64 = OpConstant %5 3
%67 = OpConstant %5 2
%69 = OpConstant %5 6
%71 = OpConstant %5 7
%73 = OpConstant %5 5
%74 = OpConstant %5 3735928559
%75 = OpConstantComposite %41 %74 %30
%76 = OpTypePointer StorageBuffer %41
%78 = OpConstant %5 72
%80 = OpConstant %5 8
%82 = OpTypeRuntimeArray %41
%83 = OpTypeStruct %5 %5 %82
%84 = OpTypePointer StorageBuffer %83
%85 = OpVariable %84 StorageBuffer
%86 = OpTypeFunction %5 %5 %5 %5
%102 = OpConstant %5 31
%104 = OpConstant %5 9
%124 = OpTypePointer UniformConstant %14
%129 = OpTypePointer Input %9
%135 = OpConstant %9 0
%136 = OpTypePointer Private %32
%137 = OpVariable %136 Private
%138 = OpConstantFalse %32
%139 = OpTypeSampledImage %10
%147 = OpTypePointer Output %9
%155 = OpConstantTrue %32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %137 %138
OpBranch %152
%152 = OpLabel
%29 = OpAccessChain %28 %27 %30
%31 = OpLoad %5 %29
%33 = OpIEqual %32 %30 %31
%34 = OpSelect %5 %33 %24 %30
%38 = OpAccessChain %37 %8 %30
%39 = OpLoad %5 %38
%40 = OpFunctionCall %5 %90 %39 %24 %24
%36 = OpAccessChain %35 %13 %40
%123 = OpLoad %10 %36
%126 = OpAccessChain %37 %8 %67
%127 = OpLoad %5 %126
%125 = OpAccessChain %124 %17 %127
%128 = OpLoad %14 %125
%130 = OpAccessChain %129 %20 %30
%131 = OpLoad %9 %130
%132 = OpAccessChain %129 %20 %24
%133 = OpLoad %9 %132
%134 = OpFOrdLessThan %32 %131 %135
OpSelectionMerge %154 None
OpBranchConditional %134 %153 %154
%153 = OpLabel
OpStore %137 %155
OpBranch %154
%154 = OpLabel
%140 = OpSampledImage %139 %123 %128
%142 = OpCompositeConstruct %18 %131 %133
%141 = OpImageSampleImplicitLod %21 %140 %142 None
%143 = OpCompositeExtract %9 %141 0
%144 = OpCompositeExtract %9 %141 1
%145 = OpCompositeExtract %9 %141 2
%146 = OpCompositeExtract %9 %141 3
%148 = OpAccessChain %147 %23 %30
OpStore %148 %143
%149 = OpAccessChain %147 %23 %24
OpStore %149 %144
%150 = OpAccessChain %147 %23 %67
OpStore %150 %145
%151 = OpAccessChain %147 %23 %64
OpStore %151 %146
%162 = OpFunctionCall %1 %156
OpReturn
OpFunctionEnd
%54 = OpFunction %1 None %46
%47 = OpFunctionParameter %5
%48 = OpFunctionParameter %5
%49 = OpFunctionParameter %5
%50 = OpFunctionParameter %5
%51 = OpFunctionParameter %5
%52 = OpFunctionParameter %5
%53 = OpFunctionParameter %5
%55 = OpLabel
%57 = OpAccessChain %56 %45 %58
%59 = OpAtomicIAdd %5 %57 %24 %30 %24
%60 = OpIEqual %32 %59 %30
OpSelectionMerge %62 None
OpBranchConditional %60 %61 %62
%61 = OpLabel
%63 = OpAccessChain %56 %45 %64
OpStore %63 %49
%65 = OpAccessChain %56 %45 %24
OpStore %65 %48
%66 = OpAccessChain %56 %45 %67
OpStore %66 %50
%68 = OpAccessChain %56 %45 %69
OpStore %68 %51
%70 = OpAccessChain %56 %45 %71
OpStore %70 %52
%72 = OpAccessChain %56 %45 %73
OpStore %72 %53
%77 = OpAccessChain %76 %45 %30
OpStore %77 %75
OpMemoryBarrier %24 %78
%79 = OpAccessChain %56 %45 %80
OpStore %79 %47
OpBranch %62
%62 = OpLabel
OpReturn
OpFunctionEnd
%90 = OpFunction %5 None %86
%87 = OpFunctionParameter %5
%88 = OpFunctionParameter %5
%89 = OpFunctionParameter %5
%91 = OpLabel
%92 = OpAccessChain %56 %85 %30
%93 = OpLoad %5 %92
%94 = OpAccessChain %56 %85 %24
%95 = OpLoad %5 %94
%96 = OpAccessChain %76 %85 %67 %87
%97 = OpLoad %41 %96
%98 = OpCompositeExtract %5 %97 0
%100 = OpShiftRightLogical %5 %98 %73
%101 = OpBitwiseAnd %5 %98 %102
%99 = OpCompositeExtract %5 %97 1
%103 = OpAccessChain %56 %45 %104 %100
%105 = OpLoad %5 %103
%106 = OpShiftLeftLogical %5 %24 %101
%107 = OpBitwiseAnd %5 %105 %106
%108 = OpINotEqual %32 %107 %30
%109 = OpBitwiseAnd %5 %99 %88
%110 = OpIEqual %32 %109 %88
%111 = OpUGreaterThanEqual %32 %87 %93
%112 = OpSelect %5 %111 %24 %30
%113 = OpSelect %5 %110 %30 %67
%114 = OpSelect %5 %108 %30 %58
%115 = OpBitwiseOr %5 %112 %113
%116 = OpBitwiseOr %5 %115 %114
%117 = OpINotEqual %32 %116 %30
OpSelectionMerge %119 None
OpBranchConditional %117 %118 %119
%118 = OpLabel
%120 = OpFunctionCall %1 %54 %116 %87 %98 %95 %88 %99 %89
OpReturnValue %93
%119 = OpLabel
OpReturnValue %87
OpFunctionEnd
%156 = OpFunction %1 None %2
%157 = OpLabel
%160 = OpLoad %32 %137
OpSelectionMerge %159 None
OpBranchConditional %160 %158 %159
%158 = OpLabel
OpKill
%159 = OpLabel
OpReturn
OpFunctionEnd
#endif
