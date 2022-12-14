#version 460
layout(triangles) in;

layout(location = 0) in float A[];
layout(location = 1) patch in int B;
layout(location = 1, component = 1) patch in uint C;
layout(location = 2) patch in ivec4 BV;
layout(location = 3) patch in uvec4 CV;
layout(location = 4) patch in int BVS[2];
layout(location = 4, component = 1) patch in uint CVS[2];
layout(location = 6) patch in ivec4 BVSS[2];
layout(location = 8) patch in uvec4 CVSS[2];

void main()
{
    float _86 = float(int(uint(BVS[0u])));
    float _92 = float(CVS[1u]);
    gl_Position.x = (((((float(CV.x) + float(int(uint(BV.x)))) + A[0u]) + _86) + _92) + float(int(uint(BVSS[0u].x)))) + float(CVSS[1u].x);
    gl_Position.y = (((((float(int(uint(BV.y))) + float(int(uint(B)))) + float(CV.y)) + _86) + _92) + float(int(uint(BVSS[0u].y)))) + float(CVSS[1u].y);
    gl_Position.z = (((((float(int(uint(BV.z))) + float(C)) + float(CV.z)) + _86) + _92) + float(int(uint(BVSS[0u].z)))) + float(CVSS[1u].z);
    gl_Position.w = (((((float(int(uint(BV.w))) + 1.0) + float(CV.w)) + _86) + _92) + float(int(uint(BVSS[0u].w)))) + float(CVSS[1u].w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 143
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %10 %13 %16 %18 %21 %24 %28 %31 %34 %37
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %10 "A"
OpName %13 "SV_Position"
OpName %16 "B"
OpName %18 "C"
OpName %21 "BV"
OpName %24 "CV"
OpName %28 "BVS"
OpName %31 "CVS"
OpName %34 "BVSS"
OpName %37 "CVSS"
OpDecorate %10 Location 0
OpDecorate %13 BuiltIn Position
OpDecorate %16 Location 1
OpDecorate %16 Patch
OpDecorate %18 Location 1
OpDecorate %18 Component 1
OpDecorate %18 Patch
OpDecorate %21 Location 2
OpDecorate %21 Patch
OpDecorate %24 Location 3
OpDecorate %24 Patch
OpDecorate %28 Location 4
OpDecorate %28 Patch
OpDecorate %31 Location 4
OpDecorate %31 Component 1
OpDecorate %31 Patch
OpDecorate %34 Location 6
OpDecorate %34 Patch
OpDecorate %37 Location 8
OpDecorate %37 Patch
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 3
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 4
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypeInt 32 1
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %6
%18 = OpVariable %17 Input
%19 = OpTypeVector %14 4
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeVector %6 4
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpConstant %6 2
%26 = OpTypeArray %14 %25
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypeArray %6 %25
%30 = OpTypePointer Input %29
%31 = OpVariable %30 Input
%32 = OpTypeArray %19 %25
%33 = OpTypePointer Input %32
%34 = OpVariable %33 Input
%35 = OpTypeArray %22 %25
%36 = OpTypePointer Input %35
%37 = OpVariable %36 Input
%42 = OpConstant %6 0
%46 = OpConstant %6 1
%63 = OpTypePointer Input %5
%75 = OpConstant %5 1
%136 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %141
%141 = OpLabel
%38 = OpLoad %14 %16
%39 = OpBitcast %6 %38
%40 = OpLoad %6 %18
%41 = OpAccessChain %15 %21 %42
%43 = OpLoad %14 %41
%44 = OpBitcast %6 %43
%45 = OpAccessChain %15 %21 %46
%47 = OpLoad %14 %45
%48 = OpBitcast %6 %47
%49 = OpAccessChain %15 %21 %25
%50 = OpLoad %14 %49
%51 = OpBitcast %6 %50
%52 = OpAccessChain %15 %21 %7
%53 = OpLoad %14 %52
%54 = OpBitcast %6 %53
%55 = OpAccessChain %17 %24 %42
%56 = OpLoad %6 %55
%57 = OpAccessChain %17 %24 %46
%58 = OpLoad %6 %57
%59 = OpAccessChain %17 %24 %25
%60 = OpLoad %6 %59
%61 = OpAccessChain %17 %24 %7
%62 = OpLoad %6 %61
%64 = OpAccessChain %63 %10 %42
%65 = OpLoad %5 %64
%66 = OpConvertSToF %5 %39
%67 = OpConvertUToF %5 %40
%68 = OpConvertSToF %5 %44
%69 = OpConvertSToF %5 %48
%70 = OpConvertSToF %5 %51
%71 = OpConvertSToF %5 %54
%72 = OpFAdd %5 %69 %66
%73 = OpFAdd %5 %70 %67
%74 = OpFAdd %5 %71 %75
%76 = OpConvertUToF %5 %56
%77 = OpConvertUToF %5 %58
%78 = OpConvertUToF %5 %60
%79 = OpConvertUToF %5 %62
%80 = OpFAdd %5 %72 %77
%81 = OpFAdd %5 %73 %78
%82 = OpFAdd %5 %74 %79
%83 = OpAccessChain %15 %28 %42
%84 = OpLoad %14 %83
%85 = OpBitcast %6 %84
%86 = OpConvertSToF %5 %85
%87 = OpFAdd %5 %80 %86
%88 = OpFAdd %5 %81 %86
%89 = OpFAdd %5 %82 %86
%90 = OpAccessChain %17 %31 %46
%91 = OpLoad %6 %90
%92 = OpConvertUToF %5 %91
%93 = OpFAdd %5 %87 %92
%94 = OpFAdd %5 %88 %92
%95 = OpFAdd %5 %89 %92
%96 = OpAccessChain %15 %34 %42 %42
%97 = OpLoad %14 %96
%98 = OpBitcast %6 %97
%99 = OpAccessChain %15 %34 %42 %46
%100 = OpLoad %14 %99
%101 = OpBitcast %6 %100
%102 = OpAccessChain %15 %34 %42 %25
%103 = OpLoad %14 %102
%104 = OpBitcast %6 %103
%105 = OpAccessChain %15 %34 %42 %7
%106 = OpLoad %14 %105
%107 = OpBitcast %6 %106
%108 = OpConvertSToF %5 %98
%109 = OpConvertSToF %5 %101
%110 = OpConvertSToF %5 %104
%111 = OpConvertSToF %5 %107
%112 = OpFAdd %5 %93 %109
%113 = OpFAdd %5 %94 %110
%114 = OpFAdd %5 %95 %111
%115 = OpAccessChain %17 %37 %46 %42
%116 = OpLoad %6 %115
%117 = OpAccessChain %17 %37 %46 %46
%118 = OpLoad %6 %117
%119 = OpAccessChain %17 %37 %46 %25
%120 = OpLoad %6 %119
%121 = OpAccessChain %17 %37 %46 %7
%122 = OpLoad %6 %121
%123 = OpConvertUToF %5 %116
%124 = OpConvertUToF %5 %118
%125 = OpConvertUToF %5 %120
%126 = OpConvertUToF %5 %122
%127 = OpFAdd %5 %76 %68
%128 = OpFAdd %5 %127 %65
%129 = OpFAdd %5 %128 %86
%130 = OpFAdd %5 %129 %92
%131 = OpFAdd %5 %130 %108
%132 = OpFAdd %5 %131 %123
%133 = OpFAdd %5 %112 %124
%134 = OpFAdd %5 %113 %125
%135 = OpFAdd %5 %114 %126
%137 = OpAccessChain %136 %13 %42
OpStore %137 %132
%138 = OpAccessChain %136 %13 %46
OpStore %138 %133
%139 = OpAccessChain %136 %13 %25
OpStore %139 %134
%140 = OpAccessChain %136 %13 %7
OpStore %140 %135
OpReturn
OpFunctionEnd
#endif
