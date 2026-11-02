globallycoherent RWBuffer<uint> Cnt : register(u1);
globallycoherent RWBuffer<uint> Data : register(u2);

float main(uint2 i : I) : SV_Target
{
	uint o;
	InterlockedAdd(Cnt[0], 1, o);
	DeviceMemoryBarrier();
	Data[2 * o + 0] = i.x;
	DeviceMemoryBarrier();
	Data[2 * o + 1] = i.y;

	InterlockedExchange(Data[2 * o - 1], 0, o);
	DeviceMemoryBarrier();
	if (o == 10)
	{
		InterlockedExchange(Data[2 * o - 2], 0, o);
		return float(o);
	}

	return 0.0;
}
