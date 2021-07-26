float4 main(float4 pos : POSITION, uint view : SV_ViewID) : SV_Target
{
	return pos + float(view);
}
