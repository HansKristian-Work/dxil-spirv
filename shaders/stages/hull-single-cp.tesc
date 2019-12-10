struct VSControlPoint
{
	float value : VSValue;
};

struct HSControlPoint
{
	float value : HSValue;
};

struct PatchConstant
{
	float outer[3] : SV_TessFactor;
	float inner[1] : SV_InsideTessFactor;
	float patch : PATCH;
};

[domain("tri")]
[partitioning("integer")]
[outputtopology("triangle_ccw")]
[outputcontrolpoints(1)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 5> ip)
{
	HSControlPoint cp;
	cp.value = ip[0].value + ip[1].value + ip[2].value;
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 1> op, InputPatch<VSControlPoint, 5> ip)
{
	PatchConstant pc;
	pc.inner[0] = op[0].value;
	pc.outer[0] = ip[0].value;
	pc.outer[1] = ip[1].value;
	pc.outer[2] = ip[2].value;
	pc.patch = ip[3].value;
	return pc;
}
