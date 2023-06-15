RWByteAddressBuffer BufU : register(u0);
RWByteAddressBuffer BufI : register(u1);
RWByteAddressBuffer BufF : register(u2);

static const uint STRIDE = 28;

void main(uint index : INDEX)
{
	if (index == 40)
		discard;
	uint value;

	// uint
	{
		value = WaveActiveSum(index);
		BufU.Store(index * STRIDE, value);
		value = WaveActiveProduct(index);
		BufU.Store(index * STRIDE + 4, value);
		value = WaveActiveBitAnd(index);
		BufU.Store(index * STRIDE + 8, value);
		value = WaveActiveBitOr(index);
		BufU.Store(index * STRIDE + 12, value);
		value = WaveActiveBitXor(index);
		BufU.Store(index * STRIDE + 16, value);
		value = WaveActiveMin(index);
		BufU.Store(index * STRIDE + 20, value);
		value = WaveActiveMax(index);
		BufU.Store(index * STRIDE + 24, value);
	}

	// int
	{
		int iindex = index;
		value = WaveActiveSum(iindex);
		BufI.Store(index * STRIDE, value);
		value = WaveActiveProduct(iindex);
		BufI.Store(index * STRIDE + 4, value);
		value = WaveActiveBitAnd(uint(iindex));
		BufI.Store(index * STRIDE + 8, value);
		value = WaveActiveBitOr(uint(iindex));
		BufI.Store(index * STRIDE + 12, value);
		value = WaveActiveBitXor(uint(iindex));
		BufI.Store(index * STRIDE + 16, value);
		value = WaveActiveMin(iindex);
		BufI.Store(index * STRIDE + 20, value);
		value = WaveActiveMax(iindex);
		BufI.Store(index * STRIDE + 24, value);
	}

	// float
	{
		float findex = index;
		value = WaveActiveSum(findex);
		BufF.Store(index * STRIDE, value);
		value = WaveActiveProduct(findex);
		BufF.Store(index * STRIDE + 4, value);
		value = WaveActiveMin(findex);
		BufF.Store(index * STRIDE + 20, value);
		value = WaveActiveMax(findex);
		BufF.Store(index * STRIDE + 24, value);
	}
}
