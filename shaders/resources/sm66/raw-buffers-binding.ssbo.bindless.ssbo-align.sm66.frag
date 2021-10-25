StructuredBuffer<float> RO1 : register(t0);
StructuredBuffer<half2> RO2 : register(t1);

RWStructuredBuffer<float> RW1 : register(u2);
RWStructuredBuffer<half2> RW2 : register(u3);

ByteAddressBuffer BAB1 : register(t4);
RWByteAddressBuffer BAB2 : register(u5);

float4 main(uint index : INDEX, int4 uv : UV) : SV_Target
{
	float4 res = 0.0.xxxx;
	res.x += RO1[uv.x];
	res.yz += float2(RO2[uv.y]);
	res.z += RW1[uv.z];
	res.wx += float2(RW2[uv.w]);

	res += BAB1.Load<half4>(8);
	res += BAB1.Load<float4>(16);
	res += BAB2.Load<half4>(8);
	BAB2.Store<float4>(16, res);

	return res;
}
