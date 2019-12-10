struct PSOut
{
	float4 color : SV_Target;
	uint coverage : SV_Coverage;
};

PSOut main(uint coverage : SV_Coverage)
{
	PSOut pout;
	pout.color = 1.0.xxxx;
	pout.coverage = coverage & 3;
	return pout;
}
