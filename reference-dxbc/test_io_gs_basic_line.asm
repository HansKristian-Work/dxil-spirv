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
OpEntryPoint Geometry %3 "main" %11 %16 %20 %23 %25 %27 %29 %31
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 InputLines
OpExecutionMode %3 OutputLineStrip
OpName %3 "main"
OpName %11 "SV_POSITION"
OpName %16 "TEXCOORD"
OpName %20 "NORMAL"
OpName %25 "SV_POSITION"
OpName %27 "TEXCOORD"
OpName %29 "NORMAL"
OpDecorate %11 BuiltIn Position
OpDecorate %16 Location 2
OpDecorate %20 Location 3
OpDecorate %23 BuiltIn ClipDistance
OpDecorate %25 BuiltIn Position
OpDecorate %27 Location 2
OpDecorate %29 Location 3
OpDecorate %31 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %5 %8
%13 = OpTypeVector %5 2
%14 = OpTypeArray %13 %8
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 3
%18 = OpTypeArray %17 %8
%19 = OpTypePointer Input %18
%20 = OpVariable %19 Input
%21 = OpTypeArray %12 %8
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Output %6
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %13
%27 = OpVariable %26 Output
%28 = OpTypePointer Output %17
%29 = OpVariable %28 Output
%30 = OpTypePointer Output %12
%31 = OpVariable %30 Output
%33 = OpConstant %7 0
%35 = OpTypePointer Input %5
%39 = OpConstant %7 1
%44 = OpConstant %7 3
%47 = OpTypePointer Output %5
%62 = OpTypeVector %7 2
%79 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %81
%81 = OpLabel
OpBranch %82
%82 = OpLabel
%32 = OpPhi %7 %33 %81 %34 %84
OpLoopMerge %85 %84 None
OpBranch %83
%83 = OpLabel
%36 = OpAccessChain %35 %11 %32 %33
%37 = OpLoad %5 %36
%38 = OpAccessChain %35 %11 %32 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %35 %11 %32 %8
%42 = OpLoad %5 %41
%43 = OpAccessChain %35 %11 %32 %44
%45 = OpLoad %5 %43
%48 = OpAccessChain %47 %25 %33
OpStore %48 %37
%49 = OpAccessChain %47 %25 %39
OpStore %49 %40
%50 = OpAccessChain %47 %25 %8
OpStore %50 %42
%51 = OpAccessChain %47 %25 %44
OpStore %51 %45
%52 = OpAccessChain %35 %20 %32 %33
%53 = OpLoad %5 %52
%54 = OpAccessChain %35 %20 %32 %39
%55 = OpLoad %5 %54
%56 = OpAccessChain %35 %20 %32 %8
%57 = OpLoad %5 %56
%59 = OpAccessChain %47 %29 %33
OpStore %59 %53
%60 = OpAccessChain %47 %29 %39
OpStore %60 %55
%61 = OpAccessChain %47 %29 %8
OpStore %61 %57
%64 = OpAccessChain %35 %23 %32 %33
%65 = OpLoad %5 %64
%66 = OpAccessChain %47 %31 %33
OpStore %66 %65
%68 = OpAccessChain %35 %23 %32 %39
%69 = OpLoad %5 %68
%70 = OpAccessChain %47 %31 %39
OpStore %70 %69
%72 = OpAccessChain %35 %16 %32 %33
%73 = OpLoad %5 %72
%74 = OpAccessChain %47 %27 %33
OpStore %74 %73
%76 = OpAccessChain %35 %16 %32 %39
%77 = OpLoad %5 %76
%78 = OpAccessChain %47 %27 %39
OpStore %78 %77
OpEmitVertex
OpBranch %84
%84 = OpLabel
%34 = OpIAdd %7 %32 %39
%80 = OpULessThan %79 %34 %8
OpBranchConditional %80 %82 %85
%85 = OpLabel
OpEndPrimitive
OpReturn
OpFunctionEnd

