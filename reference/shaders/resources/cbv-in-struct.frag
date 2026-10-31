#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[2];
} _12;

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = _12._m0[1u].x + _12._m0[0u].x;
    SV_Target.y = _12._m0[1u].y + _12._m0[0u].y;
    SV_Target.z = _12._m0[1u].z + _12._m0[0u].z;
    SV_Target.w = _12._m0[1u].w + _12._m0[0u].w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 2
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Output %8
%14 = OpVariable %13 Output
%15 = OpConstant %5 0
%16 = OpTypePointer Uniform %8
%23 = OpConstant %5 1
%34 = OpTypePointer Output %7
%39 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%17 = OpAccessChain %16 %12 %15 %15
%18 = OpLoad %8 %17
%19 = OpCompositeExtract %7 %18 0
%20 = OpCompositeExtract %7 %18 1
%21 = OpCompositeExtract %7 %18 2
%22 = OpCompositeExtract %7 %18 3
%24 = OpAccessChain %16 %12 %15 %23
%25 = OpLoad %8 %24
%26 = OpCompositeExtract %7 %25 0
%27 = OpCompositeExtract %7 %25 1
%28 = OpCompositeExtract %7 %25 2
%29 = OpCompositeExtract %7 %25 3
%30 = OpFAdd %7 %26 %19
%31 = OpFAdd %7 %27 %20
%32 = OpFAdd %7 %28 %21
%33 = OpFAdd %7 %29 %22
%35 = OpAccessChain %34 %14 %15
OpStore %35 %30
%36 = OpAccessChain %34 %14 %23
OpStore %36 %31
%37 = OpAccessChain %34 %14 %6
OpStore %37 %32
%38 = OpAccessChain %34 %14 %39
OpStore %38 %33
OpReturn
OpFunctionEnd
#endif
