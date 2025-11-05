struct Output
{
	float4 pos : SV_Position;
	uint vp : SV_ViewportArrayIndex;
};

Output main(uint vid : SV_ViewID, uint vp : VP)
{
	Output o;
	o.pos = float(vid).xxxx;
	o.vp = vp;
	return o;
}
