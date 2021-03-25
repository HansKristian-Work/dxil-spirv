float main(uint cov : SV_InnerCoverage) : SV_Target
{
	if (cov == 0)
		discard;
	return 1.0;
}
