float3 main(uint index : INDEX, int3 uv : UV) : SV_Target
{
	ByteAddressBuffer RO = ResourceDescriptorHeap[index];
	globallycoherent RWByteAddressBuffer WR = ResourceDescriptorHeap[index + 1];

	float3 res = asfloat(RO.Load3(uv.x));
	WR.Store3(uv.y, asuint(res));

	return res;
}
