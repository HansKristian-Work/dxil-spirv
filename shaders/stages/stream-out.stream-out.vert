struct VSOut
{
	float4 pos : SV_Position;
	float4 s0 : StreamOut0;
	float4 s1 : StreamOut1;
};

VSOut main()
{
	VSOut vout;
	vout.pos = 2.0.xxxx;
	vout.s0 = 4.0.xxxx;
	vout.s1 = 6.0.xxxx;
	return vout;
}
