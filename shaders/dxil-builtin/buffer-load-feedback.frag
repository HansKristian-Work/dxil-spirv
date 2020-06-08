ByteAddressBuffer RawBuf : register(t1);
RWByteAddressBuffer RWRawBuf : register(u1);

StructuredBuffer<float2> StructuredBuf : register(t2);
RWStructuredBuffer<float2> RWStructuredBuf : register(u2);

struct Composite
{
	float3 a;
	float3 b;
};

StructuredBuffer<Composite> StructuredBufComposite : register(t3);
RWStructuredBuffer<Composite> RWStructuredBufComposite : register(u3);

float2 main(nointerpolation uint index : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	uint feedback;

	res += asfloat(RawBuf.Load2(index * 8, feedback));
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += asfloat(RWRawBuf.Load2(index * 8, feedback));
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += StructuredBuf.Load(index, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += RWStructuredBuf.Load(index, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	return res;
}
