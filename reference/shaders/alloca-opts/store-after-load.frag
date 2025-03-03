#version 460

layout(set = 0, binding = 0, std140) uniform _10_12
{
    vec4 _m0[6];
} _12;

layout(location = 0) flat in uint A;
layout(location = 1) in vec4 P;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _35[6];
    float _36[6];
    float _37[6];
    float _38[6];
    _35[0u] = _12._m0[0u].x;
    _36[0u] = _12._m0[0u].y;
    _37[0u] = _12._m0[0u].z;
    _38[0u] = _12._m0[0u].w;
    _35[1u] = _12._m0[1u].x;
    _36[1u] = _12._m0[1u].y;
    _37[1u] = _12._m0[1u].z;
    _38[1u] = _12._m0[1u].w;
    _35[2u] = _12._m0[2u].x;
    _36[2u] = _12._m0[2u].y;
    _37[2u] = _12._m0[2u].z;
    _38[2u] = _12._m0[2u].w;
    uint _71 = A % 3u;
    float _81;
    if (_71 < 6u)
    {
        _81 = _35[_71];
    }
    else
    {
        _81 = 0.0;
    }
    float _82;
    if (_71 < 6u)
    {
        _82 = _36[_71];
    }
    else
    {
        _82 = 0.0;
    }
    float _83;
    if (_71 < 6u)
    {
        _83 = _37[_71];
    }
    else
    {
        _83 = 0.0;
    }
    float _84;
    if (_71 < 6u)
    {
        _84 = _38[_71];
    }
    else
    {
        _84 = 0.0;
    }
    _35[3u] = _12._m0[3u].x;
    _36[3u] = _12._m0[3u].y;
    _37[3u] = _12._m0[3u].z;
    _38[3u] = _12._m0[3u].w;
    _35[4u] = _12._m0[4u].x;
    _36[4u] = _12._m0[4u].y;
    _37[4u] = _12._m0[4u].z;
    _38[4u] = _12._m0[4u].w;
    _35[5u] = _12._m0[5u].x;
    _36[5u] = _12._m0[5u].y;
    _37[5u] = _12._m0[5u].z;
    _38[5u] = _12._m0[5u].w;
    uint _117 = A % 6u;
    float _126;
    if (_117 < 6u)
    {
        _126 = _35[_117];
    }
    else
    {
        _126 = 0.0;
    }
    float _127;
    if (_117 < 6u)
    {
        _127 = _36[_117];
    }
    else
    {
        _127 = 0.0;
    }
    float _128;
    if (_117 < 6u)
    {
        _128 = _37[_117];
    }
    else
    {
        _128 = 0.0;
    }
    float _129;
    if (_117 < 6u)
    {
        _129 = _38[_117];
    }
    else
    {
        _129 = 0.0;
    }
    SV_Target.x = (_126 * P.x) + _81;
    SV_Target.y = (_127 * P.y) + _82;
    SV_Target.z = (_128 * P.z) + _83;
    SV_Target.w = (_129 * P.w) + _84;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 177
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "A"
OpName %16 "P"
OpName %18 "SV_Target"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 6
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %8
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %8
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %7
%21 = OpConstant %5 0
%24 = OpConstant %5 1
%27 = OpConstant %5 2
%30 = OpConstant %5 3
%33 = OpTypeArray %7 %6
%34 = OpTypePointer Function %33
%39 = OpTypePointer Uniform %8
%46 = OpTypePointer Function %7
%73 = OpTypeBool
%95 = OpConstant %5 4
%106 = OpConstant %5 5
%138 = OpTypePointer Output %7
%147 = OpConstantNull %7
%151 = OpConstantNull %7
%155 = OpConstantNull %7
%159 = OpConstantNull %7
%163 = OpConstantNull %7
%167 = OpConstantNull %7
%171 = OpConstantNull %7
%175 = OpConstantNull %7
%3 = OpFunction %1 None %2
%4 = OpLabel
%35 = OpVariable %34 Function
%36 = OpVariable %34 Function
%37 = OpVariable %34 Function
%38 = OpVariable %34 Function
OpBranch %143
%143 = OpLabel
%20 = OpAccessChain %19 %16 %21
%22 = OpLoad %7 %20
%23 = OpAccessChain %19 %16 %24
%25 = OpLoad %7 %23
%26 = OpAccessChain %19 %16 %27
%28 = OpLoad %7 %26
%29 = OpAccessChain %19 %16 %30
%31 = OpLoad %7 %29
%32 = OpLoad %5 %14
%40 = OpAccessChain %39 %12 %21 %21
%41 = OpLoad %8 %40
%42 = OpCompositeExtract %7 %41 0
%43 = OpCompositeExtract %7 %41 1
%44 = OpCompositeExtract %7 %41 2
%45 = OpCompositeExtract %7 %41 3
%47 = OpAccessChain %46 %35 %21
%48 = OpAccessChain %46 %36 %21
%49 = OpAccessChain %46 %37 %21
%50 = OpAccessChain %46 %38 %21
OpStore %47 %42
OpStore %48 %43
OpStore %49 %44
OpStore %50 %45
%51 = OpAccessChain %39 %12 %21 %24
%52 = OpLoad %8 %51
%53 = OpCompositeExtract %7 %52 0
%54 = OpCompositeExtract %7 %52 1
%55 = OpCompositeExtract %7 %52 2
%56 = OpCompositeExtract %7 %52 3
%57 = OpAccessChain %46 %35 %24
%58 = OpAccessChain %46 %36 %24
%59 = OpAccessChain %46 %37 %24
%60 = OpAccessChain %46 %38 %24
OpStore %57 %53
OpStore %58 %54
OpStore %59 %55
OpStore %60 %56
%61 = OpAccessChain %39 %12 %21 %27
%62 = OpLoad %8 %61
%63 = OpCompositeExtract %7 %62 0
%64 = OpCompositeExtract %7 %62 1
%65 = OpCompositeExtract %7 %62 2
%66 = OpCompositeExtract %7 %62 3
%67 = OpAccessChain %46 %35 %27
%68 = OpAccessChain %46 %36 %27
%69 = OpAccessChain %46 %37 %27
%70 = OpAccessChain %46 %38 %27
OpStore %67 %63
OpStore %68 %64
OpStore %69 %65
OpStore %70 %66
%71 = OpUMod %5 %32 %30
%74 = OpULessThan %73 %71 %6
%72 = OpAccessChain %46 %35 %71
%76 = OpULessThan %73 %71 %6
%75 = OpAccessChain %46 %36 %71
%78 = OpULessThan %73 %71 %6
%77 = OpAccessChain %46 %37 %71
%80 = OpULessThan %73 %71 %6
%79 = OpAccessChain %46 %38 %71
OpSelectionMerge %145 None
OpBranchConditional %74 %144 %145
%144 = OpLabel
%146 = OpLoad %7 %72
OpBranch %145
%145 = OpLabel
%81 = OpPhi %7 %146 %144 %147 %143
OpSelectionMerge %149 None
OpBranchConditional %76 %148 %149
%148 = OpLabel
%150 = OpLoad %7 %75
OpBranch %149
%149 = OpLabel
%82 = OpPhi %7 %150 %148 %151 %145
OpSelectionMerge %153 None
OpBranchConditional %78 %152 %153
%152 = OpLabel
%154 = OpLoad %7 %77
OpBranch %153
%153 = OpLabel
%83 = OpPhi %7 %154 %152 %155 %149
OpSelectionMerge %157 None
OpBranchConditional %80 %156 %157
%156 = OpLabel
%158 = OpLoad %7 %79
OpBranch %157
%157 = OpLabel
%84 = OpPhi %7 %158 %156 %159 %153
%85 = OpAccessChain %39 %12 %21 %30
%86 = OpLoad %8 %85
%87 = OpCompositeExtract %7 %86 0
%88 = OpCompositeExtract %7 %86 1
%89 = OpCompositeExtract %7 %86 2
%90 = OpCompositeExtract %7 %86 3
%91 = OpAccessChain %46 %35 %30
%92 = OpAccessChain %46 %36 %30
%93 = OpAccessChain %46 %37 %30
%94 = OpAccessChain %46 %38 %30
OpStore %91 %87
OpStore %92 %88
OpStore %93 %89
OpStore %94 %90
%96 = OpAccessChain %39 %12 %21 %95
%97 = OpLoad %8 %96
%98 = OpCompositeExtract %7 %97 0
%99 = OpCompositeExtract %7 %97 1
%100 = OpCompositeExtract %7 %97 2
%101 = OpCompositeExtract %7 %97 3
%102 = OpAccessChain %46 %35 %95
%103 = OpAccessChain %46 %36 %95
%104 = OpAccessChain %46 %37 %95
%105 = OpAccessChain %46 %38 %95
OpStore %102 %98
OpStore %103 %99
OpStore %104 %100
OpStore %105 %101
%107 = OpAccessChain %39 %12 %21 %106
%108 = OpLoad %8 %107
%109 = OpCompositeExtract %7 %108 0
%110 = OpCompositeExtract %7 %108 1
%111 = OpCompositeExtract %7 %108 2
%112 = OpCompositeExtract %7 %108 3
%113 = OpAccessChain %46 %35 %106
%114 = OpAccessChain %46 %36 %106
%115 = OpAccessChain %46 %37 %106
%116 = OpAccessChain %46 %38 %106
OpStore %113 %109
OpStore %114 %110
OpStore %115 %111
OpStore %116 %112
%117 = OpUMod %5 %32 %6
%119 = OpULessThan %73 %117 %6
%118 = OpAccessChain %46 %35 %117
%121 = OpULessThan %73 %117 %6
%120 = OpAccessChain %46 %36 %117
%123 = OpULessThan %73 %117 %6
%122 = OpAccessChain %46 %37 %117
%125 = OpULessThan %73 %117 %6
%124 = OpAccessChain %46 %38 %117
OpSelectionMerge %161 None
OpBranchConditional %119 %160 %161
%160 = OpLabel
%162 = OpLoad %7 %118
OpBranch %161
%161 = OpLabel
%126 = OpPhi %7 %162 %160 %163 %157
OpSelectionMerge %165 None
OpBranchConditional %121 %164 %165
%164 = OpLabel
%166 = OpLoad %7 %120
OpBranch %165
%165 = OpLabel
%127 = OpPhi %7 %166 %164 %167 %161
OpSelectionMerge %169 None
OpBranchConditional %123 %168 %169
%168 = OpLabel
%170 = OpLoad %7 %122
OpBranch %169
%169 = OpLabel
%128 = OpPhi %7 %170 %168 %171 %165
OpSelectionMerge %173 None
OpBranchConditional %125 %172 %173
%172 = OpLabel
%174 = OpLoad %7 %124
OpBranch %173
%173 = OpLabel
%129 = OpPhi %7 %174 %172 %175 %169
%130 = OpFMul %7 %126 %22
%131 = OpFMul %7 %127 %25
%132 = OpFMul %7 %128 %28
%133 = OpFMul %7 %129 %31
%134 = OpFAdd %7 %130 %81
%135 = OpFAdd %7 %131 %82
%136 = OpFAdd %7 %132 %83
%137 = OpFAdd %7 %133 %84
%139 = OpAccessChain %138 %18 %21
OpStore %139 %134
%140 = OpAccessChain %138 %18 %24
OpStore %140 %135
%141 = OpAccessChain %138 %18 %27
OpStore %141 %136
%142 = OpAccessChain %138 %18 %30
OpStore %142 %137
OpReturn
OpFunctionEnd
#endif
