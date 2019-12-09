#version 460

layout(location = 0) in vec2 TEXCOORD;
bool discard_state;

void discard_exit()
{
    if (discard_state)
    {
        discard;
    }
}

void main()
{
    discard_state = false;
    if (TEXCOORD.x > 10.0)
    {
        discard_state = true;
    }
    else
    {
        if (TEXCOORD.y > 20.0)
        {
            discard_state = true;
        }
    }
    discard_exit();
}


#if 0
// LLVM disassembly
target datalayout = "e-m:e-p:32:32-i1:32-i8:32-i16:32-i32:32-i64:64-f16:32-f32:32-f64:64-n8:16:32:64"
target triple = "dxil-ms-dx"

define void @main() {
  %1 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 0, i32 undef)
  %2 = fcmp fast ogt float %1, 1.000000e+01
  br i1 %2, label %3, label %4

3:                                                ; preds = %0
  call void @dx.op.discard(i32 82, i1 true)
  br label %8

4:                                                ; preds = %0
  %5 = call float @dx.op.loadInput.f32(i32 4, i32 0, i32 0, i8 1, i32 undef)
  %6 = fcmp fast ogt float %5, 2.000000e+01
  br i1 %6, label %7, label %8

7:                                                ; preds = %4
  call void @dx.op.discard(i32 82, i1 true)
  br label %8

8:                                                ; preds = %7, %4, %3
  ret void
}

; Function Attrs: nounwind readnone
declare float @dx.op.loadInput.f32(i32, i32, i32, i8, i32) #0

; Function Attrs: nounwind
declare void @dx.op.discard(i32, i1) #1

attributes #0 = { nounwind readnone }
attributes #1 = { nounwind }

!llvm.ident = !{!0}
!dx.version = !{!1}
!dx.valver = !{!2}
!dx.shaderModel = !{!3}
!dx.viewIdState = !{!4}
!dx.entryPoints = !{!5}

!0 = !{!"clang version 3.7 (tags/RELEASE_370/final)"}
!1 = !{i32 1, i32 0}
!2 = !{i32 1, i32 5}
!3 = !{!"ps", i32 6, i32 0}
!4 = !{[2 x i32] [i32 2, i32 0]}
!5 = !{void ()* @main, !"main", !6, null, null}
!6 = !{!7, null, null}
!7 = !{!8}
!8 = !{i32 0, !"TEXCOORD", i8 9, i8 0, !9, i8 2, i32 1, i8 2, i32 0, i8 0, !10}
!9 = !{i32 0}
!10 = !{i32 3, i32 3}
#endif
#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %18 "discard_state"
OpName %32 "discard_exit"
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%11 = OpTypeInt 32 0
%12 = OpConstant %11 0
%14 = OpTypeBool
%16 = OpConstant %5 10
%17 = OpTypePointer Private %14
%18 = OpVariable %17 Private
%19 = OpConstantFalse %14
%21 = OpConstant %11 1
%24 = OpConstant %5 20
%31 = OpConstantTrue %14
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %18 %19
OpBranch %25
%25 = OpLabel
%10 = OpAccessChain %9 %8 %12
%13 = OpLoad %5 %10
%15 = OpFOrdGreaterThan %14 %13 %16
OpSelectionMerge %30 None
OpBranchConditional %15 %29 %26
%29 = OpLabel
OpStore %18 %31
OpBranch %30
%26 = OpLabel
%20 = OpAccessChain %9 %8 %21
%22 = OpLoad %5 %20
%23 = OpFOrdGreaterThan %14 %22 %24
OpSelectionMerge %28 None
OpBranchConditional %23 %27 %28
%27 = OpLabel
OpStore %18 %31
OpBranch %28
%28 = OpLabel
OpBranch %30
%30 = OpLabel
%38 = OpFunctionCall %1 %32
OpReturn
OpFunctionEnd
%32 = OpFunction %1 None %2
%33 = OpLabel
%36 = OpLoad %14 %18
OpSelectionMerge %35 None
OpBranchConditional %36 %34 %35
%34 = OpLabel
OpKill
%35 = OpLabel
OpReturn
OpFunctionEnd
#endif
