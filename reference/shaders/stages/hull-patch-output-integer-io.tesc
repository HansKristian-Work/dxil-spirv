#version 460
layout(vertices = 3) out;

layout(location = 0) in int A[];
layout(location = 0, component = 1) in uint B[];
layout(location = 0) out float A_1[3];
layout(location = 1) patch out int B_1;
layout(location = 1, component = 1) patch out uint C;
layout(location = 5) patch out ivec4 BV;
layout(location = 6) patch out uvec4 CV;
layout(location = 1, component = 2) patch out int BVS[2];
layout(location = 2) patch out uint CVS[2];
layout(location = 7) patch out ivec4 BVSS[2];
layout(location = 9) patch out uvec4 CVSS[2];

void hull_main()
{
    A_1[gl_InvocationID] = float(B[1u]) + float(int(uint(A[0u])));
}

void patch_main()
{
    gl_TessLevelOuter[0u] = float(int(uint(A[0u])));
    gl_TessLevelOuter[1u] = float(B[1u]);
    gl_TessLevelOuter[2u] = 4.0;
    gl_TessLevelInner[0u] = A_1[1u] + A_1[0u];
    B_1 = int(10u);
    C = 20u;
    BV.x = int(1u);
    BV.y = int(2u);
    BV.z = int(3u);
    BV.w = int(4u);
    CV.x = 5u;
    CV.y = 6u;
    CV.z = 7u;
    CV.w = 8u;
    BVS[0u] = int(50u);
    BVS[1u] = int(60u);
    CVS[0u] = 70u;
    CVS[1u] = 80u;
    BVSS[0u].x = int(50u);
    BVSS[0u].y = int(60u);
    BVSS[0u].z = int(70u);
    BVSS[0u].w = int(80u);
    BVSS[1u].x = int(51u);
    BVSS[1u].y = int(52u);
    BVSS[1u].z = int(53u);
    BVSS[1u].w = int(54u);
    CVSS[0u].x = 70u;
    CVSS[0u].y = 71u;
    CVSS[0u].z = 72u;
    CVSS[0u].w = 73u;
    CVSS[1u].x = 80u;
    CVSS[1u].y = 81u;
    CVSS[1u].z = 82u;
    CVSS[1u].w = 83u;
}

void main()
{
    hull_main();
    barrier();
    if (gl_InvocationID == 0u)
    {
        patch_main();
    }
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 159
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %13 %18 %22 %25 %27 %29 %32 %35 %37 %39 %42 %45 %64
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCcw
OpExecutionMode %3 OutputVertices 3
OpName %3 "main"
OpName %10 "A"
OpName %13 "B"
OpName %18 "A"
OpName %22 "SV_TessFactor"
OpName %25 "SV_InsideTessFactor"
OpName %27 "B"
OpName %29 "C"
OpName %32 "BV"
OpName %35 "CV"
OpName %37 "BVS"
OpName %39 "CVS"
OpName %42 "BVSS"
OpName %45 "CVSS"
OpName %46 "hull_main"
OpName %48 "patch_main"
OpDecorate %10 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %18 Location 0
OpDecorate %22 BuiltIn TessLevelOuter
OpDecorate %22 Patch
OpDecorate %25 BuiltIn TessLevelInner
OpDecorate %25 Patch
OpDecorate %27 Location 1
OpDecorate %27 Patch
OpDecorate %29 Location 1
OpDecorate %29 Component 1
OpDecorate %29 Patch
OpDecorate %32 Location 5
OpDecorate %32 Patch
OpDecorate %35 Location 6
OpDecorate %35 Patch
OpDecorate %37 Location 1
OpDecorate %37 Component 2
OpDecorate %37 Patch
OpDecorate %39 Location 2
OpDecorate %39 Patch
OpDecorate %42 Location 7
OpDecorate %42 Patch
OpDecorate %45 Location 9
OpDecorate %45 Patch
OpDecorate %64 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeInt 32 0
%7 = OpConstant %6 2
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeArray %6 %7
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypeFloat 32
%15 = OpConstant %6 3
%16 = OpTypeArray %14 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpConstant %6 4
%20 = OpTypeArray %14 %19
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%23 = OpTypeArray %14 %7
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpTypePointer Output %5
%27 = OpVariable %26 Output
%28 = OpTypePointer Output %6
%29 = OpVariable %28 Output
%30 = OpTypeVector %5 4
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%33 = OpTypeVector %6 4
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%36 = OpTypePointer Output %8
%37 = OpVariable %36 Output
%38 = OpTypePointer Output %11
%39 = OpVariable %38 Output
%40 = OpTypeArray %30 %7
%41 = OpTypePointer Output %40
%42 = OpVariable %41 Output
%43 = OpTypeArray %33 %7
%44 = OpTypePointer Output %43
%45 = OpVariable %44 Output
%50 = OpTypePointer Input %5
%52 = OpConstant %6 0
%56 = OpTypePointer Input %6
%58 = OpConstant %6 1
%62 = OpTypePointer Output %14
%64 = OpVariable %56 Input
%81 = OpConstant %14 4
%83 = OpConstant %6 10
%85 = OpConstant %6 20
%95 = OpConstant %6 5
%97 = OpConstant %6 6
%99 = OpConstant %6 7
%101 = OpConstant %6 8
%103 = OpConstant %6 50
%106 = OpConstant %6 60
%109 = OpConstant %6 70
%111 = OpConstant %6 80
%121 = OpConstant %6 51
%124 = OpConstant %6 52
%127 = OpConstant %6 53
%130 = OpConstant %6 54
%134 = OpConstant %6 71
%136 = OpConstant %6 72
%138 = OpConstant %6 73
%141 = OpConstant %6 81
%143 = OpConstant %6 82
%145 = OpConstant %6 83
%148 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %151
%151 = OpLabel
%146 = OpFunctionCall %1 %46
%147 = OpLoad %6 %64
%149 = OpIEqual %148 %147 %52
OpControlBarrier %7 %19 %52
OpSelectionMerge %153 None
OpBranchConditional %149 %152 %153
%152 = OpLabel
%150 = OpFunctionCall %1 %48
OpBranch %153
%153 = OpLabel
OpReturn
OpFunctionEnd
%46 = OpFunction %1 None %2
%47 = OpLabel
OpBranch %155
%155 = OpLabel
%51 = OpAccessChain %50 %10 %52
%53 = OpLoad %5 %51
%54 = OpBitcast %6 %53
%55 = OpConvertSToF %14 %54
%57 = OpAccessChain %56 %13 %58
%59 = OpLoad %6 %57
%60 = OpConvertUToF %14 %59
%61 = OpFAdd %14 %60 %55
%65 = OpLoad %6 %64
%63 = OpAccessChain %62 %18 %65
OpStore %63 %61
OpReturn
OpFunctionEnd
%48 = OpFunction %1 None %2
%49 = OpLabel
OpBranch %157
%157 = OpLabel
%66 = OpAccessChain %62 %18 %52
%67 = OpLoad %14 %66
%68 = OpAccessChain %62 %18 %58
%69 = OpLoad %14 %68
%70 = OpFAdd %14 %69 %67
%71 = OpAccessChain %50 %10 %52
%72 = OpLoad %5 %71
%73 = OpBitcast %6 %72
%74 = OpConvertSToF %14 %73
%75 = OpAccessChain %56 %13 %58
%76 = OpLoad %6 %75
%77 = OpConvertUToF %14 %76
%78 = OpAccessChain %62 %22 %52
OpStore %78 %74
%79 = OpAccessChain %62 %22 %58
OpStore %79 %77
%80 = OpAccessChain %62 %22 %7
OpStore %80 %81
%82 = OpAccessChain %62 %25 %52
OpStore %82 %70
%84 = OpBitcast %5 %83
OpStore %27 %84
OpStore %29 %85
%86 = OpAccessChain %26 %32 %52
%87 = OpBitcast %5 %58
OpStore %86 %87
%88 = OpAccessChain %26 %32 %58
%89 = OpBitcast %5 %7
OpStore %88 %89
%90 = OpAccessChain %26 %32 %7
%91 = OpBitcast %5 %15
OpStore %90 %91
%92 = OpAccessChain %26 %32 %15
%93 = OpBitcast %5 %19
OpStore %92 %93
%94 = OpAccessChain %28 %35 %52
OpStore %94 %95
%96 = OpAccessChain %28 %35 %58
OpStore %96 %97
%98 = OpAccessChain %28 %35 %7
OpStore %98 %99
%100 = OpAccessChain %28 %35 %15
OpStore %100 %101
%102 = OpAccessChain %26 %37 %52
%104 = OpBitcast %5 %103
OpStore %102 %104
%105 = OpAccessChain %26 %37 %58
%107 = OpBitcast %5 %106
OpStore %105 %107
%108 = OpAccessChain %28 %39 %52
OpStore %108 %109
%110 = OpAccessChain %28 %39 %58
OpStore %110 %111
%112 = OpAccessChain %26 %42 %52 %52
%113 = OpBitcast %5 %103
OpStore %112 %113
%114 = OpAccessChain %26 %42 %52 %58
%115 = OpBitcast %5 %106
OpStore %114 %115
%116 = OpAccessChain %26 %42 %52 %7
%117 = OpBitcast %5 %109
OpStore %116 %117
%118 = OpAccessChain %26 %42 %52 %15
%119 = OpBitcast %5 %111
OpStore %118 %119
%120 = OpAccessChain %26 %42 %58 %52
%122 = OpBitcast %5 %121
OpStore %120 %122
%123 = OpAccessChain %26 %42 %58 %58
%125 = OpBitcast %5 %124
OpStore %123 %125
%126 = OpAccessChain %26 %42 %58 %7
%128 = OpBitcast %5 %127
OpStore %126 %128
%129 = OpAccessChain %26 %42 %58 %15
%131 = OpBitcast %5 %130
OpStore %129 %131
%132 = OpAccessChain %28 %45 %52 %52
OpStore %132 %109
%133 = OpAccessChain %28 %45 %52 %58
OpStore %133 %134
%135 = OpAccessChain %28 %45 %52 %7
OpStore %135 %136
%137 = OpAccessChain %28 %45 %52 %15
OpStore %137 %138
%139 = OpAccessChain %28 %45 %58 %52
OpStore %139 %111
%140 = OpAccessChain %28 %45 %58 %58
OpStore %140 %141
%142 = OpAccessChain %28 %45 %58 %7
OpStore %142 %143
%144 = OpAccessChain %28 %45 %58 %15
OpStore %144 %145
OpReturn
OpFunctionEnd
#endif
