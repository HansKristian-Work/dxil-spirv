StructuredBuffer<uint4> RO;
RWStructuredBuffer<uint4> RW;

void main(uint thr : THR)
{
	if (thr == 40)
		discard;
	RW[thr] =
		WaveMatch(RO[thr]) |
		WaveMatch(float3(RO[thr].xyz));
}
