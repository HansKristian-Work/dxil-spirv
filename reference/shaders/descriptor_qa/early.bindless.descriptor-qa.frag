#version 460
#extension GL_EXT_buffer_reference : require
#extension GL_EXT_nonuniform_qualifier : require
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
    uint _49 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_49 == 0u)
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
    uint _85 = QAHeapData.descriptor_count;
    uint _87 = QAHeapData.heap_index;
    uvec2 _89 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _97 = QAGlobalData.live_status_table[_89.x >> 5u];
    uint _108 = (uint(heap_offset >= _85) | (((_89.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_97 & (1u << (_89.x & 31u))) != 0u) ? 0u : 4u);
    if (_108 != 0u)
    {
        descriptor_qa_report_fault(_108, heap_offset, _89.x, _87, descriptor_type_mask, _89.y, instruction);
        return _85;
    }
    return heap_offset;
}

void main()
{
    uint _30 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _129 = texture(sampler2D(_13[_30], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _129.x;
    SV_Target.y = _129.y;
    SV_Target.z = _129.z;
    SV_Target.w = _129.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 142
; Schema: 0
OpCapability Shader
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %20 %23
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %20 "UV"
OpName %23 "SV_Target"
OpName %33 "DescriptorHeapGlobalQAData"
OpMemberName %33 0 "failed_shader_hash"
OpMemberName %33 1 "failed_offset"
OpMemberName %33 2 "failed_heap"
OpMemberName %33 3 "failed_cookie"
OpMemberName %33 4 "fault_atomic"
OpMemberName %33 5 "failed_instruction"
OpMemberName %33 6 "failed_descriptor_type_mask"
OpMemberName %33 7 "actual_descriptor_type_mask"
OpMemberName %33 8 "fault_type"
OpMemberName %33 9 "live_status_table"
OpName %35 "QAGlobalData"
OpName %44 "descriptor_qa_report_fault"
OpName %37 "fault_type"
OpName %38 "heap_offset"
OpName %39 "cookie"
OpName %40 "heap_index"
OpName %41 "descriptor_type"
OpName %42 "actual_descriptor_type"
OpName %43 "instruction"
OpName %75 "DescriptorHeapQAData"
OpMemberName %75 0 "descriptor_count"
OpMemberName %75 1 "heap_index"
OpMemberName %75 2 "cookies_descriptor_info"
OpName %77 "QAHeapData"
OpName %82 "descriptor_qa_check"
OpName %79 "heap_offset"
OpName %80 "descriptor_type_mask"
OpName %81 "instruction"
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
OpDecorate %32 ArrayStride 4
OpMemberDecorate %33 0 Offset 0
OpMemberDecorate %33 1 Offset 8
OpMemberDecorate %33 2 Offset 12
OpMemberDecorate %33 3 Offset 16
OpMemberDecorate %33 4 Offset 20
OpMemberDecorate %33 5 Offset 24
OpMemberDecorate %33 6 Offset 28
OpMemberDecorate %33 7 Offset 32
OpMemberDecorate %33 8 Offset 36
OpMemberDecorate %33 9 Offset 40
OpDecorate %33 Block
OpDecorate %35 DescriptorSet 10
OpDecorate %35 Binding 10
OpDecorate %74 ArrayStride 8
OpMemberDecorate %75 0 Offset 0
OpMemberDecorate %75 1 Offset 4
OpMemberDecorate %75 2 Offset 8
OpDecorate %75 Block
OpDecorate %77 DescriptorSet 10
OpDecorate %77 Binding 11
OpDecorate %77 NonWritable
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
%24 = OpTypePointer UniformConstant %10
%26 = OpTypePointer PushConstant %5
%28 = OpConstant %5 0
%31 = OpTypeVector %5 2
%32 = OpTypeRuntimeArray %5
%33 = OpTypeStruct %31 %5 %5 %5 %5 %5 %5 %5 %5 %32
%34 = OpTypePointer StorageBuffer %33
%35 = OpVariable %34 StorageBuffer
%36 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%46 = OpTypePointer StorageBuffer %5
%48 = OpConstant %5 4
%50 = OpConstant %5 1
%51 = OpTypeBool
%56 = OpConstant %5 3
%59 = OpConstant %5 2
%61 = OpConstant %5 6
%63 = OpConstant %5 7
%65 = OpConstant %5 5
%66 = OpConstant %5 3735928559
%67 = OpConstantComposite %31 %66 %28
%68 = OpTypePointer StorageBuffer %31
%70 = OpConstant %5 72
%72 = OpConstant %5 8
%74 = OpTypeRuntimeArray %31
%75 = OpTypeStruct %5 %5 %74
%76 = OpTypePointer StorageBuffer %75
%77 = OpVariable %76 StorageBuffer
%78 = OpTypeFunction %5 %5 %5 %5
%94 = OpConstant %5 31
%96 = OpConstant %5 9
%116 = OpTypePointer UniformConstant %14
%121 = OpTypePointer Input %9
%126 = OpTypeSampledImage %10
%128 = OpConstant %9 0
%135 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %140
%140 = OpLabel
%27 = OpAccessChain %26 %8 %28
%29 = OpLoad %5 %27
%30 = OpFunctionCall %5 %82 %29 %50 %50
%25 = OpAccessChain %24 %13 %30
%115 = OpLoad %10 %25
%118 = OpAccessChain %26 %8 %59
%119 = OpLoad %5 %118
%117 = OpAccessChain %116 %17 %119
%120 = OpLoad %14 %117
%122 = OpAccessChain %121 %20 %28
%123 = OpLoad %9 %122
%124 = OpAccessChain %121 %20 %50
%125 = OpLoad %9 %124
%127 = OpSampledImage %126 %115 %120
%130 = OpCompositeConstruct %18 %123 %125
%129 = OpImageSampleImplicitLod %21 %127 %130 None
%131 = OpCompositeExtract %9 %129 0
%132 = OpCompositeExtract %9 %129 1
%133 = OpCompositeExtract %9 %129 2
%134 = OpCompositeExtract %9 %129 3
%136 = OpAccessChain %135 %23 %28
OpStore %136 %131
%137 = OpAccessChain %135 %23 %50
OpStore %137 %132
%138 = OpAccessChain %135 %23 %59
OpStore %138 %133
%139 = OpAccessChain %135 %23 %56
OpStore %139 %134
OpReturn
OpFunctionEnd
%44 = OpFunction %1 None %36
%37 = OpFunctionParameter %5
%38 = OpFunctionParameter %5
%39 = OpFunctionParameter %5
%40 = OpFunctionParameter %5
%41 = OpFunctionParameter %5
%42 = OpFunctionParameter %5
%43 = OpFunctionParameter %5
%45 = OpLabel
%47 = OpAccessChain %46 %35 %48
%49 = OpAtomicIAdd %5 %47 %50 %28 %50
%52 = OpIEqual %51 %49 %28
OpSelectionMerge %54 None
OpBranchConditional %52 %53 %54
%53 = OpLabel
%55 = OpAccessChain %46 %35 %56
OpStore %55 %39
%57 = OpAccessChain %46 %35 %50
OpStore %57 %38
%58 = OpAccessChain %46 %35 %59
OpStore %58 %40
%60 = OpAccessChain %46 %35 %61
OpStore %60 %41
%62 = OpAccessChain %46 %35 %63
OpStore %62 %42
%64 = OpAccessChain %46 %35 %65
OpStore %64 %43
%69 = OpAccessChain %68 %35 %28
OpStore %69 %67
OpMemoryBarrier %50 %70
%71 = OpAccessChain %46 %35 %72
OpStore %71 %37
OpBranch %54
%54 = OpLabel
OpReturn
OpFunctionEnd
%82 = OpFunction %5 None %78
%79 = OpFunctionParameter %5
%80 = OpFunctionParameter %5
%81 = OpFunctionParameter %5
%83 = OpLabel
%84 = OpAccessChain %46 %77 %28
%85 = OpLoad %5 %84
%86 = OpAccessChain %46 %77 %50
%87 = OpLoad %5 %86
%88 = OpAccessChain %68 %77 %59 %79
%89 = OpLoad %31 %88
%90 = OpCompositeExtract %5 %89 0
%92 = OpShiftRightLogical %5 %90 %65
%93 = OpBitwiseAnd %5 %90 %94
%91 = OpCompositeExtract %5 %89 1
%95 = OpAccessChain %46 %35 %96 %92
%97 = OpLoad %5 %95
%98 = OpShiftLeftLogical %5 %50 %93
%99 = OpBitwiseAnd %5 %97 %98
%100 = OpINotEqual %51 %99 %28
%101 = OpBitwiseAnd %5 %91 %80
%102 = OpIEqual %51 %101 %80
%103 = OpUGreaterThanEqual %51 %79 %85
%104 = OpSelect %5 %103 %50 %28
%105 = OpSelect %5 %102 %28 %59
%106 = OpSelect %5 %100 %28 %48
%107 = OpBitwiseOr %5 %104 %105
%108 = OpBitwiseOr %5 %107 %106
%109 = OpINotEqual %51 %108 %28
OpSelectionMerge %111 None
OpBranchConditional %109 %110 %111
%110 = OpLabel
%112 = OpFunctionCall %1 %44 %108 %79 %90 %87 %80 %91 %81
OpReturnValue %85
%111 = OpLabel
OpReturnValue %79
OpFunctionEnd
#endif
