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
layout(set = 3, binding = 0) uniform writeonly image2D _17[];
layout(set = 2, binding = 0) uniform sampler _21[];

layout(location = 0) in vec2 UV;
layout(location = 0) out vec4 SV_Target;

void descriptor_qa_report_fault(uint fault_type, uint heap_offset, uint cookie, uint heap_index, uint descriptor_type, uint actual_descriptor_type, uint instruction)
{
    uint _63 = atomicAdd(QAGlobalData.fault_atomic, 1u);
    if (_63 == 0u)
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
    uint _96 = QAHeapData.descriptor_count;
    uint _98 = QAHeapData.heap_index;
    uint _101 = QAGlobalData.va_map_timestamp;
    uvec3 _104 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _113 = QAGlobalData.live_status_table[_104.x >> 5u];
    uint _127 = ((uint(heap_offset >= _96) | (((_104.z & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_113 & (1u << (_104.x & 31u))) != 0u) ? 0u : 4u)) | ((_101 >= _104.y) ? 0u : 8u);
    if (_127 != 0u)
    {
        descriptor_qa_report_fault(_127, heap_offset, _104.x, _98, descriptor_type_mask, _104.z, instruction);
        return _96;
    }
    return heap_offset;
}

void main()
{
    if (UV.x < 0.0)
    {
        uint _44 = descriptor_qa_check(registers._m3, 2u, 1u);
        imageStore(_17[_44], ivec2(uvec2(uint(int(UV.x)), uint(int(UV.y)))), vec4(2.0));
    }
    uint _142 = descriptor_qa_check(registers._m0, 1u, 2u);
    vec4 _151 = texture(sampler2D(_13[_142], _21[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _151.x;
    SV_Target.y = _151.y;
    SV_Target.z = _151.z;
    SV_Target.w = _151.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 166
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability VulkanMemoryModel
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 Vulkan
OpEntryPoint Fragment %3 "main" %8 %13 %17 %21 %24 %27 %49 %88
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %6 "RootConstants"
OpName %8 "registers"
OpName %24 "UV"
OpName %27 "SV_Target"
OpName %47 "DescriptorHeapGlobalQAData"
OpMemberName %47 0 "failed_shader_hash"
OpMemberName %47 1 "failed_offset"
OpMemberName %47 2 "failed_heap"
OpMemberName %47 3 "failed_cookie"
OpMemberName %47 4 "fault_atomic"
OpMemberName %47 5 "failed_instruction"
OpMemberName %47 6 "failed_descriptor_type_mask"
OpMemberName %47 7 "actual_descriptor_type_mask"
OpMemberName %47 8 "fault_type"
OpMemberName %47 9 "va_map_timestamp"
OpMemberName %47 10 "live_status_table"
OpName %49 "QAGlobalData"
OpName %58 "descriptor_qa_report_fault"
OpName %51 "fault_type"
OpName %52 "heap_offset"
OpName %53 "cookie"
OpName %54 "heap_index"
OpName %55 "descriptor_type"
OpName %56 "actual_descriptor_type"
OpName %57 "instruction"
OpName %86 "DescriptorHeapQAData"
OpMemberName %86 0 "descriptor_count"
OpMemberName %86 1 "heap_index"
OpMemberName %86 2 "cookies_descriptor_info"
OpName %88 "QAHeapData"
OpName %93 "descriptor_qa_check"
OpName %90 "heap_offset"
OpName %91 "descriptor_type_mask"
OpName %92 "instruction"
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
OpDecorate %17 DescriptorSet 3
OpDecorate %17 Binding 0
OpDecorate %17 NonReadable
OpDecorate %21 DescriptorSet 2
OpDecorate %21 Binding 0
OpDecorate %24 Location 0
OpDecorate %27 Location 0
OpDecorate %46 ArrayStride 4
OpMemberDecorate %47 0 Offset 0
OpMemberDecorate %47 1 Offset 8
OpMemberDecorate %47 2 Offset 12
OpMemberDecorate %47 3 Offset 16
OpMemberDecorate %47 4 Offset 20
OpMemberDecorate %47 5 Offset 24
OpMemberDecorate %47 6 Offset 28
OpMemberDecorate %47 7 Offset 32
OpMemberDecorate %47 8 Offset 36
OpMemberDecorate %47 9 Offset 40
OpMemberDecorate %47 10 Offset 44
OpDecorate %47 Block
OpDecorate %49 DescriptorSet 10
OpDecorate %49 Binding 10
OpDecorate %85 ArrayStride 12
OpMemberDecorate %86 0 Offset 0
OpMemberDecorate %86 1 Offset 4
OpMemberDecorate %86 2 Offset 8
OpDecorate %86 Block
OpDecorate %88 DescriptorSet 10
OpDecorate %88 Binding 11
OpDecorate %88 NonWritable
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
%14 = OpTypeImage %9 2D 0 0 0 2 Unknown
%15 = OpTypeRuntimeArray %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypeRuntimeArray %18
%20 = OpTypePointer UniformConstant %19
%21 = OpVariable %20 UniformConstant
%22 = OpTypeVector %9 2
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypeVector %9 4
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%28 = OpTypePointer Input %9
%30 = OpConstant %5 0
%33 = OpConstant %5 1
%35 = OpTypeBool
%37 = OpConstant %9 0
%38 = OpTypePointer UniformConstant %14
%40 = OpTypePointer PushConstant %5
%42 = OpConstant %5 3
%45 = OpTypeVector %5 2
%46 = OpTypeRuntimeArray %5
%47 = OpTypeStruct %45 %5 %5 %5 %5 %5 %5 %5 %5 %5 %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%60 = OpTypePointer StorageBuffer %5
%62 = OpConstant %5 4
%64 = OpConstant %5 5
%71 = OpConstant %5 2
%73 = OpConstant %5 6
%75 = OpConstant %5 7
%77 = OpConstant %5 3735928559
%78 = OpConstantComposite %45 %77 %30
%79 = OpTypePointer StorageBuffer %45
%81 = OpConstant %5 72
%83 = OpConstant %5 8
%84 = OpTypeVector %5 3
%85 = OpTypeRuntimeArray %84
%86 = OpTypeStruct %5 %5 %85
%87 = OpTypePointer StorageBuffer %86
%88 = OpVariable %87 StorageBuffer
%89 = OpTypeFunction %5 %5 %5 %5
%100 = OpConstant %5 9
%102 = OpTypePointer StorageBuffer %84
%110 = OpConstant %5 31
%112 = OpConstant %5 10
%135 = OpConstant %9 2
%138 = OpTypePointer UniformConstant %10
%144 = OpTypePointer UniformConstant %18
%149 = OpTypeSampledImage %10
%157 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %162
%162 = OpLabel
%29 = OpAccessChain %28 %24 %30
%31 = OpLoad %9 %29
%32 = OpAccessChain %28 %24 %33
%34 = OpLoad %9 %32
%36 = OpFOrdLessThan %35 %31 %37
OpSelectionMerge %164 None
OpBranchConditional %36 %163 %164
%163 = OpLabel
%41 = OpAccessChain %40 %8 %42
%43 = OpLoad %5 %41
%44 = OpFunctionCall %5 %93 %43 %71 %33
%39 = OpAccessChain %38 %17 %44
%132 = OpLoad %14 %39
%133 = OpConvertFToS %5 %31
%134 = OpConvertFToS %5 %34
%136 = OpCompositeConstruct %45 %133 %134
%137 = OpCompositeConstruct %25 %135 %135 %135 %135
OpImageWrite %132 %136 %137 NonPrivateTexel
OpBranch %164
%164 = OpLabel
OpBranch %165
%165 = OpLabel
%140 = OpAccessChain %40 %8 %30
%141 = OpLoad %5 %140
%142 = OpFunctionCall %5 %93 %141 %33 %71
%139 = OpAccessChain %138 %13 %142
%143 = OpLoad %10 %139
%146 = OpAccessChain %40 %8 %71
%147 = OpLoad %5 %146
%145 = OpAccessChain %144 %21 %147
%148 = OpLoad %18 %145
%150 = OpSampledImage %149 %143 %148
%152 = OpCompositeConstruct %22 %31 %34
%151 = OpImageSampleImplicitLod %25 %150 %152 None
%153 = OpCompositeExtract %9 %151 0
%154 = OpCompositeExtract %9 %151 1
%155 = OpCompositeExtract %9 %151 2
%156 = OpCompositeExtract %9 %151 3
%158 = OpAccessChain %157 %27 %30
OpStore %158 %153
%159 = OpAccessChain %157 %27 %33
OpStore %159 %154
%160 = OpAccessChain %157 %27 %71
OpStore %160 %155
%161 = OpAccessChain %157 %27 %42
OpStore %161 %156
OpReturn
OpFunctionEnd
%58 = OpFunction %1 None %50
%51 = OpFunctionParameter %5
%52 = OpFunctionParameter %5
%53 = OpFunctionParameter %5
%54 = OpFunctionParameter %5
%55 = OpFunctionParameter %5
%56 = OpFunctionParameter %5
%57 = OpFunctionParameter %5
%59 = OpLabel
%61 = OpAccessChain %60 %49 %62
%63 = OpAtomicIAdd %5 %61 %64 %30 %33
%65 = OpIEqual %35 %63 %30
OpSelectionMerge %67 None
OpBranchConditional %65 %66 %67
%66 = OpLabel
%68 = OpAccessChain %60 %49 %42
OpStore %68 %53 NonPrivatePointer
%69 = OpAccessChain %60 %49 %33
OpStore %69 %52 NonPrivatePointer
%70 = OpAccessChain %60 %49 %71
OpStore %70 %54 NonPrivatePointer
%72 = OpAccessChain %60 %49 %73
OpStore %72 %55 NonPrivatePointer
%74 = OpAccessChain %60 %49 %75
OpStore %74 %56 NonPrivatePointer
%76 = OpAccessChain %60 %49 %64
OpStore %76 %57 NonPrivatePointer
%80 = OpAccessChain %79 %49 %30
OpStore %80 %78 NonPrivatePointer
OpMemoryBarrier %64 %81
%82 = OpAccessChain %60 %49 %83
OpStore %82 %51 NonPrivatePointer
OpBranch %67
%67 = OpLabel
OpReturn
OpFunctionEnd
%93 = OpFunction %5 None %89
%90 = OpFunctionParameter %5
%91 = OpFunctionParameter %5
%92 = OpFunctionParameter %5
%94 = OpLabel
%95 = OpAccessChain %60 %88 %30
%96 = OpLoad %5 %95
%97 = OpAccessChain %60 %88 %33
%98 = OpLoad %5 %97
%99 = OpAccessChain %60 %49 %100
%101 = OpLoad %5 %99
%103 = OpAccessChain %102 %88 %71 %90
%104 = OpLoad %84 %103
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1
%107 = OpCompositeExtract %5 %104 2
%108 = OpShiftRightLogical %5 %105 %64
%109 = OpBitwiseAnd %5 %105 %110
%111 = OpAccessChain %60 %49 %112 %108
%113 = OpLoad %5 %111
%114 = OpShiftLeftLogical %5 %33 %109
%115 = OpBitwiseAnd %5 %113 %114
%116 = OpINotEqual %35 %115 %30
%117 = OpBitwiseAnd %5 %107 %91
%118 = OpIEqual %35 %117 %91
%119 = OpUGreaterThanEqual %35 %90 %96
%120 = OpSelect %5 %119 %33 %30
%121 = OpSelect %5 %118 %30 %71
%122 = OpSelect %5 %116 %30 %62
%123 = OpUGreaterThanEqual %35 %101 %106
%124 = OpSelect %5 %123 %30 %83
%125 = OpBitwiseOr %5 %120 %121
%126 = OpBitwiseOr %5 %125 %122
%127 = OpBitwiseOr %5 %126 %124
%128 = OpINotEqual %35 %127 %30
OpSelectionMerge %130 None
OpBranchConditional %128 %129 %130
%129 = OpLabel
%131 = OpFunctionCall %1 %58 %127 %90 %105 %98 %91 %107 %92
OpReturnValue %96
%130 = OpLabel
OpReturnValue %90
OpFunctionEnd
#endif
