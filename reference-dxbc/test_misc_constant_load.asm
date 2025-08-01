SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
OpCapability VulkanMemoryModel
%27 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %7 %11 %22 %24
OpName %3 "main"
OpName %7 "SV_VERTEXID"
OpName %11 "SV_POSITION"
OpDecorate %7 BuiltIn VertexIndex
OpDecorate %11 BuiltIn Position
OpDecorate %24 BuiltIn BaseVertex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpConstant %5 5
%13 = OpTypeArray %9 %12
%14 = OpConstant %8 0
%15 = OpConstantComposite %9 %14 %14 %14 %14
%16 = OpConstant %8 1
%17 = OpConstantComposite %9 %14 %16 %14 %14
%18 = OpConstantComposite %9 %16 %14 %14 %14
%19 = OpConstantComposite %9 %16 %16 %14 %14
%20 = OpConstantComposite %13 %15 %17 %18 %19 %15
%21 = OpTypePointer Private %13
%22 = OpVariable %21 Private %20
%24 = OpVariable %6 Input
%29 = OpConstant %5 4
%30 = OpTypePointer Private %9
%34 = OpTypePointer Output %8
%36 = OpConstant %5 0
%39 = OpConstant %5 1
%42 = OpConstant %5 2
%45 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%23 = OpLoad %5 %7
%25 = OpLoad %5 %24
%26 = OpISub %5 %23 %25
%28 = OpExtInst %5 %27 UMin %26 %29
%31 = OpInBoundsAccessChain %30 %22 %28
%32 = OpLoad %9 %31
%33 = OpCompositeExtract %8 %32 0
%35 = OpAccessChain %34 %11 %36
OpStore %35 %33
%37 = OpCompositeExtract %8 %32 1
%38 = OpAccessChain %34 %11 %39
OpStore %38 %37
%40 = OpCompositeExtract %8 %32 2
%41 = OpAccessChain %34 %11 %42
OpStore %41 %40
%43 = OpCompositeExtract %8 %32 3
%44 = OpAccessChain %34 %11 %45
OpStore %44 %43
OpReturn
OpFunctionEnd

