#version 460

layout(location = 0) flat in ivec4 I;
layout(location = 0) out float SV_Target;

void main()
{
    uint _17 = uint(I.x);
    uint _21 = uint(I.y);
    uint _25 = uint(I.z);
    uint _29 = uint(I.w);
    uint _40;
    uint _41 = _17;
    uint _42 = _21;
    uint _43 = _25;
    uint _44 = _29;
    uint _30;
    uint _31;
    uint _32;
    uint _33;
    bool _46;
    for (;;)
    {
        _33 = _44;
        _32 = _43;
        _31 = _42;
        _30 = _41;
        _46 = _30 == 5u;
        if (_46)
        {
            _40 = 6u;
        }
        else
        {
            if (!(_30 == 7u))
            {
                break;
            }
            _40 = 17u;
        }
        _41 = _31;
        _42 = _32;
        _43 = _33;
        _44 = _40;
        continue;
    }
    SV_Target = float(int(_32 + _31));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
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
%35 = OpConstant %14 17
%36 = OpConstant %14 6
%39 = OpTypePointer Function %14
%45 = OpTypeBool
%47 = OpConstant %14 5
%49 = OpConstant %14 7
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpVariable %39 Function
%41 = OpVariable %39 Function
%42 = OpVariable %39 Function
%43 = OpVariable %39 Function
%44 = OpVariable %39 Function
OpBranch %50
%50 = OpLabel
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
OpStore %41 %17
OpStore %42 %21
OpStore %43 %25
OpStore %44 %29
OpBranch %51
%51 = OpLabel
%33 = OpLoad %14 %44
%32 = OpLoad %14 %43
%31 = OpLoad %14 %42
%30 = OpLoad %14 %41
%46 = OpIEqual %45 %30 %47
OpLoopMerge %54 %62 None
OpBranch %52
%52 = OpLabel
OpSelectionMerge %60 None
OpBranchConditional %46 %59 %53
%59 = OpLabel
OpStore %40 %36
OpBranch %60
%53 = OpLabel
%48 = OpIEqual %45 %30 %49
OpSelectionMerge %58 None
OpBranchConditional %48 %58 %54
%58 = OpLabel
OpStore %40 %35
OpBranch %60
%60 = OpLabel
OpBranch %61
%61 = OpLabel
OpBranch %62
%62 = OpLabel
%34 = OpLoad %14 %40
OpStore %41 %31
OpStore %42 %32
OpStore %43 %33
OpStore %44 %34
OpBranch %51
%54 = OpLabel
OpBranch %55
%55 = OpLabel
OpBranch %56
%56 = OpLabel
OpBranch %57
%57 = OpLabel
%37 = OpIAdd %14 %32 %31
%38 = OpConvertSToF %9 %37
OpStore %11 %38
OpReturn
OpFunctionEnd
#endif
