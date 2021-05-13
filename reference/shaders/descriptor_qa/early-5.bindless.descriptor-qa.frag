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
    uint _53 = atomicExchange(QAGlobalData.fault_atomic, 1u);
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
    uint _89 = QAHeapData.descriptor_count;
    uint _91 = QAHeapData.heap_index;
    uvec2 _93 = QAHeapData.cookies_descriptor_info[heap_offset];
    uint _101 = QAGlobalData.live_status_table[_93.x >> 5u];
    uint _112 = (uint(heap_offset >= _89) | (((_93.y & descriptor_type_mask) == descriptor_type_mask) ? 0u : 2u)) | (((_101 & (1u << (_93.x & 31u))) != 0u) ? 0u : 4u);
    if (_112 != 0u)
    {
        descriptor_qa_report_fault(_112, heap_offset, _93.x, _91, descriptor_type_mask, _93.y, instruction);
        return _89;
    }
    return heap_offset;
}

void main()
{
    uint _34 = descriptor_qa_check(registers._m3, 2u, 1u);
    uint _124 = descriptor_qa_check(registers._m0, 1u, 2u);
    if (UV.x < 0.0)
    {
        imageStore(_17[_34], ivec2(uvec2(uint(int(UV.x)), uint(int(UV.y)))), vec4(2.0));
    }
    vec4 _145 = texture(sampler2D(_13[_124], _21[registers._m2]), vec2(UV.x, UV.y));
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
OpName %79 "DescriptorHeapQAData"
OpMemberName %79 0 "descriptor_count"
OpMemberName %79 1 "heap_index"
OpMemberName %79 2 "cookies_descriptor_info"
OpName %81 "QAHeapData"
OpName %86 "descriptor_qa_check"
OpName %83 "heap_offset"
OpName %84 "descriptor_type_mask"
OpName %85 "instruction"
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
OpDecorate %78 ArrayStride 8
OpMemberDecorate %79 0 Offset 0
OpMemberDecorate %79 1 Offset 4
OpMemberDecorate %79 2 Offset 8
OpDecorate %79 Block
OpDecorate %81 DescriptorSet 10
OpDecorate %81 Binding 11
OpDecorate %81 NonWritable
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
%28 = OpTypePointer UniformConstant %14
%30 = OpTypePointer PushConstant %5
%32 = OpConstant %5 3
%35 = OpTypeVector %5 2
%36 = OpTypeRuntimeArray %5
%37 = OpTypeStruct %35 %5 %5 %5 %5 %5 %5 %5 %5 %36
%38 = OpTypePointer StorageBuffer %37
%39 = OpVariable %38 StorageBuffer
%40 = OpTypeFunction %1 %5 %5 %5 %5 %5 %5 %5
%50 = OpTypePointer StorageBuffer %5
%52 = OpConstant %5 4
%54 = OpConstant %5 1
%55 = OpConstant %5 0
%56 = OpTypeBool
%63 = OpConstant %5 2
%65 = OpConstant %5 6
%67 = OpConstant %5 7
%69 = OpConstant %5 5
%70 = OpConstant %5 3735928559
%71 = OpConstantComposite %35 %70 %55
%72 = OpTypePointer StorageBuffer %35
%74 = OpConstant %5 72
%76 = OpConstant %5 8
%78 = OpTypeRuntimeArray %35
%79 = OpTypeStruct %5 %5 %78
%80 = OpTypePointer StorageBuffer %79
%81 = OpVariable %80 StorageBuffer
%82 = OpTypeFunction %5 %5 %5 %5
%98 = OpConstant %5 31
%100 = OpConstant %5 9
%120 = OpTypePointer UniformConstant %10
%126 = OpTypePointer UniformConstant %18
%131 = OpTypePointer Input %9
%137 = OpConstant %9 0
%140 = OpConstant %9 2
%143 = OpTypeSampledImage %10
%151 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %156
%156 = OpLabel
%31 = OpAccessChain %30 %8 %32
%33 = OpLoad %5 %31
%34 = OpFunctionCall %5 %86 %33 %63 %54
%29 = OpAccessChain %28 %17 %34
%119 = OpLoad %14 %29
%122 = OpAccessChain %30 %8 %55
%123 = OpLoad %5 %122
%124 = OpFunctionCall %5 %86 %123 %54 %63
%121 = OpAccessChain %120 %13 %124
%125 = OpLoad %10 %121
%128 = OpAccessChain %30 %8 %63
%129 = OpLoad %5 %128
%127 = OpAccessChain %126 %21 %129
%130 = OpLoad %18 %127
%132 = OpAccessChain %131 %24 %55
%133 = OpLoad %9 %132
%134 = OpAccessChain %131 %24 %54
%135 = OpLoad %9 %134
%136 = OpFOrdLessThan %56 %133 %137
OpSelectionMerge %158 None
OpBranchConditional %136 %157 %158
%157 = OpLabel
%138 = OpConvertFToS %5 %133
%139 = OpConvertFToS %5 %135
%141 = OpCompositeConstruct %35 %138 %139
%142 = OpCompositeConstruct %25 %140 %140 %140 %140
OpImageWrite %119 %141 %142
OpBranch %158
%158 = OpLabel
%144 = OpSampledImage %143 %125 %130
%146 = OpCompositeConstruct %22 %133 %135
%145 = OpImageSampleImplicitLod %25 %144 %146 None
%147 = OpCompositeExtract %9 %145 0
%148 = OpCompositeExtract %9 %145 1
%149 = OpCompositeExtract %9 %145 2
%150 = OpCompositeExtract %9 %145 3
%152 = OpAccessChain %151 %27 %55
OpStore %152 %147
%153 = OpAccessChain %151 %27 %54
OpStore %153 %148
%154 = OpAccessChain %151 %27 %63
OpStore %154 %149
%155 = OpAccessChain %151 %27 %32
OpStore %155 %150
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
%53 = OpAtomicExchange %5 %51 %54 %55 %54
%57 = OpIEqual %56 %53 %55
OpSelectionMerge %59 None
OpBranchConditional %57 %58 %59
%58 = OpLabel
%60 = OpAccessChain %50 %39 %32
OpStore %60 %43
%61 = OpAccessChain %50 %39 %54
OpStore %61 %42
%62 = OpAccessChain %50 %39 %63
OpStore %62 %44
%64 = OpAccessChain %50 %39 %65
OpStore %64 %45
%66 = OpAccessChain %50 %39 %67
OpStore %66 %46
%68 = OpAccessChain %50 %39 %69
OpStore %68 %47
%73 = OpAccessChain %72 %39 %55
OpStore %73 %71
OpMemoryBarrier %54 %74
%75 = OpAccessChain %50 %39 %76
OpStore %75 %41
OpBranch %59
%59 = OpLabel
OpReturn
OpFunctionEnd
%86 = OpFunction %5 None %82
%83 = OpFunctionParameter %5
%84 = OpFunctionParameter %5
%85 = OpFunctionParameter %5
%87 = OpLabel
%88 = OpAccessChain %50 %81 %55
%89 = OpLoad %5 %88
%90 = OpAccessChain %50 %81 %54
%91 = OpLoad %5 %90
%92 = OpAccessChain %72 %81 %63 %83
%93 = OpLoad %35 %92
%94 = OpCompositeExtract %5 %93 0
%96 = OpShiftRightLogical %5 %94 %69
%97 = OpBitwiseAnd %5 %94 %98
%95 = OpCompositeExtract %5 %93 1
%99 = OpAccessChain %50 %39 %100 %96
%101 = OpLoad %5 %99
%102 = OpShiftLeftLogical %5 %54 %97
%103 = OpBitwiseAnd %5 %101 %102
%104 = OpINotEqual %56 %103 %55
%105 = OpBitwiseAnd %5 %95 %84
%106 = OpIEqual %56 %105 %84
%107 = OpUGreaterThanEqual %56 %83 %89
%108 = OpSelect %5 %107 %54 %55
%109 = OpSelect %5 %106 %55 %63
%110 = OpSelect %5 %104 %55 %52
%111 = OpBitwiseOr %5 %108 %109
%112 = OpBitwiseOr %5 %111 %110
%113 = OpINotEqual %56 %112 %55
OpSelectionMerge %115 None
OpBranchConditional %113 %114 %115
%114 = OpLabel
%116 = OpFunctionCall %1 %48 %112 %83 %94 %91 %84 %95 %85
OpReturnValue %89
%115 = OpLabel
OpReturnValue %83
OpFunctionEnd
#endif
