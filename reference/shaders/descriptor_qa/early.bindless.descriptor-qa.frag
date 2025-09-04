#version 460
#extension GL_EXT_buffer_reference2 : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_scalar_block_layout : require
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
    uint _86 = QAHeapData.descriptor_count;
    uint _88 = QAHeapData.heap_index;
    uint _91 = QAGlobalData.va_map_timestamp;
    uvec3 _94 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _103 = QAGlobalData.live_status_table[_94.x >> 5u];
    uint _117 = ((uint(heap_offset >= _86) | (((_94.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_103 & (1u << (_94.x & 31u))) != 0u) ? 0u : 4u)) | ((_91 >= _94.y) ? 0u : 8u);
    if (_117 != 0u)
    {
        descriptor_qa_report_fault(_117, heap_offset, _94.x, _88, descriptor_type_mask, _94.z, instruction);
        return _86;
    }
    return heap_offset;
}

void main()
{
    uint _30 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _138 = texture(sampler2D(_13[_30], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _138.x;
    SV_Target.y = _138.y;
    SV_Target.z = _138.z;
    SV_Target.w = _138.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 151
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
OpMemberName %33 9 "va_map_timestamp"
OpMemberName %33 10 "live_status_table"
OpName %35 "QAGlobalData"
OpName %44 "descriptor_qa_report_fault"
OpName %37 "fault_type"
OpName %38 "heap_offset"
OpName %39 "cookie"
OpName %40 "heap_index"
OpName %41 "descriptor_type"
OpName %42 "actual_descriptor_type"
OpName %43 "instruction"
OpName %76 "DescriptorHeapQAData"
OpMemberName %76 0 "descriptor_count"
OpMemberName %76 1 "heap_index"
OpMemberName %76 2 "cookies_descriptor_info"
OpName %78 "QAHeapData"
OpName %83 "descriptor_qa_check"
OpName %80 "heap_offset"
OpName %81 "descriptor_type_mask"
OpName %82 "instruction"
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
OpMemberDecorate %33 10 Offset 44
OpDecorate %33 Block
OpDecorate %35 DescriptorSet 10
OpDecorate %35 Binding 10
OpDecorate %75 ArrayStride 12
OpMemberDecorate %76 0 Offset 0
OpMemberDecorate %76 1 Offset 4
OpMemberDecorate %76 2 Offset 8
OpDecorate %76 Block
OpDecorate %78 DescriptorSet 10
OpDecorate %78 Binding 11
OpDecorate %78 NonWritable
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
%33 = OpTypeStruct %31 %5 %5 %5 %5 %5 %5 %5 %5 %5 %32
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
%74 = OpTypeVector %5 3
%75 = OpTypeRuntimeArray %74
%76 = OpTypeStruct %5 %5 %75
%77 = OpTypePointer StorageBuffer %76
%78 = OpVariable %77 StorageBuffer
%79 = OpTypeFunction %5 %5 %5 %5
%90 = OpConstant %5 9
%92 = OpTypePointer StorageBuffer %74
%100 = OpConstant %5 31
%102 = OpConstant %5 10
%125 = OpTypePointer UniformConstant %14
%130 = OpTypePointer Input %9
%135 = OpTypeSampledImage %10
%137 = OpConstant %9 0
%144 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %149
%149 = OpLabel
%27 = OpAccessChain %26 %8 %28
%29 = OpLoad %5 %27
%30 = OpFunctionCall %5 %83 %29 %50 %50
%25 = OpAccessChain %24 %13 %30
%124 = OpLoad %10 %25
%127 = OpAccessChain %26 %8 %59
%128 = OpLoad %5 %127
%126 = OpAccessChain %125 %17 %128
%129 = OpLoad %14 %126
%131 = OpAccessChain %130 %20 %28
%132 = OpLoad %9 %131
%133 = OpAccessChain %130 %20 %50
%134 = OpLoad %9 %133
%136 = OpSampledImage %135 %124 %129
%139 = OpCompositeConstruct %18 %132 %134
%138 = OpImageSampleImplicitLod %21 %136 %139 None
%140 = OpCompositeExtract %9 %138 0
%141 = OpCompositeExtract %9 %138 1
%142 = OpCompositeExtract %9 %138 2
%143 = OpCompositeExtract %9 %138 3
%145 = OpAccessChain %144 %23 %28
OpStore %145 %140
%146 = OpAccessChain %144 %23 %50
OpStore %146 %141
%147 = OpAccessChain %144 %23 %59
OpStore %147 %142
%148 = OpAccessChain %144 %23 %56
OpStore %148 %143
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
%83 = OpFunction %5 None %79
%80 = OpFunctionParameter %5
%81 = OpFunctionParameter %5
%82 = OpFunctionParameter %5
%84 = OpLabel
%85 = OpAccessChain %46 %78 %28
%86 = OpLoad %5 %85
%87 = OpAccessChain %46 %78 %50
%88 = OpLoad %5 %87
%89 = OpAccessChain %46 %35 %90
%91 = OpLoad %5 %89
%93 = OpAccessChain %92 %78 %59 %80
%94 = OpLoad %74 %93
%95 = OpCompositeExtract %5 %94 0
%96 = OpCompositeExtract %5 %94 1
%97 = OpCompositeExtract %5 %94 2
%98 = OpShiftRightLogical %5 %95 %65
%99 = OpBitwiseAnd %5 %95 %100
%101 = OpAccessChain %46 %35 %102 %98
%103 = OpLoad %5 %101
%104 = OpShiftLeftLogical %5 %50 %99
%105 = OpBitwiseAnd %5 %103 %104
%106 = OpINotEqual %51 %105 %28
%107 = OpBitwiseAnd %5 %97 %81
%108 = OpIEqual %51 %107 %81
%109 = OpUGreaterThanEqual %51 %80 %86
%110 = OpSelect %5 %109 %50 %28
%111 = OpSelect %5 %108 %28 %59
%112 = OpSelect %5 %106 %28 %48
%113 = OpUGreaterThanEqual %51 %91 %96
%114 = OpSelect %5 %113 %28 %72
%115 = OpBitwiseOr %5 %110 %111
%116 = OpBitwiseOr %5 %115 %112
%117 = OpBitwiseOr %5 %116 %114
%118 = OpINotEqual %51 %117 %28
OpSelectionMerge %120 None
OpBranchConditional %118 %119 %120
%119 = OpLabel
%121 = OpFunctionCall %1 %44 %117 %80 %95 %88 %81 %97 %82
OpReturnValue %86
%120 = OpLabel
OpReturnValue %80
OpFunctionEnd
#endif
