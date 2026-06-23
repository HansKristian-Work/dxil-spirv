float3 main(float3 a : A, float3 b : B) : SV_Target
{
	return isfinite(a) * b;
}
