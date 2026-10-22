#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _67;
    float _68;
    float _69;
    float _70;
    if (V.x < 10u)
    {
        uint _74 = V.x;
        uint _33;
        bool _38;
        for (;;)
        {
            _33 = _74;
            uint _37 = imageAtomicAdd(_8, int(0u), _33);
            _38 = V.y == 0u;
            if (!_38)
            {
                uint _39 = _33 & 3u;
                uint _42;
                bool _77;
                uint _72 = _39;
                uint _73 = 0u;
                uint _41;
                bool _43;
                for (;;)
                {
                    _41 = _73;
                    _43 = _72 == 0u;
                    _77 = false;
                    if (!_43)
                    {
                        _77 = true;
                        break;
                    }
                    if (!((_33 & 7u) == 0u))
                    {
                        break;
                    }
                    uint _62 = imageAtomicAdd(_8, int(0u), _33);
                    _42 = _41 + 1u;
                    if (_42 < V.y)
                    {
                        _72 = 0u;
                        _73 = _42;
                        continue;
                    }
                    else
                    {
                        break;
                    }
                }
                if (_77)
                {
                    break;
                }
            }
            uint _65 = imageAtomicAdd(_8, int(0u), _33);
            _74 = _33 + 1u;
            continue;
        }
        _67 = float(_33);
        _68 = float(V.y);
        _69 = float(V.z);
        _70 = float(V.w);
    }
    else
    {
        _67 = 0.0;
        _68 = 0.0;
        _69 = 0.0;
        _70 = 0.0;
    }
    SV_Target.x = _67;
    SV_Target.y = _68;
    SV_Target.z = _69;
    SV_Target.w = _70;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 110
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "V"
OpName %15 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %5 0
%22 = OpConstant %5 1
%25 = OpConstant %5 2
%28 = OpConstant %5 3
%30 = OpTypeBool
%32 = OpConstant %5 10
%35 = OpTypePointer Image %5
%49 = OpConstant %12 0
%53 = OpTypePointer Output %12
%59 = OpConstant %5 7
%66 = OpTypePointer Function %12
%71 = OpTypePointer Function %5
%75 = OpConstantTrue %30
%76 = OpTypePointer Function %30
%78 = OpConstantFalse %30
%3 = OpFunction %1 None %2
%4 = OpLabel
%67 = OpVariable %66 Function
%68 = OpVariable %66 Function
%69 = OpVariable %66 Function
%70 = OpVariable %66 Function
%72 = OpVariable %71 Function
%73 = OpVariable %71 Function
%74 = OpVariable %71 Function
%77 = OpVariable %76 Function
OpBranch %80
%80 = OpLabel
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %11 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %11 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %17 %11 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %17 %11 %28
%29 = OpLoad %5 %27
%31 = OpULessThan %30 %20 %32
OpSelectionMerge %102 None
OpBranchConditional %31 %82 %81
%82 = OpLabel
OpStore %74 %20
OpBranch %83
%83 = OpLabel
%33 = OpLoad %5 %74
%36 = OpImageTexelPointer %35 %8 %19 %19
%37 = OpAtomicIAdd %5 %36 %22 %19 %33
%38 = OpIEqual %30 %23 %19
OpLoopMerge %98 %107 None
OpBranch %84
%84 = OpLabel
OpSelectionMerge %105 None
OpBranchConditional %38 %105 %85
%85 = OpLabel
%39 = OpBitwiseAnd %5 %33 %28
OpStore %72 %39
OpStore %73 %19
OpBranch %86
%86 = OpLabel
%41 = OpLoad %5 %73
%40 = OpLoad %5 %72
%43 = OpIEqual %30 %40 %19
OpStore %77 %78
OpLoopMerge %93 %91 None
OpBranch %87
%87 = OpLabel
OpSelectionMerge %89 None
OpBranchConditional %43 %89 %88
%88 = OpLabel
OpStore %77 %75
OpBranch %93
%89 = OpLabel
%58 = OpBitwiseAnd %5 %33 %59
%60 = OpIEqual %30 %58 %19
OpSelectionMerge %90 None
OpBranchConditional %60 %90 %93
%90 = OpLabel
%61 = OpImageTexelPointer %35 %8 %19 %19
%62 = OpAtomicIAdd %5 %61 %22 %19 %33
%42 = OpIAdd %5 %41 %22
%63 = OpULessThan %30 %42 %23
OpSelectionMerge %108 None
OpBranchConditional %63 %91 %92
%92 = OpLabel
OpBranch %93
%108 = OpLabel
OpUnreachable
%91 = OpLabel
OpStore %72 %19
OpStore %73 %42
OpBranch %86
%93 = OpLabel
%79 = OpLoad %30 %77
OpSelectionMerge %94 None
OpBranchConditional %79 %98 %94
%94 = OpLabel
OpBranch %95
%95 = OpLabel
OpBranch %96
%96 = OpLabel
OpBranch %97
%97 = OpLabel
OpBranch %105
%105 = OpLabel
OpBranch %106
%106 = OpLabel
OpBranch %107
%107 = OpLabel
%64 = OpImageTexelPointer %35 %8 %19 %19
%65 = OpAtomicIAdd %5 %64 %22 %19 %33
%34 = OpIAdd %5 %33 %22
OpStore %74 %34
OpBranch %83
%98 = OpLabel
OpBranch %99
%99 = OpLabel
OpBranch %100
%100 = OpLabel
%44 = OpConvertUToF %12 %33
%45 = OpConvertUToF %12 %23
%46 = OpConvertUToF %12 %26
%47 = OpConvertUToF %12 %29
OpStore %67 %44
OpStore %68 %45
OpStore %69 %46
OpStore %70 %47
OpBranch %101
%101 = OpLabel
OpBranch %102
%81 = OpLabel
OpStore %67 %49
OpStore %68 %49
OpStore %69 %49
OpStore %70 %49
OpBranch %102
%102 = OpLabel
OpBranch %103
%103 = OpLabel
OpBranch %104
%104 = OpLabel
%52 = OpLoad %12 %70
%51 = OpLoad %12 %69
%50 = OpLoad %12 %68
%48 = OpLoad %12 %67
%54 = OpAccessChain %53 %15 %19
OpStore %54 %48
%55 = OpAccessChain %53 %15 %22
OpStore %55 %50
%56 = OpAccessChain %53 %15 %25
OpStore %56 %51
%57 = OpAccessChain %53 %15 %28
OpStore %57 %52
OpReturn
OpFunctionEnd
#endif
