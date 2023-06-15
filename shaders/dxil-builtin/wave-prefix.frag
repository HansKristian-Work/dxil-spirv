RWByteAddressBuffer BufU : register(u0);
RWByteAddressBuffer BufI : register(u1);
RWByteAddressBuffer BufF : register(u2);

static const uint STRIDE = 8;

void main(uint index : INDEX)
{
	if (index == 40)
		discard;
	uint value;

	value = WavePrefixCountBits(index < 100);
	BufU.Store(index * STRIDE, value);

	// uint
	{
		value = WavePrefixSum(index);
		BufU.Store(index * STRIDE, value);
		value = WavePrefixProduct(index);
		BufU.Store(index * STRIDE + 4, value);
	}

	// int
	{
		int iindex = index;
		value = WavePrefixSum(iindex);
		BufI.Store(index * STRIDE, value);
		value = WavePrefixProduct(iindex);
		BufI.Store(index * STRIDE + 4, value);
	}

	// float
	{
		float findex = index;
		value = WavePrefixSum(findex);
		BufF.Store(index * STRIDE, value);
		value = WavePrefixProduct(findex);
		BufF.Store(index * STRIDE + 4, value);
	}
}
