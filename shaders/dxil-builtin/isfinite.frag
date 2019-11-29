float main(float3 a : A) : SV_Target
{
	return isfinite(a.x) ? a.y : a.z;
}
