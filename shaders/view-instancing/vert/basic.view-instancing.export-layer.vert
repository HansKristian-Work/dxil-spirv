struct Output
{
	float4 pos : SV_Position;
	uint layer : SV_RenderTargetArrayIndex;
};

Output main(uint vid : SV_ViewID, uint layer : LAYER)
{
	Output o;
	o.pos = float(vid).xxxx;
	o.layer = layer;
	return o;
}
