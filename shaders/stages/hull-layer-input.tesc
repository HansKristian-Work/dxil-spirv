struct VSControlPoint
{
	float4 pos : SV_Position;
	uint layer : SV_RenderTargetArrayIndex;
	uint vp : SV_ViewportArrayIndex;
};

struct HSControlPoint
{
	float4 pos : SV_Position;
	uint layer : LAYER;
	uint vp : VIEWPORT;
};

struct PatchConstant
{
	float outer[3] : SV_TessFactor;
	float inner : SV_InsideTessFactor;
};

PatchConstant main_patch(OutputPatch<HSControlPoint, 3> op, InputPatch<VSControlPoint, 3> ip)
{
	PatchConstant o;
	o.outer[0] = 1.0;
	o.outer[1] = 1.0;
	o.outer[2] = 1.0;
	o.inner = 1.0;
	return o;
}

[domain("tri")]
[partitioning("integer")]
[outputtopology("triangle_cw")]
[outputcontrolpoints(3)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 3> ip, uint i : SV_OutputControlPointID)
{
	HSControlPoint o;
	o.pos = ip[i].pos;
	o.layer = ip[i].layer;
	o.vp = ip[i].vp;
	return o;
}
