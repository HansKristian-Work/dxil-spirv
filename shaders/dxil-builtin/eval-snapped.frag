float2 main(float2 UV : TEXCOORD, nointerpolation int2 code : CODE) : SV_Target
{
	float2 res = EvaluateAttributeSnapped(UV, int2(-7, 4));
	res += EvaluateAttributeSnapped(UV, code);
	return res;
}
