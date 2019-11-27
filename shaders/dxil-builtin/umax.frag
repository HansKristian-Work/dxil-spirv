uint main(nointerpolation uint2 a : A) : SV_Target
{
	return max(a.x, a.y);
}
