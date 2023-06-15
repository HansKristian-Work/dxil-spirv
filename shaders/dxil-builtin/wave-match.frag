StructuredBuffer<uint> RO;
RWStructuredBuffer<uint4> RW;

void main(uint thr : THR)
{
	if (thr == 40)
		discard;
	RW[thr] =
		WaveMatch(RO[thr]) |
		WaveMatch(asfloat(RO[thr])) |
		WaveMatch(bool(RO[thr] != 20));
}
