StructuredBuffer<uint> RO;
StructuredBuffer<uint4> ROMask;
RWStructuredBuffer<uint> RW;

void main(uint thr : THR)
{
	if (thr == 40)
		discard;
	RW[thr] = WaveMultiPrefixCountBits(RO[thr] != 10, ROMask[thr]);
}
