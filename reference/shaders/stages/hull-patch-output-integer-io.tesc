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
; Bound: 162
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationControl %3 "main" %10 %13 %18 %22 %26 %28 %30 %33 %36 %39 %42 %45 %48 %67
OpExecutionMode %3 Triangles
OpExecutionMode %3 SpacingEqual
OpExecutionMode %3 VertexOrderCcw
OpExecutionMode %3 OutputVertices 3
OpName %3 "main"
OpName %10 "A"
OpName %13 "B"
OpName %18 "A"
OpName %22 "SV_TessFactor"
OpName %26 "SV_InsideTessFactor"
OpName %28 "B"
OpName %30 "C"
OpName %33 "BV"
OpName %36 "CV"
OpName %39 "BVS"
OpName %42 "CVS"
OpName %45 "BVSS"
OpName %48 "CVSS"
OpName %49 "hull_main"
OpName %51 "patch_main"
OpDecorate %10 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %18 Location 0
OpDecorate %22 BuiltIn TessLevelOuter
OpDecorate %22 Patch
OpDecorate %26 BuiltIn TessLevelInner
OpDecorate %26 Patch
OpDecorate %28 Location 1
OpDecorate %28 Patch
OpDecorate %30 Location 1
OpDecorate %30 Component 1
OpDecorate %30 Patch
OpDecorate %33 Location 5
OpDecorate %33 Patch
OpDecorate %36 Location 6
OpDecorate %36 Patch
OpDecorate %39 Location 1
OpDecorate %39 Component 2
OpDecorate %39 Patch
OpDecorate %42 Location 2
OpDecorate %42 Patch
OpDecorate %45 Location 7
OpDecorate %45 Patch
OpDecorate %48 Location 9
OpDecorate %48 Patch
OpDecorate %67 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeInt 32 0
%7 = OpConstant %6 32
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
%23 = OpConstant %6 2
%24 = OpTypeArray %14 %23
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%27 = OpTypePointer Output %5
%28 = OpVariable %27 Output
%29 = OpTypePointer Output %6
%30 = OpVariable %29 Output
%31 = OpTypeVector %5 4
%32 = OpTypePointer Output %31
%33 = OpVariable %32 Output
%34 = OpTypeVector %6 4
%35 = OpTypePointer Output %34
%36 = OpVariable %35 Output
%37 = OpTypeArray %5 %23
%38 = OpTypePointer Output %37
%39 = OpVariable %38 Output
%40 = OpTypeArray %6 %23
%41 = OpTypePointer Output %40
%42 = OpVariable %41 Output
%43 = OpTypeArray %31 %23
%44 = OpTypePointer Output %43
%45 = OpVariable %44 Output
%46 = OpTypeArray %34 %23
%47 = OpTypePointer Output %46
%48 = OpVariable %47 Output
%53 = OpTypePointer Input %5
%55 = OpConstant %6 0
%59 = OpTypePointer Input %6
%61 = OpConstant %6 1
%65 = OpTypePointer Output %14
%67 = OpVariable %59 Input
%84 = OpConstant %14 4
%86 = OpConstant %6 10
%88 = OpConstant %6 20
%98 = OpConstant %6 5
%100 = OpConstant %6 6
%102 = OpConstant %6 7
%104 = OpConstant %6 8
%106 = OpConstant %6 50
%109 = OpConstant %6 60
%112 = OpConstant %6 70
%114 = OpConstant %6 80
%124 = OpConstant %6 51
%127 = OpConstant %6 52
%130 = OpConstant %6 53
%133 = OpConstant %6 54
%137 = OpConstant %6 71
%139 = OpConstant %6 72
%141 = OpConstant %6 73
%144 = OpConstant %6 81
%146 = OpConstant %6 82
%148 = OpConstant %6 83
%151 = OpTypeBool
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %154
%154 = OpLabel
%149 = OpFunctionCall %1 %49
%150 = OpLoad %6 %67
%152 = OpIEqual %151 %150 %55
OpControlBarrier %23 %19 %55
OpSelectionMerge %156 None
OpBranchConditional %152 %155 %156
%155 = OpLabel
%153 = OpFunctionCall %1 %51
OpBranch %156
%156 = OpLabel
OpReturn
OpFunctionEnd
%49 = OpFunction %1 None %2
%50 = OpLabel
OpBranch %158
%158 = OpLabel
%54 = OpAccessChain %53 %10 %55
%56 = OpLoad %5 %54
%57 = OpBitcast %6 %56
%58 = OpConvertSToF %14 %57
%60 = OpAccessChain %59 %13 %61
%62 = OpLoad %6 %60
%63 = OpConvertUToF %14 %62
%64 = OpFAdd %14 %63 %58
%68 = OpLoad %6 %67
%66 = OpAccessChain %65 %18 %68
OpStore %66 %64
OpReturn
OpFunctionEnd
%51 = OpFunction %1 None %2
%52 = OpLabel
OpBranch %160
%160 = OpLabel
%69 = OpAccessChain %65 %18 %55
%70 = OpLoad %14 %69
%71 = OpAccessChain %65 %18 %61
%72 = OpLoad %14 %71
%73 = OpFAdd %14 %72 %70
%74 = OpAccessChain %53 %10 %55
%75 = OpLoad %5 %74
%76 = OpBitcast %6 %75
%77 = OpConvertSToF %14 %76
%78 = OpAccessChain %59 %13 %61
%79 = OpLoad %6 %78
%80 = OpConvertUToF %14 %79
%81 = OpAccessChain %65 %22 %55
OpStore %81 %77
%82 = OpAccessChain %65 %22 %61
OpStore %82 %80
%83 = OpAccessChain %65 %22 %23
OpStore %83 %84
%85 = OpAccessChain %65 %26 %55
OpStore %85 %73
%87 = OpBitcast %5 %86
OpStore %28 %87
OpStore %30 %88
%89 = OpAccessChain %27 %33 %55
%90 = OpBitcast %5 %61
OpStore %89 %90
%91 = OpAccessChain %27 %33 %61
%92 = OpBitcast %5 %23
OpStore %91 %92
%93 = OpAccessChain %27 %33 %23
%94 = OpBitcast %5 %15
OpStore %93 %94
%95 = OpAccessChain %27 %33 %15
%96 = OpBitcast %5 %19
OpStore %95 %96
%97 = OpAccessChain %29 %36 %55
OpStore %97 %98
%99 = OpAccessChain %29 %36 %61
OpStore %99 %100
%101 = OpAccessChain %29 %36 %23
OpStore %101 %102
%103 = OpAccessChain %29 %36 %15
OpStore %103 %104
%105 = OpAccessChain %27 %39 %55
%107 = OpBitcast %5 %106
OpStore %105 %107
%108 = OpAccessChain %27 %39 %61
%110 = OpBitcast %5 %109
OpStore %108 %110
%111 = OpAccessChain %29 %42 %55
OpStore %111 %112
%113 = OpAccessChain %29 %42 %61
OpStore %113 %114
%115 = OpAccessChain %27 %45 %55 %55
%116 = OpBitcast %5 %106
OpStore %115 %116
%117 = OpAccessChain %27 %45 %55 %61
%118 = OpBitcast %5 %109
OpStore %117 %118
%119 = OpAccessChain %27 %45 %55 %23
%120 = OpBitcast %5 %112
OpStore %119 %120
%121 = OpAccessChain %27 %45 %55 %15
%122 = OpBitcast %5 %114
OpStore %121 %122
%123 = OpAccessChain %27 %45 %61 %55
%125 = OpBitcast %5 %124
OpStore %123 %125
%126 = OpAccessChain %27 %45 %61 %61
%128 = OpBitcast %5 %127
OpStore %126 %128
%129 = OpAccessChain %27 %45 %61 %23
%131 = OpBitcast %5 %130
OpStore %129 %131
%132 = OpAccessChain %27 %45 %61 %15
%134 = OpBitcast %5 %133
OpStore %132 %134
%135 = OpAccessChain %29 %48 %55 %55
OpStore %135 %112
%136 = OpAccessChain %29 %48 %55 %61
OpStore %136 %137
%138 = OpAccessChain %29 %48 %55 %23
OpStore %138 %139
%140 = OpAccessChain %29 %48 %55 %15
OpStore %140 %141
%142 = OpAccessChain %29 %48 %61 %55
OpStore %142 %114
%143 = OpAccessChain %29 %48 %61 %61
OpStore %143 %144
%145 = OpAccessChain %29 %48 %61 %23
OpStore %145 %146
%147 = OpAccessChain %29 %48 %61 %15
OpStore %147 %148
OpReturn
OpFunctionEnd
#endif
