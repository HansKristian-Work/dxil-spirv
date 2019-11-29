float main(float3 a : A) : SV_Target
{
	double3 d = a;
	return float(fma(d.x, d.y, d.z));
}
