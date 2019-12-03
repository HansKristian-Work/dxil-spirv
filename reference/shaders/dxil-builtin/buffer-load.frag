#version 460

layout(set = 0, binding = 0) uniform samplerBuffer _8;
layout(set = 0, binding = 1) uniform usamplerBuffer _12;
layout(set = 0, binding = 2) uniform usamplerBuffer _13;
layout(set = 0, binding = 3) uniform usamplerBuffer _14;
layout(set = 0, binding = 0) uniform readonly imageBuffer _17;
layout(set = 0, binding = 1, r32ui) uniform readonly uimageBuffer _20;
layout(set = 0, binding = 2, r32ui) uniform readonly uimageBuffer _21;
layout(set = 0, binding = 3, r32ui) uniform readonly uimageBuffer _22;

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _37 = texelFetch(_8, int(TEXCOORD));
    vec4 _41 = imageLoad(_17, int(TEXCOORD));
    uint _46 = TEXCOORD << 3u;
    uint _48 = _46 >> 2u;
    uvec4 _63 = uvec4(texelFetch(_12, int(_48)).x, texelFetch(_12, int(_48 + 1u)).x, texelFetch(_12, int(_48 + 2u)).x, texelFetch(_12, int(_48 + 3u)).x);
    uint _70 = _46 >> 2u;
    uvec4 _82 = uvec4(imageLoad(_20, int(_70)).x, imageLoad(_20, int(_70 + 1u)).x, imageLoad(_20, int(_70 + 2u)).x, imageLoad(_20, int(_70 + 3u)).x);
    uint _90 = TEXCOORD * 2u;
    vec2 _98 = uintBitsToFloat(uvec2(texelFetch(_13, int(_90)).x, texelFetch(_13, int(_90 + 1u)).x));
    uint _103 = TEXCOORD * 2u;
    vec2 _110 = uintBitsToFloat(uvec2(imageLoad(_21, int(_103)).x, imageLoad(_21, int(_103 + 1u)).x));
    uint _115 = TEXCOORD * 6u;
    vec4 _129 = uintBitsToFloat(uvec4(texelFetch(_14, int(_115)).x, texelFetch(_14, int(_115 + 1u)).x, texelFetch(_14, int(_115 + 2u)).x, texelFetch(_14, int(_115 + 3u)).x));
    uint _136 = (TEXCOORD * 6u) + 3u;
    vec3 _147 = uintBitsToFloat(uvec3(imageLoad(_22, int(_136)).x, imageLoad(_22, int(_136 + 1u)).x, imageLoad(_22, int(_136 + 2u)).x));
    SV_Target.x = ((((((_41.x + _37.x) + uintBitsToFloat(_63.x)) + uintBitsToFloat(_82.x)) + _98.x) + _110.x) + _129.y) + _147.y;
    SV_Target.y = ((((((_41.y + _37.y) + uintBitsToFloat(_63.y)) + uintBitsToFloat(_82.y)) + _98.y) + _110.y) + _129.z) + _147.z;
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

%dx.types.Handle = type { i8* }
%dx.types.ResRet.f32 = type { float, float, float, float, i32 }
%dx.types.ResRet.i32 = type { i32, i32, i32, i32, i32 }
%"class.Buffer<vector<float, 2> >" = type { <2 x float> }
%struct.ByteAddressBuffer = type { i32 }
%"class.StructuredBuffer<vector<float, 2> >" = type { <2 x float> }
%"class.StructuredBuffer<Composite>" = type { %struct.Composite }
%struct.Composite = type { <3 x float>, <3 x float> }
%"class.RWBuffer<vector<float, 2> >" = type { <2 x float> }
%struct.RWByteAddressBuffer = type { i32 }
%"class.RWStructuredBuffer<vector<float, 2> >" = type { <2 x float> }
%"class.RWStructuredBuffer<Composite>" = type { %struct.Composite }

define void @main() {
  %1 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 3, i32 3, i1 false)
  %2 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 2, i32 2, i1 false)
  %3 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 1, i32 1, i1 false)
  %4 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 1, i32 0, i32 0, i1 false)
  %5 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 3, i32 3, i1 false)
  %6 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 2, i32 2, i1 false)
  %7 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 1, i32 1, i1 false)
  %8 = call %dx.types.Handle @dx.op.createHandle(i32 57, i8 0, i32 0, i32 0, i1 false)
  %9 = call i32 @dx.op.loadInput.i32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %10 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %8, i32 %9, i32 undef)
  %11 = extractvalue %dx.types.ResRet.f32 %10, 0
  %12 = extractvalue %dx.types.ResRet.f32 %10, 1
  %13 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %4, i32 %9, i32 undef)
  %14 = extractvalue %dx.types.ResRet.f32 %13, 0
  %15 = extractvalue %dx.types.ResRet.f32 %13, 1
  %16 = fadd fast float %14, %11
  %17 = fadd fast float %15, %12
  %18 = shl i32 %9, 3
  %19 = call %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32 68, %dx.types.Handle %7, i32 %18, i32 undef)
  %20 = extractvalue %dx.types.ResRet.i32 %19, 0
  %21 = extractvalue %dx.types.ResRet.i32 %19, 1
  %22 = bitcast i32 %20 to float
  %23 = bitcast i32 %21 to float
  %24 = fadd fast float %16, %22
  %25 = fadd fast float %17, %23
  %26 = call %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32 68, %dx.types.Handle %3, i32 %18, i32 undef)
  %27 = extractvalue %dx.types.ResRet.i32 %26, 0
  %28 = extractvalue %dx.types.ResRet.i32 %26, 1
  %29 = bitcast i32 %27 to float
  %30 = bitcast i32 %28 to float
  %31 = fadd fast float %24, %29
  %32 = fadd fast float %25, %30
  %33 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %6, i32 %9, i32 0)
  %34 = extractvalue %dx.types.ResRet.f32 %33, 0
  %35 = extractvalue %dx.types.ResRet.f32 %33, 1
  %36 = fadd fast float %31, %34
  %37 = fadd fast float %32, %35
  %38 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %2, i32 %9, i32 0)
  %39 = extractvalue %dx.types.ResRet.f32 %38, 0
  %40 = extractvalue %dx.types.ResRet.f32 %38, 1
  %41 = fadd fast float %36, %39
  %42 = fadd fast float %37, %40
  %43 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %5, i32 %9, i32 0)
  %44 = extractvalue %dx.types.ResRet.f32 %43, 1
  %45 = extractvalue %dx.types.ResRet.f32 %43, 2
  %46 = fadd fast float %41, %44
  %47 = fadd fast float %42, %45
  %48 = call %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32 68, %dx.types.Handle %1, i32 %9, i32 12)
  %49 = extractvalue %dx.types.ResRet.f32 %48, 1
  %50 = extractvalue %dx.types.ResRet.f32 %48, 2
  %51 = fadd fast float %46, %49
  %52 = fadd fast float %47, %50
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 0, float %51)
  call void @dx.op.storeOutput.f32(i32 5, i32 0, i32 0, i8 1, float %52)
  ret void
}

; Function Attrs: nounwind readnone
declare i32 @dx.op.loadInput.i32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.storeOutput.f32(i32, i32, i32, i8, float) #1

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.f32 @dx.op.bufferLoad.f32(i32, %dx.types.Handle, i32, i32) #2

; Function Attrs: nounwind readonly
declare %dx.types.Handle @dx.op.createHandle(i32, i8, i32, i32, i1) #2

; Function Attrs: nounwind readonly
declare %dx.types.ResRet.i32 @dx.op.bufferLoad.i32(i32, %dx.types.Handle, i32, i32) #2

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }
attributes #2 = { nounwind readonly }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.resources = !{!4}
!dx.viewIdState = !{!18}
!dx.entryPoints = !{!19}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{!5, !13, null, null}
!5 = !{!6, !8, !9, !11}
!6 = !{i32 0, %"class.Buffer<vector<float, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i32 0, !7}
!7 = !{i32 0, i32 9}
!8 = !{i32 1, %struct.ByteAddressBuffer* undef, !"", i32 0, i32 1, i32 1, i32 11, i32 0, null}
!9 = !{i32 2, %"class.StructuredBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 12, i32 0, !10}
!10 = !{i32 1, i32 8}
!11 = !{i32 3, %"class.StructuredBuffer<Composite>"* undef, !"", i32 0, i32 3, i32 1, i32 12, i32 0, !12}
!12 = !{i32 1, i32 24}
!13 = !{!14, !15, !16, !17}
!14 = !{i32 0, %"class.RWBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 0, i32 1, i32 10, i1 false, i1 false, i1 false, !7}
!15 = !{i32 1, %struct.RWByteAddressBuffer* undef, !"", i32 0, i32 1, i32 1, i32 11, i1 false, i1 false, i1 false, null}
!16 = !{i32 2, %"class.RWStructuredBuffer<vector<float, 2> >"* undef, !"", i32 0, i32 2, i32 1, i32 12, i1 false, i1 false, i1 false, !10}
!17 = !{i32 3, %"class.RWStructuredBuffer<Composite>"* undef, !"", i32 0, i32 3, i32 1, i32 12, i1 false, i1 false, i1 false, !12}
!18 = !{[3 x i32] [i32 1, i32 2, i32 3]}
!19 = !{void ()* @main, !"main", !20, !4, !28}
!20 = !{!21, !25, null}
!21 = !{!22}
!22 = !{i32 0, !"TEXCOORD", i8 5, i8 0, !23, i8 1, i32 1, i8 1, i32 0, i8 0, !24}
!23 = !{i32 0}
!24 = !{i32 3, i32 1}
!25 = !{!26}
!26 = !{i32 0, !"SV_Target", i8 9, i8 16, !23, i8 0, i32 1, i8 2, i32 0, i8 0, !27}
!27 = !{i32 3, i32 3}
!28 = !{i32 0, i64 8208}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 158
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability StorageImageReadWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 2
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 3
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeImage %9 Buffer 0 0 0 1 Unknown
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpVariable %11 UniformConstant
%15 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %9 Buffer 0 0 0 2 R32ui
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpVariable %19 UniformConstant
%22 = OpVariable %19 UniformConstant
%23 = OpTypePointer Input %9
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 2
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%38 = OpTypeVector %5 4
%47 = OpConstant %9 3
%49 = OpConstant %9 2
%50 = OpTypeVector %9 4
%56 = OpConstant %9 1
%89 = OpConstant %9 0
%97 = OpTypeVector %9 2
%116 = OpConstant %9 6
%134 = OpConstant %9 12
%146 = OpTypeVector %9 3
%148 = OpTypeVector %5 3
%154 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %156
%156 = OpLabel
%28 = OpLoad %18 %22
%29 = OpLoad %18 %21
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %10 %14
%33 = OpLoad %10 %13
%34 = OpLoad %10 %12
%35 = OpLoad %6 %8
%36 = OpLoad %9 %24
%37 = OpImageFetch %38 %35 %36
%39 = OpCompositeExtract %5 %37 0
%40 = OpCompositeExtract %5 %37 1
%41 = OpImageRead %38 %31 %36
%42 = OpCompositeExtract %5 %41 0
%43 = OpCompositeExtract %5 %41 1
%44 = OpFAdd %5 %42 %39
%45 = OpFAdd %5 %43 %40
%46 = OpShiftLeftLogical %9 %36 %47
%48 = OpShiftRightLogical %9 %46 %49
%51 = OpImageFetch %50 %34 %48
%52 = OpCompositeExtract %9 %51 0
%55 = OpIAdd %9 %48 %56
%53 = OpImageFetch %50 %34 %55
%54 = OpCompositeExtract %9 %53 0
%59 = OpIAdd %9 %48 %49
%57 = OpImageFetch %50 %34 %59
%58 = OpCompositeExtract %9 %57 0
%62 = OpIAdd %9 %48 %47
%60 = OpImageFetch %50 %34 %62
%61 = OpCompositeExtract %9 %60 0
%63 = OpCompositeConstruct %50 %52 %54 %58 %61
%64 = OpCompositeExtract %9 %63 0
%65 = OpCompositeExtract %9 %63 1
%66 = OpBitcast %5 %64
%67 = OpBitcast %5 %65
%68 = OpFAdd %5 %44 %66
%69 = OpFAdd %5 %45 %67
%70 = OpShiftRightLogical %9 %46 %49
%71 = OpImageRead %50 %30 %70
%72 = OpCompositeExtract %9 %71 0
%75 = OpIAdd %9 %70 %56
%73 = OpImageRead %50 %30 %75
%74 = OpCompositeExtract %9 %73 0
%78 = OpIAdd %9 %70 %49
%76 = OpImageRead %50 %30 %78
%77 = OpCompositeExtract %9 %76 0
%81 = OpIAdd %9 %70 %47
%79 = OpImageRead %50 %30 %81
%80 = OpCompositeExtract %9 %79 0
%82 = OpCompositeConstruct %50 %72 %74 %77 %80
%83 = OpCompositeExtract %9 %82 0
%84 = OpCompositeExtract %9 %82 1
%85 = OpBitcast %5 %83
%86 = OpBitcast %5 %84
%87 = OpFAdd %5 %68 %85
%88 = OpFAdd %5 %69 %86
%90 = OpIMul %9 %36 %49
%91 = OpImageFetch %50 %33 %90
%92 = OpCompositeExtract %9 %91 0
%95 = OpIAdd %9 %90 %56
%93 = OpImageFetch %50 %33 %95
%94 = OpCompositeExtract %9 %93 0
%96 = OpCompositeConstruct %97 %92 %94
%98 = OpBitcast %25 %96
%99 = OpCompositeExtract %5 %98 0
%100 = OpCompositeExtract %5 %98 1
%101 = OpFAdd %5 %87 %99
%102 = OpFAdd %5 %88 %100
%103 = OpIMul %9 %36 %49
%104 = OpImageRead %50 %29 %103
%105 = OpCompositeExtract %9 %104 0
%108 = OpIAdd %9 %103 %56
%106 = OpImageRead %50 %29 %108
%107 = OpCompositeExtract %9 %106 0
%109 = OpCompositeConstruct %97 %105 %107
%110 = OpBitcast %25 %109
%111 = OpCompositeExtract %5 %110 0
%112 = OpCompositeExtract %5 %110 1
%113 = OpFAdd %5 %101 %111
%114 = OpFAdd %5 %102 %112
%115 = OpIMul %9 %36 %116
%117 = OpImageFetch %50 %32 %115
%118 = OpCompositeExtract %9 %117 0
%121 = OpIAdd %9 %115 %56
%119 = OpImageFetch %50 %32 %121
%120 = OpCompositeExtract %9 %119 0
%124 = OpIAdd %9 %115 %49
%122 = OpImageFetch %50 %32 %124
%123 = OpCompositeExtract %9 %122 0
%127 = OpIAdd %9 %115 %47
%125 = OpImageFetch %50 %32 %127
%126 = OpCompositeExtract %9 %125 0
%128 = OpCompositeConstruct %50 %118 %120 %123 %126
%129 = OpBitcast %38 %128
%130 = OpCompositeExtract %5 %129 1
%131 = OpCompositeExtract %5 %129 2
%132 = OpFAdd %5 %113 %130
%133 = OpFAdd %5 %114 %131
%135 = OpIMul %9 %36 %116
%136 = OpIAdd %9 %135 %47
%137 = OpImageRead %50 %28 %136
%138 = OpCompositeExtract %9 %137 0
%141 = OpIAdd %9 %136 %56
%139 = OpImageRead %50 %28 %141
%140 = OpCompositeExtract %9 %139 0
%144 = OpIAdd %9 %136 %49
%142 = OpImageRead %50 %28 %144
%143 = OpCompositeExtract %9 %142 0
%145 = OpCompositeConstruct %146 %138 %140 %143
%147 = OpBitcast %148 %145
%149 = OpCompositeExtract %5 %147 1
%150 = OpCompositeExtract %5 %147 2
%151 = OpFAdd %5 %132 %149
%152 = OpFAdd %5 %133 %150
%153 = OpInBoundsAccessChain %154 %27 %89
OpStore %153 %151
%155 = OpInBoundsAccessChain %154 %27 %56
OpStore %155 %152
OpReturn
OpFunctionEnd
#endif
