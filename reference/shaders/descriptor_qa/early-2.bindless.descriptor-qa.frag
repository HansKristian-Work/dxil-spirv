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
    uint _69 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_69 == 0u)
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
    uint _103 = QAHeapData.descriptor_count;
    uint _105 = QAHeapData.heap_index;
    uvec2 _107 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _115 = QAGlobalData.live_status_table[_107.x >> 5u];
    uint _126 = (uint(heap_offset >= _103) | (((_107.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_115 & (1u << (_107.x & 31u))) != 0u) ? 0u : 4u);
    if (_126 != 0u)
    {
        descriptor_qa_report_fault(_126, heap_offset, _107.x, _105, descriptor_type_mask, _107.y, instruction);
        return _103;
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
    uint _50 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _141 = texture(sampler2D(_13[_50], _17[registers._m2]), vec2(UV.x, UV.y));
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
OpName %43 "discard_state"
OpName %53 "DescriptorHeapGlobalQAData"
OpMemberName %53 0 "failed_shader_hash"
OpMemberName %53 1 "failed_offset"
OpMemberName %53 2 "failed_heap"
OpMemberName %53 3 "failed_cookie"
OpMemberName %53 4 "fault_atomic"
OpMemberName %53 5 "failed_instruction"
OpMemberName %53 6 "failed_descriptor_type_mask"
OpMemberName %53 7 "actual_descriptor_type_mask"
OpMemberName %53 8 "fault_type"
OpMemberName %53 9 "live_status_table"
OpName %55 "QAGlobalData"
OpName %64 "descriptor_qa_report_fault"
OpName %57 "fault_type"
OpName %58 "heap_offset"
OpName %59 "cookie"
OpName %60 "heap_index"
OpName %61 "descriptor_type"
OpName %62 "actual_descriptor_type"
OpName %63 "instruction"
OpName %93 "DescriptorHeapQAData"
OpMemberName %93 0 "descriptor_count"
OpMemberName %93 1 "heap_index"
OpMemberName %93 2 "cookies_descriptor_info"
OpName %95 "QAHeapData"
OpName %100 "descriptor_qa_check"
OpName %97 "heap_offset"
OpName %98 "descriptor_type_mask"
OpName %99 "instruction"
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
OpDecorate %52 ArrayStride 4
OpMemberDecorate %53 0 Offset 0
OpMemberDecorate %53 1 Offset 8
OpMemberDecorate %53 2 Offset 12
OpMemberDecorate %53 3 Offset 16
OpMemberDecorate %53 4 Offset 20
OpMemberDecorate %53 5 Offset 24
OpMemberDecorate %53 6 Offset 28
OpMemberDecorate %53 7 Offset 32
OpMemberDecorate %53 8 Offset 36
OpMemberDecorate %53 9 Offset 40
OpDecorate %53 Block
OpDecorate %55 DescriptorSet 10
OpDecorate %55 Binding 10
OpDecorate %92 ArrayStride 8
OpMemberDecorate %93 0 Offset 0
OpMemberDecorate %93 1 Offset 4
OpMemberDecorate %93 2 Offset 8
OpDecorate %93 Block
OpDecorate %95 DescriptorSet 10
OpDecorate %95 Binding 11
OpDecorate %95 NonWritable
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
%35 = OpTypePointer Input %9
%41 = OpConstant %9 0
%42 = OpTypePointer Private %32
%43 = OpVariable %42 Private
%44 = OpConstantFalse %32
%45 = OpTypePointer UniformConstant %10
%47 = OpTypePointer PushConstant %5
%51 = OpTypeVector %5 2
%52 = OpTypeRuntimeArray %5
%53 = OpTypeStruct %51 %5 %5 %5 %5 %5 %5 %5 %5 %52
%54 = OpTypePointer StorageBuffer %53
%55 = OpVariable %54 StorageBuffer
%56 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%66 = OpTypePointer StorageBuffer %5
%68 = OpConstant %5 4
%74 = OpConstant %5 3
%77 = OpConstant %5 2
%79 = OpConstant %5 6
%81 = OpConstant %5 7
%83 = OpConstant %5 5
%84 = OpConstant %5 3735928559
%85 = OpConstantComposite %51 %84 %30
%86 = OpTypePointer StorageBuffer %51
%88 = OpConstant %5 72
%90 = OpConstant %5 8
%92 = OpTypeRuntimeArray %51
%93 = OpTypeStruct %5 %5 %92
%94 = OpTypePointer StorageBuffer %93
%95 = OpVariable %94 StorageBuffer
%96 = OpTypeFunction %5 %5 %5 %5
%112 = OpConstant %5 31
%114 = OpConstant %5 9
%134 = OpTypePointer UniformConstant %14
%139 = OpTypeSampledImage %10
%147 = OpTypePointer Output %9
%155 = OpConstantTrue %32
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %43 %44
OpBranch %152
%152 = OpLabel
%29 = OpAccessChain %28 %27 %30
%31 = OpLoad %5 %29
%33 = OpIEqual %32 %30 %31
%34 = OpSelect %5 %33 %24 %30
%36 = OpAccessChain %35 %20 %30
%37 = OpLoad %9 %36
%38 = OpAccessChain %35 %20 %24
%39 = OpLoad %9 %38
%40 = OpFOrdLessThan %32 %37 %41
OpSelectionMerge %154 None
OpBranchConditional %40 %153 %154
%153 = OpLabel
OpStore %43 %155
OpBranch %154
%154 = OpLabel
%48 = OpAccessChain %47 %8 %30
%49 = OpLoad %5 %48
%50 = OpFunctionCall %5 %100 %49 %24 %24
%46 = OpAccessChain %45 %13 %50
%133 = OpLoad %10 %46
%136 = OpAccessChain %47 %8 %77
%137 = OpLoad %5 %136
%135 = OpAccessChain %134 %17 %137
%138 = OpLoad %14 %135
%140 = OpSampledImage %139 %133 %138
%142 = OpCompositeConstruct %18 %37 %39
%141 = OpImageSampleImplicitLod %21 %140 %142 None
%143 = OpCompositeExtract %9 %141 0
%144 = OpCompositeExtract %9 %141 1
%145 = OpCompositeExtract %9 %141 2
%146 = OpCompositeExtract %9 %141 3
%148 = OpAccessChain %147 %23 %30
OpStore %148 %143
%149 = OpAccessChain %147 %23 %24
OpStore %149 %144
%150 = OpAccessChain %147 %23 %77
OpStore %150 %145
%151 = OpAccessChain %147 %23 %74
OpStore %151 %146
%162 = OpFunctionCall %1 %156
OpReturn
OpFunctionEnd
%64 = OpFunction %1 None %56
%57 = OpFunctionParameter %5
%58 = OpFunctionParameter %5
%59 = OpFunctionParameter %5
%60 = OpFunctionParameter %5
%61 = OpFunctionParameter %5
%62 = OpFunctionParameter %5
%63 = OpFunctionParameter %5
%65 = OpLabel
%67 = OpAccessChain %66 %55 %68
%69 = OpAtomicIAdd %5 %67 %24 %30 %24
%70 = OpIEqual %32 %69 %30
OpSelectionMerge %72 None
OpBranchConditional %70 %71 %72
%71 = OpLabel
%73 = OpAccessChain %66 %55 %74
OpStore %73 %59
%75 = OpAccessChain %66 %55 %24
OpStore %75 %58
%76 = OpAccessChain %66 %55 %77
OpStore %76 %60
%78 = OpAccessChain %66 %55 %79
OpStore %78 %61
%80 = OpAccessChain %66 %55 %81
OpStore %80 %62
%82 = OpAccessChain %66 %55 %83
OpStore %82 %63
%87 = OpAccessChain %86 %55 %30
OpStore %87 %85
OpMemoryBarrier %24 %88
%89 = OpAccessChain %66 %55 %90
OpStore %89 %57
OpBranch %72
%72 = OpLabel
OpReturn
OpFunctionEnd
%100 = OpFunction %5 None %96
%97 = OpFunctionParameter %5
%98 = OpFunctionParameter %5
%99 = OpFunctionParameter %5
%101 = OpLabel
%102 = OpAccessChain %66 %95 %30
%103 = OpLoad %5 %102
%104 = OpAccessChain %66 %95 %24
%105 = OpLoad %5 %104
%106 = OpAccessChain %86 %95 %77 %97
%107 = OpLoad %51 %106
%108 = OpCompositeExtract %5 %107 0
%110 = OpShiftRightLogical %5 %108 %83
%111 = OpBitwiseAnd %5 %108 %112
%109 = OpCompositeExtract %5 %107 1
%113 = OpAccessChain %66 %55 %114 %110
%115 = OpLoad %5 %113
%116 = OpShiftLeftLogical %5 %24 %111
%117 = OpBitwiseAnd %5 %115 %116
%118 = OpINotEqual %32 %117 %30
%119 = OpBitwiseAnd %5 %109 %98
%120 = OpIEqual %32 %119 %98
%121 = OpUGreaterThanEqual %32 %97 %103
%122 = OpSelect %5 %121 %24 %30
%123 = OpSelect %5 %120 %30 %77
%124 = OpSelect %5 %118 %30 %68
%125 = OpBitwiseOr %5 %122 %123
%126 = OpBitwiseOr %5 %125 %124
%127 = OpINotEqual %32 %126 %30
OpSelectionMerge %129 None
OpBranchConditional %127 %128 %129
%128 = OpLabel
%130 = OpFunctionCall %1 %64 %126 %97 %108 %105 %98 %109 %99
OpReturnValue %103
%129 = OpLabel
OpReturnValue %97
OpFunctionEnd
%156 = OpFunction %1 None %2
%157 = OpLabel
%160 = OpLoad %32 %43
OpSelectionMerge %159 None
OpBranchConditional %160 %158 %159
%158 = OpLabel
OpKill
%159 = OpLabel
OpReturn
OpFunctionEnd
#endif
