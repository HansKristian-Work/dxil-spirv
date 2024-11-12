uint main(uint a : A, uint b : B) : SV_Target
{
	uint64_t c = a | (uint64_t(b) << 32);
	return firstbithigh(c);
}
