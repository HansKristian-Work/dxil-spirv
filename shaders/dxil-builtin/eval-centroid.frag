float2 main(float2 UV[2] : TEXCOORD, float uv0 : UV0, float uv1[2] : UV1, uint a : A, uint b : B) : SV_Target
{
	float2 res0 = EvaluateAttributeCentroid(UV[a]);
	float2 res1 = EvaluateAttributeCentroid(UV[b]);
	return res0 + res1 + EvaluateAttributeCentroid(uv0) + EvaluateAttributeCentroid(uv1[a]);
}
