RWStructuredBuffer<uint2> BufU : register(u0);
RWStructuredBuffer<int3> BufI : register(u1);
RWStructuredBuffer<float4> BufF : register(u2);
RWStructuredBuffer<half4> BufH : register(u3);

static const uint STRIDE = 7;

void main(uint index : INDEX)
{
	if (index == 40)
		discard;

	// uint2
	{
		uint2 value = uint2(index, index + 1);
		BufU[index * STRIDE    ] = WaveActiveSum(value);
		BufU[index * STRIDE + 1] = WaveActiveProduct(value);
		BufU[index * STRIDE + 2] = WaveActiveBitAnd(value);
		BufU[index * STRIDE + 3] = WaveActiveBitOr(value);
		BufU[index * STRIDE + 4] = WaveActiveBitXor(value);
		BufU[index * STRIDE + 5] = WaveActiveMin(value);
		BufU[index * STRIDE + 6] = WaveActiveMax(value);
	}

	// int3
	{
		int3 value = int3(index, index + 1, index + 2);
		BufI[index * STRIDE    ] = WaveActiveSum(value);
		BufI[index * STRIDE + 1] = WaveActiveProduct(value);
		BufI[index * STRIDE + 2] = WaveActiveBitAnd(uint3(value));
		BufI[index * STRIDE + 3] = WaveActiveBitOr(uint3(value));
		BufI[index * STRIDE + 4] = WaveActiveBitXor(uint3(value));
		BufI[index * STRIDE + 5] = WaveActiveMin(value);
		BufI[index * STRIDE + 6] = WaveActiveMax(value);
	}

	// float4
	{
		float4 value = float4(index, index + 1, index + 2, index + 3);
		BufF[index * STRIDE    ] =  WaveActiveSum(value);
		BufF[index * STRIDE + 1] =  WaveActiveProduct(value);
		BufF[index * STRIDE + 2] =  WaveActiveMin(value);
		BufF[index * STRIDE + 3] =  WaveActiveMax(value);
	}

	// half4
	{
		half4 value = half4(index, index + 1, index + 2, index + 3);
		BufH[index * STRIDE    ] = WaveActiveSum(value);
		BufH[index * STRIDE + 1] = WaveActiveProduct(value);
		BufH[index * STRIDE + 2] = WaveActiveMin(value);
		BufH[index * STRIDE + 3] = WaveActiveMax(value);
	}
}
