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
    bool _46;
    for (;;)
    {
        _46 = _30 == 5u;
        if (_46)
        {
            _34 = 6u;
        }
        else
        {
            if (!(_30 == 7u))
            {
                break;
            }
            _34 = 17u;
        }
        _30 = _31;
        _31 = _32;
        _32 = _33;
        _33 = _34;
        continue;
    }
    SV_Target = float(int(_32 + _31));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
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
OpBranch %51
%51 = OpLabel
%30 = OpPhi %14 %17 %50 %31 %59
%31 = OpPhi %14 %21 %50 %32 %59
%32 = OpPhi %14 %25 %50 %33 %59
%33 = OpPhi %14 %29 %50 %34 %59
%46 = OpIEqual %45 %30 %47
OpLoopMerge %54 %59 None
OpBranch %52
%52 = OpLabel
OpSelectionMerge %58 None
OpBranchConditional %46 %57 %53
%53 = OpLabel
%48 = OpIEqual %45 %30 %49
OpSelectionMerge %56 None
OpBranchConditional %48 %56 %54
%54 = OpLabel
OpBranch %55
%55 = OpLabel
%37 = OpIAdd %14 %32 %31
%38 = OpConvertSToF %9 %37
OpStore %11 %38
OpReturn
%56 = OpLabel
OpBranch %58
%57 = OpLabel
OpBranch %58
%58 = OpLabel
%34 = OpPhi %14 %36 %57 %35 %56
OpBranch %59
%59 = OpLabel
OpBranch %51
OpFunctionEnd
#endif
