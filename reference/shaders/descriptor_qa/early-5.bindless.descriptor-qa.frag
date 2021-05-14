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
    uvec2 _100 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _108 = QAGlobalData.live_status_table[_100.x >> 5u];
    uint _119 = (uint(heap_offset >= _96) | (((_100.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_108 & (1u << (_100.x & 31u))) != 0u) ? 0u : 4u);
    if (_119 != 0u)
    {
        descriptor_qa_report_fault(_119, heap_offset, _100.x, _98, descriptor_type_mask, _100.y, instruction);
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
    uint _136 = descriptor_qa_check(registers._m0, 1u, 2u);
    vec4 _145 = texture(sampler2D(_13[_136], _21[registers._m2]), vec2(UV.x, UV.y));
    SV_Target.x = _145.x;
    SV_Target.y = _145.y;
    SV_Target.z = _145.z;
    SV_Target.w = _145.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 160
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability PhysicalStorageBufferAddresses
OpExtension "SPV_EXT_descriptor_indexing"
OpExtension "SPV_KHR_physical_storage_buffer"
OpMemoryModel PhysicalStorageBuffer64 GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
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
OpMemberName %47 9 "live_status_table"
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
OpDecorate %47 Block
OpDecorate %49 DescriptorSet 10
OpDecorate %49 Binding 10
OpDecorate %85 ArrayStride 8
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
%47 = OpTypeStruct %45 %5 %5 %5 %5 %5 %5 %5 %5 %46
%48 = OpTypePointer StorageBuffer %47
%49 = OpVariable %48 StorageBuffer
%50 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%60 = OpTypePointer StorageBuffer %5
%62 = OpConstant %5 4
%70 = OpConstant %5 2
%72 = OpConstant %5 6
%74 = OpConstant %5 7
%76 = OpConstant %5 5
%77 = OpConstant %5 3735928559
%78 = OpConstantComposite %45 %77 %30
%79 = OpTypePointer StorageBuffer %45
%81 = OpConstant %5 72
%83 = OpConstant %5 8
%85 = OpTypeRuntimeArray %45
%86 = OpTypeStruct %5 %5 %85
%87 = OpTypePointer StorageBuffer %86
%88 = OpVariable %87 StorageBuffer
%89 = OpTypeFunction %5 %5 %5 %5
%105 = OpConstant %5 31
%107 = OpConstant %5 9
%129 = OpConstant %9 2
%132 = OpTypePointer UniformConstant %10
%138 = OpTypePointer UniformConstant %18
%143 = OpTypeSampledImage %10
%151 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %156
%156 = OpLabel
%29 = OpAccessChain %28 %24 %30
%31 = OpLoad %9 %29
%32 = OpAccessChain %28 %24 %33
%34 = OpLoad %9 %32
%36 = OpFOrdLessThan %35 %31 %37
OpSelectionMerge %158 None
OpBranchConditional %36 %157 %158
%157 = OpLabel
%41 = OpAccessChain %40 %8 %42
%43 = OpLoad %5 %41
%44 = OpFunctionCall %5 %93 %43 %70 %33
%39 = OpAccessChain %38 %17 %44
%126 = OpLoad %14 %39
%127 = OpConvertFToS %5 %31
%128 = OpConvertFToS %5 %34
%130 = OpCompositeConstruct %45 %127 %128
%131 = OpCompositeConstruct %25 %129 %129 %129 %129
OpImageWrite %126 %130 %131
OpBranch %158
%158 = OpLabel
%134 = OpAccessChain %40 %8 %30
%135 = OpLoad %5 %134
%136 = OpFunctionCall %5 %93 %135 %33 %70
%133 = OpAccessChain %132 %13 %136
%137 = OpLoad %10 %133
%140 = OpAccessChain %40 %8 %70
%141 = OpLoad %5 %140
%139 = OpAccessChain %138 %21 %141
%142 = OpLoad %18 %139
%144 = OpSampledImage %143 %137 %142
%146 = OpCompositeConstruct %22 %31 %34
%145 = OpImageSampleImplicitLod %25 %144 %146 None
%147 = OpCompositeExtract %9 %145 0
%148 = OpCompositeExtract %9 %145 1
%149 = OpCompositeExtract %9 %145 2
%150 = OpCompositeExtract %9 %145 3
%152 = OpAccessChain %151 %27 %30
OpStore %152 %147
%153 = OpAccessChain %151 %27 %33
OpStore %153 %148
%154 = OpAccessChain %151 %27 %70
OpStore %154 %149
%155 = OpAccessChain %151 %27 %42
OpStore %155 %150
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
%63 = OpAtomicIAdd %5 %61 %33 %30 %33
%64 = OpIEqual %35 %63 %30
OpSelectionMerge %66 None
OpBranchConditional %64 %65 %66
%65 = OpLabel
%67 = OpAccessChain %60 %49 %42
OpStore %67 %53
%68 = OpAccessChain %60 %49 %33
OpStore %68 %52
%69 = OpAccessChain %60 %49 %70
OpStore %69 %54
%71 = OpAccessChain %60 %49 %72
OpStore %71 %55
%73 = OpAccessChain %60 %49 %74
OpStore %73 %56
%75 = OpAccessChain %60 %49 %76
OpStore %75 %57
%80 = OpAccessChain %79 %49 %30
OpStore %80 %78
OpMemoryBarrier %33 %81
%82 = OpAccessChain %60 %49 %83
OpStore %82 %51
OpBranch %66
%66 = OpLabel
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
%99 = OpAccessChain %79 %88 %70 %90
%100 = OpLoad %45 %99
%101 = OpCompositeExtract %5 %100 0
%103 = OpShiftRightLogical %5 %101 %76
%104 = OpBitwiseAnd %5 %101 %105
%102 = OpCompositeExtract %5 %100 1
%106 = OpAccessChain %60 %49 %107 %103
%108 = OpLoad %5 %106
%109 = OpShiftLeftLogical %5 %33 %104
%110 = OpBitwiseAnd %5 %108 %109
%111 = OpINotEqual %35 %110 %30
%112 = OpBitwiseAnd %5 %102 %91
%113 = OpIEqual %35 %112 %91
%114 = OpUGreaterThanEqual %35 %90 %96
%115 = OpSelect %5 %114 %33 %30
%116 = OpSelect %5 %113 %30 %70
%117 = OpSelect %5 %111 %30 %62
%118 = OpBitwiseOr %5 %115 %116
%119 = OpBitwiseOr %5 %118 %117
%120 = OpINotEqual %35 %119 %30
OpSelectionMerge %122 None
OpBranchConditional %120 %121 %122
%121 = OpLabel
%123 = OpFunctionCall %1 %58 %119 %90 %101 %98 %91 %102 %92
OpReturnValue %96
%122 = OpLabel
OpReturnValue %90
OpFunctionEnd
#endif
