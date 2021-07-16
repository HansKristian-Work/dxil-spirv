#version 460
#extension GL_NV_fragment_shader_barycentric : require

layout(location = 0) pervertexNV in vec4 ATTRIB[3];
layout(location = 1) pervertexNV in vec4 ATTRIB_2[3][2];
layout(location = 3) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (((((ATTRIB[0u].x + gl_BaryCoordNV.x) + (ATTRIB[0u].x * gl_BaryCoordNV.x)) + (ATTRIB[1u].x * gl_BaryCoordNV.y)) + (ATTRIB_2[0u][INDEX].x * gl_BaryCoordNV.z)) + ((ATTRIB_2[1u][1u].x + ATTRIB_2[2u][0u].x) * gl_BaryCoordNoPerspNV.y)) + ((ATTRIB_2[0u][1u].x + ATTRIB_2[1u][0u].x) * gl_BaryCoordNoPerspNV.x);
    SV_Target.y = (((((ATTRIB[0u].y + gl_BaryCoordNV.y) + (ATTRIB[0u].y * gl_BaryCoordNV.x)) + (ATTRIB[1u].y * gl_BaryCoordNV.y)) + (ATTRIB_2[0u][INDEX].y * gl_BaryCoordNV.z)) + ((ATTRIB_2[1u][1u].y + ATTRIB_2[2u][0u].y) * gl_BaryCoordNoPerspNV.y)) + ((ATTRIB_2[0u][1u].y + ATTRIB_2[1u][0u].y) * gl_BaryCoordNoPerspNV.x);
    SV_Target.z = (((((ATTRIB[0u].z + gl_BaryCoordNoPerspNV.y) + (ATTRIB[0u].z * gl_BaryCoordNV.x)) + (ATTRIB[1u].z * gl_BaryCoordNV.y)) + (ATTRIB_2[0u][INDEX].z * gl_BaryCoordNV.z)) + ((ATTRIB_2[1u][1u].z + ATTRIB_2[2u][0u].z) * gl_BaryCoordNoPerspNV.y)) + ((ATTRIB_2[0u][1u].z + ATTRIB_2[1u][0u].z) * gl_BaryCoordNoPerspNV.x);
    SV_Target.w = (((((ATTRIB[0u].w + gl_BaryCoordNoPerspNV.x) + (ATTRIB[0u].w * gl_BaryCoordNV.x)) + (ATTRIB[1u].w * gl_BaryCoordNV.y)) + (ATTRIB_2[0u][INDEX].w * gl_BaryCoordNV.z)) + ((ATTRIB_2[1u][1u].w + ATTRIB_2[2u][0u].w) * gl_BaryCoordNoPerspNV.y)) + ((ATTRIB_2[0u][1u].w + ATTRIB_2[1u][0u].w) * gl_BaryCoordNoPerspNV.x);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 162
; Schema: 0
OpCapability Shader
OpCapability FragmentBarycentricNV
OpExtension "SPV_NV_fragment_shader_barycentric"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %16 %19 %20 %22 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "ATTRIB"
OpName %16 "ATTRIB_2"
OpName %19 "SV_Barycentrics"
OpName %20 "SV_Barycentrics_1"
OpName %22 "INDEX"
OpName %24 "SV_Target"
OpDecorate %11 PerVertexNV
OpDecorate %11 Location 0
OpDecorate %16 PerVertexNV
OpDecorate %16 Location 1
OpDecorate %19 BuiltIn BaryCoordNV
OpDecorate %20 BuiltIn BaryCoordNoPerspNV
OpDecorate %20 Centroid
OpDecorate %22 Flat
OpDecorate %22 Location 3
OpDecorate %24 Location 0
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
%13 = OpTypeArray %6 %12
%14 = OpTypeArray %13 %8
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 3
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpVariable %18 Input
%21 = OpTypePointer Input %7
%22 = OpVariable %21 Input
%23 = OpTypePointer Output %6
%24 = OpVariable %23 Output
%26 = OpTypePointer Input %5
%28 = OpConstant %7 0
%31 = OpConstant %7 1
%155 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %160
%160 = OpLabel
%25 = OpLoad %7 %22
%27 = OpAccessChain %26 %20 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %26 %20 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %26 %19 %28
%34 = OpLoad %5 %33
%35 = OpAccessChain %26 %19 %31
%36 = OpLoad %5 %35
%37 = OpAccessChain %26 %19 %12
%38 = OpLoad %5 %37
%39 = OpAccessChain %26 %11 %28 %28
%40 = OpLoad %5 %39
%41 = OpAccessChain %26 %11 %28 %31
%42 = OpLoad %5 %41
%43 = OpAccessChain %26 %11 %28 %12
%44 = OpLoad %5 %43
%45 = OpAccessChain %26 %11 %28 %8
%46 = OpLoad %5 %45
%47 = OpAccessChain %26 %11 %28 %28
%48 = OpLoad %5 %47
%49 = OpAccessChain %26 %11 %28 %31
%50 = OpLoad %5 %49
%51 = OpAccessChain %26 %11 %28 %12
%52 = OpLoad %5 %51
%53 = OpAccessChain %26 %11 %28 %8
%54 = OpLoad %5 %53
%55 = OpFMul %5 %48 %34
%56 = OpFMul %5 %50 %34
%57 = OpFMul %5 %52 %34
%58 = OpFMul %5 %54 %34
%59 = OpAccessChain %26 %11 %31 %28
%60 = OpLoad %5 %59
%61 = OpAccessChain %26 %11 %31 %31
%62 = OpLoad %5 %61
%63 = OpAccessChain %26 %11 %31 %12
%64 = OpLoad %5 %63
%65 = OpAccessChain %26 %11 %31 %8
%66 = OpLoad %5 %65
%67 = OpFMul %5 %60 %36
%68 = OpFMul %5 %62 %36
%69 = OpFMul %5 %64 %36
%70 = OpFMul %5 %66 %36
%71 = OpAccessChain %26 %16 %28 %25 %28
%72 = OpLoad %5 %71
%73 = OpAccessChain %26 %16 %28 %25 %31
%74 = OpLoad %5 %73
%75 = OpAccessChain %26 %16 %28 %25 %12
%76 = OpLoad %5 %75
%77 = OpAccessChain %26 %16 %28 %25 %8
%78 = OpLoad %5 %77
%79 = OpFMul %5 %72 %38
%80 = OpFMul %5 %74 %38
%81 = OpFMul %5 %76 %38
%82 = OpFMul %5 %78 %38
%83 = OpAccessChain %26 %16 %31 %28 %28
%84 = OpLoad %5 %83
%85 = OpAccessChain %26 %16 %31 %28 %31
%86 = OpLoad %5 %85
%87 = OpAccessChain %26 %16 %31 %28 %12
%88 = OpLoad %5 %87
%89 = OpAccessChain %26 %16 %31 %28 %8
%90 = OpLoad %5 %89
%91 = OpAccessChain %26 %16 %12 %28 %28
%92 = OpLoad %5 %91
%93 = OpAccessChain %26 %16 %12 %28 %31
%94 = OpLoad %5 %93
%95 = OpAccessChain %26 %16 %12 %28 %12
%96 = OpLoad %5 %95
%97 = OpAccessChain %26 %16 %12 %28 %8
%98 = OpLoad %5 %97
%99 = OpAccessChain %26 %16 %28 %31 %28
%100 = OpLoad %5 %99
%101 = OpAccessChain %26 %16 %28 %31 %31
%102 = OpLoad %5 %101
%103 = OpAccessChain %26 %16 %28 %31 %12
%104 = OpLoad %5 %103
%105 = OpAccessChain %26 %16 %28 %31 %8
%106 = OpLoad %5 %105
%107 = OpAccessChain %26 %16 %31 %31 %28
%108 = OpLoad %5 %107
%109 = OpAccessChain %26 %16 %31 %31 %31
%110 = OpLoad %5 %109
%111 = OpAccessChain %26 %16 %31 %31 %12
%112 = OpLoad %5 %111
%113 = OpAccessChain %26 %16 %31 %31 %8
%114 = OpLoad %5 %113
%115 = OpFAdd %5 %108 %92
%116 = OpFMul %5 %115 %32
%117 = OpFAdd %5 %100 %84
%118 = OpFMul %5 %117 %29
%119 = OpFAdd %5 %40 %34
%120 = OpFAdd %5 %119 %55
%121 = OpFAdd %5 %120 %67
%122 = OpFAdd %5 %121 %79
%123 = OpFAdd %5 %122 %116
%124 = OpFAdd %5 %123 %118
%125 = OpFAdd %5 %110 %94
%126 = OpFMul %5 %125 %32
%127 = OpFAdd %5 %102 %86
%128 = OpFMul %5 %127 %29
%129 = OpFAdd %5 %42 %36
%130 = OpFAdd %5 %129 %56
%131 = OpFAdd %5 %130 %68
%132 = OpFAdd %5 %131 %80
%133 = OpFAdd %5 %132 %126
%134 = OpFAdd %5 %133 %128
%135 = OpFAdd %5 %112 %96
%136 = OpFMul %5 %135 %32
%137 = OpFAdd %5 %104 %88
%138 = OpFMul %5 %137 %29
%139 = OpFAdd %5 %44 %32
%140 = OpFAdd %5 %139 %57
%141 = OpFAdd %5 %140 %69
%142 = OpFAdd %5 %141 %81
%143 = OpFAdd %5 %142 %136
%144 = OpFAdd %5 %143 %138
%145 = OpFAdd %5 %114 %98
%146 = OpFMul %5 %145 %32
%147 = OpFAdd %5 %106 %90
%148 = OpFMul %5 %147 %29
%149 = OpFAdd %5 %46 %29
%150 = OpFAdd %5 %149 %58
%151 = OpFAdd %5 %150 %70
%152 = OpFAdd %5 %151 %82
%153 = OpFAdd %5 %152 %146
%154 = OpFAdd %5 %153 %148
%156 = OpAccessChain %155 %24 %28
OpStore %156 %124
%157 = OpAccessChain %155 %24 %31
OpStore %157 %134
%158 = OpAccessChain %155 %24 %12
OpStore %158 %144
%159 = OpAccessChain %155 %24 %8
OpStore %159 %154
OpReturn
OpFunctionEnd
#endif
