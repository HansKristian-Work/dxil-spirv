float3 main(float3 a : A, float3 b : B, float3 c : C) : SV_Target
{
	precise float3 r = float3(fma(double3(a), double3(b), double3(c)));
	return r;
}
