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
; Bound: 138
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
OpCapability VulkanMemoryModel
%89 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
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
%120 = OpConstantNull %12
%126 = OpConstantNull %12
%133 = OpConstantNull %12
%137 = OpConstantNull %12
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
OpSelectionMerge %113 None
OpBranchConditional %66 %112 %113
%112 = OpLabel
OpStore %64 %63
OpBranch %113
%113 = OpLabel
%67 = OpConvertUToF %12 %50
%70 = OpULessThan %65 %40 %26
%69 = OpInBoundsAccessChain %68 %34 %40
OpSelectionMerge %115 None
OpBranchConditional %70 %114 %115
%114 = OpLabel
OpStore %69 %67
OpBranch %115
%115 = OpLabel
%71 = OpIEqual %65 %46 %36
OpSelectionMerge %110 None
OpBranchConditional %71 %109 %104
%104 = OpLabel
OpStore %102 %36
OpBranch %105
%105 = OpLabel
%72 = OpLoad %5 %102
%74 = OpBitwiseXor %5 %72 %42
%76 = OpULessThan %65 %74 %26
%75 = OpInBoundsAccessChain %68 %34 %74
OpLoopMerge %108 %107 None
OpBranch %116
%116 = OpLabel
OpSelectionMerge %118 None
OpBranchConditional %76 %117 %118
%117 = OpLabel
%119 = OpLoad %12 %75
OpBranch %118
%118 = OpLabel
%77 = OpPhi %12 %119 %117 %120 %116
%78 = OpFAdd %12 %77 %79
OpSelectionMerge %122 None
OpBranchConditional %76 %121 %122
%121 = OpLabel
OpStore %75 %78
OpBranch %122
%122 = OpLabel
%73 = OpIAdd %5 %72 %39
%81 = OpULessThan %65 %73 %26
%80 = OpInBoundsAccessChain %57 %56 %73
OpSelectionMerge %124 None
OpBranchConditional %81 %123 %124
%123 = OpLabel
%125 = OpLoad %12 %80
OpBranch %124
%124 = OpLabel
%82 = OpPhi %12 %125 %123 %126 %122
%83 = OpFAdd %12 %82 %84
OpSelectionMerge %128 None
OpBranchConditional %81 %127 %128
%127 = OpLabel
OpStore %80 %83
OpBranch %128
%128 = OpLabel
%85 = OpIEqual %65 %73 %46
OpBranch %106
%106 = OpLabel
OpSelectionMerge %129 None
OpBranchConditional %85 %108 %107
%129 = OpLabel
OpUnreachable
%107 = OpLabel
OpStore %102 %73
OpBranch %105
%108 = OpLabel
OpSelectionMerge %131 None
OpBranchConditional %66 %130 %131
%130 = OpLabel
%132 = OpLoad %12 %64
OpBranch %131
%131 = OpLabel
%86 = OpPhi %12 %132 %130 %133 %108
OpStore %100 %86
OpBranch %110
%109 = OpLabel
OpStore %100 %63
OpBranch %110
%110 = OpLabel
OpBranch %111
%111 = OpLabel
%87 = OpLoad %12 %100
%90 = OpExtInst %5 %89 UMin %43 %26
%88 = OpInBoundsAccessChain %68 %25 %90
%91 = OpLoad %12 %88
%93 = OpULessThan %65 %46 %26
%92 = OpInBoundsAccessChain %68 %34 %46
OpSelectionMerge %135 None
OpBranchConditional %93 %134 %135
%134 = OpLabel
%136 = OpLoad %12 %92
OpBranch %135
%135 = OpLabel
%94 = OpPhi %12 %136 %134 %137 %111
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
