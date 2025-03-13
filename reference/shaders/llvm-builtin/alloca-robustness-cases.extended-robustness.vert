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
    float _72;
    if (A.w == 0u)
    {
        _72 = _63;
    }
    else
    {
        uint _86;
        _86 = 0u;
        float _91;
        uint _88;
        bool _90;
        for (;;)
        {
            _88 = _86 ^ 2u;
            _90 = _88 < 4u;
            if (_90)
            {
                _91 = _34[_88];
            }
            else
            {
                _91 = 0.0;
            }
            if (_90)
            {
                _34[_88] = _91 + 60.0;
            }
            uint _87 = _86 + 1u;
            bool _95 = _87 < 4u;
            float _96;
            if (_95)
            {
                _96 = _56[_87];
            }
            else
            {
                _96 = 0.0;
            }
            if (_95)
            {
                _56[_87] = _96 + 50.0;
            }
            if (_87 == A.w)
            {
                break;
            }
            else
            {
                _86 = _87;
                continue;
            }
        }
        float _73;
        if (_66)
        {
            _73 = _56[A.x];
        }
        else
        {
            _73 = 0.0;
        }
        _72 = _73;
    }
    float _80;
    if (A.w < 4u)
    {
        _80 = _34[A.w];
    }
    else
    {
        _80 = 0.0;
    }
    gl_Position.x = _23[min(A.z, 4u)];
    gl_Position.y = _80;
    gl_Position.z = _72;
    gl_Position.w = 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 131
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
%75 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %8 %11 %15 %48 %52
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
%81 = OpTypePointer Output %12
%93 = OpConstant %12 60
%98 = OpConstant %12 50
%113 = OpConstantNull %12
%119 = OpConstantNull %12
%125 = OpConstantNull %12
%129 = OpConstantNull %12
%3 = OpFunction %1 None %2
%4 = OpLabel
%56 = OpVariable %55 Function
OpBranch %100
%100 = OpLabel
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
OpSelectionMerge %106 None
OpBranchConditional %66 %105 %106
%105 = OpLabel
OpStore %64 %63
OpBranch %106
%106 = OpLabel
%67 = OpConvertUToF %12 %50
%70 = OpULessThan %65 %40 %26
%69 = OpInBoundsAccessChain %68 %34 %40
OpSelectionMerge %108 None
OpBranchConditional %70 %107 %108
%107 = OpLabel
OpStore %69 %67
OpBranch %108
%108 = OpLabel
%71 = OpIEqual %65 %46 %36
OpSelectionMerge %104 None
OpBranchConditional %71 %104 %101
%101 = OpLabel
OpBranch %102
%102 = OpLabel
%86 = OpPhi %5 %36 %101 %87 %121
%88 = OpBitwiseXor %5 %86 %42
%90 = OpULessThan %65 %88 %26
%89 = OpInBoundsAccessChain %68 %34 %88
OpLoopMerge %103 %109 None
OpBranch %109
%109 = OpLabel
OpSelectionMerge %111 None
OpBranchConditional %90 %110 %111
%110 = OpLabel
%112 = OpLoad %12 %89
OpBranch %111
%111 = OpLabel
%91 = OpPhi %12 %112 %110 %113 %109
%92 = OpFAdd %12 %91 %93
OpSelectionMerge %115 None
OpBranchConditional %90 %114 %115
%114 = OpLabel
OpStore %89 %92
OpBranch %115
%115 = OpLabel
%87 = OpIAdd %5 %86 %39
%95 = OpULessThan %65 %87 %26
%94 = OpInBoundsAccessChain %57 %56 %87
OpSelectionMerge %117 None
OpBranchConditional %95 %116 %117
%116 = OpLabel
%118 = OpLoad %12 %94
OpBranch %117
%117 = OpLabel
%96 = OpPhi %12 %118 %116 %119 %115
%97 = OpFAdd %12 %96 %98
OpSelectionMerge %121 None
OpBranchConditional %95 %120 %121
%120 = OpLabel
OpStore %94 %97
OpBranch %121
%121 = OpLabel
%99 = OpIEqual %65 %87 %46
OpBranchConditional %99 %103 %102
%103 = OpLabel
OpSelectionMerge %123 None
OpBranchConditional %66 %122 %123
%122 = OpLabel
%124 = OpLoad %12 %64
OpBranch %123
%123 = OpLabel
%73 = OpPhi %12 %124 %122 %125 %103
OpBranch %104
%104 = OpLabel
%72 = OpPhi %12 %63 %108 %73 %123
%76 = OpExtInst %5 %75 UMin %43 %26
%74 = OpInBoundsAccessChain %68 %25 %76
%77 = OpLoad %12 %74
%79 = OpULessThan %65 %46 %26
%78 = OpInBoundsAccessChain %68 %34 %46
OpSelectionMerge %127 None
OpBranchConditional %79 %126 %127
%126 = OpLabel
%128 = OpLoad %12 %78
OpBranch %127
%127 = OpLabel
%80 = OpPhi %12 %128 %126 %129 %104
%82 = OpAccessChain %81 %15 %36
OpStore %82 %77
%83 = OpAccessChain %81 %15 %39
OpStore %83 %80
%84 = OpAccessChain %81 %15 %42
OpStore %84 %72
%85 = OpAccessChain %81 %15 %45
OpStore %85 %18
OpReturn
OpFunctionEnd
#endif
