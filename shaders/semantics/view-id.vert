float4 main(float4 pos : POSITION, uint view : SV_ViewID) : SV_Position
{
	return pos + float(view);
}
