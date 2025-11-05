struct Output
{
	float4 pos : SV_Position;
	uint layer : SV_RenderTargetArrayIndex;
	uint vp : SV_ViewportArrayIndex;
};

Output main(uint vid : SV_ViewID, uint layer : LAYER, uint vp : VP)
{
	Output o;
	o.pos = float(vid).xxxx;
	o.layer = layer;
	o.vp = vp;
	return o;
}
