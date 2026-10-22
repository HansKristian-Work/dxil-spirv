#version 460

const float _23[5] = float[](1.0, 2.0, 3.0, 4.0, 0.0);

layout(location = 2) in uvec4 A;
float _34[4] = float[](5.0, 6.0, 7.0, 8.0);

void main()
{
    float _56[4];
    _56[0u] = 0.0;
    _56[1u] = 0.0;
    _56[2u] = 0.0;
    _56[3u] = 0.0;
    float _63 = float(uint(gl_VertexIndex) - uint(gl_BaseVertex));
    bool _66 = A.x < 4u;
    if (_66)
    {
        _56[A.x] = _63;
    }
    if (A.y < 4u)
    {
        _34[A.y] = float(uint(gl_InstanceIndex) - uint(gl_BaseInstance));
    }
    float _100;
    if (A.w == 0u)
    {
        _100 = _63;
    }
    else
    {
        uint _73;
        uint _102 = 0u;
        uint _72;
        uint _74;
        bool _76;
        for (;;)
        {
            _72 = _102;
            _74 = _72 ^ 2u;
            _76 = _74 < 4u;
            float _77;
            if (_76)
            {
                _77 = _34[_74];
            }
            else
            {
                _77 = 0.0;
            }
            if (_76)
            {
                _34[_74] = _77 + 60.0;
            }
            _73 = _72 + 1u;
            bool _81 = _73 < 4u;
            float _82;
            if (_81)
            {
                _82 = _56[_73];
            }
            else
            {
                _82 = 0.0;
            }
            if (_81)
            {
                _56[_73] = _82 + 50.0;
            }
            if (_73 == A.w)
            {
                break;
            }
            else
            {
                _102 = _73;
                continue;
            }
        }
        float _86;
        if (_66)
        {
            _86 = _56[A.x];
        }
        else
        {
            _86 = 0.0;
        }
        _100 = _86;
    }
    float _94;
    if (A.w < 4u)
    {
        _94 = _34[A.w];
    }
    else
    {
        _94 = 0.0;
    }
    gl_Position.x = _23[min(A.z, 4u)];
    gl_Position.y = _94;
    gl_Position.z = _100;
    gl_Position.w = 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 143
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
%89 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %8 %11 %15 %25 %34 %48 %52
OpName %3 "main"
OpName %7 "SV_VertexID"
OpName %8 "SV_InstanceID"
OpName %11 "A"
OpName %15 "SV_Position"
OpDecorate %7 BuiltIn VertexIndex
OpDecorate %8 BuiltIn InstanceIndex
OpDecorate %11 Location 2
OpDecorate %15 BuiltIn Position
OpDecorate %48 BuiltIn BaseInstance
OpDecorate %52 BuiltIn BaseVertex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpVariable %6 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpConstant %5 5
%17 = OpTypeArray %12 %16
%18 = OpConstant %12 1
%19 = OpConstant %12 2
%20 = OpConstant %12 3
%21 = OpConstant %12 4
%22 = OpConstantNull %12
%23 = OpConstantComposite %17 %18 %19 %20 %21 %22
%24 = OpTypePointer Private %17
%25 = OpVariable %24 Private %23
%26 = OpConstant %5 4
%27 = OpTypeArray %12 %26
%28 = OpConstant %12 5
%29 = OpConstant %12 6
%30 = OpConstant %12 7
%31 = OpConstant %12 8
%32 = OpConstantComposite %27 %28 %29 %30 %31
%33 = OpTypePointer Private %27
%34 = OpVariable %33 Private %32
%36 = OpConstant %5 0
%39 = OpConstant %5 1
%42 = OpConstant %5 2
%45 = OpConstant %5 3
%48 = OpVariable %6 Input
%52 = OpVariable %6 Input
%55 = OpTypePointer Function %27
%57 = OpTypePointer Function %12
%59 = OpConstant %12 0
%65 = OpTypeBool
%68 = OpTypePointer Private %12
%79 = OpConstant %12 60
%84 = OpConstant %12 50
%95 = OpTypePointer Output %12
%101 = OpTypePointer Function %5
%125 = OpConstantNull %12
%131 = OpConstantNull %12
%138 = OpConstantNull %12
%142 = OpConstantNull %12
%3 = OpFunction %1 None %2
%4 = OpLabel
%56 = OpVariable %55 Function
%100 = OpVariable %57 Function
%102 = OpVariable %101 Function
OpBranch %103
%103 = OpLabel
%35 = OpAccessChain %6 %11 %36
%37 = OpLoad %5 %35
%38 = OpAccessChain %6 %11 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %6 %11 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %6 %11 %45
%46 = OpLoad %5 %44
%47 = OpLoad %5 %8
%49 = OpLoad %5 %48
%50 = OpISub %5 %47 %49
%51 = OpLoad %5 %7
%53 = OpLoad %5 %52
%54 = OpISub %5 %51 %53
%58 = OpInBoundsAccessChain %57 %56 %36
OpStore %58 %59
%60 = OpInBoundsAccessChain %57 %56 %39
OpStore %60 %59
%61 = OpInBoundsAccessChain %57 %56 %42
OpStore %61 %59
%62 = OpInBoundsAccessChain %57 %56 %45
OpStore %62 %59
%63 = OpConvertUToF %12 %54
%66 = OpULessThan %65 %37 %26
%64 = OpInBoundsAccessChain %57 %56 %37
OpSelectionMerge %118 None
OpBranchConditional %66 %117 %118
%117 = OpLabel
OpStore %64 %63
OpBranch %118
%118 = OpLabel
%67 = OpConvertUToF %12 %50
%70 = OpULessThan %65 %40 %26
%69 = OpInBoundsAccessChain %68 %34 %40
OpSelectionMerge %120 None
OpBranchConditional %70 %119 %120
%119 = OpLabel
OpStore %69 %67
OpBranch %120
%120 = OpLabel
%71 = OpIEqual %65 %46 %36
OpSelectionMerge %114 None
OpBranchConditional %71 %113 %104
%104 = OpLabel
OpStore %102 %36
OpBranch %105
%105 = OpLabel
%72 = OpLoad %5 %102
%74 = OpBitwiseXor %5 %72 %42
%76 = OpULessThan %65 %74 %26
%75 = OpInBoundsAccessChain %68 %34 %74
OpLoopMerge %109 %107 None
OpBranch %121
%121 = OpLabel
OpSelectionMerge %123 None
OpBranchConditional %76 %122 %123
%122 = OpLabel
%124 = OpLoad %12 %75
OpBranch %123
%123 = OpLabel
%77 = OpPhi %12 %124 %122 %125 %121
%78 = OpFAdd %12 %77 %79
OpSelectionMerge %127 None
OpBranchConditional %76 %126 %127
%126 = OpLabel
OpStore %75 %78
OpBranch %127
%127 = OpLabel
%73 = OpIAdd %5 %72 %39
%81 = OpULessThan %65 %73 %26
%80 = OpInBoundsAccessChain %57 %56 %73
OpSelectionMerge %129 None
OpBranchConditional %81 %128 %129
%128 = OpLabel
%130 = OpLoad %12 %80
OpBranch %129
%129 = OpLabel
%82 = OpPhi %12 %130 %128 %131 %127
%83 = OpFAdd %12 %82 %84
OpSelectionMerge %133 None
OpBranchConditional %81 %132 %133
%132 = OpLabel
OpStore %80 %83
OpBranch %133
%133 = OpLabel
%85 = OpIEqual %65 %73 %46
OpBranch %106
%106 = OpLabel
OpSelectionMerge %134 None
OpBranchConditional %85 %108 %107
%134 = OpLabel
OpUnreachable
%107 = OpLabel
OpStore %102 %73
OpBranch %105
%108 = OpLabel
OpBranch %109
%109 = OpLabel
OpBranch %110
%110 = OpLabel
OpBranch %111
%111 = OpLabel
OpSelectionMerge %136 None
OpBranchConditional %66 %135 %136
%135 = OpLabel
%137 = OpLoad %12 %64
OpBranch %136
%136 = OpLabel
%86 = OpPhi %12 %137 %135 %138 %111
OpStore %100 %86
OpBranch %112
%112 = OpLabel
OpBranch %114
%113 = OpLabel
OpStore %100 %63
OpBranch %114
%114 = OpLabel
OpBranch %115
%115 = OpLabel
OpBranch %116
%116 = OpLabel
%87 = OpLoad %12 %100
%90 = OpExtInst %5 %89 UMin %43 %26
%88 = OpInBoundsAccessChain %68 %25 %90
%91 = OpLoad %12 %88
%93 = OpULessThan %65 %46 %26
%92 = OpInBoundsAccessChain %68 %34 %46
OpSelectionMerge %140 None
OpBranchConditional %93 %139 %140
%139 = OpLabel
%141 = OpLoad %12 %92
OpBranch %140
%140 = OpLabel
%94 = OpPhi %12 %141 %139 %142 %116
%96 = OpAccessChain %95 %15 %36
OpStore %96 %91
%97 = OpAccessChain %95 %15 %39
OpStore %97 %94
%98 = OpAccessChain %95 %15 %42
OpStore %98 %87
%99 = OpAccessChain %95 %15 %45
OpStore %99 %18
OpReturn
OpFunctionEnd
#endif
