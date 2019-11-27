uint main(nointerpolation uint2 a : A) : SV_Target
{
	return min(a.x, a.y);
}
