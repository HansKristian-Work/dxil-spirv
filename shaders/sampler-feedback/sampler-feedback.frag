// We ignore the kind of sampler feedback used, so don't bother testing it exhaustively.
FeedbackTexture2D<SAMPLER_FEEDBACK_MIP_REGION_USED> F0 : register(u0);
FeedbackTexture2DArray<SAMPLER_FEEDBACK_MIN_MIP> F1 : register(u1);
FeedbackTexture2D<SAMPLER_FEEDBACK_MIP_REGION_USED> F2[] : register(u0, space1);
FeedbackTexture2DArray<SAMPLER_FEEDBACK_MIP_REGION_USED> F3[] : register(u0, space2);

Texture2D<float4> T : register(t0);
Texture2DArray<float4> TArray : register(t1);
Texture2D<float4> Ts[] : register(t0, space1);
Texture2DArray<float4> TArrays[] : register(t0, space2);

// Comparison samplers don't work. Not a huge deal since we can estimate footprint with non-comparison samplers just fine. :')
SamplerState S : register(s0);
SamplerState Ss[] : register(s0, space1);

void main(float4 pos : SV_Position, float2 grad_x : GRADX, float2 grad_y : GRADY, float mipclamp : CLAMP, uint idx : IDX)
{
	// Test all HLSL calls available.
	F0.WriteSamplerFeedback(T, S, pos.xy);
	// Undocumented, with clamp
	F0.WriteSamplerFeedback(T, S, pos.xy, mipclamp);
	F0.WriteSamplerFeedbackLevel(T, S, pos.xy, pos.z);
	F0.WriteSamplerFeedbackGrad(T, S, pos.xy, grad_x, grad_y);
	// Undocumented, with clamp
	F0.WriteSamplerFeedbackGrad(T, S, pos.xy, grad_x, grad_y, mipclamp);
	F0.WriteSamplerFeedbackBias(T, S, pos.xy, pos.z);
	// Undocumented, with clamp
	F0.WriteSamplerFeedbackBias(T, S, pos.xy, pos.z, mipclamp);

	// Test array versions.
	F1.WriteSamplerFeedback(TArray, S, pos.xyz);
	// Undocumented, with clamp
	F1.WriteSamplerFeedback(TArray, S, pos.xyz, mipclamp);
	F1.WriteSamplerFeedbackLevel(TArray, S, pos.xyz, pos.w);
	F1.WriteSamplerFeedbackGrad(TArray, S, pos.xyz, grad_x, grad_y);
	// Undocumented, with clamp
	F1.WriteSamplerFeedbackGrad(TArray, S, pos.xyz, grad_x, grad_y, mipclamp);
	F1.WriteSamplerFeedbackBias(TArray, S, pos.xyz, pos.z);
	// Undocumented, with clamp
	F1.WriteSamplerFeedbackBias(TArray, S, pos.xyz, pos.w, mipclamp);

	// Test indexing
	F2[idx].WriteSamplerFeedback(Ts[idx], Ss[idx], pos.xy);
	F3[idx].WriteSamplerFeedback(TArrays[idx], Ss[idx], pos.xyz);

	// Test non-uniform indexing
	F2[NonUniformResourceIndex(idx)].WriteSamplerFeedback(Ts[NonUniformResourceIndex(idx)], Ss[NonUniformResourceIndex(idx)], pos.xy);
	F3[NonUniformResourceIndex(idx)].WriteSamplerFeedback(TArrays[NonUniformResourceIndex(idx)], Ss[NonUniformResourceIndex(idx)], pos.xyz);
}

