uint main(nointerpolation uint3 a : A) : SV_Target
{
	return mad(a.x, a.y, a.z);
}
