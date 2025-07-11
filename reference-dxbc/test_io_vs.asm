SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %8 %9 %10 %11 %14 %17 %19 %21 %22 %23
OpName %3 "main"
OpName %8 "POSITION"
OpName %9 "NORMAL"
OpName %10 "TANGENT"
OpName %11 "TANGENT_1"
OpName %14 "COLOR_1"
OpName %17 "SV_POSITION"
OpName %19 "NORMAL"
OpName %21 "COLOR"
OpName %22 "TANGENT"
OpName %23 "TANGENT_1"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %10 Location 2
OpDecorate %11 Location 3
OpDecorate %14 Location 4
OpDecorate %17 BuiltIn Position
OpDecorate %19 Location 1
OpDecorate %21 Location 1
OpDecorate %21 Component 3
OpDecorate %22 Location 2
OpDecorate %23 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpVariable %7 Input
%12 = OpTypeInt 32 0
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpTypePointer Output %6
%19 = OpVariable %18 Output
%20 = OpTypePointer Output %12
%21 = OpVariable %20 Output
%22 = OpVariable %18 Output
%23 = OpVariable %18 Output
%24 = OpTypePointer Input %5
%26 = OpConstant %12 2
%29 = OpConstant %12 1
%32 = OpConstant %12 0
%35 = OpConstant %5 1
%36 = OpTypePointer Output %5
%41 = OpConstant %12 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %24 %8 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %24 %8 %32
%33 = OpLoad %5 %31
%37 = OpAccessChain %36 %17 %32
OpStore %37 %33
%38 = OpAccessChain %36 %17 %29
OpStore %38 %30
%39 = OpAccessChain %36 %17 %26
OpStore %39 %27
%40 = OpAccessChain %36 %17 %41
OpStore %40 %35
%42 = OpAccessChain %24 %9 %32
%43 = OpLoad %5 %42
%44 = OpAccessChain %24 %9 %29
%45 = OpLoad %5 %44
%46 = OpAccessChain %24 %9 %26
%47 = OpLoad %5 %46
%49 = OpAccessChain %36 %19 %32
OpStore %49 %43
%50 = OpAccessChain %36 %19 %29
OpStore %50 %45
%51 = OpAccessChain %36 %19 %26
OpStore %51 %47
%52 = OpLoad %12 %14
OpStore %21 %52
%53 = OpAccessChain %24 %10 %32
%54 = OpLoad %5 %53
%55 = OpAccessChain %24 %10 %29
%56 = OpLoad %5 %55
%57 = OpAccessChain %24 %10 %26
%58 = OpLoad %5 %57
%60 = OpAccessChain %36 %22 %32
OpStore %60 %54
%61 = OpAccessChain %36 %22 %29
OpStore %61 %56
%62 = OpAccessChain %36 %22 %26
OpStore %62 %58
%63 = OpAccessChain %24 %11 %32
%64 = OpLoad %5 %63
%65 = OpAccessChain %36 %23 %32
OpStore %65 %64
%66 = OpAccessChain %24 %11 %29
%67 = OpLoad %5 %66
%68 = OpAccessChain %36 %23 %29
OpStore %68 %67
%69 = OpAccessChain %24 %11 %26
%70 = OpLoad %5 %69
%71 = OpAccessChain %36 %23 %26
OpStore %71 %70
OpReturn
OpFunctionEnd

