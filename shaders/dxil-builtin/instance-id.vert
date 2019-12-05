float4 main(uint ID : SV_InstanceID) : SV_Position
{
	float res = float(ID);
	return res.xxxx;
}
