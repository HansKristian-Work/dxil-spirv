SPIR-V:
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 84
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
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
%37 = OpTypePointer Output %5
%45 = OpConstant %12 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %82
%82 = OpLabel
%25 = OpAccessChain %24 %8 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %24 %8 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %24 %8 %32
%33 = OpLoad %5 %31
%34 = OpCompositeConstruct %15 %33 %30 %27 %35
%36 = OpCompositeExtract %5 %34 0
%38 = OpAccessChain %37 %17 %32
OpStore %38 %36
%39 = OpCompositeExtract %5 %34 1
%40 = OpAccessChain %37 %17 %29
OpStore %40 %39
%41 = OpCompositeExtract %5 %34 2
%42 = OpAccessChain %37 %17 %26
OpStore %42 %41
%43 = OpCompositeExtract %5 %34 3
%44 = OpAccessChain %37 %17 %45
OpStore %44 %43
%46 = OpAccessChain %24 %9 %32
%47 = OpLoad %5 %46
%48 = OpAccessChain %24 %9 %29
%49 = OpLoad %5 %48
%50 = OpAccessChain %24 %9 %26
%51 = OpLoad %5 %50
%52 = OpCompositeConstruct %6 %47 %49 %51
%53 = OpCompositeExtract %5 %52 0
%54 = OpAccessChain %37 %19 %32
OpStore %54 %53
%55 = OpCompositeExtract %5 %52 1
%56 = OpAccessChain %37 %19 %29
OpStore %56 %55
%57 = OpCompositeExtract %5 %52 2
%58 = OpAccessChain %37 %19 %26
OpStore %58 %57
%59 = OpLoad %12 %14
OpStore %21 %59
%60 = OpAccessChain %24 %10 %32
%61 = OpLoad %5 %60
%62 = OpAccessChain %24 %10 %29
%63 = OpLoad %5 %62
%64 = OpAccessChain %24 %10 %26
%65 = OpLoad %5 %64
%66 = OpCompositeConstruct %6 %61 %63 %65
%67 = OpCompositeExtract %5 %66 0
%68 = OpAccessChain %37 %22 %32
OpStore %68 %67
%69 = OpCompositeExtract %5 %66 1
%70 = OpAccessChain %37 %22 %29
OpStore %70 %69
%71 = OpCompositeExtract %5 %66 2
%72 = OpAccessChain %37 %22 %26
OpStore %72 %71
%73 = OpAccessChain %24 %11 %32
%74 = OpLoad %5 %73
%75 = OpAccessChain %37 %23 %32
OpStore %75 %74
%76 = OpAccessChain %24 %11 %29
%77 = OpLoad %5 %76
%78 = OpAccessChain %37 %23 %29
OpStore %78 %77
%79 = OpAccessChain %24 %11 %26
%80 = OpLoad %5 %79
%81 = OpAccessChain %37 %23 %26
OpStore %81 %80
OpReturn
OpFunctionEnd

