float4 main(float4 a : A, float4 b : B, float4 c : C) : SV_Target
{
	float4 t1 = a + b / c;
	float4 t2 = mad(a, b, c);

	float4 t3 = sqrt(abs(t1));
	float4 t4 = cos(normalize(t2));

	float4 t7 = min(t3, t4);

	return t7;
}
