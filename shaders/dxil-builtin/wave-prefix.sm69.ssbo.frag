RWStructuredBuffer<uint2> BufU : register(u0);
RWStructuredBuffer<int3> BufI : register(u1);
RWStructuredBuffer<float4> BufF : register(u2);
RWStructuredBuffer<half4> BufH : register(u3);

static const uint STRIDE = 2;

void main(uint index : INDEX)
{
	if (index == 40)
		discard;

	// uint2
	{
		uint2 value = uint2(index, index + 1);
		BufU[index * STRIDE    ] = WavePrefixSum(value);
		BufU[index * STRIDE + 1] = WavePrefixProduct(value);
	}

	// int3
	{
		int3 value = int3(index, index + 1, index + 2);
		BufI[index * STRIDE    ] = WavePrefixSum(value);
		BufI[index * STRIDE + 1] = WavePrefixProduct(value);
	}

	// float4
	{
		float4 value = float4(index, index + 1, index + 2, index + 3);
		BufF[index * STRIDE    ] = WavePrefixSum(value);
		BufF[index * STRIDE + 1] = WavePrefixProduct(value);
	}

	// half4
	{
		half4 value = half4(index, index + 1, index + 2, index + 3);
		BufH[index * STRIDE    ] = WavePrefixSum(value);
		BufH[index * STRIDE + 1] = WavePrefixProduct(value);
	}
}
