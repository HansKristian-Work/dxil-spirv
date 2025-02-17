#version 460
#extension GL_EXT_fragment_shader_barycentric : require

layout(location = 0) pervertexEXT in uvec4 ATTRIB[3];
layout(location = 1) pervertexEXT in uvec4 ATTRIB_2[3][2];
layout(location = 3) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = (((((uintBitsToFloat(ATTRIB[0u].x) + gl_BaryCoordEXT.x) + (uintBitsToFloat(ATTRIB[0u].x) * gl_BaryCoordEXT.x)) + (uintBitsToFloat(ATTRIB[1u].x) * gl_BaryCoordEXT.y)) + (uintBitsToFloat(ATTRIB_2[0u][INDEX].x) * gl_BaryCoordEXT.z)) + ((uintBitsToFloat(ATTRIB_2[1u][1u].x) + uintBitsToFloat(ATTRIB_2[2u][0u].x)) * gl_BaryCoordNoPerspEXT.y)) + ((uintBitsToFloat(ATTRIB_2[0u][1u].x) + uintBitsToFloat(ATTRIB_2[1u][0u].x)) * gl_BaryCoordNoPerspEXT.x);
    SV_Target.y = (((((uintBitsToFloat(ATTRIB[0u].y) + gl_BaryCoordEXT.y) + (uintBitsToFloat(ATTRIB[0u].y) * gl_BaryCoordEXT.x)) + (uintBitsToFloat(ATTRIB[1u].y) * gl_BaryCoordEXT.y)) + (uintBitsToFloat(ATTRIB_2[0u][INDEX].y) * gl_BaryCoordEXT.z)) + ((uintBitsToFloat(ATTRIB_2[1u][1u].y) + uintBitsToFloat(ATTRIB_2[2u][0u].y)) * gl_BaryCoordNoPerspEXT.y)) + ((uintBitsToFloat(ATTRIB_2[0u][1u].y) + uintBitsToFloat(ATTRIB_2[1u][0u].y)) * gl_BaryCoordNoPerspEXT.x);
    SV_Target.z = (((((uintBitsToFloat(ATTRIB[0u].z) + gl_BaryCoordNoPerspEXT.y) + (uintBitsToFloat(ATTRIB[0u].z) * gl_BaryCoordEXT.x)) + (uintBitsToFloat(ATTRIB[1u].z) * gl_BaryCoordEXT.y)) + (uintBitsToFloat(ATTRIB_2[0u][INDEX].z) * gl_BaryCoordEXT.z)) + ((uintBitsToFloat(ATTRIB_2[1u][1u].z) + uintBitsToFloat(ATTRIB_2[2u][0u].z)) * gl_BaryCoordNoPerspEXT.y)) + ((uintBitsToFloat(ATTRIB_2[0u][1u].z) + uintBitsToFloat(ATTRIB_2[1u][0u].z)) * gl_BaryCoordNoPerspEXT.x);
    SV_Target.w = (((((uintBitsToFloat(ATTRIB[0u].w) + gl_BaryCoordNoPerspEXT.x) + (uintBitsToFloat(ATTRIB[0u].w) * gl_BaryCoordEXT.x)) + (uintBitsToFloat(ATTRIB[1u].w) * gl_BaryCoordEXT.y)) + (uintBitsToFloat(ATTRIB_2[0u][INDEX].w) * gl_BaryCoordEXT.z)) + ((uintBitsToFloat(ATTRIB_2[1u][1u].w) + uintBitsToFloat(ATTRIB_2[2u][0u].w)) * gl_BaryCoordNoPerspEXT.y)) + ((uintBitsToFloat(ATTRIB_2[0u][1u].w) + uintBitsToFloat(ATTRIB_2[1u][0u].w)) * gl_BaryCoordNoPerspEXT.x);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 195
; Schema: 0
OpCapability Shader
OpCapability FragmentBarycentricKHR
OpExtension "SPV_KHR_fragment_shader_barycentric"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %15 %19 %20 %22 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "ATTRIB"
OpName %15 "ATTRIB_2"
OpName %19 "SV_Barycentrics"
OpName %20 "SV_Barycentrics_1"
OpName %22 "INDEX"
OpName %25 "SV_Target"
OpDecorate %10 PerVertexKHR
OpDecorate %10 Location 0
OpDecorate %15 PerVertexKHR
OpDecorate %15 Location 1
OpDecorate %19 BuiltIn BaryCoordKHR
OpDecorate %20 BuiltIn BaryCoordNoPerspKHR
OpDecorate %20 Centroid
OpDecorate %22 Flat
OpDecorate %22 Location 3
OpDecorate %25 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 4
%7 = OpConstant %5 3
%8 = OpTypeArray %6 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpConstant %5 2
%12 = OpTypeArray %6 %11
%13 = OpTypeArray %12 %7
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeFloat 32
%17 = OpTypeVector %16 3
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%20 = OpVariable %18 Input
%21 = OpTypePointer Input %5
%22 = OpVariable %21 Input
%23 = OpTypeVector %16 4
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%27 = OpTypePointer Input %16
%29 = OpConstant %5 0
%32 = OpConstant %5 1
%188 = OpTypePointer Output %16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %193
%193 = OpLabel
%26 = OpLoad %5 %22
%28 = OpAccessChain %27 %20 %29
%30 = OpLoad %16 %28
%31 = OpAccessChain %27 %20 %32
%33 = OpLoad %16 %31
%34 = OpAccessChain %27 %19 %29
%35 = OpLoad %16 %34
%36 = OpAccessChain %27 %19 %32
%37 = OpLoad %16 %36
%38 = OpAccessChain %27 %19 %11
%39 = OpLoad %16 %38
%40 = OpAccessChain %21 %10 %29 %29
%41 = OpLoad %5 %40
%42 = OpBitcast %16 %41
%43 = OpAccessChain %21 %10 %29 %32
%44 = OpLoad %5 %43
%45 = OpBitcast %16 %44
%46 = OpAccessChain %21 %10 %29 %11
%47 = OpLoad %5 %46
%48 = OpBitcast %16 %47
%49 = OpAccessChain %21 %10 %29 %7
%50 = OpLoad %5 %49
%51 = OpBitcast %16 %50
%52 = OpAccessChain %21 %10 %29 %29
%53 = OpLoad %5 %52
%54 = OpBitcast %16 %53
%55 = OpAccessChain %21 %10 %29 %32
%56 = OpLoad %5 %55
%57 = OpBitcast %16 %56
%58 = OpAccessChain %21 %10 %29 %11
%59 = OpLoad %5 %58
%60 = OpBitcast %16 %59
%61 = OpAccessChain %21 %10 %29 %7
%62 = OpLoad %5 %61
%63 = OpBitcast %16 %62
%64 = OpFMul %16 %54 %35
%65 = OpFMul %16 %57 %35
%66 = OpFMul %16 %60 %35
%67 = OpFMul %16 %63 %35
%68 = OpAccessChain %21 %10 %32 %29
%69 = OpLoad %5 %68
%70 = OpBitcast %16 %69
%71 = OpAccessChain %21 %10 %32 %32
%72 = OpLoad %5 %71
%73 = OpBitcast %16 %72
%74 = OpAccessChain %21 %10 %32 %11
%75 = OpLoad %5 %74
%76 = OpBitcast %16 %75
%77 = OpAccessChain %21 %10 %32 %7
%78 = OpLoad %5 %77
%79 = OpBitcast %16 %78
%80 = OpFMul %16 %70 %37
%81 = OpFMul %16 %73 %37
%82 = OpFMul %16 %76 %37
%83 = OpFMul %16 %79 %37
%84 = OpAccessChain %21 %15 %29 %26 %29
%85 = OpLoad %5 %84
%86 = OpBitcast %16 %85
%87 = OpAccessChain %21 %15 %29 %26 %32
%88 = OpLoad %5 %87
%89 = OpBitcast %16 %88
%90 = OpAccessChain %21 %15 %29 %26 %11
%91 = OpLoad %5 %90
%92 = OpBitcast %16 %91
%93 = OpAccessChain %21 %15 %29 %26 %7
%94 = OpLoad %5 %93
%95 = OpBitcast %16 %94
%96 = OpFMul %16 %86 %39
%97 = OpFMul %16 %89 %39
%98 = OpFMul %16 %92 %39
%99 = OpFMul %16 %95 %39
%100 = OpAccessChain %21 %15 %32 %29 %29
%101 = OpLoad %5 %100
%102 = OpBitcast %16 %101
%103 = OpAccessChain %21 %15 %32 %29 %32
%104 = OpLoad %5 %103
%105 = OpBitcast %16 %104
%106 = OpAccessChain %21 %15 %32 %29 %11
%107 = OpLoad %5 %106
%108 = OpBitcast %16 %107
%109 = OpAccessChain %21 %15 %32 %29 %7
%110 = OpLoad %5 %109
%111 = OpBitcast %16 %110
%112 = OpAccessChain %21 %15 %11 %29 %29
%113 = OpLoad %5 %112
%114 = OpBitcast %16 %113
%115 = OpAccessChain %21 %15 %11 %29 %32
%116 = OpLoad %5 %115
%117 = OpBitcast %16 %116
%118 = OpAccessChain %21 %15 %11 %29 %11
%119 = OpLoad %5 %118
%120 = OpBitcast %16 %119
%121 = OpAccessChain %21 %15 %11 %29 %7
%122 = OpLoad %5 %121
%123 = OpBitcast %16 %122
%124 = OpAccessChain %21 %15 %29 %32 %29
%125 = OpLoad %5 %124
%126 = OpBitcast %16 %125
%127 = OpAccessChain %21 %15 %29 %32 %32
%128 = OpLoad %5 %127
%129 = OpBitcast %16 %128
%130 = OpAccessChain %21 %15 %29 %32 %11
%131 = OpLoad %5 %130
%132 = OpBitcast %16 %131
%133 = OpAccessChain %21 %15 %29 %32 %7
%134 = OpLoad %5 %133
%135 = OpBitcast %16 %134
%136 = OpAccessChain %21 %15 %32 %32 %29
%137 = OpLoad %5 %136
%138 = OpBitcast %16 %137
%139 = OpAccessChain %21 %15 %32 %32 %32
%140 = OpLoad %5 %139
%141 = OpBitcast %16 %140
%142 = OpAccessChain %21 %15 %32 %32 %11
%143 = OpLoad %5 %142
%144 = OpBitcast %16 %143
%145 = OpAccessChain %21 %15 %32 %32 %7
%146 = OpLoad %5 %145
%147 = OpBitcast %16 %146
%148 = OpFAdd %16 %138 %114
%149 = OpFMul %16 %148 %33
%150 = OpFAdd %16 %126 %102
%151 = OpFMul %16 %150 %30
%152 = OpFAdd %16 %42 %35
%153 = OpFAdd %16 %152 %64
%154 = OpFAdd %16 %153 %80
%155 = OpFAdd %16 %154 %96
%156 = OpFAdd %16 %155 %149
%157 = OpFAdd %16 %156 %151
%158 = OpFAdd %16 %141 %117
%159 = OpFMul %16 %158 %33
%160 = OpFAdd %16 %129 %105
%161 = OpFMul %16 %160 %30
%162 = OpFAdd %16 %45 %37
%163 = OpFAdd %16 %162 %65
%164 = OpFAdd %16 %163 %81
%165 = OpFAdd %16 %164 %97
%166 = OpFAdd %16 %165 %159
%167 = OpFAdd %16 %166 %161
%168 = OpFAdd %16 %144 %120
%169 = OpFMul %16 %168 %33
%170 = OpFAdd %16 %132 %108
%171 = OpFMul %16 %170 %30
%172 = OpFAdd %16 %48 %33
%173 = OpFAdd %16 %172 %66
%174 = OpFAdd %16 %173 %82
%175 = OpFAdd %16 %174 %98
%176 = OpFAdd %16 %175 %169
%177 = OpFAdd %16 %176 %171
%178 = OpFAdd %16 %147 %123
%179 = OpFMul %16 %178 %33
%180 = OpFAdd %16 %135 %111
%181 = OpFMul %16 %180 %30
%182 = OpFAdd %16 %51 %30
%183 = OpFAdd %16 %182 %67
%184 = OpFAdd %16 %183 %83
%185 = OpFAdd %16 %184 %99
%186 = OpFAdd %16 %185 %179
%187 = OpFAdd %16 %186 %181
%189 = OpAccessChain %188 %25 %29
OpStore %189 %157
%190 = OpAccessChain %188 %25 %32
OpStore %190 %167
%191 = OpAccessChain %188 %25 %11
OpStore %191 %177
%192 = OpAccessChain %188 %25 %7
OpStore %192 %187
OpReturn
OpFunctionEnd
#endif
