float main(float3 a : A, float3 b : B) : SV_Target
{
	return dot(a, b);
}
