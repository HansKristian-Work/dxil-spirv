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

void descriptor_qa_report_fault(uint fault_type, uint heap_offset, uint cookie, uint heap_index, uint descriptor_type, uint actual_descriptor_type, uint instruction)
{
    uint _51 = atomicExchange(QAGlobalData.fault_atomic, 1u);
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
    uint _87 = QAHeapData.descriptor_count;
    uint _89 = QAHeapData.heap_index;
    uvec2 _91 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _99 = QAGlobalData.live_status_table[_91.x >> 5u];
    uint _110 = (uint(heap_offset >= _87) | (((_91.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_99 & (1u << (_91.x & 31u))) != 0u) ? 0u : 4u);
    if (_110 != 0u)
    {
        descriptor_qa_report_fault(_110, heap_offset, _91.x, _89, descriptor_type_mask, _91.y, instruction);
        return _87;
    }
    return heap_offset;
}

void main()
{
    uint _32 = descriptor_qa_check(registers._m0, 1u, 1u);
    vec4 _131 = texture(sampler2D(_13[_32], _17[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _131.x;
    SV_Target.y = _131.y;
    SV_Target.z = _131.z;
    SV_Target.w = _131.w;
    gl_FragDepth = 0.5;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 144
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
OpMemberName %35 9 "live_status_table"
OpName %37 "QAGlobalData"
OpName %46 "descriptor_qa_report_fault"
OpName %39 "fault_type"
OpName %40 "heap_offset"
OpName %41 "cookie"
OpName %42 "heap_index"
OpName %43 "descriptor_type"
OpName %44 "actual_descriptor_type"
OpName %45 "instruction"
OpName %77 "DescriptorHeapQAData"
OpMemberName %77 0 "descriptor_count"
OpMemberName %77 1 "heap_index"
OpMemberName %77 2 "cookies_descriptor_info"
OpName %79 "QAHeapData"
OpName %84 "descriptor_qa_check"
OpName %81 "heap_offset"
OpName %82 "descriptor_type_mask"
OpName %83 "instruction"
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
OpDecorate %35 Block
OpDecorate %37 DescriptorSet 10
OpDecorate %37 Binding 10
OpDecorate %76 ArrayStride 8
OpMemberDecorate %77 0 Offset 0
OpMemberDecorate %77 1 Offset 4
OpMemberDecorate %77 2 Offset 8
OpDecorate %77 Block
OpDecorate %79 DescriptorSet 10
OpDecorate %79 Binding 11
OpDecorate %79 NonWritable
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
%35 = OpTypeStruct %33 %5 %5 %5 %5 %5 %5 %5 %5 %34
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
%76 = OpTypeRuntimeArray %33
%77 = OpTypeStruct %5 %5 %76
%78 = OpTypePointer StorageBuffer %77
%79 = OpVariable %78 StorageBuffer
%80 = OpTypeFunction %5 %5 %5 %5
%96 = OpConstant %5 31
%98 = OpConstant %5 9
%118 = OpTypePointer UniformConstant %14
%123 = OpTypePointer Input %9
%128 = OpTypeSampledImage %10
%130 = OpConstant %9 0
%141 = OpConstant %9 0.5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %142
%142 = OpLabel
%29 = OpAccessChain %28 %8 %30
%31 = OpLoad %5 %29
%32 = OpFunctionCall %5 %84 %31 %52 %52
%27 = OpAccessChain %26 %13 %32
%117 = OpLoad %10 %27
%120 = OpAccessChain %28 %8 %61
%121 = OpLoad %5 %120
%119 = OpAccessChain %118 %17 %121
%122 = OpLoad %14 %119
%124 = OpAccessChain %123 %20 %30
%125 = OpLoad %9 %124
%126 = OpAccessChain %123 %20 %52
%127 = OpLoad %9 %126
%129 = OpSampledImage %128 %117 %122
%132 = OpCompositeConstruct %18 %125 %127
%131 = OpImageSampleImplicitLod %21 %129 %132 None
%133 = OpCompositeExtract %9 %131 0
%134 = OpCompositeExtract %9 %131 1
%135 = OpCompositeExtract %9 %131 2
%136 = OpCompositeExtract %9 %131 3
%137 = OpAccessChain %24 %23 %30
OpStore %137 %133
%138 = OpAccessChain %24 %23 %52
OpStore %138 %134
%139 = OpAccessChain %24 %23 %61
OpStore %139 %135
%140 = OpAccessChain %24 %23 %58
OpStore %140 %136
OpStore %25 %141
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
%51 = OpAtomicExchange %5 %49 %52 %30 %52
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
%84 = OpFunction %5 None %80
%81 = OpFunctionParameter %5
%82 = OpFunctionParameter %5
%83 = OpFunctionParameter %5
%85 = OpLabel
%86 = OpAccessChain %48 %79 %30
%87 = OpLoad %5 %86
%88 = OpAccessChain %48 %79 %52
%89 = OpLoad %5 %88
%90 = OpAccessChain %70 %79 %61 %81
%91 = OpLoad %33 %90
%92 = OpCompositeExtract %5 %91 0
%94 = OpShiftRightLogical %5 %92 %67
%95 = OpBitwiseAnd %5 %92 %96
%93 = OpCompositeExtract %5 %91 1
%97 = OpAccessChain %48 %37 %98 %94
%99 = OpLoad %5 %97
%100 = OpShiftLeftLogical %5 %52 %95
%101 = OpBitwiseAnd %5 %99 %100
%102 = OpINotEqual %53 %101 %30
%103 = OpBitwiseAnd %5 %93 %82
%104 = OpIEqual %53 %103 %82
%105 = OpUGreaterThanEqual %53 %81 %87
%106 = OpSelect %5 %105 %52 %30
%107 = OpSelect %5 %104 %30 %61
%108 = OpSelect %5 %102 %30 %50
%109 = OpBitwiseOr %5 %106 %107
%110 = OpBitwiseOr %5 %109 %108
%111 = OpINotEqual %53 %110 %30
OpSelectionMerge %113 None
OpBranchConditional %111 %112 %113
%112 = OpLabel
%114 = OpFunctionCall %1 %46 %110 %81 %92 %89 %82 %93 %83
OpReturnValue %87
%113 = OpLabel
OpReturnValue %81
OpFunctionEnd
#endif
