float main(float v : V) : SV_Target
{
	uint q = f32tof16(v);
	precise float ret = f16tof32(q);

	return ret;
}
