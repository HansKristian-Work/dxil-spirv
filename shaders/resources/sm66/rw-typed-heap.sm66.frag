float3 main(uint index : INDEX, int3 uv : UV) : SV_Target
{
	RWTexture2D<float> RO = ResourceDescriptorHeap[index];
	RWBuffer<uint> WR = ResourceDescriptorHeap[index + 1];
	globallycoherent RWTexture2D<int> RW = ResourceDescriptorHeap[index + 2];
	globallycoherent RWTexture1D<uint> ATOM = ResourceDescriptorHeap[index + 3];

	float3 res;

	res.x = RO.Load(uv.xy);
	WR[uv.x] = uv.y;
	res.y = float(RW.Load(uv.yz));
	RW[uv.yz] = uv.x;

	uint o;
	InterlockedAdd(ATOM[uv.x], uv.y, o);
	res.z = float(o);

	return res;
}
