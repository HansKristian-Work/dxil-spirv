#version 460

layout(set = 0, binding = 0, r32ui) uniform uimageBuffer _8;

layout(location = 0) flat in uvec4 V;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _33;
    float _36;
    float _38;
    float _40;
    if (V.x < 10u)
    {
        uint _47;
        _47 = V.x;
        bool _52;
        for (;;)
        {
            uint _51 = imageAtomicAdd(_8, int(0u), _47);
            _52 = V.y == 0u;
            if (!_52)
            {
                uint _55 = _47 & 3u;
                bool ladder_phi_10;
                uint _56 = _55;
                uint _57 = 0u;
                for (;;)
                {
                    if (_56 == 0u)
                    {
                        if (!((_47 & 7u) == 0u))
                        {
                            ladder_phi_10 = false;
                            break;
                        }
                        uint _64 = imageAtomicAdd(_8, int(0u), _47);
                        uint _58 = _57 + 1u;
                        if (_58 < V.y)
                        {
                            _56 = 0u;
                            _57 = _58;
                            continue;
                        }
                        else
                        {
                            ladder_phi_10 = false;
                            break;
                        }
                    }
                    else
                    {
                        ladder_phi_10 = true;
                        break;
                    }
                }
                if (ladder_phi_10)
                {
                    break;
                }
            }
            uint _54 = imageAtomicAdd(_8, int(0u), _47);
            _47++;
            continue;
        }
        _33 = float(_47);
        _36 = float(V.y);
        _38 = float(V.z);
        _40 = float(V.w);
    }
    else
    {
        _33 = 0.0;
        _36 = 0.0;
        _38 = 0.0;
        _40 = 0.0;
    }
    SV_Target.x = _33;
    SV_Target.y = _36;
    SV_Target.z = _38;
    SV_Target.w = _40;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 85
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "V"
OpName %15 "SV_Target"
OpName %66 "ladder_phi_10"
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
%35 = OpConstant %12 0
%42 = OpTypePointer Output %12
%49 = OpTypePointer Image %5
%61 = OpConstant %5 7
%67 = OpConstantFalse %30
%68 = OpConstantTrue %30
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %69
%69 = OpLabel
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
OpSelectionMerge %80 None
OpBranchConditional %31 %70 %80
%70 = OpLabel
OpBranch %71
%71 = OpLabel
%47 = OpPhi %5 %20 %70 %48 %83
%50 = OpImageTexelPointer %49 %8 %19 %19
%51 = OpAtomicIAdd %5 %50 %22 %19 %47
%52 = OpIEqual %30 %23 %19
OpLoopMerge %79 %83 None
OpBranch %72
%72 = OpLabel
OpSelectionMerge %82 None
OpBranchConditional %52 %82 %73
%73 = OpLabel
%55 = OpBitwiseAnd %5 %47 %28
OpBranch %74
%74 = OpLabel
%56 = OpPhi %5 %55 %73 %19 %77
%57 = OpPhi %5 %19 %73 %58 %77
%59 = OpIEqual %30 %56 %19
OpLoopMerge %78 %77 None
OpBranchConditional %59 %75 %78
%75 = OpLabel
%60 = OpBitwiseAnd %5 %47 %61
%62 = OpIEqual %30 %60 %19
OpSelectionMerge %76 None
OpBranchConditional %62 %76 %78
%76 = OpLabel
OpBranch %77
%77 = OpLabel
%63 = OpImageTexelPointer %49 %8 %19 %19
%64 = OpAtomicIAdd %5 %63 %22 %19 %47
%58 = OpIAdd %5 %57 %22
%65 = OpULessThan %30 %58 %23
OpBranchConditional %65 %74 %78
%78 = OpLabel
%66 = OpPhi %30 %67 %75 %67 %77 %68 %74
OpSelectionMerge %81 None
OpBranchConditional %66 %79 %81
%81 = OpLabel
OpBranch %82
%82 = OpLabel
OpBranch %83
%83 = OpLabel
%53 = OpImageTexelPointer %49 %8 %19 %19
%54 = OpAtomicIAdd %5 %53 %22 %19 %47
%48 = OpIAdd %5 %47 %22
OpBranch %71
%79 = OpLabel
%34 = OpConvertUToF %12 %47
%37 = OpConvertUToF %12 %23
%39 = OpConvertUToF %12 %26
%41 = OpConvertUToF %12 %29
OpBranch %80
%80 = OpLabel
%33 = OpPhi %12 %35 %69 %34 %79
%36 = OpPhi %12 %35 %69 %37 %79
%38 = OpPhi %12 %35 %69 %39 %79
%40 = OpPhi %12 %35 %69 %41 %79
%43 = OpAccessChain %42 %15 %19
OpStore %43 %33
%44 = OpAccessChain %42 %15 %22
OpStore %44 %36
%45 = OpAccessChain %42 %15 %25
OpStore %45 %38
%46 = OpAccessChain %42 %15 %28
OpStore %46 %40
OpReturn
OpFunctionEnd
#endif
