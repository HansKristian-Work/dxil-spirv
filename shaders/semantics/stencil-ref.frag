struct Out
{
	float4 v : SV_Target0;
	uint s : SV_StencilRef;
};

Out main(float v : V)
{
	Out o;
	o.v = v.xxxx;
	o.s = uint(v);
	return o;
}
