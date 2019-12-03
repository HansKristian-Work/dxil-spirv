Buffer<int2> TypedBuf : register(t0);
RWBuffer<int2> RWTypedBuf : register(u0);

int2 main(nointerpolation uint index : TEXCOORD) : SV_Target
{
	int2 res = int2(0, 0);
	res += TypedBuf.Load(index).xy;
	res += RWTypedBuf.Load(index).xy;
	return res;
}
