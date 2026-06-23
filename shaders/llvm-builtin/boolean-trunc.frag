float main() : SV_Target
{
	float v = 1.0;
	[branch]
	if (IsHelperLane())
		v = 2.0;

	return ddx_fine(v);
}
