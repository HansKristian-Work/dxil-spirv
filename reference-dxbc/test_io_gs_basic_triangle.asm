SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability ClipDistance
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %11 %17 %21 %24 %26 %28 %30 %32
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 3
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputTriangleStrip
OpName %3 "main"
OpName %11 "SV_POSITION"
OpName %17 "TEXCOORD"
OpName %21 "NORMAL"
OpName %26 "SV_POSITION"
OpName %28 "TEXCOORD"
OpName %30 "NORMAL"
OpDecorate %11 BuiltIn Position
OpDecorate %17 Location 2
OpDecorate %21 Location 3
OpDecorate %24 BuiltIn ClipDistance
OpDecorate %26 BuiltIn Position
OpDecorate %28 Location 2
OpDecorate %30 Location 3
OpDecorate %32 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpConstant %7 2
%13 = OpTypeArray %5 %12
%14 = OpTypeVector %5 2
%15 = OpTypeArray %14 %8
%16 = OpTypePointer Input %15
%17 = OpVariable %16 Input
%18 = OpTypeVector %5 3
%19 = OpTypeArray %18 %8
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeArray %13 %8
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypePointer Output %6
%26 = OpVariable %25 Output
%27 = OpTypePointer Output %14
%28 = OpVariable %27 Output
%29 = OpTypePointer Output %18
%30 = OpVariable %29 Output
%31 = OpTypePointer Output %13
%32 = OpVariable %31 Output
%34 = OpConstant %7 0
%36 = OpTypePointer Input %5
%40 = OpConstant %7 1
%47 = OpTypePointer Output %5
%62 = OpTypeVector %7 2
%79 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %81
%81 = OpLabel
OpBranch %82
%82 = OpLabel
%33 = OpPhi %7 %34 %81 %35 %84
OpLoopMerge %85 %84 None
OpBranch %83
%83 = OpLabel
%37 = OpAccessChain %36 %11 %33 %34
%38 = OpLoad %5 %37
%39 = OpAccessChain %36 %11 %33 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %36 %11 %33 %12
%43 = OpLoad %5 %42
%44 = OpAccessChain %36 %11 %33 %8
%45 = OpLoad %5 %44
%48 = OpAccessChain %47 %26 %34
OpStore %48 %38
%49 = OpAccessChain %47 %26 %40
OpStore %49 %41
%50 = OpAccessChain %47 %26 %12
OpStore %50 %43
%51 = OpAccessChain %47 %26 %8
OpStore %51 %45
%52 = OpAccessChain %36 %21 %33 %34
%53 = OpLoad %5 %52
%54 = OpAccessChain %36 %21 %33 %40
%55 = OpLoad %5 %54
%56 = OpAccessChain %36 %21 %33 %12
%57 = OpLoad %5 %56
%59 = OpAccessChain %47 %30 %34
OpStore %59 %53
%60 = OpAccessChain %47 %30 %40
OpStore %60 %55
%61 = OpAccessChain %47 %30 %12
OpStore %61 %57
%64 = OpAccessChain %36 %24 %33 %34
%65 = OpLoad %5 %64
%66 = OpAccessChain %47 %32 %34
OpStore %66 %65
%68 = OpAccessChain %36 %24 %33 %40
%69 = OpLoad %5 %68
%70 = OpAccessChain %47 %32 %40
OpStore %70 %69
%72 = OpAccessChain %36 %17 %33 %34
%73 = OpLoad %5 %72
%74 = OpAccessChain %47 %28 %34
OpStore %74 %73
%76 = OpAccessChain %36 %17 %33 %40
%77 = OpLoad %5 %76
%78 = OpAccessChain %47 %28 %40
OpStore %78 %77
OpEmitVertex
OpBranch %84
%84 = OpLabel
%35 = OpIAdd %7 %33 %40
%80 = OpULessThan %79 %35 %8
OpBranchConditional %80 %82 %85
%85 = OpLabel
OpEndPrimitive
OpReturn
OpFunctionEnd

