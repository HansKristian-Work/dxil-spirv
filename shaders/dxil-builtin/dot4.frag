float main(float4 a : A, float4 b : B) : SV_Target
{
	return dot(a, b);
}
