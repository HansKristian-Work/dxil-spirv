#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    dvec2 _m0[12];
} _12;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    double _38[6];
    double _39[6];
    double _40[6];
    double _41[6];
    _38[0u] = _12._m0[0u].x;
    _39[0u] = _12._m0[0u].y;
    _40[0u] = _12._m0[1u].x;
    _41[0u] = _12._m0[1u].y;
    _38[1u] = _12._m0[2u].x;
    _39[1u] = _12._m0[2u].y;
    _40[1u] = _12._m0[3u].x;
    _41[1u] = _12._m0[3u].y;
    _38[2u] = _12._m0[4u].x;
    _39[2u] = _12._m0[4u].y;
    _40[2u] = _12._m0[5u].x;
    _41[2u] = _12._m0[5u].y;
    _38[3u] = _12._m0[6u].x;
    _39[3u] = _12._m0[6u].y;
    _40[3u] = _12._m0[7u].x;
    _41[3u] = _12._m0[7u].y;
    _38[4u] = _12._m0[8u].x;
    _39[4u] = _12._m0[8u].y;
    _40[4u] = _12._m0[9u].x;
    _41[4u] = _12._m0[9u].y;
    _38[5u] = _12._m0[10u].x;
    _39[5u] = _12._m0[10u].y;
    _40[5u] = _12._m0[11u].x;
    _41[5u] = _12._m0[11u].y;
    uint _123 = A % 6u;
    SV_Target.x = float(_38[_123]) * P.x;
    SV_Target.y = float(_39[_123]) * P.y;
    SV_Target.z = float(_40[_123]) * P.z;
    SV_Target.w = float(_41[_123]) * P.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 147
; Schema: 0
OpCapability Shader
OpCapability Float64
OpCapability DenormPreserve
OpExtension "SPV_KHR_float_controls"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %18 %20
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DenormPreserve 64
OpName %3 "main"
OpName %10 ""
OpName %14 "A"
OpName %18 "P"
OpName %20 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %18 Location 1
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 12
%7 = OpTypeFloat 64
%8 = OpTypeVector %7 2
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypeFloat 32
%16 = OpTypeVector %15 4
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer Output %16
%20 = OpVariable %19 Output
%21 = OpTypePointer Input %15
%23 = OpConstant %5 0
%26 = OpConstant %5 1
%29 = OpConstant %5 2
%32 = OpConstant %5 3
%35 = OpConstant %5 6
%36 = OpTypeArray %7 %35
%37 = OpTypePointer Function %36
%42 = OpTypePointer Uniform %8
%51 = OpTypePointer Function %7
%68 = OpConstant %5 4
%73 = OpConstant %5 5
%86 = OpConstant %5 7
%95 = OpConstant %5 8
%100 = OpConstant %5 9
%109 = OpConstant %5 10
%114 = OpConstant %5 11
%140 = OpTypePointer Output %15
%3 = OpFunction %1 None %2
%4 = OpLabel
%38 = OpVariable %37 Function
%39 = OpVariable %37 Function
%40 = OpVariable %37 Function
%41 = OpVariable %37 Function
OpBranch %145
%145 = OpLabel
%22 = OpAccessChain %21 %18 %23
%24 = OpLoad %15 %22
%25 = OpAccessChain %21 %18 %26
%27 = OpLoad %15 %25
%28 = OpAccessChain %21 %18 %29
%30 = OpLoad %15 %28
%31 = OpAccessChain %21 %18 %32
%33 = OpLoad %15 %31
%34 = OpLoad %5 %14
%43 = OpAccessChain %42 %12 %23 %23
%44 = OpLoad %8 %43
%45 = OpCompositeExtract %7 %44 0
%46 = OpCompositeExtract %7 %44 1
%47 = OpAccessChain %42 %12 %23 %26
%48 = OpLoad %8 %47
%49 = OpCompositeExtract %7 %48 0
%50 = OpCompositeExtract %7 %48 1
%52 = OpAccessChain %51 %38 %23
%53 = OpAccessChain %51 %39 %23
%54 = OpAccessChain %51 %40 %23
%55 = OpAccessChain %51 %41 %23
OpStore %52 %45
OpStore %53 %46
OpStore %54 %49
OpStore %55 %50
%56 = OpAccessChain %42 %12 %23 %29
%57 = OpLoad %8 %56
%58 = OpCompositeExtract %7 %57 0
%59 = OpCompositeExtract %7 %57 1
%60 = OpAccessChain %42 %12 %23 %32
%61 = OpLoad %8 %60
%62 = OpCompositeExtract %7 %61 0
%63 = OpCompositeExtract %7 %61 1
%64 = OpAccessChain %51 %38 %26
%65 = OpAccessChain %51 %39 %26
%66 = OpAccessChain %51 %40 %26
%67 = OpAccessChain %51 %41 %26
OpStore %64 %58
OpStore %65 %59
OpStore %66 %62
OpStore %67 %63
%69 = OpAccessChain %42 %12 %23 %68
%70 = OpLoad %8 %69
%71 = OpCompositeExtract %7 %70 0
%72 = OpCompositeExtract %7 %70 1
%74 = OpAccessChain %42 %12 %23 %73
%75 = OpLoad %8 %74
%76 = OpCompositeExtract %7 %75 0
%77 = OpCompositeExtract %7 %75 1
%78 = OpAccessChain %51 %38 %29
%79 = OpAccessChain %51 %39 %29
%80 = OpAccessChain %51 %40 %29
%81 = OpAccessChain %51 %41 %29
OpStore %78 %71
OpStore %79 %72
OpStore %80 %76
OpStore %81 %77
%82 = OpAccessChain %42 %12 %23 %35
%83 = OpLoad %8 %82
%84 = OpCompositeExtract %7 %83 0
%85 = OpCompositeExtract %7 %83 1
%87 = OpAccessChain %42 %12 %23 %86
%88 = OpLoad %8 %87
%89 = OpCompositeExtract %7 %88 0
%90 = OpCompositeExtract %7 %88 1
%91 = OpAccessChain %51 %38 %32
%92 = OpAccessChain %51 %39 %32
%93 = OpAccessChain %51 %40 %32
%94 = OpAccessChain %51 %41 %32
OpStore %91 %84
OpStore %92 %85
OpStore %93 %89
OpStore %94 %90
%96 = OpAccessChain %42 %12 %23 %95
%97 = OpLoad %8 %96
%98 = OpCompositeExtract %7 %97 0
%99 = OpCompositeExtract %7 %97 1
%101 = OpAccessChain %42 %12 %23 %100
%102 = OpLoad %8 %101
%103 = OpCompositeExtract %7 %102 0
%104 = OpCompositeExtract %7 %102 1
%105 = OpAccessChain %51 %38 %68
%106 = OpAccessChain %51 %39 %68
%107 = OpAccessChain %51 %40 %68
%108 = OpAccessChain %51 %41 %68
OpStore %105 %98
OpStore %106 %99
OpStore %107 %103
OpStore %108 %104
%110 = OpAccessChain %42 %12 %23 %109
%111 = OpLoad %8 %110
%112 = OpCompositeExtract %7 %111 0
%113 = OpCompositeExtract %7 %111 1
%115 = OpAccessChain %42 %12 %23 %114
%116 = OpLoad %8 %115
%117 = OpCompositeExtract %7 %116 0
%118 = OpCompositeExtract %7 %116 1
%119 = OpAccessChain %51 %38 %73
%120 = OpAccessChain %51 %39 %73
%121 = OpAccessChain %51 %40 %73
%122 = OpAccessChain %51 %41 %73
OpStore %119 %112
OpStore %120 %113
OpStore %121 %117
OpStore %122 %118
%123 = OpUMod %5 %34 %35
%124 = OpAccessChain %51 %38 %123
%125 = OpAccessChain %51 %39 %123
%126 = OpAccessChain %51 %40 %123
%127 = OpAccessChain %51 %41 %123
%128 = OpLoad %7 %124
%129 = OpLoad %7 %125
%130 = OpLoad %7 %126
%131 = OpLoad %7 %127
%132 = OpFConvert %15 %128
%133 = OpFConvert %15 %129
%134 = OpFConvert %15 %130
%135 = OpFConvert %15 %131
%136 = OpFMul %15 %132 %24
%137 = OpFMul %15 %133 %27
%138 = OpFMul %15 %134 %30
%139 = OpFMul %15 %135 %33
%141 = OpAccessChain %140 %20 %23
OpStore %141 %136
%142 = OpAccessChain %140 %20 %26
OpStore %142 %137
%143 = OpAccessChain %140 %20 %29
OpStore %143 %138
%144 = OpAccessChain %140 %20 %32
OpStore %144 %139
OpReturn
OpFunctionEnd
#endif
