float4 main(uint ID : SV_VertexID) : SV_Position
{
	float res = float(ID);
	return res.xxxx;
}
