float2 main(float2 UV : TEXCOORD) : SV_Target
{
	float2 res = EvaluateAttributeCentroid(UV);
	return res;
}
