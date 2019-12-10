struct VSControlPoint
{
	float value[3] : VSValue;
};

struct HSControlPoint
{
	float value[3] : HSValue;
};

struct PatchConstant
{
	float outer[3] : SV_TessFactor;
	float inner[1] : SV_InsideTessFactor;
	float patch[2] : PATCH;
};

[domain("tri")]
[partitioning("integer")]
[outputtopology("triangle_ccw")]
[outputcontrolpoints(2)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 5> ip)
{
	HSControlPoint cp;
	cp.value[0] = ip[0].value[0] + ip[1].value[1] + ip[2].value[2];
	cp.value[1] = cp.value[0] + 1.0;
	cp.value[2] = cp.value[0] + 2.0;
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 2> op, InputPatch<VSControlPoint, 5> ip)
{
	PatchConstant pc;
	pc.inner[0] = op[0].value[1] + op[1].value[2];
	pc.outer[0] = ip[0].value[2];
	pc.outer[1] = ip[1].value[1];
	pc.outer[2] = ip[2].value[0];
	pc.patch[0] = ip[3].value[2];
	pc.patch[1] = ip[4].value[1];
	return pc;
}
