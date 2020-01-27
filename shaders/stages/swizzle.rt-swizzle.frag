struct PixelOut
{
	float4 a : SV_Target0;
	float4 b : SV_Target1;
};

PixelOut main(float4 v : TEXCOORD)
{
	PixelOut pout;
	pout.a = v;
	pout.b = v;
	return pout;
}
