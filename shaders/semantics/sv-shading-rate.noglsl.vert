struct Outs
{
	float4 pos : SV_Position;
	uint rate : SV_ShadingRate;
};

Outs main()
{
	Outs o;
	o.pos = 1.0.xxxx;
	o.rate = 0xa;
	return o;
}
