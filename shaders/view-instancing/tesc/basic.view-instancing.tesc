struct VSControlPoint
{
	float value : VSValue;
};

struct HSControlPoint
{
	float value : HSValue;
	uint layer : SV_RenderTargetArrayIndex;
	uint vp : SV_ViewportArrayIndex;
};

struct PatchConstant
{
	float outer[4] : SV_TessFactor;
	float inner[2] : SV_InsideTessFactor;
};

[domain("quad")]
[partitioning("integer")]
[outputtopology("triangle_cw")]
[outputcontrolpoints(4)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 1> ip, uint control : SV_OutputControlPointID, uint vid : SV_ViewID)
{
	HSControlPoint cp;
	cp.value = float(control + vid);
	cp.layer = vid;
	cp.vp = vid;
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 4> op, InputPatch<VSControlPoint, 1> ip)
{
	PatchConstant pc;
	pc.inner[0] = 1.0;
	pc.inner[1] = 1.0;
	pc.outer[0] = 1.0;
	pc.outer[1] = 1.0;
	pc.outer[2] = 1.0;
	pc.outer[3] = 1.0;
	return pc;
}
