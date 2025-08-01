SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 137
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability VulkanMemoryModel
%84 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint TessellationControl %3 "main" %11 %15 %18 %22 %25 %27 %29 %30 %33 %37 %43 %80
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 PointMode
OpExecutionMode %3 OutputVertices 4
OpName %3 "main"
OpName %11 "SV_POSITION"
OpName %15 "NORMAL"
OpName %18 "FACTOR"
OpName %22 "SV_POSITION"
OpName %25 "NORMAL"
OpName %27 "INSTANCE_ID"
OpName %29 "TANGENT"
OpName %30 "TANGENT_1"
OpName %33 "SV_TESSFACTOR"
OpName %37 "SV_INSIDETESSFACTOR"
OpName %38 "hull_main"
OpName %40 "patch_main"
OpDecorate %11 BuiltIn Position
OpDecorate %15 Location 1
OpDecorate %18 Location 1
OpDecorate %18 Component 3
OpDecorate %22 Location 0
OpDecorate %25 Location 1
OpDecorate %27 Location 4
OpDecorate %27 Patch
OpDecorate %29 Location 5
OpDecorate %29 Patch
OpDecorate %30 Location 6
OpDecorate %30 Patch
OpDecorate %33 BuiltIn TessLevelOuter
OpDecorate %33 Patch
OpDecorate %37 BuiltIn TessLevelInner
OpDecorate %37 Patch
OpDecorate %43 BuiltIn InvocationId
OpDecorate %80 BuiltIn PrimitiveId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 32
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 3
%13 = OpTypeArray %12 %8
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeArray %5 %8
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpConstant %7 4
%20 = OpTypeArray %6 %19
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypeArray %12 %19
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %7
%27 = OpVariable %26 Output
%28 = OpTypePointer Output %12
%29 = OpVariable %28 Output
%30 = OpVariable %28 Output
%31 = OpTypeArray %5 %19
%32 = OpTypePointer Output %31
%33 = OpVariable %32 Output
%34 = OpConstant %7 2
%35 = OpTypeArray %5 %34
%36 = OpTypePointer Output %35
%37 = OpVariable %36 Output
%42 = OpTypePointer Input %7
%43 = OpVariable %42 Input
%45 = OpTypePointer Input %5
%47 = OpConstant %7 0
%50 = OpConstant %7 1
%55 = OpConstant %7 3
%58 = OpTypePointer Output %5
%80 = OpVariable %42 Input
%86 = OpConstant %5 64
%125 = OpTypeBool
%127 = OpConstant %7 4104
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %129
%129 = OpLabel
%123 = OpFunctionCall %1 %38
%124 = OpLoad %7 %43
%126 = OpIEqual %125 %124 %47
OpControlBarrier %34 %34 %127
OpSelectionMerge %131 None
OpBranchConditional %126 %130 %131
%130 = OpLabel
%128 = OpFunctionCall %1 %40
OpBranch %131
%131 = OpLabel
OpReturn
OpFunctionEnd
%38 = OpFunction %1 None %2
%39 = OpLabel
OpBranch %133
%133 = OpLabel
%44 = OpLoad %7 %43
%46 = OpAccessChain %45 %11 %44 %47
%48 = OpLoad %5 %46
%49 = OpAccessChain %45 %11 %44 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %45 %11 %44 %34
%53 = OpLoad %5 %52
%54 = OpAccessChain %45 %11 %44 %55
%56 = OpLoad %5 %54
%60 = OpLoad %7 %43
%59 = OpAccessChain %58 %22 %60 %47
OpStore %59 %48
%62 = OpLoad %7 %43
%61 = OpAccessChain %58 %22 %62 %50
OpStore %61 %51
%64 = OpLoad %7 %43
%63 = OpAccessChain %58 %22 %64 %34
OpStore %63 %53
%66 = OpLoad %7 %43
%65 = OpAccessChain %58 %22 %66 %55
OpStore %65 %56
%67 = OpAccessChain %45 %15 %44 %47
%68 = OpLoad %5 %67
%69 = OpAccessChain %45 %15 %44 %50
%70 = OpLoad %5 %69
%71 = OpAccessChain %45 %15 %44 %34
%72 = OpLoad %5 %71
%75 = OpLoad %7 %43
%74 = OpAccessChain %58 %25 %75 %47
OpStore %74 %68
%77 = OpLoad %7 %43
%76 = OpAccessChain %58 %25 %77 %50
OpStore %76 %70
%79 = OpLoad %7 %43
%78 = OpAccessChain %58 %25 %79 %34
OpStore %78 %72
OpReturn
OpFunctionEnd
%40 = OpFunction %1 None %2
%41 = OpLabel
OpBranch %135
%135 = OpLabel
%81 = OpLoad %7 %80
OpStore %27 %81
%82 = OpAccessChain %45 %18 %47
%83 = OpLoad %5 %82
%85 = OpExtInst %5 %84 NMin %83 %86
%87 = OpAccessChain %58 %33 %47
OpStore %87 %85
%88 = OpAccessChain %58 %33 %50
OpStore %88 %85
%89 = OpAccessChain %58 %33 %34
OpStore %89 %85
%90 = OpAccessChain %58 %33 %55
OpStore %90 %85
%91 = OpAccessChain %58 %37 %47
OpStore %91 %85
%92 = OpAccessChain %58 %37 %50
OpStore %92 %85
%93 = OpAccessChain %58 %22 %47 %47
%94 = OpLoad %5 %93
%95 = OpAccessChain %58 %22 %50 %47
%96 = OpLoad %5 %95
%97 = OpAccessChain %58 %22 %34 %47
%98 = OpLoad %5 %97
%99 = OpFSub %5 %96 %94
%100 = OpAccessChain %58 %29 %47
OpStore %100 %99
%101 = OpFSub %5 %98 %94
%102 = OpAccessChain %58 %30 %47
OpStore %102 %101
%103 = OpAccessChain %58 %22 %47 %50
%104 = OpLoad %5 %103
%105 = OpAccessChain %58 %22 %50 %50
%106 = OpLoad %5 %105
%107 = OpAccessChain %58 %22 %34 %50
%108 = OpLoad %5 %107
%109 = OpFSub %5 %106 %104
%110 = OpAccessChain %58 %29 %50
OpStore %110 %109
%111 = OpFSub %5 %108 %104
%112 = OpAccessChain %58 %30 %50
OpStore %112 %111
%113 = OpAccessChain %58 %22 %47 %34
%114 = OpLoad %5 %113
%115 = OpAccessChain %58 %22 %50 %34
%116 = OpLoad %5 %115
%117 = OpAccessChain %58 %22 %34 %34
%118 = OpLoad %5 %117
%119 = OpFSub %5 %116 %114
%120 = OpAccessChain %58 %29 %34
OpStore %120 %119
%121 = OpFSub %5 %118 %114
%122 = OpAccessChain %58 %30 %34
OpStore %122 %121
OpReturn
OpFunctionEnd

