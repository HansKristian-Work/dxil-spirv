SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 88
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability ClipDistance
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %11 %17 %21 %24 %26 %28 %30 %32
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 4
OpExecutionMode %3 InputLinesAdjacency
OpExecutionMode %3 OutputLineStrip
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
%8 = OpConstant %7 4
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
%45 = OpConstant %7 3
%48 = OpTypePointer Output %5
%63 = OpTypeVector %7 2
%80 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %82
%82 = OpLabel
OpBranch %83
%83 = OpLabel
%33 = OpPhi %7 %34 %82 %35 %85
OpLoopMerge %86 %85 None
OpBranch %84
%84 = OpLabel
%37 = OpAccessChain %36 %11 %33 %34
%38 = OpLoad %5 %37
%39 = OpAccessChain %36 %11 %33 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %36 %11 %33 %12
%43 = OpLoad %5 %42
%44 = OpAccessChain %36 %11 %33 %45
%46 = OpLoad %5 %44
%49 = OpAccessChain %48 %26 %34
OpStore %49 %38
%50 = OpAccessChain %48 %26 %40
OpStore %50 %41
%51 = OpAccessChain %48 %26 %12
OpStore %51 %43
%52 = OpAccessChain %48 %26 %45
OpStore %52 %46
%53 = OpAccessChain %36 %21 %33 %34
%54 = OpLoad %5 %53
%55 = OpAccessChain %36 %21 %33 %40
%56 = OpLoad %5 %55
%57 = OpAccessChain %36 %21 %33 %12
%58 = OpLoad %5 %57
%60 = OpAccessChain %48 %30 %34
OpStore %60 %54
%61 = OpAccessChain %48 %30 %40
OpStore %61 %56
%62 = OpAccessChain %48 %30 %12
OpStore %62 %58
%65 = OpAccessChain %36 %24 %33 %34
%66 = OpLoad %5 %65
%67 = OpAccessChain %48 %32 %34
OpStore %67 %66
%69 = OpAccessChain %36 %24 %33 %40
%70 = OpLoad %5 %69
%71 = OpAccessChain %48 %32 %40
OpStore %71 %70
%73 = OpAccessChain %36 %17 %33 %34
%74 = OpLoad %5 %73
%75 = OpAccessChain %48 %28 %34
OpStore %75 %74
%77 = OpAccessChain %36 %17 %33 %40
%78 = OpLoad %5 %77
%79 = OpAccessChain %48 %28 %40
OpStore %79 %78
OpEmitVertex
OpBranch %85
%85 = OpLabel
%35 = OpIAdd %7 %33 %40
%81 = OpULessThan %80 %35 %8
OpBranchConditional %81 %83 %86
%86 = OpLabel
OpEndPrimitive
OpReturn
OpFunctionEnd

