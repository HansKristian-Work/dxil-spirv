float2 main(float2 UV : TEXCOORD, nointerpolation int sample : SAMPLE) : SV_Target
{
	float2 res = EvaluateAttributeAtSample(UV, 1);
	res += EvaluateAttributeAtSample(UV, sample);
	return res;
}
