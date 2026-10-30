uint bitreverse32(uint x)
{
	uint rev = ((x << 1) & 0xAAAAAAAA) | ((x >> 1) & 0x55555555);
	rev = ((rev << 2) & 0xCCCCCCCC) | ((rev >> 2) & 0x33333333);
	rev = ((rev << 4) & 0xF0F0F0F0) | ((rev >> 4) & 0x0F0F0F0F);
	rev = ((rev << 8) & 0xFF00FF00) | ((rev >> 8) & 0x00FF00FF);
	return (rev << 16) | (rev >> 16);
}

uint main(uint x : A) : SV_Target
{
	return bitreverse32(x);
}
