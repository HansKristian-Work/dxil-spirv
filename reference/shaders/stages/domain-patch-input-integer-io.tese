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
    float _111 = float(CVS[1u]) + float(int(uint(BVS[0u])));
    gl_Position.x = ((((float(CV.x) + float(int(uint(BV.x)))) + A[0u]) + _111) + float(int(uint(BVSS[0u].x)))) + float(CVSS[1u].x);
    gl_Position.y = ((((float(int(uint(BV.y))) + float(int(uint(B)))) + float(CV.y)) + _111) + float(int(uint(BVSS[0u].y)))) + float(CVSS[1u].y);
    gl_Position.z = ((((float(int(uint(BV.z))) + float(C)) + float(CV.z)) + _111) + float(int(uint(BVSS[0u].z)))) + float(CVSS[1u].z);
    gl_Position.w = ((((float(int(uint(BV.w))) + 1.0) + float(CV.w)) + _111) + float(int(uint(BVSS[0u].w)))) + float(CVSS[1u].w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 140
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
%128 = OpConstant %5 1
%133 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %138
%138 = OpLabel
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
%72 = OpConvertUToF %5 %56
%73 = OpConvertUToF %5 %58
%74 = OpConvertUToF %5 %60
%75 = OpConvertUToF %5 %62
%76 = OpAccessChain %15 %28 %42
%77 = OpLoad %14 %76
%78 = OpBitcast %6 %77
%79 = OpConvertSToF %5 %78
%80 = OpAccessChain %17 %31 %46
%81 = OpLoad %6 %80
%82 = OpConvertUToF %5 %81
%83 = OpAccessChain %15 %34 %42 %42
%84 = OpLoad %14 %83
%85 = OpBitcast %6 %84
%86 = OpAccessChain %15 %34 %42 %46
%87 = OpLoad %14 %86
%88 = OpBitcast %6 %87
%89 = OpAccessChain %15 %34 %42 %25
%90 = OpLoad %14 %89
%91 = OpBitcast %6 %90
%92 = OpAccessChain %15 %34 %42 %7
%93 = OpLoad %14 %92
%94 = OpBitcast %6 %93
%95 = OpConvertSToF %5 %85
%96 = OpConvertSToF %5 %88
%97 = OpConvertSToF %5 %91
%98 = OpConvertSToF %5 %94
%99 = OpAccessChain %17 %37 %46 %42
%100 = OpLoad %6 %99
%101 = OpAccessChain %17 %37 %46 %46
%102 = OpLoad %6 %101
%103 = OpAccessChain %17 %37 %46 %25
%104 = OpLoad %6 %103
%105 = OpAccessChain %17 %37 %46 %7
%106 = OpLoad %6 %105
%107 = OpConvertUToF %5 %100
%108 = OpConvertUToF %5 %102
%109 = OpConvertUToF %5 %104
%110 = OpConvertUToF %5 %106
%111 = OpFAdd %5 %82 %79
%112 = OpFAdd %5 %72 %68
%113 = OpFAdd %5 %112 %65
%114 = OpFAdd %5 %113 %111
%115 = OpFAdd %5 %114 %95
%116 = OpFAdd %5 %115 %107
%117 = OpFAdd %5 %69 %66
%118 = OpFAdd %5 %117 %73
%119 = OpFAdd %5 %118 %111
%120 = OpFAdd %5 %119 %96
%121 = OpFAdd %5 %120 %108
%122 = OpFAdd %5 %70 %67
%123 = OpFAdd %5 %122 %74
%124 = OpFAdd %5 %123 %111
%125 = OpFAdd %5 %124 %97
%126 = OpFAdd %5 %125 %109
%127 = OpFAdd %5 %71 %128
%129 = OpFAdd %5 %127 %75
%130 = OpFAdd %5 %129 %111
%131 = OpFAdd %5 %130 %98
%132 = OpFAdd %5 %131 %110
%134 = OpAccessChain %133 %13 %42
OpStore %134 %116
%135 = OpAccessChain %133 %13 %46
OpStore %135 %121
%136 = OpAccessChain %133 %13 %25
OpStore %136 %126
%137 = OpAccessChain %133 %13 %7
OpStore %137 %132
OpReturn
OpFunctionEnd
#endif
