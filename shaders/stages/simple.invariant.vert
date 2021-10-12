float4 main(float4 a : A, float4 b : B, float4 c : C) : SV_Position
{
	return mad(a, b, c);
}
