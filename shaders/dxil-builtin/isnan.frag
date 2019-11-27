float main(float3 a : A) : SV_Target
{
	return isnan(a.x) ? a.y : a.z;
}
