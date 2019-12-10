uint2 main(float a : A) : SV_Target
{
	uint oa, ob;
	asuint(double(a), oa, ob);
	return uint2(oa, ob);
}
