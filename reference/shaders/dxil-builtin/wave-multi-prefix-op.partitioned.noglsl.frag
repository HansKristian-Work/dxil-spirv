; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 265
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformPartitionedNV
OpExtension "SPV_NV_shader_subgroup_partitioned"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %263
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "THR"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %12 NonReadable
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %263 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%20 = OpConstant %5 4
%21 = OpTypeVector %5 4
%26 = OpConstant %5 1
%30 = OpConstant %5 2
%34 = OpConstant %5 3
%46 = OpTypeBool
%51 = OpTypeVector %46 4
%55 = OpConstant %5 7
%77 = OpTypeFloat 32
%222 = OpConstant %5 5
%257 = OpConstant %5 6
%262 = OpTypePointer Input %46
%263 = OpVariable %262 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %261
%261 = OpLabel
%15 = OpLoad %10 %12
%16 = OpLoad %6 %9
%17 = OpLoad %6 %8
%18 = OpLoad %5 %14
%19 = OpIMul %5 %18 %20
%22 = OpImageFetch %21 %16 %19
%23 = OpCompositeExtract %5 %22 0
%25 = OpIAdd %5 %19 %26
%24 = OpImageFetch %21 %16 %25
%27 = OpCompositeExtract %5 %24 0
%29 = OpIAdd %5 %19 %30
%28 = OpImageFetch %21 %16 %29
%31 = OpCompositeExtract %5 %28 0
%33 = OpIAdd %5 %19 %34
%32 = OpImageFetch %21 %16 %33
%35 = OpCompositeExtract %5 %32 0
%36 = OpCompositeConstruct %21 %23 %27 %31 %35
%37 = OpCompositeExtract %5 %36 0
%38 = OpCompositeExtract %5 %36 1
%39 = OpCompositeExtract %5 %36 2
%40 = OpCompositeExtract %5 %36 3
%41 = OpImageFetch %21 %17 %18
%42 = OpCompositeExtract %5 %41 0
%44 = OpCompositeConstruct %21 %37 %38 %39 %40
%47 = OpLoad %46 %263
%48 = OpGroupNonUniformBallot %21 %34 %47
%49 = OpLogicalNot %46 %47
%45 = OpGroupNonUniformBallot %21 %34 %49
%50 = OpBitwiseAnd %21 %44 %45
%52 = OpCompositeConstruct %51 %47 %47 %47 %47
%53 = OpSelect %21 %52 %48 %50
%43 = OpGroupNonUniformIAdd %5 %34 PartitionedExclusiveScanNV %42 %53
%54 = OpIMul %5 %18 %55
%56 = OpIMul %5 %18 %55
%57 = OpCompositeConstruct %21 %43 %43 %43 %43
OpImageWrite %15 %56 %57
%58 = OpIMul %5 %18 %20
%59 = OpImageFetch %21 %16 %58
%60 = OpCompositeExtract %5 %59 0
%62 = OpIAdd %5 %58 %26
%61 = OpImageFetch %21 %16 %62
%63 = OpCompositeExtract %5 %61 0
%65 = OpIAdd %5 %58 %30
%64 = OpImageFetch %21 %16 %65
%66 = OpCompositeExtract %5 %64 0
%68 = OpIAdd %5 %58 %34
%67 = OpImageFetch %21 %16 %68
%69 = OpCompositeExtract %5 %67 0
%70 = OpCompositeConstruct %21 %60 %63 %66 %69
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1
%73 = OpCompositeExtract %5 %70 2
%74 = OpCompositeExtract %5 %70 3
%75 = OpImageFetch %21 %17 %18
%76 = OpCompositeExtract %5 %75 0
%78 = OpBitcast %77 %76
%80 = OpCompositeConstruct %21 %71 %72 %73 %74
%82 = OpLoad %46 %263
%83 = OpGroupNonUniformBallot %21 %34 %82
%84 = OpLogicalNot %46 %82
%81 = OpGroupNonUniformBallot %21 %34 %84
%85 = OpBitwiseAnd %21 %80 %81
%86 = OpCompositeConstruct %51 %82 %82 %82 %82
%87 = OpSelect %21 %86 %83 %85
%79 = OpGroupNonUniformFAdd %77 %34 PartitionedExclusiveScanNV %78 %87
%88 = OpConvertFToU %5 %79
%89 = OpIAdd %5 %54 %26
%90 = OpIMul %5 %18 %55
%91 = OpIAdd %5 %90 %26
%92 = OpCompositeConstruct %21 %88 %88 %88 %88
OpImageWrite %15 %91 %92
%93 = OpIMul %5 %18 %20
%94 = OpImageFetch %21 %16 %93
%95 = OpCompositeExtract %5 %94 0
%97 = OpIAdd %5 %93 %26
%96 = OpImageFetch %21 %16 %97
%98 = OpCompositeExtract %5 %96 0
%100 = OpIAdd %5 %93 %30
%99 = OpImageFetch %21 %16 %100
%101 = OpCompositeExtract %5 %99 0
%103 = OpIAdd %5 %93 %34
%102 = OpImageFetch %21 %16 %103
%104 = OpCompositeExtract %5 %102 0
%105 = OpCompositeConstruct %21 %95 %98 %101 %104
%106 = OpCompositeExtract %5 %105 0
%107 = OpCompositeExtract %5 %105 1
%108 = OpCompositeExtract %5 %105 2
%109 = OpCompositeExtract %5 %105 3
%110 = OpImageFetch %21 %17 %18
%111 = OpCompositeExtract %5 %110 0
%113 = OpCompositeConstruct %21 %106 %107 %108 %109
%115 = OpLoad %46 %263
%116 = OpGroupNonUniformBallot %21 %34 %115
%117 = OpLogicalNot %46 %115
%114 = OpGroupNonUniformBallot %21 %34 %117
%118 = OpBitwiseAnd %21 %113 %114
%119 = OpCompositeConstruct %51 %115 %115 %115 %115
%120 = OpSelect %21 %119 %116 %118
%112 = OpGroupNonUniformIMul %5 %34 PartitionedExclusiveScanNV %111 %120
%121 = OpIAdd %5 %54 %30
%122 = OpIMul %5 %18 %55
%123 = OpIAdd %5 %122 %30
%124 = OpCompositeConstruct %21 %112 %112 %112 %112
OpImageWrite %15 %123 %124
%125 = OpIMul %5 %18 %20
%126 = OpImageFetch %21 %16 %125
%127 = OpCompositeExtract %5 %126 0
%129 = OpIAdd %5 %125 %26
%128 = OpImageFetch %21 %16 %129
%130 = OpCompositeExtract %5 %128 0
%132 = OpIAdd %5 %125 %30
%131 = OpImageFetch %21 %16 %132
%133 = OpCompositeExtract %5 %131 0
%135 = OpIAdd %5 %125 %34
%134 = OpImageFetch %21 %16 %135
%136 = OpCompositeExtract %5 %134 0
%137 = OpCompositeConstruct %21 %127 %130 %133 %136
%138 = OpCompositeExtract %5 %137 0
%139 = OpCompositeExtract %5 %137 1
%140 = OpCompositeExtract %5 %137 2
%141 = OpCompositeExtract %5 %137 3
%142 = OpImageFetch %21 %17 %18
%143 = OpCompositeExtract %5 %142 0
%144 = OpBitcast %77 %143
%146 = OpCompositeConstruct %21 %138 %139 %140 %141
%148 = OpLoad %46 %263
%149 = OpGroupNonUniformBallot %21 %34 %148
%150 = OpLogicalNot %46 %148
%147 = OpGroupNonUniformBallot %21 %34 %150
%151 = OpBitwiseAnd %21 %146 %147
%152 = OpCompositeConstruct %51 %148 %148 %148 %148
%153 = OpSelect %21 %152 %149 %151
%145 = OpGroupNonUniformFMul %77 %34 PartitionedExclusiveScanNV %144 %153
%154 = OpConvertFToU %5 %145
%155 = OpIAdd %5 %54 %34
%156 = OpIMul %5 %18 %55
%157 = OpIAdd %5 %156 %34
%158 = OpCompositeConstruct %21 %154 %154 %154 %154
OpImageWrite %15 %157 %158
%159 = OpIMul %5 %18 %20
%160 = OpImageFetch %21 %16 %159
%161 = OpCompositeExtract %5 %160 0
%163 = OpIAdd %5 %159 %26
%162 = OpImageFetch %21 %16 %163
%164 = OpCompositeExtract %5 %162 0
%166 = OpIAdd %5 %159 %30
%165 = OpImageFetch %21 %16 %166
%167 = OpCompositeExtract %5 %165 0
%169 = OpIAdd %5 %159 %34
%168 = OpImageFetch %21 %16 %169
%170 = OpCompositeExtract %5 %168 0
%171 = OpCompositeConstruct %21 %161 %164 %167 %170
%172 = OpCompositeExtract %5 %171 0
%173 = OpCompositeExtract %5 %171 1
%174 = OpCompositeExtract %5 %171 2
%175 = OpCompositeExtract %5 %171 3
%176 = OpImageFetch %21 %17 %18
%177 = OpCompositeExtract %5 %176 0
%179 = OpCompositeConstruct %21 %172 %173 %174 %175
%181 = OpLoad %46 %263
%182 = OpGroupNonUniformBallot %21 %34 %181
%183 = OpLogicalNot %46 %181
%180 = OpGroupNonUniformBallot %21 %34 %183
%184 = OpBitwiseAnd %21 %179 %180
%185 = OpCompositeConstruct %51 %181 %181 %181 %181
%186 = OpSelect %21 %185 %182 %184
%178 = OpGroupNonUniformBitwiseOr %5 %34 PartitionedExclusiveScanNV %177 %186
%187 = OpIAdd %5 %54 %20
%188 = OpIMul %5 %18 %55
%189 = OpIAdd %5 %188 %20
%190 = OpCompositeConstruct %21 %178 %178 %178 %178
OpImageWrite %15 %189 %190
%191 = OpIMul %5 %18 %20
%192 = OpImageFetch %21 %16 %191
%193 = OpCompositeExtract %5 %192 0
%195 = OpIAdd %5 %191 %26
%194 = OpImageFetch %21 %16 %195
%196 = OpCompositeExtract %5 %194 0
%198 = OpIAdd %5 %191 %30
%197 = OpImageFetch %21 %16 %198
%199 = OpCompositeExtract %5 %197 0
%201 = OpIAdd %5 %191 %34
%200 = OpImageFetch %21 %16 %201
%202 = OpCompositeExtract %5 %200 0
%203 = OpCompositeConstruct %21 %193 %196 %199 %202
%204 = OpCompositeExtract %5 %203 0
%205 = OpCompositeExtract %5 %203 1
%206 = OpCompositeExtract %5 %203 2
%207 = OpCompositeExtract %5 %203 3
%208 = OpImageFetch %21 %17 %18
%209 = OpCompositeExtract %5 %208 0
%210 = OpBitcast %77 %209
%211 = OpConvertFToS %5 %210
%213 = OpCompositeConstruct %21 %204 %205 %206 %207
%215 = OpLoad %46 %263
%216 = OpGroupNonUniformBallot %21 %34 %215
%217 = OpLogicalNot %46 %215
%214 = OpGroupNonUniformBallot %21 %34 %217
%218 = OpBitwiseAnd %21 %213 %214
%219 = OpCompositeConstruct %51 %215 %215 %215 %215
%220 = OpSelect %21 %219 %216 %218
%212 = OpGroupNonUniformBitwiseAnd %5 %34 PartitionedExclusiveScanNV %211 %220
%221 = OpIAdd %5 %54 %222
%223 = OpIMul %5 %18 %55
%224 = OpIAdd %5 %223 %222
%225 = OpCompositeConstruct %21 %212 %212 %212 %212
OpImageWrite %15 %224 %225
%226 = OpIMul %5 %18 %20
%227 = OpImageFetch %21 %16 %226
%228 = OpCompositeExtract %5 %227 0
%230 = OpIAdd %5 %226 %26
%229 = OpImageFetch %21 %16 %230
%231 = OpCompositeExtract %5 %229 0
%233 = OpIAdd %5 %226 %30
%232 = OpImageFetch %21 %16 %233
%234 = OpCompositeExtract %5 %232 0
%236 = OpIAdd %5 %226 %34
%235 = OpImageFetch %21 %16 %236
%237 = OpCompositeExtract %5 %235 0
%238 = OpCompositeConstruct %21 %228 %231 %234 %237
%239 = OpCompositeExtract %5 %238 0
%240 = OpCompositeExtract %5 %238 1
%241 = OpCompositeExtract %5 %238 2
%242 = OpCompositeExtract %5 %238 3
%243 = OpImageFetch %21 %17 %18
%244 = OpCompositeExtract %5 %243 0
%245 = OpBitcast %77 %244
%246 = OpConvertFToS %5 %245
%248 = OpCompositeConstruct %21 %239 %240 %241 %242
%250 = OpLoad %46 %263
%251 = OpGroupNonUniformBallot %21 %34 %250
%252 = OpLogicalNot %46 %250
%249 = OpGroupNonUniformBallot %21 %34 %252
%253 = OpBitwiseAnd %21 %248 %249
%254 = OpCompositeConstruct %51 %250 %250 %250 %250
%255 = OpSelect %21 %254 %251 %253
%247 = OpGroupNonUniformBitwiseXor %5 %34 PartitionedExclusiveScanNV %246 %255
%256 = OpIAdd %5 %54 %257
%258 = OpIMul %5 %18 %55
%259 = OpIAdd %5 %258 %257
%260 = OpCompositeConstruct %21 %247 %247 %247 %247
OpImageWrite %15 %259 %260
OpReturn
OpFunctionEnd

