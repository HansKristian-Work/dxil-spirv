uint4 main(nointerpolation uint index : INDEX) : SV_Target
{
	if (index == 40)
		discard;
	uint4 ballot = WaveActiveBallot(index < 100);
	return ballot;
}
