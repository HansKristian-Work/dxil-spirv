uint bitreverse8(uint x)
{
	uint rev = ((x << 1) & 0xAA) | ((x >> 1) & 0x55);
	rev = ((rev << 2) & 0xCC) | ((rev >> 2) & 0x33);
	return ((rev << 4) & 0xF0) | (rev >> 4);
}

uint main(uint x : A) : SV_Target
{
	return bitreverse8(x);
}
