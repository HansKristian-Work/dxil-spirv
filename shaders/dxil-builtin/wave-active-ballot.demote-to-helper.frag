uint4 main(nointerpolation uint index : INDEX) : SV_Target
{
	uint4 ballot = WaveActiveBallot(index < 100);
	return ballot;
}
