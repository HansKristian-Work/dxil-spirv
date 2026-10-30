uint bitreverse4(uint x)
{
	uint rev = ((x << 1) & 10) | ((x >> 1) & 5);
	return ((rev << 2) & 12) | (rev >> 2);
}

uint main(uint x : A) : SV_Target
{
	return bitreverse4(x);
}
