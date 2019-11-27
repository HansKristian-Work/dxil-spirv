float main(float3 a : A) : SV_Target
{
	return isinf(a.x) ? a.y : a.z;
}
