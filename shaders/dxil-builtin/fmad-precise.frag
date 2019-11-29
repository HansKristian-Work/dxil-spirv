float main(float3 a : A) : SV_Target
{
	precise float res = mad(a.x, a.y, a.z);
	return res;
}
