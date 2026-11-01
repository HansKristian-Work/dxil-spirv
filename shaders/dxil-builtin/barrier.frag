RWBuffer<uint> U : register(u1);

float4 main(uint i : I) : SV_Target
{
	U[i] = 1;
	DeviceMemoryBarrier();
	return U[i + 1];
}
