float main(float4 a : A) : SV_Target
{
	return isnan(a.x) == isnan(a.y) ? a.z : a.w;
}
