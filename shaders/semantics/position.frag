float main(float4 pos : SV_Position, nointerpolation uint index : INDEX) : SV_Target
{
	return pos[index];
}
