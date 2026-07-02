StructuredBuffer<uint4> RO;
StructuredBuffer<uint4> ROMask;
RWStructuredBuffer<uint4> RW;

void main(uint thr : THR)
{
	uint4 m = ROMask[thr];

	uint4 u = RO[thr];
	float3 f = float3(u.xyz);
	half2 h = half2(f.xy);

	RW[9 * thr + 0] = WaveMultiPrefixSum(u, m);
	RW[9 * thr + 1] = uint4(WaveMultiPrefixSum(f, m), 0);
	RW[9 * thr + 2] = uint4(WaveMultiPrefixSum(h, m), 0, 0);
	RW[9 * thr + 3] = WaveMultiPrefixProduct(u, m);
	RW[9 * thr + 4] = uint4(WaveMultiPrefixProduct(f, m), 0);
	RW[9 * thr + 5] = uint4(WaveMultiPrefixProduct(h, m), 0, 0);
	RW[9 * thr + 6] = WaveMultiPrefixBitOr(u, m);
	RW[9 * thr + 7] = uint4(WaveMultiPrefixBitAnd(f, m), 0);
	RW[9 * thr + 8] = uint4(WaveMultiPrefixBitXor(h, m), 0, 0);
}
