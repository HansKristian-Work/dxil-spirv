RWBuffer<float2> RWBuf : register(u0);
RWByteAddressBuffer RWRawBuf : register(u1);
RWStructuredBuffer<float2> RWStructuredBuf : register(u2);

struct Composite
{
	float3 a;
	float2 b;
};
RWStructuredBuffer<Composite> RWStructuredBufComposite : register(u3);

void main(nointerpolation uint index : INDEX, nointerpolation float2 data : DATA)
{
	RWBuf[index] = data;
	RWRawBuf.Store2(8 * index, asuint(data));
	RWStructuredBuf[index] = data;
	RWStructuredBufComposite[index].b = data;
}
