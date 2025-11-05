struct Output
{
	float4 pos : SV_Position;
};

Output main(uint vid : SV_ViewID)
{
	Output o;
	o.pos = float(vid).xxxx;
	return o;
}
