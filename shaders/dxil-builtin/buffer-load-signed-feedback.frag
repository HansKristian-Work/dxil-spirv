Buffer<int2> TypedBuf : register(t0);
RWBuffer<int2> RWTypedBuf : register(u0);

int2 main(nointerpolation uint index : TEXCOORD) : SV_Target
{
	int2 res = int2(0, 0);
	uint feedback;
	res += TypedBuf.Load(index, feedback).xy;
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += RWTypedBuf.Load(index, feedback).xy;
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	return res;
}
