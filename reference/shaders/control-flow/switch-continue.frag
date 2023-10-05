#version 460

layout(location = 0) flat in ivec4 I;
layout(location = 0) out float SV_Target;

void main()
{
    uint _17 = uint(I.x);
    uint _29 = uint(I.w);
    uint _31;
    uint _32;
    _31 = uint(I.y);
    _32 = uint(I.z);
    uint _34;
    uint _30 = _17;
    uint _33 = _29;
    for (;;)
    {
        bool _41_ladder_break = false;
        switch (_30)
        {
            case 5u:
            {
                _34 = 6u;
                _30 = _31;
                _31 = _32;
                _32 = _33;
                _33 = _34;
                continue;
            }
            case 7u:
            {
                _34 = 17u;
                _30 = _31;
                _31 = _32;
                _32 = _33;
                _33 = _34;
                continue;
            }
            default:
            {
                _41_ladder_break = true;
                break;
            }
        }
        if (_41_ladder_break)
        {
            break;
        }
    }
    SV_Target = float(int(_32 + _31));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "I"
OpName %11 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeFloat 32
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%19 = OpConstant %14 1
%23 = OpConstant %14 2
%27 = OpConstant %14 3
%37 = OpConstant %14 17
%38 = OpConstant %14 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpBitcast %14 %16
%18 = OpAccessChain %12 %8 %19
%20 = OpLoad %5 %18
%21 = OpBitcast %14 %20
%22 = OpAccessChain %12 %8 %23
%24 = OpLoad %5 %22
%25 = OpBitcast %14 %24
%26 = OpAccessChain %12 %8 %27
%28 = OpLoad %5 %26
%29 = OpBitcast %14 %28
OpBranch %40
%40 = OpLabel
%30 = OpPhi %14 %17 %39 %31 %44
%31 = OpPhi %14 %21 %39 %32 %44
%32 = OpPhi %14 %25 %39 %33 %44
%33 = OpPhi %14 %29 %39 %34 %44
OpLoopMerge %46 %44 None
OpBranch %41
%41 = OpLabel
OpSelectionMerge %47 None
OpSwitch %30 %45 5 %43 7 %42
%45 = OpLabel
OpBranch %46
%43 = OpLabel
OpBranch %44
%42 = OpLabel
OpBranch %44
%47 = OpLabel
OpUnreachable
%44 = OpLabel
%34 = OpPhi %14 %37 %42 %38 %43
OpBranch %40
%46 = OpLabel
%35 = OpIAdd %14 %32 %31
%36 = OpConvertSToF %9 %35
OpStore %11 %36
OpReturn
OpFunctionEnd
#endif
