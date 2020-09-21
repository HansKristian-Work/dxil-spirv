Buffer<float2> TypedBuf : register(t0);
RWBuffer<float2> RWTypedBuf : register(u0);

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

	res += TypedBuf.Load(index).xy;
	res += RWTypedBuf.Load(index).xy;
	res += asfloat(RawBuf.Load2(index * 8));
	res += asfloat(RWRawBuf.Load2(index * 8));
	res += StructuredBuf[index];
	res += RWStructuredBuf[index];
	res += StructuredBufComposite[index].a.yz;
	res += RWStructuredBufComposite[index].b.yz;
	return res;
}
