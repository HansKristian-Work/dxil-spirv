uint main(nointerpolation uint4 a : A) : SV_Target
{
	return a.x != a.y ? a.z : a.w;
}
