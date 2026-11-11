#version 460

const uint _23[1] = uint[](0u);

layout(location = 0) in float TEXCOORD;
layout(location = 0) out vec4 SV_Target;
float _20[4] = float[](5.0, 6.0, 7.0, 8.0);

void _bump2_YAXAIAMM0_Z(out float _28, float _29, out float _30)
{
    _28 = 4.0;
    _30 = 5.0;
    precise float _40 = 6.0 + _29;
    _20[2u] = _40;
}

void _bump_YAXAIAM_Z(inout float _49)
{
    float _53;
    float _52;
    _bump2_YAXAIAMM0_Z(_53, 10.0, _52);
    precise float _64 = 1.0 + _53;
    precise float _66 = _64 + _52;
    precise float _68 = _49 + _66;
    _49 = _68;
}

void main()
{
    float _75[4];
    _75[0u] = 1.0;
    _75[1u] = 2.0;
    _75[2u] = 3.0;
    _75[3u] = 4.0;
    float _76 = TEXCOORD;
    _bump_YAXAIAM_Z(_76);
    uint _98 = uint(int(TEXCOORD)) & 3u;
    float _102 = _75[_98];
    _bump_YAXAIAM_Z(_102);
    _75[_98] = _102;
    float _115 = ((_76 + _75[0u]) + _75[1u]) + _20[uint(int(TEXCOORD)) & 3u];
    SV_Target.x = _115;
    SV_Target.y = _115;
    SV_Target.z = _115;
    SV_Target.w = _115;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10 %20 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "TEXCOORD"
OpName %10 "SV_Target"
OpName %31 "?bump2@@YAXAIAMM0@Z"
OpName %50 "?bump@@YAXAIAM@Z"
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %40 NoContraction
OpDecorate %64 NoContraction
OpDecorate %66 NoContraction
OpDecorate %68 NoContraction
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 4
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpTypeInt 32 0
%12 = OpConstant %11 4
%13 = OpTypeArray %5 %12
%14 = OpConstant %5 5
%15 = OpConstant %5 6
%16 = OpConstant %5 7
%17 = OpConstant %5 8
%18 = OpConstantComposite %13 %14 %15 %16 %17
%19 = OpTypePointer Private %13
%20 = OpVariable %19 Private %18
%21 = OpConstant %11 1
%22 = OpTypeArray %11 %21
%23 = OpConstantNull %22
%24 = OpTypePointer Private %22
%25 = OpVariable %24 Private %23
%26 = OpTypePointer Function %5
%27 = OpTypeFunction %1 %26 %5 %26
%33 = OpTypePointer Private %11
%35 = OpConstant %11 0
%37 = OpConstant %5 4
%43 = OpTypePointer Private %5
%45 = OpConstant %11 2
%48 = OpTypeFunction %1 %26
%56 = OpConstant %5 10
%65 = OpConstant %5 1
%74 = OpTypePointer Function %13
%83 = OpConstant %5 2
%87 = OpConstant %5 3
%89 = OpConstant %11 3
%118 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%75 = OpVariable %74 Function
%76 = OpVariable %26 Function
%102 = OpVariable %26 Function
OpBranch %123
%123 = OpLabel
%73 = OpLoad %5 %7
%77 = OpInBoundsAccessChain %26 %75 %35
%78 = OpAccessChain %33 %25 %35
%79 = OpLoad %11 %78
OpStore %77 %65
%80 = OpInBoundsAccessChain %26 %75 %21
%81 = OpAccessChain %33 %25 %35
%82 = OpLoad %11 %81
OpStore %80 %83
%84 = OpInBoundsAccessChain %26 %75 %45
%85 = OpAccessChain %33 %25 %35
%86 = OpLoad %11 %85
OpStore %84 %87
%88 = OpInBoundsAccessChain %26 %75 %89
%90 = OpAccessChain %33 %25 %35
%91 = OpLoad %11 %90
OpStore %88 %37
%92 = OpAccessChain %33 %25 %35
%93 = OpLoad %11 %92
OpStore %76 %73
%94 = OpAccessChain %33 %25 %35
%95 = OpLoad %11 %94
%96 = OpFunctionCall %1 %50 %76
%97 = OpConvertFToS %11 %73
%98 = OpBitwiseAnd %11 %97 %89
%99 = OpInBoundsAccessChain %26 %75 %98
%100 = OpAccessChain %33 %25 %35
%101 = OpLoad %11 %100
OpCopyMemory %102 %99
%103 = OpFunctionCall %1 %50 %102
OpCopyMemory %99 %102
%104 = OpLoad %5 %76
%105 = OpInBoundsAccessChain %26 %75 %35
%106 = OpLoad %5 %105
%107 = OpFAdd %5 %104 %106
%108 = OpInBoundsAccessChain %26 %75 %21
%109 = OpLoad %5 %108
%110 = OpFAdd %5 %107 %109
%111 = OpConvertFToS %11 %73
%112 = OpBitwiseAnd %11 %111 %89
%113 = OpInBoundsAccessChain %43 %20 %112
%114 = OpLoad %5 %113
%115 = OpFAdd %5 %110 %114
%116 = OpAccessChain %33 %25 %35
%117 = OpLoad %11 %116
%119 = OpAccessChain %118 %10 %35
OpStore %119 %115
%120 = OpAccessChain %118 %10 %21
OpStore %120 %115
%121 = OpAccessChain %118 %10 %45
OpStore %121 %115
%122 = OpAccessChain %118 %10 %89
OpStore %122 %115
OpReturn
OpFunctionEnd
%31 = OpFunction %1 None %27
%28 = OpFunctionParameter %26
%29 = OpFunctionParameter %5
%30 = OpFunctionParameter %26
%32 = OpLabel
OpBranch %124
%124 = OpLabel
%34 = OpAccessChain %33 %25 %35
%36 = OpLoad %11 %34
OpStore %28 %37
%38 = OpAccessChain %33 %25 %35
%39 = OpLoad %11 %38
OpStore %30 %14
%40 = OpFAdd %5 %15 %29
%41 = OpAccessChain %33 %25 %35
%42 = OpLoad %11 %41
%44 = OpAccessChain %43 %20 %45
OpStore %44 %40
%46 = OpAccessChain %33 %25 %35
%47 = OpLoad %11 %46
OpReturn
OpFunctionEnd
%50 = OpFunction %1 None %48
%49 = OpFunctionParameter %26
%51 = OpLabel
%52 = OpVariable %26 Function
%53 = OpVariable %26 Function
OpBranch %125
%125 = OpLabel
%54 = OpAccessChain %33 %25 %35
%55 = OpLoad %11 %54
%57 = OpFunctionCall %1 %31 %53 %56 %52
%58 = OpLoad %5 %53
%59 = OpAccessChain %33 %25 %35
%60 = OpLoad %11 %59
%61 = OpLoad %5 %52
%62 = OpAccessChain %33 %25 %35
%63 = OpLoad %11 %62
%64 = OpFAdd %5 %65 %58
%66 = OpFAdd %5 %64 %61
%67 = OpLoad %5 %49
%68 = OpFAdd %5 %67 %66
%69 = OpAccessChain %33 %25 %35
%70 = OpLoad %11 %69
OpStore %49 %68
%71 = OpAccessChain %33 %25 %35
%72 = OpLoad %11 %71
OpReturn
OpFunctionEnd
#endif
