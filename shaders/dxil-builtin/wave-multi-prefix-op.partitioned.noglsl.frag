StructuredBuffer<uint> RO;
StructuredBuffer<uint4> ROMask;
RWStructuredBuffer<uint> RW;

void main(uint thr : THR)
{
	RW[7 * thr + 0] = WaveMultiPrefixSum(RO[thr], ROMask[thr]);
	RW[7 * thr + 1] = WaveMultiPrefixSum(asfloat(RO[thr]), ROMask[thr]);
	RW[7 * thr + 2] = WaveMultiPrefixProduct(RO[thr], ROMask[thr]);
	RW[7 * thr + 3] = WaveMultiPrefixProduct(asfloat(RO[thr]), ROMask[thr]);
	RW[7 * thr + 4] = WaveMultiPrefixBitOr(RO[thr], ROMask[thr]);
	RW[7 * thr + 5] = WaveMultiPrefixBitAnd(asfloat(RO[thr]), ROMask[thr]);
	RW[7 * thr + 6] = WaveMultiPrefixBitXor(asfloat(RO[thr]), ROMask[thr]);
}
